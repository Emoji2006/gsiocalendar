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
  userId: number;
  eventTypeId: number;
  startDate: string;
  endDate: string;
  startPeriod: Period;
  endPeriod: Period;
  note?: string;
  user: User;
  eventType: EventType;
};

export type EventTypeStat = {
  eventTypeId: number;
  _count: number;
};

export type AbsenceStatsData = {
  types: EventType[];
  stats: EventTypeStat[];
};
