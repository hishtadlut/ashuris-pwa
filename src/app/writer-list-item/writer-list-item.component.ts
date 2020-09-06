import { Component, OnInit, Input } from '@angular/core';
import { Writer } from 'src/app/interfaces';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { State } from 'src/app/reducers';
import { loadWriter, addToChangeUrgencyWritersList } from 'src/app/actions/writers.actions';

@Component({
  selector: 'app-writer-list-item',
  templateUrl: './writer-list-item.component.html',
  styleUrls: ['./writer-list-item.component.css']
})
export class WriterListItemComponent implements OnInit {

  @Input() writer: Writer;

  // tslint:disable-next-line: variable-name
  constructor(private router: Router, private _store$: Store<State>) { }
  levelOfUrgency: number;
  ngOnInit(): void {
    this.levelOfUrgency = this.writer.levelOfUrgency || 1;
  }

  goToWriterDetails() {
    this._store$.dispatch(loadWriter({ writerId: this.writer._id }));
    this.router.navigate([`/writer-details`]);
  }

  changeUrgencyLevel(event) {
    event.stopPropagation();
    event.preventDefault();

    this.levelOfUrgency !== 3 ? this.levelOfUrgency++ : this.levelOfUrgency = 1;

    // if (this.levelOfUrgency === 1) {
    //   event.target.classList.remove('highlight-ergent');
    // } else if (this.levelOfUrgency === 2) {
    //   event.target.classList.add('highlight-regular');
    // } else if (this.levelOfUrgency === 3) {
    //   event.target.classList.remove('highlight-regular');
    //   event.target.classList.add('highlight-ergent');
    // }
    this._store$.dispatch(addToChangeUrgencyWritersList({ writerId: this.writer._id, levelOfUrgency: this.levelOfUrgency }));
  }

}
