import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

import { StitchService } from '../stitch-service.service';
import { Writer } from 'src/app/interfaces';
import { sortByLetters } from '../utils/utils';

@Component({
  selector: 'app-reminders-list',
  templateUrl: './reminders-list.component.html',
  styleUrls: ['./reminders-list.component.css']
})
export class RemindersListComponent implements OnInit {

  constructor(private location: Location, private stitchService: StitchService) { }
  writersToDisplay: Writer[] = [];
  ngOnInit(): void {
    if (this.location.path() === '/writer-reminders') {
      this.getSoferReminders(3);
    }
  }

  getSoferReminders(levelOfUrgency: number) {
    this.stitchService.getSoferReminders(levelOfUrgency)
        .then((writersResponse) => {
          this.writersToDisplay = sortByLetters(writersResponse.docs) as Writer[];
        });
  }

}
