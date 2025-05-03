import { connectDB } from '@/lib/mongodb'
import { User } from '@/models/User'
import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'

export async function POST(req) {
  try {
    const { email, username, password } = await req.json()

    if (!email || !username || !password) {
      return NextResponse.json({ message: 'Заполните все поля' }, { status: 400 })
    }

    await connectDB()

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return NextResponse.json({ message: 'Пользователь уже существует' }, { status: 409 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = new User({
      email,
      username,
      password: hashedPassword,
    })

    await newUser.save()

    return NextResponse.json({ message: 'Пользователь зарегистрирован' }, { status: 200 })
  } catch (error) {
    console.error('Ошибка при регистрации:', error)
    return NextResponse.json({ message: 'Ошибка сервера' }, { status: 500 })
  }
}
