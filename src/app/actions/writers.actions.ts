import { createAction, props } from '@ngrx/store';
import { Writer, Dealer, Book } from '../interfaces';

export const addToChangeUrgencyWritersList = createAction(
  '[Writer] Add To Change Urgency Writers List',
  props<{ writerId: string, levelOfUrgency: number }>()
);

export const addToChangeUrgencyBookList = createAction(
  '[Writer] Add To Change Urgency Book List',
  props<{ bookId: string, levelOfUrgency: number }>()
);

export const putChangeUrgencyWritersList = createAction(
  '[Writer] Put Change Urgency Writers List',
);

export const putChangeUrgencyBookList = createAction(
  '[Writer] Put Change Urgency Book List',
);

export const resetChangeUrgencyWritersList = createAction(
  '[Writer] Reset Change Urgency Writers List',
);

export const resetChangeUrgencyBookList = createAction(
  '[Writer] Reset Change Urgency Book List',
);

export const loadWritersList = createAction(
  '[Writers] load Writers List',
);

export const LoadSomeActions = createAction(
  '[LoadSomeActions] Load Some Actions',
);

export const loadDealerList = createAction(
  '[Dealers] load Dealer List',
);

export const loadBookList = createAction(
  '[Books] load Book List',
);

export const setWritersList = createAction(
  '[Writers] Set Writers List',
  props<{ writersList: Writer[] }>()
);

export const setDealerList = createAction(
  '[Dealers] Set Dealer List',
  props<{ dealerList: Dealer[] }>()
);

export const setBookList = createAction(
  '[Books] Set Book List',
  props<{ bookList: Book[] }>()
);

export const setCitiesList = createAction(
  '[Writers] Set Cities List',
  props<{ citiesList: string[] }>()
);

export const setParchmentList = createAction(
  '[Writers] Set Parchments List',
  props<{ parchmentList: string[] }>()
);

export const setAdvancedSearchResult = createAction(
  '[Writers] Set Advanced Search Result',
  props<{ items: Writer[] | Book[] }>()
);

export const setAdvancedSearchParameters = createAction(
  '[Writers] Set Sdvanced Search Parameters',
  props<{ advancedSearchParameters: any }>()
);

export const useAdvancedSearchParameters = createAction(
  '[Writers] Use Advanced Search Parameters',
  props<{ boolean: any }>()
);

export const setBookFormValues = createAction(
  '[Book] Set Book Form Values',
  props<{ form: any }>()
);

// export const loadWritersSuccess = createAction(
//   '[Writer] Load Writers Success',
//   props<{ data: any }>()
// );

// export const loadWritersFailure = createAction(
//   '[Writer] Load Writers Failure',
//   props<{ error: any }>()
// );

// export const loadWriters = createAction(
//   '[Writer] Load Writers'
// );

// export const loadWritersSuccess = createAction(
//   '[Writer] Load Writers Success',
//   props<{ data: any }>()
// );

// export const loadWritersFailure = createAction(
//   '[Writer] Load Writers Failure',
//   props<{ error: any }>()
// );
