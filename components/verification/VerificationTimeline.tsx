'use client';

import { useState } from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  ShieldCheck,
  ChevronRight,
  Terminal,
  Activity,
  Layers,
} from 'lucide-react';
import { PolicyEvent, VerificationStage } from '../../lib/types';

interface VerificationTimelineProps {
  events: PolicyEvent[];
  onTriggerFault?: (forced: boolean) => void;
  isFaultForced?: boolean;
}

export default function VerificationTimeline({
  events,
  onTriggerFault,
  isFaultForced = false,
}: VerificationTimelineProps) {
  const [selectedEventIndex, setSelectedEventIndex] = useState<number>(events.length - 1);
  const activeEvent = events[selectedEventIndex] || events[events.length - 1];

  const getStageBadge = (stage: VerificationStage, outcome: PolicyEvent['outcome']) => {
    if (outcome === 'rollback') {
      return {
        bg: 'bg-[#FFF0EE]',
        text: 'text-[#D94F45]',
        border: 'border-[#D94F45]',
        icon: RotateCcw,
      };
    }
    if (outcome === 'warning') {
      return {
        bg: 'bg-[#FFF4D6]',
        text: 'text-[#B86B00]',
        border: 'border-[#B86B00]',
        icon: AlertTriangle,
      };
    }
    return {
      bg: 'bg-[#E6F7F5]',
      text: 'text-[#0A6C5F]',
      border: 'border-[#0F9D8A]',
      icon: CheckCircle2,
    };
  };

  return (
    <section className="py-16 bg-[#F7F9FC] border-b border-[#D9E2EE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#D9E2EE]">
          <div className="space-y-2">
            <div className="text-xs font-bold text-[#315CE8] uppercase tracking-wider">
              Closed-Loop Enforcement
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#17233B] tracking-tight">
              Policy Verification &amp; Safe Rollback Timeline
            </h2>
            <p className="text-sm text-[#52627A] max-w-2xl leading-relaxed">
              Standard routers apply QoS configurations and pray they work. PathQoS treats every policy as an experimental candidate: it snapshots, verifies real latency impact with micro-probes, and automatically rolls back if invariants fail.
            </p>
          </div>

          {/* Fault injection toggle to demonstrate watchdog rollback */}
          {onTriggerFault && (
            <div className="flex items-center gap-2 p-2 bg-white border border-[#D9E2EE] rounded-xl shadow-xs">
              <button
                type="button"
                onClick={() => onTriggerFault(!isFaultForced)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  isFaultForced
                    ? 'bg-[#FFF0EE] text-[#D94F45] border border-[#D94F45]/30'
                    : 'bg-[#EEF3F9] text-[#52627A] hover:text-[#17233B]'
                }`}
                aria-pressed={isFaultForced}
              >
                {isFaultForced ? 'Fault Active (Watchdog Reverting)' : 'Force Degraded Metric (Test Watchdog)'}
              </button>
            </div>
          )}
        </div>

        {/* Timeline Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: 5 Stages Timeline Steps */}
          <div className="lg:col-span-5 space-y-3">
            <div className="text-xs font-bold text-[#52627A] uppercase tracking-wider mb-2">
              The 5-Stage Control Cycle
            </div>

            {events.map((ev, idx) => {
              const isSelected = selectedEventIndex === idx;
              const badge = getStageBadge(ev.stage, ev.outcome);
              const Icon = badge.icon;

              return (
                <button
                  key={`${ev.stage}-${idx}`}
                  type="button"
                  onClick={() => setSelectedEventIndex(idx)}
                  className={`w-full text-left p-4 rounded-xl border transition-all flex items-start gap-3.5 ${
                    isSelected
                      ? 'bg-white border-[#315CE8] shadow-sm ring-1 ring-[#315CE8]'
                      : 'bg-white border-[#D9E2EE] hover:bg-[#EEF3F9] hover:border-[#CBD5E1]'
                  }`}
                  aria-pressed={isSelected}
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${badge.bg} ${badge.text}`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>

                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-[#17233B]">
                        {idx + 1}. {ev.title}
                      </span>
                      <span className="font-mono text-[10px] text-[#52627A]">
                        +{ev.timestampMs}ms
                      </span>
                    </div>
                    <p className="text-[11px] text-[#52627A] line-clamp-1 leading-normal">
                      {ev.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Column: Deep Event Inspector */}
          <div className="lg:col-span-7 bg-white border border-[#D9E2EE] rounded-2xl p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-[#D9E2EE]">
              <div className="flex items-center gap-2">
                <Terminal className="w-5 h-5 text-[#315CE8]" />
                <h3 className="text-sm font-bold text-[#17233B]">
                  Stage Inspector: {activeEvent.title}
                </h3>
              </div>
              <span
                className={`text-xs font-semibold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                  activeEvent.outcome === 'rollback'
                    ? 'bg-[#FFF0EE] text-[#D94F45]'
                    : activeEvent.outcome === 'warning'
                    ? 'bg-[#FFF4D6] text-[#8A5000]'
                    : 'bg-[#E6F7F5] text-[#0A6C5F]'
                }`}
              >
                {activeEvent.stage}
              </span>
            </div>

            {/* Description */}
            <div className="space-y-1">
              <span className="text-xs font-semibold text-[#17233B]">Summary &amp; Context:</span>
              <p className="text-xs text-[#52627A] leading-relaxed">
                {activeEvent.description}
              </p>
            </div>

            {/* Netlink Kernel Diff */}
            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-[#17233B]">
                Linux Kernel Netlink / Policy Diff:
              </span>
              <pre className="p-3 bg-[#17233B] text-[#EEF3F9] rounded-xl font-mono text-xs overflow-x-auto leading-relaxed border border-[#315CE8]/30">
                <code>{activeEvent.policyDiff}</code>
              </pre>
            </div>

            {/* Metrics Verified */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-3 bg-[#F7F9FC] border border-[#D9E2EE] rounded-xl space-y-1 text-xs">
                <span className="text-[#52627A] block font-medium">Metric Monitored:</span>
                <strong className="text-[#17233B] font-mono">{activeEvent.metricChecked}</strong>
              </div>

              <div className="p-3 bg-[#F7F9FC] border border-[#D9E2EE] rounded-xl space-y-1 text-xs">
                <span className="text-[#52627A] block font-medium">Measured Delta:</span>
                <strong
                  className={`font-mono ${
                    activeEvent.outcome === 'rollback'
                      ? 'text-[#D94F45]'
                      : 'text-[#0F9D8A]'
                  }`}
                >
                  {activeEvent.measuredDelta}
                </strong>
              </div>
            </div>

            {/* Rollback rule explanation */}
            <div className="p-3 bg-[#EEF3F9] rounded-xl text-xs text-[#52627A] space-y-1 border border-[#D9E2EE]">
              <strong className="text-[#17233B]">Documented Invariant Rule:</strong>
              <p>
                If p95 latency exceeds 50ms or packet loss on critical interactive classes exceeds 0.2% during the 500ms post-apply verification window, the Linux tc qdisc transaction is instantly aborted and atomic netlink revert executes in &lt; 5ms.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
