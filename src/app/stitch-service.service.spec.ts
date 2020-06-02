import { TestBed } from '@angular/core/testing';

import { StitchServiceService } from './stitch-service.service';

describe('StitchServiceService', () => {
  let service: StitchServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StitchServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
