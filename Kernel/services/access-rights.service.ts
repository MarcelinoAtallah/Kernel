import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GlobalConstants } from 'src/app/Kernel/common/GlobalConstants';

@Injectable({
  providedIn: 'root'
})
export class AccessRightsService {
  userId = localStorage.getItem("logeduserId");
  isManaged: string = '';

  constructor(private http : HttpClient) { }

  getAccessRight(menuVariable: string = '') {
    // if(menuVariable != '') {
    //   // Get menu ismanaged
    //   this.http.get<any>(GlobalConstants.checkIsMenuManaged + menuVariable).subscribe(
    //     (res: String) => {
    //       this.isManaged = res.toString();
    //       localStorage.setItem("isManaged", this.isManaged);

    //       if(this.isManaged == "1") {
    //         // Get menu access right
    //         this.http.get<any>(GlobalConstants.checkAccessRight + menuVariable + "/" + this.userId).subscribe(
    //           (res: String) => {
    //             localStorage.setItem("accessRights",JSON.stringify(res));
    //           },
    //           (error) => {
    //             //console.log(error);
    //           }
    //         );
    //       }
    //     },
    //     (error) => {
    //       //console.log(error);
    //     }
    //   );
    // }

    let accessRights = {display: 1, add: 1, modify: 1, delete: 1, print: 1, export: 1, translate: 1};
    localStorage.setItem("isManaged", "1");
    localStorage.setItem("accessRights", JSON.stringify(accessRights));
  }

}
