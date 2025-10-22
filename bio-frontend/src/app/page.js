import Image from "next/image";
import styles from "./page.module.css";
import Link from "next/link";
import "../components/header/Header.js";
import Header from "../components/header/Header.js";


export default function Home() {
  return (
    <div className={styles.page}>
      <Header />
      <main className={styles.main}>
        <h1>Welcome to Next.js!</h1>
        <p>
          Get started by editing <code>app/page.js</code>
        </p>
        <ol>
          <li>
            <Link href="/about">About</Link>
          </li>
          <li>
            <Link href="/profile">Profile</Link>
          </li>
        </ol>
      </main>
    </div>
  );
}
