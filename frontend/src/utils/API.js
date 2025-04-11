import axios from "axios";

const api = axios.create({
    //baseURL: "http://backand:8585/",
    baseURL: Process.env.API_BASE_URL,
})

export default api;
