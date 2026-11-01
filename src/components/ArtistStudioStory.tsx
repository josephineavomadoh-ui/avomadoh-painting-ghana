import React from 'react';
import { Sparkles, Award, Shield, Palette, CheckCircle2 } from 'lucide-react';
import { studioImg, artistImg } from '../data/artworksData';

interface ArtistStudioStoryProps {
  onStartCommission: () => void;
}

export const ArtistStudioStory: React.FC<ArtistStudioStoryProps> = ({ onStartCommission }) => {
  return (
    <section id="about" className="py-16 md:py-24 bg-[#0e0d0c] border-t border-[#231f1a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        
        {/* Part 1: The Artist & Philosophy */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-5 order-2 lg:order-1">
            <div className="relative p-2.5 bg-[#171412] border border-[#332b22] rounded-xl shadow-2xl">
              <img
                src={artistImg}
                alt="Elena Vance in her studio"
                className="w-full h-auto object-cover rounded-lg max-h-[560px]"
              />
              <div className="p-3 text-center text-xs text-[#8f887d]">
                Elena Vance in her London Atelier, working at the easel
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-6 order-1 lg:order-2">
            <div className="text-xs uppercase tracking-[0.25em] text-[#c5a880] font-medium">
              The Artist & Philosophy
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#f4efe8] leading-[1.15]">
              “A portrait should feel alive across centuries, not just in the moment of viewing.”
            </h2>

            <div className="space-y-4 text-sm sm:text-base text-[#a8a196] leading-relaxed font-light">
              <p>
                Trained in classical figurative realism and modern expressive impasto at the Florence Academy of Art and the Slade School of Fine Art, Elena Vance has spent twenty years mastering the delicate interplay between luminous transparency and physical paint texture.
              </p>
              <p>
                Every bespoke commission begins not as an assembly-line reproduction of a photograph, but as an intimate exploration of presence, atmosphere, and light. Whether capturing the weathered dignity of a patriarch, the playful devotion of a loyal companion, or the timeless majesty of a family retreat, each brushstroke is placed with deliberate reverence.
              </p>
            </div>

            {/* Accolades & Exhibitions */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-[#26201a]">
              <div>
                <span className="text-xs font-serif text-xl text-[#f4efe8] block">20+ Years</span>
                <span className="text-[11px] text-[#7d766b]">Dedicated Studio Practice</span>
              </div>
              <div>
                <span className="text-xs font-serif text-xl text-[#f4efe8] block">140+ Works</span>
                <span className="text-[11px] text-[#7d766b]">In Global Private Collections</span>
              </div>
              <div>
                <span className="text-xs font-serif text-xl text-[#f4efe8] block">BP Award</span>
                <span className="text-[11px] text-[#7d766b]">Portrait Finalist Selection</span>
              </div>
            </div>
          </div>

        </div>

        {/* Part 2: The Atelier Materials & Archival Commitment */}
        <div className="p-8 sm:p-12 bg-[#12100e] border border-[#2b251f] rounded-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-6 space-y-5">
              <div className="text-xs uppercase tracking-[0.25em] text-[#c5a880] font-medium">
                Uncompromising Craft
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl text-[#f4efe8]">
                Materials Built for Multi-Generational Longevity
              </h3>
              <p className="text-xs sm:text-sm text-[#a39c92] leading-relaxed font-light">
                Cheap canvases warp; synthetic paints fade under sunlight. Atelier Vance sources only museum-grade components verified for 100+ year permanence.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-[#c5a880] shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <strong className="text-[#f4efe8] block">Claessens Belgian Linen</strong>
                    <span className="text-[#8f887d]">Woven from double-combed natural flax, quadruple oil-primed with non-absorbent ground for unmatched tensile strength.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-[#c5a880] shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <strong className="text-[#f4efe8] block">Hand-Selected Artist Pigments & Walnut Mediums</strong>
                    <span className="text-[#8f887d]">Pure single-pigment minerals ground in cold-pressed walnut oil to prevent yellowing over decades of aging.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-[#c5a880] shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <strong className="text-[#f4efe8] block">Keyable Baltic Birch Stretchers</strong>
                    <span className="text-[#8f887d]">Kiln-dried hardwood stretcher bars with hardwood corner keys, allowing tension adjustments in varying climates.</span>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={onStartCommission}
                  className="px-5 py-2.5 bg-[#c5a880] hover:bg-[#d5bba0] text-[#12100e] text-xs font-semibold rounded transition-colors"
                >
                  Commission an Archival Heirloom
                </button>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="relative rounded-xl overflow-hidden border border-[#332c25] shadow-xl">
                <img
                  src={studioImg}
                  alt="Atelier workspace and easel"
                  className="w-full h-auto object-cover max-h-[420px]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-xs text-[#cfc7bc]">
                  Northern daylight studio in Bloomsbury, London
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
