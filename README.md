# PathQoS: Intent-Aware Adaptive QoS Engine

> **Your network should protect the experience, not just prioritize packets.**
> *Others apply QoS. PathQoS proves what changed—and why.*

PathQoS is an intent-aware, privacy-first adaptive QoS concept for home and small-office broadband. It observes traffic metadata without payload snooping, dynamically estimates changing WAN link capacity, issues temporary bounded intent leases, and audits real latency impact with an automated closed-loop rollback watchdog.

---

## Key Features

1. **Deterministic QoS Simulation Lab (Centerpiece)**:
   - 3 Test Scenarios: *ISO Download + Work Call*, *Dynamic WAN Drop (100 → 20 Mbps)*, and *Three 4K TVs + Competitive Gaming*.
   - 3 Enforcement Modes compared under identical offered traffic seeds:
     - **Unmanaged (FIFO)**: Demonstrates severe bufferbloat latency spikes (> 180ms) and tail drops.
     - **Deterministic Baseline (Fixed CAKE)**: Demonstrates modem buffer overflow when link capacity drops below static configuration.
     - **PathQoS Concept**: Demonstrates passive Kalman RTT tracking, automated rate re-clamping, and sub-15ms p95 latency preservation.
   - 7 Performance Metrics: p95 Latency, Jitter, Packet Loss, Throughput, Queue Delay, Jain's Fairness Index, and Router CPU Overhead.
   - Dynamic plain-language policy explanations and exact Linux `tc` netlink command diffs.

2. **Intent Lease Playground**:
   - Issue temporary, auto-expiring 15–45 minute quality agreements for Work Calls, Gaming, or 4K Streaming.
   - Real-time conflict handling when aggregate lease demands exceed estimated link bandwidth.

3. **Policy Verification & Rollback Timeline**:
   - 5-stage closed loop: **Snapshot → Apply → Read back → Verify → Commit or Roll back**.
   - Automated watchdog restores previous known-good snapshots in < 5ms if latency or packet loss invariants fail.

4. **Architecture Explorer**:
   - 6 modular subsystems: M1 (Metadata Capture), M2 (Classifier & Confidence), M3 (Capacity Estimator), M4 (Policy Engine), M5 (Enforcement Agent), and M6 (Verifier & Watchdog).
   - Clean separation between Data Plane (kernel eBPF / tc-cake) and Control Plane (user-space Rust daemon).
   - Transparent hardware and Wi-Fi AP telemetry boundaries.

---

## Tech Stack

- **Framework**: Next.js 15+ (App Router)
- **Language**: TypeScript (Strict Mode)
- **Styling**: Tailwind CSS v4 (Light-first visual system, zero-pill discipline)
- **Icons**: Lucide React
- **Testing**: Node.js built-in test runner (`node:test`, `node:assert/strict`) run via `tsx`
- **Linting**: ESLint 9+

---

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Local Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Run Unit Tests
```bash
npx --yes tsx --test tests/simulation.test.ts
```

### 4. Build for Production
```bash
npm run build
npm start
```

---

## Project Structure

```
├── app/
│   ├── globals.css          # Tailwind CSS v4 root configuration
│   ├── layout.tsx           # Metadata, OpenGraph & root HTML structure
│   ├── page.tsx             # Main page assembly & state management
│   └── api/
│       └── download/
│           └── route.ts     # Direct endpoint to download project zip
├── components/
│   ├── architecture/        # M1-M6 Subsystem Explorer
│   ├── footer/              # RFC references & licensing notice
│   ├── hero/                # Hero section & interactive topology
│   ├── intent-playground/   # Temporary intent leases & conflict handler
│   ├── nav/                 # Responsive 3-zone navigation bar
│   ├── qos-lab/             # Interactive QoS simulation centerpiece
│   ├── sections/            # Problem visualizer, workflow, strengths, etc.
│   └── verification/        # 5-stage verification & rollback timeline
├── hooks/
│   └── use-mobile.ts        # Responsive layout hook with useSyncExternalStore
├── lib/
│   ├── simulation/          # Pure deterministic queueing & policy simulation
│   │   ├── constants.ts     # Seeded scenarios, workloads, module specs
│   │   └── model.ts         # M/M/1/K bufferbloat & CAKE tin math
│   └── types/
│       └── index.ts         # TypeScript definitions
└── tests/
    └── simulation.test.ts   # 5 automated deterministic test suites
```

---

## License

MIT / Dual GPLv2 (for Linux kernel & OpenWrt integration compatibility).
