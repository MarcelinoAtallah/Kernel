import { Component, Inject, OnInit } from '@angular/core';
import { CellRenderer } from '../cellRenderer';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AgColumns } from 'src/app/Kernel/common/AGColumns';
import { GlobalConstants } from 'src/app/Kernel/common/GlobalConstants';

@Component({
  selector: 'app-parent-menu-list',
  templateUrl: './parent-menu-list.component.html',
  styleUrls: ['./parent-menu-list.component.css']
})
export class ParentMenuListComponent implements OnInit {


  public agColumns: AgColumns[] = [];
  public agColumnsJson: any;

  public fetchParentMenuList = GlobalConstants.fetchParentMenuList+this.data;

  frameworkComponents:any;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
  public dialogRef: MatDialogRef<ParentMenuListComponent>) { 


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
        field: 'menu_code',
        filter: 'agTextColumnFilter',
        sortable: true,
        defaultMinWidth: '140',
        maxWidth: '140',
        
      },
      {
        headerName: 'Name',
        field: 'menu_name',
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
