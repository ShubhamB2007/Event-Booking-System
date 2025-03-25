import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from 'axios'
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify'; 


const Create = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const navigate = useNavigate()

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  const [formData, setFormData] = useState({
    title: "",
    date: "",
    venue: "",
    category: "",
    price: "",
    capacity: "",
    email: "",
    image: "",
    description: "",
  });

  const handleChange = (e) => {
    if (e.target.name === "image") {
      const file = e.target.files[0];
      
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
    
          setImagePreview(reader.result);
          setFormData((prevState) => ({
            ...prevState,
            image: file,
          }));
        };
        reader.readAsDataURL(file);
      }
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
  
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.title);
      formDataToSend.append("date", formData.date);
      formDataToSend.append("venue", formData.venue);
      formDataToSend.append("category", formData.category);
      formDataToSend.append("price", formData.price);
      formDataToSend.append("capacity", formData.capacity);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("description", formData.description);
      
      if (formData.image) {
        formDataToSend.append("image", formData.image);
      }
  
      const res = await axios.post("http://localhost:3000/api/events", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(res.data);
      toast.success('Event Created Successfully!', { position: "top-right" })
      navigate('/organize-event')
    } catch (error) {
      console.log(error);
    }
  };

  const FormVariants = {
    hidden: { scaleY: 0, opacity: 0, transformOrigin: "top" },
    visible: {
      scaleY: 1,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" },
    },
    exited: { scaleY: 0, opacity: 0 },
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fffbfa] p-4">
      <motion.form
        variants={FormVariants}
        initial="hidden"
        animate={isVisible ? "visible" : "hidden"}
        exit="exited"
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg"
      >
        <h2 className="text-2xl font-semibold text-[#e24718] mb-6 text-center">
          Create Event
        </h2>

        <div className="space-y-4">
          <input type="text" name="title" placeholder="Title" onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e24718]" required />
          <input type="date" name="date" onChange={handleChange} defaultValue="" className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e24718] text-black" required />
          <input type="text" name="venue" placeholder="Venue" onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e24718]" required />

          <select name="category" onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e24718]" required>
            <option className="bg-[#e24718] text-white" value="Movie">Movie</option>
            <option className="bg-[#e24718] text-white" value="Concert">Concert</option>
            <option className="bg-[#e24718] text-white" value="Sports">Sports</option>
            <option className="bg-[#e24718] text-white" value="Comedy">Comedy</option>
            <option className="bg-[#e24718] text-white" value="Festival">Festival</option>
          </select>

          <input type="number" name="price" placeholder="Price" onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e24718]" required />
          <input type="number" name="capacity" placeholder="Capacity" onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e24718]" required />
          <input type="email" name="email" placeholder="Email" onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e24718]" required />
          <input type="file" name="image" accept="image/*" onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e24718]" required />
          {imagePreview && <img src={imagePreview} alt="Preview" className="mt-2 w-72 h-80 object-cover rounded-lg border border-gray-300" />}
          <textarea name="description" placeholder="Description" onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e24718] h-24" required></textarea>

          <button type="submit" className="w-full bg-[#e24718] text-white py-2 rounded-lg hover:bg-opacity-90 transition">
            Submit
          </button>
        </div>
      </motion.form>
    </div>
  );
};

export default Create;
