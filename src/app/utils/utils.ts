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
        navigator.share({
          files: [new File([img], 'img.jpg')]
        })
          .then(() => {
            console.log('Thanks for sharing!');
          }).catch((error => {
            // TODO fix in ios 14.02
            window.location.reload(true);
          }));
      })
      .catch((error => {
        // TODO fix in ios 14.02
        window.location.reload(true);
      }));
  } else {
    // fallback
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
