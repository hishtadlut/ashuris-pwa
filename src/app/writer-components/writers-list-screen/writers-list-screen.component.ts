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
import { sortByDate, sortByLetters } from 'src/app/utils/utils';
import { ScrollService } from 'src/app/scroll.service';

@Component({
  selector: 'app-writers-list-screen',
  templateUrl: './writers-list-screen.component.html',
  styleUrls: ['./writers-list-screen.component.css']
})
export class WritersListScreenComponent implements OnInit, OnDestroy {
  sortButtonText: string;

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

  getWritersFunction: () => Promise<void>;
  constructor(
    private store$: Store<State>,
    private searchService: SearchService,
    private activatedRoute: ActivatedRoute,
    private pouchDbService: StitchService,
    private location: Location,
    private scrollService: ScrollService,
  ) { }

  async ngOnInit(): Promise<void> {
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
      sortedByLetters: new FormControl(false)
    });

    this.pouchDbService.getCities()
      .then(citiesDoc => {
        this.citiesList = citiesDoc.docs.map(cityDoc => cityDoc.itemName);
      });

    this.pouchDbService.getCommunities()
      .then(communitiesDoc => {
        this.communitiesList = communitiesDoc.docs.map(communityDoc => communityDoc.itemName);
      });

    this.searchFormInitialValue = this.searchForm.value;

    if (this.location.path().split('?')[0] === LocationPath.WRITERS_IN_ROOM_LIST) {
      this.getWritersFunction = async () => {
        const city = this.activatedRoute.snapshot.queryParamMap.get('city');
        const street = this.activatedRoute.snapshot.queryParamMap.get('street');
        const streetNumber = this.activatedRoute.snapshot.queryParamMap.get('streetNumber');
        const writers = await this.pouchDbService.getWritersInRoom(city, street, streetNumber)
        this.writersList = writers;
      }
      await this.getWritersFunction();
    } else if (this.location.path() === LocationPath.WRITERS_LIST_SCREEN) {
      this.getWritersFunction = async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
        const writers = await this.pouchDbService.getWriters();
        this.writersList = writers;
      }
      await this.getWritersFunction();
    }
    if (localStorage.getItem('UseWriterListFilterParams') === 'true') {
      this.searchForm.patchValue(JSON.parse(localStorage.getItem('writerListFilterParams')));
      await new Promise(resolve => setTimeout(resolve, 100));
      const writers = await this.pouchDbService.getWriters();
      this.writersList = writers;
      this.search()
    }
    this.sortList();
    setTimeout(() => {
      this.scrollService.scroll();
    }, 0);
    localStorage.setItem('UseWriterListFilterParams', 'false');
  }

  onKeyUpSearchByName(event) {
    this.writersToDisplay = this.writersList.filter(writer =>
      writer.firstName.includes(event.target.value) || writer.lastName.includes(event.target.value)
    );
  }

  async resetSearch() {
    await this.getWritersFunction()
    this.sortList();
    this.searchForm.reset(this.searchFormInitialValue);
  }

  async search() {
    localStorage.setItem('writerListFilterParams', JSON.stringify(this.searchForm.value));
    this.writersList = await this.searchService.writerListFilter(this.searchForm.value);
    this.sortList();
  }

  sortList() {
    const sortListByLetters = localStorage.getItem('sortListByLetters') === 'true';
    localStorage.setItem('sortListByLetters', (sortListByLetters).toString());
    if (sortListByLetters) {
      this.sortButtonText = 'ממוין לפי א - ב';
      this.writersToDisplay = sortByLetters(this.writersList);
    } else {
      this.sortButtonText = 'ממוין לפי תאריך'
      this.writersToDisplay = sortByDate(this.writersList);
    }
  }

  changeSortMethod() {
    const sortListByLetters = localStorage.getItem('sortListByLetters') === 'true';
    localStorage.setItem('sortListByLetters', (!sortListByLetters).toString());
    this.sortList();
  }

  ngOnDestroy() {
    if (this.writersList$Subscription) {
      this.writersList$Subscription.unsubscribe();
    }
  }

}
