import { Injectable } from '@angular/core';

export interface StorageInterface {
    onSetToken(tokenName: string, value: any): Promise<void>;
    onGetToken(tokenName: string): Promise<string>;
    onRemoveToken(tokenName: string): Promise<void>;
    onRemoveAllTokens(): Promise<void>;

}

@Injectable()
export class StorageService implements StorageInterface {
    onRemoveAllTokens(): Promise<void> {
        return Promise.resolve(localStorage.clear());
    }

    onSetToken = async (tokenName: string, value: any): Promise<void> => {
        return Promise.resolve(localStorage.setItem(tokenName, value));
    }

    onGetToken = async (tokenName: string): Promise<string> => {
        return Promise.resolve(localStorage.getItem(tokenName));
    }

    onRemoveToken(tokenName: string): Promise<void> {
        return Promise.resolve(localStorage.removeItem(tokenName));
    }
}
