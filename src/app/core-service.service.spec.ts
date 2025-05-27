import { TestBed } from '@angular/core/testing';

import { CoreServiceService } from './core-service.service';
import { provideHttpClient } from '@angular/common/http';

describe('CoreServiceService', () => {
  let service: CoreServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient()],
    });
    service = TestBed.inject(CoreServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should qualify [drone    AND   (   package    OR     delivery)  ] as [fullText:"drone" AND ( fullText:"package" OR fullText:"delivery") ]', () => {
    expect(
      service.getQualifiedSearchString(
        'drone    AND   (   package    OR     delivery)  ',
      ),
    ).toBe(
      'fullText:"drone" AND ( fullText:"package" OR fullText:"delivery") ',
    );
  });

  it('should qualify [drone and (package or delivery)] as [fullText:"drone" AND (fullText:"package" OR fullText:"delivery")]', () => {
    expect(
      service.getQualifiedSearchString('drone and (package or delivery)'),
    ).toBe('fullText:"drone" AND (fullText:"package" OR fullText:"delivery")');
  });

  // exercise bug fix
  it('should qualify [corn AND (candy OR band)] as [fullText:"corn" AND (fullText:"candy" OR fullText:"band")]', () => {
    expect(service.getQualifiedSearchString('corn AND (candy OR band)')).toBe(
      'fullText:"corn" AND (fullText:"candy" OR fullText:"band")',
    );
  });

  it('should buildQueryForGet without sort', () => {
    expect(service.buildQueryforGet('drone', { limit: 10, offset: 0 })).toBe(
      'https://api.core.ac.uk/v3/search/works/?limit=10&offset=0&q=(fullText:"drone")',
    );
  });

  it('should buildQueryForGet with sort', () => {
    expect(
      service.buildQueryforGet(
        'drone',
        { limit: 10, offset: 5 },
        { field: 'publishedDate', order: 1 },
      ),
    ).toBe(
      'https://api.core.ac.uk/v3/search/works/?limit=10&offset=5&q=(fullText:"drone")&sort=publishedDate:asc',
    );
  });
});
