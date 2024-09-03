import { useSessionContext } from "../context/AgentContext";
import { api, handleResponse, handleError} from "./apiService";
import { getCurrentUser } from "./authService";

export const createSession = async (data:any) => {
    const chatSession = await api()
        .post("/chat", data)
        .then(handleResponse)
        .catch(handleError);

    if (chatSession) {
        console.log(chatSession.chatSessionId);
        return chatSession.chatSessionId;
    }

    throw new Error("Failed to create chat session.");
};

export const getSession = async (data:any) => {
    const res = await api()
        .get(`chat/${data}`)
        .then(handleResponse)
        .catch(handleError);
    if (res) {
        return res;
    }
};
// {
//     sessionId: sessionId,
//     id: newPrompt.promptId,
//     text: newPrompt.prompt,
// }
export const chatComplition = async (data:any) => {
    const res = await api()
        .post(`chat/${data.sessionId}/prompt`, {
                promptId: data.id,
                prompt: data.text,
            })
        .then(handleResponse)
        .catch(handleError);
    if (res) {
        console.log(res);
        return res.responses[0];
    }
};

// export const addResponse = async (data) => {
//     await api()
//         .post(`/chat/${data.sessionId}/prompt/${data.promptId}/response`, {
//             response: data.text,
//         })
//         .then(handleResponse)
//         .catch(handleError);
// };
