import os
import json
from pathlib import Path
from dotenv import load_dotenv
# from langchain.embeddings.openai import OpenAIEmbeddings
from langchain_community.chat_models import ChatOpenAI
from langchain.prompts.chat import ChatPromptTemplate
from langchain.schema import StrOutputParser
from langchain_community.document_loaders import CSVLoader
from langchain_openai import OpenAIEmbeddings
import chromadb

# Load environment variables
load_dotenv()
os.environ["OPENAI_API_KEY"] = os.getenv('OPENAI_API_KEY')

# Initialize the embeddings model
embeddings = OpenAIEmbeddings(openai_api_key=os.environ["OPENAI_API_KEY"])

# Load CSV data using CSVLoader
loader = CSVLoader(file_path='./custom_data/depression_data.csv')
documents = loader.load()  # This returns a list of Documents with content

# Initialize ChromaDB client and collection
chroma_client = chromadb.Client()
collection = chroma_client.get_or_create_collection(name="my_collection")

# Create embeddings from CSV documents and upsert them into ChromaDB
for i, doc in enumerate(documents):
    embedding = embeddings.embed_query(doc.page_content)  # Generate embedding for document content
    print(embedding) #
    collection.upsert(
        embeddings=[embedding],
        documents=[doc.page_content],  # Use document content
        ids=[str(i)]  # Use document index as ID
    )

print("CSV documents with metadata successfully upserted into ChromaDB.")

# Define a retriever class using ChromaDB directly
class ChromaRetriever:
    def __init__(self, collection):
        self.collection = collection

    def retrieve(self, query, top_k=3):
        query_embedding = embeddings.embed_query(query)  # Ensure the same embeddings instance
        results = self.collection.query(
            query_embeddings=[query_embedding],
            n_results=top_k
        )
        return results
        # # Access results and extract the documents
        # if 'documents' in results:
        #     return [doc for doc in results['documents']]
        # else:
        #     return ["No results found."]

# Initialize LLM
llm = ChatOpenAI(api_key=os.environ["OPENAI_API_KEY"])
retriever = ChromaRetriever(collection)

# RAG Class for querying LLM with retrieved documents
class SimpleRAG:
    def __init__(self, llm, retriever):
        self.llm = llm
        self.retriever = retriever

    def generate(self, query):
        retrieved_docs = self.retriever.retrieve(query)
        print(retrieved_docs)
        # if all(isinstance(doc, list) for doc in retrieved_docs):
        #     retrieved_docs = [item for sublist in retrieved_docs for item in sublist]
        # augmented_query = f"Context: {' '.join(retrieved_docs)} Query: {query}"
        return retrieved_docs

rag = SimpleRAG(llm, retriever)

# Define prompt template for conversation
prompt = ChatPromptTemplate.from_messages(
    [
        ("system", '''You’re a compassionate and understanding mental health chatbot created to engage users in friendly and supportive conversations...'''),
        ("human", "{input}"),
    ]
)

# Directory for storing chat history
history_dir = Path("./message_history")
history_dir.mkdir(parents=True, exist_ok=True)

# Session history handler
def get_session_history(session_id: str):
    session_history_path = history_dir / f"{session_id}.json"
    if session_history_path.exists():
        with open(session_history_path, "r") as file:
            session_history = json.load(file)
            return session_history
    else:
        return None

def process_llm_prompt(session_id: str, prompt_details: dict):
    response = rag.generate(prompt_details['prompt'])
    # Use prompt_details['prompt'] and retrieved context to generate a response
    augmented_query = {
        "input": f"Query: {prompt_details['prompt']} | Context: {str(response)}"
    }
    # Generate response using the conversation chain
    conversation_response = llm(augmented_query)
    return conversation_response

# Example usage
# session_id = "user_session_1"
# prompt_details = {"prompt": "I'm feeling stressed. Can you help me?"}
# response = process_llm_prompt(session_id, prompt_details)
# print("Conversation Response:", response)
