import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { GlobalConstants } from '../../../../../common/GlobalConstants';

@Component({
  selector: 'app-mapping-source',
  templateUrl: './mapping-source.component.html',
  styleUrls: ['./mapping-source.component.css']
})
export class MappingSourceComponent implements OnInit {
  public docData : any;
  constructor() { }

  mappingSource = new FormGroup({
    docData : new FormControl('')
  })

  ngOnInit(): void {
    // this.docData = GlobalConstants.fetchCDSDocData
  }

}
