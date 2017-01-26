/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { TimeConversionService } from './time-conversion.service';

describe('TimeConversionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TimeConversionService]
    });
  });

  it('should ...', inject([TimeConversionService], (service: TimeConversionService) => {
    expect(service).toBeTruthy();
  }));
});
