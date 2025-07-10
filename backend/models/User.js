import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },

  password: {
    type: String,
    required: true,
    minlength: 6,
  },

  userType: {
    type: String,
    enum: ["user", "admin"], // ✅ Ensures only 'user' or 'admin' is accepted
    default: "user",         // ✅ Default role is user
  },
}, {
  timestamps: true, // optional: adds createdAt and updatedAt fields
});

const User = mongoose.model('User', userSchema);

export default User;
