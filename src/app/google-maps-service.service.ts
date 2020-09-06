import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class GoogleMapsService {
  geocoder = new google.maps.Geocoder();

  getCurrentCoordinates(): Promise<google.maps.LatLng> {
    return new Promise((resolve, reject) => {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          (result) => {
            const currentCoordinates = new google.maps.LatLng(
              result.coords.latitude,
              result.coords.longitude,
              // 32.0845933, 34.8412179
            );
            resolve(currentCoordinates);
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

  reverseGeocoder(currentCoordinates: google.maps.LatLng) {
    return new Promise((resolve) => {
      this.geocoder.geocode({ location: currentCoordinates }, (results, status) => {
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



  // setMapWithCurrentPosition(mapDiv, zoom: number = 16): Promise<google.maps.LatLng> {
  //   return new Promise((resolve, reject) => {
  //     this.getCurrentCoordinates()
  //       .then((currentCoordinates: google.maps.LatLng) => {
  //         this.setMapWithPosition(mapDiv, currentCoordinates)
  //         resolve(currentCoordinates);
  //       }).catch((err) => {
  //         reject(err);
  //       });
  //   });

  // }

  setMapWithPosition(mapDiv, position: google.maps.LatLng, zoom: number = 16) {
    // if (typeof (position) !== 'string') {
      const mapOptions = {
        center: position,
        zoom,
      };
      const map = new google.maps.Map(mapDiv, mapOptions);
      this.addMarker(position, map);
      return position;
    // }
  }

  setAddressThroghGoogleMaps() {
    return new Promise((resolve, reject) => {
      this.getCurrentCoordinates()
        .then((currentCoordinates: google.maps.LatLng) => {
          this.reverseGeocoder(currentCoordinates)
            .then((result: google.maps.GeocoderResult) => {
              try {
                const address = {
                  city: result.address_components.find(addressComponent => addressComponent.types.includes('locality')).long_name,
                  street: result.address_components.find(addressComponent => addressComponent.types.includes('route')).long_name,
                  streetNumber: result.address_components.find(addressComponent => addressComponent.types.includes('street_number')).long_name,
                  coordinates: currentCoordinates
                };
                resolve(address);
              } catch {
                reject('Some error accourd in accessing google maps');
              }
            });
        });
    });
  }

}
