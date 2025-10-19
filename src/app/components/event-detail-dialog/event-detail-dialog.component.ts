import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Event } from '../../models/event.model';
import { formatDateForDisplay, DATE_FORMAT_OPTIONS, formatTimeTo12Hour } from '../../utils/date-time.util';
import { getCategoryColor } from '../../utils/category-colors.util';

export interface EventDetailDialogData {
  event: Event;
}

@Component({
  selector: 'app-event-detail-dialog',
  imports: [
    CommonModule,
    MatDialogModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './event-detail-dialog.component.html',
  styleUrl: './event-detail-dialog.component.scss'
})
export class EventDetailDialogComponent {
  private dialogRef = inject(MatDialogRef<EventDetailDialogComponent>);
  protected data = inject<EventDetailDialogData>(MAT_DIALOG_DATA);

  protected event = this.data.event;

  formatEventDate(date: Date): string {
    return formatDateForDisplay(date, 'en-US', DATE_FORMAT_OPTIONS.LONG);
  }

  formatEventTime(time: string): string {
    return formatTimeTo12Hour(time);
  }

  getCategoryColor(category: string): string {
    return getCategoryColor(category);
  }

  onClose(): void {
    this.dialogRef.close();
  }

  onEdit(): void {
    this.dialogRef.close({ action: 'edit', eventId: this.event.id });
  }

  onDelete(): void {
    this.dialogRef.close({ action: 'delete', eventId: this.event.id });
  }
}

