import type {InferGetServerSidePropsType} from 'next'
import Head from 'next/head'
import styles from '../styles/Home.module.css'

export async function getServerSideProps() {
  const res = await fetch(`${process.env.BASE_URL}/api/developers`)
  const developers = await res.json()

  return {
    props: { developers }
  }
}

const Home = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  console.log(props.developers)
  return (
    <div className={styles.container}>
      <Head>
        <title>Collapp Admin</title>
        <meta name="description" content="Collapp admin basic setup" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        {props.developers.length}
      </main>
    </div>
  )
}

export default Home
