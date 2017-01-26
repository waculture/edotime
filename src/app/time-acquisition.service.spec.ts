/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { TimeAcquisitionService } from './time-acquisition.service';

describe('TimeAcquisitionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TimeAcquisitionService]
    });
  });

  it('should ...', inject([TimeAcquisitionService], (service: TimeAcquisitionService) => {
    expect(service).toBeTruthy();
  }));
});
