import { Directive, ElementRef, EventEmitter, Input, Output } from '@angular/core';

@Directive({
  selector: '[appSwipe]'
})
export class SwipeDirective {
  @Input() levelOfUrgency: number;
  @Output() changeUrgencyLevel = new EventEmitter<string>();

  element: HTMLDivElement

  constructor(private elementRef: ElementRef<HTMLDivElement>) {
    this.element = elementRef.nativeElement;
    let touchstartX = 0;
    let touchendX = 0;
    this.element.classList.add('animate__animated')
    this.element.style.setProperty('--animate-duration', '0.6s');
    this.element.addEventListener('touchstart', e => {
      touchstartX = e.changedTouches[0].screenX;
    });

    this.element.addEventListener('touchend', e => {
      touchendX = e.changedTouches[0].screenX;
      this.handleGesture(touchstartX, touchendX, e);
    });

    this.element.addEventListener('animationend', () => {
      this.element.classList.remove('animate__fadeOutLeft')
    });
    this.element.addEventListener('animationend', () => {
      this.element.classList.remove('animate__fadeOutRight')
    });

    var defaultPrevent = function (e) { e.preventDefault(); }
    // this.element.addEventListener("touchstart", defaultPrevent);
    // this.element.addEventListener("touchmove", defaultPrevent);
  }

  defaultPrevent(e) { e.preventDefault(); }

  handleGesture(touchstartX: number, touchendX: number, event: TouchEvent) {
    if (touchendX + 200 < touchstartX) {
      this.defaultPrevent(event)

      // console.log('swiped left!')

      this.element.classList.add('animate__fadeOutLeft');
      // this.element.addEventListener('animationend', () => {
      //   this.element.classList.remove('animate__fadeOutLeft')
      // });
      this.changeUrgencyLevel.emit('+');
    } else if (touchendX - 200 > touchstartX) {
      this.defaultPrevent(event)
      // console.log('swiped right!')

      this.element.classList.add('animate__fadeOutRight');
      // this.element.addEventListener('animationend', () => {
      //   this.element.classList.remove('animate__fadeOutRight')
      // });
      this.changeUrgencyLevel.emit('-');
    };
  }

}
