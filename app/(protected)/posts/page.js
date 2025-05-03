'use client'

import { useState, useEffect } from 'react'
import { UploadButton } from '@uploadthing/react'
import '@uploadthing/react/styles.css'
import Cookies from 'js-cookie'

export default function PostsPage() {
  const [posts, setPosts] = useState([])
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [username, setUsername] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editTitle, setEditTitle] = useState('')
  const [editContent, setEditContent] = useState('')

  useEffect(() => {
    fetchProfile()
    fetchPosts()
  }, [])

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/auth/profile', {
        headers: {
          Authorization: `Bearer ${Cookies.get('accessToken')}`,
        },
      })
      const data = await res.json()
      setUsername(data.username)
    } catch (error) {
      console.error('Ошибка получения профиля:', error)
    }
  }

  const fetchPosts = async () => {
    try {
      const res = await fetch('/api/posts')
      const data = await res.json()
      setPosts(data)
    } catch (error) {
      console.error('Ошибка загрузки постов:', error)
    }
  }

  const handleCreate = async () => {
    if (!title.trim() || !content.trim()) {
      alert('Заполните все поля!')
      return
    }

    try {
      await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          content: content.trim(),
          imageUrl,
          author: username,
        }),
      })
      setTitle('')
      setContent('')
      setImageUrl('')
      fetchPosts()
    } catch (error) {
      console.error('Ошибка создания поста:', error)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Удалить пост?')) return

    try {
      await fetch(`/api/posts/delete/${id}`, { method: 'DELETE' })
      fetchPosts()
    } catch (error) {
      console.error('Ошибка удаления поста:', error)
    }
  }

  const startEditing = (post) => {
    setEditingId(post._id)
    setEditTitle(post.title)
    setEditContent(post.content)
  }

  const cancelEditing = () => {
    setEditingId(null)
    setEditTitle('')
    setEditContent('')
  }

  const handleUpdate = async (id) => {
    try {
      await fetch(`/api/posts/update/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: editTitle,
          content: editContent,
        }),
      })
      cancelEditing()
      fetchPosts()
    } catch (error) {
      console.error('Ошибка обновления поста:', error)
    }
  }

  const handleLike = async (id) => {
    try {
      await fetch(`/api/posts/like/${id}`, { method: 'POST' })
      fetchPosts()
    } catch (error) {
      console.error('Ошибка лайка поста:', error)
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Создать пост</h1>

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Заголовок"
        style={{ display: 'block', marginBottom: 10, width: '100%', padding: 8 }}
      />

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Контент поста"
        style={{ display: 'block', marginBottom: 10, width: '100%', padding: 8, minHeight: '100px' }}
      />

      {imageUrl && (
        <img src={imageUrl} alt="post" style={{ width: 200, marginBottom: 10 }} />
      )}

      <UploadButton
        endpoint="avatarUploader"
        onClientUploadComplete={(res) => {
          setImageUrl(res[0].ufsUrl)
        }}
        onUploadError={(e) => alert(`Ошибка загрузки: ${e.message}`)}
      />

      <button onClick={handleCreate} style={{ marginTop: 10, padding: '10px 20px' }}>
        Создать пост
      </button>

      <hr style={{ margin: '30px 0' }} />

      <h2>Посты</h2>

      {posts.length === 0 && <p>Нет созданных постов.</p>}

      {posts.map((post) => (
        <div key={post._id} style={{ border: '1px solid #ccc', padding: 15, marginBottom: 20, borderRadius: 10 }}>
          {editingId === post._id ? (
            <>
              <input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                style={{ display: 'block', marginBottom: 10, width: '100%', padding: 6 }}
              />
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                style={{ display: 'block', marginBottom: 10, width: '100%', padding: 6 }}
              />
              <button onClick={() => handleUpdate(post._id)} style={{ marginRight: 10 }}>
                Сохранить
              </button>
              <button onClick={cancelEditing}>Отмена</button>
            </>
          ) : (
            <>
              <h3>{post.title}</h3>
              <p>{post.content}</p>
              {post.imageUrl && (
                <img src={post.imageUrl} alt="post" style={{ width: 200, borderRadius: 8, marginBottom: 10 }} />
              )}
              <p><strong>Автор:</strong> {post.author}</p>
              <small>Создан: {new Date(post.createdAt).toLocaleString()}</small>
              <br />
              <button onClick={() => handleDelete(post._id)} style={{ marginTop: 10, marginRight: 10, padding: '5px 15px', backgroundColor: '#e74c3c', color: '#fff', border: 'none', borderRadius: 5 }}>
                Удалить
              </button>
              <button onClick={() => startEditing(post)} style={{ marginTop: 10, marginRight: 10, padding: '5px 15px', backgroundColor: '#2ecc71', color: '#fff', border: 'none', borderRadius: 5 }}>
                Редактировать
              </button>
              <button onClick={() => handleLike(post._id)} style={{ marginTop: 10, padding: '5px 15px', backgroundColor: '#3498db', color: '#fff', border: 'none', borderRadius: 5 }}>
                ❤️ {post.likes}
              </button>
            </>
          )}
        </div>
      ))}
    </div>
  )
}
