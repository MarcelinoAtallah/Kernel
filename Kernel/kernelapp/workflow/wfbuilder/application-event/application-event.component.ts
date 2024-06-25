import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AgColumns } from 'src/app/Kernel/common/AGColumns';
import { CommonFunctions } from 'src/app/Kernel/common/CommonFunctions';

//For getting the smallest value in the beginTime column
interface columnData {
  id: number;
  beginTime: string;
}

@Component({
  selector: 'app-application-event',
  templateUrl: './application-event.component.html',
  styleUrls: ['./application-event.component.css']
})
export class ApplicationEventComponent implements OnInit {
  public number: number;
  public agColumnsSchedule: AgColumns[] = [];
  public agColumnsJsonSchedule: any;
  public agColumns: AgColumns[] = [];
  public agColumnsJson: any;
  public showGrid = false;

  //for the bottom pop up for each tab
  public listActivities: boolean = false;
  public listActivities2: boolean = false;
  public listActivities3: boolean = false;

  //array to use to get the smallest beginTime value 
  public column: columnData[]=[];
  public count: number = 0;

  //Variable that will establish startProcess's inputs
  public startProcess: string='';

  //For business menu in the trigger tab
  public showSublist1: boolean = false;
  public showSublist2: boolean = false;

  //for business Object Condition tab
  public showBusinessObjectSub: boolean = false;

  public ruleAction = [
    { id: 1, name: 'On Change' },
    { id: 2, name: 'On Load' },
    { id: 3, name: 'On Before Save' },
    { id: 4, name: 'On After Save' },
    { id: 5, name: 'Where Condition' },
    { id: 6, name: 'On Change 2' },
    { id: 7, name: 'On Load 2' },
    { id: 8, name: 'On Before Save 2' },
    { id: 9, name: 'On After Save 2' },
    { id: 10, name: 'Where Condition 2' },
    { id: 11, name: 'On Change 3' },
    { id: 12, name: 'On Load 3'},
    { id: 13, name: 'On Before Save 3' },
    { id: 14, name: 'On After Save 3' },
    { id: 15, name: 'Where Condition 3' },
    { id: 16, name: 'On Change 4' },
    { id: 17, name: 'On Load 4' },
    { id: 18, name: 'On Before Save 4' },
    { id: 19, name: 'On After Save 4' },
    { id: 20, name: 'Where Condition 4' }
  ];

  public batchType = [
    { id: 1, name: 'All occurences' },
    { id: 2, name: 'First Occurence' },
    { id: 3, name: 'Last Occurence' },
  ];

  public time = [
    { id: 1, name: 'Daily' },
    { id: 2, name: 'Weekly' },
  ];

  public triggerActionType = [
    { id: 1, name: 'Add' },
    { id: 2, name: 'Delete' },
    { id: 3, name: 'Modify' },
  ];
  public conditionsDropdown = [
    { id: 1, name: 'Greater Than' },
    { id: 2, name: 'Equal To' },
    { id: 3, name: 'In' },
  ];

  public list = [
    {name: 'Message Definition',
     subItems: ['Message Id', 
                'Business Process Activity Instance Identifier', 
                'Current Status Code', 
                'Current Status Begin Date']}
  ];

  definitionForm = new FormGroup({
    activityName: new FormControl(''),
    applicationName: new FormControl(''),
    batchType: new FormControl(''),
    option: new FormControl(''),
    time: new FormControl(''),
    timeInput: new FormControl(''),
    objectCount: new FormControl(''),
    schedule: new FormControl(''),
  });

  triggerForm = new FormGroup({
    actionType: new FormControl(''),
    triggerToggle: new FormControl(''),
  });

  conditionForm = new FormGroup({
    conditionsDropdown: new FormControl(''),

  });

  constructor(@Inject(MAT_DIALOG_DATA) 
              public data: any,
              public dialogApp: MatDialogRef<ApplicationEventComponent>,
              private commonFunctions: CommonFunctions,
            ) {}

  ngOnInit(): void {
    this.number = this.data.id;
    //Setting the value of the input on initiation of the pop up 
    this.definitionForm.controls['activityName'].setValue(this.data.name);

    //to create the definition schedule grid
    this.CreateGridSaveNew(); 
  }

