import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Rx';

const GEOLOCATION_ERRORS = {
  'errors.location.unsupportedBrowser': 'Browser does not support location services',
  'errors.location.permissionDenied': 'You have rejected access to your location',
  'errors.location.positionUnavailable': 'Unable to determine your location',
  'errors.location.timeout': 'Service timeout has been reached'
};

// 現在位置を取得する
// TODO
//   Geolocation APIが使用できない場合は、明石天文台の位置とする
//   緯度  34.649394;
//   経度 135.001478;

@Injectable()
export class LocationService {

  constructor() { }

  public getLocation(): Observable<any> {
    return Observable.create(observer => {
      if (window.navigator && window.navigator.geolocation) {
        window.navigator.geolocation.getCurrentPosition(
          (position) => {
            observer.next(position);
            observer.complete();
          },
          (error) => {
            switch (error.code) {
              case 1:
                observer.error(GEOLOCATION_ERRORS['errors.location.permissionDenied']);
                break;
              case 2:
                observer.error(GEOLOCATION_ERRORS['errors.location.positionUnavailable']);
                break;
              case 3:
                observer.error(GEOLOCATION_ERRORS['errors.location.timeout']);
                break;
            }
          },
          {
            enableHighAccuracy: false,
            timeout: 50000,
            maximumAge: 600000
          }
        );
      }
    });
  }
}

