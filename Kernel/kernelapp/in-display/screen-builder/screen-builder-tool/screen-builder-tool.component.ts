import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { GlobalConstants } from 'src/app/Kernel/common/GlobalConstants';
import { AgColumns } from 'src/app/Kernel/common/AGColumns';
import { Subscription } from 'rxjs';
import { reservedWord, string } from 'sql-formatter/lib/src/lexer/regexFactory';
import { CellRenderer } from './cellRenderer';
import { ButtonRendererComponent } from 'src/app/Kernel/kernelapp/qbe/query-builder/buttonRenderer.component';
import { EventEmitterService } from 'src/app/Kernel/services/event-emitter.service';
import { FormGroup, FormControl } from '@angular/forms';
import { ApplicationListComponent } from './application-list/application-list.component';
import { ParentMenuListComponent } from './parent-menu-list/parent-menu-list.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http';
import { CommonFunctions } from 'src/app/Kernel/common/CommonFunctions';
import { ActivatedRoute, Router } from '@angular/router';
import { PreviewScreenComponent } from './preview-screen/preview-screen.component';
import { ChartBuilderFormComponent } from '../../object-builder/chart-builder-form/chart-builder-form.component';
import { KpiBuilderPreviewComponent } from '../../object-builder/kpi-builder-preview/kpi-builder-preview.component';
import { GridBuilderPreviewComponent } from '../../object-builder/grid-builder-preview/grid-builder-preview.component';
import { ChartFromKpiBuilderComponent } from '../../object-builder/chart-from-kpi-builder/chart-from-kpi-builder.component';
import Highcharts from 'highcharts';
import Highcharts3D from 'highcharts/highcharts-3d';
Highcharts3D(Highcharts);


declare var CKEDITOR: any;
import { InformationService } from 'src/app/Kernel/services/information.service';

@Component({
  selector: 'app-screen-builder-tool',
  templateUrl: './screen-builder-tool.component.html',
  styleUrls: ['./screen-builder-tool.component.css']
})
export class ScreenBuilderToolComponent implements OnInit {
  @ViewChild("editorElement") editorElement: ElementRef;
  Highcharts: typeof Highcharts = Highcharts;


  public isEditor: any;
  public isForm: any;
  public gridCellRender: AgColumns[] = [];
  public agColumns: AgColumns[] = [];
  public agColumnsJson: any;
  public agColumns1: AgColumns[] = [];
  public agColumnsJson1: any;
  public agColumns2: AgColumns[] = [];
  public agColumnsJson2: any;
  public agColumns3: AgColumns[] = [];
  public agColumnsJson3: any;
  public content: any;
  public agGridSelectedNodes: any = '';
  public comboDatasource = [{}];
  subsVar: Subscription;
  public inDisplayGrid = GlobalConstants.fetchInDispMappingApi;
  public fetchGridsTableData = GlobalConstants.fetchGridsTableData;
  public getAllChartScreenBuilder = GlobalConstants.getAllChartScreenBuilder;
  public getAllGridScreenBuilder = GlobalConstants.getAllGridScreenBuilder;
  public getAllKpiScreenBuilder = GlobalConstants.getAllKpiScreenBuilder;
  public getGridQueryData: any;

  public isUpdate: boolean = false;
  frameworkComponents: any;
  frameworkComponents1: any;
  public status: any;
  public screenId: any;
  public showPanel: boolean = true;
  public showForm: boolean = false;
  public showGrid: boolean = false;
  public showChart: boolean = false;
  public showKpi: boolean = false;
  public actionType: any = '';
  public gridData: any;

  public objectId: any;


  // editorConfig = {
  //   startupMode: 'source',
  //   extraPlugins: 'sourcearea', // Include the sourcearea plugin
  //   forcePasteAsPlainText: true
  // };


  public itemsData: any[] = [];

  showRightButtons = true;
  arrowDirection: string = 'fa-arrow-left';

