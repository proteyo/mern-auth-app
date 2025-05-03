import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

const ACCESS_TOKEN_SECRET = 'youraccesstokensecret'  // как в login
const REFRESH_TOKEN_SECRET = 'yourrefreshtokensecret' // как в login

export async function POST(req) {
  try {
    const { refreshToken } = await req.json()

    if (!refreshToken) {
      return NextResponse.json({ message: 'Нет refresh токена' }, { status: 400 })
    }

    let payload
    try {
      payload = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET)
    } catch (error) {
      return NextResponse.json({ message: 'Неверный или просроченный refresh токен' }, { status: 401 })
    }

    const newAccessToken = jwt.sign(
      { userId: payload.userId, email: payload.email },
      ACCESS_TOKEN_SECRET,
      { expiresIn: '15m' }
    )

    const newRefreshToken = jwt.sign(
      { userId: payload.userId, email: payload.email },
      REFRESH_TOKEN_SECRET,
      { expiresIn: '7d' }
    )

    return NextResponse.json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    })
  } catch (error) {
    console.error('Ошибка обновления токенов:', error)
    return NextResponse.json({ message: 'Ошибка сервера' }, { status: 500 })
  }
}
