import { Pipe, PipeTransform } from '@angular/core';
/*
 * Round number to decimal
 * Usage:
 *   value | roundNumber
 * Example:
 *   {{ 1.23 | roundNumber}}
 *   formats to: 1.2
*/
@Pipe({name: 'roundNumber'})
export class RoundNumberPipe implements PipeTransform {
    transform(value = 0): number {
        if (value) {
            return Math.round(value * 10) / 10; // round to 1 decimal
        } else {
            return value;
        }
    }
}