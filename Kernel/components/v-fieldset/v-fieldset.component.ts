import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialogConfig } from '@angular/material/dialog';
import { EventEmitterService } from 'src/app/Kernel/services/event-emitter.service';

@Component({
  selector: 'v-fieldset',
  templateUrl: './v-fieldset.component.html',
  styleUrls: ['./v-fieldset.component.css']
})
export class VFieldsetComponent implements OnInit {

  constructor(
    private eventEmitterService: EventEmitterService,) { }

  @Input() title: string = '';
  @Input() fromInDisplay: boolean = false;

  @Output() onFieldSetBtnAdd = new EventEmitter<void>();
  @Output() onFieldSetModify = new EventEmitter<void>();
  @Output() onFieldSetBtnDelete = new EventEmitter<void>();


  ngOnInit(): void {}

  onFieldSetBtnAddFn() {
    this.onFieldSetBtnAdd.emit();
  }

  onFieldSetBtnModifyFn() {
    this.onFieldSetModify.emit();
  }

  onFieldSetBtnDeleteFn() {
    this.onFieldSetBtnDelete.emit();
  }

//   onFieldSetBtnClick() {
//     this.eventEmitterService.onFieldSetBtnClickFn();
//   }

//   onFieldSetBtnAdd() {
//     this.eventEmitterService.onFieldSetBtnAddFn();
//   }

  // onFieldSetBtndelete() {
  //   const dialogConfig = new MatDialogConfig();
  //   dialogConfig.data = {
  //     content: 'Are you sure you want to delete ?',
  //   };

  //   let text = "Are you sure you want to delete ?";
  //   if (confirm(text) == true) {
  //     this.eventEmitterService.onFieldSetBtndeleteFn();
  //   } else {
  //     return;
  //   }
  // }
}
