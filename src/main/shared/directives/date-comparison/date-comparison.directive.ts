import { Directive, forwardRef, Attribute } from '@angular/core';
import { Validator, AbstractControl, NG_VALIDATORS } from '@angular/forms';
@Directive({
    selector: '[dateComparsion][formControlName],[dateComparsion][formControl],[dateComparsion][ngModel]',
    providers: [
        { provide: NG_VALIDATORS, useExisting: forwardRef(() => DateComparison), multi: true }
    ]
})
export class DateComparison implements Validator {
    constructor(@Attribute('dateComparsion') public dateComparsion: string,
        @Attribute('comparsion') public comparsion: string) {
    }

    private deleteValidation = (e) => {
        if (e && e.errors && e.errors['dateInValid']) {
            delete e.errors && e.errors['dateInValid'];
            if (!Object.keys(e.errors).length) e.setErrors(null);
        }
    }

    validate(c: AbstractControl): { [key: string]: any } {
        // self value
        let v = new Date(c.value);

        // control value
        let e = c.root.get(this.dateComparsion);

        if (!v || !e || !e.value) {
            return;
        }
        let vTime = v.getTime()

        let eTime = e && new Date(e.value).getTime();

        switch (this.comparsion) {
            case "greater":
                if (vTime <= eTime) {
                    return {
                        dateInValid: true
                    }
                }
                if (vTime > eTime) {
                    this.deleteValidation(e);
                }
                break;
            case "equal":
                if (vTime !== eTime) {
                    return {
                        dateInValid: true
                    }
                }

                if (vTime === eTime) {
                    this.deleteValidation(e);
                }
                break;
            case "lesser":
                if (vTime >= eTime) {
                    return {
                        dateInValid: true
                    }
                }
                if (vTime < eTime) {
                    this.deleteValidation(e);
                }
                break;
            default:
                break;
        }
        return null;
    }
}