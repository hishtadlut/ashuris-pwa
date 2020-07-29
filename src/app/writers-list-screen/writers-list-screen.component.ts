import { Component, OnInit, OnDestroy } from '@angular/core';
import { StitchService } from '../stitch-service.service';
import { Subscription, pipe, Observable } from 'rxjs';
import { Writer } from '../interfaces';
import { Store, select } from '@ngrx/store';
import { loadWritersList } from '../actions/writers.actions';
import { State } from '../reducers';

@Component({
  selector: 'app-writers-list-screen',
  templateUrl: './writers-list-screen.component.html',
  styleUrls: ['./writers-list-screen.component.css']
})
export class WritersListScreenComponent implements OnInit, OnDestroy {
  writersToDisplay: Writer[] = [];
  writersList$: Observable<Writer[]> = this._store$.pipe(
    select('writers', 'writersList')
  )
  writersList$Subscription: Subscription;
  writersList: Writer[];

  constructor(private stitchService: StitchService, private _store$: Store<State>) { }

  ngOnInit(): void {
    this._store$.dispatch(loadWritersList())
    
    this.writersList$Subscription = this.writersList$.subscribe((writersList) => this.writersList = this.writersToDisplay = writersList)
  }

  onKeyUpSearchByName(event) {
    this.writersToDisplay = this.writersList.filter(writer =>
      writer.firstName.includes(event.target.value) || writer.lastName.includes(event.target.value)
    );
  }

  ngOnDestroy() {
    this.writersList$Subscription.unsubscribe();
  }

}
