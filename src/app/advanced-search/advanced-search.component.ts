import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { SearchWriterService } from '../search-writer.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-advanced-search',
  templateUrl: './advanced-search.component.html',
  styleUrls: ['./advanced-search.component.css']
})
export class AdvancedSearchComponent implements OnInit {
  advancedSearch: FormGroup;
  advancedSearchInitialValues: any;
  constructor(private searchWriterService: SearchWriterService, private router: Router) { }

  ngOnInit(): void {
    this.advancedSearch = new FormGroup({
      lowestPrice: new FormControl(300),
      highestPrice: new FormControl(1500),
      priceOf: new FormControl('priceForTorahScrollPerPage'),
      writingTypes: new FormGroup({
        ari: new FormControl(true),
        beitYosef: new FormControl(true),
        welish: new FormControl(true),
      }),
      letterSizes: new FormGroup({
        17: new FormControl(false),
        24: new FormControl(false),
        30: new FormControl(false),
        36: new FormControl(true),
        40: new FormControl(true),
        42: new FormControl(true),
        45: new FormControl(true),
        48: new FormControl(true),
      }),
      writingLevel: new FormGroup({
        1: new FormControl(true),
        2: new FormControl(true),
        3: new FormControl(true),
        4: new FormControl(true),
        5: new FormControl(true),
      }),
      isAppropriateLevels: new FormGroup({
        bad: new FormControl(false),
        good: new FormControl(true),
        veryGood: new FormControl(true),
      }),
      voatsInElection: new FormControl('any'),
      goesToKotel: new FormControl('any'),
    });
    this.advancedSearchInitialValues = this.advancedSearch.value;
  }

  search() {
    this.searchWriterService.findSoferAdvancedSearch(this.advancedSearch.value);
    this.router.navigate(['/search-result']);
  }

}
