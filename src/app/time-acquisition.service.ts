import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';

import { SunRiseSet } from './sunriseset';

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

  constructor(private http: Http) { }

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
    const argDate = this.formatDate(date, 'YYYY-MM-DD');
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

  /**
   * 日付を任意の形式に変換する
   * 
   */
  private formatDate(date: any, format: string): string {
    if (!format) {
      format = 'YYYY-MM-DD hh:mm:ss.SSS';
    }
    format = format.replace(/YYYY/g, date.getFullYear());
    format = format.replace(/MM/g, ('0' + (date.getMonth() + 1)).slice(-2));
    format = format.replace(/DD/g, ('0' + date.getDate()).slice(-2));
    format = format.replace(/hh/g, ('0' + date.getHours()).slice(-2));
    format = format.replace(/mm/g, ('0' + date.getMinutes()).slice(-2));
    format = format.replace(/ss/g, ('0' + date.getSeconds()).slice(-2));
    if (format.match(/S/g)) {
      const milliSeconds = ('00' + date.getMilliseconds()).slice(-3);
      const length = format.match(/S/g).length;
      for (let i = 0; i < length; i++) {
        format = format.replace(/S/, milliSeconds.substring(i, i + 1));
      }
    }
    return format;
  }
}
