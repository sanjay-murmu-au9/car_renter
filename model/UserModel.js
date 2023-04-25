const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = new Schema({
    name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        // required: true
    },
    confirmPassword: {
        type: String,
    },
    phoneNumber: {
        type: String,
        // required: true
    },
    age: {
        type: Number,
        default: 19
    },
    address: {
        type: String,

    },
    provider: {
        type: String
    },
    // googleId:{

    // }

}, { timestamps: true })

module.exports = mongoose.model('User', User)