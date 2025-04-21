import axios from 'axios'

const api = axios.create({
    baseURL: 'https://event-backend-s1hg.onrender.com/api/login'
})

export const googleAuth = (code) => api.post("/google", { code });

