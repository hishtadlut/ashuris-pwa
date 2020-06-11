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
  writingDeatails: {
    letterSizes: {
      17: number;
      24: number;
      30: number;
      36: number;
      40: number;
      42: number;
      45: number;
      48: number;
    };
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
