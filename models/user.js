const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    fname: String,
    lname: String,
    email: String,
    password: String,
    
    role: {
        type: String,
        enum: ['user', 'admin'],
    },
    profilePicture: String,
    
});

module.exports = mongoose.model('User', userSchema, 'users');
