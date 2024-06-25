import { Component, OnInit } from '@angular/core';
import { AgColumns } from 'src/app/Kernel/common/AGColumns';
import { GlobalConstants } from 'src/app/Kernel/common/GlobalConstants';

@Component({
  selector: 'app-staging-tables',
  templateUrl: './staging-tables.component.html',
  styleUrls: ['./staging-tables.component.css']
})
export class StagingTablesComponent implements OnInit {
  public agStaging: AgColumns[] = [];
  public agColumnsJson: any;

  public getStagingApi: any = GlobalConstants.fetchMappingApi;
  constructor() { }

  ngOnInit(): void {
    this.agColumnsJson = [
    { headerName: 'Id', field: 'id',width: '25px'},
    { headerName: 'Owner', field: 'Owner',width: '25px'},
    { headerName: 'Name', field: 'Name',width: '25px'},
    { headerName: 'Created By', field: 'Created By',width: '25px'}
  ];
  this.agStaging.push(this.agColumnsJson);
  }

}
