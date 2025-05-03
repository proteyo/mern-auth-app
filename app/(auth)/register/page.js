'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { AuthService } from '../../../services/auth'
import { handleApiError } from '../../../services/errorHandler'
import { Notification } from '../../../components/Notification'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Cookies from 'js-cookie'

const schema = z.object({
  email: z.string().email('Введите корректный email'),
  username: z.string().min(3, 'Имя пользователя слишком короткое'),
  password: z.string().min(6, 'Пароль должен быть не менее 6 символов'),
})

export default function RegisterPage() {
  const router = useRouter()
  const [error, setError] = useState('')
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data) => {
    try {
      await AuthService.register(data)

      Cookies.remove('accessToken')
      Cookies.remove('refreshToken')

      router.push('/login')
    } catch (err) {
      setError(handleApiError(err))
    }
  }

  return (
    <div>
      <h1>Регистрация</h1>

      {error && (
        <Notification
          message={error}
          type="error"
          onClose={() => setError('')}
        />
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <input {...register('email')} placeholder="Email" />
        {errors.email && <p style={{ color: 'red' }}>{errors.email.message}</p>}

        <input {...register('username')} placeholder="Имя пользователя" />
        {errors.username && <p style={{ color: 'red' }}>{errors.username.message}</p>}

        <input type="password" {...register('password')} placeholder="Пароль" />
        {errors.password && <p style={{ color: 'red' }}>{errors.password.message}</p>}

        <button type="submit">Зарегистрироваться</button>
      </form>
    </div>
  )
}
