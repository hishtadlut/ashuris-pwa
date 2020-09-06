export function fileToBase64(file: File) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

export function base64ToBlob(url: string): Promise<Blob> {
  return new Promise(resolve => {
    fetch(url)
      .then(res => resolve(res.blob()));
  });
}

export function blobToObjectUrl(blob: Blob): string {
  return window.URL.createObjectURL(blob);
}

export function sortByLetters(arrayToSort): any[] {
  return arrayToSort.sort((a, b) => {
    if (a.lastName < b.lastName) {
      return -1;
    }
    if (a.lastName > b.lastName) {
      return 1;
    }
    return 0;
  });
}

export function setAddressthroghGoogleMaps() {
  return new Promise((resolve, reject) => {
    this.googleMapsService.getCurrentCoordinates()
      .then((currentCoordinates: google.maps.LatLng) => {
        this.googleMapsService.reverseGeocoder(currentCoordinates)
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
