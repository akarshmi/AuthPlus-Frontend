import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const rawApi = axios.create({
    baseURL: `${BASE_URL}/api/v1`,
    withCredentials: true
});

export default rawApi;
