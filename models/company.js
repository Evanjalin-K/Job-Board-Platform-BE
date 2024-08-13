const mongoose = require('mongoose');

const companySchema = {
    name:String,
    location: String,
    logoUrl: {
        type: String,  
        default: 'https://via.placeholder.com/150'
    },
    date: {
        type: Date,
        default: Date.now
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    jobs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job'
    }]
}
module.exports = mongoose.model('Company', companySchema, 'companies')
