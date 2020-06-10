import { RouterLink } from '@angular/router';

export interface Writer {
  firstName: string;
  lastName: string;
  telephone: string;
  city: string;
  profileImage: string;
  startDate: {
    gregorianDate: CalendarDate
    hebrewDateInWords: string
  };
}

export interface ListItem {
  listItemText: string;
  listItemLink: RouterLink;
}

export interface CalendarDate {
  year: number;
  month: number;
  day: number;
}
