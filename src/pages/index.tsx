import Head from "next/Head";

import styles from "../styles/home.module.scss";

export default function Home() {
  return (
    <>
      <Head>
        <title>Incío | ig.news</title>
      </Head>
      <h1 className={styles.title}>Hello World</h1>
    </>
  );
}
