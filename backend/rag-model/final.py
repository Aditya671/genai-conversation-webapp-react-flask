import os
import fitz  # PyMuPDF for PDF text extraction
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

# --- Configuration ---

PDF_DIR = "./pdfs"  # NCERT PDFs stored here
os.makedirs(PDF_DIR, exist_ok=True)

MONGO_URI = "mongodb+srv://<username>:<password>@<cluster>.mongodb.net/?retryWrites=true&w=majority"
DB_NAME = "chatbot_db"
COLLECTION_NAME = "embedding_vectors"

# OpenAI-like LLM server (your LLM API URL)
LLM_MODEL = "Yi-34B-Chat"
LLM_BASE_URL = "http://localhost:8000/v1"

# Embedding model from HuggingFace (open source, good for English docs)
EMBED_MODEL = "BAAI/bge-large-en-v1.5"

# --- FastAPI Setup ---
app = FastAPI(title="CBSE NCERT Chatbot API - Notes, Q&A, Summaries")

# --- Prompt Templates ---

SYSTEM_PROMPT = PromptTemplate(
    "You are a knowledgeable and patient CBSE Class 10 teacher.\n"
    "You help students by generating clear, detailed notes, summaries, and exam-style questions with answers.\n"
    "Use **markdown** with headings (###), bullet points (-), numbered lists, and bold text (**).\n\n"
    "### Context:\n{context_str}\n\n"
    "### Instructions:\nAnswer the student's query using only the information provided."
)

USER_PROMPT = PromptTemplate(
    "### Student Query:\n{query_str}\n\n"
)

POST_RESPONSE_PROMPT = PromptTemplate(
    "Make sure your response is formatted in markdown with headings, bullet points, and numbered lists as needed."
)

RESPONSE_WRAPPER = lambda text: f"### 🤖 Teacher's Response:\n\n{text.strip()}"

# --- Chat Memory for Multi-turn Conversation ---
memory = ChatMemoryBuffer.from_defaults(token_limit=3000)

# --- Helper Functions ---

def get_vector_store():
    client = MongoClient(MONGO_URI)
    return MongoDBAtlasVectorSearch(
        mongo_client=client,
        db_name=DB_NAME,
        collection_name=COLLECTION_NAME,
        index_name="ncert_index"
    )

def get_service_context(
    system_prompt=SYSTEM_PROMPT,
    query_wrapper_prompt=USER_PROMPT,
    response_postprocess_prompt=POST_RESPONSE_PROMPT,
):
    llm = OpenAI(
        model=LLM_MODEL,
        base_url=LLM_BASE_URL,
        api_key="EMPTY",  # no key needed for local LLM
        is_chat_model=True,
        system_prompt=system_prompt,
        query_wrapper_prompt=query_wrapper_prompt,
        response_postprocess_prompt=response_postprocess_prompt,
        streaming=True,
    )
    embed_model = HuggingFaceEmbedding(model_name=EMBED_MODEL)
    return ServiceContext.from_defaults(llm=llm, embed_model=embed_model)

def extract_pdf_text_with_metadata(pdf_path: str) -> Document:
    """Extract text and create Document with metadata including filename"""
    with fitz.open(pdf_path) as pdf:
        text = "\n".join(page.get_text() for page in pdf)
    metadata = {"filename": os.path.basename(pdf_path)}
    return Document(text=text, metadata=metadata)

def load_all_documents() -> List[Document]:
    """Load all PDFs from PDF_DIR into Document list with metadata"""
    documents = []
    for file in os.listdir(PDF_DIR):
        if file.lower().endswith(".pdf"):
            path = os.path.join(PDF_DIR, file)
            doc = extract_pdf_text_with_metadata(path)
            documents.append(doc)
    return documents

def build_index():
    """Build or rebuild index from documents using SentenceSplitter chunking"""
    documents = load_all_documents()
    splitter = SentenceSplitter(chunk_size=512, chunk_overlap=50)
    nodes = []
    for doc in documents:
        doc_nodes = splitter.get_nodes_from_documents([doc])
        for node in doc_nodes:
            node.metadata = doc.metadata  # preserve filename metadata
        nodes.extend(doc_nodes)

    vector_store = get_vector_store()
    vector_store._collection.delete_many({})  # clear old embeddings

    service_context = get_service_context()
    return VectorStoreIndex(nodes, service_context=service_context, vector_store=vector_store)

# Build index once at startup
index = build_index()

# --- API Models ---

class QueryRequest(BaseModel):
    question: str
    filename_filter: Optional[str] = None  # filter by PDF filename
    chat_id: Optional[str] = None  # session ID for chat memory context
    mode: Optional[str] = Query(
        default="answer",
        description="Query mode: answer (default), notes, summary, questions",
        regex="^(answer|notes|summary|questions)$"
    )

# --- API Endpoints ---

@app.get("/status")
def status():
    return {"status": "🟢 ready", "model": LLM_MODEL}

@app.post("/query")
def query_docs(req: QueryRequest):
    filters = {}
    if req.filename_filter:
        filters["filename"] = req.filename_filter

    # Select system prompt based on mode
    if req.mode == "notes":
        system_prompt_text = (
            "You are a helpful CBSE Class 10 teacher creating **detailed notes**.\n"
            "Use headings, bullet points, and examples where appropriate.\n"
            "Context:\n{context_str}\n\nInstructions:\nWrite clear notes."
        )
    elif req.mode == "summary":
        system_prompt_text = (
            "You are a helpful CBSE Class 10 teacher creating a **concise summary** of the material.\n"
            "Use bullet points and short sentences.\n"
            "Context:\n{context_str}\n\nInstructions:\nWrite a summary."
        )
    elif req.mode == "questions":
        system_prompt_text = (
            "You are a helpful CBSE Class 10 teacher creating **exam-style questions and answers**.\n"
            "Generate 3 questions with answers based on the context.\n"
            "Format the answer in markdown with numbered questions and bold answers.\n"
            "Context:\n{context_str}\n\nInstructions:\nCreate questions and answers."
        )
    else:
        # default: answer mode
        system_prompt_text = SYSTEM_PROMPT.prompt

    # Setup prompts dynamically
    system_prompt = PromptTemplate(system_prompt_text)
    service_context = get_service_context(
        system_prompt=system_prompt,
        query_wrapper_prompt=USER_PROMPT,
        response_postprocess_prompt=POST_RESPONSE_PROMPT,
    )

    # Rebuild the index with new service context to update prompts (optional)
    # If prompt update without rebuild is supported, prefer that
    index.service_context = service_context

    query_engine = index.as_query_engine(
        similarity_top_k=5,
        filters=filters,
        chat_mode="context",
        memory=memory,
        service_context=service_context,
    )

    # Streaming response generator
    response_stream = query_engine.query_stream(req.question)

    if req.chat_id:
        memory.update_memory(chat_id=req.chat_id, text=req.question)

    def event_stream() -> Generator[str, None, None]:
        full_response = ""
        for chunk in response_stream:
            full_response += chunk
            yield chunk
        # After streaming finished, update memory with answer
        if req.chat_id:
            memory.update_memory(chat_id=req.chat_id, text=full_response)

    return StreamingResponse(event_stream(), media_type="text/markdown")

