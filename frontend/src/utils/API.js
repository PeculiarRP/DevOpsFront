import axios from "axios";

const api = axios.create({
    baseURL: "http://backand:8585",
})

export default api;
