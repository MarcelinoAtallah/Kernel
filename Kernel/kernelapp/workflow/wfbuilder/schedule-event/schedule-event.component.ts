import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AgColumns } from 'src/app/Kernel/common/AGColumns';
import { InformationService } from 'src/app/Kernel/services/information.service';
import { CommonFunctions } from 'src/app/Kernel/common/CommonFunctions';

//For getting the smallest value in the beginTime column
interface columnData {
  id: number;
  beginTime: string;
}

@Component({
  selector: 'app-schedule-event',
  templateUrl: './schedule-event.component.html',
  styleUrls: ['./schedule-event.component.css']
})
export class ScheduleEventComponent implements OnInit {

  public number: number;
  public agColumnsDaily: AgColumns[] = [];
  public agColumnsJsonDaily: any;
  public agColumns: AgColumns[] = [];
  public agColumnsJson: any;
  public showGrid = false;

  //variable for the day selected
  public selectDay: string;
  //array for the months selected
  public selectMonths: any;
  
  //for the bottom pop up
  public listActivities: boolean = false;

  //Variables for the hour minute input
  public hour: string = '';
  public minute: string = '';

  //Variable for number of hour difference for the schedule grid
  public everyHour: number= 0;

  //Variable that will establish startProcess's inputs
  public startProcess: string='';

  //array to use to get the smallest beginTime value 
  public column: columnData[]=[];
  public count: number = 0;

  public day = [
    { id: 1, name: '1' },
    { id: 2, name: '2' },
    { id: 3, name: '3' },
    { id: 4, name: '4' },
    { id: 5, name: '5' },
    { id: 6, name: '6' },
    { id: 7, name: '7' },
    { id: 8, name: '8' },
    { id: 9, name: '9' },
    { id: 10, name: '10' },
    { id: 11, name: '11' },
    { id: 12, name: '12' },
    { id: 13, name: '13' },
    { id: 14, name: '14' },
    { id: 15, name: '15' },
    { id: 16, name: '16' },
    { id: 17, name: '17' },
    { id: 18, name: '18' },
    { id: 19, name: '19' },
    { id: 20, name: '20' },
    { id: 21, name: '21' },
    { id: 22, name: '22' },
    { id: 23, name: '23' },
    { id: 24, name: '24' },
    { id: 25, name: '25' },
    { id: 26, name: '26' },
    { id: 27, name: '27' },
    { id: 28, name: '28' },
    { id: 29, name: '29' },
    { id: 30, name: '30' },
    { id: 31, name: '31' },
  ];

  public week = [
    { id: 3, name: 'First' },
    { id: 6, name: 'Second' },
    { id: 7, name: 'Third' },
    { id: 4, name: 'Fourth' },
    { id: 2, name: 'Fifth' },
    { id: 1, name: 'Every' },
    { id: 5, name: 'Last' },
  ];

  definitionForm = new FormGroup({
    activityName: new FormControl(''),
    startProcess: new FormControl(''),
    option: new FormControl(''),
    option2: new FormControl(''),
    everyHourly: new FormControl(''),
    everyDaily: new FormControl(''),
    everyWeekly: new FormControl(''),
    everyMonthly: new FormControl(''),
    everyOneTime: new FormControl(''),
    selectedDay: new FormControl(''),
    dayOfMonth: new FormControl(''),
    selectedMonth: new FormControl(''),
    allMonthToggle: new FormControl(''),
    weekOfMonth: new FormControl(''),
    selectedWeekDay: new FormControl(''),
    allMonthWeekToggle: new FormControl(''),
    selectedMonthWeek: new FormControl(''),
    hour: new FormControl(''),
    minute: new FormControl(''),
  });

  constructor(@Inject(MAT_DIALOG_DATA) 
              public data: any,
              public dialogSch: MatDialogRef<ScheduleEventComponent>,
              public informationservice: InformationService,
              private commonFunctions: CommonFunctions,
            ) {}

