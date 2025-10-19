import { Component, Input, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ControlValueAccessor,
  AbstractControl,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  ValidationErrors
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

/**
 * ReusableFormFieldComponent - A reusable component for label, input, and error display
 *
 * Features:
 * - Label display
 * - Input field (text, email, number, textarea, etc.)
 * - Date picker with Material Design
 * - Error message display
 * - Character counter
 * - Hint text
 * - Integration with Angular Reactive Forms
 * - Material Design styling
 *
 * Usage Examples:
 *
 * Text Input:
 * ```html
 * <app-form-field
 *   [control]="myForm.get('email')"
 *   label="Email Address"
 *   placeholder="Enter your email"
 *   type="email"
 *   [required]="true"
 *   [maxLength]="100"
 *   hint="We'll never share your email"
 *   [errorMessages]="{
 *     required: 'Email is required',
 *     email: 'Please enter a valid email'
 *   }"
 * ></app-form-field>
 * ```
 *
 * Date Picker:
 * ```html
 * <app-form-field
 *   [control]="myForm.get('date')"
 *   fieldType="datepicker"
 *   label="Event Date"
 *   placeholder="Choose a date"
 *   [required]="true"
 *   [minDate]="minDate"
 *   [maxDate]="maxDate"
 *   [errorMessages]="{
 *     required: 'Date is required'
 *   }"
 * ></app-form-field>
 * ```
 */
@Component({
  selector: 'app-form-field',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './form-field.component.html',
  styleUrl: './form-field.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormFieldComponent),
      multi: true
    }
  ]
})
export class FormFieldComponent implements ControlValueAccessor {
  /** Form control to bind to */
  @Input() control?: AbstractControl | null;

  /** Label text */
  @Input() label: string = '';

  /** Placeholder text */
  @Input() placeholder: string = '';

  /** Input type (text, email, password, number, tel, url, etc.) */
  @Input() type: string = 'text';

  /** Field type - 'input', 'textarea', or 'datepicker' */
  @Input() fieldType: 'input' | 'textarea' | 'datepicker' = 'input';

  /** Whether the field is required */
  @Input() required: boolean = false;

  /** Maximum length for the input */
  @Input() maxLength?: number;

  /** Minimum length for the input */
  @Input() minLength?: number;

  /** Hint text to display below the input */
  @Input() hint?: string;

  /** Whether to show character counter */
  @Input() showCounter: boolean = false;

  /** Number of rows for textarea */
  @Input() rows: number = 4;

  /** Custom error messages */
  @Input() errorMessages: { [key: string]: string } = {};

  /** Material Design appearance */
  @Input() appearance: 'fill' | 'outline' = 'outline';

  /** Whether the field is disabled */
  @Input() disabled: boolean = false;

  /** Whether the field should take full width */
  @Input() fullWidth: boolean = true;

  /** Input prefix (icon or text) */
  @Input() prefix?: string;

  /** Input suffix (icon or text) */
  @Input() suffix?: string;

  /** Autocomplete attribute */
  @Input() autocomplete?: string;

  /** Minimum date for datepicker */
  @Input() minDate?: Date;

  /** Maximum date for datepicker */
  @Input() maxDate?: Date;

  /** Date filter function for datepicker */
  @Input() dateFilter?: (date: Date | null) => boolean;

  // ControlValueAccessor implementation
  value: any = '';
  onChange: any = () => {};
  onTouched: any = () => {};

  writeValue(value: any): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  /**
   * Get the current error message to display
   */
  getErrorMessage(): string {
    if (!this.control || !this.control.errors) {
      return '';
    }

    const errors: ValidationErrors = this.control.errors;

    // Check for custom error messages first
    for (const errorKey in errors) {
      if (this.errorMessages[errorKey]) {
        return this.errorMessages[errorKey];
      }
    }

    // Default error messages
    if (errors['required']) {
      return `${this.label || 'This field'} is required`;
    }

    if (errors['email']) {
      return 'Please enter a valid email address';
    }

    if (errors['minlength']) {
      const minLength = errors['minlength'].requiredLength;
      return `Minimum ${minLength} characters required`;
    }

    if (errors['maxlength']) {
      const maxLength = errors['maxlength'].requiredLength;
      return `Maximum ${maxLength} characters allowed`;
    }

    if (errors['pattern']) {
      return 'Invalid format';
    }

    if (errors['min']) {
      return `Minimum value is ${errors['min'].min}`;
    }

    if (errors['max']) {
      return `Maximum value is ${errors['max'].max}`;
    }

    return 'Invalid value';
  }

  /**
   * Check if the field has an error to display
   */
  hasError(): boolean {
    if (!this.control) {
      return false;
    }
    return !!(this.control.invalid && (this.control.dirty || this.control.touched));
  }

  /**
   * Get character count text
   */
  getCharacterCount(): string {
    const currentLength = this.control?.value?.length || 0;
    if (this.maxLength) {
      return `${currentLength}/${this.maxLength}`;
    }
    return `${currentLength}`;
  }

  /**
   * Get hint text to display
   */
  getHintText(): string {
    if (this.showCounter) {
      return this.getCharacterCount();
    }
    return this.hint || '';
  }
}

