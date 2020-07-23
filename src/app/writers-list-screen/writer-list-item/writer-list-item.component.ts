import { Component, OnInit, Input } from '@angular/core';
import { Writer } from 'src/app/interfaces';
import { Router } from '@angular/router';

@Component({
  selector: 'app-writer-list-item',
  templateUrl: './writer-list-item.component.html',
  styleUrls: ['./writer-list-item.component.css']
})
export class WriterListItemComponent implements OnInit {

  @Input() writer: Writer;

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  goToWriterDetails() {
    this.router.navigate([`/writer-details`, { id: (this.writer._id) }]);
  }

}
