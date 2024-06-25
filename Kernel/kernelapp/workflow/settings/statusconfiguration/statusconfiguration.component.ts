import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { AgColumns } from 'src/app/Kernel/common/AGColumns';
import { CommonFunctions } from 'src/app/Kernel/common/CommonFunctions';
import { GlobalConstants } from 'src/app/Kernel/common/GlobalConstants';
import { EventEmitterService } from 'src/app/Kernel/services/event-emitter.service';
@Component({
  selector: 'app-statusconfiguration',
  templateUrl: './statusconfiguration.component.html',
  styleUrls: ['./statusconfiguration.component.css']
})
export class StatusconfigurationComponent implements OnInit {
  statusConfigurationForm = new FormGroup({
    initiated: new FormControl(''),
    running: new FormControl(''),
    active: new FormControl(''),
    suspended: new FormControl(''),
    completed: new FormControl(''),
    terminated: new FormControl(''),
    validated: new FormControl(''),
    rejected: new FormControl(''),
    canceled: new FormControl(''),
    delayed: new FormControl(''),
    simulated:new FormControl(''),
    deleted:new FormControl(''),
    inactive:new FormControl(''),
    notavailable:new FormControl(''),
    performer: new FormControl(''),
    loginInDate: new FormControl(''),
    loginIp: new FormControl(''),
  });

  constructor(
    private http: HttpClient,
    private commonFunctions: CommonFunctions,
    private eventEmitterService: EventEmitterService,
  ) { }

  ngOnInit(): void {
  }

}
