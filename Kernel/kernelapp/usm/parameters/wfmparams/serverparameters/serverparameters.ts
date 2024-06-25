import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { CommonFunctions } from 'src/app/Kernel/common/CommonFunctions';
import { EventEmitterService } from 'src/app/Kernel/services/event-emitter.service';

@Component({
  selector: 'app-serverparameters',
  templateUrl: './serverparameters.html',
  styleUrls: ['./serverparameters.css']
})
export class ServerParametersComponent implements OnInit {

  Parameters = new FormGroup({
    currentServerIp: new FormControl(''),
    currentServerName: new FormControl(''),
    wfmServerIp: new FormControl(''),
    wfmServerPort: new FormControl(''),
    infoLinkServerIp: new FormControl(''),
    infoLinkServerPort: new FormControl(''),
    wfmEngineActive:new FormControl(''),
    StatusEngineActive : new FormControl('')

  });


  constructor(private http: HttpClient,
    private commonFunctions: CommonFunctions,
    private eventEmitterService: EventEmitterService,) { }

  ngOnInit(): void {
  }

}
