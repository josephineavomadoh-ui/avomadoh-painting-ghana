import React, { useState, useMemo } from 'react';
import { Eye, ArrowRight, PaintRoller, Sparkles, CheckCircle2, ShieldCheck } from 'lucide-react';
import { CompletedProject, ServiceCategory } from '../types/painting';
import { COMPLETED_PROJECTS } from '../data/housePaintingData';

interface ProjectsGalleryProps {
  onSelectProject: (project: CompletedProject) => void;
  onBookSimilar: (project: CompletedProject) => void;
}

export const ProjectsGallery: React.FC<ProjectsGalleryProps> = ({
  onSelectProject,
  onBookSimilar,
}) => {
  const [activeCategory, setActiveCategory] = useState<ServiceCategory>('all');

  const categories: { id: ServiceCategory; label: string }[] = [
    { id: 'all', label: 'All Projects' },
    { id: 'interior_rooms', label: 'Interior Rooms' },
    { id: 'cabinets', label: 'Kitchen Cabinets' },
    { id: 'exterior_house', label: 'Exterior Homes' },
  ];

  const filteredProjects = useMemo(() => {
    if (activeCategory === 'all') return COMPLETED_PROJECTS;
    return COMPLETED_PROJECTS.filter((p) => p.category === activeCategory);
  }, [activeCategory]);

  return (
    <section id="work" className="py-16 md:py-24 bg-[#0d111a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#1f293d]">
          <div>
            <div className="text-xs uppercase tracking-wider text-[#38bdf8] font-bold mb-2">
              Craftsmanship Showcase & Transformations
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl text-white font-extrabold tracking-tight">
              Recent Interior & Exterior Paint Work
            </h2>
          </div>
          <p className="text-sm text-[#94a3b8] max-w-md font-normal leading-relaxed">
            See the difference professional prep makes. Clean lines, zero roller streaks, and durable finishes designed to withstand daily family life.
          </p>
        </div>

        {/* Category Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none p-1 bg-[#121826] border border-[#202b40] rounded-xl max-w-fit">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors ${
                activeCategory === cat.id
                  ? 'bg-[#0284c7] text-white shadow-sm'
                  : 'text-[#94a3b8] hover:text-white hover:bg-[#1a2336]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredProjects.map((project) => (
            <article
              key={project.id}
              className="group bg-[#121929] border border-[#202d45] hover:border-[#38bdf8]/60 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-2xl flex flex-col justify-between"
            >
              {/* Photo Area */}
              <div 
                className="relative aspect-[16/10] bg-[#090d15] overflow-hidden cursor-pointer"
                onClick={() => onSelectProject(project)}
              >
                <img
                  src={project.imageUrl}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectProject(project);
                    }}
                    className="px-4 py-2 bg-[#121929]/95 text-white rounded-lg text-xs font-semibold border border-[#38bdf8]/40 hover:bg-[#0284c7] transition-colors flex items-center gap-1.5"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Inspect Finish & Prep Details</span>
                  </button>
                </div>

                <div className="absolute top-3 right-3">
                  <span className="text-[11px] font-bold text-white bg-[#0e1626]/90 backdrop-blur-md border border-[#263552] px-2.5 py-1 rounded">
                    {project.completionDays} Days
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2 text-xs text-[#94a3b8]">
                    <span className="font-semibold text-[#38bdf8]">{project.roomType}</span>
                    <span aria-hidden="true">·</span>
                    <span>{project.sqFt} sq. ft.</span>
                    <span aria-hidden="true">·</span>
                    <span>{project.clientCity}</span>
                  </div>

                  <h3 
                    onClick={() => onSelectProject(project)}
                    className="text-xl sm:text-2xl font-bold text-white group-hover:text-[#38bdf8] cursor-pointer transition-colors"
                  >
                    {project.title}
                  </h3>

                  <p className="text-xs text-[#94a3b8] line-clamp-2 leading-relaxed">
                    {project.description}
                  </p>

                  {/* Paint Color & Sheen Badge */}
                  <div className="p-3 bg-[#0d1422] rounded-lg border border-[#1b263b] text-xs flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-[#64748b] uppercase font-bold block">Applied Paint</span>
                      <span className="text-[#e2e8f0] font-medium">{project.colorName}</span>
                    </div>
                    <span className="text-xs text-[#38bdf8] font-mono">{project.sheen}</span>
                  </div>
                </div>

                {/* Footer Controls */}
                <div className="pt-4 border-t border-[#1a253a] flex items-center justify-between text-xs">
                  <button
                    onClick={() => onSelectProject(project)}
                    className="text-[#94a3b8] hover:text-white transition-colors"
                  >
                    View Prep Breakdown &rarr;
                  </button>

                  <button
                    onClick={() => onBookSimilar(project)}
                    className="px-4 py-2 bg-[#19243a] hover:bg-[#0284c7] text-[#38bdf8] hover:text-white rounded-lg font-semibold transition-colors flex items-center gap-1.5"
                  >
                    <span>Get Room Quote</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

      </div>
    </section>
  );
};
