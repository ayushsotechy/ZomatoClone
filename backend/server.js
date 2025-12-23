require('dotenv').config();
const app = require('./src/app')
const connectDB = require('./src/db/db')

connectDB();
app.listen(4444, () => {
    console.log(`Server is running at http://localhost:${4444}`);
    
});