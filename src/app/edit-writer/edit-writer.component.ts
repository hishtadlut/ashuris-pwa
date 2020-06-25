import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { StitchService } from '../stitch-service.service';
import { Subscription } from 'rxjs';
import { fileToBase64 } from '../utils/utils';
import { GoogleMapsService } from '../google-maps-service.service';
import { Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-edit-writer',
  templateUrl: './edit-writer.component.html',
  styleUrls: ['./edit-writer.component.css']
})
export class EditWriterComponent implements OnInit, AfterViewInit, OnDestroy {
  citiesFromDBSubscription: Subscription;
  citiesFromDB: { city: string }[];
  communitiesFromDBSubscription: Subscription;
  communitiesFromDB: string[];
  writerForm: FormGroup;
  map: google.maps.Map;
  isRecording = false;
  hasRecord = false;
  record: SafeResourceUrl;
  mediaRecorder: MediaRecorder;

  @ViewChild('mapContainer', { static: false }) gmap: ElementRef;

  constructor(
    private stitchService: StitchService,
    private googleMapsService: GoogleMapsService,
    private router: Router,
    private sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.writerForm = new FormGroup({
      firstName: new FormControl('', [
        Validators.required,
      ]),
      lastName: new FormControl('', [
        Validators.required,
      ]),
      telephone: new FormControl('', [
        Validators.required,
        Validators.pattern('^[0-9]*$'),
        Validators.minLength(9),
      ]),
      city: new FormControl('', [
        Validators.required,
      ]),
      street: new FormControl('', [
        Validators.required,
      ]),
      streetNumber: new FormControl('', [
        Validators.required,
      ]),
      profileImage: new FormControl('../../assets/icons/Symbol 216 – 66.svg', [
        Validators.required,
      ]),
      communityDeatails: new FormGroup({
        community: new FormControl('', [
          Validators.required
        ]),
        note: new FormControl('', [
          // Validators.required,
        ]),
      }),
      startDate: new FormGroup({
        gregorianDate: new FormControl('', [
          Validators.required,
        ]),
        hebrewDateInWords: new FormControl('', [
          Validators.required,
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
            Validators.required
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
            Validators.required
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
            Validators.required
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
            Validators.required,
          ]),
          24: new FormControl(false, [
            Validators.required,
          ]),
          30: new FormControl(false, [
            Validators.required,
          ]),
          36: new FormControl(false, [
            Validators.required,
          ]),
          40: new FormControl(false, [
            Validators.required,
          ]),
          42: new FormControl(false, [
            Validators.required,
          ]),
          45: new FormControl(false, [
            Validators.required,
          ]),
          48: new FormControl(false, [
            Validators.required,
          ]),
          note: new FormControl('', [
            // Validators.required,
          ]),
        }),
        writingLevel: new FormGroup({
          level: new FormControl('', [
            Validators.required,
          ]),
          note: new FormControl('', [
            // Validators.required,
          ]),
        }),
        stabilityLevel: new FormGroup({
          level: new FormControl('', [
            Validators.required,
          ]),
          note: new FormControl('', [
            // Validators.required,
          ]),
        }),
        eraseLevel: new FormGroup({
          level: new FormControl('', [
            Validators.required,
          ]),
          note: new FormControl('', [
            // Validators.required,
          ]),
        }),
        writingTypes: new FormGroup({
          types: new FormGroup({
            ari: new FormControl(false, [
              Validators.required,
            ]),
            beitYosef: new FormControl(false, [
              Validators.required,
            ]),
            Welish: new FormControl(false, [
              Validators.required,
            ]),
          }),
          note: new FormControl('', [
            // Validators.required,
          ]),
        }),
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
            Validators.required,
          ]),
          note: new FormControl('', [
            // Validators.required,
          ]),
        }),
      }),
      photos: new FormArray([new FormControl('')]),
      record: new FormControl('', [
        // Validators.required,
      ]),
    });
    this.stitchService.getCities();
    this.stitchService.getCommunities();
    this.citiesFromDBSubscription = this.stitchService.citiesFromDB.subscribe(
      (cities) => this.citiesFromDB = cities
    );
    this.communitiesFromDBSubscription = this.stitchService.communitiesFromDB.subscribe(
      (communities) => this.communitiesFromDB = communities
    );
  }

  ngAfterViewInit() {
    this.googleMapsService.setMapWithCurrentPosition(this.gmap.nativeElement)
      .then(() => {
        this.googleMapsService.reverseGeocoder()
          .then((result: google.maps.GeocoderResult) => {
            console.log(result);
            try {
              this.writerForm.controls.city.setValue(
                result.address_components.find(addressComponent => addressComponent.types.includes('locality')).long_name
              );
              this.writerForm.controls.street.setValue(
                result.address_components.find(addressComponent => addressComponent.types.includes('route')).long_name
              );
              this.writerForm.controls.streetNumber.setValue(
                result.address_components.find(addressComponent => addressComponent.types.includes('street_number')).long_name
              );
            } catch { }
          });
      }).catch((err) => {

      });
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
    const audioChunks = [];
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        this.mediaRecorder = new MediaRecorder(stream);

        this.mediaRecorder.addEventListener('dataavailable', event => {
          audioChunks.push(event.data);
        });

        this.mediaRecorder.addEventListener('stop', () => {
          this.isRecording = false;
          this.hasRecord = true;

          const audioBlob = new Blob(audioChunks);
          const audioUrl = URL.createObjectURL(audioBlob);
          const audio = new Audio(audioUrl);

          this.record = this.sanitizer.bypassSecurityTrustResourceUrl(audioUrl);
          // this.record = audio;

          const reader = new FileReader();
          reader.readAsDataURL(audioBlob);
          reader.onloadend = () => {
            const base64data = reader.result;
            this.writerForm.controls.record.setValue(base64data);
          };

          // this.sanitizer.bypassSecurityTrustResourceUrl(audioUrl);
        });

        this.mediaRecorder.start();
        this.isRecording = true;
      });
  }

  stopRecording() {
    this.mediaRecorder.stop();
  }

  // playRecord() {
  //   this.record.play();
  // }

  onSubmit() {
    this.stitchService.createWriter(this.writerForm.value);
    // .then(() => this.router.navigate(['/writers-list-screen']));
  }

  ngOnDestroy() {
    this.citiesFromDBSubscription.unsubscribe();
  }
}
