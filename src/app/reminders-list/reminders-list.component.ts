import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

import { StitchService } from '../stitch-service.service';
import { Writer, Book } from 'src/app/interfaces';
import { sortByLetters } from '../utils/utils';
import { BooksOrDealers } from '../enums';

@Component({
  selector: 'app-reminders-list',
  templateUrl: './reminders-list.component.html',
  styleUrls: ['./reminders-list.component.css']
})
export class RemindersListComponent implements OnInit {

  constructor(private location: Location, private stitchService: StitchService) { }
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
    this.levelOfUrgency = levelOfUrgency;
    this.stitchService.getSoferReminders(levelOfUrgency)
        .then((writersResponse) => {
          this.levelOfUrgency = levelOfUrgency;
          this.listToDisplay = sortByLetters(writersResponse.docs) as Writer[];
        });
  }

  getbookReminders(levelOfUrgency: number) {
    this.levelOfUrgency = levelOfUrgency;
    this.stitchService.getBookReminders(levelOfUrgency)
        .then((booksResponse) => {
          this.listToDisplay = sortByLetters(booksResponse.docs) as Book[];
        });
  }

}
