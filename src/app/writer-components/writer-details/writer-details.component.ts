import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterContentInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription, Observable } from 'rxjs';
import { Address, Writer } from '../../interfaces';
import { GoogleMapsService } from '../../google-maps-service.service';
import { Store, select } from '@ngrx/store';
import { State } from '../../reducers';
import { editWriter } from '../../actions/writers.actions';
import { DomSanitizer } from '@angular/platform-browser';
import { preventDefaultAndStopPropagation } from 'src/app/utils/utils';

@Component({
  selector: 'app-writer-details',
  templateUrl: './writer-details.component.html',
  styleUrls: ['./writer-details.component.css']
})
export class WriterDetailsComponent implements OnInit, AfterContentInit, OnDestroy {

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
    private store: Store,
    public sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.writer$Subscription = this.writer$.subscribe((writer: Writer) => {
      this.writer = writer;
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

  shareButton(event) {
    // event.stopPropagation();
    // event.preventDefault();
    // if (navigator.share) {
    //   console.log(event.target.parentElement.lastChild.src);
    //   navigator.share({
    //     title: 'WebShare API Demo',
    //     url: `<img src="${event.target.parentElement.lastChild.src}">`,
    //   }).then(() => {
    //     console.log('Thanks for sharing!');
    //     alert(newVariable.canShare())
    //   })
    //   .catch(console.error);
    // } else {
    //   // fallback
    // }
  }

  ngAfterContentInit() {
    // this.paramsSub = this.route.params.subscribe(params => {
    //   this.stitchService.getWriter(params['id'])
    //     .then((writer: Writer) => {
    //       this.writer = writer;
    //       setTimeout(() => {
    //         if (!this.writer.coordinates) {

    //         }
    //         this.googleMapsService.setMapWithPosition(this.gmap.nativeElement, this.writer.coordinates)
    //       }, 1000);

    //     })
    //     .catch(err => console.log(err))
    //  });
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
    preventDefaultAndStopPropagation(event)
    this.dialogContent = content;
  }

  closeDialog() {
    this.dialogContent = null;
  }

  writersInRoomList(event): void {
    event.stopPropagation();
    event.preventDefault();

    const city = this.writer.city;
    const street = this.writer.street;
    const streetNumber = this.writer.streetNumber;

    this.router.navigate(['writers-in-room-list'], { queryParams: { city, street, streetNumber } });
  }

  ngOnDestroy() {
    this.writer$Subscription.unsubscribe();
    // this.paramsSub.unsubscribe()
  }

}
