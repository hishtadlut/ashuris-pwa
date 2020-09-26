import { Component, OnInit, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { Router, Event, NavigationEnd, ActivatedRoute, RoutesRecognized } from '@angular/router';
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
  navBarTitle: string;
  constructor(public location: Location, private router: Router, private store: Store<State>, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.router.events.subscribe(data => {
      if (data instanceof RoutesRecognized) {
        this.navBarTitle = data.state.root.firstChild.data['nav-bar-title'];
      }
    });

    this.routerNavigation$Subscription = this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        if ((event.urlAfterRedirects === '/writers-advanced-search') && (this.previousUrl === '/search-result')) {
          this.store.dispatch(useAdvancedSearchParameters({ boolean: true }));
        }
        if ((event.urlAfterRedirects === '/writers-advanced-search') && (this.previousUrl === '/')) {
          this.store.dispatch(useAdvancedSearchParameters({ boolean: false }));
        }
        this.previousUrl = event.urlAfterRedirects;
      }
    });
  }

  goToHome() {
    this.location.go('/');
  }

  goBack() {
    this.location.back();
  }

  ngOnDestroy() {
    this.routerNavigation$Subscription.unsubscribe();
  }
}
