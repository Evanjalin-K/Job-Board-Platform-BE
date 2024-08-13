const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    title: String,
    description: String,
    skills: [String],
    type: {
        type: String,
        enum: ['full-time', 'part-time', 'contract'],
        default: 'full-time'
    },
    status: {
        type: String,
        enum: ['open', 'closed'],
        default: 'open'
    },
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company'
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    applicants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Application',
    }],

    experience: String,
    salary: String,
}, { timestamps: true });

module.exports = mongoose.model('Job', jobSchema, 'jobs');
