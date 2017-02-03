import { Injectable } from '@angular/core';

/**
 * 日付、時刻関連のユーティリティ
 */
@Injectable()
export class DateService {

  constructor() { }

  /**
   * 日付を任意の形式に変換する
   * 
   */
  public formatDate(date: any, format: string): string {
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

  /**
   * 時刻を0時からの分に変換する。
   * 
   * @param {string} time （時刻　hh:mm:ss）
   * @return {number} totalMinutes （0時からの分）
   */
  public time2minutes(time: string): number {
    const times = time.split(':');
    const hours = parseInt(times[0], 10);
    const minutes = parseInt(times[1], 10);
    const totalMinutes = hours * 60 + minutes;
    return totalMinutes;
  }

  /**
   * 0時からの分を時刻（hh:mm）に変換する
   * 
   * @param {number} minutes (分)
   * @return {string} (hh:mm)
   */
  public minutes2time(minutes: number): string {
    const nhh = Math.floor(minutes / 60);
    const nmm = minutes - nhh * 60;
    let hh = nhh.toString(10);
    if (nhh < 10) {
      hh = '0' + hh;
    }
    let mm = Math.floor(nmm).toString(10);
    if (nmm < 10) {
      mm = '0' + mm;
    }
    return hh + ':' + mm;
  }

}
