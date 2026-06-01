---
slug: robotics-telemetry-dashboard
title: Building a real-time robotics telemetry dashboard in the browser
authors: [jackie]
tags: [react, three.js, chart.js, data-visualization, robotics]
---

I built a simulated 6-DOF robot arm telemetry dashboard entirely in the browser — no backend, no WebSocket server, just React, Chart.js, and Three.js generating and visualizing data at 60fps.

<!--truncate-->

## What it does

The dashboard simulates a robot arm streaming telemetry data in real time:

- **3D visualization** of the arm using React Three Fiber, with each joint rotating based on live angle data
- **Joint angle chart** showing 6 channels of sinusoidal motion with noise
- **Motor temperature chart** with a threshold warning line
- **End-effector path trace** plotting where the "hand" of the arm moves in XY space
- **Fault injection** button that spikes a random motor's temperature above the threshold
- **Speed controls** (1x, 2x, 5x) to accelerate the simulation

## What I learned

**Chart.js at 60fps is tricky.** The biggest issue was choppiness from two sources: auto-scaling Y-axes that jump every frame, and Chart.js trying to animate between data states. The fix was simple — lock the axis ranges with `min`/`max` and set `animation: false`.

**requestAnimationFrame over setInterval.** At 10fps (100ms interval), the data updates felt choppy and disconnected from the 3D arm which renders at native refresh rate. Switching to `requestAnimationFrame` with a 16ms throttle syncs everything to the display's refresh cycle.

**React Three Fiber makes 3D approachable.** Building the arm as nested `<group>` elements with refs for rotation felt natural coming from React. The `useFrame` hook runs every render frame, so the arm movement is always perfectly smooth regardless of the chart update cadence.

**Mutable data + immutable props.** I settled on storing simulation state in a ref (mutated in-place for speed), then spreading into fresh arrays for React's chart props. This gives Chart.js new references to detect changes while avoiding 180-element array allocations on the hot path.

## Stack

- Docusaurus (static site)
- React + TypeScript
- Chart.js / react-chartjs-2
- Three.js / @react-three/fiber / @react-three/drei
- CSS Modules

## Try it

[See the live dashboard →](/projects/robotics-telemetry)
