import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import axios from 'axios';
import { get } from 'jquery';
import { Observable, from, lastValueFrom } from 'rxjs';
import { GlobalConstants } from 'src/app/Kernel/common/GlobalConstants';

@Component({
  selector: 'v-dynamic-search',
  templateUrl: './v-dynamic-search.component.html',
  styleUrls: ['./v-dynamic-search.component.css']
})
export class VDynamicSearchComponent implements OnInit {

  public clearAll:boolean=false;
   public getSearchType :any = '';
   public selectedValue: any; 
   public query :any;
   public getDynamicSearch :any = [];
   public fieldsCombo: any[] = [];
   public firstCombo: any[] = [];
   public thirdCombo: any[] = [];

   public formElem: any[] = [];
   public isDropdownStatus: boolean[] = [];
   public isDate: boolean[] = [];
   public isNumber: boolean[] = [];
   public isText: boolean[] = [];
   public jsonEmpty: any[] = [];
   public isDropdown = false;
   public formElemNum: number = 0;
   public dynamicSearchForm = new FormGroup({});
   public getWhereCond:any = '-1';
  //  public checkIfFIeldExists:any = 'exists';



   @Input() public objectId: any;
   @Input() public sourceQuery: any;

   @Output() public onSearchSubmit: EventEmitter<any> = new EventEmitter();
      // @Output() public onSearchSubmit = new EventEmitter<{ getWhereCondNew: any, checkIfFIeldExistsNew: any }>();

   
  constructor(private formBuilder: FormBuilder, private http: HttpClient) {}

  async ngOnInit(): Promise<void> {

if(this.sourceQuery == null){

  this.sourceQuery = "0";

}else{
 
  this.sourceQuery = "1";

}
    const getDynamicSearchUrl = from(axios.get(GlobalConstants.getDynamicSearch + this.objectId +"/"+ this.sourceQuery ));
    const getDynamicSearch = await lastValueFrom(getDynamicSearchUrl);
    const getSearchTypeUrl = from(axios.get(GlobalConstants.getSearchType));
    const getSearchType = await lastValueFrom(getSearchTypeUrl);
    console.log('getSearchType --->',getSearchType)

    this.dynamicSearchForm = this.formBuilder.group({
      conditions: this.formBuilder.array([]),
      dynamicDropdownControl: [null],
      textControl: [null, Validators.required],
    });
    
    console.log("n getDynamicSearch  ",getDynamicSearch)
    for (let i = 0; i < getDynamicSearch.data.length; i++) {
      this.fieldsCombo.push({
        id: getDynamicSearch.data[i].id,
        name: getDynamicSearch.data[i].name,
        queryId: getDynamicSearch.data[i].isDropdown,
        code : getDynamicSearch.data[i].columnTypeCode
      });
     
      this.isDropdownStatus.push(false);
      this.isDate.push(false);
    }
    console.log('this.fieldsCombo>>>>>>> ',this.fieldsCombo)
    for(let i = 0; i < getSearchType.data.length; i ++) {
      this.firstCombo.push({
        id: getSearchType.data[i].id, 
        name: getSearchType.data[i].name
      });
    }
    console.log('this.firstCombo>>>>>>> ',this.firstCombo)


    setTimeout(() => {
      this.addCondition();
    }, 100)
  }

  addCondition() {
   
    const rowIndex = this.formElemNum;
    const typeDropdownKey = "typeDropdown_" + rowIndex;
    const searchTypeKey = "searchType_" + rowIndex;
    const textKey = "text_" + rowIndex;
    const thirdDropdownKey = "thirdDropdown_" + rowIndex;
    const secondDropdownKey = "secondDropdown_" + rowIndex;

    const newConditionGroup = this.formBuilder.group({
      [typeDropdownKey]: [''],
      [searchTypeKey]: [[]],
      [textKey]: [''],
      [secondDropdownKey]: [[]],
      [thirdDropdownKey]: [[]]
    });

    this.dynamicSearchForm.addControl(typeDropdownKey, newConditionGroup.controls[typeDropdownKey]);
    this.dynamicSearchForm.addControl(searchTypeKey, newConditionGroup.controls[searchTypeKey]);
    this.dynamicSearchForm.addControl(textKey, newConditionGroup.controls[textKey]);
    this.dynamicSearchForm.addControl(thirdDropdownKey, newConditionGroup.controls[thirdDropdownKey]);
  
    this.formElem.push({
      typeDropdown: typeDropdownKey,
      searchType: searchTypeKey,
      text: textKey,
      thirdDropdown: thirdDropdownKey,
      secondDropdown: secondDropdownKey,
      thirdDropdownOptions: [] ,
      secondDropdownOptions: []
    });

    this.dynamicSearchForm.get(typeDropdownKey)?.valueChanges.subscribe(selectedValue => {
      this.onDropdownChange(selectedValue, this.formElem[rowIndex], thirdDropdownKey, rowIndex);
    });

    this.dynamicSearchForm.get(typeDropdownKey)?.valueChanges.subscribe(selectedValue => {
      this.onDropdownChange(selectedValue, this.formElem[rowIndex], secondDropdownKey, rowIndex);
    });
  
    this.formElemNum++;
  }

