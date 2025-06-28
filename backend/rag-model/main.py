import os
from typing import List
from pymongo import MongoClient
from llama_index.core import (
    VectorStoreIndex,
    Document,
    ServiceContext,
    PromptTemplate,
)
from llama_index.core.node_parser import SentenceSplitter
from llama_index.vector_stores.mongodb import MongoDBAtlasVectorSearch
from llama_index.llms.openai import OpenAI
from llama_index.embeddings.huggingface import HuggingFaceEmbedding
import fitz  # PyMuPDF

# ------------------ Configuration ------------------

PDF_DIR = "./pdfs"
MONGO_URI = "mongodb+srv://<username>:<password>@<cluster>.mongodb.net/?retryWrites=true&w=majority"
DB_NAME = "chatbot_db"
COLLECTION_NAME = "embedding_vectors"

LLM_MODEL = "Yi-34B-Chat"
LLM_BASE_URL = "http://localhost:8000/v1"  # vLLM or OpenRouter-style server
EMBED_MODEL = "BAAI/bge-large-en-v1.5"


# ------------------ Prompt Templates ------------------

USER_TEMPLATE = PromptTemplate(
    "### Question:\n{query_str}\n\n"
)

SYSTEM_TEMPLATE = PromptTemplate(
    "You are a helpful assistant specialized in answering questions from a document knowledge base.\n"
    "Answer in **markdown**, use bullet points, bold headers, and code blocks when needed.\n"
    "Only use facts from the context below.\n\n"
    "### Context:\n{context_str}\n\n"
    "### Instructions:\nRespond clearly and concisely."
)

# Optional markdown-compatible response post-template
RESPONSE_WRAPPER = lambda text: f"""### 🤖 Answer:\n\n{text.strip()}"""

# ------------------ Load PDF Documents with Metadata ------------------

def load_documents(pdf_dir: str) -> List[Document]:
    documents = []
    for filename in os.listdir(pdf_dir):
        if filename.endswith(".pdf"):
            path = os.path.join(pdf_dir, filename)
            with fitz.open(path) as doc:
                text = "\n".join(page.get_text() for page in doc)
            metadata = {"filename": filename, "source": path}
            documents.append(Document(text=text, metadata=metadata))
    return documents


# ------------------ Vector Store Setup ------------------

def get_vector_store():
    client = MongoClient(MONGO_URI)
    return MongoDBAtlasVectorSearch(
        mongo_client=client,
        db_name=DB_NAME,
        collection_name=COLLECTION_NAME,
        index_name="default_index"
    )


# ------------------ Build LLM and Service Context ------------------

def get_service_context():
    llm = OpenAI(
        model=LLM_MODEL,
        api_key="EMPTY",  # Not used in vLLM
        base_url=LLM_BASE_URL,
        is_chat_model=True,
        system_prompt=SYSTEM_TEMPLATE,
        query_wrapper_prompt=USER_TEMPLATE,
    )
    embed_model = HuggingFaceEmbedding(model_name=EMBED_MODEL)
    return ServiceContext.from_defaults(llm=llm, embed_model=embed_model)


# ------------------ Build Vector Index ------------------

def build_index(docs: List[Document], refresh: bool = True):
    splitter = SentenceSplitter(chunk_size=512, chunk_overlap=50)
    vector_store = get_vector_store()

    if refresh:
        print("🧼 Clearing existing vectors...")
        vector_store._collection.delete_many({})

    nodes = []
    for doc in docs:
        chunks = splitter.get_nodes_from_documents([doc])
        for node in chunks:
            node.metadata = doc.metadata
        nodes.extend(chunks)

    service_context = get_service_context()
    index = VectorStoreIndex(nodes, service_context=service_context, vector_store=vector_store)
    return index


# ------------------ Query Function ------------------

def query_index(index: VectorStoreIndex, query: str) -> str:
    query_engine = index.as_query_engine(similarity_top_k=5)
    raw_response = query_engine.query(query)
    return RESPONSE_WRAPPER(raw_response.response)


# ------------------ Main Workflow ------------------

def main():
    print("📄 Loading documents...")
    documents = load_documents(PDF_DIR)

    print("🧠 Building index with embeddings and metadata...")
    index = build_index(documents)

    print("✅ Ready to chat! Type 'exit' to quit.\n")
    while True:
        user_input = input("You 🧑‍💻: ")
        if user_input.lower() == "exit":
            break
        response = query_index(index, user_input)
        print(response)


if __name__ == "__main__":
    main()
