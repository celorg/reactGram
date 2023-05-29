import axios from "axios";

export const api = axios.create({
    baseURL: "http://192.168.78.10:5000/api"
})