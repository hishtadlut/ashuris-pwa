import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { Writer } from '../interfaces';
import { State } from '../reducers';

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.css']
})
export class SearchResultComponent implements OnInit, OnDestroy {
  searchResult$: Observable<Writer[]> = this._store$.pipe(
    select('writers', 'searchWritersResult')
  )
  searchResult$Subscription: Subscription;
  searchResult: Writer[];
  constructor(private _store$: Store<State>) { }

  ngOnInit(): void {
    this.searchResult$Subscription = this.searchResult$.subscribe((searchResult) => this.searchResult = searchResult);
  }

  ngOnDestroy() {
    this.searchResult$Subscription.unsubscribe()
  }

}
