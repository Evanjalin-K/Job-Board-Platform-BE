const mongoose = require('mongoose');

const basicSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'
    } ,
    phone: String,
    city: String,
    state: String,
    country: String,
})

module.exports= mongoose.model('BasicInfo',basicSchema, 'basicInfo')