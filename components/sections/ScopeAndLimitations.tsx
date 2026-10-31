'use client';

import { AlertCircle, ShieldAlert, Wifi, Cpu, FileQuestion } from 'lucide-react';

export default function ScopeAndLimitations() {
  return (
    <section id="limitations" className="py-16 md:py-24 bg-[#FFFFFF] border-b border-[#D9E2EE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="max-w-3xl space-y-3">
          <div className="text-xs font-bold text-[#52627A] uppercase tracking-wider">
            Scope &amp; Transparency
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#17233B] tracking-tight">
            Explicit Boundaries &amp; Engineering Limitations
          </h2>
          <p className="text-base text-[#52627A] leading-relaxed">
            Real network engineering requires stating what a system cannot do. Here are the explicit assumptions, hardware dependencies, and scope limits of the current PathQoS specification.
          </p>
        </div>

        {/* 4 Boundary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#F7F9FC] border border-[#D9E2EE] rounded-2xl p-6 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-[#17233B]">
              <Wifi className="w-4 h-4 text-[#B86B00]" />
              <span>Wi-Fi Airtime Contention Dependency</span>
            </div>
            <p className="text-xs text-[#52627A] leading-relaxed">
              WAN queue shaping operates on Linux network interface queues (eth0, ifb0). It cannot prevent radio packet collisions on an overcrowded 2.4 GHz channel without compatible OpenWrt wireless drivers (mac80211) exporting station airtime telemetry. When AP telemetry is absent, PathQoS flags Wi-Fi radio stats as unobserved rather than inventing estimates.
            </p>
          </div>

          <div className="bg-[#F7F9FC] border border-[#D9E2EE] rounded-2xl p-6 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-[#17233B]">
              <FileQuestion className="w-4 h-4 text-[#315CE8]" />
              <span>Browser Simulation vs. Real Hardware</span>
            </div>
            <p className="text-xs text-[#52627A] leading-relaxed">
              The interactive lab on this page is an illustrative, deterministic client-side simulation. It uses real queueing formulas (M/M/1/K and CoDel target dynamics) to demonstrate behavior, but it does not tap into your local Wi-Fi, run packet captures, or transmit router commands from your browser.
            </p>
          </div>

          <div className="bg-[#F7F9FC] border border-[#D9E2EE] rounded-2xl p-6 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-[#17233B]">
              <Cpu className="w-4 h-4 text-[#0F9D8A]" />
              <span>Kernel Prerequisites</span>
            </div>
            <p className="text-xs text-[#52627A] leading-relaxed">
              PathQoS relies on the Linux CAKE queueing discipline (RFC 8290) and the Intermediate Functional Block (IFB) kernel module. It requires Linux kernel 4.19 or higher and root netlink capabilities. It does not run on locked-down proprietary ISP gateway firmware that lacks shell access.
            </p>
          </div>

          <div className="bg-[#F7F9FC] border border-[#D9E2EE] rounded-2xl p-6 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-[#17233B]">
              <ShieldAlert className="w-4 h-4 text-[#64748B]" />
              <span>No Cloud Control Plane or Telemetry</span>
            </div>
            <p className="text-xs text-[#52627A] leading-relaxed">
              All decisions, Kalman filters, and intent leases execute 100% locally on the router CPU. PathQoS requires zero external cloud accounts, zero centralized servers, and sends zero telemetry packets off your network.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
