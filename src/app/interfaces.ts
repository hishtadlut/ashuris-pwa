import { RouterLink } from '@angular/router';

export interface Writer {
  _id?: any;
  _rev?: string;
  creationDate: number;
  editDate: number;
  photos_620x620?: string[];
  note: string;
  levelOfUrgency: number;
  firstName: string;
  lastName: string;
  telephone: number;
  email: string;
  secondTelephone: number;
  city: string;
  street: string;
  streetNumber: string;
  apartmentNumber: string;
  profileImage: string;
  coordinates: google.maps.LatLng;
  isAppropriate: {
    level: string;
    note: string;
  };
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
      note: string;
    };
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
  };

  placeOfWriting: {
    place: string,
    note: string,
  };

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
  };
  isWritingRegularly: {
    boolean: string,
  };
  photos: string[];
  recordings: string[];
  _attachments?: {
    [x: string]: {
      content_type: string,
      // content_type: MimeType,
      data: Blob
    },
  };
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

export interface AdvancedSearchQuery {
  lowestPrice: number;
  highestPrice: number;
  priceOf: string;
  writingTypes: {
    ari: boolean,
    beitYosef: boolean,
    welish: boolean,
  };
  letterSizes: {
    17: boolean,
    24: boolean,
    30: boolean,
    36: boolean,
    40: boolean,
    42: boolean,
    45: boolean,
    48: boolean,
  };
  writingLevel: {
    1: boolean,
    2: boolean,
    3: boolean,
    4: boolean,
    5: boolean,
  };
  isAppropriateLevels: {
    bad: boolean,
    good: boolean,
    veryGood: boolean,
  };
  voatsInElection: string;
  goesToKotel: string;
}

export interface ChangeUrgencyWriter {
  writerId: string;
  levelOfUrgency: number;
}

export interface ChangeUrgencyBook {
  bookId: string;
  levelOfUrgency: number;
}

export interface GeneralDB {
  _id?: any;
  _rev?: string;
  type: string;
  itemName: string;
}

export interface Address {
  city: string;
  street: string;
  streetNumber: string;
  coordinates?: google.maps.LatLng;
}

export interface Dealer {
  _id?: any;
  _rev?: string;
  creationDate: number;
  editDate: number;
  firstName: string;
  lastName: string;
  telephone: number;
  email: string;
  note: string;
  secondTelephone: number;
  city: string;
  street: string;
  streetNumber: string;
  apartmentNumber: string;
  profileImage: string;
  coordinates: google.maps.LatLng;
  books: string[];
}

export interface Book {
  _id?: any;
  _rev?: string;
  creationDate: number;
  editDate: number;
  photos_620x620?: string[];
  levelOfUrgency: number;
  name: string;
  writer: string;
  dealer: string;
  note: string;
  isSold: {
    boolean: boolean;
  };
  endDate: {
    gregorianDate: CalendarDate
    hebrewDateInWords: string
  };
  isAppropriate: {
    level: string;
    note: string;
  };
  writingDeatails: {
    writingLevel: {
      level: string,
      note: string
    },
    stabilityLevel: {
      level: number,
      note: string
    },
    eraseLevel: {
      level: number,
      note: string
    },
    parchmentLevel: {
      level: number,
      note: string
    },
    parchmentType: {
      type: string;
      note: string;
    }
    writingType: string;
    letterSize: {
      size: string;
      note: string;
    };
  };

  communityDeatails: {
    community: string;
    note: string;
  };

  pricesDeatails: {
    isPricePerPage: string;
    priceForTorahScroll: {
      price: number;
      howMuchIsItWorth: number;
      negotiation: string,
      note: string;
    }
  };

  additionalDetails: {
    writerLevel: {
      level: number,
      note: string,
    },
    hasKtavKabala: {
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
  };

  photos: string[];
  recordings: string[];
  _attachments?: {
    [x: string]: {
      content_type: string,
      // content_type: MimeType,
      data: Blob
    },
  };
}

export interface WriterListFilters {
  city: string;
  community: string;
  hasWritenBefore: boolean;
  hasNotWritenBefore: boolean;
  isWritingRegularly: {
    writingRegularly: boolean;
    notWritingRegularly: boolean;
  };
  isAppropriate: {
    bad: string;
    good: string;
    veryGood: string;
  };
}
