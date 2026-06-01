import { useState, useEffect, type ReactNode } from 'react';
import Layout from '@theme/Layout';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import styles from './hantavirus-tracker.module.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

const COLORS = {
  peach: '#d96a1a',
  teal: '#207d7d',
  mauve: '#8a4ac9',
  sapphire: '#1e7da0',
  text: '#3d2f24',
  subtext: '#7a6452',
  surface: '#efe9dd',
};

type YearlyCase = { year: number; cases: number; partial?: boolean };
type StateCase = { state: string; cases: number };

const CDC_DATASET_ID = 'x9gk-5huc';
const DISEASE_LABEL = 'Hantavirus pulmonary syndrome';
const BASE_URL = `https://data.cdc.gov/resource/${CDC_DATASET_ID}.json`;

async function fetchAnnualTotals(): Promise<YearlyCase[]> {
  const caseMap = new Map<number, { cases: number; partial: boolean }>();
  const currentYear = new Date().getFullYear();

  const years = [2022, 2023, 2024, 2025, 2026];
  const requests = years.map(async (year) => {
    const statesFilter = year >= 2025
      ? "states='U.S. Residents'"
      : "states='TOTAL'";
    const url = `${BASE_URL}?$where=label='${encodeURIComponent(DISEASE_LABEL)}' AND year='${year}' AND ${statesFilter}&$order=week DESC&$limit=1`;
    try {
      const res = await fetch(url);
      if (!res.ok) return;
      const rows = await res.json();
      if (rows.length > 0) {
        const row = rows[0];
        const cases = parseInt(row.m3) || parseFloat(row.m3) || 0;
        if (cases > 0) {
          caseMap.set(year, { cases, partial: year === currentYear });
        }
        const prevCases = parseInt(row.m4) || parseFloat(row.m4) || 0;
        if (prevCases > 0 && !caseMap.has(year - 1)) {
          caseMap.set(year - 1, { cases: prevCases, partial: false });
        }
      }
    } catch { /* skip failed requests */ }
  });

  await Promise.all(requests);

  // Also pull historical data from the older NNDSS datasets
  try {
    const oldUrl = `https://data.cdc.gov/resource/wcwi-x3uk.json?$where=disease like '%25Hantavirus%25pulmonary%25'&$order=mmwr_week DESC&$limit=1`;
    const res = await fetch(oldUrl);
    if (res.ok) {
      const rows = await res.json();
      if (rows.length > 0) {
        const row = rows[0];
        const historicalFields: Record<string, number> = {
          'total_cases_reported_2009': 2009,
          'total_cases_reported_2010': 2010,
          'total_cases_reported_2011': 2011,
          'total_cases_reported_2012': 2012,
          'total_cases_reported_2013': 2013,
        };
        for (const [field, yr] of Object.entries(historicalFields)) {
          const val = parseInt(row[field]);
          if (!isNaN(val) && val > 0 && !caseMap.has(yr)) {
            caseMap.set(yr, { cases: val, partial: false });
          }
        }
        const cum2014 = parseInt(row.cum_2014);
        if (!isNaN(cum2014) && cum2014 > 0 && !caseMap.has(2014)) {
          caseMap.set(2014, { cases: cum2014, partial: false });
        }
      }
    }
  } catch { /* skip */ }

  try {
    const oldUrl2 = `https://data.cdc.gov/resource/pb4z-432k.json?$where=disease like '%25Hantavirus%25Pulmonary%25'&$order=mmwr_week DESC&$limit=1`;
    const res = await fetch(oldUrl2);
    if (res.ok) {
      const rows = await res.json();
      if (rows.length > 0) {
        const row = rows[0];
        const val2014 = parseInt(row.total_cases_reported_2014);
        if (!isNaN(val2014) && val2014 > 0 && !caseMap.has(2014)) {
          caseMap.set(2014, { cases: val2014, partial: false });
        }
        const cum2015 = parseInt(row.cum_2015);
        if (!isNaN(cum2015) && cum2015 > 0 && !caseMap.has(2015)) {
          caseMap.set(2015, { cases: cum2015, partial: false });
        }
      }
    }
  } catch { /* skip */ }

  return Array.from(caseMap.entries())
    .map(([year, { cases, partial }]) => ({ year, cases, partial }))
    .sort((a, b) => a.year - b.year);
}

