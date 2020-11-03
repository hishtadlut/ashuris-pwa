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
  CREATE_DEALER_FOR_BOOK = '/create-dealer-for-book',
  WRITER_DETAILS = '/writer-details',
}

export enum SearchFor {
  WRITERS = 'WRITERS',
  BOOKS = 'BOOKS',
}
