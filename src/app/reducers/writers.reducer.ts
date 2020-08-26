import { Action, createReducer, on } from '@ngrx/store';
import { Writer } from '../interfaces';
import { setWriter, setWritersList, editWriter, setSearchWritersResult, useAdvancedSearchParameters, setAdvancedSearchParameters } from '../actions/writers.actions';



export const writersFeatureKey = 'writers';

export interface State {
  writer: Writer;
  writersList: Writer[];
  editMode: boolean,
  searchWritersResult: Writer[],
  advancedSearchParameters,
  useAdvancedSearchParameters: boolean,
}

export const initialState: State = {
  writer: null,
  writersList: null,
  editMode: false,
  searchWritersResult: null,
  advancedSearchParameters: null,
  useAdvancedSearchParameters: false,
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
    return { ...state, editMode: action.editMode }
  }),
  on(setSearchWritersResult, (state, action) => {
    return { ...state, searchWritersResult: action.writers }
  }),
  on(setAdvancedSearchParameters, (state, action) => {  
    return { ...state, advancedSearchParameters: action.advancedSearchParameters }
  }),
  on(useAdvancedSearchParameters, (state, action) => {
    return { ...state, useAdvancedSearchParameters: action.boolean }
  }),
);

export function reducer(state: State | undefined, action: Action) {
  return writerReducer(state, action);
}
