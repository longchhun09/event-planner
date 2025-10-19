import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { FormFieldComponent } from './form-field.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('FormFieldComponent', () => {
  let component: FormFieldComponent;
  let fixture: ComponentFixture<FormFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FormFieldComponent,
        ReactiveFormsModule,
        BrowserAnimationsModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FormFieldComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display label', () => {
    component.label = 'Test Label';
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const label = compiled.querySelector('mat-label');
    expect(label?.textContent).toContain('Test Label');
  });

  it('should show error when control is invalid and touched', () => {
    const control = new FormControl('', Validators.required);
    component.control = control;

    control.markAsTouched();
    fixture.detectChanges();

    expect(component.hasError()).toBeTruthy();
  });

  it('should not show error when control is valid', () => {
    const control = new FormControl('valid value', Validators.required);
    component.control = control;

    control.markAsTouched();
    fixture.detectChanges();

    expect(component.hasError()).toBeFalsy();
  });

  it('should display custom error message', () => {
    const control = new FormControl('', Validators.required);
    component.control = control;
    component.errorMessages = { required: 'Custom error message' };

    const errorMessage = component.getErrorMessage();
    expect(errorMessage).toBe('Custom error message');
  });

  it('should display default error message for required field', () => {
    const control = new FormControl('', Validators.required);
    component.control = control;
    component.label = 'Test Field';

    const errorMessage = component.getErrorMessage();
    expect(errorMessage).toBe('Test Field is required');
  });

  it('should display minlength error message', () => {
    const control = new FormControl('ab', Validators.minLength(5));
    component.control = control;

    control.markAsTouched();
    control.updateValueAndValidity();

    const errorMessage = component.getErrorMessage();
    expect(errorMessage).toContain('Minimum 5 characters required');
  });

  it('should display maxlength error message', () => {
    const control = new FormControl('toolongtext', Validators.maxLength(5));
    component.control = control;

    control.markAsTouched();
    control.updateValueAndValidity();

    const errorMessage = component.getErrorMessage();
    expect(errorMessage).toContain('Maximum 5 characters allowed');
  });

  it('should display email error message', () => {
    const control = new FormControl('invalid-email', Validators.email);
    component.control = control;

    control.markAsTouched();
    control.updateValueAndValidity();

    const errorMessage = component.getErrorMessage();
    expect(errorMessage).toBe('Please enter a valid email address');
  });

  it('should show character counter when showCounter is true', () => {
    const control = new FormControl('test');
    component.control = control;
    component.showCounter = true;
    component.maxLength = 100;

    const hintText = component.getHintText();
    expect(hintText).toBe('4/100');
  });

  it('should show hint text when provided', () => {
    component.hint = 'This is a hint';
    component.showCounter = false;

    const hintText = component.getHintText();
    expect(hintText).toBe('This is a hint');
  });

  it('should render input field when fieldType is input', () => {
    component.control = new FormControl('');
    component.fieldType = 'input';
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const input = compiled.querySelector('input');
    expect(input).toBeTruthy();
  });

  it('should render textarea when fieldType is textarea', () => {
    component.control = new FormControl('');
    component.fieldType = 'textarea';
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const textarea = compiled.querySelector('textarea');
    expect(textarea).toBeTruthy();
  });

  it('should set input type correctly', () => {
    component.control = new FormControl('');
    component.type = 'email';
    component.fieldType = 'input';
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const input = compiled.querySelector('input');
    expect(input?.getAttribute('type')).toBe('email');
  });

  it('should disable field when disabled is true', () => {
    component.control = new FormControl('');
    component.disabled = true;
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const input = compiled.querySelector('input');
    expect(input?.hasAttribute('disabled')).toBeTruthy();
  });

  it('should apply full-width class when fullWidth is true', () => {
    component.fullWidth = true;
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const formField = compiled.querySelector('mat-form-field');
    expect(formField?.classList.contains('full-width')).toBeTruthy();
  });

  it('should set rows attribute on textarea', () => {
    component.control = new FormControl('');
    component.fieldType = 'textarea';
    component.rows = 10;
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const textarea = compiled.querySelector('textarea');
    expect(textarea?.getAttribute('rows')).toBe('10');
  });

  it('should handle ControlValueAccessor writeValue', () => {
    component.writeValue('test value');
    expect(component.value).toBe('test value');
  });

  it('should handle ControlValueAccessor registerOnChange', () => {
    const fn = jasmine.createSpy();
    component.registerOnChange(fn);
    expect(component.onChange).toBe(fn);
  });

  it('should handle ControlValueAccessor registerOnTouched', () => {
    const fn = jasmine.createSpy();
    component.registerOnTouched(fn);
    expect(component.onTouched).toBe(fn);
  });

  it('should handle ControlValueAccessor setDisabledState', () => {
    component.setDisabledState(true);
    expect(component.disabled).toBeTruthy();

    component.setDisabledState(false);
    expect(component.disabled).toBeFalsy();
  });
});

