import { TestBed } from '@angular/core/testing';

import { UserLogin } from './user-login';

describe('UserLogin', () => {
  let service: UserLogin;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserLogin);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
