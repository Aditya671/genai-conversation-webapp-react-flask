import fitz  # PyMuPDF
from llama_index import Document
import re
from typing import List

def extract_chapters_from_pdf(pdf_path: str) -> List[Document]:
    """
    Extract chapters as separate Documents with chapter metadata from a NCERT PDF.

    Heuristics used:
    - Search for lines containing "Chapter" (case-insensitive) or numeric chapter headings like "1.", "2.", etc.
    - Aggregate text per chapter.
    """
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
                            "filename": pdf_path.split("/")[-1],
                            "chapter": current_chapter_title.strip(),
                        },
                    )
                )
            current_text = []

    for page_num in range(len(doc)):
        page = doc.load_page(page_num)
        blocks = page.get_text("blocks")
        # blocks: list of (x0, y0, x1, y1, "text", block_no, block_type)

        for b in blocks:
            block_text = b[4].strip()
            lines = block_text.split("\n")
            for line in lines:
                # Detect chapter headings
                if chapter_heading_pattern.match(line):
                    # Flush previous chapter if any
                    flush_chapter()
                    current_chapter_title = line.strip()
                else:
                    current_text.append(line)

    # Flush last chapter
    flush_chapter()

    return chapters


# Usage example:
# chapters_docs = extract_chapters_from_pdf("./pdfs/science_chapter_3.pdf")
# for doc in chapters_docs:
#     print(doc.metadata["chapter"])
#     print(doc.text[:200])  # first 200 chars of chapter text


def load_all_documents_with_chapters() -> List[Document]:
    documents = []
    for file in os.listdir(PDF_DIR):
        if file.lower().endswith(".pdf"):
            path = os.path.join(PDF_DIR, file)
            chapter_docs = extract_chapters_from_pdf(path)
            documents.extend(chapter_docs)
    return documents

def build_index():
    documents = load_all_documents_with_chapters()
    splitter = SentenceSplitter(chunk_size=512, chunk_overlap=50)
    nodes = []
    for doc in documents:
        doc_nodes = splitter.get_nodes_from_documents([doc])
        for node in doc_nodes:
            node.metadata = doc.metadata  # keep filename & chapter metadata
        nodes.extend(doc_nodes)

    vector_store = get_vector_store()
    vector_store._collection.delete_many({})  # clear old data

    service_context = get_service_context()
    return VectorStoreIndex(nodes, service_context=service_context, vector_store=vector_store)
