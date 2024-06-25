import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { GlobalConstants } from 'src/app/Kernel/common/GlobalConstants';

@Component({
  selector: 'app-ratio-builder-form',
  templateUrl: './ratio-builder-form.component.html',
  styleUrls: ['./ratio-builder-form.component.css']
})
export class RatioBuilderFormComponent implements OnInit {
  public getQueryName = GlobalConstants.getQueryNameApi;
  ratioForm = new FormGroup({
    title: new FormControl(''),
    query: new FormControl(''),
    grid: new FormControl(''),
    chart: new FormControl(''),
    report: new FormControl(''),
  
 });

  constructor() { }

  ngOnInit(): void {
  }

}
