import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SecurityUserQueryComponent } from './security-user-query/security-user-query.component';
import { InformationService } from 'src/app/Kernel/services/information.service';
import { GlobalConstants } from 'src/app/Kernel/common/GlobalConstants';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-security-query',
  templateUrl: './security-query.component.html',
  styleUrls: ['./security-query.component.css']
})
export class SecurityQueryComponent implements OnInit {
  selectedOption: string = ''; 
  isSelection: boolean =false; 
  public queryId:any;
  public showForm:boolean = true;
  queryTypeForm: FormGroup;
  customText: string ; 
  numberOfUser:number = 0;
  usersCustomText: string;

  constructor(private dialogRef: MatDialogRef<SecurityQueryComponent>,
     public informationservice: InformationService,  
     private dialog: MatDialog,
     private http: HttpClient,
  ) { }


  public userCode: any
public selectedSecurity:any
  ngOnInit(): void{
    this.queryId= JSON.parse(this.informationservice.getAgGidSelectedNode())[0].QBE_ID;
    this.http.post<any>(GlobalConstants.getQbeQueryCreatedBy + this.queryId, { headers: GlobalConstants.headers })
    .subscribe((res: any) => {
        this.customText = res[0].userName;
        this.numberOfUser =res[0].count;
        this.selectedSecurity = res[0].type;
        this.queryTypeForm.controls['option'].setValue(this.selectedSecurity );
        this.usersCustomText = "Users (" + this.numberOfUser + ")" ;

        if(this.selectedSecurity == 'Selection'){
          this.isSelection = true
         
        }else {
          this.isSelection = false
        }

      });

      this.queryTypeForm = new FormGroup({
        option: new FormControl()
        });
        
  }


  rolesCustomText: string = "Roles (" + 0 + ")" ;

  selectOption1()
  {
    const option = this.queryTypeForm.get('option').value;
    
    if(option === 'Selection')
    {
      this.isSelection = true;
    }
    else
    {
      this.isSelection = false;
    }
    // this.selectedOption = option;
  }
  save()
  {
    const option = this.queryTypeForm.get('option').value;

    if(option === 'Public')
    {
      // If public
      this.http.delete<any>(GlobalConstants.deleteQbeSecurityChanges +"/"+this.queryId, {headers: GlobalConstants.headers}).subscribe(
        (res) => {

        })

        this.isSelection = false

    }
    else if(option === 'Private')
      {

        this.http.delete<any>(GlobalConstants.deleteQbeSecurityChanges +"/"+this.queryId, {headers: GlobalConstants.headers}).subscribe(
        (res) => {

        })

        let allData =
        {
          qbeId:this.queryId,
          usrCode:localStorage.getItem("LogeduserId"),
          createdBy:localStorage.getItem("LogeduserId")
        }

        
        this.http.post<any>(GlobalConstants.addQbeAuthorizedUsers, allData, { headers: GlobalConstants.headers }).subscribe(
          (res: any) => {
  
          })

      }
    this.isSelection = false;
  }

  closeDialog() {
    this.dialogRef.close();
  }

  openUserDialog(){
      const dialogRef = this.dialog.open(SecurityUserQueryComponent, {
         data: this.queryId,
        width: '70%',
        height: '70%',
      });
      dialogRef.afterClosed().subscribe(() => {
        this.showForm=false;
        setTimeout(() => {
         this.showForm=true;
        }, 100);
     
      })
    
  }

}
