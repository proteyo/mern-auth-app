import { connectDB } from '@/lib/mongodb'
import { User } from '@/models/User'
import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

const ACCESS_TOKEN_SECRET = 'youraccesstokensecret'

export async function PUT(req) {
  try {
    const authHeader = req.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ message: 'Нет токена' }, { status: 401 })
    }

    const token = authHeader.split(' ')[1]
    const { avatarUrl } = await req.json()

    if (!avatarUrl) {
      return NextResponse.json({ message: 'Нет ссылки на аватар' }, { status: 400 })
    }

    const payload = jwt.verify(token, ACCESS_TOKEN_SECRET)

    await connectDB()

    await User.findByIdAndUpdate(payload.userId, { avatarUrl })

    return NextResponse.json({ message: 'Аватар обновлён' })
  } catch (error) {
    console.error('Ошибка обновления аватара:', error)
    return NextResponse.json({ message: 'Ошибка сервера' }, { status: 500 })
  }
}
