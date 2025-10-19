import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { EventService } from '../../services/event.service';
import { EventFilterComponent } from '../../components/event-filter/event-filter.component';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';
import { EventDetailDialogComponent } from '../../components/event-detail-dialog/event-detail-dialog.component';
import { EventFilter, Event } from '../../models/event.model';
import { formatDateForDisplay, DATE_FORMAT_OPTIONS, formatTimeTo12Hour } from '../../utils/date-time.util';
import { getCategoryColor } from '../../utils/category-colors.util';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-event-list',
  imports: [
    CommonModule,
    EventFilterComponent,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule
  ],
  templateUrl: './event-list.component.html',
  styleUrl: './event-list.component.scss'
})
export class EventListComponent {
  private eventService = inject(EventService);
  private router = inject(Router);
  private dialog = inject(MatDialog);

  protected filteredEvents$ = this.eventService.getUpcomingEvents$();

  onFilterChange(filter: EventFilter): void {
    this.filteredEvents$ = this.eventService.filterEvents(filter);
  }

  onViewEvent(event: Event): void {
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

  onToggleEvent(eventId: string): void {
    console.log('Toggle event:', eventId);
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

  onAddEvent(): void {
    this.router.navigate(['/events/new']);
  }

  formatEventDate(date: Date): string {
    return formatDateForDisplay(date, 'en-US', DATE_FORMAT_OPTIONS.SHORT);
  }

  formatEventTime(time: string): string {
    return formatTimeTo12Hour(time);
  }

  getCategoryColor(category: string): string {
    return getCategoryColor(category);
  }

  trackByEventId(index: number, event: Event): string {
    return event.id;
  }
}
