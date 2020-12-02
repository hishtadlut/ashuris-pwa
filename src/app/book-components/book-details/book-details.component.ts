import { Component, OnInit } from '@angular/core';
import { Book } from 'src/app/interfaces';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { preventDefaultAndStopPropagation, shareButton } from 'src/app/utils/utils';
import { StitchService } from 'src/app/stitch-service.service';
import { FirebaseService } from 'src/app/firebase.service';

@Component({
  selector: 'app-book-details',
  templateUrl: './book-details.component.html',
  styleUrls: ['./book-details.component.css']
})
export class BookDetailsComponent implements OnInit {
  book: Book;
  shareButton = shareButton;

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
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private pouchDbService: StitchService,
    private firebaseService: FirebaseService,
  ) { }

  ngOnInit() {
    const id = this.activatedRoute.snapshot.queryParamMap.get('id');
    this.pouchDbService.getBookById(id).then(async book => {
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
      this.book.photos_620x620 = await this.firebaseService.getFromAvailableResources(this.book.photos_620x620);
      this.book.recordings = await this.firebaseService.getFromAvailableResources(this.book.recordings);
    });
  }

  openDialog(event: Event, content: string) {
    preventDefaultAndStopPropagation(event);
    this.dialogContent = content;
  }

  closeDialog() {
    this.dialogContent = null;
  }

  editBook() {
    this.router.navigate(['/edit-book'], { queryParams: { id: this.book._id } });
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

  playRecording(index) {
    const audio = new Audio(this.book.recordings[index]);
    audio.load();
    audio.play();
  }

  errorEventCall(idUrl: string, index: number) {
    this.book.photos_620x620[index] = '';
  }

}
