import { Pipe, PipeTransform } from '@angular/core';
import { parsePhoneNumber } from 'libphonenumber-js';

@Pipe({
  name: 'phone'
})
export class PhonePipe implements PipeTransform {

  transform(phoneValue: string | number): string {
    const stringPhone = phoneValue + '';
    const phoneNumber = parsePhoneNumber(stringPhone, 'IL');
    const formatted = phoneNumber.formatNational();
    return formatted;
  }

}
