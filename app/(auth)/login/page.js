'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import { AuthService } from '@/services/auth'
import { handleApiError } from '@/services/errorHandler'
import { Notification } from '@/components/Notification'

const schema = z.object({
  email: z.string().email('Введите корректный email'),
  password: z.string().min(6, 'Минимум 6 символов'),
})

export default function LoginPage() {
  const router = useRouter()
  const [error, setError] = useState('')
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  })

  useEffect(() => {
    const token = Cookies.get('accessToken')
    if (token) {
      setTimeout(() => {
        router.push('/profile')
      }, 100)
    }
  }, [])

  const onSubmit = async (data) => {
    try {
      await AuthService.login(data)

      setTimeout(() => {
        router.push('/profile')
      }, 100)
    } catch (err) {
      setError(handleApiError(err))
    }
  }

  return (
    <div>
      <h1>Вход</h1>

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

        <input type="password" {...register('password')} placeholder="Пароль" />
        {errors.password && <p style={{ color: 'red' }}>{errors.password.message}</p>}

        <button type="submit">Войти</button>
      </form>
    </div>
  )
}
