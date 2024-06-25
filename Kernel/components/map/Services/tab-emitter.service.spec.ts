import { TestBed } from '@angular/core/testing';

import { TabEmitterService } from './tab-emitter.service';

describe('TabEmiterService', () => {
  let service: TabEmitterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TabEmitterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
