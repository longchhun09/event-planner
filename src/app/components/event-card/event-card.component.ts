import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Event } from '../../models/event.model';
import { formatDateForDisplay, DATE_FORMAT_OPTIONS, isUpcoming } from '../../utils/date-time.util';
import { getCategoryColor } from '../../utils/category-colors.util';

@Component({
  selector: 'app-event-card',
  imports: [CommonModule, RouterLink],
  templateUrl: './event-card.component.html',
  styleUrl: './event-card.component.scss'
})
export class EventCardComponent {
  @Input({ required: true }) event!: Event;
  @Output() delete = new EventEmitter<string>();

  onDelete(): void {
    this.delete.emit(this.event.id);
  }

  getCategoryColor(category: string): string {
    return getCategoryColor(category);
  }

  formatDate(date: Date): string {
    return formatDateForDisplay(date, 'en-US', DATE_FORMAT_OPTIONS.SHORT);
  }

  isUpcoming(date: Date): boolean {
    return isUpcoming(date);
  }
}

