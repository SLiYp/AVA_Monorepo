import os
import json
from pathlib import Path
from dotenv import load_dotenv
from langchain_core.runnables.history import RunnableWithMessageHistory
from langchain.memory import ConversationBufferWindowMemory
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_community.chat_message_histories import FileChatMessageHistory
from langchain.schema.output_parser import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate
from langchain.schema import StrOutputParser
from langchain_community.document_loaders import CSVLoader
from langchain_openai import OpenAIEmbeddings, OpenAI, ChatOpenAI
import chromadb

# Load environment variables
load_dotenv()
os.environ["OPENAI_API_KEY"] = os.getenv('OPENAI_API_KEY')

# Initialize the embeddings model
embeddings = OpenAIEmbeddings(openai_api_key=os.environ["OPENAI_API_KEY"])

# Initialize ChromaDB client and collection
chroma_client = chromadb.PersistentClient(path="./chromadb/")


# Define a retriever class using ChromaDB directly
class ChromaRetriever:
    def __init__(self):
        self.self=self
        
    def embed(self,documentRef):
        # collection = chroma_client.get_or_create_collection(name="primary_collection")
        collections = chroma_client.list_collections()
        collection_exists = False
        for collection in collections:
            if collection.name == documentRef["id"]:
                collection_exists = True
                break

        if collection_exists:
            collection= chroma_client.get_collection(documentRef["id"])
        if(collection_exists !=True):
            # Create embeddings from CSV documents and upsert them into ChromaDB
            collection = chroma_client.create_collection(documentRef["id"])
            for i, doc in enumerate(documentRef["documents"]):
                embedding = embeddings.embed_query(doc.page_content)  # Generate embedding for document content
                # print(embedding)
                collection.upsert(
                    embeddings=[embedding],
                    documents=[doc.page_content],  # Use document content
                    ids=[str(i)]  # Use document index as ID
                )

    def retrieve(self, query, top_k=3):
        query_embedding = embeddings.embed_query(query)  # Ensure the same embeddings instance
        all_results = []

        # Get all collections
        collections = chroma_client.list_collections()

        # Loop through each collection and query
        for collection in collections:
            results = collection.query(
                query_embeddings=[query_embedding],
                n_results=top_k
            )
            # Check if results contain documents and add to all_results
            if 'documents' in results:
                all_results.extend(zip(results['documents'], results['distances']))

        # Sort results by distance (assumed to be relevance)
        all_results = sorted(all_results, key=lambda x: x[1])  # Sorting by distance (ascending)

        # Return top_k results across all collections
        if all_results:
            return [doc for doc, distance in all_results[:top_k]]
        else:
            return ["No results found."]

# Load CSV data using CSVLoader
loader = CSVLoader(file_path='./custom_data/DataSet.csv')
documents = loader.load()  # This returns a list of Documents with content
docRef={"id":"collection_1","documents":documents}
# print(docRef["documents"])
retriever=ChromaRetriever()
# retriever.embed(docRef)

# Initialize LLM
model = ChatOpenAI(temperature=0, model="gpt-3.5-turbo")
llm = OpenAI(api_key=os.environ["OPENAI_API_KEY"])
# RAG Class for querying LLM with retrieved documents
class SimpleRAG:
    def __init__(self, llm, retriever):
        self.llm = llm
        self.retriever = retriever

    def generate(self, query):
        retrieved_docs = self.retriever.retrieve(query)
        # print(retrieved_docs)
        if all(isinstance(doc, list) for doc in retrieved_docs):
            retrieved_docs = [item for sublist in retrieved_docs for item in sublist]
        # augmented_query = f"Context: {' '.join(retrieved_docs)} Query: {query}"
            return retrieved_docs

rag = SimpleRAG(llm, retriever)

# Directory for storing chat history
history_dir = Path("./message_history")
history_dir.mkdir(parents=True, exist_ok=True)

# Session history handler
# def buffer_memory_histroy(session_id):
#     path=history_dir / f"{session_id}.json"    
#     memory = ConversationBufferWindowMemory(
#         chat_memory=FileChatMessageHistory(str(path)),
#         k=5,
#         return_messages=True)
#     return memory.load_memory_variables({})['history']

def get_session_history(session_id: str) -> FileChatMessageHistory:
    session_history_path = history_dir / f"{session_id}.json"
    # print(FileChatMessageHistory(str(session_history_path)))
    return FileChatMessageHistory(str(session_history_path))
#
# Define prompt template for conversation
prompt = ChatPromptTemplate.from_messages(
    [   
("human", f'''You are a highly effective assistant designed to enhance user interactions by fetching contextual data to provide relevant responses. Your goal is to analyze user prompts and, whenever applicable, incorporate context from the database to generate insightful answers that align with user inquiries. 
Your task is to generate a response based on the user prompt and the relevant context retrieved from the database. The response should be adaptable and generic enough to address a wide range of queries; however, if there's a direct correlation between the user prompt and the context, you should seamlessly integrate that information into your answer.

**Response Format:** Please format your answers using Markdown. This includes:
- Using `**bold**` for emphasis.
- Using `*italic*` for emphasis or differentiation.
- Using `-` or `*` for lists.
- you are not a programmer and you don't write code.
- Providing links or resources if applicable.

**Tone:** Keep it casual and friendly, like chatting with a friend. Avoid lengthy answers and don't use unnecessary introductory or concluding phrases like "I hear you," "I understand you," "I see you are referring to," or "From what I understand."

- If the human asks you about the context, don't reveal the context.
- If the human asks about a previous question, give it.
Keep in mind that if the context does not pertain to the user’s prompt, it’s acceptable for you to provide a more generalized answer without incorporating any contextual information. Your responses should aim to be clear, concise, and informative, enhancing the user’s experience while ensuring relevance to their request.'''),
MessagesPlaceholder(variable_name="chat_history"),
("system","Here are the details you need to refer for generating your response. You can ignore if reference doesn't suit the situation. Context_from_Database:{context}"),
("human", "{input}")

    ]
)
chain = prompt | model | StrOutputParser()
conv_chain = RunnableWithMessageHistory(chain, get_session_history, input_messages_key="input", history_messages_key="chat_history")

def process_llm_prompt(session_id: str, prompt_details: dict):
    response = rag.generate(prompt_details['prompt'])
    augmented_query ={
        "context": str(response),
        # "memory":str(buffer_memory_histroy(session_id)),
        "input": str(prompt_details['prompt'])
    }

    # Generate response using the conversation chain
    conversation_response =  conv_chain.invoke(augmented_query,config={"configurable": {"session_id": session_id}})
    return conversation_response

# Example usage
session_id = "user_session_1"
prompt_details = {"prompt": "what is sun"}
response = process_llm_prompt(session_id, prompt_details)
print("Conversation Response:", response)