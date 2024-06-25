
import { Component, OnInit } from "@angular/core";
import { ICellRendererAngularComp } from "ag-grid-angular";
import { ICellRendererParams } from "ag-grid-community";
import { DataService } from "./data.service";
@Component({
  selector: "app-gender-renderer",
  template: `
  <span>{{ value }} <button id="renderer" (click)='showalert()'>RUN</button></span>
  `
})
export class GenderRenderer implements OnInit, ICellRendererAngularComp {
  public imageSource!: string;
  public value: any;
  constructor(private dataService: DataService) { }
  ngOnInit(){
alert("innnn")  
}
  agInit(params: ICellRendererParams): void {
    //const image = params.value === "Male" ? "male.png" : "female.png";
   // this.imageSource = `https://www.ag-grid.com/example-assets/genders/${image}`;
    this.value = params.value;
  }
  refresh(params: ICellRendererParams) {
    return false;
  }
  showalert(){
alert( this.value+'is clicked');
//console.log("window",window);
this.dataService.setDHselectedDevice(this.value);
//console.log("RunDeviceHistory div",$("#RunDeviceHistory"));
$("#RunDeviceHistory1").click();
  }
}

