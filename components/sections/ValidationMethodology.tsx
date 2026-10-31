'use client';

import { FlaskConical, Terminal, CheckCircle2, Server, ExternalLink } from 'lucide-react';

export default function ValidationMethodology() {
  return (
    <section id="validation" className="py-16 md:py-24 bg-[#F7F9FC] border-b border-[#D9E2EE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="max-w-3xl space-y-3">
          <div className="text-xs font-bold text-[#315CE8] uppercase tracking-wider">
            Scientific Rigor
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#17233B] tracking-tight">
            Validation Methodology &amp; Reproducible Test Harness
          </h2>
          <p className="text-base text-[#52627A] leading-relaxed">
            Claims of latency suppression must be proven under saturating loads using industry-standard open benchmarking tools—not invented marketing charts.
          </p>
        </div>

        {/* 3 Benchmark Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-[#D9E2EE] rounded-2xl p-6 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-[#315CE8] uppercase">
              <FlaskConical className="w-4 h-4" />
              <span>Flent / Netperf RRUL</span>
            </div>
            <h3 className="text-base font-bold text-[#17233B]">
              Realtime Response Under Load
            </h3>
            <p className="text-xs text-[#52627A] leading-relaxed">
              Automated Flent test runners execute 4 simultaneous TCP upload and download streams while simultaneously measuring ICMP and UDP round-trip latency pacing at 100 Hz.
            </p>
            <div className="pt-2 font-mono text-[11px] text-[#52627A] border-t border-[#D9E2EE]">
              flent rrul -p all_scaled -l 60 -H gateway.local
            </div>
          </div>

          <div className="bg-white border border-[#D9E2EE] rounded-2xl p-6 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-[#0F9D8A] uppercase">
              <Server className="w-4 h-4" />
              <span>Linux Netem Namespace Emulation</span>
            </div>
            <h3 className="text-base font-bold text-[#17233B]">
              Dynamic Step-Function Drops
            </h3>
            <p className="text-xs text-[#52627A] leading-relaxed">
              Isolated Linux network namespaces simulate sudden physical link drops (100 Mbps → 20 Mbps with 50ms propagation delay) to measure PathQoS Kalman adaptation time.
            </p>
            <div className="pt-2 font-mono text-[11px] text-[#52627A] border-t border-[#D9E2EE]">
              tc qdisc add dev veth0 root netem delay 25ms rate 20Mbit
            </div>
          </div>

          <div className="bg-white border border-[#D9E2EE] rounded-2xl p-6 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-[#B86B00] uppercase">
              <Terminal className="w-4 h-4" />
              <span>Reference Target Hardware</span>
            </div>
            <h3 className="text-base font-bold text-[#17233B]">
              OpenWrt Embedded Silicon
            </h3>
            <p className="text-xs text-[#52627A] leading-relaxed">
              Evaluated on commodity OpenWrt routers (MediaTek MT7981 / ARM64 dual-core Cortex-A53 @ 1.3 GHz) to verify CPU footprint stays strictly below 3% under gigabit line rate.
            </p>
            <div className="pt-2 font-mono text-[11px] text-[#52627A] border-t border-[#D9E2EE]">
              OpenWrt 23.05 · Linux 5.15 · kmod-sched-cake
            </div>
          </div>
        </div>

        {/* Reproducibility Commitment */}
        <div className="p-6 bg-white border border-[#D9E2EE] rounded-2xl shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-[#17233B]">
            <CheckCircle2 className="w-4 h-4 text-[#0F9D8A]" />
            <span>Honesty &amp; Reproducibility Guardrail</span>
          </div>
          <p className="text-xs text-[#52627A] leading-relaxed">
            PathQoS never reports synthetic in-browser model figures as empirical hardware measurements. Every published metric in future release notes will link directly to reproducible Flent raw JSON log datasets and git commit hashes.
          </p>
        </div>
      </div>
    </section>
  );
}
