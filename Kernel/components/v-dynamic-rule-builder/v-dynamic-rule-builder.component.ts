import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AgColumns } from 'src/app/Kernel/common/AGColumns';
import { GlobalConstants } from 'src/app/Kernel/common/GlobalConstants';
import { DynamicBuilderFormComponent } from './form/form.component';
import { HttpClient } from '@angular/common/http';
import { ColumnModifierComponent } from 'src/app/Kernel/kernelapp/in-display/form-builder/column-modifier/column-modifier.component';
import { Router } from '@angular/router';
import { RefreshDialogService } from 'src/app/Kernel/services/refresh-dialog.service';
import { CommonFunctions } from 'src/app/Kernel/common/CommonFunctions';
import { InformationService } from 'src/app/Kernel/services/information.service';
import axios from 'axios';
import { from } from 'rxjs';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'v-dynamic-rule-builder',
  templateUrl: './v-dynamic-rule-builder.component.html',
  styleUrls: ['./v-dynamic-rule-builder.component.css']
})
export class VDynamicRuleBuilderComponent implements OnInit {
  public agColumns: AgColumns[] = [];
  public agColumnsJson: any;
  //boolean variable to show and hide the import/export popup
  public showPopup: boolean = false;


  constructor(private dialog: MatDialog,
    private http: HttpClient,
    private refreshService: RefreshDialogService,
    private commonFunctions: CommonFunctions,
    public informationservice: InformationService) { }

  @Input() public objectId: string = '';
  @Input() public columnId: string = '';
  @Input() public drbPlace: string = '';
  // @Input() public reloadUrl: string = '';

  public getDynamicRuleBuilderGrid: string = "";

  ngOnInit(): void {
    
    this.refreshService.notifyObservable$.subscribe(res => {
      if (res.refresh) {
        this.getDynamicRuleBuilderGrid = "";
        setTimeout(() => {
          this.loadData();
        }, 1000);
        return;
      }
    });
    this.loadData();
  }

  loadData() {
    this.agColumnsJson = [
      {
        headerName: '',
        field: '',
        checkboxSelection: true,
        maxWidth: '50',
        headerCheckboxSelection: true
      },
      {
        headerName: 'Rule ID',
        field: 'ruleId',
        filter: 'agTextColumnFilter',
        defaultMinWidth: '180'
      },
      {
        headerName: 'Rule Description',
        field: 'ruleDescription',
        defaultMinWidth: '180',
        filter: 'agTextColumnFilter'
      },
      {
        headerName: 'Action Type',
        field: 'actionType',
        defaultMinWidth: '180',
        filter: 'agTextColumnFilter'
      }
    ]
    this.agColumns.push(this.agColumnsJson);
    this.columnId = this.columnId == "" ? "0" : this.columnId;
    console.log("value of the columnId is :: ",this.columnId);
    console.log("value of the objectId is :: ",this.objectId);

    this.getDynamicRuleBuilderGrid = GlobalConstants.getDBRGrid + this.objectId + "/" + this.columnId;
  }

  onGridAdd() {
    let data = [{ objectId: this.objectId, columnId: this.columnId, actionType: 'saveNew', ruleId: '', drbPlace: this.drbPlace }];
    const dialogRef = this.dialog.open(DynamicBuilderFormComponent, {
      width: "900px",
      height: "700px",
      data: data
    });
    dialogRef.disableClose = true;
    dialogRef.afterClosed().subscribe(result => {
      this.commonFunctions.navigateToPage(this.informationservice.getDynamicRuleBuilderReloadUrl());
    });
  }

  onGridDelete() {
    const storedData = this.informationservice.getAgGidSelectedNode(); 
    const dataArray = storedData.split(',');
    const lastItem = dataArray[dataArray.length - 1];

    // this.informationservice.setAgGidSelectedNode(lastItem);
    this.http.post<any>(GlobalConstants.deleteDRBRule + lastItem, { headers: GlobalConstants.headers }).subscribe(
      (res: any) => {
        if (res.status == 'Fail') {
          this.commonFunctions.alert("alert", res.description);
        } else {
          this.commonFunctions.alert("alert", res.description);
        }
          this.getDynamicRuleBuilderGrid = "";
          setTimeout(() => {
            this.loadData();
          }, 300);
        this.commonFunctions.navigateToPage(this.informationservice.getDynamicRuleBuilderReloadUrl());
      });
  }

