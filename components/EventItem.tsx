import { CalendarEvent } from "@/types";

export default function EventItem({ event }: { event: CalendarEvent }) {
  const isMorning = new Date(event.startDate).getHours() < 12;

  return (
    <div className={`text-[10px] p-1 mb-1 rounded text-white ${isMorning ? 'bg-blue-500' : 'bg-purple-500'}`}>
      {event.user.firstName} - {event.eventType.label}
    </div>
  );
}