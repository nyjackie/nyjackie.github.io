import { useState, useEffect, useCallback, useMemo, lazy, Suspense, type ReactNode } from 'react';
import Layout from '@theme/Layout';

const RobotArm3D = lazy(() => import('@site/src/components/RobotArm3D'));
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineController,
  ScatterController,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line, Scatter } from 'react-chartjs-2';
import styles from './robotics-telemetry.module.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineController,
  ScatterController,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

const JOINT_NAMES = ['Base', 'Shoulder', 'Elbow', 'Wrist1', 'Wrist2', 'Wrist3'];
const JOINT_COLORS = ['#d96a1a', '#207d7d', '#8a4ac9', '#1e7da0', '#2d8659', '#b8860b'];
const BUFFER_SIZE = 180;
const PATH_BUFFER = 200;
const FRAME_MS = 16;
const TEMP_THRESHOLD = 70;
const LABELS = Array.from({ length: BUFFER_SIZE }, () => '');

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

function formatUptime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

type SimState = {
  jointAngles: number[][];
  motorTemps: number[][];
  pathX: number[];
  pathY: number[];
  tick: number;
  cycles: number;
  alerts: number;
};

function createInitial(): SimState {
  return {
    jointAngles: JOINT_NAMES.map(() => []),
    motorTemps: JOINT_NAMES.map(() => [45]),
    pathX: [],
    pathY: [],
    tick: 0,
    cycles: 0,
    alerts: 0,
  };
}

function step(s: SimState): SimState {
  const t = s.tick + 1;

  const jointAngles = s.jointAngles.map((buf, i) => {
    const freq = 0.3 + i * 0.15;
    const amp = 60 + i * 10;
    const angle = amp * Math.sin(t * freq * 0.016) + (Math.random() - 0.5) * 1.5;
    const next = buf.length >= BUFFER_SIZE ? [...buf.slice(1), angle] : [...buf, angle];
    return next;
  });

  const motorTemps = s.motorTemps.map((buf) => {
    const last = buf[buf.length - 1];
    const drift = (Math.random() - 0.5) * 0.3;
    const pull = (45 - last) * 0.005;
    const temp = clamp(last + drift + pull, 30, 90);
    const next = buf.length >= BUFFER_SIZE ? [...buf.slice(1), temp] : [...buf, temp];
    return next;
  });

  const ex = 120 * Math.sin(t * 0.008) + 40 * Math.cos(t * 0.021);
  const ey = 80 * Math.cos(t * 0.011) + 30 * Math.sin(t * 0.018);
  let pathX = [...s.pathX, ex];
  let pathY = [...s.pathY, ey];
  if (pathX.length > PATH_BUFFER) { pathX = pathX.slice(1); pathY = pathY.slice(1); }

  return {
    jointAngles,
    motorTemps,
    pathX,
    pathY,
    tick: t,
    cycles: s.cycles + (t % 60 === 0 ? 1 : 0),
    alerts: s.alerts,
  };
}

