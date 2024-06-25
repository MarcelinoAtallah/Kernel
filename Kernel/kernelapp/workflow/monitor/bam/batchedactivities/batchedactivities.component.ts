import { Component, OnInit,ViewChild } from '@angular/core';
import { GlobalConstants } from 'src/app/Kernel/common/GlobalConstants';
import { CommonFunctions } from 'src/app/Kernel/common/CommonFunctions';
import { AgColumns } from 'src/app/Kernel/common/AGColumns';
import { HttpClient } from '@angular/common/http';
import { EventEmitterService } from 'src/app/Kernel/services/event-emitter.service';
import { Subscription } from 'rxjs/internal/Subscription';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-batchedactivities',
  templateUrl: './batchedactivities.component.html',
  styleUrls: ['./batchedactivities.component.css']
})
export class BatchedactivitiesComponent implements OnInit {
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
      { headerName: 'Activity Id',field: 'activityid', filter: 'agTextColumnFilter' },
      { headerName: 'Activity Name',field: 'activityname', filter: 'agTextColumnFilter' },
      { headerName: 'Existing Count',field: 'existingcount', filter: 'agTextColumnFilter' },
      { headerName: 'Application',field: 'application', filter: 'agTextColumnFilter' },
      { headerName: 'Batch Type',field: 'batchtype', filter: 'agTextColumnFilter' },
      { headerName: 'Batch Time',field: 'batchtime', filter: 'agTextColumnFilter' },
      { headerName: 'Batch Count',field: 'batchcount', filter: 'agTextColumnFilter' },
      { headerName: 'Schedule Start Time',field: 'schedulestarttime', filter: 'agTextColumnFilter' },
      { headerName: 'Schedule End Time',field: 'scheduleendtime', filter: 'agTextColumnFilter' },
    ];
    this.agColumns.push(this.agColumnsJson);
    
    
  }

}
