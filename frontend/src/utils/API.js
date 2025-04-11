import axios from "axios";

const api = axios.create({
     baseURL: window.location.origin,
})

console.log(window.location.origin);

export default api;
