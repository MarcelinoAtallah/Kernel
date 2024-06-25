import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AgColumns } from 'src/app/Kernel/common/AGColumns';
import { CommonFunctions } from 'src/app/Kernel/common/CommonFunctions';
import { GlobalConstants } from 'src/app/Kernel/common/GlobalConstants';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-grid-popup',
  templateUrl: './grid-popup.component.html',
  styleUrls: ['./grid-popup.component.css']
})
export class GridPopupComponent implements OnInit {
  public getDashboardGridData = GlobalConstants.getDashboardGridData;
  public agColumnsJson: any;
  public agColumns: AgColumns[] = [];

  constructor(private http: HttpClient,
    public commonFunctions: CommonFunctions,
    private dialog: MatDialog,) { }

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
      },
      {
        headerName: 'Size',
        field: 'size',
      },
      {
        headerName: 'Height',
        field: 'height',
      }

    ];

    this.agColumns.push(this.agColumnsJson);
  }
  Insert() {
    let allData = {
      gridId: localStorage.getItem('agGidSelectedNode'),
      templateId: localStorage.getItem('selectedTabId'),
    }

    this.http.post<any>(GlobalConstants.addDashboardGrid, allData,
      { headers: GlobalConstants.headers }).subscribe({
        next: (res) => {
          //console.log(res);
        },
        error: (error) => {
          //console.log(error);
        }
      });


    this.commonFunctions.reloadPage('/dashboard');
    this.commonFunctions.navigateToPage('/dashboard');
  }
}