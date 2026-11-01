import React from 'react';
import { ShieldCheck, Sparkles, Paintbrush, Award } from 'lucide-react';
import { peachBungalowImg } from '../data/housePaintingData';
import ownerPhoto from '../assets/images/owner-photo.jpg';

interface CraftsmanshipStandardsProps {
  onScheduleEstimate: () => void;
}

export const CraftsmanshipStandards: React.FC<CraftsmanshipStandardsProps> = ({ onScheduleEstimate }) => {
  return (
    <section id="about" className="py-16 md:py-24 bg-[#0a0d14] border-t border-[#1e2638]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Top Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-5 order-2 lg:order-1">
            <div className="relative p-2.5 bg-[#121929] border border-[#202d45] rounded-2xl shadow-2xl">
              <img
                src={ownerPhoto}
                alt="JudeCraft Finishes owner wearing workwear at an industrial site"
                className="w-full h-auto object-cover object-top rounded-xl max-h-[560px]"
              />
              <div className="p-3 text-center text-xs text-[#94a3b8]">
                The owner on site, focused on safe and careful work
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-6 order-1 lg:order-2">
            <div className="text-xs uppercase tracking-wider text-[#38bdf8] font-bold">
              Meet the Owner
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight">
              “Every great finish starts with care, preparation, and pride in the work.”
            </h2>

            <div className="space-y-4 text-sm sm:text-base text-[#94a3b8] leading-relaxed">
              <p>
                JudeCraft Finishes is led by a hands-on painting professional who believes good work begins with careful preparation and respect for every property. The owner stays involved in the work, from planning each project to checking the final finish.
              </p>
              <p>
                From interior rooms and ceilings to exterior walls and full buildings, we take on a wide range of painting and finishing projects. We work with clients across Ghana and focus on clean, careful, dependable results.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-[#1e273c]">
              <div>
                <span className="text-2xl font-extrabold text-white block">Hands-on</span>
                <span className="text-xs text-[#64748b]">Owner-led service</span>
              </div>
              <div>
                <span className="text-2xl font-extrabold text-white block">All-round</span>
                <span className="text-xs text-[#64748b]">Interior and exterior work</span>
              </div>
              <div>
                <span className="text-2xl font-extrabold text-white block">Quality focused</span>
                <span className="text-xs text-[#64748b]">Care at every stage</span>
              </div>
            </div>
          </div>

        </div>

        {/* 4 Pillars of House Painting Excellence */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 bg-[#111726] border border-[#1e2a42] rounded-xl space-y-3">
            <ShieldCheck className="w-6 h-6 text-[#38bdf8]" />
            <h4 className="text-base font-bold text-white">Full Tile & Floor Protection</h4>
            <p className="text-xs text-[#94a3b8] leading-relaxed">
              Protective canvas and plastic masking laid down across all floor tiles, furniture, and windows. Zero paint splatter.
            </p>
          </div>

          <div className="p-6 bg-[#111726] border border-[#1e2a42] rounded-xl space-y-3">
            <Sparkles className="w-6 h-6 text-[#38bdf8]" />
            <h4 className="text-base font-bold text-white">POP Joint Smoothing & Skimming</h4>
            <p className="text-xs text-[#94a3b8] leading-relaxed">
              Careful filling and sanding of hairline cracks on Plaster of Paris (POP) ceilings, rounded arches, and column capitals.
            </p>
          </div>

          <div className="p-6 bg-[#111726] border border-[#1e2a42] rounded-xl space-y-3">
            <Paintbrush className="w-6 h-6 text-[#38bdf8]" />
            <h4 className="text-base font-bold text-white">Laser-Straight Two-Tone Edges</h4>
            <p className="text-xs text-[#94a3b8] leading-relaxed">
              Crisp contrast between walls, ceilings, pillar bases, and window frames without wavy lines or bleed.
            </p>
          </div>

          <div className="p-6 bg-[#111726] border border-[#1e2a42] rounded-xl space-y-3">
            <Award className="w-6 h-6 text-[#38bdf8]" />
            <h4 className="text-base font-bold text-white">Weatherproof Tropical Seal</h4>
            <p className="text-xs text-[#94a3b8] leading-relaxed">
              Anti-fungal and moisture-seal exterior coatings that resist humid downpours and hot sun without fading or blistering.
            </p>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="p-8 bg-gradient-to-r from-[#141d30] to-[#0f1726] border border-[#233352] rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="space-y-1">
            <h3 className="text-xl sm:text-2xl font-bold text-white">
              Ready to give your building or rooms a fresh, beautiful paint finish?
            </h3>
            <p className="text-xs sm:text-sm text-[#94a3b8]">
              Book your free on-site walkthrough and receive a clear, itemized quote in Ghana Cedis (GH₵).
            </p>
          </div>
          <button
            onClick={onScheduleEstimate}
            className="px-6 py-3 bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold text-xs sm:text-sm rounded-lg transition-colors shrink-0 shadow-lg"
          >
            Schedule Free Estimate Walkthrough
          </button>
        </div>

      </div>
    </section>
  );
};
