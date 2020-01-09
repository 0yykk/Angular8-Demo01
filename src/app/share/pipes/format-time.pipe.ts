import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatTime'
})
export class FormatTimePipe implements PipeTransform {

  transform(time: number): any {
    if (time) {
      // tslint:disable-next-line: no-bitwise
      const temp = time | 0;
      // tslint:disable-next-line: no-bitwise
      const minue = temp / 60 | 0;
      const second = (temp % 60).toString().padStart(2, '0');
      return `${minue}:${second}`;

    } else {
      return'00:00';
    }
  }

}
