import { Injectable } from '@angular/core';

import { Subject, Subscription, Observable } from 'rxjs';
import { Writer, ChangeUrgencyWriter, Dealer, Book, ChangeUrgencyBook, Address } from './interfaces';

import { v4 as uuidv4 } from 'uuid';

import PouchDB from 'pouchdb';
import PouchdbUpsert from 'pouchdb-upsert';
import PouchdbAuthentication from 'pouchdb-authentication';
PouchDB.plugin(PouchdbUpsert);
PouchDB.plugin(PouchdbAuthentication);
PouchDB.plugin(PouchDBFind);

import PouchDBFind from 'pouchdb-find';
import { State } from './reducers';
import { Store, select } from '@ngrx/store';
import { loadWritersList, loadCitiesList, loadCommunitiesList, loadDealerList, loadBookList, loadParchmentList } from './actions/writers.actions';

@Injectable({
  providedIn: 'root'
})
export class StitchService {

  writersFromDB = new Subject<Writer[]>();
  citiesFromDB = new Subject<{ city: string }[]>();
  communitiesFromDB = new Subject<string[]>();

  localWritersDB = new PouchDB<Writer>('writersLocal');
  remoteWritersDB = new PouchDB<Writer>('https://ashuris.online:5985/writers__remote');

  localCommunitiesDB = new PouchDB('communitiesLocal');
  remoteCommunitiesDB = new PouchDB('https://ashuris.online:5985/communities_remote');

  localParchmentsDB = new PouchDB('parchmentsLocal');
  remoteParchmentsDB = new PouchDB('https://ashuris.online:5985/parchments_remote');

  localCitiesDB = new PouchDB('citiesLocal');
  remoteSitiesDB = new PouchDB('https://ashuris.online:5985/cities_remote');

  localDealersDB = new PouchDB<Dealer>('dealersLocal');
  remoteDealersDB = new PouchDB<Dealer>('https://ashuris.online:5985/dealers_remote');

  localBooksDB = new PouchDB<Book>('booksLocal');
  remoteBooksDB = new PouchDB<Book>('https://ashuris.online:5985/books_remote');

  urgencyWritersList: ChangeUrgencyWriter[];
  urgencyWritersList$Subscription: Subscription;
  urgencyWritersList$: Observable<ChangeUrgencyWriter[]> = this.store$.pipe(
    select('writers', 'urgencyWritersList')
  );

  urgencyBookList: ChangeUrgencyBook[];
  urgencyBookList$Subscription: Subscription;
  urgencyBookList$: Observable<ChangeUrgencyBook[]> = this.store$.pipe(
    select('writers', 'urgencyBookList')
  );

  constructor(private store$: Store<State>) {
    this.urgencyWritersList$Subscription = this.urgencyWritersList$.subscribe((writersList) => this.urgencyWritersList = writersList);
    this.urgencyBookList$Subscription = this.urgencyBookList$.subscribe((bookList) => this.urgencyBookList = bookList);

    this.localWritersDB.createIndex({
      index: {
        fields: ['levelOfUrgency'],
        name: 'levelOfUrgency',
      }
    }).then((result) => {
      console.log(result);
    }).catch((err) => {
      console.log(err);
    });

    this.syncDb(this.localWritersDB, this.remoteWritersDB, loadWritersList);
    this.syncDb(this.localCommunitiesDB, this.remoteCommunitiesDB, loadCommunitiesList);
    this.syncDb(this.localParchmentsDB, this.remoteParchmentsDB, loadParchmentList);
    this.syncDb(this.localCitiesDB, this.remoteSitiesDB, loadCitiesList);
    this.syncDb(this.localDealersDB, this.remoteDealersDB, loadDealerList);
    this.syncDb(this.localBooksDB, this.remoteBooksDB, loadBookList);
  }

  syncDb(localDb: PouchDB.Database<{}>, remoteDb: PouchDB.Database<{}>, actionToDispatch: any) {
    remoteDb.logIn('aaf', 'Aaf0583215251').then((user) => {
      localDb.sync(remoteDb, { live: true, retry: true })
        .on('change', (change) => {
          this.store$.dispatch(actionToDispatch());
        }).on('error', (err) => {
          console.log(err);
        }).on('active', () => {
          console.log('active');
          this.store$.dispatch(actionToDispatch());
        });
    });
  }

