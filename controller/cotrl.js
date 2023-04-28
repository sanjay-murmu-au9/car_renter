const Model = require('../model/UserModel')
const CarModel = require('../model/carModel')
const BookingModel = require('../model/BookingSchema')
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs')
const mongoose = require('mongoose');
const objectId = new mongoose.Types.ObjectId();
const Razorpay = require('razorpay');

exports.RegisterUser = async (req, res) => {
    try {
        const { name, email, phoneNumber, password } = req.body;
        const UserExist = await Model.find({ $or: [{ email }, { phoneNumber }] })

        if (UserExist.length > 0) {
            return res.status(409).json({ message: 'User all ready registerd! Please login', user: UserExist[0].email })
        } else {
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds)
            const newUser = new Model({ name, email, phoneNumber, password: hashedPassword })
            if (newUser) {
                const savedUser = await newUser.save();
                savedUser.password = undefined
                // console.log(savedUser, "<<<<<savedUser")
                return res.status(201).json({ message: 'User created successfully!', user: savedUser })
            }
        }

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: 'Internal server Error',
            error: error.message
        })
    }
}

exports.userLoggin = async (req, res) => {
    try {
        const { email, password, phoneNumber } = req.body;
        const user = await Model.find({ 'email': email, 'phoneNumber': phoneNumber })
        if (!user || user.length == 0) {
            return res.status(401).json({ message: "Invalid email or phoneNumber, password" })
        }

        const isMatchPassword = await bcrypt.compare(password, user[0].password);
        if (!isMatchPassword) {
            return res.status(401).json({ message: 'Invalid password!' });
        }

        // generate Token
        const token = jwt.sign({ userId: user[0]._id, phoneNumber: user[0].phoneNumber, email: user[0].email }, process.env.JWT_SECRET, {
            expiresIn: '1h'
        })
        user[0].password = undefined;
        req.body.token;
        res.status(200).json({ message: "Login successfully", user, token })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal server error", error: error.message })
    }
}

exports.PostrenterCart = async (req, res) => {
    try {
        const { carName } = req.body;
        const carExist = await CarModel.find({ 'carName': carName })

        if (carExist.length > 0) {
            return res.status(409).json({
                message: "car already exist! Please upload another car",
            })
        } else {
            const Car = new CarModel(req.body)
            const uploadCar = await Car.save();
            return res.status(201).json({
                message: 'Car uploaded successfull!',
                carDetails: uploadCar
            })
        }

    } catch (error) {
        console.error(error)
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        })
    }
}

exports.updateCar = async (req, res) => {
    try {
        const updateCar = req.params.carId;
        const updateField = req.body;
        const singleCar = await CarModel.findByIdAndUpdate(updateCar, updateField, {
            new: true
        })

        if (!singleCar) {
            return res.status(409).json({ message: 'Could not update! Please try again!', result: [] })
        } else {
            return res.status(201).json({ message: 'Car updated successfull!', result: singleCar })
        }

    } catch (error) {
        console.log(error)
        return res.status(500).json({ "message": "Internal server error", 'Error': error.message })
    }
}

exports.carList = async (req, res) => {
    try {
        const carList = await CarModel.find();
        if (!carList) {
            return res.status(200).json({ message: 'No Data found!', data: [] })
        } else {
            return res.status(200).json({ message: 'Car List!', data: carList })
        }
    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: 'Internal server error!', error: error.message })

    }
}

exports.singleCar = async (req, res) => {
    try {
        const carId = req.params.carId;
        const singleCar = await CarModel.findById(carId)

        if (!singleCar) {
            return res.status(409).json({ message: 'No single car found!', result: [] })
        } else {
            return res.status(200).json({ message: 'Single car fetched successfully!', data: singleCar })
        }

    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal Server error", error: error.message })
    }
}

