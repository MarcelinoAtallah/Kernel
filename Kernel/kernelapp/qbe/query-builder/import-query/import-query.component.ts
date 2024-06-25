import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonFunctions } from 'src/app/Kernel/common/CommonFunctions';
import { GlobalConstants } from 'src/app/Kernel/common/GlobalConstants';
import { NewbuttonComponent } from 'src/app/Kernel/kernelapp/in-display/form-builder/newbutton/newbutton.component';
import * as alertify from 'alertifyjs';
import { InformationService } from 'src/app/Kernel/services/information.service';

@Component({
  selector: 'app-import-query',
  templateUrl: './import-query.component.html',
  styleUrls: ['./import-query.component.css']
})
export class ImportQueryComponent implements OnInit {

  constructor(private http: HttpClient,
    @Inject(MAT_DIALOG_DATA) public lookupData: any,
    private dialogRef: MatDialogRef<NewbuttonComponent>,
    public commonFunctions: CommonFunctions,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public informationservice: InformationService) { }

    fileData :any;

  importQueryForm = new FormGroup({
    queryComment: new FormControl(''),
    queryVersion: new FormControl(''), 
    file: new FormControl(''),
  });
  closeDialog(): void {
    this.dialogRef.close();
  }

  onFileSelected(event: any): void {
    const fileInput = event.target;
    const files = fileInput.files;

    if (files && files.length > 0) {
      const selectedFile = files[0];
      this.readFileContent(selectedFile);
    }
  }
  private readFileContent(file: File): void {
    const reader = new FileReader();

    reader.onload = (e) => {
      const fileContent = e.target?.result as string;
      this.fileData=fileContent;
      // You can now use the 'fileContent' variable to access the content of the selected file.
    };

    // Read the file as text. You can use readAsDataURL for images, etc.
    reader.readAsText(file);
  }

  ngOnInit(): void {
  }


  submitForm(){

    return new Promise((resolve, reject) => {
  
      let jsonParams = {};
      jsonParams = {
        userId: this.informationservice.getLogeduserId(),
        queryComments:this.importQueryForm.get('queryComment')?.value,
        queryVersion:this.importQueryForm.get('queryVersion')?.value,
        session_serial:sessionStorage.getItem("session_serial"),
        queryFlag:1,
        file:btoa(this.fileData),  
      };
      
      this.http.post<any>(GlobalConstants.importQuery, jsonParams, { headers: GlobalConstants.headers }).subscribe(
        (res: any) => {
          if (res==0) {
            this.commonFunctions.alert("alert", "Error in Imported Query");
          } else {
            this.closeDialog();
            this.commonFunctions.reloadPage('/qbe/queryBuilder');
            alertify.dialog("alert").set(
              {
                title: 'Query Import',
                transition:'fade',
                message: 'Imported Successfully'
              }
            ).show();           }
        });
    })

  }
}
