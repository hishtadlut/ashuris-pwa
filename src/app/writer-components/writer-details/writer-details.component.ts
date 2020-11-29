import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Writer } from '../../interfaces';
import { DomSanitizer } from '@angular/platform-browser';
import { preventDefaultAndStopPropagation, thereAreDetailsInGivenObject, shareButton, addAreaCodeForIsraliNumbers, blobToObjectUrl } from 'src/app/utils/utils';
import { StitchService } from 'src/app/stitch-service.service';
import { Subject } from 'rxjs';
import { take } from 'rxjs/operators';
import { FirebaseService } from 'src/app/firebase.service';

@Component({
  selector: 'app-writer-details',
  templateUrl: './writer-details.component.html',
  styleUrls: ['./writer-details.component.css']
})
export class WriterDetailsComponent implements OnInit {
  thereAreDetailsInGivenObject = thereAreDetailsInGivenObject;
  writer: Writer;
  priceForTorahScroll: { pricePerPage: number, priceForScroll: number };
  writerAddress: string;
  openMenuStatus = {
    pricesDeatails: false,
    writingDeatails: false,
    additionalDeatails: false,
    images: false,
    recordings: false,
  };
  shareButton = shareButton;
  addAreaCodeForIsraliNumbers = addAreaCodeForIsraliNumbers;

  errorEvent$ = new Subject<{ idUrl: string, index: number }>();
  dialogContent = null;
  preventDefaultAndStopPropagation = preventDefaultAndStopPropagation;

  @ViewChild('mapContainer', { static: false }) gmap: ElementRef;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private pouchDbService: StitchService,
    public sanitizer: DomSanitizer,
    private firebaseService: FirebaseService,
  ) { }

  async ngOnInit(): Promise<void> {
    this.errorEvent$.pipe(take(1)).subscribe((imageDetails) => {
      this.getImgFromUploadQueue(imageDetails.idUrl, imageDetails.index);
    });

    const id = this.activatedRoute.snapshot.queryParamMap.get('id');
    this.pouchDbService.getWriter(id).then(writer => {
      this.writer = writer;
      this.writerAddress = `${this.writer.city}+${this.writer.street}+${this.writer.streetNumber}`;
      if (this.writer?.pricesDeatails?.priceForTorahScroll.price) {
        this.priceForTorahScroll = {
          pricePerPage: this.writer.pricesDeatails.isPricePerPage !== 'מחיר לספר תורה'
            ? this.writer.pricesDeatails.priceForTorahScroll.price
            : Math.round((this.writer.pricesDeatails.priceForTorahScroll.price - 8700) / 245),
          priceForScroll: this.writer.pricesDeatails.isPricePerPage !== 'מחיר לספר תורה'
            ? Math.round((this.writer.pricesDeatails.priceForTorahScroll.price * 245) + 8700)
            : this.writer.pricesDeatails.priceForTorahScroll.price,
        };
      }
    });
  }


  editWriter() {
    this.router.navigate(['/edit-writer'], { queryParams: { id: this.writer._id } });
  }

  closeMenus(menuToOpen: string) {
    const menuToOpenStatus = this.openMenuStatus[menuToOpen];

    this.openMenuStatus = {
      pricesDeatails: false,
      writingDeatails: false,
      additionalDeatails: false,
      images: false,
      recordings: false,
    };

    this.openMenuStatus[menuToOpen] = !menuToOpenStatus;
  }

  openDialog(event: Event, content: string) {
    preventDefaultAndStopPropagation(event);
    this.dialogContent = content;
  }

  closeDialog() {
    this.dialogContent = null;
  }

  writersInRoomList(event: Event): void {
    preventDefaultAndStopPropagation(event);

    const city = this.writer.city;
    const street = this.writer.street;
    const streetNumber = this.writer.streetNumber;

    this.router.navigate(['writers-in-room-list'], { queryParams: { city, street, streetNumber } });
  }

  getLetterSizesString(
    letterSizes: { 17: boolean; 24: boolean; 30: boolean; 36: boolean; 40: boolean; 42: boolean; 45: boolean; 48: boolean; }
  ) {
    const letterSizesArray = [];
    Object.entries(letterSizes).forEach(letterSize => {
      if (letterSize[1] === true) {
        letterSizesArray.push(letterSize[0]);
      }
    });
    return letterSizesArray.join(' ,');
  }

  getSrc(index: number) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.writer.recordings[index]);
  }

  errorEventCall(idUrl: string, index: number) {
    this.errorEvent$.next({ idUrl, index });
  }

  getImgFromUploadQueue(idUrl: string, i: number) {
    this.firebaseService.getImageFromQueue(idUrl)
      .then(img => {
        this.writer.photos[i] = blobToObjectUrl(img.img);
      });
  }

}
