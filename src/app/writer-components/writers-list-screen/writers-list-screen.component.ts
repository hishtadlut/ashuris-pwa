import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { Writer } from '../../interfaces';
import { Store, select } from '@ngrx/store';
import { State } from '../../reducers';
import { FormGroup, FormControl } from '@angular/forms';
import { SearchService } from '../../search.service';
import { ActivatedRoute } from '@angular/router';
import { StitchService } from 'src/app/stitch-service.service';
import { LocationPath } from 'src/app/enums';
import { Location } from '@angular/common';
import { sortByLetters } from 'src/app/utils/utils';

@Component({
  selector: 'app-writers-list-screen',
  templateUrl: './writers-list-screen.component.html',
  styleUrls: ['./writers-list-screen.component.css']
})
export class WritersListScreenComponent implements OnInit, OnDestroy {
  writersToDisplay: Writer[] = [];

  writersList: Writer[];
  writersList$Subscription: Subscription;
  writersList$: Observable<Writer[]> = this.store$.pipe(
    select('writers', 'writersList')
  );

  citiesList: string[];

  communitiesList: string[];

  searchForm: FormGroup;
  searchFormInitialValue: any;
  constructor(
    private store$: Store<State>,
    private searchService: SearchService,
    private activatedRoute: ActivatedRoute,
    private pouchDbService: StitchService,
    private location: Location,
  ) { }

  ngOnInit(): void {
    this.searchForm = new FormGroup({
      city: new FormControl(''),
      community: new FormControl(''),
      hasWritenBefore: new FormControl(true),
      hasNotWritenBefore: new FormControl(true),
      isWritingRegularly: new FormGroup({
        writingRegularly: new FormControl(true),
        notWritingRegularly: new FormControl(true),
      }),
      isAppropriate: new FormGroup({
        bad: new FormControl(false),
        good: new FormControl(true),
        veryGood: new FormControl(true),
      }),
      quickSearch: new FormControl(''),
    });

    this.pouchDbService.getCities()
      .then(citiesDoc => {
        this.citiesList = citiesDoc.docs.map(cityDoc => cityDoc.itemName);
      });

    this.pouchDbService.getCommunities()
      .then(communitiesDoc => {
        this.communitiesList = communitiesDoc.docs.map(communityDoc => communityDoc.itemName);
      });

    if (this.location.path().split('?')[0] === LocationPath.WRITERS_IN_ROOM_LIST) {
      const city = this.activatedRoute.snapshot.queryParamMap.get('city');
      const street = this.activatedRoute.snapshot.queryParamMap.get('street');
      const streetNumber = this.activatedRoute.snapshot.queryParamMap.get('streetNumber');
      this.pouchDbService.getWritersInRoom(city, street, streetNumber)
        .then(writers => {
          this.writersList = this.writersToDisplay = writers;
        });
    } else if (this.location.path() === LocationPath.WRITERS_LIST_SCREEN) {
      setTimeout(async () => {
        const writers = await this.pouchDbService.getWriters();
        this.writersList = this.writersToDisplay = sortByLetters(writers);
      }, 100);
    }

    this.searchFormInitialValue = this.searchForm.value;
  }

  onKeyUpSearchByName(event) {
    this.writersToDisplay = this.writersList.filter(writer =>
      writer.firstName.includes(event.target.value) || writer.lastName.includes(event.target.value)
    );
  }

  resetSearch() {
    this.writersToDisplay = this.writersList;
    this.searchForm.reset(this.searchFormInitialValue);
  }

  search() {
    this.writersToDisplay = this.searchService.writerListFilter(this.searchForm.value);
  }

  ngOnDestroy() {
    if (this.writersList$Subscription) {
      this.writersList$Subscription.unsubscribe();
    }
  }

}
