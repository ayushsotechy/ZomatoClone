const express = require('express');
const cookieParser = require('cookie-parser');

const app = express();
app.use(express.json());
app.use(cookieParser());
//Importing Routes
const authRoutes = require('./routes/auth.routes');
const foodRoutes = require('./routes/food.routes')

app.use('/api/auth', authRoutes);
app.use('/api/food',foodRoutes);
module.exports=app