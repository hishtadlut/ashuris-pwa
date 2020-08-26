import { createAction, props } from '@ngrx/store';
import { Writer } from '../interfaces';

export const loadWriter = createAction(
  '[Writer] load Writer',
  props<{ writerId: string }>()
);

export const setWriter = createAction(
  '[Writer] Set Writer',
  props<{ writer: Writer }>()
);

export const loadWritersList = createAction(
  '[Writers] load Writers List',
);

export const setWritersList = createAction(
  '[Writers] Set Writers List',
  props<{ writersList: Writer[] }>()
);

export const editWriter = createAction(
  '[Writers] Edit writer',
  props<{ editMode: boolean }>()
);

export const setSearchWritersResult = createAction(
  '[Writers] Set search writers result',
  props<{ writers: Writer[] }>()
);

export const setAdvancedSearchParameters = createAction(
  '[Writers] Set advanced search parameters',
  props<{ advancedSearchParameters: any }>()
);

export const useAdvancedSearchParameters = createAction(
  '[Writers] use advanced search parameters',
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
