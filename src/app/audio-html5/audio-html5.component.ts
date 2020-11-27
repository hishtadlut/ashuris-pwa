import { AfterViewInit, Component, Input } from '@angular/core';
import { RecordingService } from '../recording.service';
import { base64ToBlob, getDuration } from '../utils/utils';
@Component({
  selector: 'app-audio-html5',
  templateUrl: './audio-html5.component.html',
  styleUrls: ['./audio-html5.component.css']
})
export class AudioHTML5Component implements AfterViewInit {
  @Input() recordingUrl: string;
  recordingState: {
    audio: HTMLAudioElement,
    isListening: boolean,
    duration: number,
    currentTime: number,
  };
  constructor(public recordingService: RecordingService) {
  }

  ngAfterViewInit() {
    const audio = new Audio(this.recordingUrl);
    getDuration(audio)
      .then((duration) => {
        this.recordingState = {
          audio,
          isListening: false,
          duration: Math.floor(duration),
          currentTime: 0
        };
        audio.addEventListener('ended', () => {
          this.recordingState.isListening = false;
          audio.load();
        });
        audio.addEventListener('timeupdate', () => {
          this.recordingState.currentTime = Math.floor(audio.currentTime);
        });
      });
  }

  playRecording() {
    if (this.recordingState.isListening) {
      this.recordingState.isListening = false;
      this.recordingState.audio.load();
    } else {
      this.recordingState.isListening = true;
      this.recordingState.audio.play();
    }
  }
}
