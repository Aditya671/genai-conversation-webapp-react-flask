import os
import re
from typing import List, Optional, Generator
import fitz  # PyMuPDF

from fastapi import FastAPI, Query
from fastapi.responses import StreamingResponse
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

# --- Config ---
PDF_DIR = "./pdfs"  # Local folder with NCERT PDFs
MONGO_URI = "mongodb+srv://<username>:<password>@<cluster>.mongodb.net/?retryWrites=true&w=majority"
DB_NAME = "chatbot_db"
COLLECTION_NAME = "embedding_vectors"

LLM_MODEL = "Yi-34B-Chat"
LLM_BASE_URL = "http://localhost:8000/v1"

EMBED_MODEL = "BAAI/bge-large-en-v1.5"

app = FastAPI(title="CBSE NCERT Chatbot API with Chapter Metadata")

# --- Prompt Templates ---

SYSTEM_PROMPT_DEFAULT = PromptTemplate(
    "You are a knowledgeable and patient CBSE Class 10 teacher.\n"
    "You help students by generating clear, detailed notes, summaries, and exam-style questions with answers.\n"
    "Use **markdown** formatting with headings (###), bullet points (-), numbered lists, and bold text (**).\n\n"
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
    system_prompt=SYSTEM_PROMPT_DEFAULT,
    query_wrapper_prompt=USER_PROMPT,
    response_postprocess_prompt=POST_RESPONSE_PROMPT,
):
    llm = OpenAI(
        model=LLM_MODEL,
        base_url=LLM_BASE_URL,
        api_key="EMPTY",
        is_chat_model=True,
        system_prompt=system_prompt,
        query_wrapper_prompt=query_wrapper_prompt,
        response_postprocess_prompt=response_postprocess_prompt,
        streaming=True,
    )
    embed_model = HuggingFaceEmbedding(model_name=EMBED_MODEL)
    return ServiceContext.from_defaults(llm=llm, embed_model=embed_model)

def extract_chapters_from_pdf(pdf_path: str) -> List[Document]:
    doc = fitz.open(pdf_path)
    chapters = []
    current_chapter_title = "Introduction"
    current_text = []

    chapter_heading_pattern = re.compile(
        r"^(chapter\s*\d+[:.]?\s*.*|^\d+\.\s+.*|^unit\s*\d+[:.]?.*)",
        re.IGNORECASE,
    )

    def flush_chapter():
        nonlocal current_text, current_chapter_title
        if current_text:
            text = "\n".join(current_text).strip()
            if text:
                chapters.append(
                    Document(
                        text=text,
                        metadata={
                            "filename": os.path.basename(pdf_path),
                            "chapter": current_chapter_title.strip(),
                        },
                    )
                )
            current_text = []

    for page_num in range(len(doc)):
        page = doc.load_page(page_num)
        blocks = page.get_text("blocks")
        for b in blocks:
            block_text = b[4].strip()
            lines = block_text.split("\n")
            for line in lines:
                if chapter_heading_pattern.match(line):
                    flush_chapter()
                    current_chapter_title = line.strip()
                else:
                    current_text.append(line)
    flush_chapter()
    return chapters

def load_all_documents_with_chapters() -> List[Document]:
    documents = []
    for file in os.listdir(PDF_DIR):
        if file.lower().endswith(".pdf"):
            path = os.path.join(PDF_DIR, file)
            chapters = extract_chapters_from_pdf(path)
            documents.extend(chapters)
    return documents

def build_index():
    documents = load_all_documents_with_chapters()
    splitter = SentenceSplitter(chunk_size=512, chunk_overlap=50)
    nodes = []
    for doc in documents:
        doc_nodes = splitter.get_nodes_from_documents([doc])
        for node in doc_nodes:
            node.metadata = doc.metadata
        nodes.extend(doc_nodes)

    vector_store = get_vector_store()
    vector_store._collection.delete_many({})

    service_context = get_service_context()
    return VectorStoreIndex(nodes, service_context=service_context, vector_store=vector_store)

# Build index once at startup (blocking call)
index = build_index()

# --- API Models ---

class QueryRequest(BaseModel):
    question: str
    filename_filter: Optional[str] = None
    chapter_filter: Optional[str] = None
    chat_id: Optional[str] = None
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
    if req.chapter_filter:
        filters["chapter"] = req.chapter_filter

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
        system_prompt_text = SYSTEM_PROMPT_DEFAULT.prompt

    system_prompt = PromptTemplate(system_prompt_text)
    service_context = get_service_context(
        system_prompt=system_prompt,
        query_wrapper_prompt=USER_PROMPT,
        response_postprocess_prompt=POST_RESPONSE_PROMPT,
    )

    index.service_context = service_context

    query_engine = index.as_query_engine(
        similarity_top_k=5,
        filters=filters,
        chat_mode="context",
        memory=memory,
        service_context=service_context,
    )

    response_stream = query_engine.query_stream(req.question)

    if req.chat_id:
        memory.update_memory(chat_id=req.chat_id, text=req.question)

    def event_stream() -> Generator[str, None, None]:
        full_response = ""
        for chunk in response_stream:
            full_response += chunk
            yield chunk
        if req.chat_id:
            memory.update_memory(chat_id=req.chat_id, text=full_response)

    return StreamingResponse(event_stream(), media_type="text/markdown")



"""
How to use now:
Place your NCERT PDFs in the ./pdfs folder before starting.

Run your FastAPI server (uvicorn main:app --reload).

Query /query with optional filename_filter and/or chapter_filter for focused responses.

Supported modes: "answer", "notes", "summary", "questions".

Example request body:

json
Copy
Edit
{
  "question": "Explain properties of metals.",
  "filename_filter": "science_class10.pdf",
  "chapter_filter": "Chapter 3: Metals and Non-metals",
  "mode": "answer",
  "chat_id": "studentA"
}
This gives you:
Pre-processed indexed NCERT PDFs split by chapters

Rich metadata filtering on both file and chapter level

Streaming markdown-formatted answers tailored for CBSE Class 10

Multi-turn chat memory for follow-up questions
"""