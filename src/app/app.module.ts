import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule, JsonpModule } from '@angular/http';

import { AppComponent } from './app.component';

import { LocationService } from './location.service';
import { TimeAcquisitionService } from './time-acquisition.service';
import { TimeConversionService } from './time-conversion.service';
import { GoogleChartDirective } from './directives/angular2-google-chart.directive';
@NgModule({
  declarations: [
    AppComponent,
    GoogleChartDirective
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    JsonpModule,
  ],
  providers: [
    LocationService,
    TimeAcquisitionService,
    TimeConversionService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
