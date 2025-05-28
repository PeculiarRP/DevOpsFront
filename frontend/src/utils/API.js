import axios from "axios";

const api = axios.create({
    // baseURL: "http://127.0.0.1:8585",
   baseURL: "http://localhost:8585",
})

console.log("current ip : http://localhost:8585");

export default api;
