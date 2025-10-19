import { Event, EventCategory } from '@app/models/event.model';
import { getCurrentDate } from '@app/utils/date-time.util';

/**
 * Generate sample events for initial data loading
 * @returns Array of sample events
 */
export function generateSampleEvents(): Event[] {
  return [
    {
      id: crypto.randomUUID(),
      name: 'Angular Connect 2025',
      date: new Date('2025-11-15'),
      time: '09:00',
      location: 'San Francisco, CA',
      category: EventCategory.CONFERENCE,
      description: 'The largest Angular conference of the year featuring talks from core team members and industry experts.',
      createdAt: getCurrentDate(),
      updatedAt: getCurrentDate()
    },
    {
      id: crypto.randomUUID(),
      name: 'TypeScript Workshop',
      date: new Date('2025-10-20'),
      time: '14:00',
      location: 'Online',
      category: EventCategory.WORKSHOP,
      description: 'Advanced TypeScript patterns and best practices workshop for intermediate to advanced developers.',
      createdAt: getCurrentDate(),
      updatedAt: getCurrentDate()
    },
    {
      id: crypto.randomUUID(),
      name: 'Tech Meetup - Web Dev',
      date: new Date('2025-10-18'),
      time: '18:30',
      location: 'New York, NY',
      category: EventCategory.MEETUP,
      description: 'Monthly meetup for web developers to share knowledge, network, and discuss latest trends.',
      createdAt: getCurrentDate(),
      updatedAt: getCurrentDate()
    }
  ];
}