async function fetchStateData(): Promise<{ states: StateCase[]; year: number }> {
  // Try 2025 first (most recent complete year), fall back to 2024
  for (const { year, week, statesExclude } of [
    {
      year: 2025,
      week: '53',
      statesExclude: "'U.S. Residents','Total','New England','Middle Atlantic','East North Central','West North Central','South Atlantic','East South Central','West South Central','Mountain','Pacific'",
    },
    {
      year: 2024,
      week: '52',
      statesExclude: "'TOTAL','US RESIDENTS','US TERRITORIES','NON-US RESIDENTS','EAST NORTH CENTRAL','EAST SOUTH CENTRAL','MIDDLE ATLANTIC','MOUNTAIN','NEW ENGLAND','PACIFIC','SOUTH ATLANTIC','WEST NORTH CENTRAL','WEST SOUTH CENTRAL'",
    },
  ]) {
    const stateFilter = `label='${encodeURIComponent(DISEASE_LABEL)}' AND year='${year}' AND week='${week}' AND m3 IS NOT NULL AND states NOT IN(${statesExclude})`;
    const url = `${BASE_URL}?$where=${stateFilter}&$select=states,m3&$order=m3 DESC&$limit=50`;
    try {
      const res = await fetch(url);
      if (!res.ok) continue;
      const rows = await res.json();
      const results = rows
        .filter((r: any) => parseFloat(r.m3) > 0)
        .map((r: any) => ({ state: r.states, cases: Math.round(parseFloat(r.m3)) }));
      if (results.length > 0) return { states: results, year };
    } catch {
      continue;
    }
  }
  return { states: [], year: 2024 };
}

async function fetchWeeklyData(year: number): Promise<{ week: number; cases: number }[]> {
  const statesFilter = year >= 2025 ? "states='U.S. Residents'" : "states='TOTAL'";
  const url = `${BASE_URL}?$where=label='${encodeURIComponent(DISEASE_LABEL)}' AND year='${year}' AND ${statesFilter}&$select=week,m3&$order=week ASC&$limit=53`;
  try {
    const res = await fetch(url);
    if (!res.ok) return [];
    const rows = await res.json();
    return rows.map((r: any) => ({
      week: parseInt(r.week),
      cases: parseInt(r.m3) || parseFloat(r.m3) || 0,
    }));
  } catch {
    return [];
  }
}

function StatsRow({ data, latestWeek }: { data: YearlyCase[]; latestWeek: string }) {
  const completedYears = data.filter((d) => !d.partial);
  const totalCases = completedYears.reduce((sum, d) => sum + d.cases, 0);
  const avgPerYear = completedYears.length > 0 ? Math.round(totalCases / completedYears.length) : 0;
  const peakYear = completedYears.reduce(
    (max, d) => (d.cases > max.cases ? d : max),
    completedYears[0] || { year: 0, cases: 0 },
  );

  return (
    <div className={styles.statRow}>
      <div className={styles.stat}>
        <p className={styles.statValue}>{totalCases}</p>
        <p className={styles.statLabel}>
          Total cases ({completedYears[0]?.year}–{completedYears[completedYears.length - 1]?.year})
        </p>
      </div>
      <div className={styles.stat}>
        <p className={styles.statValue}>{avgPerYear}</p>
        <p className={styles.statLabel}>Average per year</p>
      </div>
      <div className={styles.stat}>
        <p className={styles.statValue}>{peakYear.year}</p>
        <p className={styles.statLabel}>Peak year ({peakYear.cases} cases)</p>
      </div>
      <div className={styles.stat}>
        <p className={styles.statValue}>{latestWeek}</p>
        <p className={styles.statLabel}>Data through</p>
      </div>
    </div>
  );
}

