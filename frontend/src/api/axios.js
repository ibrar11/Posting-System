import axios from "axios";

const base_URL = 'http://localhost:3500';

export default axios.create({
    baseURL: base_URL
});

export const axiosPrivate = axios.create({
    baseURL: base_URL,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true
});