import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray, AbstractControl } from '@angular/forms';
import { StitchService } from '../stitch-service.service';
import { Subscription, Observable } from 'rxjs';
import { fileToBase64 } from '../utils/utils';
import { GoogleMapsService } from '../google-maps-service.service';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { RecordingService } from '../recording.service';
import { Store, select } from '@ngrx/store';
import { State } from '../reducers';
import { Writer, Address } from '../interfaces';
import { editWriter, loadWritersList } from '../actions/writers.actions';
import { Location } from '@angular/common';

@Component({
  selector: 'app-edit-writer',
  templateUrl: './edit-writer.component.html',
  styleUrls: ['./edit-writer.component.css']
})
export class EditWriterComponent implements OnInit, OnDestroy {
  editMode: boolean;
  editMode$Subscription: Subscription;
  editMode$: Observable<any> = this.store$.pipe(
    select('writers', 'editMode')
  );

  writer: Writer;
  writer$Subscription: Subscription;
  writer$: Observable<any> = this.store$.pipe(
    select('writers', 'writer')
  );

  citiesFromDB: string[];
  citiesList$Subscription: Subscription;
  citiesList$: Observable<any> = this.store$.pipe(
    select('writers', 'citiesList')
  );

  communitiesFromDB: string[];
  communitiesList$Subscription: Subscription;
  communitiesList$: Observable<any> = this.store$.pipe(
    select('writers', 'communitiesList')
  );

  writerForm: FormGroup;
  map: google.maps.Map;
  isRecording = false;
  hasRecord = false;
  dialogFormGroup: FormGroup = null;
  textForSaveButton = 'הוסף סופר למאגר';

  constructor(
    private stitchService: StitchService,
    private googleMapsService: GoogleMapsService,
    public recordingService: RecordingService,
    public sanitizer: DomSanitizer,
    private store$: Store<State>,
    private router: Router,
    private location: Location,
  ) { }

