import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';

/**
 * 日の出・日の入り時刻を計算する。
 * 
 * Go packageあり：https://github.com/bwolf/suncal
 * 上記を使用して、自前でWebサービスを立ち上げることで柔軟な対応が可能
 * 
 */

@Injectable()
export class TimeAcquisitionService {

  constructor() { }

  /**
   * 日の出・日の入り時刻を計算する
   * 
   * date: 日付
   * lat: 緯度
   * lng: 経度
   * 
   * return: hhmm&hhmm
   */
  public getSunRiseSetTime(date: any, lat: string, lng: string): string {
    const yy = date.getFullYear();
    const mm = date.getMonth() + 1;
    const dd = date.getDate();
    const i = 9; // グリニッジ時刻との時差
    const la = lat; // 緯度
    const lo = lng; // 経度
    const alt = 0; // 標高

    let sunRise: string;
    let sunSet: string;
    let t = this.jy(yy, mm, dd - 1, 23, 59, 0, i);
    let th = this.sh(t, 23, 59, 0, lo, i);
    let ds = this.spds(t);
    let ls = this.spls(t);
    let alp = this.spal(t);
    let dlt = this.spdl(t);
    let pht = this.soal(la, th, alp, dlt);
    let pdr = this.sodr(la, th, alp, dlt);

    for (let hh = 0; hh < 24; hh++) {
      for (let m = 0; m < 60; m++) {
        t = this.jy(yy, mm, dd, hh, m, 0, i);
        th = this.sh(t, hh, m, 0, lo, i);
        ds = this.spds(t);
        ls = this.spls(t);
        alp = this.spal(t);
        dlt = this.spdl(t);
        const ht = this.soal(la, th, alp, dlt);
        const dr = this.sodr(la, th, alp, dlt);
        const tt = this.eandp(alt, ds);
        const t1 = tt - 18;
        const t2 = tt - 12;
        const t3 = tt - 6;
        const t4 = this.sa(alt, ds);
        // Solar check 
        // 0: non, 1: astronomical twilight start , 2: voyage twilight start,
        // 3: citizen twilight start, 4: sun rise, 5: meridian, 6: sun set,
        // 7: citizen twilight end, 8: voyage twilight end,
        // 9: astronomical twilight end
        // if ((pht < t1) && (ht > t1)) ans += hh + "時" + m + "分 天文薄明始まり\n";
        // if ((pht < t2) && (ht > t2)) ans += hh + "時" + m + "分 航海薄明始まり\n";
        // if ((pht < t3) && (ht > t3)) ans += hh + "時" + m + "分 市民薄明始まり\n";
        if ((pht < t4) && (ht > t4)) {
          // ans += hh + "時" + m + "分 日出(方位" + Math.floor(dr) + "度)\n";
          sunRise = hh + ':' + mm;
        }
        // if ((pdr < 180) && (dr > 180)) ans += hh + "時" + m + "分 南中(高度" + Math.floor(ht) + "度)\n";
        if ((pht > t4) && (ht < t4)) {
          // ans += hh + "時" + m + "分 日没(方位" + Math.floor(dr) + "度)\n";
          sunSet = hh + ':' + mm;
        }
        // if ((pht > t3) && (ht < t3)) ans += hh + "時" + m + "分 市民薄明終わり\n";
        // if ((pht > t2) && (ht < t2)) ans += hh + "時" + m + "分 航海薄明終わり\n";
        // if ((pht > t1) && (ht < t1)) ans += hh + "時" + m + "分 天文薄明終わり\n";
        pht = ht;
        pdr = dr;
      }
    }
    return sunRise + '&' + sunSet;
  }

