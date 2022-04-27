import { TestBed } from '@angular/core/testing';

import { ImageHistoryService } from './image-history.service';

describe('ImageHistoryService', () => {
  let service: ImageHistoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImageHistoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
