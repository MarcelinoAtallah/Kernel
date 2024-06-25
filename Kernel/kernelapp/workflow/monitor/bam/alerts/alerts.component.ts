import { Component, OnInit,ViewChild } from '@angular/core';
import { GlobalConstants } from 'src/app/Kernel/common/GlobalConstants';
import { CommonFunctions } from 'src/app/Kernel/common/CommonFunctions';
import { AgColumns } from 'src/app/Kernel/common/AGColumns';
import { HttpClient } from '@angular/common/http';
import { EventEmitterService } from 'src/app/Kernel/services/event-emitter.service';
import { Subscription } from 'rxjs/internal/Subscription';

@Component({
  selector: 'app-alerts',
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.css']
})
export class AlertsComponent implements OnInit {
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
      { headerName: '',field: '',checkboxSelection: true,width: '25px', headerCheckboxSelection: true },
      { headerName: 'Read',field: 'read', filter: 'agTextColumnFilter' },
      { headerName: 'Sender',field: 'sender', filter: 'agTextColumnFilter' },
      { headerName: 'Subject',field: 'subject', filter: 'agTextColumnFilter' },
      { headerName: 'Date',field: 'date', filter: 'agTextColumnFilter' },
      { headerName: 'Attachment',field: 'attachment', filter: 'agTextColumnFilter' },
      { headerName: 'Recipient',field: 'recipient', filter: 'agTextColumnFilter' },
      { headerName: 'Status',field: 'status', filter: 'agTextColumnFilter' },
      { headerName: 'Updated By',field: 'updatedby', filter: 'agTextColumnFilter' },
     
    ];
    this.agColumns.push(this.agColumnsJson);
    
    
  }

}
