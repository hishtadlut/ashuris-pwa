import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ExpandableListService } from './expandable-list.component.service';
import { ListItem } from '../interfaces';



@Component({
  selector: 'app-expandable-list',
  templateUrl: './expandable-list.component.html',
  styleUrls: ['./expandable-list.component.css']
})
export class ExpandableListComponent implements OnInit, OnDestroy {

  @Input() listItems: ListItem[];
  @Input() listTitle: string;
  listIsClose = true;
  subscription: Subscription;
  constructor(private expandableListService: ExpandableListService) { }

  ngOnInit(): void {
    this.subscription = this.expandableListService.onToggleList.subscribe(
      () => this.listIsClose = true
    );
  }

  toogleList() {
    const listState = this.listIsClose;
    this.expandableListService.onToggleList.next();
    this.listIsClose = !listState;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
