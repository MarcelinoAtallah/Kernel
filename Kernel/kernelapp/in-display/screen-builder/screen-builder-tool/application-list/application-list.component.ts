import { Component, Inject, OnInit } from '@angular/core';
import { AgColumns } from 'src/app/Kernel/common/AGColumns';
import { GlobalConstants } from 'src/app/Kernel/common/GlobalConstants';
import { CellRenderer } from '../cellRenderer';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-application-list',
  templateUrl: './application-list.component.html',
  styleUrls: ['./application-list.component.css']
})
export class ApplicationListComponent implements OnInit {

  public agColumns: AgColumns[] = [];
  public agColumnsJson: any;

  public fetchApplicationList = GlobalConstants.fetchApplicationList;
  frameworkComponents:any;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
  public dialogRef: MatDialogRef<ApplicationListComponent>) {

    this.onSetButtonClick = this.onSetButtonClick.bind(this);

    this.frameworkComponents = {
      cellRenderer: CellRenderer,
    };
   

   }
  
  ngOnInit(): void {
    this.agColumnsJson = [
      {
        headerName: '',
      field: '',
      defaultMinWidth: '40',
      maxWidth: '40',
      cellRenderer: 'cellRenderer',
      cellRendererParams: {
        onClick: this.onSetButtonClick.bind(this),
        label: 'Click 1'
      }
      },
        {
        headerName: 'Code',
        field: 'code',
        filter: 'agTextColumnFilter',
        sortable: true,
        defaultMinWidth: '140',
        maxWidth: '140',
        
      },
      {
        headerName: 'Application',
        field: 'application',
        defaultMinWidth: '180',
        maxWidth: '300',
        filter: 'agTextColumnFilter',
        sortable: true
      }
    ]

    this.agColumns.push(this.agColumnsJson);

  }
  onSetButtonClick(e:any){
this.dialogRef.close();
  }
}
