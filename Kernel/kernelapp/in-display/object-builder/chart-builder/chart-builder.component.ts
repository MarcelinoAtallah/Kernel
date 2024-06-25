import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { GlobalConstants } from 'src/app/Kernel/common/GlobalConstants';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { AgColumns } from 'src/app/Kernel/common/AGColumns';
import { CommonFunctions } from 'src/app/Kernel/common/CommonFunctions';
import { ChartBuilderTypeComponent } from '../chart-builder-type/chart-builder-type.component';
import { DataService } from 'src/app/Kernel/services/data.service';
import { ButtonRendererComponent } from './buttonRenderer.component';
import { ChartBuilderFormComponent } from '../chart-builder-form/chart-builder-form.component';
import { data } from 'jquery';
import { InformationService } from 'src/app/Kernel/services/information.service';


@Component({
  selector: 'app-chart-builder',
  templateUrl: './chart-builder.component.html',
  styleUrls: ['./chart-builder.component.css']
})
export class ChartBuilderComponent implements OnInit {
  public getQueryName = GlobalConstants.getQueryNameApi;
  public getChartData = GlobalConstants.getChartDataApi;

  public action: any;
  public agGridSelectedNodes: any = '';
  public agColumns: AgColumns[] = [];
  public agColumnsJson: any;
  frameworkComponents: any;

  chartForm = new FormGroup({
    title: new FormControl(''),
    query: new FormControl(''),

  });

  public isQueryexecute: boolean;
  constructor(private http: HttpClient,
    public commonFunctions: CommonFunctions,
    private dialog: MatDialog,
    private dataservice: DataService,
    public informationservice: InformationService) {

    this.onRunButtonClick = this.onRunButtonClick.bind(this);

    this.frameworkComponents = {
      buttonRenderer: ButtonRendererComponent,
    };
  }

  ngOnInit(): void {

    this.agColumnsJson = [
      {
        headerName: '',
        field: '',
        checkboxSelection: true,
        width: '25px',
        headerCheckboxSelection: true
      }, {
        headerName: 'Chart Id',
        field: 'chartId',
        width: '25px',
      },
      {
        headerName: 'Title',
        field: 'title',
        width: '25px',
      },
      {
        headerName: 'Preview',
        field: '',
        cellRenderer: 'buttonRenderer',
        cellRendererParams: {
          onClick: this.onRunButtonClick.bind(this),
          label: 'Click 1'
        }
      },
      {
        headerName: 'Created by',
        field: 'createdBy',
      },
      {
        headerName: 'Created date',
        field: 'creationDate',

      }

    ];

    this.agColumns.push(this.agColumnsJson);
  }
  onAddClick() {
    this.action = 'add';
    this.dataservice.setactionType(this.action);
    const dialogConfig = new MatDialogConfig();
    const dialogRef = this.dialog.open(ChartBuilderTypeComponent, {
      // data: info,
      width: '80%',
      height: '70%',
    });

  }

  onRunButtonClick(e: any) {
    let info = {};
    let type = {};
    
    this.agGridSelectedNodes = this.informationservice.getAgGidSelectedNode();
    let selectedNodes = this.agGridSelectedNodes;
    if (this.informationservice.getAgGidSelectedNode().includes(",") || this.informationservice.getAgGidSelectedNode() == "") {

    } else {

      this.http.post<any>(GlobalConstants.getQueryData + selectedNodes, { headers: GlobalConstants.headers }).subscribe(
        (res: any) => {
          info = res;
        });


      setTimeout(() => {

        const dialogConfig = new MatDialogConfig();
        dialogConfig.width = '700px';
        dialogConfig.height = '70%';

        const dialogRef = this.dialog.open(ChartBuilderFormComponent, {
          data: info,
          width: '45%',
          height: '70%',
        });
      }, 1000);


    }
  }



  onUpdateClick() {
    this.action = 'update';
    if (this.informationservice.getAgGidSelectedNode().includes(",") || this.informationservice.getAgGidSelectedNode() == "") {

    } else {
      this.dataservice.setactionType(this.action);
      const dialogRef = this.dialog.open(ChartBuilderTypeComponent, {
        data: this.agGridSelectedNodes,
        width: '70%',
        height: '70%',
      });
    }
  }
  onDeleteClick() {
    
    this.agGridSelectedNodes = this.informationservice.getAgGidSelectedNode();
    let selectedNodes = this.agGridSelectedNodes;
    if (selectedNodes.length == 0) {
      console.log('Please select a row to delete');
    } else {
      if (selectedNodes.indexOf(",") != -1) {
        selectedNodes = selectedNodes.split(',');
        for (let i = 0; i < selectedNodes.length; i++) {
          this.http.delete<any>(GlobalConstants.deleteChartApi + selectedNodes[i],
            { headers: GlobalConstants.headers }).subscribe({
              next: (res) => {
                this.commonFunctions.reloadPage('/dsp/chartBuilder');

              },
              error: (error) => {
                console.log(error);
              }
            });
        }
      } else {
        this.http.delete<any>(GlobalConstants.deleteChartApi + selectedNodes,
          { headers: GlobalConstants.headers }).subscribe({
            next: (res) => {
              this.commonFunctions.reloadPage('/dsp/chartBuilder');
            },
            error: (error) => {
              console.log(error);
            }
          });
      }
    }
  }
}

