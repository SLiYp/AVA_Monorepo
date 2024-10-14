from dotenv import load_dotenv
import os
from flask import Flask, request, jsonify
from pymongo import MongoClient
from bson.objectid import ObjectId
from flask_cors import CORS
from flask.rag_old import process_llm_prompt, get_session_history  # Importing functions from llm_chain.py

# Load the .env file
load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": os.getenv('CORS_DOMAIN')}})


# Set the OpenAI API key
os.environ["OPENAI_API_KEY"] = os.getenv('OPENAI_API_KEY')

# MongoDB connection string
client = MongoClient(os.getenv("M_user"))
db = client['avaDB']
collection = db['chatsessions']

def fetch_session(session_id):
    session_id_obj = ObjectId(session_id)
    session = collection.find_one({"_id": session_id_obj})
    return session is not None

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

if __name__ == '__main__':
    app.run(host="0.0.0.0", debug=False, port=os.getenv("PORT"))
