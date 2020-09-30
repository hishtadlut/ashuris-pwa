import { createAction, props } from '@ngrx/store';
import { Writer, Dealer, Book } from '../interfaces';

export const loadWriter = createAction(
  '[Writer] load Writer',
  props<{ writerId: string }>()
);

export const loadDealer = createAction(
  '[Dealers] load Dealer',
  props<{ dealerId: string }>()
);

export const loadBook = createAction(
  '[Books] load Book',
  props<{ bookId: string }>()
);

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



export const setWriter = createAction(
  '[Writer] Set Writer',
  props<{ writer: Writer }>()
);

export const setDealer = createAction(
  '[Dealers] Set Dealer',
  props<{ dealer: Dealer }>()
);

export const setBook = createAction(
  '[Dealers] Set Book',
  props<{ book: Book }>()
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

export const loadCitiesList = createAction(
  '[Writers] load Cities List',
);

export const loadCommunitiesList = createAction(
  '[Writers] load Communities List',
);

export const loadParchmentList = createAction(
  '[Writers] load Parchments List',
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

export const setCommunitiesList = createAction(
  '[Writers] Set Communities List',
  props<{ communitiesList: string[] }>()
);

export const setParchmentList = createAction(
  '[Writers] Set Parchments List',
  props<{ parchmentList: string[] }>()
);

export const editWriter = createAction(
  '[Writers] Edit Writer',
  props<{ editMode: boolean }>()
);

export const setAdvancedSearchResult = createAction(
  '[Writers] Set Advanced Search Result',
  props<{ items: Writer[] | Book[] }>()
);

export const setAdvancedSearchParameters = createAction(
  '[Writers] Set Sdvanced Dearch Parameters',
  props<{ advancedSearchParameters: any }>()
);

export const useAdvancedSearchParameters = createAction(
  '[Writers] Use Advanced Search Parameters',
  props<{ boolean: any }>()
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
