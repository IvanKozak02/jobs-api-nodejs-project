const mongoose = require('mongoose');

const JobSchema = mongoose.Schema({
    company: {
        type: String,
        required: [true, 'Please, provide company.'],
        minLength: [1,'Please, provide correct company name.'],
        maxLength: 50
    },
    position: {
        type: String,
        required: [true, 'Please, provide position.'],
        minLength: [1,'Please, provide correct position name.'],
        maxLength: 200
    },
    status: {
        type: String,
        enum: ['interview', 'declined', 'pending'],
        default: 'pending'
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: [true, 'Please, provide user.']
    }
}, {timestamps: true})


module.exports = mongoose.model('Job', JobSchema);