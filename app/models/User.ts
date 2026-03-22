import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: false }, // Optional for social login
    authType: {
      type: String,
      enum: ['email', 'google', 'outlook'],
      default: 'email'
    },
    theme: { type: String, enum: ['light', 'dark'], default: 'light' },
    emailConnection: {
      provider: { type: String, enum: ['gmail', 'outlook', 'resend', 'none'], default: 'none' },
      accessToken: String,
      refreshToken: String,
      expiryDate: Number,
      email: String,
    },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model('User', UserSchema);

