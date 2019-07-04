import { Injectable } from "@angular/core";
import { ApiUrl } from '../../services/api-url/api-url';

@Injectable()
export class ClientState {
    private _isBusy: boolean;
    private _isProgressBarVisible: boolean = false;
    private progressTimeout = null;

    public set isProgressBarVisible(value: boolean) {
        if (value) {
            if (this.progressTimeout) {
                clearTimeout(this.progressTimeout);
            }
            this.progressTimeout = setTimeout(() => {
                this._isProgressBarVisible = value;
            },
                1500);
        } else {
            if (this.progressTimeout) {
                clearTimeout(this.progressTimeout);
            }
            this._isProgressBarVisible = value;
        }
    }

    public set isBusy(value: boolean) {
        this._isBusy = value;
        this.isProgressBarVisible = value;
    }

    public get isBusy(): boolean {
        return this._isBusy;
    }

    //---Timestamp for 30 days from now
    public get TimeStampFor30Days(): number {
        return new Date().getTime() + (30 * 24 * 60 * 60 * 1000);
    }

    //---Timestamp for 15 days from now
    public get TimeStampFor15Days(): number {
        return new Date().getTime() + (15 * 24 * 60 * 60 * 1000);
    }

    //---Base server url
    public get BaseUrl(): string {
        return ApiUrl.BaseUrl;
    }
}