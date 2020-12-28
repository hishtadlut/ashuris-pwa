import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { StitchService } from '../stitch-service.service';
import { Writer, Book } from 'src/app/interfaces';
import { sortByLetters } from '../utils/utils';
import { BooksOrDealers } from '../enums';
import { Store } from '@ngrx/store';
import { State } from '../reducers';
import { putChangeUrgencyBookList, putChangeUrgencyWritersList } from '../actions/writers.actions';
import { ScrollService } from '../scroll.service';


@Component({
  selector: 'app-reminders-list',
  templateUrl: './reminders-list.component.html',
  styleUrls: ['./reminders-list.component.css']
})
export class RemindersListComponent implements OnInit {

  constructor(
    private location: Location, 
    private pouchDbService: StitchService, 
    private store: Store<State>,
    private scrollService: ScrollService
    ) { }
  levelOfUrgency = 3;
  booksOrDealersPage: BooksOrDealers;
  getReminders: (levelOfUrgency: number) => Promise<void>;
  listToDisplay: Writer[] | Book[] = [];
  async ngOnInit(): Promise<void> {
    if (this.location.path() === '/writer-reminders') {
      this.booksOrDealersPage = BooksOrDealers.dealers;
      this.getReminders = this.getSoferReminders;
      await this.getReminders(this.levelOfUrgency);
    } else if (this.location.path() === '/book-reminders') {
      this.booksOrDealersPage = BooksOrDealers.books;
      this.getReminders = this.getbookReminders;
      await this.getReminders(this.levelOfUrgency);
    }
    setTimeout(() => {
      this.scrollService.scroll();
    }, 0);
  }

  async getSoferReminders(levelOfUrgency: number) {
    this.store.dispatch(putChangeUrgencyWritersList());
    this.levelOfUrgency = levelOfUrgency;
    const writersResponse = await this.pouchDbService.getSoferReminders(levelOfUrgency)
    this.listToDisplay = sortByLetters(writersResponse.docs) as Writer[];
  }

  async getbookReminders(levelOfUrgency: number) {
    this.store.dispatch(putChangeUrgencyBookList());
    this.levelOfUrgency = levelOfUrgency;
    const booksResponse = await this.pouchDbService.getBookReminders(levelOfUrgency)
    this.listToDisplay = sortByLetters(booksResponse.docs.filter((book => book.isSold.boolean === false))) as Book[];
  }

}
