import type { ReactNode } from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import { ARTICLES, type ArticleCategory } from '@site/src/data/articles';
import styles from './index.module.css';

const RECENT = ARTICLES.slice(0, 3);

const CURRENTLY: Array<{
  date: string;
  title: ReactNode;
  category: ArticleCategory;
  label: string;
}> = [
  {
    date: 'May 2025 →',
    title: (
      <>
        Building generative AI workflows at <strong>Amazon</strong>, Creative AI Studio
      </>
    ),
    category: 'devlog',
    label: 'work',
  },
  {
    date: '2026',
    title: 'Writing more — at least one piece a month, no matter how short',
    category: 'lifelog',
    label: 'goal',
  },
  {
    date: 'Always',
    title: 'Open to interesting frontend & AI tooling roles',
    category: 'notes',
    label: 'side',
  },
];

export default function Home(): ReactNode {
  return (
    <Layout
      title="Jackie Xu — software engineer"
      description="Software engineer in New York. I build things on the web for a living."
    >
      <div className={styles.page}>
        <div className={styles.main}>
          <section className={styles.hero}>
            <div className={styles.heroAvatar}>
              <img src="https://github.com/nyjackie.png" alt="Jackie Xu" />
            </div>
            <div>
              <h1 className={styles.heroTitle}>Jackie Xu</h1>
              <p className={styles.heroSub}>
                Software engineer in New York. I build things on the web for a living, write about them
                sometimes, and spend the rest of my time reading, cooking, and walking the long way home.
              </p>
              <div className={styles.metaRow}>
                <span>
                  <span className={styles.metaDot} />
                  Available for new projects
                </span>
                <span>📍 New York, NY</span>
                <span>
                  <a href="https://github.com/nyjackie" target="_blank" rel="noreferrer">
                    github.com/nyjackie
                  </a>
                </span>
              </div>
            </div>
          </section>

          <section className={styles.section}>
            <div className={styles.sectionHead}>
              <h2>Recent writing</h2>
              <Link to="/articles" className={styles.allLink}>
                all articles →
              </Link>
            </div>
            <div className={styles.rowList}>
              {RECENT.map((a) => (
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

          <section className={styles.section}>
            <div className={styles.sectionHead}>
              <h2>Projects</h2>
            </div>
            <div className={styles.rowList}>
              <Link to="/projects/hantavirus-tracker" className={styles.row}>
                <span className={styles.rowDate}>2026</span>
                <span className={styles.rowTitle}>Hantavirus Tracker</span>
                <span className={styles.rowTag} data-cat="devlog">
                  data viz
                </span>
              </Link>
            </div>
          </section>

          <section className={styles.section}>
            <div className={styles.sectionHead}>
              <h2>Currently</h2>
            </div>
            <div className={styles.rowList}>
              {CURRENTLY.map((c, i) => (
                <div key={i} className={styles.row}>
                  <span className={styles.rowDate}>{c.date}</span>
                  <span className={styles.rowTitle}>{c.title}</span>
                  <span className={styles.rowTag} data-cat={c.category}>
                    {c.label}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
}
