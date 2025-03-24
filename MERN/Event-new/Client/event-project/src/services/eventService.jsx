import axios from "axios"; 

export const fetchEvents = async(searchQuery = "")=>{
   const URL = `http://https://event-backend-s1hg.onrender.com/api/events?search=${searchQuery}`
   const res = await axios.get(URL)
   return res.data   
} 
export const fetchEventById = async(id)=>{
   const URL = `https://event-backend-s1hg.onrender.com/api/events/id`
   const res = await axios.get(`${URL}/${id}`)
   return res.data
}
export const createEvent = async(eventData)=>{
   const res = await axios.post(URL, eventData)
   return res.data
}
