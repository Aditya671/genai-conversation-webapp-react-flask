import os
import fitz  # PyMuPDF
from typing import List, Optional, Generator
from fastapi import FastAPI, Query
from fastapi.responses import StreamingResponse, JSONResponse
from pydantic import BaseModel
from pymongo import MongoClient

from llama_index.core import (
    VectorStoreIndex, Document, ServiceContext, PromptTemplate
)
from llama_index.core.node_parser import SentenceSplitter
from llama_index.vector_stores.mongodb import MongoDBAtlasVectorSearch
from llama_index.llms.openai import OpenAI
from llama_index.embeddings.huggingface import HuggingFaceEmbedding
from llama_index.memory import ChatMemoryBuffer

PDF_DIR = "./pdfs"
os.makedirs(PDF_DIR, exist_ok=True)

MONGO_URI = "mongodb+srv://<username>:<password>@<cluster>.mongodb.net/?retryWrites=true&w=majority"
DB_NAME = "chatbot_db"
COLLECTION_NAME = "embedding_vectors"
LLM_MODEL = "Yi-34B-Chat"
LLM_BASE_URL = "http://localhost:8000/v1"
EMBED_MODEL = "BAAI/bge-large-en-v1.5"

app = FastAPI(title="Chatbot API - Streaming & Memory")

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

memory = ChatMemoryBuffer.from_defaults(token_limit=3000)

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
        query_wrapper_prompt=USER_TEMPLATE,
        streaming=True,  # Enable streaming from LLM
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

def build_index():
    documents = load_documents()
    splitter = SentenceSplitter(chunk_size=512, chunk_overlap=50)
    nodes = []
    for doc in documents:
        for node in splitter.get_nodes_from_documents([doc]):
            node.metadata = doc.metadata
            nodes.append(node)
    vector_store = get_vector_store()
    vector_store._collection.delete_many({})
    service_context = get_service_context()
    return VectorStoreIndex(nodes, service_context=service_context, vector_store=vector_store)

index = build_index()

class QueryRequest(BaseModel):
    question: str
    filename_filter: Optional[str] = None
    chat_id: Optional[str] = None

def stream_response_generator(text_generator):
    """Yield chunks from generator for streaming"""
    for chunk in text_generator:
        yield chunk

@app.get("/status")
def health_check():
    return {"status": "🟢 ready", "model": LLM_MODEL}

@app.post("/query")
def query_docs(query_req: QueryRequest):
    filters = {}
    if query_req.filename_filter:
        filters["filename"] = query_req.filename_filter

    query_engine = index.as_query_engine(
        similarity_top_k=5,
        filters=filters,
        chat_mode="context",
        memory=memory
    )

    # Query with streaming enabled in LLM, so result.response is generator-like
    response_stream = query_engine.query_stream(query_req.question)

    # Update chat memory if chat_id provided
    if query_req.chat_id:
        memory.update_memory(chat_id=query_req.chat_id, text=query_req.question)

    # Generator that yields streaming chunks wrapped for markdown
    def event_stream():
        # You might want to prefix or postfix tokens here for markdown formatting
        for chunk in response_stream:
            yield chunk

        # Update memory with full response text (can be done once stream ends)
        full_response = "".join(response_stream)
        if query_req.chat_id:
            memory.update_memory(chat_id=query_req.chat_id, text=full_response)

    return StreamingResponse(event_stream(), media_type="text/plain")

