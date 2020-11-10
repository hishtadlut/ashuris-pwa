import { Injectable } from '@angular/core';
import { SafeResourceUrl } from '@angular/platform-browser';

@Injectable({ providedIn: 'root' })
export class RecordingService {
  lastRecording: SafeResourceUrl;
  mediaRecorder: MediaRecorder;
  audioChunks = [];

  constructor() { }

  async startRecording() {
    await navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        this.mediaRecorder = new MediaRecorder(stream);
        this.mediaRecorder.addEventListener('dataavailable', event => {
          this.audioChunks.push(event.data);
        });
        this.mediaRecorder.start();
      });
  }

  stopRecording() {
    return new Promise(resolve => {
      this.mediaRecorder.addEventListener('stop', () => {
        resolve(new Blob(this.audioChunks));
        this.audioChunks = [];
      });
      this.mediaRecorder.stop();
    });
  }

  convertRecordingToBase64(audioBlob: Blob) {
    return new Promise(resolve => {
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      reader.onloadend = () => {
        resolve(reader.result);
      };
    });
  }

  convertBase64ToAudio(audioBlob: Blob): Promise<HTMLAudioElement> {
    return new Promise(resolve => {
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      resolve(audio);
    });
  }
}
