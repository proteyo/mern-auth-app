import { connectDB } from '@/lib/mongodb'
import { User } from '@/models/User'
import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

const ACCESS_TOKEN_SECRET = 'youraccesstokensecret' // тот же что и в login

export async function GET(req) {
  try {
    const authHeader = req.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ message: 'Нет токена' }, { status: 401 })
    }

    const token = authHeader.split(' ')[1]

    let payload
    try {
      payload = jwt.verify(token, ACCESS_TOKEN_SECRET)
    } catch (error) {
      return NextResponse.json({ message: 'Неверный или просроченный токен' }, { status: 401 })
    }

    await connectDB()

    const user = await User.findById(payload.userId).select('-password')
    if (!user) {
      return NextResponse.json({ message: 'Пользователь не найден' }, { status: 404 })
    }

    return NextResponse.json({
      email: user.email,
      username: user.username,
    })
  } catch (error) {
    console.error('Ошибка получения профиля:', error)
    return NextResponse.json({ message: 'Ошибка сервера' }, { status: 500 })
  }
}
