import { Action, createReducer, on } from '@ngrx/store';
import { Writer } from '../interfaces';
import { setWriter, setWritersList, editWriter } from '../actions/writers.actions';
import { state } from '@angular/animations';
import { act } from '@ngrx/effects';


export const writersFeatureKey = 'writers';

export interface State {
  writer: Writer;
  writersList: Writer[];
  editMode: boolean
}

export const initialState: State = {
  writer: null,
  writersList: null,
  editMode: false,
};


export const writerReducer = createReducer(
  initialState,
  on(setWriter, (state, action) => {
    return { ...state, writer: action.writer }
  }),
  on(setWritersList, (state, action) => {
    return { ...state, writersList: action.writersList }
  }),
  on(editWriter, (state, action) => {
    return { ...state, editMode: true }
  }),
);

export function reducer(state: State | undefined, action: Action) {
  return writerReducer(state, action);
}
