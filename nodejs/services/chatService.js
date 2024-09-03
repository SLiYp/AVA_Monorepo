
// import { handleResponse, handleError, api } from "./llmApiService";
const {api, handleResponse, handleError} = require("./llmApiService")

exports.promptResponse = async (data) => {
    console.log("the data is",JSON.stringify(data));
    const res = await api(null)
        .post(`/process_prompt`, data)
        .then(handleResponse)
        .catch(handleError);
    if (res) {
        // console.log(res);
        return res.responses;
    }
};

