import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'abbreviate' })
export class AbbreviationPipe implements PipeTransform {
    transform(value: string, length: number = 3): string {
        let res;
        if(value) {
            if (value.length <= length) {
                res = value;
            }
            else {
                res = value.slice(0, length) + '...';
            }
        }
        else {
            return '';
        }
        return res;
    }
}