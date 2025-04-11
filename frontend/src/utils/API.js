import axios from "axios";

const api = axios.create({
    //baseURL: "http://backand:8585/",
    baseURL: process.env.REACT_APP_BASE_URL || "http://localhost:8585",
})

export default api;
