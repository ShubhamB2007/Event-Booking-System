const User = require("../models/User")
const { oauth2client } = require("../Utils/googleConfig")
const axios = require('axios')
const jwt = require('jsonwebtoken')
const {createUser} = require('../services/signup')

const googleLogin = async (req,res)=>{
    try {
        const { code } = req.body; 
        if (!code) {
            return res.status(400).json({ message: "Authorization code is required" });
          }
        console.log("Received Google Auth Code:", code);
        const GoogleRes = await oauth2client.getToken(code)
        oauth2client.setCredentials(GoogleRes.tokens);

        const userRes = await axios.get(
            `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${GoogleRes.tokens.access_token}`
        )

        const {email,name} = userRes.data;
        let user = await User.findOne({email})
        if (!user){
            user = await createUser({
                name,email,password:"google-auth-user",role:'user'
            })
        }else {
            console.log("Existing User Found:", user);
          }

        const token = jwt.sign({ _id: user._id, email }, process.env.JWTPRIVATEKEY, {expiresIn:'12h'})
        return res.status(200).json({
            message:'Success',
            token,
            user
        })
    } catch (error) {
        console.error("Google Login Error:", error.message, error.response?.data || error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}

module.exports = {googleLogin}