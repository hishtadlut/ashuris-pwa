import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-note-dialog',
  templateUrl: './note-dialog.component.html',
  styleUrls: ['./note-dialog.component.css']
})
export class NoteDialogComponent implements OnInit {
  @Input() formGroup: FormGroup;
  @Output() closeDialog = new EventEmitter();
  @Output() closeDialogAndDeleteChanges = new EventEmitter<string>();
  noteValueBeforeChanges: string;

  ngOnInit(): void {
    this.noteValueBeforeChanges = this.formGroup.controls.note.value;
  }


}
