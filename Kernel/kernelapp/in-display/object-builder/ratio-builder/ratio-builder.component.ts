import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { GlobalConstants } from 'src/app/Kernel/common/GlobalConstants';
import { AgColumns } from 'src/app/Kernel/common/AGColumns';
import { CommonFunctions } from 'src/app/Kernel/common/CommonFunctions';
import { RatioBuilderFormComponent } from '../ratio-builder-form/ratio-builder-form.component';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-ratio-builder',
  templateUrl: './ratio-builder.component.html',
  styleUrls: ['./ratio-builder.component.css']
})
export class RatioBuilderComponent implements OnInit {

  public getQueryName = GlobalConstants.getQueryNameApi;
  public agColumns: AgColumns[] = [];
  public agColumnsJson: any;

  ratioForm = new FormGroup({
    title: new FormControl(''),
    query: new FormControl(''),
    display: new FormControl(''),
    grid: new FormControl(''),
    chart: new FormControl(''),
    report: new FormControl(''),
  
 });
  constructor(private http: HttpClient,
    public commonFunctions: CommonFunctions,
    private dialog: MatDialog,) { }

  ngOnInit(): void {
    this.agColumnsJson = [
      {
        headerName: '',
        field: '',
        checkboxSelection: true,
        width: '25px',
        headerCheckboxSelection: true
      },
      {
        headerName: 'Title',
        field: 'title',
        width: '25px',
      },
      {
        headerName: 'Add To Archive',
        field: 'add_to_archive',
      },
      {
        headerName: 'Category',
        field: 'category',
                
      },
      
      {
        headerName: 'Created by',
        field: 'CREATED_BY',
      },
      {
        headerName: 'Created date',
        field: 'CREATED_DATE',
     
      }
      
    ];

    this.agColumns.push(this.agColumnsJson);
  }
  onAddClick(){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '700px';
    dialogConfig.height = '700px';
    
    const dialogRef = this.dialog.open(RatioBuilderFormComponent, {
     // data: info,
      width: '70%',
      height: '70%',
    });
  
  }
  onUpdateClick(){}
  onDeleteClick() {}
    

}

