import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';


import { LocationService } from './location.service';
import { TimeAcquisitionService } from './time-acquisition.service';
import { TimeConversionService } from './time-conversion.service';

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

  constructor(
    private locationService: LocationService,
    private timeAcquisitionService: TimeAcquisitionService,
    private timeConversionService: TimeConversionService,
  ) { }

  ngOnInit() {
    let sunRiseSet: string; // y:m&y:m 日の出時刻&日の入り時刻
    this.locationService.getLocation().subscribe(location => {
      // 位置情報を取得する
      console.log('latitude: ' + location.coords.latitude);
      console.log('longitude: ' + location.coords.longitude);
      this.latitude = location.coords.latitude;
      this.longitude = location.coords.longitude;
      // 日の出・日の入り時刻を取得する
      sunRiseSet = this.timeAcquisitionService.getSunRiseSetTime(
        new Date(),
        this.latitude,
        this.longitude);
      const str = sunRiseSet.split('&');
      this.sunRise = str[0];
      this.sunSet = str[1];
      console.log(sunRiseSet);
    });


    // 江戸時刻を計算する
  }
}
