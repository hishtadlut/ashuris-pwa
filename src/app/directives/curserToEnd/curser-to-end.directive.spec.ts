import { ElementRef } from '@angular/core';
import { CurserToEndDirective } from './curser-to-end.directive';

describe('CurserToEndDirective', () => {
  it('should create an instance', () => {
    const directive = new CurserToEndDirective(new ElementRef(document.createElement('input')));
    expect(directive).toBeTruthy();
  });
});
