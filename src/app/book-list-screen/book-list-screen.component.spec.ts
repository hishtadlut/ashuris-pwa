import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BookListScreenComponent } from './book-list-screen.component';

describe('BookListScreenComponent', () => {
  let component: BookListScreenComponent;
  let fixture: ComponentFixture<BookListScreenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookListScreenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookListScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
