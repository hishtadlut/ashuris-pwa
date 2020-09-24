import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WriterListItemComponent } from './writer-list-item.component';

describe('WriterListItemComponent', () => {
  let component: WriterListItemComponent;
  let fixture: ComponentFixture<WriterListItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WriterListItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WriterListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
