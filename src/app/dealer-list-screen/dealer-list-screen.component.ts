import { Component, OnInit, OnDestroy } from '@angular/core';
import { Dealer } from '../interfaces';
import { Store, select } from '@ngrx/store';
import { Subscription, Observable } from 'rxjs';
import { State } from '../reducers';

@Component({
  selector: 'app-dealer-list-screen',
  templateUrl: './dealer-list-screen.component.html',
  styleUrls: ['./dealer-list-screen.component.css']
})
export class DealerListScreenComponent implements OnInit, OnDestroy {
  dealersToDisplay: Dealer[] = [];
  dealerList: Dealer[];
  dealerList$Subscription: Subscription;
  dealerList$: Observable<Dealer[]> = this.store$.pipe(
    select('writers', 'dealerList')
  );

  citiesList: string[];
  citiesList$Subscription: Subscription;
  citiesList$: Observable<string[]> = this.store$.pipe(
    select('writers', 'citiesList')
  );

  communitiesList: string[];
  communitiesList$Subscription: Subscription;
  communitiesList$: Observable<string[]> = this.store$.pipe(
    select('writers', 'communitiesList')
  );

  constructor(private store$: Store<State>) { }

  ngOnInit(): void {
    this.dealerList$Subscription = this.dealerList$.subscribe((dealerList) => {
      this.dealerList = this.dealersToDisplay = dealerList;
    });
    this.citiesList$Subscription = this.citiesList$.subscribe((citiesList) => this.citiesList = citiesList);
    this.communitiesList$Subscription = this.communitiesList$.subscribe((communitiesList) => this.communitiesList = communitiesList);
  }

  onKeyUpSearchByName(event) {
    this.dealersToDisplay = this.dealerList.filter(dealer =>
      dealer.firstName.includes(event.target.value) || dealer.lastName.includes(event.target.value)
    );
  }

  ngOnDestroy() {
    this.dealerList$Subscription.unsubscribe();
  }
}
