import { ElementRef } from '@angular/core';
import { SwipeDirective } from './swipe.directive';

describe('SwipeDirective', () => {
  it('should create an instance', () => {
    const directive = new SwipeDirective(new ElementRef<any>(document.createElement('div')));
    expect(directive).toBeTruthy();
  });
});
