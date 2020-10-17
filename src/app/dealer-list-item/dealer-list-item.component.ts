import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Dealer } from 'src/app/interfaces';
import { preventDefaultAndStopPropagation } from '../utils/utils';

@Component({
  selector: 'app-dealer-list-item',
  templateUrl: './dealer-list-item.component.html',
  styleUrls: ['./dealer-list-item.component.css']
})
export class DealerListItemComponent implements OnInit {
  @Input() dealer: Dealer;

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  goToDealerDetails() {
    this.router.navigate([`/dealer-details`], { queryParams: { id: this.dealer._id } });
  }

  showDealerBooks(event: Event) {
    preventDefaultAndStopPropagation(event);
    this.router.navigate([`/dealer-book-list`], { queryParams: { id: this.dealer._id } });
  }
}
