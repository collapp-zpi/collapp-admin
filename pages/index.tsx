import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { signOut, useSession } from 'next-auth/react'
import { signIn } from 'next-auth/react'
import { FormEvent, useState } from 'react'
import { RedirectableProviderType } from 'next-auth/providers'
import Link from 'next/link'

enum Status {
  Loading,
  Error,
  Success,
}

const Home = () => {
  const { data } = useSession()
  const [status, setStatus] = useState<Status | null>(null)
  const [email, setEmail] = useState('')

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus(Status.Loading)
    const response = await signIn<RedirectableProviderType>('email', {
      redirect: false,
      email,
    })

    if (!response) return
    if (response.error) {
      setStatus(Status.Error)
    } else {
      setStatus(Status.Success)
    }
  }

  if (!data) {
    if (status == null || status === Status.Error) {
      return (
        <div className={styles.container}>
          {status != null && <h1>There was an authorization error.</h1>}
          <form onSubmit={handleSubmit}>
            <label>
              Email:
              <input
                className="border-2"
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>
            <button type="submit">Sign in</button>
          </form>
        </div>
      )
    }

    if (status === Status.Success)
      return (
        <div className={styles.container}>
          <h1>Check your email inbox</h1>
        </div>
      )

    return (
      <div className={styles.container}>
        <h1>Loading...</h1>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Collapp Admin</title>
        <meta name="description" content="Collapp admin basic setup" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <button onClick={() => signOut()}>Sign out</button>
        <Link href="panel/developers">
          <button>Developers</button>
        </Link>
        <Link href="panel/plugins">
          <button>Plugins</button>
        </Link>
      </main>
    </div>
  )
}

export default Home
