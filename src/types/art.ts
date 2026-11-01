/**
 * Core type definitions for Artist Portfolio & Commission Scheduling System
 */

export type ArtworkCategory = 'all' | 'portrait' | 'landscape' | 'still_life' | 'botanical' | 'plein_air' | 'pet';

export type ArtworkStatus = 'available' | 'commissioned' | 'private_collection' | 'museum_loan';

export interface Artwork {
  id: string;
  title: string;
  category: 'portrait' | 'landscape' | 'still_life' | 'botanical' | 'plein_air' | 'pet';
  medium: string;
  surface: string;
  dimensions: string;
  dimensionsCm: string;
  year: number;
  price?: number;
  status: ArtworkStatus;
  imageUrl: string;
  story: string;
  technique: string;
  palettePaints: string[];
  featured?: boolean;
  collectorLocation?: string;
}

export type CommissionMedium = 'oil_linen' | 'acrylic_panel' | 'charcoal_rag' | 'gouache_cotton';

export interface MediumOption {
  id: CommissionMedium;
  name: string;
  subtitle: string;
  description: string;
  basePrice: number;
  curingWeeks: number;
  bestFor: string;
}

export type CommissionSubject = 'portrait' | 'pet' | 'landscape' | 'botanical' | 'heirloom_home' | 'abstract';

export interface SubjectOption {
  id: CommissionSubject;
  name: string;
  description: string;
  priceMultiplier: number;
  popularSize: string;
}

export interface CanvasSizeOption {
  id: string;
  name: string;
  dimensions: string;
  dimensionsCm: string;
  price: number;
  suggestedRoom: string;
  estimatedWeeks: number;
}

export interface FrameOption {
  id: string;
  name: string;
  description: string;
  material: string;
  price: number;
}

export type ConsultationMode = 'video_call' | 'studio_visit' | 'phone';

export interface ConsultationBooking {
  id: string;
  commissionTrackingId: string;
  clientName: string;
  email: string;
  phone: string;
  cityCountry: string;
  consultationMode: ConsultationMode;
  date: string; // YYYY-MM-DD
  timeSlot: string; // e.g. "11:00 AM - 11:45 AM"
  timezone: string;
  notes: string;
  referenceImagesCount: number;
  commissionSpecs: {
    medium: string;
    subject: string;
    canvasSize: string;
    dimensions: string;
    framing: string;
    estimatedTotal: number;
    depositAmount: number;
    completionWeeks: number;
    specialRequests?: string;
  };
  status: 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  createdAt: string;
}

export type CommissionProgressStage = 
  | 'consultation'
  | 'concept_sketch'
  | 'underpainting'
  | 'impasto_layers'
  | 'client_review'
  | 'varnish_cure'
  | 'framing'
  | 'shipped';

export interface CommissionStageUpdate {
  stage: CommissionProgressStage;
  title: string;
  date: string;
  description: string;
  imageUrl?: string;
  completed: boolean;
}

export interface CommissionProject {
  trackingId: string;
  clientName: string;
  title: string;
  medium: string;
  dimensions: string;
  framing: string;
  currentStage: CommissionProgressStage;
  stageProgressPercent: number;
  startDate: string;
  targetCompletionDate: string;
  updates: CommissionStageUpdate[];
  finalArtworkUrl?: string;
  certificateNumber: string;
}
