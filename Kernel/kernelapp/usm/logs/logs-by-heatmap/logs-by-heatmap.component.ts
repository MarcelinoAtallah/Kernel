import { DatePipe } from '@angular/common';
import { Component, OnInit} from '@angular/core';
import { FormControl, FormGroup} from '@angular/forms';
import { CommonFunctions } from 'src/app/Kernel/common/CommonFunctions';
import { GlobalConstants } from 'src/app/Kernel/common/GlobalConstants';

@Component({
  selector: 'app-logs-by-heatmap',
  templateUrl: './logs-by-heatmap.component.html',
  styleUrls: ['./logs-by-heatmap.component.css']

})

export class LogsByHeatmapComponent implements OnInit {

  logsByHeatmap: any;
  public isShown: boolean = false ;
  logsByHeatmapForm = new FormGroup({
    loginDate: new FormControl({value: new Date().toISOString().substring(0,10), disabled: true},),
    logoutDate: new FormControl({value: new Date().toISOString().substring(0,10), disabled: true},),
  });
  constructor(public datepipe: DatePipe, private commonFunctions: CommonFunctions) {}
  ngOnInit(): void {
    this.searchForm();}

searchForm() {
  if (this.logsByHeatmapForm.status != "INVALID") {


    console.log("logindate before datepipe",this.logsByHeatmapForm.get('loginDate').value);
    console.log("logoutDate before datepipe",this.logsByHeatmapForm.get('logoutDate').value);
    if (this.logsByHeatmapForm.get('logoutDate').value == null || this.logsByHeatmapForm.get('logoutDate').value == '') {
      this.logsByHeatmapForm.controls['logoutDate'].setValue(this.logsByHeatmapForm.get('loginDate').value);
    }
    const loginDateTimeStamp=new Date(this.logsByHeatmapForm.get('loginDate').value).getTime() / (1000*60*60*24); //calculated as the number of days that have elapsed since January 1, 1970, 00:00:00 UTC (also known as the Unix epoch
    const logoutDateTimeStamp = new Date(this.logsByHeatmapForm.get('logoutDate').value).getTime() / (1000*60*60*24);
     const loginDate1 = this.datepipe.transform(
       this.logsByHeatmapForm.get('loginDate').value,
       'dd-MM-yyyy' // use yyyy instead of YYYY for the year format
     );
     const logoutDate1 = this.datepipe.transform(
       this.logsByHeatmapForm.get('logoutDate').value,
       'dd-MM-yyyy' // use yyyy instead of YYYY for the year format
     );


    const diffInDays = logoutDateTimeStamp - loginDateTimeStamp; // difference in days

    // console.log("loginDateTimeStamp>>>>>>",loginDateTimeStamp);
    // console.log("logoutDateTimeStamp>>>>>>",logoutDateTimeStamp);

    // console.log("diffInDays>>>>>>",diffInDays);

    if (this.logsByHeatmapForm.get('loginDate').value != null && this.logsByHeatmapForm.get('loginDate').value !='-1') {
       if (loginDateTimeStamp > logoutDateTimeStamp) {
        this.commonFunctions.alert("alert", 'Login Date cannot be later than Logout Date');
        return;
      } else if (diffInDays > 10) { // check if difference is greater than 10 days
        this.commonFunctions.alert("alert", 'Difference between Login Date and Logout Date cannot be more than 10 days');
        return;
      }
    }

    this.logsByHeatmap = GlobalConstants.getLogsByHeatmap + "/"+loginDate1+ "/"+logoutDate1;
    this.updateHeatmap();
  }
}
updateHeatmap() {
  this.isShown = false;
  setTimeout(() => {this.isShown = true;});}}



