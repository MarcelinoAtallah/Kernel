import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonFunctions } from 'src/app/Kernel/common/CommonFunctions';
import { EventEmitterService } from 'src/app/Kernel/services/event-emitter.service';
import { VQueryDetailsComponent } from './v-query-details/v-query-details.component';
import { InformationService } from 'src/app/Kernel/services/information.service';


@Component({
  selector: 'v-lookup-v2',
  templateUrl: './v-lookup-v2.component.html',
  styleUrls: ['./v-lookup-v2.component.css']
})
export class VLookupV2Component implements OnInit {

  @Input() public parentForm?: FormGroup;
  @Input() public fieldName: any;
  @Input() public queryId: any;
  @Input() public label: any;

  public selectedItem:any;

  get formField(): FormControl {
    return this.parentForm?.get(this.fieldName) as FormControl;
  }
  
  constructor(private eventEmitterService: EventEmitterService,
    private dialog: MatDialog,
     private snackBar: MatSnackBar,
    private http: HttpClient,
    private _Activatedroute: ActivatedRoute,
    public datepipe: DatePipe,
    private commonFunctions: CommonFunctions,
    private route: Router,
    public informationservice: InformationService) { }

  ngOnInit(): void {
    console.log("THIS.LABEL>>>>>>>>>>>",this.label);

    
    this.selectedItem=this.informationservice.getDynamicService('agGidSelectedQueryForm_('+this.label+')');
    console.log("THIS>SELECTED>ITEM>>>>>>>>>>>",this.selectedItem);
    
    this.parentForm.controls[this.fieldName].setValue(this.informationservice.getDynamicService('agGidSelectedQueryForm_('+this.label+')'));

  }


  openLookup(){

    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '700px';
    dialogConfig.height = '700px';
    
let jsonObject={
  queryId:this.queryId,
  label:this.label
}

    const dialogRef = this.dialog.open(VQueryDetailsComponent, {
      data: jsonObject,
      width: '50%',
      height: '60%',
    });


    dialogRef.afterClosed().subscribe(result => {
      console.log("INSIDE COMPONENT>>>>>>>>>>>'agGidSelectedQueryForm_('",this.label,"')'");
      
      this.selectedItem=this.informationservice.getDynamicService('agGidSelectedQueryForm_('+this.label+')');
      
      this.parentForm.controls[this.fieldName].setValue(this.informationservice.getDynamicService('agGidSelectedQueryForm_('+this.label+')'));

    });

  }
  clearSelection() {
    if (this.parentForm) { // ask if must mention vquery
      this.selectedItem = ''; 
      this.parentForm.controls[this.fieldName].setValue('');
      this.informationservice.setDynamicService('agGidSelectedQueryForm_('+this.label+')',''); 
    }
  }
}