import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit, AfterContentInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Writer } from '../interfaces';
import { StitchService } from '../stitch-service.service';
import { GoogleMapsService } from '../google-maps-service.service';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-writer-details',
  templateUrl: './writer-details.component.html',
  styleUrls: ['./writer-details.component.css']
})
export class WriterDetailsComponent implements OnInit, AfterContentInit, OnDestroy {

  paramsSub: Subscription
  id: string;
  writer: Writer;

  @ViewChild('mapContainer', { static: false }) gmap: ElementRef;

   
  constructor(private route: ActivatedRoute, private stitchService: StitchService, private googleMapsService: GoogleMapsService, private store: Store) {}
  ngOnInit(): void {
   
  }

  ngAfterContentInit() {
    this.paramsSub = this.route.params.subscribe(params => {
      this.stitchService.getWriter(params['id'])
        .then((writer: Writer) => {
          this.writer = writer;
          setTimeout(() => {
            if (!this.writer.coordinates) {
              
            }
            this.googleMapsService.setMapWithPosition(this.gmap.nativeElement, this.writer.coordinates)
          }, 1000);
          
        })
        .catch(err => console.log(err))
     });
  }

  onEditWriter() {
    alert("TODO!!!")
  }

  ngOnDestroy() {
    this.paramsSub.unsubscribe()
  }

}
