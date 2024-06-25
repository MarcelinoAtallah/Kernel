import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AgColumns } from 'src/app/Kernel/common/AGColumns';
import { CommonFunctions } from 'src/app/Kernel/common/CommonFunctions';
import { GlobalConstants } from 'src/app/Kernel/common/GlobalConstants';
import { HttpClient } from '@angular/common/http';
import { ChartBuilderFormComponent } from 'src/app/Kernel/kernelapp/in-display/object-builder/chart-builder-form/chart-builder-form.component';
import { ButtonRendererComponent } from './buttonRenderer.component';
import { InformationService } from 'src/app/Kernel/services/information.service';

@Component({
  selector: 'app-chart-popup',
  templateUrl: './chart-popup.component.html',
  styleUrls: ['./chart-popup.component.css']
})
export class ChartPopupComponent implements OnInit {
  public getDashboardChartData = GlobalConstants.getDashboardChartData;
  public agGridSelectedNodes: any = '';
  public agColumnsJson: any;
  public agColumns: AgColumns[] = [];
  frameworkComponents: any;
  constructor(private http: HttpClient,
    public commonFunctions: CommonFunctions,
    private dialog: MatDialog,
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
        headerName: 'Size',
        field: 'size',
      }
    ];

    this.agColumns.push(this.agColumnsJson);
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

  Insert() {
    //test
    this.agGridSelectedNodes = this.informationservice.getAgGidSelectedNode();
    let selectedNodes = this.agGridSelectedNodes;
    let allData = {
      chartId: selectedNodes,
      templateId: this.informationservice.getSelectedTabId()
    }

    this.http.post<any>(GlobalConstants.addDashboardChart, allData,
      { headers: GlobalConstants.headers }).subscribe({
        next: (res) => {
          console.log(res);

        },
        error: (error) => {
          console.log(error);
        }
      });
    this.commonFunctions.reloadPage('/dashboard');
    this.commonFunctions.navigateToPage('/dashboard');
  }
}
