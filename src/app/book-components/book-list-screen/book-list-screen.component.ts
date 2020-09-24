import { Component, OnInit, OnDestroy } from '@angular/core';
import { Book } from '../../interfaces';
import { State } from '../../reducers';
import { Store, select } from '@ngrx/store';
import { Subscription, Observable } from 'rxjs';
import { Location } from '@angular/common';
import { LocationPath } from 'src/app/enums';
import { ActivatedRoute } from '@angular/router';
import { StitchService } from 'src/app/stitch-service.service';

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

  locationWithoutParameters: string;

  constructor(
    private store$: Store<State>,
    private location: Location,
    private activatedRoute: ActivatedRoute,
    private pouchDbService: StitchService
  ) { }

  ngOnInit(): void {
    this.locationWithoutParameters = this.location.path().split('?')[0];
    if (this.locationWithoutParameters === LocationPath.BOOK_LIST_SCREEN) {
      this.bookList$Subscription = this.bookList$.subscribe((bookList) => {
        this.bookList = this.booksToDisplay = bookList;
      });
    } else if (this.locationWithoutParameters === LocationPath.DEALER_BOOK_LIST) {
      this.pouchDbService.getDealerBooks(this.activatedRoute.queryParams['id'])
        .then(books => {
          this.booksToDisplay = books;
        });
    }
  }

  onKeyUpSearchByName(event) {
    this.booksToDisplay = this.bookList.filter(book =>
      book.name.includes(event.target.value)
    );
  }

  ngOnDestroy() {
    if (this.bookList$Subscription) {
      this.bookList$Subscription.unsubscribe();
    }
  }

}
