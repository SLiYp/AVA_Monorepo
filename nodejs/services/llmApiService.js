const axios = require('axios');
exports.api= (token) => {
    let token_data = token;
    if (typeof token_data === "string" && token_data.split(".").length === 3)
        return axios.create({
            baseURL: `${process.env.LLM_BACKEND_URI}`,
            headers: { "x-auth-token": token_data },
        });
    else
        return axios.create({
            baseURL: `${process.env.LLM_BACKEND_URI}`,
        });
};

exports.handleResponse = (res) => {
    try {
        const data = res.data;
        if (res.data.error) {
            const error = data.message ? data.message : data.error;
            return Promise.reject(error);
        }
        return data;
    } catch (error) {
        console.log("handle response: ", error);
    }
};

exports.handleError = (err) => {
    console.log("handle error: ", err);
    return null;
};