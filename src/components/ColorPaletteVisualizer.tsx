import React, { useState } from 'react';
import { POPULAR_COLORS } from '../data/housePaintingData';
import { ColorSwatch } from '../types/painting';
import { Check, Sparkles, Paintbrush, Info } from 'lucide-react';

interface ColorPaletteVisualizerProps {
  onSelectColorForEstimate?: (color: ColorSwatch) => void;
}

export const ColorPaletteVisualizer: React.FC<ColorPaletteVisualizerProps> = ({
  onSelectColorForEstimate,
}) => {
  const [selectedColor, setSelectedColor] = useState<ColorSwatch>(POPULAR_COLORS[0]);

  return (
    <section className="py-16 bg-[#0a0d14] border-t border-[#1a2336]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs uppercase tracking-wider text-[#38bdf8] font-bold">
            Designer Paint Guide & Sheens
          </span>
          <h2 className="text-3xl sm:text-4xl text-white font-extrabold tracking-tight">
            Top Homeowner Paint Colors & Sheen Advice
          </h2>
          <p className="text-xs sm:text-sm text-[#94a3b8]">
            We provide complimentary on-site color fan decks and physical wall sample swatches with every booked project.
          </p>
        </div>

        {/* Visualizer Interactive Container */}
        <div className="bg-[#121929] border border-[#202c44] rounded-2xl p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Swatches List */}
          <div className="lg:col-span-7 space-y-3">
            <span className="text-xs font-semibold text-[#cbd5e1] uppercase tracking-wider block">
              Curated Designer Neutrals & Accents:
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {POPULAR_COLORS.map((swatch) => (
                <button
                  key={swatch.id}
                  onClick={() => setSelectedColor(swatch)}
                  className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                    selectedColor.id === swatch.id
                      ? 'bg-[#1b263b] border-[#38bdf8] shadow-md scale-[1.02]'
                      : 'bg-[#0e1422] border-[#1d273d] hover:border-[#2f4063]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div 
                      className="w-8 h-8 rounded-full border border-white/20 shadow-inner"
                      style={{ backgroundColor: swatch.hex }}
                    />
                    {selectedColor.id === swatch.id && (
                      <Check className="w-4 h-4 text-[#38bdf8]" />
                    )}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">{swatch.name}</div>
                    <div className="text-[11px] text-[#94a3b8]">{swatch.brand} · {swatch.code}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Color Details Box */}
          <div className="lg:col-span-5 bg-[#0e1422] border border-[#1e2a42] rounded-xl p-6 space-y-5">
            <div className="flex items-center gap-4">
              <div 
                className="w-16 h-16 rounded-xl border border-white/20 shadow-lg shrink-0"
                style={{ backgroundColor: selectedColor.hex }}
              />
              <div>
                <span className="text-[11px] text-[#38bdf8] font-bold uppercase block">
                  {selectedColor.brand}
                </span>
                <h3 className="text-xl font-bold text-white">
                  {selectedColor.name} ({selectedColor.code})
                </h3>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-[#131b2b] rounded-lg border border-[#1e2a42]">
                <strong className="text-[#38bdf8] block font-semibold mb-0.5">Recommended Room Fit:</strong>
                <span className="text-[#cbd5e1]">{selectedColor.roomBestFit}</span>
              </div>

              <div className="p-3 bg-[#131b2b] rounded-lg border border-[#1e2a42]">
                <strong className="text-[#38bdf8] block font-semibold mb-0.5">Recommended Sheen:</strong>
                <span className="text-[#cbd5e1]">{selectedColor.recommendedSheen}</span>
              </div>
            </div>

            {/* Quick sheen explainer cheat sheet */}
            <div className="text-[11px] text-[#8094ad] pt-2 border-t border-[#1a253a] space-y-1">
              <div><strong>Eggshell:</strong> Most popular for living rooms & bedrooms (wipeable, soft glow).</div>
              <div><strong>Satin:</strong> Ideal for high-humidity bathrooms & busy kitchens.</div>
              <div><strong>Semi-Gloss:</strong> Standard durability for baseboards, doors & crown molding.</div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
