import {
  ClassAllocation,
  IntentLease,
  MetricSnapshot,
  PolicyEvent,
  PolicyMode,
  ScenarioId,
  SimulationResult,
  WorkloadConfig,
  WorkloadId,
} from '../types';
import { SCENARIO_DEFINITIONS, WORKLOAD_CATALOG } from './constants';

export interface SimulationInputs {
  scenarioId: ScenarioId;
  enabledWorkloads: Record<WorkloadId, boolean>;
  wanCapacityMbps: number;
  mode: PolicyMode;
  activeLeases?: IntentLease[];
  forceRollbackFault?: boolean;
}

/**
 * Computes Jain's Fairness Index for an array of bandwidth allocations
 * J(x) = (sum(x_i))^2 / (n * sum(x_i^2))
 */
export function calculateJainIndex(allocations: number[]): number {
  const active = allocations.filter((val) => val > 0);
  if (active.length <= 1) return 1.0;
  const sum = active.reduce((acc, v) => acc + v, 0);
  const sumSq = active.reduce((acc, v) => acc + v * v, 0);
  if (sumSq === 0) return 1.0;
  const index = (sum * sum) / (active.length * sumSq);
  return Math.min(1.0, Math.max(0.0, Number(index.toFixed(2))));
}

/**
 * Pure deterministic simulation engine for PathQoS
 */
