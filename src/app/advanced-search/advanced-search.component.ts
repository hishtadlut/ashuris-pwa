import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { SearchService } from '../search.service';
import { Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { State } from '../reducers';
import { setAdvancedSearchParameters, useAdvancedSearchParameters as useAdvancedSearchParametersAction } from '../actions/writers.actions';
import { Subscription, Observable } from 'rxjs';
import { Location } from '@angular/common';
import { LocationPath, SearchFor } from '../enums';


@Component({
  selector: 'app-advanced-search',
  templateUrl: './advanced-search.component.html',
  styleUrls: ['./advanced-search.component.css']
})
export class AdvancedSearchComponent implements OnInit, OnDestroy {
  locationPath: typeof LocationPath = LocationPath;
  advancedSearchLocation: LocationPath;
  advancedSearch: FormGroup;
  advancedSearchInitialValues: any;
  advancedSearchParameters: any;
  useAdvancedSearchParameters$Subscription: Subscription;
  useAdvancedSearchParameters$: Observable<any> = this.store$.pipe(
    select('writers', 'useAdvancedSearchParameters')
  );
  advancedSearchParameters$Subscription: Subscription;
  advancedSearchParameters$: Observable<any> = this.store$.pipe(
    select('writers', 'advancedSearchParameters')
  );

  constructor(
    private searchService: SearchService,
    private router: Router,
    private store$: Store<State>,
    private location: Location
    ) { }

  ngOnInit(): void {
    if (this.location.path() === LocationPath.BOOKS_ADVANCED_SEARCH) {
      this.advancedSearchLocation = LocationPath.BOOKS_ADVANCED_SEARCH;
    } else if (this.location.path() === LocationPath.WRITERS_ADVANCED_SEARCH) {
      this.advancedSearchLocation = LocationPath.WRITERS_ADVANCED_SEARCH;
    }
    this.advancedSearch = new FormGroup({
      lowestPrice: new FormControl(''),
      highestPrice: new FormControl(''),
      priceOf: new FormControl('priceForTorahScrollPerPage'),
      writingTypes: new FormGroup({
        ari: new FormControl(true),
        beitYosef: new FormControl(true),
        welish: new FormControl(true),
      }),
      letterSizes: new FormGroup({
        17: new FormControl(false),
        24: new FormControl(false),
        30: new FormControl(false),
        36: new FormControl(true),
        40: new FormControl(true),
        42: new FormControl(true),
        45: new FormControl(true),
        48: new FormControl(true),
      }),
      writingLevel: new FormGroup({
        1: new FormControl(true),
        2: new FormControl(true),
        3: new FormControl(true),
        4: new FormControl(true),
        5: new FormControl(true),
      }),
      isAppropriateLevels: new FormGroup({
        bad: new FormControl(false),
        good: new FormControl(true),
        veryGood: new FormControl(true),
      }),
      voatsInElection: new FormControl('any'),
      goesToKotel: new FormControl('any'),
    });
    if (!this.advancedSearchInitialValues) {
      this.advancedSearchInitialValues = this.advancedSearch.value;
    }
    this.advancedSearchParameters$Subscription = this.advancedSearchParameters$.subscribe(advancedSearchParameters => {
      this.advancedSearchParameters = advancedSearchParameters;
    });
    this.useAdvancedSearchParameters$Subscription = this.useAdvancedSearchParameters$.subscribe((useAdvancedSearchParameters: boolean) => {
      if (useAdvancedSearchParameters) {
        if (this.advancedSearchLocation === LocationPath.WRITERS_ADVANCED_SEARCH) {
          if (this.advancedSearchParameters) {
            this.advancedSearch.patchValue(this.advancedSearchParameters);
            this.store$.dispatch(useAdvancedSearchParametersAction({ boolean: true }));
          }
        } else if (this.advancedSearchLocation === LocationPath.BOOKS_ADVANCED_SEARCH) {
          if (this.advancedSearchParameters) {
            this.advancedSearch.patchValue(this.advancedSearchParameters);
            this.store$.dispatch(useAdvancedSearchParametersAction({ boolean: true }));
          }
        }

      }
    });

  }

  search() {
    if (this.location.path() === LocationPath.BOOKS_ADVANCED_SEARCH) {
      this.searchService.advancedSearch(this.advancedSearch.value, SearchFor.BOOKS, LocationPath.BOOKS_ADVANCED_SEARCH);
      this.router.navigate(['/books-search-result']);
    } else if (this.location.path() === LocationPath.WRITERS_ADVANCED_SEARCH) {
      this.searchService.advancedSearch(this.advancedSearch.value, SearchFor.WRITERS, LocationPath.WRITERS_ADVANCED_SEARCH);
      this.router.navigate(['/writers-search-result']);
    }
    this.store$.dispatch(setAdvancedSearchParameters({ advancedSearchParameters: this.advancedSearch.value }));
    this.store$.dispatch(useAdvancedSearchParametersAction({ boolean: true }));
  }


  ngOnDestroy() {
    this.useAdvancedSearchParameters$Subscription.unsubscribe();
    this.advancedSearchParameters$Subscription.unsubscribe();
  }

}
