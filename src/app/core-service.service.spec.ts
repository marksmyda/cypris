import { TestBed } from '@angular/core/testing';

import { CoreServiceService } from './core-service.service';
import { provideHttpClient } from '@angular/common/http';

describe('CoreServiceService', () => {
  let service: CoreServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient()]
    });
    service = TestBed.inject(CoreServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should qualify [drone    AND   (   package    OR     delivery)  ] as [fullText:"drone" AND ( fullText:"package" OR fullText:"delivery") ]', () => {
    expect(service.getQualifiedSearchString('drone    AND   (   package    OR     delivery)  '))
    .toBe('fullText:"drone" AND ( fullText:"package" OR fullText:"delivery") ');
  });

  it('should qualify [drone and (package or delivery)] as [fullText:"drone" AND (fullText:"package" OR fullText:"delivery")]', () => {
    expect(service.getQualifiedSearchString('drone and (package or delivery)'))
    .toBe('fullText:"drone" AND (fullText:"package" OR fullText:"delivery")');
  });

});
