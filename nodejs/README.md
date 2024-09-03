


# Node.js API with JWT Authentication and Chat Sessions

This project is a Node.js application with JWT authentication and MongoDB for storing users, chat sessions, and chat history. It allows users to register, login, create chat sessions, and manage chat prompts and responses.

## Prerequisites

- Node.js
- npm
- MongoDB (local or cloud instance)

## Getting Started

### Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/quarkyquo/repo-name.git
    cd repo-name
    ```

2. Install dependencies:
    ```sh
    npm install
    ```

3. Create a `.env` file in the root of the project and add your environment variables:
    ```env
    MONGO_URI=mongodb://localhost:27017/your-db-name
    JWT_SECRET=your_jwt_secret
    PORT=5000
    ```

4. Start the MongoDB server (if using a local instance).

5. Run the application:
    ```sh
    npm start
    ```

### API Endpoints

#### 1. User Registration

- **Endpoint:** `POST /api/auth/register`
- **Description:** Register a new user.
- **Headers:** `Content-Type: application/json`
- **Request Body:**
  ```json
  {
      "name": "John Doe",
      "email": "john@example.com",
      "password": "password123"
  }
  
- **Expected Response:**
  ```json
  {
      "token": "your_jwt_token_here"
  }
  ```

#### 2. User Login

- **Endpoint:** `POST /api/auth/login`
- **Description:** Login a user and return a JWT token.
- **Headers:** `Content-Type: application/json`
- **Request Body:**
  ```json
  {
      "email": "john@example.com",
      "password": "password123"
  }
  ```
- **Expected Response:**
  ```json
  {
      "token": "your_jwt_token_here"
  }
  ```

#### 3. Fetch User Information

- **Endpoint:** `GET /api/user`
- **Description:** Fetch the authenticated user's information.
- **Headers:** `x-auth-token: your_jwt_token_here`
- **Expected Response:**
  ```json
  {
      "_id": "user_id_here",
      "name": "John Doe",
      "email": "john@example.com",
      "chatSessions": [
          {
              "_id": "chat_session_id_here",
              "sessionId": "user_id_here",
              "name": "Session_name_here",
              "image": "url/color_code"
              // other chat session fields...
          }
      ]
  }
  ```

#### 4. Create Chat Session

- **Endpoint:** `POST /api/chat`
- **Description:** Create a new chat session for a user.
- **Headers:** `Content-Type: application/json`, `x-auth-token: your_jwt_token_here`
- **Request Body:**
  ```json
  {
      "name": "session name",
      "image":"url/colorCode"
  }
  ```
- **Expected Response:**
  ```json
  {
      "chatSessionId": "chat_session_id_here",
      "name": "session name",
      "image":"url/colorCode"
  }
  ```

#### 5. Add Prompt to Chat Session

- **Endpoint:** `POST /api/chat/:sessionId/prompt`
- **Description:** Add a new prompt to an existing chat session.
- **Headers:** `Content-Type: application/json`, `x-auth-token: your_jwt_token_here`
- **Request Body:**
  ```json
  {
      "promptId": "prompt_id_here",
      "prompt": "your_prompt_here"
  }
  ```
- **Expected Response:**
  ```json
  {
      "responses": "['AI generated response',...other_responses]"
  }
  ```


#### 6. Modify Prompt

- **Endpoint:** `PUT /api/chat/:sessionId/prompt/:promptId`
- **Description:** Modify an existing prompt in a chat session.
- **Headers:** `Content-Type: application/json`, `x-auth-token: your_jwt_token_here`
- **Request Body:**
  ```json
  {
      "prompt": "modified_prompt_here"
  }
  ```
- **Expected Response:**
  ```json
  {
      "msg": "Prompt modified"
  }
  ```
#### 7. Get All Data for a Specific Chat Session

- **Endpoint:** `GET /api/chat/:sessionId`
- **Description:** Retrieve all data for a specific chat session, including prompts and their associated responses.
- **Headers:** `x-auth-token: your_jwt_token_here`
- **Request Params:** 
  - `sessionId`: The ID of the chat session you want to retrieve.
- **Expected Response:**
  ```json
  {
      "_id": "chat_session_id_here",
      "userId": "user_id_here",
      "prompts": [
          {
              "_id": "prompt_id_here",
              "prompt": "your_prompt_here",
              "responses": [
                  {
                      "_id": "response_id_here",
                      "response": "response_text_here"
                  }
              ]
          }
      ],
      "createdAt": "2024-08-16T10:00:00Z",
      "updatedAt": "2024-08-16T10:05:00Z"
  }

## Using Postman for API Testing

To simplify testing, use Postman to manage your requests. Follow these steps:

1. **Create a New Postman Collection:**
    - Click on `New Collection`.
    - Name the collection (e.g., `Node.js API Auth and Chat`).

2. **Add Requests to the Collection:**
    - Add requests as described in the API Endpoints section.

3. **Use Environment Variables in Postman:**
    - Create a new environment (e.g., `Local`).
    - Add a variable `token`.
    - After running the `Login` request, copy the token from the response and use the following script in the `Tests` tab to set the token variable:
      ```javascript
      const response = pm.response.json();
      pm.environment.set("token", response.token);
      ```

4. **Use the `{{token}}` Variable:**
    - In requests that require authentication, replace the `x-auth-token` header value with `{{token}}`.

## Project Structure

```
├── config
│   └── db.js
├── controllers
│   ├── authController.js
│   ├── chatController.js
│   └── userController.js
├── middleware
│   └── auth.js
├── models
│   ├── User.js
│   ├── ChatSession.js
│   └── ChatPrompt.js
├── routes
│   ├── auth.js
│   ├── chat.js
│   └── user.js
├── .env
├── .gitignore
├── package.json
├── server.js
└── README.md
```

## License

This project will be licensed under the MIT License.
```

Replace `yourusername/your-repo-name` with the actual path to your repository and `your_db_name`, `your_jwt_secret`, and other placeholders with your actual values. This `README.md` file provides a clear and detailed overview of the project, setup instructions, API endpoints, and testing guidelines.
