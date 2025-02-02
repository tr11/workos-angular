import { TestBed } from '@angular/core/testing';

import { AuthKitService } from './authkit.service';

describe('AuthkitAngularService', () => {
  let service: AuthKitService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthKitService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
