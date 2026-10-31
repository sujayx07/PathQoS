'use client';

import { useState, useMemo, useEffect } from 'react';
import {
  Activity,
  Play,
  RotateCcw,
  Zap,
  Info,
  CheckCircle2,
  AlertTriangle,
  Flame,
  ChevronDown,
  ChevronUp,
  Cpu,
  ShieldAlert,
  ArrowRight,
  Sliders,
  Layers,
  Sparkles,
} from 'lucide-react';
import { PolicyMode, ScenarioId, WorkloadId, IntentLease } from '../../lib/types';
import { SCENARIO_DEFINITIONS, WORKLOAD_CATALOG } from '../../lib/simulation/constants';
import { runSimulation } from '../../lib/simulation/model';

interface QosLabProps {
  activeLeases?: IntentLease[];
  onOpenLeaseModal?: () => void;
}

export default function QosLab({ activeLeases = [], onOpenLeaseModal }: QosLabProps) {
  // Scenario state
  const [activeScenarioId, setActiveScenarioId] = useState<ScenarioId>('iso-download-call');

  // Workload toggles state
  const [enabledWorkloads, setEnabledWorkloads] = useState<Record<WorkloadId, boolean>>({
    'work-call': true,
    gaming: false,
    streaming: false,
    'bulk-download': true,
  });

  // WAN Capacity state
  const [wanCapacityMbps, setWanCapacityMbps] = useState<number>(100);

  // Policy Mode state
  const [mode, setMode] = useState<PolicyMode>('pathqos');

  // Fault injection toggle (to demonstrate watchdog rollback)
  const [forceFault, setForceFault] = useState<boolean>(false);

  // Lifecycle animation state: 'idle' | 'running' | 'completed'
  const [simStage, setSimStage] = useState<'idle' | 'running' | 'completed'>('idle');
  const [activeStageStep, setActiveStageStep] = useState<number>(0);

  // Expandable mathematical disclosure state
  const [disclosureOpen, setDisclosureOpen] = useState<boolean>(false);

  // When scenario changes, update defaults
  const handleSelectScenario = (scenarioId: ScenarioId) => {
    setActiveScenarioId(scenarioId);
    const def = SCENARIO_DEFINITIONS[scenarioId];
    setWanCapacityMbps(def.defaultWanMbps);
    setEnabledWorkloads({
      'work-call': !!def.recommendedWorkloads['work-call'],
      gaming: !!def.recommendedWorkloads['gaming'],
      streaming: !!def.recommendedWorkloads['streaming'],
      'bulk-download': !!def.recommendedWorkloads['bulk-download'],
    });
    setForceFault(false);
    setSimStage('idle');
  };

  // Run simulation sequence
  const handleRunSimulation = () => {
    setSimStage('running');
    setActiveStageStep(1); // 1: Observe

    setTimeout(() => {
      setActiveStageStep(2); // 2: Decide
    }, 280);

    setTimeout(() => {
      setActiveStageStep(3); // 3: Enforce
    }, 560);

    setTimeout(() => {
      setActiveStageStep(4); // 4: Verify
    }, 840);

    setTimeout(() => {
      setSimStage('completed');
    }, 1120);
  };

  // Reset to current scenario defaults
  const handleReset = () => {
    const def = SCENARIO_DEFINITIONS[activeScenarioId];
    setWanCapacityMbps(def.defaultWanMbps);
    setEnabledWorkloads({
      'work-call': !!def.recommendedWorkloads['work-call'],
      gaming: !!def.recommendedWorkloads['gaming'],
      streaming: !!def.recommendedWorkloads['streaming'],
      'bulk-download': !!def.recommendedWorkloads['bulk-download'],
    });
    setMode('pathqos');
    setForceFault(false);
    setSimStage('idle');
  };

  // Compute deterministic simulation output via pure function
  const simulationResult = useMemo(() => {
    return runSimulation({
      scenarioId: activeScenarioId,
      enabledWorkloads,
      wanCapacityMbps,
      mode,
      activeLeases,
      forceRollbackFault: forceFault,
    });
  }, [activeScenarioId, enabledWorkloads, wanCapacityMbps, mode, activeLeases, forceFault]);

  const { metrics, allocations, explanation, activeConflict, adaptationTriggered } = simulationResult;

  return (
    <section id="lab" className="py-16 md:py-24 bg-[#F7F9FC] border-b border-[#D9E2EE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Lab Header & Honesty Disclosure Banner */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#D9E2EE]">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-bold text-[#315CE8] bg-[#EEF3F9] rounded-md border border-[#D9E2EE]">
                <Activity className="w-3.5 h-3.5 text-[#315CE8]" />
                Interactive QoS Lab · v1.1
              </span>
              <span className="text-xs text-[#52627A] font-medium">
                Seeded Client-Side Deterministic Model
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#17233B] tracking-tight">
              Test traffic scenarios, modes, and dynamic capacity adaptation
            </h2>
          </div>

          {/* Honest Simulation Disclaimer badge */}
          <div className="shrink-0 p-3 bg-white border border-[#D9E2EE] rounded-xl text-xs space-y-1 max-w-sm shadow-xs">
            <div className="flex items-center gap-1.5 font-semibold text-[#17233B]">
              <Info className="w-4 h-4 text-[#315CE8] shrink-0" />
              <span>Illustrative Simulation Disclosure</span>
            </div>
            <p className="text-[11px] text-[#52627A] leading-normal">
              Every metric and policy action is calculated client-side via deterministic queueing equations. It does not inspect your network or configure your router.
            </p>
          </div>
        </div>

        {/* 1. Scenario Selector Bar */}
        <div className="space-y-3">
          <div className="text-xs font-bold text-[#52627A] uppercase tracking-wider">
            Step 1: Select Test Scenario
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(Object.keys(SCENARIO_DEFINITIONS) as ScenarioId[]).map((sId) => {
              const scenario = SCENARIO_DEFINITIONS[sId];
              const isSelected = activeScenarioId === sId;
              return (
                <button
                  key={sId}
                  type="button"
                  onClick={() => handleSelectScenario(sId)}
                  className={`text-left p-4 rounded-xl border transition-all text-xs space-y-1.5 ${
                    isSelected
                      ? 'bg-white border-[#315CE8] shadow-sm ring-1 ring-[#315CE8]'
                      : 'bg-white border-[#D9E2EE] hover:border-[#CBD5E1] hover:bg-[#EEF3F9]'
                  }`}
                  aria-pressed={isSelected}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-[#17233B]">
                      {scenario.title}
                    </span>
                    {isSelected && (
                      <span className="w-2 h-2 rounded-full bg-[#315CE8]" />
                    )}
                  </div>
                  <p className="text-[#52627A] text-[11px] leading-relaxed line-clamp-2">
                    {scenario.subtitle}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Lab Controls & Display Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Interactive Controls */}
          <div className="lg:col-span-5 space-y-6">
            {/* Mode Comparison Switch */}
            <div className="bg-white border border-[#D9E2EE] rounded-2xl p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#17233B] uppercase tracking-wider">
                  Enforcement Mode
                </span>
                <span className="text-[11px] text-[#52627A]">Identical offered seed</span>
              </div>

              <div className="grid grid-cols-3 gap-2 p-1 bg-[#EEF3F9] rounded-xl text-xs">
                <button
                  type="button"
                  onClick={() => setMode('unmanaged')}
                  className={`py-2 px-2 rounded-lg font-semibold transition-all text-center ${
                    mode === 'unmanaged'
                      ? 'bg-white text-[#D94F45] shadow-xs'
                      : 'text-[#52627A] hover:text-[#17233B]'
                  }`}
                >
                  Unmanaged
                </button>
                <button
                  type="button"
                  onClick={() => setMode('deterministic')}
                  className={`py-2 px-2 rounded-lg font-semibold transition-all text-center ${
                    mode === 'deterministic'
                      ? 'bg-white text-[#17233B] shadow-xs'
                      : 'text-[#52627A] hover:text-[#17233B]'
                  }`}
                >
                  Fixed CAKE
                </button>
                <button
                  type="button"
                  onClick={() => setMode('pathqos')}
                  className={`py-2 px-2 rounded-lg font-semibold transition-all text-center ${
                    mode === 'pathqos'
                      ? 'bg-[#315CE8] text-white shadow-xs'
                      : 'text-[#52627A] hover:text-[#17233B]'
                  }`}
                >
                  PathQoS
                </button>
              </div>

              <div className="text-[11px] text-[#52627A] pt-1">
                {mode === 'unmanaged' && 'Tail-drop FIFO queue. Saturated buffers delay audio/game packets.'}
                {mode === 'deterministic' && 'Static 95 Mbps FQ-CoDel limit. Overflows when ISP throughput drops.'}
                {mode === 'pathqos' && 'Intent-aware metadata classification + dynamic line clamping + verification.'}
              </div>
            </div>

            {/* Workload Toggles */}
            <div className="bg-white border border-[#D9E2EE] rounded-2xl p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#17233B] uppercase tracking-wider">
                  Offered Workload Mix
                </span>
                <span className="text-xs font-mono font-semibold text-[#17233B]">
                  Offered: {simulationResult.totalOfferedLoadMbps} Mbps
                </span>
              </div>

              <div className="space-y-2.5">
                {WORKLOAD_CATALOG.map((workload) => {
                  const isChecked = !!enabledWorkloads[workload.id];
                  return (
                    <label
                      key={workload.id}
                      className="flex items-center justify-between p-3 border border-[#D9E2EE] rounded-xl hover:bg-[#F7F9FC] cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) =>
                            setEnabledWorkloads((prev) => ({
                              ...prev,
                              [workload.id]: e.target.checked,
                            }))
                          }
                          className="w-4 h-4 rounded text-[#315CE8] border-[#D9E2EE] focus:ring-[#315CE8]"
                        />
                        <div>
                          <div className="text-xs font-semibold text-[#17233B]">
                            {workload.name}
                          </div>
                          <div className="text-[11px] text-[#52627A]">
                            {workload.protocol} · {workload.burstiness}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-mono font-semibold text-[#17233B]">
                          {workload.offeredBandwidthMbps} Mbps
                        </span>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* WAN Capacity Slider & Quick Action */}
            <div className="bg-white border border-[#D9E2EE] rounded-2xl p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#17233B] uppercase tracking-wider">
                  Bottleneck WAN Capacity
                </span>
                <span className="text-sm font-mono font-extrabold text-[#315CE8] tabular-nums">
                  {wanCapacityMbps} Mbps
                </span>
              </div>

              <input
                type="range"
                min="10"
                max="200"
                step="5"
                value={wanCapacityMbps}
                onChange={(e) => setWanCapacityMbps(Number(e.target.value))}
                className="w-full h-2 bg-[#EEF3F9] rounded-lg appearance-none cursor-pointer accent-[#315CE8]"
                aria-label="Bottleneck WAN Capacity Slider"
              />

              <div className="flex items-center justify-between gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setWanCapacityMbps(20)}
                  className="px-3 py-1.5 text-xs font-semibold text-[#B86B00] bg-[#FFF4D6] hover:bg-[#FFEEC2] rounded-lg transition-colors border border-[#B86B00]/20"
                >
                  Quick: Trigger 20 Mbps Drop
                </button>
                <button
                  type="button"
                  onClick={() => setWanCapacityMbps(100)}
                  className="px-3 py-1.5 text-xs font-semibold text-[#52627A] bg-[#EEF3F9] hover:bg-[#E2E8F0] rounded-lg transition-colors"
                >
                  Reset to 100 Mbps
                </button>
              </div>

              {adaptationTriggered && mode === 'pathqos' && (
                <div className="p-2.5 bg-[#E6F7F5] border border-[#0F9D8A]/30 rounded-xl text-xs flex items-center gap-2 text-[#0A6C5F]">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-[#0F9D8A]" />
                  <span>
                    <strong>Adaptive event:</strong> Capacity drop detected; CAKE shaper dynamically clamped to {Math.round(wanCapacityMbps * 0.92)} Mbps.
                  </span>
                </div>
              )}

              {activeConflict && (
                <div className="p-2.5 bg-[#FFF4D6] border border-[#B86B00]/30 rounded-xl text-xs flex items-start gap-2 text-[#8A5000]">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-[#B86B00]" />
                  <span>{activeConflict}</span>
                </div>
              )}
            </div>

            {/* Run Lifecycle & Fault Simulation Controls */}
            <div className="bg-white border border-[#D9E2EE] rounded-2xl p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#17233B] uppercase tracking-wider">
                  Simulation Lifecycle
                </span>
                <button
                  type="button"
                  onClick={() => setForceFault(!forceFault)}
                  className={`text-xs font-semibold px-2 py-1 rounded transition-colors ${
                    forceFault
                      ? 'bg-[#FFF0EE] text-[#D94F45] border border-[#D94F45]/30'
                      : 'text-[#52627A] hover:text-[#17233B]'
                  }`}
                  aria-pressed={forceFault}
                >
                  {forceFault ? 'Fault Active (Rollback)' : 'Test Rollback Fault'}
                </button>
              </div>

              {/* Progress step bar */}
              {simStage === 'running' && (
                <div className="space-y-1.5 bg-[#EEF3F9] p-3 rounded-xl text-xs">
                  <div className="flex items-center justify-between text-[#52627A] text-[11px] font-semibold">
                    <span className={activeStageStep >= 1 ? 'text-[#315CE8]' : ''}>1. Observe</span>
                    <span className={activeStageStep >= 2 ? 'text-[#315CE8]' : ''}>2. Decide</span>
                    <span className={activeStageStep >= 3 ? 'text-[#315CE8]' : ''}>3. Enforce</span>
                    <span className={activeStageStep >= 4 ? 'text-[#315CE8]' : ''}>4. Verify</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#D9E2EE] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#315CE8] transition-all duration-300"
                      style={{ width: `${activeStageStep * 25}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleRunSimulation}
                  disabled={simStage === 'running'}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-[#315CE8] hover:bg-[#244ED8] disabled:opacity-50 rounded-xl transition-all shadow-xs"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>{simStage === 'running' ? 'Simulating Loop...' : 'Run Control Loop'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleReset}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-[#17233B] bg-white border border-[#D9E2EE] hover:bg-[#EEF3F9] rounded-xl transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-[#52627A]" />
                  <span>Reset</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Simulated Metrics & Policy Explanation */}
          <div className="lg:col-span-7 space-y-6">
            {/* 7 Key Metrics Cards Grid */}
            <div className="bg-white border border-[#D9E2EE] rounded-2xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-[#17233B]">
                    Simulated Network Performance Metrics
                  </h3>
                  <div className="text-[11px] text-[#52627A]">
                    Mode: <strong className="text-[#17233B] uppercase">{mode}</strong> · Seed: {activeScenarioId}
                  </div>
                </div>
                <span className="text-[10px] uppercase font-bold text-[#52627A] bg-[#EEF3F9] px-2 py-0.5 rounded">
                  Simulated / Estimated
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                {/* p95 Latency */}
                <div className="p-3 bg-[#F7F9FC] border border-[#D9E2EE] rounded-xl space-y-1">
                  <div className="text-[11px] font-medium text-[#52627A]">p95 Latency</div>
                  <div
                    className={`text-xl font-extrabold font-mono tabular-nums ${
                      metrics.p95LatencyMs < 25
                        ? 'text-[#0F9D8A]'
                        : metrics.p95LatencyMs < 60
                        ? 'text-[#B86B00]'
                        : 'text-[#D94F45]'
                    }`}
                  >
                    {metrics.p95LatencyMs}
                    <span className="text-xs font-normal text-[#52627A] ml-1">ms</span>
                  </div>
                  <div className="text-[10px] text-[#52627A]">
                    {metrics.p95LatencyMs < 25 ? 'Smooth interactive' : 'Noticeable lag'}
                  </div>
                </div>

                {/* Latency Jitter */}
                <div className="p-3 bg-[#F7F9FC] border border-[#D9E2EE] rounded-xl space-y-1">
                  <div className="text-[11px] font-medium text-[#52627A]">Jitter</div>
                  <div
                    className={`text-xl font-extrabold font-mono tabular-nums ${
                      metrics.jitterMs < 5 ? 'text-[#0F9D8A]' : 'text-[#D94F45]'
                    }`}
                  >
                    {metrics.jitterMs}
                    <span className="text-xs font-normal text-[#52627A] ml-1">ms</span>
                  </div>
                  <div className="text-[10px] text-[#52627A]">
                    {metrics.jitterMs < 5 ? 'Sub-5ms stable' : 'Audio packet stutter'}
                  </div>
                </div>

                {/* Packet Loss */}
                <div className="p-3 bg-[#F7F9FC] border border-[#D9E2EE] rounded-xl space-y-1">
                  <div className="text-[11px] font-medium text-[#52627A]">Packet Loss</div>
                  <div
                    className={`text-xl font-extrabold font-mono tabular-nums ${
                      metrics.packetLossPct < 0.5 ? 'text-[#0F9D8A]' : 'text-[#D94F45]'
                    }`}
                  >
                    {metrics.packetLossPct}
                    <span className="text-xs font-normal text-[#52627A] ml-1">%</span>
                  </div>
                  <div className="text-[10px] text-[#52627A]">
                    {metrics.packetLossPct === 0 ? 'Zero drops' : 'Congestion drops'}
                  </div>
                </div>

                {/* Throughput */}
                <div className="p-3 bg-[#F7F9FC] border border-[#D9E2EE] rounded-xl space-y-1">
                  <div className="text-[11px] font-medium text-[#52627A]">Throughput</div>
                  <div className="text-xl font-extrabold font-mono text-[#17233B] tabular-nums">
                    {metrics.throughputMbps}
                    <span className="text-xs font-normal text-[#52627A] ml-1">Mbps</span>
                  </div>
                  <div className="text-[10px] text-[#52627A]">
                    Capacity: {wanCapacityMbps}M
                  </div>
                </div>

                {/* Queue Delay */}
                <div className="p-3 bg-[#F7F9FC] border border-[#D9E2EE] rounded-xl space-y-1">
                  <div className="text-[11px] font-medium text-[#52627A]">Queue Delay</div>
                  <div
                    className={`text-xl font-extrabold font-mono tabular-nums ${
                      metrics.queueDelayMs < 10 ? 'text-[#0F9D8A]' : 'text-[#D94F45]'
                    }`}
                  >
                    {metrics.queueDelayMs}
                    <span className="text-xs font-normal text-[#52627A] ml-1">ms</span>
                  </div>
                  <div className="text-[10px] text-[#52627A]">
                    {metrics.queueDelayMs < 10 ? 'AQM buffer bloat suppressed' : 'Modem queue bloated'}
                  </div>
                </div>

                {/* Jain's Fairness Index */}
                <div className="p-3 bg-[#F7F9FC] border border-[#D9E2EE] rounded-xl space-y-1">
                  <div className="text-[11px] font-medium text-[#52627A]">Jain&apos;s Fairness</div>
                  <div
                    className={`text-xl font-extrabold font-mono tabular-nums ${
                      metrics.jainFairnessIndex >= 0.70 ? 'text-[#0F9D8A]' : 'text-[#B86B00]'
                    }`}
                  >
                    {metrics.jainFairnessIndex.toFixed(2)}
                  </div>
                  <div className="text-[10px] text-[#52627A]">
                    {metrics.jainFairnessIndex >= 0.70 ? 'Fair sharing' : 'Starvation risk'}
                  </div>
                </div>

                {/* CPU Overhead */}
                <div className="p-3 bg-[#F7F9FC] border border-[#D9E2EE] rounded-xl space-y-1 col-span-2 sm:col-span-2">
                  <div className="text-[11px] font-medium text-[#52627A]">Estimated Router CPU</div>
                  <div className="text-xl font-extrabold font-mono text-[#17233B] tabular-nums">
                    {metrics.cpuOverheadPct}%
                    <span className="text-xs font-normal text-[#52627A] ml-2">
                      (Cortex-A53 1.2 GHz budget)
                    </span>
                  </div>
                  <div className="text-[10px] text-[#52627A]">
                    Negligible eBPF/netlink overhead
                  </div>
                </div>
              </div>
            </div>

            {/* Plain-Language Policy Explanation */}
            <div className="bg-white border border-[#D9E2EE] rounded-2xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#D9E2EE]">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#315CE8]" />
                  <h3 className="text-sm font-bold text-[#17233B]">
                    Dynamic Policy Explanation &amp; Rationale
                  </h3>
                </div>
                <span className="text-xs font-mono text-[#52627A]">
                  Actionable Decision Trace
                </span>
              </div>

              <div className="space-y-3 text-xs leading-relaxed">
                <div>
                  <span className="font-semibold text-[#17233B] block mb-1">
                    What PathQoS Decided:
                  </span>
                  <p className="text-[#52627A] bg-[#F7F9FC] p-3 rounded-xl border border-[#D9E2EE]">
                    {explanation.summary}
                  </p>
                </div>

                <div>
                  <span className="font-semibold text-[#17233B] block mb-1">
                    Physical Rationale:
                  </span>
                  <p className="text-[#52627A]">
                    {explanation.rationale}
                  </p>
                </div>

                <div>
                  <span className="font-semibold text-[#17233B] block mb-1">
                    Trade-off Accepted:
                  </span>
                  <p className="text-[#52627A]">
                    {explanation.tradeoff}
                  </p>
                </div>

                <div className="pt-2 border-t border-[#D9E2EE] font-mono text-[11px] text-[#315CE8]">
                  Enforcement: {explanation.actionTaken}
                </div>
              </div>
            </div>

            {/* Class Bandwidth Distribution & Jain Index */}
            <div className="bg-white border border-[#D9E2EE] rounded-2xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-[#17233B]">
                    Per-Class Bandwidth Allocation &amp; Latency
                  </h3>
                  <div className="text-[11px] text-[#52627A]">
                    CAKE 4-Tin isolation and queue delays
                  </div>
                </div>
                <div className="text-xs font-mono text-[#52627A]">
                  Jain Index: <strong>{metrics.jainFairnessIndex}</strong>
                </div>
              </div>

              <div className="space-y-3">
                {allocations.map((alloc) => (
                  <div key={alloc.classId} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-[#17233B]">
                        {alloc.className}
                      </span>
                      <div className="flex items-center gap-3 font-mono text-[11px] tabular-nums">
                        <span className="text-[#17233B] font-bold">
                          {alloc.bandwidthMbps} Mbps ({alloc.sharePct}%)
                        </span>
                        <span
                          className={`px-1.5 py-0.5 rounded ${
                            alloc.p95LatencyMs < 25
                              ? 'bg-[#E6F7F5] text-[#0A6C5F]'
                              : 'bg-[#FFF0EE] text-[#D94F45]'
                          }`}
                        >
                          {alloc.p95LatencyMs}ms p95
                        </span>
                      </div>
                    </div>

                    {/* Bandwidth share bar */}
                    <div className="w-full h-2 bg-[#EEF3F9] rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          alloc.status === 'healthy'
                            ? 'bg-[#315CE8]'
                            : alloc.status === 'constrained'
                            ? 'bg-[#B86B00]'
                            : 'bg-[#D94F45]'
                        }`}
                        style={{ width: `${Math.min(100, Math.max(5, alloc.sharePct))}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Expandable Disclosure: How this simulation works */}
            <div className="bg-white border border-[#D9E2EE] rounded-2xl overflow-hidden shadow-xs">
              <button
                type="button"
                onClick={() => setDisclosureOpen(!disclosureOpen)}
                className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-[#F7F9FC] transition-colors"
                aria-expanded={disclosureOpen}
              >
                <div className="flex items-center gap-2">
                  <Info className="w-4 h-4 text-[#315CE8]" />
                  <span className="text-xs font-bold text-[#17233B]">
                    How this simulation works: Mathematical assumptions &amp; limits
                  </span>
                </div>
                {disclosureOpen ? (
                  <ChevronUp className="w-4 h-4 text-[#52627A]" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-[#52627A]" />
                )}
              </button>

              {disclosureOpen && (
                <div className="px-6 pb-6 pt-2 text-xs text-[#52627A] space-y-3 border-t border-[#D9E2EE] leading-relaxed">
                  <p>
                    <strong>Traffic Modeling:</strong> The simulator uses deterministic queueing formulas derived from M/M/1/K buffer models, Kleinrock capacity laws, and empirical FQ-CoDel behavior from Linux kernel benchmarks.
                  </p>
                  <p>
                    <strong>Bufferbloat Equation:</strong> In unmanaged FIFO mode with TCP bulk saturating traffic, queue delay is modeled based on typical 1000-packet Ethernet MTU ring buffers where sender congestion windows inflate until tail-drop occurs (~160–280ms standing queue).
                  </p>
                  <p>
                    <strong>CAKE Tin Dynamics:</strong> In PathQoS mode, traffic is hashed into CAKE DiffServ4 tins (Voice, Video, Best Effort, Bulk) with a 92% bandwidth ceiling. When WAN drops to 20 Mbps, the capacity detector re-clamps the bandwidth parameter, preserving sub-15ms p95 latency.
                  </p>
                  <p>
                    <strong>Honesty Guardrail:</strong> This in-browser simulation runs purely on deterministic client-side mathematics to demonstrate PathQoS concepts. It does not measure your physical computer, intercept browser web requests, or replace real hardware test-harness validation.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
