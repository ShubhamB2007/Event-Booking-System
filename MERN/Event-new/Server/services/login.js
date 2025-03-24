const bcrypt = require('bcryptjs')
const User = require('../models/User')
const {generateToken} = require('../Utils/jwtUtils') 
 
const login = async (email, password) => {
    try {
        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            console.log('User not found');
            throw new Error('User not found');
        }

        const validPass = await bcrypt.compare(String(password), existingUser.password);
        console.log("Entered Password:", password);
        if (!validPass) {
            console.log('Invalid password');
            throw new Error('Invalid Password');
        }

        const token = generateToken(existingUser);
        return token;
    } catch (error) {
        console.error(error);
        throw new Error('Invalid Credentials');
    }
}


module.exports = {login}