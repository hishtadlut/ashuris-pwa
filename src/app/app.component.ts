import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, Event, NavigationEnd } from '@angular/router';
import { State } from './reducers';
import { Store } from '@ngrx/store';
import { putChangeUrgencyWritersList } from './actions/writers.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  routerNavigation$Subscription: any;
  previousUrl: any;
  // tslint:disable-next-line: variable-name
  constructor(private router: Router, private _store: Store<State>) { }

  ngOnInit() {
    this.routerNavigation$Subscription = this.router.events.subscribe((event: Event) => {

      if (event instanceof NavigationEnd) {
        console.log(this.previousUrl);
        console.log(event.urlAfterRedirects);
        if (
          this.previousUrl === '/writers-list-screen' ||
          this.previousUrl === '/search-result' ||
          this.previousUrl === '/writer-reminders'
        ) {
          console.log('boom!!!');
          this._store.dispatch(putChangeUrgencyWritersList());
        }
        this.previousUrl = event.urlAfterRedirects;
      }
    });
  }

  ngOnDestroy() {

  }


}
