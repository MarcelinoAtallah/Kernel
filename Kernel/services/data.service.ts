import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  public isDelete: boolean;
  private ismultiple: boolean;
  private dialogArray: any[] = [];
  private actionType:any;
  private listOfOpenLikeForm : any [] = [];

  constructor() { }

  setMessage(ismultiple: boolean) {
    this.ismultiple = ismultiple;
  }

  getMessage() {
    return this.ismultiple;
  }

  public setDelete(Delete: boolean) {
    this.isDelete = Delete;

  }

  public getDelete() {
    return this.isDelete;

  }

  public PushOpenLikeForm (yesOrNo : any){
    this.listOfOpenLikeForm.push(yesOrNo);
  }
  public getListOfOpenLikeForm(){
    return this.listOfOpenLikeForm;
  }

  public setListOfOpenLikeForm(newList : any){
     this.listOfOpenLikeForm = newList;
  }

  public PushdialogArray(dialogref: any) {
    this.dialogArray.push(dialogref);
  }

  public SetdialogArray(dialogref: any) {
    this.dialogArray = dialogref;
  }


  public getdialogArray() {
    return this.dialogArray;

  }
  
  setactionType(actionType: any) {
    this.actionType = actionType;
  }

  getactionType() {
    return this.actionType;
  }


}