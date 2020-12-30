import { HttpClientModule } from '@angular/common/http';

import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CookieModule } from 'ngx-cookie';

import { LoginGuard } from './login-guard.guard';

describe('LoginGuardGuard', () => {
  let guard: LoginGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
       imports: [
         CookieModule.forRoot(),
         HttpClientModule,
         RouterTestingModule
        ] 
      });
    guard = TestBed.inject(LoginGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
