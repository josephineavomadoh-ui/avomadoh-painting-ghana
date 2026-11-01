import React, { useState } from 'react';
import { 
  Check, 
  ArrowRight, 
  ArrowLeft, 
  Calendar as CalendarIcon, 
  Upload, 
  Ruler, 
  PaintRoller, 
  Clock, 
  DollarSign, 
  CheckCircle2, 
  ShieldCheck, 
  Download, 
  ExternalLink,
  MapPin,
  Home,
  Info
} from 'lucide-react';
import { WalkthroughBooking, ConsultationType } from '../types/painting';
import { generateGoogleCalendarUrl, downloadIcsFile } from '../utils/calendarExport';

interface ProjectEstimatorWizardProps {
  initialServiceCategory?: string;
  onBookingSuccess: (booking: WalkthroughBooking) => void;
  onNavigateToTracker: (trackingCode: string) => void;
}

export const ProjectEstimatorWizard: React.FC<ProjectEstimatorWizardProps> = ({
  initialServiceCategory = 'interior_rooms',
  onBookingSuccess,
  onNavigateToTracker,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Step 1: Project Scope
  const [serviceType, setServiceType] = useState<string>(initialServiceCategory);
  const [roomCount, setRoomCount] = useState<number>(3);
  const [approxSqFt, setApproxSqFt] = useState<number>(750);
  const [wallCondition, setWallCondition] = useState<'excellent' | 'minor_patching' | 'heavy_repair_cracks'>('minor_patching');

  // Step 2: Add-ons & Paint Grade
  const [includeCeilings, setIncludeCeilings] = useState<boolean>(true);
  const [includeTrimBaseboards, setIncludeTrimBaseboards] = useState<boolean>(true);
  const [paintQuality, setPaintQuality] = useState<'premium' | 'ultra_durable' | 'luxury_designer'>('ultra_durable');

  // Step 3: Integrated Scheduling System for On-Site Walkthrough
  const [consultationType, setConsultationType] = useState<ConsultationType>('in_person_walkthrough');
  const [selectedDate, setSelectedDate] = useState<string>('2026-11-04');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('10:00 AM - 11:30 AM');
  const [timezone, setTimezone] = useState<string>('GMT');

  // Step 4: Homeowner Contact & Address
  const [clientName, setClientName] = useState<string>('');
  const [clientEmail, setClientEmail] = useState<string>('');
  const [clientPhone, setClientPhone] = useState<string>('');
  const [streetAddress, setStreetAddress] = useState<string>('');
  const [cityZip, setCityZip] = useState<string>('Accra');
  const [projectNotes, setProjectNotes] = useState<string>('');
  const [uploadedPhotos, setUploadedPhotos] = useState<{ name: string; size: string; preview: string }[]>([]);

  // Confirmed booking state
  const [confirmedBooking, setConfirmedBooking] = useState<WalkthroughBooking | null>(null);

  // Dynamic cost calculation in Ghanaian Cedis (GH₵)
  const calculateEstimates = () => {
    // Base cost per room in Cedis
    let perRoomRate = 950; // GH₵
    if (serviceType === 'exterior_house') perRoomRate = 1800;
    if (serviceType === 'trim_doors') perRoomRate = 550;
    if (serviceType === 'cabinets') perRoomRate = 750;

    let conditionMultiplier = 1.0;
    if (wallCondition === 'minor_patching') conditionMultiplier = 1.15;
    if (wallCondition === 'heavy_repair_cracks') conditionMultiplier = 1.35;

    let qualityMultiplier = 1.0;
    if (paintQuality === 'ultra_durable') qualityMultiplier = 1.2;
    if (paintQuality === 'luxury_designer') qualityMultiplier = 1.4;

    let subtotal = roomCount * perRoomRate * conditionMultiplier * qualityMultiplier;

    if (includeCeilings) subtotal += roomCount * 320;
    if (includeTrimBaseboards) subtotal += roomCount * 220;

    const minEstimate = Math.round(subtotal * 0.9);
    const maxEstimate = Math.round(subtotal * 1.12);
    const estimatedDays = Math.max(1, Math.ceil(roomCount * 0.8));

    return { minEstimate, maxEstimate, estimatedDays };
  };

  const { minEstimate, maxEstimate, estimatedDays } = calculateEstimates();

  // Photo upload simulation
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const newPhoto = {
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        preview: URL.createObjectURL(file),
      };
      setUploadedPhotos((prev) => [...prev, newPhoto]);
    }
  };

  const handleConfirmSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !clientEmail || !streetAddress) {
      alert('Please fill out your name, email, and street address to schedule your estimate walkthrough.');
      return;
    }

    const uniqueTrackingCode = `JOB-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const newBooking: WalkthroughBooking = {
      id: `walkthrough-${Date.now()}`,
      trackingCode: uniqueTrackingCode,
      clientName,
      email: clientEmail,
      phone: clientPhone || '(Provided)',
      streetAddress,
      cityZip: cityZip || 'Accra, Ghana',
      consultationType,
      date: selectedDate,
      timeSlot: selectedTimeSlot,
      timezone,
      projectScope: {
        serviceType,
        roomCount,
        estimatedSqFt: approxSqFt,
        wallCondition,
        includeCeilings,
        includeTrimBaseboards,
        paintQuality,
        estimatedCostMin: minEstimate,
        estimatedCostMax: maxEstimate,
        estimatedDays,
      },
      notes: projectNotes,
      referencePhotosCount: uploadedPhotos.length,
      status: 'scheduled',
      createdAt: new Date().toISOString(),
    };

    setConfirmedBooking(newBooking);
    onBookingSuccess(newBooking);
  };

  // Calendar params helper
  const getCalendarParams = (booking: WalkthroughBooking) => ({
    title: `Precision House Painting Walkthrough (${booking.clientName})`,
    description: `On-site house painting walkthrough & measurement.\nService: ${booking.projectScope.serviceType.replace('_', ' ')}\nAddress: ${booking.streetAddress}, ${booking.cityZip}\nTracking Code: ${booking.trackingCode}\nEst. Scope: ${booking.projectScope.roomCount} Rooms (~GH₵ ${booking.projectScope.estimatedCostMin.toLocaleString()} - GH₵ ${booking.projectScope.estimatedCostMax.toLocaleString()})`,
    location: `${booking.streetAddress}, ${booking.cityZip}`,
    dateStr: booking.date,
    timeSlotStr: booking.timeSlot,
    clientName: booking.clientName,
  });

  // SUCCESS CONFIRMATION VIEW
  if (confirmedBooking) {
    const calParams = getCalendarParams(confirmedBooking);
    const googleCalUrl = generateGoogleCalendarUrl(calParams);

    return (
      <div className="bg-[#111726] border border-[#202d45] rounded-2xl p-6 sm:p-10 max-w-3xl mx-auto shadow-2xl text-center space-y-8">
        <div className="w-16 h-16 rounded-full bg-emerald-950 border-2 border-emerald-500 text-emerald-400 flex items-center justify-center mx-auto">
          <Check className="w-8 h-8 stroke-[2.5]" />
        </div>

        <div className="space-y-2">
          <div className="text-xs uppercase tracking-wider text-emerald-400 font-bold">
            Walkthrough Appointment Confirmed & Dates Reserved
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            You're on our schedule, {confirmedBooking.clientName}!
          </h2>
          <p className="text-xs sm:text-sm text-[#94a3b8] max-w-lg mx-auto">
            Our lead painter will visit <strong>{confirmedBooking.streetAddress}</strong> on <strong>{confirmedBooking.date}</strong> between <strong>{confirmedBooking.timeSlot}</strong> with laser measures, color fan decks, and prep checklists.
          </p>
        </div>

        {/* Appointment details box */}
        <div className="p-5 bg-[#0d1422] border border-[#1b273d] rounded-xl text-left grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <span className="text-[#64748b] block font-semibold">Appointment Time & Location:</span>
            <span className="text-white font-bold text-sm block mt-0.5">
              {confirmedBooking.date} · {confirmedBooking.timeSlot}
            </span>
            <span className="text-[#94a3b8] block mt-1">
              {confirmedBooking.streetAddress}, {confirmedBooking.cityZip}
            </span>
          </div>

          <div>
            <span className="text-[#64748b] block font-semibold">Project Reference Job Code:</span>
            <span className="font-mono text-sm text-[#38bdf8] font-extrabold block mt-0.5">
              {confirmedBooking.trackingCode}
            </span>
            <span className="text-[#94a3b8] block mt-1 font-semibold text-emerald-400">
              Estimated Range: GH₵ {confirmedBooking.projectScope.estimatedCostMin.toLocaleString()} – GH₵ {confirmedBooking.projectScope.estimatedCostMax.toLocaleString()} (~{confirmedBooking.projectScope.estimatedDays} days)
            </span>
          </div>
        </div>

        {/* Calendar Sync Integration */}
        <div className="p-5 bg-[#141d30] border border-[#23314d] rounded-xl space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#cbd5e1]">
            Add Walkthrough to Your Personal Calendar
          </h4>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href={googleCalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-5 py-2.5 bg-[#0284c7] hover:bg-[#0369a1] text-white font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Add to Google Calendar</span>
            </a>

            <button
              onClick={() => downloadIcsFile(calParams)}
              className="w-full sm:w-auto px-5 py-2.5 bg-[#1c273d] hover:bg-[#253452] border border-[#2e3f63] text-white font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4 text-[#38bdf8]" />
              <span>Download iCal / Outlook (.ics)</span>
            </button>
          </div>
        </div>

        {/* Action to Client Tracker */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <button
            onClick={() => onNavigateToTracker(confirmedBooking.trackingCode)}
            className="w-full sm:w-auto px-6 py-3 bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold text-xs sm:text-sm rounded-lg transition-colors flex items-center justify-center gap-2 shadow"
          >
            <span>Open Live Job Tracker Portal</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#111726] border border-[#202d45] rounded-2xl overflow-hidden shadow-2xl max-w-4xl mx-auto">
      
      {/* Wizard Header */}
      <div className="p-6 sm:p-8 bg-gradient-to-r from-[#141c2e] to-[#101624] border-b border-[#1e2a42] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-wider text-[#38bdf8] font-bold mb-1">
            Instant Estimate in Ghana Cedis (GH₵) & Scheduling
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Calculate Your Paint Job & Reserve Walkthrough
          </h2>
        </div>

        {/* Steps indicator */}
        <div className="flex items-center gap-2 text-xs font-semibold">
          {[
            { num: 1, label: 'Scope' },
            { num: 2, label: 'Add-ons' },
            { num: 3, label: 'Schedule' },
            { num: 4, label: 'Confirm' },
          ].map((st) => (
            <div key={st.num} className="flex items-center gap-1.5">
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                  currentStep === st.num
                    ? 'bg-[#0284c7] text-white font-bold'
                    : currentStep > st.num
                    ? 'bg-[#1b263b] text-[#38bdf8]'
                    : 'bg-[#141c2c] text-[#64748b]'
                }`}
              >
                {currentStep > st.num ? <Check className="w-3.5 h-3.5" /> : st.num}
              </span>
              <span className={`hidden sm:inline ${currentStep === st.num ? 'text-white' : 'text-[#64748b]'}`}>
                {st.label}
              </span>
              {st.num < 4 && <span className="text-[#263550] hidden sm:inline">/</span>}
            </div>
          ))}
        </div>
      </div>

      <div className="p-6 sm:p-8">
        
        {/* STEP 1: Project Scope & Rooms */}
        {currentStep === 1 && (
          <div className="space-y-8">
            
            {/* Service Type */}
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-[#cbd5e1] block">
                1. What are we painting?
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { id: 'interior_rooms', label: 'Interior Rooms & POP', desc: 'Halls, bedrooms, arches' },
                  { id: 'exterior_house', label: 'Exterior Building', desc: 'Full house & balcony pillars' },
                  { id: 'trim_doors', label: 'Pillars & Arches', desc: 'Decorative columns & hoods' },
                  { id: 'cabinets', label: 'Compound Fence Wall', desc: 'Perimeter boundary walls' },
                ].map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setServiceType(s.id)}
                    className={`p-3.5 rounded-xl border text-left transition-all ${
                      serviceType === s.id
                        ? 'bg-[#1b263b] border-[#38bdf8] text-white shadow-md'
                        : 'bg-[#0e1422] border-[#1e2a42] text-[#94a3b8] hover:border-[#2f4063]'
                    }`}
                  >
                    <div className="text-xs font-bold text-white">{s.label}</div>
                    <div className="text-[11px] text-[#64748b] mt-0.5">{s.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Room Count / Scope size */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold uppercase tracking-wider text-[#cbd5e1]">Number of Rooms / Zones</span>
                  <span className="font-bold text-[#38bdf8] text-sm">{roomCount} {roomCount === 1 ? 'Room' : 'Rooms'}</span>
                </div>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5, 6].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => {
                        setRoomCount(num);
                        setApproxSqFt(num * 250);
                      }}
                      className={`flex-1 py-2 text-xs font-bold rounded-lg border transition-colors ${
                        roomCount === num
                          ? 'bg-[#0284c7] border-[#0284c7] text-white'
                          : 'bg-[#0e1422] border-[#1e2a42] text-[#94a3b8] hover:text-white'
                      }`}
                    >
                      {num}{num === 6 ? '+' : ''}
                    </button>
                  ))}
                </div>
              </div>

              {/* Square footage slider */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold uppercase tracking-wider text-[#cbd5e1]">Estimated Area</span>
                  <span className="font-bold text-[#38bdf8] text-sm">{approxSqFt} sq. ft.</span>
                </div>
                <input
                  type="range"
                  min="200"
                  max="3500"
                  step="50"
                  value={approxSqFt}
                  onChange={(e) => setApproxSqFt(Number(e.target.value))}
                  className="w-full accent-[#0284c7] cursor-pointer"
                />
                <div className="flex items-center justify-between text-[11px] text-[#64748b]">
                  <span>1-2 Rooms (~300 sq.ft)</span>
                  <span>Full Compound / Storey House (~2,500+ sq.ft)</span>
                </div>
              </div>
            </div>

            {/* Wall Condition / Prep Needed */}
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-[#cbd5e1] block">
                Current Wall Condition & Plaster Prep
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  {
                    id: 'excellent',
                    title: 'Good Cured Surface',
                    desc: 'Smooth plastered walls, minimal dust, ready for direct primer & paint.',
                  },
                  {
                    id: 'minor_patching',
                    title: 'Standard Prep (Typical)',
                    desc: 'Hairline plaster cracks, minor POP joint unevenness, nail holes.',
                  },
                  {
                    id: 'heavy_repair_cracks',
                    title: 'Fresh Render / Rain Stains',
                    desc: 'Fresh concrete render requiring alkali primer, or water stain sealing.',
                  },
                ].map((cond) => (
                  <button
                    key={cond.id}
                    type="button"
                    onClick={() => setWallCondition(cond.id as any)}
                    className={`p-3.5 rounded-xl border text-left transition-all ${
                      wallCondition === cond.id
                        ? 'bg-[#1b263b] border-[#38bdf8] text-white shadow-md'
                        : 'bg-[#0e1422] border-[#1e2a42] text-[#94a3b8] hover:border-[#2f4063]'
                    }`}
                  >
                    <div className="text-xs font-bold text-white">{cond.title}</div>
                    <div className="text-[11px] text-[#64748b] mt-1 leading-snug">{cond.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 1 Live Estimate Bar in Cedis */}
            <div className="p-4 bg-[#0d1422] border border-[#1b273d] rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div>
                <span className="text-[#94a3b8]">Estimated Cost in Cedis:</span>
                <span className="text-white text-lg font-bold ml-2">
                  GH₵ {minEstimate.toLocaleString()} – GH₵ {maxEstimate.toLocaleString()}
                </span>
                <span className="text-[#64748b] ml-2">(~{estimatedDays} days on-site)</span>
              </div>
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="w-full sm:w-auto px-5 py-2.5 bg-[#0284c7] hover:bg-[#0369a1] text-white font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Continue to Add-ons & Paint Grade</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        )}

        {/* STEP 2: Add-ons & Paint Quality */}
        {currentStep === 2 && (
          <div className="space-y-8">
            
            {/* Ceilings & Trim Toggles */}
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-[#cbd5e1] block">
                Include Ceilings and Trim Highlights?
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="p-4 bg-[#0e1422] border border-[#1e2a42] rounded-xl flex items-start gap-3 cursor-pointer hover:border-[#2f4063] transition-colors">
                  <input
                    type="checkbox"
                    checked={includeCeilings}
                    onChange={(e) => setIncludeCeilings(e.target.checked)}
                    className="w-5 h-5 rounded border-[#2e3e61] accent-[#0284c7] mt-0.5"
                  />
                  <div>
                    <strong className="text-white text-xs block">Paint POP Ceilings (Brilliant Flat White)</strong>
                    <span className="text-[11px] text-[#94a3b8] block mt-0.5">
                      Brightens hall and accentuates decorative molded ceiling tiers.
                    </span>
                  </div>
                </label>

                <label className="p-4 bg-[#0e1422] border border-[#1e2a42] rounded-xl flex items-start gap-3 cursor-pointer hover:border-[#2f4063] transition-colors">
                  <input
                    type="checkbox"
                    checked={includeTrimBaseboards}
                    onChange={(e) => setIncludeTrimBaseboards(e.target.checked)}
                    className="w-5 h-5 rounded border-[#2e3e61] accent-[#0284c7] mt-0.5"
                  />
                  <div>
                    <strong className="text-white text-xs block">Paint Arches, Pillars & Window Hoods</strong>
                    <span className="text-[11px] text-[#94a3b8] block mt-0.5">
                      Decorative contrasting colors with laser-sharp edge definition.
                    </span>
                  </div>
                </label>
              </div>
            </div>

            {/* Paint Grade Tier */}
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-[#cbd5e1] block">
                Paint Quality & Brand System
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  {
                    id: 'premium',
                    title: 'Standard Quality',
                    brand: 'Leyland / Local High-Grade Emulsion',
                    desc: 'Clean coverage, smooth finish, cost-effective for rental and basic refresh.',
                  },
                  {
                    id: 'ultra_durable',
                    title: 'Coral & Dulux Shield (Recommended)',
                    brand: 'Coral WeatherShield / Dulux Super Silk',
                    desc: 'Washable, anti-fungal, scrubbable walls, high UV resistance for tropical weather.',
                  },
                  {
                    id: 'luxury_designer',
                    title: 'Inesfly Anti-Insect & Premium Acrylic',
                    brand: 'Inesfly / Azar Luxury Exterior Shield',
                    desc: 'Top-tier finish that repels insects, extreme rain barrier, and rich deep color retention.',
                  },
                ].map((tier) => (
                  <button
                    key={tier.id}
                    type="button"
                    onClick={() => setPaintQuality(tier.id as any)}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      paintQuality === tier.id
                        ? 'bg-[#1b263b] border-[#38bdf8] text-white shadow-md'
                        : 'bg-[#0e1422] border-[#1e2a42] text-[#94a3b8] hover:border-[#2f4063]'
                    }`}
                  >
                    <div className="text-xs font-bold text-white">{tier.title}</div>
                    <div className="text-[11px] text-[#38bdf8] mt-0.5 font-medium">{tier.brand}</div>
                    <div className="text-[11px] text-[#64748b] mt-2 leading-relaxed">{tier.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Navigation Buttons for Step 2 */}
            <div className="flex items-center justify-between pt-4 border-t border-[#1a253a]">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="px-4 py-2 border border-[#23314d] hover:border-[#38bdf8] text-xs font-semibold text-[#94a3b8] hover:text-white rounded-lg transition-colors flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Scope</span>
              </button>

              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="px-5 py-2.5 bg-[#0284c7] hover:bg-[#0369a1] text-white font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5"
              >
                <span>Select Walkthrough Date & Time</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        )}

        {/* STEP 3: Integrated Scheduling System for On-Site Walkthrough */}
        {currentStep === 3 && (
          <div className="space-y-8">
            <div>
              <div className="text-xs uppercase tracking-wider text-[#38bdf8] font-bold mb-1">
                Integrated Walkthrough Scheduler
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white">
                Choose a Day for Your Free In-Person Walkthrough
              </h3>
              <p className="text-xs text-[#94a3b8] mt-1">
                Our lead painter visits your property with laser measures, checks wall rendering and plaster quality, and shows physical color swatches. Takes about 25-30 minutes.
              </p>
            </div>

            {/* Consultation Format: In-Person vs Virtual */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setConsultationType('in_person_walkthrough')}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  consultationType === 'in_person_walkthrough'
                    ? 'bg-[#1b263b] border-[#38bdf8] text-white'
                    : 'bg-[#0e1422] border-[#1e2a42] text-[#94a3b8]'
                }`}
              >
                <div className="text-xs font-bold text-white">On-Site In-Person Walkthrough (Recommended)</div>
                <div className="text-[11px] text-[#64748b] mt-0.5">We inspect the house or rooms in person</div>
              </button>

              <button
                type="button"
                onClick={() => setConsultationType('virtual_video_estimate')}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  consultationType === 'virtual_video_estimate'
                    ? 'bg-[#1b263b] border-[#38bdf8] text-white'
                    : 'bg-[#0e1422] border-[#1e2a42] text-[#94a3b8]'
                }`}
              >
                <div className="text-xs font-bold text-white">WhatsApp Video / Phone Call Consultation</div>
                <div className="text-[11px] text-[#64748b] mt-0.5">Show us your rooms or building over video call</div>
              </button>
            </div>

            {/* Date selection grid */}
            <div className="bg-[#0e1422] border border-[#1e2a42] rounded-xl p-5 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#cbd5e1] block">
                Select Available Date:
              </span>

              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2">
                {[
                  { date: '2026-11-03', day: 'Tue', slots: '3 slots' },
                  { date: '2026-11-04', day: 'Wed', slots: '2 slots' },
                  { date: '2026-11-05', day: 'Thu', slots: '4 slots' },
                  { date: '2026-11-06', day: 'Fri', slots: '2 slots' },
                  { date: '2026-11-07', day: 'Sat', slots: '1 slot' },
                  { date: '2026-11-09', day: 'Mon', slots: '3 slots' },
                ].map((d) => (
                  <button
                    key={d.date}
                    type="button"
                    onClick={() => setSelectedDate(d.date)}
                    className={`p-3 rounded-lg border text-center transition-all ${
                      selectedDate === d.date
                        ? 'bg-[#0284c7] border-[#0284c7] text-white font-bold shadow'
                        : 'bg-[#141b2b] border-[#202d44] text-[#cbd5e1] hover:border-[#38bdf8]'
                    }`}
                  >
                    <div className="text-[11px] uppercase font-semibold text-[#94a3b8]">{d.day}</div>
                    <div className="text-sm font-bold text-white my-0.5">{d.date.slice(-2)} Nov</div>
                    <div className="text-[10px] text-emerald-400">{d.slots}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Time Slot Picker */}
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#cbd5e1] block">
                Select Preferred Time Window ({selectedDate}):
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  '08:30 AM - 10:00 AM',
                  '10:30 AM - 12:00 PM',
                  '01:30 PM - 03:00 PM',
                  '03:30 PM - 05:00 PM',
                ].map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setSelectedTimeSlot(slot)}
                    className={`p-3 rounded-lg border text-center text-xs font-semibold transition-all ${
                      selectedTimeSlot === slot
                        ? 'bg-[#0284c7] border-[#0284c7] text-white font-bold'
                        : 'bg-[#0e1422] border-[#1e2a42] text-[#94a3b8] hover:text-white hover:border-[#2f4063]'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            {/* Navigation Buttons for Step 3 */}
            <div className="flex items-center justify-between pt-4 border-t border-[#1a253a]">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="px-4 py-2 border border-[#23314d] hover:border-[#38bdf8] text-xs font-semibold text-[#94a3b8] hover:text-white rounded-lg transition-colors flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Options</span>
              </button>

              <button
                type="button"
                onClick={() => setCurrentStep(4)}
                className="px-5 py-2.5 bg-[#0284c7] hover:bg-[#0369a1] text-white font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5"
              >
                <span>Enter Address & Review</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        )}

        {/* STEP 4: Client Contact, Address & Instant Reservation */}
        {currentStep === 4 && (
          <form onSubmit={handleConfirmSubmit} className="space-y-8">
            
            {/* Estimate Summary Box in Cedis */}
            <div className="p-5 bg-[#0e1422] border border-[#1e2a42] rounded-xl space-y-4 text-xs">
              <h4 className="font-bold text-white text-sm uppercase tracking-wider text-[#38bdf8]">
                Project Scope & Walkthrough Summary
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <span className="text-[#64748b] block">Service Category:</span>
                  <span className="text-white font-semibold capitalize">{serviceType.replace('_', ' ')}</span>
                </div>
                <div>
                  <span className="text-[#64748b] block">Rooms / Zones:</span>
                  <span className="text-white font-semibold">{roomCount} Rooms (~{approxSqFt} sq. ft.)</span>
                </div>
                <div>
                  <span className="text-[#64748b] block">Ceilings & Trim:</span>
                  <span className="text-white font-semibold">
                    {includeCeilings ? 'POP Ceilings Included' : 'No Ceilings'} · {includeTrimBaseboards ? 'Arches & Trim Included' : 'No Trim'}
                  </span>
                </div>
                <div>
                  <span className="text-[#64748b] block">Selected Walkthrough Window:</span>
                  <span className="text-white font-semibold">
                    {selectedDate} ({selectedTimeSlot})
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-[#1b263b] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-[#94a3b8]">Estimated Cost in Cedis:</span>
                  <span className="text-white text-xl font-bold ml-2">
                    GH₵ {minEstimate.toLocaleString()} – GH₵ {maxEstimate.toLocaleString()}
                  </span>
                </div>
                <div className="text-emerald-400 font-semibold">
                  Zero Obligation Walkthrough (100% Free On-Site Quote)
                </div>
              </div>
            </div>

            {/* Address & Contact Information */}
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#cbd5e1] block">
                Where is your property located?
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-[#94a3b8] block mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Kwame Mensah"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full p-2.5 bg-[#0e1422] border border-[#1e2a42] rounded-lg text-xs text-white placeholder-[#64748b] focus:outline-none focus:border-[#38bdf8]"
                  />
                </div>

                <div>
                  <label className="text-xs text-[#94a3b8] block mb-1">Email (for appointment & quote) *</label>
                  <input
                    type="email"
                    required
                    placeholder="kwame@example.com"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    className="w-full p-2.5 bg-[#0e1422] border border-[#1e2a42] rounded-lg text-xs text-white placeholder-[#64748b] focus:outline-none focus:border-[#38bdf8]"
                  />
                </div>

                <div>
                  <label className="text-xs text-[#94a3b8] block mb-1">Phone / WhatsApp (for arrival text) *</label>
                  <input
                    type="tel"
                    required
                    placeholder="024 123 4567 or 055 987 6543"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    className="w-full p-2.5 bg-[#0e1422] border border-[#1e2a42] rounded-lg text-xs text-white placeholder-[#64748b] focus:outline-none focus:border-[#38bdf8]"
                  />
                </div>

                <div>
                  <label className="text-xs text-[#94a3b8] block mb-1">Property Location / Street Address *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Near Shell filling station, Spintex Road"
                    value={streetAddress}
                    onChange={(e) => setStreetAddress(e.target.value)}
                    className="w-full p-2.5 bg-[#0e1422] border border-[#1e2a42] rounded-lg text-xs text-white placeholder-[#64748b] focus:outline-none focus:border-[#38bdf8]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs text-[#94a3b8] block mb-1">Town / Area & City</label>
                  <input
                    type="text"
                    placeholder="e.g. East Legon, Accra / Nhyiaeso, Kumasi / Tema Community 25"
                    value={cityZip}
                    onChange={(e) => setCityZip(e.target.value)}
                    className="w-full p-2.5 bg-[#0e1422] border border-[#1e2a42] rounded-lg text-xs text-white placeholder-[#64748b] focus:outline-none focus:border-[#38bdf8]"
                  />
                </div>
              </div>

              {/* Photo Upload Simulation */}
              <div className="space-y-2 pt-2">
                <label className="text-xs text-[#94a3b8] block">
                  Upload Room or House Photos (Optional — helps us prepare paint quantities)
                </label>
                <div className="border border-dashed border-[#243350] hover:border-[#38bdf8] rounded-xl p-4 text-center bg-[#0d1422] relative transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  <Upload className="w-5 h-5 text-[#38bdf8] mx-auto mb-1" />
                  <span className="text-xs text-[#cbd5e1] font-semibold block">
                    Click to add photos of current rooms or exterior walls
                  </span>
                  <span className="text-[11px] text-[#64748b]">JPG, PNG from phone</span>
                </div>

                {uploadedPhotos.length > 0 && (
                  <div className="flex gap-2 pt-1">
                    {uploadedPhotos.map((p, idx) => (
                      <div key={idx} className="p-2 bg-[#141d30] border border-[#23314d] rounded text-[11px] text-[#cbd5e1] flex items-center gap-2">
                        <span>{p.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Navigation Buttons for Step 4 */}
            <div className="flex items-center justify-between pt-4 border-t border-[#1a253a]">
              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="px-4 py-2 border border-[#23314d] hover:border-[#38bdf8] text-xs font-semibold text-[#94a3b8] hover:text-white rounded-lg transition-colors flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Calendar</span>
              </button>

              <button
                type="submit"
                className="px-6 py-3 bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold text-xs sm:text-sm rounded-lg transition-all shadow-lg flex items-center gap-2 active:scale-[0.98]"
              >
                <CalendarIcon className="w-4 h-4" />
                <span>Confirm Walkthrough Appointment</span>
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
