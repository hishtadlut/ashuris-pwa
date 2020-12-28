import { Directive, HostListener, Input } from '@angular/core';
import { base64ToBlob, blobToObjectUrl } from 'src/app/utils/utils';

@Directive({
  selector: '[appDoubleTapOpenImg]'
})
export class DoubleTapOpenImgDirective {
  @Input() base64Img: string;
  tapedTwice = false;

  @HostListener('click') tapHandler() {
    console.log('tapped ones');

    if (!this.tapedTwice) {
      this.tapedTwice = true;
      setTimeout(() => {
        this.tapedTwice = false;
      }, 2000);
      return false;
    }
    this.openImgInOterPage();
  }

  async openImgInOterPage() {
    console.log('tapped');
    if (this.base64Img.includes('data:image/jpeg;base64,')) {
      return window.open(blobToObjectUrl(await base64ToBlob(this.base64Img)));
    }
    const win = window.open(this.base64Img);
  }
  
}
