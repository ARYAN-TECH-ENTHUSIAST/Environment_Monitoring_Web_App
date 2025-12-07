const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: function () {
        return this.role === 'user';
      }
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },
    passwordHash: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      required: true
    },
    // only for normal users
    location: {
      type: String,
      required: function () {
        return this.role === 'user';
      }
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
