import { Component, OnInit } from '@angular/core';
import { Book } from '../../interfaces';
import { Location } from '@angular/common';
import { LocationPath } from 'src/app/enums';
import { ActivatedRoute, Router } from '@angular/router';
import { StitchService } from 'src/app/stitch-service.service';
import { sortByDate, sortByLetters } from 'src/app/utils/utils';
import { ScrollService } from 'src/app/scroll.service';
import { ReportsService } from 'src/app/report-page/reports.service';

@Component({
  selector: 'app-book-list-screen',
  templateUrl: './book-list-screen.component.html',
  styleUrls: ['./book-list-screen.component.css']
})
export class BookListScreenComponent implements OnInit {
  sortButtonText: string;
  locationPath: typeof LocationPath = LocationPath;
  locationWithoutParameters: string;
  bookList: Book[];
  booksToDisplay: Book[] = [];
  showOnlySoldedBooks: boolean;

  constructor(
    private location: Location,
    private activatedRoute: ActivatedRoute,
    private pouchDbService: StitchService,
    private scrollService: ScrollService,
    private reportsService: ReportsService,
    private router: Router,
  ) { }

  async ngOnInit(): Promise<void> {
    this.showOnlySoldedBooks = false;
    this.locationWithoutParameters = this.location.path().split('?')[0];
    if (this.locationWithoutParameters === LocationPath.BOOK_LIST_SCREEN) {
      await this.getBooksBySoldCondition(false);
    } else if (this.locationWithoutParameters === LocationPath.DEALER_BOOK_LIST) {
      const books = await this.pouchDbService.getDealerBooks(this.activatedRoute.snapshot.queryParamMap.get('id'))
      this.bookList = books.filter((book: Book) => book?.isSold.boolean === false);
    }
    this.sortList();
    setTimeout(() => {
      this.scrollService.scroll();
    }, 0);
  }

  async getBooksBySoldCondition(isSold: boolean) {
    const books = await this.pouchDbService.getBooksBySoldCondition(isSold)
    this.bookList = books.docs;
    this.sortList();
  }

  onKeyUpSearchByName(event) {
    this.booksToDisplay = this.bookList.filter(book =>
      book.name.includes(event.target.value)
    );
  }

  sortList() {
    const sortListByLetters = localStorage.getItem('sortListByLetters') === 'true';
    localStorage.setItem('sortListByLetters', (sortListByLetters).toString());
    if (sortListByLetters) {
      this.sortButtonText = 'ממוין לפי א - ב';
      this.booksToDisplay = sortByLetters(this.bookList);
    } else {
      this.sortButtonText = 'ממוין לפי תאריך'
      this.booksToDisplay = sortByDate(this.bookList);
    }
  }

  changeSortMethod() {
    const sortListByLetters = localStorage.getItem('sortListByLetters') === 'true';
    localStorage.setItem('sortListByLetters', (!sortListByLetters).toString());
    this.sortList();
  }

  goToReportPage() {
    this.reportsService.reportList.next(this.booksToDisplay);
    this.router.navigate(['/report'])
  }

}
