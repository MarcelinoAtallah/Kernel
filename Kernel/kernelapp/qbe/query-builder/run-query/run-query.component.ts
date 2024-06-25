import { Component, OnInit } from '@angular/core';
import { AgColumns } from 'src/app/common/AGColumns';

@Component({
  selector: 'app-run-query',
  templateUrl: './run-query.component.html',
  styleUrls: ['./run-query.component.css']
})
export class RunQueryComponent implements OnInit {
  public agColumns: AgColumns[] = [];
  public agColumnsJson: any;

  constructor() { }

  fieldtest: string;
  showGrid = false;
  
  ngOnInit(): void {
    this.agColumnsJson = [
      {
        headerName: '',
        field: '',
        // checkboxSelection: true,
        width: '25px',
        // headerCheckboxSelection: true
      },
      {
        headerName: 'Column1',
        field: '',
        width: '25px',
      },
      {
        headerName: 'Column2',
        field: '',
      },
      
    ];
    this.agColumns.push(this.agColumnsJson);

  }

  executee() {
    this.showGrid = true;
  }

  reset() {
    this.fieldtest = '';
    this.showGrid = false;
  }
}
