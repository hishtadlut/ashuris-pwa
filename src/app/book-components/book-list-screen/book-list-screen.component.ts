import { Component, OnInit } from '@angular/core';
import { Book } from '../../interfaces';
import { Location } from '@angular/common';
import { LocationPath } from 'src/app/enums';
import { ActivatedRoute } from '@angular/router';
import { StitchService } from 'src/app/stitch-service.service';
import { sortByLetters } from 'src/app/utils/utils';

@Component({
  selector: 'app-book-list-screen',
  templateUrl: './book-list-screen.component.html',
  styleUrls: ['./book-list-screen.component.css']
})
export class BookListScreenComponent implements OnInit {
  locationPath: typeof LocationPath = LocationPath;
  locationWithoutParameters: string;
  bookList: Book[];
  booksToDisplay: Book[] = [];
  showOnlySoldedBooks: boolean;

  constructor(
    private location: Location,
    private activatedRoute: ActivatedRoute,
    private pouchDbService: StitchService
  ) { }

  async ngOnInit(): Promise<void> {
    this.showOnlySoldedBooks = false;
    this.locationWithoutParameters = this.location.path().split('?')[0];
    if (this.locationWithoutParameters === LocationPath.BOOK_LIST_SCREEN) {
      await this.getBooksBySoldCondition(false);
    } else if (this.locationWithoutParameters === LocationPath.DEALER_BOOK_LIST) {
      this.pouchDbService.getDealerBooks(this.activatedRoute.snapshot.queryParamMap.get('id'))
        .then(books => {
          const availableBooks = books.filter((book: Book) => book?.isSold.boolean === false);
          this.booksToDisplay = sortByLetters(availableBooks);
        });
    }
  }

  async getBooksBySoldCondition(isSold: boolean) {
    const books = await this.pouchDbService.getBooksBySoldCondition(isSold)
    this.bookList = this.booksToDisplay = sortByLetters(books.docs);
  }

  onKeyUpSearchByName(event) {
    this.booksToDisplay = this.bookList.filter(book =>
      book.name.includes(event.target.value)
    );
  }

}
