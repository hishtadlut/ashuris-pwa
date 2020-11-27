import { Injectable } from '@angular/core';
import PouchDB from 'pouchdb';
import firebase from 'firebase/app';
import { LocalDbNames } from './enums';
require('firebase/auth');
require('firebase/storage');

import { v4 as uuidv4 } from 'uuid';

interface ImgDocument {
  _id: string;
  img: Blob;
  folderName: string;
  fileName: string;
  _deleted?: boolean;
}
@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  imagesToUploadDB = new PouchDB<ImgDocument>(LocalDbNames.IMAGES_TO_UPLOAD_DB, { revs_limit: 1, auto_compaction: true });

  firebaseConfig = {
    apiKey: 'AIzaSyAhHbU3IToJtQtVgCi8QTC5uTVkMhp9-DU',
    authDomain: 'ashuris.firebaseapp.com',
    databaseURL: 'https://ashuris.firebaseio.com',
    projectId: 'ashuris',
    storageBucket: 'ashuris.appspot.com',
    messagingSenderId: '480714379352',
    appId: '1:480714379352:web:17f50e7faf212f650a3a2d'
  };

  firebaseRef = firebase.initializeApp(this.firebaseConfig);
  constructor() {
    this.uploadeImagesToFirebase();
    setInterval(() => {
      this.uploadeImagesToFirebase();
    }, 60000);
  }

  addImagesToQueueOfUploades(img: Blob, folderName: string) {
    const fileName = uuidv4();
    this.imagesToUploadDB.put({
      _id: this.getUrlOfImage(folderName, fileName),
      img,
      folderName,
      fileName,
    });
    return this.getUrlOfImage(folderName, fileName);
  }

  async removeImagesFromQueueOfUploades(id: string) {
    const documentToRemove = await this.imagesToUploadDB.get(id);
    documentToRemove._deleted = true;
    documentToRemove.img = new Blob();

    this.imagesToUploadDB.put(documentToRemove);
  }

  uploadeImagesToFirebase() {
    this.imagesToUploadDB.allDocs<ImgDocument>({ include_docs: true })
      .then(documents => {
        documents.rows.forEach(document => {
          this.uploadeImgToFirebase(document.doc.img, document.doc.folderName, document.doc.fileName)
            .then(() => {
              this.removeImagesFromQueueOfUploades(document.doc._id);
            });
        });
      })
      .catch(console.error);
  }

  uploadeImgToFirebase(img: Blob, folderName: string, filename: string) {
    const imgPath = `images/${folderName}/${filename}`;
    const storageRef = this.firebaseRef.storage().ref(imgPath);
    return storageRef.put(img);
  }

  getUrlOfImage(folderName: string, fileName: string) {
    return `https://firebasestorage.googleapis.com/v0/b/ashuris.appspot.com/o/images%2F${folderName}%2F${fileName}?alt=media`;
  }

  getImageFromQueue(idUrl: string) {
    return this.imagesToUploadDB.get(idUrl);
  }
}
