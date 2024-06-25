import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { GlobalConstants } from 'src/app/Kernel/common/GlobalConstants';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { AgColumns } from 'src/app/Kernel/common/AGColumns';
import { CommonFunctions } from 'src/app/Kernel/common/CommonFunctions';
import { DataService } from 'src/app/Kernel/services/data.service';
import { DashboardModifyPopupComponent } from '../dashboard-modify-popup/dashboard-modify-popup.component';
import { Router } from '@angular/router';
import { InformationService } from 'src/app/Kernel/services/information.service';

@Component({
  selector: 'app-dashboard-popup',
  templateUrl: './dashboard-popup.component.html',
  styleUrls: ['./dashboard-popup.component.css']
})
export class DashboardPopupComponent implements OnInit {
  public getDashboardTemplateData = GlobalConstants.getDashboardTemplateData + this.informationservice.getLogeduserId();
  public agGridSelectedNodes: any = '';
  public agColumns: AgColumns[] = [];
  public agColumnsJson: any;
  public action: any;

  constructor(private http: HttpClient,
    public commonFunctions: CommonFunctions,
    private dialog: MatDialog,
    private dataservice: DataService,
    private router: Router,
    public informationservice: InformationService) { }

  ngOnInit(): void {
    this.agColumnsJson = [
      {
        headerName: '',
        field: '',
        checkboxSelection: true,
        headerCheckboxSelection: true
      },
      {
        headerName: 'DashBoard Name',
        field: 'dashboardName',
      },
      {
        headerName: 'UserName',
        field: 'userName',
      }
    ];

    this.agColumns.push(this.agColumnsJson);
  }
  onAddClick() {
    this.action = 'add';
    this.dataservice.setactionType(this.action);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '400px';
    dialogConfig.height = '400px';
    const dialogRef = this.dialog.open(DashboardModifyPopupComponent, {
      width: '40%',
      height: '40%',
    });

    this.commonFunctions.reloadPage('/dashboard');
    this.commonFunctions.navigateToPage('/dashboard');
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
          this.http.delete<any>(GlobalConstants.deleteDashboardTempalte + selectedNodes[i],
            { headers: GlobalConstants.headers }).subscribe({
              next: (res) => {
              },
              error: (error) => {
                console.log(error);
              }
            });
        }
      } else {
        this.http.delete<any>(GlobalConstants.deleteDashboardTempalte + selectedNodes,
          { headers: GlobalConstants.headers }).subscribe({
            next: (res) => {
              this.dialog.closeAll;
            },
            error: (error) => {
              console.log(error);
              this.dialog.closeAll;
            }
          });
      }
    }

    this.commonFunctions.reloadPage('/dashboard');
    this.commonFunctions.navigateToPage('/dashboard');
  }
  onUpdateClick() {
    this.action = 'update';
    this.dataservice.setactionType(this.action);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '400px';
    dialogConfig.height = '400px';
    const dialogRef = this.dialog.open(DashboardModifyPopupComponent, {
      width: '40%',
      height: '40%',
    });

    this.commonFunctions.reloadPage('/dashboard');
    this.commonFunctions.navigateToPage('/dashboard');
  }



}
