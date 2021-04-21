import Head from "next/head";
import styles from "./styles.module.scss";

export default function Posts() {
  return (
    <>
      <Head>
        <title>Posts | Ignews</title>
      </Head>

      <main className={styles.container}>
        <div className={styles.posts}>
          <a href="#">
            <time>28 de maio de 2020</time>
            <strong>
              Derek Chauvin Verdict Brings a Rare Rebuke of Police Conduct
            </strong>
            <p>
              A jury deliberated for just over 10 hours before pronouncing Mr.
              Chauvin guilty on all three charges: second-degree murder,
              third-degree murder and second-degree manslaughter.
            </p>
          </a>

          <a href="#">
            <time>28 de maio de 2020</time>
            <strong>
              Derek Chauvin Verdict Brings a Rare Rebuke of Police Conduct
            </strong>
            <p>
              A jury deliberated for just over 10 hours before pronouncing Mr.
              Chauvin guilty on all three charges: second-degree murder,
              third-degree murder and second-degree manslaughter.
            </p>
          </a>

          <a href="#">
            <time>28 de maio de 2020</time>
            <strong>
              Derek Chauvin Verdict Brings a Rare Rebuke of Police Conduct
            </strong>
            <p>
              A jury deliberated for just over 10 hours before pronouncing Mr.
              Chauvin guilty on all three charges: second-degree murder,
              third-degree murder and second-degree manslaughter.
            </p>
          </a>
        </div>
      </main>
    </>
  );
}
