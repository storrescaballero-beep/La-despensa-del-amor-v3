'use client'

import Link from 'next/link'
import styles from './BottomNav.module.css'

export default function BottomNav({ active }: { active: 'lista' | 'menu' }) {
  return (
    <nav className={styles.nav}>
      <Link href="/lista" className={`${styles.btn} ${active === 'lista' ? styles.active : ''}`}>
        <span className={styles.icon}>🛒</span>
        <span className={styles.label}>Lista</span>
      </Link>
      <Link href="/menu" className={`${styles.btn} ${active === 'menu' ? styles.active : ''}`}>
        <span className={styles.icon}>🍽️</span>
        <span className={styles.label}>Menú</span>
      </Link>
    </nav>
  )
}
