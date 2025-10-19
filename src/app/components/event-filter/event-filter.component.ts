import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EventCategory, EventFilter } from '../../models/event.model';

import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatBadgeModule } from '@angular/material/badge';

@Component({
  selector: 'app-event-filter',
  imports: [
    CommonModule,
    FormsModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatChipsModule,
    MatBadgeModule
  ],
  templateUrl: './event-filter.component.html',
  styleUrl: './event-filter.component.scss'
})
export class EventFilterComponent {
  @Output() filterChange = new EventEmitter<EventFilter>();

  protected searchTerm = '';
  protected selectedCategory: EventCategory | '' = '';
  protected dateFrom: Date | null = null;
  protected dateTo: Date | null = null;
  protected isExpanded = false;

  // Expose categories for template
  protected categories = Object.values(EventCategory);

  onFilterChange(): void {
    const filter: EventFilter = {
      searchTerm: this.searchTerm || undefined,
      category: this.selectedCategory || undefined,
      dateFrom: this.dateFrom || undefined,
      dateTo: this.dateTo || undefined
    };

    this.filterChange.emit(filter);
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedCategory = '';
    this.dateFrom = null;
    this.dateTo = null;
    this.onFilterChange();
  }

  hasActiveFilters(): boolean {
    return !!(
      this.searchTerm ||
      this.selectedCategory ||
      this.dateFrom ||
      this.dateTo
    );
  }

  getActiveFiltersCount(): number {
    let count = 0;
    if (this.searchTerm) count++;
    if (this.selectedCategory) count++;
    if (this.dateFrom) count++;
    if (this.dateTo) count++;
    return count;
  }

  getFilterSummary(): string {
    const filters: string[] = [];
    if (this.searchTerm) filters.push(`Search: "${this.searchTerm}"`);
    if (this.selectedCategory) filters.push(this.selectedCategory);
    if (this.dateFrom || this.dateTo) filters.push('Date range');
    return filters.slice(0, 2).join(', ') + (filters.length > 2 ? '...' : '');
  }
}

