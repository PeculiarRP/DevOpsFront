import axios from "axios";

const api = axios.create({
   // baseURL: "http://backand:8585/",
     baseURL: "http://api/",
})

export default api;
