import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios"; 
import {GoogleOAuthProvider} from '@react-oauth/google'
import GoogleLogin from "./GoogleLogin";

const Login = () => {
  const [data, setData] = useState({
    email: "",
    password: "",
  });


  const navigate = useNavigate();

  const handleChange = ({ target: input }) => {
    setData({ ...data, [input.name]: input.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log(data)
    try {
      const url = "http://localhost:3000/api/login";
      const res = await axios.post(url, data);
      console.log(res.data.message); 

      const { token, user } = res.data

      if (res.data.token) {
        localStorage.setItem('token', token)
        localStorage.setItem('userName', user.name)
        localStorage.setItem('Email', user.email)
        navigate('/'); 
      } else {
        console.log("Token not found");
      }
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
    }
  };

  const GoogleAuthWrapper = ()=>(
    <GoogleOAuthProvider clientId="458309077734-e56o8d3uvn7fsaja1km41de6kqbgd27g.apps.googleusercontent.com">
      <GoogleLogin></GoogleLogin>
    </GoogleOAuthProvider>
  );

  return (
    <div className="w-full h-full absolute flex justify-center">
      <form className="form absolute top-24" onSubmit={handleSubmit}>
        <div className="flex-column">
          <label>Email</label>
        </div>
        <div className="inputForm">
          <input
            placeholder="Enter your Email"
            className="input"
            type="email"
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
          <input
            placeholder="Enter your Password"
            className="input"
            type="password"
            name="password"
            value={data.password}
            onChange={handleChange}
            required
          />
        </div>

        <div className="flex-row">
          <div>
            <input type="checkbox" className="absolute mt-2 cursor-pointer" />
            <label className="ml-5">Remember me</label>
          </div>
        </div>

        <button onClick={handleSubmit} type="submit" className="button-submit">
          Login
        </button>

        <p className="p">
          Don't have an account?
          <Link to='/signup'>
            <span className="span">Sign Up</span>
          </Link>
        </p>

        <p className="p line">Or With</p>
        <GoogleAuthWrapper/>
        <p className="text-sm text-red-600">*Note: Ifyou want organize event, you have to <b>manually</b> register your account by <b>signing up</b></p>
      </form>
    </div>
  );
};

export default Login;
