import type { ReactNode } from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import styles from './projects-index.module.css';

const PROJECTS = [
  {
    date: '2026',
    title: 'Robotics Telemetry Dashboard',
    description: 'Real-time simulated 6-DOF robot arm with 3D visualization, live streaming charts, and fault injection.',
    href: '/projects/robotics-telemetry',
    tag: 'data viz',
  },
  {
    date: '2026',
    title: 'Hantavirus Tracker',
    description: 'Live CDC data visualization tracking Hantavirus Pulmonary Syndrome cases across the United States.',
    href: '/projects/hantavirus-tracker',
    tag: 'data viz',
  },
];

export default function ProjectsIndex(): ReactNode {
  return (
    <Layout
      title="Projects"
      description="Side projects and data visualizations by Jackie Xu."
    >
      <div className={styles.page}>
        <div className={styles.main}>
          <header className={styles.header}>
            <h1>Projects</h1>
            <p className={styles.subtitle}>
              Side projects, data visualizations, and experiments.
            </p>
          </header>

          <div className={styles.list}>
            {PROJECTS.map((p) => (
              <Link key={p.href} to={p.href} className={styles.card}>
                <div className={styles.cardMeta}>
                  <span className={styles.cardDate}>{p.date}</span>
                  <span className={styles.cardTag}>{p.tag}</span>
                </div>
                <h2 className={styles.cardTitle}>{p.title}</h2>
                <p className={styles.cardDesc}>{p.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