  createWriter(writer: Writer) {
    this.localCitiesDB.allDocs({ include_docs: true })
      .then(result => {
        // tslint:disable-next-line: no-unused-expression max-line-length
        !result.rows.some((document: any) => document.doc.city === writer.city) && this.localCitiesDB.put({ city: writer.city, _id: new Date().getMilliseconds().toString() });
      });
    this.localCommunitiesDB.get<{ communities: string[] }>('communities')
      .then((communities) => {
        const communitiesSet = new Set(communities.communities || []);
        communitiesSet.add(writer.communityDeatails.community);
        communities.communities = Array.from(communitiesSet);
        this.localCommunitiesDB.put(communities)
          .then(result => {
            console.log(result);
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        if (err.name === 'not_found') {
          return this.localCommunitiesDB.put({
            _id: 'communities',
            communities: []
          });
        } else { // hm, some other error
          console.log(err + 'boom');
        }
      });

    // writer.coordinates = JSON.parse(JSON.stringify(writer.coordinates));
    const writerClone = JSON.parse(JSON.stringify(writer)) as Writer;
    if (writer._id) {
      this.localWritersDB.upsert(writer._id, () => {
        return { ...writerClone };
      });
    } else {
      this.localWritersDB.put({
        // add unike id
        _id: uuidv4(),
        ...writerClone, levelOfUrgency: 1
      })
        .then(result => {
          console.log(result);
        })
        .catch(console.error);
    }
  }

  getWriters(): Promise<Writer[]> {
    return this.localWritersDB.allDocs<Writer>({ include_docs: true })
      .then((result) => {
        return new Promise(resolve => {
          resolve(result.rows.map(row => row.doc));
        });
      });
  }

  getWriter(id: string): Promise<Writer> {
    return new Promise(resolve => {
      resolve(this.localWritersDB.get(id));
    });
  }

  async getCities() {
    const result = await this.localCitiesDB.allDocs<{ city: string; }>({ include_docs: true });
    const cities = result.rows.map(row => row.doc.city);
    return cities;
  }

  updateDBFromUrgencyWritersList(writersList: ChangeUrgencyWriter[]): Promise<void> {
    return new Promise(resolve => {
      writersList.map(writerToChange => {
        this.localWritersDB.get<Writer>(writerToChange.writerId).then(writer => {
          writer.levelOfUrgency = writerToChange.levelOfUrgency;
          this.localWritersDB.put(writer).then(_ => {
            resolve();
          });
        });
      });
    });
  }

  updateDBFromUrgencyBookList(bookList: ChangeUrgencyBook[]): Promise<void> {
    return new Promise(resolve => {
      bookList.map(bookToChange => {
        this.localBooksDB.get<Writer>(bookToChange.bookId).then(book => {
          book.levelOfUrgency = bookToChange.levelOfUrgency;
          this.localBooksDB.put(book).then(_ => {
            resolve();
          });
        });
      });
    });
  }

  async getCommunities() {
    return await this.localCommunitiesDB.get<{ communities: string[] }>('communities');
  }

  async getParchments() {
    return await this.localParchmentsDB.get<{ parchments: string[] }>('parchments');
  }

  async getSoferReminders(levelOfUrgency: number) {
    return await this.localWritersDB.find({
      selector: { levelOfUrgency },
      fields: ['_id', 'firstName', 'lastName', 'city', 'street', 'profileImage', 'levelOfUrgency'],
    });
  }

  async getBookReminders(levelOfUrgency: number) {
    return await this.localBooksDB.find({
      selector: { levelOfUrgency },
      fields: ['_id', 'name', 'levelOfUrgency'],
    });
  }

  async getBooksBySoldCondition(isSold: boolean) {
    return await this.localBooksDB.find({
      selector: { 'isSold.boolean': isSold },
      fields: ['_id', 'name', 'levelOfUrgency'],
    });
  }

  async getWritersFullName() {
    const writersList = await this.localWritersDB.find({
      selector: {},
      fields: ['firstName', 'lastName'],
    });
    return writersList.docs.map((writerResponse) => {
      return `${writerResponse.lastName} ${writerResponse.firstName}`;
    });
  }

  async getDealersFullNameAndId(): Promise<{ fullName: string, _id: string }[]> {
    const dealersList = await this.localDealersDB.find({
      selector: {},
      fields: ['_id', 'firstName', 'lastName'],
    });
    return dealersList.docs.map((dealerResponse) => {
      return { fullName: `${dealerResponse.lastName} ${dealerResponse.firstName}`, _id: dealerResponse._id };
    });
  }

  getDealerById(id: string) {
    return this.localDealersDB.get<Dealer>(id);
  }

  getBookById(id: string) {
    return this.localBooksDB.get<Book>(id);
  }

  getDealers() {
    return this.localDealersDB.allDocs<Dealer>({ include_docs: true })
      .then((result) => {
        return new Promise(resolve => {
          resolve(result.rows.map(row => row.doc));
        });
      });
  }

  async getBooks(): Promise<unknown> {
    const result = await this.localBooksDB.allDocs<Book>({ include_docs: true });
    return new Promise(resolve => {
      resolve(result.rows.map(row => row.doc));
    });
  }

  createDealer(dealer: Dealer) {
    const dealerClone = JSON.parse(JSON.stringify(dealer)) as Dealer;
    if (dealer._id) {
      this.localDealersDB.put({
        ...dealerClone
      });
    } else {
      this.localDealersDB.put({
        // add unike id
        _id: uuidv4(),
        ...dealerClone
      })
        .then(result => {
          console.log(result);
        })
        .catch(console.error);
    }
  }

  createBook(book: Book, dealerId: string) {
    this.upsertParchmentTypeToDB(book.writingDeatails.parchmentType.type);
    const bookClone = JSON.parse(JSON.stringify(book)) as Book;
    if (book._id) {
      this.localBooksDB.upsert(book._id, () => {
        return { ...bookClone };
      });
    } else {
      this.localBooksDB.put({
        // add unike id
        _id: uuidv4(),
        ...bookClone
      })
        .then(result => {
          this.addBookToDealer(result.id, dealerId);
        })
        .catch(console.error);
    }
  }

  addBookToDealer(bookId: string, dealerId: string) {
    this.localDealersDB.get(dealerId).then(dealer => {
      const bookArray = dealer.books ? dealer.books : [];
      bookArray.push(bookId);
      this.localDealersDB.put({ ...dealer, books: bookArray });
    }).catch(console.log);
  }

  async getDealerBookIds(dealerId: string): Promise<string[]> {
    const dealerList = await this.localDealersDB.find({
      selector: { _id: dealerId },
      fields: ['books']
    });
    return dealerList.docs.map(dealer => dealer.books)[0];
  }

  async getDealerBooks(dealerId: string) {
    const bookIds = await this.getDealerBookIds(dealerId);
    const bookList = bookIds.map(async bookId => {
      const bookList = await this.localBooksDB.find({
        selector: { _id: bookId },
        fields: ['_id', 'levelOfUrgency', 'name'],
        limit: 1
      });
      return bookList.docs[0];
    });
    return await Promise.all(bookList);
  }

  async getWritersInRoom(city: string, street: string, streetNumber: string): Promise<Writer[]> {
    const writerList = await this.localWritersDB.find({
      selector: { city, street, streetNumber },
      fields: ['_id', 'levelOfUrgency', 'firstName', 'lastName', 'profileImage']
    });
    return writerList.docs.map(writer => writer);
  }

  upsertParchmentTypeToDB(parchmentType: string) {
    this.localParchmentsDB.get<{ parchments: string[] }>('parchments')
      .then((parchments) => {
        const parchmentsSet = new Set(parchments.parchments || []);
        parchmentsSet.add(parchmentType);
        parchments.parchments = Array.from(parchmentsSet);
        this.localParchmentsDB.put(parchments)
          .then(result => {
            console.log(result);
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        if (err.name === 'not_found') {
          return this.localParchmentsDB.put({
            _id: 'parchments',
            parchments: []
          });
        } else { // hm, some other error
          console.log(err + 'boom');
        }
      });
  }

}
