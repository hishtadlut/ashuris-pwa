import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray, AbstractControl } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { State } from '../../reducers';
import { RecordingService } from '../../recording.service';
import { Location } from '@angular/common';
import { fileToBase64 } from '../../utils/utils';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { StitchService } from '../../stitch-service.service';
import { Book } from '../../interfaces';
import { LocationPath } from 'src/app/enums';

@Component({
  selector: 'app-edit-book',
  templateUrl: './edit-book.component.html',
  styleUrls: ['./edit-book.component.css']
})
export class EditBookComponent implements OnInit {
  bookForm: FormGroup;
  dialogFormGroup: FormGroup = null;

  isRecording = false;
  hasRecord: boolean;

  communitiesList: string[];

  parchmentTypes: string[];

  writersFullNameList: string[];
  dealerList: { fullName: string; _id: string; }[];

  book: Book;

  writingTypes = {
    ari: 'אר"י',
    beitYosef: 'בית יוסף',
    welish: 'וועליש',
  };

  textForSaveButton = 'הוסף ספר למאגר';
  dealerId = '';

  constructor(
    public recordingService: RecordingService,
    private store$: Store<State>,
    private location: Location,
    public sanitizer: DomSanitizer,
    private router: Router,
    private pouchDbService: StitchService,
    private activatedRoute: ActivatedRoute
  ) { }

  async ngOnInit(): Promise<void> {
    this.pouchDbService.getParchments()
      .then(citiesDoc => {
        this.parchmentTypes = citiesDoc.docs.map(cityDoc => cityDoc.itemName);
      });

    this.pouchDbService.getCommunities()
      .then(communitiesDoc => {
        this.communitiesList = communitiesDoc.docs.map(communityDoc => communityDoc.itemName);
      });

    this.pouchDbService.getWritersFullName()
      .then((writersFullNameList => {
        this.writersFullNameList = writersFullNameList;
      }));

    this.pouchDbService.getDealersFullNameAndId()
      .then((dealerList => {
        this.dealerList = dealerList;
      }));

    this.bookForm = new FormGroup({
      name: new FormControl('', [
        Validators.required,
      ]),
      writer: new FormControl('', [
        // Validators.required,
      ]),
      dealer: new FormControl('', [
        // Validators.required,
      ]),
      note: new FormControl('', [
        // Validators.required,
      ]),
      isSold: new FormGroup({
        boolean: new FormControl(false, [
          // Validators.required,
        ]),
        note: new FormControl('', [
          // Validators.required,
        ]),
      }),
      endDate: new FormGroup({
        gregorianDate: new FormControl('', [
          // Validators.required,
        ]),
        hebrewDateInWords: new FormControl('', [
          // Validators.required,
        ]),
      }),
      isAppropriate: new FormGroup({
        level: new FormControl('', [
          // Validators.required
        ]),
        note: new FormControl('', [
          // Validators.required,
        ]),
      }),
      writingDeatails: new FormGroup({
        writingLevel: new FormGroup({
          level: new FormControl('', [
            // Validators.required,
          ]),
          note: new FormControl('', [
            // Validators.required,
          ]),
        }),
        stabilityLevel: new FormGroup({
          level: new FormControl('', [
            // Validators.required,
          ]),
          note: new FormControl('', [
            // Validators.required,
          ]),
        }),
        eraseLevel: new FormGroup({
          level: new FormControl('', [
            // Validators.required,
          ]),
          note: new FormControl('', [
            // Validators.required,
          ]),
        }),
        parchmentLevel: new FormGroup({
          level: new FormControl('', [
            // Validators.required,
          ]),
          note: new FormControl('', [
            // Validators.required,
          ]),
        }),
        parchmentType: new FormGroup({
          type: new FormControl('', [
            // Validators.required,
          ]),
          note: new FormControl('', [
            // Validators.required,
          ]),
        }),
        letterSize: new FormGroup({
          size: new FormControl('', [
            // Validators.required,
          ]),
          note: new FormControl('', [
            // Validators.required,
          ]),
        }),
        writingType: new FormControl('', [
          // Validators.required,
        ]),
      }),
      communityDeatails: new FormGroup({
        community: new FormControl('', [
          // Validators.required
        ]),
        note: new FormControl('', [
          // Validators.required,
        ]),
      }),
      pricesDeatails: new FormGroup({
        isPricePerPage: new FormControl('מחיר לעמוד'),
        priceForTorahScroll: new FormGroup({
          price: new FormControl('', [
            // Validators.required
          ]),
          howMuchIsItWorth: new FormControl('', [
            // Validators.required,
          ]),
          negotiation: new FormControl('', [
            // Validators.required,
          ]),
          note: new FormControl('', [
            // Validators.required,
          ]),
        }),
      }),
      additionalDetails: new FormGroup({
        writerLevel: new FormGroup({
          level: new FormControl('', [
            // Validators.required,
          ]),
          note: new FormControl('', [
            // Validators.required,
          ]),
        }),
        hasKtavKabala: new FormGroup({
          boolean: new FormControl('', [
            // Validators.required,
          ]),
          note: new FormControl('', [
            // Validators.required,
          ]),
        }),
        voatsInElection: new FormGroup({
          boolean: new FormControl('', [
            // Validators.required,
          ]),
          note: new FormControl('', [
            // Validators.required,
          ]),
        }),
        goesToKotel: new FormGroup({
          boolean: new FormControl('', [
            // Validators.required,
          ]),
          note: new FormControl('', [
            // Validators.required,
          ]),
        }),
      }),
      photos: new FormArray([]),
      recordings: new FormArray([]),
    });

    if (this.location.path().split('?')[0] === '/edit-book') {
      const id = this.activatedRoute.snapshot.queryParamMap.get('id');
      this.book = await this.pouchDbService.getBookById(id);

      const recordingsArray = this.bookForm.controls.recordings as FormArray;
      this.book.recordings.forEach(recording => recordingsArray.push(new FormControl(recording)));

      const photosArray = this.bookForm.controls.photos as FormArray;
      this.book.photos?.forEach(photo => photosArray.push(new FormControl(photo)));

      this.bookForm.patchValue(this.book);
      this.textForSaveButton = 'שמור שינויים';
    }
  }

