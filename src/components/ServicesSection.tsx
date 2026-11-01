import React from 'react';
import { CheckCircle2, Clock, DollarSign, ArrowRight, PaintRoller, Sparkles, ShieldCheck } from 'lucide-react';
import { SERVICE_PACKAGES } from '../data/housePaintingData';
import { ServicePackage } from '../types/painting';

interface ServicesSectionProps {
  onSelectService: (service: ServicePackage) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onSelectService }) => {
  return (
    <section id="services" className="py-16 md:py-24 bg-[#0a0d14] border-b border-[#1a2336]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#1e273c]">
          <div>
            <div className="text-xs uppercase tracking-wider text-[#38bdf8] font-bold mb-2">
              Our Professional Painting Services
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl text-white font-extrabold tracking-tight">
              Interior, Exterior & Cabinet Specialists
            </h2>
          </div>
          <p className="text-sm text-[#94a3b8] max-w-md font-normal leading-relaxed">
            Every service follows our rigorous 7-point preparation protocol: comprehensive masking, dustless sanding, caulking, priming, and 2 full coats of top-tier washable paint.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {SERVICE_PACKAGES.map((pkg) => (
            <div
              key={pkg.id}
              className="bg-[#111726] border border-[#202c44] hover:border-[#38bdf8]/60 rounded-xl p-6 sm:p-8 flex flex-col justify-between space-y-6 transition-all duration-300 hover:shadow-xl group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#38bdf8] uppercase tracking-wider">
                    {pkg.subtitle}
                  </span>
                  <span className="text-xs font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 px-2.5 py-0.5 rounded">
                    {pkg.turnaround}
                  </span>
                </div>

                <h3 className="text-2xl text-white font-bold group-hover:text-[#38bdf8] transition-colors">
                  {pkg.title}
                </h3>

                <p className="text-xs sm:text-sm text-[#94a3b8] leading-relaxed">
                  {pkg.description}
                </p>

                {/* Rates & Highlights */}
                <div className="p-3 bg-[#0d131f] border border-[#1b263b] rounded-lg flex items-center justify-between text-xs">
                  <span className="text-[#94a3b8]">Typical Pricing:</span>
                  <span className="font-bold text-white text-sm">{pkg.baseRate}</span>
                </div>

                <div className="space-y-2 pt-2">
                  <span className="text-xs font-semibold text-[#cbd5e1] block uppercase tracking-wider">
                    Included in Every Job:
                  </span>
                  <ul className="space-y-1.5">
                    {pkg.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-[#94a3b8]">
                        <CheckCircle2 className="w-4 h-4 text-[#38bdf8] shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-4 border-t border-[#1b263b]">
                <button
                  onClick={() => onSelectService(pkg)}
                  className="w-full py-2.5 bg-[#1b253b] hover:bg-[#0284c7] text-[#e2e8f0] hover:text-white rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-2 group-hover:bg-[#0284c7]"
                >
                  <span>Calculate Estimate for {pkg.title.split('&')[0]}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Commercial & Specialty Notice */}
        <div className="p-6 bg-[#11192b] border border-[#233352] rounded-xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center md:text-left">
            <h4 className="text-white font-bold text-sm sm:text-base">
              Need Commercial Offices, Multi-Unit Apartments, or Specialty Venetian Plaster?
            </h4>
            <p className="text-xs text-[#94a3b8]">
              We handle commercial tenant improvements, retail painting, limewash, and luxury Roman clay accent walls.
            </p>
          </div>
          <button
            onClick={() => onSelectService(SERVICE_PACKAGES[0])}
            className="px-5 py-2.5 bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs font-semibold rounded-lg shrink-0 transition-colors"
          >
            Request Commercial Walkthrough
          </button>
        </div>

      </div>
    </section>
  );
};
