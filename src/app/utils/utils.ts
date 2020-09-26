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

export function preventDefaultAndStopPropagation(event: Event) {
  event.stopPropagation();
  event.preventDefault();
}
