import { Component, OnInit } from '@angular/core';
import { AgColumns } from 'src/app/Kernel/common/AGColumns';
import { GlobalConstants } from 'src/app/Kernel/common/GlobalConstants';

@Component({
  selector: 'app-headers-query',
  templateUrl: './headers-query.component.html',
  styleUrls: ['./headers-query.component.css']
})
export class HeadersQueryComponent implements OnInit {

  public agColumns: AgColumns[] = [];
  public agColumnsJson: any;

  public getHeaderData=GlobalConstants.getHeaderData+"queryHeads_"+sessionStorage.getItem("session_serial");
  constructor() { }

  ngOnInit(): void {
    this.agColumnsJson = [
      {
        headerName: 'Physical Name',
        field: 'headerName',
      },
      {
        headerName: 'Business Name',
        field: 'businessName',
        
      },
      {
        headerName: 'Field Type',
        field: 'field',
      },
    ];

    this.agColumns.push(this.agColumnsJson);
  }

}


