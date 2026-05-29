'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import Cookies from 'js-cookie'
import styles from '@/app/app-ui.module.css'

export default function PostsPage() {
  const [posts, setPosts] = useState([])
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [username, setUsername] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editTitle, setEditTitle] = useState('')
  const [editContent, setEditContent] = useState('')
  const [loading, setLoading] = useState(true)

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

      if (!res.ok) return

      const data = await res.json()
      setUsername(data.username || 'Anonymous')
    } catch (error) {
      console.error('Profile loading error:', error)
    }
  }

  const fetchPosts = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/posts')
      const data = await res.json()
      setPosts(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Posts loading error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async () => {
    if (!title.trim() || !content.trim()) {
      alert('Please fill in title and content.')
      return
    }

    try {
      await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          content: content.trim(),
          imageUrl: imageUrl.trim(),
          author: username || 'Anonymous',
        }),
      })

      setTitle('')
      setContent('')
      setImageUrl('')
      fetchPosts()
    } catch (error) {
      console.error('Post creation error:', error)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this post?')) return

    try {
      await fetch(`/api/posts/delete/${id}`, { method: 'DELETE' })
      fetchPosts()
    } catch (error) {
      console.error('Post delete error:', error)
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
    if (!editTitle.trim() || !editContent.trim()) {
      alert('Please fill in title and content.')
      return
    }

    try {
      await fetch(`/api/posts/update/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: editTitle.trim(),
          content: editContent.trim(),
        }),
      })

      cancelEditing()
      fetchPosts()
    } catch (error) {
      console.error('Post update error:', error)
    }
  }

  const handleLike = async (id) => {
    try {
      await fetch(`/api/posts/like/${id}`, { method: 'POST' })
      fetchPosts()
    } catch (error) {
      console.error('Post like error:', error)
    }
  }

  return (
    <main className={styles.shell}>
      <nav className={styles.nav}>
        <div className={styles.navBrand}>
          <strong>MERN Auth App</strong>
          <span>Posts CRUD dashboard</span>
        </div>

        <div className={styles.navLinks}>
          <Link href="/">Home</Link>
          <Link href="/profile">Profile</Link>
          <Link href="/login">Login</Link>
        </div>
      </nav>

      <section className={styles.postsLayout}>
        <aside className={styles.createCard}>
          <div className={styles.badge}>Create post</div>
          <h1 className={styles.formTitle}>New post</h1>
          <p className={styles.formText}>
            Create a post, attach an image URL, edit content, delete posts and
            test likes through API routes.
          </p>

          <div className={styles.form}>
            <div className={styles.field}>
              <label>Title</label>
              <input
                className={styles.input}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Post title"
              />
            </div>

            <div className={styles.field}>
              <label>Content</label>
              <textarea
                className={styles.textarea}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write something..."
              />
            </div>

            <div className={styles.field}>
              <label>Image URL optional</label>
              <input
                className={styles.input}
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className={styles.notice}>
              Uploadthing integration is prepared in the project. For portfolio
              demo without token, image URL input is used instead.
            </div>

            <button className={styles.primaryButton} onClick={handleCreate}>
              Create post
            </button>
          </div>
        </aside>

        <section className={styles.postsList}>
          <div className={styles.panel}>
            <div className={styles.badge}>Posts</div>
            <h2 className={styles.formTitle}>Community feed</h2>
            <p className={styles.formText}>
              Data is loaded from the MongoDB-backed API route.
            </p>
          </div>

          {loading && <div className={styles.empty}>Loading posts...</div>}

          {!loading && posts.length === 0 && (
            <div className={styles.empty}>
              No posts yet. Create the first post from the left panel.
            </div>
          )}

          {posts.map((post) => (
            <article className={styles.postCard} key={post._id}>
              {editingId === post._id ? (
                <div className={styles.form}>
                  <div className={styles.field}>
                    <label>Edit title</label>
                    <input
                      className={styles.input}
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                    />
                  </div>

                  <div className={styles.field}>
                    <label>Edit content</label>
                    <textarea
                      className={styles.textarea}
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                    />
                  </div>

                  <div className={styles.actions}>
                    <button
                      className={styles.primaryButton}
                      onClick={() => handleUpdate(post._id)}
                    >
                      Save changes
                    </button>
                    <button
                      className={styles.secondaryButton}
                      onClick={cancelEditing}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className={styles.postHeader}>
                    <div>
                      <h3>{post.title}</h3>
                      <span className={styles.muted}>
                        By {post.author || 'Anonymous'} ·{' '}
                        {post.createdAt
                          ? new Date(post.createdAt).toLocaleString()
                          : 'No date'}
                      </span>
                    </div>

                    <button
                      className={styles.smallButton}
                      onClick={() => handleLike(post._id)}
                    >
                      ♥ {post.likes || 0}
                    </button>
                  </div>

                  <p>{post.content}</p>

                  {post.imageUrl && (
                    <img
                      className={styles.postImage}
                      src={post.imageUrl}
                      alt={post.title}
                    />
                  )}

                  <div className={styles.actions}>
                    <button
                      className={styles.secondaryButton}
                      onClick={() => startEditing(post)}
                    >
                      Edit
                    </button>
                    <button
                      className={styles.dangerButton}
                      onClick={() => handleDelete(post._id)}
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </article>
          ))}
        </section>
      </section>
    </main>
  )
}