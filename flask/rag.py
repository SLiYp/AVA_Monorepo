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
from text_to_chunks import load_text_from_file,chunk_pdf_text

# Load environment variables
load_dotenv()
os.environ["OPENAI_API_KEY"] = os.getenv('OPENAI_API_KEY')

# Initialize the embeddings model
embeddings = OpenAIEmbeddings(openai_api_key=os.environ["OPENAI_API_KEY"])

# Initialize ChromaDB client and collection
chroma_client = chromadb.PersistentClient(path="./chromadb/")

#load and preprocess custom embeeding data

def pdfDataLoader(filePath):
    pdf_text= load_text_from_file(filePath)
    chunked_structure = chunk_pdf_text(pdf_text, max_chunk_size=1000)
    return chunked_structure;
    
    

# Define a retriever class using ChromaDB directly
class ChromaRetriever:
    def __init__(self):
        self.self=self
        
    def embed(self,documentRef,doc_type="text"):
        # collection = chroma_client.get_or_create_collection(name="primary_collection")
        collections = chroma_client.list_collections()
        collection_exists = False
        for collection in collections:
            if collection.name == documentRef["id"]:
                collection_exists = True
                break

        if collection_exists:
            collection= chroma_client.get_collection(documentRef["id"])
        else:
            collection = chroma_client.create_collection(documentRef["id"])
        
        print(collection)
        # Create embeddings from CSV documents and upsert them into ChromaDB
        if(doc_type == "csv"):
            for i, doc in enumerate(documentRef["documents"]):
                embedding = embeddings.embed_query(doc.page_content | doc)  # Generate embedding for document content
                # print(embedding)
                collection.upsert(
                    embeddings=[embedding],
                    documents=[doc.page_content | doc],  # Use document content
                    ids=[str(i)]  # Use document index as ID
                )
        else:
            for doc in documentRef["documents"]:
                print(doc)
                for sub_doc in doc['sub_docs']:
                    for i, chunk in enumerate(sub_doc['chunks']):
                        embedding = embeddings.embed_query(chunk)  # Generate embedding for document content
                        print(chunk)
                        collection.upsert(
                            embeddings=[embedding],
                            documents=[chunk],  # Use document content
                            ids=[f'{chunk.metadata.doc_id}']  # Use document index as ID
                        )


    def retrieve(self, query, top_k=3,collection_list="all"):
        query_embedding = embeddings.embed_query(query)  # Ensure the same embeddings instance
        all_results = []

        # Get all collections
        if(collection_list != "all"):
            # isinstance(doc, list) for doc in retrieved_docs
            collections = [chroma_client.get_collection(name) for name in collection_list]
        else:
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
            print(all_results)
            return [doc for doc, distance in all_results[:top_k]]
        else:
            return ["No results found."]

# Load CSV data using CSVLoader
# loader = CSVLoader(file_path='./custom_data/DataSet.csv')
# documents = loader.load()  # This returns a list of Documents with content
documents=pdfDataLoader("./custom_data/The-Science-of-Human-Nature-A-Psychology-for-Beginners.txt")
# print(documents)
docRef={"id":"collection_2","documents":documents}
print([value for i,value in enumerate(docRef["documents"])])
retriever=ChromaRetriever()
retriever.embed(docRef)
retriever.retrieve("Which are unwise and mistaken,Republicans or Democrats?",collection_list=["collection_2"])
# Initialize LLM
model = ChatOpenAI(temperature=0, model="gpt-3.5-turbo")
llm = OpenAI(api_key=os.environ["OPENAI_API_KEY"])
# RAG Class for querying LLM with retrieved documents
class SimpleRAG:
    def __init__(self, llm, retriever):
        self.llm = llm
        self.retriever = retriever

    def generate(self, query):
        retrieved_docs = self.retriever.retrieve(query,collection_list=["collection_2"])
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
("human", f'''You are a friend designed to enhance user interactions. You will do quick chats with chat lenghts not more than 20-30 words. In general you will respond with in 10 - 15 words. 
Your task is to generate a response based on the user prompt and the relevant context retrieved from the database. The response should be adaptable and generic enough to address a wide range of queries; however, if there's a direct correlation between the user prompt and the context, you should seamlessly integrate that information into your answer.

secondary obligations:
    - As a psychologist, your role is to follow evidence-based methods to help you navigate mental wellness. 
    - We may go through assessments, frameworks, and specific steps that are used in psychological practice. 
    - you are here to guide user, but you won’t always offer immediate support — some of this process involves self-reflection and understanding the root of the issues.
    - Help user start by exploring what you’re experiencing. Ask a few questions to better understand the situation before deciding the appropriate next steps.

Response Format: 
    - list of Markdown strings with less than 20 words in each string.
    - Providing links or resources if applicable.

Response style: 
    - Keep it very casual and friendly, like chatting with a friend.
    - You are not a scholor to know everything. Skip if you are challenged academically or professionally. 
    - Avoid lengthy answers. Don't use unnecessary phrases like "I hear you," "I understand you," "I see you are referring to," or "From what I understand." and more like these.
Restrictions:
    - If the human asks you about the context, don't reveal the context.
    - You do not facilitate conversations involving sensitive matters.
    
Keep in mind that if the context does not pertain to the user’s prompt, it’s acceptable for you to provide a more generalized answer without incorporating any contextual information. Your responses should aim to be clear, concise, and informative, enhancing the user’s experience while ensuring relevance to their request.'''),
MessagesPlaceholder(variable_name="chat_history"),
("system","Here are the details you need to refer for generating your response. You can ignore if reference doesn't suit the situation. Context_from_Database:{context}"),
("system","Don’t justify your answers. Don’t give information not mentioned in the CONTEXT INFORMATION."),
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
prompt_details = {"prompt": "how can mental health for adults impact?"}
response = process_llm_prompt(session_id, prompt_details)
print("Conversation Response:", response)
