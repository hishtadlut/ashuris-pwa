import { Component, OnInit, Input } from '@angular/core';
import { Writer } from 'src/app/interfaces';

@Component({
  selector: 'app-writer-list-item',
  templateUrl: './writer-list-item.component.html',
  styleUrls: ['./writer-list-item.component.css']
})
export class WriterListItemComponent implements OnInit {

  @Input() writer: Writer;

  constructor() { }

  ngOnInit(): void {
  }

}
