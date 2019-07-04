import { Directive, Input, OnChanges, SimpleChanges, forwardRef } from '@angular/core';
import { Validator, AbstractControl, Validators, NG_VALIDATORS } from '@angular/forms';

import { NoWhitespaceValidator } from './no-whitespace.validator';

/**
 * This validator works like "required" but it does not allow whitespace either
 *
 * @export
 * @class NoWhitespaceDirective
 * @implements {Validator}
 */
@Directive({
    selector: '[noSpaces][formControlName],[noSpaces][formControl],[noSpaces][ngModel]',
    providers: [{ provide: NG_VALIDATORS, useExisting: forwardRef(() => NoWhitespaceDirective), multi: true }]
})
export class NoWhitespaceDirective implements Validator {

    private valFn = NoWhitespaceValidator();
    validate(control: AbstractControl): { [key: string]: any } {
        return this.valFn(control);
    }
}