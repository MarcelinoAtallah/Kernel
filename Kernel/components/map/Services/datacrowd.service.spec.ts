import { TestBed } from '@angular/core/testing';

import { DatacrowdService } from './datacrowd.service';

describe('DatacrowdService', () => {
  let service: DatacrowdService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DatacrowdService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
