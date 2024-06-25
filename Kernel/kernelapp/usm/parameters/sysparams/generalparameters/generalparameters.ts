import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { CommonFunctions } from 'src/app/Kernel/common/CommonFunctions';
import { EventEmitterService } from 'src/app/Kernel/services/event-emitter.service';

@Component({
  selector: 'app-generalparameters',
  templateUrl: './generalparameters.html',
  styleUrls: ['./generalparameters.css']
})
export class Generalparameters {

  public getGroupRoleMappingBehavior: any ;
  public getGroupRoleMappingType: any ;


  generalParameterssForm = new FormGroup({
    UDINATAID: new FormControl(''),
    MNOIL: new FormControl(''),
    UsersLogsByManager: new FormControl(''),
    DualFactorAuthenticationFlag: new FormControl(''),
    AGRMB: new FormControl(''),
    AGRMT: new FormControl('')
  });

  constructor(private http: HttpClient,
    private commonFunctions: CommonFunctions,
    private eventEmitterService: EventEmitterService,) { }

  ngOnInit(): void {
  }

}
