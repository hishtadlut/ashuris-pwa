import { RouterLink } from '@angular/router';

export interface Writer {
  _id?: any;
  _rev?: string;
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
    writingLevel: {
      level: string,
      note: string
    },
    stabilityLevel: {
      level: string,
      note: string
    },
    eraseLevel: {
      level: string,
      note: string
    },
    writingTypes: {
      types: {
        ari: boolean,
        beitYosef: boolean,
        Welish: boolean
      },
    }
  };
  communityDeatails: {
    community: string;
    note: string;
  };

  pricesDeatails: {
    isPricePerPage: string;
    priceForMezuzah: {
      note: string;
      price: number;
      worthIt: string;
    }

    priceForTefillin: {
      note: string;
      price: number;
      worthIt: string;
    }

    priceForTorahScroll: {
      note: string;
      price: number;
      worthIt: string;
    }
  }

  placeOfWriting: {
    place: string,
    note: string,
  },

  additionalDetails: {
    hasWritenBefore: {
      boolean: string,
      note: string,
    }
    hasWritenKabala: {
      boolean: string,
      note: string,
    },
    voatsInElection: {
      boolean: string,
      note: string,
    },
    goesToKotel: {
      boolean: string,
      note: string,
    },
    beginnerWriter: {
      boolean: string,
      note: string,
    },
    writerLevel: {
      level: number,
      note: string,
    },
  }

  photos: string[],
  recordings: string[],
}


export interface ListItem {
  listItemText: string;
  listItemLink: RouterLink;
  image?: string;
}

export interface CalendarDate {
  year: number;
  month: number;
  day: number;
}
