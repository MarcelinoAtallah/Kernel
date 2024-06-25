import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { GlobalConstants } from './GlobalConstants';
import { HttpClient } from '@angular/common/http';
import * as alertify from 'alertifyjs';

@Injectable({
  providedIn: 'root'
})
export class CommonFunctions {

  constructor(private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute) { }

  // Format given date and return as string
  formatDate(date: Date | string): string {
    date = new Date(date);
    const day = `${date.getDate() < 10 ? '0' : ''}${date.getDate()}`;
    const month = `${date.getMonth() + 1 < 10 ? '0' : ''}${date.getMonth() + 1}`;
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  }

  // Global function to reload a given page
  public reloadPage(value: any) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate(['.' + value], {
      relativeTo: this.route,
    });
  }

  // Remove duplicates from JSON
  removeJSONDuplicates(data: any) {
    const seen = new Set();
    const uniqueData = [];
    for (const item of data) {
        const itemString = JSON.stringify(item);
        if (!seen.has(itemString)) {
            seen.add(itemString);
            uniqueData.push(item);
        }
    }
    return uniqueData;
  }

  // Routing navigator to any given page
  public navigateToPage(value: any) {

    //console.log("navigateToPage >>>>>>>>> ", value);

    if (typeof (value) == 'undefined') {
      value = '';
    }

    if (value != '') {
      this.router.navigate([value]);
    }
  }

  alert(typeOfAlert: string, alertMsg: string) {
    alertify.dialog(typeOfAlert).set(
      {
        title: 'Alert',
        transition:'fade',
        message: alertMsg
      }
    ).show();
  }

  fetchQBEResults(qbeId: number, qbeType: number, qbeParams: any): string {
    let value: string = '';
    this.http.post<any>(GlobalConstants.getQbeIdApi + qbeId + "/"+qbeType, qbeParams, { headers: GlobalConstants.headers }).subscribe((data: any) => {
      value = data[0];
    });
    return value;
  }

  // Remove duplicates from a given array by property
  public removeDuplicatesFromArrayByProperty(accumulator: any[], obj: any) {
    const removeDuplicatesFromArrayByProperty = (arr: any[], prop: string | number) => arr.reduce((accumulator: any, currentValue: any) => {
      if (!accumulator.find((obj: { [x: string]: any; }) => obj[prop] === currentValue[prop])) {
        accumulator.push(currentValue);
      }
      return accumulator;
    }, []);
    return removeDuplicatesFromArrayByProperty(accumulator, obj);
  }

  // Filter item from array
  public filterItemFromArray(array: any[], id: number) {
    return array.filter(value => value != id);
  }

  public filterArrayById(array: any[], id: number) {
    let data = array.filter((el: any) => {
      return Number(el.id) === Number(id);
    });
    return data;
  }

  public countNbOfOccuranceStr(StringVal: String, character: String) {
    var result = 0, i = 0;
    for (i; i < StringVal.length; i++)if (StringVal[i] == character) result++;
    return result;
  }

  // public handleLookupElem(fieldName: any, parentForm: any) {
  //   // Used to handle how the lookup display's how much selected data are in it
  //   if (parentForm.controls[fieldName]?.value != "" && parentForm.controls[fieldName]?.value != undefined) {
  //     let countSelections = this.countNbOfOccuranceStr(parentForm.controls[fieldName]?.value, ",");
  //     countSelections = Number(countSelections) + 1;
  //     $("#" + fieldName + "_lookupName").val("Selected (" + countSelections + ")");
  //   }
  // }

  public handleLookupElem(fieldName: any, parentForm: any) {

    ////console.log("fieldName>>>>>>>",fieldName);

   // //console.log("parentForm.controls[fieldName]?.value>>>>>>>",parentForm.controls[fieldName]?.value);
    // Used to handle how the lookup display's how much selected data are in it
    if (parentForm.controls[fieldName]?.value != "" && parentForm.controls[fieldName]?.value != undefined) {
      localStorage.setItem('agGidSelectedLookup_('+fieldName+')_id',parentForm.controls[fieldName]?.value);
      let countSelections = this.countNbOfOccuranceStr(parentForm.controls[fieldName]?.value, ",");
      countSelections = Number(countSelections) + 1;
      localStorage.setItem('agGidSelectedLookup_('+fieldName+')_name',"Selected (" + countSelections + ")");

      $("#" + fieldName + "_lookupName").val("Selected (" + countSelections + ")");
    }
  }

}
