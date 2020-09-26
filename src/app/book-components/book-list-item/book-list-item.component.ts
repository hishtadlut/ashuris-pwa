import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { State } from 'src/app/reducers';
import { loadBook, addToChangeUrgencyBookList } from 'src/app/actions/writers.actions';
import { Book } from 'src/app/interfaces';
import { preventDefaultAndStopPropagation } from 'src/app/utils/utils';

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
    this.levelOfUrgency = this.book.levelOfUrgency || 1;
  }

  goToBookDetails() {
    this.store$.dispatch(loadBook({ bookId: this.book._id }));
    this.router.navigate([`/book-details`]);
  }

  changeUrgencyLevel(event) {
    preventDefaultAndStopPropagation(event);
    this.levelOfUrgency !== 3 ? this.levelOfUrgency++ : this.levelOfUrgency = 1;
    this.store$.dispatch(addToChangeUrgencyBookList({ bookId: this.book._id, levelOfUrgency: this.levelOfUrgency }));
  }

}