  async onDropdownChange(selectedValue: any, fields: any, DropDownChange: any, index: number): Promise<void> {
    fields.selectedValue = selectedValue;
    let keyArray = Object.keys(this.fieldsCombo);
  
    this.dynamicSearchForm.get(fields.searchType)?.setValue(null);
    this.dynamicSearchForm.get(fields.text)?.setValue(null);
  
    this.query = "";

    if (this.fieldsCombo[index]) {
      for (let i = 0; i < keyArray.length; i++) {
        if (selectedValue == this.fieldsCombo[i].id) {

          if (this.fieldsCombo[i].queryId != undefined && this.fieldsCombo[i].code == 'COMBO') {

            this.isDropdownStatus[index] = true;
            this.isDate[index] = false;
            this.isNumber[index] = false;
            this.isText[index] = false;
            const selectedValues: string[] = ['1', '2'];
            this.thirdCombo = []; 

            this.formElem[index].secondDropdownOptions = this.firstCombo.filter(item => selectedValues.includes(item.id));
            this.dynamicSearchForm.get(DropDownChange)?.setValue(null);

            const getThirdDropDownUrl = from(axios.post( GlobalConstants.getThirdDropDown + this.fieldsCombo[i].id)  );
            const getThirdDropDown = await lastValueFrom(getThirdDropDownUrl);   
              for(let y = 0; y <getThirdDropDown.data.length; y ++) {

              this.thirdCombo.push({
                id: getThirdDropDown.data[y][0], 
                name: getThirdDropDown.data[y][1]
              });
           
          }

fields.thirdDropdownOptions=this.thirdCombo ;


          } else if (this.fieldsCombo[i].code == 'DATE') {
              this.isDate[index] = true;
              this.isDropdownStatus[index] = false;
              this.isNumber[index] = false;
              this.isText[index] = false;
  
              const selectedValues: string[] = ['1', '2', '3', '4', '5','8'];

              this.formElem[index].secondDropdownOptions = this.firstCombo.filter(item => selectedValues.includes(item.id));;
              this.dynamicSearchForm.get(DropDownChange)?.setValue(null);

              // this.formElem[index].secondDropdownOptions = this.firstCombo.filter(item => selectedValues.includes(item.id));;
              // this.dynamicSearchForm.get(DropDownChange)?.setValue(null);

          } else if (this.fieldsCombo[i].code == 'VARCHAR2') {
              this.isDate[index] = false;
              this.isDropdownStatus[index] = false;
              this.isNumber[index] = false;
              this.isText[index] = true;
              const selectedValues: string[] = ['7', '8', '1', '2'];
              this.formElem[index].secondDropdownOptions = this.firstCombo.filter(item => selectedValues.includes(item.id ));;
              this.dynamicSearchForm.get(DropDownChange)?.setValue(null);

  
          } else if (this.fieldsCombo[i].code == 'NUMBER') {
              this.isNumber[index] = true;
              this.isDate[index] = false;
              this.isDropdownStatus[index] = false;
              this.isText[index] = false;
  
              const selectedValues: string[] = ['1', '2', '5', '6', '3', '4','8'];

              this.formElem[index].secondDropdownOptions = this.firstCombo.filter(item => selectedValues.includes(item.id));;
              this.dynamicSearchForm.get(DropDownChange)?.setValue(null);
            }
        }
      }
    }
  }

  getRowNumber(){
    return this.formElem.length -1 ;
  }

