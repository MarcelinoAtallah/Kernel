import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-v-rejected',
  templateUrl: './v-rejected.component.html',
  styleUrls: ['./v-rejected.component.css']
})
export class VRejectedComponent implements OnInit {

  public Message : any = '';

  constructor(private dialog: MatDialog,@Inject(MAT_DIALOG_DATA) public data: any) {}
  
  closeDialog(): void {
    this.dialog.closeAll();
  }

  ngOnInit(): void {
    this.Message = this.data;
  }

}
