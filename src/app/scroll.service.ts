import { LocationStrategy } from '@angular/common';
import { HostListener, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ScrollService {
  isGoingBack = false;
  previousScrollPosition = 0;
  lastScrollPosition = 0;
  constructor(location: LocationStrategy) {
    location.onPopState(() => {
      this.isGoingBack = true;
    });
  }

  setLastScrollPosition() {
    this.previousScrollPosition = this.lastScrollPosition
    this.lastScrollPosition = window.scrollY;
  }

  scroll() {
    if (this.isGoingBack) {
      scroll({ top: this.previousScrollPosition })
      this.isGoingBack = false;
    }
  }

  scrollToTop() {
    scroll({ top: 0 })
  }
  
}
