import { Component, OnInit,ViewChild } from '@angular/core';
import { GlobalConstants } from 'src/app/Kernel/common/GlobalConstants';
import { CommonFunctions } from 'src/app/Kernel/common/CommonFunctions';
import { AgColumns } from 'src/app/Kernel/common/AGColumns';
import { HttpClient } from '@angular/common/http';
import { EventEmitterService } from 'src/app/Kernel/services/event-emitter.service';
import { Subscription } from 'rxjs/internal/Subscription';
@Component({
  selector: 'app-lastwfm',
  templateUrl: './lastwfm.component.html',
  styleUrls: ['./lastwfm.component.css']
})
export class LastwfmComponent implements OnInit {

  public agColumns: AgColumns[] = [];
  public agColumnsJson: any;
  public content: any;
  public agGridSelectedNodes: any = '';
  public comboDatasource = [{}];
  subsVar: Subscription;

 // Update Form Variables
 // public getUSMUsersApi: any = GlobalConstants.fetchUSMUsersApi;

 @ViewChild('addContent') addContent: any;
 @ViewChild('updateContent') updateContent: any;

  constructor(
    private http: HttpClient,
    public commonFunctions: CommonFunctions,
    private eventEmitterService: EventEmitterService,
  ) { }

  ngOnInit(): void {
    this.agColumnsJson = [
      { headerName: 'Code',field: 'code', filter: 'agTextColumnFilter' },
      { headerName: 'Activity Name',field: 'activityname', filter: 'agTextColumnFilter' },
      { headerName: 'Activity Type',field: 'activitytype', filter: 'agTextColumnFilter' },
      { headerName: 'Execution Date',field: 'executiondate', filter: 'agTextColumnFilter' },
      { headerName: 'Activity Objects',field: 'activityobjects', filter: 'agTextColumnFilter' },
     
    ];
    this.agColumns.push(this.agColumnsJson);
    
  }

}
