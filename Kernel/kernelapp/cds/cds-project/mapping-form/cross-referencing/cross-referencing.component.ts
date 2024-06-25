import { Component, OnInit } from '@angular/core';
import { AgColumns } from 'src/app/Kernel/common/AGColumns';
import { GlobalConstants } from 'src/app/Kernel/common/GlobalConstants';

@Component({
  selector: 'app-cross-referencing',
  templateUrl: './cross-referencing.component.html',
  styleUrls: ['./cross-referencing.component.css']
})
export class CrossReferencingComponent implements OnInit {
  public agColumns: AgColumns[] = [];
  public agColumnsJson: any;

  public getCdsCrossRefApi: any;
  constructor() { }

  ngOnInit(): void {
    this.agColumnsJson = [
    { headerName: 'Cross Referencing Id', 
    field: 'id', 
    filter: 'agTextColumnFilter'},
    { headerName: 'Cross Referencing Name', 
    field: 'Name', 
    filter: 'agTextColumnFilter',
    sortable: true,
    isLink: true,
    link: '/cds/crossRef/form/update/',
    linkParameters: 'id',}
    
  ];
  this.agColumns.push(this.agColumnsJson);
  this.getCdsCrossRefApi= GlobalConstants.getCdsCrossRefApi;
  }
 
}
