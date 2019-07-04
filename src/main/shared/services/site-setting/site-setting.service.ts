import { Injectable } from '@angular/core';

@Injectable()
export class SiteSettingService {
  public current: SiteSetting;

  constructor() {
    this.current = {
      defaultLanguage: 'en-US',
      currentLanguage: 'en-US',
      languages: [
        {
          id: 'en-US',
          title: 'English(US)',
          icon: 'us-flag-icon.png',
        },
        {
          id: 'vi-VN',
          title: 'Việt Nam',
          icon: 'vn-flag-icon.png',
        }
      ],
    };
  }
}

export class SiteSetting {
    public readonly defaultLanguage: string;
    public readonly languages: any[];
    public readonly currentLanguage: string;
}