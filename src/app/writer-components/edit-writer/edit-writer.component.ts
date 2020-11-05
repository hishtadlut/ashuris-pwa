import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray, AbstractControl } from '@angular/forms';
import { StitchService } from '../../stitch-service.service';
import { areYouSureYouWantToRemove, fileToBase64 } from '../../utils/utils';
import { GoogleMapsService } from '../../google-maps-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { RecordingService } from '../../recording.service';
import { Store } from '@ngrx/store';
import { State } from '../../reducers';
import { Writer, Address } from '../../interfaces';
import { loadWritersList } from '../../actions/writers.actions';
import { Location } from '@angular/common';
import { LocationPath, RemoveItem } from 'src/app/enums';

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

  writerForm: FormGroup;
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
    private store$: Store<State>,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private location: Location,
  ) { }

  async ngOnInit() {
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
        note: new FormControl('', [
          // Validators.required,
        ]),
      }),
      photos: new FormArray([]),
      recordings: new FormArray([]),
    });

    this.locationWithoutParameters = this.location.path().split('?')[0];
    this.editOrCreatePage =
      (this.locationWithoutParameters === LocationPath.EDIT_WRITER) || (this.locationWithoutParameters === LocationPath.CREATE_WRITER);
    if (this.locationWithoutParameters === LocationPath.EDIT_WRITER) {
      const id = this.activatedRoute.snapshot.queryParamMap.get('id');
      this.writer = await this.pouchDbService.getWriter(id);

      const recordingsArray = this.writerForm.controls.recordings as FormArray;
      this.writer.recordings.forEach(recording => recordingsArray.push(new FormControl(recording)));

      const photosArray = this.writerForm.controls.photos as FormArray;
      this.writer.photos?.forEach(photo => photosArray.push(new FormControl(photo)));

      this.writerForm.patchValue(this.writer);
      this.textForSaveButton = 'שמור שינויים';
    } else if ((this.locationWithoutParameters === LocationPath.CREATE_WRITER) && (this.textForSaveButton !== 'שמור שינויים')) {
      this.googleMapsService.setAddressThroghGoogleMaps().then((address: Address) => {
        this.writerForm.controls.city.setValue(address.city);
        this.writerForm.controls.street.setValue(address.street);
        this.writerForm.controls.streetNumber.setValue(address.streetNumber);
        this.writerForm.controls.coordinates.setValue(address.coordinates);
      });
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
    if (areYouSureYouWantToRemove(RemoveItem.recording)) {
      const recordingsArray = this.writerForm.controls.recordings as FormArray;
      recordingsArray.removeAt(index);
    }
  }

  deletePhoto(index: number) {
    if (areYouSureYouWantToRemove(RemoveItem.img)) {
      const photosArray = this.writerForm.controls.photos as FormArray;
      photosArray.removeAt(index);
    }
  }
  // playRecord() {
  //   this.record.play();
  // }

  isChecked(event, formControl: AbstractControl) {
    if (event.target.value === formControl.value) {
      formControl.setValue('');
    }
  }

  onRemove() {
    if (areYouSureYouWantToRemove(RemoveItem.writer)) {
      
    }
  }

  onSubmit() {
    if (this.writerForm.valid) {
      if (this.locationWithoutParameters === LocationPath.CREATE_WRITER) {
        this.pouchDbService.createWriter({ ...this.writerForm.value });
      } else if (this.locationWithoutParameters === LocationPath.EDIT_WRITER) {
        this.pouchDbService.createWriter({ ...this.writer, ...this.writerForm.value });
      }
      this.store$.dispatch(loadWritersList());
      this.router.navigate(['/writers-list-screen']);
    } else {
      alert('יש למלא שם פרטי, שם משפחה ומידת התאמה');
    }
  }

}
