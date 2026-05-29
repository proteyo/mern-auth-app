'use client'

import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { AuthService } from '@/services/auth'
import { handleApiError } from '@/services/errorHandler'
import { Notification } from '@/components/Notification'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Cookies from 'js-cookie'
import styles from '@/app/app-ui.module.css'

const schema = z.object({
  email: z.string().email('Enter a valid email address'),
  username: z.string().min(3, 'Username must contain at least 3 characters'),
  password: z.string().min(6, 'Password must contain at least 6 characters'),
})

export default function RegisterPage() {
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

  const onSubmit = async (data) => {
    try {
      setSubmitting(true)
      setError('')

      await AuthService.register(data)

      Cookies.remove('accessToken')
      Cookies.remove('refreshToken')

      router.push('/login')
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
            <div className={styles.badge}>Create account</div>
            <h1 className={styles.title}>Build a secure user flow</h1>
            <p className={styles.subtitle}>
              This page demonstrates registration, validation, password hashing
              on the backend side and authentication-ready user creation.
            </p>

            <div className={styles.featureList}>
              <div className={styles.featureItem}>
                <strong>Validation</strong>
                <span>React Hook Form and Zod check data before submit.</span>
              </div>
              <div className={styles.featureItem}>
                <strong>MongoDB users</strong>
                <span>Registered users are stored through Mongoose models.</span>
              </div>
              <div className={styles.featureItem}>
                <strong>Secure password</strong>
                <span>Passwords are hashed before being saved.</span>
              </div>
            </div>
          </div>

          <div className={styles.formCard}>
            <div className={styles.badge}>Register</div>
            <h2 className={styles.formTitle}>New account</h2>
            <p className={styles.formText}>
              Create an account and then sign in to open protected pages.
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
                <label>Username</label>
                <input
                  className={styles.input}
                  {...register('username')}
                  placeholder="Your username"
                  autoComplete="username"
                />
                {errors.username && (
                  <p className={styles.error}>{errors.username.message}</p>
                )}
              </div>

              <div className={styles.field}>
                <label>Password</label>
                <input
                  className={styles.input}
                  type="password"
                  {...register('password')}
                  placeholder="At least 6 characters"
                  autoComplete="new-password"
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
                {submitting ? 'Creating account...' : 'Create account'}
              </button>
            </form>

            <div className={styles.linkRow}>
              <span>Already registered?</span>
              <Link href="/login">Sign in</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}