import { Component, OnInit } from '@angular/core';
import { AgColumns } from 'src/app/Kernel/common/AGColumns';

@Component({
  selector: 'app-link-procedure',
  templateUrl: './link-procedure.component.html',
  styleUrls: ['./link-procedure.component.css']
})
export class LinkProcedureComponent implements OnInit {
  public agColumns: AgColumns[] = [];
  public agColumnsJson: any;
  constructor() { }

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
        headerName: 'ID',
        field: '',
      },
      {
        headerName: 'Business Name',
        field: '',
        width: '25px',
      },
      {
        headerName: 'Technical Name',
        field: '',
      },
    ];

    this.agColumns.push(this.agColumnsJson);
  }

}

