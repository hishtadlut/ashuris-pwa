import { Component, Input } from '@angular/core';
import { SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-audio-html5',
  templateUrl: './audio-html5.component.html',
  styleUrls: ['./audio-html5.component.css']
})
export class AudioHTML5Component {
  @Input() src: SafeResourceUrl;
}
