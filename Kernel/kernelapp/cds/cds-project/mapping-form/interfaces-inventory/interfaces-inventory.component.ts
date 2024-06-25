import { Component, OnInit } from '@angular/core';
import { AgColumns } from 'src/app/Kernel/common/AGColumns';
import { GlobalConstants } from 'src/app/Kernel/common/GlobalConstants';

@Component({
  selector: 'app-interfaces-inventory',
  templateUrl: './interfaces-inventory.component.html',
  styleUrls: ['./interfaces-inventory.component.css']
})
export class InterfacesInventoryComponent implements OnInit {

  public agInterface: AgColumns[] = [];
  public agColumnsJson: any;

  public getInterfaceApi: any = GlobalConstants.fetchMappingApi;
  constructor() { }

  ngOnInit(): void {
    this.agColumnsJson = [
    { headerName: 'Interface Name', field: 'name',width: '25px'},
  ];
  this.agInterface.push(this.agColumnsJson);
  }
}
