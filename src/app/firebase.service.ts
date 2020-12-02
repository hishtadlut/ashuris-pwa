import { Injectable } from '@angular/core';
import PouchDB from 'pouchdb';
import firebase from 'firebase/app';
import { LocalDbNames } from './enums';
require('firebase/auth');
require('firebase/storage');

import { v4 as uuidv4 } from 'uuid';
import { base64ToBlob, blobToObjectUrl } from './utils/utils';

interface ImgDocument {
  _id: string;
  img: Blob;
  folderName: string;
  fileName: string;
  extension: string;
  imgUrl: string;
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
    appId: '1:480714379352:web:17f50e7faf212f650a3a2d',
  };

  firebaseRef = firebase.initializeApp(this.firebaseConfig);
  constructor() {
    this.uploadeImagesToFirebase();
    setInterval(() => {
      this.uploadeImagesToFirebase();
    }, 30000);
    this.firebaseRef.storage().setMaxOperationRetryTime(30000);
    this.firebaseRef.storage().setMaxUploadRetryTime(30000);
  }

  async addImagesToQueueOfUploades(img: Blob, folderName: string, extension: string) {
    const fileName = uuidv4();
    const imgUrl = this.getUrlOfImage(folderName, fileName, extension);
    this.imagesToUploadDB.put({
      _id: uuidv4(),
      img,
      folderName,
      fileName,
      extension,
      imgUrl
    });
    return imgUrl;
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
        console.log(documents.rows);
        documents.rows.forEach(document => {
          console.log('Uploade started');
          this.uploadeImgToFirebase(document.doc.img, document.doc.folderName, document.doc.fileName, document.doc.extension)
            .then((uploadTask) => {
              const onResolve = (foundURL: string) => {
                console.log('Uploade complete ' + foundURL);
                this.removeImagesFromQueueOfUploades(document.doc._id);
              };
              const onReject = (error: any) => {
                console.log('uploadTask.task.cancel()');
                console.log(error);
              };

              this.firebaseRef
                .storage()
                .ref()
                .child(`${document.doc.folderName}/${document.doc.fileName}.${document.doc.extension}`)
                .getDownloadURL()
                .then(onResolve, onReject);

            })
            .catch(err => {
              console.log(err);
            });
        });
      })
      .catch(console.log);
  }

  uploadeImgToFirebase(blob: Blob, folderName: string, filename: string, extension: string) {
    const MIME_TYPE = extension === 'jpg' ? 'image/jpeg' : 'audio/wav';
    const imgPath = `${folderName}/${filename}.${extension}`;
    const storageRef = this.firebaseRef.storage().ref(imgPath);
    const uploadTask = storageRef.put(blob, { contentType: MIME_TYPE });
    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
      (snapshot) => {
        console.log((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
      });
    return uploadTask;
  }

  getUrlOfImage(folderName: string, fileName: string, extension: string) {
    return `https://firebasestorage.googleapis.com/v0/b/ashuris.appspot.com/o/${folderName}%2F${fileName}.${extension}?alt=media`;
  }

  async getImageFromQueue(idUrl: string) {
    const allDocs = (await this.imagesToUploadDB.allDocs<ImgDocument>({ include_docs: true })).rows.map(doc => doc.doc);
    const img = allDocs.find(doc => doc.imgUrl === idUrl);
    return img;
  }

  async getFromAvailableResources(urls: string[]): Promise<string[]> {
    return urls = await Promise.all(urls.map(async (url) => {
      try {
        const base64 = blobToObjectUrl(await base64ToBlob(url));
        return base64;
      } catch (error) {
        try {
          if (url.includes('jpg')) {
            url = url.replace('_620x620', '');
          }
          const img = await this.getImageFromQueue(url);
          if (img) {
            return blobToObjectUrl(img.img);
          }
          console.log('Can\'t find img');
          return '';
        } catch (err) {
          console.log(err);
          return '';
        }
      }
    }));
  }
}

