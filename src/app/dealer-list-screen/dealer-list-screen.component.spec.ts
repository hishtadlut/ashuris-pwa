import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DealerListScreenComponent } from './dealer-list-screen.component';

describe('DealerListScreenComponent', () => {
  let component: DealerListScreenComponent;
  let fixture: ComponentFixture<DealerListScreenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DealerListScreenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DealerListScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
