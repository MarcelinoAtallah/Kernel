import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AgColumns } from 'src/app/Kernel/common/AGColumns';
import { CommonFunctions } from 'src/app/Kernel/common/CommonFunctions';
import { GlobalConstants } from 'src/app/Kernel/common/GlobalConstants';
import { EventEmitterService } from 'src/app/Kernel/services/event-emitter.service';
declare let alertify: any;

@Component({
  selector: 'app-project-form',
  templateUrl: './project-form.component.html',
  styleUrls: ['./project-form.component.css'],
})
export class ProjectFormComponent implements OnInit {
  public actionType: string = '';
  public Id : string;
  public agColumnsJson: any;
  public agColumns: AgColumns[] = [];
  public showHideTabs = false;
  public isReadOnly: boolean = false;
  public fileIsRequired : boolean = false ;

  projectForm = new FormGroup({
    comment: new FormControl(''),
    projectDescription: new FormControl(''),
  });

  public getProjectAPI: any = GlobalConstants.addProjectsApi;
  public updateProjectApi: any = GlobalConstants.updateProjectApi;
  public getCDSApi: any = [{}];

  constructor(
    private http: HttpClient,
    private _Activatedroute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this._Activatedroute.paramMap.subscribe((params) => {

      this.actionType = params.get('actionType');
      this.Id = params.get('id');
      //console.log("first step id >>> ",this.Id);

    });

    if (this.Id != '' && this.actionType == 'update') {
      //console.log("rony weter" , this.Id );
      localStorage.setItem('MyId',this.Id);
      this.fetchUserData();
    }
  }

  fetchUserData() {

    this.http.get<any>(GlobalConstants.getProjectApi+ this.Id, {
        headers: GlobalConstants.headers,
      })
      .subscribe(
        (res: any) => {
          //console.log("json is >>> ",res);
          //console.log("comment :"+res[0].comments);
          //console.log("projectName :"+res[0].projectName);
          this.projectForm.controls['comment'].setValue(res[0].comments);
          this.projectForm.controls['projectDescription'].setValue(res[0].projectName);
        },
        (error) => {
          //console.log('fetchUserData ================ ', error);
        }
      );

  }

  submitForm() {
    //console.log("my is is >>>>>>>>>>>>>",this.Id)
    if (this.projectForm.status != 'INVALID') {
      if (this.actionType == 'create') {
        let jsonParams = {};
        jsonParams = {
          comments: this.projectForm.get('comment')?.value,
          projectName: this.projectForm.get('projectDescription')?.value,
        };

        this.http
          .post<any>(this.getProjectAPI, jsonParams, {
            headers: GlobalConstants.headers,
          })
          .subscribe(
            (res: any) => {
              //console.log("value of res is >>> ",res)
              if (res.status == 'Fail') {
                alertify.alert(res.description);
              } else {
                this.actionType = 'update';
                this.Id=res.id;
                this.router.navigateByUrl(
                  '/cds/mainProject/form/' + this.actionType + '/' +this.Id
                );

                this.fetchUserData();

              }
            },
            (error) => {
              //console.log(error);
            }
          );
      }
      if (this.actionType == 'update') {
        let jsonParams = {};
        jsonParams = {

          comments: this.projectForm.get('comment')?.value,
          projectName: this.projectForm.get('projectDescription')?.value,

        };
        //console.log('jason data', jsonParams);
 this.http.patch(GlobalConstants.updateProjectApi+ this.Id ,jsonParams,
  {headers :{'Content-Type': 'application/json'}}).subscribe((json : any)=>{
   //console.log('added successfully')
 })
      }
    }
  }
}
