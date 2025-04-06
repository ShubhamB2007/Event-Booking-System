import React, { useContext, useRef } from 'react'
import { IoSearch } from "react-icons/io5";
import { FaAngleRight } from "react-icons/fa6";
import { GrFavorite } from "react-icons/gr";
import { useNavigate } from 'react-router-dom';
import {fetchEventByName, fetchEvents} from '../services/eventService'
import { useState,useEffect } from 'react';
import { SearchContext } from '../context/SearchContext';
import Hero from './Hero';
import Category from './Category';
import { motion, useInView } from "framer-motion";
import axios from 'axios';


const Home = () => {

  const { searchQuery ,setSearchQuery, currentTime } = useContext(SearchContext)

  const [role, setRole] = useState('User')
  const [events, setEvents] = useState([])
  const [userName, setUserName] = useState('')
  const [searchData, setSearchData] = useState([])
  const [show, setShow] = useState(false)
  const navigate = useNavigate()
  const [suggested, setSuggested] = useState()
  const [suggestedEvents, setSuggestedEvents] = useState([])

  const handleSearch = (item)=>{
    navigate(`/event-detail/${item._id}`)
    setSearchQuery(null)
  }

   useEffect(() => {
     const name = localStorage.getItem('userName')
     const role = localStorage.getItem('role')
     if(name){
      setUserName(name)
     }
     if(role){
      setRole(role)
     }
   }, [])

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
  
  useEffect(() => {
    const loadEvents = async () => {
      try {
          const data = await fetchEvents(searchQuery);
          setSearchData(data);
          // console.log(searchData)
      } catch (error) {
          console.error("Error fetching events:", error.message);
      }  
  };
  loadEvents()
  }, [searchQuery])

  const fetchSuggestionAndEvents = async()=>{
    const userId = localStorage.getItem('id')
    let fallbackUsed = true;

    if (!userId) {
      console.log("User not logged in. Showing default suggestions.");
      const initialEvents = ['Euro Final 2024', 'Cricket CWC Final 23', 'Aladdin'];
      const initialEventsData = await Promise.all(
        initialEvents.map((name) => fetchEventByName(name))
      );
      setSuggestedEvents(initialEventsData.flat());
      console.log("Fallback Events (no user):", initialEventsData.flat());
      return;
    }
  

    let retries = 3;
    let delay = 40000;

    for (let i = 0; i < retries; i++) {
    try {
      const res = await axios.post('https://event-backend-s1hg.onrender.com/api/events/suggest-events', {userId})
      const suggestionNames = res.data.suggestions;
      console.log(suggestionNames)

      if (!suggestionNames || suggestionNames.length === 0) {
        throw new Error("Empty suggestions list");
      }
      const events = await Promise.all(
        suggestionNames.map((name) => fetchEventByName(name))
      );
 
      setSuggestedEvents(events.flat());  
     console.log("Suggested Events (full data):", events.flat());

    } catch (error) {
      console.error("Failed to fetch AI suggestions:", error);

      if (error.response?.status === 404 || fallbackUsed) {
        console.log("Using fallback events.");
        const initialEvents = ['Euro Final 2024', 'Cricket CWC Final 23', 'Aladdin'];
        const initialEventsData = await Promise.all(
          initialEvents.map((name) => fetchEventByName(name))
        );
        setSuggestedEvents(initialEventsData.flat());
        console.log("Fallback Events:", initialEventsData.flat());
        return;
      }

      if (error.response?.status === 429 && i < retries - 1) {
        console.log(`Retrying in ${delay / 1000} seconds...`);
        await new Promise((res) => setTimeout(res, delay));
        delay *= 2;
      } else {
        return;
      }
    }    
}}

  useEffect(()=>{
    fetchSuggestionAndEvents()
  },[])  

  const goToEvents = ()=>{
    navigate('/events')
  }


  const LogOut =()=>{
    localStorage.removeItem('token')
    localStorage.removeItem('userName')
    localStorage.removeItem('role')
    localStorage.removeItem('email')
    localStorage.removeItem('id')
    window.location.href = '/login'
  }

  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { triggerOnce: false, threshold: 0.2 })

  const ProductVariants = { 
    hidden:{
      opacity:0,x:-30
    },
    visible:(index)=>({
      opacity:1, x:0,
      transition:{delay: index * 0.5, duration:0.5}
    })
  }

  const FooterVariants = {
    hidden:{
      opacity:0, y:20
    },
    visible:{
      opacity:1, y:0,
      transition:{delay:1.5, duration:0.5}
    }
  }
 
  return ( 
    <div className='w-full h-[1000px] lg:h-[1700px] flex justify-center'>
      <div className='w-full lg:h-16 h-36 bg-white z-50'>
        <div className='flex lg:gap-4 lg:justify-start justify-between items-center absolute top-4 left-6 lg:w-[500px] w-[345px]'>
        <p className='text-black font-semibold text-sm lg:text-lg lg:w-60 w-44'>{userName ? `Hello, ${userName }`:'Hello Guest'}</p>
        <div className='flex gap-2'>
        { userName?
         <button onClick={LogOut} className='bg-[#e24718] text-white lg:text-base text-[10px] font-semibold w-20 lg:w-28 h-9 rounded-xl mb-3 lg:ml-2 ml-1'>{'Log Out'}</button>:
        <button onClick={()=>navigate('/login')} className='bg-[#e24718] text-white mb-3 font-semibold lg:text-base text-[10px] w-20 h-9 lg:g:w-28 rounded-xl lg:ml-2 ml-1'>{'Log In'}</button>
       }
       { role === 'Organizer' &&
       <button onClick={()=>navigate('/organize-event')} className='lg:w-36 w-24 lg:text-base text-[10px] h-9 lg:h-9 rounded-xl bg-[#e24718] text-white font-semibold mb-3'>Organize Event</button>
      }
         </div>
        </div>
        
        <div className='w-[87%] lg:w-[35%] lg:top-3 lg:left-[60%] left-6 border-[#e24718] border-2 h-[50px] lg:h-10 absolute top-20 rounded-lg flex items-center'>
          <IoSearch className='text-black text-xl absolute left-4' />
           <input onChange={(e)=>setSearchQuery(e.target.value)} type="text" className='absolute left-12 w-64 h-full bg-transparent pl-2 text-black font-semibold outline-none' placeholder='Search For Events...' />
        </div>
        {searchQuery && (
        <div className='lg:w-[35%] lg:left-[60%] left-6 w-[87%] bg-white rounded-lg h-28 lg:h-52 absolute top-32 lg:top-12 mt-1 overflow-y-auto pt-2 font-semibold'>
           {searchData.map((item,index)=>(
             <div key={index} onClick={()=>handleSearch(item)} className='w-full h-10 flex items-center border border-neutral-800 pl-10 cursor-pointer hover:bg-neutral-100 hover:duration-200'>{item.name}</div>
           ))} 
           {searchData.length === 0 && (
            <div className='absolute text-black font-semibold top-10 lg:top-20 left-28 lg:left-52'>No Match Found</div>
           )}
        </div>
        )} 
      </div>

        <Hero/> 
        <Category/>  

        <div ref={sectionRef} className='absolute w-full min-h-[450px] lg:top-[1050px] top-[530px] flex justify-center'>
           <div className='w-[85%] lg:w-[80%] flex absolute top-4 lg:ml-20'>
              <p className='text-black font-bold lg:text-2xl text-lg absolute lg:left-5'>Suggested Events</p>
              <button onClick={goToEvents} className='w-20 lg:h-8 h-6 rounded-full text-white text-sm font-semibold top-[2px] bg-[#e24718] absolute left-40 lg:left-56'>See all</button>
              <div  className='w-full min-h-[388px] absolute top-11 lg:left-4 grid grid-cols-3 gap-x-6 gap-y-2 lg:gap-x-0 lg:gap-y-4'>
                {suggestedEvents.map((event,index)=>( 
                <motion.div
                variants={ProductVariants} initial='hidden' animate={isInView ? 'visible' : 'hidden'} custom={index} 
                onClick={()=>navigate(`/event-detail/${event._id}`)}
                key={index}
                className='cursor-pointer w-24 lg:w-72 h-44 lg:h-[410px] border rounded-lg relative bg-white shadow-lg'>
                <img src={event.image?.includes('uploads') ? `https://event-backend-s1hg.onrender.com${event.image}` : event.image} alt="" className='rounded-lg w-full lg:h-80 h-32 object-cover brightness-90' />
                <div className='lg:w-16 lg:h-6 h-4 w-12 absolute text-white bg-[#e24718] rounded-lg lg:text-xs text-[8px] flex justify-center items-center font-bold top-1 left-2'>{event.category}</div>
                <div className='absolute w-full lg:top-80 top-32 h-[90px]'>
                  <div className='flex flex-col lg:ml-4 ml-2'>
                   <p className='absolute lg:top-1 top-1 text-[7px] lg:text-sm text-[#e24718]'>By Admin</p>
                   <p className='absolute lg:top-7 top-[16px] text-[9px] lg:text-xl font-bold'>{event.name}</p>
                   <p className='absolute lg:top-12 top-[22px] mt-2 lg:text-base text-[9px]'>{event.date}</p>
                   </div>
                </div>
             </motion.div>
                ))}
              </div>
           </div> 
        </div>   

        <motion.footer
        variants={FooterVariants} initial='hidden' animate={isInView ? 'visible': 'hidden'}
        className="bg-white rounded-lg shadow-sm m-4 absolute top-[800px] lg:top-[1550px]">
            <div className="w-full mx-auto max-w-screen-xl p-4 md:flex md:items-center md:justify-between relative h-24">
              <span className="text-sm sm:text-center">© 2025 <a href="https://event-frontend-ekff.onrender.com" className="hover:underline text-[#e24718]">EventBooking™</a>. All Rights Reserved.
            </span>
            <ul className="flex gap-3 items-center mt-2 lg:mb-2 text-xs lg:text-sm font-medium relative lg:right-4 right-7">
                <li>
                    <a href="#" className="hover:underline text-[#e24718]">About</a>
                </li>
                <li>
                    <a href="#" className="hover:underline text-[#e24718]">Privacy Policy</a>
                </li>
                <li>
                    <a href="#" className="hover:underline text-[#e24718]">Licensing</a>
                </li>
                <li>
                    <a href="#" className="hover:underline text-[#e24718]">Contact</a>
                </li>
            </ul>
            </div>
        </motion.footer>

    </div>
  )
}

export default Home
