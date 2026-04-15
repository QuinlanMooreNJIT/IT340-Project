const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

app.use(cors());
app.use(express.json());

const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes)

const port = 3000;

const mongoURI = "mongodb://192.168.75.137:27017/testdb";

mongoose.connect(mongoURI)
    .then(() => console.log("Conected to MongoDB"))
    .catch(err => console.log("MongoDB Connection error:", err));

app.get('/', (req, res) => res.send('Backend is running!'));

app.listen(port, '0.0.0.0', () => {
    console.log(`Server running on port ${port}`);
});
