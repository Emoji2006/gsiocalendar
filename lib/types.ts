export type User = {
  id: number;
  firstName: string;
  lastName: string;
  color: string;
};

export type EventType = {
  id: number;
  label: string;
  color: string;
};

export type Period = 'morning' | 'afternoon';

export type EventFormData = {
  userId: string;
  eventTypeId: string;
  startDate: string;
  endDate: string;
  startPeriod: Period;
  endPeriod: Period;
  note?: string;
};

export type CalendarEvent = {
  id: number;
  startDate: string;
  endDate: string;
  startPeriod: string;
  endPeriod: string;
  user?: {
    id: number;
    firstName: string;
    lastName: string;
    color: string;
  };
  eventType?: {
    id: number;
    label: string;
    color: string;
  }
}

// export type EventTypeStat = {
//   eventTypeId: number;
//   count: number;
// };

// export type AbsenceStatsData = {
//   types: EventType[];
//   stats: EventTypeStat[];
// };
