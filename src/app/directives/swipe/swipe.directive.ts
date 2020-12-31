import { Directive, ElementRef, EventEmitter, Input, Output } from '@angular/core';

@Directive({
  selector: '[appSwipe]'
})
export class SwipeDirective {
  @Input() levelOfUrgency: number;
  @Output() changeUrgencyLevel = new EventEmitter<string>();
  constructor(private elementRef: ElementRef) {
    let touchstartX = 0;
    let touchendX = 0;

    elementRef.nativeElement.addEventListener('touchstart', e => {
      touchstartX = e.changedTouches[0].screenX;
    });

    elementRef.nativeElement.addEventListener('touchend', e => {
      touchendX = e.changedTouches[0].screenX;
      this.handleGesture(touchstartX, touchendX);
    });
  }

  handleGesture(touchstartX: number, touchendX: number) {
    console.log(this.levelOfUrgency)

    if (touchendX + 100 < touchstartX) {
      console.log('swiped left!')
      this.changeUrgencyLevel.emit('+');
    } else if (touchendX - 100 > touchstartX) {
      console.log('swiped right!')
      this.changeUrgencyLevel.emit('-');
    };
  }

}