  ngOnInit(): void {
    //activity Id set up
    this.number = this.data.id;
    //Setting the value of the input on initiation of the pop up 
    this.definitionForm.controls['activityName'].setValue(this.data.name);
    //to place the initial radio value to one time
    this.definitionForm.controls['option'].setValue('oneTime');

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
    
    this.agColumnsJsonDaily = [
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
        cellRenderer: (params: any) => {
          const beginTime = params.data.beginTime
          //the difference between begin and end time should be 10 hours, but if begin time is at
          //20:00 , there is no 10 hours after that, it only goes to 23:59, so the minimum of 
          //begin time should be 13:59
          if(beginTime !== null && parseInt(beginTime) > 2400-(this.everyHour*100)){
            this.commonFunctions.alert("alert","Begin Time needs to leave space for the End Time in the interval of time");
            // Reset End Time if Begin Time is edited
            params.data.beginTime = null;
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
        editable: true,
        onCellValueChanged: (params: any) => {
          this.updateStartProcess(params);
          console.log("start process oncellvaluechanged : ", this.startProcess);
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

          if(endTime !== null && beginTime !== null && parseInt(endTime)-parseInt(beginTime) < (this.everyHour*100)){
            this.commonFunctions.alert("alert","The interval of hours between Begin Time and End Time is shorter than expected");
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

    this.agColumnsDaily.push(this.agColumnsJsonDaily);
    this.showGrid = true;  
  }

  //setting the every value to be used in the grid between begin and end time interval
  setEveryHour(value: any){
    this.everyHour = value;
    console.log("this.everyHour : ",this.everyHour);
  }

  //function for taking the smallest value from the grid
  //saving it in start process
  updateStartProcess(params: any) {
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

          //setting them in start the process input
          this.definitionForm.controls['hour'].setValue(hours);
          this.definitionForm.controls['minute'].setValue(minutes);
        }else{
          //if the beginTimes array is empty, empty out the start process input 
          this.definitionForm.controls['hour'].setValue('');
          this.definitionForm.controls['minute'].setValue('');
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
  

  //Function for hour start process input validation
  validateInput(event: any, maxLength: number, maxValue: number) {
    //get the input's value
    let inputValue = event.target.value;
    // Remove non-numeric characters
    let numericValue = inputValue.replace(/\D/g, '');
    //if all values are characters, keep it empty
    if(numericValue === ''){
      //Update the input value on the screen
      event.target.value = '';
      return '';
    }
    // Limit the length of the value
    let truncatedValue = numericValue.slice(0, maxLength);
    // Ensure the value is within the desired range
    let validatedValue = Math.min(Number(truncatedValue), maxValue).toString();
    //Update the input value on the screen
    event.target.value = validatedValue;

    return validatedValue;
  }

  //if hour or minute is a single digit, add a zero before them
  addZero(value: string){
    //if value actually has a value
    if(value !== ''){
      // Convert the value to a string
      let stringValue = value.toString();
      // If the length of the string is smaller than 2, add a zero before it
      if (stringValue.length < 2) {
          stringValue = "0" + stringValue;
      }
      // Return the modified string
      return stringValue;
    }
    return '';
  }

  //this forces on click the service's selection day onto the selectedDay variable, eligible for future uses
  updateSelectedDay(){
    this.selectDay = this.informationservice.getSelectDay();
  }

  //clicking on the months cells, they get added to the selectMonths array for future use
  //resetting both toggle buttons to their off value after selecting cells by hand
  updateSelectedMonths(){
    this.selectMonths = this.informationservice.getSelectMonths();
    //if the user selects all of the dates, the toggle will switch to being on, and if either one
    // or more dates are not selected, it'll turn off
    if (this.selectMonths.length === 12) {
      this.definitionForm.controls['allMonthToggle'].setValue(1);
      this.definitionForm.controls['allMonthWeekToggle'].setValue(1);
  } else {
      this.definitionForm.controls['allMonthToggle'].setValue(0);
      this.definitionForm.controls['allMonthWeekToggle'].setValue(0);
  }  
    console.log("this.selectMonths :",this.selectMonths);
  }

  //adds the same month values to the service, making the table cells all blue, adding them
  //to the selectMonths array when on, and resetting both when off 
  toggleAllMonths(){
    if (this.definitionForm.get('allMonthToggle')?.value == 0) {
      const months: string[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      this.informationservice.removeSelectMonths();

      this.informationservice.setSelectMonths(months);
      this.selectMonths = this.informationservice.getSelectMonths();
    } else {
      this.informationservice.removeSelectMonths();
      this.selectMonths = this.informationservice.getSelectMonths();
    }
  }

  //adds the same month values to the service, making the table cells all blue, adding them
  //to the selectMonths array when on, and resetting both when off 
  toggleAllMonthsWeek(){
    if (this.definitionForm.get('allMonthWeekToggle')?.value == 0) {
      const months: string[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      this.informationservice.removeSelectMonths();

      this.informationservice.setSelectMonths(months);
      this.selectMonths = this.informationservice.getSelectMonths();
    } else {
      this.informationservice.removeSelectMonths();
      this.selectMonths = this.informationservice.getSelectMonths();
    }
  }

  //for the bottom left label click
  toggleListActivities() {
    this.listActivities = !this.listActivities;
    this.definitionForm.get('option').reset();
  }

  //changing the value of the first radio button set 
  resetValues(){
    //caliing the second reset function, adding other needed changes
    this.resetValues2();

    //if monthly was selected, then one of day or week, and then we change to daily or another 
    //option value, to reset the option2 radio button
    this.definitionForm.get('option2').reset();
  }

  resetValues2(){
    //resetting the service values of day and months with their corresponding variables
    this.informationservice.removeSelectDay();
    this.informationservice.removeSelectMonths();
    this.selectDay = '';
    this.selectMonths = [];

    //both toggle buttons reset to off in monthly 
    this.definitionForm.controls['allMonthToggle'].setValue(0);
    this.definitionForm.controls['allMonthWeekToggle'].setValue(0);

    //reset the values of the inputs
    this.definitionForm.controls['dayOfMonth'].setValue('');
    this.definitionForm.controls['weekOfMonth'].setValue('');
    this.definitionForm.controls['everyHourly'].setValue('');
    this.definitionForm.controls['everyDaily'].setValue('');
    this.definitionForm.controls['everyWeekly'].setValue('');
    this.definitionForm.controls['everyOneTime'].setValue('');
  }
  
  //for the X close button
  closeDialog(): void {
    // closes the application event pop up
    this.dialogSch.close();
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

// Custom cell renderer for hourly (how it looks)
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




// FOR BUTTONS IF THEY DIDN'T WANT RADIO BUTTONS (HOURLY , DAILY....)
  // public isHourly = false;
  // public isDaily = false;
  // public isWeekly = false;
  // public isMonthly = false;
  // public isOneTime = false;

  // onIsHourly(){
  //   this.isHourly= true;
  //   this.isDaily= false;
  //   this.isWeekly= false;
  //   this.isMonthly= false;
  //   this.isOneTime= false;
  // }
  // onIsDaily(){
  //   this.isHourly= false;
  //   this.isDaily= true;
  //   this.isWeekly= false;
  //   this.isMonthly= false;
  //   this.isOneTime= false;
  // }
  // onIsWeekly(){
  //   this.isHourly= false;
  //   this.isDaily= false;
  //   this.isWeekly= true;
  //   this.isMonthly= false;
  //   this.isOneTime= false;
  // }
  // onIsMonthly(){
  //   this.isHourly= false;
  //   this.isDaily= false;
  //   this.isWeekly= false;
  //   this.isMonthly= true;
  //   this.isOneTime= false;
  // }
  // onIsOneTime(){
  //   this.isHourly= false;
  //   this.isDaily= false;
  //   this.isWeekly= false;
  //   this.isMonthly= false;
  //   this.isOneTime= true;
  // }