from flask import Flask, request, jsonify
import os
import json
import pandas as pd
import re
import fitz
from pymongo import MongoClient
from bson.objectid import ObjectId
from flask_cors import CORS
from langchain_openai import OpenAIEmbeddings
from dotenv import load_dotenv
from rag import process_llm_prompt, get_session_history  # Importing functions from llm_chain.py

# Load the .env file
load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": os.getenv('CORS_DOMAIN')}})

# Constants and setup
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
os.environ["OPENAI_API_KEY"] = OPENAI_API_KEY
EMBEDDINGS_DIR = './embeddings/'

# MongoDB connection
client = MongoClient(os.getenv("M_user"))
db = client['avaDB']
collection = db['chatsessions']

# Embeddings-related functions
def check_existing_embeddings(document_name):
    file_path = os.path.join(EMBEDDINGS_DIR, f'{document_name}_embeddings.json')
    if os.path.exists(file_path):
        with open(file_path, 'r') as file:
            return json.load(file)
    return None

def save_embeddings(document_name, embeddings):
    file_path = os.path.join(EMBEDDINGS_DIR, f'{document_name}_embeddings.json')
    with open(file_path, 'w') as file:
        json.dump(embeddings, file)

def generate_embeddings(chunks):
    embeddings_model = OpenAIEmbeddings(openai_api_key=OPENAI_API_KEY)
    embeddings = [embeddings_model.embed_query(chunk) for chunk in chunks]
    return embeddings

def load_text_from_pdf(file_path: str) -> str:
    text = ""
    document = fitz.open(file_path)
    for page in document:
        text += page.get_text() + "\n"
    document.close()
    return text

def load_text_from_file(file_path: str) -> str:
    with open(file_path, 'r', encoding='utf-8') as file:
        text = file.read()
    return text

def chunk_text_by_sentences(text: str):
    sentences = re.split(r'(?<=[.!?]) +', text.strip())
    return [{'data': sentence.strip(), 'metadata': {}} for sentence in sentences if sentence]

def process_text_file(document_name: str):
    document_text = load_text_from_file(f'./docs/{document_name}.txt')
    chunks = chunk_text_by_sentences(document_text)
    for chunk in chunks:
        chunk_data = chunk['data']
        chunk_embedding = generate_embeddings([chunk_data])
        chunk['embedding'] = chunk_embedding
    return {'documents': [{'sub_docs': [{'chunks': chunks}]}]}

def process_pdf_file(document_name: str):
    document_text = load_text_from_pdf(f'./docs/{document_name}.pdf')
    chunks = chunk_text_by_sentences(document_text)
    for chunk in chunks:
        chunk_data = chunk['data']
        chunk_embedding = generate_embeddings([chunk_data])
        chunk['embedding'] = chunk_embedding
    return {'documents': [{'sub_docs': [{'chunks': chunks}]}]}

def process_csv_file(document_name: str):
    file_path = f'./docs/{document_name}.csv'
    
    if not os.path.isfile(file_path):
        raise FileNotFoundError(f"The file {file_path} does not exist.")
    
    df = pd.read_csv(file_path)
    embeddings_structure = {'rows': []}
    
    for idx, row in df.iterrows():
        row_data = ' '.join([str(item) for item in row])
        row_embedding = generate_embeddings([row_data])
        embeddings_structure['rows'].append({
            'data': row_data,
            'embedding': row_embedding
        })
        
    return embeddings_structure

# Chat session-related functions
def fetch_session(session_id):
    session_id_obj = ObjectId(session_id)
    session = collection.find_one({"_id": session_id_obj})
    return session is not None

# Routes
@app.route('/get_embeddings', methods=['POST'])
def get_embeddings():
    data = request.json
    document_name = data.get('document_name')

    if not document_name:
        return jsonify({"error": "Document name is required"}), 400

    file_extension = document_name.split('.')[-1]
    document_name = document_name.split('.')[0]

    existing_embeddings = check_existing_embeddings(document_name)
    if existing_embeddings:
        return jsonify({"document_name": document_name, "embeddings": existing_embeddings}), 200

    if file_extension == 'txt':
        chunked_structure = process_text_file(document_name)
    elif file_extension == 'pdf':
        chunked_structure = process_pdf_file(document_name)
    elif file_extension == 'csv':
        chunked_structure = process_csv_file(document_name)
    else:
        return jsonify({"error": "Unsupported file type"}), 400

    save_embeddings(document_name, chunked_structure)
    return jsonify({"document_name": document_name, "embeddings": chunked_structure}), 200

@app.route('/process_prompt', methods=['POST'])
def process_prompt():
    if request.method == 'POST':
        data = request.json
        session_id = data.get('_id')
        prompt_details = data.get('prompt_details')

        if fetch_session(session_id):
            response = process_llm_prompt(session_id, prompt_details)
            return jsonify({"responses": [response]})
        else:
            return jsonify({"error": "Session not found"}), 404

@app.route('/get_session_history/<session_id>', methods=['GET'])
def get_session_history_api(session_id):
    history = get_session_history(session_id)
    if history:
        return jsonify(history)
    else:
        return jsonify({"error": f"No history found for session ID: {session_id}"}), 404

# Main function
if __name__ == '__main__':
    os.makedirs(EMBEDDINGS_DIR, exist_ok=True)
    app.run(host="0.0.0.0", debug=False, port=os.getenv("PORT"))
