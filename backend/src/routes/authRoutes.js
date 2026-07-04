import { generateToken } from "../lib/utils.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import express from "express";

const router = express.Router();

export const signup = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        if (!username || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }

        if (username.length < 3) {
            return res.status(400).json({ message: "Username should be at least 3 characters long" });
        }

        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ message: "Email already exists" });
        }

        const existingUsername = await User.findOne({ username });
        if (existingUsername) {
            return res.status(400).json({ message: "Username already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const profilePic = `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`;


        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            profilePic,
        });

        if (newUser) {
            // generate jwt token here
            const token = generateToken(newUser._id, res);
            await newUser.save();

            res.status(201).json({
                token,
                _id: newUser._id,
                username: newUser.username,
                email: newUser.email,
                profilePic: newUser.profilePic,
            });
        } else {
            res.status(400).json({ message: "Invalid user data" });
        }
    } catch (error) {
        console.log("Error in signup controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Invalid credentials" });
        }


        const token = generateToken(user._id, res);

        res.status(200).json({
            token,
            _id: user._id,
            username: user.username,
            email: user.email,
            profilePic: user.profilePic,
        });
    } catch (error) {
        console.log("Error in login controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const logout = (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 });
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.log("Error in logout controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};



export const checkAuth = (req, res) => {
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.log("Error in checkAuth controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export default router;