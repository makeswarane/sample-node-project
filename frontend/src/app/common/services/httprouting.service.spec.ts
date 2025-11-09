import { TestBed } from '@angular/core/testing';

import { HttproutingService } from './httprouting.service';

describe('HttproutingService', () => {
  let service: HttproutingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HttproutingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
