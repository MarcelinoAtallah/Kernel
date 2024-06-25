import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-v-gauge',
  templateUrl: './v-gauge.component.html',
  styleUrls: ['./v-gauge.component.css']
})
export class VGaugeComponent implements OnInit {


  
  constructor() { }

  ngOnInit(): void {
  }
  @Input() gaugeType :any;
  @Input() gaugeValue :any;
  @Input() gaugeLabel :any;
  @Input() gaugeAppendText :any;
  @Input() Title :any;

  
  thresholdConfig = {
    '0': {color: 'green'},
    '40': {color: 'orange'},
    '75.5': {color: 'red'}
};

openSelected1() {
  $("#clicktitle").click();

}
  // gaugeType:any = "arch";
  // gaugeValue:any = 28.3;
  // gaugeLabel:any = "Speed";
  // gaugeAppendText:any = "km/hr";

}
