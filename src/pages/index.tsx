import type { ReactNode } from 'react';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

const skills = ['TypeScript', 'React', 'Node.js', 'AWS', 'Docker', 'Kubernetes'];
const experiences = [
  { company: 'Amazon', role: 'Frontend Software Engineer', period: '2025-2026' },
  { company: 'Intuit', role: 'Frontend Software Engineer', period: '2024-2025' },
  { company: 'Policygenius', role: 'Full Stack Software Engineer', period: '2021-2024' },
  { company: 'Good Deeds Data', role: 'Full Stack Software Engineer', period: '2019-2021' }
];

function Hero() {
  return (
    <section style={{
      background: 'var(--ifm-color-primary)',
      color: 'var(--ifm-background-surface-color)',
      padding: '4rem 0',
      textAlign: 'center'
    }}>
      <div className="container">
        <Heading as="h1" style={{ fontSize: '3rem', marginBottom: '1rem' }}>
          Jackie Xu
        </Heading>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', opacity: 0.9 }}>
          Frontend Software Engineer
        </h2>
        <p style={{ fontSize: '1.2rem', opacity: 0.8 }}>
          7 years building scalable web applications
        </p>
      </div>
    </section>
  );
}

function About() {
  return (
    <section style={{ padding: '4rem 0' }}>
      <div className="container">
        <Heading as="h2" style={{ textAlign: 'center', marginBottom: '2rem' }}>
          About
        </Heading>
        <p style={{ textAlign: 'center', fontSize: '1.1rem', marginBottom: '2rem', maxWidth: '600px', margin: '0 auto 2rem' }}>
          Frontend Software Engineer with 6+ years of experience building scalable web applications at top-tier companies.
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center' }}>
          {skills.map(skill => (
            <span key={skill} style={{
              background: 'var(--ifm-color-primary)',
              color: 'var(--ifm-background-surface-color)',
              padding: '0.5rem 1rem',
              borderRadius: '1rem',
              fontSize: '0.9rem'
            }}>
              {skill}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function Projects() {
  return (
    <section style={{ padding: '4rem 0', background: 'var(--ifm-background-surface-color)' }}>
      <div className="container">
        <Heading as="h2" style={{ textAlign: 'center', marginBottom: '2rem' }}>
          Experience
        </Heading>
        <div style={{ display: 'grid', gap: '1.5rem', maxWidth: '800px', margin: '0 auto' }}>
          {experiences.map(exp => (
            <div key={exp.company} style={{
              padding: '1.5rem',
              border: '1px solid var(--ifm-color-emphasis-300)',
              borderRadius: '0.5rem',
              background: 'var(--ifm-card-background-color)'
            }}>
              <h3 style={{ margin: '0 0 0.5rem 0' }}>{exp.company}</h3>
              <p style={{ margin: '0 0 0.5rem 0', color: 'var(--ifm-color-primary)' }}>{exp.role}</p>
              <p style={{ margin: 0, opacity: 0.7 }}>{exp.period}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section style={{ padding: '4rem 0' }}>
      <div className="container">
        <Heading as="h2" style={{ textAlign: 'center', marginBottom: '2rem' }}>
          Contact
        </Heading>
        <div style={{ textAlign: 'center', maxWidth: '400px', margin: '0 auto' }}>
          <p style={{ marginBottom: '1rem' }}>
            <strong>Email:</strong> <a href="mailto:jackiexu1228@gmail.com">jackiexu1228@gmail.com</a>
          </p>
          <p style={{ marginBottom: '1rem' }}>
            <strong>Phone:</strong> <a href="tel:+19176787693">(917) 678-7693</a>
          </p>
          <p>
            <strong>Location:</strong> New York, NY
          </p>
        </div>
      </div>
    </section>
  );
}

export default function Home(): ReactNode {
  return (
    <Layout
      title="Jackie Xu - Frontend Software Engineer"
      description="Frontend Software Engineer with 6+ years of experience">
      <Hero />
      <main>
        <About />
        <Projects />
        <Contact />
      </main>
    </Layout>
  );
}