  CreateGridSaveNew() {
    this.agColumnsJson = [
      {
        headerName: '',
        field: '',
        checkboxSelection: true,
        maxWidth: '50',
        headerCheckboxSelection: true
      },
      {
        headerName: 'ID',
        field: 'id',
        cellEditor: 'agTextCellEditor',
        editable: true
      },
      {
        headerName: 'Begin Time',
        field: 'beginTime',
        cellEditor: 'agTextCellEditor',
        editable: true
      },
      {
        headerName: 'End Time',
        field: 'endTime',
        cellEditor: 'agTextCellEditor',
        editable: true
      },
      {
        headerName: 'Reference',
        field: 'reference',
        cellEditor: 'agTextCellEditor',
        editable: true
      },
    ]
    this.agColumns.push(this.agColumnsJson);
    
    this.agColumnsJsonSchedule = [
      {
        headerName: '',
        field: '',
        checkboxSelection: true,
        maxWidth: '50',
        headerCheckboxSelection: true
      },
      {
        headerName: 'Begin Time',
        field: 'beginTime',
        cellEditor: NumericCellEditor,
        cellRenderer: CellRenderer,
        editable: true,
        onCellValueChanged: (params: any) => {
          this.updateChanges(params);
          // Reset End Time if Begin Time is edited
          params.data.endTime = null;
          //Ag grid transaction reset
          params.api.applyTransaction({ update: [params.data] });
        }
      },
      {
        headerName: 'End Time',
        field: 'endTime',
        cellEditor: NumericCellEditor,
        
        cellRenderer: (params: any) => {
          const endTime = params.data.endTime;
          const beginTime = params.data.beginTime;
          
          if (endTime !== null && beginTime !== null && endTime <= beginTime) {
            this.commonFunctions.alert("alert","End Time cannot be less than or equal to Begin Time");
            // Reset End Time if Begin Time is edited
            params.data.endTime = null;
            //Ag grid transaction reset
            params.api.applyTransaction({ update: [params.data] });
            // Invoke a function to handle rendering after reset
            renderCell(params);
            // Return null to prevent rendering anything in the cell
            return '<span>__ : __</span>';
          }
          // If endTime is valid, render the cell normally
          return renderCell(params);
        },

        editable: function(params: any) {
          // Set editable to true only if Begin Time has a value
          return !!params.data.beginTime; 
        }
      },
    ]
    // Function to handle rendering logic
    function renderCell(params: any) {
      // Instead of returning the CellRenderer class itself, create an instance
      const cellRendererInstance = new CellRenderer();
      // Initialize with params
      cellRendererInstance.init(params); 
      // Return the rendered GUI of the cell renderer instance
      return cellRendererInstance.getGui();
    }

    this.agColumnsSchedule.push(this.agColumnsJsonSchedule);
    this.showGrid = true;  
  }

