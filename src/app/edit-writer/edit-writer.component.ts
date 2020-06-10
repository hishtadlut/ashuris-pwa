import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { StitchService } from '../stitch-service.service';
import { Subscription } from 'rxjs';
import { Writer } from '../interfaces';
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
      startDate: new FormGroup({
        gregorianDate: new FormControl('', [
          Validators.required,
        ]),
        hebrewDateInWords: new FormControl('', [
          Validators.required,
        ]),
      })
      // email: new FormControl('', [
      //   Validators.required,
      //   Validators.email,
      // ])
    });
    this.stitchService.getCities();
    this.citiesFromDBSubscription = this.stitchService.citiesFromDB.subscribe(
      (cities) => this.citiesFromDB = cities
    );
  }

  ngAfterViewInit() {
    this.googleMapsService.setMapWithCurrentPosition(this.gmap.nativeElement)
      .then(() => {
        this.googleMapsService.reverseGeocoder()
          .then((result: google.maps.GeocoderResult) => {
            console.log(result);
            this.writerForm.controls.city.setValue(
              result.address_components.find(addressComponent => addressComponent.types.includes('locality')).long_name
            );
            this.writerForm.controls.street.setValue(
              result.address_components.find(addressComponent => addressComponent.types.includes('route')).long_name
            );
            this.writerForm.controls.streetNumber.setValue(
              result.address_components.find(addressComponent => addressComponent.types.includes('street_number')).long_name
            );
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
    const controls = this.writerForm.controls;
    const {
      firstName,
      lastName, telephone,
      city,
      profileImage,
      startDate
    } = Object.assign({}, ...Object.entries(controls).map(([k, v]) => {
      return { [k]: v.value };
    }));
    this.stitchService.createWriter({ firstName, lastName, telephone, city, profileImage, startDate })
      .then(() => this.router.navigate(['/writers-list-screen']));
  }

  ngOnDestroy() {
    this.citiesFromDBSubscription.unsubscribe();
  }
}
