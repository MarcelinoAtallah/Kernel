import { EventEmitter, Injectable } from '@angular/core';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventEmitterService {

  // -----------------------------------------------------------
  // USED TO HANDLE AG-GRID DYNAMIC ADD / UPDATE / DELETE EVENTS
  // -----------------------------------------------------------

  onAddClick = new EventEmitter();
  onUpdateClick = new EventEmitter();
  onDeleteClick = new EventEmitter();
  onSaveClick = new EventEmitter();
  onTabActionClick = new EventEmitter();
  onTabSettingBtnClick = new EventEmitter();
  onTabDeleteBtnClick = new EventEmitter();
  onFieldSetBtnClick =  new EventEmitter();
  onFieldSetBtnAdd = new EventEmitter();
  // subsVar: Subscription = undefined;

  constructor() {}

  onAddClickFn() {
    this.onAddClick.emit();
  }

  onUpdateClickFn() {
    this.onUpdateClick.emit();
  }

  onDeleteClickFn() {
    this.onDeleteClick.emit();
  }

  onSaveClickFn(value: any) {
    this.onSaveClick.emit(value);
  }

  onTabActionClickFn() {
    this.onTabActionClick.emit();
  }

  onTabSettingBtnClickFn() {
    this.onTabSettingBtnClick.emit();
  }

  onTabDeleteBtnClickFn() {
    this.onTabDeleteBtnClick.emit();
  }
  
  onFieldSetBtnClickFn() {
    this.onFieldSetBtnClick.emit();
  }

  onFieldSetBtnAddFn() {
    this.onFieldSetBtnAdd.emit();
  }
  

}
