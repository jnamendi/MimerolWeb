export interface RestaurantResultModel {
    name: string;
    rating: number;
    lat: number;
    long: number;
    vicinity: string;
}

export class AreaSearch {
    city: string;
    district: string;
    address: string;
    languageCode: string;
}