'use client';

import { useState } from 'react';
import {
  Cpu,
  Layers,
  ArrowRight,
  ShieldCheck,
  Activity,
  Server,
  Wifi,
  FileCheck2,
  Terminal,
  AlertTriangle,
} from 'lucide-react';
import { ARCHITECTURE_MODULES } from '../../lib/simulation/constants';
import { ArchitectureModule } from '../../lib/types';

export default function ArchitectureExplorer() {
  const [selectedModuleId, setSelectedModuleId] = useState<string>('m1');
  const activeModule =
    ARCHITECTURE_MODULES.find((m) => m.id === selectedModuleId) || ARCHITECTURE_MODULES[0];

  return (
    <section id="architecture" className="py-16 md:py-24 bg-[#FFFFFF] border-b border-[#D9E2EE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="max-w-3xl space-y-3">
          <div className="text-xs font-bold text-[#315CE8] uppercase tracking-wider">
            System Architecture
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#17233B] tracking-tight">
            Six Modular Subsystems: Decoupled Control &amp; Data Planes
          </h2>
          <p className="text-base text-[#52627A] leading-relaxed">
            PathQoS is structured as an event-driven router daemon with distinct data-plane packet classifiers and an asynchronous control-plane policy solver running on standard Linux networking primitives.
          </p>
        </div>

        {/* Plane Separation Legend & AP Telemetry Warning */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-[#EEF3F9] border border-[#D9E2EE] rounded-2xl text-xs">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#315CE8]" />
              <span className="font-semibold text-[#17233B]">Data Plane (Kernel / eBPF / tc-cake)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#0F9D8A]" />
              <span className="font-semibold text-[#17233B]">Control Plane (User-space Rust Daemon)</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-[#B86B00]">
            <Wifi className="w-4 h-4 shrink-0" />
            <span className="font-medium">
              Wi-Fi AP Telemetry Path is optional &amp; driver-dependent (mac80211 / nl80211).
            </span>
          </div>
        </div>

        {/* 6 Modules Grid Selector */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {ARCHITECTURE_MODULES.map((mod) => {
            const isSelected = selectedModuleId === mod.id;
            const isDataPlane = mod.plane === 'data';

            return (
              <button
                key={mod.id}
                type="button"
                onClick={() => setSelectedModuleId(mod.id)}
                className={`p-4 rounded-xl border text-left transition-all space-y-2 ${
                  isSelected
                    ? 'bg-white border-[#315CE8] shadow-sm ring-2 ring-[#315CE8]'
                    : 'bg-white border-[#D9E2EE] hover:bg-[#F7F9FC] hover:border-[#CBD5E1]'
                }`}
                aria-pressed={isSelected}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-[#52627A]">
                    {mod.number}
                  </span>
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                      isDataPlane
                        ? 'bg-[#EEF3F9] text-[#315CE8]'
                        : 'bg-[#E6F7F5] text-[#0A6C5F]'
                    }`}
                  >
                    {mod.plane}
                  </span>
                </div>
                <div className="font-bold text-xs text-[#17233B] leading-tight line-clamp-2">
                  {mod.name}
                </div>
              </button>
            );
          })}
        </div>

        {/* Deep Module Inspector Card */}
        <div className="bg-[#F7F9FC] border border-[#D9E2EE] rounded-2xl p-6 lg:p-8 space-y-8 shadow-xs">
          {/* Header row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#D9E2EE]">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-bold text-[#315CE8]">
                  Module {activeModule.number}
                </span>
                <span className="text-xs text-[#52627A]">·</span>
                <span className="text-xs uppercase font-bold text-[#52627A]">
                  {activeModule.plane} plane
                </span>
              </div>
              <h3 className="text-xl font-extrabold text-[#17233B] mt-1">
                {activeModule.name}
              </h3>
            </div>

            <div className="text-xs text-right">
              <span className="text-[#52627A] block font-medium">Kernel Mechanism</span>
              <strong className="text-[#17233B] font-mono">{activeModule.kernelMechanism}</strong>
            </div>
          </div>

          {/* Module Role */}
          <div className="space-y-1">
            <span className="text-xs font-bold text-[#17233B] uppercase tracking-wider">
              Primary Role &amp; Guarantees:
            </span>
            <p className="text-sm text-[#52627A] leading-relaxed">
              {activeModule.role}
            </p>
          </div>

          {/* Inputs & Outputs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Inputs */}
            <div className="bg-white p-5 rounded-xl border border-[#D9E2EE] space-y-3">
              <span className="text-xs font-bold text-[#315CE8] uppercase tracking-wider block">
                Subsystem Inputs
              </span>
              <ul className="space-y-2 text-xs text-[#52627A]">
                {activeModule.inputs.map((inp, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#315CE8] mt-1.5 shrink-0" />
                    <span>{inp}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Outputs */}
            <div className="bg-white p-5 rounded-xl border border-[#D9E2EE] space-y-3">
              <span className="text-xs font-bold text-[#0F9D8A] uppercase tracking-wider block">
                Subsystem Outputs
              </span>
              <ul className="space-y-2 text-xs text-[#52627A]">
                {activeModule.outputs.map((out, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0F9D8A] mt-1.5 shrink-0" />
                    <span>{out}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Internal State, Failure Behavior & Hardware Dependencies */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            <div className="bg-white p-4 rounded-xl border border-[#D9E2EE] space-y-2 text-xs">
              <span className="font-bold text-[#17233B] block">Internal State:</span>
              <ul className="space-y-1.5 text-[#52627A]">
                {activeModule.internalState.map((st, i) => (
                  <li key={i} className="leading-normal">
                    · {st}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white p-4 rounded-xl border border-[#D9E2EE] space-y-2 text-xs">
              <span className="font-bold text-[#D94F45] block">Failure / Degradation Handling:</span>
              <p className="text-[#52627A] leading-relaxed">
                {activeModule.failureBehavior}
              </p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-[#D9E2EE] space-y-2 text-xs">
              <span className="font-bold text-[#17233B] block">Hardware Prerequisite:</span>
              <p className="text-[#52627A] leading-relaxed">
                {activeModule.hardwareDependency}
              </p>
              <div className="pt-2 border-t border-[#D9E2EE] text-[11px] text-[#0F9D8A]">
                {activeModule.testCoverage}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
