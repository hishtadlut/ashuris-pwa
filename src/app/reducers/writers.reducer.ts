import { Action, createReducer, on } from '@ngrx/store';
import { Writer, ChangeUrgencyWriter, Dealer, Book, ChangeUrgencyBook } from '../interfaces';
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
  resetChangeUrgencyWritersList,
  setDealer,
  setDealerList,
  setBookList,
  setBook,
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
  searchWritersResult: Writer[];
  advancedSearchParameters;
  useAdvancedSearchParameters: boolean;
  citiesList: string[];
  communitiesList: string[];
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
  searchWritersResult: null,
  advancedSearchParameters: null,
  useAdvancedSearchParameters: false,
  citiesList: [],
  communitiesList: [],
  urgencyWritersList: [],
  urgencyBookList: [],
  currentDealerId: null,
};


export const writerReducer = createReducer(
  initialState,
  on(setWriter, (state, action) => {
    return { ...state, writer: action.writer };
  }),
  on(setDealer, (state, action) => {
    return { ...state, dealer: action.dealer };
  }),
  on(setBook, (state, action) => {
    return { ...state, book: action.book };
  }),
  on(setWritersList, (state, action) => {
    let sortedWriterList = action.writersList.slice();
    sortedWriterList = sortByLetters(sortedWriterList);
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
