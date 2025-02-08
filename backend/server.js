const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cors = require('cors')
require('dotenv').config()

const app = express();
app.use(cors())
app.use(bodyParser.json());

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('MongoDB connected');
}).catch((err) => {
    console.log('MongoDB connection error:', err);
});


const userSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    }
});


const User = mongoose.model('User', userSchema);

app.post('/register', async (req, res) => {
    try {
        const { first_name, last_name, email, username, password } = req.body;

   
        if (!first_name || !last_name || !email || !username || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }


        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User with this email already exists" });
        }

        const existingUsername = await User.findOne({ username });
        if (existingUsername) {
            return res.status(400).json({ message: "Username already taken" });
        }


        const hashedPassword = await bcrypt.hash(password, 10);

 
        const newUser = new User({
            first_name,
            last_name,
            email,
            username,
            password: hashedPassword
        });

        await newUser.save();


        res.status(201).json({ message: "User registered successfully" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: "Username and password are required" });
        }

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
            { userId: user._id, username: user.username },
            process.env.SECRET, { expiresIn: '1h' }
        );

        res.status(200).json({ message: "Login successful", token }); // Send the token to the frontend

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});


app.get('/', (req, res) => {
    const time = 12;
    console.log("The GET is working");
    res.status(200).json({ message: "The server is working" });
});
const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log("The server is running on port: ", PORT);
});
