import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { LocationService } from './location.service';
import { TimeAcquisitionService } from './time-acquisition.service';
import { TimeConversionService } from './time-conversion.service';
import { SunRiseSet } from './sunriseset';
import { Edotime } from './edotime';

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
  edotimeNow: Edotime;

  pie_ChartData = [
    ['Task', 'Hours per Day'],
    ['Work', 11],
    ['Eat', 2],
    ['Commute', 2],
    ['Watch TV', 2],
    ['Sleep', 7]];

  pie_ChartOptions = {
    title: 'My Daily Activities',
    width: 900,
    height: 500
  };

  private sunRiseSet: SunRiseSet;

  constructor(
    private locationService: LocationService,
    private timeAcquisitionService: TimeAcquisitionService,
    private timeConversionService: TimeConversionService,
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


  // 江戸時刻の軸を取得する
  private getEdotimeAxis() {
    this.edotimeAxis = this.timeConversionService.getEdoTimeAxis(this.sunRise, this.sunSet);
  }
}


