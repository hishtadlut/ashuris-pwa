import { Component, OnInit, Input } from '@angular/core';
import { Writer } from 'src/app/interfaces';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { State } from 'src/app/reducers';
import { addToChangeUrgencyWritersList } from 'src/app/actions/writers.actions';
import { preventDefaultAndStopPropagation } from 'src/app/utils/utils';

@Component({
  selector: 'app-writer-list-item',
  templateUrl: './writer-list-item.component.html',
  styleUrls: ['./writer-list-item.component.css']
})
export class WriterListItemComponent implements OnInit {

  @Input() writer: Writer;

  // tslint:disable-next-line: variable-name
  constructor(private router: Router, private store$: Store<State>) { }
  levelOfUrgency: number;
  ngOnInit(): void {
    this.levelOfUrgency = this.writer.levelOfUrgency || 1;
  }

  goToWriterDetails() {
    this.router.navigate([`/writer-details`], { queryParams: { id: this.writer._id } });
  }

  changeUrgencyLevel(event: Event) {
    preventDefaultAndStopPropagation(event);
    this.levelOfUrgency !== 3 ? this.levelOfUrgency++ : this.levelOfUrgency = 1;
    this.store$.dispatch(addToChangeUrgencyWritersList({ writerId: this.writer._id, levelOfUrgency: this.levelOfUrgency }));
  }

}
