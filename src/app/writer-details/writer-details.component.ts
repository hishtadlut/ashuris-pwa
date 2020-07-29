import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit, AfterContentInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription, Observable } from 'rxjs';
import { Writer } from '../interfaces';
import { StitchService } from '../stitch-service.service';
import { GoogleMapsService } from '../google-maps-service.service';
import { Store, select } from '@ngrx/store';
import { State } from '../reducers';

@Component({
  selector: 'app-writer-details',
  templateUrl: './writer-details.component.html',
  styleUrls: ['./writer-details.component.css']
})
export class WriterDetailsComponent implements OnInit, AfterContentInit, OnDestroy {

  // paramsSub: Subscription
  // id: string;
  writer: Writer;
  writer$Subscription: Subscription;
  writer$ : Observable<any> = this._store$.pipe(
    select('writers','writer')
  )

  @ViewChild('mapContainer', { static: false }) gmap: ElementRef;

   
  // constructor(private route: ActivatedRoute, private stitchService: StitchService, private googleMapsService: GoogleMapsService, private store: Store) {}
  constructor(private _store$: Store<State>, private stitchService: StitchService, private googleMapsService: GoogleMapsService, private store: Store) {}

  ngOnInit(): void {
    this.writer$Subscription = this.writer$.subscribe((writer: Writer) => this.writer = writer)
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

  onEditWriter() {
    alert("TODO!!!")
  }

  ngOnDestroy() {
    this.writer$Subscription.unsubscribe();
    // this.paramsSub.unsubscribe()
  }

}
