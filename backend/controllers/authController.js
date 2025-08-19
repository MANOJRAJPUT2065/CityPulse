import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';

// ----------------- SIGNUP -----------------
export const signup = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: "Validation failed", 
        errors: errors.array() 
      });
    }

    const { name, email, password, userType } = req.body;
    console.log("📩 Signup Request Received:", { name, email, userType });

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User with this email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = new User({
      name: name.trim(),
      email: email.toLowerCase(),
      password: hashedPassword,
      userType: userType || "user",
    });

    await user.save();

    const token = jwt.sign(
      { 
        id: user._id, 
        email: user.email, 
        userType: user.userType 
      }, 
      process.env.JWT_SECRET, 
      { expiresIn: "7d" }
    );

    console.log(`✅ New user registered: ${user.email} (${user.userType})`);

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        userType: user.userType,
        createdAt: user.createdAt
      },
    });
  } catch (err) {
    console.error("❌ Signup Error:", err);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
};

// ----------------- LOGIN -----------------
export const login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: "Validation failed", 
        errors: errors.array() 
      });
    }

    const { email, password } = req.body;
    console.log("🔑 Login Request Received:", { email });

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    const token = jwt.sign(
      { 
        id: user._id, 
        email: user.email, 
        userType: user.userType 
      }, 
      process.env.JWT_SECRET, 
      { expiresIn: "7d" }
    );

    console.log(`✅ User logged in: ${user.email} (${user.userType})`);

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        userType: user.userType,
        lastLogin: user.lastLogin
      },
    });
  } catch (err) {
    console.error("❌ Login Error:", err);
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

// ----------------- GET USER PROFILE -----------------
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        userType: user.userType,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin
      }
    });
  } catch (error) {
    console.error("❌ Get Profile Error:", error);
    res.status(500).json({ message: "Error fetching profile", error: error.message });
  }
};

// ----------------- UPDATE USER PROFILE -----------------
export const updateProfile = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: "Validation failed", 
        errors: errors.array() 
      });
    }

    const { name, email } = req.body;
    const userId = req.user.id;

    // Check if email is already taken by another user
    if (email) {
      const existingUser = await User.findOne({ 
        email: email.toLowerCase(), 
        _id: { $ne: userId } 
      });
      
      if (existingUser) {
        return res.status(400).json({ message: "Email is already in use" });
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { 
        ...(name && { name: name.trim() }),
        ...(email && { email: email.toLowerCase() })
      },
      { new: true, select: '-password' }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log(`✅ Profile updated: ${updatedUser.email}`);

    res.json({
      message: "Profile updated successfully",
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        userType: updatedUser.userType,
        createdAt: updatedUser.createdAt,
        lastLogin: updatedUser.lastLogin
      }
    });
  } catch (error) {
    console.error("❌ Update Profile Error:", error);
    res.status(500).json({ message: "Error updating profile", error: error.message });
  }
};

// ----------------- CHANGE PASSWORD -----------------
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Current password and new password are required" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "New password must be at least 6 characters long" });
    }

    const user = await User.findById(req.user.id).select('+password');
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    
    if (!isCurrentPasswordValid) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 12);
    user.password = hashedNewPassword;
    await user.save();

    console.log(`✅ Password changed for user: ${user.email}`);

    res.json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("❌ Change Password Error:", error);
    res.status(500).json({ message: "Error changing password", error: error.message });
  }
};

// ----------------- VERIFY TOKEN -----------------
export const verifyToken = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      valid: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        userType: user.userType
      }
    });
  } catch (error) {
    console.error("❌ Verify Token Error:", error);
    res.status(500).json({ message: "Error verifying token", error: error.message });
  }
};
