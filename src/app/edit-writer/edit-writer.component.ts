import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { StitchService } from '../stitch-service.service';
import { Subscription } from 'rxjs';

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

  mapOptions: google.maps.MapOptions;

  @ViewChild('mapContainer', { static: false }) gmap: ElementRef;



  constructor(private stitchService: StitchService) { }
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
    this.getGeolocation();
  }

  getGeolocation() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (result) => {
          const coordinates = new google.maps.LatLng(result.coords.latitude, result.coords.longitude);
          this.mapOptions = {
            center: coordinates,
            zoom: 16,
          };
          const marker = new google.maps.Marker({
            position: coordinates,
            map: this.map,
          });
          this.mapInitializer(marker);
          console.log(result);
        }, () => { }, {enableHighAccuracy: true});

    } else { /* geolocation IS NOT available */ }
  }

  mapInitializer(marker) {
    this.map = new google.maps.Map(this.gmap.nativeElement, this.mapOptions);
    marker.setMap(this.map);
  }

  onSubmit() {
    const { firstName, lastName, telephone, city } = this.writerForm.controls;
    this.stitchService.createWriter({ firstName: firstName.value, lastName: lastName.value, telephone: telephone.value, city: city.value });
  }

  ngOnDestroy() {
    this.citiesFromDBSubscription.unsubscribe();
  }
}
