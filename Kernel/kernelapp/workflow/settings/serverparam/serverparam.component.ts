import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { AgColumns } from 'src/app/Kernel/common/AGColumns';

@Component({
  selector: 'app-serverparam',
  templateUrl: './serverparam.component.html',
  styleUrls: ['./serverparam.component.css']
})
export class ServerparamComponent implements OnInit {

  constructor() { }

  databaseForm = new FormGroup({
    databasePlatform: new FormControl(''),
    databaseSize: new FormControl(''),
    databaseTempSize: new FormControl(''),
    redoLogSize: new FormControl(''),

  });

  OSForm = new FormGroup({
    osName: new FormControl(''),
    osArchitecture: new FormControl(''),
    osVersion: new FormControl(''),
    osAvailableProcessors: new FormControl(''),
    osJreVersion: new FormControl(''),
    osJavaVendor: new FormControl(''),
    osUsedMemory: new FormControl(''),
    osFreeMemory: new FormControl(''),
    osTotalMemory: new FormControl(''),
    osMaxMemory: new FormControl(''),
  });
  
  public agColumnsDBInfo: AgColumns[] = [];
  public agColumnsJsonDBInfo: any;

  public agColumnsOracle: AgColumns[] = [];
  public agColumnsJsonOracle: any;

  ngOnInit(): void {

    this.agColumnsJsonDBInfo = [
      {
        headerName: 'Name',
        field: 'dbinfoName',
      },
      {
        headerName: 'Value',
        field: 'dbinfoValue',
      }
    ];

    this.agColumnsDBInfo.push(this.agColumnsJsonDBInfo);


    this.agColumnsJsonOracle = [
      {
        headerName: 'Name',
        field: 'oracleName',
      },
      {
        headerName: 'Value',
        field: 'oracleValue',
      }
    ];

    this.agColumnsOracle.push(this.agColumnsJsonOracle);

  }

}
