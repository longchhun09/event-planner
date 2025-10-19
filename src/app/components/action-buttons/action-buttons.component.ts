import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-action-buttons',
  imports: [
    CommonModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatTooltipModule
  ],
  templateUrl: './action-buttons.component.html',
  styleUrl: './action-buttons.component.scss'
})
export class ActionButtonsComponent {
  @Input() secondaryText = 'Cancel';
  @Input() primaryText = 'Confirm';
  @Input() primaryType: 'submit' | 'button' = 'button';
  @Input() secondaryType: 'submit' | 'button' = 'button';
  @Input() primaryColor: 'primary' | 'warn' | 'accent' = 'primary';
  @Input() isLoading = false;
  @Input() disabled = false;
  @Input() loadingText?: string;
  @Input() primaryTooltip?: string;
  @Input() secondaryTooltip?: string;

  @Output() primaryClick = new EventEmitter<void>();
  @Output() secondaryClick = new EventEmitter<void>();

  onPrimaryClick(): void {
    if (!this.disabled && !this.isLoading) {
      this.primaryClick.emit();
    }
  }

  onSecondaryClick(): void {
    if (!this.disabled && !this.isLoading) {
      this.secondaryClick.emit();
    }
  }

  get primaryButtonText(): string {
    return this.isLoading && this.loadingText ? this.loadingText : this.primaryText;
  }
}

