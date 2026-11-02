import { Injectable, signal } from '@angular/core';

export type GlobalDialogType = 'success' | 'error';

export interface GlobalDialogConfig {
  title: string;
  message: string;
  type: GlobalDialogType;
  onConfirm?: () => void;
}

@Injectable({
  providedIn: 'root',
})
export class GlobalDialogService {
  readonly dialog = signal<GlobalDialogConfig | null>(null);

  open(config: GlobalDialogConfig): void {
    this.dialog.set(config);
  }

  close(): void {
    this.dialog.set(null);
  }
}
