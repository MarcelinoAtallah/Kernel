import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AgColumns } from 'src/app/Kernel/common/AGColumns';
import { CommonFunctions } from 'src/app/Kernel/common/CommonFunctions';
import { EventEmitterService } from 'src/app/Kernel/services/event-emitter.service';

@Component({
  selector: 'app-interfacestatus',
  templateUrl: './interfacestatus.html',
  styleUrls: ['./interfacestatus.css']
})
export class InterfacestatusComponent implements OnInit {

  public agColumns: AgColumns[] = [];
  public agColumnsJson: any;
  public getInterfaceStatus: any ;
  public agGridSelectedNodes: any = '';

  interfaceStatusForm = new FormGroup({
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
        headerName: 'Interface Color',
        field: 'interfaceColor',
        filter: 'agTextColumnFilter',
        sortable: true,
      },

    ];
    this.agColumns.push(this.agColumnsJson);

  }
  }


