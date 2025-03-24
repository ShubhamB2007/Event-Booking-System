import axios from 'axios'

const api = axios.create({
    baseURL: 'http://192.168.0.106:3000/api/login'
})

export const googleAuth = (code) => api.post("/google", { code });

