const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const port = 3000;

const mongoURI = "mongodb://192.168.75.137/27017/testdb";

mongoose.connect(mongoURI)
    .then(() => console.log("Conected to MongoDB"))
    .catch(err => console.log("MongoDB Connection error:", err));

app.use(cors());

app.get('/', (req, res) => res.send('Backend is running!'));

app.listen(port, () => console.log(`Server running on port ${port}`));
