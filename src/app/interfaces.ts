import { RouterLink } from '@angular/router';

export interface Writer {
  firstName: string;
  lastName: string;
  telephone: string;
  city: string;
  profileImage: string;
}

export interface ListItem {
  listItemText: string;
  listItemLink: RouterLink;
}
