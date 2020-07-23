import { RouterLink } from '@angular/router';

export interface Writer {
  _id?: any;
  reminderState: string
  firstName: string;
  lastName: string;
  telephone: number;
  email: string;
  secondTelephone: number;
  city: string;
  street: string;
  profileImage: string;
  coordinates: google.maps.LatLng;
  isAppropriate: {
    level: string;
    note: string;
  }
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
    note: string;
  };
  communityDeatails: {
    community: string;
    note: string;
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
