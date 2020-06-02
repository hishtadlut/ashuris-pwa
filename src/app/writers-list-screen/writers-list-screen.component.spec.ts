import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WritersListScreenComponent } from './writers-list-screen.component';

describe('WritersListScreenComponent', () => {
  let component: WritersListScreenComponent;
  let fixture: ComponentFixture<WritersListScreenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WritersListScreenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WritersListScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
