import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'decimalFormat'
})
export class DecimalFormatPipe implements PipeTransform {

  transform(value: number, places: number): unknown {
    return value.toFixed(places);
  }

}
