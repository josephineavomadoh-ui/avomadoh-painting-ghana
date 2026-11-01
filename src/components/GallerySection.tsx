import React, { useState, useMemo } from 'react';
import { Search, Eye, Paintbrush, SlidersHorizontal, Sparkles } from 'lucide-react';
import { Artwork, ArtworkCategory } from '../types/art';
import { ARTWORKS } from '../data/artworksData';

interface GallerySectionProps {
  onSelectArtwork: (artwork: Artwork) => void;
  onCommissionArtwork: (artwork: Artwork) => void;
}

export const GallerySection: React.FC<GallerySectionProps> = ({
  onSelectArtwork,
  onCommissionArtwork,
}) => {
  const [activeCategory, setActiveCategory] = useState<ArtworkCategory>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showAvailableOnly, setShowAvailableOnly] = useState<boolean>(false);

  const categories: { id: ArtworkCategory; label: string }[] = [
    { id: 'all', label: 'All Works' },
    { id: 'portrait', label: 'Portraits' },
    { id: 'landscape', label: 'Landscapes' },
    { id: 'still_life', label: 'Still Life' },
    { id: 'botanical', label: 'Botanicals' },
    { id: 'plein_air', label: 'Plein Air' },
    { id: 'pet', label: 'Pet Portraits' },
  ];

  const filteredArtworks = useMemo(() => {
    return ARTWORKS.filter((art) => {
      const matchesCategory = activeCategory === 'all' || art.category === activeCategory;
      const matchesAvailable = !showAvailableOnly || art.status === 'available';
      const matchesQuery =
        !searchQuery ||
        art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.medium.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.technique.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.palettePaints.some((p) => p.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesCategory && matchesAvailable && matchesQuery;
    });
  }, [activeCategory, showAvailableOnly, searchQuery]);

  return (
    <section id="gallery" className="py-16 md:py-24 bg-[#0d0c0b]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-6 border-b border-[#25211c]">
          <div>
            <div className="text-xs uppercase tracking-[0.25em] text-[#c5a880] mb-2 font-medium">
              Curated Portfolio & Archive
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#f5f1eb] font-normal">
              Original Works in Oil & Linen
            </h2>
          </div>
          <p className="text-sm text-[#9e968b] max-w-md mt-3 md:mt-0 font-light">
            Every piece is executed with artist-grade pigments, hand-prepared grounds, and centuries-tested oil glazing methods to ensure generational longevity.
          </p>
        </div>

        {/* Filter Controls & Search Bar */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 mb-10">
          
          {/* Segmented Category Filter (functional button tabs) */}
          <div className="flex items-center gap-1 overflow-x-auto pb-2 lg:pb-0 scrollbar-none p-1 bg-[#141210] border border-[#26221d] rounded-lg">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                  activeCategory === cat.id
                    ? 'bg-[#c5a880] text-[#12100e] shadow-sm'
                    : 'text-[#9c958b] hover:text-[#f4efe8] hover:bg-[#1f1b17]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search & Available toggle */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#736c62]" />
              <input
                type="text"
                placeholder="Search medium, pigment, title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-[#141210] border border-[#2b2620] rounded-lg text-xs text-[#f5f1eb] placeholder-[#6b6459] focus:outline-none focus:border-[#c5a880]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-[#827a6f] hover:text-[#f5f1eb]"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Available Only Toggle */}
            <label className="flex items-center gap-2 text-xs text-[#9c958b] cursor-pointer select-none px-2 py-1.5 bg-[#141210] border border-[#2b2620] rounded-lg shrink-0 w-full sm:w-auto justify-between sm:justify-start">
              <span>Available for Acquisition</span>
              <input
                type="checkbox"
                checked={showAvailableOnly}
                onChange={(e) => setShowAvailableOnly(e.target.checked)}
                className="w-4 h-4 rounded border-[#383229] accent-[#c5a880]"
              />
            </label>
          </div>
        </div>

        {/* Artworks Grid */}
        {filteredArtworks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArtworks.map((artwork) => (
              <article
                key={artwork.id}
                className="group flex flex-col bg-[#12100e] border border-[#26221d] hover:border-[#423b32] rounded-lg overflow-hidden transition-all duration-300 hover:shadow-xl"
              >
                {/* Image Container with Hover Inspect */}
                <div 
                  className="relative aspect-[4/3] bg-[#0a0908] overflow-hidden cursor-pointer"
                  onClick={() => onSelectArtwork(artwork)}
                >
                  <img
                    src={artwork.imageUrl}
                    alt={artwork.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 p-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectArtwork(artwork);
                      }}
                      className="px-3.5 py-2 bg-[#1b1916]/90 text-white rounded text-xs font-medium border border-[#4a4237] hover:bg-[#c5a880] hover:text-[#12100e] transition-colors flex items-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Zoom & In-Room View</span>
                    </button>
                  </div>

                  {/* Status Indicator */}
                  <div className="absolute top-3 right-3">
                    <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded backdrop-blur-md ${
                      artwork.status === 'available'
                        ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-700/50'
                        : artwork.status === 'commissioned'
                        ? 'bg-[#1e1b18]/80 text-[#c5a880] border border-[#4d4233]'
                        : 'bg-black/70 text-[#9e968b] border border-[#302c27]'
                    }`}>
                      {artwork.status === 'available' ? 'Available' : artwork.status === 'commissioned' ? 'Commissioned' : 'Private'}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    {/* Unboxed Metadata with typographic separator */}
                    <div className="flex items-center gap-2 text-xs text-[#8f887d] mb-1.5">
                      <span className="capitalize">{artwork.category.replace('_', ' ')}</span>
                      <span aria-hidden="true">·</span>
                      <span>{artwork.year}</span>
                      <span aria-hidden="true">·</span>
                      <span>{artwork.dimensions}</span>
                    </div>

                    <h3 
                      onClick={() => onSelectArtwork(artwork)}
                      className="font-serif text-xl sm:text-2xl text-[#f4efe8] hover:text-[#c5a880] cursor-pointer transition-colors leading-snug"
                    >
                      {artwork.title}
                    </h3>

                    <p className="text-xs text-[#a39c92] line-clamp-2 mt-2 leading-relaxed">
                      {artwork.story}
                    </p>
                  </div>

                  {/* Footer & Actions */}
                  <div className="pt-3 border-t border-[#201d19] flex items-center justify-between text-xs">
                    <div>
                      {artwork.status === 'available' ? (
                        <div>
                          <span className="text-[10px] uppercase text-[#736c61] block">Acquisition</span>
                          <span className="font-serif text-lg text-[#f5f1eb] font-medium">
                            ${artwork.price?.toLocaleString()}
                          </span>
                        </div>
                      ) : (
                        <div>
                          <span className="text-[10px] uppercase text-[#736c61] block">Provenance</span>
                          <span className="text-[#a8a196] italic text-xs">
                            {artwork.collectorLocation}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onSelectArtwork(artwork)}
                        className="px-2.5 py-1 text-[#b5ada1] hover:text-white transition-colors"
                        title="View details"
                      >
                        Details
                      </button>
                      <button
                        onClick={() => onCommissionArtwork(artwork)}
                        className="px-3 py-1.5 bg-[#26221d] hover:bg-[#c5a880] hover:text-[#12100e] text-[#c5a880] border border-[#3d362d] rounded text-xs font-medium transition-colors flex items-center gap-1"
                      >
                        <Paintbrush className="w-3 h-3" />
                        <span>Commission Similar</span>
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          /* Empty search state */
          <div className="py-16 text-center bg-[#141210] border border-[#24211d] rounded-xl p-8 max-w-md mx-auto">
            <p className="text-[#cac3b7] text-sm">No artworks match your selected filters.</p>
            <button
              onClick={() => {
                setActiveCategory('all');
                setSearchQuery('');
                setShowAvailableOnly(false);
              }}
              className="mt-4 px-4 py-2 bg-[#c5a880] text-[#12100e] text-xs font-medium rounded hover:bg-[#d5bba0] transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}

      </div>
    </section>
  );
};
