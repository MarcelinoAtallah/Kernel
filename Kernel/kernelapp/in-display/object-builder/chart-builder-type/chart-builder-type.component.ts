import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Inject } from '@angular/core';
import { CommonFunctions } from 'src/app/Kernel/common/CommonFunctions';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { FormGroup, FormControl } from '@angular/forms';
import { GlobalConstants } from 'src/app/Kernel/common/GlobalConstants';
import { DataService } from 'src/app/Kernel/services/data.service';
import { InformationService } from 'src/app/Kernel/services/information.service';
import Highcharts from 'highcharts';
import Highcharts3D from 'highcharts/highcharts-3d';
Highcharts3D(Highcharts);

@Component({
  selector: 'app-chart-builder-type',
  templateUrl: './chart-builder-type.component.html',
  styleUrls: ['./chart-builder-type.component.css']
})
export class ChartBuilderTypeComponent implements OnInit {
  Highcharts: typeof Highcharts = Highcharts;

  public getQueryName = GlobalConstants.getQueryNameApi;
  public addChart = GlobalConstants.addChartApi;
  public getRowDate: string;
  public actionType: string = 'add';
  public legends: number;
  public chartData: any[] = [];
  public itemsData: any[] = [];
  public agGridSelectedNodes: any = '';
  public chartId: any;
  public isUpdate: boolean = false;
  constructor(private http: HttpClient,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public commonFunctions: CommonFunctions,
    private dialog: MatDialog,
    private dataservice: DataService,
    public informationservice: InformationService) { }
  chartObject: any;
  newChartObject:any;
  stockObject:any;
  isAdvanced: any;
  isSource: any;
  chartType: String = "";
  chartForm: any = new FormGroup({
    title: new FormControl(''),
    query: new FormControl(''),
    Row: new FormControl(''),
    Column: new FormControl(''),
    is3d: new FormControl(''),
    isHorizental: new FormControl(''),
    isShowLegend: new FormControl(''),
    isSerie: new FormControl(''),
    isDrilldown: new FormControl(''),


  });


