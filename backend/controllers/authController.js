import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';

// ----------------- SIGNUP -----------------
export const signup = async (req, res) => {
  console.log("Inside signup"); 
  const { name, email, password, userType } = req.body;
  console.log("📩 Signup Request Received:", req.body);

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const exist = await User.findOne({ email });
    if (exist) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      userType: userType || "user",
    });

    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(201).json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        userType: user.userType,
      },
    });
  } catch (err) {
    console.error("❌ Signup Error:", err);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
};

// ----------------- LOGIN -----------------
export const login = async (req, res) => {
  const { email, password } = req.body;
  console.log("🔑 Login Request Received:", req.body);

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "User with this email does not exist" });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(400).json({ message: "Incorrect password" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        userType: user.userType, // ✅ This was missing!
      },
    });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
};


// ----------------- LOGOUT -----------------
export const logout = async (req, res) => {
  try {
    res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    console.error("Logout Error:", err);
    res.status(500).json({ message: "Logout error", error: err.message });
  }
};

// ----------------- GOOGLE SIGN-IN -----------------
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
export const googleSignIn = async (req, res) => {
  try {
    const { idToken } = req.body;
    if (!idToken) return res.status(400).json({ message: 'Missing idToken' });

    const ticket = await googleClient.verifyIdToken({ idToken, audience: process.env.GOOGLE_CLIENT_ID });
    const payload = ticket.getPayload();
    const email = payload.email;
    const name = payload.name || email.split('@')[0];

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({ name, email, password: await bcrypt.hash(Math.random().toString(36), 10), userType: 'user' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    return res.status(200).json({
      token,
      user: { _id: user._id, name: user.name, email: user.email, userType: user.userType },
    });
  } catch (err) {
    console.error('Google Sign-In error:', err);
    return res.status(401).json({ message: 'Invalid Google token' });
  }
};
