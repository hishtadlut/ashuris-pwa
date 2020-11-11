import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appCurserSideByLanguaga]'
})
export class CurserSideByLanguagaDirective {

  constructor(private el: ElementRef<HTMLInputElement>) { }
  @HostListener('keyup') onKeyup() {
    if (this.el.nativeElement.value[0]) {
      const hebrew = /[\u0590-\u05FF]/;
      this.el.nativeElement.style.direction = hebrew.test(this.el.nativeElement.value[0]) ? 'rtl' : 'ltr';
    } else {
      this.el.nativeElement.style.direction = 'rtl';
    }

  }

  @HostListener('focus') onFocus() {
    if (this.el.nativeElement.value[0]) {
      const hebrew = /[\u0590-\u05FF]/;
      this.el.nativeElement.style.direction = hebrew.test(this.el.nativeElement.value[0]) ? 'rtl' : 'ltr';
    } else {
      this.el.nativeElement.style.direction = 'rtl';
    }
  }

}
