import React from 'react';
import { Star, Quote } from 'lucide-react';

export const TestimonialsSection: React.FC = () => {
  const testimonials = [
    {
      id: 1,
      quote:
        'Booking through Elena’s direct scheduling system was effortless. During our initial video consultation, she noticed nuances in our wedding photography that three other portraitists had completely missed. The final oil painting hangs in our dining room in Manhattan, and the way light plays off her impasto brushwork in the evening is simply mesmerizing.',
      collector: 'Julian & Claire Sterling',
      location: 'New York, USA',
      piece: 'Double Portrait in Autumn Chiaroscuro (24 × 30 in)',
      year: '2025',
    },
    {
      id: 2,
      quote:
        'When our beloved retriever Barnaby reached his twelfth winter, we wanted an archival oil portrait that celebrated his noble presence. Elena sent us updates at the grisaille stage and varnish curing. When the custom wooden crate arrived in Edinburgh, my wife wept. It is now our family’s most cherished heirloom.',
      collector: 'Alistair Campbell, QC',
      location: 'Edinburgh, Scotland',
      piece: 'Barnaby in the Library (26 × 34 in)',
      year: '2025',
    },
    {
      id: 3,
      quote:
        'I commissioned a monumental coastal landscape to capture the headlands near our summer home in Maine. Seeing the progress through Elena’s client tracker gave us immense confidence throughout the two-month creation. The level of texture and optical color mixing surpasses what even fine art galleries offer.',
      collector: 'Beatrice Van Der Bilt',
      location: 'Zurich, Switzerland',
      piece: 'Basalt Headlands at Twilight (40 × 52 in)',
      year: '2024',
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-[#0c0b0a] border-t border-[#231f1a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="text-xs uppercase tracking-[0.25em] text-[#c5a880] font-medium">
            Collector Reflections
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#f4efe8]">
            In Private Homes & Collections Worldwide
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="bg-[#12100e] border border-[#26211d] rounded-xl p-6 sm:p-7 flex flex-col justify-between space-y-6 shadow-lg relative group hover:border-[#3d362e] transition-colors"
            >
              <Quote className="w-8 h-8 text-[#c5a880]/20 absolute top-5 right-5" />

              <div className="space-y-4">
                <div className="flex items-center gap-1 text-[#c5a880]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-[#c5a880]" />
                  ))}
                </div>

                <p className="text-xs sm:text-sm text-[#b5ada1] leading-relaxed italic font-light">
                  “{t.quote}”
                </p>
              </div>

              <div className="pt-4 border-t border-[#211e19]">
                <div className="font-serif text-base text-[#f5f1eb]">{t.collector}</div>
                <div className="text-xs text-[#7d766b] mt-0.5">{t.location}</div>
                <div className="text-[11px] text-[#c5a880] mt-1 font-mono">{t.piece}</div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
