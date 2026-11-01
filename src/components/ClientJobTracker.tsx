import React, { useState } from 'react';
import { 
  Search, 
  CheckCircle2, 
  Circle, 
  Clock, 
  ShieldCheck, 
  Send, 
  MapPin, 
  FileText, 
  Award,
  Check,
  Paintbrush
} from 'lucide-react';
import { ActiveJob } from '../types/painting';
import { SAMPLE_ACTIVE_JOBS } from '../data/housePaintingData';

interface ClientJobTrackerProps {
  customJobs: ActiveJob[];
  initialTrackingCode?: string;
}

export const ClientJobTracker: React.FC<ClientJobTrackerProps> = ({
  customJobs,
  initialTrackingCode = '',
}) => {
  const allJobs = [...SAMPLE_ACTIVE_JOBS, ...customJobs];

  const [inputCode, setInputCode] = useState<string>(
    initialTrackingCode || allJobs[0]?.trackingCode || 'JOB-2026-4912'
  );
  const [activeJob, setActiveJob] = useState<ActiveJob | null>(
    allJobs.find((j) => j.trackingCode.toLowerCase() === inputCode.toLowerCase()) || allJobs[0] || null
  );

  const [clientMessage, setClientMessage] = useState<string>('');
  const [messageSent, setMessageSent] = useState<boolean>(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const found = allJobs.find(
      (j) => j.trackingCode.toLowerCase().trim() === inputCode.toLowerCase().trim()
    );
    if (found) {
      setActiveJob(found);
      setMessageSent(false);
    } else {
      alert(`No active painting job found with code "${inputCode}". Try sample code "JOB-2026-4912" or "JOB-2026-5088".`);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientMessage.trim()) return;
    setMessageSent(true);
    setClientMessage('');
    setTimeout(() => setMessageSent(false), 4000);
  };

  return (
    <section id="tracker" className="py-16 md:py-24 bg-[#0a0d14] min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header & Search */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="text-xs uppercase tracking-wider text-[#38bdf8] font-bold">
            Homeowner Project Hub
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white">
            Live House Painting Job Tracker
          </h2>
          <p className="text-xs sm:text-sm text-[#94a3b8]">
            Follow daily progress from floor masking and spackle prep to final ceiling cut-ins and warranty inspection.
          </p>

          {/* Search form */}
          <form onSubmit={handleSearch} className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-2 max-w-md mx-auto">
            <div className="relative w-full">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#64748b]" />
              <input
                type="text"
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value)}
                placeholder="Enter Job Code (e.g. JOB-2026-4912)"
                className="w-full pl-9 pr-3 py-2.5 bg-[#111726] border border-[#202d45] rounded-lg text-xs text-white placeholder-[#64748b] focus:outline-none focus:border-[#38bdf8]"
              />
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto px-5 py-2.5 bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold text-xs rounded-lg transition-colors shrink-0"
            >
              Track Project
            </button>
          </form>

          {/* Quick presets */}
          <div className="flex items-center justify-center gap-2 text-xs text-[#64748b] pt-1">
            <span>Sample Jobs:</span>
            {allJobs.slice(0, 2).map((j) => (
              <button
                key={j.trackingCode}
                onClick={() => {
                  setInputCode(j.trackingCode);
                  setActiveJob(j);
                }}
                className="text-[#38bdf8] hover:underline font-mono text-[11px]"
              >
                {j.trackingCode}
              </button>
            ))}
          </div>
        </div>

        {activeJob ? (
          <div className="space-y-8">
            
            {/* Overview Card */}
            <div className="bg-[#111726] border border-[#202d45] rounded-2xl p-6 sm:p-8 shadow-xl">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-[#1b263b]">
                
                <div>
                  <div className="flex items-center gap-2 text-xs text-[#94a3b8] mb-1">
                    <span className="font-mono text-[#38bdf8] font-bold">{activeJob.trackingCode}</span>
                    <span aria-hidden="true">·</span>
                    <span>Homeowner: {activeJob.clientName}</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-white">
                    {activeJob.projectTitle}
                  </h3>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#94a3b8] mt-2">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#38bdf8]" />
                      {activeJob.address}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>Paint: {activeJob.paintBrandColor}</span>
                  </div>
                </div>

                {/* Status Indicator */}
                <div className="flex items-center gap-5 bg-[#0e1422] p-4 rounded-xl border border-[#1b263b]">
                  <div className="text-right">
                    <span className="text-[10px] uppercase text-[#64748b] block font-bold">Estimated Finish</span>
                    <span className="text-xs sm:text-sm font-bold text-white">
                      {activeJob.estimatedCompletionDate}
                    </span>
                    <span className="text-[11px] text-emerald-400 font-semibold block mt-0.5 capitalize">
                      Phase: {activeJob.currentPhase.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <div className="w-16 h-16 rounded-full border-4 border-[#1b263b] border-t-[#38bdf8] flex items-center justify-center font-bold text-sm text-white">
                    {activeJob.percentComplete}%
                  </div>
                </div>

              </div>

              {/* Progress bar */}
              <div className="pt-6">
                <div className="flex items-center justify-between text-xs text-[#94a3b8] mb-2 font-medium">
                  <span>Job Progress</span>
                  <span>{activeJob.percentComplete}% Complete</span>
                </div>
                <div className="w-full h-2.5 bg-[#0e1422] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-[#0284c7] to-[#38bdf8] transition-all duration-700 rounded-full"
                    style={{ width: `${activeJob.percentComplete}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Milestones & Painter Log */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: Timeline Steps */}
              <div className="lg:col-span-8 bg-[#111726] border border-[#202d45] rounded-2xl p-6 sm:p-8 space-y-6">
                <h4 className="text-lg font-bold text-white flex items-center justify-between">
                  <span>On-Site Daily Work Log</span>
                  <span className="text-xs text-[#94a3b8] font-normal">
                    Logged by Lead House Painter
                  </span>
                </h4>

                <div className="relative pl-6 sm:pl-8 space-y-7 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#1b263b]">
                  {activeJob.updates.map((update, idx) => (
                    <div key={idx} className="relative group">
                      <div className="absolute -left-6 sm:-left-8 top-1">
                        {update.completed ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-400 bg-[#111726] rounded-full" />
                        ) : (
                          <Circle className="w-5 h-5 text-[#334460] bg-[#111726] rounded-full" />
                        )}
                      </div>

                      <div className="space-y-1">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-1">
                          <span className={`font-bold ${update.completed ? 'text-white' : 'text-[#64748b]'}`}>
                            {update.title}
                          </span>
                          <span className="text-[#64748b] font-mono text-[11px]">{update.date}</span>
                        </div>
                        <p className="text-xs text-[#94a3b8] leading-relaxed">
                          {update.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Warranty & Direct Message */}
              <div className="lg:col-span-4 space-y-6">
                
                {/* 3-Year Warranty Certificate Box */}
                <div className="bg-[#111726] border border-[#202d45] rounded-2xl p-5 space-y-3">
                  <div className="flex items-center gap-2 text-xs text-emerald-400 font-bold uppercase tracking-wider">
                    <ShieldCheck className="w-4 h-4" />
                    <span>3-Year Peeling Warranty</span>
                  </div>
                  <p className="text-xs text-[#94a3b8]">
                    This project is backed by our full 3-year guarantee against blistering, cracking, or peeling paint due to prep flaws.
                  </p>
                  <div className="p-3 bg-[#0d1422] rounded-lg border border-[#1b263b] text-xs font-mono text-[#cbd5e1] flex items-center justify-between">
                    <span>Warranty Status:</span>
                    <span className="text-emerald-400 font-bold">Active & Insured</span>
                  </div>
                </div>

                {/* Message Contractor */}
                <div className="bg-[#111726] border border-[#202d45] rounded-2xl p-5 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
                    <Send className="w-3.5 h-3.5 text-[#38bdf8]" />
                    <span>Message Your Lead Painter</span>
                  </h4>
                  <p className="text-xs text-[#94a3b8]">
                    Need to add a closet or ask about arrival timing tomorrow morning? Messages ping our crew foreman directly.
                  </p>

                  <form onSubmit={handleSendMessage} className="space-y-2">
                    <textarea
                      rows={3}
                      placeholder="Write your note to the crew..."
                      value={clientMessage}
                      onChange={(e) => setClientMessage(e.target.value)}
                      className="w-full p-2.5 bg-[#0d1422] border border-[#1b263b] rounded-lg text-xs text-white placeholder-[#64748b] focus:outline-none focus:border-[#38bdf8]"
                    />
                    <button
                      type="submit"
                      className="w-full py-2 bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold text-xs rounded-lg transition-colors"
                    >
                      Send Message to Crew
                    </button>
                  </form>

                  {messageSent && (
                    <div className="p-2.5 bg-emerald-950/60 border border-emerald-800 rounded text-xs text-emerald-300 flex items-center gap-1.5">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Message sent to lead painter!</span>
                    </div>
                  )}
                </div>

              </div>

            </div>

          </div>
        ) : null}

      </div>
    </section>
  );
};
