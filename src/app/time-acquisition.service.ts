import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';

import { SunRiseSet } from './sunriseset';
import { DateService } from './date.service';

/**
 * 日の出・日の入り時刻を計算する。
 * 
 * Go packageあり：https://github.com/bwolf/suncal
 * 上記を使用して、自前でWebサービスを立ち上げることで柔軟な対応が可能
 * 
 */

@Injectable()
export class TimeAcquisitionService {

  private url = 'http://localhost:1323/sunriseset';
  private sunRiseSet: SunRiseSet;

  constructor(
    private http: Http,
    private dateService: DateService
    ) { }

  /**
   * 日の出・日の入り時刻を取得する
   * 
   * date: 日付
   * lat: 緯度
   * lng: 経度
   * 
   * return: hhmm&hhmm
   */
  public getSunRiseSetTime(date: any, lat: string, lng: string): Promise<SunRiseSet> {
    const argDate = this.dateService.formatDate(date, 'YYYY-MM-DD');
    this.url += '?date=' + argDate + '&latitude=' + lat + '&longitude=' + lng;
    return this.http.get(this.url)
      .toPromise()
      .then(response => {
        this.sunRiseSet = response.json();
        return this.sunRiseSet;
      })
      .catch(this.handleError);
  }

  private handleError(error: any) {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }

}