  public screenData: any[] = [];

  public chartData: any[] = [];
  public formData: any[] = [];
  ids: string[] = [];
  names: number[] = [];
  chartValue: any[] = [];
  chartObject: any[] = [];
  newChartObject: any[] = [];
  barRecords: any[] = [];
  radarRecords: any[] = [];
  chartType: any;
  gridObject: any[] = [];

  constructor(private sanitizer: DomSanitizer, private dialog: MatDialog,
    private eventEmitterService: EventEmitterService,
    private snackBar: MatSnackBar,
    private http: HttpClient,
    private commonFunctions: CommonFunctions,
    private _Activatedroute: ActivatedRoute,
    private route: Router,
    public informationservice: InformationService

  ) {

    this.onRunButtonClick = this.onRunButtonClick.bind(this);
    this.onRunCellButtonClickGrid = this.onRunCellButtonClickGrid.bind(this);
    this.onRunCellButtonClickChart = this.onRunCellButtonClickChart.bind(this);
    this.onRunCellButtonClickKpi = this.onRunCellButtonClickKpi.bind(this);
    this.frameworkComponents = {
      cellRenderer: CellRenderer,
      buttonRenderer: ButtonRendererComponent
    };



    this.onRunButtonClickChart = this.onRunButtonClickChart.bind(this);
    this.onRunButtonClickGrid = this.onRunButtonClickGrid.bind(this);

    // this.frameworkComponents1 = {
    //   buttonRenderer: ButtonRendererComponent,
    // };
  }


  screenForm = new FormGroup({
    screenName: new FormControl(''),
    screenIsTemplate: new FormControl(''),
    screenApplication: new FormControl(''),
    screenParentMenu: new FormControl(''),
    screenIsSuspended: new FormControl(''),
    screenParentMenuId: new FormControl(''),
    screenApplicationId: new FormControl(''),
    nextAction: new FormControl(''),

  });



