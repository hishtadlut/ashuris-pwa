import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { StitchService } from '../stitch-service.service';
import { Subscription } from 'rxjs';
import { fileToBase64 } from '../utils/utils';
import { GoogleMapsService } from '../google-maps-service.service';
import { Router } from '@angular/router';

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

  @ViewChild('mapContainer', { static: false }) gmap: ElementRef;

  constructor(private stitchService: StitchService, private googleMapsService: GoogleMapsService, private router: Router) { }
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
      profileImage: new FormControl('', [
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
        isPricePerPage: new FormControl(true),
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
      })
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

  onUploadFile(file: File) {
    fileToBase64(file)
      .then((base64File: string | ArrayBuffer) => {
        this.writerForm.controls.profileImage.setValue(base64File);
      }).catch((err) => {
        console.log(err);
      });
  }

  onSubmit() {
    this.stitchService.createWriter(this.writerForm.value);
    // .then(() => this.router.navigate(['/writers-list-screen']));
  }

  ngOnDestroy() {
    this.citiesFromDBSubscription.unsubscribe();
  }
}
