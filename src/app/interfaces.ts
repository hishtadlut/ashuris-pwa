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
      17: boolean;
      24: boolean;
      30: boolean;
      36: boolean;
      40: boolean;
      42: boolean;
      45: boolean;
      48: boolean;
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