export default function RoboticsTelemetry(): ReactNode {
  const [sim, setSim] = useState<SimState>(createInitial);
  const [running, setRunning] = useState(true);
  const [speed, setSpeed] = useState(1);

  const injectFault = useCallback(() => {
    setSim((prev) => {
      const idx = Math.floor(Math.random() * 6);
      const motorTemps = prev.motorTemps.map((buf, i) => {
        if (i !== idx) return buf;
        const copy = [...buf];
        copy[copy.length - 1] = 75 + Math.random() * 10;
        return copy;
      });
      return { ...prev, motorTemps, alerts: prev.alerts + 1 };
    });
  }, []);

  useEffect(() => {
    if (!running) return;
    let rafId: number;
    const loop = () => {
      setSim((prev) => {
        let s = prev;
        for (let i = 0; i < speed; i++) {
          s = step(s);
        }
        return s;
      });
      rafId = requestAnimationFrame(loop);
    };
    rafId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId);
  }, [running, speed]);

  const jointData = useMemo(() => ({
    labels: LABELS,
    datasets: JOINT_NAMES.map((name, i) => ({
      label: name,
      data: sim.jointAngles[i],
      borderColor: JOINT_COLORS[i],
      borderWidth: 1.5,
      pointRadius: 0,
      tension: 0.3,
    })),
  }), [sim.jointAngles]);

  const tempData = useMemo(() => ({
    labels: LABELS,
    datasets: [
      ...JOINT_NAMES.map((name, i) => ({
        label: name,
        data: sim.motorTemps[i],
        borderColor: JOINT_COLORS[i],
        borderWidth: 1.5,
        pointRadius: 0,
        tension: 0.3,
      })),
      {
        label: 'Threshold',
        data: Array(BUFFER_SIZE).fill(TEMP_THRESHOLD),
        borderColor: '#c44040',
        borderWidth: 1.5,
        borderDash: [6, 4],
        pointRadius: 0,
      },
    ],
  }), [sim.motorTemps]);

  const pathData = useMemo(() => ({
    datasets: [{
      label: 'End Effector',
      data: sim.pathX.map((x, i) => ({ x, y: sim.pathY[i] })),
      backgroundColor: sim.pathX.map((_, i) => {
        const alpha = (i / sim.pathX.length) * 0.8 + 0.2;
        return `rgba(32, 125, 125, ${alpha})`;
      }),
      pointRadius: 2.5,
      showLine: false,
    }],
  }), [sim.pathX, sim.pathY]);

  const jointOpts = useMemo(() => ({
    responsive: true,
    animation: false as const,
    scales: {
      x: { display: false },
      y: { min: -120, max: 140, grid: { color: 'rgba(61,47,36,0.06)' } },
    },
    plugins: {
      legend: { display: true, position: 'bottom' as const, labels: { boxWidth: 10, font: { size: 11 } } },
    },
  }), []);

  const tempOpts = useMemo(() => ({
    responsive: true,
    animation: false as const,
    scales: {
      x: { display: false },
      y: { min: 30, max: 90, grid: { color: 'rgba(61,47,36,0.06)' } },
    },
    plugins: {
      legend: { display: true, position: 'bottom' as const, labels: { boxWidth: 10, font: { size: 11 } } },
    },
  }), []);

  const pathOpts = useMemo(() => ({
    responsive: true,
    animation: false as const,
    scales: {
      x: { min: -200, max: 200, grid: { color: 'rgba(61,47,36,0.06)' }, title: { display: true, text: 'X (mm)' } },
      y: { min: -150, max: 150, grid: { color: 'rgba(61,47,36,0.06)' }, title: { display: true, text: 'Y (mm)' } },
    },
    plugins: { legend: { display: false } },
  }), []);


  const hasAlert = sim.motorTemps.some((buf) => buf[buf.length - 1] > TEMP_THRESHOLD);

  return (
    <Layout
      title="Robotics Telemetry Dashboard"
      description="Real-time simulated robot arm telemetry with live charts and fault injection."
    >
      <div className={styles.page}>
        <div className={styles.main}>
          <header className={styles.header}>
            <h1>Robotics Telemetry Dashboard</h1>
            <p className={styles.subtitle}>
              Simulated 6-DOF robot arm streaming joint angles, motor temperatures,
              and end-effector position in real time. All data generated client-side.
            </p>
          </header>

          <div className={styles.controls}>
            <button
              className={`${styles.btn} ${running ? styles.btnActive : ''}`}
              onClick={() => setRunning(!running)}
            >
              {running ? 'Pause' : 'Resume'}
            </button>
            <button className={`${styles.btn} ${styles.btnDanger}`} onClick={injectFault}>
              Inject Fault
            </button>
            <div className={styles.speedGroup}>
              <span className={styles.speedLabel}>Speed:</span>
              {[1, 2, 5].map((s) => (
                <button
                  key={s}
                  className={`${styles.speedBtn} ${speed === s ? styles.speedBtnActive : ''}`}
                  onClick={() => setSpeed(s)}
                >
                  {s}x
                </button>
              ))}
            </div>
          </div>

          <div className={styles.statRow}>
            <div className={styles.stat}>
              <p className={styles.statValue}>{formatUptime(Math.floor(sim.tick / 60))}</p>
              <p className={styles.statLabel}>Uptime</p>
            </div>
            <div className={styles.stat}>
              <p className={styles.statValue}>{sim.cycles}</p>
              <p className={styles.statLabel}>Cycles</p>
            </div>
            <div className={styles.stat}>
              <p className={`${styles.statValue} ${sim.alerts > 0 ? styles.statAlert : styles.statOk}`}>
                {sim.alerts}
              </p>
              <p className={styles.statLabel}>Alerts</p>
            </div>
            <div className={styles.stat}>
              <p className={`${styles.statValue} ${hasAlert ? styles.statAlert : styles.statOk}`}>
                {hasAlert ? 'WARN' : 'OK'}
              </p>
              <p className={styles.statLabel}>Status</p>
            </div>
          </div>

          <div className={`${styles.chartCard} ${styles.viewportCard}`}>
            <h3>3D Robot Arm</h3>
            <div className={styles.viewport}>
              <Suspense fallback={<div className={styles.viewportLoading}>Loading 3D view...</div>}>
                <RobotArm3D angles={sim.jointAngles.map((buf) => buf[buf.length - 1] || 0)} />
              </Suspense>
            </div>
          </div>

          <div className={styles.chartGrid}>
            <div className={styles.chartCard}>
              <h3>Joint Angles (degrees)</h3>
              <Line data={jointData} options={jointOpts} />
            </div>
            <div className={styles.chartCard}>
              <h3>Motor Temperatures (°C)</h3>
              <Line data={tempData} options={tempOpts} />
            </div>
            <div className={`${styles.chartCard} ${styles.chartFull}`}>
              <h3>End-Effector Path (XY Plane)</h3>
              <Scatter data={pathData} options={pathOpts} />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
