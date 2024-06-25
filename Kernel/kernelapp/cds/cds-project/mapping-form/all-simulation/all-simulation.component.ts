import { Component, OnInit } from '@angular/core';
import { AgColumns } from 'src/app/Kernel/common/AGColumns';
import { GlobalConstants } from 'src/app/Kernel/common/GlobalConstants';

@Component({
  selector: 'app-all-simulation',
  templateUrl: './all-simulation.component.html',
  styleUrls: ['./all-simulation.component.css']
})
export class AllSimulationComponent implements OnInit {
  public agSimulation: AgColumns[] = [];
  public agColumnsJson: any;

  public getSimulationApi: any = GlobalConstants.fetchMappingApi;
  constructor() { }

  ngOnInit(): void {
    this.agColumnsJson = [
    { headerName: 'Simulation Id', field: 'id',width: '25px'},
    { headerName: 'Simulation Name', field: 'SimulationName',width: '25px'},
    { headerName: 'Mapping Id', field: 'MappingId',width: '25px'},
    { headerName: 'Mapping Name', field: 'Name',width: '25px'},
    { headerName: 'File Path', field: 'Path',width: '25px'}
  ];
  this.agSimulation.push(this.agColumnsJson);
  }

}
