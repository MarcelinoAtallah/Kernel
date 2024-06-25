import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import axios from 'axios';
import { from, lastValueFrom } from 'rxjs';
import { GlobalConstants } from 'src/app/Kernel/common/GlobalConstants';
import { InformationService } from 'src/app/Kernel/services/information.service';

@Component({
  selector: 'app-type-query',
  templateUrl: './type-query.component.html',
  styleUrls: ['./type-query.component.css']
})
export class TypeQueryComponent implements OnInit {
  //the query selected for type change or addition
  public queryID = JSON.parse(this.informationservice.getAgGidSelectedNode())[0].QBE_ID;
  // the string of ids needed to be added
  public queryTypeString: string = '';
  //if there are already types chosen, it'll be 1, if not, changed to 0
  public typeExists: number = 0;
  public showAll=false;
  //form used for the toggles
  queryTypeForm: FormGroup;

  //static list of query type options
  queryTypes = [
    { id: 8, name: 'Status Management' },
    { id: 3, name: 'Workflow Condition' },
    { id: 4, name: 'Workflow Email Recipient' },
    { id: 5, name: 'Workflow User Recipient' },
    { id: 6, name: 'Search Engine Indexing' },
    { id: 7, name: 'Portlet' },
    { id: 10, name: 'Integration' },
    { id: 12, name: 'Auto Completion' },
    { id: 13, name: 'KPI Main Indicator' },
    { id: 14, name: 'KPI Last Refreshed Data' }
  ];
  
  constructor(public informationservice: InformationService,
    private dialogRef: MatDialogRef<TypeQueryComponent>
  ){this.createFormControls(); }//gives a control name to toggles 
  
  //since each toggle needs a control name we need to create a function that will 
  //give each toggle its controller.
  createFormControls() {
    const group: any = {};
    //going through all queryTypes element creating its control name
    this.queryTypes.forEach(item => {
      group[item.id] = new FormControl(false);
    });
    //applies the added control names to the form parent
    this.queryTypeForm = new FormGroup(group);
  }

  async ngOnInit(): Promise<void> {

    const checkQueryTypeExistsApi = from(axios.get(GlobalConstants.checkQueryTypeExistsApi + this.queryID));
    const checkQueryTypeExists = await lastValueFrom(checkQueryTypeExistsApi);
    
    if(checkQueryTypeExists.data==null ||checkQueryTypeExists.data.length==0){
      this.typeExists=0;
    }else{
      this.typeExists=1;
    }
    setTimeout(() => {
      for(let i=0;i<checkQueryTypeExists.data.length;i++){
       
      this.queryTypeForm.controls[checkQueryTypeExists.data[i].queryTypeCode].setValue("1");
      
        if(i==checkQueryTypeExists.data.length-1){
          this.queryTypeString+=checkQueryTypeExists.data[i].queryTypeCode;
        }else{
          this.queryTypeString+=checkQueryTypeExists.data[i].queryTypeCode+",";
        }
      
      //this.toggle(checkQueryTypeExists.data[i].queryTypeCode.toString());
    }
      this.showAll=true;
    }, 500);

    
    
  }

  toggle(id: number): void {
    //getting the name of the toggle
    console.log("AAAAAAA11111>>>>>>>>>",this.queryTypeForm.get(id.toString()).value);
    const control = this.queryTypeForm.get(id.toString());

    //if it's turning off, losing its value
    if (control?.value) {
      console.log('Toggled off:', '');
      // Remove id from queryTypeString
      const ids = this.queryTypeString.split(',').filter(item => item !== id.toString());
      //reconstructing the string with the id popped out
      this.queryTypeString = ids.join(',');
    } else {
      //when it's turning on, getting a value, adding it to the queryTypeString if it's not already added
      console.log('Toggled on:', id);
      if (!this.queryTypeString.includes(id.toString())) {
        this.queryTypeString += this.queryTypeString ? `,${id}` : `${id}`;
      }
    }
    console.log("AAAAAAA22222>>>>>>>>>",this.queryTypeForm.get(id.toString()).value);

    console.log('queryTypeString>>>>>>>>>>>>>>>>>:', this.queryTypeString);
  }

  async saveQueryType(){
    
    
    const insertQueryTypeApi = from(axios.post(GlobalConstants.insertQueryTypeApi + this.queryID + "/" + this.queryTypeString) );
    const insertQueryType = await lastValueFrom(insertQueryTypeApi);
    this.closeDialog();

  }

  async updateQueryType(){
    if(this.queryTypeString==""){
      this.queryTypeString="none";
    }
    console.log("IN UPDATE MODE");
    const updateQueryTypeApi = from(axios.post(GlobalConstants.updateQueryTypeApi + this.queryID + "/" + this.queryTypeString) );
    const updateQueryType = await lastValueFrom(updateQueryTypeApi);

    this.closeDialog();
  }

  closeDialog() {
    this.dialogRef.close();
  }

}
