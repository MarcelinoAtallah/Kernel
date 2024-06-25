import { Component, ElementRef, Input, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'v-highcharts',
  templateUrl: './v-highcharts.component.html',
  styleUrls: ['./v-highcharts.component.css']
})
export class VHighChartsComponent implements OnInit {
  @Input() options: Highcharts.Options;
  @Input() Highcharts: typeof Highcharts;

  constructor(private elementRef: ElementRef) {}

  ngOnInit(): void {
    // Disable credits in the chart options
    if (!this.options.credits) {
      this.options.credits = { enabled: false };
    }
    
    this.Highcharts.chart(this.elementRef.nativeElement.querySelector('.chart-container'), this.options);
  }
}
