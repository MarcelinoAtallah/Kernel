import { Component, Input, OnInit } from '@angular/core';

export interface UserData {
  name: string;
  age: number;
}



@Component({
  selector: 'app-my-table',
  templateUrl: './my-table.component.html',
  styleUrls: ['./my-table.component.css']
})
export class MyTableComponent implements OnInit {
  @Input() json: any[];

  displayedColumns: string[] = ['name', 'age'];
  dataSource = ELEMENT_DATA;
  constructor() { }

  ngOnInit(): void {
  }

}
const ELEMENT_DATA: UserData[] = [
  {name: 'John', age: 25},
  {name: 'Jane', age: 31},
  {name: 'Jim', age: 12},
];