function AnnualChart({ data }: { data: YearlyCase[] }) {
  return (
    <Bar
      data={{
        labels: data.map((d) => d.year.toString()),
        datasets: [
          {
            label: 'Reported HPS Cases',
            data: data.map((d) => d.cases),
            backgroundColor: data.map((d) =>
              d.partial ? `${COLORS.peach}55` : `${COLORS.peach}cc`,
            ),
            borderColor: data.map((d) =>
              d.partial ? `${COLORS.peach}88` : COLORS.peach,
            ),
            borderWidth: 1,
            borderRadius: 3,
            borderDash: undefined,
          },
        ],
      }}
      options={{
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: COLORS.text,
            titleFont: { family: 'Geist, sans-serif' },
            bodyFont: { family: 'JetBrains Mono, monospace', size: 12 },
            callbacks: {
              afterLabel: (ctx) => {
                const d = data[ctx.dataIndex];
                return d.partial ? '(year in progress)' : '';
              },
            },
          },
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { font: { family: 'JetBrains Mono', size: 10 }, color: COLORS.subtext },
          },
          y: {
            grid: { color: 'rgba(61,47,36,0.06)' },
            ticks: { font: { family: 'JetBrains Mono', size: 11 }, color: COLORS.subtext },
            beginAtZero: true,
          },
        },
      }}
    />
  );
}

function WeeklyChart({ weeklyData, year }: { weeklyData: { week: number; cases: number }[]; year: number }) {
  return (
    <Line
      data={{
        labels: weeklyData.map((d) => `W${d.week}`),
        datasets: [
          {
            label: `Cumulative Cases (${year})`,
            data: weeklyData.map((d) => d.cases),
            borderColor: COLORS.teal,
            backgroundColor: `${COLORS.teal}18`,
            fill: true,
            tension: 0.3,
            pointRadius: 1.5,
            pointHoverRadius: 5,
            pointBackgroundColor: COLORS.teal,
          },
        ],
      }}
      options={{
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: COLORS.text,
            bodyFont: { family: 'JetBrains Mono, monospace', size: 12 },
            callbacks: {
              title: (items) => `Week ${weeklyData[items[0].dataIndex]?.week}, ${year}`,
              label: (ctx) => ` Cumulative: ${ctx.parsed.y} cases`,
            },
          },
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: {
              font: { family: 'JetBrains Mono', size: 9 },
              color: COLORS.subtext,
              maxTicksLimit: 12,
            },
          },
          y: {
            grid: { color: 'rgba(61,47,36,0.06)' },
            ticks: { font: { family: 'JetBrains Mono', size: 11 }, color: COLORS.subtext },
            beginAtZero: true,
          },
        },
      }}
    />
  );
}

function StateChart({ states }: { states: StateCase[] }) {
  if (states.length === 0) return null;
  return (
    <Doughnut
      data={{
        labels: states.map((s) => titleCase(s.state)),
        datasets: [
          {
            data: states.map((s) => s.cases),
            backgroundColor: [
              COLORS.peach,
              COLORS.teal,
              COLORS.mauve,
              COLORS.sapphire,
              '#a67c52',
              '#c4b8a0',
              '#6b8e8e',
              '#b07acc',
            ].slice(0, states.length),
            borderColor: COLORS.surface,
            borderWidth: 2,
          },
        ],
      }}
      options={{
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              font: { family: 'JetBrains Mono', size: 11 },
              color: COLORS.subtext,
              padding: 10,
            },
          },
          tooltip: {
            backgroundColor: COLORS.text,
            bodyFont: { family: 'JetBrains Mono, monospace', size: 12 },
            callbacks: {
              label: (ctx) => ` ${ctx.label}: ${ctx.parsed} cases`,
            },
          },
        },
      }}
    />
  );
}

