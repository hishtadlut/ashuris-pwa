import { Pipe, PipeTransform } from '@angular/core';
import { parsePhoneNumber } from 'libphonenumber-js';

@Pipe({
  name: 'phone'
})
export class PhonePipe implements PipeTransform {

  transform(phoneValue: string | number): string {
    const stringPhone = phoneValue + '';
    const isIsraliNumber = phoneValue[0] === '0';
    const phoneNumber = isIsraliNumber ? parsePhoneNumber(stringPhone, 'IL') : parsePhoneNumber(stringPhone, 'US');
    const formatted = phoneNumber.formatNational();
    return formatted;
  }

}
