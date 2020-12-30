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
    }

    syncWritersDBS() {
        return this.syncDb(this.localWritersDB, this.remoteWritersDB, loadWritersList);
    }

    syncDealersDBS() {
        return this.syncDb(this.localDealersDB, this.remoteDealersDB, loadDealerList);
    }

    syncBooksDBS() {
        return this.syncDb(this.localBooksDB, this.remoteBooksDB, loadBookList);
    }

    syncGeneralDBS() {
        return this.syncDb(this.localGeneralDB, this.remoteGeneralDB);
    }

    async syncAllDBS() {
        while (true) {
            try {
                await this.syncWritersDBS();
                await this.syncBooksDBS();
                await this.syncDealersDBS();
                await this.syncGeneralDBS();
                await this.firebaseService.uploadeImagesToFirebase();
                await new Promise(resolve => setTimeout(resolve, 60000));
            } catch (error) {
                console.log(error);
                await new Promise(resolve => setTimeout(resolve, 60000));
            }
        }
    }

    syncDb(localDb: PouchDB.Database<{}>, remoteDb: PouchDB.Database<{}>, actionToDispatch?: any) {
        let syncHandler: PouchDB.Replication.Sync<{}>;

        const removeListeners = async (DBS: PouchDB.Replication.Sync<{}>) => {
            DBS.cancel();
            await DBS.removeAllListeners();
        };

        const stopSync = async (DBS: PouchDB.Replication.Sync<{}>) => {
            try {
                await removeListeners(DBS);
                console.log('sync stopped ' + localDb.name);
            } catch (error) {
                console.log(error);
            }
        };
        const startSync = () => {
            return new Promise<void>((resolve, reject) => {
                remoteDb.logIn('aaf', 'Aaf0583215251')
                    .then((user) => {
                        syncHandler = localDb.sync(remoteDb, { timeout: 60000 });
                        syncHandler.on('change', (change) => {
                            console.log(localDb.name);
                            console.log(change);
                        });
                        syncHandler.on('error', async (err) => {
                            console.log(err);
                            console.log('sync err stopped ' + localDb.name);
                            await stopSync(syncHandler);
                            reject();
                        });
                        syncHandler.on('active', () => {
                            console.log('active');
                        });
                        syncHandler.on('complete', async () => {
                            console.log('sync complete ' + localDb.name);
                            if (actionToDispatch) {
                                this.store$.dispatch(actionToDispatch());
                            }
                            await stopSync(syncHandler);
                            resolve();
                        });
                    })
                    .catch(async error => {
                        console.log(error);
                        console.log('sync log in err stopped');
                        reject();
                    });
            });

        };

        return startSync();
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
            fields: ['_id', 'name', 'levelOfUrgency', 'writingDeatails', 'editDate'],
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
                await this.removeBookFromDealer(oldBook.dealer, bookClone._id);
            }
            if (dealerId) {
                await this.addBookToDealer(putResult.id, dealerId);
            }
        } else {
            bookClone._id = uuidv4();
            bookClone.photos = await this.uploadeBase64andReplaceWithStorageUrls(bookClone.photos, bookClone.name, bookClone._id, 'jpg');
            bookClone.photos_620x620 = bookClone.photos.map(photoUrl => photoUrl.replace('.jpg', '_620x620.jpg'));
            bookClone.recordings = await this.uploadeBase64andReplaceWithStorageUrls(bookClone.recordings, bookClone.name, bookClone._id, 'wav');
            const putResult = await this.localBooksDB.put({ ...bookClone });
            await this.addBookToDealer(putResult.id, dealerId);
        }
    }

    async addBookToDealer(bookId: string, dealerId: string) {
        try {
            const dealer = await this.localDealersDB.get(dealerId);
            let bookArray = dealer.books ? dealer.books : [];
            bookArray.push(bookId);
            bookArray = [...new Set(Object.values(bookArray))];
            await this.localDealersDB.put({ ...dealer, books: bookArray });
        } catch (err) {
            console.log(err);
        }
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
                    fields: ['_id', 'levelOfUrgency', 'name', 'writingDeatails', 'isSold'],
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

    async removeBookFromDealer(dealerFullName: string, bookId: string) {
        try {
            const dealerList = await this.getDealersFullNameAndId();
            const dealerId = dealerList.find(dealer => dealer.fullName === dealerFullName)?._id;
            const dealer = await this.getDealerById(dealerId);
            const booksArray: string[] = dealer.books;
            const index = booksArray.indexOf(bookId);
            if (index > -1) {
                booksArray.splice(index, 1);
            }
            return this.localDealersDB.put({ ...dealer, books: booksArray });
        } catch (error) {
            console.log(error);
        }
    }

    removeItem(localDbName: LocalDbNames, item: Writer | Book | Dealer) {
        const formatLocalDbName = localDbName.split('_').join('');
        this[formatLocalDbName].remove((item as any));
        this.router.navigate([LocationPath.REMOVE_ITEM]);
    }

}
