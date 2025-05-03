import { connectDB } from '@/lib/mongodb'
import { Post } from '@/models/Post'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    await connectDB()
    const posts = await Post.find().sort({ createdAt: -1 })
    return NextResponse.json(posts)
  } catch (error) {
    console.error('Ошибка получения постов:', error)
    return NextResponse.json({ message: 'Ошибка сервера' }, { status: 500 })
  }
}

export async function POST(req) {
  try {
    const { title, content, imageUrl, author } = await req.json()

    if (!title || !content || !author) {
      return NextResponse.json({ message: 'Заполните все обязательные поля' }, { status: 400 })
    }
      await connectDB()

    const newPost = new Post({
      title,
      content,
      imageUrl,
      author,
    })

    await newPost.save()

    return NextResponse.json({ message: 'Пост создан' }, { status: 201 })
  } catch (error) {
    console.error('Ошибка создания поста:', error)
    return NextResponse.json({ message: 'Ошибка сервера' }, { status: 500 })
  }
}
