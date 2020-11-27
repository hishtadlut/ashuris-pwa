import { Directive, HostListener, Input } from '@angular/core';
import { base64ToBlob } from 'src/app/utils/utils';

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

  openImgInOterPage() {
    console.log('tapped');
    const win = window.open(this.base64Img);
    // const img = new Image();
    // img.src = this.base64Img;
    // img.style.width = '100%';
    // const newPage = window.open(this.base64Img).document.body.appendChild(img);
    // base64ToBlob(this.base64Img)
    //   .then(img => {
    //     this.openBlob(img);
    //   });
  }

  openBlob(base64URL: Blob) {
    const fileURL = URL.createObjectURL(base64URL);
    const win = window.open(fileURL);
    // var file = new Blob([byteArray], { type: mimeType + ';base64' });
    // win.document.write('<iframe src="' + base64URL + '" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>');
  }
}
