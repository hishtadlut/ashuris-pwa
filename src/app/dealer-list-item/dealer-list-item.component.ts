import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { State } from 'src/app/reducers';
import { loadDealer } from 'src/app/actions/writers.actions';
import { Dealer } from 'src/app/interfaces';
import { preventDefaultAndStopPropagation } from '../utils/utils';

@Component({
  selector: 'app-dealer-list-item',
  templateUrl: './dealer-list-item.component.html',
  styleUrls: ['./dealer-list-item.component.css']
})
export class DealerListItemComponent implements OnInit {
  @Input() dealer: Dealer;

  constructor(private router: Router, private store$: Store<State>) { }

  ngOnInit(): void {
  }

  goToDealerDetails() {
    this.store$.dispatch(loadDealer({ dealerId: this.dealer._id }));
    this.router.navigate([`/dealer-details`]);
  }

  showDealerBooks(event: Event) {
    preventDefaultAndStopPropagation(event);
    this.router.navigate([`/dealer-book-list`], { queryParams: { id: this.dealer._id}});
  }
}
