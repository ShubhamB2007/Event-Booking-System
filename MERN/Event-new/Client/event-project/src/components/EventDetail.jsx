import React, { useState, useEffect } from 'react';
import { SlCalender } from "react-icons/sl";
import { FaAngleLeft } from "react-icons/fa6";
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { fetchEventById } from '../services/eventService';
import axios from 'axios';
import { motion } from "framer-motion"; 
import { toast } from 'react-toastify'; 


const EventDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams()
  const [show, setShow] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [ticketData, setTicketData] = useState({});
  const [event, setEvent] = useState()
  const [user, setUser] = useState(localStorage.getItem("id"))
  const [paymentData, setPaymentData]= useState({
    number: "",
    name:"",
    CVV:""
  })

  useEffect(() => {
      const loadEvents = async () => {
        try {
            const data = await fetchEventById(id);
            // console.log(data)
            setEvent(data);
        } catch (error) {
            console.error("Error fetching events:", error.message);
        }  
    };
    loadEvents()
    }, [id])
  

  const handleChange = (e)=>{
    setPaymentData({...paymentData, [e.target.name]: e.target.value})
  }

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

  const handleShow = () => {
    const currentUser = localStorage.getItem("id");
    console.log(currentUser)
    if (!currentUser || currentUser === "null" || currentUser === "undefined") {
      toast.error("Login First To Book Events", { position: "top-right" });
      setShow(false);
    } else {
      setShow(true);
    }
  };
  

  const handleBookNow = async () => {

    if (!paymentData.number || !paymentData.name || !paymentData.CVV) {
      toast.error("Please fill in all payment details!", { position: "top-right" });
      return;
    }
  
    const cardNumberRegex = /^\d{13,19}$/;
    if (!cardNumberRegex.test(paymentData.number)) {
      toast.error("Please enter a valid card number!", { position: "top-right" });
      return;
    }
  
    const nameRegex = /^[A-Za-z ]+$/;
    if (!nameRegex.test(paymentData.name)) {
      toast.error("Please enter a valid name (letters only)!", { position: "top-right" });
      return;
    }
  
    const cvvRegex = /^\d{3,4}$/;
    if (!cvvRegex.test(paymentData.CVV)) {
      toast.error("Please enter a valid CVV (3 or 4 digits)!", { position: "top-right" });
      return;
    }  

    const ticketData = {
      name: event.name,
      price: event.price,
      quantity,
      totalPrice: quantity * event.price,
      eventId: event._id,
      image: event.image,
      userId: localStorage.getItem('id')
    };
  
    console.log("Final Ticket Data:", ticketData);
    try {
      const res = await axios.post('https://event-backend-s1hg.onrender.com/api/events/booking', ticketData);
      console.log("Booking Done:", res.data);
      navigate('/booking-list');
      toast.success('Your Booking is Added!', { position: "top-right" })
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
        <button onClick={handleShow} className='w-32 h-8 text-white bg-[#e24718] rounded-lg absolute top-5 left-60 lg:left-[585px]'>Book Now</button>
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
        className='w-[85%] lg:w-[45%] lg:top-32 h-36 lg:h-[420px] bg-[#141414] rounded-lg absolute top-52 text-white flex'>
          <div className='w-[50%] h-[63%] border-r-2 border-gray-500 flex flex-col items-center gap-4 mt-10 pt-10 pr-1'>
            <p className='text-xl absolute top-9 font-semibold'>Booking Details</p>
           <div className='w-72 h-12 border flex justify-between items-center gap-2 border-gray-500 rounded-lg p-3'> 
          <p className='text-lg ml-0 mt-[12px]'>Ticket Price:</p>
          <p className='font-bold text-[#e24718] text-lg mt-[13px]'>{event.price}</p>
          </div>
          <div className='w-72 h-12 border flex items-center gap-2 border-gray-500 rounded-lg p-3 justify-between'>
          <p className='text-lg mt-[12px]'>Ticket Quantity:</p>
          <select
            onChange={handleQuantityChange}
            className='bg-black border rounded-lg w-12'
            value={quantity}
          >
            {[1, 2, 3, 4].map((num) => (
              <option key={num} className='bg-black text-white' value={num}>{num}</option>
            ))}
          </select>
          </div>
          <div className='w-72 h-12 border flex items-center gap-2 border-gray-500 rounded-lg p-3 justify-between'>
            <p className='text-lg mt-[12px]'>Total Amount:</p>
            <p className='font-bold text-[#e24718] text-lg mt-[14px]'>{event.price * quantity}</p>
          </div>
          </div>

         <div className='w-[50%] h-[63%] mt-10 flex flex-col items-center gap-4 pt-10'>
            <p className='text-xl absolute top-9 font-semibold'>Payment Details</p>
            <input type="text" name='number' onChange={handleChange} className='w-72 h-12 border border-gray-500 bg-transparent rounded-lg pl-5 pb-1' placeholder='Enter Debit/Credit Card No.' />
            <input type="text" name='name' onChange={handleChange} className='w-72 h-12 border border-gray-500 bg-transparent rounded-lg pl-5 pb-1' placeholder='Enter Your Full Name' />
            <input type="text" name='CVV' onChange={handleChange} className='w-72 h-12 border border-gray-500 bg-transparent rounded-lg pl-5 pb-1' placeholder='Enter Your CVV' />
         </div>
  

          <button
            onClick={handleBookNow}
            className='text-white font-bold bg-[#e24718] w-32 lg:w-48 lg:h-12 h-7 rounded-lg absolute lg:left-[140px] lg:top-[330px] top-[305px] left-52 hover:bg-[#e24718d4] hover:duration-200'
          >
            Book Now
          </button>
          <button
            onClick={() => setShow(false)}
            className='bg-red-600 w-20 h-6 text-sm lg:w-48 lg:h-12 font-semibold lg:text-base rounded-lg absolute left-[40%] top-24 lg:left-[51.4%] lg:top-[330px] hover:bg-red-700 hover:duration-200'
          >
            Cancel
          </button>
        </motion.div>
      }
    </div>
  );
};

export default EventDetail;
