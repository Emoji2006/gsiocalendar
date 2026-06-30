import { CalendarEvent } from '@/lib/types';

export default function EventItem({ event }: { event: CalendarEvent }) {
  const isMorning = new Date(event.startDate).getHours() < 12;
  const userName = event.user?.firstName ?? 'Utilisateur';
  const eventLabel = event.eventType?.label ?? 'Événement';

  return (
    <div className={`text-[10px] p-1 mb-1 rounded text-white ${isMorning ? 'bg-blue-500' : 'bg-purple-500'}`}>
      {userName} - {eventLabel}
    </div>
  );
}