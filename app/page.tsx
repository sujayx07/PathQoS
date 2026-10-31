'use client';

import { useState } from 'react';
import Navbar from '../components/nav/Navbar';
import Hero from '../components/hero/Hero';
import ProblemVisualizer from '../components/sections/ProblemVisualizer';
import QosLab from '../components/qos-lab/QosLab';
import IntentPlayground from '../components/intent-playground/IntentPlayground';
import VerificationTimeline from '../components/verification/VerificationTimeline';
import ArchitectureExplorer from '../components/architecture/ArchitectureExplorer';
import Workflow from '../components/sections/Workflow';
import CoreStrengths from '../components/sections/CoreStrengths';
import ValidationMethodology from '../components/sections/ValidationMethodology';
import ScopeAndLimitations from '../components/sections/ScopeAndLimitations';
import Footer from '../components/footer/Footer';
import { IntentLease } from '../lib/types';
import { generateVerificationTimeline } from '../lib/simulation/model';

export default function HomePage() {
  // Global managed intent leases state
  const [leases, setLeases] = useState<IntentLease[]>([
    {
      id: 'lease-901',
      name: 'Protect Work Call (WebRTC)',
      preset: 'work-call',
      targetDevice: 'MacBook Pro (02:44:89:af)',
      targetClass: 'WebRTC Audio/Video (DiffServ Voice)',
      targetMetric: 'p95 Latency & Jitter',
      targetValue: '< 20ms p95 · < 5ms Jitter',
      durationMinutes: 30,
      remainingSeconds: 1680,
      rationale:
        'Prioritizes outbound WebRTC audio/video packets into CAKE Voice tin; guarantees minimum 2.5 Mbps allocation during saturating uploads.',
      state: 'meeting-goal',
      createdAt: 1730300000000,
    },
    {
      id: 'lease-902',
      name: 'Low-Latency Gaming Tick Rate',
      preset: 'gaming',
      targetDevice: 'Gaming Rig (b4:96:91:2c)',
      targetClass: 'UDP Port Range 27015-27050',
      targetMetric: 'UDP Queue Time & Packet Drop',
      targetValue: '< 15ms Latency · 0.0% Drop',
      durationMinutes: 45,
      remainingSeconds: 2420,
      rationale:
        'Places 128Hz UDP packet streams at the head of line; bounds queue buffer to zero to avoid frame desync.',
      state: 'meeting-goal',
      createdAt: 1730299840000,
    },
  ]);

  // Fault simulation state for Verification Timeline
  const [isFaultForced, setIsFaultForced] = useState<boolean>(false);

  // Add new lease handler
  const handleCreateLease = (
    newLeaseData: Omit<IntentLease, 'id' | 'createdAt' | 'remainingSeconds'>
  ) => {
    const newId = `lease-${Math.floor(100 + Math.random() * 900)}`;
    const newLease: IntentLease = {
      ...newLeaseData,
      id: newId,
      remainingSeconds: newLeaseData.durationMinutes * 60,
      createdAt: Date.now(),
    };
    setLeases((prev) => [newLease, ...prev]);
  };

  // Cancel lease handler
  const handleCancelLease = (id: string) => {
    setLeases((prev) => prev.filter((l) => l.id !== id));
  };

  // Simulate expire lease handler
  const handleSimulateExpire = (id: string) => {
    setLeases((prev) =>
      prev.map((l) =>
        l.id === id ? { ...l, state: 'expired', remainingSeconds: 0 } : l
      )
    );
  };

  // Generate verification timeline events based on fault toggle
  const verificationEvents = generateVerificationTimeline(
    'pathqos',
    100,
    {
      p95LatencyMs: isFaultForced ? 110 : 12,
      jitterMs: isFaultForced ? 35 : 2.1,
      packetLossPct: isFaultForced ? 4.8 : 0.05,
      throughputMbps: 92,
      queueDelayMs: isFaultForced ? 95 : 4,
      jainFairnessIndex: 0.88,
      cpuOverheadPct: 2.4,
      label: 'simulated',
    },
    isFaultForced
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F9FC]">
      {/* 1. Sticky Navigation */}
      <Navbar />

      <main className="flex-1">
        {/* 2. Hero Section with Interactive Topology */}
        <Hero />

        {/* 3. Problem Visualizer: Bufferbloat vs Wi-Fi Contention */}
        <ProblemVisualizer />

        {/* 4. Interactive QoS Lab (Centerpiece) */}
        <QosLab activeLeases={leases} />

        {/* 5. Intent Lease Playground */}
        <IntentPlayground
          leases={leases}
          onCreateLease={handleCreateLease}
          onCancelLease={handleCancelLease}
          onSimulateExpire={handleSimulateExpire}
        />

        {/* 6. Policy Verification & Safe Rollback Timeline */}
        <VerificationTimeline
          events={verificationEvents}
          onTriggerFault={setIsFaultForced}
          isFaultForced={isFaultForced}
        />

        {/* 7. Workflow: Observe -> Decide -> Enforce -> Verify */}
        <Workflow />

        {/* 8. Architecture Explorer: Six Modules & Plane Separation */}
        <ArchitectureExplorer />

        {/* 9. Core Strengths & Differentiators */}
        <CoreStrengths />

        {/* 10. Validation & Test Methodology */}
        <ValidationMethodology />

        {/* 11. Scope & Limitations */}
        <ScopeAndLimitations />
      </main>

      {/* 12. Footer with RFC references & disclosures */}
      <Footer />
    </div>
  );
}
