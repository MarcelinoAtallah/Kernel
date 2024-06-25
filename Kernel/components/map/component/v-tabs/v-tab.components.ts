 import { Component, Input, OnInit } from '@angular/core';
 import { HttpClient } from '@angular/common/http';
 import { GlobalConstants } from 'src/app/Kernel/common/GlobalConstants';
 import { ActivatedRoute } from '@angular/router';
import { FormGroup } from '@angular/forms';
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

  constructor(private http: HttpClient,private _Activatedroute: ActivatedRoute) {}


   @Input('tabTitle') title: string = '';
   @Input() active = false;
   @Input() fontawesome: any;
   @Input() menuVariable:any;
   @Input() parentForm: FormGroup;

   public showScreen : boolean = true;
   public userId : String = localStorage.getItem("userId");

   ngOnInit(): void {}
 }
 