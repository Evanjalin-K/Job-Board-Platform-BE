const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
    fname: String,
    lname:String,
    email: String,
    password: String,
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    profilePicture: String

})


module.exports= mongoose.model('Profile',profileSchema, 'profile')