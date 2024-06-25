
import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CommonFunctions } from 'src/app/Kernel/common/CommonFunctions';
import { GlobalConstants } from 'src/app/Kernel/common/GlobalConstants';
import { EventEmitterService } from 'src/app/Kernel/services/event-emitter.service';
import { USMConstant } from 'src/app/Kernel/kernelapp/usm/USMConstant';
import { AfterViewChecked, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-passwordsettings',
  templateUrl: './passwordsettings.html',
  styleUrls: ['./passwordsettings.css']
})
export class PasswordsettingsComponent implements OnInit {

  today = new Date();
  TestingDate : String;
  passwordSettings = new FormGroup({
    minimumLength: new FormControl(),
  minimumNumberOfDigits: new FormControl(),
  MNOUL: new FormControl(),
  MNOLL: new FormControl(),
  MNOSC: new FormControl(),
  NOPIH: new FormControl(),
  IPUF: new FormControl(),
  expirationDate: new FormControl(),
  Period: new FormControl(),
  expirationPeriod: new FormControl()
  });
  radioData: { value: string; name: string; }[];
  radioData1: { value: string; name: string; }[];
  comboPeriod:any;
 //parameters from the screen to be posted to the api
  MinLength:any;
  minimumNumberOfDigits :any;
  MNOUL:any;
  MNOLL:any;
  MNOSC :any;
  NOPIH :any;
  IPUF :any;
  expirationDate:any;
  Period :any;
  expirationPeriod:any;


  constructor(private http: HttpClient,
    private commonFunctions: CommonFunctions,
    private eventEmitterService: EventEmitterService,
    public datepipe: DatePipe,
    private readonly changeDetectorRef: ChangeDetectorRef) { }
    ngAfterViewChecked(): void {
      this.changeDetectorRef.detectChanges();
    }
  ngOnInit(): void {
    this.comboPeriod = GlobalConstants.fetchPeriodPwdSettingsComboApi;
    console.log("combo>>>>>>>",this.comboPeriod);
    this.radioData = [
      { value: '1', name: 'Number of passwords in history' },
      { value: '2', name: 'No Limited History' },
    ];

    this.radioData1 = [
      { value: '1', name: 'Is Password Unexpired Flag' },//,date:null,period:null,expiration:null },
      { value: '2', name: 'Password Expiration Date' },//,date:this.passwordSettings.controls.expirationDate,period:null,expiration:null },
      { value: '3', name: 'Password Expiration Period' }//,date:null,period:this.passwordSettings.controls.Period,expiration:this.passwordSettings.controls.expirationPeriod }
    ];

  }

  submitForm() {
    console.log("Period >> ", this.passwordSettings.get('Period').value);
    console.log("ExPeriod >> ", this.passwordSettings.get('expirationPeriod').value);

    if (this.passwordSettings.status !== "INVALID") {


      const requestBody = {

        minLength: this.passwordSettings.get('minimumLength').value== "" ? "-1" : this.passwordSettings.get('minimumLength').value,

        ipuf: this.passwordSettings.get('IPUF').value,
        mnoll: this.passwordSettings.get('MNOLL').value,
        mnoul: this.passwordSettings.get('MNOUL').value,
        mnosc: this.passwordSettings.get('MNOSC').value,
        nopih: this.passwordSettings.get('NOPIH').value,

        minimumNumberOfDigits: this.passwordSettings.get('minimumNumberOfDigits').value,
        expirationDate: this.passwordSettings.get('expirationDate').value,
        expirationPeriod: this.passwordSettings.get('expirationPeriod').value,
        period: this.passwordSettings.get('Period').value
      };

      this.http.post<any>(GlobalConstants.postPasswdSettings, requestBody).subscribe(
        (res: any) => {
          if (res && res.status && res.status === 'Fail' && res.description) {
            this.commonFunctions.alert("alert", res.description);
          } else {
            this.commonFunctions.alert("alert", res.description);
            this.MinLength = res.MinLength;

            this.minimumNumberOfDigits = res.minimumNumberOfDigits;

            this.MNOUL = res.MNOUL;

            this.MNOLL = res.MNOLL;

            this.MNOSC = res.MNOSC;

            this.NOPIH = res.NOPIH;

            this.IPUF = res.IPUF;

            this.expirationDate =res.expirationDate;

            this.expirationPeriod = res.expirationPeriod;

            this.Period = res.Period;

          }
        }
      )
    }
  }


}
