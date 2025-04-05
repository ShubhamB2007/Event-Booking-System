import axios from 'axios'

const api = axios.create({
    baseURL: 'http://localhost:3000/api/login'
})

export const googleAuth = (code) => api.post("/google", { code });

