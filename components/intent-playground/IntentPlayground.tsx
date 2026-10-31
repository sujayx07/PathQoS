'use client';

import { useState } from 'react';
import {
  Clock,
  Plus,
  Trash2,
  AlertCircle,
  CheckCircle2,
  Shield,
  Laptop,
  Gamepad2,
  Tv,
  HelpCircle,
  Zap,
} from 'lucide-react';
import { IntentLease, LeaseGoalPreset } from '../../lib/types';

interface IntentPlaygroundProps {
  leases: IntentLease[];
  onCreateLease: (lease: Omit<IntentLease, 'id' | 'createdAt' | 'remainingSeconds'>) => void;
  onCancelLease: (id: string) => void;
  onSimulateExpire: (id: string) => void;
}

export default function IntentPlayground({
  leases,
  onCreateLease,
  onCancelLease,
  onSimulateExpire,
}: IntentPlaygroundProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<LeaseGoalPreset>('work-call');
  const [durationMinutes, setDurationMinutes] = useState<number>(30);
  const [targetDevice, setTargetDevice] = useState<string>('MacBook Pro (02:44:89:af)');
  const [targetClass, setTargetClass] = useState<string>('WebRTC Audio/Video');

  const presetConfigs: Record<
    LeaseGoalPreset,
    {
      name: string;
      targetMetric: string;
      targetValue: string;
      rationale: string;
      deviceDefault: string;
      classDefault: string;
    }
  > = {
    'work-call': {
      name: 'Protect Work Call',
      targetMetric: 'p95 Latency & Jitter',
      targetValue: '< 20ms p95 · < 5ms Jitter',
      rationale:
        'Prioritizes outbound WebRTC audio/video packets into CAKE Voice tin; guarantees minimum 2.5 Mbps allocation during saturating uploads.',
      deviceDefault: 'MacBook Pro (02:44:89:af)',
      classDefault: 'WebRTC Audio/Video',
    },
    gaming: {
      name: 'Ultra-Low Gaming Latency',
      targetMetric: 'UDP Queue Time & Packet Drop',
      targetValue: '< 15ms Latency · 0.0% Drop',
      rationale:
        'Places 128Hz UDP packet streams at the head of line; bounds queue buffer to zero to avoid frame desync.',
      deviceDefault: 'Desktop Rig (b4:96:91:2c)',
      classDefault: 'UDP Port Range 27015-27050',
    },
    streaming: {
      name: 'Stable 4K Video Stream',
      targetMetric: 'Sustained Bitrate Floor',
      targetValue: '≥ 25.0 Mbps Continuous',
      rationale:
        'Allocates guaranteed 25 Mbps floor in Video tin, allowing adaptive bitrate players to maintain 2160p HDR without rebuffering.',
      deviceDefault: 'Living Room OLED (48:e2:44:11)',
      classDefault: 'HTTP Live Streaming (HLS/DASH)',
    },
    custom: {
      name: 'Custom Bounded Lease',
      targetMetric: 'Configurable Target Metric',
      targetValue: '< 30ms Latency · 10 Mbps Floor',
      rationale:
        'User-defined temporary quality invariant with deterministic reservation and automatic expiration.',
      deviceDefault: 'Primary Workstation',
      classDefault: 'Direct Application Port',
    },
  };

  const handlePresetSelect = (preset: LeaseGoalPreset) => {
    setSelectedPreset(preset);
    setTargetDevice(presetConfigs[preset].deviceDefault);
    setTargetClass(presetConfigs[preset].classDefault);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const config = presetConfigs[selectedPreset];
    onCreateLease({
      name: config.name,
      preset: selectedPreset,
      targetDevice,
      targetClass,
      targetMetric: config.targetMetric,
      targetValue: config.targetValue,
      durationMinutes,
      rationale: config.rationale,
      state: 'meeting-goal',
    });
    setIsFormOpen(false);
  };

  return (
    <section className="py-16 bg-[#FFFFFF] border-b border-[#D9E2EE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#D9E2EE]">
          <div className="space-y-2">
            <div className="text-xs font-bold text-[#315CE8] uppercase tracking-wider">
              Dynamic Quality Agreements
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#17233B] tracking-tight">
              Intent Lease Playground
            </h2>
            <p className="text-sm text-[#52627A] max-w-2xl leading-relaxed">
              Instead of permanent, complicated QoS rules that break when network conditions change, PathQoS issues temporary, bounded <strong>Intent Leases</strong> that expire automatically.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsFormOpen(!isFormOpen)}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-[#315CE8] hover:bg-[#244ED8] rounded-xl transition-all shadow-xs shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Request New Intent Lease</span>
          </button>
        </div>

        {/* Modal / Inline Form for Requesting Lease */}
        {isFormOpen && (
          <form
            onSubmit={handleCreateSubmit}
            className="bg-[#F7F9FC] border-2 border-[#315CE8]/40 rounded-2xl p-6 shadow-sm space-y-6"
          >
            <div className="flex items-center justify-between pb-4 border-b border-[#D9E2EE]">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-[#315CE8]" />
                <h3 className="text-sm font-bold text-[#17233B]">
                  Issue Temporary Application Intent Lease
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="text-xs text-[#52627A] hover:text-[#17233B]"
              >
                Cancel
              </button>
            </div>

            {/* Presets Grid */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-[#17233B] block">
                Select Quality Goal Preset:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {(['work-call', 'gaming', 'streaming', 'custom'] as LeaseGoalPreset[]).map(
                  (preset) => {
                    const conf = presetConfigs[preset];
                    const active = selectedPreset === preset;
                    return (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => handlePresetSelect(preset)}
                        className={`text-left p-3.5 rounded-xl border text-xs space-y-1.5 transition-all ${
                          active
                            ? 'bg-white border-[#315CE8] ring-1 ring-[#315CE8] shadow-xs'
                            : 'bg-white border-[#D9E2EE] hover:border-[#CBD5E1]'
                        }`}
                      >
                        <div className="font-bold text-[#17233B]">{conf.name}</div>
                        <div className="text-[11px] text-[#52627A]">{conf.targetValue}</div>
                      </button>
                    );
                  }
                )}
              </div>
            </div>

            {/* Form Fields: Duration, Device, Class */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#17233B] block">
                  Duration (Auto-Expires):
                </label>
                <select
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs bg-white border border-[#D9E2EE] rounded-xl text-[#17233B] focus:ring-2 focus:ring-[#315CE8]"
                >
                  <option value={15}>15 Minutes</option>
                  <option value={30}>30 Minutes</option>
                  <option value={45}>45 Minutes</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#17233B] block">
                  Target Device Scope:
                </label>
                <input
                  type="text"
                  value={targetDevice}
                  onChange={(e) => setTargetDevice(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-[#D9E2EE] rounded-xl text-[#17233B] focus:ring-2 focus:ring-[#315CE8]"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#17233B] block">
                  Class / Traffic Identifier:
                </label>
                <input
                  type="text"
                  value={targetClass}
                  onChange={(e) => setTargetClass(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-[#D9E2EE] rounded-xl text-[#17233B] focus:ring-2 focus:ring-[#315CE8]"
                  required
                />
              </div>
            </div>

            {/* Lease Rationale Preview */}
            <div className="p-3 bg-white rounded-xl border border-[#D9E2EE] text-xs space-y-1">
              <div className="font-semibold text-[#17233B]">Automated Policy Rationale:</div>
              <p className="text-[#52627A] leading-relaxed">
                {presetConfigs[selectedPreset].rationale}
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-[#52627A] bg-white border border-[#D9E2EE] rounded-xl hover:bg-[#EEF3F9]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-semibold text-white bg-[#315CE8] hover:bg-[#244ED8] rounded-xl shadow-xs"
              >
                Confirm &amp; Provision Lease
              </button>
            </div>
          </form>
        )}

        {/* Active Leases Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-[#52627A] uppercase tracking-wider">
              Active Registered Intent Leases ({leases.length})
            </span>
            <span className="text-[11px] text-[#52627A]">
              Self-terminating; bounds verified in kernel qdisc
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {leases.map((lease) => {
              const isMeetingGoal = lease.state === 'meeting-goal';
              const isConstrained = lease.state === 'constrained';
              const isExpired = lease.state === 'expired';

              return (
                <div
                  key={lease.id}
                  className={`bg-white border rounded-2xl p-5 shadow-xs space-y-4 flex flex-col justify-between transition-all ${
                    isMeetingGoal
                      ? 'border-[#0F9D8A]/40'
                      : isConstrained
                      ? 'border-[#B86B00]/40'
                      : 'border-[#D9E2EE] opacity-60'
                  }`}
                >
                  <div className="space-y-3">
                    {/* Header row */}
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-[#17233B]">
                        {lease.name}
                      </span>
                      <span
                        className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                          isMeetingGoal
                            ? 'bg-[#E6F7F5] text-[#0A6C5F]'
                            : isConstrained
                            ? 'bg-[#FFF4D6] text-[#8A5000]'
                            : 'bg-[#EEF3F9] text-[#52627A]'
                        }`}
                      >
                        {isMeetingGoal
                          ? 'Meeting Goal'
                          : isConstrained
                          ? 'Constrained'
                          : 'Expired'}
                      </span>
                    </div>

                    {/* Target and device metadata */}
                    <div className="space-y-1.5 text-xs">
                      <div className="flex items-center justify-between text-[#52627A]">
                        <span>Scope:</span>
                        <strong className="text-[#17233B] font-medium truncate max-w-[180px]">
                          {lease.targetDevice}
                        </strong>
                      </div>
                      <div className="flex items-center justify-between text-[#52627A]">
                        <span>Class:</span>
                        <span className="font-medium text-[#17233B] truncate max-w-[180px]">
                          {lease.targetClass}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[#52627A]">
                        <span>Target:</span>
                        <span className="font-mono text-[#315CE8] font-semibold">
                          {lease.targetValue}
                        </span>
                      </div>
                    </div>

                    {/* Rationale snippet */}
                    <p className="text-[11px] text-[#52627A] leading-relaxed bg-[#F7F9FC] p-2.5 rounded-xl border border-[#D9E2EE]">
                      {lease.rationale}
                    </p>
                  </div>

                  {/* Footer & Actions */}
                  <div className="space-y-3 pt-3 border-t border-[#D9E2EE]">
                    <div className="flex items-center justify-between text-xs text-[#52627A]">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-[#52627A]" />
                        <span>
                          {isExpired
                            ? 'Lease Expired'
                            : `${Math.round(lease.remainingSeconds / 60)} min remaining`}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono">ID: {lease.id}</span>
                    </div>

                    {!isExpired && (
                      <div className="flex items-center justify-between gap-2">
                        <button
                          type="button"
                          onClick={() => onSimulateExpire(lease.id)}
                          className="px-2.5 py-1 text-[11px] font-medium text-[#52627A] hover:text-[#17233B] hover:bg-[#EEF3F9] rounded-lg transition-colors"
                        >
                          Simulate Expiry
                        </button>
                        <button
                          type="button"
                          onClick={() => onCancelLease(lease.id)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-[#D94F45] hover:bg-[#FFF0EE] rounded-lg transition-colors"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Cancel Lease</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