  removeCondition(index: number) {
    const removedRow = this.formElem[index];

    this.formElem.splice(index, 1);
    this.isDropdownStatus.splice(index, 1);
    // this.isDate.splice(index, 1);
  
    this.dynamicSearchForm.removeControl(removedRow.typeDropdown);
    this.dynamicSearchForm.removeControl(removedRow.searchType);
    this.dynamicSearchForm.removeControl(removedRow.text);
    this.dynamicSearchForm.removeControl(removedRow.secondDropdown);
    this.dynamicSearchForm.removeControl(removedRow.thirdDropdown);
  }
  
  async onSubmit() {

    let keyArray = Object.keys(this.fieldsCombo);
    for (let i = 0; i < keyArray.length; i++) {
    }
    let MyList = [];
    let elementSize = 0 ;


    for (let i = 0; i < this.formElem.length; i++) {

      let searchType = this.dynamicSearchForm.controls[this.formElem[i].searchType].value;
      let text       = this.dynamicSearchForm.controls[this.formElem[i].text]?.value;
      let dropdown   = this.dynamicSearchForm.controls[this.formElem[i].typeDropdown]?.value;
      let dropdown2  = this.dynamicSearchForm.controls[this.formElem[i].secondDropdown]?.value;
      let dropdown3  = this.dynamicSearchForm.controls[this.formElem[i].thirdDropdown]?.value;
      let sourceQuery = this.sourceQuery ;

      let item1 ;

     
      if( dropdown3 != null && text == null){
          item1 = {
          "searchType": searchType,
          "text": '',
          "dropdown": dropdown,
          "dropdown2": dropdown2,
          "dropdown3": dropdown3,
          "objectId": this.objectId,
          "sourceQuery": sourceQuery
      }

      }else{
 
        item1 = {
          "searchType": searchType,
          "text": text,
          "dropdown": dropdown,
          "dropdown2": dropdown2,
          "dropdown3": 0,
          "objectId": this.objectId,
          "sourceQuery": sourceQuery
      }
      }
  
      MyList.push(item1);
    }

    if(this.formElemNum <=1 ){
      elementSize = 0;
    }else{
      elementSize = 1;
    }
console.log("MyList   >>>>  ",MyList)
    const getWhereCondUrl = from(axios.post( GlobalConstants.getWhereCondition + "/" +  elementSize   ,  MyList  )  );
    let getWhereCond1 = await lastValueFrom(getWhereCondUrl);

    let getWhereCondNew: any ="-1" ;
    if(getWhereCond1 != undefined){
      this.getWhereCond = getWhereCond1.data;
      getWhereCondNew =this.getWhereCond ;

    }
    if(getWhereCondNew.indexOf(' ')!==-1){
      if(getWhereCondNew.includes('=')){
    const parts = getWhereCondNew.split("=");
    const fieldName = `"${parts[0].trim()}"`;
    const fieldValue = parts[1].trim();
    getWhereCondNew = `${fieldName}=${fieldValue}`;
    }else if(getWhereCondNew.includes('like')){
      const parts = getWhereCondNew.split("like");
      let fieldName = parts[0].trim();
      console.log('fieldName>>>>',fieldName)
      const modifiedFieldName = `upper("${fieldName.substring(fieldName.indexOf('(') + 1, fieldName.lastIndexOf(')'))}")`;
      const modifiedValue = `${parts[1].trim()}`;
      getWhereCondNew = `${modifiedFieldName} like ${modifiedValue}`;
console.log('modifiedFieldName >>>>>>>>>>>',getWhereCondNew)

    }
  }
    console.log(getWhereCondNew)
    this.onSearchSubmit.emit(getWhereCondNew);


    
  }
 
  filterData(data: any[], searchCriteria: any[]): any[] {

    return data.filter(item => {
      return searchCriteria.every(criteria => {
         if (criteria.dropdown && item[criteria.searchType] !== criteria.dropdown) {
          return false;
        }
        if (criteria.text && !item[criteria.searchType].includes(criteria.text)) {
          return false;
        }  
        return true;
      });
    });
  }




  onReset(){

    this.dynamicSearchForm.reset();

    setTimeout(() => {
      this.clearAll=true;
    }, 20);

    setTimeout(() => {
      this.clearAll=false;
    }, 50);  }

}