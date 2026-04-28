// import required packages
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');


// initialize app
const app = express();

// load environment variables
dotenv.config();

// middleware
app.use(cors());
app.use(express.json());

// test route to check if server is running
app.get('/', (req, res) => {
    res.send('API is running');
});


//port
const PORT = process.env.PORT || 5000;

// start server
app.listen(PORT, '127.0.0.1', () => {
  console.log(`Server running on http://127.0.0.1:${PORT}`);
});