  //function for taking the smallest value from the grid
  //saving it in start process
  updateChanges(params: any) {
    console.log("params: ", params);
    //takes the params from the cell
    let editedRow = params.data;
    console.log("editedRow: ", editedRow);

    // If it doesn't have a valid id
    if (!editedRow.id) {
      // Assign a new unique id
      editedRow.id = this.count++; 
      console.log("editedRow.id :", editedRow.id);
      console.log("count :", this.count);
    }
    console.log("editedRow.id: after", editedRow.id);
    
    // If the id does not match with one in the column array, result to -1
    let rowIndex = this.column.findIndex(row => row.id === editedRow.id);
    console.log("rowIndex: ", rowIndex);

    //if it's not -1, meaning the id matches with one in the column array
    if (rowIndex !== -1) {
      // Update the corresponding row in the column array
      this.column[rowIndex].beginTime = editedRow.beginTime;
      console.log("this.column edited:  ", this.column);
    }else{
      //if it does result in -1, add a new row in column array with the params's id and beginTime
      this.column.push(editedRow);
      console.log("editedRow :", editedRow);
      console.log("this.column added:", this.column);
    }

    // Check column for begin time values
    if (this.column && this.column.length > 0) {
      console.log("this.column: ", this.column);
      //transform the strings in this.column to numbers so we can compare them
      const beginTimes: number[] = this.column
                                       .filter((item: any) => item.beginTime !== undefined && item.beginTime !== null) // Filter out null and undefined values
                                       .map((item: any) => parseInt(item.beginTime)); // map the rest of the values
      
      // Filter out duplicates
      const uniqueBeginTimes = [...new Set(beginTimes)];

      //if uniqueBeginTime doesn't have the same length as BeginTimes, it means that a duplicate 
      //was now inserted, so skip to the alert and reset of the cell
      if(uniqueBeginTimes.length === beginTimes.length){
        //if beginTimes has values in it
        if(beginTimes && beginTimes.length>0){
          console.log("beginTimes : ",beginTimes);
          //go through beginTimes and same the lowestBeginTime
          const lowestBeginTime: number = Math.min(...beginTimes);

          console.log("lowestBeginTime : ",lowestBeginTime);

          //being a number, all 0's at the start will be deleted, which we need for the 
          //hours and minutes, so we put them back depending on how many digits
          //the lowestBeginTime has
          let updatedProcess: string;
          if (lowestBeginTime < 10) {
            updatedProcess = '000' + lowestBeginTime.toString();
          } else if (lowestBeginTime < 100) {
            updatedProcess = '00' + lowestBeginTime.toString();
          } else if (lowestBeginTime < 1000) {
            updatedProcess = '0' + lowestBeginTime.toString();
          } else {
            updatedProcess = lowestBeginTime.toString();
          }
          console.log("updatedProcess : ",updatedProcess);

          //saving the result into a string, and saving it into startProcess
          this.startProcess = updatedProcess.toString();
          console.log("this.startProcess update : ",this.startProcess);

          //splitting startProcess which is a 4 digit string into two
          //first two for hours, second two are for minutes
          const hours = this.startProcess.substring(0, 2);
          const minutes = this.startProcess.substring(2, 4);
          console.log("start process hours :", hours);
          console.log("start process minutes :", minutes);

          //TURNED OFF HERE , COPY PASTED FROM SCHEDULE TO USE FOR THE ALERT
          //setting them in start the process input
          // this.definitionForm.controls['hour'].setValue(hours);
          // this.definitionForm.controls['minute'].setValue(minutes);
        }else{
          //if the beginTimes array is empty, empty out the start process input 
          // this.definitionForm.controls['hour'].setValue('');
          // this.definitionForm.controls['minute'].setValue('');
        }
      }else{
        //deplicate was found, so alert
        this.commonFunctions.alert("alert","This time is Already in use");
        // Reset begin Time
        params.data.beginTime = null;
        //Ag grid transaction reset
        params.api.applyTransaction({ update: [params.data] });
      }
    }
  }

  //for the bottom left label click definition
  toggleListActivities() {
    this.listActivities = !this.listActivities;
    this.definitionForm.get('option').reset();
  }

  //for the bottom left label click trigger
  toggleListActivities2() {
    this.listActivities2 = !this.listActivities2;
  }

  //for the bottom left label click condition
  toggleListActivities3() {
    this.listActivities3 = !this.listActivities3;
  }
  
  //opens and closes the first list Trigger menu
  toggleSublist1() {
    this.showSublist1 = !this.showSublist1;

    //if the second list is open, pressing the first list to close it closes both
    // if(this.showSublist2 == true){
    //   this.showSublist1 = !this.showSublist1;
    //   this.showSublist2 = !this.showSublist2;
    // }else{
    //   this.showSublist1 = !this.showSublist1;
    // }
  }
  //open and closes the second list Trigger Business menu
  toggleSublist2() {
    this.showSublist2 = !this.showSublist2;
  }

  //opens and closes the Business Object list in conditions
  toggleBusinessObjectList(){
    this.showBusinessObjectSub = !this.showBusinessObjectSub;
  }

  //to get the numbers before each element in the lists
  getSubItemNumber(subIndex: number): number {
    let count = 1;
    return count + subIndex;
  }

