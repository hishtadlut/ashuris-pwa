import { Injectable } from '@angular/core';

import { Subject, Subscription, Observable } from 'rxjs';
import { Writer, ChangeUrgencyWriter, Dealer, Book, ChangeUrgencyBook, GeneralDB } from './interfaces';

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
import { loadWritersList, loadDealerList, loadBookList } from './actions/writers.actions';
import { LocalDbNames, RemoteDbNames } from './enums';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class StitchService {

    writersFromDB = new Subject<Writer[]>();

    localWritersDB = new PouchDB<Writer>(LocalDbNames.WRITERS);
    remoteWritersDB = new PouchDB<Writer>(RemoteDbNames.WRITERS);

    localDealersDB = new PouchDB<Dealer>(LocalDbNames.DEALERS);
    remoteDealersDB = new PouchDB<Dealer>(RemoteDbNames.DEALERS);

    localBooksDB = new PouchDB<Book>(LocalDbNames.BOOKS);
    remoteBooksDB = new PouchDB<Book>(RemoteDbNames.BOOKS);

    localGeneralDB = new PouchDB<GeneralDB>(LocalDbNames.GENERAL);
    remoteGeneralDB = new PouchDB<GeneralDB>(RemoteDbNames.GENERAL);

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

    constructor(private store$: Store<State>, private router: Router) {
        this.urgencyWritersList$Subscription = this.urgencyWritersList$.subscribe((writersList) => this.urgencyWritersList = writersList);
        this.urgencyBookList$Subscription = this.urgencyBookList$.subscribe((bookList) => this.urgencyBookList = bookList);

        // this.localWritersDB.createIndex({
        //   index: {
        //     fields: ['levelOfUrgency'],
        //     name: 'levelOfUrgency',
        //   }
        // }).then((result) => {
        //   console.log(result);
        // }).catch((err) => {
        //   console.log(err);
        // });
        this.syncAllDBS();
        setInterval(() => {
            this.syncAllDBS();
        }, 30000);
    }

    syncWritersDBS() {
        this.syncDb(this.localWritersDB, this.remoteWritersDB, loadWritersList);
    }

    syncDealersDBS() {
        this.syncDb(this.localDealersDB, this.remoteDealersDB, loadDealerList);
    }

    syncBooksDBS() {
        this.syncDb(this.localBooksDB, this.remoteBooksDB, loadBookList);
    }

    syncGeneralDBS() {
        this.syncDb(this.localGeneralDB, this.remoteGeneralDB);
    }

    syncAllDBS() {
        this.syncWritersDBS();
        this.syncDealersDBS();
        this.syncBooksDBS();
        this.syncGeneralDBS();
    }

    syncDb(localDb: PouchDB.Database<{}>, remoteDb: PouchDB.Database<{}>, actionToDispatch?: any) {
        let syncHandler: PouchDB.Replication.Sync<{}>;
        const startSync = () => {
            try {
                syncHandler = localDb.sync(remoteDb, { timeout: 60000 });
                remoteDb.logIn('aaf', 'Aaf0583215251').then((user) => {
                    syncHandler.on('change', (change) => {
                        console.log(localDb.name);
                        console.log(change);
                        if (actionToDispatch) {
                            this.store$.dispatch(actionToDispatch());
                        }
                    });
                    syncHandler.on('error', (err) => {
                        console.log(err);
                        console.log('sync stopped ' + localDb.name);
                        stopSync(syncHandler);
                    });
                    syncHandler.on('active', () => {
                        console.log('active');
                        if (actionToDispatch) {
                            this.store$.dispatch(actionToDispatch());
                        }
                    });
                    syncHandler.on('complete', () => {
                        console.log('sync complete ' + localDb.name);
                        stopSync(syncHandler);
                        // stopSync(syncHandler);
                    });
                });
            } catch (error) {
                console.log(error);
                console.log('sync stopped ' + localDb.name);
                stopSync(syncHandler);
            }
        };
        const stopSync = (DBS: PouchDB.Replication.Sync<{}>) => {
            try {
                console.log('sync stopped ' + localDb.name);
                removeListeners(DBS);
            } catch (error) {
                console.log(error);
                console.log('sync stopped ' + localDb.name);
                stopSync(DBS);
            }

        };
        const removeListeners = (DBS: PouchDB.Replication.Sync<{}>) => {
            DBS.cancel();
            DBS.removeAllListeners();
        };
        startSync();
    }

    createWriter(writer: Writer) {
        this.createCity(writer.city);
        this.createCommunity(writer.communityDeatails.community);

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

    createCity(city: string) {
        this.localGeneralDB.find({
            selector: { type: 'city' },
            fields: ['itemName'],
        })
            .then(result => {
                // tslint:disable-next-line: no-unused-expression max-line-length
                !result.docs.some((document) => document.itemName === city) && this.localGeneralDB.put({ itemName: city, _id: new Date().getMilliseconds().toString(), type: 'city' });
            });
    }

    createCommunity(community: string) {
        this.localGeneralDB.find({
            selector: { type: 'community' },
            fields: ['itemName'],
        })
            .then(result => {
                // tslint:disable-next-line: no-unused-expression max-line-length
                !result.docs.some((document) => document.itemName === community) && this.localGeneralDB.put({ itemName: community, _id: new Date().getMilliseconds().toString(), type: 'community' });
            });
    }

    createParchment(parchment: string) {
        this.localGeneralDB.find({
            selector: { type: 'parchment' },
            fields: ['itemName'],
        })
            .then(result => {
                // tslint:disable-next-line: no-unused-expression max-line-length
                !result.docs.some((document) => document.itemName === parchment) && this.localGeneralDB.put({ itemName: parchment, _id: new Date().getMilliseconds().toString(), type: 'parchment' });
            });
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
        return await this.localGeneralDB.find({
            selector: { type: 'community' },
            fields: ['itemName'],
        });
    }

    async getParchments() {
        return await this.localGeneralDB.find({
            selector: { type: 'parchment' },
            fields: ['itemName'],
        });
    }

    async getCities() {
        return await this.localGeneralDB.find({
            selector: { type: 'city' },
            fields: ['itemName'],
        });
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
            fields: ['_id', 'name', 'levelOfUrgency', 'isSold'],
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
        this.createCity(dealer.city);
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
        this.createCommunity(book.communityDeatails.community);
        this.createParchment(book.writingDeatails.parchmentType.type);
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

    removeItem(localDbName: LocalDbNames, item: Writer | Book | Dealer) {
        this[localDbName].remove((item as any));
        this.router.navigate(['/']);
    }

}
