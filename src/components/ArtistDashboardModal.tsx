import React, { useState } from 'react';
import { 
  X, 
  Calendar, 
  Clock, 
  User, 
  Mail, 
  Phone, 
  Video, 
  MapPin, 
  Sliders, 
  Check, 
  Plus, 
  Layers, 
  Eye, 
  Trash2, 
  ExternalLink 
} from 'lucide-react';
import { ConsultationBooking, CommissionProject, CommissionProgressStage } from '../types/art';

interface ArtistDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookings: ConsultationBooking[];
  commissionProjects: CommissionProject[];
  onUpdateProjectStage: (trackingId: string, newStage: CommissionProgressStage) => void;
  remainingSlots: number;
  onUpdateRemainingSlots: (slots: number) => void;
}

export const ArtistDashboardModal: React.FC<ArtistDashboardModalProps> = ({
  isOpen,
  onClose,
  bookings,
  commissionProjects,
  onUpdateProjectStage,
  remainingSlots,
  onUpdateRemainingSlots,
}) => {
  const [activeTab, setActiveTab] = useState<'consultations' | 'commissions' | 'settings'>('consultations');

  if (!isOpen) return null;

  const stageOptions: { stage: CommissionProgressStage; label: string }[] = [
    { stage: 'consultation', label: '1. Consultation' },
    { stage: 'concept_sketch', label: '2. Concept Sketches' },
    { stage: 'underpainting', label: '3. Grisaille Underpainting' },
    { stage: 'impasto_layers', label: '4. Impasto Modeling' },
    { stage: 'client_review', label: '5. Client Reveal' },
    { stage: 'varnish_cure', label: '6. Varnish Curing' },
    { stage: 'framing', label: '7. Bespoke Framing' },
    { stage: 'shipped', label: '8. Shipped & Delivered' },
  ];

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-5xl bg-[#12100e] border border-[#2e2720] rounded-xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Modal Top Header */}
        <div className="p-5 sm:p-6 bg-[#161412] border-b border-[#29231c] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#241e18] border border-[#3d3326] flex items-center justify-center text-[#c5a880]">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-xl sm:text-2xl text-[#f4efe8]">
                Elena Vance Atelier — Artist Studio Admin
              </h3>
              <span className="text-[11px] text-[#80786d] uppercase tracking-wider">
                Private Painter Workspace & Scheduling Manager
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#1e1b18] border border-[#3b3328] text-[#c5a880] hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Tabs (Functional button controls) */}
        <div className="px-6 py-2.5 bg-[#141210] border-b border-[#26201a] flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('consultations')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded transition-colors flex items-center gap-2 ${
              activeTab === 'consultations'
                ? 'bg-[#c5a880] text-[#12100e]'
                : 'text-[#9c958b] hover:text-[#f4efe8] hover:bg-[#1a1714]'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Booked Consultations ({bookings.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('commissions')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded transition-colors flex items-center gap-2 ${
              activeTab === 'commissions'
                ? 'bg-[#c5a880] text-[#12100e]'
                : 'text-[#9c958b] hover:text-[#f4efe8] hover:bg-[#1a1714]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Active Canvas Pipelines ({commissionProjects.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded transition-colors flex items-center gap-2 ${
              activeTab === 'settings'
                ? 'bg-[#c5a880] text-[#12100e]'
                : 'text-[#9c958b] hover:text-[#f4efe8] hover:bg-[#1a1714]'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Studio Slots & Season Availability</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
          
          {/* TAB 1: CONSULTATIONS */}
          {activeTab === 'consultations' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs uppercase tracking-wider text-[#b8b0a5] font-semibold">
                  Upcoming Booked Consultations
                </h4>
                <span className="text-xs text-[#736c61]">
                  Generated via Integrated Scheduling System
                </span>
              </div>

              {bookings.length > 0 ? (
                <div className="space-y-3">
                  {bookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="p-5 bg-[#171412] border border-[#2b241d] rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-xs">
                          <span className="font-semibold text-sm text-[#f5f1eb]">{booking.clientName}</span>
                          <span className="font-mono text-[11px] text-[#c5a880] bg-[#1e1b18] px-2 py-0.5 rounded border border-[#383025]">
                            {booking.commissionTrackingId}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[#8f887d]">
                          <span className="flex items-center gap-1">
                            <Mail className="w-3.5 h-3.5 text-[#c5a880]" />
                            {booking.email}
                          </span>
                          {booking.phone && (
                            <span className="flex items-center gap-1">
                              <Phone className="w-3.5 h-3.5 text-[#c5a880]" />
                              {booking.phone}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-[#c5a880]" />
                            {booking.cityCountry}
                          </span>
                        </div>

                        {booking.notes && (
                          <div className="p-2 bg-[#12100e] rounded text-[#b8b0a5] border border-[#262019] italic">
                            “{booking.notes}”
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col md:items-end justify-between gap-2 shrink-0">
                        <div className="text-right">
                          <span className="font-semibold text-[#f4efe8] block">
                            {booking.date} · {booking.timeSlot}
                          </span>
                          <span className="text-[11px] text-[#c5a880] capitalize">
                            Mode: {booking.consultationMode.replace('_', ' ')} ({booking.timezone})
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          {booking.consultationMode === 'video_call' && (
                            <a
                              href="https://meet.google.com/new"
                              target="_blank"
                              rel="noreferrer"
                              className="px-3 py-1.5 bg-[#c5a880] hover:bg-[#d5bba0] text-[#12100e] font-medium rounded flex items-center gap-1"
                            >
                              <Video className="w-3.5 h-3.5" />
                              <span>Join Call Room</span>
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center bg-[#171412] border border-[#29221b] rounded-lg text-xs text-[#8f887d]">
                  No consultations booked yet today. As visitors complete the booking wizard, their appointments will appear here automatically.
                </div>
              )}
            </div>
          )}

          {/* TAB 2: ACTIVE COMMISSIONS PIPELINE */}
          {activeTab === 'commissions' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs uppercase tracking-wider text-[#b8b0a5] font-semibold">
                  Easel & Drying Rack Pipeline
                </h4>
                <span className="text-xs text-[#736c61]">
                  Advance stages to notify collector in their Live Tracker
                </span>
              </div>

              <div className="space-y-4">
                {commissionProjects.map((project) => (
                  <div
                    key={project.trackingId}
                    className="p-5 bg-[#171412] border border-[#2b241d] rounded-xl space-y-4 text-xs"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[#c5a880] font-semibold">{project.trackingId}</span>
                          <span className="text-[#8f887d]">·</span>
                          <span className="text-sm font-serif text-[#f4efe8]">{project.title}</span>
                        </div>
                        <div className="text-[#8f887d] mt-1">
                          Client: {project.clientName} | {project.medium} | {project.dimensions}
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-[11px] text-[#736c61] block">Target Finish</span>
                        <span className="text-xs text-[#e8e4df]">{project.targetCompletionDate}</span>
                      </div>
                    </div>

                    {/* Stage Selector */}
                    <div className="space-y-1.5">
                      <span className="text-[11px] text-[#a39c92] block font-medium">
                        Update Painting Stage:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {stageOptions.map((opt) => (
                          <button
                            key={opt.stage}
                            onClick={() => onUpdateProjectStage(project.trackingId, opt.stage)}
                            className={`px-2.5 py-1 text-xs rounded border transition-colors ${
                              project.currentStage === opt.stage
                                ? 'bg-[#c5a880] text-[#12100e] border-[#c5a880] font-bold'
                                : 'bg-[#1b1815] text-[#9c958b] border-[#2e261f] hover:border-[#473c30]'
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: STUDIO SLOTS & AVAILABILITY */}
          {activeTab === 'settings' && (
            <div className="space-y-6 max-w-xl">
              <div>
                <h4 className="text-xs uppercase tracking-wider text-[#b8b0a5] font-semibold mb-1">
                  Seasonal Studio Commission Quota
                </h4>
                <p className="text-xs text-[#8f887d]">
                  Because oil paintings require dedicated sittings, multi-layer curing, and varnish periods, the studio limits commissions to 4 per quarter.
                </p>
              </div>

              <div className="p-5 bg-[#171412] border border-[#2b241d] rounded-xl space-y-4 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[#f4efe8] font-medium">Autumn / Winter 2026 Remaining Slots:</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onUpdateRemainingSlots(Math.max(0, remainingSlots - 1))}
                      className="w-8 h-8 rounded bg-[#241f1a] border border-[#3b3126] text-[#e8e4df] hover:border-[#c5a880] flex items-center justify-center font-bold"
                    >
                      -
                    </button>
                    <span className="font-mono text-base text-[#c5a880] font-bold w-6 text-center">
                      {remainingSlots}
                    </span>
                    <button
                      onClick={() => onUpdateRemainingSlots(remainingSlots + 1)}
                      className="w-8 h-8 rounded bg-[#241f1a] border border-[#3b3126] text-[#e8e4df] hover:border-[#c5a880] flex items-center justify-center font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="text-[11px] text-[#7d766b] pt-2 border-t border-[#241e18]">
                  {remainingSlots > 0 ? (
                    <span className="text-emerald-400">
                      ✓ Website banner displays "{remainingSlots} studio commission slots remaining".
                    </span>
                  ) : (
                    <span className="text-amber-400">
                      ⚠ Studio is fully booked. Website indicates "Waitlist Only for Next Quarter".
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
