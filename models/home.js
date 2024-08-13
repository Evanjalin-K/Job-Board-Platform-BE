const mongoose = require('mongoose')

const homeSchema = new mongoose.Schema(
    {
description: String
    }
)

module.exports = mongoose.model('Home', homeSchema, 'home')