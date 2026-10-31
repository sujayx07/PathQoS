'use client';

import {
  ShieldCheck,
  RotateCcw,
  Scale,
  Wifi,
  EyeOff,
  Cpu,
} from 'lucide-react';

export default function CoreStrengths() {
  const strengths = [
    {
      icon: EyeOff,
      title: 'Privacy-First Metadata Only',
      description:
        'Zero deep packet inspection (DPI) and zero payload snooping. Classifications rely strictly on packet timing variance, size entropy, and IP 5-tuples. User traffic remains 100% private and encrypted.',
    },
    {
      icon: Cpu,
      title: 'Confidence-Aware Fallback',
      description:
        'Heuristic models never guess blindly. If classifier confidence falls below 0.75, traffic immediately defaults to the standard Best Effort CAKE tin rather than applying speculative penalties.',
    },
    {
      icon: RotateCcw,
      title: 'Automated Safe Rollback',
      description:
        'Every policy is audited before and after application. If synthetic micro-probes detect increased jitter or bufferbloat, the previous kernel snapshot is restored in &lt; 5ms.',
    },
    {
      icon: Scale,
      title: 'Mathematical Fairness Safeguards',
      description:
        'Enforces an explicit Jain Fairness Index floor (≥ 0.70) across all local devices. Intent leases cannot monopolize the link or starve background updates into failure.',
    },
    {
      icon: Wifi,
      title: 'WAN vs. Wi-Fi Diagnosis',
      description:
        'Separates ISP modem queue congestion from 802.11 airtime starvation. Identifies when Wi-Fi interference is the true bottleneck rather than blaming WAN bandwidth.',
    },
    {
      icon: ShieldCheck,
      title: 'Temporary Intent Leases',
      description:
        'Replaces brittle permanent configuration menus with auto-expiring 15–45 minute quality agreements that vanish when the work call or game session finishes.',
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-[#FFFFFF] border-b border-[#D9E2EE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="max-w-3xl space-y-3">
          <div className="text-xs font-bold text-[#315CE8] uppercase tracking-wider">
            Engineered Differentiators
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#17233B] tracking-tight">
            Six architectural pillars that make PathQoS technically credible
          </h2>
          <p className="text-base text-[#52627A] leading-relaxed">
            Built for Linux router enthusiasts, network engineers, and privacy advocates who reject black-box marketing claims and brittle static configurations.
          </p>
        </div>

        {/* 6 Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {strengths.map((st, idx) => {
            const Icon = st.icon;
            return (
              <div
                key={idx}
                className="bg-[#F7F9FC] border border-[#D9E2EE] rounded-2xl p-6 space-y-3 hover:border-[#CBD5E1] transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-white border border-[#D9E2EE] flex items-center justify-center text-[#315CE8] shadow-xs">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-[#17233B]">
                  {st.title}
                </h3>
                <p className="text-xs text-[#52627A] leading-relaxed">
                  {st.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
