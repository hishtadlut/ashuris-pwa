import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, Observable } from 'rxjs';
import { Writer } from '../../interfaces';
import { GoogleMapsService } from '../../google-maps-service.service';
import { Store, select } from '@ngrx/store';
import { State } from '../../reducers';
import { editWriter } from '../../actions/writers.actions';
import { DomSanitizer } from '@angular/platform-browser';
import { base64ToBlob, preventDefaultAndStopPropagation } from 'src/app/utils/utils';
import { StitchService } from 'src/app/stitch-service.service';
declare const navigator: Navigator;
type ShareData = {
  title?: string;
  text?: string;
  url?: string;
  files?: ReadonlyArray<File>;
};

interface Navigator {
  share?: (data?: ShareData) => Promise<void>;
  canShare?: (data?: ShareData) => boolean;
}
@Component({
  selector: 'app-writer-details',
  templateUrl: './writer-details.component.html',
  styleUrls: ['./writer-details.component.css']
})
export class WriterDetailsComponent implements OnInit, OnDestroy {

  writer: Writer;
  writer$Subscription: Subscription;
  writer$: Observable<any> = this.store$.pipe(
    select('writers', 'writer')
  );
  priceForTorahScroll: { pricePerPage: number, priceForScroll: number };
  openMenuStatus = {
    pricesDeatails: false,
    writingDeatails: false,
    additionalDeatails: false,
    images: false,
    recordings: false,
  };

  dialogContent = null;
  preventDefaultAndStopPropagation = preventDefaultAndStopPropagation;

  @ViewChild('mapContainer', { static: false }) gmap: ElementRef;

  constructor(
    private router: Router,
    private store$: Store<State>,
    private googleMapsService: GoogleMapsService,
    private activatedRoute: ActivatedRoute,
    private pouchDbService: StitchService,
    public sanitizer: DomSanitizer,
  ) { }

  async ngOnInit(): Promise<void> {
    const id = this.activatedRoute.snapshot.queryParamMap.get('id');
    this.writer = await this.pouchDbService.getWriter(id);
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
    if (this.writer?.coordinates) {
      setTimeout(() => {
        this.googleMapsService.setMapWithPosition(this.gmap.nativeElement, this.writer.coordinates);
      });
    } else if (this.writer) {
      const coordinates = await this.googleMapsService.geoCodeAddressToCoordinates(
        { city: this.writer.city, street: this.writer.street, streetNumber: this.writer.streetNumber }
      );
      this.googleMapsService.setMapWithPosition(this.gmap.nativeElement, coordinates);
    }
  }

  shareButton(event) {
    event.stopPropagation();
    event.preventDefault();
    if (navigator.share) {
      base64ToBlob(event.target.parentElement.lastChild.src)
        .then(img => {
          navigator.share({
            files: [new File([img], 'img.jpg')]
          })
            .then(() => {
              console.log('Thanks for sharing!');
              // alert(newVariable.canShare())
            })
            .catch(console.error);
        });
    } else {
      // fallback
    }
  }

  editWriter() {
    this.store$.dispatch(editWriter({ editMode: true }));
    this.router.navigate(['/edit-writer']);
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

  ngOnDestroy() {
    // this.paramsSub.unsubscribe()
  }

}
