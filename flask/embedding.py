import os
from dotenv import load_dotenv
from langchain.embeddings.openai import OpenAIEmbeddings
from langchain.document_loaders.csv_loader import CSVLoader
import chromadb

# Load environment variables
load_dotenv()

# Set your OpenAI API key
os.environ["OPENAI_API_KEY"] = os.getenv('OPENAI_API_KEY')

# Initialize the embeddings model
embeddings = OpenAIEmbeddings(openai_api_key=os.environ["OPENAI_API_KEY"])

def create_embeddings(documents):
    """
    Create embeddings for a list of documents.

    Args:
        documents (list): List of documents loaded from the CSV.

    Returns:
        list: List of tuples containing document IDs and their embeddings.
    """
    embedding_data = []
    for i, doc in enumerate(documents):
        embedding = embeddings.embed_query(doc.page_content)  # Generate embedding for the document content
        embedding_data.append((str(i), embedding, doc.page_content))  # Use index as ID
    return embedding_data

def upsert_embeddings(embedding_data, chroma_collection):
    """
    Upsert embeddings into a ChromaDB collection.

    Args:
        embedding_data (list): List of tuples containing document IDs, embeddings, and content.
        chroma_collection (Chroma collection): The collection to which embeddings will be upserted.
    """
    for doc_id, embedding, content in embedding_data:
        chroma_collection.add(
            embeddings=[embedding],
            documents=[content],
            ids=[doc_id]
        )

    print("Documents with metadata successfully upserted into ChromaDB.")

# Example usage within this file (can be removed if importing into other scripts)
if __name__ == "__main__":
    # Load the CSV file using CSVLoader
    loader = CSVLoader(file_path='./custom_data/depression_data.csv')
    documents = loader.load()  # This loads documents into Langchain Document format
    
    # Initialize ChromaDB client and collection
    chroma_client = chromadb.Client()
    collection = chroma_client.get_or_create_collection(name="my_collection")

    # Generate embeddings and upsert them into ChromaDB
    embedding_data = create_embeddings(documents)
    upsert_embeddings(embedding_data, collection)
    print(documents)
