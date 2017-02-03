import { Injectable } from '@angular/core';

import { Edotime } from './edotime';
import { DateService } from './date.service';

/**
 * (1)24時間を一つの円で表す円形表示のための各刻の位置情報を計算する。
 * (2)現在時刻を不定時法に変換する。
 * @class TimeConversionService
 */
@Injectable()
export class TimeConversionService {

  private edotimes: Edotime[] = [];
  private anglePerMinute: number = 360 / (24 * 60); // 1分当たりの角度
  private minutesForDay: number = 24 * 60;  // 24時間を分で表した数
  private kokus: string[] = ['六つ', '五つ', '四つ', '九つ', '八つ', '七つ'];
  private etos: string[] = ['卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥', '子', '丑', '寅'];

  constructor(
    private dateService: DateService
  ) { }

  /**
   * 円形表示のための各刻の位置情報を計算する。
   * 
   * @param {string} sunrise (日の出時刻　hh:mm:ss)
   * @param {string} sunset (日の入り時刻　hh:mm:ss)
   * @return {Edotime[]} edotimes (円形表示のための各刻の位置情報)
   */
  public getEdoTimeAxis(sunrise: string, sunset: string): Edotime[] {
    const sunriseMinutes = this.dateService.time2minutes(sunrise) - 30; // 日の出の30分前を明け六つとする
    const sunsetMinutes = this.dateService.time2minutes(sunset) + 30;   // 日の入りの30分後を暮れ六つとする

    // 昼間の各刻を計算する
    const daytimeMinuteInterval = (sunsetMinutes - sunriseMinutes) / 6;
    const daytimeAngleInterval = daytimeMinuteInterval * this.anglePerMinute;
    console.log('sunriseMinutes => ' + sunriseMinutes);
    console.log('sunsetMinutes => ' + sunsetMinutes);
    console.log('daytimeMinuteInterval => ' + daytimeMinuteInterval);
    console.log('daytimeAngleInterval => ' + daytimeAngleInterval);

    for (let i = 0; i < 6; i++) {
      let angle = 0;
      let startTime = 0;
      if (i === 0) {
        angle = sunriseMinutes * this.anglePerMinute;
        startTime = sunriseMinutes;
      } else {
        angle = this.edotimes[i - 1].angle + daytimeAngleInterval;
        startTime = this.edotimes[i - 1].startTime + daytimeMinuteInterval;
      }
      this.edotimes[i] = {
        angle: angle,
        daytime: true,
        axis: true,
        eto: this.etos[i],
        koku: this.kokus[i],
        minutesInterval: daytimeMinuteInterval,
        startTime: startTime,
        startTimeHM: this.dateService.minutes2time(startTime)
      };
    }

    // 夜間の各刻を計算する
    const nighttimeMinuteInterval = ((this.minutesForDay - sunsetMinutes) + sunriseMinutes) / 6;
    const nighttimeAngleInterval = nighttimeMinuteInterval * this.anglePerMinute;

    for (let i = 0; i < 6; i++) {
      const j = i + 6;
      let angle = this.edotimes[j - 1].angle + nighttimeAngleInterval;
      if (angle > 360) {
        angle = angle - 360;
      }
      let startTime = this.edotimes[j - 1].startTime + nighttimeMinuteInterval;
      if (startTime > 24 * 60) {
        startTime = startTime - 24 * 60;
      }
      this.edotimes[j] = {
        angle: angle,
        daytime: false,
        axis: true,
        eto: this.etos[j],
        koku: this.kokus[i],
        minutesInterval: nighttimeMinuteInterval,
        startTime: startTime,
        startTimeHM: this.dateService.minutes2time(startTime)
      };
    }
    console.log('this.edotimes.length => ' + this.edotimes.length);
    for (let i = 0; i < this.edotimes.length; i++) {
      console.log(this.edotimes[i]);
    }
    return this.edotimes;
  }

}
