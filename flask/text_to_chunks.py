import re

# Function to split text into chunks, sub-docs, and documents
def chunk_pdf_text(text: str, max_chunk_size: int = 500, split_pattern=r'CHAPTER\s+[IVXLCDM]+'):
    """
    This function splits the provided text into documents, sub-docs, and chunks.
    
    :param text: The full text extracted from the PDF.
    :param max_chunk_size: The maximum number of characters per chunk.
    :return: A dictionary representing the full structure (collection, documents, sub-docs, chunks).
    """

    # Placeholder for final collection structure
    collection = {
        'documents': []
    }
    
    # Split text into high-level 'documents' based on heading or chapter markers (modify based on the structure of your PDF)
    # Example uses chapter headings starting with "Chapter"
    document_splits = re.split(split_pattern, text)
    chapters = re.findall(split_pattern, text, re.IGNORECASE)

    # Iterate through each 'document'
    for doc_idx, document_text in enumerate(document_splits):
        document = {
            'id': f'doc_{doc_idx}_{chapters[doc_idx]}',
            'sub_docs': []
        }

        # Split 'document' into 'sub-docs' based on subsections, e.g., headings starting with numbers or letters
        sub_doc_splits = re.split(r'\n\s*[0-9]+\.\s*[^\n]+\n', document_text)

        for sub_doc_idx, sub_doc_text in enumerate(sub_doc_splits):
            sub_doc = {
                'id': f'sub_doc_{sub_doc_idx}',
                'chunks': []
            }

            # Chunk the 'sub-doc' text into smaller chunks, ensuring chunks don't exceed max_chunk_size
            chunk_start = 0
            while chunk_start < len(sub_doc_text):
                chunk_end = min(chunk_start + max_chunk_size, len(sub_doc_text))
                chunk_text = sub_doc_text[chunk_start:chunk_end]

                # Ensure you don't cut off a sentence or word, find the last period to chunk cleanly
                if chunk_end < len(sub_doc_text):
                    chunk_end = sub_doc_text.rfind('.', chunk_start, chunk_end) + 1
                    chunk_text = sub_doc_text[chunk_start:chunk_end]

                # Create chunk metadata and add to sub-doc
                chunk = {
                    'data': chunk_text.strip(),
                    'metadata': {
                        'doc_id': f'doc_{doc_idx}_{chapters[doc_idx]}',
                        'sub_doc_id': f'sub_doc_{sub_doc_idx}',
                        'chunk_index': len(sub_doc['chunks'])
                    }
                }
                sub_doc['chunks'].append(chunk)

                # Update start point for the next chunk
                chunk_start = chunk_end

            document['sub_docs'].append(sub_doc)

        collection['documents'].append(document)

    return collection


# def create_summary(text: str) -> str:

#     return text[:100] + '...' if len(text) > 100 else text

# Function to load text from .txt file
def load_text_from_file(file_path: str) -> str:
    """
    Load the content of a text file.
    
    :param file_path: Path to the .txt file.
    :return: The content of the file as a string.
    """
    with open(file_path, 'r', encoding='utf-8') as file:
        text = file.read()
    return text
# Example of how to use the function
# Assuming you have extracted text from a PDF (this is just a placeholder text)
# pdf_text = load_text_from_file("./custom_data/The-Science-of-Human-Nature-A-Psychology-for-Beginners.txt")
# # print(pdf_text.strip())
# # Run the chunking function on the extracted text
# chunked_structure = chunk_pdf_text(pdf_text, max_chunk_size=1000)
# # print(chunked_structure)
# # View the structured collection
# for doc in chunked_structure['documents']:
#     print(f"Document ID: {doc['id']}")
#     for sub_doc in doc['sub_docs']:
#         print(f"  Sub-doc ID: {sub_doc['id']}")
#         for chunk in sub_doc['chunks']:
#             print(f"    Chunk Data: {chunk['data'][:50]}...")  # Print first 50 chars of chunk for brevity
#             print(f"    Chunk Summary: {chunk['summary']}")
