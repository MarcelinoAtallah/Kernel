import { HttpClient } from '@angular/common/http';
import { Component, OnInit, AfterContentInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalConstants } from 'src/app/Kernel/common/GlobalConstants';
import { DatePipe } from '@angular/common';
import { CommonFunctions } from 'src/app/Kernel/common/CommonFunctions';
declare let alertify: any;

@Component({
  selector: 'mappingForm',
  templateUrl: './mapping-form.component.html',
  styleUrls: ['./mapping-form.component.css'],
})
export class MappingForm implements OnInit {
  public getUSMUsersApi: any = GlobalConstants.fetchMappingApi;
  public comboDatasource = [{}];
  public projectname: any;
  public flowType: any;
  public actionType: string = '';
  public route: Router;
  public onSubmit = false;
  public X = false;
  public id: string;
  bulk: any;
  Truncate: any;
  val : any;
  public checkedBulk: boolean;
  executionType: string;

  constructor(
    private http: HttpClient,
    private _Activatedroute: ActivatedRoute,
    public datepipe: DatePipe,
    private commonFunctions: CommonFunctions,
    private router: Router
  ) {}

  mappingForm = new FormGroup({
    projectname: new FormControl(''),
    executionType: new FormControl(''),
    flowType: new FormControl(''),
    descriptionent: new FormControl(''),
    Bulk: new FormControl(''),
    Truncate: new FormControl(''),
    //  browse
  });

  ngOnInit(): void {
    // this.mappingForm.get('bulk')?.checked == true;

    this.projectname = GlobalConstants.fetchCDSComboApi;
    this.executionType = GlobalConstants.fetchCDSListOfTypeComboApi;
    this.flowType = GlobalConstants.fetchCDSProjectComboApi;

    this._Activatedroute.paramMap.subscribe((params) => {
      this.actionType = params.get('actionType');
      this.id = params.get('id');
      //console.log('first step id >>> ', this.id);
    });

    if (this.id != '' && this.actionType == 'update') {
      localStorage.setItem('MyId', this.id);
      this.onSubmit = true;
      this.X = true;
      this.fetchUserData();
    }
  }

  fetchUserData() {

    //console.log(" the api of the fetch data is >>>>>>>>>" , GlobalConstants.fetchCDSDocDataById );

    this.http
      .get<any>(GlobalConstants.fetchCDSDocDataById + this.id, {
        headers: GlobalConstants.headers,
      })
      .subscribe(
        (res: any) => {

          //console.log('res value >>>>>>>>>>>>>>>>>>  ', res);
          this.mappingForm.controls['projectname'].setValue(res[0].projectId);
          this.mappingForm.controls['executionType'].setValue(res[0].executionType);
          this.mappingForm.controls['flowType'].setValue(res[0].flowType);
          this.mappingForm.controls['descriptionent'].setValue(res[0].mapName);
          if(res[0].isBulkLoadingApplied == '1' ){
            this.mappingForm.controls['Bulk'].setValue(true);
          }
          else{
            this.mappingForm.controls['Bulk'].setValue(false);
          }


          if(res[0].isDataAppended == '1' ){
            this.mappingForm.controls['Truncate'].setValue(true);
          }
          else{
            this.mappingForm.controls['Truncate'].setValue(false);
          }
        },
        (error) => {
          //console.log('fetchUserData ================ ', error);
        }
      );
  }

  public getProjectAPI: any = GlobalConstants.addCDSMappingApi;

  submitForm() {
    if (this.mappingForm.status != 'INVALID') {
      if (this.actionType == 'create') {
        let jsonParams = {};

        if (this.mappingForm.get('Bulk')?.value == true) {
          this.bulk = '1';
        } else {
          this.bulk = '0';
        }
        if (this.mappingForm.get('Truncate')?.value == true) {
          this.Truncate = '1';
        } else {
          this.Truncate = '0';
        }
        jsonParams = {
          projectId: this.mappingForm.get('projectname')?.value,
          executionType: this.mappingForm.get('type')?.value,
          flowType: this.mappingForm.get('flowType')?.value,
          mapName: this.mappingForm.get('descriptionent')?.value,
          isBulkLoadingApplied: this.bulk,
          isDataAppended: this.Truncate,
        };
        //console.log('jsonParam >> ', jsonParams);

        //console.log('url is ', this.getProjectAPI);

        this.http
          .post<any>(this.getProjectAPI, jsonParams, {
            headers: GlobalConstants.headers,
          })
          .subscribe(
            (res: any) => {
              //console.log('jsonData >>>>>>>', res);
              if (res.status == 'Fail') {
                this.commonFunctions.alert("alert", res.description);
              } else {
                //console.log('res is ', res);
                this.actionType = 'update';
                this.id = res.id;
                this.router.navigateByUrl(
                  '/cds/mappingProject/form/' + this.actionType + '/' + this.id
                );
                this.fetchUserData();
              }
            },
            (error) => {
              //console.log(error);
            }
          );

          this.onSubmit = true;
          this.X = true;
      }

      if (this.actionType == 'update') {
        //console.log('in the update ');
        let jsonParams = {};
        //console.log(
        //   'value of the bulk >> ',
        //   this.mappingForm.get('Bulk')?.value
        // );
        // //console.log(
        //   'value of the Truncate >> ',
        //   this.mappingForm.get('Truncate')?.value
        // );
        jsonParams = {
          projectId: this.mappingForm.get('projectname')?.value,
          executionType: this.mappingForm.get('type')?.value,
          flowType: this.mappingForm.get('flowType')?.value,
          mapName: this.mappingForm.get('descriptionent')?.value,
          isBulkLoadingApplied: this.bulk,
          isDataAppended: this.Truncate,
        };
        //console.log('jason data', jsonParams);
        this.http
          .patch(GlobalConstants.updateCDSDocData + this.id, jsonParams, {
            headers: { 'Content-Type': 'application/json' },
          })
          .subscribe((json: any) => {
            //console.log('added successfully');
          });
      }
    }
  }
}