function titleCase(str: string): string {
  return str
    .toLowerCase()
    .split(' ')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

export default function HantavirusTracker(): ReactNode {
  const [annualData, setAnnualData] = useState<YearlyCase[] | null>(null);
  const [stateData, setStateData] = useState<{ states: StateCase[]; year: number }>({ states: [], year: 2025 });
  const [weeklyData, setWeeklyData] = useState<{ week: number; cases: number }[]>([]);
  const [latestWeek, setLatestWeek] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([fetchAnnualTotals(), fetchStateData(), fetchWeeklyData(2025)])
      .then(([annual, stateResult, weekly]) => {
        if (annual.length === 0) {
          setError('No data returned from CDC API. The service may be temporarily unavailable.');
          return;
        }
        setAnnualData(annual);
        setStateData(stateResult);
        setWeeklyData(weekly);

        const currentYearData = annual.find((d) => d.partial);
        const latestComplete = annual.filter((d) => !d.partial).pop();
        if (currentYearData) {
          setLatestWeek(`${currentYearData.year} (in progress)`);
        } else if (latestComplete) {
          setLatestWeek(`Week 52, ${latestComplete.year}`);
        }
      })
      .catch(() => setError('Failed to fetch data from CDC. Please try again later.'));
  }, []);

  return (
    <Layout
      title="Hantavirus Tracker"
      description="Tracking Hantavirus Pulmonary Syndrome (HPS) cases in the United States using live CDC surveillance data."
    >
      <div className={styles.page}>
        <div className={styles.main}>
          <header className={styles.header}>
            <h1>Hantavirus Tracker</h1>
            <p className={styles.subtitle}>
              Tracking Hantavirus Pulmonary Syndrome (HPS) in the United States. HPS is a rare but
              severe respiratory disease caused by inhaling aerosolized rodent excreta. Since its
              identification in 1993, the CDC has tracked cases through the National Notifiable
              Diseases Surveillance System.
            </p>
            <p className={styles.source}>
              Live data from{' '}
              <a
                href="https://data.cdc.gov/dataset/x9gk-5huc"
                target="_blank"
                rel="noreferrer"
              >
                CDC NNDSS Weekly Surveillance Data
              </a>{' '}
              via SODA API — updated weekly
            </p>
          </header>

          {error && <div className={styles.error}>{error}</div>}

          {!annualData && !error && (
            <div className={styles.loading}>Fetching live CDC surveillance data...</div>
          )}

          {annualData && (
            <>
              <StatsRow data={annualData} latestWeek={latestWeek} />

              <section className={styles.section}>
                <div className={styles.sectionHead}>
                  <h2>Annual Reported Cases</h2>
                </div>
                <div className={styles.chartCard}>
                  <AnnualChart data={annualData} />
                  <p className={styles.chartNote}>
                    Faded bar indicates the current year (incomplete data).
                    Historical data (2009–2015) from archived NNDSS tables.
                  </p>
                </div>
              </section>

              <section className={styles.section}>
                <div className={styles.sectionHead}>
                  <h2>2025 Weekly Progression</h2>
                </div>
                <div className={styles.chartCard}>
                  <WeeklyChart weeklyData={weeklyData} year={2025} />
                  <p className={styles.chartNote}>
                    Cumulative case count by MMWR week. Shows seasonal pattern —
                    most cases occur in spring and summer.
                  </p>
                </div>
              </section>

              <section className={styles.section}>
                <div className={styles.sectionHead}>
                  <h2>Cases by State ({stateData.year})</h2>
                </div>
                <div className={styles.chartRow}>
                  <div className={styles.chartCard}>
                    <StateChart states={stateData.states} />
                  </div>
                  <div className={styles.chartCard}>
                    <h3
                      style={{
                        margin: '0 0 12px',
                        fontFamily: 'var(--home-font-sans)',
                        fontSize: '14px',
                        fontWeight: 600,
                        color: COLORS.subtext,
                      }}
                    >
                      Top Reporting States
                    </h3>
                    <div className={styles.stateTable}>
                      {stateData.states.map((s) => (
                        <div key={s.state} className={styles.stateRow}>
                          <span>{titleCase(s.state)}</span>
                          <span className={styles.stateCount}>{s.cases}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              <section className={styles.section}>
                <div className={styles.sectionHead}>
                  <h2>Key Facts</h2>
                </div>
                <div className={styles.facts}>
                  <div className={styles.factCard}>
                    <h3>Transmission</h3>
                    <p>
                      Spread by inhaling virus particles from <strong>deer mouse</strong> urine,
                      droppings, or saliva. Not transmitted person-to-person in North America.
                    </p>
                  </div>
                  <div className={styles.factCard}>
                    <h3>Symptoms</h3>
                    <p>
                      Early: fatigue, fever, muscle aches. Within 4–10 days progresses to
                      <strong> coughing and severe shortness of breath</strong> as lungs fill with
                      fluid.
                    </p>
                  </div>
                  <div className={styles.factCard}>
                    <h3>Fatality</h3>
                    <p>
                      HPS has a <strong>~36% case fatality rate</strong> — one of the highest of
                      any respiratory illness. Early medical intervention is critical.
                    </p>
                  </div>
                  <div className={styles.factCard}>
                    <h3>Prevention</h3>
                    <p>
                      Seal holes in homes, trap rodents, ventilate closed spaces before entering,
                      and <strong>wet-clean</strong> rodent-contaminated areas (never sweep or
                      vacuum).
                    </p>
                  </div>
                </div>
              </section>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}
