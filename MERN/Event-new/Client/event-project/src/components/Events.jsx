import React from 'react' 
import {fetchEvents} from '../services/eventService'
import { FaAngleLeft } from "react-icons/fa6";
import { GrFavorite } from "react-icons/gr";
import { useLocation,useNavigate } from 'react-router-dom';
import { useState,useEffect } from 'react';
import { motion } from "framer-motion";
 
const Events = () => { 

  useEffect(() => {
    const loadEvents = async () => {
      try {
          const data = await fetchEvents();
          setEvents(data);
      } catch (error) {
          console.error("Error fetching events:", error.message);
      }  
  };
  loadEvents()
  }, [])
  
  const navigate = useNavigate()
  const location = useLocation()
  const [events, setEvents] = useState([])
  const [filteredEvents, setFilteredEvents] = useState(events)
  const selectedcategory = location.state?.category || '';
+
  useEffect(() => {
     if(selectedcategory){
      setFilteredEvents(events.filter(event => event.category.toLowerCase() === selectedcategory.toLowerCase()))
     } else { 
       setFilteredEvents(events)
     }
  }, [selectedcategory,events])

  const ProductVariants = {
    hidden:{
      opacity:0,y:-10
    },
    visible:(index)=>({
      opacity:1, y:0,
      transition:{delay: index * 0.2, duration:0.3}
    }) 
  }
  

  return (
    <div className='w-full lg:w-[1521px] h-[1100px] absolute'>
       <FaAngleLeft onClick={()=>navigate('/')} className='absolute text-black text-3xl left-5 top-5' />
       <p className='font-bold text-black text-2xl absolute left-16 top-5'>All Events</p>
       <div className='w-full lg:w-[1150px] top-20 left-[17px] lg:left-52 absolute h-[600px] grid grid-cols-2 lg:grid-cols-3 gap-y-6 lg:gap-y-8'>
        {filteredEvents.map((event,index)=>(
        <motion.div onClick={()=> navigate(`/event-detail/${event._id}`)} key={index} 
        variants={ProductVariants} initial='hidden' animate='visible' custom={index}
        className='cursor-pointer w-40 lg:w-72 h-[270px] lg:h-[410px] border rounded-lg relative bg-white shadow-lg'>
          <img  src={event.image.includes('uploads') ? `http://localhost:3000${event.image}` : event.image} alt="" className='rounded-lg w-full h-[200px] lg:h-80 object-cover brightness-90' />
          <div className='w-16 h-6 absolute text-white bg-[#e24718] rounded-lg text-xs flex justify-center items-center font-bold top-1 left-2'>{event.category}</div>
          <div className='absolute w-full top-48 lg:top-80 h-[90px]'>
              <div className='flex flex-col ml-2 lg:ml-4'>
               <p className='absolute lg:top-1 top-3 text-xs lg:text-sm text-[#e24718]'>By Admin</p>
               <p className='absolute lg:top-7 top-8 text-sm lg:text-xl font-bold'>{event.name}</p>
               <p className='absolute top-11 lg:top-12 mt-2 lg:text-base text-sm'>{event.date}</p>
            </div>
                </div>
       </motion.div>
       ))} 
      </div>
    </div>
  )
}

export default Events