  // sin using degree
  private sind(d) {
    return Math.sin(d * Math.PI / 180);
  }
  // cos using degree
  private cosd(d) {
    return Math.cos(d * Math.PI / 180);
  }
  // tan using degree
  private tand(d) {
    return Math.tan(d * Math.PI / 180);
  }
  // calculate Julius year (year from 2000/1/1, for variable "t")
  private jy(yy, mm, dd, h, m, s, i) { // yy/mm/dd h:m:s, i: time difference
    yy -= 2000;
    if (mm <= 2) {
      mm += 12;
      yy--;
    }
    let k = 365 * yy + 30 * mm + dd - 33.5 - i / 24 + Math.floor(3 * (mm + 1) / 5)
      + Math.floor(yy / 4) - Math.floor(yy / 100) + Math.floor(yy / 400);
    k += ((s / 60 + m) / 60 + h) / 24; // plus time
    k += (65 + yy) / 86400; // plus delta T
    return k / 365.25;
  }
  // solar position1 (celestial longitude, degree)
  private spls(t) { // t: Julius year
    let l = 280.4603 + 360.00769 * t
      + (1.9146 - 0.00005 * t) * this.sind(357.538 + 359.991 * t)
      + 0.0200 * this.sind(355.05 + 719.981 * t)
      + 0.0048 * this.sind(234.95 + 19.341 * t)
      + 0.0020 * this.sind(247.1 + 329.640 * t)
      + 0.0018 * this.sind(297.8 + 4452.67 * t)
      + 0.0018 * this.sind(251.3 + 0.20 * t)
      + 0.0015 * this.sind(343.2 + 450.37 * t)
      + 0.0013 * this.sind(81.4 + 225.18 * t)
      + 0.0008 * this.sind(132.5 + 659.29 * t)
      + 0.0007 * this.sind(153.3 + 90.38 * t)
      + 0.0007 * this.sind(206.8 + 30.35 * t)
      + 0.0006 * this.sind(29.8 + 337.18 * t)
      + 0.0005 * this.sind(207.4 + 1.50 * t)
      + 0.0005 * this.sind(291.2 + 22.81 * t)
      + 0.0004 * this.sind(234.9 + 315.56 * t)
      + 0.0004 * this.sind(157.3 + 299.30 * t)
      + 0.0004 * this.sind(21.1 + 720.02 * t)
      + 0.0003 * this.sind(352.5 + 1079.97 * t)
      + 0.0003 * this.sind(329.7 + 44.43 * t);
    while (l >= 360) { l -= 360; }
    while (l < 0) { l += 360; }
    return l;
  }
  // solar position2 (distance, AU)
  private spds(t) { // t: Julius year
    let r = (0.007256 - 0.0000002 * t) * this.sind(267.54 + 359.991 * t)
      + 0.000091 * this.sind(265.1 + 719.98 * t)
      + 0.000030 * this.sind(90.0)
      + 0.000013 * this.sind(27.8 + 4452.67 * t)
      + 0.000007 * this.sind(254 + 450.4 * t)
      + 0.000007 * this.sind(156 + 329.6 * t);
    r = Math.pow(10, r);
    return r;
  }
  // solar position3 (declination, degree)
  private spal(t) { // t: Julius year
    const ls = this.spls(t);
    const ep = 23.439291 - 0.000130042 * t;
    let al = Math.atan(this.tand(ls) * this.cosd(ep)) * 180 / Math.PI;
    if ((ls >= 0) && (ls < 180)) {
      while (al < 0) { al += 180; }
      while (al >= 180) { al -= 180; }
    } else {
      while (al < 180) { al += 180; }
      while (al >= 360) { al -= 180; }
    }
    return al;
  }
  // solar position4 (the right ascension, degree)
  private spdl(t) { // t: Julius year
    const ls = this.spls(t);
    const ep = 23.439291 - 0.000130042 * t;
    const dl = Math.asin(this.sind(ls) * this.sind(ep)) * 180 / Math.PI;
    return dl;
  }
  // Calculate sidereal hour (degree)
  private sh(t, h, m, s, l, i) { // t: julius year, h: hour, m: minute, s: second,
    // l: longitude, i: time difference
    const d = ((s / 60 + m) / 60 + h) / 24; // elapsed hour (from 0:00 a.m.)
    let th = 100.4606 + 360.007700536 * t + 0.00000003879 * t * t - 15 * i;
    th += l + 360 * d;
    while (th >= 360) { th -= 360; }
    while (th < 0) { th += 360; }
    return th;
  }
  // Calculating the seeming horizon altitude "sa"(degree)
  private eandp(alt, ds) { // subprivate for altitude and parallax
    const e = 0.035333333 * Math.sqrt(alt);
    const p = 0.002442818 / ds;
    return p - e;
  }
  private sa(alt, ds) { // alt: altitude (m), ds: solar distance (AU)
    const s = 0.266994444 / ds;
    const r = 0.585555555;
    const k = this.eandp(alt, ds) - s - r;
    return k;
  }
  // Calculating solar alititude (degree) {
  private soal(la, th, al, dl) { // la: latitude, th: sidereal hour,
    // al: solar declination, dl: right ascension
    let h = this.sind(dl) * this.sind(la) + this.cosd(dl) * this.cosd(la) * this.cosd(th - al);
    h = Math.asin(h) * 180 / Math.PI;
    return h;
  }
  // Calculating solar direction (degree) {
  private sodr(la, th, al, dl) { // la: latitude, th: sidereal hour,
    // al: solar declination, dl: right ascension
    const t = th - al;
    const dc = - this.cosd(dl) * this.sind(t);
    const dm = this.sind(dl) * this.sind(la) - this.cosd(dl) * this.cosd(la) * this.cosd(t);
    let dr;
    if (dm === 0) {
      const st = this.sind(t);
      if (st > 0) {
        dr = -90;
      }
      if (st === 0) {
        dr = 9999;
      }
      if (st < 0) {
        dr = 90;
      }
    } else {
      dr = Math.atan(dc / dm) * 180 / Math.PI;
      if (dm < 0) {
        dr += 180;
      }
    }
    if (dr < 0) {
      dr += 360;
    }
    return dr;
  }

}
