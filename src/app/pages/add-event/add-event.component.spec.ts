import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { AddEventComponent } from './add-event.component';
import { EventService } from '@app/services/event.service';
import { EventCategory } from '@app/models/event.model';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';

describe('AddEventComponent', () => {
  let component: AddEventComponent;
  let fixture: ComponentFixture<AddEventComponent>;
  let eventService: jasmine.SpyObj<EventService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const eventServiceSpy = jasmine.createSpyObj('EventService', ['addEvent']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [
        AddEventComponent,
        ReactiveFormsModule,
        NoopAnimationsModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatButtonModule,
        MatIconModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatSnackBarModule
      ],
      providers: [
        { provide: EventService, useValue: eventServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    eventService = TestBed.inject(EventService) as jasmine.SpyObj<EventService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    fixture = TestBed.createComponent(AddEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Form Initialization', () => {
    it('should initialize form with empty values', () => {
      expect(component.eventForm).toBeDefined();
      expect(component.f['name'].value).toBe('');
      expect(component.f['location'].value).toBe('');
      expect(component.f['category'].value).toBe(EventCategory.OTHER);
    });

    it('should have all required form controls', () => {
      expect(component.f['name']).toBeDefined();
      expect(component.f['date']).toBeDefined();
      expect(component.f['time']).toBeDefined();
      expect(component.f['location']).toBeDefined();
      expect(component.f['category']).toBeDefined();
      expect(component.f['description']).toBeDefined();
    });

    it('should set minimum date to today', () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      component.minDate.setHours(0, 0, 0, 0);
      expect(component.minDate.getTime()).toBeGreaterThanOrEqual(today.getTime());
    });
  });

  describe('Form Validation', () => {
    it('should require event name', () => {
      const nameControl = component.f['name'];
      expect(nameControl.valid).toBeFalse();

      nameControl.setValue('');
      expect(nameControl.hasError('required')).toBeTrue();

      nameControl.setValue('Test Event');
      expect(nameControl.valid).toBeTrue();
    });

    it('should enforce minimum length for event name', () => {
      const nameControl = component.f['name'];

      nameControl.setValue('AB');
      expect(nameControl.hasError('minlength')).toBeTrue();

      nameControl.setValue('ABC');
      expect(nameControl.hasError('minlength')).toBeFalse();
    });

    it('should enforce maximum length for event name', () => {
      const nameControl = component.f['name'];
      const longName = 'A'.repeat(101);

      nameControl.setValue(longName);
      expect(nameControl.hasError('maxlength')).toBeTrue();
    });

    it('should require date', () => {
      const dateControl = component.f['date'];
      expect(dateControl.hasError('required')).toBeTrue();

      dateControl.setValue(new Date());
      expect(dateControl.valid).toBeTrue();
    });

    it('should require time with valid format', () => {
      const timeControl = component.f['time'];

      timeControl.setValue('');
      expect(timeControl.hasError('required')).toBeTrue();

      timeControl.setValue('25:00');
      expect(timeControl.hasError('pattern')).toBeTrue();

      timeControl.setValue('14:30');
      expect(timeControl.valid).toBeTrue();
    });

    it('should require location with minimum length', () => {
      const locationControl = component.f['location'];

      locationControl.setValue('AB');
      expect(locationControl.hasError('minlength')).toBeTrue();

      locationControl.setValue('San Francisco');
      expect(locationControl.valid).toBeTrue();
    });

    it('should make description optional', () => {
      const descriptionControl = component.f['description'];
      expect(descriptionControl.hasError('required')).toBeFalse();

      descriptionControl.setValue('');
      expect(descriptionControl.valid).toBeTrue();
    });
  });

  describe('Form Submission', () => {
    it('should not submit invalid form', () => {
      component.onSubmit();

      expect(component.submitted).toBeTrue();
      expect(eventService.addEvent).not.toHaveBeenCalled();
      expect(router.navigate).not.toHaveBeenCalled();
    });

    it('should submit valid form', () => {
      // Fill form with valid data
      component.eventForm.setValue({
        name: 'Test Event',
        date: new Date('2025-12-01'),
        time: '14:30',
        location: 'Test Location',
        category: EventCategory.CONFERENCE,
        description: 'Test description'
      });

      component.onSubmit();

      expect(component.submitted).toBeTrue();
      expect(eventService.addEvent).toHaveBeenCalled();
    });

    it('should trim whitespace from name and location', () => {
      component.eventForm.setValue({
        name: '  Test Event  ',
        date: new Date('2025-12-01'),
        time: '14:30',
        location: '  Test Location  ',
        category: EventCategory.WORKSHOP,
        description: ''
      });

      component.onSubmit();

      const callArgs = eventService.addEvent.calls.mostRecent().args[0];
      expect(callArgs.name).toBe('Test Event');
      expect(callArgs.location).toBe('Test Location');
    });

    it('should set isSubmitting flag during submission', () => {
      component.eventForm.setValue({
        name: 'Test Event',
        date: new Date('2025-12-01'),
        time: '14:30',
        location: 'Test Location',
        category: EventCategory.MEETUP,
        description: ''
      });

      expect(component.isSubmitting).toBeFalse();
      component.onSubmit();
      expect(component.isSubmitting).toBeTrue();
    });
  });

  describe('Error Messages', () => {
    it('should return appropriate error messages', () => {
      const nameControl = component.f['name'];

      nameControl.setValue('');
      nameControl.markAsTouched();
      expect(component.getErrorMessage('name')).toContain('required');

      nameControl.setValue('AB');
      expect(component.getErrorMessage('name')).toContain('Minimum');
    });

    it('should check if field has error', () => {
      const nameControl = component.f['name'];

      nameControl.setValue('');
      expect(component.hasError('name')).toBeFalse();

      nameControl.markAsTouched();
      expect(component.hasError('name')).toBeTrue();

      nameControl.setValue('Valid Name');
      expect(component.hasError('name')).toBeFalse();
    });
  });

  describe('Navigation', () => {
    it('should navigate to events list on cancel', () => {
      component.onCancel();
      expect(router.navigate).toHaveBeenCalledWith(['/events']);
    });
  });

  describe('Categories', () => {
    it('should have all event categories available', () => {
      expect(component.categories.length).toBeGreaterThan(0);
      expect(component.categories).toContain(EventCategory.CONFERENCE);
      expect(component.categories).toContain(EventCategory.WORKSHOP);
      expect(component.categories).toContain(EventCategory.MEETUP);
    });
  });
});