  ngOnInit() {
    this.writerForm = new FormGroup({
      note: new FormControl('', [
        // Validators.required,
      ]),
      firstName: new FormControl('', [
        Validators.required,
      ]),
      lastName: new FormControl('', [
        Validators.required,
      ]),
      telephone: new FormControl('', [
        // Validators.required,
        // Validators.pattern('^[0-9]*$'),
        // Validators.minLength(9),
      ]),
      secondTelephone: new FormControl('', [
        // Validators.required,
        // Validators.pattern('^[0-9]*$'),
        // Validators.minLength(9),
      ]),
      email: new FormControl('', [
        // Validators.required,
        // Validators.email,
      ]),
      city: new FormControl('', [
        // Validators.required,
      ]),
      street: new FormControl('', [
        // Validators.required,
      ]),
      coordinates: new FormControl(),
      streetNumber: new FormControl('', [
        // Validators.required,
      ]),
      apartmentNumber: new FormControl('', [
        // Validators.required,
      ]),
      profileImage: new FormControl('assets/icons/Symbol 216 – 5.png', [
        // Validators.required,
      ]),
      startDate: new FormGroup({
        gregorianDate: new FormControl('', [
          // Validators.required,
        ]),
        hebrewDateInWords: new FormControl('', [
          // Validators.required,
        ]),
      }),
      isAppropriate: new FormGroup({
        level: new FormControl('', [
          Validators.required
        ]),
        note: new FormControl('', [
          // Validators.required,
        ]),
      }),
      pricesDeatails: new FormGroup({
        isPricePerPage: new FormControl('בחר עמוד או ס"ת'),
        priceForTorahScroll: new FormGroup({
          price: new FormControl('', [
            // Validators.required
          ]),
          worthIt: new FormControl('', [
            // Validators.required,
          ]),
          note: new FormControl('', [
            // Validators.required,
          ]),
        }),
        priceForMezuzah: new FormGroup({
          price: new FormControl('', [
            // Validators.required
          ]),
          worthIt: new FormControl('', [
            // Validators.required,
          ]),
          note: new FormControl('', [
            // Validators.required,
          ]),
        }),
        priceForTefillin: new FormGroup({
          price: new FormControl('', [
            // Validators.required
          ]),
          worthIt: new FormControl('', [
            // Validators.required,
          ]),
          note: new FormControl('', [
            // Validators.required,
          ]),
        }),
      }),
      writingDeatails: new FormGroup({
        letterSizes: new FormGroup({
          17: new FormControl(false, [
            // Validators.required,
          ]),
          24: new FormControl(false, [
            // Validators.required,
          ]),
          30: new FormControl(false, [
            // Validators.required,
          ]),
          36: new FormControl(false, [
            // Validators.required,
          ]),
          40: new FormControl(false, [
            // Validators.required,
          ]),
          42: new FormControl(false, [
            // Validators.required,
          ]),
          45: new FormControl(false, [
            // Validators.required,
          ]),
          48: new FormControl(false, [
            // Validators.required,
          ]),
          note: new FormControl('', [
            // Validators.required,
          ]),
        }),
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
        writingTypes: new FormGroup({
          types: new FormGroup({
            ari: new FormControl(false, [
              // Validators.required,
            ]),
            beitYosef: new FormControl(false, [
              // Validators.required,
            ]),
            Welish: new FormControl(false, [
              // Validators.required,
            ]),
          }),
          note: new FormControl('', [
            // Validators.required,
          ]),
        }),
      }),
      communityDeatails: new FormGroup({
        community: new FormControl('', [
          // Validators.required
        ]),
        note: new FormControl('', [
          // Validators.required,
        ]),
      }),
      placeOfWriting: new FormGroup({
        place: new FormControl('', [
          // Validators.required,
        ]),
        note: new FormControl('', [
          // Validators.required,
        ]),
      }),
      additionalDetails: new FormGroup({
        hasWritenBefore: new FormGroup({
          boolean: new FormControl('', [
            // Validators.required,
          ]),
          note: new FormControl('', [
            // Validators.required,
          ]),
        }),
        hasWritenKabala: new FormGroup({
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
        beginnerWriter: new FormGroup({
          boolean: new FormControl('', [
            // Validators.required,
          ]),
          note: new FormControl('', [
            // Validators.required,
          ]),
        }),
        writerLevel: new FormGroup({
          level: new FormControl('', [
            // Validators.required,
          ]),
          note: new FormControl('', [
            // Validators.required,
          ]),
        }),
      }),
      isWritingRegularly: new FormControl(false),
      photos: new FormArray([]),
      recordings: new FormArray([]),
    });

    this.editMode$Subscription = this.editMode$.subscribe((editMode: boolean) => {
      this.editMode = editMode;

      if (editMode && this.location.path() === '/edit-writer') {
        this.writer$Subscription = this.writer$.subscribe((writer: Writer) => {
          this.writer = writer;

          const recordingsArray = this.writerForm.controls.recordings as FormArray;
          writer.recordings.forEach(recording => recordingsArray.push(new FormControl(recording)));

          const photosArray = this.writerForm.controls.photos as FormArray;
          writer.photos?.forEach(photo => photosArray.push(new FormControl(photo)));

          this.writerForm.patchValue(writer);
        });
        this.textForSaveButton = 'שמור שינויים';
        this.store$.dispatch(editWriter({ editMode: false }));
      } else if (this.location.path() === '/edit-writer' && this.textForSaveButton !== 'שמור שינויים') {
        this.googleMapsService.setAddressThroghGoogleMaps().then((address: Address) => {
          this.writerForm.controls.city.setValue(address.city);
          this.writerForm.controls.street.setValue(address.street);
          this.writerForm.controls.streetNumber.setValue(address.streetNumber);
          this.writerForm.controls.coordinates.setValue(address.coordinates);
        });
      }
    });

    this.citiesList$Subscription = this.citiesList$.subscribe(
      (cities) => this.citiesFromDB = cities
    );

    this.communitiesList$Subscription = this.communitiesList$.subscribe(
      (communities) => this.communitiesFromDB = communities
    );
  }

  openDialog(formGroup: FormGroup) {
    this.dialogFormGroup = formGroup;
  }

  closeDialogAndDeleteChanges(noteValueBeforeChanges: string) {
    this.dialogFormGroup.controls.note.setValue(noteValueBeforeChanges);
    this.dialogFormGroup = null;
  }

  HelperAbstractControlToFormGroup(abstractControl): FormGroup {
    return abstractControl as FormGroup;
  }

  closeDialog() {
    this.dialogFormGroup = null;
  }

  onAddProfileImage(file: File) {
    fileToBase64(file)
      .then((base64File: string | ArrayBuffer) => {
        this.writerForm.controls.profileImage.setValue(base64File);
      }).catch((err) => {
        console.log(err);
      });
  }

  onAddPhoto(file: File) {
    fileToBase64(file)
      .then((base64File: string | ArrayBuffer) => {
        const photosArray = this.writerForm.controls.photos as FormArray;
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
            // const audioUrl = URL.createObjectURL(base64data);
            // const audio = new Audio('data:audio/wav;base64' + base64data.split('base64')[1]);
            const recordingsArray = this.writerForm.controls.recordings as FormArray;
            // console.log('data:audio/wav;base64' + base64data.split('base64')[1]);
            // audio.play();

            recordingsArray.push(new FormControl('data:audio/wav;base64' + base64data.split('base64')[1]));
          });

        // this.recordingService.convertBase64ToBypassSecurityTrustAudioUrl(audioBlob)
        //   .then((audioUrl: string) => {
        //     this.recordingService.lastRecording = ;
        //   });

      })
      .catch((err) => {
        console.log(err);
      });
  }

  deleteRecording(index: number) {
    const recordingsArray = this.writerForm.controls.recordings as FormArray;
    recordingsArray.removeAt(index);
  }

  deletePhoto(index: number) {
    const photosArray = this.writerForm.controls.photos as FormArray;
    photosArray.removeAt(index);
  }
  // playRecord() {
  //   this.record.play();
  // }

  isChecked(event, formControl: AbstractControl) {
    if (event.target.value === formControl.value) {
      formControl.setValue('');
    }
  }

  onSubmit() {
    this.stitchService.createWriter({ ...this.writer, ...this.writerForm.value });
    this.store$.dispatch(loadWritersList());
    this.router.navigate(['/writers-list-screen']);
  }

  ngOnDestroy() {
    if (this.editMode && this.location.path() === '/edit-writer') {
      this.writer$Subscription.unsubscribe();
    }
    this.editMode$Subscription.unsubscribe();
    this.citiesList$Subscription.unsubscribe();
    this.communitiesList$Subscription.unsubscribe();
  }
}
