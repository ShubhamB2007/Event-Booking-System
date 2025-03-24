import React ,{createContext, useState, useEffect}from "react";
import axios from 'axios'
 
export const SearchContext = createContext()
  
const SearchProvider = ({children})=>{
   
   const [searchQuery, setSearchQuery] = useState('')
    
   const [currentTime, setCurrentTime] = useState('');  

  useEffect(() => {
    const updateTime = () => {
      const date = new Date();

    
      const monthNames = [
        'Jan', 'Feb', 'Mar', 'April', 'May', 'June', 'July',
        'Aug', 'Sept', 'Oct', 'Nov', 'Dec'
      ];
      const month = monthNames[date.getMonth()];

   
      const day = date.getDate();
      const daySuffix = 
        day % 10 === 1 && day !== 11
          ? 'st'
          : day % 10 === 2 && day !== 12
          ? 'nd'
          : day % 10 === 3 && day !== 13
          ? 'rd'
          : 'th';

     
      const hours = date.getHours() % 12 || 12;
      const minutes = date.getMinutes().toString().padStart(2, '0');
      const period = date.getHours() >= 12 ? 'PM' : 'AM';

     
      const formattedTime = `${month} ${day}${daySuffix}, ${hours}:${minutes} ${period}`;
      setCurrentTime(formattedTime);
    };

    updateTime();
    const interval = setInterval(updateTime, 60000); 

    return () => clearInterval(interval);
  }, []);

    
    return(
        <SearchContext.Provider value={{  searchQuery , setSearchQuery, currentTime }}>
            {children}
        </SearchContext.Provider>
    )
}

export default SearchProvider;