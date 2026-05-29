import Link from "next/link";
import styles from "./page.module.css";

const features = [
  {
    title: "JWT Authentication",
    text: "Secure login, registration, access token and refresh token logic.",
  },
  {
    title: "Protected Pages",
    text: "Private profile and posts pages available only for authenticated users.",
  },
  {
    title: "MongoDB + Mongoose",
    text: "User accounts, posts and profile data are stored in MongoDB.",
  },
  {
    title: "Posts CRUD",
    text: "Create, update, delete and like posts through API routes.",
  },
  {
    title: "Avatar Upload",
    text: "Profile avatar upload is prepared through Uploadthing integration.",
  },
  {
    title: "Form Validation",
    text: "React Hook Form and Zod are used for clean form validation.",
  },
];

const stack = [
  "Next.js 15",
  "React 19",
  "MongoDB",
  "Mongoose",
  "JWT",
  "bcryptjs",
  "Zod",
  "React Hook Form",
  "Uploadthing",
];

export default function Home() {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.badge}>Portfolio Project</div>

          <h1>
            MERN Auth App
            <span>Authentication system with protected pages and posts.</span>
          </h1>

          <p className={styles.description}>
            A Next.js authentication project built with MongoDB, JWT, protected
            routes, refresh token logic, profile management, posts CRUD and
            avatar upload integration.
          </p>

          <div className={styles.actions}>
            <Link className={styles.primaryButton} href="/register">
              Create account
            </Link>

            <Link className={styles.secondaryButton} href="/login">
              Sign in
            </Link>
          </div>

          <div className={styles.quickLinks}>
            <Link href="/profile">Protected Profile</Link>
            <Link href="/posts">Posts Page</Link>
          </div>
        </div>

        <div className={styles.previewCard}>
          <div className={styles.windowTop}>
            <span />
            <span />
            <span />
          </div>

          <div className={styles.previewHeader}>
            <div>
              <p>Auth Flow</p>
              <h2>Login → JWT → Protected Page</h2>
            </div>
            <div className={styles.status}>Active</div>
          </div>

          <div className={styles.flow}>
            <div className={styles.flowItem}>
              <strong>1</strong>
              <span>Register</span>
            </div>
            <div className={styles.line} />
            <div className={styles.flowItem}>
              <strong>2</strong>
              <span>Login</span>
            </div>
            <div className={styles.line} />
            <div className={styles.flowItem}>
              <strong>3</strong>
              <span>Access protected data</span>
            </div>
          </div>

          <div className={styles.codeBox}>
            <span>API routes</span>
            <p>/api/auth/login</p>
            <p>/api/auth/register</p>
            <p>/api/auth/refresh</p>
            <p>/api/posts</p>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <p>Features</p>
          <h2>What this project includes</h2>
        </div>

        <div className={styles.grid}>
          {features.map((feature) => (
            <article className={styles.card} key={feature.title}>
              <h3>{feature.title}</h3>
              <p>{feature.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.stackSection}>
        <div>
          <p className={styles.label}>Tech Stack</p>
          <h2>Built with modern full-stack tools</h2>
        </div>

        <div className={styles.stackList}>
          {stack.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      </section>

      <section className={styles.note}>
        <h2>Environment setup</h2>
        <p>
          Avatar upload requires an <code>UPLOADTHING_TOKEN</code> environment
          variable. If it is not configured locally, the upload feature will show
          a missing token warning while the rest of the app can still run.
        </p>
      </section>
    </main>
  );
}