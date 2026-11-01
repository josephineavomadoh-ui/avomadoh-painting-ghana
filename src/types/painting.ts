/**
 * Professional House & Room Painting Data Models
 */

export type ServiceCategory = 
  | 'all'
  | 'interior_rooms'
  | 'exterior_house'
  | 'cabinets'
  | 'trim_doors'
  | 'specialty_finishes';

export interface CompletedProject {
  id: string;
  title: string;
  category: ServiceCategory;
  roomType: string;
  sqFt: number;
  paintBrand: string;
  colorName: string;
  colorCode: string;
  sheen: string; // 'Matte' | 'Eggshell' | 'Satin' | 'Semi-Gloss'
  completionDays: number;
  description: string;
  prepHighlights: string[];
  imageUrl: string;
  beforeDescription?: string;
  clientCity: string;
}

export interface ServicePackage {
  id: string;
  title: string;
  subtitle: string;
  category: ServiceCategory;
  description: string;
  baseRate: string;
  turnaround: string;
  features: string[];
}

export interface ColorSwatch {
  id: string;
  name: string;
  code: string;
  brand: string;
  hex: string;
  family: 'warm_neutral' | 'cool_neutral' | 'moody_dark' | 'earthy_green' | 'coastal_blue';
  recommendedSheen: string;
  roomBestFit: string;
}

export type ConsultationType = 'in_person_walkthrough' | 'virtual_video_estimate';

export interface WalkthroughBooking {
  id: string;
  trackingCode: string; // e.g. "JOB-2026-8491"
  clientName: string;
  email: string;
  phone: string;
  streetAddress: string;
  cityZip: string;
  consultationType: ConsultationType;
  date: string; // YYYY-MM-DD
  timeSlot: string; // e.g. "09:00 AM - 10:30 AM"
  timezone: string;
  projectScope: {
    serviceType: string;
    roomCount: number;
    estimatedSqFt: number;
    wallCondition: 'excellent' | 'minor_patching' | 'heavy_repair_cracks';
    includeCeilings: boolean;
    includeTrimBaseboards: boolean;
    paintQuality: 'premium' | 'ultra_durable' | 'luxury_designer';
    estimatedCostMin: number;
    estimatedCostMax: number;
    estimatedDays: number;
  };
  notes: string;
  referencePhotosCount: number;
  status: 'scheduled' | 'quote_sent' | 'in_progress' | 'completed';
  createdAt: string;
}

export type JobPhase = 
  | 'walkthrough_scheduled'
  | 'quote_approved'
  | 'colors_finalized'
  | 'prep_masking'
  | 'primer_sealer'
  | 'finish_coating'
  | 'inspection_walkthrough'
  | 'clean_warranty';

export interface JobUpdate {
  phase: JobPhase;
  title: string;
  date: string;
  description: string;
  completed: boolean;
}

export interface ActiveJob {
  trackingCode: string;
  clientName: string;
  address: string;
  projectTitle: string;
  scopeSummary: string;
  paintBrandColor: string;
  currentPhase: JobPhase;
  percentComplete: number;
  startDate: string;
  estimatedCompletionDate: string;
  warrantyYears: number;
  updates: JobUpdate[];
}
