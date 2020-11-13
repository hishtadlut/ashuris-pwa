import { Directive, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appDoubleTapOpenImg]'
})
export class DoubleTapOpenImgDirective {
  @Input() base64Img: string;
  tapedTwice = false;
  constructor() { }

  @HostListener('click') tapHandler() {
    if (!this.tapedTwice) {
      this.tapedTwice = true;
      setTimeout(() => {
        this.tapedTwice = false;
      }, 300);
      return false;
    }
    this.openImgInOterPage();
  }

  openImgInOterPage() {
    const newPage = window.open('about:blank');
    const img = newPage.document.createElement('img');
    img.src = this.base64Img;
    img.style.width = '100%';
    setTimeout(() => {
      newPage.document.body.appendChild(img);
    }, 0);
  }
}
