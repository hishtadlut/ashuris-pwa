import { Component, OnInit } from '@angular/core';
import { Router, Event, NavigationEnd, NavigationStart } from '@angular/router';
import { State } from './reducers';
import { Store } from '@ngrx/store';
import {
  putChangeUrgencyWritersList,
  putChangeUrgencyBookList,
  useAdvancedSearchParameters,
  setBookFormValues,
} from './actions/writers.actions';
import { LocationPath } from './enums';
import { Subscription } from 'rxjs';
import { SearchService } from './search.service';
import { ScrollService } from './scroll.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  routerNavigation$Subscription: Subscription;
  previousUrl: string;
  constructor(
    private router: Router,
    private store: Store<State>,
    private searchService: SearchService,
    private scrollService: ScrollService,
  ) { }

  ngOnInit() {
    this.routerNavigation$Subscription = this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationStart) {
        this.scrollService.setLastScrollPosition()
      }
      if (event instanceof NavigationEnd) {
        this.scrollService.scrollToTop();
        if (
          this.previousUrl === '/writers-list-screen' ||
          this.previousUrl === '/search-result' ||
          this.previousUrl === '/writer-reminders'
        ) {
          this.store.dispatch(putChangeUrgencyWritersList());
        } else if (
          this.previousUrl === '/book-list-screen' ||
          this.previousUrl === '/book-reminders' ||
          this.previousUrl === LocationPath.DEALER_BOOK_LIST
        ) {
          this.store.dispatch(putChangeUrgencyBookList());
        } else if ((event.urlAfterRedirects === '/writers-list-screen') && (this.previousUrl !== '/')) {
          localStorage.setItem('UseWriterListFilterParams', 'true');
        }
        if ((event.urlAfterRedirects === '/writers-advanced-search') && (this.previousUrl === '/search-result')) {
          this.store.dispatch(useAdvancedSearchParameters({ boolean: true }));
        }
        if (
          (
            (event.urlAfterRedirects === LocationPath.WRITERS_ADVANCED_SEARCH)
            ||
            (event.urlAfterRedirects === LocationPath.BOOKS_ADVANCED_SEARCH)
            ||
            (event.urlAfterRedirects === LocationPath.CREATE_BOOK)
          )
          &&
          (this.previousUrl === '/')
        ) {
          this.store.dispatch(setBookFormValues({ form: null }));
          this.searchService.clearAdvancedSearchParameters();
        }
        this.previousUrl = event.urlAfterRedirects;
      }
    });
  }

}
