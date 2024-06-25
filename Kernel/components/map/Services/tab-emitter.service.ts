import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TabEmitterService {

  constructor() { }

  // -----------------------------------------------------------
  // USED TO HANDLE AG-GRID DYNAMIC ADD / UPDATE / DELETE EVENTS
  // -----------------------------------------------------------
  
  onTabClick = new EventEmitter();
  // subsVar: Subscription = undefined;
  
  onTabClickFn() {
    this.onTabClick.emit();    
  }
}
