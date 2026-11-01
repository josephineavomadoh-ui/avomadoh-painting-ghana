import React, { useState } from 'react';
import { X, Calendar as CalendarIcon, Check, Download, ExternalLink, ArrowRight } from 'lucide-react';
import { ConsultationMode, ConsultationBooking } from '../types/art';
import { InteractiveCalendarPicker } from './InteractiveCalendarPicker';
import { generateGoogleCalendarUrl, downloadIcsFile } from '../utils/calendarExport';

interface ConsultationSchedulerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBookingSuccess: (booking: ConsultationBooking) => void;
}

export const ConsultationSchedulerModal: React.FC<ConsultationSchedulerModalProps> = ({
  isOpen,
  onClose,
  onBookingSuccess,
}) => {
  const [selectedDate, setSelectedDate] = useState<string>('2026-11-05');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('10:00 AM - 10:45 AM');
  const [consultationMode, setConsultationMode] = useState<ConsultationMode>('video_call');
  const [timezone, setTimezone] = useState<string>('GMT');

  const [clientName, setClientName] = useState<string>('');
  const [clientEmail, setClientEmail] = useState<string>('');
  const [clientPhone, setClientPhone] = useState<string>('');
  const [inquiryNotes, setInquiryNotes] = useState<string>('');

  const [confirmedBooking, setConfirmedBooking] = useState<ConsultationBooking | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !clientEmail) {
      alert('Please provide your name and email address to schedule.');
      return;
    }

    const uniqueTrackingId = `CONS-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newBooking: ConsultationBooking = {
      id: `call-${Date.now()}`,
      commissionTrackingId: uniqueTrackingId,
      clientName,
      email: clientEmail,
      phone: clientPhone || 'N/A',
      cityCountry: 'International Inquiry',
      consultationMode,
      date: selectedDate,
      timeSlot: selectedTimeSlot,
      timezone,
      notes: inquiryNotes,
      referenceImagesCount: 0,
      commissionSpecs: {
        medium: 'To be determined during consultation',
        subject: 'Custom Commission Exploration',
        canvasSize: 'To be determined',
        dimensions: 'TBD',
        framing: 'Consultation discussion',
        estimatedTotal: 2500,
        depositAmount: 750,
        completionWeeks: 6,
        specialRequests: inquiryNotes,
      },
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    };

    setConfirmedBooking(newBooking);
    onBookingSuccess(newBooking);
  };

  const getCalendarParams = (booking: ConsultationBooking) => ({
    title: `Artist Consultation with Elena Vance (${booking.clientName})`,
    description: `Private 1-on-1 Consultation.\nMode: ${booking.consultationMode.replace('_', ' ')}\nNotes: ${booking.notes || 'Commission exploration'}`,
    location:
      booking.consultationMode === 'studio_visit'
        ? 'Atelier Vance, 14 St. Jude Mews, London, UK'
        : 'Virtual Studio (Google Meet link)',
    dateStr: booking.date,
    timeSlotStr: booking.timeSlot,
    clientName: booking.clientName,
  });

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-2xl bg-[#12100e] border border-[#2d2822] rounded-xl overflow-hidden shadow-2xl p-6 sm:p-8">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#1b1916] border border-[#3b352e] text-[#c5a880] hover:text-white flex items-center justify-center transition-colors"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        {confirmedBooking ? (
          <div className="text-center space-y-6 py-4">
            <div className="w-14 h-14 rounded-full bg-[#1e1b18] border-2 border-[#c5a880] text-[#c5a880] flex items-center justify-center mx-auto">
              <Check className="w-7 h-7" />
            </div>

            <div className="space-y-1.5">
              <span className="text-[11px] uppercase tracking-widest text-[#c5a880] font-medium">
                Appointment Reserved
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl text-[#f4efe8]">
                We look forward to speaking with you, {confirmedBooking.clientName}
              </h3>
              <p className="text-xs text-[#a39c92] max-w-md mx-auto">
                Scheduled for <strong>{confirmedBooking.date}</strong> at <strong>{confirmedBooking.timeSlot} ({confirmedBooking.timezone})</strong>.
              </p>
            </div>

            <div className="p-4 bg-[#171513] border border-[#2d2721] rounded-lg text-xs flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href={generateGoogleCalendarUrl(getCalendarParams(confirmedBooking))}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-4 py-2 bg-[#c5a880] hover:bg-[#d5bba0] text-[#12100e] font-medium rounded flex items-center justify-center gap-1.5 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Add to Google Calendar</span>
              </a>

              <button
                onClick={() => downloadIcsFile(getCalendarParams(confirmedBooking))}
                className="w-full sm:w-auto px-4 py-2 bg-[#26221d] hover:bg-[#332e27] border border-[#40382e] text-[#e5e0d8] font-medium rounded flex items-center justify-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-[#c5a880]" />
                <span>Download .ics Calendar File</span>
              </button>
            </div>

            <button
              onClick={onClose}
              className="px-5 py-2.5 bg-[#26221d] hover:bg-[#332e27] text-xs font-medium text-[#f4efe8] rounded transition-colors"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <div className="text-xs uppercase tracking-[0.25em] text-[#c5a880] font-medium mb-1">
                Direct Atelier Scheduling
              </div>
              <h3 className="font-serif text-2xl text-[#f4efe8]">
                Schedule an Artist Consultation
              </h3>
              <p className="text-xs text-[#9c958b] mt-1">
                Select a convenient slot on Elena Vance’s calendar to discuss an idea, portrait sitting, or spatial project.
              </p>
            </div>

            <InteractiveCalendarPicker
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
              selectedTimeSlot={selectedTimeSlot}
              onSelectTimeSlot={setSelectedTimeSlot}
              consultationMode={consultationMode}
              onChangeConsultationMode={setConsultationMode}
              timezone={timezone}
              onChangeTimezone={setTimezone}
            />

            <div className="space-y-3 pt-2 border-t border-[#26211c]">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-[#a39c92] block mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Julian Croft"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full p-2 bg-[#171513] border border-[#2b251f] rounded text-xs text-[#f4efe8] focus:outline-none focus:border-[#c5a880]"
                  />
                </div>
                <div>
                  <label className="text-xs text-[#a39c92] block mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="julian@example.com"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    className="w-full p-2 bg-[#171513] border border-[#2b251f] rounded text-xs text-[#f4efe8] focus:outline-none focus:border-[#c5a880]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-[#a39c92] block mb-1">Commission Vision or Questions (Optional)</label>
                <textarea
                  rows={2}
                  placeholder="Share a few words on what you would love to create together..."
                  value={inquiryNotes}
                  onChange={(e) => setInquiryNotes(e.target.value)}
                  className="w-full p-2 bg-[#171513] border border-[#2b251f] rounded text-xs text-[#f4efe8] focus:outline-none focus:border-[#c5a880]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#c5a880] hover:bg-[#d5bba0] text-[#12100e] font-semibold text-xs rounded transition-colors flex items-center justify-center gap-2"
            >
              <CalendarIcon className="w-4 h-4" />
              <span>Confirm & Lock In Studio Slot</span>
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
