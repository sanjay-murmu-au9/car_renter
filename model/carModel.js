const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const Car = new Schema({
    carName: {
        type: String,
        required: true
    },
    car: {
        type: String
    },
    carType: {
        type: String,
        default: 'comfortable'
    },
    carColor: {
        type: String,
        default: 'white'
    },
    carRating: {
        type: Number,
        default: 1
    },
    carTopSpeed: {
        type: String,
        default: '120km/hrs'
    },
    carReview: {
        type: String,
        default: 'Good car'
    },
    carBrandName: {
        type: String,
        default: 'TATA'
    },
    carRentPerDayPrice: {
        type: Number,
        default: 1000
    },
    booking: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking'
    }]

}, { timestamps: true })

module.exports = mongoose.model('Car', Car)