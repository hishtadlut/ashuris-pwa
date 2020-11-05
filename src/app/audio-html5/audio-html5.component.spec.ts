import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AudioHTML5Component } from './audio-html5.component';

describe('AudioHTML5Component', () => {
  let component: AudioHTML5Component;
  let fixture: ComponentFixture<AudioHTML5Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AudioHTML5Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AudioHTML5Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
