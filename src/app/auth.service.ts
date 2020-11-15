import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie';

@Injectable({ providedIn: 'root' })
export class AuthService {

  constructor(private cookieService: CookieService, private http: HttpClient) { }

  verifyToken(token: string) {
    return this.http
      .post<any>('https://ashuris.online/auth', { jwt: token });
  }

  thereIsAToken() {
    return this.getCookieToken() ? true : false;
  }

  getNewToken(userName: string, password: string) {
    return this.http
      .post<any>('https://ashuris.online/login', { username: userName, password });
  }

  getCookieToken() {
    return this.cookieService.get('token');
  }

  getXMinutesFromNow(minutes: number): Date {
    return new Date(new Date().getTime() + minutes * 60000);
  }


  setCookie(accessToken: string) {
    return this.cookieService.put('token', accessToken, { expires: this.getXMinutesFromNow((60 * 24)) });
  }

}