exports.MostRatedCar = async (req, res) => {
    try {
        const TopRatedCar = await CarModel.find().sort({ carRating: -1 })
        if (!TopRatedCar) {
            return res.status(409).json({ message: 'No car found', data: [] })
        } else {
            return res.status(200).json({ message: 'Top rated car!', data: TopRatedCar })
        }

    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: 'Internal server Error!', error: error.message })
    }
}

exports.mostRentedCar = async (req, res) => {
    try {
        const mostRentedCar = await BookingModel.aggregate([
            {
                $group: {
                    _id: "$carId",
                    NoOfTimeBooked: { $sum: 1 }
                }
            },
            {
                $lookup: {
                    from: "cars",
                    localField: "_id",
                    foreignField: "_id",
                    as: "car"
                }
            },
            {
                $unwind: "$car"
            },
            {
                $project: {
                    "car.carName": 1,
                    "car.carColor": 1,
                    "car.carTopSpeed": 1,
                    "car.carBrandName": 1,
                    "car.car": 1,
                    "NoOfTimeBooked": 1
                }
            },
            {
                $sort: { "NoOfTimeBooked": -1 }
            },
            {
                $limit: 10
            }
        ]);

        return res.status(200).json({ message: "List of most rented cars!", result: mostRentedCar });

    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: 'Internal server error!', error: error.message })
    }
}

exports.mostRentedCar2 = async (req, res) => {
    try {
        const result = await BookingModel.aggregate([
            {
                $group: {
                    _id: "$carId",
                    countNoOfTimeBooked: { $sum: 1 }
                }
            },
            {
                $lookup: {
                    from: "cars",
                    localField: "carId",
                    foreignField: "_id",
                    as: "result"
                }
            },
            {
                $unwind: "$result"
            },
            {
                $project: {
                    "result.car": 1
                }
            }
        ])
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Internal Server Error!', error: error.message })
    }
}


exports.BookCar = async (req, res) => {
    try {
        const { from, to } = req.body;
        const carId = req.params._id;

        //check if the car is available for the given dated;
        const bookings = await BookingModel.find({
            carId: mongoose.Types.ObjectId.createFromHexString(carId),
            $or: [
                {
                    from: { $lte: new Date(to) },
                    to: { $gte: new Date(from) }
                },
                {
                    from: { $lte: new Date(from) },
                    to: { $gte: new Date(to) },
                },
                {
                    from: { $gte: new Date(from) },
                    to: { $lte: new Date(to) }
                }
            ]
        })

        // console.log(bookings[0], "<<<<<<<")
        if (bookings.length > 0) {
            return res.status(409).json({ messag: 'Car is not available for the selected dates' })
        }

        const carDetail = await CarModel.findById(carId)

        const razorPay = new Razorpay({
            key_id: "rzp_test_b0bwJGbakYbtoG",
            key_secret: "L2O4SLnaliV9YUq0l7IF9bWy"
        });
        const razorPayOrder = await razorPay.orders.create({
            amount: carDetail.carRentPerDayPrice * 100,
            currency: "INR",
            receipt: "this.BookCar._id",
        })

        // let razorpayOrderId = razorPayOrder.id;

        // create the booking;
        const booking = new BookingModel({
            carId: carId,
            userId: req.userData.userId,
            from: new Date(from),
            to: new Date(to),
            totalAmount: {
                Amount: carDetail.carRentPerDayPrice
            }

        })
        await booking.save();
        return res.status(201).json({ message: 'Booking created successfully', result: booking })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Internal Server Error', error: error.message })
    }
}

exports.deleteCar = async (req, res) => {
    try {
        const carId = req.params.carId;

        const car = await CarModel.findByIdAndDelete(carId)

        if (!car) {
            return res.status(409).json({ message: 'Car not found!' })
        }

        return res.status(200).json({ "message": "Car deleted succsessfully!" })

    } catch (error) {
        console.log(error)
        return res.status(501).json({ message: 'Internal server error', error: error.message })
    }
}