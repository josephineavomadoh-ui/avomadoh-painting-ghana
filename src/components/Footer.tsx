import React, { useState } from 'react';
import { PaintRoller, Phone, Mail, Check, MessageSquare } from 'lucide-react';

interface FooterProps {
  onNavigateTab: (tab: 'work' | 'services' | 'estimate' | 'tracker' | 'about') => void;
  onOpenBooking: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigateTab, onOpenBooking }) => {
  const [newsletterPhone, setNewsletterPhone] = useState<string>('');
  const [subscribed, setSubscribed] = useState<boolean>(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterPhone) return;
    setSubscribed(true);
    setNewsletterPhone('');
    setTimeout(() => setSubscribed(false), 4000);
  };

  return (
    <footer className="bg-[#080b12] border-t border-[#1b253b] text-xs text-[#94a3b8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          
          {/* Brand Info */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#0284c7] text-white flex items-center justify-center">
                <PaintRoller className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-lg text-white">JudeCraft Finishes</span>
            </div>

            <p className="text-xs text-[#94a3b8] leading-relaxed max-w-sm">
              Residential and commercial painting and finishing for interiors, exteriors, ceilings, and more. We serve clients across Ghana.
            </p>

            <div className="space-y-1.5 text-[#cbd5e1]">
              <div className="flex items-center gap-2">
                <span className="text-[#38bdf8]">Service area:</span>
                <span>Nationwide across Ghana</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Call / WhatsApp: 024 123 4567 / 055 892 1084</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Painting Services & Rates
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onNavigateTab('work')}
                  className="hover:text-white transition-colors"
                >
                  Completed Houses & Portfolio
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab('services')}
                  className="hover:text-white transition-colors"
                >
                  Services & Cedis (GH₵) Rates
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab('estimate')}
                  className="hover:text-white text-[#38bdf8] transition-colors"
                >
                  Instant Online Cedis Estimator
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab('tracker')}
                  className="hover:text-white transition-colors"
                >
                  Live Painting Project Tracker
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab('about')}
                  className="hover:text-white transition-colors"
                >
                  POP Screeding & WeatherShield Prep
                </button>
              </li>
            </ul>
          </div>

          {/* WhatsApp / Walkthrough Booking */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Book a Free On-Site Inspection
            </h4>
            <p className="text-xs text-[#94a3b8]">
              We work with clients across Ghana. Share your location and project details to arrange a visit and receive a quote in Ghana Cedis.
            </p>

            <div className="flex flex-col gap-2 pt-1">
              <button
                onClick={onOpenBooking}
                className="w-full py-2.5 bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold text-xs rounded-lg transition-colors shadow text-center"
              >
                Schedule Free Walkthrough Online
              </button>

              <a
                href="https://wa.me/233241234567?text=Hello%20JudeCraft%20Finishes,%20I%20would%20like%20to%20schedule%20an%20inspection%20for%20my%20building."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Chat Instantly on WhatsApp</span>
              </a>
            </div>
          </div>

        </div>

        {/* Bottom line */}
        <div className="pt-8 border-t border-[#141b2a] flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#64748b] gap-2">
          <div>
            © {new Date().getFullYear()} JudeCraft Finishes. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span>Coral Paints Ghana</span>
            <span>Azar Chemical</span>
            <span>Dulux Ghana</span>
            <span>MTN MoMo Accepted</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
