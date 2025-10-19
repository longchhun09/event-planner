export enum EventCategory {
  CONFERENCE = 'Conference',
  MEETUP = 'Meetup',
  WORKSHOP = 'Workshop',
  SEMINAR = 'Seminar',
  NETWORKING = 'Networking',
  SOCIAL = 'Social',
  OTHER = 'Other'
}

export interface Event {
  id: string;
  name: string;
  date: Date;
  time: string;
  location: string;
  category: EventCategory;
  description?: string;
  completed?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface EventFilter {
  category?: EventCategory;
  dateFrom?: Date;
  dateTo?: Date;
  searchTerm?: string;
}

