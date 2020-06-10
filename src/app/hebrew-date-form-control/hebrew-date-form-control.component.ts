import { Component, Input, ViewChild, OnInit, OnDestroy } from '@angular/core';
import {
  NgbCalendar,
  NgbCalendarHebrew, NgbDate,
  NgbDatepickerI18n,
  NgbDatepickerI18nHebrew,
  NgbDateStruct,
} from '@ng-bootstrap/ng-bootstrap';
import { FormGroup } from '@angular/forms';
import { parseHebrewDateToWords, parseHebrewDateToGregorianDate } from './hebrew-date.utils';
import { Subject, Subscription } from 'rxjs';

@Component({
  selector: 'app-hebrew-date-form-control',
  templateUrl: './hebrew-date-form-control.component.html',
  styleUrls: ['./hebrew-date-form-control.component.css'],
  providers: [
    { provide: NgbCalendar, useClass: NgbCalendarHebrew },
    { provide: NgbDatepickerI18n, useClass: NgbDatepickerI18nHebrew }
  ]
})
export class HebrewDateFormControlComponent implements OnInit, OnDestroy {
  @Input() parentForm: FormGroup;
  model: NgbDateStruct;
  selectedDateSubject = new Subject<NgbDate>();
  onSelectedDateSuscription: Subscription;
  @ViewChild('d', { static: false }) d;

  constructor(private calendar: NgbCalendar, public i18n: NgbDatepickerI18n) { }

  ngOnInit() {
    this.onSelectedDateSuscription = this.selectedDateSubject.subscribe((date: NgbDate) => {
      const gregorianDate = parseHebrewDateToGregorianDate(date, this.calendar);
      const hebrewDateInWords = parseHebrewDateToWords(date, this.i18n);
      this.parentForm.get(['startDate', 'gregorianDate']).setValue(gregorianDate);
      this.parentForm.get(['startDate', 'hebrewDateInWords']).setValue(hebrewDateInWords);
    });
  }

  onDateSelect(date: NgbDate): void {
    this.selectedDateSubject.next(date);
  }

  ngOnDestroy() {
    this.onSelectedDateSuscription.unsubscribe();
  }

}
