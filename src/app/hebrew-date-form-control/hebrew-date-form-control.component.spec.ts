import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HebrewDateFormControlComponent } from './hebrew-date-form-control.component';

describe('HebrewDateFormControlComponent', () => {
  let component: HebrewDateFormControlComponent;
  let fixture: ComponentFixture<HebrewDateFormControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HebrewDateFormControlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HebrewDateFormControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
