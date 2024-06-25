import { Component, Inject, Injectable, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-saveshape-modal',
  templateUrl: './saveshape-modal.component.html',
  styleUrls: ['./saveshape-modal.component.css']
})
@Injectable({
  providedIn: 'root'
})
export class SaveshapeModalComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<SaveshapeModalComponent>,private dialog:MatDialog,@Inject(MAT_DIALOG_DATA) public data: any) { }
  inputValue:any;
  ngOnInit(): void {

    $("#inputValue").val(this.data.value);

  

  }

  closepopup(){
   // $("#btn-55").click();
    $("#closedialog").click();
   
  }


  save(){
   // $("#inputValue").val();
    console.log('save>>>',$("#save").is(":checked"))
    console.log('inputValue>>>',$("#inputValue").val())
     this.inputValue=$("#inputValue").val();
    console.log('inputValue>>>>>',this.inputValue);
    this.dialogRef.close({inputValue: this.inputValue});
     $("#saveshapes").click()
    $("#btn-55").click()

  }
}
