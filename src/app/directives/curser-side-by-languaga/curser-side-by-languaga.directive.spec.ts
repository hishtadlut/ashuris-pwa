import { ElementRef } from '@angular/core';
import { CurserSideByLanguagaDirective } from './curser-side-by-languaga.directive';

describe('CurserSideByLanguagaDirective', () => {
  it('should create an instance', () => {
    const directive = new CurserSideByLanguagaDirective(new ElementRef(document.createElement('input')));
    expect(directive).toBeTruthy();
  });
});
