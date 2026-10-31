'use client';

import { useState } from 'react';
import { Menu, X, Activity, ShieldCheck, Cpu } from 'lucide-react';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[#FFFFFF]/90 backdrop-blur-md border-b border-[#D9E2EE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-8">
          {/* Zone 1: Single text element Brand Wordmark */}
          <a
            href="#"
            className="flex items-center gap-2 text-lg font-bold tracking-tight text-[#17233B] whitespace-nowrap shrink-0 hover:text-[#315CE8] transition-colors"
          >
            <span className="w-8 h-8 rounded-lg bg-[#315CE8] text-white flex items-center justify-center font-black text-base shadow-sm">
              P
            </span>
            <span>PathQoS</span>
          </a>

          {/* Zone 2: 4-5 clean single-line text navigation links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-[#52627A]">
            <a
              href="#how-it-works"
              className="hover:text-[#17233B] transition-colors whitespace-nowrap shrink-0"
            >
              How It Works
            </a>
            <a
              href="#lab"
              className="hover:text-[#17233B] transition-colors whitespace-nowrap shrink-0"
            >
              Interactive Lab
            </a>
            <a
              href="#architecture"
              className="hover:text-[#17233B] transition-colors whitespace-nowrap shrink-0"
            >
              Architecture
            </a>
            <a
              href="#validation"
              className="hover:text-[#17233B] transition-colors whitespace-nowrap shrink-0"
            >
              Validation
            </a>
            <a
              href="#limitations"
              className="hover:text-[#17233B] transition-colors whitespace-nowrap shrink-0"
            >
              Scope & Limits
            </a>
          </nav>

          {/* Zone 3: Actions */}
          <div className="hidden md:flex items-center gap-3 shrink-0">
            <a
              href="/pathqos-project.zip"
              download="pathqos-project.zip"
              className="px-3.5 py-2 text-xs font-semibold text-[#17233B] bg-white border border-[#D9E2EE] rounded-lg hover:bg-[#EEF3F9] hover:border-[#CBD5E1] transition-colors whitespace-nowrap shrink-0 shadow-xs flex items-center gap-1.5"
              title="Download entire codebase as ZIP file"
            >
              <span>Download .ZIP</span>
            </a>
            <a
              href="#lab"
              className="px-4 py-2 text-xs font-semibold text-white bg-[#315CE8] rounded-lg hover:bg-[#244ED8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#244ED8] focus-visible:ring-offset-2 transition-colors whitespace-nowrap shrink-0 shadow-sm"
            >
              Launch Interactive Lab
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-[#52627A] hover:text-[#17233B] hover:bg-[#EEF3F9] focus:outline-none focus:ring-2 focus:ring-[#315CE8]"
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#D9E2EE] bg-[#FFFFFF] px-4 pt-2 pb-4 space-y-2">
          <a
            href="#how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm font-medium text-[#52627A] hover:text-[#17233B] hover:bg-[#EEF3F9] rounded-md"
          >
            How It Works
          </a>
          <a
            href="#lab"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm font-medium text-[#52627A] hover:text-[#17233B] hover:bg-[#EEF3F9] rounded-md"
          >
            Interactive Lab
          </a>
          <a
            href="#architecture"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm font-medium text-[#52627A] hover:text-[#17233B] hover:bg-[#EEF3F9] rounded-md"
          >
            Architecture
          </a>
          <a
            href="#validation"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm font-medium text-[#52627A] hover:text-[#17233B] hover:bg-[#EEF3F9] rounded-md"
          >
            Validation
          </a>
          <a
            href="#limitations"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm font-medium text-[#52627A] hover:text-[#17233B] hover:bg-[#EEF3F9] rounded-md"
          >
            Scope & Limits
          </a>
          <div className="pt-2 space-y-2">
            <a
              href="/pathqos-project.zip"
              download="pathqos-project.zip"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full text-center px-4 py-2 text-sm font-semibold text-[#17233B] bg-[#EEF3F9] hover:bg-[#E2E8F0] rounded-lg transition-colors border border-[#D9E2EE]"
            >
              Download Project ZIP (1.7 MB)
            </a>
            <a
              href="#lab"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full text-center px-4 py-2 text-sm font-semibold text-white bg-[#315CE8] rounded-lg hover:bg-[#244ED8]"
            >
              Launch Interactive Lab
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
