import { Component, OnInit, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { Router, Event, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { State } from '../reducers';
import { useAdvancedSearchParameters } from '../actions/writers.actions';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit, OnDestroy {
  routerNavigation$Subscription: Subscription;
  previousUrl: string;
  constructor(public _location: Location, private router: Router, private _store: Store<State>) { }

  ngOnInit() {
    this.routerNavigation$Subscription = this.router.events.subscribe((event: Event) => {

      if (event instanceof NavigationEnd) {
        // console.log(this.previousUrl);
        // console.log(event.urlAfterRedirects);
        if ((event.urlAfterRedirects === '/advanced-search') && (this.previousUrl === '/search-result')) {
          this._store.dispatch(useAdvancedSearchParameters({ boolean: true }))
        }
        this.previousUrl = event.urlAfterRedirects
      }
    });
  }

  goToHome() {
    this._location.go('/')
  }

  goBack() {
    this._location.back()
  }

  ngOnDestroy() {
    this.routerNavigation$Subscription.unsubscribe();
  }
}
