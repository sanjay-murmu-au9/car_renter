const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const UserModel = require('../model/UserModel');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://localhost:4000/auth/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const email = profile[0].value;
        const user = await UserModel.findOne({ email });
        if (user) {
            // if user already exists, log then in
            return done(null, user)
        }

        //otherwise, create a new account
        const newUser = new UserModel({
            name: profile.displayName,
            email,
            provider: 'google'
        });

        await newUser.save();
        return done(null, newUser)

    } catch (error) {
        console.log(error)
        return done(error)
    }

}));

passport.serializeUser((user, done) => {
    done(null, user._id);
})

passport.deserializeUser(async (id, done) => {
    try {
        const user = await UserModel.findById(id);
        done(null, user);
    } catch (error) {
        console.log(error)
        done(error)
    }
})

module.exports = passport;




// const UserModel = require('../model/UserModel');
// const passport = require('passport');
// const GoogleStrategy = require('passport-google-oauth20').Strategy;
// const express = require('express')
// const router = express.Router()
// const session = require('express-session');

// const app = express();

// // session middleware
// app.use(session({
//     secret: 'your_secret_key_here',
//     resave: false,
//     saveUninitialized: false
// }));

// // passport middleware
// app.use(passport.initialize());
// app.use(passport.session());


// passport.use(new GoogleStrategy({
//     clientID: process.env.GOOGLE_CLIENT_ID,
//     clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//     callbackURL: '/auth/google/callback'
// },
//     async (accessToken, refreshToken, profile, done) => {
//         console.log(accessToken, '<<<<<<<<<<<<<<<accessToken')
//         console.log(refreshToken, '<<<<<<<<<<<<<<<refreshToken')
//         console.log(profile, '<<<<<<<<<<<<<<<profile')
//         console.log(done, '<<<<<<<<<<<<<<<done')
//         try {
//             const email = profile.emails[0].value;
//             const user = await UserModel.findOne({ email });
//             if (user) {
//                 // // generate Token
//                 // const token = jwt.sign({ userId: user[0]._id, phoneNumber: user[0].phoneNumber, email: user[0].email }, process.env.JWT_SECRET, {
//                 //     expiresIn: '1h'
//                 // })
//                 // user[0].password = undefined;
//                 // req.body.token;
//                 // if user already exists, log then in
//                 return done(null, user)
//             }

//             //otherwise, create a new account
//             const newUser = new UserModel({
//                 name: profile.displayName,
//                 email,
//                 provider: 'google'
//             });

//             await newUser.save();
//             // // generate Token
//             // const token = jwt.sign({ userId: user[0]._id, phoneNumber: user[0].phoneNumber, email: user[0].email }, process.env.JWT_SECRET, {
//             //     expiresIn: '1h'
//             // })
//             // user[0].password = undefined;
//             // req.body.token;
//             return done(null, newUser)

//         } catch (error) {
//             console.log(error)
//             return done(error, null)
//             return res.status(500).json({ message: 'Internal server error', error: message.error })
//         }

//     }

// ));

// passport.serializeUser((user, done) => {
//     done(null, user._id);
// })

// passport.deserializeUser(async (id, done) => {
//     console.log(id, "<<<<<<<<<<<<<<<<ID")
//     try {
//         const user = await UserModel.findById(id);
//         done(null, user);
//     } catch (error) {
//         console.log(error)
//         done(error)
//     }
// })

// // google passport
// router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// router.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: 'http://localhost:4000/login' }), (req, res) => {
//     console.log(res, "<<<<<<<<<<<<<<<<<<<<RES")
//     res.redirect('http://localhost:4000/getcarList');
// })

// module.exports = router;

// // var GoogleStrategy = require('passport-google-oauth20').Strategy;

// // passport.use(new GoogleStrategy({
// //     clientID: process.env.GOOGLE_CLIENT_ID,
// //     clientSecret: process.env.GOOGLE_CLIENT_SECRET,
// //     callbackURL: "http://www.example.com/auth/google/callback"
// // },
// //     function (accessToken, refreshToken, profile, cb) {
// //         UserModel.findOrCreate({ googleId: profile.id }, function (err, user) {
// //             return cb(err, user);
// //         });
// //     }
// // ));

// // router.get('/auth/google',
// //     passport.authenticate('google', { scope: ['profile'] }));

// // router.get('/auth/google/callback',
// //     passport.authenticate('google', { failureRedirect: '/login' }),
// //     function (req, res) {
// //         // Successful authentication, redirect home.
// //         res.redirect('/');
// //     });


// // module.exports = router;