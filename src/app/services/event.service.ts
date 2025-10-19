import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, shareReplay, } from 'rxjs/operators';
import { Event, EventCategory, EventFilter } from '../models/event.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { getCurrentDate, getTodayAtMidnight, parseDateFields } from '../utils/date-time.util';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private readonly STORAGE_KEY = 'event-planner-events';
  private readonly snackBar = inject(MatSnackBar);

  private eventsSubject = new BehaviorSubject<Event[]>([]);

  public events$: Observable<Event[]> = this.eventsSubject.asObservable().pipe(
    shareReplay({ bufferSize: 1, refCount: true })
  );

  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  constructor() {
    this.loadEventsFromStorage();
  }

  getEvents(): Event[] {
    return this.eventsSubject.value;
  }

  getEvents$(): Observable<Event[]> {
    return this.events$;
  }

  getEventById(id: string): Event | undefined {
    return this.eventsSubject.value.find(event => event.id === id);
  }

  getEventById$(id: string): Observable<Event | undefined> {
    return this.events$.pipe(
      map(events => events.find(event => event.id === id)),
      shareReplay(1)
    );
  }

  addEvent(eventData: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>): void {
    try {
      const newEvent: Event = {
        ...eventData,
        id: crypto.randomUUID(),
        createdAt: getCurrentDate(),
        updatedAt: getCurrentDate()
      };

      const currentEvents = this.eventsSubject.value;
      this.eventsSubject.next([...currentEvents, newEvent]);
      this.saveEventsToStorage();

      this.showSuccess('Event created successfully!');
    } catch (error) {
      this.handleError('Failed to create event', error);
    }
  }

  updateEvent(id: string, updates: Partial<Event>): void {
    try {
      const currentEvents = this.eventsSubject.value;
      const eventExists = currentEvents.some(event => event.id === id);

      if (!eventExists) {
        throw new Error(`Event with ID ${id} not found`);
      }

      const updatedEvents = currentEvents.map(event =>
        event.id === id
          ? { ...event, ...updates, id, updatedAt: getCurrentDate() }
          : event
      );

      this.eventsSubject.next(updatedEvents);
      this.saveEventsToStorage();

      this.showSuccess('Event updated successfully!');
    } catch (error) {
      this.handleError('Failed to update event', error);
    }
  }

  deleteEvent(id: string): void {
    try {
      const currentEvents = this.eventsSubject.value;
      const filteredEvents = currentEvents.filter(event => event.id !== id);

      if (filteredEvents.length === currentEvents.length) {
        throw new Error(`Event with ID ${id} not found`);
      }

      this.eventsSubject.next(filteredEvents);
      this.saveEventsToStorage();

      this.showSuccess('Event deleted successfully!');
    } catch (error) {
      this.handleError('Failed to delete event', error);
    }
  }

  filterEvents(filter: EventFilter): Observable<Event[]> {
    return this.events$.pipe(
      map(events => {
        let filtered = [...events];
        const today = getTodayAtMidnight();

        // Apply time filter (all, upcoming, or past)
        if (filter.timeFilter === 'upcoming') {
          filtered = filtered.filter(event => new Date(event.date) >= today);
        } else if (filter.timeFilter === 'past') {
          filtered = filtered.filter(event => new Date(event.date) < today);
        }
        // 'all' shows everything, no filtering needed

        if (filter.category) {
          filtered = filtered.filter(event => event.category === filter.category);
        }

        if (filter.dateFrom) {
          filtered = filtered.filter(event =>
            new Date(event.date) >= filter.dateFrom!
          );
        }

        if (filter.dateTo) {
          filtered = filtered.filter(event =>
            new Date(event.date) <= filter.dateTo!
          );
        }

        if (filter.searchTerm) {
          const searchLower = filter.searchTerm.toLowerCase();
          filtered = filtered.filter(event =>
            event.name.toLowerCase().includes(searchLower) ||
            event.location.toLowerCase().includes(searchLower) ||
            event.description?.toLowerCase().includes(searchLower)
          );
        }

        return filtered.sort((a, b) =>
          new Date(a.date).getTime() - new Date(b.date).getTime()
        );
      }),
      shareReplay(1)
    );
  }

  getUpcomingEvents$(): Observable<Event[]> {
    return this.events$.pipe(
      map(events => {
        const today = getTodayAtMidnight();

        return events
          .filter(event => new Date(event.date) >= today)
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      }),
      shareReplay(1)
    );
  }

  getEventsByCategory$(category: EventCategory): Observable<Event[]> {
    return this.events$.pipe(
      map(events => events.filter(event => event.category === category)),
      shareReplay(1)
    );
  }

  getEventStats$(): Observable<{
    total: number;
    upcoming: number;
    past: number;
    byCategory: Map<EventCategory, number>;
  }> {
    return this.events$.pipe(
      map(events => {
        const today = getTodayAtMidnight();

        const upcoming = events.filter(e => new Date(e.date) >= today).length;
        const past = events.filter(e => new Date(e.date) < today).length;

        const byCategory = new Map<EventCategory, number>();
        Object.values(EventCategory).forEach(cat => {
          byCategory.set(cat, events.filter(e => e.category === cat).length);
        });

        return {
          total: events.length,
          upcoming,
          past,
          byCategory
        };
      }),
      shareReplay(1)
    );
  }

  private saveEventsToStorage(): void {
    try {
      const events = this.eventsSubject.value;
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(events));
    } catch (error) {
      console.error('Failed to save events to storage:', error);
      this.showError('Failed to save events. Your browser storage might be full.');
    }
  }

  private loadEventsFromStorage(): void {
    this.loadingSubject.next(true);

    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);

      if (stored) {
        const parsed = JSON.parse(stored);

        const events = parsed.map((event: any) =>
          parseDateFields<Event>(event, ['date', 'createdAt', 'updatedAt'])
        );

        this.eventsSubject.next(events);
      } else {
        this.loadSampleData();
      }
    } catch (error) {
      console.error('Error loading events from storage:', error);
      this.showError('Failed to load saved events. Loading sample data.');
      this.loadSampleData();
    } finally {
      this.loadingSubject.next(false);
    }
  }

  private loadSampleData(): void {
    const sampleEvents: Event[] = [
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

    this.eventsSubject.next(sampleEvents);
    this.saveEventsToStorage();
  }

  private handleError(message: string, error: any): void {
    console.error(message, error);
    this.showError(message);
  }

  private showSuccess(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: ['success-snackbar']
    });
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: ['error-snackbar']
    });
  }
}
