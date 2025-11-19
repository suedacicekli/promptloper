'use client'

import Image from 'next/image'
import styles from './Navbar.module.css'

export default function Navbar() {
  return (
    <nav className={styles.nav}>
      <div className={styles.logoContainer}>
        <Image
          src="/asset/promptloper.png"
          alt="Promptloper"
          width={47}
          height={47}
          priority
          className={styles.logo}
        />
      </div>
    </nav>
  )
}
