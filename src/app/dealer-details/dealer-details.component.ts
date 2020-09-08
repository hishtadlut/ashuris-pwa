import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { DomSanitizer } from '@angular/platform-browser';
import { GoogleMapsService } from '../google-maps-service.service';
import { State } from '../reducers';
import { Dealer } from '../interfaces';
import { Subscription, Observable } from 'rxjs';

@Component({
  selector: 'app-dealer-details',
  templateUrl: './dealer-details.component.html',
  styleUrls: ['./dealer-details.component.css']
})
export class DealerDetailsComponent implements OnInit, OnDestroy {
  dialogContent = null;

  dealer: Dealer;
  dealer$Subscription: Subscription;
  dealer$: Observable<any> = this.store$.pipe(
    select('writers', 'dealer')
  );

  constructor(
    private router: Router,
    private store$: Store<State>,
    public sanitizer: DomSanitizer,
    private googleMapsService: GoogleMapsService,
  ) { }

  ngOnInit() {
    this.dealer$Subscription = this.dealer$.subscribe(dealer => {
      console.log(dealer);
      this.dealer = dealer;
    });
  }

  openDialog(event, content: string) {
    event.stopPropagation();
    event.preventDefault();
    this.dialogContent = content;
  }

  closeDialog() {
    this.dialogContent = null;
  }

  editDealer() {
    this.router.navigate(['/edit-dealer']);
  }

  ngOnDestroy() {
    this.dealer$Subscription.unsubscribe();
  }
}
