import { Component, OnInit, Input } from '@angular/core';
import { Writer } from 'src/app/interfaces';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { State } from 'src/app/reducers';
import { addToChangeUrgencyWritersList } from 'src/app/actions/writers.actions';

@Component({
  selector: 'app-writer-list-item',
  templateUrl: './writer-list-item.component.html',
  styleUrls: ['./writer-list-item.component.css']
})
export class WriterListItemComponent implements OnInit {
  @Input() writer: Writer; 

  constructor(private router: Router, private store$: Store<State>) { }
  levelOfUrgency: number;
  ngOnInit(): void {
    this.levelOfUrgency = this.writer.levelOfUrgency || 1;
  }

  goToWriterDetails() {
    this.router.navigate([`/writer-details`], { queryParams: { id: this.writer._id } });
  }

  changeUrgencyLevel(event: string) {
    if (event == '+') {
      this.levelOfUrgency++;
      if (this.levelOfUrgency === 4) {
        this.levelOfUrgency = 1;
      }
    } else {
      this.levelOfUrgency--;
      if (this.levelOfUrgency === 0) {
        this.levelOfUrgency = 3;
      }
    }
    this.store$.dispatch(addToChangeUrgencyWritersList({ writerId: this.writer._id, levelOfUrgency: this.levelOfUrgency }));
  }

}