  ngOnInit(): void {

    this.actionType = this.dataservice.getactionType();

    if (this.actionType == 'update') {
      this.chartId = this.informationservice.getAgGidSelectedNode();
      this.isSource = 1;
      this.isAdvanced = 1;

      this.isUpdate = true;

      this.http.get<any>(GlobalConstants.getSelectChartApi + this.chartId, { headers: GlobalConstants.headers }).subscribe(
        (res: any) => {
          if (res.status == 'Fail') {
          } else {
            let toggleshowlegendValue;
            let toggleIs3dValue;
            let toggleIsHorizontalValue;
            let toggleisDrilldownValue;

            if (res[0].is3d == 1) {
              toggleIs3dValue = true;
            } else {
              toggleIs3dValue = false;
            }

            if (res[0].drilldown == 1) {
              toggleisDrilldownValue = true;
            } else {
              toggleisDrilldownValue = false;
            }
            if (res[0].isShowLegend == 1) {
              toggleshowlegendValue = true;
            } else {
              toggleshowlegendValue = false;
            }
            if (res[0].isHorizental == 1) {
              toggleIsHorizontalValue = true;
            } else {
              toggleIsHorizontalValue = false;
            }
            this.chartForm.get("title").setValue(res[0].chartName);
            this.chartForm.get("query").setValue(res[0].query);
            this.chartForm.get("Row").setValue(res[0].chartHTitle);
            this.chartForm.get("Column").setValue(res[0].chartVTitle);
            this.chartForm.get("is3d").setValue(toggleIs3dValue);
            this.chartForm.get("isHorizental").setValue(toggleIsHorizontalValue);
            this.chartForm.get("isShowLegend").setValue(toggleshowlegendValue);
            this.chartForm.get("isDrilldown").setValue(toggleisDrilldownValue);
            this.chartData = JSON.parse(res[1].data);
            for (let i = 0; i < this.chartData.length; i++) {


              setTimeout(() => {
                this.itemsData[this.chartData[i].index] = { id: this.chartData[i].id, type: this.chartData[i].type, value: this.chartData[i].value, mode: this.chartData[i].mode, formData: this.chartData[i].formData };
              }, 1000);

            }
          }
        });

    }
    var sdata = [
      [1483228800000, 50.11],
      [1483315200000, 50.23],
      [1483401600000, 50.42],
      [1483660800000, 50.38],
      [1483747200000, 50.69],
      // Add more data points here...
  ];
  this.stockObject =[{
    rangeSelector: {
      selected: 1
  },
  title: {
      text: 'Stock Price'
  },
  series: [{
      name: 'Stock Price',
      data: sdata,
      tooltip: {
          valueDecimals: 2
      }
  }]
  }];
    this.newChartObject = [
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
  
  },{
        chart: { type: 'pie' },
        title: { text: 'Fruit Consumption' },
        series: [{
          name: 'Fruits',
          data: [
            { name: 'Apples', y: 10 },
            { name: 'Oranges', y: 20 },
            { name: 'Bananas', y: 30 },
            { name: 'Grapes', y: 40 }
          ],
        }]
      }, {
        chart: {type: 'bar'},
        title: {text: 'Employee Performance'},
        xAxis: {
          categories: ['Alexander', 'Marie', 'Maximilian', 'Sophia', 'Lukas']
        },
        yAxis: {
          title: {
            text: 'Sales'
          }
        },
        series: [{
          name: 'Sales',
          data: [107, 31, 635, 203, 215],
        }]
      },{
        chart: { type: 'line' },
        title: { text: 'Monthly Revenue' },
        xAxis: {
          categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        },
        yAxis: {
          title: {
            text: 'Revenue (in USD)'
          }
        },
        series: [{
          name: '2024',
          data: [12000, 15000, 18000, 17000, 19000, 22000, 25000, 24000, 23000, 21000, 20000, 18000],
        }]
      },{
        chart: { type: 'area' },
        title: { text: 'Website Traffic' },
        xAxis: {
          categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        },
        yAxis: {
          title: {
            text: 'Visitors'
          }
        },
        series: [{
          name: '2024',
          data: [3000, 4000, 3500, 5000, 4500, 6000, 7000, 7500, 8000, 6500, 6000, 5000],
        }]
      }, {
        chart: { type: 'scatter' },
        title: { text: 'Height vs Weight' },
        xAxis: {
          title: {
            text: 'Height (cm)'
          }
        },
        yAxis: {
          title: {
            text: 'Weight (kg)'
          }
        },
        series: [{
          name: 'Individuals',
          data: [[167, 60], [170, 65], [175, 70], [180, 75], [185, 80], [190, 85], [195, 90], [200, 95]],
        }]
      },{
          chart: { type: 'column' },
          title: { text: 'Pareto Chart' },
          xAxis: [{ categories: ['Defect A', 'Defect B', 'Defect C', 'Defect D', 'Defect E']}],
          yAxis: [{
            title: { text: 'Frequency' }
          }, {
            title: { text: 'Cumulative Percentage' },
            opposite: true
          }],
          tooltip: { shared: true },
          series: [{
            name: 'Defects',
            type: 'column',
            data: [30, 20, 15, 10, 5]
          }, {
            name: 'Cumulative Percentage',
            type: 'line',
            yAxis: 1,
            data: [30, 50, 65, 75, 80],
            zIndex: 10,
            dashStyle: 'ShortDot'
          }]
        }, {
        chart: {
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
            data: [
                ['Chrome', 63.86],
                ['Edge', 17.97],
                ['Firefox', 10.52],
                ['Safari', 4.98],
                ['Internet Explorer', 1.90],
                ['Other', 0.77]
            ]
        }]
    }
    
   ];

  }

  onQueryChange(newValue: any)
  {
    // Handle the change event here
    this.getRowDate = GlobalConstants.rowSourceApi + localStorage.getItem("agGidSelectedLookup_(query)_id");
  }

  Next() {
    var sum = 0;

    if (this.chartForm.controls['title']?.value == "" || this.chartForm.controls['Row']?.value == "" || this.chartForm.controls['Column']?.value == "" || this.chartForm.controls['query']?.value == "") {
    } else {
      sum++;
    }
    this.isAdvanced = sum;
  }

  nextTab(type: any) {
    this.chartType = type;
    var sum = 0
    sum++;
    this.isSource = sum;
  }
  toggle() {
    if (this.chartForm.get("isShowLegend").value == 'true') {
      this.legends = 1;
    } else this.legends = 0;
  }
  submit() {
    let toggleshowlegendValue;
    let toggleIs3dValue;
    let toggleIsHorizontalValue;
    let toggleisDrilldownValue;
    let type;
    if (this.chartForm.get("isShowLegend").value == true) {
      toggleshowlegendValue = 1;
    } else {
      toggleshowlegendValue = 0;
    }
    if (this.chartForm.get("is3d").value == true) {
      toggleIs3dValue = 1;
    } else {
      toggleIs3dValue = 0;
    }
    if (this.chartForm.get("isHorizental").value == true) {
      toggleIsHorizontalValue = 1;
    } else {
      toggleIsHorizontalValue = 0;
    }
    if (this.chartForm.get("isDrilldown").value == true) {
      toggleisDrilldownValue = 1;
    } else {
      toggleisDrilldownValue = 0;
    }
    if (this.chartType == "heatmap") {
      type = 1;
    } else if (this.chartType == "pie") {
      type = 2;
    } else if (this.chartType == "bar") {
      type = 3;
    } else if (this.chartType == "line") {
      type = 4;
    } else if (this.chartType == "area") {
      type = 5;
    } else if (this.chartType == "scatter") {
      type = 6;
    } else if (this.chartType == "column") {
      type = 7;
    }else if (this.chartType == "semiPie") {
      type = 8;
    }
    if (this.actionType == 'update') {
      let selectedNodes = this.informationservice.getAgGidSelectedNode();
      let allData = {
        chartId: this.informationservice.getAgGidSelectedNode(),
        chartName: this.chartForm.get("title").value,
        // objectKpiId: 0,
        query: localStorage.getItem("agGidSelectedLookup_(query)_id"),
        // chartSize:"",
        chartHTitle: this.chartForm.get("Row").value,
        chartVTitle: this.chartForm.get("Column").value,
        showLegend: toggleshowlegendValue,
        is3d: toggleIs3dValue,
        isHorizontal: toggleIsHorizontalValue,
        userId: this.informationservice.getLogeduserId(),
        queryFieldName: localStorage.getItem("agGidSelectedLookup_(query)_name"),
        serieType: 0,
        drilldown: toggleisDrilldownValue,
        drilldownType: 1,
        chartType: type,
      }
      this.http.post<any>(GlobalConstants.updateChartApi, allData, { headers: GlobalConstants.headers }).subscribe(
        (res: any) => {
          this.commonFunctions.navigateToPage("/dsp/chartBuilder");
          this.commonFunctions.reloadPage("/dsp/chartBuilder");
        })
    } else {
      
      this.agGridSelectedNodes = localStorage.getItem('agGidSelectedLookup_(Row)_id');
      let allData = {
        chartName: this.chartForm.get("title").value,
        // objectKpiId:"",
        query: localStorage.getItem("agGidSelectedLookup_(query)_id"),
        // chartSize:"",
        chartHTitle: this.chartForm.get("Column").value,
        chartVTitle: this.chartForm.get("Row").value,
        showLegend: toggleshowlegendValue,
        is3d: toggleIs3dValue,
        isHorizontal: toggleIsHorizontalValue,
        userId: this.informationservice.getLogeduserId(),
        // fieldName:this.chartForm.get("Row").value,
        queryFieldName: localStorage.getItem("agGidSelectedLookup_(query)_name"),
        drilldown: toggleisDrilldownValue,
        drilldownType: 1,
        chartType: type,
      }
      this.http.post<any>(GlobalConstants.addChartApi, allData, { headers: GlobalConstants.headers }).subscribe(
        (res: any) => {
          this.commonFunctions.navigateToPage("/dsp/chartBuilder");
          this.commonFunctions.reloadPage("/dsp/chartBuilder");
        })
    }

    this.closeDialog();
  }
  closeDialog() {
    this.dialog.closeAll();
  }


}