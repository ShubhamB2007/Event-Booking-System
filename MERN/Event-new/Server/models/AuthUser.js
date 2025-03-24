const mongoose = require("mongoose")
require("dotenv").config()

const auth_userSchema = new mongoose.Schema({
    name:{type:String, required:true}, 
    email:{type:String, required:true},
    password:{type:String, required:true},  
    role:{type:String, enum:['admin','user'], default:"user"}
})

module.exports = mongoose.model("AuthUser",auth_userSchema) 