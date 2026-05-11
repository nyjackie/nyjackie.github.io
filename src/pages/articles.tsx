import type { ReactNode } from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import { ARTICLES } from '@site/src/data/articles';
import styles from './index.module.css';

export default function Articles(): ReactNode {
  return (
    <Layout
      title="Articles — Jackie Xu"
      description="Writing on engineering, AI tooling, and life."
    >
      <div className={styles.page}>
        <div className={styles.main}>
          <section className={styles.hero}>
            <div>
              <h1 className={styles.heroTitle}>Articles</h1>
              <p className={styles.heroSub}>
                Notes from the dev log and life log — engineering write-ups, half-formed thoughts, and the
                occasional essay. Everything in one place, newest first.
              </p>
            </div>
          </section>

          <section className={styles.section}>
            <div className={styles.rowList}>
              {ARTICLES.map((a) => (
                <Link key={a.href} to={a.href} className={styles.row}>
                  <span className={styles.rowDate}>{a.date}</span>
                  <span className={styles.rowTitle}>{a.title}</span>
                  <span className={styles.rowTag} data-cat={a.category}>
                    {a.category}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
}
