import React, {useState, useEffect} from 'react'
import {fetchEvents} from '../services/eventService'
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import {Link} from 'react-router-dom'
import { motion } from "framer-motion";


const Hero = () => {

  const [events, setEvents] = useState([])

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

    const images = [
       "./custom/cwc.jpg",
       "./custom/stree2.jpg",
       "./custom/coldplay.jpg",
       "./custom/saturday.jpg",
       "./custom/aladin.jpg",
       "./custom/fifa.jpg",
       "./custom/ucl.jpg",
       
    ]
 
    
  return (
    <div className='absolute top-[150px] lg:top-16 text-white w-full lg:h-[660px] h-56'>
          { events.length === 0 && (
             <div className="loader absolute lg:top-64 top-28 lg:left-[750px] left-44">
                <div className="circle"></div>
                <div className="circle"></div>
                <div className="circle"></div>
                <div className="circle"></div>
             </div>
           )}

        <motion.div 
        initial={{opacity:0}} animate={{opacity:1}} transition={{duration:0.5, delay:0.2}}
        id="carouselExampleIndicators" className="carousel slide absolute w-full lg:h-[660px] h-56" data-bs-ride="carousel">
      <ol className="carousel-indicators">
        {events.slice(0,7).map((_, index) => (
          <li
            key={index}
            data-bs-target="#carouselExampleIndicators"
            data-bs-slide-to={index}
            className={index === 0 ? "active" : ""}
          ></li>
        ))}
      </ol>

      <div className="carousel-inner">
        {events.slice(0,7).map((event, index) => (
          <div key={index} className={`carousel-item ${index === 0 ? "active" : ""}`}>
            <img src={images[index]} className="d-block w-100 relative h-56 lg:h-[660px] brightness-75" alt={event.title} />
            <div className="carousel-caption lg:text-xl text-[9px] text-d-none d-md-block">
              <Link to='/events'>
            <button className='lg:w-48 lg:h-12 w-24 h-6 text-[11px] bg-white font-semibold text-[#e24718] relative lg:ml-0 ml-56 lg:mb-0 mb-20 rounded-lg lg:text-lg'>Go to Events</button>
            </Link>
              <p className='relative lg:top-0 top-6'>{event.description}</p>
            </div>
          </div>
        ))}
      </div>

      <a className="carousel-control-prev" href="#carouselExampleIndicators" role="button" data-bs-slide="prev">
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Previous</span>
      </a>
      <a className="carousel-control-next" href="#carouselExampleIndicators" role="button" data-bs-slide="next">
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Next</span>
      </a>
    </motion.div>
    </div>
  )
}

export default Hero;