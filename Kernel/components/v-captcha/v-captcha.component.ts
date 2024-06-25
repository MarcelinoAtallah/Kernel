import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, EventEmitter, Inject, Input, OnInit, Output, Renderer2 } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import axios from 'axios';
import { from, lastValueFrom } from 'rxjs';
import { CommonFunctions } from 'src/app/Kernel/common/CommonFunctions';
import { GlobalConstants } from 'src/app/Kernel/common/GlobalConstants';
import { DataService } from 'src/app/Kernel/services/data.service';
import { EventEmitterService } from 'src/app/Kernel/services/event-emitter.service';
import { LoaderService } from 'src/app/Kernel/services/loader.service';
import { RefreshDialogService } from 'src/app/Kernel/services/refresh-dialog.service';
import { InformationService } from 'src/app/Kernel/services/information.service';

@Component({
  selector: 'v-captcha',
  templateUrl: './v-captcha.component.html',
  styleUrls: ['./v-captcha.component.css']
})
export class VCaptchaComponent implements OnInit {

  @Input() public parentForm: FormGroup;
  @Input() public fieldName: any;

  public captchaData:any;
  public captchaInput:any;
  public serialNumber:any;
  constructor( 
    public commonFunctions: CommonFunctions,
    public datepipe: DatePipe,
    public dataservice: DataService,
    public loaderService: LoaderService,
    public informationservice: InformationService
    ) { }

  async ngOnInit(): Promise<void> {
      this.serialNumber=this.generateSerial();
      const fetchCaptchaCode = from(axios.post(GlobalConstants.fetchCaptchaCode+"/"+this.serialNumber,{}));
      const res = await lastValueFrom(fetchCaptchaCode);
      this.captchaData=res.data;
      
      this.informationservice.setLogSerial(this.serialNumber);
  }

  get formField(): FormControl {
    if (this.fieldName != '') {
      return this.parentForm?.get(this.fieldName) as FormControl;
    }
  }
  generateSerial() {
    
    'use strict';
    
    var chars = '1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
        
        serialLength = 10,
        
        randomSerial = "",
        
        i,
        
        randomNumber;
    
    for (i = 0; i < serialLength; i = i + 1) {
        
        randomNumber = Math.floor(Math.random() * chars.length);
        
        randomSerial += chars.substring(randomNumber, randomNumber + 1);
        
    }

return randomSerial;
}

  async rerun(){
  this.serialNumber=this.generateSerial();
  const fetchCaptchaCode = from(axios.post(GlobalConstants.fetchCaptchaCode+"/"+this.serialNumber,{}));
  const res = await lastValueFrom(fetchCaptchaCode);
  this.captchaData=res.data;
  
  this.informationservice.setLogSerial(this.serialNumber)
}
}
