import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { GlobalConstants } from 'src/app/Kernel/common/GlobalConstants';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { CommonFunctions } from 'src/app/Kernel/common/CommonFunctions';
import { EventEmitterService } from 'src/app/Kernel/services/event-emitter.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import Highcharts from 'highcharts';
import Highcharts3D from 'highcharts/highcharts-3d';
Highcharts3D(Highcharts);

@Component({
  selector: 'app-chart-from-kpi-builder',
  templateUrl: './chart-from-kpi-builder.component.html',
  styleUrls: ['./chart-from-kpi-builder.component.css']
})
export class ChartFromKpiBuilderComponent implements OnInit {
  Highcharts: typeof Highcharts = Highcharts;


  public getQueryName = GlobalConstants.getQueryNameApi;
  public getchartType = GlobalConstants.selectChartType;
  chartObject: any[] = [];
  public agGridSelectedNodes: any = '';
  chartForm = new FormGroup({
    title: new FormControl(''),
    query: new FormControl(''),
    chartType: new FormControl(''),

  });
  barRecords: any[] = [];
  radarRecords: any[] = [];
  constructor(private http: HttpClient, public commonFunctions: CommonFunctions,
    private eventEmitterService: EventEmitterService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog, private snackBar: MatSnackBar,
    private _Activatedroute: ActivatedRoute,
    public datepipe: DatePipe,
    private route: Router) { }
  ids: string[] = [];
  names: number[] = [];
  gaugeType: string[] = [];
  gaugeValue: number[] = [];
  gaugeLabel: string[] = [];
  gaugeAppendText: string[] = [];