  ngOnInit(): void {



    this._Activatedroute.paramMap.subscribe((params) => {

      this.screenId = params.get('id');

      this.actionType = params.get('actionType');
    });


    if (this.actionType == 'update') {
      this.isUpdate = true;

      this.http.get<any>(GlobalConstants.getScreenData + this.screenId, { headers: GlobalConstants.headers }).subscribe(
        (res: any) => {
          if (res.status == 'Fail') {
          } else {

            this.screenForm.controls['screenName'].setValue(res[0].screenName);
            // this.screenForm.controls['screenIsTemplate'].setValue(res[0].screenIsTemplate);
            this.screenForm.controls['screenApplication'].setValue(res[0].screenApplication);
            this.screenForm.controls['screenParentMenu'].setValue(res[0].screenParentMenu);
            if (res[0].screenIsSuspended == 'Active') {
              this.screenForm.controls['screenIsSuspended'].setValue(false);
            } else {
              this.screenForm.controls['screenIsSuspended'].setValue(true);
            }
            if (res[0].nextAction == 'false') {
              this.screenForm.controls['nextAction'].setValue(false);
            } else {
              this.screenForm.controls['nextAction'].setValue(true);
            }
            this.screenForm.controls['screenParentMenuId'].setValue(res[0].screenParentMenuId);
            this.screenForm.controls['screenApplicationId'].setValue(res[0].screenApplicationId);
            this.screenData = JSON.parse(res[1].data);
            for (let i = 0; i < this.screenData.length; i++) {


              setTimeout(() => {
                this.itemsData[this.screenData[i].index] = { id: this.screenData[i].id, type: this.screenData[i].type, value: this.screenData[i].value, mode: this.screenData[i].mode, formData: this.screenData[i].formData };
              }, 1000);

            }
          }
        });

    }

    this.agColumnsJson = [
      {
        headerName: '',
        field: '',
        defaultMinWidth: '40',
        maxWidth: '40',
        cellRenderer: 'cellRenderer',
        cellRendererParams: {
          onClick: this.onRunButtonClick.bind(this),
          label: 'Click 1'
        }
      },
      {
        headerName: 'Menu Name',
        field: 'menuName',
        filter: 'agTextColumnFilter',
        sortable: true,
        defaultMinWidth: '180',
        maxWidth: '300',

      },
      {
        headerName: 'Sequence Id',
        field: 'objectId',
        defaultMinWidth: '180',
        maxWidth: '300',
        filter: 'agTextColumnFilter',
        sortable: true
      }
    ]

    this.agColumnsJson1 = [
      {
        headerName: '',
        field: '',
        defaultMinWidth: '40',
        maxWidth: '40',
        cellRenderer: 'cellRenderer',
        cellRendererParams: {
          onClick: this.onRunCellButtonClickGrid.bind(this),
          label: 'Click 1'
        }
      },
      {
        headerName: 'Id',
        field: 'GRID_ID',
        filter: 'agTextColumnFilter',
        sortable: true,
        defaultMinWidth: '180',
        maxWidth: '300',

      },
      {
        headerName: 'Grid Name',
        field: 'GRID_NAME',
        defaultMinWidth: '180',
        maxWidth: '300',
        filter: 'agTextColumnFilter',
        sortable: true
      },
      {
        headerName: 'Preview',
        field: '',
        cellRenderer: 'buttonRenderer',
        cellRendererParams: {
          onClick: this.onRunButtonClickGrid.bind(this),
          label: 'Click 1'
        }
      }
    ]

    this.agColumnsJson2 = [
      {
        headerName: '',
        field: '',
        defaultMinWidth: '40',
        maxWidth: '40',
        cellRenderer: 'cellRenderer',
        cellRendererParams: {
          onClick: this.onRunCellButtonClickChart.bind(this),
          label: 'Click 1'
        }
      },
      {
        headerName: 'Id',
        field: 'CHART_ID',
        filter: 'agTextColumnFilter',
        sortable: true,
        defaultMinWidth: '180',
        maxWidth: '300',

      },
      {
        headerName: 'Chart Name',
        field: 'CHART_NAME',
        defaultMinWidth: '180',
        maxWidth: '300',
        filter: 'agTextColumnFilter',
        sortable: true
      },
      {
        headerName: 'Preview',
        field: '',
        cellRenderer: 'buttonRenderer',
        cellRendererParams: {
          onClick: this.onRunButtonClickChart.bind(this),
          label: 'Click 1'
        }
      }

    ]



    this.agColumnsJson3 = [
      {
        headerName: '',
        field: '',
        defaultMinWidth: '40',
        maxWidth: '40',
        cellRenderer: 'cellRenderer',
        cellRendererParams: {
          onClick: this.onRunCellButtonClickKpi.bind(this),
          label: 'Click 1'
        }
      },
      {
        headerName: 'Id',
        field: 'KPI_ID',
        filter: 'agTextColumnFilter',
        sortable: true,
        defaultMinWidth: '180',
        maxWidth: '300',

      },
      {
        headerName: 'Kpi Name',
        field: 'KPI_NAME',
        defaultMinWidth: '180',
        maxWidth: '300',
        filter: 'agTextColumnFilter',
        sortable: true
      },
      {
        headerName: 'Preview',
        field: '',
        cellRenderer: 'buttonRenderer',
        cellRendererParams: {
          onClick: this.onRunButtonClickKpi.bind(this),
          label: 'Click 1'
        }
      }

    ]


    this.agColumns.push(this.agColumnsJson);
    this.agColumns1.push(this.agColumnsJson1);
    this.agColumns2.push(this.agColumnsJson2);
    this.agColumns3.push(this.agColumnsJson3);

  }

