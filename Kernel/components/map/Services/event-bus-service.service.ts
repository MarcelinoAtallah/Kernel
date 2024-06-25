import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventBusService {

  constructor() { }

  private subject = new Subject<any>();

  publish(event: any) {
    this.subject.next(event);
    //console.log('event>>>',event);
  }

  subscribe(callback: any) {
    //this.subject.subscribe(callback);
    return this.subject.asObservable();

  }
}
