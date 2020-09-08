import { Injectable } from '@angular/core';

import { Subject, Subscription, Observable } from 'rxjs';
import { Writer, ChangeUrgencyWriter, Dealer } from './interfaces';

import { v4 as uuidv4 } from 'uuid';

import PouchDB from 'pouchdb';
import PouchDBFind from 'pouchdb-find';
import { State } from './reducers';
import { Store, select } from '@ngrx/store';
import { loadWritersList, loadCitiesList, loadCommunitiesList, loadDealerList } from './actions/writers.actions';

@Injectable({
  providedIn: 'root'
})
export class StitchService {

  writersFromDB = new Subject<Writer[]>();
  citiesFromDB = new Subject<{ city: string }[]>();
  communitiesFromDB = new Subject<string[]>();

  localWritersDB = new PouchDB('writersLocal');
  remoteWritersDB = new PouchDB('https://ashuris.online/writers_remote');

  localCommunitiesDB = new PouchDB('communitiesLocal');
  remoteCommunitiesDB = new PouchDB('https://ashuris.online/communities_remote');
  // remoteCommunitiesDB = new PouchDB('http://admin:password@104.154.30.190/communities_remote');

  localCitiesDB = new PouchDB('citiesLocal');
  remoteSitiesDB = new PouchDB('https://ashuris.online/cities_remote');

  localDealersDB = new PouchDB('dealersLocal');
  remoteDealersDB = new PouchDB('https://ashuris.online/dealers_remote');

  urgencyWritersList: ChangeUrgencyWriter[];
  urgencyWritersList$Subscription: Subscription;
  urgencyWritersList$: Observable<ChangeUrgencyWriter[]> = this._store$.pipe(
    select('writers', 'urgencyWritersList')
  );

  // tslint:disable-next-line: variable-name
  constructor(private _store$: Store<State>) {
    this.urgencyWritersList$Subscription = this.urgencyWritersList$.subscribe((writersList) => this.urgencyWritersList = writersList);
    PouchDB.plugin(PouchDBFind);

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
    this.syncDb(this.localCitiesDB, this.remoteSitiesDB, loadCitiesList);
    this.syncDb(this.localDealersDB, this.remoteDealersDB, loadDealerList);
  }

  syncDb(localDb: PouchDB.Database<{}>, remoteDb: PouchDB.Database<{}>, actionToDispatch: any) {
    localDb.sync(remoteDb, { live: true, retry: true })
      .on('change', (change) => {
        this._store$.dispatch(actionToDispatch());
      }).on('error', (err) => {
        console.log(err);
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
            console.log('result ' + communities);
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
      this.localWritersDB.put({
        ...writerClone
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
          console.log(writer.levelOfUrgency);
          writer.levelOfUrgency = writerToChange.levelOfUrgency;
          console.log(writer.levelOfUrgency);
          this.localWritersDB.put(writer).then(_ => {
            resolve();
          });
        });
      });
    });
    // this.localWritersDB.upsert(writerId, (writer: Writer) => {
    //   writer.levelOfUrgency = levelOfUrgency;
    //   return writer;
    // });
  }

  async getCommunities() {
    return await this.localCommunitiesDB.get<{ communities: string[] }>('communities');
  }

  async getSoferReminders(levelOfUrgency: number) {
    return await this.localWritersDB.find({
      selector: { levelOfUrgency },
      fields: ['_id', 'firstName', 'lastName', 'city', 'street', 'profileImage', 'levelOfUrgency'],
    });
  }

  getDealerById(id: string) {
    return this.localDealersDB.get<Dealer>(id);
  }

  getDealers() {
    return this.localDealersDB.allDocs<Dealer>({ include_docs: true })
      .then((result) => {
        return new Promise(resolve => {
          resolve(result.rows.map(row => row.doc));
        });
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

}
