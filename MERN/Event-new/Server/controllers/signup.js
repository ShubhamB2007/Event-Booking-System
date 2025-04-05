const userService = require('../services/signup')

const createUser = async(req,res)=>{
    try {
        const userData = req.body
        const user = await userService.createUser(userData)
        res.status(201).json({user:{name:user.name, email:user.email, role:user.role, id:user._id},message:"User Successfully Created"})
    } catch (error) {
        console.log(error)
        res.status(400).json({message:error.message})
    }
}

module.exports = {createUser} 