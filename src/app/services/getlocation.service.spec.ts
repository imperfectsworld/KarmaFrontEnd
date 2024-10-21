import { TestBed } from '@angular/core/testing';

import { GetlocationService } from './getlocation.service';

describe('GetlocationService', () => {
  let service: GetlocationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetlocationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
