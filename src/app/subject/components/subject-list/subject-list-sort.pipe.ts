import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'orderBy'
})
export class OrderByPipe implements PipeTransform {
  transform(value: any[], column: string, direction: string): any[] {
    if (!value || !column || !direction) {
      return value;
    }
    
    let sortedValue = value.sort((a: any, b: any) => {
      if (a[column] < b[column]) {
        return direction === 'asc' ? -1 : 1;
      } else if (a[column] > b[column]) {
        return direction === 'asc' ? 1 : -1;
      } else {
        return 0;
      }
    });

    return sortedValue;
  }
}