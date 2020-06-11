import { Injectable } from '@angular/core';
import {
  Stitch,
  RemoteMongoClient,
  AnonymousCredential,
  RemoteMongoDatabase,
  StitchAppClient,
  StitchUser,
  RemoteInsertOneResult,
  RemoteMongoCollection,
  RemoteUpdateResult,
} from 'mongodb-stitch-browser-sdk';
import { Subject } from 'rxjs';
import { Writer } from './interfaces';

@Injectable({
  providedIn: 'root'
})
export class StitchService {

  db: RemoteMongoDatabase;
  client: StitchAppClient;
  writersFromDB = new Subject<Writer[]>();
  citiesFromDB = new Subject<{ city: string }[]>();
  writersCollection: RemoteMongoCollection<any>;
  citiesCollection: RemoteMongoCollection<any>;

  constructor() { }

  login() {
    this.client = Stitch.initializeDefaultAppClient('ashuris-naqyn');

    this.db = this.client.getServiceClient(RemoteMongoClient.factory, 'mongodb-atlas').db('ashuris');
    this.writersCollection = this.db.collection('writers');
    this.citiesCollection = this.db.collection('cities');
    this.client.auth.loginWithCredential(new AnonymousCredential())
      .then((user: StitchUser) => console.log(user.id));
  }
  // .then(() =>
  //   this.db.collection('<COLLECTION>').find({ owner_id: this.client.auth.user.id }, { limit: 100 }).asArray()
  // ).then(docs => {
  //   console.log("Found docs", docs)
  //   console.log("[MongoDB Stitch] Connected to Stitch")
  // }).catch(err => {
  //   console.error(err);
  // });

  createWriter(writer: Writer) {
    this.citiesCollection.updateOne({ city: writer.city }, { $set: { city: writer.city } }, { upsert: true })
    .then((result: RemoteUpdateResult) => {
      console.log(result);
      this.getCities();
    }).catch((err) => {
      console.log(err);
    });
    return this.writersCollection.insertOne(writer)
      .then((result: RemoteInsertOneResult) => {
        console.log(result.insertedId);
      }).catch((err) => {
        console.log(err);
      });

    // .updateOne({ owner_id: this.client.auth.user.id }, { $set: { number: 42 } }, { upsert: true });
  }

  getWriters() {
    const options = { // Match the shape of RemoteFindOptions.
      // limit: 10,      // Return only first ten results.
      // projection: {   // Return only the `title`, `releaseDate`, and
      //   firstName: 1,     //   (implicitly) the `_id` fields.
      //   lastName: 1,
      //   telephone: 1,
      // },
      sort: { // Sort by releaseDate descending (latest first).
        firstName: -1,
      },
    };
    this.db.collection('writers').find({}, options).toArray()
      .then((writers: Writer[]) => this.writersFromDB.next(writers))
      .catch(console.error);
  }

  getCities() {
    this.db.collection('cities').find({}).toArray()
      .then((cities: { city: string }[]) => this.citiesFromDB.next(cities))
      .catch(console.error);
  }

}
