import React, { useState, useEffect } from 'react';
import { X, ZoomIn, ZoomOut, RotateCcw, Eye, Sparkles, Paintbrush, Ruler, ShieldCheck, Check, ArrowRight } from 'lucide-react';
import { Artwork } from '../types/art';

interface ArtworkLightboxModalProps {
  artwork: Artwork | null;
  onClose: () => void;
  onCommissionSimilar: (artwork: Artwork) => void;
}

export const ArtworkLightboxModal: React.FC<ArtworkLightboxModalProps> = ({
  artwork,
  onClose,
  onCommissionSimilar,
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [viewMode, setViewMode] = useState<'canvas' | 'in_room'>('canvas');
  const [inquired, setInquired] = useState<boolean>(false);

  useEffect(() => {
    // Reset zoom and view mode when artwork changes
    setZoomLevel(1);
    setViewMode('canvas');
    setInquired(false);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [artwork, onClose]);

  if (!artwork) return null;

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.35, 2.8));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.35, 1));
  const handleResetZoom = () => setZoomLevel(1);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-2 sm:p-4 md:p-6 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-6xl max-h-[92vh] bg-[#12100e] border border-[#2d2822] rounded-xl overflow-hidden flex flex-col lg:flex-row shadow-2xl">
        
        {/* Top bar controls for mobile / modal close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-[#1b1916]/80 border border-[#3b352e] text-[#c5a880] hover:text-white flex items-center justify-center transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Area: Visual Stage (Canvas / In-Room Preview) */}
        <div className="flex-1 bg-[#090807] relative min-h-[380px] lg:min-h-[580px] flex items-center justify-center overflow-hidden p-6 sm:p-8 select-none">
          
          {/* View mode toggle button */}
          <div className="absolute top-4 left-4 z-10 flex items-center gap-1 bg-[#1a1714]/90 border border-[#38322a] rounded-lg p-1">
            <button
              onClick={() => { setViewMode('canvas'); setZoomLevel(1); }}
              className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                viewMode === 'canvas' ? 'bg-[#c5a880] text-[#12100e]' : 'text-[#a39c92] hover:text-[#f4efe8]'
              }`}
            >
              Artwork Detail
            </button>
            <button
              onClick={() => { setViewMode('in_room'); setZoomLevel(1); }}
              className={`px-3 py-1 text-xs font-medium rounded transition-colors flex items-center gap-1.5 ${
                viewMode === 'in_room' ? 'bg-[#c5a880] text-[#12100e]' : 'text-[#a39c92] hover:text-[#f4efe8]'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>View in Room</span>
            </button>
          </div>

          {/* Zoom controls (only in canvas mode) */}
          {viewMode === 'canvas' && (
            <div className="absolute bottom-4 left-4 z-10 flex items-center gap-1 bg-[#1a1714]/80 border border-[#38322a] rounded-lg p-1 text-xs text-[#b8b0a5]">
              <button
                onClick={handleZoomOut}
                disabled={zoomLevel <= 1}
                className="p-1.5 hover:text-white disabled:opacity-30 transition-opacity"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="px-2 text-[11px] font-mono">{Math.round(zoomLevel * 100)}%</span>
              <button
                onClick={handleZoomIn}
                disabled={zoomLevel >= 2.8}
                className="p-1.5 hover:text-white disabled:opacity-30 transition-opacity"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              {zoomLevel > 1 && (
                <button
                  onClick={handleResetZoom}
                  className="p-1.5 hover:text-white border-l border-[#38322a] ml-1 pl-2"
                  title="Reset Zoom"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}

          {/* Main Visual Display */}
          {viewMode === 'canvas' ? (
            <div 
              className="relative max-w-full max-h-[70vh] flex items-center justify-center transition-transform duration-200"
              style={{ transform: `scale(${zoomLevel})` }}
            >
              <img
                src={artwork.imageUrl}
                alt={artwork.title}
                className="max-h-[68vh] w-auto max-w-full object-contain shadow-2xl rounded-sm border border-[#2b251f]"
              />
            </div>
          ) : (
            /* In-Room Collector Wall Preview */
            <div className="relative w-full h-[480px] bg-[#22201e] rounded-lg overflow-hidden border border-[#38322a] flex flex-col justify-between items-center p-8">
              {/* Gallery wall molding & ambient lighting */}
              <div className="absolute top-0 inset-x-0 h-10 bg-gradient-to-b from-black/40 to-transparent" />
              <div className="w-48 h-1 bg-[#151412] rounded mb-6" />

              {/* Painting mounted on wall with cast shadow */}
              <div className="relative z-10 flex flex-col items-center">
                <div className="p-3 bg-[#171412] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.85)] border-2 border-[#826b48] rounded-sm">
                  <img
                    src={artwork.imageUrl}
                    alt={artwork.title}
                    className="h-56 sm:h-64 object-contain"
                  />
                </div>
                <div className="mt-3 text-[11px] tracking-wider text-[#9e968b] uppercase font-sans">
                  Gallery Scale · {artwork.dimensions}
                </div>
              </div>

              {/* Museum bench / floor line */}
              <div className="w-full flex flex-col items-center relative z-10">
                <div className="w-72 h-4 bg-[#141210] rounded-sm border-t border-[#3b352e] shadow-lg" />
                <div className="flex gap-40 -mt-1">
                  <div className="w-2 h-7 bg-[#141210]" />
                  <div className="w-2 h-7 bg-[#141210]" />
                </div>
                <div className="w-full h-8 bg-gradient-to-t from-[#0e0c0b] to-[#1c1917] mt-2 border-t border-[#2e2a25]" />
              </div>
            </div>
          )}
        </div>

        {/* Right Area: Curation Details & Actions */}
        <div className="w-full lg:w-[420px] bg-[#141210] p-6 sm:p-8 flex flex-col justify-between overflow-y-auto border-t lg:border-t-0 lg:border-l border-[#29241f] max-h-[85vh]">
          <div className="space-y-6">
            
            {/* Header info */}
            <div>
              <div className="flex items-center gap-2 text-xs text-[#a39c92] mb-1.5">
                <span className="capitalize">{artwork.category.replace('_', ' ')}</span>
                <span aria-hidden="true">·</span>
                <span>{artwork.year}</span>
                <span aria-hidden="true">·</span>
                <span className={
                  artwork.status === 'available'
                    ? 'text-emerald-400 font-medium'
                    : artwork.status === 'commissioned'
                    ? 'text-[#c5a880]'
                    : 'text-[#8f887d]'
                }>
                  {artwork.status === 'available'
                    ? 'Available for Acquisition'
                    : artwork.status === 'commissioned'
                    ? 'Private Commission'
                    : 'Private Collection'}
                </span>
              </div>

              <h2 className="font-serif text-2xl sm:text-3xl text-[#f5f1eb] font-normal leading-snug">
                {artwork.title}
              </h2>

              <p className="text-xs text-[#b8b0a5] mt-1.5">
                {artwork.dimensions} ({artwork.dimensionsCm})
              </p>
            </div>

            {/* Price / Location */}
            <div className="p-3 bg-[#1c1916] rounded-lg border border-[#302a24] flex items-center justify-between">
              <div>
                <span className="text-[11px] text-[#8f887d] block uppercase tracking-wider">
                  {artwork.status === 'available' ? 'Acquisition Price' : 'Provenance'}
                </span>
                <span className="font-serif text-xl text-[#f4efe8]">
                  {artwork.status === 'available' ? `$${artwork.price?.toLocaleString()} USD` : artwork.collectorLocation}
                </span>
              </div>
              {artwork.status === 'available' && (
                <button
                  onClick={() => setInquired(true)}
                  className="px-3.5 py-1.5 bg-[#2b251f] hover:bg-[#383129] border border-[#4a4237] text-xs font-medium text-[#f4efe8] rounded transition-colors"
                >
                  {inquired ? 'Inquiry Recorded' : 'Acquire Original'}
                </button>
              )}
            </div>

            {inquired && (
              <div className="p-3 bg-emerald-950/40 border border-emerald-800/60 rounded text-xs text-emerald-200 flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Thank you! Elena Vance Atelier will contact you with provenance documents and private courier options.</span>
              </div>
            )}

            {/* Story & Context */}
            <div className="space-y-2">
              <h4 className="text-xs font-medium uppercase tracking-wider text-[#9e968b] flex items-center gap-1.5">
                <span>Artwork Narrative</span>
              </h4>
              <p className="text-xs sm:text-sm text-[#cac3b7] leading-relaxed font-light">
                {artwork.story}
              </p>
            </div>

            {/* Technique & Surface details */}
            <div className="space-y-3 pt-2 border-t border-[#26211c]">
              <div className="text-xs">
                <span className="text-[#8f887d] block">Surface & Support:</span>
                <span className="text-[#dfd9d0]">{artwork.surface}</span>
              </div>

              <div className="text-xs">
                <span className="text-[#8f887d] block">Technique & Medium:</span>
                <span className="text-[#dfd9d0]">{artwork.technique}</span>
              </div>

              {/* Master pigments */}
              <div>
                <span className="text-xs text-[#8f887d] block mb-1.5">Pigment Palette Used:</span>
                <div className="flex flex-wrap gap-1.5">
                  {artwork.palettePaints.map((paint, idx) => (
                    <span
                      key={idx}
                      className="text-[11px] px-2 py-0.5 bg-[#1f1c19] text-[#b8b0a5] rounded border border-[#332c25]"
                    >
                      {paint}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Certificate guarantee */}
            <div className="flex items-center gap-2 text-xs text-[#8f887d] pt-1">
              <ShieldCheck className="w-4 h-4 text-[#c5a880]" />
              <span>Includes Embossed Certificate of Authenticity signed by the artist</span>
            </div>
          </div>

          {/* Bottom CTA: Commission a similar piece */}
          <div className="pt-6 mt-6 border-t border-[#26211c]">
            <button
              onClick={() => {
                onClose();
                onCommissionSimilar(artwork);
              }}
              className="w-full flex items-center justify-center gap-2 py-3 bg-[#c5a880] hover:bg-[#d5bba0] text-[#12100e] font-medium text-xs sm:text-sm rounded-md transition-colors shadow"
            >
              <Paintbrush className="w-4 h-4" />
              <span>Commission a Piece Like This</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <p className="text-[11px] text-center text-[#736c61] mt-2">
              Select your own dimensions, subject & schedule consultation
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};
