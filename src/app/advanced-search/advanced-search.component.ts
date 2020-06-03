import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-advanced-search',
  templateUrl: './advanced-search.component.html',
  styleUrls: ['./advanced-search.component.css']
})
export class AdvancedSearchComponent implements OnInit {
  advancedSearch: FormGroup;
  constructor() { }

  ngOnInit(): void {
    this.advancedSearch = new FormGroup({
      lowestPrice: new FormControl(''),
      highestPrice: new FormControl(''),
    });
  }

}
