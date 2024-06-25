import { Component, OnInit,ViewChild } from '@angular/core';
import { GlobalConstants } from 'src/app/Kernel/common/GlobalConstants';
import { CommonFunctions } from 'src/app/Kernel/common/CommonFunctions';
import { AgColumns } from 'src/app/Kernel/common/AGColumns';
import { HttpClient } from '@angular/common/http';
import { EventEmitterService } from 'src/app/Kernel/services/event-emitter.service';
import { Subscription } from 'rxjs/internal/Subscription';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-scheduledactivities',
  templateUrl: './scheduledactivities.component.html',
  styleUrls: ['./scheduledactivities.component.css']
})
export class ScheduledactivitiesComponent implements OnInit {
  public agColumns: AgColumns[] = [];
  public agColumnsJson: any;
  public content: any;
  public agGridSelectedNodes: any = '';
  public comboDatasource = [{}];
  subsVar: Subscription;

 // Update Form Variables
 // public getUSMUsersApi: any = GlobalConstants.fetchUSMUsersApi;
 autoRefreshForm = new FormGroup({
  autoRefreshToggle: new FormControl('')
});
 @ViewChild('addContent') addContent: any;
 @ViewChild('updateContent') updateContent: any;

  constructor(
    private http: HttpClient,
    public commonFunctions: CommonFunctions,
    private eventEmitterService: EventEmitterService,
  ) { }

  ngOnInit(): void {
    this.agColumnsJson = [
      { headerName: '',field: '',checkboxSelection: true,width: '25px', headerCheckboxSelection: true },
      { headerName: 'Process Id',field: 'processid', filter: 'agTextColumnFilter' },
      { headerName: 'Process Name',field: 'processname', filter: 'agTextColumnFilter' },
      { headerName: 'Process Begin Date',field: 'processbegindate', filter: 'agTextColumnFilter' },
      { headerName: 'Execute',field: 'execute', filter: 'agTextColumnFilter' },
      { headerName: 'Next Execution',field: 'nextexecution', filter: 'agTextColumnFilter' },
      { headerName: 'Last Execution',field: 'lastexecution', filter: 'agTextColumnFilter' },
      { headerName: 'Activity Id',field: 'activityid', filter: 'agTextColumnFilter' },
      { headerName: 'Activity Name',field: 'activityname', filter: 'agTextColumnFilter' },
      { headerName: 'BP Activity Name',field: 'bpactivityname', filter: 'agTextColumnFilter' },
      { headerName: 'Schedule Type',field: 'scheduletype', filter: 'agTextColumnFilter' },
      { headerName: 'Frequency',field: 'frequency', filter: 'agTextColumnFilter' },
     
    ];
    this.agColumns.push(this.agColumnsJson);
    
    
  }

}

