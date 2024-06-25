import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-contentmodal',
  templateUrl: './contentmodal.component.html',
  styleUrls: ['./contentmodal.component.css']
})
export class ContentmodalComponent implements OnInit {
    constructor(private dialog:MatDialog,@Inject(MAT_DIALOG_DATA) public data: any) { }
  ngOnInit(): void {
  }

  closepopup(){
    $("#closedialog").click()

  }


  save(){
    
  }
}
