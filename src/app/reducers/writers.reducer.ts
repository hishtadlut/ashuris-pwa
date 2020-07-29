import { Action, createReducer, on } from '@ngrx/store';
import { Writer } from '../interfaces';
import { setWriter, setWritersList } from '../actions/writers.actions';


export const writersFeatureKey = 'writers';

export interface State {
  writer: Writer;
  writersList: Writer[];
}

export const initialState: State = {
  writer: null,
  writersList: null,
};


export const writerReducer = createReducer(
  initialState,
  on(setWriter, (state, action) => {
    return {...state, writer: action.writer}
  }),
  on(setWritersList, (state, action) => {
    return {...state, writersList: action.writersList}
  })
);

export function reducer(state: State | undefined, action: Action) {
  return writerReducer(state, action);
}
