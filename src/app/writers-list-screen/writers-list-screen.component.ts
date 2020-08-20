import { Component, OnInit, OnDestroy } from '@angular/core';
import { StitchService } from '../stitch-service.service';
import { Subscription, pipe, Observable } from 'rxjs';
import { Writer } from '../interfaces';
import { Store, select } from '@ngrx/store';
import { State } from '../reducers';
import { FormGroup, FormControl } from '@angular/forms';
import { SearchWriterService } from '../search-writer.service';

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
  searchForm: FormGroup;
  constructor(private _store$: Store<State>, private searchWriterService: SearchWriterService) { }

  ngOnInit(): void {
    this.writersList$Subscription = this.writersList$.subscribe((writersList) => this.writersList = this.writersToDisplay = writersList);

    this.searchForm = new FormGroup({
      city: new FormControl(''),
      community: new FormControl(''),
      hasWritenBefore: new FormControl('true'),
      isWritingRegularly: new FormGroup({
        writingRegularly: new FormControl(true),
        notWritingRegularly: new FormControl(true),
      }),
      isAppropriate: new FormGroup({
        bad: new FormControl(false),
        good: new FormControl(true),
        veryGood: new FormControl(true),
      }),
      quickSearch: new FormControl(''),
    })
  }

  onKeyUpSearchByName(event) {
    this.writersToDisplay = this.writersList.filter(writer =>
      writer.firstName.includes(event.target.value) || writer.lastName.includes(event.target.value)
    );
  }

  resetSearch() {
    this.writersToDisplay = this.writersList;
    this.searchForm.reset()
  }

  search() {
    this.writersToDisplay = this.searchWriterService.writersListFilter(this.searchForm.value)
  }

  ngOnDestroy() {
    this.writersList$Subscription.unsubscribe();
  }

}
