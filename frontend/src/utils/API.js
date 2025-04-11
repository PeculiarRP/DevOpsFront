import axios from "axios";

const api = axios.create({
     baseURL: window.location.hostname +':8585',
})

console.log("current host/port : ",window.location.origin);

export default api;
