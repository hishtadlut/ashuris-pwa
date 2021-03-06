import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { State } from 'src/app/reducers';
import { addToChangeUrgencyBookList } from 'src/app/actions/writers.actions';
import { Book } from 'src/app/interfaces';

@Component({
  selector: 'app-book-list-item',
  templateUrl: './book-list-item.component.html',
  styleUrls: ['./book-list-item.component.css']
})
export class BookListItemComponent implements OnInit {
  @Input() book: Book;

  constructor(private router: Router, private store$: Store<State>) { }

  levelOfUrgency: number;
  ngOnInit(): void {
    this.levelOfUrgency = this.book?.levelOfUrgency || 1;
  }

  goToBookDetails() {
    this.router.navigate([`/book-details`], {queryParams: { id: this.book._id }});
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
    this.store$.dispatch(addToChangeUrgencyBookList({ bookId: this.book._id, levelOfUrgency: this.levelOfUrgency }));
  }

}
