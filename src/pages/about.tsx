import { Fragment, type ReactNode } from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import styles from './index.module.css';

type Job = {
  when: string;
  where: string;
  role: string;
  bullets?: readonly string[];
  summary?: string;
  tech: readonly string[];
};

const EXPERIENCE: readonly Job[] = [
  {
    when: 'May 2025 → now',
    where: 'Amazon · Creative AI Studio',
    role: 'Software Engineer, Frontend',
    bullets: [
      'Architected a responsive AI chat interface for generative-AI creative workflows.',
      'Built frontend modules with an observer-subscriber pattern, enabling independent deploys and decoupled feature work across teams.',
      'Maintained accessible (a11y-compliant) patterns across all user-facing components.',
    ],
    tech: ['React', 'TypeScript', 'Webpack', 'Micro Frontends'],
  },
  {
    when: 'Jun 2024 → May 2025',
    where: 'Intuit · QuickBooks',
    role: 'Software Engineer, Frontend',
    bullets: [
      'Worked on micro-frontend applications visited by 5M+ customers weekly.',
      'Maintained component libraries and frameworks used by 17 teams and 80+ developers; reviewed contributions and kept the codebase clean.',
      'Member of a performance tiger team — built automated metric collection and synthetic testing tools.',
    ],
    tech: ['React', 'TypeScript', 'Yarn', 'Webpack', 'Lerna'],
  },
  {
    when: 'Aug 2021 → Jan 2024',
    where: 'Policygenius',
    role: 'Full-Stack Software Engineer',
    bullets: [
      'Designed and maintained multiple frontend and backend applications.',
      'Enhanced test coverage across services and CI/CD pipelines.',
      'Scaled an application from zero to a million monthly users.',
    ],
    tech: ['React', 'TypeScript', 'Ruby', 'Go', 'GCP'],
  },
  {
    when: '2019 → 2021',
    where: 'Good Deeds Data',
    role: 'Full-Stack Software Engineer',
    summary:
      'Early-career full-stack work across a .NET / Angular stack with conversational AI components on Azure.',
    tech: ['.NET Core', 'C#', 'LUIS AI', 'Docker', 'Angular', 'Azure'],
  },
];

const SKILLS: Array<{ label: string; items: readonly string[] }> = [
  { label: 'Languages', items: ['TypeScript', 'JavaScript', 'Node.js', 'Go', 'Ruby', 'Python', 'C#'] },
  { label: 'Frameworks', items: ['React', 'Express', 'Ruby on Rails', 'Flask', 'Django'] },
  { label: 'Infra & tools', items: ['Docker', 'Kubernetes', 'Elasticsearch', 'AWS', 'GCP', 'DataDog'] },
  { label: 'Currently into', items: ['AI UX patterns', 'Design systems', 'Edge performance', 'Type-safe APIs'] },
];

export default function About(): ReactNode {
  return (
    <Layout
      title="About — Jackie Xu"
      description="A bit more about Jackie Xu — software engineer in New York."
    >
      <div className={styles.page}>
        <div className={styles.main}>
          <section className={`${styles.hero} ${styles.heroAbout}`}>
            <div className={styles.heroAvatar}>
              <img src="https://github.com/nyjackie.png" alt="" />
            </div>
            <div>
              <h1 className={styles.heroTitle}>Hi, I'm Jackie</h1>
              <p className={styles.heroSub}>
                I build things on the web from a small apartment in New York. Most of my days are spent
                making big, complicated software feel a little quieter to use — and most of my evenings
                are spent reading, cooking, or rewriting this site instead of finishing it.
              </p>
            </div>
          </section>

          <dl className={styles.facts}>
            <dt>Based in</dt>
            <dd>New York, NY</dd>
            <dt>GitHub</dt>
            <dd>
              <a href="https://github.com/nyjackie" target="_blank" rel="noreferrer">
                nyjackie
              </a>
            </dd>
            <dt>LinkedIn</dt>
            <dd>
              <a href="https://www.linkedin.com/in/jackieexu/" target="_blank" rel="noreferrer">
                linkedin.com/in/jackieexu
              </a>
            </dd>
            <dt>Medium</dt>
            <dd>
              <a href="https://medium.com/@jackiexu1228" target="_blank" rel="noreferrer">
                medium.com/@jackiexu1228
              </a>
            </dd>
          </dl>

          <section className={`${styles.section} ${styles.sectionTight}`}>
            <div className={styles.bio}>
              <p>
                Right now I'm at <strong>Amazon</strong>, on the Creative AI Studio team, building the
                chat interface for our generative AI tools. Before that I was at <strong>Intuit</strong>{' '}
                working on QuickBooks micro-frontends, and before that <strong>Policygenius</strong>,
                where I got to watch one app go from zero users to a million and learn what breaks at
                each step along the way.
              </p>
              <p>
                The work I get most excited about sits between <strong>complicated systems</strong> and{' '}
                <strong>calm, understandable interfaces</strong>. AI tooling is great for that right now
                — the model underneath is weird and powerful, and the UI's whole job is to make it feel
                like something you can actually drive. I also care a lot about performance, accessibility,
                and design systems that respect the people who have to use them every day.
              </p>
              <p>
                Outside of work I'm slowly working through a stack of essay collections, learning to cook
                properly (current obsession: brown butter), and trying to write more even when it isn't
                very good. A lot of that lives over on <Link to="/articles">articles</Link> — some
                engineering notes, some just notes from a quiet weekend in New York.
              </p>
              <p>
                If any of that resonates, or you just want to say hi, I'm easiest to reach on{' '}
                <a href="https://www.linkedin.com/in/jackieexu/" target="_blank" rel="noreferrer">
                  LinkedIn
                </a>
                .
              </p>
            </div>
          </section>

          <section className={styles.section}>
            <div className={styles.sectionHead}>
              <h2>Experience</h2>
            </div>
            <div className={styles.timeline}>
              {EXPERIENCE.map((job) => (
                <div key={job.where} className={styles.job}>
                  <div className={styles.jobWhen}>{job.when}</div>
                  <div>
                    <div className={styles.jobWhere}>{job.where}</div>
                    <div className={styles.jobRole}>{job.role}</div>
                    <div className={styles.jobNotes}>
                      {job.bullets && (
                        <ul>
                          {job.bullets.map((b) => (
                            <li key={b}>{b}</li>
                          ))}
                        </ul>
                      )}
                      {job.summary && <p>{job.summary}</p>}
                      <div className={styles.techRow}>
                        {job.tech.map((t) => (
                          <span key={t} className={styles.techChip}>
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className={styles.section}>
            <div className={styles.sectionHead}>
              <h2>Skills</h2>
            </div>
            <dl className={styles.skillsGrid}>
              {SKILLS.map(({ label, items }) => (
                <Fragment key={label}>
                  <dt>{label}</dt>
                  <dd>
                    {items.map((t) => (
                      <span key={t} className={styles.techChip}>
                        {t}
                      </span>
                    ))}
                  </dd>
                </Fragment>
              ))}
            </dl>
          </section>

          <section className={styles.section}>
            <div className={styles.sectionHead}>
              <h2>Education</h2>
            </div>
            <div className={styles.timeline}>
              <div className={`${styles.job} ${styles.jobNoBorder}`}>
                <div className={styles.jobWhen}>2019</div>
                <div>
                  <div className={styles.jobWhere}>CUNY Baruch College</div>
                  <div className={styles.jobRole}>BA, Computer Information Systems</div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
}
