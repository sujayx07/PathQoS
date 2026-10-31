export type ScenarioId = 'iso-download-call' | 'wan-drop' | 'three-tvs-gaming';

export type WorkloadId = 'work-call' | 'gaming' | 'streaming' | 'bulk-download';

export type PolicyMode = 'unmanaged' | 'deterministic' | 'pathqos';

export interface WorkloadConfig {
  id: WorkloadId;
  name: string;
  category: string;
  protocol: 'UDP' | 'TCP' | 'WebRTC';
  offeredBandwidthMbps: number;
  burstiness: 'steady' | 'bursty' | 'saturating';
  deadlineSensitivity: 'strict' | 'moderate' | 'relaxed';
  targetLatencyMs: number;
  description: string;
}

export interface MetricSnapshot {
  p95LatencyMs: number;
  jitterMs: number;
  packetLossPct: number;
  throughputMbps: number;
  queueDelayMs: number;
  jainFairnessIndex: number;
  cpuOverheadPct: number;
  label: 'simulated';
}

export interface ClassAllocation {
  classId: string;
  className: string;
  bandwidthMbps: number;
  sharePct: number;
  p95LatencyMs: number;
  status: 'healthy' | 'constrained' | 'congested';
}

export type LeaseGoalPreset = 'work-call' | 'gaming' | 'streaming' | 'custom';

export type LeaseState = 'meeting-goal' | 'constrained' | 'expired';

export interface IntentLease {
  id: string;
  name: string;
  preset: LeaseGoalPreset;
  targetDevice: string;
  targetClass: string;
  targetMetric: string;
  targetValue: string;
  durationMinutes: number;
  remainingSeconds: number;
  rationale: string;
  state: LeaseState;
  createdAt: number;
}

export type VerificationStage = 'snapshot' | 'apply' | 'readback' | 'verify' | 'commit' | 'rollback';

export interface PolicyEvent {
  stage: VerificationStage;
  timestampMs: number;
  title: string;
  description: string;
  policyDiff: string;
  metricChecked: string;
  measuredDelta: string;
  outcome: 'success' | 'warning' | 'rollback' | 'pending';
}

export interface SimulationResult {
  scenarioId: ScenarioId;
  mode: PolicyMode;
  wanCapacityMbps: number;
  totalOfferedLoadMbps: number;
  metrics: MetricSnapshot;
  allocations: ClassAllocation[];
  explanation: {
    summary: string;
    rationale: string;
    tradeoff: string;
    actionTaken: string;
  };
  verificationEvents: PolicyEvent[];
  adaptationTriggered: boolean;
  activeConflict: string | null;
}

export interface ArchitectureModule {
  id: 'm1' | 'm2' | 'm3' | 'm4' | 'm5' | 'm6';
  number: string;
  name: string;
  shortName: string;
  role: string;
  plane: 'data' | 'control';
  inputs: string[];
  outputs: string[];
  internalState: string[];
  failureBehavior: string;
  testCoverage: string;
  kernelMechanism: string;
  hardwareDependency: string;
}
