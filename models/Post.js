import mongoose from 'mongoose'

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    imageUrl: { type: String },
    author: { type: String, required: true },
    likes: { type: Number, default: 0 },
  },
  { timestamps: true }
)

export const Post = mongoose.models.Post || mongoose.model('Post', postSchema)
