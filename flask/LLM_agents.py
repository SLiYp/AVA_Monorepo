from dotenv import load_dotenv
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_openai import ChatOpenAI
from pydantic import BaseModel
from typing import Literal, List, Dict, Any
import getpass
import os
from sentence_transformers import SentenceTransformer
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity




def _set_if_undefined(var: str):

    if not os.environ.get(var):

        os.environ[var] = getpass.getpass(f"Provide your API_KEY {var}")    


# Load environment variables
load_dotenv()
os.environ["OPENAI_API_KEY"] = os.getenv('OPENAI_API_KEY')
_set_if_undefined("OPEN_API_KEY") # LLM

_set_if_undefined("TAVILY_API_KEY") # Webscraping

# Defining type of agents

agents = ["Researcher","Coder","Reviewer"]

#  [Prompt retrieval Agent, Knowledge retrieval Agent ]



# System prompt template for SuperAgent

system_prompt = (

"""

You are a highly intelligent and efficient SuperAgent responsible for managing a team of specialized agents, each with unique skills. The agents in your team are:



- **Researcher**: Expert in gathering information, conducting in-depth analysis, and generating insights.

- **Coder**: Skilled in writing, debugging, and optimizing code, as well as implementing technical solutions.

- **Reviewer** (optional): Capable of reviewing and verifying outputs from both Researcher and Coder, ensuring high-quality deliverables.



Your job is to:

1. **Assign tasks** to the most appropriate agent based on their expertise.

2. **Dynamically route** tasks depending on the current stage of the conversation.

3. **Monitor progress** and adjust your decisions as new information is provided.

4. **Decide when the task is finished** based on the agent's responses and the user's request.



### User Request:

"{user_request}"



### Agent Responses so far:

{conversation_history}



### Rules for Task Assignment:

1. If the task requires research, analysis, or gathering information, assign it to the **Researcher**.

2. If the task involves technical implementation, code writing, or debugging, assign it to the **Coder**.

3. If all the work has been done and needs to be verified or reviewed, assign it to the **Reviewer**.

4. If all tasks have been completed successfully, respond with "FINISH" and provide a summary of the work.



### Instructions:

Based on the user's request and the conversation history, choose which agent should act next, or decide if the work is complete.

- Reply with the name of the next agent to assign the task.

- If no further action is required, respond with "FINISH" to conclude the task.

"""

)



options = ["FINISH"] + agents



# Response Validation

class routeResponse(BaseModel):

    next: Literal[*options]



# Function for SuperAgent Routing

def SuperAgent_routing(messages, user_prompt):

    prompt = ChatPromptTemplate.from_messages(

        [

            ("system",user_prompt),

            MessagesPlaceholder(variable_name="messages"),

            (

                "system",

                "Given the conversation above, who should act next?"

                "or should we FINISH? Select on of: {options}",

            ),

        ]

    ).partial(options=str(options),members= ", ".join(members)) # (members = members)



    return prompt



# Function for SuperAgent

def SuperAgent(state, user_prompt):

    llm = ChatOpenAI(model="gpt-4o") # define model



    chain_of_process = (

        SuperAgent_routing(state['messages'],user_prompt) | llm.with_structured_output(routeResponse)

    )



    result = chain_of_process.invoke(state)

    return result



response = SuperAgent(state)

print(response)





agents = ["Prompt Retrival Agent" , "Knowledge Retrival Agent"]

x

