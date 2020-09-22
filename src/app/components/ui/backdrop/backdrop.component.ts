import {
  Component,
  ElementRef,
  EventEmitter,
  Output,
  ViewChild
} from '@angular/core';

@Component({
  selector: 'app-backdrop',
  templateUrl: './backdrop.component.html',
  styleUrls: ['./backdrop.component.scss']
})
export class BackdropComponent {
  @ViewChild('backdrop', { static: true }) backdrop: ElementRef<HTMLDivElement>;
  @Output() closeBackdrop = new EventEmitter();

  evaluateClick(event: MouseEvent) {
    if (event.target === this.backdrop.nativeElement) {
      this.closeBackdrop.emit();
    }
  }
}
