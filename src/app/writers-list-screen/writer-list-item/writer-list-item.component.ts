import { Component, OnInit, Input } from '@angular/core';
import { Writer } from 'src/app/interfaces';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { State } from 'src/app/reducers';
import { loadWriter } from 'src/app/actions/writers.actions';

@Component({
  selector: 'app-writer-list-item',
  templateUrl: './writer-list-item.component.html',
  styleUrls: ['./writer-list-item.component.css']
})
export class WriterListItemComponent implements OnInit {

  @Input() writer: Writer;

  constructor(private router: Router, private _store$: Store<State>) { }

  ngOnInit(): void {
  }

  goToWriterDetails() {
    this._store$.dispatch(loadWriter({ writerId: this.writer._id.toString() }))
    this.router.navigate([`/writer-details`]);
  }

}
