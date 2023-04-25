import Head from 'next/head';
import styles from '../styles/Home.module.css';
import Link from 'next/link';

export default function Home() {
  return (
    <div>
      <Link href="/main">Go to main</Link>
    </div>
  )
}
