import { RemoveItem } from '../enums';

declare const navigator: Navigator;

type ShareData = {
  title?: string;
  text?: string;
  url?: string;
  files?: ReadonlyArray<File>;
};

interface Navigator {
  share?: (data?: ShareData) => Promise<void>;
  canShare?: (data?: ShareData) => boolean;
}

export function fileToBase64(file: Blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}
export function base64ToBlob(url: string): Promise<Blob> {
  return new Promise((resolve, reject) => {
    fetch(url)
      .then(res => resolve(res.blob()))
      .catch(err => reject(err));
  });
}

export function blobToObjectUrl(blob: Blob): string {
  return window.URL.createObjectURL(blob);
}

export function sortByLetters(arrayToSort: any[]): any[] {
  arrayToSort = arrayToSort.filter(item => item);
  if (arrayToSort.length && arrayToSort[0] !== undefined) {
    const fieldToCheck = arrayToSort[0].lastName ? 'lastName' : 'name';
    return arrayToSort.sort((a, b) => {
      if (a[fieldToCheck] < b[fieldToCheck]) {
        return -1;
      }
      if (a[fieldToCheck] > b[fieldToCheck]) {
        return 1;
      }
      return 0;
    });
  }
  return [];
}

export function preventDefaultAndStopPropagation(event: Event) {
  event.stopPropagation();
  event.preventDefault();
}

export function thereAreDetailsInGivenObject(object: { [x: string]: string | boolean }) {
  return !(Object.values(object).join('').replaceAll('false', '') === '');
}

export function shareButton(photo: string) {
  if (navigator.share) {
    base64ToBlob(photo)
      .then(img => {
        const imgFile = new File([img], 'img.jpg');
        navigator.share({
          files: [imgFile]
        })
          .then(() => {
            console.log('Thanks for sharing!');
          }).catch((error => {
            console.log('share error: ' + error);
            // TODO fix in ios 14.02?
            // window.location.reload(true);
          }));
      })
      .catch((error => {
        console.log('share error: ' + error);
        // TODO fix in ios 14.02?
        // window.location.reload(true);
      }));
  } else {
    console.log('navigator.share err');
  }
}

export function areYouSureYouWantToRemove(item: RemoveItem) {
  return confirm(`האם אתה בטוח שברצונך למחוק את ה${item}?`);
}

export function areYouSureYouWantToLeaveThePage(): boolean {
  return confirm(`האם אתה בטוח שברצונך לעזוב את העמוד?`);
}

export function addAreaCodeForIsraliNumbers(phoneNumber: number): string {
  return phoneNumber[0] === '0' ? '+972' + phoneNumber.toString().substring(1) : phoneNumber.toString();
}

export function getDuration(audio: HTMLAudioElement): Promise<number> {
  return new Promise((resolve) => {
    audio.addEventListener('loadedmetadata', () => {
      resolve(audio.duration);
    });
  });
}
