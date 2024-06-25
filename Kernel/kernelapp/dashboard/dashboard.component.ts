import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { GlobalConstants } from '../../common/GlobalConstants';
import { HttpClient } from '@angular/common/http';
import { CommonFunctions } from '../../common/CommonFunctions';
import { AgColumns } from 'src/app/Kernel/common/AGColumns';
import { Subscription } from 'rxjs';
import { EventEmitterService } from '../../services/event-emitter.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ChartBuilderFormComponent } from '../in-display/object-builder/chart-builder-form/chart-builder-form.component';
import { GridBuilderPreviewComponent } from '../in-display/object-builder/grid-builder-preview/grid-builder-preview.component';
import { KpiBuilderPreviewComponent } from '../in-display/object-builder/kpi-builder-preview/kpi-builder-preview.component';
import { ChartFromKpiBuilderComponent } from '../in-display/object-builder/chart-from-kpi-builder/chart-from-kpi-builder.component';
import { InformationService } from 'src/app/Kernel/services/information.service';
import Highcharts from 'highcharts';
import Highcharts3D from 'highcharts/highcharts-3d';
Highcharts3D(Highcharts);

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class DashboardComponent implements OnInit {
  Highcharts: typeof Highcharts = Highcharts;

  public subsVar: Subscription;
  public showDashboard: boolean;
  constructor(private http: HttpClient,
    private eventEmitterService: EventEmitterService,
    public commonFunctions: CommonFunctions,
    private dialog: MatDialog,
    public informationservice: InformationService) { }
  public agColumns: AgColumns[] = [];
  public agColumnsJson: any;
  Labels: any[];
  Datasets: any[];
  Type: any[];
  chartObject: any[] = [];
  types: any[] = [];
  public tabs: any[];
  chartType: any;
  kpiHeader: any[] = [];
  kpiRecords: any[] = [];
  gridHeader: any[] = [];
  gridRecords: any[] = [];
  ids: string[] = [];
  names: number[] = [];
  chartValue: any[] = [];
  kpiValue: any[] = [];
  allData: any[] = [];
  gridValue: any[] = [];
  barRecords: any[] = [];
  radarRecords: any[] = [];
  public chartData :any;
  public gridData: any;
  transformedData: { NAME: string, Y: number }[] = [];

  newChartObject:any;



  ngOnInit(): void {
    this.http.post<any>(GlobalConstants.getDashboardTemplateTab + this.informationservice.getLogeduserId(), { headers: GlobalConstants.headers }).subscribe(
      (res: any) => {
        this.tabs = res;
      })

    this.subsVar = this.eventEmitterService.onTabActionClick.subscribe(() => {
      this.showDashboard = false;
      this.onSelectTab();
      setTimeout(() => {
        this.showDashboard = true;
      }, 1000);
    });
  }
  onSelectTab() {
    this.http.post<any>(GlobalConstants.displayDashboard + this.informationservice.getSelectedTabId(), { headers: GlobalConstants.headers }).subscribe(
      (res: any) => {
        this.allData = res;

        for (let i = 0; i < this.allData.length; i++) {
          if (this.allData[i].type == 'Chart') {
            this.chartValue.push(this.allData[i]);
          }
          if (this.allData[i].type == 'Grid') {
            this.gridValue.push(this.allData[i]);
          }

        }

        for (let i = 0; i < this.gridValue.length; i++) {
          this.gridHeader.push(this.gridValue[i].Header);
          this.gridRecords.push(this.gridValue[i].Records);
        }
        this.agColumnsJson = this.gridHeader;


        for (let i = 0; i < this.allData.length; i++)
        {
          if (this.allData[i].type == 'Chart') {
            if (this.allData[i].data.chartType == 1) {
              this.chartType = 'heatmap';
            } else if (this.allData[i].data.chartType == 2) {
              this.chartType = 'pie';
            } else if (this.allData[i].data.chartType == 3) {
              this.chartType = 'bar';
            } else if (this.allData[i].data.chartType == 4) {
              this.chartType = 'line';
            } else if (this.allData[i].data.chartType == 5) {
              this.chartType = 'area';
            } else if (this.allData[i].data.chartType == 6) {
              this.chartType = 'scatter';
            } else if (this.allData[i].data.chartType == 7) {
              this.chartType = 'column';
            }else if (this.allData[i].data.chartType == 8) {
              this.chartType = 'semiPie';
            }
          
            if (this.chartType == 'bar')
              {
                  for (let j = 0; j < this.allData[i].data.records.length; j++)
                    {
                      this.ids.push(this.allData[i].data.records[j].ID);
                      this.names.push(Number(this.allData[i].data.records[j].NAME));
                    }
  
                    if(this.allData[i].is3d == 1){
                      this.newChartObject = [
                        {
                          chart: {type: this.chartType,
                            options3d: {
                              enabled: true,
                              alpha: 10,
                              beta: 25,
                              depth: 70,
                              viewDistance: 25,
                            }
                          },
                          title: {text:this.allData[i].data.records[0].TITLE},
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
                      ]
                    }else{
                      this.newChartObject = [
                        {
                          chart: {type: this.chartType},
                          title: {text: this.allData[i].data.records[0].TITLE},
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
                      ];
                    }
                 
              }
              else if (this.chartType == 'heatmap') {
                this.newChartObject = [{
                  chart: {
                      type: this.chartType,
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
                      }
                  }],
              
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
              }];
  
              }else if(this.chartType == 'line'){
  
                for (let j = 0; j < this.allData[i].data.records.length; j++)
                  {
                    this.ids.push(this.allData[i].data.records[j].ID);
                    this.names.push(Number(this.allData[i].data.records[j].NAME));
                  }
  
                  if(this.allData[i].is3d == 1){
                    this.newChartObject = [
                      {
                        chart: {
                          type: 'line',
                          options3d: {
                            enabled: true,
                            alpha: 10,
                            beta: 30,
                            depth: 70,
                            viewDistance: 25
                          }
                        },
                        title: {
                          text: this.allData[i].data.records[0].TITLE
                        },
                        xAxis: {
                          categories: this.ids
                        },
                        yAxis: {
                          title: {
                            text: 'Value'
                          }
                        },
                        plotOptions: {
                          line: {
                            depth: 25,
                            marker: {
                              enabled: true,
                              symbol: 'circle',
                              radius: 3
                            }
                          }
                        },
                        series: [{
                          name: 'Series 1',
                          data: this.names
                        }]
                      }
                    ];
                  }else{
                this.newChartObject = [
                  {
                    chart: { type: 'line' },
                    title: { text: this.allData[i].data.records[0].TITLE},
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
                ];
              }
            }else if(this.chartType == 'area')
              {
          
                for (let j = 0; j < this.allData[i].data.records.length; j++)
                  {
                    this.ids.push(this.allData[i].data.records[j].ID);
                    this.names.push(Number(this.allData[i].data.records[j].NAME));
                  }
                  if(this.allData[i].is3d == 1){
                    this.newChartObject = [
                      {
                        chart: { type: 'area',
                          options3d: {
                            enabled: true,
                            alpha: 10,
                            beta: 25,
                            depth: 70,
                            viewDistance: 25
                          } },
                        title: { text: this.allData[i].data.records[0].TITLE},
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
                    ];
                  }else{
                this.newChartObject = [
                  {
                    chart: { type: 'area' },
                    title: { text: this.allData[i].data.records[0].TITLE },
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
                ];
              }
            }else if(this.chartType == 'semiPie')
                {
                  const transformedData = this.allData[i].data.records.map((item:any) => [item.ID, parseFloat(item.NAME)]);
                  if(this.allData[i].is3d == 1){
                    this.newChartObject  = [{
                      chart: {
                        plotBackgroundColor: null,
                        plotBorderWidth: 0,
                        plotShadow: false,
                        type: 'pie',
                        options3d: {
                          enabled: true,
                          alpha: 45,
                          beta: 0
                        }
                      },
                      title: {
                        text: this.allData[i].data.records[0].TITLE,
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
                          innerSize: '50%',
                          depth: 45,
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
                        data:transformedData
                      }]
                      }];
                  }else{
                    this.newChartObject = [{  chart: {
                    plotBackgroundColor: null,
                    plotBorderWidth: 0,
                    plotShadow: false,
                    type:'semiPie'
                },
                title: {
                    text: this.allData[i].data.records[0].TITLE,
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
            }];
                }
               } else if(this.chartType == 'scatter')
                {
                  
                for (let j = 0; j < this.allData[i].data.records.length; j++)
                  {
                    this.ids.push(this.allData[i].data.records[j].ID);
                    this.names.push(Number(this.allData[i].data.records[j].NAME));
                  }   
                  if(this.allData[i].is3d == 1){
                    this.newChartObject = [
                      {
                        chart: { type: 'scatter'},
                        title: { text: this.allData[i].data.records[0].TITLE },
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
                    ]


                  //   options3d: {
                  //     enabled: true,
                  //     alpha: 10,
                  //     beta: 30,
                  //     depth: 250,
                  //     viewDistance: 5,
                  //     fitToPlot: false,
                  //     frame: {
                  //         bottom: { size: 1, color: 'rgba(0,0,0,0.02)' },
                  //         back: { size: 1, color: 'rgba(0,0,0,0.04)' },
                  //         side: { size: 1, color: 'rgba(0,0,0,0.06)' }
                  //     }
                  // }
                  }else{           
                  this.newChartObject = [
                    {
                      chart: { type: 'scatter' },
                      title: { text: this.allData[i].data.records[0].TITLE },
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
                  ];}
                }
                else if(this.chartType == 'column'){
                  
             
                  for (let j = 0; j < this.allData[i].data.records.length; j++)
                    {
                      this.ids.push(this.allData[i].data.records[j].ID);
                      this.names.push(Number(this.allData[i].data.records[j].NAME));
                    }
  
                    if(this.allData[i].is3d == 1){
  
  
                      // this.newChartObject  = [{
                      //   chart: { type: 'column',
                      //     options3d: {
                      //       enabled: true,
                      //       alpha: 15,
                      //       beta: 15,
                      //       depth: 50,
                      //       viewDistance: 25
                      //   }},
                      //   title: { text: this.allData[i].data.records[0].TITLE},
                      //   xAxis: [{ categories: this.ids}],
                      //   yAxis: [{
                      //     title: { text: 'Primary Axis' }
                      //   }, {
                      //     title: { text: 'Pareto' },
                      //     opposite: true
                      //   }],
                      //   tooltip: { shared: true },
                      //   series: [{
                      //     name: 'Primary',
                      //     type: 'column',
                      //     data: this.names
                      //   }, {
                      //     name: 'Pareto',
                      //     type: 'line',
                      //     yAxis: 1,
                      //     data:this.names,
                      //     zIndex: 10,
                      //     dashStyle: 'ShortDot'
                      //   }]
                      // }];

                      this.newChartObject  = [{
                        chart: {
                          renderTo: 'container',
                          type: 'column',
                          options3d: {
                              enabled: true,
                              alpha: 15,
                              beta: 15,
                              depth: 50,
                              viewDistance: 25
                          }
                      },
                      xAxis: {
                          categories:this.ids,
                      },
                      yAxis: {
                          title: {
                              enabled: false
                          }
                      },
                      tooltip: {
                          headerFormat: '<b>{point.key}</b><br>',
                          pointFormat: 'Cars sold: {point.y}'
                      },
                      title: {
                          text: this.allData[i].data.records[0].TITLE,
                          align: 'left'
                      },
                      subtitle: {
                          text: this.allData[i].data.records[0].TITLE,
                          align: 'left'
                      },
                      legend: {
                          enabled: false
                      },
                      plotOptions: {
                          column: {
                              depth: 25
                          }
                      },
                      series: [{
                          data: this.names,
                          colorByPoint: true
                      }]
                      }]
                    }else{
  
                    
                  this.newChartObject  = [{
                    chart: { type: 'column' },
                    title: { text: this.allData[i].data.records[0].TITLE },
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
                  }];}
            
                }
                //done
                else if(this.chartType == 'pie'){
                  console.log(this.allData[i].data.records);
                  let pieData: any[]= [];
                  for (let j = 0; j < this.allData[i].data.records.length; j++) {
                    console.log(this.allData[i].data.records[j])
                    this.ids.push(this.allData[i].data.records[j].NAME);
                    this.names.push(Number(this.allData[i].data.records[j].Y));
                  }
                  let data1 = this.names.map((id, index) => {
                    return { name: this.ids[index], y: id };
                  });

                  if(this.allData[i].is3d == 1){
                    const transformedData = this.allData[i].data.records.map((item:any) => [item.NAME, parseFloat(item.Y)]);

                    this.newChartObject  = [{
                      chart: {
                        type: 'pie',
                        options3d: {
                            enabled: true,
                            alpha: 45
                        }
                    },
                    title: {
                        text: this.allData[i].data.records[0].TITLE,
                        align: 'left'
                    },
                    plotOptions: {
                        pie: {
                            innerSize: 100,
                            depth: 45
                        }
                    },
                    series: [{
                        name: 'Medals',
                        data: transformedData
                    }]
                    }];
                  }else{
  
                  
                  this.newChartObject = [
                    {
                      chart: { type: 'pie' },
                      title: { text: this.allData[i].data.records[0].TITLE },
                      series: [{
                        name: 'Fruits',
                        data:  data1,
                      }]
                    }
                  ];}
                  //done
                }
              else {
    
              }
              this.ids = [];
              this.names = [];
              this.allData[i].data = this.newChartObject;
              this.newChartObject = [];
  
            }
  
    }});
    }


  openChart(data:any){
    this.http.post<any>(GlobalConstants.selectChartRelatedToKpi + data.ID, { headers: GlobalConstants.headers }).subscribe(
      (res:any) => {
          this.chartData = res
  
  setTimeout(() => {
    
  const dialogConfig = new MatDialogConfig();
  dialogConfig.width = '700px';
  dialogConfig.height = '700px';
  
  const dialogRef = this.dialog.open(ChartFromKpiBuilderComponent, {
    data: this.chartData,
    width: '50%',
    height: '60%',
  });
}, 1000);
});

  }
  openGrid(data:any){

    this.http.post<any>(GlobalConstants.selectGridRelatedToKpi + data.ID, { headers: GlobalConstants.headers }).subscribe(
      (res:any) => {
          this.gridData ={data: res,
          flag:1}
            setTimeout(() => {
              const dialogConfig = new MatDialogConfig();
              dialogConfig.width = '1000px';
              dialogConfig.height = '1000px';
      
              const dialogRef = this.dialog.open(GridBuilderPreviewComponent, {
                data: this.gridData,
                width: '80%',
                height: '80%',
              });
            }, 1000);
      });
  }



  onExitButtonClick(data: any) {
    const selectedObject = data.type + '_' + data.ID
    this.http.post<any>(GlobalConstants.deleteSelectedObject + this.informationservice.getSelectedTabId() + '/' + selectedObject, { headers: GlobalConstants.headers }).subscribe(
      (res: any) => {
        this.commonFunctions.reloadPage('/dashboard');
      })
  }

  ngOnDestroy() {
    if (this.subsVar) {
      this.subsVar.unsubscribe()
    }
  }

  openSelected(data: any) {
    let info = {};
    if (data.type == 'Chart') {

      this.http.post<any>(GlobalConstants.getQueryData + data.ID, { headers: GlobalConstants.headers }).subscribe(
        (res: any) => {
          info = res
        });


      setTimeout(() => {

        const dialogConfig = new MatDialogConfig();
        dialogConfig.width = '700px';
        dialogConfig.height = '700px';

        const dialogRef = this.dialog.open(ChartBuilderFormComponent, {
          data: info,
          width: '50%',
          height: '60%',
        });
      }, 1000);
    } else if (data.type == 'Grid') {
      this.http.post<any>(GlobalConstants.decodeGridQuery + data.ID, { headers: GlobalConstants.headers }).subscribe(
        (res: any) => {
          info = {
            data: res,
            id: data.ID,
            flag :0
          };
        });


      setTimeout(() => {

        const dialogConfig = new MatDialogConfig();
        dialogConfig.width = '700px';
        dialogConfig.height = '700px';

        const dialogRef = this.dialog.open(GridBuilderPreviewComponent, {
          data: info,
          width: '50%',
          height: '60%',
        });

      }, 1000);
    } else if (data.type == 'Kpi') {

      this.http.post<any>(GlobalConstants.decodeKpiQuery + data.ID, { headers: GlobalConstants.headers }).subscribe(
        (res: any) => {
          info = {
            data: res,
            kpiId: data.ID
          };
        });


      setTimeout(() => {

        const dialogConfig = new MatDialogConfig();
        dialogConfig.width = '700px';
        dialogConfig.height = '400px';

        const dialogRef = this.dialog.open(KpiBuilderPreviewComponent, {
          data: info,
          width: '50%',
          height: '30%',
        });


      }, 1000);

    }
  }

  drop(event: CdkDragDrop<any[]>) {
    moveItemInArray(this.allData, event.previousIndex, event.currentIndex);
  }

}