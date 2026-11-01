import React, { useState } from 'react';
import { 
  Check, 
  ArrowRight, 
  ArrowLeft, 
  Calendar as CalendarIcon, 
  Upload, 
  Frame, 
  Ruler, 
  Paintbrush, 
  ShieldCheck, 
  FileText, 
  Download, 
  ExternalLink,
  Sparkles,
  Info
} from 'lucide-react';
import { 
  CommissionMedium, 
  CommissionSubject, 
  ConsultationMode, 
  ConsultationBooking, 
  Artwork 
} from '../types/art';
import { 
  MEDIUM_OPTIONS, 
  SUBJECT_OPTIONS, 
  CANVAS_SIZE_OPTIONS, 
  FRAME_OPTIONS 
} from '../data/artworksData';
import { InteractiveCalendarPicker } from './InteractiveCalendarPicker';
import { generateGoogleCalendarUrl, downloadIcsFile } from '../utils/calendarExport';

interface CommissionBookingWizardProps {
  initialArtworkRef?: Artwork | null;
  onBookingSuccess: (booking: ConsultationBooking) => void;
  onNavigateToTracker: (trackingId: string) => void;
  onClose?: () => void;
}

export const CommissionBookingWizard: React.FC<CommissionBookingWizardProps> = ({
  initialArtworkRef,
  onBookingSuccess,
  onNavigateToTracker,
  onClose,
}) => {
  // Wizard steps: 1: Medium & Size, 2: Framing & References, 3: Consultation Schedule, 4: Review & Confirm
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Step 1: Medium, Subject, Size
  const [selectedMedium, setSelectedMedium] = useState<CommissionMedium>('oil_linen');
  const [selectedSubject, setSelectedSubject] = useState<CommissionSubject>(
    initialArtworkRef ? (initialArtworkRef.category as CommissionSubject) || 'portrait' : 'portrait'
  );
  const [selectedSizeId, setSelectedSizeId] = useState<string>('size_md_1');

  // Step 2: Framing, References & Palette
  const [selectedFrameId, setSelectedFrameId] = useState<string>('raw_walnut');
  const [uploadedPhotos, setUploadedPhotos] = useState<{ name: string; size: string; previewUrl: string }[]>([]);
  const [paletteNotes, setPaletteNotes] = useState<string>('');
  const [sentimentalStory, setSentimentalStory] = useState<string>('');

  // Step 3: Integrated Scheduling System
  const [consultationMode, setConsultationMode] = useState<ConsultationMode>('video_call');
  const [selectedDate, setSelectedDate] = useState<string>('2026-11-06');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('11:15 AM - 12:00 PM');
  const [timezone, setTimezone] = useState<string>('GMT');

  // Step 4: Contact details
  const [clientName, setClientName] = useState<string>('');
  const [clientEmail, setClientEmail] = useState<string>('');
  const [clientPhone, setClientPhone] = useState<string>('');
  const [clientLocation, setClientLocation] = useState<string>('');
  const [targetOccasionDate, setTargetOccasionDate] = useState<string>('');

  // Post-booking completed state
  const [confirmedBooking, setConfirmedBooking] = useState<ConsultationBooking | null>(null);

  // Computations
  const mediumObj = MEDIUM_OPTIONS.find((m) => m.id === selectedMedium) || MEDIUM_OPTIONS[0];
  const subjectObj = SUBJECT_OPTIONS.find((s) => s.id === selectedSubject) || SUBJECT_OPTIONS[0];
  const sizeObj = CANVAS_SIZE_OPTIONS.find((s) => s.id === selectedSizeId) || CANVAS_SIZE_OPTIONS[2];
  const frameObj = FRAME_OPTIONS.find((f) => f.id === selectedFrameId) || FRAME_OPTIONS[0];

  // Calculated estimates
  const baseSubtotal = (mediumObj.basePrice + sizeObj.price) * subjectObj.priceMultiplier;
  const framingCost = frameObj.price;
  const estimatedTotal = Math.round(baseSubtotal + framingCost);
  const depositAmount = Math.round(estimatedTotal * 0.3); // 30% deposit standard
  const totalWeeks = sizeObj.estimatedWeeks + mediumObj.curingWeeks;

  // Simulated photo upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const newPhoto = {
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        previewUrl: URL.createObjectURL(file),
      };
      setUploadedPhotos((prev) => [...prev, newPhoto]);
    }
  };

  const handleRemovePhoto = (idx: number) => {
    setUploadedPhotos((prev) => prev.filter((_, i) => i !== idx));
  };

  // Submit and create booking
  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !clientEmail) {
      alert('Please provide your name and email address to confirm your consultation.');
      return;
    }

    const uniqueTrackingId = `COMM-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newBooking: ConsultationBooking = {
      id: `book-${Date.now()}`,
      commissionTrackingId: uniqueTrackingId,
      clientName,
      email: clientEmail,
      phone: clientPhone || 'Provided in call',
      cityCountry: clientLocation || 'International',
      consultationMode,
      date: selectedDate,
      timeSlot: selectedTimeSlot,
      timezone,
      notes: `${sentimentalStory ? `Story: ${sentimentalStory}. ` : ''}${paletteNotes ? `Palette: ${paletteNotes}. ` : ''}`,
      referenceImagesCount: uploadedPhotos.length,
      commissionSpecs: {
        medium: mediumObj.name,
        subject: subjectObj.name,
        canvasSize: sizeObj.name,
        dimensions: sizeObj.dimensions,
        framing: frameObj.name,
        estimatedTotal,
        depositAmount,
        completionWeeks: totalWeeks,
        specialRequests: targetOccasionDate ? `Milestone occasion date: ${targetOccasionDate}` : undefined,
      },
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    };

    setConfirmedBooking(newBooking);
    onBookingSuccess(newBooking);
  };

  // Calendar Event parameters for Export
  const getCalendarParams = (booking: ConsultationBooking) => ({
    title: `Atelier Vance Commission Consultation (${booking.clientName})`,
    description: `Private 1-on-1 Artist Consultation with Elena Vance.\nFormat: ${
      booking.consultationMode === 'video_call'
        ? 'Google Meet (Link will be emailed to ' + booking.email + ')'
        : booking.consultationMode === 'studio_visit'
        ? 'Atelier Vance London Studio'
        : 'Direct Telephone Call to ' + booking.phone
    }\n\nCommission Specs: ${booking.commissionSpecs.subject} (${booking.commissionSpecs.dimensions})\nTracking ID: ${booking.commissionTrackingId}`,
    location:
      booking.consultationMode === 'studio_visit'
        ? 'Atelier Vance, 14 St. Jude Mews, London, UK'
        : 'Virtual Studio (Google Meet)',
    dateStr: booking.date,
    timeSlotStr: booking.timeSlot,
    clientName: booking.clientName,
  });

  // Render Confirmation Screen when booked
  if (confirmedBooking) {
    const calParams = getCalendarParams(confirmedBooking);
    const googleCalUrl = generateGoogleCalendarUrl(calParams);

    return (
      <div className="bg-[#12100e] border border-[#2d2822] rounded-xl p-6 sm:p-10 max-w-3xl mx-auto shadow-2xl text-center space-y-8">
        <div className="w-16 h-16 rounded-full bg-[#1e1b18] border-2 border-[#c5a880] text-[#c5a880] flex items-center justify-center mx-auto">
          <Check className="w-8 h-8 stroke-[2]" />
        </div>

        <div className="space-y-2">
          <div className="text-xs uppercase tracking-[0.25em] text-[#c5a880] font-semibold">
            Consultation Confirmed & Studio Slot Reserved
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#f5f1eb]">
            Welcome to the Atelier, {confirmedBooking.clientName}
          </h2>
          <p className="text-sm text-[#aba396] max-w-lg mx-auto">
            Your initial consultation has been registered in Elena Vance’s calendar. A personalized invitation and preliminary concept questions have been logged.
          </p>
        </div>

        {/* Highlighted booking box */}
        <div className="p-5 bg-[#171513] border border-[#302a24] rounded-lg text-left grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <span className="text-[#7d766b] block">Consultation Date & Time:</span>
            <span className="text-[#f4efe8] font-medium text-sm">
              {confirmedBooking.date} · {confirmedBooking.timeSlot} ({confirmedBooking.timezone})
            </span>
            <span className="text-[#a39c92] block mt-1 capitalize">
              Mode: {confirmedBooking.consultationMode.replace('_', ' ')}
            </span>
          </div>

          <div>
            <span className="text-[#7d766b] block">Commission Tracking Reference:</span>
            <span className="font-mono text-sm text-[#c5a880] font-bold block">
              {confirmedBooking.commissionTrackingId}
            </span>
            <span className="text-[#7d766b] block mt-1">
              Estimated Total: ${confirmedBooking.commissionSpecs.estimatedTotal.toLocaleString()} (30% deposit upon sketch approval)
            </span>
          </div>
        </div>

        {/* Integrated Calendar Actions */}
        <div className="p-5 bg-[#1a1714] border border-[#332c25] rounded-lg space-y-3">
          <h4 className="text-xs font-medium uppercase tracking-wider text-[#b8b0a5]">
            Sync with Your Personal Calendar
          </h4>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href={googleCalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-4 py-2.5 bg-[#c5a880] hover:bg-[#d5bba0] text-[#12100e] font-medium text-xs rounded transition-colors flex items-center justify-center gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Add to Google Calendar</span>
            </a>

            <button
              onClick={() => downloadIcsFile(calParams)}
              className="w-full sm:w-auto px-4 py-2.5 bg-[#26221d] hover:bg-[#332e27] border border-[#423b32] text-[#e5e0d8] font-medium text-xs rounded transition-colors flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4 text-[#c5a880]" />
              <span>Download iCal / Outlook (.ics)</span>
            </button>
          </div>
        </div>

        {/* Direct link to Client Portal */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <button
            onClick={() => onNavigateToTracker(confirmedBooking.commissionTrackingId)}
            className="px-6 py-3 bg-[#26221d] hover:bg-[#332e27] border border-[#c5a880]/50 text-[#f4efe8] text-xs sm:text-sm font-medium rounded-md transition-colors flex items-center gap-2"
          >
            <span>Open Client Studio Portal</span>
            <ArrowRight className="w-4 h-4 text-[#c5a880]" />
          </button>

          {onClose && (
            <button
              onClick={onClose}
              className="text-xs text-[#8f887d] hover:text-[#f4efe8] transition-colors"
            >
              Return to Website
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#12100e] border border-[#29241f] rounded-xl overflow-hidden shadow-2xl max-w-4xl mx-auto">
      
      {/* Wizard Header */}
      <div className="p-6 sm:p-8 bg-gradient-to-r from-[#171513] to-[#141210] border-b border-[#26221d] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-[0.25em] text-[#c5a880] mb-1 font-medium">
            Bespoke Commission Atelier
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl text-[#f4efe8]">
            Commission a Custom Artwork & Reserve Studio Time
          </h2>
        </div>

        {/* Step Progress indicators */}
        <div className="flex items-center gap-2 text-xs font-medium">
          {[
            { num: 1, label: 'Canvas' },
            { num: 2, label: 'Framing' },
            { num: 3, label: 'Consultation' },
            { num: 4, label: 'Summary' },
          ].map((st) => (
            <div key={st.num} className="flex items-center gap-1.5">
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                  currentStep === st.num
                    ? 'bg-[#c5a880] text-[#12100e] font-bold'
                    : currentStep > st.num
                    ? 'bg-[#2b251f] text-[#c5a880]'
                    : 'bg-[#1a1815] text-[#6b6459]'
                }`}
              >
                {currentStep > st.num ? <Check className="w-3.5 h-3.5" /> : st.num}
              </span>
              <span className={`hidden sm:inline ${currentStep === st.num ? 'text-[#f4efe8]' : 'text-[#7d766b]'}`}>
                {st.label}
              </span>
              {st.num < 4 && <span className="text-[#3b362f] hidden sm:inline">/</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Wizard Content Body */}
      <div className="p-6 sm:p-8">
        
        {/* STEP 1: Medium, Subject & Canvas Dimensions */}
        {currentStep === 1 && (
          <div className="space-y-8">
            
            {/* Subject Selection */}
            <div className="space-y-3">
              <label className="text-xs font-medium uppercase tracking-wider text-[#9e968b] block">
                1. Artwork Subject & Essence
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {SUBJECT_OPTIONS.map((subj) => (
                  <button
                    key={subj.id}
                    type="button"
                    onClick={() => setSelectedSubject(subj.id)}
                    className={`p-3.5 rounded-lg border text-left transition-all flex flex-col justify-between ${
                      selectedSubject === subj.id
                        ? 'bg-[#1d1a16] border-[#c5a880] text-[#f4efe8]'
                        : 'bg-[#141210] border-[#26221d] text-[#a39c92] hover:border-[#3d362e]'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-semibold text-[#f4efe8]">{subj.name}</div>
                      <div className="text-[11px] text-[#80796e] mt-1 leading-snug">{subj.description}</div>
                    </div>
                    <div className="text-[10px] text-[#c5a880] mt-3 pt-2 border-t border-[#26221d]">
                      Popular: {subj.popularSize}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Medium Selection */}
            <div className="space-y-3">
              <label className="text-xs font-medium uppercase tracking-wider text-[#9e968b] block">
                2. Medium & Fine Art Surface
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {MEDIUM_OPTIONS.map((med) => (
                  <button
                    key={med.id}
                    type="button"
                    onClick={() => setSelectedMedium(med.id)}
                    className={`p-4 rounded-lg border text-left transition-all ${
                      selectedMedium === med.id
                        ? 'bg-[#1d1a16] border-[#c5a880] text-[#f4efe8]'
                        : 'bg-[#141210] border-[#26221d] text-[#a39c92] hover:border-[#3d362e]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-semibold text-[#f4efe8]">{med.name}</div>
                      {selectedMedium === med.id && <Check className="w-4 h-4 text-[#c5a880]" />}
                    </div>
                    <div className="text-[11px] text-[#c5a880] mt-0.5">{med.subtitle}</div>
                    <div className="text-xs text-[#8f887d] mt-2 leading-relaxed">{med.description}</div>
                    <div className="text-[11px] text-[#70695e] mt-2 italic">Best for: {med.bestFor}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Canvas Dimensions Selection */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium uppercase tracking-wider text-[#9e968b]">
                  3. Canvas Dimensions & Room Presence
                </label>
                <span className="text-xs text-[#8f887d]">Includes custom stretcher bars</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {CANVAS_SIZE_OPTIONS.map((sz) => (
                  <button
                    key={sz.id}
                    type="button"
                    onClick={() => setSelectedSizeId(sz.id)}
                    className={`p-3.5 rounded-lg border text-left transition-all flex flex-col justify-between ${
                      selectedSizeId === sz.id
                        ? 'bg-[#1d1a16] border-[#c5a880] text-[#f4efe8]'
                        : 'bg-[#141210] border-[#26221d] text-[#a39c92] hover:border-[#3d362e]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#f4efe8]">{sz.dimensions}</span>
                        <span className="text-xs font-mono text-[#c5a880]">${sz.price}</span>
                      </div>
                      <div className="text-[11px] text-[#736c61] mt-0.5">{sz.dimensionsCm}</div>
                      <div className="text-[11px] text-[#91897e] mt-1.5 line-clamp-2">{sz.suggestedRoom}</div>
                    </div>
                    <div className="text-[10px] text-[#80796e] mt-2 pt-1 border-t border-[#26221d]">
                      Estimated studio time: ~{sz.estimatedWeeks} weeks
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Live Estimate preview footer for Step 1 */}
            <div className="p-4 bg-[#171513] border border-[#2b2621] rounded-lg flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div>
                <span className="text-[#8f887d]">Estimated Artwork Investment:</span>
                <span className="font-serif text-xl text-[#f4efe8] ml-2 font-medium">
                  ~${estimatedTotal.toLocaleString()} USD
                </span>
                <span className="text-[#736c61] ml-2">(30% deposit upon sketch approval)</span>
              </div>
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="w-full sm:w-auto px-5 py-2.5 bg-[#c5a880] hover:bg-[#d5bba0] text-[#12100e] font-medium text-xs rounded transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Continue to Framing & Details</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        )}

        {/* STEP 2: Framing & Reference Photo Upload */}
        {currentStep === 2 && (
          <div className="space-y-8">
            
            {/* Framing Options */}
            <div className="space-y-3">
              <label className="text-xs font-medium uppercase tracking-wider text-[#9e968b] block">
                Bespoke Archival Framing
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {FRAME_OPTIONS.map((fr) => (
                  <button
                    key={fr.id}
                    type="button"
                    onClick={() => setSelectedFrameId(fr.id)}
                    className={`p-4 rounded-lg border text-left transition-all ${
                      selectedFrameId === fr.id
                        ? 'bg-[#1d1a16] border-[#c5a880] text-[#f4efe8]'
                        : 'bg-[#141210] border-[#26221d] text-[#a39c92] hover:border-[#3d362e]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-semibold text-[#f4efe8]">{fr.name}</div>
                      <div className="text-xs font-mono text-[#c5a880]">
                        {fr.price === 0 ? 'Included' : `+$${fr.price}`}
                      </div>
                    </div>
                    <div className="text-xs text-[#8f887d] mt-1.5 leading-relaxed">{fr.description}</div>
                    <div className="text-[10px] text-[#70695e] mt-1">{fr.material}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Reference Photos & Sentiment */}
            <div className="space-y-4">
              <label className="text-xs font-medium uppercase tracking-wider text-[#9e968b] block">
                Reference Photos & Sentimental Vision
              </label>
              
              {/* File upload drag drop simulation */}
              <div className="border-2 border-dashed border-[#383129] hover:border-[#c5a880] rounded-xl p-6 text-center bg-[#141210] transition-colors relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
                <Upload className="w-8 h-8 text-[#c5a880] mx-auto mb-2" />
                <div className="text-xs text-[#f4efe8] font-medium">
                  Click to upload reference photographs or drag files here
                </div>
                <div className="text-[11px] text-[#736c61] mt-1">
                  High-resolution candid portraits, landscapes, or lighting angles (JPG, PNG, WebP up to 25MB)
                </div>
              </div>

              {/* Uploaded photo list */}
              {uploadedPhotos.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                  {uploadedPhotos.map((photo, idx) => (
                    <div key={idx} className="relative group bg-[#1a1714] border border-[#332c25] rounded-lg p-2">
                      <img
                        src={photo.previewUrl}
                        alt="Reference upload"
                        className="w-full h-20 object-cover rounded"
                      />
                      <div className="text-[10px] text-[#b8b0a5] truncate mt-1">{photo.name}</div>
                      <button
                        type="button"
                        onClick={() => handleRemovePhoto(idx)}
                        className="text-[10px] text-red-400 hover:underline mt-0.5 block"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Sentimental story & notes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs text-[#a39c92] block">
                    The Story Behind This Painting (Optional)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="e.g. Commemorating our 20th anniversary in Tuscany; capturing Barnaby’s soulful expression near his favorite fireplace..."
                    value={sentimentalStory}
                    onChange={(e) => setSentimentalStory(e.target.value)}
                    className="w-full p-2.5 bg-[#141210] border border-[#2b251f] rounded-lg text-xs text-[#f4efe8] placeholder-[#6b6459] focus:outline-none focus:border-[#c5a880]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-[#a39c92] block">
                    Palette or Lighting Atmosphere Preference
                  </label>
                  <textarea
                    rows={3}
                    placeholder="e.g. Warm chiaroscuro shadows, amber morning light, deep Prussian blues rather than bright greens..."
                    value={paletteNotes}
                    onChange={(e) => setPaletteNotes(e.target.value)}
                    className="w-full p-2.5 bg-[#141210] border border-[#2b251f] rounded-lg text-xs text-[#f4efe8] placeholder-[#6b6459] focus:outline-none focus:border-[#c5a880]"
                  />
                </div>
              </div>
            </div>

            {/* Navigation Buttons for Step 2 */}
            <div className="flex items-center justify-between pt-4 border-t border-[#26211c]">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="px-4 py-2 border border-[#332c25] hover:border-[#4d4233] text-xs font-medium text-[#a39c92] hover:text-[#f4efe8] rounded transition-colors flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Canvas</span>
              </button>

              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="px-5 py-2.5 bg-[#c5a880] hover:bg-[#d5bba0] text-[#12100e] font-medium text-xs rounded transition-colors flex items-center gap-1.5"
              >
                <span>Select Consultation Date & Time</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        )}

        {/* STEP 3: Integrated Scheduling System */}
        {currentStep === 3 && (
          <div className="space-y-8">
            <div>
              <div className="text-xs uppercase tracking-wider text-[#c5a880] mb-1 font-medium">
                Integrated Artist Scheduling
              </div>
              <h3 className="font-serif text-xl sm:text-2xl text-[#f4efe8]">
                Select Date & Time for Your Initial 1-on-1 Artist Consultation
              </h3>
              <p className="text-xs text-[#9e968b] mt-1">
                Before brushes touch linen, we review composition studies, reference photos, and color harmonies together.
              </p>
            </div>

            {/* Interactive Calendar Picker */}
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

            {/* Navigation Buttons for Step 3 */}
            <div className="flex items-center justify-between pt-4 border-t border-[#26211c]">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="px-4 py-2 border border-[#332c25] hover:border-[#4d4233] text-xs font-medium text-[#a39c92] hover:text-[#f4efe8] rounded transition-colors flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Framing</span>
              </button>

              <button
                type="button"
                onClick={() => setCurrentStep(4)}
                className="px-5 py-2.5 bg-[#c5a880] hover:bg-[#d5bba0] text-[#12100e] font-medium text-xs rounded transition-colors flex items-center gap-1.5"
              >
                <span>Review & Confirm Reservation</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        )}

        {/* STEP 4: Review, Client Contact & Instant Confirmation */}
        {currentStep === 4 && (
          <form onSubmit={handleConfirmBooking} className="space-y-8">
            
            {/* Commission Summary breakdown */}
            <div className="p-5 bg-[#171513] border border-[#2e2822] rounded-xl space-y-4">
              <h4 className="text-xs font-medium uppercase tracking-wider text-[#c5a880]">
                Commission Order & Consultation Summary
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-[#7d766b] block">Medium & Surface:</span>
                  <span className="text-[#f4efe8] font-medium">{mediumObj.name}</span>
                </div>
                <div>
                  <span className="text-[#7d766b] block">Subject:</span>
                  <span className="text-[#f4efe8] font-medium">{subjectObj.name}</span>
                </div>
                <div>
                  <span className="text-[#7d766b] block">Canvas Size:</span>
                  <span className="text-[#f4efe8] font-medium">{sizeObj.name} ({sizeObj.dimensionsCm})</span>
                </div>
                <div>
                  <span className="text-[#7d766b] block">Framing Choice:</span>
                  <span className="text-[#f4efe8] font-medium">{frameObj.name}</span>
                </div>
                <div>
                  <span className="text-[#7d766b] block">Scheduled Consultation:</span>
                  <span className="text-[#f4efe8] font-medium">
                    {selectedDate} at {selectedTimeSlot} ({timezone}) · {consultationMode.replace('_', ' ')}
                  </span>
                </div>
                <div>
                  <span className="text-[#7d766b] block">Estimated Creation Timeline:</span>
                  <span className="text-[#f4efe8] font-medium">~{totalWeeks} weeks (including paint oxidation & varnish curing)</span>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="pt-3 border-t border-[#26211c] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div>
                  <span className="text-[#8f887d]">Estimated Commission Total:</span>
                  <span className="font-serif text-2xl text-[#f4efe8] ml-2 font-medium">
                    ${estimatedTotal.toLocaleString()} USD
                  </span>
                </div>
                <div className="text-[#c5a880] text-xs">
                  Required Studio Deposit (30%): <strong>${depositAmount.toLocaleString()} USD</strong>
                  <span className="text-[11px] text-[#736c61] block">Due only after concept sketch approval</span>
                </div>
              </div>
            </div>

            {/* Client Contact Details */}
            <div className="space-y-4">
              <label className="text-xs font-medium uppercase tracking-wider text-[#9e968b] block">
                Your Contact Information
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-[#a39c92]">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Eleanor Vance"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full p-2.5 bg-[#141210] border border-[#2b251f] rounded-lg text-xs text-[#f4efe8] placeholder-[#6b6459] focus:outline-none focus:border-[#c5a880]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-[#a39c92]">Email Address (for Calendar invite & updates) *</label>
                  <input
                    type="email"
                    required
                    placeholder="eleanor@example.com"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    className="w-full p-2.5 bg-[#141210] border border-[#2b251f] rounded-lg text-xs text-[#f4efe8] placeholder-[#6b6459] focus:outline-none focus:border-[#c5a880]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-[#a39c92]">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    className="w-full p-2.5 bg-[#141210] border border-[#2b251f] rounded-lg text-xs text-[#f4efe8] placeholder-[#6b6459] focus:outline-none focus:border-[#c5a880]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-[#a39c92]">City & Country (for courier estimate)</label>
                  <input
                    type="text"
                    placeholder="e.g. New York, USA or London, UK"
                    value={clientLocation}
                    onChange={(e) => setClientLocation(e.target.value)}
                    className="w-full p-2.5 bg-[#141210] border border-[#2b251f] rounded-lg text-xs text-[#f4efe8] placeholder-[#6b6459] focus:outline-none focus:border-[#c5a880]"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs text-[#a39c92]">Target Occasion / Delivery Date (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Anniversary on Dec 20, 2026 or Birthday in January"
                    value={targetOccasionDate}
                    onChange={(e) => setTargetOccasionDate(e.target.value)}
                    className="w-full p-2.5 bg-[#141210] border border-[#2b251f] rounded-lg text-xs text-[#f4efe8] placeholder-[#6b6459] focus:outline-none focus:border-[#c5a880]"
                  />
                </div>
              </div>
            </div>

            {/* Terms notice */}
            <div className="p-3 bg-[#171412] rounded-lg border border-[#2b2621] text-[11px] text-[#7d766b] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#c5a880] shrink-0" />
              <span>By reserving your consultation, you lock in studio calendar priority. No deposit payment is charged until after your consultation and concept approval.</span>
            </div>

            {/* Navigation Buttons for Step 4 */}
            <div className="flex items-center justify-between pt-4 border-t border-[#26211c]">
              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="px-4 py-2 border border-[#332c25] hover:border-[#4d4233] text-xs font-medium text-[#a39c92] hover:text-[#f4efe8] rounded transition-colors flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Calendar</span>
              </button>

              <button
                type="submit"
                className="px-6 py-3 bg-[#c5a880] hover:bg-[#d5bba0] text-[#12100e] font-semibold text-xs sm:text-sm rounded transition-all shadow-md flex items-center gap-2 active:scale-[0.98]"
              >
                <CalendarIcon className="w-4 h-4" />
                <span>Confirm Consultation & Reserve Studio Slot</span>
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
