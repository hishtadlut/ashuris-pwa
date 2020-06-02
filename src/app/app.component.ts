import { Component, OnInit } from '@angular/core';
import { StitchService } from './stitch-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(private stitchService: StitchService) { }

  ngOnInit(): void {
    this.stitchService.login();
  }
}
