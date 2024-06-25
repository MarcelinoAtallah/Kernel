import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { EventEmitterService } from 'src/app/Kernel/services/event-emitter.service';
import { CommonFunctions } from 'src/app/Kernel/common/CommonFunctions';

import * as Highcharts from 'highcharts';
import HC_heatmap from 'highcharts/modules/heatmap';
// import { Chart } from 'angular-highcharts';
HC_heatmap(Highcharts); // enable the Heatmap series module

@Component({
  selector: 'VChartHeatmapComponent',
  templateUrl: './v-chart-heatmap.component.html',
  styleUrls: ['./v-chart-heatmap.component.css']
})
export class VChartHeatmapComponent implements OnInit {
  [x: string]: any;
  Highcharts: typeof Highcharts = Highcharts;

  myTooltip: any;

  allSelectedPoints: any[];

  @Input() public dataApi!: any;
  apiList: any[] = [];
  xLabeling: string[] = [];

  constructor(
    private http: HttpClient,
    private commonFunctions: CommonFunctions,
    private eventEmitterService: EventEmitterService,
    public datepipe: DatePipe
  ) {}

  ngOnInit(): void {}

  ngOnChanges(): void {
    this.init();
  }

  init(): void {
    if (!this.dataApi) return;

    this.apiList = [];
    this.xLabeling = [];
    this.allSelectedPoints = [];
    this.http.get<any>(this.dataApi).subscribe((res: any) => {
      console.log("res >>>>> ", res);
      for (let i = 0; i < res.length; i++) {
        this.apiList.push({
          x: parseInt(res[i].X),
          y: parseInt(res[i].Y),
          values: parseInt(res[i].VALUESS),
          days: res[i].DAYS,
          dates: res[i].DATES,
          times: res[i].TIMES
        });
      }
       // Assign apiList to a variable
    const apiList = this.apiList;

      console.log("apiList >>>>> ", this.apiList);
      let chart = Highcharts.chart('container',  {
        chart: {
          type: 'heatmap',
          marginTop: 0,
          marginBottom: 80,
          height: '40%',

          borderColor: null
        },
        title: {
          text: null
        },
        series: [
          {
            name: '',
            borderWidth: 0,
            type: 'heatmap',
            data: this['getData'](),
            dataLabels: {
              enabled: true,
              style: {
                textOutline: 'none',
                textShadow: 'none',
                fontSize: '15px',
                fontWeight: '100',
                color: '#4878A4',
                fill: '#4878A4',
                fontFamily: 'calibri'
              }
            },
            states: {
              hover: {
                color: '#D8B7B4',
              },
            }
          }
        ],
        xAxis: {
          categories: this['getXCategories'](),
          labels: {
            style: {
              fontSize: '12px',
              color: '#78819e',
              gridLineWidth: 0,
            },
            padding: 0
          },
          gridLineWidth: 0,
        },
        yAxis: {
          categories: this['getYCategories'](),
          title: null,
          labels: {
            style: {
                fontSize: '12px',
                color: '#78819e',
                gridLineWidth: 0,

              },
              padding: 0
            },
            gridLineWidth: 0,
          },
          colorAxis: {
            stops: [
              [0, '#bf8882'], [0.5, '#fffbbc'], [0.9, '#c4463a'], [1, '#8c1111']
            ],
          },
          legend: {

            align: 'center',
            layout: 'horizontal',//to specify where to locate the legend
            margin: 0,
            verticalAlign: 'bottom',
            y: 20,
            symbolHeight: 12,
            width: 200,
          },
          tooltip: {
            headerFormat: '<span style="font-size: 14px">{point.category} - at {point.time}</span><br/>',
            pointFormat: '<span style="font-size: 12px"><b>Value:</b> {point.value}</span>',
            formatter: function () {

              return ('<b>' + this.series.xAxis.categories[this.point.x] +
                    '</b> at <br/><b>' + this.series.yAxis.categories[this.point.y] +
                    '</b> visited <br/><b>' + this.point.value + '</b>');

            },
            enabled: true,
            backgroundColor:'#888888', //works on hover
            borderColor:null,//this is a lighter color than that in Kernel #555

          },

          plotOptions: {
            //chart configuration
            heatmap: {
              pointPadding: 0,//0 in order not to display lines between the cells

            },

            series: {
              cursor: 'pointer',
              dataLabels: {
                enabled: true,

              }
            }
          }

        });

      }
    );
  }
  getData() {
    console.log("4- this is getData");
    console.log("5- this is Lapi",this.apiList);
    try {
      const secmappingValues = this.apiList.map((item: { x: any; y: any; values: any }) => {
        return {
          x: item.x,
          y: item.y,
          value: item.values
        }
      });
      console.log("6-this is the getData",secmappingValues);
      return secmappingValues;
    } catch (error) {
      console.log("An error occurred while fetching data:", error);
      return [];
    }
  };


  getXCategories() {

    console.log("7- this is getXCategories");

    console.log("8- this is L",this.apiList);
    try {
      let firstLabeling = this.apiList.map((item: { days: any; dates: any; }) => {
        return {
          key: item.days + " " + item.dates
        }
      });

      firstLabeling = this.commonFunctions.removeDuplicatesFromArrayByProperty(firstLabeling, "key")
      console.log("firstLabeling >>>>>> ", firstLabeling);
      for (const obj of firstLabeling) {
        const values = Object.values(obj);
        this.xLabeling.push(values[0]);
      }

      console.log("9-this is the getData",this.xLabeling);
      return this.xLabeling;
    } catch (error) {
      console.log("An error occurred while fetching data:", error);
      return [];
    }
  }

  getYCategories() {
    return ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'];
  }

}
