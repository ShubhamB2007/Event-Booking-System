import React, { useState, useEffect } from 'react';
import { SlCalender } from "react-icons/sl";
import { FaAngleLeft } from "react-icons/fa6";
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { fetchEventById } from '../services/eventService';
import axios from 'axios';
import { motion } from "framer-motion"; 

const EventDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams()
  const [show, setShow] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [ticketData, setTicketData] = useState({});
  const [event, setEvent] = useState()

  useEffect(() => {
      console.log(id)

      const loadEvents = async () => {
        try {
            const data = await fetchEventById(id);
            console.log(data)
            setEvent(data);
        } catch (error) {
            console.error("Error fetching events:", error.message);
        }  
    };
    loadEvents()
    }, [id])
  

  const handleQuantityChange = (e) => {
    const newQuantity = Number(e.target.value);
    setQuantity(newQuantity);

    if(event){
    setTicketData({
      name: event.name,
      price: event.price,
      quantity,
      totalPrice: quantity * event.price,
      eventId: event._id,
      image: event.image,
    })}
  }; 

  useEffect(() => {
    window.scrollTo({top:0, behavior:'smooth'})
  }, [])
  

  const handleBookNow = async () => {
    const ticketData = {
      name: event.name,
      price: event.price,
      quantity,
      totalPrice: quantity * event.price,
      eventId: event._id,
      image: event.image,
    };
  
    console.log("Final Ticket Data:", ticketData);
    try {
      const res = await axios.post('https://event-backend-s1hg.onrender.com/api/events/booking', ticketData);
      console.log("Booking Done:", res.data);
      navigate('/booking-list');
    } catch (error) {
      console.log(error.message); 
    }
  };

  const BookVariants = {
    hidden:{
      opacity:0,y:20
    },
    visible:{
      opacity:1, y:0,
      transition:{delay: 0.1, duration:0.5}
    }
  }

  const TextVariants = {
    hidden:{
      opacity:0,x:100
    },
    visible:{
      opacity:1, x:0,
      transition:{delay: 0.5, duration:0.5, type:'spring'}
    }
  }

  const ImageVariants = {
    hidden:{
      opacity:0,x:-100
    },
    visible:{
      opacity:1, x:0,
      transition:{delay: 0.5, duration:0.5, type:'spring'}
    }
  }


  
  return ( 
    <div className='w-full h-full absolute flex justify-center'>
   
    {(!event)&&(
      <div className="loader absolute top-64">
      <div className="circle"></div>
      <div className="circle"></div>
      <div className="circle"></div>
      <div className="circle"></div>
   </div>
    )}

      <div className='w-full h-96 absolute lg:h-full lg:w-[50%] lg:left-0'>
        {event && (
        <motion.img 
        variants={ImageVariants} initial='hidden' animate='visible'
        img src={event?.image?.includes('uploads') ? `http://localhost:3000${event.image}` : event.image}  alt="" className='absolute w-full h-full object-cover' />
      )}
      </div>

      <FaAngleLeft onClick={() => navigate('/')} className='text-black cursor-pointer text-2xl font-bold x-10 absolute top-4 left-4' />

      <motion.div 
      variants={TextVariants} initial='hidden' animate='visible'
      className='border w-full min-h-96 absolute top-96 lg:h-full lg:w-[50%] lg:left-[50%] lg:top-0 lg:border-l-4'>
        <button onClick={() => setShow(true)} className='w-32 h-8 text-white bg-[#e24718] rounded-lg absolute top-5 left-60 lg:left-[585px]'>Book Now</button>
        <p className='text-2xl font-bold text-black absolute top-5 left-7 lg:w-96 w-52 whitespace-nowrap text-ellipsis overflow-hidden h-9'>{event?.name}</p>
        <div className='text-white w-44 absolute top-16 left-5 min-h-[56px] flex items-center'>
          <SlCalender className='text-3xl font-bold absolute left-3 text-gray-800 mb-3' />
          <p className='absolute top-1 left-[56px] text-gray-800'>{event?.date}</p>
          <p className='relative top-2 left-[56px] text-xs text-gray-800 mt-1'>
             {event?.venue?.name || "Venue not available"}
           </p>
        </div>
        <p className='text-gray-800 text-sm absolute top-20 left-60 lg:left-[585px]'>11:00 AM - 9:00 PM</p>

        <div className='w-full absolute top-32 h-56'>
          <p className='absolute text-black font-bold text-2xl top-3 left-7'>About</p>
          <div className='w-[87%] h-44 absolute top-12 left-7 overflow-hidden'>
            <p className='text-gray-800 text-sm text-ellipsis'>{event?.description}</p>
          </div>
        </div>
      </motion.div>

      {show &&
        <motion.div 
        variants={BookVariants} initial='hidden' animate='visible'
        className='w-[85%] lg:w-[30%] lg:top-66 h-36 bg-[#141414] rounded-lg absolute top-52 text-white'>
          <p className='text-lg absolute top-3 left-6'>Ticket Price:</p>
          <p className='font-bold text-[#e24718] absolute top-4 left-32'>{event.price}</p>
          <p className='absolute top-4 left-44 lg:left-64'>Ticket Quantity:</p>
          <select
            onChange={handleQuantityChange}
            className='bg-black border rounded-lg w-12 absolute left-72 lg:left-[370px] top-4'
            value={quantity}
          >
            {[1, 2, 3, 4].map((num) => (
              <option key={num} className='bg-black text-white' value={num}>{num}</option>
            ))}
          </select>
          <div className='flex gap-2 absolute top-[55px] text-lg left-6'>
            <p>Total Amount:</p>
            <p className='font-bold text-[#e24718]'>{event.price * quantity}</p>
          </div>
          <button
            onClick={handleBookNow}
            className='text-white font-bold bg-[#e24718] w-32 h-7 rounded-lg absolute lg:left-[270px] top-[55px] left-52'
          >
            Book Now
          </button>
          <button
            onClick={() => setShow(false)}
            className='bg-red-600 w-20 h-6 text-sm rounded-lg absolute left-[40%] top-24'
          >
            Cancel
          </button>
        </motion.div>
      }
    </div>
  );
};

export default EventDetail;
