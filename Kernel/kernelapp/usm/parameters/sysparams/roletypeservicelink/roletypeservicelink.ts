import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AgColumns } from 'src/app/Kernel/common/AGColumns';
import { CommonFunctions } from 'src/app/Kernel/common/CommonFunctions';
import { EventEmitterService } from 'src/app/Kernel/services/event-emitter.service';

@Component({
  selector: 'app-roletypeservicelink',
  templateUrl: './roletypeservicelink.html',
  styleUrls: ['./roletypeservicelink.css']
})
export class RoletypeservicelinkComponent implements OnInit {

  public agColumns: AgColumns[] = [];
  public agColumnsJson: any;
  public getRoleTypeServiceLink: any ;
  public agGridSelectedNodes: any = '';

  roleTypeServiceLink = new FormGroup({
  });

  constructor(private http: HttpClient,
    private commonFunctions: CommonFunctions,
    private eventEmitterService: EventEmitterService,
    private _Activatedroute: ActivatedRoute,) { }

  ngOnInit(): void {

    this.agColumnsJson = [
      {
        headerName: 'Role Type',
        field: 'roleType',
        filter: 'agTextColumnFilter',
        sortable: true,

      },

      {
        headerName: 'Service',
        field: 'service',
        filter: 'agTextColumnFilter',
        sortable: true,

      },
    ];
    this.agColumns.push(this.agColumnsJson);

  }
  }


