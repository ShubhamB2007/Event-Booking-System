import React, { useEffect,useState } from 'react'
import axios from 'axios'
import { FaAngleLeft } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';
import { MdDelete } from "react-icons/md";
import { motion } from "framer-motion";
import { toast } from 'react-toastify'; 
import { MdArrowBackIos } from "react-icons/md";
import { useWindowSize } from 'react-use'
import Confetti from 'react-confetti'

const BookingList = () => {
   
  const navigate = useNavigate()
  const [list, setList] = useState([])
  const user = localStorage.getItem('id')
  const { width, height } = useWindowSize()
  const [showConfetti, setShowConfetti] = useState(true);
    
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowConfetti(false); 
    }, 5000);
    return () => clearTimeout(timer); 
  }, []);

  useEffect(() => {
    const loadList = async()=>{
    try { 
      const res = await axios.get(`https://event-backend-s1hg.onrender.com/api/events/booking?user=${user}`)
      console.log(res.data)
      setList(res.data)
    } catch (error) {
      console.log(error.message)
    }}
    loadList(); 
  }, [])

  const handleDelete = async(id)=>{
   try {
    const res = await axios.delete(`https://event-backend-s1hg.onrender.com/api/events/booking/${id}`)
    console.log(res.data)
    toast.success('Booking Deleted Successfully!', { position: "top-right" })
    setList((prevList) => prevList.filter((item) => item._id !== id));
   } catch (error) {
    console.log(error)
   }
  }

  const BookingVariants = {
    hidden:{
      opacity:0,
    },
    visible:(index)=>({
      opacity:1,
      transition:{delay: index * 0.2, duration:0.3}
    })
  }

  return ( 
    <div className='w-full h-full absolute flex flex-col items-center gap-3'>
       {showConfetti && <Confetti width={1700} height={700} gravity={0.5} />}
        <MdArrowBackIos onClick={()=>navigate('/')} className='text-2xl font-bold absolute top-5 left-10 cursor-pointer text-black'/>
        <motion.p initial={{opacity:0}} animate={{opacity:1}} transition={{duration:0.5}} className='text-2xl font-bold text-black absolute top-5'>Your Booking List</motion.p>
        <FaAngleLeft onClick={()=>navigate('/')} className='text-white absolute top-7 left-5 text-2xl cursor-pointer' />
        {list.map((item,index)=>(
         <motion.div 
         variants={BookingVariants} initial='hidden' animate='visible' custom={index}
         key={index} className='w-[80%] lg:w-[50%] h-[110px] bg-[#e24718] rounded-lg relative top-20 flex items-center'>
           <div className='w-20 h-24 border absolute left-2 rounded-lg'>
           <img src={item?.image?.includes('uploads') ? `https://event-backend-s1hg.onrender.com${item.image}` : item.image} alt=""  className='w-full h-full object-cover rounded-lg'/>  
           </div>
           <p className='text-white font-bold absolute top-3 left-[102px] text-xl'>{item.name}</p>
           <p className='text-white absolute top-11 left-[102px]'>Tickets: {item.tickets}</p>
           <p className='text-white absolute top-[70px] left-[102px]'>Status:</p>
           <p className='text-[#fff538] absolute top-[70px] left-[156px]'>Pending</p>
           <MdDelete onClick={()=>handleDelete(item._id)} className='lg:text-3xl text-white absolute lg:top-9 top-16 cursor-pointer left-[87%] lg:left-[90%] text-2xl' />
        </motion.div>
        ))}
    </div>
  )
}

export default BookingList
