import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { Book, Writer } from '../interfaces';
import { State } from '../reducers';
import { setAdvancedSearchParameters, setAdvancedSearchResult, useAdvancedSearchParameters } from '../actions/writers.actions';
import { Location, ɵBrowserPlatformLocation } from '@angular/common';
import { LocationPath } from '../enums';
import { StitchService } from '../stitch-service.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.css']
})
export class SearchResultComponent implements OnInit, OnDestroy {
  searchResult: Writer[] | Book[];
  searchResult$Subscription: Subscription;
  searchResult$: Observable<Writer[] | Book[]> = this.store$.pipe(
    select('writers', 'advancedSearchResult')
  );
  locationPath: typeof LocationPath = LocationPath;
  constructor(
    private store$: Store<State>,
    public location: Location,
  ) { }

  ngOnInit(): void {
    this.searchResult$Subscription = this.searchResult$.subscribe((searchResult) => this.searchResult = searchResult);
  }

  newSearch() {
    this.store$.dispatch(setAdvancedSearchParameters({ advancedSearchParameters: null }));
    this.store$.dispatch(useAdvancedSearchParameters({ boolean: false }));
    this.store$.dispatch(setAdvancedSearchResult({ items: null }));
    this.location.back();
  }

  ngOnDestroy() {
    this.searchResult$Subscription.unsubscribe();
  }

}
