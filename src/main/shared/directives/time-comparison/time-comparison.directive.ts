import { Directive, forwardRef, Attribute, Input } from '@angular/core';
import { Validator, AbstractControl, NG_VALIDATORS } from '@angular/forms';
@Directive({
    selector: '[timeComparison][formControlName],[timeComparison][formControl],[timeComparison][ngModel]',
    providers: [
        { provide: NG_VALIDATORS, useExisting: forwardRef(() => TimeComparison), multi: true }
    ],
    
})
export class TimeComparison implements Validator {
    @Input() timeComparison: string
    constructor(
        @Attribute('comparison') public comparison: string) {
    }

    private deleteValidation = (e) => {
        if (e && e.errors && e.errors['timeInValid']) {
            delete e.errors && e.errors['timeInValid'];
            if (!Object.keys(e.errors).length) e.setErrors(null);
        }
    }

    validate(c: AbstractControl): { [key: string]: any } {
        // self value
        let v = c.value;

        // control value
        // let e = c.root.get(this.timeComparison);
        let e = this.timeComparison;

        // if (!v || !e || !e.value) {
        //     return;
        // }

        if (!v || !e) {
            return;
        }

        let vTimes = v.split(":");
        let vH = parseFloat(vTimes[0]);
        let vM = parseFloat(vTimes[1]);

        // let eTimes = e && e.value.split(":");
        let eTimes = e.split(":");
        let eH = parseFloat(eTimes[0]);
        let eM = parseFloat(eTimes[1]);


        switch (this.comparison) {
            case "greater":
                if (vH <= eH) {
                    return {
                        timeInValid: true
                    }
                }

                if (vH == eH && vM <= eM) {
                    return {
                        timeInValid: true
                    }
                }

                if (vH > eH) {
                    this.deleteValidation(e);
                }
                break;
            case "equal":
                if (vH != eH) {
                    return {
                        timeInValid: true
                    }
                }

                if (vH == eH && vM != eM) {
                    return {
                        timeInValid: true
                    }
                }

                if (vH == eH) {
                    this.deleteValidation(e);
                }
                break;
            case "lesser":
                if (vH >= eH) {
                    return {
                        timeInValid: true
                    }
                }

                if (vH == eH && vM >= eM) {
                    return {
                        timeInValid: true
                    }
                }

                if (vH < eH) {
                    this.deleteValidation(e);
                }
                break;
            default:
                break;
        }
        return null;
    }
}