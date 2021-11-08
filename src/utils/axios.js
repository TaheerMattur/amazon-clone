import axios from "axios";

const instance = axios.create({
    baseURL: "http://localhost:5001/clone-e74d0/us-central1/api",
});

// http://localhost:5001/clone-e74d0/us-central1/api

export default instance;