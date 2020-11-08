export enum BooksOrDealers {
  books = 'books',
  dealers = 'dealers',
}

export enum RemoveItem {
  book = 'ספר',
  dealer = 'סוחר',
  writer = 'סופר',
  img = 'תמונה',
  recording = 'הקלטה',
}

export enum LocationPath {
  BOOKS_ADVANCED_SEARCH = '/books-advanced-search',
  BOOKS_ADVANCED_SEARCH_RESULT = '/books-search-result',
  WRITERS_ADVANCED_SEARCH = '/writers-advanced-search',
  WRITERS_ADVANCED_SEARCH_RESULT = '/writers-search-result',
  BOOK_LIST_SCREEN = '/book-list-screen',
  DEALER_BOOK_LIST = '/dealer-book-list',
  WRITERS_IN_ROOM_LIST = '/writers-in-room-list',
  WRITERS_LIST_SCREEN = '/writers-list-screen',
  CREATE_WRITER = '/create-writer',
  CREATE_BOOK = '/create-book',
  EDIT_WRITER = '/edit-writer',
  EDIT_DEALER = '/edit-dealer',
  EDIT_BOOK = '/edit-book',
  CREATE_DEALER_FOR_BOOK = '/create-dealer-for-book',
  WRITER_DETAILS = '/writer-details',
  SAVE_ITEM = '/save-item',
  REMOVE_ITEM = '/home-page-remove-item',
}

export enum SearchFor {
  WRITERS = 'WRITERS',
  BOOKS = 'BOOKS',
}

export enum LocalDbNames {
  WRITERS = 'localWritersDB',
  DEALERS = 'localDealersDB',
  BOOKS = 'localBooksDB',
  GENERAL = 'localGeneralDB',
}

export enum RemoteDbNames {
  WRITERS = 'https://ashuris.online/couch/writers__remote',
  DEALERS = 'https://ashuris.online/couch/dealers_remote',
  BOOKS = 'https://ashuris.online/couch/books_remote',
  GENERAL = 'https://ashuris.online/couch/general_remote',
}
