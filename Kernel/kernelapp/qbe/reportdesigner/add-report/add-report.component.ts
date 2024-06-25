import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonFunctions } from 'src/app/Kernel/common/CommonFunctions';
import { GlobalConstants } from 'src/app/Kernel/common/GlobalConstants';
import { NewbuttonComponent } from 'src/app/Kernel/kernelapp/in-display/form-builder/newbutton/newbutton.component';
import { InformationService } from 'src/app/Kernel/services/information.service';

@Component({
  selector: 'app-add-report',
  templateUrl: './add-report.component.html',
  styleUrls: ['./add-report.component.css']
})
export class AddReportComponent implements OnInit {
    public isUpdate: boolean = false;

    fileData :any;
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
      console.log('File content:', fileContent);
      this.fileData=fileContent;
      // You can now use the 'fileContent' variable to access the content of the selected file.
    };

    // Read the file as text. You can use readAsDataURL for images, etc.
    reader.readAsText(file);
  }
  constructor(private http: HttpClient,
    @Inject(MAT_DIALOG_DATA) public lookupData: any,
    private dialogRef: MatDialogRef<NewbuttonComponent>,
    public commonFunctions: CommonFunctions,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public informationservice: InformationService)
 { }
  

  reportForm = new FormGroup({
    reportName: new FormControl(''),
    reportDesc: new FormControl(''), 
    file: new FormControl(''),
  });

  closeDialog(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    if(this.data=="add"){
      this.isUpdate=false;
    }else if(this.data=="update"){

      this.isUpdate=true;
    }
  }

  submitForm(){
    return new Promise((resolve, reject) => {
      //let jsonParams = {};
  
      let jsonParams = {
        userId: this.informationservice.getLogeduserId(),
        reportName: this.reportForm.get('reportName')?.value,
        reportDesc:this.reportForm.get('reportDesc')?.value,
        file:encodeURIComponent(this.fileData),  
      };

      this.http.post<any>(GlobalConstants.addNewReport, jsonParams, { headers: GlobalConstants.headers }).subscribe(
        (res: any) => {
          if (res.status == 'Fail') {
            this.commonFunctions.alert("alert", res.description);
          } else {
            this.closeDialog();
            this.commonFunctions.reloadPage(
              "/qbe/reportDesigner");
          }
        });
    })
  }

  updateForm(){
    return new Promise((resolve, reject) => {
      //let jsonParams = {};
  
      let jsonParams = {
        
        reportId:this.informationservice.getAgGidSelectedNode(),
        userId: this.informationservice.getLogeduserId(),
        reportName: this.reportForm.get('reportName')?.value,
        reportDesc:this.reportForm.get('reportDesc')?.value,
        file:encodeURIComponent(this.fileData),  
      };

      this.http.post<any>(GlobalConstants.updateReport, jsonParams, { headers: GlobalConstants.headers }).subscribe(
        (res: any) => {
          if (res.status == 'Fail') {
            this.commonFunctions.alert("alert", res.description);
          } else {
            this.closeDialog();
            this.commonFunctions.reloadPage(
              "/qbe/reportDesigner");
          }
        });
    })
  }

}
