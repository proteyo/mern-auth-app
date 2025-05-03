import { connectDB } from '@/lib/mongodb'
import { User } from '@/models/User'
import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const ACCESS_TOKEN_SECRET = 'youraccesstokensecret'
const REFRESH_TOKEN_SECRET = 'yourrefreshtokensecret'

export async function POST(req) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json({ message: 'Заполните все поля' }, { status: 400 })
    }

    await connectDB()

    const user = await User.findOne({ email })
    if (!user) {
      return NextResponse.json({ message: 'Неверный email или пароль' }, { status: 401 })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return NextResponse.json({ message: 'Неверный email или пароль' }, { status: 401 })
    }

    const accessToken = jwt.sign(
      { userId: user._id, email: user.email },
      ACCESS_TOKEN_SECRET,
      { expiresIn: '15m' }
    )

    const refreshToken = jwt.sign(
      { userId: user._id, email: user.email },
      REFRESH_TOKEN_SECRET,
      { expiresIn: '7d' }
    )

    return NextResponse.json({
      accessToken,
      refreshToken,
      username: user.username,
    })
  } catch (error) {
    console.error('Ошибка при логине:', error)
    return NextResponse.json({ message: 'Ошибка сервера' }, { status: 500 })
  }
}
