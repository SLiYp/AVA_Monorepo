from dotenv import load_dotenv
import os
import json
from flask import Flask, request, jsonify
from pymongo import MongoClient
from pathlib import Path
from bson.objectid import ObjectId
from langchain_openai import ChatOpenAI
from langchain.schema.output_parser import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
# from langchain.memory import FileChatMessageHistory
from langchain_community.chat_message_histories import FileChatMessageHistory
from langchain_core.runnables.history import RunnableWithMessageHistory
from flask_cors import CORS


# conv_chain = RunnableWithMessageHistory(
#     chain, get_session_history, input_messages_key="input", history_messages_key="chat_history"
# )

# Load the .env file
load_dotenv()

app = Flask(__name__)
# Allow CORS for specific domains
# CORS(app, resources={r"/*": {"origins": [os.getenv('CORS_DOMAIN')]}})
CORS(app)

# Set the OpenAI API key
os.environ["OPENAI_API_KEY"] = os.getenv('OPENAI_API_KEY')
# MongoDB connection string
client = MongoClient(os.getenv("M_user"))
db = client['avaDB']
collection = db['chatsessions']

model = ChatOpenAI(temperature=0, model="gpt-3.5-turbo")

prompt = ChatPromptTemplate.from_messages(
    [
        ("system", '''You’re a compassionate and understanding mental health chatbot created to engage users in friendly and supportive conversations. Your primary goal is to provide guidance similar to what a psychologist might offer while maintaining a warm, approachable demeanor. You always aim to communicate without unnecessary formalities or robotic phrases, ensuring that your responses feel natural and relatable.

Your task is to assist users by providing friendly, insightful support on mental health topics. Below are the guidelines you should follow to maintain an engaging and empathetic dialogue:
- Avoid generic phrases such as "it seems like","from what I understand", "it sounds like" etc.
- Keep conversations casual and friendly, just like chatting with a good friend, without adding extra content that isn’t necessary.
- Ensure that your responses focus on understanding the user’s feelings and offering helpful advice or resources.

Please keep in mind the following context about the users you might engage with:
- Their concerns may vary widely, ranging from anxiety, stress, and relationship issues to general life challenges. Or sometimes it is just a casual chat.
- They might be looking for someone to listen, to offer advice, or to guide them towards strategies for coping or self-improvement. but they don't like the speech style of therapist. rather they seek friedly tone with modern speech approach.
- Your tone dont have to be always supportive and uplifting but make sure you dont overstep, understand users, feel and give it an approach with physcologist knowledge and friendly approach.
- Do not always try to respond with answer, do followups.
Feel free to craft your responses based on the topics they bring up and ensure to maintain a relaxed and comforting conversation style. Or sometimes to spice up friendly chat, be little ironic, show medium rejection. avoid very lengthy replies'''),
        MessagesPlaceholder(variable_name="chat_history"),
        ("human", "{input}"),
    ]
)

chain = prompt | model | StrOutputParser()

history_dir = Path("./message_history")
history_dir.mkdir(parents=True, exist_ok=True)

def get_session_history(session_id: str) -> FileChatMessageHistory:
    session_history_path = history_dir / f"{session_id}.json"
    return FileChatMessageHistory(str(session_history_path))

conv_chain = RunnableWithMessageHistory(
    chain, get_session_history, input_messages_key="input", history_messages_key="chat_history"
)

def fetch_session(session_id, prompt_details):
    session_id_obj = ObjectId(session_id)
    session = collection.find_one({"_id": session_id_obj})
    

    if session:
        return True
    else:
        return False

@app.route('/process_prompt', methods=['POST'])
def process_prompt():
    if request.method == 'POST':
        data = request.json
        session_id = data.get('_id')
        prompt_details = data.get('prompt_details')

        if fetch_session(session_id, prompt_details):
            response = conv_chain.invoke(
                {"input": prompt_details["prompt"]},
                config={"configurable": {"session_id": session_id}}
            )

            return jsonify({"responses": [response]})
        else:
            return jsonify({"error": "Session not found"}), 404

@app.route('/get_session_history/<session_id>', methods=['GET'])
def get_session_history_api(session_id):
    session_history_path = history_dir / f"{session_id}.json"

    if session_history_path.exists():
        with open(session_history_path, "r") as file:
            session_history = json.load(file)
            return jsonify(session_history)
    else:
        return jsonify({"error": f"No history found for session ID: {session_id}"}), 404

if __name__ == '__main__':
    app.run(host="0.0.0.0",debug=False,port=os.getenv("PORT"))







# postman input

# {
#     "_id": "66b2683014570b6ef9b50dba",
#     "prompt_details": {
#         "promptId": "1000",
#         "prompt": "who is messi?"
#     }
# }
