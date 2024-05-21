import 'dotenv/config';
import express from "express";
import cors from "cors";
import mongoose from 'mongoose';

import dnsRoutes from "./Routes/dnsRoutes.js"
import domainRoutes from "./Routes/domainRoutes.js"
import User from './Models/userModel.js';


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
    cors({
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true
    })
);

const url = process.env.MONGO_URI;

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected successfully to MongoDB'))
    .catch(err => console.error('Failed to connect to MongoDB', err));

// Connect to MongoDB

app.post('/signup', async (req, res) => {
    console.log(req.body);
    const { name, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Already registered" });
        }

        const newUser = new User({ name, email, password });
        await newUser.save();
        res.status(201).json(newUser);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Login endpoint
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (user) {
            if (user.password === password) {
                res.status(200).json({ message: "Success" });
            } else {
                res.status(400).json({ message: "Wrong password" });
            }
        } else {
            res.status(404).json({ message: "No records found!" });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.use("/api/dns", dnsRoutes);
app.use("/api/domain", domainRoutes)


const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
