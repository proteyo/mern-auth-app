'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'
import styles from '@/app/app-ui.module.css'

export default function ProfilePage() {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)
  const router = useRouter()

  useEffect(() => {
    const token = Cookies.get('accessToken')
    if (!token) {
      router.push('/login')
      return
    }

    fetchProfile()
  }, [router])

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/auth/profile', {
        headers: {
          Authorization: `Bearer ${Cookies.get('accessToken')}`,
        },
      })

      if (!res.ok) {
        throw new Error('Profile request failed')
      }

      const data = await res.json()
      setUser(data)
    } catch (error) {
      console.error('Profile loading error:', error)
      router.push('/login')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    Cookies.remove('accessToken')
    Cookies.remove('refreshToken')
    router.push('/login')
  }

  if (loading) {
    return <div className={styles.loading}>Loading profile...</div>
  }

  const username = user?.username || 'User'
  const email = user?.email || 'No email'
  const initial = username.charAt(0).toUpperCase()

  return (
    <main className={styles.shell}>
      <nav className={styles.nav}>
        <div className={styles.navBrand}>
          <strong>MERN Auth App</strong>
          <span>Protected profile dashboard</span>
        </div>

        <div className={styles.navLinks}>
          <Link href="/">Home</Link>
          <Link href="/posts">Posts</Link>
          <button className={styles.smallButton} onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

      <section className={styles.dashboard}>
        <div className={styles.dashboardGrid}>
          <aside className={styles.panel}>
            <div className={styles.profileTop}>
              <div className={styles.avatar}>
                {user?.avatarUrl ? (
                  <img src={user.avatarUrl} alt="Avatar" />
                ) : (
                  initial
                )}
              </div>

              <div>
                <div className={styles.badge}>Authenticated</div>
                <h1 className={styles.formTitle}>{username}</h1>
                <p className={styles.muted}>{email}</p>
              </div>
            </div>

            <div className={styles.featureList}>
              <div className={styles.featureItem}>
                <strong>Access token</strong>
                <span>Profile data is loaded with a JWT Bearer token.</span>
              </div>
              <div className={styles.featureItem}>
                <strong>Private route</strong>
                <span>Without a token, the user is redirected to login.</span>
              </div>
            </div>
          </aside>

          <section className={styles.panel}>
            <div className={styles.badge}>Account overview</div>
            <h2 className={styles.formTitle}>Profile details</h2>
            <p className={styles.formText}>
              This page demonstrates protected client-side access, token-based
              API calls and user profile rendering.
            </p>

            <div className={styles.stats}>
              <div className={styles.statCard}>
                <strong>JWT</strong>
                <span>Authentication</span>
              </div>
              <div className={styles.statCard}>
                <strong>API</strong>
                <span>/api/auth/profile</span>
              </div>
              <div className={styles.statCard}>
                <strong>DB</strong>
                <span>MongoDB user</span>
              </div>
            </div>

            <div style={{ marginTop: 18 }} className={styles.notice}>
              Avatar upload is prepared through Uploadthing. To enable it
              locally, add <code>UPLOADTHING_TOKEN</code> to your environment
              variables.
            </div>

            <div className={styles.actions}>
              <Link className={styles.primaryButton} href="/posts">
                Open posts
              </Link>
              <button className={styles.dangerButton} onClick={handleLogout}>
                Logout
              </button>
            </div>
          </section>
        </div>
      </section>
    </main>
  )
}