export function runSimulation(inputs: SimulationInputs): SimulationResult {
  const {
    scenarioId,
    enabledWorkloads,
    wanCapacityMbps,
    mode,
    activeLeases = [],
    forceRollbackFault = false,
  } = inputs;

  const activeConfigs = WORKLOAD_CATALOG.filter((w) => enabledWorkloads[w.id]);
  const totalOfferedLoadMbps = activeConfigs.reduce(
    (sum, w) => sum + w.offeredBandwidthMbps,
    0
  );

  const capacity = Math.max(5, wanCapacityMbps);
  const utilizationRatio = totalOfferedLoadMbps / capacity;

  let metrics: MetricSnapshot;
  let allocations: ClassAllocation[] = [];
  let explanation = {
    summary: '',
    rationale: '',
    tradeoff: '',
    actionTaken: '',
  };
  let adaptationTriggered = false;
  let activeConflict: string | null = null;

  // Check for lease conflicts against capacity
  const highPriorityLeases = activeLeases.filter(
    (l) => l.state !== 'expired' && (l.preset === 'work-call' || l.preset === 'streaming')
  );
  if (capacity <= 25 && highPriorityLeases.length >= 2) {
    activeConflict = `Active leases demand ${highPriorityLeases.length * 15} Mbps reserved capacity on a constrained ${capacity} Mbps link. PathQoS gracefully throttled bulk bandwidth to preserve voice/video clarity.`;
  }

  if (mode === 'unmanaged') {
    // Unmanaged FIFO queueing without Active Queue Management (AQM)
    const isCongested = utilizationRatio > 0.85;
    const congestionFactor = Math.max(1, utilizationRatio);

    // Latency explodes as FIFO queue fills (classic bufferbloat)
    // Bulk TCP Cubic/BBR expands send window until standard 1000-packet buffer is full (~120-280ms)
    const hasSaturatingBulk = activeConfigs.some((w) => w.burstiness === 'saturating');
    const baseLatency = 14;
    const queueDelay = isCongested
      ? Math.min(320, (hasSaturatingBulk ? 160 : 40) + Math.round((congestionFactor - 0.85) * 180))
      : 8;
    const p95LatencyMs = baseLatency + queueDelay;
    const jitterMs = isCongested ? Math.min(68, 16 + Math.round(congestionFactor * 24)) : 3;
    const packetLossPct = isCongested
      ? Math.min(9.4, Number(((congestionFactor - 0.8) * 4.2).toFixed(1)))
      : 0.1;
    const throughputMbps = Math.min(capacity * 0.96, totalOfferedLoadMbps);
    const cpuOverheadPct = 0.4; // Kernel default FIFO path

    // Bulk traffic starves interactive traffic under FIFO tail-drop
    allocations = activeConfigs.map((w) => {
      let share = 0;
      if (w.id === 'bulk-download') {
        share = throughputMbps * 0.85;
      } else if (w.id === 'streaming') {
        share = throughputMbps * 0.12;
      } else {
        share = Math.max(0.2, throughputMbps * 0.015);
      }
      return {
        classId: w.id,
        className: w.name,
        bandwidthMbps: Number(share.toFixed(1)),
        sharePct: Math.round((share / (throughputMbps || 1)) * 100),
        p95LatencyMs: p95LatencyMs + (w.deadlineSensitivity === 'strict' ? 12 : 0),
        status: isCongested ? 'congested' : 'healthy',
      };
    });

    const jainIndex = calculateJainIndex(allocations.map((a) => a.bandwidthMbps));

    metrics = {
      p95LatencyMs,
      jitterMs,
      packetLossPct,
      throughputMbps: Number(throughputMbps.toFixed(1)),
      queueDelayMs: queueDelay,
      jainFairnessIndex: jainIndex,
      cpuOverheadPct,
      label: 'simulated',
    };

    explanation = {
      summary: 'Standard FIFO Queue with no Active Queue Management (AQM).',
      rationale:
        'All packets enter a single first-in, first-out kernel queue without flow isolation or priority scheduling. When offered load exceeds link capacity, the queue buffer fills up, causing severe bufferbloat.',
      tradeoff:
        'Zero CPU overhead, but interactive audio/video calls and gaming packets are trapped behind giant TCP bulk bursts.',
      actionTaken: 'No shaping applied; interface queue set to standard 1000-packet pfifo_fast.',
    };
  } else if (mode === 'deterministic') {
    // Fixed deterministic CAKE/FQ-CoDel configured for nominal 100 Mbps
    const nominalSettingMbps = 95; // 95% of 100M
    const isWanDegraded = capacity < 70; // e.g. dropped to 20 Mbps

    let p95LatencyMs = 18;
    let jitterMs = 4;
    let queueDelay = 6;
    let packetLossPct = 0.2;
    const cpuOverheadPct = 1.8;

    if (isWanDegraded) {
      // Shaper is unaware that line dropped from 100M to 20M!
      // CAKE continues outputting at 95 Mbps into an ISP modem buffer that can only pass 20 Mbps.
      // The modem queue (outside router control) inflates!
      queueDelay = Math.min(240, Math.round((100 / capacity) * 28));
      p95LatencyMs = 16 + queueDelay;
      jitterMs = 28;
      packetLossPct = 3.6;
    }

    const throughputMbps = Math.min(capacity * 0.94, totalOfferedLoadMbps);

    allocations = activeConfigs.map((w) => {
      let share = 0;
      if (w.id === 'bulk-download') {
        share = throughputMbps * 0.55;
      } else if (w.id === 'streaming') {
        share = throughputMbps * 0.35;
      } else {
        share = Math.min(w.offeredBandwidthMbps, throughputMbps * 0.05);
      }
      return {
        classId: w.id,
        className: w.name,
        bandwidthMbps: Number(share.toFixed(1)),
        sharePct: Math.round((share / (throughputMbps || 1)) * 100),
        p95LatencyMs: p95LatencyMs + (w.deadlineSensitivity === 'strict' ? 8 : 0),
        status: isWanDegraded ? 'constrained' : 'healthy',
      };
    });

    const jainIndex = calculateJainIndex(allocations.map((a) => a.bandwidthMbps));

    metrics = {
      p95LatencyMs,
      jitterMs,
      packetLossPct,
      throughputMbps: Number(throughputMbps.toFixed(1)),
      queueDelayMs: queueDelay,
      jainFairnessIndex: jainIndex,
      cpuOverheadPct,
      label: 'simulated',
    };

    explanation = {
      summary: isWanDegraded
        ? 'Static CAKE/FQ-CoDel shaper failing due to unmeasured WAN capacity drop.'
        : 'Static CAKE/FQ-CoDel configured for fixed nominal 100 Mbps uplink.',
      rationale: isWanDegraded
        ? `The static shaper assumes 95 Mbps link capacity, but physical WAN rate dropped to ${capacity} Mbps. Packets spill out of the router at 95 Mbps and saturate the ISP modem buffer, destroying queue isolation.`
        : 'FQ-CoDel hashes flows into distinct fair queues and enforces CoDel target delay (5ms) at the configured 95 Mbps rate limit.',
      tradeoff:
        'Excellent protection when line speed is static, but completely brittle when broadband links fluctuate or experience cellular/cable throttling.',
      actionTaken: `tc qdisc replace dev eth0 root cake bandwidth 95Mbit diffserv4`,
    };
  } else {
    // PathQoS Concept: Intent-Aware + Dynamic Capacity Adaptation + Verification
    adaptationTriggered = capacity < 90 || activeConfigs.length > 2;
    const safeShaperRate = Math.round(capacity * 0.92); // 92% of actual detected line rate

    let p95LatencyMs = 12;
    let jitterMs = 2.1;
    let queueDelay = 4;
    let packetLossPct = 0.05;
    let cpuOverheadPct = 2.4;

    if (forceRollbackFault) {
      // Simulate forced misconfiguration or packet corruption
      p95LatencyMs = 110;
      jitterMs = 35;
      queueDelay = 95;
      packetLossPct = 4.8;
    }

    const availableEffectiveBw = Math.min(safeShaperRate, totalOfferedLoadMbps);

    // Guaranteed allocations based on intent leases & traffic class
    let interactiveReserved = 0;
    if (enabledWorkloads['work-call']) interactiveReserved += 2.4;
    if (enabledWorkloads['gaming']) interactiveReserved += 0.8;

    const remainingBw = Math.max(1, availableEffectiveBw - interactiveReserved);

    allocations = activeConfigs.map((w) => {
      let bw = 0;
      if (w.id === 'work-call') {
        bw = 2.4;
      } else if (w.id === 'gaming') {
        bw = 0.8;
      } else if (w.id === 'streaming') {
        bw = Math.min(25, remainingBw * 0.65);
      } else if (w.id === 'bulk-download') {
        bw = Math.max(0.5, remainingBw * 0.35);
      }
      return {
        classId: w.id,
        className: w.name,
        bandwidthMbps: Number(bw.toFixed(1)),
        sharePct: Math.round((bw / (availableEffectiveBw || 1)) * 100),
        p95LatencyMs:
          w.deadlineSensitivity === 'strict'
            ? p95LatencyMs - 2
            : p95LatencyMs + 5,
        status: forceRollbackFault ? 'congested' : 'healthy',
      };
    });

    const jainIndex = calculateJainIndex(allocations.map((a) => a.bandwidthMbps));

    metrics = {
      p95LatencyMs,
      jitterMs,
      packetLossPct,
      throughputMbps: Number(availableEffectiveBw.toFixed(1)),
      queueDelayMs: queueDelay,
      jainFairnessIndex: jainIndex,
      cpuOverheadPct,
      label: 'simulated',
    };

    explanation = {
      summary:
        capacity <= 25
          ? `Adaptive bandwidth clamp to ${safeShaperRate} Mbps with active Intent Lease protection.`
          : `Metadata-guided CAKE tin prioritization maintaining ${p95LatencyMs}ms p95 latency.`,
      rationale:
        capacity <= 25
          ? `Passive TCP RTT dispersion detected WAN capacity drop to ${capacity} Mbps. PathQoS immediately clamped the CAKE shaper envelope to ${safeShaperRate} Mbps (preventing modem bufferbloat) while giving priority to the interactive WebRTC voice/video lease.`
          : `Observed flow metadata classified interactive voice/gaming into High-Priority/Voice CAKE tins. Bulk ISO flow was bounded to fair background tin with zero packet snooping.`,
      tradeoff:
        `Bulk download throughput temporarily capped at ${allocations.find((a) => a.classId === 'bulk-download')?.bandwidthMbps ?? 0} Mbps to maintain strict sub-15ms latency guarantees for interactive applications.`,
      actionTaken: `tc qdisc replace dev eth0 root cake bandwidth ${safeShaperRate}Mbit diffserv4 ingress ack-filter`,
    };
  }

  // Generate 5-stage verification timeline events
  const verificationEvents = generateVerificationTimeline(
    mode,
    capacity,
    metrics,
    forceRollbackFault
  );

  return {
    scenarioId,
    mode,
    wanCapacityMbps: capacity,
    totalOfferedLoadMbps: Number(totalOfferedLoadMbps.toFixed(1)),
    metrics,
    allocations,
    explanation,
    verificationEvents,
    adaptationTriggered,
    activeConflict,
  };
}

