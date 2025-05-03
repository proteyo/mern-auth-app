import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    avatarUrl: { type: String }, 
  },
  { timestamps: true }
)

export const User = mongoose.models.User || mongoose.model('User', userSchema)
