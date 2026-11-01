import React, { useState } from 'react';
import { 
  X, 
  Calendar, 
  MapPin, 
  Phone, 
  Mail, 
  Check, 
  Layers, 
  Clock, 
  Sliders, 
  PaintRoller,
  Home,
  CheckCircle2
} from 'lucide-react';
import { WalkthroughBooking, ActiveJob, JobPhase } from '../types/painting';

interface PainterDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookings: WalkthroughBooking[];
  activeJobs: ActiveJob[];
  onUpdateJobPhase: (trackingCode: string, newPhase: JobPhase) => void;
  crewSlots: number;
  onUpdateCrewSlots: (slots: number) => void;
}

export const PainterDashboardModal: React.FC<PainterDashboardModalProps> = ({
  isOpen,
  onClose,
  bookings,
  activeJobs,
  onUpdateJobPhase,
  crewSlots,
  onUpdateCrewSlots,
}) => {
  const [activeTab, setActiveTab] = useState<'walkthroughs' | 'jobs' | 'crew'>('walkthroughs');

  if (!isOpen) return null;

  const jobPhases: { phase: JobPhase; label: string }[] = [
    { phase: 'walkthrough_scheduled', label: '1. Walkthrough Booked' },
    { phase: 'quote_approved', label: '2. Quote Approved' },
    { phase: 'colors_finalized', label: '3. Colors Finalized' },
    { phase: 'prep_masking', label: '4. Floor Masking & Patching' },
    { phase: 'primer_sealer', label: '5. Stain Primer' },
    { phase: 'finish_coating', label: '6. Finish Coats & Cut-in' },
    { phase: 'inspection_walkthrough', label: '7. Owner Walkthrough' },
    { phase: 'clean_warranty', label: '8. Complete & Under Warranty' },
  ];

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-3 sm:p-6 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-5xl bg-[#101624] border border-[#23314d] rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 sm:p-6 bg-[#131b2c] border-b border-[#202d45] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0284c7] text-white flex items-center justify-center shadow">
              <PaintRoller className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-white">
                Avomadoh Painting Services — Contractor Admin
              </h3>
              <span className="text-[11px] text-[#94a3b8] uppercase tracking-wider font-semibold">
                Ghana Master House Painter Management Dashboard
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#1b263b] text-[#94a3b8] hover:text-white flex items-center justify-center border border-[#2c3d5d] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="px-6 py-2.5 bg-[#0e1422] border-b border-[#1b273d] flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('walkthroughs')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors flex items-center gap-2 ${
              activeTab === 'walkthroughs'
                ? 'bg-[#0284c7] text-white'
                : 'text-[#94a3b8] hover:text-white hover:bg-[#151e30]'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Scheduled Walkthroughs ({bookings.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('jobs')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors flex items-center gap-2 ${
              activeTab === 'jobs'
                ? 'bg-[#0284c7] text-white'
                : 'text-[#94a3b8] hover:text-white hover:bg-[#151e30]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Active Painting Jobs ({activeJobs.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('crew')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors flex items-center gap-2 ${
              activeTab === 'crew'
                ? 'bg-[#0284c7] text-white'
                : 'text-[#94a3b8] hover:text-white hover:bg-[#151e30]'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Weekly Crew Capacity</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
          
          {/* TAB 1: SCHEDULED WALKTHROUGHS */}
          {activeTab === 'walkthroughs' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs uppercase tracking-wider text-white font-bold">
                  Upcoming On-Site Walkthroughs & Quote Appointments
                </h4>
                <span className="text-xs text-[#94a3b8]">
                  Integrated Calendar Reservations
                </span>
              </div>

              {bookings.length > 0 ? (
                <div className="space-y-3">
                  {bookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="p-5 bg-[#121929] border border-[#202d45] rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-white">{booking.clientName}</span>
                          <span className="font-mono text-[11px] text-[#38bdf8] bg-[#0d1422] px-2 py-0.5 rounded border border-[#1b273d]">
                            {booking.trackingCode}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[#94a3b8]">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-[#38bdf8]" />
                            {booking.streetAddress}, {booking.cityZip}
                          </span>
                          <span className="flex items-center gap-1">
                            <Phone className="w-3.5 h-3.5 text-[#38bdf8]" />
                            {booking.phone}
                          </span>
                          <span className="flex items-center gap-1">
                            <Mail className="w-3.5 h-3.5 text-[#38bdf8]" />
                            {booking.email}
                          </span>
                        </div>

                        <div className="text-[11px] text-[#cbd5e1]">
                          <strong>Scope:</strong> {booking.projectScope.roomCount} Rooms (~{booking.projectScope.estimatedSqFt} sq. ft.) · Est. Range: GH₵ {booking.projectScope.estimatedCostMin.toLocaleString()} – GH₵ {booking.projectScope.estimatedCostMax.toLocaleString()}
                        </div>

                        {booking.notes && (
                          <div className="p-2 bg-[#0e1422] rounded text-[#94a3b8] italic">
                            “{booking.notes}”
                          </div>
                        )}
                      </div>

                      <div className="shrink-0 text-left md:text-right space-y-1">
                        <div className="font-bold text-white text-sm">
                          {booking.date}
                        </div>
                        <div className="text-[#38bdf8] font-semibold">
                          {booking.timeSlot}
                        </div>
                        <div className="text-[11px] text-[#64748b] capitalize">
                          {booking.consultationType.replace(/_/g, ' ')}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center bg-[#121929] border border-[#202d45] rounded-xl text-xs text-[#94a3b8]">
                  No upcoming walkthroughs. Once homeowners submit the online quote estimator, their bookings will appear here instantly.
                </div>
              )}
            </div>
          )}

          {/* TAB 2: ACTIVE JOBS PIPELINE */}
          {activeTab === 'jobs' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs uppercase tracking-wider text-white font-bold">
                  Active Painting Projects On-Site
                </h4>
                <span className="text-xs text-[#94a3b8]">
                  Click to advance phase and update homeowner tracker
                </span>
              </div>

              <div className="space-y-4">
                {activeJobs.map((job) => (
                  <div
                    key={job.trackingCode}
                    className="p-5 bg-[#121929] border border-[#202d45] rounded-xl space-y-4 text-xs"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[#38bdf8] font-bold">{job.trackingCode}</span>
                          <span className="text-[#64748b]">·</span>
                          <span className="font-bold text-white text-sm">{job.projectTitle}</span>
                        </div>
                        <div className="text-[#94a3b8] mt-1">
                          {job.clientName} · {job.address} · {job.paintBrandColor}
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] text-[#64748b] block font-bold uppercase">Estimated Finish</span>
                        <span className="text-xs font-bold text-white">{job.estimatedCompletionDate}</span>
                      </div>
                    </div>

                    {/* Phase Selector */}
                    <div className="space-y-1.5">
                      <span className="text-[11px] font-semibold text-[#cbd5e1] block">
                        Advance Current Phase:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {jobPhases.map((p) => (
                          <button
                            key={p.phase}
                            onClick={() => onUpdateJobPhase(job.trackingCode, p.phase)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                              job.currentPhase === p.phase
                                ? 'bg-[#0284c7] text-white border-[#0284c7]'
                                : 'bg-[#0e1422] text-[#94a3b8] border-[#1e2a42] hover:border-[#2f4063]'
                            }`}
                          >
                            {p.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: CREW CAPACITY */}
          {activeTab === 'crew' && (
            <div className="space-y-6 max-w-lg">
              <div>
                <h4 className="text-xs uppercase tracking-wider text-white font-bold mb-1">
                  Weekly Booking Slots Controller
                </h4>
                <p className="text-xs text-[#94a3b8]">
                  Control how many interior or exterior repainting jobs your painting crew can accept simultaneously.
                </p>
              </div>

              <div className="p-5 bg-[#121929] border border-[#202d45] rounded-xl space-y-4 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-white font-semibold">Available Job Slots This Week:</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onUpdateCrewSlots(Math.max(0, crewSlots - 1))}
                      className="w-8 h-8 rounded-lg bg-[#0e1422] border border-[#1e2a42] text-white font-bold hover:border-[#38bdf8] flex items-center justify-center"
                    >
                      -
                    </button>
                    <span className="font-mono text-base font-bold text-[#38bdf8] w-6 text-center">
                      {crewSlots}
                    </span>
                    <button
                      onClick={() => onUpdateCrewSlots(crewSlots + 1)}
                      className="w-8 h-8 rounded-lg bg-[#0e1422] border border-[#1e2a42] text-white font-bold hover:border-[#38bdf8] flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="text-[11px] text-[#94a3b8] pt-2 border-t border-[#1b263b]">
                  {crewSlots > 0 ? (
                    <span className="text-emerald-400 font-semibold">
                      ✓ Website displays "{crewSlots} crew slots remaining this week" in the hero banner.
                    </span>
                  ) : (
                    <span className="text-amber-400 font-semibold">
                      ⚠ Crew is fully booked. Website indicates "Booking for Next Week".
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
