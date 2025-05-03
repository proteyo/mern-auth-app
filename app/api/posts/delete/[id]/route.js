import { connectDB } from '@/lib/mongodb'
import { Post } from '@/models/Post'
import { NextResponse } from 'next/server'

export async function DELETE(_, context) {
  try {
    const id = context.params.id
    await connectDB()

    await Post.findByIdAndDelete(id)

    return NextResponse.json({ message: 'Пост удалён' })
  } catch (error) {
    console.error('Ошибка удаления поста:', error)
    return NextResponse.json({ message: 'Ошибка сервера' }, { status: 500 })
  }
}
