import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { EventService } from '@app/services/event.service';
import { Event } from '@app/models/event.model';
import { EventDetailDialogComponent } from '@app/components/event-detail-dialog/event-detail-dialog.component';
import { ConfirmDialogComponent } from '@app/components/confirm-dialog/confirm-dialog.component';
import {
  formatMonthYear,
  isSameDay,
  getCurrentDate,
  getFirstDayOfMonth,
  getLastDayOfMonth,
  normalizeToMidnight,
  formatTimeTo12Hour
} from '@app/utils/date-time.util';
import { getCategoryColor } from '@app/utils/category-colors.util';

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  events: Event[];
}

@Component({
  selector: 'app-calendar-view',
  imports: [CommonModule, RouterLink],
  templateUrl: './calendar-view.component.html',
  styleUrl: './calendar-view.component.scss'
})
export class CalendarViewComponent {
  private eventService = inject(EventService);
  private router = inject(Router);
  private dialog = inject(MatDialog);

  protected currentDate = signal(getCurrentDate());
  protected allEvents = signal<Event[]>([]);

  protected weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  protected currentMonth = computed(() => {
    const date = this.currentDate();
    return formatMonthYear(date);
  });

  protected calendarDays = computed(() => {
    return this.generateCalendarDays(this.currentDate(), this.allEvents());
  });

  constructor() {
    // Subscribe to events
    this.eventService.getEvents$().subscribe(events => {
      this.allEvents.set(events);
    });
  }

  private generateCalendarDays(currentDate: Date, events: Event[]): CalendarDay[] {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // First day of the month
    const firstDay = getFirstDayOfMonth(currentDate);
    const startingDayOfWeek = firstDay.getDay();

    // Last day of the month
    const lastDay = getLastDayOfMonth(currentDate);
    const daysInMonth = lastDay.getDate();

    // Days from previous month
    const prevMonthLastDay = new Date(year, month, 0).getDate();

    const days: CalendarDay[] = [];
    const today = normalizeToMidnight(getCurrentDate());

    // Add days from previous month
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const date = new Date(year, month - 1, prevMonthLastDay - i);
      days.push({
        date,
        isCurrentMonth: false,
        isToday: isSameDay(date, today),
        events: this.getEventsForDate(date, events)
      });
    }

    // Add days from current month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      days.push({
        date,
        isCurrentMonth: true,
        isToday: isSameDay(date, today),
        events: this.getEventsForDate(date, events)
      });
    }

    // Add days from next month to complete the grid
    const remainingDays = 42 - days.length; // 6 rows * 7 days
    for (let day = 1; day <= remainingDays; day++) {
      const date = new Date(year, month + 1, day);
      days.push({
        date,
        isCurrentMonth: false,
        isToday: isSameDay(date, today),
        events: this.getEventsForDate(date, events)
      });
    }

    return days;
  }

  private getEventsForDate(date: Date, events: Event[]): Event[] {
    return events.filter(event => {
      const eventDate = new Date(event.date);
      return isSameDay(eventDate, date);
    });
  }

  previousMonth(): void {
    const current = this.currentDate();
    this.currentDate.set(new Date(current.getFullYear(), current.getMonth() - 1, 1));
  }

  nextMonth(): void {
    const current = this.currentDate();
    this.currentDate.set(new Date(current.getFullYear(), current.getMonth() + 1, 1));
  }

  goToToday(): void {
    this.currentDate.set(getCurrentDate());
  }

  onEventClick(event: Event): void {
    const dialogRef = this.dialog.open(EventDetailDialogComponent, {
      width: '600px',
      maxWidth: '90vw',
      panelClass: 'event-detail-dialog-container',
      autoFocus: true,
      restoreFocus: true,
      data: {
        event: event
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.action === 'edit') {
          this.onEditEvent(result.eventId);
        } else if (result.action === 'delete') {
          this.onDeleteEvent(result.eventId);
        }
      }
    });
  }

  onEditEvent(eventId: string): void {
    this.router.navigate(['/events', eventId, 'edit']);
  }

  onDeleteEvent(eventId: string): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '450px',
      maxWidth: '90vw',
      panelClass: 'confirm-dialog-container',
      autoFocus: true,
      restoreFocus: true,
      data: {
        title: 'Delete Event',
        message: 'Are you sure you want to delete this event? This action cannot be undone.',
        confirmText: 'Delete',
        cancelText: 'Cancel',
        type: 'error'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.eventService.deleteEvent(eventId);
      }
    });
  }

  getDayNumber(date: Date): number {
    return date.getDate();
  }

  getCategoryColor(category: string): string {
    return getCategoryColor(category);
  }

  formatEventTime(time: string): string {
    return formatTimeTo12Hour(time);
  }
}

