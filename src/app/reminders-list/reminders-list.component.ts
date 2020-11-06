import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { StitchService } from '../stitch-service.service';
import { Writer, Book } from 'src/app/interfaces';
import { sortByLetters } from '../utils/utils';
import { BooksOrDealers } from '../enums';
import { Store } from '@ngrx/store';
import { State } from '../reducers';
import { putChangeUrgencyBookList, putChangeUrgencyWritersList } from '../actions/writers.actions';


@Component({
  selector: 'app-reminders-list',
  templateUrl: './reminders-list.component.html',
  styleUrls: ['./reminders-list.component.css']
})
export class RemindersListComponent implements OnInit {

  constructor(private location: Location, private pouchDbService: StitchService, private store: Store<State>) { }
  levelOfUrgency = 3;
  booksOrDealersPage: BooksOrDealers;
  getReminders: (levelOfUrgency: number) => void;
  listToDisplay: Writer[] | Book[] = [];
  ngOnInit(): void {
    if (this.location.path() === '/writer-reminders') {
      this.booksOrDealersPage = BooksOrDealers.dealers;
      this.getReminders = this.getSoferReminders;
      this.getReminders(this.levelOfUrgency);
    } else if (this.location.path() === '/book-reminders') {
      this.booksOrDealersPage = BooksOrDealers.books;
      this.getReminders = this.getbookReminders;
      this.getReminders(this.levelOfUrgency);
    }
  }

  getSoferReminders(levelOfUrgency: number) {
    this.store.dispatch(putChangeUrgencyWritersList());
    this.levelOfUrgency = levelOfUrgency;
    this.pouchDbService.getSoferReminders(levelOfUrgency)
      .then((writersResponse) => {
        this.levelOfUrgency = levelOfUrgency;
        this.listToDisplay = sortByLetters(writersResponse.docs) as Writer[];
      });
  }

  getbookReminders(levelOfUrgency: number) {
    this.store.dispatch(putChangeUrgencyBookList());
    this.levelOfUrgency = levelOfUrgency;
    this.pouchDbService.getBookReminders(levelOfUrgency)
      .then((booksResponse) => {
        this.listToDisplay = sortByLetters(booksResponse.docs.filter((book => book.isSold.boolean === false))) as Book[];
      });
  }

}
