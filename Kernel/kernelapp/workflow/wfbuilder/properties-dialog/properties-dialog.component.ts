import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ApplicationEventComponent } from '../application-event/application-event.component';
import { ExternalEventComponent } from '../external-event/external-event.component';
import { ScheduleEventComponent } from '../schedule-event/schedule-event.component';

@Component({
  selector: 'app-properties-dialog',
  templateUrl: './properties-dialog.component.html',
  styleUrls: ['./properties-dialog.component.css']
})
export class PropertiesDialogComponent implements OnInit {
  
  public ruleAction = [
    { id: 1, name: 'On Change' },
    { id: 2, name: 'On Load' },
    { id: 3, name: 'On Before Save' },
    { id: 4, name: 'On After Save' },
    { id: 5, name: 'Where Condition' },
    { id: 6, name: 'On Change 2' },
    { id: 7, name: 'On Load 2' },
    { id: 8, name: 'On Before Save 2' },
    { id: 9, name: 'On After Save 2' },
    { id: 10, name: 'Where Condition 2' },
    { id: 11, name: 'On Change 3' },
    { id: 12, name: 'On Load 3'},
    { id: 13, name: 'On Before Save 3' },
    { id: 14, name: 'On After Save 3' },
    { id: 15, name: 'Where Condition 3' },
    { id: 16, name: 'On Change 4' },
    { id: 17, name: 'On Load 4' },
    { id: 18, name: 'On Before Save 4' },
    { id: 19, name: 'On After Save 4' },
    { id: 20, name: 'Where Condition 4' }
  ];

  form = new FormGroup({
    step_0: new FormControl(''),
    name: new FormControl('')
  });

  constructor(@Inject(MAT_DIALOG_DATA) 
              public data: any, 
              public dialogRef: MatDialogRef<PropertiesDialogComponent>, 
              private dialog: MatDialog) {}
  
  ngOnInit(): void {
    //Setting the value of the input on initiation of the pop up 
    this.form.controls['name'].setValue(this.data.name);
    //Setting the value of the dropdown on initiation of the pop up 
    this.form.controls['step_0'].setValue(this.data.activityName);
  }

  modify(value: any){
    // Find the selected option by ID from the new array
    const selectedOption = this.ruleAction.find(option => option.id === value);
    console.log("selectedOption :", selectedOption)

    if(selectedOption){
      if(this.data.type === 'application'){
        // Open dialog pop up which is the properties component
        const dialogApp = this.dialog.open(ApplicationEventComponent, {
          //dimension of the dialog pop up
          height: '850px',
          width: '700px',
          //element information sent to the dialog through data
          data: selectedOption,
          //this prevents clicks out of the dialog
          disableClose: true
        });

        // Add event listener to prevent right-clicks while dialog is open
        document.addEventListener('contextmenu', handleContextMenu);
        function handleContextMenu(event: MouseEvent) {
          // Check if the dialog is open
          if (dialogApp && dialogApp.componentInstance) {
            // Prevent the default right-click behavior
            event.preventDefault();
          }
        }
      
        //What happens after closing the dialog
        dialogApp.afterClosed().subscribe(updatedElement => {
        });
      }else if(this.data.type === 'external'){
        // Open dialog pop up which is the properties component
        const dialogApp = this.dialog.open(ExternalEventComponent, {
          //dimension of the dialog pop up
          height: '850px',
          width: '700px',
          //element information sent to the dialog through data
          data: selectedOption,
          //this prevents clicks out of the dialog
          disableClose: true
        });

        // Add event listener to prevent right-clicks while dialog is open
        document.addEventListener('contextmenu', handleContextMenu);
        function handleContextMenu(event: MouseEvent) {
          // Check if the dialog is open
          if (dialogApp && dialogApp.componentInstance) {
            // Prevent the default right-click behavior
            event.preventDefault();
          }
        }
      
        //What happens after closing the dialog
        dialogApp.afterClosed().subscribe(updatedElement => {
        });
      }else if(this.data.type === 'schedule'){
        // Open dialog pop up which is the properties component
        const dialogApp = this.dialog.open(ScheduleEventComponent, {
          //dimension of the dialog pop up
          height: '850px',
          width: '700px',
          //element information sent to the dialog through data
          data: selectedOption,
          //this prevents clicks out of the dialog
          disableClose: true
        });

        // Add event listener to prevent right-clicks while dialog is open
        document.addEventListener('contextmenu', handleContextMenu);
        function handleContextMenu(event: MouseEvent) {
          // Check if the dialog is open
          if (dialogApp && dialogApp.componentInstance) {
            // Prevent the default right-click behavior
            event.preventDefault();
          }
        }
      
        //What happens after closing the dialog
        dialogApp.afterClosed().subscribe(updatedElement => {
        });
      }
    }
  }
 
  //for the X close button of the pop up
  closeDialog(): void {
    // closes the pop up, sending the data with activityName undefined to tell the 
    // openProperties to delete the element that is being created
    this.dialogRef.close(this.data);
  }

  //for the save button
  saveChanges(): void {
    // if the input and the dropdown have valid values, meaning it's also an event because
    // the dropdown doesn't reveal itself to the condition or actions, we update the name
    // and activityName sending them to the elements array   
    if(this.form.get('name')?.value && this.form.controls['step_0']?.value && this.form.controls['step_0']?.value != ''){
      this.data.name = this.form.get('name')?.value;
      this.data.activityName = this.form.controls['step_0']?.value;
      //sending it to the after closed pop up section 
      this.dialogRef.close(this.data);
    //and if it has a valid input and isn't an event, it'll just save the name and will not
    // create an undefined activityName for none event elements
    }else if(this.form.get('name')?.value && this.data.category != 'events'){
      this.data.name = this.form.get('name')?.value;
      this.dialogRef.close(this.data);
    }
  }
}
