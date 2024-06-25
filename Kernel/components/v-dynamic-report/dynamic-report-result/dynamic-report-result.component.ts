import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, Inject, NgZone, OnInit, Renderer2 } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import axios from 'axios';
import { from, lastValueFrom } from 'rxjs';
import { AgColumns } from 'src/app/Kernel/common/AGColumns';
import { CommonFunctions } from 'src/app/Kernel/common/CommonFunctions';
import { GlobalConstants } from 'src/app/Kernel/common/GlobalConstants';
import { AmPreviewFormComponent } from 'src/app/Kernel/kernelapp/in-display/form-builder/preview-form/am-preview-form/am-preview-form.component';
import { DataService } from 'src/app/Kernel/services/data.service';
import { EventEmitterService } from 'src/app/Kernel/services/event-emitter.service';
import { InformationService } from 'src/app/Kernel/services/information.service';
import { LoaderService } from 'src/app/Kernel/services/loader.service';
import { RefreshDialogService } from 'src/app/Kernel/services/refresh-dialog.service';

@Component({
  selector: 'app-dynamic-report-result',
  templateUrl: './dynamic-report-result.component.html',
  styleUrls: ['./dynamic-report-result.component.css']
})
export class DynamicReportResultComponent implements OnInit {

  public getDynamicReportResult:any;
  public agColumnsJson: any = [];
  public agColumns: AgColumns[] = [];
  public showGrid:boolean=true;

  constructor(private dialogRef: MatDialogRef<AmPreviewFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private http: HttpClient,
    private eventEmitterService: EventEmitterService,
    public commonFunctions: CommonFunctions,
    private dialog: MatDialog,
    public datepipe: DatePipe,
    public dataservice: DataService,
    public loaderService: LoaderService,
    private renderer: Renderer2,
    private cdr: ChangeDetectorRef,
    private elRef: ElementRef,
    private refreshService: RefreshDialogService,
    private ngZone: NgZone,
    public informationservice: InformationService) { }

  async ngOnInit(): Promise<void> {
    console.log("DYNAMIC REPORT ID>>>>>>>>>>>>",this.informationservice.getDynamicReportId());
    setTimeout(() => {
      this.showGrid=false;

    }, 200);
    const getDynamicReportResultApi=from(axios.post(GlobalConstants.getDynamicReportResultApi+this.informationservice.getDynamicReportId(),this.data.jsonVal));
    const getDynamicReportResult=await lastValueFrom(getDynamicReportResultApi);
    console.log("DYNAMIC REPORT RESULT111>>>>>>>>>>>",getDynamicReportResult.data[0][0]);
    console.log("DYNAMIC REPORT RESULT222>>>>>>>>>>>",getDynamicReportResult.data[0].length);

      // if (res.status == 'Fail') {
      //       this.commonFunctions.alert("alert", res.description);
      //     } else {
            
            for(let i = 0; i < getDynamicReportResult.data[0].length; i++) {
              console.log("HEADERNAME:>>>>>>>>",getDynamicReportResult.data[0][i].HEADERNAME);
              console.log("FIELD:>>>>>>>>",getDynamicReportResult.data[0][i].FIELD);

              this.agColumnsJson.push({"headerName": getDynamicReportResult.data[0][i].HEADERNAME, "field": getDynamicReportResult.data[0][i].FIELD});
            }
            this.agColumns.push(this.agColumnsJson);


            this.getDynamicReportResult=getDynamicReportResult.data[1];
            console.log("STATIC GRID DATA>>>>>>>>>>>",getDynamicReportResult.data[1]);

setTimeout(() => {
  this.showGrid=true;
}, 300);
    // this.http.get<any>(GlobalConstants.getDynamicReportHeaderResult+"execHeads_"+sessionStorage.getItem("session_serial")).subscribe(
    //   (res: any) => {
    //     if (res.status == 'Fail') {
    //       this.commonFunctions.alert("alert", res.description);
    //     } else {
          
    //       for(let i = 0; i < res.length; i++) {
    //         this.agColumnsJson.push({"headerName": res[i].headerName, "field": res[i].field});
    //       }
    //       this.agColumns.push(this.agColumnsJson);
    //       this.currentQuery=btoa(this.currentQuery);

    //       this.fetchDynamicData=GlobalConstants.fetchDynamicData +this.currentQuery;
      
    //     }

    //   });

  }
  
  closeDialog(): void {
    this.dialogRef.close();
  }

}
