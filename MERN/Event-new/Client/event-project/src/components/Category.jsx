import React, {useRef} from 'react'
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useNavigate } from 'react-router-dom';

const CategoryVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
};

const Category = () => {

    const navigate = useNavigate()

    const categories = [
        { name: "Concerts" , image: "./category/concert.png", styles: 'bg-gradient-to-bl from-[#f8a90e] to-[#f0663b]'},
        { name: "Movies" , image: "./category/movie.png", styles: 'bg-gradient-to-bl from-[#995fd6] to-[#6a9dc9]'},
        { name: "Sports" , image: "./category/sports.png", styles: 'bg-gradient-to-bl from-[#5adffe] to-[#1d687e]'},
        { name: "Festivals" , image: "./category/festival.png", styles: 'bg-gradient-to-br from-[#e25c4b] to-[#bd616b]'},     
        { name: "Comedy" , image: "./category/comedy.png", styles: 'bg-gradient-to-bl from-[#7c3288] to-[#e05da0]'},
      ];

      const goToEvents = (category = '')=>{
        navigate('/events', {state:{category}})
     }

     const ref = useRef(null);
     const isInView = useInView(ref, { triggerOnce: true, threshold: 0.2 });    

  return (
    <div ref={ref} className='w-full h-3 lg:h-56 absolute lg:top-[770px] top-96 flex justify-center border'>
            <p className='text-2xl font-bold text-black absolute top-3'>Categories</p>
            <div className='w-[87%] h-40 absolute top-12 flex gap-2 lg:gap-[105px] justify-center'>
              {categories.map((item,index)=>(
               <motion.div 
               variants={CategoryVariants}
               initial="hidden"
               animate={isInView ? "visible" : "hidden"}
               transition={{ duration: 0.3, delay: index * 0.2 }}
               key={index} onClick={()=>goToEvents(item.name)} className={`cursor-pointer w-16 h-16 lg:w-36 lg:h-36 rounded-lg relative top-2 ${item.styles} flex justify-center items-center`}>
                  <img src={item.image} alt={item.name} className='lg:w-28 w-10 lg:top-8 top-6 absolute lg:left-9 left-5' />
                  <p className='text-white absolute lg:top-4 top-2 lg:left-5 left-3 font-semibold lg:text-base text-[9px]'>{item.name}</p>
               </motion.div>
               ))}
            </div>
        </div>
  )
}

export default Category;