import { Component, OnInit } from '@angular/core';
import { AgColumns } from 'src/app/Kernel/common/AGColumns';

@Component({
  selector: 'app-link-query',
  templateUrl: './link-query.component.html',
  styleUrls: ['./link-query.component.css']
})
export class LinkQueryComponent implements OnInit {

  public agColumns: AgColumns[] = [];
  public agColumnsJson: any;

  constructor() { }

  ngOnInit(): void {
    this.agColumnsJson = [
      {
        headerName: '',
        field: '',
        checkboxSelection: true,
        width: '25px',
        headerCheckboxSelection: true
      },
      {
        headerName: 'App Code',
        field: '',
        width: '25px',
      },
      {
        headerName: 'App Name',
        field: '',
      },
      
      {
        headerName: 'Menu Code',
        field: '',
      },
      {
        headerName: 'Menu Name',
        field: '',
      },
      {
        headerName: 'Generate As Menu',
        field: '',
      },
    ];

    this.agColumns.push(this.agColumnsJson);
  }

  save() {
    // Add your logic for saving the selected option here
    console.log('Save button clicked.');
  }

  menuAssignment() {
    // Add your logic for the menu assignment button here
    console.log('Menu Assignment button clicked.');
  }


}
