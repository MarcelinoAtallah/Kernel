 import { Component, Input, OnInit } from '@angular/core';
 import { HttpClient } from '@angular/common/http';
 import { GlobalConstants } from 'src/app/Kernel/common/GlobalConstants';
 import { ActivatedRoute } from '@angular/router';
import { DataService } from 'src/app/Kernel/services/data.service';
import { InformationService } from 'src/app/Kernel/services/information.service';
 @Component({
   selector: 'v-tab',
   styleUrls: ['./v-tabs.component.css'],
   template: `
     <div [hidden]="!active" class="pane">
       <ng-content></ng-content>
     </div>
   `
 })
 export class TabComponent implements OnInit{

  constructor(public dataservice: DataService,
    public informationservice: InformationService) {}

  public customTabTitle: string = '';

  @Input('tabTitle') title: string = '';
  @Input() tabId: string = '';
  @Input() active = false;
  @Input() fontawesome: any;
  @Input() menuVariable:any;
  @Input() isForIndisplayModify: any = 0;
  @Input() isForIndisplayDelete: any = 0;
  @Input() disabled: boolean = false;

   public showScreen : boolean = true;
   
   public userId : String = this.informationservice.getUserId();

   ngOnInit(): void {
    this.customTabTitle = this.title.replace(" ", "-");
    if(this.tabId == '') {
      let random = Math.floor(Math.random() * (999999 - 100000)) + 100000;
      this.tabId = "tabId_"+random.toString();
      console.log("tabId_ ==",this.tabId)
    }
  }
 }
 