import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AgColumns } from 'src/app/Kernel/common/AGColumns';
import { GlobalConstants } from 'src/app/Kernel/common/GlobalConstants';
import { CommonFunctions } from 'src/app/Kernel/common/CommonFunctions';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { GridBuilderFormComponent } from '../grid-builder-form/grid-builder-form.component';
import { DataService } from 'src/app/Kernel/services/data.service';
import { ChartBuilderFormComponent } from '../chart-builder-form/chart-builder-form.component';
import { ButtonRendererComponent } from './buttonRenderer.component';
import { GridBuilderPreviewComponent } from '../grid-builder-preview/grid-builder-preview.component';
import { InformationService } from 'src/app/Kernel/services/information.service';


@Component({
  selector: 'app-grid-builder',
  templateUrl: './grid-builder.component.html',
  styleUrls: ['./grid-builder.component.css']
})
export class GridBuilderComponent implements OnInit {
  public agColumns: AgColumns[] = [];
  public agColumnsJson: any;
  public agGridSelectedNodes: any = '';
  public getGridData = GlobalConstants.getGridDataApi;
  public action: any;
  frameworkComponents: any;

  public isQueryexecute: boolean;
  constructor(
    private http: HttpClient,
    public commonFunctions: CommonFunctions,
    private dialog: MatDialog,
    private dataservice: DataService,
    public informationservice: InformationService

  ) {

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
        field: 'gridId',
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
      }, {
        headerName: 'Created by',
        field: 'createdBy',
      },
      {
        headerName: 'Creation date',
        field: 'creationDate',

      }

    ];

    this.agColumns.push(this.agColumnsJson);
  }
  onAddClick() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '700px';
    dialogConfig.height = '700px';

    const dialogRef = this.dialog.open(GridBuilderFormComponent, {
      // data: info,
      width: '70%',
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


  onUpdateClick() {

    this.action = 'update';
    if (this.informationservice.getAgGidSelectedNode().includes(",") || this.informationservice.getAgGidSelectedNode() == "") {

    } else {
      this.dataservice.setactionType(this.action);
      const dialogConfig = new MatDialogConfig();
      dialogConfig.width = '700px';
      dialogConfig.height = '700px';

      const dialogRef = this.dialog.open(GridBuilderFormComponent, {
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
    } else {
      if (selectedNodes.indexOf(",") != -1) {
        selectedNodes = selectedNodes.split(',');
        for (let i = 0; i < selectedNodes.length; i++) {
          this.http.delete<any>(GlobalConstants.deleteGridApi + selectedNodes[i],
            { headers: GlobalConstants.headers }).subscribe({
              next: (res) => {
                this.commonFunctions.reloadPage('/dsp/gridBuilder');
              },
              error: (error) => {
                console.log(error);
              }
            });
        }
      } else {
        this.http.delete<any>(GlobalConstants.deleteGridApi + selectedNodes,
          { headers: GlobalConstants.headers }).subscribe({
            next: (res) => {
              this.commonFunctions.reloadPage('/dsp/gridBuilder');
            },
            error: (error) => {
              console.log(error);
            }
          });
      }
    }
  }

}
