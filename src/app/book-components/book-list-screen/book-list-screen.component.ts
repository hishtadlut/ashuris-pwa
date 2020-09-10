import { Component, OnInit, OnDestroy } from '@angular/core';
import { Book } from '../../interfaces';
import { State } from '../../reducers';
import { Store, select } from '@ngrx/store';
import { Subscription, Observable } from 'rxjs';

@Component({
  selector: 'app-book-list-screen',
  templateUrl: './book-list-screen.component.html',
  styleUrls: ['./book-list-screen.component.css']
})
export class BookListScreenComponent implements OnInit, OnDestroy {
  booksToDisplay: Book[] = [];

  bookList: Book[];
  bookList$Subscription: Subscription;
  bookList$: Observable<Book[]> = this.store$.pipe(
    select('writers', 'bookList')
  );

  constructor(private store$: Store<State>) { }

  ngOnInit(): void {
    this.bookList$Subscription = this.bookList$.subscribe((bookList) => {
      this.bookList = this.booksToDisplay = bookList;
    });
  }

  onKeyUpSearchByName(event) {
    this.booksToDisplay = this.bookList.filter(book =>
      book.name.includes(event.target.value)
    );
  }

  ngOnDestroy() {
    this.bookList$Subscription.unsubscribe();
  }

}