  setDealerId(event) {
    this.dealerId = this.dealerList.find(dealer => dealer.fullName === event.target.value)?._id;
  }

  isChecked(event, formControl: AbstractControl) {
    if (event.target.value === formControl.value) {
      formControl.setValue('');
    }
  }

  openDialog(formGroup: FormGroup) {
    this.dialogFormGroup = formGroup;
  }

  closeDialogAndDeleteChanges(noteValueBeforeChanges: string) {
    this.dialogFormGroup.controls.note.setValue(noteValueBeforeChanges);
    this.dialogFormGroup = null;
  }

  closeDialog() {
    this.dialogFormGroup = null;
  }

  HelperAbstractControlToFormGroup(abstractControl): FormGroup {
    return abstractControl as FormGroup;
  }

  onAddPhoto(file: File) {
    fileToBase64(file)
      .then((base64File: string | ArrayBuffer) => {
        const photosArray = this.bookForm.controls.photos as FormArray;
        photosArray.push(new FormControl(base64File));
      }).catch((err) => {
        console.log(err);
      });
  }

  startRecording() {
    this.recordingService.startRecording()
      .then(() => {
        this.isRecording = true;
      })
      .catch(err => {
        console.log(err);
      });
  }

  stopRecording() {
    this.isRecording = false;
    this.hasRecord = true;

    this.recordingService.stopRecording()
      .then((audioBlob: Blob) => {
        this.recordingService.convertRecordingToBase64(audioBlob)
          .then((base64data: string) => {
            const recordingsArray = this.bookForm.controls.recordings as FormArray;
            recordingsArray.push(new FormControl('data:audio/wav;base64' + base64data.split('base64')[1]));
          });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  deletePhoto(index: number) {
    const photosArray = this.bookForm.controls.photos as FormArray;
    photosArray.removeAt(index);
  }

  deleteRecording(index: number) {
    const recordingsArray = this.bookForm.controls.recordings as FormArray;
    recordingsArray.removeAt(index);
  }

  onSubmit() {
    if (this.bookForm.valid) {
      this.pouchDbService.createBook({ ...this.book, ...this.bookForm.value }, this.dealerId);
      this.router.navigate(['/book-list-screen']);
    } else {
      alert('יש למלא שם לספר');
    }

  }

  routeToCreateNewDealer() {
    this.router.navigate([LocationPath.CREATE_DEALER_FOR_BOOK]);
  }

}
