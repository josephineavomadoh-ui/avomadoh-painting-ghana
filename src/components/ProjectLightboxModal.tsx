import React, { useEffect } from 'react';
import { X, CheckCircle2, Paintbrush, Clock, Sparkles, Ruler, ShieldCheck, ArrowRight } from 'lucide-react';
import { CompletedProject } from '../types/painting';

interface ProjectLightboxModalProps {
  project: CompletedProject | null;
  onClose: () => void;
  onBookSimilar: (project: CompletedProject) => void;
}

export const ProjectLightboxModal: React.FC<ProjectLightboxModalProps> = ({
  project,
  onClose,
  onBookSimilar,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!project) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-3 sm:p-6 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-5xl bg-[#101624] border border-[#23314d] rounded-2xl overflow-hidden shadow-2xl flex flex-col lg:flex-row max-h-[92vh]">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-[#182238]/80 text-[#94a3b8] hover:text-white flex items-center justify-center border border-[#2b3a5a] transition-colors"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Left Side: Photo Display */}
        <div className="lg:w-7/12 bg-[#090d15] relative flex items-center justify-center p-4 sm:p-6 overflow-hidden">
          <img
            src={project.imageUrl}
            alt={project.title}
            className="w-full h-auto max-h-[65vh] object-cover rounded-lg shadow-lg border border-[#1e2a42]"
          />
          <div className="absolute bottom-6 left-6 right-6 p-3 bg-[#0e1626]/90 backdrop-blur-md rounded-lg border border-[#233352] text-xs text-[#cbd5e1] hidden sm:flex items-center justify-between">
            <span>Client Location: {project.clientCity}</span>
            <span className="font-semibold text-[#38bdf8]">{project.completionDays} Days On-Site</span>
          </div>
        </div>

        {/* Right Side: Details, Prep Protocol & Booking */}
        <div className="lg:w-5/12 bg-[#121929] p-6 sm:p-8 flex flex-col justify-between overflow-y-auto border-t lg:border-t-0 lg:border-l border-[#1e2c47] space-y-6">
          <div className="space-y-5">
            <div>
              <div className="flex items-center gap-2 text-xs text-[#94a3b8] mb-1.5">
                <span className="capitalize">{project.roomType}</span>
                <span aria-hidden="true">·</span>
                <span>{project.sqFt} sq. ft.</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                {project.title}
              </h2>
            </div>

            {/* Paint Specifications */}
            <div className="p-4 bg-[#0d1422] rounded-xl border border-[#1d2940] space-y-2 text-xs">
              <span className="text-[10px] uppercase font-bold text-[#38bdf8] tracking-wider block">
                Color & Paint System Used
              </span>
              <div className="font-semibold text-white text-sm">
                {project.colorName} ({project.colorCode})
              </div>
              <div className="text-[#94a3b8]">
                <strong>Brand:</strong> {project.paintBrand}
              </div>
              <div className="text-[#94a3b8]">
                <strong>Sheen:</strong> {project.sheen}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-[#cbd5e1] uppercase tracking-wider block">
                Scope & Project Summary
              </span>
              <p className="text-xs text-[#94a3b8] leading-relaxed">
                {project.description}
              </p>
            </div>

            {/* Surface Prep Highlights */}
            <div className="space-y-2 pt-2 border-t border-[#1a253a]">
              <span className="text-xs font-semibold text-[#cbd5e1] uppercase tracking-wider block">
                Prep & Protection Done:
              </span>
              <ul className="space-y-1.5">
                {project.prepHighlights.map((prep, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-[#94a3b8]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#38bdf8] shrink-0 mt-0.5" />
                    <span>{prep}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Warranty Guarantee */}
            <div className="p-3 bg-emerald-950/40 border border-emerald-800/60 rounded-lg text-xs text-emerald-300 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Includes 3-Year Zero-Peel Workmanship Warranty & Leftover Touch-Up Kit</span>
            </div>
          </div>

          {/* Bottom Action */}
          <div className="pt-4 border-t border-[#1e2c47]">
            <button
              onClick={() => {
                onClose();
                onBookSimilar(project);
              }}
              className="w-full py-3 bg-[#0284c7] hover:bg-[#0369a1] text-white font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-2 shadow"
            >
              <span>Get Estimate for a Room Like This</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
