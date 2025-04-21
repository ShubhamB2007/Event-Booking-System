const express = require("express")
const router = express.Router();
const Event = require('../models/Event')
const Venue = require('../models/Venue')
const Booking = require('../models/Booking')
const { v4: uuid } = require('uuid');
const multer = require('multer')
require('dotenv').config()
const axios = require('axios')

const API_URL = 'https://openrouter.ai/api/v1/chat/completions';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage })

router.get('/', async (req, res) => {
   
  let query = {}
  const searchData = req.query.search;
  if(searchData){
    query={
      $or:[
        {name:{$regex: searchData, $options:"i"}}
      ]
    }
  }

  try {
      const events = await Event.find(query)  
      if (!events) return res.status(404).json({ message: "No events found" });
      res.json(events);
  } catch (error) {
      console.error("Error fetching events:", error.message);
      res.status(500).json({ error: "Server Error" });
  }
});

router.get('/booking', async (req, res) => { 

  const user = req.query.user;
  try {
    const bookings = await Booking.find({userId:user});
    if (!bookings || bookings.length === 0) {
      return res.status(404).json({ message: 'No bookings found' });
    } 
    res.json(bookings);
  } catch (error) {
    console.error("Error fetching bookings:", error.message);
    res.status(500).json({ error: 'Server Error' });
  }
}); 

router.delete('/booking/:id', async (req,res)=>{
  try {
    const deleteBooking = await Booking.findByIdAndDelete(req.params.id)
    if (!deleteBooking) return res.status(404).json({ message: "No booking found or deleted" });
    res.json({ message: "Booking deleted successfully" });
  } catch (error) {
    console.log(error)
  }
})

router.get('/id/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id) 
    if (!event) return res.status(404).json({ message: "No event found" });
    res.json(event);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
});

router.get('/name/:name', async (req, res) => {
  const name = req.params.name;
  console.log(name)
  try {
    const event = await Event.find({name:name}) 
    if (event.length === 0) return res.status(404).json({ message: "No event found" });
    res.json(event);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
});

router.get('/email/:email', async (req, res) => {
  const {email} = req.params
  try {
    const event = await Event.find({email:email})
    if (!event) return res.status(404).json({ message: "No event found" });
    res.json(event);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
});

router.delete('/email/:email/:id', async (req, res) => {
  const {id} = req.params;
  try {
    const event = await Event.findByIdAndDelete(id)
    if (!event) return res.status(404).json({ message: "Failed" });
    res.json(event);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
});

router.post("/", upload.single("image"), async (req, res) =>{
    try {
      const {name,category,date,venue,email,description,capacity,price} = req.body;
      const image = req.file ? `/uploads/${req.file.filename}` : null;
      console.log(req.body);
      const newEvent = new Event({ 
        name,category,date,image,venue,capacity,email,price,description,availableSeats:capacity,
      }) 
      const saveEvent = await newEvent.save()
      res.status(201).json(saveEvent)
      console.log('Event Created')
    } catch (error) {
      res.status(400).json({ error: "Error Creating Event", details: error.message });
    }
})

router.delete('/:id', async (req, res) => { 
    try {
      const deletedEvent = await Event.findByIdAndDelete(req.params.id);
      res.json(deletedEvent);
    } catch (err) {
      res.status(500).json({ error: 'Server Error' });
    }
  });

  router.post('/booking', async(req,res)=>{
    const {userId,eventId,name,price,image, quantity,totalPrice}= req.body
    try {
      const event = await Event.findById(eventId)
      if(!event) return res.status(404).send("No Event Found")
       if(event.capacity <= 0) return res.status(400).send("Event is fully booked")
        if (event.capacity < quantity) {
          return res.status(400).send("Not enough seats available");
        }

       const booking = new Booking({
         userId,
         eventId,
         name,
         tickets:quantity,
         totalPrice,
         image,
         bookingId:uuid()
       })

       await booking.save()
       event.capacity -= quantity
       await event.save() 

       res.status(201).json({ message: "Booking Successful", booking });

    } catch (error) {
      console.error("Error occurred:", error);
      res.status(500).send("Internal Server Error");
    }
})

 router.post('/suggest-events', async (req,res)=>{
    try {
      const {userId} = req.body;
     
      const pastBookings = await Booking.find({userId})
      // console.log(pastBookings)
      if(!pastBookings.length){
       return res.status(404).json({message:'No Past Bookings Found'})
      }

      const bookedEventsNames = pastBookings.map(booking => booking.name).filter(Boolean);

      const availableEvents = await Event.find()
      if (!availableEvents.length) {
        return res.status(404).json({ message: "No available events found" });
      }
    
      const prompt = `A user has previously booked following events: ${bookedEventsNames.join( ', ')}. From the available events: ${availableEvents.map(e=>e.name).join(', ')},suggest 3 events names only (not anything else) that match user's interest`

      const response = await axios.post(API_URL, {
          model: "deepseek/deepseek-chat-v3-0324:free",
          messages: [
            { role: "user", content:prompt }
          ]
        }, {
          headers: {
            'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
            'Content-Type': 'application/json',
          }
        }) 
      console.log("AI API Response:", response.data);
      const reply = response?.data?.choices?.[0]?.message?.content;
      const eventNames = reply
        .split('\n')
        .filter(line => line.match(/^\d+\.\s+\*\*(.+)\*\*/)) 
        .map(line => line.match(/^\d+\.\s+\*\*(.+)\*\*/)[1]); 
         console.log(eventNames)
         res.json({ reply: eventNames });
        // console.log({reply})
    } catch (error) {
      console.error("AI Suggestion Error:", error);
      res.status(500).json({ error: "Failed to generate event suggestions" });
    }
 })
  
  module.exports = router;
