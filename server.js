const express = require('express')
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config();
// const session = require('express-session');
// const passport = require('passport');


// import router and controller
const Router = require('./router/router');
const passportRouter = require('./googlePassport/passport');



//create Express app
const app = express();

//Configure middleware
app.use(bodyParser.json());

//Define route
app.use('/api/v1', Router);
app.use('/', passportRouter);


// Initialize express-session middleware
// app.use(session({
//     secret: 'your_secret_key_here',
//     resave: false,
//     saveUninitialized: false
// }));

// // Initialize passport middleware and session support
// app.use(passport.initialize());
// app.use(passport.session());

//connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to mongoDB');
}).catch((err) => {
    console.error("Error connecting to MongoDB:", err);
});

//start server
const port = process.env.PORT || 4040;
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});

















// const express = require('express');
// const mongoose = require('mongoose');
// const passport = require('passport');
// const session = require('express-session');
// const MongoStore = require('connect-mongo')
// const dotenv = require('dotenv');
// const cors = require('cors');


// dotenv.config();

// const app = express();
// const port = process.env.PORT || 4000;

// // Connect to MongoDB
// mongoose.connect(process.env.MONGODB_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     // useCreateIndex: true,
//     // useFindAndModify: false
// })
//     .then(() => console.log('Connected to MongoDB'))
//     .catch(error => console.log(error));

// // Passport configuration
// require('./googlePassport/passport');

// // Middleware
// app.use(express.json());
// app.use(cors({
//     origin: 'http://localhost:4000', // Your frontend URL
//     credentials: true
// }));

// // const sessionStore = new MongoStore({
// //     url: 'http://localhost:4000/session-store',
// //     ttl: 60 * 60 // session TTL (in seconds)
// // });


// // app.use(session({
// //     secret: process.env.SESSION_SECRET,
// //     resave: false,
// //     saveUninitialized: false,
// //     store: sessionStore,// new MongoStore({ mongooseConnection: mongoose.connection }),
// //     cookie: {
// //         maxAge: 1000 * 60 * 60 * 24, // 1 day
// //         sameSite: 'none', // SameSite attribute for cross-site requests
// //         secure: true // Secure attribute for HTTPS-only cookies
// //     }
// // }));
// app.use(passport.initialize());
// app.use(passport.session());

// // Routes
// app.use('/api/v1', require('./router/router'));

// app.listen(port, () => {
//     console.log(`Server listening on port ${port}`);
// });

