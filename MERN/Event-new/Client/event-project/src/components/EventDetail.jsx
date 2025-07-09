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
    <div className='w-full h-full flex flex-col items-center justify-start bg-[#f6f6f6]'>

  {/* Loader */}
  {!event && (
    <div className="loader my-32">
      <div className="circle"></div>
      <div className="circle"></div>
      <div className="circle"></div>
      <div className="circle"></div>
    </div>
  )}

  {/* Main Container */}
  {event && (
    <div className='flex flex-col lg:flex-row w-full h-full'>

      {/* Left: Event Image */}
      <motion.div
        variants={ImageVariants}
        initial='hidden'
        animate='visible'
        className='w-full lg:w-1/2 h-96 lg:h-screen'
      >
        <img
          src={
            event.image?.includes('uploads')
              ? `https://event-backend-s1hg.onrender.com${event.image}`
              : event.image
          }
          alt="Event"
          className='w-full h-full object-cover'
        />
      </motion.div>

      {/* Right: Event Details */}
      <motion.div
        variants={TextVariants}
        initial='hidden'
        animate='visible'
        className='w-full lg:w-1/2 px-6 lg:px-12 py-8 lg:py-12 border-t lg:border-t-0 lg:border-l-4 border-[#e24718] relative'
      >
        {/* Back Button */}
        <FaAngleLeft
          onClick={() => navigate('/')}
          className='text-black cursor-pointer text-2xl font-bold mb-4'
        />

        {/* Header Row */}
        <div className='flex justify-between items-center mb-6'>
          <h1 className='text-2xl font-bold text-black truncate w-2/3'>
            {event?.name}
          </h1>
          <button
            onClick={handleShow}
            className='px-4 py-2 text-white bg-[#e24718] rounded-lg hover:bg-[#e24718d6] transition'
          >
            Book Now
          </button>
        </div>

        {/* Date & Venue */}
        <div className='flex items-start gap-3 text-gray-800 mb-4'>
          <SlCalender className='text-2xl' />
          <div>
            <p className='font-semibold'>{event?.date}</p>
            <p className='text-sm'>
              {event?.venue?.name || 'Venue not available'}
            </p>
            <p className='text-sm'>11:00 AM - 9:00 PM</p>
          </div>
        </div>

        {/* Description */}
        <div>
          <h2 className='text-xl font-bold text-black mb-2'>About</h2>
          <p className='text-gray-800 text-sm'>{event?.description}</p>
        </div>
      </motion.div>
    </div>
  )}

  {/* Booking Modal */}
  {show && (
    <motion.div
      variants={BookVariants}
      initial='hidden'
      animate='visible'
      className='fixed top-20 lg:top-24 z-50 bg-[#141414] text-white w-[90%] max-w-5xl rounded-xl shadow-lg p-6 lg:p-10 flex flex-col lg:flex-row gap-8'
    >
      {/* Left - Booking Info */}
      <div className='flex-1 flex flex-col gap-4'>
        <h3 className='text-lg lg:text-xl font-semibold mb-2'>Booking Details</h3>

        <div className='border border-gray-500 rounded-lg p-3 flex justify-between items-center'>
          <span className='text-sm lg:text-base'>Ticket Price:</span>
          <span className='font-bold text-[#e24718]'>{event.price}</span>
        </div>

        <div className='border border-gray-500 rounded-lg p-3 flex justify-between items-center'>
          <span className='text-sm lg:text-base'>Ticket Quantity:</span>
          <select
            onChange={handleQuantityChange}
            value={quantity}
            className='bg-black border border-gray-500 rounded-md text-white p-1 w-16 text-sm'
          >
            {[1, 2, 3, 4].map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
        </div>

        <div className='border border-gray-500 rounded-lg p-3 flex justify-between items-center'>
          <span className='text-sm lg:text-base'>Total Amount:</span>
          <span className='font-bold text-[#e24718]'>{event.price * quantity}</span>
        </div>
      </div>

      {/* Right - Payment Info */}
      <div className='flex-1 flex flex-col gap-4'>
        <h3 className='text-lg lg:text-xl font-semibold mb-2'>Payment Details</h3>

        <input
          type='text'
          name='number'
          onChange={handleChange}
          placeholder='Enter Card Number'
          className='border border-gray-500 bg-transparent text-white rounded-lg p-2 text-sm lg:text-base'
        />
        <input
          type='text'
          name='name'
          onChange={handleChange}
          placeholder='Enter Your Full Name'
          className='border border-gray-500 bg-transparent text-white rounded-lg p-2 text-sm lg:text-base'
        />
        <input
          type='text'
          name='CVV'
          onChange={handleChange}
          placeholder='Enter Your CVV'
          className='border border-gray-500 bg-transparent text-white rounded-lg p-2 text-sm lg:text-base'
        />
      </div>

      {/* Actions */}
      <div className='flex flex-col gap-2 justify-end w-full lg:w-auto lg:items-end lg:justify-between mt-4 lg:mt-0'>
        <button
          onClick={handleBookNow}
          className='bg-[#e24718] hover:bg-[#e24718cc] transition text-white font-semibold py-2 px-6 rounded-lg w-full lg:w-48'
        >
          Book Now
        </button>
        <button
          onClick={() => setShow(false)}
          className='bg-red-600 hover:bg-red-700 transition text-white font-semibold py-2 px-6 rounded-lg w-full lg:w-48'
        >
          Cancel
        </button>
      </div>
    </motion.div>
  )}
</div>

  );
};

export default EventDetail;
