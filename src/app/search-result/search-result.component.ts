import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { Book, Writer } from '../interfaces';
import { State } from '../reducers';
import { setAdvancedSearchParameters } from '../actions/writers.actions';
import { Location } from '@angular/common';
import { LocationPath } from '../enums';

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.css']
})
export class SearchResultComponent implements OnInit, OnDestroy {
  searchResult$: Observable<Writer[] | Book[]> = this.store$.pipe(
    select('writers', 'advancedSearchResult')
  );
  searchResult$Subscription: Subscription;
  searchResult: Writer[] | Book[];

  locationPath: typeof LocationPath = LocationPath;
  constructor(private store$: Store<State>, public location: Location) { }

  ngOnInit(): void {
    this.searchResult$Subscription = this.searchResult$.subscribe((searchResult) => this.searchResult = searchResult);
  }

  newSearch() {
    this.store$.dispatch(setAdvancedSearchParameters({advancedSearchParameters: null}));
    this.location.back();
  }

  ngOnDestroy() {
    this.searchResult$Subscription.unsubscribe();
  }

}
