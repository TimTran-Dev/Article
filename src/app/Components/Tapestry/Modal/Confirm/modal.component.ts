import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { ButtonComponent } from '../../Button/button.component';

@Component({
  selector: 'tap-modal',
  templateUrl: 'modal.component.html',
  imports: [CommonModule, ButtonComponent],
  standalone: true,
})
export class ModalComponent {
  @Output() confirmed = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  onConfirm() {
    this.confirmed.emit();
  }

  onCancel() {
    this.cancelled.emit();
  }
}
