'use client'

import BuyMeCoffeeButton from '@/components/BuyMeCoffeeButton'
import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
          <BuyMeCoffeeButton />

          <p className={styles.text}>
            © {new Date().getFullYear()} Promptloper · by{' '}
            <a
              href="https://sueda.me"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
            >
              çiçekli
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
