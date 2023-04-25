const express = require('express')
const ctrl = require('../controller/cotrl');
const router = express.Router();
const authMiddleware = require('../token/jwt');


// Include the passport.js file
const passport = require('../googlePassport/passport');

// Middleware to initialize Passport.js


router.post('/register', ctrl.RegisterUser)

router.post('/login', ctrl.userLoggin)

router.get('/getcarList', authMiddleware, ctrl.carList)

router.get('/single-car/:carId', authMiddleware, ctrl.singleCar)

router.get('/topratedCar', authMiddleware, ctrl.MostRatedCar)

router.get('/most-rented', authMiddleware, ctrl.mostRentedCar)

router.post('/booked-car/:_id', authMiddleware, ctrl.BookCar)

//Admin
router.put('/update-car/:carId', authMiddleware, ctrl.updateCar)

router.post('/rentcarPost', authMiddleware, ctrl.PostrenterCart)

router.put('/delete-car/:carId', authMiddleware, ctrl.deleteCar)

module.exports = router;