  resetValues(){
    //reset the values of the inputs
    this.definitionForm.controls['time'].setValue('');
    this.definitionForm.controls['timeInput'].setValue('');
    this.definitionForm.controls['objectCount'].setValue('');
  }
  
  //for the X close button
  closeDialog(): void {
    // closes the application event pop up
    this.dialogApp.close();
  }

}

///////////////////////////////////////////////////////////////////////////////////////////////////////
// Custom cell editor for numeric input (how its being filled)
class NumericCellEditor {
  private params: any;
  private eInput: HTMLInputElement;

  init(params: any) {
    // creates a param variable
      this.params = params;
      //creates an input inside the cell
      this.eInput = document.createElement('input');
      //if the value is undefined, don't save it
      if (params.value != undefined) {
        this.eInput.value = this.params.value;
      }
      //how the input looks
      this.eInput.style.width = '100%';
      this.eInput.style.height = '100%';
      this.eInput.style.boxSizing = 'border-box';
      //adding an eventListener to the keypress
      this.eInput.addEventListener('keypress', this.isNumeric.bind(this));
  }

  //Doesn't allow non numeric characters to be pressed and places a max of 4 characters to be given
  isNumeric(event: KeyboardEvent) {
    const charCode = event.charCode;
    if (charCode >= 48 && charCode <= 57 && this.eInput.value.length < 4) {
      // Allow numeric characters
      return true; 
    }
    event.preventDefault();
  }

  getGui() {
    return this.eInput;
  }

  afterGuiAttached() {
    this.eInput.focus();
  }

  //the value that the cell will have DIFFERENT from what it shows in the renderer
  getValue() {
    if(this.eInput.value !=undefined && this.eInput.value!='' && this.eInput.value.trim().length === 4){
      //takes the inputed value
      const value = this.eInput.value;
      //breaks it to two , hours and minutes, taking a maximum value of 23 for hours, and 59 for
      //minutes
      const hours = Math.min(parseInt(value.substring(0, 2), 10), 23);
      const minutes = Math.min(parseInt(value.substring(2), 10), 59);

      // Ensure hours and minutes are always two-digit strings with leading zeros
      // so that 01, isn't saved as 1 or 00 as 0.
      const formattedHours: string = (hours < 10 ? '0' : '') + hours.toString();
      const formattedMinutes: string = (minutes < 10 ? '0' : '') + minutes.toString();

      // Concatenate hours and minutes
      const concatenatedValue: string = formattedHours + formattedMinutes;

      console.log("hours : ", hours)
      console.log("minutes : ", minutes)
      console.log("formattedHours : ", formattedHours)
      console.log("formattedMinutes : ", formattedMinutes)
      console.log("concatenatedValue : ", concatenatedValue)
      //The value of the cell, being used as params.value in the cellrenderer
      return concatenatedValue;
    }
  }

  destroy() {}

  isPopup() {
    return false;
  }

  refresh(params: any) {
    // Handle refresh if needed
    return false;
  }
}

// Custom cell renderer (how it looks)
class CellRenderer {
  eGui: any;

  init(params: any) {
    if (typeof params.value === 'string' && params.value.trim() !== '') {
      //saves the value from the editor
      const valueWithoutSpaces = params.value.trim();
      if (valueWithoutSpaces.length >= 4) {
        //breaks it into two for hours and minutes
        const hours = valueWithoutSpaces.substring(0, 2);
        const minutes = valueWithoutSpaces.substring(2, 4);

        //outputs it to the user
        this.eGui = document.createElement('div');
        this.eGui.innerHTML = `<span>${hours} : ${minutes}</span>`;
      } else {
        // Handle case where value doesn't have enough characters
        this.eGui = document.createElement('span');
        this.eGui.innerText = '__ : __';;
      }
    } else {
      // If not editable or if data not available
      this.eGui = document.createElement('span');
      this.eGui.innerText = '__ : __';
    }
  }

  getGui() {
    // Return the rendered element
    return this.eGui;
  }

  refresh(params: any) {
    // Handle refresh if needed
    return false;
  }
}