import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, Inject, NgZone, OnInit, Renderer2 } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import axios from 'axios';
import { from, lastValueFrom } from 'rxjs';
import { CommonFunctions } from 'src/app/Kernel/common/CommonFunctions';
import { GlobalConstants } from 'src/app/Kernel/common/GlobalConstants';
import { DataService } from 'src/app/Kernel/services/data.service';
import { EventEmitterService } from 'src/app/Kernel/services/event-emitter.service';
import { InformationService } from 'src/app/Kernel/services/information.service';
import { LoaderService } from 'src/app/Kernel/services/loader.service';
import { RefreshDialogService } from 'src/app/Kernel/services/refresh-dialog.service';
import { AmPreviewFormComponent } from '../am-preview-form/am-preview-form.component';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-dynamic-report-save',
  templateUrl: './dynamic-report-save.component.html',
  styleUrls: ['./dynamic-report-save.component.css']
})
export class DynamicReportSaveComponent implements OnInit {

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


    reportForm = new FormGroup({
      reportName: new FormControl(''),
    });

  ngOnInit(): void {



  }

  async saveReport(){
  if(!this.data.isGrid){
  console.log("DATA JSON>>>>>>>>>",this.data.jsonVal);
    const insertDynamicReportFormApi = from(axios.post(GlobalConstants.insertDynamicReportFormApi+this.data.userId+"/"+this.reportForm.get('reportName')?.value,this.data.jsonVal));
  const insertDynamicReportForm= await lastValueFrom(insertDynamicReportFormApi);
  
   this.informationservice.setDynamicReportId(insertDynamicReportForm.data);
   this.closeDialog();
  }else{
    let selectedRowsArray=JSON.parse(this.data.jsonVal);
    let selectedRows='';
    
    for(let i=0;i<selectedRowsArray.length;i++){
      if(i==selectedRowsArray.length-1){
        selectedRows+=selectedRowsArray[i].COLVALUE;
      }else{
        selectedRows+=selectedRowsArray[i].COLVALUE+",";
      }

    }

    const insertDynamicReportGridApi = from(axios.get(GlobalConstants.insertDynamicReportGridApi+this.data.userId+"/"+this.reportForm.get('reportName')?.value+"/"+selectedRows));
    const insertDynamicReportGrid= await lastValueFrom(insertDynamicReportGridApi);

    this.informationservice.setDynamicReportId(insertDynamicReportGrid.data);
    this.closeDialog();
  }
  }


  closeDialog(): void {
    this.dialogRef.close();
  }

  closeAllDialogs(): void {
    this.dialog.closeAll();
  }
  
}
