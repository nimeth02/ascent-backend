const passport = require("passport");
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const session = require('express-session');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const csrf = require('csurf');
const db = require('./config/db.config.js');
const authRoutes = require('./routes/auth');
const courseRoutes = require('./routes/course');
const enrollmentRoutes = require('./routes/enrollment.js');
const { notFound, errorHandler } = require("./middlewares/errorHandler.js");

const app = express();

// Set secure HTTP headers
app.use(helmet());

app.use(cors({
  origin: ['http://localhost:3000','http://localhost:3002'],
  credentials: true // Allow credentials (cookies, authorization headers)
}));

// Rate limiting to prevent DDoS
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: "Too many requests from this IP, please try again later.",
});
app.use(limiter);



app.use(express.json());
app.use(express.urlencoded({ extended: true }));

db.sequelize.sync();


//session managemnt
const sessionConfig = {
  secret: process.env.SESSION_SECRET || "your-secret-key",
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true, // Prevents XSS attacks
    secure: false, //  Set to `true` only in production (HTTPS)
    sameSite: "lax", //  Allows cookies in same-origin requests
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  },
};

  
app.use(session(sessionConfig));
app.use(passport.authenticate("session"));



app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/enrollments', enrollmentRoutes);


app.use(notFound)
app.use(errorHandler)

app.listen(process.env.PORT, () => {
    console.log(`Server running on PORT ${process.env.PORT}...`);
  }).on('error', (err) => {
    console.error('Error occurred while starting server: ', err);
  });
