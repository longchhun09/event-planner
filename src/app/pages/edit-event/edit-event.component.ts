import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService } from '../../services/event.service';
import { EventCategory, Event } from '../../models/event.model';
import { FormFieldComponent } from '../../components/form-field/form-field.component';
import { ActionButtonsComponent } from '../../components/action-buttons/action-buttons.component';
import { formatDateToISO, getMinDateISO } from '../../utils/date-time.util';

@Component({
  selector: 'app-edit-event',
  imports: [CommonModule, ReactiveFormsModule, FormFieldComponent, ActionButtonsComponent],
  templateUrl: './edit-event.component.html',
  styleUrl: './edit-event.component.scss'
})
export class EditEventComponent implements OnInit {
  private fb = inject(FormBuilder);
  private eventService = inject(EventService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  protected categories = Object.values(EventCategory);
  protected eventForm: FormGroup;
  protected submitted = false;
  protected eventId: string | null = null;
  protected event: Event | undefined;

  constructor() {
    this.eventForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      date: ['', Validators.required],
      time: ['', Validators.required],
      location: ['', [Validators.required, Validators.minLength(3)]],
      category: [EventCategory.OTHER, Validators.required],
      description: ['']
    });
  }

  ngOnInit(): void {
    this.eventId = this.route.snapshot.paramMap.get('id');

    if (this.eventId) {
      this.event = this.eventService.getEventById(this.eventId);

      if (this.event) {
        this.populateForm(this.event);
      } else {
        // Event not found, redirect to list
        this.router.navigate(['/events']);
      }
    } else {
      this.router.navigate(['/events']);
    }
  }

  private populateForm(event: Event): void {
    const dateString = formatDateToISO(event.date);

    this.eventForm.patchValue({
      name: event.name,
      date: dateString,
      time: event.time,
      location: event.location,
      category: event.category,
      description: event.description || ''
    });
  }

  get f() {
    return this.eventForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.eventForm.invalid || !this.eventId) {
      return;
    }

    const formValue = this.eventForm.value;
    const updates = {
      name: formValue.name,
      date: new Date(formValue.date),
      time: formValue.time,
      location: formValue.location,
      category: formValue.category as EventCategory,
      description: formValue.description || undefined
    };

    this.eventService.updateEvent(this.eventId, updates);
    this.router.navigate(['/events']);
  }

  onCancel(): void {
    this.router.navigate(['/events']);
  }

  // Get minimum date (today)
  getMinDate(): string {
    return getMinDateISO();
  }
}

