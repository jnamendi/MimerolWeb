import * as CryptoJS from 'crypto-js';
import { UserResponseModel } from '../../models';
import decode from 'jwt-decode';
import { UserRole } from '../../models/user/user.model';
import { IpInfo } from '../../models/ipinfo/ipinfo.model';
import { StorageKey } from '../../services/storage-key/storage-key';
import { AreaSearch } from '../../models/google/country-restaurant.model';
import { OrderItem } from '../../models/restaurant-menu/restaurant-menu.model';
import { OrderCheckoutModel } from '../../models/order/order.model';

export class JwtTokenHelper {

    static base64url = (source) => {
        // Encode in classical base64
        let encodedSource = CryptoJS.enc.Base64.stringify(source);

        // Remove padding equal characters
        encodedSource = encodedSource.replace(/=+$/, '');

        // Replace characters according to base64url specifications
        encodedSource = encodedSource.replace(/\+/g, '-');
        encodedSource = encodedSource.replace(/\//g, '_');

        return encodedSource;
    }

    public static CreateUnsignedToken = (data: any): string => {
        let header = {
            "alg": "HS256",
            "typ": "JWT"
        };

        let stringifiedHeader = CryptoJS.enc.Utf8.parse(JSON.stringify(header));
        let encodedHeader = JwtTokenHelper.base64url(stringifiedHeader);

        let stringifiedData = CryptoJS.enc.Utf8.parse(JSON.stringify(data));
        let encodedData = JwtTokenHelper.base64url(stringifiedData);

        let token = encodedHeader + "." + encodedData;

        return token;
    }

    public static CreateSigningToken = (data: any): string => {
        let token = JwtTokenHelper.CreateUnsignedToken(data);
        let secret = "My very confidential secret!";

        let signature = CryptoJS.HmacSHA256(token, secret);
        signature = JwtTokenHelper.base64url(signature);

        let signedToken = token + "." + signature;
        return signedToken;
    }

    public static DecodeToken = (token: string): any => {
        if (token == null) {
            return null;
        }
        try {
            let tokenPayload = decode(token);
            if (tokenPayload) {
                return tokenPayload;
            }
        } catch (error) {
            return null;
        }
    }

    public static GetUserInfo = (): UserResponseModel => {
        let userInfoToken = localStorage.getItem(StorageKey.User);
        let userInfo = JwtTokenHelper.DecodeToken(userInfoToken);
        if (userInfo) {
            return <UserResponseModel>{ ...userInfo };
        }

        return null;
    }

    public static isRole(userRole: UserRole): boolean {
        let userInfo = JwtTokenHelper.GetUserInfo();
        if (!userInfo) {
            return false;
        }
        return userInfo.roles.some(role => role == UserRole[userRole].toLowerCase());
    }

    public static get userName(): string | null {
        let userInfo = JwtTokenHelper.GetUserInfo();
        return userInfo && (userInfo.fullName || userInfo.email) || null;
    }

    public static get countryCode(): string | null {
        return 'NI';
        //   let ipInfoToken = localStorage.getItem(StorageKey.IPInfo);
        //   let ipDecode = JwtTokenHelper.DecodeToken(ipInfoToken);
        //  let ipInfo = ipDecode && <IpInfo>{ ...ipDecode } || null;
        //return ipInfo && ipInfo.country || 'ES';
    }

    public static GetItemsInBag = (restaurantId: number): OrderItem => {
        let itemsInBagToken = localStorage.getItem(StorageKey.ItemsInBag + `__${restaurantId}`);
        let itemsDecode = itemsInBagToken && JwtTokenHelper.DecodeToken(itemsInBagToken);
        let itemsInBag = itemsDecode && <OrderItem>{ ...itemsDecode } || null;
        return itemsInBag;
    }

    public static RemoveItemsInBag = (restaurantId: number) => {
        let itemsInBagToken = localStorage.removeItem(StorageKey.ItemsInBag + `__${restaurantId}`);
        return itemsInBagToken;
    }

    public static GetSearchRestaurantArea = (): AreaSearch => {
        let restaurantSearchAreaToken = localStorage.getItem(StorageKey.RestaurantAreaSearch);
        let restaurantSearchAreaDecode = restaurantSearchAreaToken && JwtTokenHelper.DecodeToken(restaurantSearchAreaToken)
        let restaurantSearchArea = restaurantSearchAreaDecode && <AreaSearch>{ ...restaurantSearchAreaDecode } || null;
        return restaurantSearchArea;
    }

    public static GetOrderCheckedout = (invoiceId: string): OrderCheckoutModel => {
        let orderCheckedoutToken = localStorage.getItem(`${StorageKey.OrderCheckedOut}${invoiceId}`);

        let itemsDecode = orderCheckedoutToken && JwtTokenHelper.DecodeToken(orderCheckedoutToken);

        let orderCheckedout = itemsDecode && <OrderCheckoutModel>{ ...itemsDecode } || null;
        return orderCheckedout;
    }
}