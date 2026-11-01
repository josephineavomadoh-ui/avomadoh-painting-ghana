import React from 'react';
import { Calendar, ShieldCheck, CheckCircle2, ArrowRight, Paintbrush, Clock, Sparkles } from 'lucide-react';
import { interiorPainterAtWorkImg, twoStoryExteriorImg } from '../data/housePaintingData';

interface HeroProps {
  onStartEstimate: () => void;
  onExploreWork: () => void;
  onOpenQuickBooking: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onStartEstimate,
  onExploreWork,
  onOpenQuickBooking,
}) => {
  return (
    <section className="relative overflow-hidden pt-8 pb-16 md:py-20 border-b border-[#1e2638] bg-gradient-to-b from-[#0e131f] to-[#0a0d14]">
      {/* Ambient lighting glows */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#0284c7]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-[#38bdf8]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Headlines & Call to Actions */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-2 text-xs tracking-wider uppercase text-[#38bdf8] font-bold">
              <span>Master Residential & Commercial House Painters</span>
              <span aria-hidden="true" className="text-[#334155]">·</span>
              <span>Interior Rooms & Full Building Exteriors</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl text-white font-extrabold tracking-tight leading-[1.12]">
              Flawless walls, decorative arches & weatherproof exteriors.
            </h1>

            <p className="text-base sm:text-lg text-[#94a3b8] leading-relaxed max-w-2xl font-normal">
              Whether painting single rooms, spacious hall arches and POP ceilings, or coating entire single and two-storey building exteriors with anti-peeling weatherproof protection, our skilled master painters deliver laser-straight lines, clean floors, and durable quality across Ghana.
            </p>

            {/* Credibility badges with unboxed metadata discipline */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs text-[#cbd5e1]">
              <div className="p-2.5 bg-[#131b2b] border border-[#202c44] rounded-lg">
                <span className="text-[#38bdf8] font-bold block">100% Covered</span>
                <span className="text-[11px] text-[#94a3b8]">Tiles & furniture protected</span>
              </div>
              <div className="p-2.5 bg-[#131b2b] border border-[#202c44] rounded-lg">
                <span className="text-[#38bdf8] font-bold block">POP Specialists</span>
                <span className="text-[11px] text-[#94a3b8]">Ceilings, arches & pillars</span>
              </div>
              <div className="p-2.5 bg-[#131b2b] border border-[#202c44] rounded-lg">
                <span className="text-[#38bdf8] font-bold block">Anti-Peel Primer</span>
                <span className="text-[11px] text-[#94a3b8]">WeatherShield barrier</span>
              </div>
              <div className="p-2.5 bg-[#131b2b] border border-[#202c44] rounded-lg">
                <span className="text-[#38bdf8] font-bold block">Fair Cedis Rates</span>
                <span className="text-[11px] text-[#94a3b8]">Transparent GH₵ quotes</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-4">
              <button
                onClick={onStartEstimate}
                className="flex items-center justify-center gap-2.5 px-6 py-3.5 bg-[#0284c7] hover:bg-[#0369a1] text-white font-semibold text-sm rounded-lg transition-all shadow-lg active:scale-[0.98]"
              >
                <Calendar className="w-4 h-4" />
                <span>Get Cedis Estimate & Schedule Walkthrough</span>
              </button>

              <button
                onClick={onExploreWork}
                className="flex items-center justify-center gap-2 px-5 py-3.5 border border-[#273248] hover:border-[#38bdf8] text-[#cbd5e1] hover:text-white text-sm font-medium rounded-lg transition-colors bg-[#111726]/80"
              >
                <span>View Real Completed Houses</span>
                <ArrowRight className="w-4 h-4 text-[#38bdf8]" />
              </button>
            </div>

            {/* Seasonal Booking Slot Status */}
            <div className="p-3.5 bg-[#101726] border border-[#202c44] rounded-lg flex items-center justify-between text-xs max-w-xl">
              <div className="flex items-center gap-2.5">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <span className="text-[#cbd5e1]">
                  <strong className="text-white">Active Painting Schedule:</strong> 2 house repainting slots open for this month
                </span>
              </div>
              <button
                onClick={onStartEstimate}
                className="text-[#38bdf8] hover:underline font-semibold ml-2 whitespace-nowrap"
              >
                Book Walkthrough &rarr;
              </button>
            </div>
          </div>

          {/* Right Column: Visual Transformation Showcase using user's real images */}
          <div className="lg:col-span-5">
            <div className="relative group">
              <div className="p-2.5 bg-[#131a29] border border-[#23314d] rounded-xl shadow-2xl transition-transform duration-500 hover:scale-[1.01]">
                <div className="relative overflow-hidden rounded-lg bg-[#0a0d14]">
                  <img
                    src={interiorPainterAtWorkImg}
                    alt="Master painter painting hall arches and POP ceiling"
                    className="w-full h-auto object-cover max-h-[460px] transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90" />
                  
                  {/* Floating project card */}
                  <div className="absolute bottom-4 left-4 right-4 text-left">
                    <span className="text-[11px] uppercase tracking-wider text-[#38bdf8] font-bold block">
                      Real On-Site Craftsmanship
                    </span>
                    <h3 className="text-xl text-white font-bold leading-snug">
                      Hallway Arches & POP Ceiling Painting
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-[#cbd5e1] mt-1">
                      <span>Warm Sand Beige & Pure White Trim</span>
                      <span aria-hidden="true">·</span>
                      <span>Zero Wall Streaks</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Secondary badge showing two-story exterior project */}
              <div className="hidden sm:flex absolute -bottom-5 -left-5 bg-[#0e1626] border border-[#2a3a5a] p-3 rounded-lg shadow-xl items-center gap-3 max-w-xs">
                <img
                  src={twoStoryExteriorImg}
                  alt="Two-storey building exterior painting"
                  className="w-14 h-14 rounded object-cover border border-[#38bdf8]/40"
                />
                <div className="text-xs">
                  <strong className="text-white block font-semibold">Storey Buildings & Pillars</strong>
                  <span className="text-[11px] text-[#94a3b8]">Weatherproof WeatherShield coating</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
