import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { Writer } from '../interfaces';
import { State } from '../reducers';
import { useAdvancedSearchParameters, setAdvancedSearchParameters } from '../actions/writers.actions';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.css']
})
export class SearchResultComponent implements OnInit, OnDestroy {
  searchResult$: Observable<Writer[]> = this.store$.pipe(
    select('writers', 'searchWritersResult')
  )
  searchResult$Subscription: Subscription;
  searchResult: Writer[];
  constructor(private store$: Store<State>, private router: Router) { }

  ngOnInit(): void {
    this.searchResult$Subscription = this.searchResult$.subscribe((searchResult) => this.searchResult = searchResult);
  }

  newSearch() {
    this.store$.dispatch(setAdvancedSearchParameters({advancedSearchParameters: null}));
    this.router.navigate(['/advanced-search'])
  }

  ngOnDestroy() {
    this.searchResult$Subscription.unsubscribe()
  }

}
