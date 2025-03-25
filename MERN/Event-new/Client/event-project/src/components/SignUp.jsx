import React, { useState } from 'react';
import { AiOutlineUser } from "react-icons/ai";
import { MdOutlineEmail } from "react-icons/md";
import { RiLockPasswordLine } from "react-icons/ri";
import { Link, useNavigate } from 'react-router-dom';
import {GoogleOAuthProvider} from '@react-oauth/google'
import axios from 'axios';
import GoogleLogin from './GoogleLogin';
import { toast } from 'react-toastify'; 

const SignUp = () => {
  const [data, setData] = useState({ 
    name: "",
    email: "",
    password: "",
    role: "User", 
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  }; 

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = "http://localhost:3000/api/signup";
      const response = await axios.post(url, data);
      console.log(response.data);
      const {name,role} = response.data.user;
      localStorage.setItem('userName', name)
      localStorage.setItem('role', role)
      toast.success(`Welcome ${name}`, { position: "top-right" })
      navigate('/');
    } catch (error) {
      if (error.response) {
        console.log("Validation Error:", error.response.data.details);
      } else {
        console.log("Signup failed:", error);
      }
    }
  };

  const GoogleAuthWrapper = ()=>(
    <GoogleOAuthProvider clientId="458309077734-e56o8d3uvn7fsaja1km41de6kqbgd27g.apps.googleusercontent.com">
      <GoogleLogin></GoogleLogin>
    </GoogleOAuthProvider>
  );

  return (
    <div className='w-full h-full flex justify-center'>
      <form className="form absolute top-12" onSubmit={handleSubmit}>
        
        <div className="flex-column">
          <label>Full Name</label>
        </div>
        <div className="inputForm">
          <AiOutlineUser size={20} />
          <input 
            type="text" 
            placeholder="Enter your Full Name" 
            className="input" 
            name="name" 
            value={data.name} 
            onChange={handleChange} 
            required 
          />
        </div>

        <div className="flex-column">
          <label>Email</label>
        </div>
        <div className="inputForm">
          <MdOutlineEmail size={20} />
          <input 
            type="email" 
            placeholder="Enter your Email" 
            className="input" 
            name="email" 
            value={data.email} 
            onChange={handleChange} 
            required 
          />
        </div>

        <div className="flex-column">
          <label>Password</label>
        </div>
        <div className="inputForm">
          <RiLockPasswordLine size={20} />
          <input 
            type="password" 
            placeholder="Enter your Password" 
            className="input" 
            name="password" 
            value={data.password} 
            onChange={handleChange} 
            required 
          />
        </div>

        <div className="flex-column">
          <label>Role</label>
        </div>
        <div className="inputForm">
          <select 
            className='w-[90%] outline-none mt-1' 
            name="role" 
            value={data.role} 
            onChange={handleChange}
          >
            <option className='bg-white text-black' value="User">User</option>
            <option className='bg-white text-black' value="Organizer">Organizer</option>
          </select>
        </div>

        <button type="submit" className="button-submit">Sign Up</button>

        <p className="p">
          Already have an account? 
          <Link to='/login'><span className="span"> Login</span></Link>
        </p>

        <p className="p line">Or Login With</p>
         
        <GoogleAuthWrapper/>
      </form>
    </div>
  );
};

export default SignUp;
