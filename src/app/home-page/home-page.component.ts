import { Component } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css'],
})
export class HomePageComponent {
  constructor(private authService: AuthService) {}

  backupApp() {
    fetch('https://ashuris.online/backupEverything')
      .then((res) =>
        res.status === 200 ? alert('Backups will start soon') : alert('error')
      )
      .catch((err) => alert('error'));
  }

  logout() {
    this.authService.removeCookies();
  }
}
