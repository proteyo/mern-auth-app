import { connectDB } from '@/lib/mongodb'
import { Post } from '@/models/Post'
import { NextResponse } from 'next/server'

export async function POST(_, { params }) {
  try {
    const { id } = params
    await connectDB()

    const post = await Post.findById(id)
    if (!post) {
      return NextResponse.json({ message: 'Пост не найден' }, { status: 404 })
    }

    post.likes += 1
    await post.save()

    return NextResponse.json({ message: 'Лайк добавлен' })
  } catch (error) {
    console.error('Ошибка добавления лайка:', error)
    return NextResponse.json({ message: 'Ошибка сервера' }, { status: 500 })
  }
}
