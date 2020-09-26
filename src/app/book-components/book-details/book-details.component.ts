import { Component, OnInit, OnDestroy } from '@angular/core';
import { Book } from 'src/app/interfaces';
import { State } from '../../reducers';
import { DomSanitizer } from '@angular/platform-browser';
import { Store, select } from '@ngrx/store';
import { Subscription, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { preventDefaultAndStopPropagation } from 'src/app/utils/utils';

@Component({
  selector: 'app-book-details',
  templateUrl: './book-details.component.html',
  styleUrls: ['./book-details.component.css']
})
export class BookDetailsComponent implements OnInit, OnDestroy {
  book: Book;
  book$Subscription: Subscription;
  book$: Observable<any> = this.store$.pipe(
    select('writers', 'book')
  );

  openMenuStatus = {
    pricesDeatails: false,
    writingDeatails: false,
    additionalDeatails: false,
    images: false,
    recordings: false,
  };

  dialogContent = null;
  priceForTorahScroll: { pricePerPage: number, priceForScroll: number };
  preventDefaultAndStopPropagation = preventDefaultAndStopPropagation;
  constructor(
    public sanitizer: DomSanitizer,
    private store$: Store<State>,
    private router: Router,

  ) { }

  ngOnInit(): void {
    this.book$Subscription = this.book$.subscribe((book: Book) => {
      this.book = book;
      if (this.book?.pricesDeatails?.priceForTorahScroll.price) {
        this.priceForTorahScroll = {
          pricePerPage: this.book.pricesDeatails.isPricePerPage !== 'מחיר לספר תורה'
            ? this.book.pricesDeatails.priceForTorahScroll.price
            : Math.round((this.book.pricesDeatails.priceForTorahScroll.price - 8700) / 245),
          priceForScroll: this.book.pricesDeatails.isPricePerPage !== 'מחיר לספר תורה'
            ? Math.round((this.book.pricesDeatails.priceForTorahScroll.price * 245) + 8700)
            : this.book.pricesDeatails.priceForTorahScroll.price,
        };
      }
    });
  }

  openDialog(event: Event, content: string) {
    preventDefaultAndStopPropagation(event)
    this.dialogContent = content;
  }

  closeDialog() {
    this.dialogContent = null;
  }

  editBook() {
    this.router.navigate(['/edit-book']);
  }

  closeMenus(menuToOpen: string) {
    const menuToOpenStatus = this.openMenuStatus[menuToOpen];

    this.openMenuStatus = {
      pricesDeatails: false,
      writingDeatails: false,
      additionalDeatails: false,
      images: false,
      recordings: false,
    };

    this.openMenuStatus[menuToOpen] = !menuToOpenStatus;
  }

  ngOnDestroy() {
    this.book$Subscription.unsubscribe();
  }

}

export class WriterDetailsComponent {



}