  onGridUpdate() {
    if(this.informationservice.getAgGidSelectedNode().includes(",")){
      this.commonFunctions.alert("alert", "Please select only one row.");
    }else{
      // let test = this.informationservice.getAgGidSelectedNode().toString();
      // let numbersArray: string[] = test.split(',');
      // let lastNumber: string = numbersArray[numbersArray.length - 1];
      // let lastNumericValue: number = +lastNumber; 
  
      let data = [{ objectId: this.objectId, columnId: this.columnId, actionType: 'update', ruleId: this.informationservice.getAgGidSelectedNode(), drbPlace: this.drbPlace }];
      const dialogRef = this.dialog.open(DynamicBuilderFormComponent, {
        width: "900px",
        height: "700px",
        data: data
      });
      dialogRef.disableClose = true;
      dialogRef.afterClosed().subscribe(result => {
          // // this.commonFunctions.reloadPage(this.reloadUrl);
          // this.informationservice.setAgGidSelectedNode(this.objectId);
          this.informationservice.setAgGidSelectedNode('');
          this.commonFunctions.reloadPage('/dsp/augmentedConfig/form/update/'+this.objectId+'/'+this.objectId+'/tabConfiguration');
      });
    }
  }

  importRules(event: any) {
    //close the pop up when import is pressed
    this.showPopup = false;

    //if a valid file is selected 
    const file: File = event.target.files[0];
    if (file) {
      // Check if the file is a .json file
      if (file.type !== 'application/json' && !file.name.endsWith('.json')) {
        this.commonFunctions.alert("alert", "Please select a valid .json file.");
        return;
      }

      //variable that will read the file
      const reader = new FileReader();
      
      //function that will read the file's content and then run the unload
      reader.readAsText(file);
      
      //read the file on load
      reader.onload = async (e) => {
        //save the information of the file into content as a string
        const content = reader.result as string;
        //convert it into a json string
        let allRuleDataImport=JSON.parse(content);

        //sending the object id and the body to the backend
        const importDynamicRulesApi = from(axios.post(GlobalConstants.importDynamicRulesApi +this.objectId,allRuleDataImport));
        const importDynamicRules = await lastValueFrom(importDynamicRulesApi);

        //returning 1 if the addition to the table was successful or 0 if it failed
        if(importDynamicRules.data == 1){
          this.commonFunctions.alert("alert", "Import Successful");
          //reloading the page once an import is successful to refresh the table
          this.commonFunctions.reloadPage('/dsp/augmentedConfig/form/update/'+this.objectId+'/'+this.objectId+'/tabConfiguration');
        }else if(importDynamicRules.data == 0){
          this.commonFunctions.alert("alert", "Import Fail");
        }
      };
    }
  }


  exportRules(){
    //close the pop up when export is pressed
    this.showPopup = false;
    //if user selects rows or if getAgGidSelectedNode has a json array value
    if (this.informationservice.getAgGidSelectedNode()=="" || this.informationservice.getAgGidSelectedNode().startsWith('[{"')){
      this.commonFunctions.alert("alert", "Select rules to export!");
    }else{
      //saving the ids needed into a new variable
      let rulesToExport=this.informationservice.getAgGidSelectedNode();
      
      //sending them to the backend and back as a string, turned into a json source file
      //and downloaded using the browser
      this.http.post<any>(GlobalConstants.exportRules+rulesToExport, { headers: GlobalConstants.headers },{}).subscribe(
        (res: any) => { 
          if(res!=null){  
            //can be changed to text/csv for .text , or some other type needed
            const fileType = 'application/json';
            //the name of the saved file, starting with the tab name
            const fileName =this.informationservice.getSelectedTabName().toString()+"'s dynamic rules";
            
            //turning the string coming from the backend into a json string 
            const byteCharacters = JSON.stringify(res);
            //turning the json string into bytes 
            const byteNumbers = new Array(byteCharacters.length);
            //turning all characters to their respective ASCII numeric value
            for (let i = 0; i < byteCharacters.length; i++) {
              byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            //converts the numeric values into a typed javascript array
            const byteArray = new Uint8Array(byteNumbers);
            //creates the file with the needed type
            const blob = new Blob([byteArray], { type: fileType });
            //creates a url for the file
            const url = URL.createObjectURL(blob);

            //creates a link <a> in html
            const link = document.createElement('a');
            //with a link
            link.href = url;
            //a name
            link.download = fileName;
            //and a click event to use the link
            link.click();

            //this deletes all the data from said link after the download was initiated
            URL.revokeObjectURL(url);
          }else{
            this.commonFunctions.alert("alert", "Invalid Rule To Export!");
          }
        }
      );
    }
  }

}