/**
 * Generates the 5-stage Policy Verification Timeline:
 * Snapshot -> Apply -> Read back -> Verify -> Commit or Roll back
 */
export function generateVerificationTimeline(
  mode: PolicyMode,
  wanCapacityMbps: number,
  currentMetrics: MetricSnapshot,
  forceRollback: boolean
): PolicyEvent[] {
  const isRollback = forceRollback || (mode === 'unmanaged' && currentMetrics.queueDelayMs > 100);

  const events: PolicyEvent[] = [
    {
      stage: 'snapshot',
      timestampMs: 0,
      title: 'Snapshot Active State',
      description: 'Captured current kernel qdisc counters, queue depth, and baseline RTT samples.',
      policyDiff: 'qdisc: cake dev eth0 rate 95Mbit; queue_depth: 14 pkts',
      metricChecked: 'Baseline RTT = 14.2ms · Active flows = 18',
      measuredDelta: 'Baseline recorded',
      outcome: 'success',
    },
    {
      stage: 'apply',
      timestampMs: 45,
      title: 'Apply Candidate Policy',
      description:
        mode === 'pathqos'
          ? `Adjusted CAKE shaper bandwidth to ${Math.round(wanCapacityMbps * 0.92)} Mbps with diffserv4 classification.`
          : mode === 'deterministic'
          ? 'Re-asserted static 95 Mbps FQ-CoDel shaper limit.'
          : 'Preserved unmanaged FIFO default interface queue.',
      policyDiff:
        mode === 'pathqos'
          ? `+ tc qdisc replace dev eth0 root cake bandwidth ${Math.round(wanCapacityMbps * 0.92)}Mbit diffserv4`
          : '- static configuration retained',
      metricChecked: 'Netlink syscall response',
      measuredDelta: '0 errno / applied',
      outcome: 'success',
    },
    {
      stage: 'readback',
      timestampMs: 90,
      title: 'Kernel Read-Back & State Audit',
      description: 'Polled netlink socket to verify qdisc parameters and drop counters took effect in kernel space.',
      policyDiff: 'Verified: qdisc cake 8001: dev eth0 parent root bands 4',
      metricChecked: 'Kernel qdisc status',
      measuredDelta: 'Syscall confirmed in 1.4ms',
      outcome: 'success',
    },
    {
      stage: 'verify',
      timestampMs: 280,
      title: 'Active Verification Micro-Probes',
      description: 'Dispatched 50 synthetic micro-probes to gateway to assess p95 queue delay and packet jitter under live load.',
      policyDiff: `Target: p95 latency < 25ms · Critical loss < 0.2%`,
      metricChecked: `Measured p95 = ${currentMetrics.p95LatencyMs}ms · Loss = ${currentMetrics.packetLossPct}%`,
      measuredDelta: isRollback ? '+85ms delay surge (FAILED INVARIANT)' : '-82% queue bloat',
      outcome: isRollback ? 'rollback' : 'success',
    },
    {
      stage: isRollback ? 'rollback' : 'commit',
      timestampMs: 380,
      title: isRollback ? 'Automatic Policy Rollback' : 'Commit & Lock Policy Lease',
      description: isRollback
        ? 'Watchdog invariant violated! Automatically restored previous snapshot to protect connectivity.'
        : 'Verification criteria satisfied. Policy committed to kernel ledger; watchdog timer armed for 300s lease renewal.',
      policyDiff: isRollback
        ? 'REVERT: Restored snapshot #8412 (fail-safe fallback)'
        : 'COMMIT: Policy certified and locked into active slot',
      metricChecked: isRollback ? 'Watchdog trigger' : 'Invariant satisfaction',
      measuredDelta: isRollback ? 'Rollback executed in 3.2ms' : 'Confirmed stable',
      outcome: isRollback ? 'rollback' : 'success',
    },
  ];

  return events;
}
