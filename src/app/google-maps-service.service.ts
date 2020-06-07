import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class GoogleMapsService {
  currentCoordinates: google.maps.LatLng;
  mapOptions: google.maps.MapOptions;
  geocoder = new google.maps.Geocoder();
  map: google.maps.Map;

  constructor() {
    this.setCurrentCoordinates();
  }

  setCurrentCoordinates() {
    return new Promise((resolve, reject) => {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          (result) => {
            this.currentCoordinates = new google.maps.LatLng(
              result.coords.latitude,
              result.coords.longitude,
              // 32.0845933, 34.8412179
            );
            resolve(this.currentCoordinates);
          },
          (err) => {
            reject(err);
          },
          { enableHighAccuracy: true }
        );
      } else { /* geolocation IS NOT available */ }
    });

  }

  addMarker(position: google.maps.LatLng, map: google.maps.Map) {
    return new google.maps.Marker({
      position,
      map,
    });
  }

  reverseGeocoder() {
    return new Promise((resolve) => {
      this.geocoder.geocode({ location: this.currentCoordinates }, (results, status) => {
        if (status === 'OK') {
          if (results[0]) {
            resolve(results[0]);
          } else {
            window.alert('No results found');
          }
        } else {
          window.alert('Geocoder failed due to: ' + status);
        }
      });
    });
  }

  setMapWithCurrentPosition(mapDiv, zoom: number = 16) {
    return new Promise((resolve, reject) => {
      this.setCurrentCoordinates()
        .then((currentCoordinates: google.maps.LatLng) => {
          this.mapOptions = {
            center: currentCoordinates,
            zoom,
          };
          this.map = new google.maps.Map(mapDiv, this.mapOptions);
          this.addMarker(currentCoordinates, this.map);
          resolve(null);
        }).catch((err) => {
          reject(err);
        });
    });

  }

}