system_prompt = (

    """

You are a highly efficient SuperAgent responsible for coordinating between two specialized agents, each with unique roles. The agents in your team are:



- **Prompt Retrieval Agent**: Expert in understanding user queries, retrieving relevant context, and formulating clear and precise prompts.

- **Knowledge Retrieval Agent**: Skilled in gathering and analyzing information from various sources, providing detailed and insightful answers.



Your responsibilities are:

1. **Assign tasks** to the appropriate agent based on their expertise.

2. **Dynamically route** tasks as the conversation progresses and new information is revealed.

3. **Monitor progress** and adjust your decisions based on agent responses.

4. **Decide when the task is complete** based on the agent's responses and the user's request.



### User Request:

"{user_request}"



### Agent Responses so far:

{conversation_history}



### Rules for Task Assignment:

1. If the task requires interpreting a user query or generating a specific prompt, assign it to the **Prompt Retrieval Agent**.

2. If the task requires finding information or analyzing content from sources, assign it to the **Knowledge Retrieval Agent**.

3. If all tasks have been completed successfully, respond with "FINISH" and provide a summary of the work.



### Instructions:

Based on the user's request and the conversation history, decide which agent should act next or whether the work is complete.

- Reply with the name of the next agent to assign the task.

- If no further action is required, respond with "FINISH" to conclude the task.

"""

)



options = ["FINISH"] + agents



# Response Validation

class routeResponse(BaseModel):

    next: Literal[*options]



# Function for SuperAgent Routing

def SuperAgent_routing(messages, user_prompt):

    prompt = ChatPromptTemplate.from_messages(

        [

            ("system",user_prompt),

            MessagesPlaceholder(variable_name="messages"),

            (

                "system",

                "Given the conversation above, who should act next?"

                "or should we FINISH? Select on of: {options}",

            ),

        ]

    ).partial(options=str(options),members= ", ".join(members)) # (members = members)



    return prompt



# Function for SuperAgent

def SuperAgent(state, user_prompt):

    llm = ChatOpenAI(model="gpt-4") # define model



    chain_of_process = (

        SuperAgent_routing(state['messages'],user_prompt) | llm.with_structured_output(routeResponse)

    )



    result = chain_of_process.invoke(state)

    return result



response = SuperAgent(state)

print(response) 

class processedQuery(BaseModel):

    query: str

    metadata: Dict[str, Any] # What type of metadata are you getting?



def semantic_search(query: str, metadata: Dict[str,Any]) -> Dict[str, str]:





    """



#You are the Prompt Retrieval Agent responsible for dynamic prompt engineering. Your tasks include:

1. Analyzing the processed user query along with any provided metadata.

2. Generating an appropriate prompt template based on the query and metadata.

3. Deciding if the query contains emotional or specific contextual information.

   - If the query is general, attempt to resolve it directly by generating the appropriate prompt.

   - If the query contains emotional, cultural, or work-related context, route it to the Knowledge Retrieval Agent.



Your output should include:

- A prompt template tailored to the processed query and metadata.

- Whether the task is complete or if further action is required, indicating the next agent if needed.



“””””

    

    """

    

    # defining NLP Model 

    model = SentenceTransformer('all-MiniLM-L6-v2')



    query_embedding = model.encode(query, convert_to_tensor=True)



    query = query.lower()

    scores = []



    for entry in data:

        

        entry_text = entry.get('text', '')

        entry_embedding = model.encode(entry_text, convert_to_tensor=True)



        similarity_score = cosine_similarity(query_embedding.reshape(1, -1), entry_embedding.reshape(1, -1))[0][0]



        for key, value in metadata.items():

            if entry.get(key) == value:

                similarity_score += 0.05



        scores.append((similarity_score, entry)) # Output is tuples



    return None





data = [

    {"text": "When did 2024 olympics happen?", "category": "Sports", "author": "John"},

    {"text": "I'm worried about my future.", "category": "Emotional", "author": "Alice"},

    {"text": "Should I follow my heart as I'm attractive to a girl in my class or should I think logically?", "category": "Emotion", "author": "Bob"},

]






# When did 2024 olympics happened.

# I'm worried about my future.

# Should I follow my heart as I'm attractive to a girl in my class or should I think logically?

def KnowledgeRetrievalAgent(input_data):

    user_prompt = input_data.get("user_prompt", "")

    metadata = input_data.get("metadata", {})



    retrieved_context = semantic_search(user_prompt, metadata, db) # your db



    if not retrieved_context:

        raise ValueError("No context found")



    return retrieved_context