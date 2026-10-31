'use client';

import { AlertTriangle, CheckCircle2, XCircle, Wifi, Server, ArrowDownUp } from 'lucide-react';

export default function ProblemVisualizer() {
  return (
    <section id="how-it-works" className="py-16 md:py-24 bg-[#FFFFFF] border-b border-[#D9E2EE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="max-w-3xl space-y-4">
          <div className="text-xs font-bold text-[#315CE8] uppercase tracking-wider">
            Root-Cause Disambiguation
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#17233B] tracking-tight">
            Why legacy QoS fails: Confusing WAN bufferbloat with Wi-Fi airtime starvation
          </h2>
          <p className="text-base text-[#52627A] leading-relaxed">
            Most routers treat all lag as an unprioritized packet problem. In reality, lag stems from two completely different physics domains that require distinct diagnostic and enforcement paths.
          </p>
        </div>

        {/* Two-Column Root Cause Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Card 1: WAN Bufferbloat */}
          <div className="bg-[#F7F9FC] border border-[#D9E2EE] rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#D9E2EE]">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-[#315CE8]/10 text-[#315CE8] rounded-lg">
                  <Server className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-[#17233B]">
                  Domain 1: WAN Queue Congestion (Bufferbloat)
                </h3>
              </div>
              <span className="text-[11px] font-semibold text-[#0F9D8A] bg-[#E6F7F5] px-2 py-0.5 rounded">
                Solvable at Router
              </span>
            </div>

            <p className="text-sm text-[#52627A] leading-relaxed">
              When a device begins an ISO download or cloud backup, TCP Cubic expands its congestion window to fill available bandwidth. Upstream cable and fiber modems contain multi-megabyte unmanaged buffers that store hundreds of packets before dropping, blowing latency from 15ms up to 300ms+.
            </p>

            <div className="space-y-2 text-xs">
              <div className="flex items-start gap-2 text-[#17233B]">
                <CheckCircle2 className="w-4 h-4 text-[#0F9D8A] shrink-0 mt-0.5" />
                <span>
                  <strong>PathQoS Mechanism:</strong> Employs Linux CAKE/FQ-CoDel on an Intermediate Functional Block (IFB) device to hold the queue bottleneck inside router RAM, dropping or ECN-marking TCP packets before the modem buffer inflates.
                </span>
              </div>
              <div className="flex items-start gap-2 text-[#17233B]">
                <CheckCircle2 className="w-4 h-4 text-[#0F9D8A] shrink-0 mt-0.5" />
                <span>
                  <strong>Dynamic Adaptation:</strong> Unlike static shapers configured once at install time, PathQoS continuously estimates live line rate and clamps bandwidth to 92–95% of real throughput.
                </span>
              </div>
            </div>
          </div>

          {/* Card 2: Wi-Fi Airtime Contention */}
          <div className="bg-[#F7F9FC] border border-[#D9E2EE] rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#D9E2EE]">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-[#B86B00]/10 text-[#B86B00] rounded-lg">
                  <Wifi className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-[#17233B]">
                  Domain 2: 802.11 Wi-Fi Airtime Contention
                </h3>
              </div>
              <span className="text-[11px] font-semibold text-[#B86B00] bg-[#FFF4D6] px-2 py-0.5 rounded">
                Requires AP Telemetry
              </span>
            </div>

            <p className="text-sm text-[#52627A] leading-relaxed">
              In dense residential environments, wireless degradation is driven by half-duplex radio channel occupancy, neighbor co-channel interference, and packet collisions. WAN rate shaping alone physically cannot fix wireless packet collisions happening in the air.
            </p>

            <div className="space-y-2 text-xs">
              <div className="flex items-start gap-2 text-[#17233B]">
                <CheckCircle2 className="w-4 h-4 text-[#0F9D8A] shrink-0 mt-0.5" />
                <span>
                  <strong>Transparent Diagnosis:</strong> When telemetry from compatible Wi-Fi access points is present, PathQoS separates WAN queue delay from wireless retries and channel airtime utilization.
                </span>
              </div>
              <div className="flex items-start gap-2 text-[#52627A]">
                <XCircle className="w-4 h-4 text-[#D94F45] shrink-0 mt-0.5" />
                <span>
                  <strong>Engineering Boundary:</strong> PathQoS does not claim universal wireless airtime miracles. If AP telemetry is unavailable, it reports radio stats as unobserved rather than guessing.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Comparison Table / Matrix */}
        <div className="bg-white border border-[#D9E2EE] rounded-2xl overflow-hidden shadow-xs">
          <div className="px-6 py-4 bg-[#EEF3F9] border-b border-[#D9E2EE]">
            <h3 className="text-sm font-bold text-[#17233B]">
              QoS Architecture Comparison: Static vs. Intent-Aware Closed-Loop
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F7F9FC] text-[#52627A] border-b border-[#D9E2EE]">
                <tr>
                  <th className="py-3 px-4 font-semibold">Capability</th>
                  <th className="py-3 px-4 font-semibold">Unmanaged (Default FIFO)</th>
                  <th className="py-3 px-4 font-semibold">Deterministic Static CAKE</th>
                  <th className="py-3 px-4 font-semibold text-[#315CE8]">PathQoS Proposed Architecture</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D9E2EE] text-[#17233B]">
                <tr>
                  <td className="py-3 px-4 font-medium">Flow Isolation</td>
                  <td className="py-3 px-4 text-[#D94F45]">None (Tail-drop FIFO)</td>
                  <td className="py-3 px-4 text-[#0F9D8A]">FQ-CoDel 8-way Hash Tins</td>
                  <td className="py-3 px-4 text-[#0F9D8A]">DiffServ4 CAKE + Flow Isolation</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium">Capacity Fluctuations</td>
                  <td className="py-3 px-4 text-[#52627A]">Uncontrolled</td>
                  <td className="py-3 px-4 text-[#D94F45]">Static (Overflows when WAN drops)</td>
                  <td className="py-3 px-4 text-[#0F9D8A]">Passive Kalman RTT Tracking &amp; Clamping</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium">Application Awareness</td>
                  <td className="py-3 px-4 text-[#52627A]">None</td>
                  <td className="py-3 px-4 text-[#52627A]">Fixed DiffServ Markings only</td>
                  <td className="py-3 px-4 text-[#0F9D8A]">Statistical Entropy + Temporary Intent Leases</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium">Verification &amp; Rollback</td>
                  <td className="py-3 px-4 text-[#52627A]">None</td>
                  <td className="py-3 px-4 text-[#52627A]">None (Blindly assumes config works)</td>
                  <td className="py-3 px-4 text-[#0F9D8A]">Active Probe Loop &amp; Atomic Rollback Watchdog</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium">Privacy Guarantees</td>
                  <td className="py-3 px-4 text-[#52627A]">N/A</td>
                  <td className="py-3 px-4 text-[#0F9D8A]">Metadata header only</td>
                  <td className="py-3 px-4 text-[#0F9D8A]">Zero payload inspection (IP tuple + timing only)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
