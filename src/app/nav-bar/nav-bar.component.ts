import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router, RoutesRecognized } from '@angular/router';
import { LocationPath } from '../enums';
import { StitchService } from '../stitch-service.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {
  navBarTitle: string;
  locationPath: typeof LocationPath = LocationPath;
  constructor(public location: Location, private router: Router, private pouchDbService: StitchService) { }

  ngOnInit() {
    this.router.events.subscribe(data => {
      if (data instanceof RoutesRecognized) {
        this.navBarTitle = data.state.root.firstChild.data['nav-bar-title'];
      }
    });
  }

  goToHome() {
    this.location.go('/');
  }

  goBack() {
    this.location.back();
  }

  syncAllDBS(event: Event) {
    const div = (event.target as HTMLDivElement);
    div.classList.add('mirror-rotate');
    setTimeout(() => {
      div.classList.remove('mirror-rotate');
    }, 2000);
    this.pouchDbService.syncAllDBS();
  }
}
