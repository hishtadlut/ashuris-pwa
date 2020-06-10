import { NgbDatepickerI18n, NgbDate, NgbCalendar, NgbDateStruct, NgbCalendarHebrew } from '@ng-bootstrap/ng-bootstrap';

export function parseHebrewDateToWords(date: NgbDateStruct, i18n: NgbDatepickerI18n): string {
  return `${i18n.getDayNumerals(date)} ${i18n.getMonthFullName(date.month)} ${i18n.getYearNumerals(date.year)}`;
}

export function parseHebrewDateToGregorianDate(date: NgbDate, calendar: NgbCalendar): NgbDate {
  return (calendar as NgbCalendarHebrew).toGregorian(date);
}

