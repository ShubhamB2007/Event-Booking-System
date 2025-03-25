import React from 'react'
import { useNavigate } from 'react-router-dom'
import { MdDelete } from "react-icons/md"
import axios from 'axios'
import { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { toast } from 'react-toastify'; 


const Organizer = () => {

  const [events, setEvents] = useState([])
  const email = localStorage.getItem('email')

  useEffect(() => {
    const loadEvents = async () => {
      try {
          const res = await axios.get(`http://localhost:3000/api/events/email/${email}`)
          setEvents(res.data);
          console.log(res.data)
      } catch (error) { 
          console.error("Error fetching events:", error.message);
      }   
  };
  loadEvents()
  }, [])

  const handleDelete = async(id)=>{
    try {
      const res = await axios.delete(`http://localhost:3000/api/events/email/${email}/${id}`)
      console.log(res.data)
      setEvents((prevEvents) => prevEvents.filter((item) => item._id !== id));
      toast.success('Event Deleted Successfully', { position: "top-right" })
    } catch (error) {
      console.log(error)
    }
  }

  const ProductVariants = {
    hidden:{
      opacity:0,y:-10
    },
    visible:(index)=>({
      opacity:1, y:0,
      transition:{delay: index * 0.2, duration:0.3}
    })
  }

  const navigate = useNavigate() 
  return (
    <div className='absolute w-full h-[1100px] flex justify-center'>
        <button className='bg-[#e24718] font-semibold w-40 h-12 text-white rounded-lg absolute top-10' onClick={()=>navigate('/create-event')}>Create New Event</button>
        <div className='w-[360px] lg:w-[1280px] absolute top-28 min-h-[600px] justify-center gap-y-3 lg:gap-3 lg:grid lg:grid-cols-3 grid grid-cols-2 ml-6 lg:ml-10'>
            { events.map((event,index)=>{
           return (<motion.div 
            variants={ProductVariants} initial='hidden' animate='visible' custom={index}
             key={index} className='cursor-pointer w-40 lg:w-72 h-[270px] lg:h-[410px] border rounded-lg relative bg-white shadow-lg'>
              {console.log(`Final Image Source for Event ${event._id}:`, event.image.startsWith('/') ? `http://localhost:3000${event.image}` : event.image)}
                <img  onClick={()=>navigate(`/event-detail/${event._id}`)} src={event.image.includes('uploads') ? `http://localhost:3000${event.image}` : event.image}  alt="" className='rounded-lg w-full h-[200px] lg:h-80 object-cover brightness-90' />
                   <div className='w-16 h-6 absolute text-white bg-[#e24718] rounded-lg text-xs flex justify-center items-center font-bold top-1 left-2'>{event.category}</div>
                   <div className='absolute w-full top-48 lg:top-80 h-[90px]'>
                      <div className='flex flex-col ml-2 lg:ml-4'>
                         <p className='absolute lg:top-1 top-3 text-xs lg:text-sm text-[#e24718]'>By Admin</p>
                         <p className='absolute lg:top-7 top-8 text-sm lg:text-xl font-bold'>{event.name}</p>
                         <p className='absolute top-11 lg:top-12 mt-2 lg:text-base text-sm'>{event.date}</p>
                        </div>  
                      </div>
                <MdDelete onClick={()=>handleDelete(event._id)} className='text-black text-lg lg:text-2xl absolute top-56 font-bold left-32 lg:left-60 lg:top-[350px] cursor-pointer' />
            </motion.div> );
            })}
        </div>
    </div>
  )
}

export default Organizer