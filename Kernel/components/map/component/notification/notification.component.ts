
import { Component, Input, OnInit } from '@angular/core';

import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {

  constructor(private toastr:ToastrService) { }
  @Input() public type: string ; 
  @Input() public message: string;
  @Input() public loader: boolean;

  ngOnInit(): void {  
    
  }
  showtoast(type: any, message: any) {
    //console.log(type);
    //console.log(message);
    this.toastr.clear();
    this.toastr.remove;
    if (type == 'success') {
      this.toastr.success(
        message,
        type[0].toUpperCase() + type.substr(1),
        { progressBar: this.loader, timeOut: 5000 }
      );
    } else if (type == 'info') {
      this.toastr.info(
        message,
        type[0].toUpperCase() + type.substr(1),
        { progressBar: this.loader, timeOut: 10000 }
      );
    }else if (type == 'clear') {
      this.toastr.info(
        message,
        type[0].toUpperCase() + type.substr(1),
        { progressBar: this.loader, timeOut: 3000 }
      );
    }else if (type == 'warning') {
      this.toastr.info(
        message,
        type[0].toUpperCase() + type.substr(1),
        { progressBar: this.loader, timeOut: 3000 }
      );
    }
  }
  


}
