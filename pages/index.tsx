import type {InferGetServerSidePropsType} from 'next'
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import {useSession} from "next-auth/react";
import { signIn } from "next-auth/react"

export async function getServerSideProps() {
  const res = await fetch(`${process.env.BASE_URL}/api/developers`)
  const developers = await res.json()

  return {
    props: { developers }
  }
}

const Home = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const s = useSession()
  console.log(s)
  console.log(props.developers)
  return (
    <div className={styles.container}>
      <Head>
        <title>Collapp Admin</title>
        <meta name="description" content="Collapp admin basic setup" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <button onClick={() => signIn()}>Sign in</button>
        <div>
          {props.developers.length}
        </div>
      </main>
    </div>
  )
}

export default Home
