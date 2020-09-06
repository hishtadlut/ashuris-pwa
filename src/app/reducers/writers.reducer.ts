import { Action, createReducer, on } from '@ngrx/store';
import { Writer, ChangeUrgencyWriter } from '../interfaces';
import {
  setWriter,
  setWritersList,
  editWriter,
  setSearchWritersResult,
  useAdvancedSearchParameters,
  setAdvancedSearchParameters,
  setCitiesList,
  setCommunitiesList,
  addToChangeUrgencyWritersList,
  putChangeUrgencyWritersList,
  resetChangeUrgencyWritersList
} from '../actions/writers.actions';
import { sortByLetters } from '../utils/utils';



export const writersFeatureKey = 'writers';

export interface State {
  writer: Writer;
  writersList: Writer[];
  editMode: boolean;
  searchWritersResult: Writer[];
  advancedSearchParameters;
  useAdvancedSearchParameters: boolean;
  citiesList: string[];
  communitiesList: string[];
  urgencyWritersList: ChangeUrgencyWriter[];
}

export const initialState: State = {
  writer: null,
  writersList: null,
  editMode: false,
  searchWritersResult: null,
  advancedSearchParameters: null,
  useAdvancedSearchParameters: false,
  citiesList: [],
  communitiesList: [],
  urgencyWritersList: [],
};


export const writerReducer = createReducer(
  initialState,
  on(setWriter, (state, action) => {
    return { ...state, writer: action.writer };
  }),
  on(setWritersList, (state, action) => {
    let sortedWriterList = action.writersList.slice();
    sortedWriterList = sortByLetters(sortedWriterList);
    return {
      ...state, writersList: sortedWriterList
    };
  }),
  on(setCitiesList, (state, action) => {
    return { ...state, citiesList: action.citiesList };
  }),
  on(setCommunitiesList, (state, action) => {
    return { ...state, communitiesList: action.communitiesList };
  }),
  on(editWriter, (state, action) => {
    return { ...state, editMode: action.editMode };
  }),
  on(setSearchWritersResult, (state, action) => {
    return { ...state, searchWritersResult: action.writers };
  }),
  on(setAdvancedSearchParameters, (state, action) => {
    return { ...state, advancedSearchParameters: action.advancedSearchParameters };
  }),
  on(useAdvancedSearchParameters, (state, action) => {
    return { ...state, useAdvancedSearchParameters: action.boolean };
  }),
  on(addToChangeUrgencyWritersList, (state, action) => {
    const urgencyWritersListClone = state.urgencyWritersList.map(writer => Object.assign({}, writer));
    const writerToChangeIndex = urgencyWritersListClone.findIndex(writer => writer.writerId === action.writerId);
    if (writerToChangeIndex !== -1) {
      urgencyWritersListClone[writerToChangeIndex].levelOfUrgency = action.levelOfUrgency;
    } else {
      urgencyWritersListClone.push({ writerId: action.writerId, levelOfUrgency: action.levelOfUrgency });
    }
    return { ...state, urgencyWritersList: urgencyWritersListClone };
  }),
  on(resetChangeUrgencyWritersList, (state) => {
    return { ...state, urgencyWritersList: [] };
  }),
);

export function reducer(state: State | undefined, action: Action) {
  return writerReducer(state, action);
}
