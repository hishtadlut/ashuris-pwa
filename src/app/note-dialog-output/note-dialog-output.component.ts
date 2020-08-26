import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-note-dialog-output',
  templateUrl: './note-dialog-output.component.html',
  styleUrls: ['./note-dialog-output.component.css']
})
export class NoteDialogOutputComponent {
  @Input() content: string;
  @Output() closeDialog = new EventEmitter();
}
