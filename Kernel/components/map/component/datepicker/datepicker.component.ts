import { Component, Inject, OnInit ,ViewChild,ElementRef} from '@angular/core';
import {MatDatepickerInputEvent, MatDatepickerModule} from '@angular/material/datepicker';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatNativeDateModule} from '@angular/material/core';
import { FormControl } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { DataService } from '../../Services/data.service';
@Component({
  selector: 'app-datepicker',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.css']
})
export class DatePickerComponent implements OnInit {
  selectedStartDate: any;
  endTime: string;
  selectedEndDate: any;
  isFilledBefore:boolean=false;
  startDateControl = new FormControl();
  endDateControl = new FormControl(); 
  time:any;
  @ViewChild('beginTimeInput') beginTimeInput!: ElementRef<HTMLInputElement>;
  @ViewChild('endTimeInput') endTimeInput!: ElementRef<HTMLInputElement>;
  startDateControlValue:any;
  endDateControlValue:any;

  constructor(private datePipe: DatePipe,private dataService: DataService,public dialog: MatDialog
    ) { }

  ngOnInit(): void {
    // this.selectedStartDate='';
    // this.selectedEndDate='';
this.startDateControl.valueChanges.subscribe((selectedDate: Date) => {
      //console.log('Selected start date:', selectedDate);
      const originalDate = new Date(selectedDate);
      // originalDate.setHours(0, 0, 0, 0);
const formattedDate = this.datePipe.transform(originalDate, 'MM/dd/yyyy HH:mm');
//console.log("----------------",formattedDate); // Output: 6/13/2023
this.selectedStartDate=formattedDate;
    });
    
    this.endDateControl.valueChanges.subscribe((selectedDate2: Date) => {
      const originalDate = new Date(selectedDate2);

      const formattedDate = this.datePipe.transform(originalDate, 'MM/dd/yyyy HH:mm');
      this.selectedEndDate=formattedDate;

    });
    //console.log("this.data.value >>>>",  this.dataService.getstartdate());
    if(this.dataService.getstartdate()){
      this.isFilledBefore=true;
      let date1=this.convertDateString( this.dataService.getstartdate()) 
      let date2=this.convertDateString(this.dataService.getendDate()) 

      this.dataService.setStartDate('');
      this.dataService.setendDate('');


       this.startDateControl = new FormControl(date1);
        this.endDateControl = new FormControl(date2);

    }else{
    

      this.dataService.setData('');
    }

    // this.selectedStartDate='';
    // this.selectedEndDate='';
  }


  convertDateString(dateString: string): string {
    const parsedDate = new Date(dateString);
    parsedDate.setHours(0, 0, 0, 0);
    // The following format string 'yyyy-MM-ddTHH:mm' will give you the desired format
    return this.datePipe.transform(parsedDate, 'yyyy-MM-ddTHH:mm') || '';
  }

  updateTimeValue(input: any) {
    input.setAttribute("value", input.value);
  }
  onTimeChange(event: any) {
    // Access selected time from event.target.value
    this.endTime = event.target.value;
    // You can do further processing here if needed
    //console.log("Selected time: ", this.endTime);
  }
  closepopup(){
    // $("#btn-55").click();
     $("#closedialog").click();
     this.dataService.setCancel(false);
   }
 
 
   save(){
this.dataService.setOK(true);
     //console.log('startdatecontrol1111111111111>>>',this.startDateControl.value);
     //console.log('endDateControl111111111111>>>',this.endDateControl.value);

    
// this.selectedStartDate=this.datePipe.transform(this.startDateControl.value, 'MM/dd/yyyy HH:mm');
// this.selectedEndDate=this.datePipe.transform(this.endDateControl.value, 'MM/dd/yyyy HH:mm');

    const beginTimeValue = this.beginTimeInput.nativeElement.value;
    const endTimeValue = this.endTimeInput.nativeElement.value;

    // Use the values as needed
    //console.log('Begin Time:', beginTimeValue);
    //console.log('End Time:', endTimeValue);

    if(beginTimeValue=="" && endTimeValue!=""){
      this.startDateControlValue=this.startDateControl.value;
      this.endDateControlValue=this.endDateControl.value + " "+endTimeValue;
      //console.log('endDateControlValue----------',this.endDateControlValue);

    }else if(endTimeValue=="" && beginTimeValue!=""){
      
      this.endDateControlValue=this.endDateControl.value;
      this.startDateControlValue=this.startDateControl.value + " "+beginTimeValue;
      //console.log('startDateControlValue----------',this.startDateControlValue);

    }else if(endTimeValue=="" &&  beginTimeValue==""){

      this.startDateControlValue=this.startDateControl.value;
      this.endDateControlValue=this.endDateControl.value;

    }
    else if(endTimeValue!="" &&  beginTimeValue!=""){

      this.startDateControlValue=this.startDateControl.value + " "+beginTimeValue;
      this.endDateControlValue=this.endDateControl.value + " "+endTimeValue;

    }

    this.selectedStartDate=this.datePipe.transform(this.startDateControlValue, 'MM/dd/yyyy HH:mm');
    this.selectedEndDate=this.datePipe.transform(this.endDateControlValue, 'MM/dd/yyyy HH:mm');

if(this.isFilledBefore==true){
  const startdate = new Date(this.selectedStartDate);
  const startdatemilliseconds = startdate.getTime();
  //console.log("startdatemilliseconds",startdatemilliseconds);
  const enddate = new Date(this.selectedEndDate);
  const enddatemilliseconds = enddate.getTime();
  //console.log("enddatemilliseconds",enddatemilliseconds)
  if(enddatemilliseconds < startdatemilliseconds){
    Swal.fire({
      text: 'End Operation Should be greater than Begin Operation',
      backdrop: false
    });
  }else{

    let obj={'selectedStartDate':this.selectedStartDate,
    'selectedEndDate':this.selectedEndDate
  
    }
    //console.log('obj date---------',obj);
    this.dataService.setData(obj);
  
    $("#closepopup").click();
  }
}else{
  if(this.selectedStartDate=="" || typeof(this.selectedStartDate) == "undefined"||this.selectedStartDate==null)
    {
      this.selectedStartDate = "";
      Swal.fire({
        text: 'please fill Begin Operation',
        backdrop: false
      });
      
    let obj={'selectedStartDate':"",
    'selectedEndDate':""

    }
    //console.log('obj date---------',obj);

    this.dataService.setData(obj);
    }else if(this.selectedEndDate=="" ||typeof(this.selectedEndDate) == "undefined" ||this.selectedEndDate==null )
    {
      this.selectedEndDate = "";
      Swal.fire({
        text: 'please fill End Operation',
        backdrop: false
      });
    let obj={'selectedStartDate':"",
    'selectedEndDate':""

    }
    //console.log('obj date---------',obj);

    this.dataService.setData(obj);
    }else{
      const startdate = new Date(this.selectedStartDate);
      const startdatemilliseconds = startdate.getTime();
      //console.log("startdatemilliseconds",startdatemilliseconds);
      const enddate = new Date(this.selectedEndDate);
      const enddatemilliseconds = enddate.getTime();
      //console.log("enddatemilliseconds",enddatemilliseconds)
      if(enddatemilliseconds < startdatemilliseconds){
        Swal.fire({
          text: 'End Operation Should be greater than Begin Operation',
          backdrop: false
        });
    
}else{
  let obj={'selectedStartDate':this.selectedStartDate,
  'selectedEndDate':this.selectedEndDate

  }
  //console.log('obj date---------',obj);

  this.dataService.setData(obj);
  $("#closepopup").click();
}   
    }
}
   }

 
}