const User = require('../models/User')
const bcrypt = require('bcryptjs');

const createUser = async(userData)=>{
    const {name,email,password,role} = userData;
    const hashedPassword = password === "google-auth-user" ? password : await bcrypt.hash(password, 10);
    const newUser = new User({ 
        name,
        email,
        password:hashedPassword,    
        role
    }) 

    const saveUser  = await newUser.save()
    return saveUser
}

module.exports = {createUser}