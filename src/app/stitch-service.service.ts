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
import { LocalDbNames, LocationPath, RemoteDbNames } from './enums';
import { Router } from '@angular/router';
import { FirebaseService } from './firebase.service';
import { base64ToBlob } from './utils/utils';

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

    constructor(private store$: Store<State>, private router: Router, private firebaseService: FirebaseService) {
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
        }, 120000);
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
        localDb.compact();
        let syncHandler: PouchDB.Replication.Sync<{}>;
        const startSync = () => {
            try {
                remoteDb.logIn('aaf', 'Aaf0583215251').then((user) => {
                    syncHandler = localDb.sync(remoteDb, { timeout: 60000 });
                    syncHandler.on('change', (change) => {
                        console.log(localDb.name);
                        console.log(change);
                    });
                    syncHandler.on('error', (err) => {
                        console.log(err);
                        console.log('sync err stopped ' + localDb.name);
                        stopSync(syncHandler);
                    });
                    syncHandler.on('active', () => {
                        console.log('active');
                    });
                    syncHandler.on('complete', () => {
                        console.log('sync complete ' + localDb.name);
                        if (actionToDispatch) {
                            this.store$.dispatch(actionToDispatch());
                        }
                        stopSync(syncHandler);
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

    async uploadeBase64andReplaceWithStorageUrls(base64: string[], name: string, id: string, extension: string) {
        return await Promise.all(base64.map(async (photo) => {
            if (photo.indexOf('http') === 0) {
                return photo;
            } else {
                const imgBlob = await base64ToBlob(photo);
                return await this.firebaseService.addImagesToQueueOfUploades(imgBlob, `${name}_${id}`, extension);
            }
        }));
    }

    async createWriter(writer: Writer) {
        this.createCity(writer.city);
        this.createCommunity(writer.communityDeatails.community);

        const writerClone = JSON.parse(JSON.stringify(writer)) as Writer;
        const fullName = `${writerClone.firstName}_${writerClone.lastName}`;

        if (writerClone._id) {
            writerClone.photos = await this.uploadeBase64andReplaceWithStorageUrls(writerClone.photos, fullName, writerClone._id, 'jpg');
            writerClone.photos_620x620 = writerClone.photos.map(photoUrl => photoUrl.replace('.jpg', '_620x620.jpg'));

            writerClone.recordings = await this.uploadeBase64andReplaceWithStorageUrls(writerClone.recordings, fullName, writerClone._id, 'wav');
            this.localWritersDB.upsert(writerClone._id, () => {
                return { ...writerClone };
            });
        } else {
            writerClone._id = uuidv4();
            writerClone.photos = await this.uploadeBase64andReplaceWithStorageUrls(writerClone.photos, fullName, writerClone._id, 'jpg');
            writerClone.photos_620x620 = writerClone.photos.map(photoUrl => photoUrl.replace('.jpg', '_620x620.jpg'));
            writerClone.recordings = await this.uploadeBase64andReplaceWithStorageUrls(writerClone.recordings, fullName, writerClone._id, 'wav');
            this.localWritersDB.put({
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
            fields: ['_id', 'name', 'levelOfUrgency', 'isSold', 'writingDeatails'],
        });
    }

    async getBooksBySoldCondition(isSold: boolean) {
        return await this.localBooksDB.find({
            selector: { 'isSold.boolean': isSold },
            fields: ['_id', 'name', 'levelOfUrgency', 'writingDeatails'],
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

    async createBook(book: Book, dealerId: string) {
        this.createCommunity(book.communityDeatails.community);
        this.createParchment(book.writingDeatails.parchmentType.type);

        const bookClone = JSON.parse(JSON.stringify(book)) as Book;

        if (bookClone._id) {
            bookClone.photos = await this.uploadeBase64andReplaceWithStorageUrls(bookClone.photos, bookClone.name, bookClone._id, 'jpg');
            bookClone.photos_620x620 = bookClone.photos.map(photoUrl => photoUrl.replace('.jpg', '_620x620.jpg'));
            bookClone.recordings = await this.uploadeBase64andReplaceWithStorageUrls(bookClone.recordings, bookClone.name, bookClone._id, 'wav');
            const oldBook = await this.getBookById(bookClone._id);
            const putResult = await this.localBooksDB.put({ ...oldBook, ...bookClone });
            if (oldBook.dealer) {
                this.removeBookFromDealer(oldBook.dealer, bookClone._id);
            }
            if (dealerId) {
                this.addBookToDealer(putResult.id, dealerId);
            }
        } else {
            bookClone._id = uuidv4();
            bookClone.photos = await this.uploadeBase64andReplaceWithStorageUrls(bookClone.photos, bookClone.name, bookClone._id, 'jpg');
            bookClone.photos_620x620 = bookClone.photos.map(photoUrl => photoUrl.replace('.jpg', '_620x620.jpg'));
            bookClone.recordings = await this.uploadeBase64andReplaceWithStorageUrls(bookClone.recordings, bookClone.name, bookClone._id, 'wav');
            const putResult = await this.localBooksDB.put({ ...bookClone });
            this.addBookToDealer(putResult.id, dealerId);
        }
    }

    addBookToDealer(bookId: string, dealerId: string) {
        this.localDealersDB.get(dealerId)
            .then(dealer => {
                console.log(dealer + ' dealer');
                let bookArray = dealer.books ? dealer.books : [];
                bookArray.push(bookId);
                bookArray = [...new Set(Object.values(bookArray))];
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

    async getDealerBooks(dealerId: string): Promise<PouchDB.Core.ExistingDocument<Book>[]> {
        const bookIds = await this.getDealerBookIds(dealerId);
        if (bookIds) {
            const bookList = bookIds.map(async bookId => {
                const bookList = await this.localBooksDB.find({
                    selector: { _id: bookId },
                    fields: ['_id', 'levelOfUrgency', 'name', 'writingDeatails'],
                    limit: 1
                });
                // there is just one there "limit: 1"
                return bookList.docs[0];
            });
            return await Promise.all(bookList);
        } else {
            return [];
        }
    }

    async getWritersInRoom(city: string, street: string, streetNumber: string): Promise<Writer[]> {
        const writerList = await this.localWritersDB.find({
            selector: { city, street, streetNumber },
            fields: ['_id', 'levelOfUrgency', 'firstName', 'lastName', 'profileImage']
        });
        return writerList.docs.map(writer => writer);
    }

    removeBookFromDealer(dealerFullName: string, bookId: string) {
        this.getDealersFullNameAndId()
            .then((dealerList => {
                const dealerId = dealerList.find(dealer => dealer.fullName === dealerFullName)._id;
                this.getDealerById(dealerId)
                    .then(dealer => {
                        const booksArray: string[] = dealer.books;
                        const index = booksArray.indexOf(bookId);
                        if (index > -1) {
                            booksArray.splice(index, 1);
                        }
                        this.localDealersDB.put({ ...dealer, books: booksArray });
                    })
                    .catch(console.error);
            }));
    }

    removeItem(localDbName: LocalDbNames, item: Writer | Book | Dealer) {
        const formatLocalDbName = localDbName.split('_').join('');
        this[formatLocalDbName].remove((item as any));
        this.router.navigate([LocationPath.REMOVE_ITEM]);
    }

}
