'use client';

import { useState } from 'react';
import { ArrowRight, ShieldCheck, Activity, Cpu, RefreshCw, Zap, Server, Wifi, Laptop, Gamepad2, Tv, HardDrive } from 'lucide-react';

export default function Hero() {
  const [heroMode, setHeroMode] = useState<'fifo' | 'pathqos'>('pathqos');

  return (
    <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28 border-b border-[#D9E2EE]">
      {/* Background subtle grid pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.35]"
        style={{
          backgroundImage:
            'radial-gradient(#D9E2EE 1px, transparent 1px), radial-gradient(#D9E2EE 1px, #F7F9FC 1px)',
          backgroundSize: '32px 32px',
          backgroundPosition: '0 0, 16px 16px',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Proposition and Copy */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#315CE8] tracking-wide">
              <span>RESEARCH PROTOTYPE</span>
              <span aria-hidden="true" className="text-[#D9E2EE]">·</span>
              <span className="text-[#52627A]">LINUX TC &amp; CAKE / FQ-CODEL</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#17233B] leading-[1.15]" style={{ textWrap: 'balance' }}>
              Your network should protect the experience, not just prioritize packets.
            </h1>

            <p className="text-base sm:text-lg text-[#52627A] leading-relaxed max-w-xl">
              PathQoS observes traffic metadata without payload snooping, adapts dynamically to fluctuating WAN link capacity, and commits a policy only when measured latency justifies it.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <a
                href="#lab"
                className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-[#315CE8] rounded-xl hover:bg-[#244ED8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#244ED8] focus-visible:ring-offset-2 transition-all shadow-sm hover:shadow"
              >
                <span>Launch Interactive Lab</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href="#architecture"
                className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold text-[#17233B] bg-white border border-[#D9E2EE] rounded-xl hover:bg-[#EEF3F9] hover:border-[#CBD5E1] transition-colors shadow-xs"
              >
                <span>Explore Architecture</span>
              </a>

              <a
                href="/pathqos-project.zip"
                download="pathqos-project.zip"
                className="inline-flex items-center gap-2 px-4 py-3 text-sm font-semibold text-[#315CE8] bg-[#EEF3F9] hover:bg-[#E2E8F0] rounded-xl transition-colors border border-[#315CE8]/20"
                title="Download full project source code as ZIP"
              >
                <span>Download .ZIP</span>
              </a>
            </div>

            {/* Micro proof tagline */}
            <div className="pt-4 border-t border-[#D9E2EE]/80 flex items-center gap-3 text-xs text-[#52627A]">
              <span className="font-semibold text-[#17233B]">The Core Difference:</span>
              <span>Others blindly configure QoS. PathQoS measures what changed—and safely rolls back if invariants fail.</span>
            </div>
          </div>

          {/* Right Column: Hero Network Topology Visualizer */}
          <div className="lg:col-span-6">
            <div className="bg-white border border-[#D9E2EE] rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#D9E2EE] gap-3">
                <div>
                  <div className="text-xs font-bold text-[#17233B] uppercase tracking-wider">
                    Interactive Topology Visualizer
                  </div>
                  <div className="text-[11px] text-[#52627A]">
                    Compare queue behavior under active 90 Mbps bulk saturation
                  </div>
                </div>

                {/* Mode toggle */}
                <div className="flex items-center p-1 bg-[#EEF3F9] rounded-lg self-start sm:self-auto shrink-0">
                  <button
                    type="button"
                    onClick={() => setHeroMode('fifo')}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                      heroMode === 'fifo'
                        ? 'bg-white text-[#D94F45] shadow-xs'
                        : 'text-[#52627A] hover:text-[#17233B]'
                    }`}
                  >
                    Unmanaged FIFO
                  </button>
                  <button
                    type="button"
                    onClick={() => setHeroMode('pathqos')}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                      heroMode === 'pathqos'
                        ? 'bg-[#315CE8] text-white shadow-xs'
                        : 'text-[#52627A] hover:text-[#17233B]'
                    }`}
                  >
                    PathQoS Adaptive
                  </button>
                </div>
              </div>

              {/* Topology Canvas */}
              <div className="relative bg-[#F7F9FC] border border-[#D9E2EE] rounded-xl p-4 space-y-4">
                {/* Status banner */}
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        heroMode === 'pathqos' ? 'bg-[#0F9D8A]' : 'bg-[#D94F45]'
                      }`}
                    />
                    <span className="font-medium text-[#17233B]">
                      {heroMode === 'pathqos'
                        ? 'Active AQM: CAKE shaper isolating flows into fair diffserv tins'
                        : 'Bufferbloat: 1000-pkt FIFO buffer saturated by bulk TCP window'}
                    </span>
                  </div>
                  <div className="font-mono text-[11px] text-[#52627A] tabular-nums">
                    {heroMode === 'pathqos' ? 'p95: 12ms · Jitter: 2ms' : 'p95: 194ms · Jitter: 48ms'}
                  </div>
                </div>

                {/* Network nodes grid */}
                <div className="flex flex-col sm:grid sm:grid-cols-12 gap-3 items-stretch sm:items-center py-2">
                  {/* Clients Column */}
                  <div className="sm:col-span-4 space-y-2">
                    <div className="flex items-center justify-between p-2 bg-white border border-[#D9E2EE] rounded-lg text-xs">
                      <div className="flex items-center gap-1.5 text-[#17233B]">
                        <Laptop className="w-3.5 h-3.5 text-[#315CE8]" />
                        <span className="font-medium truncate">Work Call</span>
                      </div>
                      <span className="text-[10px] font-mono text-[#52627A]">2.4 Mbps</span>
                    </div>

                    <div className="flex items-center justify-between p-2 bg-white border border-[#D9E2EE] rounded-lg text-xs">
                      <div className="flex items-center gap-1.5 text-[#17233B]">
                        <Gamepad2 className="w-3.5 h-3.5 text-[#0F9D8A]" />
                        <span className="font-medium truncate">Game Tick</span>
                      </div>
                      <span className="text-[10px] font-mono text-[#52627A]">0.8 Mbps</span>
                    </div>

                    <div className="flex items-center justify-between p-2 bg-white border border-[#D9E2EE] rounded-lg text-xs">
                      <div className="flex items-center gap-1.5 text-[#17233B]">
                        <Tv className="w-3.5 h-3.5 text-[#B86B00]" />
                        <span className="font-medium truncate">4K Stream</span>
                      </div>
                      <span className="text-[10px] font-mono text-[#52627A]">25.0 Mbps</span>
                    </div>

                    <div className="flex items-center justify-between p-2 bg-white border border-[#D9E2EE] rounded-lg text-xs">
                      <div className="flex items-center gap-1.5 text-[#17233B]">
                        <HardDrive className="w-3.5 h-3.5 text-[#64748B]" />
                        <span className="font-medium truncate">ISO Bulk</span>
                      </div>
                      <span className="text-[10px] font-mono text-[#52627A]">90.0 Mbps</span>
                    </div>
                  </div>

                  {/* Flow Arrows into Router (hidden on mobile, visible on sm+) */}
                  <div className="hidden sm:flex sm:col-span-1 flex-col items-center justify-center space-y-3">
                    <div className="w-full h-0.5 bg-[#D9E2EE] relative">
                      <div className={`absolute top-[-3px] w-2 h-2 rounded-full ${heroMode === 'pathqos' ? 'bg-[#315CE8] animate-pulse' : 'bg-[#D94F45]'}`} style={{ left: '50%' }} />
                    </div>
                    <div className="w-full h-0.5 bg-[#D9E2EE] relative">
                      <div className={`absolute top-[-3px] w-2 h-2 rounded-full ${heroMode === 'pathqos' ? 'bg-[#0F9D8A] animate-pulse' : 'bg-[#D94F45]'}`} style={{ left: '30%' }} />
                    </div>
                    <div className="w-full h-0.5 bg-[#D9E2EE] relative">
                      <div className="absolute top-[-3px] w-2 h-2 rounded-full bg-[#B86B00]" style={{ left: '60%' }} />
                    </div>
                    <div className="w-full h-0.5 bg-[#D9E2EE] relative">
                      <div className="absolute top-[-3px] w-2 h-2 rounded-full bg-[#64748B]" style={{ left: '80%' }} />
                    </div>
                  </div>

                  {/* Router Node Center */}
                  <div className="sm:col-span-4 p-3 bg-white border-2 border-[#315CE8] rounded-xl shadow-xs space-y-2 text-center">
                    <div className="inline-flex items-center gap-1 text-[11px] font-bold text-[#315CE8] uppercase tracking-wider">
                      <Cpu className="w-3.5 h-3.5" />
                      <span>Router Engine</span>
                    </div>

                    {/* Simulated queue visualization */}
                    <div className="bg-[#EEF3F9] rounded-lg p-2 text-left space-y-1">
                      <div className="flex items-center justify-between text-[10px] font-semibold text-[#52627A]">
                        <span>Queue Backlog</span>
                        <span className="font-mono tabular-nums">
                          {heroMode === 'pathqos' ? '12 pkts (3ms)' : '982 pkts (184ms)'}
                        </span>
                      </div>
                      <div className="w-full h-2.5 bg-[#D9E2EE] rounded-full overflow-hidden flex">
                        {heroMode === 'pathqos' ? (
                          <>
                            <div className="h-full bg-[#315CE8] w-[5%]" title="Voice" />
                            <div className="h-full bg-[#0F9D8A] w-[5%]" title="Gaming" />
                            <div className="h-full bg-[#B86B00] w-[15%]" title="Video" />
                            <div className="h-full bg-[#64748B] w-[20%]" title="Bulk" />
                          </>
                        ) : (
                          <div className="h-full bg-[#D94F45] w-[95%]" title="Saturated Buffer" />
                        )}
                      </div>
                    </div>

                    <div className="text-[10px] text-[#52627A] pt-1 border-t border-[#D9E2EE]">
                      {heroMode === 'pathqos'
                        ? 'CAKE DiffServ4 · Ingress IFB shaper'
                        : 'Unmanaged pfifo_fast · Tail drop'}
                    </div>
                  </div>

                  {/* WAN Uplink to ISP */}
                  <div className="sm:col-span-3 space-y-2 text-center sm:text-right">
                    <div className="p-3 bg-white border border-[#D9E2EE] rounded-xl text-center space-y-1">
                      <div className="inline-flex items-center gap-1 text-[10px] font-bold text-[#52627A] uppercase">
                        <Server className="w-3 h-3 text-[#315CE8]" />
                        <span>WAN Uplink</span>
                      </div>
                      <div className="font-mono text-xs font-bold text-[#17233B]">
                        100 Mbps
                      </div>
                      <div className="text-[10px] text-[#52627A]">
                        ISP Gateway
                      </div>
                    </div>
                  </div>
                </div>

                {/* Metric Summary row */}
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#D9E2EE] text-center">
                  <div className="p-2 bg-white rounded-lg border border-[#D9E2EE]">
                    <div className="text-[10px] text-[#52627A]">Queue Delay</div>
                    <div
                      className={`text-sm font-bold font-mono tabular-nums ${
                        heroMode === 'pathqos' ? 'text-[#0F9D8A]' : 'text-[#D94F45]'
                      }`}
                    >
                      {heroMode === 'pathqos' ? '4 ms' : '184 ms'}
                    </div>
                  </div>
                  <div className="p-2 bg-white rounded-lg border border-[#D9E2EE]">
                    <div className="text-[10px] text-[#52627A]">Call Jitter</div>
                    <div
                      className={`text-sm font-bold font-mono tabular-nums ${
                        heroMode === 'pathqos' ? 'text-[#0F9D8A]' : 'text-[#D94F45]'
                      }`}
                    >
                      {heroMode === 'pathqos' ? '2.1 ms' : '48.0 ms'}
                    </div>
                  </div>
                  <div className="p-2 bg-white rounded-lg border border-[#D9E2EE]">
                    <div className="text-[10px] text-[#52627A]">Packet Loss</div>
                    <div
                      className={`text-sm font-bold font-mono tabular-nums ${
                        heroMode === 'pathqos' ? 'text-[#0F9D8A]' : 'text-[#D94F45]'
                      }`}
                    >
                      {heroMode === 'pathqos' ? '0.05%' : '6.4%'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
