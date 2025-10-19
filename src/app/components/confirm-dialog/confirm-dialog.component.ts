import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { ActionButtonsComponent } from '../action-buttons/action-buttons.component';

export type DialogType = 'warning' | 'error' | 'info' | 'success';

export interface ConfirmDialogData {
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  type?: DialogType;
}

@Component({
  selector: 'app-confirm-dialog',
  imports: [CommonModule, MatDialogModule, ActionButtonsComponent],
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.scss'
})
export class ConfirmDialogComponent {
  private dialogRef = inject(MatDialogRef<ConfirmDialogComponent>);
  protected data = inject<ConfirmDialogData>(MAT_DIALOG_DATA);

  protected title = this.data.title || 'Confirm Action';
  protected message = this.data.message || 'Are you sure you want to proceed?';
  protected confirmText = this.data.confirmText || 'Confirm';
  protected cancelText = this.data.cancelText || 'Cancel';
  protected type = this.data.type || 'warning';

  getPrimaryColor(): 'primary' | 'warn' | 'accent' {
    if (this.type === 'error' || this.type === 'warning') {
      return 'warn';
    }
    return 'primary';
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}

