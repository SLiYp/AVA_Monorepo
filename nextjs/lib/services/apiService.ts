"use client";

const axios = require("axios");
import { getAccessToken } from "@/utils/storage";
import { unstable_noStore as noStore } from 'next/cache'


export const api: any = (token?: string) => {
    noStore()
    const BACKEND_URI =process.env.SERVER_URL;
    let token_data = token ? token : getAccessToken();
    if (typeof token_data === "string" && token_data.split(".").length === 3)
        return axios.create({
            baseURL: `${BACKEND_URI}/api`,
            headers: { "x-auth-token": token_data },
        });
    else
        return axios.create({
            baseURL: `${BACKEND_URI}/api`,
        });
};


export const handleResponse = (res:any) => {
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

export const handleError = (err: any) => {
    console.log("handle error: ", err);
    return null;
};

// let data = JSON.stringify({ 
//   "name": "John Doe",
//   "email": "john@example.com",
//   "password": "password123"
// });

// export const registerUser:any=() => {
// let config = {
//   method: 'post',
//   maxBodyLength: Infinity,
//   url: urlJoin(process.env.NEXT_PUBLIC_SERVER_URL||'http://localhost:5000','/api/auth/register'),
//   headers: {
//     'Content-Type': 'application/json'
//   },
//   data : data
// };
// let userToken:any;
// axios.request(config)
// .then((response:any) => {
//     userToken = response?.data?.token;
//   console.log(JSON.stringify(response.data));
// })
// .catch((error: any) => {
//   console.log(error);
// });
// return userToken;
// }
