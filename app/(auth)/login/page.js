'use client'

import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import { AuthService } from '@/services/auth'
import { handleApiError } from '@/services/errorHandler'
import { Notification } from '@/components/Notification'
import styles from '@/app/app-ui.module.css'

const schema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(6, 'Password must contain at least 6 characters'),
})

export default function LoginPage() {
  const router = useRouter()
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

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
      router.push('/profile')
    }
  }, [router])

  const onSubmit = async (data) => {
    try {
      setSubmitting(true)
      setError('')

      await AuthService.login(data)

      router.push('/profile')
    } catch (err) {
      setError(handleApiError(err))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className={styles.shell}>
      <section className={styles.center}>
        <div className={styles.authGrid}>
          <div className={styles.heroCard}>
            <div className={styles.badge}>Authentication</div>
            <h1 className={styles.title}>Welcome back</h1>
            <p className={styles.subtitle}>
              Sign in to access your protected profile, create posts and test
              the JWT authentication flow.
            </p>

            <div className={styles.featureList}>
              <div className={styles.featureItem}>
                <strong>JWT access</strong>
                <span>Login returns an access token stored in cookies.</span>
              </div>
              <div className={styles.featureItem}>
                <strong>Protected profile</strong>
                <span>Private pages are available only after authentication.</span>
              </div>
              <div className={styles.featureItem}>
                <strong>Refresh flow</strong>
                <span>The project includes refresh token API logic.</span>
              </div>
            </div>
          </div>

          <div className={styles.formCard}>
            <div className={styles.badge}>Sign in</div>
            <h2 className={styles.formTitle}>Login</h2>
            <p className={styles.formText}>
              Enter your email and password to continue.
            </p>

            {error && (
              <Notification
                message={error}
                type="error"
                onClose={() => setError('')}
              />
            )}

            <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
              <div className={styles.field}>
                <label>Email</label>
                <input
                  className={styles.input}
                  {...register('email')}
                  placeholder="email@example.com"
                  autoComplete="email"
                />
                {errors.email && (
                  <p className={styles.error}>{errors.email.message}</p>
                )}
              </div>

              <div className={styles.field}>
                <label>Password</label>
                <input
                  className={styles.input}
                  type="password"
                  {...register('password')}
                  placeholder="At least 6 characters"
                  autoComplete="current-password"
                />
                {errors.password && (
                  <p className={styles.error}>{errors.password.message}</p>
                )}
              </div>

              <button
                className={styles.primaryButton}
                type="submit"
                disabled={submitting}
              >
                {submitting ? 'Signing in...' : 'Sign in'}
              </button>
            </form>

            <div className={styles.linkRow}>
              <span>No account?</span>
              <Link href="/register">Create one</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}