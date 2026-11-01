/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ProjectsGallery } from './components/ProjectsGallery';
import { ProjectLightboxModal } from './components/ProjectLightboxModal';
import { ServicesSection } from './components/ServicesSection';
import { ProjectEstimatorWizard } from './components/ProjectEstimatorWizard';
import { ColorPaletteVisualizer } from './components/ColorPaletteVisualizer';
import { ClientJobTracker } from './components/ClientJobTracker';
import { CraftsmanshipStandards } from './components/CraftsmanshipStandards';
import { PainterDashboardModal } from './components/PainterDashboardModal';
import { Footer } from './components/Footer';
import { CompletedProject, WalkthroughBooking, ActiveJob, JobPhase, ServicePackage } from './types/painting';
import { SAMPLE_ACTIVE_JOBS } from './data/housePaintingData';

export default function App() {
  const [activeTab, setActiveTab] = useState<'work' | 'services' | 'estimate' | 'tracker' | 'about'>('work');
  const [selectedProject, setSelectedProject] = useState<CompletedProject | null>(null);
  const [estimatorCategory, setEstimatorCategory] = useState<string>('interior_rooms');
  
  // Painter contractor modal
  const [isDashboardOpen, setIsDashboardOpen] = useState<boolean>(false);
  const [crewSlots, setCrewSlots] = useState<number>(2);

  // Dynamic bookings & active jobs state
  const [bookings, setBookings] = useState<WalkthroughBooking[]>(() => {
    try {
      const saved = localStorage.getItem('precision_painter_bookings');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // ignore
    }
    return [
      {
        id: 'booking-init-1',
        trackingCode: 'JOB-2026-4912',
        clientName: 'Kwame Mensah',
        email: 'kwame.mensah@gmail.com',
        phone: '024 392 1084',
        streetAddress: 'Plot 42, Trassaco Valley Phase 2',
        cityZip: 'Accra, Ghana',
        consultationType: 'in_person_walkthrough',
        date: '2026-11-04',
        timeSlot: '10:30 AM - 12:00 PM',
        timezone: 'GMT',
        projectScope: {
          serviceType: 'interior_rooms',
          roomCount: 4,
          estimatedSqFt: 1400,
          wallCondition: 'minor_patching',
          includeCeilings: true,
          includeTrimBaseboards: true,
          paintQuality: 'ultra_durable',
          estimatedCostMin: 4800,
          estimatedCostMax: 6200,
          estimatedDays: 4,
        },
        notes: 'Main living hall, POP ceiling, and three bedrooms. Requesting Coral WeatherShield & Dulux Pure White.',
        referencePhotosCount: 2,
        status: 'scheduled',
        createdAt: '2026-10-28T10:15:00Z',
      },
    ];
  });

  const [activeJobs, setActiveJobs] = useState<ActiveJob[]>(() => {
    try {
      const saved = localStorage.getItem('precision_painter_jobs');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // ignore
    }
    return SAMPLE_ACTIVE_JOBS;
  });

  const [activeTrackingCode, setActiveTrackingCode] = useState<string>('JOB-2026-4912');

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem('precision_painter_bookings', JSON.stringify(bookings));
    } catch (e) {
      // ignore
    }
  }, [bookings]);

  useEffect(() => {
    try {
      localStorage.setItem('precision_painter_jobs', JSON.stringify(activeJobs));
    } catch (e) {
      // ignore
    }
  }, [activeJobs]);

  // Handle new walkthrough booking
  const handleBookingSuccess = (newBooking: WalkthroughBooking) => {
    setBookings((prev) => [newBooking, ...prev]);

    // Create corresponding job entry for tracking
    const newJob: ActiveJob = {
      trackingCode: newBooking.trackingCode,
      clientName: newBooking.clientName,
      address: `${newBooking.streetAddress}, ${newBooking.cityZip}`,
      projectTitle: `${newBooking.projectScope.roomCount}-Room ${newBooking.projectScope.serviceType.replace('_', ' ').toUpperCase()} Repaint`,
      scopeSummary: `${newBooking.projectScope.estimatedSqFt} sq. ft. · ${newBooking.projectScope.includeCeilings ? 'Ceilings + ' : ''}${newBooking.projectScope.includeTrimBaseboards ? 'Trim' : ''}`,
      paintBrandColor: `Tier: ${newBooking.projectScope.paintQuality.replace('_', ' ')}`,
      currentPhase: 'walkthrough_scheduled',
      percentComplete: 15,
      startDate: newBooking.date,
      estimatedCompletionDate: `In ~${newBooking.projectScope.estimatedDays} days after approval`,
      warrantyYears: 3,
      updates: [
        {
          phase: 'walkthrough_scheduled',
          title: `Walkthrough Reserved (${newBooking.timeSlot})`,
          date: newBooking.date,
          description: `Lead painter booked to visit ${newBooking.streetAddress} for laser room measurement and color consultation.`,
          completed: true,
        },
        {
          phase: 'quote_approved',
          title: 'Detailed Itemized Written Quote',
          date: 'Pending Walkthrough',
          description: 'Firm fixed-price proposal covering all labor, paint cans, and surface repair.',
          completed: false,
        },
        {
          phase: 'colors_finalized',
          title: 'Color Fan Deck & Test Swatch Review',
          date: 'Pending',
          description: 'Testing paint sample squares on walls under natural daylight.',
          completed: false,
        },
        {
          phase: 'prep_masking',
          title: 'Floor Protection & HEPA Dustless Drywall Sanding',
          date: 'Pending',
          description: 'Covering 100% of hardwood floors with heavy builder board and patching nail holes.',
          completed: false,
        },
        {
          phase: 'primer_sealer',
          title: 'Stain-Blocking Bonding Primer',
          date: 'Pending',
          description: 'Applying stain blocker over patched seams to prevent flashing.',
          completed: false,
        },
        {
          phase: 'finish_coating',
          title: 'Double Finish Coats with Laser Freehand Cut-In',
          date: 'Pending',
          description: 'Precision brushwork along ceilings, baseboards, and window casings.',
          completed: false,
        },
        {
          phase: 'inspection_walkthrough',
          title: 'Final Client Inspection with 5000K Work Lights',
          date: 'Pending',
          description: 'Joint walkthrough with the homeowner to ensure 100% perfection.',
          completed: false,
        },
        {
          phase: 'clean_warranty',
          title: 'Complete Clean-up & 3-Year Warranty Handover',
          date: 'Pending',
          description: 'Full vacuuming, labeled touch-up paint cans, and signed guarantee.',
          completed: false,
        },
      ],
    };

    setActiveJobs((prev) => [newJob, ...prev]);
    setActiveTrackingCode(newBooking.trackingCode);
    setCrewSlots((slots) => Math.max(0, slots - 1));
  };

  // Advance job phase by painter in contractor dashboard
  const handleUpdateJobPhase = (trackingCode: string, newPhase: JobPhase) => {
    const phasePercentMap: Record<JobPhase, number> = {
      walkthrough_scheduled: 15,
      quote_approved: 25,
      colors_finalized: 35,
      prep_masking: 50,
      primer_sealer: 65,
      finish_coating: 80,
      inspection_walkthrough: 92,
      clean_warranty: 100,
    };

    setActiveJobs((prev) =>
      prev.map((job) => {
        if (job.trackingCode !== trackingCode) return job;
        const newPercent = phasePercentMap[newPhase] || 50;
        const updatedUpdates = job.updates.map((u) => {
          if (u.phase === newPhase) {
            return { ...u, completed: true, date: 'Updated Today by Painter' };
          }
          return u;
        });

        return {
          ...job,
          currentPhase: newPhase,
          percentComplete: newPercent,
          updates: updatedUpdates,
        };
      })
    );
  };

  // Navigating to Estimator with specific service pre-selected
  const handleSelectServicePackage = (pkg: ServicePackage) => {
    setEstimatorCategory(pkg.category);
    setActiveTab('estimate');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Navigating to Estimator with a completed project reference
  const handleBookSimilarProject = (project: CompletedProject) => {
    setEstimatorCategory(project.category);
    setActiveTab('estimate');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Navigate to tracker after booking
  const handleNavigateToTracker = (trackingCode: string) => {
    setActiveTrackingCode(trackingCode);
    setActiveTab('tracker');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#0a0d14] text-[#e2e8f0] flex flex-col selection:bg-[#38bdf8] selection:text-[#0a0d14]">
      
      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenBooking={() => {
          setActiveTab('estimate');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenDashboard={() => setIsDashboardOpen(true)}
        activeJobsCount={bookings.length}
      />

      {/* Main Content Sections */}
      <main className="flex-1">
        {activeTab === 'work' && (
          <>
            <Hero
              onStartEstimate={() => {
                setActiveTab('estimate');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onExploreWork={() => {
                const el = document.getElementById('work');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              onOpenQuickBooking={() => {
                setActiveTab('estimate');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
            <ProjectsGallery
              onSelectProject={(project) => setSelectedProject(project)}
              onBookSimilar={handleBookSimilarProject}
            />
            <ColorPaletteVisualizer />
            <ServicesSection onSelectService={handleSelectServicePackage} />
            <CraftsmanshipStandards
              onScheduleEstimate={() => {
                setActiveTab('estimate');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          </>
        )}

        {activeTab === 'services' && (
          <div className="pt-4">
            <ServicesSection onSelectService={handleSelectServicePackage} />
            <ColorPaletteVisualizer />
          </div>
        )}

        {activeTab === 'estimate' && (
          <div className="py-12 md:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <div className="mb-10 text-center max-w-2xl mx-auto">
              <span className="text-xs uppercase tracking-wider text-[#38bdf8] font-bold block mb-2">
                Instant Room & House Calculator
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white">
                Get an Estimate & Schedule Walkthrough
              </h1>
              <p className="text-xs sm:text-sm text-[#94a3b8] mt-2">
                Customize your room count, square footage, and prep needs. Then select an available date on our crew schedule for your free in-home measurement.
              </p>
            </div>

            <ProjectEstimatorWizard
              initialServiceCategory={estimatorCategory}
              onBookingSuccess={handleBookingSuccess}
              onNavigateToTracker={handleNavigateToTracker}
            />
          </div>
        )}

        {activeTab === 'tracker' && (
          <ClientJobTracker
            customJobs={activeJobs}
            initialTrackingCode={activeTrackingCode}
          />
        )}

        {activeTab === 'about' && (
          <div className="pt-6">
            <CraftsmanshipStandards
              onScheduleEstimate={() => {
                setActiveTab('estimate');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
            <ColorPaletteVisualizer />
          </div>
        )}
      </main>

      {/* Project Lightbox Inspection Modal */}
      <ProjectLightboxModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        onBookSimilar={handleBookSimilarProject}
      />

      {/* Painter Contractor Dashboard Modal */}
      <PainterDashboardModal
        isOpen={isDashboardOpen}
        onClose={() => setIsDashboardOpen(false)}
        bookings={bookings}
        activeJobs={activeJobs}
        onUpdateJobPhase={handleUpdateJobPhase}
        crewSlots={crewSlots}
        onUpdateCrewSlots={setCrewSlots}
      />

      {/* Footer */}
      <Footer
        onNavigateTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenBooking={() => {
          setActiveTab('estimate');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

    </div>
  );
}
