import { TestBed } from '@angular/core/testing';
import { EventService } from '@app/services/event.service';
import { Event, EventCategory } from '@app/models/event.model';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

describe('EventService', () => {
  let service: EventService;
  let localStorageSpy: jasmine.SpyObj<Storage>;

  beforeEach(() => {
    // Create spy for localStorage
    localStorageSpy = jasmine.createSpyObj('localStorage', ['getItem', 'setItem', 'removeItem', 'clear']);

    TestBed.configureTestingModule({
      imports: [MatSnackBarModule],
      providers: [
        EventService,
        provideAnimationsAsync()
      ]
    });

    // Mock localStorage
    spyOn(localStorage, 'getItem').and.returnValue(null);
    spyOn(localStorage, 'setItem');

    service = TestBed.inject(EventService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Event Management', () => {
    it('should add a new event', (done) => {
      const eventData = {
        name: 'Test Event',
        date: new Date('2025-12-01'),
        time: '10:00',
        location: 'Test Location',
        category: EventCategory.CONFERENCE,
        description: 'Test description'
      };

      service.addEvent(eventData);

      service.getEvents$().subscribe(events => {
        expect(events.length).toBeGreaterThan(0);
        const addedEvent = events.find(e => e.name === 'Test Event');
        expect(addedEvent).toBeDefined();
        expect(addedEvent?.location).toBe('Test Location');
        expect(addedEvent?.category).toBe(EventCategory.CONFERENCE);
        done();
      });
    });

    it('should update an existing event', (done) => {
      // First add an event
      service.addEvent({
        name: 'Original Event',
        date: new Date('2025-12-01'),
        time: '10:00',
        location: 'Original Location',
        category: EventCategory.MEETUP
      });

      service.getEvents$().subscribe(events => {
        const event = events.find(e => e.name === 'Original Event');
        if (event) {
          // Update the event
          service.updateEvent(event.id, {
            name: 'Updated Event',
            location: 'Updated Location'
          });

          service.getEvents$().subscribe(updatedEvents => {
            const updatedEvent = updatedEvents.find(e => e.id === event.id);
            expect(updatedEvent?.name).toBe('Updated Event');
            expect(updatedEvent?.location).toBe('Updated Location');
            expect(updatedEvent?.updatedAt).toBeDefined();
            done();
          });
        }
      });
    });

    it('should delete an event', (done) => {
      // First add an event
      service.addEvent({
        name: 'Event to Delete',
        date: new Date('2025-12-01'),
        time: '10:00',
        location: 'Test Location',
        category: EventCategory.WORKSHOP
      });

      service.getEvents$().subscribe(events => {
        const event = events.find(e => e.name === 'Event to Delete');
        if (event) {
          const initialCount = events.length;
          service.deleteEvent(event.id);

          service.getEvents$().subscribe(remainingEvents => {
            expect(remainingEvents.length).toBe(initialCount - 1);
            expect(remainingEvents.find(e => e.id === event.id)).toBeUndefined();
            done();
          });
        }
      });
    });

    it('should get event by ID', (done) => {
      service.addEvent({
        name: 'Findable Event',
        date: new Date('2025-12-01'),
        time: '10:00',
        location: 'Test Location',
        category: EventCategory.SEMINAR
      });

      service.getEvents$().subscribe(events => {
        const event = events.find(e => e.name === 'Findable Event');
        if (event) {
          const foundEvent = service.getEventById(event.id);
          expect(foundEvent).toBeDefined();
          expect(foundEvent?.name).toBe('Findable Event');
          done();
        }
      });
    });
  });

  describe('Filtering and Search', () => {
    beforeEach((done) => {
      // Add multiple events for filtering tests
      service.addEvent({
        name: 'Conference 2025',
        date: new Date('2025-11-01'),
        time: '09:00',
        location: 'San Francisco',
        category: EventCategory.CONFERENCE
      });

      service.addEvent({
        name: 'Workshop Angular',
        date: new Date('2025-12-15'),
        time: '14:00',
        location: 'New York',
        category: EventCategory.WORKSHOP
      });

      service.addEvent({
        name: 'Meetup Local',
        date: new Date('2025-10-20'),
        time: '18:00',
        location: 'San Francisco',
        category: EventCategory.MEETUP
      });

      setTimeout(done, 100);
    });

    it('should filter events by category', (done) => {
      service.filterEvents({ category: EventCategory.CONFERENCE }).subscribe(events => {
        expect(events.length).toBeGreaterThan(0);
        events.forEach(event => {
          expect(event.category).toBe(EventCategory.CONFERENCE);
        });
        done();
      });
    });

    it('should filter events by date range', (done) => {
      const dateFrom = new Date('2025-11-01');
      const dateTo = new Date('2025-12-31');

      service.filterEvents({ dateFrom, dateTo }).subscribe(events => {
        events.forEach(event => {
          expect(new Date(event.date).getTime()).toBeGreaterThanOrEqual(dateFrom.getTime());
          expect(new Date(event.date).getTime()).toBeLessThanOrEqual(dateTo.getTime());
        });
        done();
      });
    });

    it('should search events by term', (done) => {
      service.filterEvents({ searchTerm: 'Angular' }).subscribe(events => {
        expect(events.length).toBeGreaterThan(0);
        const hasAngular = events.some(e =>
          e.name.toLowerCase().includes('angular') ||
          e.description?.toLowerCase().includes('angular')
        );
        expect(hasAngular).toBe(true);
        done();
      });
    });

    it('should get upcoming events only', (done) => {
      service.getUpcomingEvents$().subscribe(events => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        events.forEach(event => {
          expect(new Date(event.date).getTime()).toBeGreaterThanOrEqual(today.getTime());
        });
        done();
      });
    });

    it('should get events by category', (done) => {
      service.getEventsByCategory$(EventCategory.WORKSHOP).subscribe(events => {
        events.forEach(event => {
          expect(event.category).toBe(EventCategory.WORKSHOP);
        });
        done();
      });
    });
  });

  describe('Statistics', () => {
    it('should calculate event statistics', (done) => {
      service.getEventStats$().subscribe(stats => {
        expect(stats.total).toBeDefined();
        expect(stats.upcoming).toBeDefined();
        expect(stats.past).toBeDefined();
        expect(stats.byCategory).toBeDefined();
        expect(stats.byCategory instanceof Map).toBe(true);
        done();
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle update of non-existent event', () => {
      expect(() => {
        service.updateEvent('non-existent-id', { name: 'Updated' });
      }).not.toThrow();
    });

    it('should handle delete of non-existent event', () => {
      expect(() => {
        service.deleteEvent('non-existent-id');
      }).not.toThrow();
    });
  });

  describe('Observable Patterns', () => {
    it('should share replay the events observable', () => {
      let emissionCount = 0;
      let receivedEvents: Event[][] = [];
      
      const subscription1 = service.getEvents$().subscribe(events => {
        emissionCount++;
        receivedEvents.push(events);
      });

      const subscription2 = service.getEvents$().subscribe(events => {
        emissionCount++;
        receivedEvents.push(events);
      });

      expect(emissionCount).toBe(2);
      expect(receivedEvents[0]).toEqual(receivedEvents[1]);

      subscription1.unsubscribe();
      subscription2.unsubscribe();
    });

    it('should provide loading state', (done) => {
      service.loading$.subscribe(isLoading => {
        expect(typeof isLoading).toBe('boolean');
        done();
      });
    });
  });
});

