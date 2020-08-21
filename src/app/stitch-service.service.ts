import { Injectable } from '@angular/core';

import { Subject } from 'rxjs';
import { Writer } from './interfaces';

import { v4 as uuidv4 } from 'uuid';

//PouchDB
import PouchDB from 'pouchdb';
import PouchDBFind from 'pouchdb-find';
import { State } from './reducers';
import { Store } from '@ngrx/store';
import { loadWritersList } from './actions/writers.actions';

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

  constructor(private _store$: Store<State>) {
    PouchDB.plugin(PouchDBFind);
    const options = {
      live: true,
      retry: true,
      continuous: true,
    }
    this.localWritersDB.sync(this.remoteWritersDB, options)
      .on('change', (change) => {
        console.log(change);
        if (change.direction === "pull") {
          this._store$.dispatch(loadWritersList())
        }
      }).on('error', (err) => {
        console.log(err);
      });
    this.localCommunitiesDB.sync(this.remoteCommunitiesDB, options)
      .on('change', (change) => {
        console.log(change);
      }).on('error', (err) => {
        console.log(err);
      });
    this.localCitiesDB.sync(this.remoteSitiesDB, options)
      .on('change', (change) => {
        console.log(change);
      }).on('error', (err) => {
        console.log(err);
      });
  }

  createWriter(writer: Writer) {
    this.localCitiesDB.allDocs({ include_docs: true })
      .then(result => {
        !result.rows.some((document: any) => document.doc.city === writer.city) && this.localCitiesDB.put({ city: writer.city, _id: new Date().getMilliseconds().toString() });
      })
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

    // some strange bag fix TODO  
    // writer.coordinates = JSON.parse(JSON.stringify(writer.coordinates));
    if (writer._id) {
      this.localWritersDB.put({
        ...JSON.parse(JSON.stringify(writer))
      })
    } else {
      this.localWritersDB.put({
        // add unike id
        _id: uuidv4(),
        ...JSON.parse(JSON.stringify(writer))
      })
        .then(result => {
          console.log(result);
        })
        .catch(console.error)
    }
  }

  getWriters(): Promise<Writer[]> {
    return this.localWritersDB.allDocs<Writer>({ include_docs: true })
      .then((result) => {
        return new Promise(resolve => {
          resolve(result.rows.map(row => row.doc));
        })
      });
  }

  getWriter(id: string): Promise<Writer> {
    return new Promise(resolve => {
      resolve(this.localWritersDB.get(id));
    })
  }

  getCities() {
    this.localCitiesDB.allDocs<{ city: string }>({ include_docs: true })
      .then(result => {
        const cities = result.rows.map(row => row.doc);
        this.citiesFromDB.next(cities)
      })
  }

  getCommunities() {
    this.localCommunitiesDB.get<{ communities: string[] }>('communities')
      .then(communities => {
        return this.communitiesFromDB.next(communities.communities)
      })
  }

}
