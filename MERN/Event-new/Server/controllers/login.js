const authService = require('../services/login')
const User = require('../models/User') 

const login = async(req,res)=>{
   try {
     const {email,password}= req.body
     const token = await authService.login(email,password)

      const user = await User.findOne({email}).select('name email')
      res.json({token:token, user:{name:user.name, email:user.email,id:user._id}})
   } catch (error) { 
    res.status(401).json({message:"Invalid Credentials"}) 
   }
}

module.exports={login}