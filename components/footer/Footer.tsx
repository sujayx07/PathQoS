'use client';

export default function Footer() {
  return (
    <footer className="bg-[#FFFFFF] border-t border-[#D9E2EE] py-12 text-xs text-[#52627A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2 text-base font-bold text-[#17233B]">
              <span className="w-7 h-7 rounded-lg bg-[#315CE8] text-white flex items-center justify-center font-black text-sm">
                P
              </span>
              <span>PathQoS</span>
            </div>
            <p className="text-xs text-[#52627A] max-w-sm leading-relaxed">
              An intent-aware, privacy-first adaptive QoS concept that observes traffic metadata, proposes bounded policies, and verifies impact with automated rollback.
            </p>
            <div className="text-[11px] text-[#52627A]">
              Tagline: &ldquo;Others apply QoS. PathQoS proves what changed—and why.&rdquo;
            </div>
          </div>

          {/* Standards & RFCs */}
          <div className="space-y-2">
            <span className="font-bold text-[#17233B] uppercase tracking-wider block text-[11px]">
              Networking Standards
            </span>
            <ul className="space-y-1.5 text-xs">
              <li>
                <span className="text-[#17233B] font-mono">RFC 8290:</span> CAKE Queue Discipline
              </li>
              <li>
                <span className="text-[#17233B] font-mono">RFC 8289:</span> Controlled Delay (CoDel)
              </li>
              <li>
                <span className="text-[#17233B] font-mono">RFC 2474:</span> DiffServ Architecture
              </li>
              <li>
                <span className="text-[#17233B] font-mono">RFC 3168:</span> ECN Congestion Notification
              </li>
            </ul>
          </div>

          {/* Navigation Mirrors */}
          <div className="space-y-2">
            <span className="font-bold text-[#17233B] uppercase tracking-wider block text-[11px]">
              Page Navigation
            </span>
            <ul className="space-y-1.5 text-xs">
              <li>
                <a href="#how-it-works" className="hover:text-[#17233B] transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#lab" className="hover:text-[#17233B] transition-colors">
                  Interactive Lab
                </a>
              </li>
              <li>
                <a href="#architecture" className="hover:text-[#17233B] transition-colors">
                  Architecture Explorer
                </a>
              </li>
              <li>
                <a href="#validation" className="hover:text-[#17233B] transition-colors">
                  Validation Methodology
                </a>
              </li>
              <li>
                <a href="#limitations" className="hover:text-[#17233B] transition-colors">
                  Scope &amp; Limitations
                </a>
              </li>
              <li>
                <a
                  href="/pathqos-project.zip"
                  download="pathqos-project.zip"
                  className="font-semibold text-[#315CE8] hover:underline"
                >
                  Download Source ZIP
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-[#D9E2EE] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#52627A]">
          <div>
            &copy; 2026 PathQoS Research Concept. Released under permissive MIT / Dual GPLv2 license for OpenWrt integration.
          </div>
          <div>
            Deterministic Client-Side Browser Simulation · Zero Packet Capture
          </div>
        </div>
      </div>
    </footer>
  );
}
