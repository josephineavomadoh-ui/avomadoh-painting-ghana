import React from 'react';
import { PaintRoller, Calendar, Phone, MessageSquare, SlidersHorizontal } from 'lucide-react';

interface NavbarProps {
  activeTab: 'work' | 'services' | 'estimate' | 'tracker' | 'about';
  setActiveTab: (tab: 'work' | 'services' | 'estimate' | 'tracker' | 'about') => void;
  onOpenBooking: () => void;
  onOpenDashboard: () => void;
  activeJobsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenBooking,
  onOpenDashboard,
  activeJobsCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#0e1117]/95 backdrop-blur-md border-b border-[#1e2638]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand identity */}
        <div 
          onClick={() => setActiveTab('work')}
          className="cursor-pointer flex items-center gap-3.5 group"
        >
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#0284c7] to-[#0369a1] text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
            <PaintRoller className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg sm:text-xl text-white tracking-tight group-hover:text-[#38bdf8] transition-colors">
                Avomadoh Painting
              </span>
              <span className="hidden sm:inline-flex items-center text-[10px] font-semibold text-emerald-400 bg-emerald-950/70 border border-emerald-800/80 px-2 py-0.5 rounded">
                Ghana Registered
              </span>
            </div>
            <span className="block text-[11px] text-[#94a3b8] tracking-wider uppercase">
              Master House & Room Painters · Accra & Kumasi
            </span>
          </div>
        </div>

        {/* Navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
          <button
            onClick={() => setActiveTab('work')}
            className={`transition-colors py-1 relative ${
              activeTab === 'work'
                ? 'text-white after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#38bdf8]'
                : 'text-[#94a3b8] hover:text-white'
            }`}
          >
            Completed Houses
          </button>

          <button
            onClick={() => setActiveTab('services')}
            className={`transition-colors py-1 relative ${
              activeTab === 'services'
                ? 'text-white after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#38bdf8]'
                : 'text-[#94a3b8] hover:text-white'
            }`}
          >
            Services & Rates (GH₵)
          </button>

          <button
            onClick={() => setActiveTab('estimate')}
            className={`transition-colors py-1 relative flex items-center gap-1.5 ${
              activeTab === 'estimate'
                ? 'text-white after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#38bdf8]'
                : 'text-[#94a3b8] hover:text-white'
            }`}
          >
            <span>Quote & Schedule</span>
            <span className="text-[10px] text-[#38bdf8] uppercase tracking-wider bg-[#38bdf8]/15 px-1.5 py-0.5 rounded border border-[#38bdf8]/30">
              Cedis
            </span>
          </button>

          <button
            onClick={() => setActiveTab('tracker')}
            className={`transition-colors py-1 relative ${
              activeTab === 'tracker'
                ? 'text-white after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#38bdf8]'
                : 'text-[#94a3b8] hover:text-white'
            }`}
          >
            Track Paint Job
          </button>

          <button
            onClick={() => setActiveTab('about')}
            className={`transition-colors py-1 relative ${
              activeTab === 'about'
                ? 'text-white after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#38bdf8]'
                : 'text-[#94a3b8] hover:text-white'
            }`}
          >
            Why Choose Us
          </button>
        </nav>

        {/* Action controls */}
        <div className="flex items-center gap-2.5">
          {/* WhatsApp Direct link */}
          <a
            href="https://wa.me/233241234567?text=Hello%20Avomadoh%20Painters,%20I%20would%20like%20an%20estimate%20for%20house%20painting"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs text-emerald-400 hover:text-white border border-emerald-800/80 hover:border-emerald-500 rounded-md transition-colors bg-emerald-950/40"
            title="Chat on WhatsApp"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>WhatsApp</span>
          </a>

          {/* Painter Admin Portal */}
          <button
            onClick={onOpenDashboard}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-[#94a3b8] hover:text-white border border-[#273248] hover:border-[#38bdf8] rounded-md transition-colors bg-[#131a29]"
            title="Painter Admin Portal"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#38bdf8]" />
            <span className="hidden sm:inline">Admin</span>
            {activeJobsCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-[#0284c7] text-white text-[10px] font-bold flex items-center justify-center">
                {activeJobsCount}
              </span>
            )}
          </button>

          {/* Book Walkthrough CTA */}
          <button
            onClick={onOpenBooking}
            className="flex items-center gap-2 px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-[#0284c7] hover:bg-[#0369a1] rounded-md transition-all shadow-md active:scale-[0.98]"
          >
            <Calendar className="w-4 h-4" />
            <span>Book Walkthrough</span>
          </button>
        </div>
      </div>

      {/* Mobile navigation tab strip */}
      <div className="md:hidden flex items-center justify-around border-t border-[#1e2638] bg-[#0c0e14] py-2 px-2 text-xs">
        <button
          onClick={() => setActiveTab('work')}
          className={`py-1 px-2 ${activeTab === 'work' ? 'text-[#38bdf8] font-bold' : 'text-[#94a3b8]'}`}
        >
          Houses
        </button>
        <button
          onClick={() => setActiveTab('services')}
          className={`py-1 px-2 ${activeTab === 'services' ? 'text-[#38bdf8] font-bold' : 'text-[#94a3b8]'}`}
        >
          Rates (GH₵)
        </button>
        <button
          onClick={() => setActiveTab('estimate')}
          className={`py-1 px-2 ${activeTab === 'estimate' ? 'text-[#38bdf8] font-bold' : 'text-[#94a3b8]'}`}
        >
          Estimate
        </button>
        <button
          onClick={() => setActiveTab('tracker')}
          className={`py-1 px-2 ${activeTab === 'tracker' ? 'text-[#38bdf8] font-bold' : 'text-[#94a3b8]'}`}
        >
          Track Job
        </button>
        <button
          onClick={() => setActiveTab('about')}
          className={`py-1 px-2 ${activeTab === 'about' ? 'text-[#38bdf8] font-bold' : 'text-[#94a3b8]'}`}
        >
          About
        </button>
      </div>
    </header>
  );
};
