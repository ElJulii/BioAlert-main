import Styles from "./Footer.module.css"
import Link from "next/link"

export default function Footer() {
  const currentYear = new Date().getFullYear()
  return (
    <footer>
      <div className={Styles.footer__body}>
        <h2>BioAlert</h2>
        <p>A platform for animal abuse reporting and monitoring</p>
        <hr />
        <ol>
          <li><Link href="/">Home</Link></li>
          <li><a href="/about">About</a></li>
        </ol>
        <hr />
        <p>Mail: <Link href="mailto:bioalert@gmail.com">bioalert@gmail.com</Link></p>
        <p>&copy; {currentYear} BioAlert. All rights reserved.</p>
      </div>
      <div className={Styles.footer__logo}>
        <img src="/logo.png" alt="BioAlert logo" />
      </div>
    </footer>
  )
}