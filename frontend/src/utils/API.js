import axios from "axios";

const api = axios.create({
     baseURL: window.location.origin,
})

console.log("current host/port : ",window.location.origin);

export default api;
