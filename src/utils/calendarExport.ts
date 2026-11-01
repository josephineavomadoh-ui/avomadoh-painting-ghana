/**
 * Generates calendar files (.ics) and direct Google Calendar links
 * for booked commission consultations.
 */

export interface CalendarEventParams {
  title: string;
  description: string;
  location: string;
  dateStr: string; // "YYYY-MM-DD"
  timeSlotStr: string; // "10:00 AM - 10:45 AM"
  clientName: string;
}

function parseTime(timeStr: string): { hours: number; minutes: number } {
  // e.g. "10:00 AM" or "02:30 PM"
  const parts = timeStr.trim().split(' ');
  const [hStr, mStr] = parts[0].split(':');
  let hours = parseInt(hStr, 10);
  const minutes = parseInt(mStr, 10) || 0;
  const period = parts[1]?.toUpperCase();

  if (period === 'PM' && hours < 12) {
    hours += 12;
  } else if (period === 'AM' && hours === 12) {
    hours = 0;
  }
  return { hours, minutes };
}

function formatIcsDateTime(dateStr: string, timeStr: string): string {
  const [year, month, day] = dateStr.split('-').map(Number);
  const { hours, minutes } = parseTime(timeStr);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${year}${pad(month)}${pad(day)}T${pad(hours)}${pad(minutes)}00`;
}

export function generateGoogleCalendarUrl(event: CalendarEventParams): string {
  try {
    const times = event.timeSlotStr.split('-');
    const startTimeStr = times[0]?.trim() || '10:00 AM';
    const endTimeStr = times[1]?.trim() || '10:45 AM';

    const startFormatted = formatIcsDateTime(event.dateStr, startTimeStr);
    const endFormatted = formatIcsDateTime(event.dateStr, endTimeStr);

    const baseUrl = 'https://calendar.google.com/calendar/render?action=TEMPLATE';
    const params = new URLSearchParams({
      text: event.title,
      dates: `${startFormatted}/${endFormatted}`,
      details: event.description,
      location: event.location,
    });

    return `${baseUrl}&${params.toString()}`;
  } catch (err) {
    console.error('Error generating Google Calendar URL:', err);
    return 'https://calendar.google.com';
  }
}

export function downloadIcsFile(event: CalendarEventParams): void {
  try {
    const times = event.timeSlotStr.split('-');
    const startTimeStr = times[0]?.trim() || '10:00 AM';
    const endTimeStr = times[1]?.trim() || '10:45 AM';

    const startFormatted = formatIcsDateTime(event.dateStr, startTimeStr);
    const endFormatted = formatIcsDateTime(event.dateStr, endTimeStr);

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Avomadoh Painting Services//House Painting Walkthrough Scheduling//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      `UID:${Date.now()}-${Math.random().toString(36).substring(2, 9)}@avomadohpainting.com.gh`,
      `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
      `DTSTART:${startFormatted}`,
      `DTEND:${endFormatted}`,
      `SUMMARY:${event.title}`,
      `DESCRIPTION:${event.description.replace(/\n/g, '\\n')}`,
      `LOCATION:${event.location}`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `house-painting-walkthrough-${event.dateStr}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (err) {
    console.error('Failed to download .ics calendar file', err);
  }
}
