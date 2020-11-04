import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ListItem } from 'src/app/interfaces';

@Component({
  selector: 'app-list-item',
  templateUrl: './list-item.component.html',
  styleUrls: ['./list-item.component.css']
})
export class ListItemComponent {
  @Input() listIsClose = false;
  @Input() listItem: ListItem;
  constructor(private router: Router) { }

  onItemClicked() {
    this.router.navigate([`/${this.listItem.listItemLink}`]);
  }

}
