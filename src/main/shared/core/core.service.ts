import { Injectable } from '@angular/core';

export interface CoreInterface {
    range(start: number, end: number): Array<number>;
    convertMinuteToTime(minutes: number): string;
    compareTimeGreaterThanCurrent(hrsmins: string): boolean;
    timeInRange(start: string, end: string): boolean;
}

@Injectable()
export class CoreService implements CoreInterface {

    range(start: number, end: number) {
        const length = end - start;
        return Array.from({ length }, (_, i) => start + i);
    }

    convertMinuteToTime(minutes: number) {
        let m = minutes % 60;
        let h = (minutes - m) / 60;

        let Hrsmins = h.toString() + ":" + (m < 10 ? "0" : "") + m.toString();// + (h > 12 ? " PM" : " AM");
        return Hrsmins;

    }

    compareTimeGreaterThanCurrent(hrsmins: string): boolean {
        if (!hrsmins) {
            return false;
        }
        let times = hrsmins.split(':');
        let h = parseInt(times[0]);
        let m = parseInt(times[1]);

        let currentDate = new Date();
        let currentH = currentDate.getHours();
        let currentM = currentDate.getMinutes();
        if (h == currentH) {
            return h > currentH && m > currentM;
        }
        else {
            return h > currentH;
        }
    }

    timeInRange(start: string, end: string): boolean {
        if (!start || !end) {
            return false;
        }
        let currentTime = new Date();

        let cH = currentTime.getHours();
        let cM = currentTime.getMinutes();

        let sTimes = start.split(":");
        let sH = parseFloat(sTimes[0]);
        let sM = parseFloat(sTimes[1]);

        let eTimes = end && end.split(":");
        let eH = parseFloat(eTimes[0]);
        let eM = parseFloat(eTimes[1]);

        return cH >= sH && cH <= eH;
    }

}
