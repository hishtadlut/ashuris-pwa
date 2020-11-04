import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute, RoutesRecognized } from '@angular/router';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {
  navBarTitle: string;
  constructor(public location: Location, private router: Router) { }

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
}
