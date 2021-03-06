import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { Book, Writer } from '../interfaces';
import { State } from '../reducers';
import { Location } from '@angular/common';
import { LocationPath } from '../enums';
import { SearchService } from '../search.service';
import { ScrollService } from '../scroll.service';
import { ReportsService } from '../report-page/reports.service';
import { Router } from '@angular/router';

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
    private searchService: SearchService,
    public location: Location,
    private scrollService: ScrollService,
    private reportsService: ReportsService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.searchResult$Subscription = this.searchResult$.subscribe((searchResult) => {
      this.searchResult = searchResult;
      setTimeout(() => {
        this.scrollService.scroll();
      }, 0);
    });
  }

  newSearch() {
    this.searchService.clearAdvancedSearchParameters();
    this.location.back();
  }

  goToReportPage() {
    this.reportsService.reportList.next(this.searchResult);
    this.router.navigate(['/report'])
  }

  ngOnDestroy() {
    this.searchResult$Subscription.unsubscribe();
  }

}
