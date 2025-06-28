import os
import fitz  # PyMuPDF
from typing import List, Optional
from fastapi import FastAPI, File, UploadFile, Form, Query
from pydantic import BaseModel
from fastapi.responses import JSONResponse
from pymongo import MongoClient

from llama_index.core import (
    VectorStoreIndex, Document, ServiceContext, PromptTemplate
)
from llama_index.core.node_parser import HierarchicalNodeParser
from llama_index.vector_stores.mongodb import MongoDBAtlasVectorSearch
from llama_index.llms.openai import OpenAI
from llama_index.embeddings.huggingface import HuggingFaceEmbedding
from llama_index.memory import ChatMemoryBuffer

# ------------------ Config ------------------

PDF_DIR = "./pdfs"
os.makedirs(PDF_DIR, exist_ok=True)

MONGO_URI = "mongodb+srv://<username>:<password>@<cluster>.mongodb.net/?retryWrites=true&w=majority"
DB_NAME = "chatbot_db"
COLLECTION_NAME = "embedding_vectors"
LLM_MODEL = "Yi-34B-Chat"
LLM_BASE_URL = "http://localhost:8000/v1"
EMBED_MODEL = "BAAI/bge-large-en-v1.5"

# ------------------ FastAPI Setup ------------------

app = FastAPI(title="Enhanced Chatbot API with Metadata + Memory")

# ------------------ Prompt Templates ------------------

USER_TEMPLATE = PromptTemplate(
    "### Question:\n{query_str}\n\n"
)

SYSTEM_TEMPLATE = PromptTemplate(
    "You are a helpful assistant answering questions from a document knowledge base.\n"
    "Use **markdown** in your responses with code blocks, bullet points, and bold sections.\n\n"
    "### Context:\n{context_str}\n\n"
    "### Instructions:\nAnswer clearly and concisely using only the provided information."
)

RESPONSE_WRAPPER = lambda text: f"### 🤖 Answer:\n\n{text.strip()}"

# ------------------ Core Components ------------------

def get_vector_store():
    client = MongoClient(MONGO_URI)
    return MongoDBAtlasVectorSearch(
        mongo_client=client,
        db_name=DB_NAME,
        collection_name=COLLECTION_NAME,
        index_name="default_index"
    )

def get_service_context():
    llm = OpenAI(
        model=LLM_MODEL,
        base_url=LLM_BASE_URL,
        api_key="EMPTY",
        is_chat_model=True,
        system_prompt=SYSTEM_TEMPLATE,
        query_wrapper_prompt=USER_TEMPLATE
    )
    embed_model = HuggingFaceEmbedding(model_name=EMBED_MODEL)
    return ServiceContext.from_defaults(llm=llm, embed_model=embed_model)

def load_documents() -> List[Document]:
    documents = []
    for filename in os.listdir(PDF_DIR):
        if filename.endswith(".pdf"):
            path = os.path.join(PDF_DIR, filename)
            with fitz.open(path) as doc:
                text = "\n".join(page.get_text() for page in doc)
            metadata = {"filename": filename, "source": path}
            documents.append(Document(text=text, metadata=metadata))
    return documents

def build_index(refresh: bool = False):
    # Use HierarchicalNodeParser for advanced chunking
    documents = load_documents()
    parser = HierarchicalNodeParser.from_defaults(chunk_sizes=[1024, 512, 256])
    nodes = parser.get_nodes_from_documents(documents)

    # Assign document metadata to each node
    for node in nodes:
        if hasattr(node, 'metadata') and node.metadata is None:
            node.metadata = {}

    vector_store = get_vector_store()
    if refresh:
        vector_store._collection.delete_many({})
    service_context = get_service_context()
    return VectorStoreIndex(nodes, service_context=service_context, vector_store=vector_store)

def load_index():
    vector_store = get_vector_store()
    return VectorStoreIndex.from_vector_store(vector_store)

# ------------------ Chat Memory ------------------

memory = ChatMemoryBuffer.from_defaults(token_limit=3000)

# ------------------ API Models ------------------

class QueryRequest(BaseModel):
    question: str
    filename_filter: Optional[str] = None  # filter by filename for metadata filtering
    chat_id: Optional[str] = None  # chat session id for memory tracking

# ------------------ API Endpoints ------------------

@app.get("/status")
def health_check():
    return {"status": "🟢 ready", "model": LLM_MODEL}

@app.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):
    filepath = os.path.join(PDF_DIR, file.filename)
    with open(filepath, "wb") as f:
        f.write(await file.read())
    build_index(refresh=True)
    return {"message": f"File '{file.filename}' uploaded and index refreshed."}

@app.post("/query")
def query_docs(query_req: QueryRequest):
    index = load_index()
    filters = {}
    if query_req.filename_filter:
        filters["filename"] = query_req.filename_filter

    query_engine = index.as_query_engine(
        similarity_top_k=5,
        filters=filters,
        chat_mode="context",
        memory=memory
    )
    result = query_engine.query(query_req.question)

    # Store conversation in memory under chat_id if provided
    if query_req.chat_id:
        memory.update_memory(chat_id=query_req.chat_id, text=query_req.question)
        memory.update_memory(chat_id=query_req.chat_id, text=result.response)

    markdown_response = RESPONSE_WRAPPER(result.response)
    return JSONResponse(content={"answer_markdown": markdown_response, "raw_answer": result.response})

