import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { GlobalDialogService } from './global-dialog.service';

@Component({
  selector: 'app-global-dialog',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (dialog(); as activeDialog) {
      <div class="dialog-overlay" (click)="onBackdropClick($event)">
        <div
          class="dialog-card"
          [class.success]="activeDialog.type === 'success'"
          [class.error]="activeDialog.type === 'error'"
          (click)="$event.stopPropagation()"
        >
          <button type="button" class="dialog-close" aria-label="Close dialog" (click)="close()">
            ×
          </button>

          <div class="dialog-icon" aria-hidden="true">
            @if (activeDialog.type === 'success') {
              <span>✓</span>
            } @else {
              <span>!</span>
            }
          </div>

          <h3 class="dialog-title">{{ activeDialog.title }}</h3>
          <p class="dialog-message">{{ activeDialog.message }}</p>

          <button type="button" class="dialog-button" (click)="close()">
            OK
          </button>
        </div>
      </div>
    }
  `,
  styleUrl: './global-dialog.component.scss',
})
export class GlobalDialogComponent {
  private readonly dialogService = inject(GlobalDialogService);
  readonly dialog = this.dialogService.dialog;

  close(): void {
    const activeDialog = this.dialog();
    this.dialogService.close();

    if (activeDialog?.onConfirm) {
      activeDialog.onConfirm();
    }
  }

  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.dialogService.close();
    }
  }
}
