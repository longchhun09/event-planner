import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EventService } from '@app/services/event.service';
import { EventCategory } from '@app/models/event.model';
import { fadeInAnimation, shakeAnimation } from '@app/animations/animations';
import { FormFieldComponent } from '@app/components/form-field/form-field.component';
import { ActionButtonsComponent } from '@app/components/action-buttons/action-buttons.component';
import { TIME_PATTERN, getMinDate } from '@app/utils/date-time.util';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-add-event',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormFieldComponent,
    ActionButtonsComponent,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './add-event.component.html',
  styleUrl: './add-event.component.scss',
  animations: [fadeInAnimation, shakeAnimation]
})
export class AddEventComponent {
  private fb = inject(FormBuilder);
  private eventService = inject(EventService);
  private router = inject(Router);

  public categories = Object.values(EventCategory);
  public eventForm: FormGroup;
  public submitted = false;
  public isSubmitting = false;
  protected shakeState = '';

  public minDate = getMinDate();

  constructor() {
    this.eventForm = this.fb.group({
      name: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100)
      ]],
      date: ['', Validators.required],
      time: ['', [
        Validators.required,
        Validators.pattern(TIME_PATTERN)
      ]],
      location: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(200)
      ]],
      category: [EventCategory.OTHER, Validators.required],
      description: ['', Validators.maxLength(500)]
    });
  }

  get f() {
    return this.eventForm.controls;
  }

  getErrorMessage(fieldName: string): string {
    const control = this.eventForm.get(fieldName);

    if (!control || !control.errors) {
      return '';
    }

    if (control.errors['required']) {
      return `${this.getFieldLabel(fieldName)} is required`;
    }

    if (control.errors['minlength']) {
      const minLength = control.errors['minlength'].requiredLength;
      return `Minimum ${minLength} characters required`;
    }

    if (control.errors['maxlength']) {
      const maxLength = control.errors['maxlength'].requiredLength;
      return `Maximum ${maxLength} characters allowed`;
    }

    if (control.errors['pattern']) {
      return 'Invalid format (HH:MM)';
    }

    return 'Invalid value';
  }

  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      name: 'Event name',
      date: 'Date',
      time: 'Time',
      location: 'Location',
      category: 'Category',
      description: 'Description'
    };
    return labels[fieldName] || fieldName;
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.eventForm.invalid) {
      this.shakeState = 'shake';
      setTimeout(() => this.shakeState = '', 500);
      this.markFormGroupTouched(this.eventForm);
      return;
    }

    this.isSubmitting = true;

    try {
      const formValue = this.eventForm.value;

      const eventData = {
        name: formValue.name.trim(),
        date: new Date(formValue.date),
        time: formValue.time,
        location: formValue.location.trim(),
        category: formValue.category as EventCategory,
        description: formValue.description?.trim() || undefined
      };

      this.eventService.addEvent(eventData);

      setTimeout(() => {
        this.router.navigate(['/events']);
      }, 500);

    } catch (error) {
      console.error('Error creating event:', error);
      this.isSubmitting = false;
    }
  }

  onCancel(): void {
    this.router.navigate(['/events']);
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  hasError(fieldName: string): boolean {
    const control = this.eventForm.get(fieldName);
    return !!(control && control.invalid && (control.dirty || control.touched || this.submitted));
  }
}
