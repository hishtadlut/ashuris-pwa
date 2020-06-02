import { Component, OnInit, OnDestroy } from '@angular/core';
import { StitchService } from '../stitch-service.service';
import { Subscription } from 'rxjs';
import { Writer } from '../interfaces';

@Component({
  selector: 'app-writers-list-screen',
  templateUrl: './writers-list-screen.component.html',
  styleUrls: ['./writers-list-screen.component.css']
})
export class WritersListScreenComponent implements OnInit, OnDestroy {
  writers: Writer[];
  writersToDisplay: Writer[];
  writersFromDBSubscription: Subscription;
  constructor(private stitchService: StitchService) { }

  ngOnInit(): void {
    this.stitchService.getWriters();
    this.writersFromDBSubscription = this.stitchService.writersFromDB.subscribe(
      (writers => {
        this.writers = writers;
        this.writersToDisplay = writers;
      })
    );
  }

  onKeyUpSearchByName(event) {
    this.writersToDisplay = this.writers.filter(writer =>
      writer.firstName.includes(event.target.value) || writer.lastName.includes(event.target.value)
    );
  }

  ngOnDestroy() {
    this.writersFromDBSubscription.unsubscribe();
  }

}
