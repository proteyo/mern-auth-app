import { connectDB } from '@/lib/mongodb'
import { Post } from '@/models/Post'
import { NextResponse } from 'next/server'

export async function PUT(req, context) {
  try {
    const id = context.params.id
    const { title, content } = await req.json()

    if (!title || !content) {
      return NextResponse.json({ message: 'Заполните все поля' }, { status: 400 })
    }

    await connectDB()
    await Post.findByIdAndUpdate(id, { title, content })

    return NextResponse.json({ message: 'Пост обновлён' })
  } catch (error) {
    console.error('Ошибка обновления поста:', error)
    return NextResponse.json({ message: 'Ошибка сервера' }, { status: 500 })
  }
}
