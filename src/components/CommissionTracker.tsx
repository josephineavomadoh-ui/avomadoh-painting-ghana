import React, { useState } from 'react';
import { 
  Search, 
  CheckCircle2, 
  Circle, 
  Clock, 
  ShieldCheck, 
  Award, 
  Send, 
  Package, 
  FileText, 
  Sparkles,
  Info,
  Check
} from 'lucide-react';
import { CommissionProject } from '../types/art';
import { SAMPLE_COMMISSION_PROJECTS } from '../data/artworksData';

interface CommissionTrackerProps {
  customProjects: CommissionProject[];
  initialTrackingId?: string;
}

export const CommissionTracker: React.FC<CommissionTrackerProps> = ({
  customProjects,
  initialTrackingId = '',
}) => {
  const allProjects = [...SAMPLE_COMMISSION_PROJECTS, ...customProjects];

  const [inputTrackingId, setInputTrackingId] = useState<string>(
    initialTrackingId || allProjects[0]?.trackingId || 'COMM-2026-7841'
  );
  const [activeProject, setActiveProject] = useState<CommissionProject | null>(
    allProjects.find((p) => p.trackingId.toLowerCase() === inputTrackingId.toLowerCase()) || allProjects[0] || null
  );

  const [clientMessage, setClientMessage] = useState<string>('');
  const [messageSent, setMessageSent] = useState<boolean>(false);
  const [showCertificate, setShowCertificate] = useState<boolean>(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const found = allProjects.find(
      (p) => p.trackingId.toLowerCase().trim() === inputTrackingId.toLowerCase().trim()
    );
    if (found) {
      setActiveProject(found);
      setMessageSent(false);
    } else {
      alert(`No active commission found with reference "${inputTrackingId}". Try "COMM-2026-7841" or "COMM-2026-8022".`);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientMessage.trim()) return;
    setMessageSent(true);
    setClientMessage('');
    setTimeout(() => setMessageSent(false), 5000);
  };

  return (
    <section id="tracker" className="py-16 md:py-24 bg-[#0a0908] min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header & Search Bar */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="text-xs uppercase tracking-[0.25em] text-[#c5a880] font-medium">
            Client Atelier Portal
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#f4efe8]">
            Live Commission Progress Tracker
          </h2>
          <p className="text-xs sm:text-sm text-[#9c958b] font-light">
            Follow your painting from initial tone studies to final varnish curing and archival crating.
          </p>

          {/* Tracking ID Search Form */}
          <form onSubmit={handleSearch} className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-2 max-w-md mx-auto">
            <div className="relative w-full">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#736c61]" />
              <input
                type="text"
                value={inputTrackingId}
                onChange={(e) => setInputTrackingId(e.target.value)}
                placeholder="Enter Commission ID (e.g. COMM-2026-7841)"
                className="w-full pl-9 pr-3 py-2.5 bg-[#141210] border border-[#332c25] rounded-lg text-xs text-[#f5f1eb] placeholder-[#6b6459] focus:outline-none focus:border-[#c5a880]"
              />
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto px-5 py-2.5 bg-[#c5a880] hover:bg-[#d5bba0] text-[#12100e] font-semibold text-xs rounded-lg transition-colors shrink-0"
            >
              Track Artwork
            </button>
          </form>

          {/* Quick preset chips for demonstration */}
          <div className="flex items-center justify-center gap-2 text-xs text-[#7d766b] pt-1">
            <span>Sample Orders:</span>
            {allProjects.slice(0, 2).map((p) => (
              <button
                key={p.trackingId}
                onClick={() => {
                  setInputTrackingId(p.trackingId);
                  setActiveProject(p);
                }}
                className="hover:text-[#c5a880] underline font-mono text-[11px]"
              >
                {p.trackingId}
              </button>
            ))}
          </div>
        </div>

        {activeProject ? (
          <div className="space-y-8">
            
            {/* Project Overview Card */}
            <div className="bg-[#12100e] border border-[#2b251f] rounded-xl p-6 sm:p-8 shadow-xl">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-[#241f1a]">
                
                <div>
                  <div className="flex items-center gap-2 text-xs text-[#a39c92] mb-1">
                    <span className="font-mono text-[#c5a880]">{activeProject.trackingId}</span>
                    <span aria-hidden="true">·</span>
                    <span>Client: {activeProject.clientName}</span>
                  </div>
                  <h3 className="font-serif text-2xl sm:text-3xl text-[#f4efe8]">
                    {activeProject.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#8f887d] mt-2">
                    <span>{activeProject.medium}</span>
                    <span aria-hidden="true">·</span>
                    <span>{activeProject.dimensions}</span>
                    <span aria-hidden="true">·</span>
                    <span>Framing: {activeProject.framing}</span>
                  </div>
                </div>

                {/* Progress Circle & Completion Date */}
                <div className="flex items-center gap-5 bg-[#171513] p-4 rounded-lg border border-[#2e2720]">
                  <div className="text-right">
                    <span className="text-[10px] uppercase text-[#736c61] block">Estimated Delivery</span>
                    <span className="text-xs sm:text-sm font-medium text-[#f4efe8]">
                      {activeProject.targetCompletionDate}
                    </span>
                    <span className="text-[11px] text-[#c5a880] block mt-0.5">
                      Stage: {activeProject.currentStage.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>

                  <div className="w-16 h-16 rounded-full border-4 border-[#2b251f] border-t-[#c5a880] flex items-center justify-center font-bold text-sm text-[#f5f1eb]">
                    {activeProject.stageProgressPercent}%
                  </div>
                </div>

              </div>

              {/* Linear Progress Bar */}
              <div className="pt-6">
                <div className="flex items-center justify-between text-xs text-[#8f887d] mb-2">
                  <span>Overall Studio Progress</span>
                  <span>{activeProject.stageProgressPercent}% Complete</span>
                </div>
                <div className="w-full h-2 bg-[#1b1815] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-[#8a6b47] to-[#c5a880] transition-all duration-700 rounded-full"
                    style={{ width: `${activeProject.stageProgressPercent}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Timeline Milestones & Studio Journal */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: Timeline Steps */}
              <div className="lg:col-span-8 bg-[#12100e] border border-[#29231d] rounded-xl p-6 sm:p-8 space-y-6">
                <h4 className="font-serif text-xl text-[#f4efe8] flex items-center justify-between">
                  <span>Creation Milestones & Studio Log</span>
                  <span className="text-xs font-sans text-[#7d766b] font-normal">
                    Logged by Atelier Vance
                  </span>
                </h4>

                <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#26201a]">
                  {activeProject.updates.map((update, idx) => (
                    <div key={idx} className="relative group">
                      {/* Timeline dot */}
                      <div className="absolute -left-6 sm:-left-8 top-1">
                        {update.completed ? (
                          <CheckCircle2 className="w-5 h-5 text-[#c5a880] bg-[#12100e] rounded-full" />
                        ) : (
                          <Circle className="w-5 h-5 text-[#423a30] bg-[#12100e] rounded-full" />
                        )}
                      </div>

                      <div className="space-y-1">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-1">
                          <span className={`font-semibold ${update.completed ? 'text-[#f4efe8]' : 'text-[#8f887d]'}`}>
                            {update.title}
                          </span>
                          <span className="text-[#6e675b] font-mono text-[11px]">{update.date}</span>
                        </div>
                        <p className="text-xs text-[#a8a196] leading-relaxed font-light">
                          {update.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Oil paint drying & curing educational note */}
                <div className="p-4 bg-[#171412] border border-[#2d261f] rounded-lg flex items-start gap-3 text-xs text-[#8f887d]">
                  <Info className="w-4 h-4 text-[#c5a880] shrink-0 mt-0.5" />
                  <p className="leading-relaxed">
                    <strong className="text-[#cfc7bc] font-medium">Oil Paint Drying Note:</strong> Oil paint cures via atmospheric oxidation rather than water evaporation. Impasto layers require 10 to 14 days before archival Dammar or Gamvar varnish can be applied without disturbing the paint film.
                  </p>
                </div>
              </div>

              {/* Right Column: Actions & Communication with Painter */}
              <div className="lg:col-span-4 space-y-6">
                
                {/* Certificate of Authenticity Preview */}
                <div className="bg-[#141210] border border-[#29231d] rounded-xl p-5 space-y-3">
                  <div className="flex items-center gap-2 text-xs text-[#c5a880] font-medium uppercase tracking-wider">
                    <Award className="w-4 h-4" />
                    <span>Certificate of Authenticity</span>
                  </div>
                  <p className="text-xs text-[#9c958b]">
                    Every commission includes a wax-embossed Certificate of Authenticity signed by Elena Vance with permanent archive registration.
                  </p>
                  <div className="p-3 bg-[#1a1714] rounded border border-[#302820] text-xs font-mono text-[#f4efe8] flex items-center justify-between">
                    <span>Archive No:</span>
                    <span className="text-[#c5a880]">{activeProject.certificateNumber}</span>
                  </div>
                  <button
                    onClick={() => setShowCertificate(true)}
                    className="w-full py-2 bg-[#221e1a] hover:bg-[#2e2923] text-[#e8e4df] text-xs font-medium rounded border border-[#3d352b] transition-colors"
                  >
                    View Official Certificate Preview
                  </button>
                </div>

                {/* Direct Message to Artist */}
                <div className="bg-[#141210] border border-[#29231d] rounded-xl p-5 space-y-3">
                  <h4 className="text-xs font-medium uppercase tracking-wider text-[#b8b0a5] flex items-center gap-1.5">
                    <Send className="w-3.5 h-3.5 text-[#c5a880]" />
                    <span>Message Elena Vance</span>
                  </h4>
                  <p className="text-xs text-[#8f887d]">
                    Have a question or detail to share regarding your piece? Messages reach Elena’s atelier inbox directly.
                  </p>

                  <form onSubmit={handleSendMessage} className="space-y-2">
                    <textarea
                      rows={3}
                      placeholder="Write your note to Elena Vance..."
                      value={clientMessage}
                      onChange={(e) => setClientMessage(e.target.value)}
                      className="w-full p-2.5 bg-[#1a1714] border border-[#2b251f] rounded-lg text-xs text-[#f5f1eb] placeholder-[#635c51] focus:outline-none focus:border-[#c5a880]"
                    />
                    <button
                      type="submit"
                      className="w-full py-2 bg-[#c5a880] hover:bg-[#d5bba0] text-[#12100e] font-medium text-xs rounded transition-colors"
                    >
                      Send Studio Note
                    </button>
                  </form>

                  {messageSent && (
                    <div className="p-2.5 bg-emerald-950/60 border border-emerald-800 rounded text-xs text-emerald-300 flex items-center gap-1.5">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Note delivered to Elena Vance Atelier!</span>
                    </div>
                  )}
                </div>

              </div>

            </div>

          </div>
        ) : (
          <div className="text-center py-12 text-[#8f887d]">
            Enter your Commission Reference ID above to load your project tracker.
          </div>
        )}

        {/* Certificate Modal */}
        {showCertificate && activeProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4">
            <div className="bg-[#171412] border-2 border-[#8a6b47] rounded-lg max-w-lg w-full p-8 relative shadow-2xl space-y-6 text-center">
              <div className="w-12 h-12 rounded-full border border-[#c5a880] mx-auto flex items-center justify-center text-[#c5a880]">
                <ShieldCheck className="w-6 h-6" />
              </div>

              <div>
                <span className="text-[10px] uppercase tracking-[0.3em] text-[#a88d67] block">
                  Official Atelier Document
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl text-[#f4efe8] mt-1">
                  Certificate of Authenticity
                </h3>
              </div>

              <div className="p-4 bg-[#12100e] border border-[#2d261e] rounded text-left space-y-2 text-xs">
                <div><span className="text-[#736c61]">Work:</span> <span className="text-[#f4efe8] font-serif text-sm">{activeProject.title}</span></div>
                <div><span className="text-[#736c61]">Medium:</span> <span className="text-[#e8e4df]">{activeProject.medium}</span></div>
                <div><span className="text-[#736c61]">Dimensions:</span> <span className="text-[#e8e4df]">{activeProject.dimensions}</span></div>
                <div><span className="text-[#736c61]">Commissioned By:</span> <span className="text-[#e8e4df]">{activeProject.clientName}</span></div>
                <div><span className="text-[#736c61]">Archive Registry:</span> <span className="font-mono text-[#c5a880]">{activeProject.certificateNumber}</span></div>
              </div>

              <div className="pt-2 text-xs text-[#8f887d] italic">
                “Handmade with artist pigments, cold-pressed walnut oil, and Belgian Claessens linen in the atelier of Elena Vance.”
              </div>

              <button
                onClick={() => setShowCertificate(false)}
                className="px-6 py-2 bg-[#2a241e] hover:bg-[#383129] text-xs font-medium text-[#f4efe8] rounded border border-[#4d4233]"
              >
                Close Certificate
              </button>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