  chartType: number;
  ngOnInit(): void {
    for (let i = 0; i < this.data.length; i++) {
      this.chartType = this.data[i].chartType;
      let ids = this.ids
      let chartType1;
      if (this.chartType == 1) {
        chartType1 = 'heatmap';
      } else if (this.chartType == 2) {
      chartType1 = 'pie';
      } else if (this.chartType == 3) {
        chartType1 = 'bar';
      } else if (this.chartType == 4) {
        chartType1 = 'line';
      } else if (this.chartType == 5) {
        chartType1 = 'area';
      } else if (this.chartType == 6) {
        chartType1 = 'scatter';
      } else if (this.chartType == 7) {
        chartType1 = 'column';
      }else if (this.chartType == 8) {
        chartType1= 'semiPie';
      }

      if (chartType1 == 'heatmap') {
        this.chartObject.push(
          {
            chart: {
              type: 'heatmap',
              marginTop: 40,
              marginBottom: 80,
              plotBorderWidth: 1
          },
      
      
          title: {
              text: 'Sales per employee per weekday',
              style: {
                  fontSize: '1em'
              }
          },
      
          xAxis: {
              categories: [
                  'Alexander', 'Marie', 'Maximilian', 'Sophia', 'Lukas',
                  'Maria', 'Leon', 'Anna', 'Tim', 'Laura'
              ]
          },
      
          yAxis: {
              categories: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
              title: null,
              reversed: true
          },
      
          accessibility: {
              point: {
                  descriptionFormat: '{(add index 1)}. ' +
                      '{series.xAxis.categories.(x)} sales ' +
                      '{series.yAxis.categories.(y)}, {value}.'
              }
          },
      
          colorAxis: {
              min: 0,
              minColor: '#FFFFFF',
              maxColor: Highcharts.getOptions().colors[0]
          },
      
          legend: {
              align: 'right',
              layout: 'vertical',
              margin: 0,
              verticalAlign: 'top',
              y: 25,
              symbolHeight: 280
          },
      
          tooltip: {
              format: '<b>{series.xAxis.categories.(point.x)}</b> sold<br>' +
                  '<b>{point.value}</b> items on <br>' +
                  '<b>{series.yAxis.categories.(point.y)}</b>'
          },
      
          series: [{
              name: 'Sales per employee',
              borderWidth: 1,
              data: [
                  [0, 0, 10], [0, 1, 19], [0, 2, 8], [0, 3, 24], [0, 4, 67],
                  [1, 0, 92], [1, 1, 58], [1, 2, 78], [1, 3, 117], [1, 4, 48],
                  [2, 0, 35], [2, 1, 15], [2, 2, 123], [2, 3, 64], [2, 4, 52],
                  [3, 0, 72], [3, 1, 132], [3, 2, 114], [3, 3, 19], [3, 4, 16],
                  [4, 0, 38], [4, 1, 5], [4, 2, 8], [4, 3, 117], [4, 4, 115],
                  [5, 0, 88], [5, 1, 32], [5, 2, 12], [5, 3, 6], [5, 4, 120],
                  [6, 0, 13], [6, 1, 44], [6, 2, 88], [6, 3, 98], [6, 4, 96],
                  [7, 0, 31], [7, 1, 1], [7, 2, 82], [7, 3, 32], [7, 4, 30],
                  [8, 0, 85], [8, 1, 97], [8, 2, 123], [8, 3, 64], [8, 4, 84],
                  [9, 0, 47], [9, 1, 114], [9, 2, 31], [9, 3, 48], [9, 4, 91]
              ],
              dataLabels: {
                  enabled: true,
                  color: '#000000'
              } }],
    
              responsive: {
                  rules: [{
                      condition: {
                          maxWidth: 500
                      },
                      chartOptions: {
                          yAxis: {
                              labels: {
                                  format: '{substr value 0 1}'
                              }
                          }
                      }
                  }]
              }
          })
      } else if (chartType1 == 'pie') {
        for (let j = 0; j < this.data[i].records.length; j++) {
          this.ids.push(this.data[i].records[i].NAME);
          this.names.push(parseInt(this.data[i].records[j].Y));
        }
  
  
        let data1 = this.names.map((id, index) => {
          return { name: this.ids[index], y: id };
        });
    
        this.chartObject.push(
          {
            chart: { type: 'pie' },
            title: { text: this.data[0].records[0].TITLE },
            series: [{
              name: 'Serie',
              data:data1,
            }]
          }
        );
      } else if (chartType1 == 'bar') {
        console.log('ids------>',this.ids);
        console.log('names--------->',this.names)
        for (let j = 0; j < this.data[i].records.length; j++) {
          this.ids.push(this.data[i].records[i].ID);
          this.names.push(Number(this.data[i].records[j].NAME));
        }
        console.log('ids---ad--->',this.ids);
        console.log('names------ad--->',this.names)
        this.chartObject.push(
          {
            chart: {type: chartType1},
            title: {text: this.data[i].records[0].TITLE},
            xAxis: {
              categories: this.ids
            },
            yAxis: {
              title: {
                text: 'Value'
              }
            },
            series: [{
              name: 'Series 1',
              data: this.names,
            }]
          }
        );

      }else if(chartType1 == 'line'){
        for (let j = 0; j < this.data[i].records.length; j++) {
          this.ids.push(this.data[i].records[i].ID);
          this.names.push(Number(this.data[i].records[j].NAME));
        }
        this.chartObject.push(
          {
            chart: { type: 'line' },
            title: { text: this.data[i].records[0].TITLE },
            xAxis: {
              categories: this.ids
            },
            yAxis: {
              title: {
                text: 'Value'
              }
            },
            series: [{
              name: 'Series 1',
              data: this.names,
            }]
          }
        );
      }else if(chartType1 == 'area'){
        for (let j = 0; j < this.data[i].records.length; j++) {
          this.ids.push(this.data[i].records[i].ID);
          this.names.push(Number(this.data[i].records[j].NAME));
        }
        this.chartObject.push(
          {
            chart: { type: 'area' },
            title: { text: this.data[i].records[0].TITLE },
            xAxis: {
              categories: this.ids
            },
            yAxis: {
              title: {
                text: 'Value'
              }
            },
            series: [{
              name: 'Series 1',
              data: this.names,
            }]
          }
        );
      }else if(chartType1 == 'scatter'){
        for (let j = 0; j < this.data[i].records.length; j++) {
          this.ids.push(this.data[i].records[i].ID);
          this.names.push(Number(this.data[i].records[j].NAME));
        }
        this.chartObject.push(
          {
            chart: { type: 'scatter' },
            title: { text: this.data[i].records[0].TITLE },
            xAxis: {
              title: {
                text: 'X Axis'
              }
            },
            yAxis: {
              title: {
                text: 'Y Axis'
              }
            },
            series: [{
              name: 'Series 1',
              data: this.names,
            }]
          }
        );
      }else if(chartType1 =='semiPie'){
        const transformedData = this.data[i].records.map((item:any) => [item.ID, parseFloat(item.NAME)]);
        this.chartObject.push({  chart: {
          plotBackgroundColor: null,
          plotBorderWidth: 0,
          plotShadow: false,
          type:'semiPie'
      },
      title: {
          text: 'Browser<br>shares<br>January<br>2024',
          align: 'center',
          verticalAlign: 'middle',
          y: 60,
          style: {
              fontSize: '1.1em'
          }
      },
      tooltip: {
          pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
      },
      accessibility: {
          point: {
              valueSuffix: '%'
          }
      },
      plotOptions: {
          pie: {
              dataLabels: {
                  enabled: true,
                  distance: -50,
                  style: {
                      fontWeight: 'bold',
                      color: 'white'
                  }
              },
              startAngle: -90,
              endAngle: 90,
              center: ['50%', '75%'],
              size: '110%'
          }
      },
      series: [{
          type: 'pie',
          name: 'Browser share',
          innerSize: '50%',
          data: transformedData
      }]
  });
      }else if(chartType1 == 'column'){
        for (let j = 0; j < this.data[i].records.length; j++) {
          this.ids.push(this.data[i].records[i].ID);
          this.names.push(Number(this.data[i].records[j].NAME));
        }
        this.chartObject.push({
          chart: { type: 'column' },
          title: { text: 'Pareto Chart' },
          xAxis: [{ categories: this.ids}],
          yAxis: [{
            title: { text: 'Primary Axis' }
          }, {
            title: { text: 'Pareto' },
            opposite: true
          }],
          tooltip: { shared: true },
          series: [{
            name: 'Primary',
            type: 'column',
            data: this.names
          }, {
            name: 'Pareto',
            type: 'line',
            yAxis: 1,
            data:this.names,
            zIndex: 10,
            dashStyle: 'ShortDot'
          }]
        });
  
      }  else {

      }
      
      this.chartType = null;
      this.names = [];
      this.ids = [];
    }

  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.chartObject, event.previousIndex, event.currentIndex);

  }


}
