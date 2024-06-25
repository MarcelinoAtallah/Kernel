import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'v-field-error',
  templateUrl: './v-field-error.component.html',
  styleUrls: ['./v-field-error.component.css']
})
export class FieldErrorComponent implements OnInit {

  @Input() public errorMessage:any;

  constructor() {}

  ngOnInit(): void {
  }

}
