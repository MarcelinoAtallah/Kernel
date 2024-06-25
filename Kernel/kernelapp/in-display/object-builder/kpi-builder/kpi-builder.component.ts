import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { GlobalConstants } from 'src/app/Kernel/common/GlobalConstants';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { AgColumns } from 'src/app/Kernel/common/AGColumns';
import { CommonFunctions } from 'src/app/Kernel/common/CommonFunctions';
import { KpiBuilderFormComponent } from '../kpi-builder-form/kpi-builder-form.component';
import { DataService } from 'src/app/Kernel/services/data.service';
import { ButtonRendererComponent } from './buttonRenderer.components';
import { ChartBuilderFormComponent } from '../chart-builder-form/chart-builder-form.component';
import { KpiBuilderPreviewComponent } from '../kpi-builder-preview/kpi-builder-preview.component';
import { InformationService } from 'src/app/Kernel/services/information.service';

@Component({
  selector: 'app-kpi-builder',
  templateUrl: './kpi-builder.component.html',
  styleUrls: ['./kpi-builder.component.css']
})
export class KpiBuilderComponent implements OnInit {
  public getQueryName = GlobalConstants.getQueryNameApi;
  public getKpiData = GlobalConstants.getKpiDataApi;
  public agGridSelectedNodes: any = '';
  public kpiId: any;
  public isUpdate: boolean = false;
  public agColumns: AgColumns[] = [];
  public agColumnsJson: any;
  public action: any;
  frameworkComponents: any;


  kpiForm = new FormGroup({
    title: new FormControl(''),
    query: new FormControl(''),
    grid: new FormControl(''),
    chart: new FormControl(''),
    report: new FormControl(''),
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
        headerName: 'ID',
        field: 'kpiId',
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
    dialogConfig.width = '700px';
    dialogConfig.height = '700px';

    const dialogRef = this.dialog.open(KpiBuilderFormComponent, {
      // data: info,
      width: '70%',
      height: '70%',
    });

  }


  onRunButtonClick(e: any) {
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



  onUpdateClick() {
    this.action = 'update';
    if (this.informationservice.getAgGidSelectedNode().includes(",") || this.informationservice.getAgGidSelectedNode() == "") {

    } else {
      this.dataservice.setactionType(this.action);
      const dialogConfig = new MatDialogConfig();
      dialogConfig.width = '700px';
      dialogConfig.height = '700px';

      const dialogRef = this.dialog.open(KpiBuilderFormComponent, {
        // data: info,
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
          this.http.delete<any>(GlobalConstants.deleteKpiApi + selectedNodes[i],
            { headers: GlobalConstants.headers }).subscribe({
              next: (res) => {
                this.commonFunctions.reloadPage('/dsp/kpiBuilder');

              },
              error: (error) => {
                console.log(error);
              }
            });
        }
      } else {
        this.http.delete<any>(GlobalConstants.deleteKpiApi + selectedNodes,
          { headers: GlobalConstants.headers }).subscribe({
            next: (res) => {
              this.commonFunctions.reloadPage('/dsp/kpiBuilder');
            },
            error: (error) => {
              console.log(error);
            }
          });
      }
    }

  }


}

