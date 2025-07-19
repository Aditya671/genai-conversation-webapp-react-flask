import os
import json
from typing import Optional, List, Union
from llama_index.core import (
    SimpleDirectoryReader, VectorStoreIndex,
    StorageContext, load_index_from_storage, Settings
)
from llama_index.core.vector_stores.simple import SimpleVectorStore
from llama_index.core.chat_engine import CondensePlusContextChatEngine
from llama_index.core.memory import ChatMemoryBuffer
from llama_index.core.vector_stores.types import VectorStoreQueryMode
from llama_index.core import Settings
import tracemalloc
from datetime import datetime, timedelta

from backend.convo_llm.load_llm.index import load_embed, load_llm
from backend.convo_llm.ai_models_list import AiModel, AiModelHosted, resolve_model
from backend.convo_llm.prompt import CITATION_QA_TEMPLATE_CONCISE, CITATION_QA_TEMPLATE_DETAILED
from backend.convo_llm.utility import compute_file_hash

class LocalOnlyFileIndexer:
    """
    Indexes uploaded files by storing embeddings and tokenization data locally in user_uploads/index_data.
    No data is uploaded to Azure. Supports semantic search and ChatGPT-style synthesis using OpenAI LLM.
    """
    def __init__(
        self,
        root_dir: str = "user_uploads",
        index_data_dir: Optional[str] = None,
        index_name: str = "default",
        model: Optional[Union[AiModel, AiModelHosted]] = None
        ):
        self.root_dir = root_dir
        self.index_data_dir = index_data_dir or os.path.join(self.root_dir, "index_data")
        self.index_name = index_name
        self.model = model
        os.makedirs(self.index_data_dir, exist_ok=True)
        self.upload_files_dir = os.path.join(self.root_dir, "files")
        os.makedirs(self.upload_files_dir, exist_ok=True)
        
        self.embed_model = load_embed(index_name=index_name, model=self.model)
        Settings.embed_model = self.embed_model
        Settings.llm = self._init_llm()
        tracemalloc.start()

    def _init_llm(self):
        llm_model = resolve_model(self.model)
        return load_llm(model=llm_model, index_name=self.index_name)

    
    def _should_reindex(self, file_path: str, index_name: str, reindex_after_days: int = 30) -> bool:
        metadata_path = os.path.join(self.index_data_dir, index_name, "index_metadata.json")
        if not os.path.exists(metadata_path):
            return True  # No metadata? Reindex

        with open(metadata_path, "r") as f:
            metadata = json.load(f)

        file_name = os.path.basename(file_path)
        file_meta = metadata.get(file_name)
        if not file_meta:
            return True  # File not indexed yet

        # Compare hash
        current_hash = compute_file_hash(file_path)
        if file_meta["hash"] != current_hash:
            return True  # File changed

        # Check if one month has passed
        last_indexed = datetime.fromisoformat(file_meta["indexed_at"])
        if datetime.now() - last_indexed > timedelta(days=reindex_after_days):
            return True

        return False  # Skip reindexing


    def _update_index_metadata(self, file_paths: List[str], index_name: str):
        metadata_path = os.path.join(self.index_data_dir, index_name, "index_metadata.json")
        metadata = {}
        if os.path.exists(metadata_path):
            with open(metadata_path, "r") as f:
                metadata = json.load(f)

        for file_path in file_paths:
            file_name = os.path.basename(file_path)
            metadata[file_name] = {
                "hash": compute_file_hash(file_path),
                "indexed_at": datetime.now().isoformat()
            }

        with open(metadata_path, "w") as f:
            json.dump(metadata, f, indent=2)


    def _get_storage_context(self, load_existing = False) -> StorageContext:
        index_dir = os.path.join(self.index_data_dir, self.index_name)
        os.makedirs(index_dir, exist_ok=True)
        """Creates a StorageContext with SimpleVectorStore."""
        vector_store = SimpleVectorStore(persist_dir=index_dir, index_dir=index_dir)
        if load_existing:
            return StorageContext.from_defaults(persist_dir=index_dir)
        else:
            return StorageContext.from_defaults(vector_store=vector_store)


    def _dump_debug_files(self, documents, storage_context, index_dir):
        """Optional debug info: save doc and embedding metadata."""
        docstore_path = os.path.join(index_dir, "docstore.json")
        docstore_data = {
            getattr(doc, 'doc_id', None) or getattr(doc, 'id_', None): {
                "text": doc.text,
                "metadata": doc.metadata
            }
            for doc in documents
        }
        with open(docstore_path, "w", encoding="utf-8") as f:
            json.dump(docstore_data, f, indent=2)

        # Index Store
        index_store_dict = storage_context.index_store.to_dict()
        with open(os.path.join(index_dir, "index_store.json"), "w", encoding="utf-8") as f:
            json.dump(index_store_dict, f, indent=2)

        # Vector store internals - SimpleVectorStore
        vector_store_dict = storage_context.vector_store.to_dict()
        with open(os.path.join(index_dir, "default__vector_store.json"), "w", encoding="utf-8") as f:
            json.dump(vector_store_dict, f, indent=2)
        # Vector store internals - ImageVectorStore
        image_vector_store_dict = storage_context.vector_stores['image'].to_dict()
        with open(os.path.join(index_dir, "image__vector_store.json"), "w", encoding="utf-8") as f:
            json.dump(image_vector_store_dict, f, indent=2)
        
        # Graph Store
        graph_store_dict = storage_context.graph_store.to_dict()
        with open(os.path.join(index_dir, "graph_store.json"), "w", encoding="utf-8") as f:
            json.dump(graph_store_dict, f, indent=2)
        return True

    
    def _index_documents_from_files(self, file_paths: List[str], index_name: Optional[str]) -> str:
        index_name = index_name or self.index_name
        index_dir = os.path.join(self.index_data_dir, index_name)
        os.makedirs(index_dir, exist_ok=True)

        files_to_index = [fp for fp in file_paths if self._should_reindex(fp, index_name)]
        if not files_to_index:
            print("[INFO] All files are up-to-date. Skipping reindexing.")
            return index_dir
        
        required_exts = list(set(os.path.splitext(f)[1] for f in files_to_index))
        # reader = SimpleDirectoryReader(input_files=files_to_index, recursive=False, required_exts=required_exts)
        # documents = reader.load_data(show_progress=True)
        
        # required_exts = list(set(os.path.splitext(f)[1] for f in file_paths))
        reader = SimpleDirectoryReader(input_files=file_paths, recursive=False, required_exts=required_exts)
        documents = reader.load_data(show_progress=True)

        storage_context = self._get_storage_context()
        index = VectorStoreIndex.from_documents(documents, storage_context=storage_context)

        try:
            index.storage_context.vector_store.persist(fs=index_dir, persist_path=index_dir)
        except Exception as e:
            print(f"[WARN] Persisting with vector_store failed: {e}. Falling back to context persist.")
            index.storage_context.persist(persist_dir=index_dir)
            print(f"[DONE] Persisting with context completed")
        else:
            self._dump_debug_files(documents, storage_context, index_dir)

        self._update_index_metadata(files_to_index, index_name)
        print(f"[INFO] Index created at: {index_dir}")
        return index_dir


    async def index_uploaded_file(self, uploaded_file, index_name: Optional[str] = None) -> str:
        """
        Saves and indexes an uploaded file to local storage.
        """
        file_path = os.path.join(self.upload_files_dir, uploaded_file.filename)
        
        # file_path = os.path.join(self.root_dir, uploaded_file.filename)
        uploaded_file.file.seek(0)
        read_obj = await uploaded_file.read()
                
        with open(file_path, "wb") as f:
            f.write(read_obj)

        return self._index_documents_from_files([file_path], index_name)


    async def index_uploaded_files(
        self,
        input_dir: Optional[str] = None,
        file_list: Optional[List[str]] = None,
        num_files_limit: Optional[int] = None,
        index_name: Optional[str] = None
    ) -> str:
        """
        Index files from either a list of uploaded file objects or a directory path.

        Args:
            input_dir (str): Path to directory containing files.
            file_list (List): List of uploaded file objects (with .name and .read()).
            num_files_limit (int): Max number of files to index.
            index_name (str): Optional custom index name.

        Returns:
            str: Path to the index directory.
        """
        file_paths = []
        # file_path = os.path.join(upload_dir, uploaded_file.filename)
        
        if file_list:
            for uploaded_file in file_list[:num_files_limit] if num_files_limit else file_list:
                uploaded_file.file.seek(0)
                read_obj = await uploaded_file.read()
                saved_path = os.path.join(self.upload_files_dir, uploaded_file.filename)
                with open(saved_path, "wb") as f:
                    f.write(read_obj)
                file_paths.append(saved_path)

        elif input_dir:
            all_files = [
                f for f in os.listdir(input_dir)
                if os.path.isfile(os.path.join(input_dir, f))
            ]
            if num_files_limit:
                all_files = all_files[:num_files_limit]
            file_paths = [os.path.join(input_dir, fname) for fname in all_files]

        else:
            raise ValueError("Either 'file_list' or 'input_dir' must be provided.")

        if not file_paths:
            raise ValueError("No valid files found to index.")

        return self._index_documents_from_files(file_paths, index_name)

    
    def create_local_citation_chat_engine(
        self,
        top_k: int = 5,
        mode: str = "concise",
        streaming: bool = False,
        model: AiModel = AiModel.MISTRAL_7B,
        temperature: float = 0.1
    ):
        """
        Create a local citation-style chat engine using a persisted index for streaming Q&A.
        Returns a CitationChatEngine instance (stream_chat() supported).
        """
        llm = load_llm(model=model,\
            index_name=self.index_name, temperature=temperature)
        Settings.llm = llm

        # Path to index
        index_dir = os.path.join(self.index_data_dir, self.index_name)
        index_file = os.path.join(index_dir, "index_store.json")
        if not os.path.exists(index_file):
            raise FileNotFoundError(f"Index not found at {index_file}. Has the file been indexed?")

        # Load persisted index
        storage_context = self._get_storage_context(load_existing=True)
        index = load_index_from_storage(storage_context=storage_context)
        # index = VectorStoreIndex.from_vector_store(storage_context.vector_stores)
        # Create retriever from index
        retriever = index.as_retriever(
            similarity_top_k=top_k,
            vector_store_query_mode=VectorStoreQueryMode.DEFAULT,
        )

        # Select context template
        if mode == "concise":
            context_prompt = CITATION_QA_TEMPLATE_CONCISE
        elif mode == "detailed":
            context_prompt = CITATION_QA_TEMPLATE_DETAILED
        else:
            raise ValueError(f"Invalid mode: {mode}. Use 'concise' or 'detailed'.")

        # Memory buffer for keeping history within token window
        memory = ChatMemoryBuffer.from_defaults(
            token_limit=llm.metadata.context_window - 256
        )

        # Create and return streaming-compatible citation engine
        chat_engine = CondensePlusContextChatEngine(
            retriever=retriever,
            llm=llm,
            memory=memory,
            context_prompt=context_prompt,
            verbose=streaming,
        )
        return chat_engine
    
    
# if st.session_state.search_uploaded_file:
    # response = st.session_state.query_uploaded_file.create_local_citation_chat_engine(
    # mode=st.session_state.aiim_response_mode,
    # model=st.session_state.selected_model,
    # temperature=st.session_state.temperature,
    # top_k=st.session_state.top_k                    
    # ).stream_chat(prompt.text)
