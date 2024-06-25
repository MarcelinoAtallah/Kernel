import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AgColumns } from 'src/app/Kernel/common/AGColumns';
import { CommonFunctions } from 'src/app/Kernel/common/CommonFunctions';
import { EventEmitterService } from 'src/app/Kernel/services/event-emitter.service';

@Component({
  selector: 'app-integrationstatus',
  templateUrl: './integrationstatus.html',
  styleUrls: ['./integrationstatus.css']
})
export class IntegrationstatusComponent implements OnInit {

  public agColumns: AgColumns[] = [];
  public agColumnsJson: any;
  public getIntegrationStatus: any ;
  public agGridSelectedNodes: any = '';

  integrationStatusForm = new FormGroup({
  });

  constructor(private http: HttpClient,
    private commonFunctions: CommonFunctions,
    private eventEmitterService: EventEmitterService,
    private _Activatedroute: ActivatedRoute,) { }

  ngOnInit(): void {
    this.agColumnsJson = [
      {
        headerName: '',
        field: '',
        checkboxSelection: true,
        width: '25px',
        headerCheckboxSelection: true,
      },
      {
        headerName: 'Status Code',
        field: 'statusCode',
        filter: 'agTextColumnFilter',
        sortable: true,

      },
      {
        headerName: 'Status Name',
        field: 'statusName',
        filter: 'agTextColumnFilter',
        sortable: true,
      },
      {
        headerName: 'Intance Color',
        field: 'intanceColor',
        filter: 'agTextColumnFilter',
        sortable: true,
      },

    ];
    this.agColumns.push(this.agColumnsJson);

  }
  }


