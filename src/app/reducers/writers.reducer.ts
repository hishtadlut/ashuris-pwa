import { Action, createReducer, on } from '@ngrx/store';
import { Writer, ChangeUrgencyWriter, Dealer, Book, ChangeUrgencyBook } from '../interfaces';
import {
  setWritersList,
  setAdvancedSearchResult,
  useAdvancedSearchParameters,
  setAdvancedSearchParameters,
  setCitiesList,
  setCommunitiesList,
  setParchmentList,
  addToChangeUrgencyWritersList,
  resetChangeUrgencyWritersList,
  setDealerList,
  setBookList,
  addToChangeUrgencyBookList,
  resetChangeUrgencyBookList
} from '../actions/writers.actions';
import { sortByLetters } from '../utils/utils';

export const writersFeatureKey = 'writers';

export interface State {
  writer: Writer;
  dealer: Dealer;
  book: Book;
  writersList: Writer[];
  dealerList: Dealer[];
  bookList: Book[];
  editMode: boolean;
  advancedSearchResult: Writer[] | Book[];
  advancedSearchParameters;
  useAdvancedSearchParameters: boolean;
  citiesList: string[];
  communitiesList: string[];
  parchmentList: string[];
  urgencyWritersList: ChangeUrgencyWriter[];
  urgencyBookList: ChangeUrgencyBook[];
  currentDealerId: string;
}

export const initialState: State = {
  writer: null,
  dealer: null,
  book: null,
  writersList: null,
  dealerList: null,
  bookList: null,
  editMode: false,
  advancedSearchResult: null,
  advancedSearchParameters: null,
  useAdvancedSearchParameters: false,
  citiesList: [],
  communitiesList: [],
  parchmentList: [],
  urgencyWritersList: [],
  urgencyBookList: [],
  currentDealerId: null,
};

export const writerReducer = createReducer(
  initialState,
  on(setWritersList, (state, action) => {
    let sortedWriterList = action.writersList.slice();
    sortedWriterList = sortByLetters(sortedWriterList).filter(writer => writer.lastName);
    return {
      ...state, writersList: sortedWriterList
    };
  }),
  on(setDealerList, (state, action) => {
    let sortedDealerList = action.dealerList.slice();
    sortedDealerList = sortByLetters(sortedDealerList);
    return {
      ...state, dealerList: sortedDealerList
    };
  }),
  on(setBookList, (state, action) => {
    let sortedBookList = action.bookList.slice();
    sortedBookList = sortByLetters(sortedBookList);
    return {
      ...state, bookList: sortedBookList
    };
  }),
  on(setCitiesList, (state, action) => {
    return { ...state, citiesList: action.citiesList };
  }),
  on(setCommunitiesList, (state, action) => {
    return { ...state, communitiesList: action.communitiesList };
  }),
  on(setParchmentList, (state, action) => {
    return { ...state, parchmentList: action.parchmentList };
  }),
  on(setAdvancedSearchResult, (state, action) => {
    return { ...state, advancedSearchResult: action.items };
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
  on(addToChangeUrgencyBookList, (state, action) => {
    const urgencyBookListClone = state.urgencyBookList.map(book => Object.assign({}, book));
    const bookToChangeIndex = urgencyBookListClone.findIndex(book => book.bookId === action.bookId);
    if (bookToChangeIndex !== -1) {
      urgencyBookListClone[bookToChangeIndex].levelOfUrgency = action.levelOfUrgency;
    } else {
      urgencyBookListClone.push({ bookId: action.bookId, levelOfUrgency: action.levelOfUrgency });
    }
    return { ...state, urgencyBookList: urgencyBookListClone };
  }),
  on(resetChangeUrgencyWritersList, (state) => {
    return { ...state, urgencyWritersList: [] };
  }),
  on(resetChangeUrgencyBookList, (state) => {
    return { ...state, urgencBbookList: [] };
  }),
);

export function reducer(state: State | undefined, action: Action) {
  return writerReducer(state, action);
}
