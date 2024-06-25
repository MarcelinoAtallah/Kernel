import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AgColumns } from 'src/app/Kernel/common/AGColumns';
import { CommonFunctions } from 'src/app/Kernel/common/CommonFunctions';
import { GlobalConstants } from 'src/app/Kernel/common/GlobalConstants';
import { HttpClient } from '@angular/common/http';
import { ButtonRendererComponent } from './buttonRenderer.component';
import { KpiBuilderPreviewComponent } from 'src/app/Kernel/kernelapp/in-display/object-builder/kpi-builder-preview/kpi-builder-preview.component';
@Component({
  selector: 'app-kpi-ratio-popup',
  templateUrl: './kpi-ratio-popup.component.html',
  styleUrls: ['./kpi-ratio-popup.component.css']
})
export class KpiRatioPopupComponent implements OnInit {
  public getDashboardKpiData = GlobalConstants.getDashboardKpiData;
  public agColumnsJson: any;
  public agColumns: AgColumns[] = [];
  public agGridSelectedNodes: any = '';
  frameworkComponents: any;
  constructor(private http: HttpClient,
    public commonFunctions: CommonFunctions,
    private dialog: MatDialog,) {

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
        headerCheckboxSelection: true
      }, {
        headerName: 'Id',
        field: 'id',
      },
      {
        headerName: 'Name',
        field: 'name',
      }, {
        headerName: 'Preview',
        field: '',
        cellRenderer: 'buttonRenderer',
        cellRendererParams: {
          onClick: this.onRunButtonClick.bind(this),
          label: 'Click 1'
        }
      },
      {
        headerName: 'Type',
        field: 'type',
      }

    ];

    this.agColumns.push(this.agColumnsJson);
  }

  onRunButtonClick(e: any) {
    let info = {};
    this.agGridSelectedNodes = localStorage.getItem('agGidSelectedNode');
    let selectedNodes = this.agGridSelectedNodes;

    if (localStorage.getItem("agGidSelectedNode").includes(",") || localStorage.getItem("agGidSelectedNode") == "") {

    } else {

      this.http.post<any>(GlobalConstants.decodeKpiQuery + selectedNodes, { headers: GlobalConstants.headers }).subscribe(
        (res: any) => {
          //console.log(res);
          info = {
            data: res,
            kpiId: localStorage.getItem('agGidSelectedNode')
          };
        });


      setTimeout(() => {

        const dialogConfig = new MatDialogConfig();
        dialogConfig.width = '700px';
        dialogConfig.height = '700px';

        const dialogRef = this.dialog.open(KpiBuilderPreviewComponent, {
          data: info,
          width: '50%',
          height: '60%',
        });


      }, 1000);


    }

  }
  Insert() {
    this.agGridSelectedNodes = localStorage.getItem('agGidSelectedNode');
    let selectedNodes = this.agGridSelectedNodes;
    let allData = {
      kpiId: selectedNodes,
      templateId: localStorage.getItem('selectedTabId')
    }
    this.http.post<any>(GlobalConstants.addDashboardKpi, allData,
      { headers: GlobalConstants.headers }).subscribe({
        next: (res) => {
        },
        error: (error) => {
          //console.log(error);
        }
      });

    this.commonFunctions.reloadPage('/dashboard');
    this.commonFunctions.navigateToPage('/dashboard');

  }
}
