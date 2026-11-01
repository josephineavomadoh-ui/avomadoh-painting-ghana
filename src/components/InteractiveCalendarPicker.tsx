import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Clock, Video, MapPin, Phone, Check, Globe } from 'lucide-react';
import { ConsultationMode } from '../types/art';

interface InteractiveCalendarPickerProps {
  selectedDate: string; // YYYY-MM-DD
  onSelectDate: (date: string) => void;
  selectedTimeSlot: string;
  onSelectTimeSlot: (slot: string) => void;
  consultationMode: ConsultationMode;
  onChangeConsultationMode: (mode: ConsultationMode) => void;
  timezone: string;
  onChangeTimezone: (tz: string) => void;
}

export const InteractiveCalendarPicker: React.FC<InteractiveCalendarPickerProps> = ({
  selectedDate,
  onSelectDate,
  selectedTimeSlot,
  onSelectTimeSlot,
  consultationMode,
  onChangeConsultationMode,
  timezone,
  onChangeTimezone,
}) => {
  // Base date based on local time provided (Late 2026)
  const [currentYear, setCurrentYear] = useState<number>(2026);
  const [currentMonth, setCurrentMonth] = useState<number>(10); // 10 = November (0-indexed)

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handlePrevMonth = () => {
    if (currentMonth === 10 && currentYear === 2026) return; // Do not go before current month
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  // Generate calendar days
  const calendarGrid = useMemo(() => {
    const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay(); // 0 is Sun
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    
    // Convert Sunday=0 to Monday=0 start
    const startOffset = (firstDayIndex + 6) % 7;

    const days = [];
    // Blank padding days
    for (let i = 0; i < startOffset; i++) {
      days.push(null);
    }
    // Month days
    for (let day = 1; day <= daysInMonth; day++) {
      const dateString = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      
      // Determine day of week
      const dayOfWeek = new Date(currentYear, currentMonth, day).getDay();
      // Artist takes Sundays off for drying & studio maintenance
      const isSunday = dayOfWeek === 0;
      
      // Available if not Sunday and not before Nov 1, 2026
      const isAvailable = !isSunday;

      days.push({
        dayNumber: day,
        dateString,
        isAvailable,
        isSunday,
      });
    }
    return days;
  }, [currentYear, currentMonth]);

  // Standard available daily consultation slots
  const availableSlotsByDate: Record<string, string[]> = {
    morning: ['10:00 AM - 10:45 AM', '11:15 AM - 12:00 PM'],
    afternoon: ['01:30 PM - 02:15 PM', '03:00 PM - 03:45 PM'],
    evening: ['04:30 PM - 05:15 PM', '06:00 PM - 06:45 PM'],
  };

  return (
    <div className="space-y-6">
      
      {/* 1. Consultation Mode Selector */}
      <div className="space-y-2">
        <label className="text-xs font-medium uppercase tracking-wider text-[#9e968b] block">
          Select Consultation Format
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <button
            type="button"
            onClick={() => onChangeConsultationMode('video_call')}
            className={`p-3 rounded-lg border text-left transition-all flex flex-col justify-between ${
              consultationMode === 'video_call'
                ? 'bg-[#1e1b18] border-[#c5a880] text-[#f4efe8]'
                : 'bg-[#141210] border-[#29241f] text-[#a39c92] hover:border-[#3d362e]'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <Video className="w-4 h-4 text-[#c5a880]" />
              {consultationMode === 'video_call' && <Check className="w-3.5 h-3.5 text-[#c5a880]" />}
            </div>
            <div>
              <div className="text-xs font-medium text-[#f4efe8]">Studio Video Call</div>
              <div className="text-[11px] text-[#7d766b] mt-0.5">Google Meet / 45 min</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onChangeConsultationMode('studio_visit')}
            className={`p-3 rounded-lg border text-left transition-all flex flex-col justify-between ${
              consultationMode === 'studio_visit'
                ? 'bg-[#1e1b18] border-[#c5a880] text-[#f4efe8]'
                : 'bg-[#141210] border-[#29241f] text-[#a39c92] hover:border-[#3d362e]'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <MapPin className="w-4 h-4 text-[#c5a880]" />
              {consultationMode === 'studio_visit' && <Check className="w-3.5 h-3.5 text-[#c5a880]" />}
            </div>
            <div>
              <div className="text-xs font-medium text-[#f4efe8]">On-Site Property Walkthrough</div>
              <div className="text-[11px] text-[#7d766b] mt-0.5">In-Person Inspection (Ghana)</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onChangeConsultationMode('phone')}
            className={`p-3 rounded-lg border text-left transition-all flex flex-col justify-between ${
              consultationMode === 'phone'
                ? 'bg-[#1e1b18] border-[#c5a880] text-[#f4efe8]'
                : 'bg-[#141210] border-[#29241f] text-[#a39c92] hover:border-[#3d362e]'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <Phone className="w-4 h-4 text-[#c5a880]" />
              {consultationMode === 'phone' && <Check className="w-3.5 h-3.5 text-[#c5a880]" />}
            </div>
            <div>
              <div className="text-xs font-medium text-[#f4efe8]">Direct Phone Call</div>
              <div className="text-[11px] text-[#7d766b] mt-0.5">Direct audio / 30 min</div>
            </div>
          </button>
        </div>
      </div>

      {/* 2. Interactive Date Picker & Timezone */}
      <div className="bg-[#141210] border border-[#26221d] rounded-xl p-4 sm:p-5">
        
        {/* Month Navigation & Timezone selector */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-[#231f1a]">
          <div className="flex items-center gap-3">
            <h3 className="font-serif text-lg sm:text-xl text-[#f4efe8]">
              {monthNames[currentMonth]} {currentYear}
            </h3>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handlePrevMonth}
                disabled={currentMonth === 10 && currentYear === 2026}
                className="w-7 h-7 rounded border border-[#332c25] hover:border-[#4d4338] disabled:opacity-30 text-[#b8b0a5] flex items-center justify-center transition-colors"
                title="Previous Month"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleNextMonth}
                className="w-7 h-7 rounded border border-[#332c25] hover:border-[#4d4338] text-[#b8b0a5] flex items-center justify-center transition-colors"
                title="Next Month"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Timezone picker */}
          <div className="flex items-center gap-2 text-xs text-[#8f887d]">
            <Globe className="w-3.5 h-3.5 text-[#c5a880]" />
            <select
              value={timezone}
              onChange={(e) => onChangeTimezone(e.target.value)}
              className="bg-[#1b1815] border border-[#302a24] text-[#cfc7bc] text-xs rounded px-2 py-1 focus:outline-none focus:border-[#c5a880]"
            >
              <option value="GMT">Ghana Time / GMT (+0)</option>
              <option value="WAT">West Africa / WAT (+1)</option>
              <option value="CET">Europe / CET (+1)</option>
              <option value="EST">USA / EST (-5)</option>
            </select>
          </div>
        </div>

        {/* Days of week header */}
        <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-medium text-[#7d766b] uppercase tracking-wider mb-2">
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
          <span className="text-[#575147]">Sun</span>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
          {calendarGrid.map((item, idx) => {
            if (!item) {
              return <div key={`empty-${idx}`} className="h-9 sm:h-10" />;
            }

            const isSelected = selectedDate === item.dateString;

            return (
              <button
                key={item.dateString}
                type="button"
                disabled={!item.isAvailable}
                onClick={() => onSelectDate(item.dateString)}
                className={`h-9 sm:h-10 rounded-lg text-xs font-medium flex flex-col items-center justify-center relative transition-all ${
                  isSelected
                    ? 'bg-[#c5a880] text-[#12100e] font-bold shadow-md scale-[1.03]'
                    : item.isAvailable
                    ? 'bg-[#1b1916] text-[#e5e0d8] hover:bg-[#282420] hover:border hover:border-[#4d4233]'
                    : 'bg-[#100f0e] text-[#47423b] cursor-not-allowed opacity-40'
                }`}
              >
                <span>{item.dayNumber}</span>
                {item.isAvailable && !isSelected && (
                  <span className="w-1 h-1 rounded-full bg-[#c5a880]/60 mt-0.5" />
                )}
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-between text-[11px] text-[#736c61] mt-3 pt-3 border-t border-[#201d18]">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#c5a880]" />
            Studio open for consultations
          </span>
          <span>Sundays reserved for varnish curing</span>
        </div>
      </div>

      {/* 3. Available Time Slots for Selected Date */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium uppercase tracking-wider text-[#9e968b] flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[#c5a880]" />
            <span>Available Studio Slots ({selectedDate})</span>
          </label>
          <span className="text-xs text-[#736c61]">All times in {timezone}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {Object.entries(availableSlotsByDate).map(([period, slots]) => (
            <div key={period} className="space-y-1.5">
              <span className="text-[10px] uppercase tracking-wider text-[#6b6459] block font-medium capitalize">
                {period}
              </span>
              <div className="space-y-1.5">
                {slots.map((slot) => {
                  const isSlotSelected = selectedTimeSlot === slot;
                  return (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => onSelectTimeSlot(slot)}
                      className={`w-full py-2 px-2.5 rounded-md text-xs font-medium border text-left transition-all ${
                        isSlotSelected
                          ? 'bg-[#c5a880] border-[#c5a880] text-[#12100e] font-semibold'
                          : 'bg-[#171513] border-[#29241f] text-[#cfc7bc] hover:border-[#42392f] hover:bg-[#1f1b18]'
                      }`}
                    >
                      {slot}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
