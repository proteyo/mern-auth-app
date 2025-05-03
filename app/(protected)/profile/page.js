'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'
import { AvatarUploader } from '@/components/AvatarUploader'

export default function ProfilePage() {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)
  const router = useRouter()

  useEffect(() => {
    const token = Cookies.get('accessToken')
    if (!token) {
      router.push('/login')
    } else {
      fetchProfile()
    }
  }, [router])

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/auth/profile', {
        headers: {
          Authorization: `Bearer ${Cookies.get('accessToken')}`,
        },
      })
      const data = await res.json()
      setUser(data)
      setLoading(false)
    } catch (error) {
      console.error('Ошибка загрузки профиля:', error)
      router.push('/login')
    }
  }

  const handleLogout = () => {
    Cookies.remove('accessToken')
    Cookies.remove('refreshToken')
    router.push('/login')
  }

  const handleAvatarUpload = async (url) => {
    try {
      await fetch('/api/auth/avatar', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${Cookies.get('accessToken')}`,
        },
        body: JSON.stringify({ avatarUrl: url }),
      })
      fetchProfile() // После загрузки аватара перезагружаем профиль
    } catch (error) {
      console.error('Ошибка загрузки аватара:', error)
    }
  }

  if (loading) return <div>Загрузка...</div>

  return (
    <div style={{ padding: '20px', backgroundColor: '#000', minHeight: '100vh', color: '#fff' }}>
      <h1>Профиль</h1>
      <p>Добро пожаловать, {user?.username || 'Пользователь'}!</p>

      {user?.avatarUrl ? (
        <div style={{ margin: '20px 0' }}>
          <img
            src={user.avatarUrl}
            alt="Avatar"
            style={{
              width: '150px',
              height: '150px',
              objectFit: 'cover',
              borderRadius: '50%',
              backgroundColor: '#333',
              display: 'block',
              marginBottom: '10px',
            }}
          />
        </div>
      ) : (
        <AvatarUploader onUploadComplete={handleAvatarUpload} />
      )}

      {!user?.avatarUrl && (
        <p style={{ marginBottom: '20px' }}>Загрузите аватар</p>
      )}

      <button
        onClick={() => router.push('/posts')}
        style={{
          marginTop: '20px',
          marginBottom: '20px',
          padding: '8px 16px',
          backgroundColor: '#3498db',
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer'
        }}
      >
        Перейти к постам
      </button>

      <button
        onClick={handleLogout}
        style={{
          padding: '8px 16px',
          backgroundColor: '#e74c3c',
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer'
        }}
      >
        Выйти
      </button>
    </div>
  )
}
