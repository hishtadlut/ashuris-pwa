import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appCurserSideByLanguaga]'
})
export class CurserSideByLanguagaDirective {

  constructor(private el: ElementRef<HTMLInputElement>) { }
  @HostListener('keyup') onChange() {
    if (this.el.nativeElement.value[0]) {
      const a = /[\u0590-\u05FF]/;
      this.el.nativeElement.style.direction =  a.test(this.el.nativeElement.value[0]) ? 'rtl' : 'ltr';
    }
  }

}
