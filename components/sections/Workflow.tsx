'use client';

import { useState } from 'react';
import { Eye, Brain, Zap, ShieldCheck, ChevronDown, ChevronUp } from 'lucide-react';

export default function Workflow() {
  const [expandedStep, setExpandedStep] = useState<number | null>(0);

  const steps = [
    {
      number: '01',
      title: 'Observe',
      icon: Eye,
      summary: 'Passively captures packet timing and TCP round-trip dispersion without payload inspection.',
      details:
        'Uses an eBPF ingress hook on the WAN interface to monitor packet inter-arrival jitter, TCP window growth, and RTT min-tracking. Absolutely zero packet payloads are copied or inspected. If an encrypted stream uses TLS 1.3 or WebRTC, only packet length entropy and cadence are evaluated.',
      techNote: 'eBPF / XDP metadata probe · 0 errno failure bypass · Zero GDPR telemetry risk',
    },
    {
      number: '02',
      title: 'Decide',
      icon: Brain,
      summary: 'Balances live user intent leases against bounded mathematical fairness constraints.',
      details:
        'When a user requests a 30-minute "Protect Work Call" lease, the solver checks whether remaining bandwidth headroom can accommodate the lease without starving other local devices. If total link capacity drops to 20 Mbps, background bulk transfers are throttled first to preserve voice pacing while maintaining a strict Jain Fairness Index ≥ 0.70.',
      techNote: 'Deterministic optimization solver · Jain Fairness Index constraint floor ≥ 0.70',
    },
    {
      number: '03',
      title: 'Enforce',
      icon: Zap,
      summary: 'Applies Linux tc CAKE qdisc rate bounds and 4-tin DiffServ packet priority.',
      details:
        'Translates policy decisions into an atomic netlink command updating the CAKE rate shaper on the Intermediate Functional Block (IFB). Bandwidth is locked to 92–95% of estimated capacity to keep the bottleneck queue inside router RAM, allowing CoDel AQM to drop or ECN-mark packets before modem buffers fill up.',
      techNote: 'Linux tc-cake (RFC 8290) · IFB egress redirection · Netlink atomic replace',
    },
    {
      number: '04',
      title: 'Verify',
      icon: ShieldCheck,
      summary: 'Measures live latency delta; automatically rolls back if invariants or connectivity degrade.',
      details:
        'The watchdog probe fires high-frequency micro-probes toward the upstream ISP gateway. If measured p95 latency improves as predicted, the policy is locked for the duration of the lease. If latency spikes by > 15% or packet loss on critical flows occurs, the watchdog executes an instant 3ms atomic revert to the previous snapshot.',
      techNote: 'Automated 500ms watchdog probe · 3ms atomic revert · Invariant audit ledger',
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-[#F7F9FC] border-b border-[#D9E2EE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="max-w-3xl space-y-3">
          <div className="text-xs font-bold text-[#315CE8] uppercase tracking-wider">
            Closed-Loop Methodology
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#17233B] tracking-tight">
            How PathQoS works: Observe → Decide → Enforce → Verify
          </h2>
          <p className="text-base text-[#52627A] leading-relaxed">
            Every decision runs through a 4-step continuous control loop designed to prevent configuration rot and guarantee measurable quality improvements.
          </p>
        </div>

        {/* 4 Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((st, idx) => {
            const Icon = st.icon;
            const isExpanded = expandedStep === idx;

            return (
              <div
                key={st.number}
                className="bg-white border border-[#D9E2EE] rounded-2xl p-6 shadow-xs space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-sm font-bold text-[#315CE8]">
                      {st.number}
                    </span>
                    <div className="p-2 bg-[#EEF3F9] text-[#315CE8] rounded-xl">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-[#17233B]">
                    {st.title}
                  </h3>

                  <p className="text-xs text-[#52627A] leading-relaxed">
                    {st.summary}
                  </p>

                  {isExpanded && (
                    <div className="pt-3 border-t border-[#D9E2EE] space-y-3 text-xs text-[#52627A] leading-relaxed animate-in fade-in duration-200">
                      <p>{st.details}</p>
                      <div className="p-2 bg-[#F7F9FC] rounded-lg border border-[#D9E2EE] font-mono text-[11px] text-[#315CE8]">
                        {st.techNote}
                      </div>
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => setExpandedStep(isExpanded ? null : idx)}
                  className="pt-2 text-xs font-semibold text-[#315CE8] hover:text-[#244ED8] flex items-center justify-between transition-colors border-t border-[#D9E2EE]/60"
                  aria-expanded={isExpanded}
                >
                  <span>{isExpanded ? 'Hide Technical Details' : 'Deep-Dive Mechanics'}</span>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
