import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appCurserToEnd]'
})
export class CurserToEndDirective {

  constructor(private elementRef: ElementRef) { }

  @HostListener('click') tapHandler() {
    const input = this.elementRef.nativeElement as HTMLInputElement
    const inputLength = input.value.length;
    input.setSelectionRange(inputLength, inputLength);
  }

}
