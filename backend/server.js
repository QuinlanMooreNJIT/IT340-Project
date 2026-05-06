require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const morgan = require('morgan');
const fs = require('fs');
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());

const logDirectory = path.join(__dirname, 'logs');

console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "SET" : "MISSING");


if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory);
}

const accessLogStream = fs.createWriteStream(
    path.join(logDirectory, 'access.log'),
    { flags: 'a' }
);

app.use(morgan('combined', { stream: accessLogStream }));

const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes)

const listingsRoutes = require("./routes/listings");
app.use("/api/listings", listingsRoutes);

const mfaRoutes = require("./routes/mfaRoutes");
app.use("/api/mfa", mfaRoutes);

const authMiddleware = require("./middleware/authMiddleware");

app.get('/', (req, res) => res.send('Backend is running!'));

app.get("/api/protected", authMiddleware, (req, res) => {
    res.json({
        message: "You access protected data",
        user: req.user
    });
});

const mongoURI = "mongodb://192.168.10.30:27017/testdb";

mongoose.connect(mongoURI)
    .then(() => console.log("Conected to MongoDB"))
    .catch(err => console.log("MongoDB Connection error:", err));

const port = 3000;

app.listen(port, '0.0.0.0', () => {
    console.log(`Server running on port ${port}`);
});
