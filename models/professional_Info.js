const mongoose = require('mongoose');

const professionalSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    degree: String,
    field: String,
    institution: String,
    graduationYear: String,
    certifications: [String],
    skills: [String],
    preferredLocations: [String],
    desiresIndustries: [String],
    employementType: String, 
    currentJob: String,
    experience: String,
    salaryExpectation: String,
    jobApplied: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job"
    }],
    savedJob: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job'
    }],
    recentlyViewedJob: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job'
    }]
})

module.exports= mongoose.model('ProfessionalInfo',professionalSchema, 'professionalInfo')