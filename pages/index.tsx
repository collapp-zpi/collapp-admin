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
  const [isLoading, setLoading] = useState(false);
  const [isSuccessful, setSuccessful] = useState(false);
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError(false);
    setLoading(true);
    const response: any = await signIn("email", {
      redirect: false,
      email: email,
    });

    if (response.error) {
      setError(true);
    } else {
      setSuccessful(true);
    }

    setLoading(false);
  };

  if (!(data || isSuccessful || isLoading))
    return (
      <div className={styles.container}>
        {isError && <h1>There was an error. Try again</h1>}
        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button type="submit">Sign in</button>
        </form>
      </div>
    );
  else if (isSuccessful) {
    return (
      <div className={styles.container}>
        <h1>Check your email inbox</h1>
      </div>
    );
  } else if (isLoading) {
    return (
      <div className={styles.container}>
        <h1>Loading...</h1>
      </div>
    );
  }

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
