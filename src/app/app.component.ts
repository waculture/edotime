import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { LocationService } from './location.service';
import { TimeAcquisitionService } from './time-acquisition.service';
import { TimeConversionService } from './time-conversion.service';
import { SunRiseSet } from './sunriseset';
import { Edotime } from './edotime';
import { DateService } from './date.service';

// TODO: Tooltipsに時刻を表示する（hh:mm～hh:mm）
// TODO: 定期的にグラフを書き換える

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  latitude: string;
  longitude: string;
  sunRise: string;
  sunSet: string;
  edotimeAxis: Edotime[] = [];
  currentTime: Date = new Date('2017/02/03 04:13:00');
  // currentTime: Date = new Date();

  pie_ChartData = [
    ['刻(干支)', '間隔']
  ];

  pie_ChartOptions = {
    legend: 'none',
    colors: ['29dee4', '29dee4', '29dee4', '29dee4', '29dee4', '29dee4',
      '4e4d41', '4e4d41', '4e4d41', '4e4d41', '4e4d41', '4e4d41'],
    fontSize: 12,
    pieSliceText: 'label',
    width: 500,
    height: 500,
    slices: {},
    pieStartAngle: 0,
  };

  private sunRiseSet: SunRiseSet;
  private chartRecord = [];

  constructor(
    private locationService: LocationService,
    private timeAcquisitionService: TimeAcquisitionService,
    private timeConversionService: TimeConversionService,
    private dateService: DateService,
  ) { }

  ngOnInit() {
    this.getLocation();
  }

  private getLocation() {
    // 位置情報を取得する
    this.locationService.getLocation().subscribe(location => {
      this.latitude = location.coords.latitude;
      this.longitude = location.coords.longitude;
      // 日の出・日の入り時刻を取得する
      this.getSunRiseSet();
    });
  }

  /**
   * 日の出・日の入り時刻を取得する
   */
  private getSunRiseSet() {
    this.timeAcquisitionService.getSunRiseSetTime(
      new Date(),
      this.latitude,
      this.longitude
    ).then(sunRiseSet => {
      this.sunRiseSet = sunRiseSet;
      this.sunRise = this.sunRiseSet.sunrise;
      this.sunSet = this.sunRiseSet.sunset;
      this.getEdotimeAxis();
    }).catch(error => console.log(error));
  }

  /**
   * 不定時法をパイチャートで表現するための各刻の区切り線を求める
   */
  private getEdotimeAxis() {
    this.edotimeAxis = this.timeConversionService.getEdoTimeAxis(this.sunRise, this.sunSet);
    // 不定時法の24時間を描画する
    console.log('>>>>this.edotimeAxis.length => ' + this.edotimeAxis.length);
    for (let i = 0; i < this.edotimeAxis.length; i++) {
      const kokuEto = this.edotimeAxis[i].koku + '(' + this.edotimeAxis[i].eto + ')';
      const interval = this.edotimeAxis[i].minutesInterval;
      this.chartRecord = [kokuEto, interval];
      console.log('this.chartRecord => ' + this.chartRecord);
      this.pie_ChartData.push(this.chartRecord);
    }
    console.log('this.pie_ChartData => ' + this.pie_ChartData);
    this.pie_ChartOptions.pieStartAngle = this.edotimeAxis[0].angle;  // 0時を真上にする
    this.highlightCurrentTime();
  }

  /**
   * 現在時刻に対応するスライスを目立たせる
   */
  private highlightCurrentTime() {
    const hhmm = this.dateService.formatDate(this.currentTime, 'hh:mm');
    console.log('hhmm => ' + hhmm);
    console.log('this.pie_ChartData.length => ' + this.pie_ChartData.length);
    let slice = 0;
    for (let i = 0; i <= this.pie_ChartData.length; i++) {
      console.log('this.edotimeAxis[' + i + '].startTimeHM => ' + this.edotimeAxis[i].startTimeHM);
      if (i === (this.pie_ChartData.length - 2)) {
        console.log('最終スライス');
        if (hhmm > this.edotimeAxis[i].startTimeHM &&
          hhmm <= this.edotimeAxis[0].startTimeHM) {
          slice = i;
          break;
        }
      }
      console.log('this.edotimeAxis[' + (i + 1) + '].startTimeHM => ' + this.edotimeAxis[i + 1].startTimeHM);
      if (this.edotimeAxis[i].startTimeHM < this.edotimeAxis[i + 1].startTimeHM) {
        console.log('昇順');
        if (hhmm > this.edotimeAxis[i].startTimeHM &&
          hhmm <= this.edotimeAxis[i + 1].startTimeHM) {
          slice = i;
          break;
        }
      } else {
        console.log('降順');
        // 00:00を含むスライスの場合
        if (hhmm > this.edotimeAxis[i].startTimeHM &&
          hhmm <= '23:59') {
          slice = i;
          break;
        }
        if (hhmm >= '00:00' &&
          hhmm <= this.edotimeAxis[i + 1].startTimeHM) {
          slice = i;
          break;
        }
      }
    }
    // todo
    console.log('slice => ' + slice);
    this.pie_ChartOptions.slices[slice] = { offset: 0.2 };
    this.pie_ChartOptions.colors[slice] = '0ff390';
  }
}