  onRunButtonClickChart(e: any) {
    let info = {};
    let type = {};
    
    this.agGridSelectedNodes = this.informationservice.getAgGidSelectedNode();
    let selectedNodes = this.agGridSelectedNodes;
    if (this.informationservice.getAgGidSelectedNode().includes(",") || this.informationservice.getAgGidSelectedNode() == "") {

    } else {
      
      this.http.post<any>(GlobalConstants.getQueryData + this.informationservice.getAgGidSelectedNode(), { headers: GlobalConstants.headers }).subscribe(
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


    }
  }

  onRunButtonClickGrid(e: any) {
    let info = {};
    let type = {};
    
    this.agGridSelectedNodes = this.informationservice.getAgGidSelectedNode();
    let selectedNodes = this.agGridSelectedNodes;
    if (this.informationservice.getAgGidSelectedNode().includes(",") || this.informationservice.getAgGidSelectedNode() == "") {

    } else {

      this.http.post<any>(GlobalConstants.decodeGridQuery + selectedNodes, { headers: GlobalConstants.headers }).subscribe(
        (res: any) => {
          info = {
            data: res,
            
            id: this.informationservice.getAgGidSelectedNode(),
            flag: 0
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


    }
  }

  onRunButtonClickKpi(e: any) {
    let info = {};
    
    this.agGridSelectedNodes = this.informationservice.getAgGidSelectedNode();
    let selectedNodes = this.agGridSelectedNodes;
    if (this.informationservice.getAgGidSelectedNode().includes(",") || this.informationservice.getAgGidSelectedNode() == "") {

    } else {

      this.http.post<any>(GlobalConstants.decodeKpiQuery + selectedNodes, { headers: GlobalConstants.headers }).subscribe(
        (res: any) => {
          info = {
            data: res,
            
            kpiId: this.informationservice.getAgGidSelectedNode()
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


  addForm() {
    this.showForm = true;
    this.showPanel = false;
    this.showGrid = false;
  }

  goBack() {
    this.showPanel = true;
    this.showForm = false;
    this.showGrid = false;
    this.showChart = false;
    this.showKpi = false;

  }

  addEditor() {
    this.itemsData.push({ id: this.generateSerial(), type: 'Editor', value: '', mode: 'wysiwyg', formData: '' });
  }

  addGrid() {
    this.showGrid = true;
    this.showPanel = false;
    this.showForm = false;
    this.showChart = false;
    this.showKpi = false;
  }

  addChart() {
    this.showChart = true;
    this.showPanel = false;
    this.showForm = false;
    this.showGrid = false;
    this.showKpi = false;
  }
  addKpi() {
    this.showKpi = true;
    this.showPanel = false;
    this.showForm = false;
    this.showGrid = false;
    this.showChart = false;
  }

  toggleRightButtons() {
    this.showRightButtons = !this.showRightButtons;
    this.arrowDirection = this.showRightButtons ? 'fa-arrow-left' : 'fa-arrow-right';
  }




  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.itemsData, event.previousIndex, event.currentIndex);

    for (let i = 0; i < this.itemsData.length; i++) {
    }
  }

  // showScreenBuilderList(list :any){
  //   for(let i=0;list.size();i++){
  //     this.sanitizeHtml(list[i]);
  //   }
  // }

  sanitizeHtml(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }


  onRunButtonClick(e: any) {
    if (this.informationservice.getAgGidSelectedNode().includes(",") || this.informationservice.getAgGidSelectedNode() == "") {
    } else {
      setTimeout(() => {
        
        this.http.get<any>(GlobalConstants.getAllTabs + this.informationservice.getAgGidSelectedNode(), {
          headers: GlobalConstants.headers,
        }).subscribe((res: any) => {
          for (let i = 0; i < res.length; i++) {
            this.formData.push({
              "tableName": res[i].menuName,
              "canAdd": res[i].canAdd,
              "canDelete": res[i].canDelete,
              "canModify": res[i].canModify,
              "isAdvancedSearch": res[i].isAdvancedSearch,
              "isQueryForm": res[i].isQueryForm,
              "isDynamicReport": res[i].isDynamicReport,
              "isGrid": res[i].isGrid,
              "isReadOnly": res[i].isReadOnly,
              "objectId": res[i].objectId
            })

          }
        },
        );
        
        this.itemsData.push({ id: this.generateSerial(), type: 'Form', value: this.informationservice.getAgGidSelectedNode(), mode: '', formData: this.formData });
      }, 50);
      setTimeout(() => {

        this.formData = []
          ;
      }, 100);

    }
  }









  onRunCellButtonClickGrid(e: any) {
    let info = {};
    this.gridCellRender = [];
    this.gridObject = [];
    if (this.informationservice.getAgGidSelectedNode().includes(",") || this.informationservice.getAgGidSelectedNode() == "") {
    } else {
      setTimeout(() => {
        this.http.post<any>(GlobalConstants.decodeGridQuery + this.informationservice.getAgGidSelectedNode(), { headers: GlobalConstants.headers }).subscribe(
          (res: any) => {
            this.gridCellRender.push(res);
            this.getGridQueryData = GlobalConstants.getGridQueryData + this.informationservice.getAgGidSelectedNode();
            this.gridObject.push(
              [this.gridCellRender],
              [this.getGridQueryData]
            );

          });


      }, 100);
      this.itemsData.push({
        formData: this.gridObject,
        id: this.generateSerial(),
        mode: "",
        type: "Grid",
        
        value: this.informationservice.getAgGidSelectedNode()
      })
    }

  }

  onRunCellButtonClickChart(e: any) {
    let info = {};
    if (this.informationservice.getAgGidSelectedNode().includes(",") || this.informationservice.getAgGidSelectedNode() == "") {
    } else {
      
      this.http.post<any>(GlobalConstants.getQueryData + this.informationservice.getAgGidSelectedNode(), { headers: GlobalConstants.headers }).subscribe(
        (res: any) => {
          if (res.chartType == 1) {
            this.chartType = 'heatmap';
          } else if (res.chartType == 2) {
            this.chartType = 'pie';
          } else if (res.chartType == 3) {
            this.chartType = 'bar';
          } else if (res.chartType == 4) {
            this.chartType = 'line';
          } else if (res.chartType == 5) {
            this.chartType = 'area';
          } else if (res.chartType == 6) {
            this.chartType = 'scatter';
          } else if (res.chartType == 7) {
            this.chartType = 'column';
          }else if (res.chartType == 8) {
            this.chartType = 'semiPie';
          }
        
          // for (let j = 0; j < res.records.length; j++) {
          //   this.ids.push(res.records[j].ID);
          //   this.names.push(res.records[j].NAME);
          // }

      //    let ids = this.ids
          
////////////////////////////////////////////////////////////////////////////
          if (this.chartType == 'heatmap') {
              this.newChartObject= [{
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
            
            }];
          } else if (this.chartType == 'pie') {
            for (let j = 0; j < res.records.length; j++) {
              console.log(res.records[j])
              this.ids.push(res.records[j].NAME);
              this.names.push(Number(res.records[j].Y));
            }
            let data1 = this.names.map((id, index) => {
              return { name: this.ids[index], y: id };
            });
            const transformedData = res.records.map((item:any) => [item.NAME, parseFloat(item.Y)]);
console.log('data1>>>>>>>>>>',data1)
console.log('transformedData>>>>>>>>>>',transformedData)

            if(res.is3d == 1){
              this.newChartObject  = [{
                chart: {
                  type: 'pie',
                  options3d: {
                      enabled: true,
                      alpha: 45
                  }
              },
              title: {
                  text: res.records[0].TITLE,
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
            }
         else{
            this.newChartObject= [
              {
                chart: { type: 'pie' },
                title: { text: res.records[0].TITLE },
                series: [{
                  name: 'Serie',
                  data:data1,
                }]
              }
            ];
          }
          } else if (this.chartType == 'bar') {
            for (let i = 0; i < res.records.length; i++) {
              this.ids.push(res.records[i].ID);
              this.names.push(Number(res.records[i].NAME));
            }
            if(res.is3d == 1){
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
                  title: {text:res.records[0].TITLE},
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
            this.newChartObject= [
              {
                chart: {type: this.chartType},
                title: {text: res.records[0].TITLE},
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
              }];
            }
          }else if(this.chartType == 'line'){
            for (let i = 0; i < res.records.length; i++) {
              this.ids.push(res.records[i].ID);
              this.names.push(Number(res.records[i].NAME));
            }
            if(res.is3d == 1){
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
                    text: res.records[0].TITLE
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
            this.newChartObject= [
              {
                chart: { type: 'line' },
                title: { text: res.records[0].TITLE },
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
              }];
            }
          }else if(this.chartType == 'area'){
            for (let i = 0; i < res.records.length; i++) {
              this.ids.push(res.records[i].ID);
              this.names.push(Number(res.records[i].NAME));
            }
            if(res.is3d == 1){
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
                  title: { text: res.records[0].TITLE},
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
            this.newChartObject= [
              {
                chart: { type: 'area' },
                title: { text: res.records[0].TITLE },
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
              }];}
            //done
          }else if(this.chartType == 'scatter'){
            for(let i = 0 ; i< res.records.length ; i++){
              this.names.push(Number(res.records[i].NAME));
            }
            if(res.is3d == 1){
              this.newChartObject = [
                {
                  chart: { type: 'scatter'},
                  title: { text:res.records[0].TITLE },
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
              ]}else{
            this.newChartObject= [
              {
                chart: { type: 'scatter' },
                title: { text: res.records[0].TITLE },
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
            ];
          }
          }else if(this.chartType =='semiPie'){
            const transformedData = res.records.map((item:any) => [item.ID, parseFloat(item.NAME)]);

            if(res.is3d == 1){
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
                  text: res.records[0].TITLE,
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
            this.newChartObject = [
           {  chart: {
              plotBackgroundColor: null,
              plotBorderWidth: 0,
              plotShadow: false,
              type:'semiPie'
          },
          title: {
              text: res.records[0].TITLE ,
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
              data:transformedData
          }]
      }];}
          }else if(this.chartType == 'column'){
            for(let i = 0 ; i< res.records.length ; i++){
              this.names.push(Number(res.records[i].NAME));
            }
            if(res.is3d == 1){
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
                  text: res.records[0].TITLE,
                  align: 'left'
              },
              subtitle: {
                  text: res.records[0].TITLE,
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
            this.newChartObject = [{
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
            }];
          }
          } else {
            // this.chartObject.push([
            //   [this.chartType],
            //   ids,
            //   [{ data: this.names, backgroundColor: ['green', 'red', 'blue', 'pink', 'orange', 'DarkKhaki', 'Lavender', 'Lime'], }],
            //   res.records[0].TITLE
            // ])
          }
          this.itemsData.push({
            formData: this.newChartObject,
            id: this.generateSerial(),
            mode: "",
            type: "Chart",
            
            value: this.informationservice.getAgGidSelectedNode()
          })
          this.ids = [];
          this.names = [];
          this.chartData = this.newChartObject;
          //  this.newChartObject = [];


        });
     

    }
  }



  onRunCellButtonClickKpi(e: any) {
    let info = {};
    let info1 = {};
    if (this.informationservice.getAgGidSelectedNode().includes(",") || this.informationservice.getAgGidSelectedNode() == "") {
    } else {
      setTimeout(() => {
        this.http.post<any>(GlobalConstants.decodeKpiQuery + this.informationservice.getAgGidSelectedNode(), { headers: GlobalConstants.headers }).subscribe(
          (res: any) => {
            
            this.http.post<any>(GlobalConstants.getKpiQueryData + this.informationservice.getAgGidSelectedNode(), { headers: GlobalConstants.headers }).subscribe(
              (res1: any) => {
            info = {
              formData: {Headers:res,
                        Records:res1},
              id: this.generateSerial(),
              mode: "",
              type: "Kpi",
              
              value: this.informationservice.getAgGidSelectedNode()
            }
            this.itemsData.push(info);
          });
        });
      },
        50);
        
    


    }

  }


  openChart(data:any){
    this.http.post<any>(GlobalConstants.selectChartRelatedToKpi + data.value, { headers: GlobalConstants.headers }).subscribe(
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
    this.http.post<any>(GlobalConstants.selectGridRelatedToKpi + data.value, { headers: GlobalConstants.headers }).subscribe(
      (res:any) => {
          this.gridData ={data: res,
          flag:1}
            setTimeout(() => {
              const dialogConfig = new MatDialogConfig();
              dialogConfig.width = '500px';
              dialogConfig.height = '600px';
      
              const dialogRef = this.dialog.open(GridBuilderPreviewComponent, {
                data: this.gridData,
                width: '50%',
                height: '60%',
              });
            }, 1000);
      });
  }


















  editorChange(i: number, serial: string) {
    let editor = CKEDITOR.instances['editor' + (i + 1)];
    for (let i = 0; i < this.itemsData.length; i++) {
      if (this.itemsData[i].id == serial) {

        if (editor.mode == 'source') {
          this.itemsData[i].mode = 'source';
          this.itemsData[i].value = editor.getData();

          //this.itemsData[i].value is set automatically

        } else if (editor.mode == 'wysiwyg') {
          this.itemsData[i].mode = 'wysiwyg';
        }
      }
    }
  }

  generateSerial() {

    'use strict';

    var chars = '1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',

      serialLength = 10,

      randomSerial = "",

      i,

      randomNumber;

    for (i = 0; i < serialLength; i = i + 1) {

      randomNumber = Math.floor(Math.random() * chars.length);

      randomSerial += chars.substring(randomNumber, randomNumber + 1);

    }

    return randomSerial;
  }

  submitScreenForm() {
    if (this.screenForm.get('screenIsSuspended').value) {
      this.status = 'Suspended';
    } else {
      this.status = 'Active';
    };

    if (this.screenForm.get('nextAction').value) {
      this.status = 'nextAction';
    } else {
      this.status = 'false';
    };

    for (let i = 0; i < this.itemsData.length; i++) {
      this.screenData.push({
        index: i,
        id: this.itemsData[i].id,
        type: this.itemsData[i].type,
        value: this.itemsData[i].value,
        mode: this.itemsData[i].mode,
        formData: this.itemsData[i].formData

      });
    }
    if (this.screenData.length == 0) {
      this.showSnackBar('The Screen Is Empty');
    } else {

      let chartData = {
        screenName: this.screenForm.get('screenName').value,
        isTemplate: this.screenForm.get('screenIsTemplate').value,
        application: this.screenForm.get('screenApplication').value,
        parentMenu: this.screenForm.get('screenParentMenu').value,
        isSuspended: this.status,
        nextAction: this.status,
        parentMenuId: this.screenForm.get('screenParentMenuId').value,
        applicationId: this.screenForm.get('screenApplicationId').value,
        userId: this.informationservice.getLogeduserId(),
        data: JSON.stringify(this.screenData)
      }
      this.http.post<any>(GlobalConstants.addScreen, chartData, { headers: GlobalConstants.headers }).subscribe(
        (res: any) => {
          this.showSnackBar('Screen Saved');
          this.commonFunctions.navigateToPage("/dsp/augmentedConfigScratch");
        })
    };


  }

  removeScreenElement(serial: string) {
    for (let i = 0; i < this.itemsData.length; i++) {
      if (this.itemsData[i].id == serial) {
        this.itemsData.splice(i, 1);
      }
    }
  }

  showApplicationList() {

    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '700px';
    dialogConfig.height = '700px';

    const dialogRef = this.dialog.open(ApplicationListComponent, {
      // data: info,
      width: '40%',
      height: '70%',
    });


    dialogRef.afterClosed().subscribe(result => {
      
      if (this.informationservice.getAgGidSelectedNode() != '') {
        let json = JSON.parse(this.informationservice.getAgGidSelectedNode());
        this.screenForm.controls['screenApplicationId'].setValue(json[0].code);

        this.screenForm.controls['screenApplication'].setValue(json[0].application);

        this.screenForm.controls['screenParentMenuId'].setValue('');
        this.screenForm.controls['screenParentMenu'].setValue('');
      }
    });

  }


  showParentMenu() {
    if (this.screenForm.controls['screenApplicationId'].value != '' && this.screenForm.controls['screenApplication'].value != '') {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.width = '700px';
      dialogConfig.height = '700px';

      const dialogRef = this.dialog.open(ParentMenuListComponent, {
        data: this.screenForm.controls['screenApplicationId'].value,
        width: '40%',
        height: '70%',
      });


      dialogRef.afterClosed().subscribe(result => {
        
        if (this.informationservice.getAgGidSelectedNode() != '') {
          
          let jsonMenu = JSON.parse(this.informationservice.getAgGidSelectedNode());
          this.screenForm.controls['screenParentMenuId'].setValue(jsonMenu[0].menu_code);

          this.screenForm.controls['screenParentMenu'].setValue(jsonMenu[0].menu_name);

        }
      });
    } else {
      this.showSnackBar('Missing: Application');
    }
  }


  showSnackBar(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      verticalPosition: 'top',
      horizontalPosition: 'center',
      panelClass: ['my-snackbar'],
    });
  }

  updateScreenForm() {
    this.screenData = [];
    for (let i = 0; i < this.itemsData.length; i++) {
     
      this.screenData.push({
        index: i,
        id: this.itemsData[i].id,
        type: this.itemsData[i].type,
        value: this.itemsData[i].value,
        mode: this.itemsData[i].mode,
        formData: this.itemsData[i].formData
            });
    }
    if (this.screenData.length == 0) {
      this.showSnackBar('The Screen Is Empty');
    } else {

      let allData = {
        screenId: this.screenId,
        screenName: this.screenForm.get('screenName').value,
        isTemplate: this.screenForm.get('screenIsTemplate').value,
        application: this.screenForm.get('screenApplication').value,
        parentMenu: this.screenForm.get('screenParentMenu').value,
        isSuspended: this.screenForm.get('screenIsSuspended').value,
        nextAction: this.screenForm.get('nextAction').value,
        parentMenuId: this.screenForm.get('screenParentMenuId').value,
        applicationId: this.screenForm.get('screenApplicationId').value,
        userId: this.informationservice.getLogeduserId(),
        data: JSON.stringify(this.screenData)
      }
      this.http.post<any>(GlobalConstants.updateScreen, allData, { headers: GlobalConstants.headers }).subscribe(
        (res: any) => {
          this.showSnackBar('Screen Updated');
          this.commonFunctions.navigateToPage("/dsp/augmentedConfigScratch");
        })
    };


  }

  showPreview() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '700px';
    dialogConfig.height = '700px';

    const dialogRef = this.dialog.open(PreviewScreenComponent, {
      data: this.itemsData,
      width: '95%',
      height: '95%',
    });

    // dialogRef.afterClosed().subscribe(result => {

    //   if(this.informationservice.getAgGidSelectedNode()!=''){
    //   let json=JSON.parse(this.informationservice.getAgGidSelectedNode());
    //   this.screenForm.controls['screenApplicationId'].setValue(json[0].code);

    //   this.screenForm.controls['screenApplication'].setValue(json[0].application);

    // this.screenForm.controls['screenParentMenuId'].setValue('');
    // this.screenForm.controls['screenParentMenu'].setValue('');
    //   }
    // });

  }

}
