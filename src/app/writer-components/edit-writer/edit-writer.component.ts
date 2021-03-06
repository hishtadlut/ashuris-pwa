import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray, AbstractControl } from '@angular/forms';
import { StitchService } from '../../stitch-service.service';
import { areYouSureYouWantToRemove, blobToBase64 } from '../../utils/utils';
import { GoogleMapsService } from '../../google-maps-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { RecordingService } from '../../recording.service';
import { Writer, Address } from '../../interfaces';
import { Location } from '@angular/common';
import { LocalDbNames, LocationPath, RemoveItem } from 'src/app/enums';
import { AuthService } from 'src/app/auth.service';

@Component({
  selector: 'app-edit-writer',
  templateUrl: './edit-writer.component.html',
  styleUrls: ['./edit-writer.component.css']
})
export class EditWriterComponent implements OnInit {
  locationPath: typeof LocationPath = LocationPath;

  writer: Writer;

  citiesList: string[];

  communitiesList: string[];

  ngForm: FormGroup;
  map: google.maps.Map;
  isRecording = false;
  hasRecord = false;
  dialogFormGroup: FormGroup = null;
  textForSaveButton = 'הוסף סופר למאגר';
  editOrCreatePage: boolean;
  locationWithoutParameters: string;

  constructor(
    private pouchDbService: StitchService,
    private googleMapsService: GoogleMapsService,
    public recordingService: RecordingService,
    public sanitizer: DomSanitizer,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private location: Location,
    private authService: AuthService,
  ) { }

  async ngOnInit() {
    this.ngForm = new FormGroup({
      creationDate: new FormControl(new Date().getTime(), [
        Validators.required,
      ]),
      editDate: new FormControl(new Date().getTime(), [
        Validators.required,
      ]),
      editorUserName: new FormControl(this.authService.getCookieUserName()),
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
      profileImage: new FormControl('', [
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
      lengthOfWritingBook: new FormGroup({
        length: new FormControl('', [
          // Validators.required
        ]),
        note: new FormControl('', [
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
        isPricePerPage: new FormControl('מחיר לעמוד'),
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
        priceForMegilla: new FormGroup({
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
      isWritingRegularly: new FormGroup({
        boolean: new FormControl(false),
      }),
      photos: new FormArray([]),
      photos_620x620: new FormArray([]),
      recordings: new FormArray([]),
    });

    this.locationWithoutParameters = this.location.path().split('?')[0];
    this.editOrCreatePage =
      (this.locationWithoutParameters === LocationPath.EDIT_WRITER) || (this.locationWithoutParameters === LocationPath.CREATE_WRITER);
    if (this.locationWithoutParameters === LocationPath.EDIT_WRITER) {
      const id = this.activatedRoute.snapshot.queryParamMap.get('id');
      this.writer = await this.pouchDbService.getWriter(id);

      const recordingsArray = this.ngForm.controls.recordings as FormArray;
      this.writer.recordings.forEach(recording => recordingsArray.push(new FormControl(recording)));

      const photosArray = this.ngForm.controls.photos as FormArray;
      this.writer.photos?.forEach(photo => photosArray.push(new FormControl(photo)));

      const photos620x620 = this.ngForm.controls.photos_620x620 as FormArray;
      this.writer.photos_620x620?.forEach(photo => photos620x620.push(new FormControl(photo)));

      this.ngForm.patchValue(this.writer);
      this.textForSaveButton = 'שמור שינויים';
    }

    this.pouchDbService.getCities()
      .then(citiesDoc => {
        this.citiesList = citiesDoc.docs.map(cityDoc => cityDoc.itemName);
      });

    this.pouchDbService.getCommunities()
      .then(communitiesDoc => {
        this.communitiesList = communitiesDoc.docs.map(communityDoc => communityDoc.itemName);
      });

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
    blobToBase64(file)
      .then((base64File: string | ArrayBuffer) => {
        this.ngForm.controls.profileImage.setValue(base64File);
      }).catch((err) => {
        console.log(err);
      });
  }

  onAddPhoto(file: File) {
    blobToBase64(file)
      .then((base64File: string) => {
        const photosArray = this.ngForm.controls.photos as FormArray;
        photosArray.push(new FormControl(base64File));
        const photos620x620Array = this.ngForm.controls.photos_620x620 as FormArray;
        photos620x620Array.push(new FormControl(base64File));
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
            const recordingsArray = this.ngForm.controls.recordings as FormArray;
            recordingsArray.push(new FormControl('data:audio/wav;base64' + base64data.split('base64')[1]));
          });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  deleteRecording(index: number) {
    if (areYouSureYouWantToRemove(RemoveItem.recording)) {
      const recordingsArray = this.ngForm.controls.recordings as FormArray;
      recordingsArray.removeAt(index);
    }
  }

  deletePhoto(index: number) {
    if (areYouSureYouWantToRemove(RemoveItem.img)) {
      const photosArray = this.ngForm.controls.photos as FormArray;
      photosArray.removeAt(index);
    }
  }

  isChecked(event, formControl: AbstractControl) {
    if (event.target.value === formControl.value) {
      formControl.setValue('');
    }
  }

  onRemove() {
    if (areYouSureYouWantToRemove(RemoveItem.writer)) {
      this.pouchDbService.removeItem(LocalDbNames.WRITERS, this.writer);
    }
  }

  onSubmit(event) {
    if (this.ngForm.valid) {
      const div = (event.target as HTMLDivElement);
      div.classList.add('mirror-rotate');
      setTimeout(() => {
        div.classList.remove('mirror-rotate');
      }, 2000);
      if (this.locationWithoutParameters === LocationPath.CREATE_WRITER) {
        this.pouchDbService.createWriter({ ...this.ngForm.value });
      } else if (this.locationWithoutParameters === LocationPath.EDIT_WRITER) {
        this.pouchDbService.createWriter({ ...this.writer, ...this.ngForm.value });
      }
      this.router.navigate(['/writers-list-screen']);
    } else {
      alert('יש למלא שם פרטי, שם משפחה ומידת התאמה');
    }
  }

  fillLocation() {
    this.googleMapsService.setAddressThroghGoogleMaps().then((address: Address) => {
      this.ngForm.controls.city.setValue(address.city);
      this.ngForm.controls.street.setValue(address.street);
      this.ngForm.controls.streetNumber.setValue(address.streetNumber);
      this.ngForm.controls.coordinates.setValue(address.coordinates);
    });
  }

  curserToEnd(event) {
    const input = event.target as HTMLInputElement;
    const inputLength = input.value.length;
    input.setSelectionRange(inputLength, inputLength);
  }

  updateEditDate() {
    this.ngForm.controls.editDate.setValue(new Date().getTime());
    this.ngForm.controls.editorUserName.setValue(this.authService.getCookieUserName());
  }

}
