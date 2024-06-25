import { HttpClient } from '@angular/common/http';
import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AgColumns } from 'src/app/Kernel/common/AGColumns';
import { GlobalConstants } from 'src/app/Kernel/common/GlobalConstants';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { VLookupComponent } from 'src/app/Kernel/components/v-input/v-lookup/v-lookup.component';
import { InformationService } from 'src/app/Kernel/services/information.service';

@Component({
  selector: 'app-security-user-query',
  templateUrl: './security-user-query.component.html',
  styleUrls: ['./security-user-query.component.css']
})
export class SecurityUserQueryComponent implements OnInit {

  selectedQueryForm = new FormGroup({
    selectedMainQuery : new FormControl('')
  });

  public getQueryList=GlobalConstants.getQueryList;
  public agColumns: AgColumns[] = [];
  public agColumnsJson: any;

  public agColumns1: AgColumns[] = [];
  public agColumnsJson1: any;

  public isOnAddClick: boolean =false;
  public getSourceQuery :any;
  public queryId :any;
  public lookupFieldName:any;

  public getusers =GlobalConstants.getSecurityUserQuery +this.data;

  public getQueryListUsers: any;
  public showgrid:boolean = true;


  constructor(  @Inject(MAT_DIALOG_DATA) public data: any,
  public informationservice: InformationService,
  private http: HttpClient,
  private dialog: MatDialog,
    private fb: FormBuilder // Inject FormBuilder
) { }

  ngOnInit(): void {
    this.queryId=this.data;
    this.getQueryListUsers= GlobalConstants.getQueryListUsers+this.queryId;
    this.selectedQueryForm = this.fb.group({
      selectedMainQuery: ['', Validators.required]
    });
    this.agColumnsJson = [
      {
        headerName: '',
        field: '',
        checkboxSelection: true,
        width: '25px',
        headerCheckboxSelection: true
      }, {
        headerName: 'User Id',
        field: 'USERID',
        width: '25px',
      },
      {
        headerName: 'User Name',
        field: 'USERNAME',
        width: '25px',
      }
    ];

    this.agColumns.push(this.agColumnsJson);
    }



  onDeleteClick(){


     this.http.delete<any>(GlobalConstants.deleteQbeAuthorizedUsers +this.queryId+"/"+this.informationservice.agGidSelectedNode, {headers: GlobalConstants.headers}).subscribe(
       (res) => {

       })
       this.showgrid=false;
       setTimeout(() => {
        this.showgrid=true;
       }, 100);
  }

  onAddClick()
  {
    let data: any[];
    if (this.getQueryListUsers != '')
    {
      data =
      [
        {
          lookupDataId: this.getQueryListUsers,
          lookupStaticData: '',
          lookupSelection: 'multiple',
          lookupFieldName:'securityUserQuery'
          // readonly:this.readonly
        }
      ];
    }

    
    this.isOnAddClick = true;
    const dialogRef = this.dialog.open(VLookupComponent, {
      width: '35%',
      height: '70%',
      data: data 
    });


    dialogRef.afterClosed().subscribe(() => {
      console.log(this.informationservice.setAgGidSelectedNode);
      localStorage.removeItem("agGidSelectedLookup_(securityUserQuery)_id");
      localStorage.removeItem("agGidSelectedLookup_(securityUserQuery)_name");

      
      if(this.informationservice.setAgGidSelectedNode != null){
      let allData ={
        qbeId:this.queryId,
        usrCode:this.informationservice.getLookUpSubmitValue(),
        createdBy:localStorage.getItem("LogeduserId")
      }
      console.log(allData)
      this.http.post<any>(GlobalConstants.addQbeAuthorizedUsers, allData, { headers: GlobalConstants.headers }).subscribe(
        (res: any) => {

        })
      }else{

      }
      this.showgrid=false;
   setTimeout(() => {
    this.showgrid=true;
   }, 100);

    });

  }
}
