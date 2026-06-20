const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const passport = require("passport"); // 👈 Import passport package
require("dotenv").config(); // Ensure env variables are loaded
require("./config/passport.js"); // Loads your specific strategy config

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://flavorfeed.in",
  "https://www.flavorfeed.in",
  process.env.CLIENT_URL,
  ...(process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(",") : [])
].filter(Boolean);

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            var msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize()); // 👈 CRITICAL: Add this line!

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

// Importing Routes
const authRoutes = require('./routes/auth.routes');
const foodRoutes = require('./routes/food.routes');
const paymentRoutes = require("./routes/payment.routes");

app.use('/auth', authRoutes);
app.use('/food', foodRoutes);
app.use("/payment", paymentRoutes);
app.use("/orders", paymentRoutes);

module.exports = app;
