import axios from "axios";

const api = axios.create({
    // baseURL: "http://127.0.0.1:8585",
   baseURL: "http://backend:8585",
})

console.log("current ip : ",window.location.hostname+":8585");

export default api;
