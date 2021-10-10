import type { InferGetServerSidePropsType } from "next";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import { signOut, useSession } from "next-auth/react";
import { signIn } from "next-auth/react";
import { useState } from "react";

export async function getServerSideProps() {
  const res = await fetch(`${process.env.BASE_URL}/api/developers`);
  const developers = await res.json();

  return {
    props: { developers },
  };
}

const Home = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  const { data } = useSession();
  const [isError, setError] = useState(false);
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const response = await signIn("email", {
      redirect: false,
      email: e.target.email.value,
    });
    console.log(response);
  };

  if (!data)
    return (
      <div className={styles.container}>
        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Email</label>
          <input type="text" id="email" name="email" />
          <button type="submit">Sign in</button>
        </form>
      </div>
    );

  return (
    <div className={styles.container}>
      <Head>
        <title>Collapp Admin</title>
        <meta name="description" content="Collapp admin basic setup" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {console.log(props.developers)}
      <main className={styles.main}>
        <button onClick={() => signOut()}>Sign out</button>
        <div>{props.developers.length}</div>
      </main>
    </div>
  );
};

export default Home;
