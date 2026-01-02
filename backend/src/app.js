const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
require("./config/passport.js"); // Loads the passport config

const app = express();
app.use(cors({
    origin: "http://localhost:5173", // Allow your React frontend
    credentials: true               // Allow cookies to be sent
}));
app.use(express.json());

app.use(cookieParser());
//Importing Routes
const authRoutes = require('./routes/auth.routes');
const foodRoutes = require('./routes/food.routes')

app.use('/auth', authRoutes);
app.use('/food',foodRoutes);
module.exports=app