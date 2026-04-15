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
    
const userSchema = new mongoose.Schema({
    name: String,
    age: Number
});

const User = mongoose.model('User', userSchema);

app.get('/', (req, res) => res.send('Backend is running!'));

app.get('/users', async (req, res) => {
    try {
        const users = await User.find()
        res.json(users);
    } catch (err) {
        console.error("ERROR", err);
        res.status(500).send("Error fetching users");
    }
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Server running on port ${port}`);
});
