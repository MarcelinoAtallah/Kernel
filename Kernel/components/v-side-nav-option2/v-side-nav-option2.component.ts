import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/Kernel/services/authentication.service';
import { GlobalConstants } from 'src/app/Kernel/common/GlobalConstants';
import { SignInData } from 'src/app/Kernel/model/signInData';
import { CommonFunctions } from 'src/app/Kernel/common/CommonFunctions';
import { FormGroup, FormControl } from '@angular/forms';
import { LoaderService } from 'src/app/Kernel/services/loader.service';
import { InformationService } from 'src/app/Kernel/services/information.service';

@Component({
  selector: 'app-v-side-nav-option2',
  templateUrl: './v-side-nav-option2.component.html',
  styleUrls: ['./v-side-nav-option2.component.css']
})
export class VSideNavOption2Component implements OnInit {
// Used to toggle app theme
toggleAppTheme: boolean;

// Logged In User Information
public loggedInUsername: string = '';
public loggedInUserFullName: string = '';
public loggedInEmail: string = '';
public loggedInFirstName: string = '';
public loggedInImage: string = '';
// --

public isManaged : string = "";
public menuVariable : string = "";

public userId = this.informationservice.getUserId();
public prevParentCode: string = ""; // Used to store the previous parent menu before selecting the child menu
public appSname: String = '';
user !: SignInData;

toggleForm = new FormGroup({
  toggle: new FormControl('')
});

@Input() applicationName: any;
//previously     @ViewChild(AppComponent) child: any;

// Function used to navigate to child menus based on clicked parent
// toggleActiveMenu(menuCode:String, appAbrv:String, childMenusCount: String) {
//   if($('#side-nav').attr('class')!.indexOf("active") != -1) {
//     if(appAbrv == null) {
//       appAbrv = '';
//     }
//     if(childMenusCount != '0') {
//       this.fetchChildMenus(menuCode);
//     }
//     if(appAbrv != '') {
//       this.appSname = appAbrv;
//     }
//   }
// }
/*
// Function used to navigate to a page by routing
onSelect(menuVariable: any, childMenus: any) {
  console.log('chil Menus >>>>',childMenus)
  if(childMenus != 0) {
    return;
  } else {
    if($('#side-nav').attr('class')!.indexOf("active") != -1) {
      this.menuVariable = menuVariable;
      this.fetchUserAccessRights(this.menuVariable, 'menu');
      menuVariable = this.appSname + "/" + menuVariable;
      this.informationservice.setMenuPath(menuVariable);
      console.log("menuVariable >>>>>>>>",menuVariable);

      setTimeout(()=>{

      if(this.appSname != '') {
        this.router.navigate([menuVariable]);
        this.commonFunctions.navigateToPage(menuVariable);
      } else {
        this.commonFunctions.navigateToPage(menuVariable);
      }
      this.toggleSwitch();

       },100);

    }
  }
}

fetchUserAccessRights(routeObj:any, sourceOfAccess:any) {


  let menuVar: any;

  if(sourceOfAccess == "breadcrumb") {
    menuVar = routeObj.route.path;
  }

  if(sourceOfAccess == "menu") {
    menuVar = routeObj;
  }

console.log("fetchUserAccessRights =============== >>>>     ",menuVar);

  this.http.get<any>(GlobalConstants.checkIsMenuManaged + menuVar).subscribe(
    (res: String) => {
      this.isManaged = res.toString();
      this.informationservice.setDynamicService("isManaged",this.isManaged);
      if(this.isManaged == "1") {
        this.http.get<any>(GlobalConstants.checkAccessRight +  menuVar + "/" + this.userId).subscribe(
          (res: any) => {
            this.informationservice.setDynamicService("accessRights",JSON.stringify(res));
            this.commonFunctions.navigateToPage(routeObj.url);
          },
          (error) => {
            console.log(error);
          }
        );
      }
    },
    (error) => {
      console.log(error);
    }
  );
}

// Function used to fetch child menus related to a parent menu code
fetchChildMenus(menuCode:any) {
  var dynamicMenus = new Array()
  this.http.get(GlobalConstants.fetchMenuApi + menuCode +"/" +this.userId, { headers: GlobalConstants.headers }).subscribe(
    (data) => {
      const menus:any = data;
      for(let i = 0; i < menus.length; i++) {
        this.menuVariable =  menus[i].menuVariable;
        // fetchUserAccessRights();
        if(menus[i].menuManaged == '1') {
          dynamicMenus.push({id: menus[i].menuCode,
                            appAbrv: menus[i].appSname,
                            name: menus[i].menuName,
                            icon: menus[i].menuIcon,
                            parentCode: menus[i].prevParentCode,
                            menuVariable: menus[i].menuVariable,
                            childMenus: menus[i].childMenus,
                            menuManaged: menus[i].menuManaged,
                            display: menus[i].isDisplay });
        }
        this.prevParentCode = menus[i].prevParentCode.toString();
      }
    }
  );
  this.applicationName = dynamicMenus;
  console.log("applicatio Name >>>",this.applicationName)
}

// Function used to show arrow on menu containing child menus
toggleChildNavigation(menuId:any) {
  if($(".side-nav").attr("class")?.indexOf("active") != -1) {
    $(".navigateToChildArrow").css("display", "none");
    $("#childNav_"+menuId).toggle();
  }
}

// Function used to toggle side-nav menu
toggleSwitch() {
  $(".navigateToChildArrow").css("display", "none");
  if($(".side-nav").attr("class")?.indexOf("active") != -1) {
    $(".side-nav .body-section").css({"overflow-y":"auto", "scrollbar-width":""});
    $(".side-nav-body-content").removeClass("active");
    $(".side-nav").removeClass("active");
    $(".top-section-1 img").addClass("active");
    $(".app-logo").addClass("collapsed");
    $(".top-section").addClass("collapsed");
    $(".goBackDiv").addClass("collapsed");
    $(".side-nav-icon-img").addClass("collapsed");
    $(".title").addClass("collapsed");
    $(".list").addClass("collapsed");
  } else {
    $(".side-nav .body-section").css({"overflow-y":"hidden", "scrollbar-width":"none"});
    $(".side-nav-body-content").addClass("active");
    $(".side-nav").addClass("active");
    $(".top-section-1 img").removeClass("active");
    $(".app-logo").removeClass("collapsed");
    $(".top-section").removeClass("collapsed");
    $(".goBackDiv").removeClass("collapsed");
    $(".side-nav-icon-img").removeClass("collapsed");
    $(".list").removeClass("collapsed");
    setTimeout(() => {$(".title").removeClass("collapsed")}, 500);
  }
}

// Function used to logout from application
logoutApplication() {
  this.authenticationService.logout();
}
*/
constructor(public authenticationService: AuthenticationService,
            private router: Router,
            private http: HttpClient,
            private commonFunctions: CommonFunctions,
            public loaderService: LoaderService,
            public informationservice: InformationService) {}
/*
ngOnInit(): void {

  // Start application with root menus
  this.fetchChildMenus(0);
  this.prevParentCode = '0';
  setTimeout(() => {this.handleOnLoadDesign()}, 600);

  // Fetch logged in User Info
  this.fetchUserData();
}*/

ngOnInit(): void {
  this.prevParentCode = '-1';

  this.dynamicSideNavBuilder(0);

  setTimeout(() => {this.handleOnLoadDesign()}, 600);
  this.fetchUserData();
}

dynamicSideNavBuilder(menuCode:any) {
  let menuContainer = document.createElement("ul");
  this.http.get(GlobalConstants.fetchMenuApi + menuCode +"/"+ this.userId, { headers: GlobalConstants.headers }).subscribe(
    (data) => {
      const menus:any = data;
      for(let i = 0; i < menus.length; i ++) {
        let menuItem = document.createElement("li");
        menuItem.setAttribute("class", "sideNavMenu menu_item_"+menus[i].menuCode);
        menuItem.innerHTML = menus[i].menuName;
        menuItem.onclick = () => {
          this.dynamicSideNavBuilder(menus[i].menuCode);
        }

        let childMenuContainer = document.createElement("div");
        childMenuContainer.setAttribute("class", menus[i].menuCode+"_childElemContainer");

        menuItem.appendChild(childMenuContainer);
        menuContainer.appendChild(menuItem);
      }
      if(menuCode == 0) {
        $(".side-nav .body-section").html(menuContainer);
      } else {
        $("."+menuCode+"_childElemContainer").html(menuContainer);
      }
    })
}

// fetchChildMenus(menuCode:any) {

//   console.log("menuCode ===== ", menuCode);

//   let menuContainer = document.createElement("ul");
//   this.http.get(GlobalConstants.fetchMenuApi + menuCode +"/"+ this.userId, { headers: GlobalConstants.headers }).subscribe(
//     (data) => {
//       const menus:any = data;
//       for(let i = 0; i < menus.length; i ++) {
//         let menuItem = document.createElement("li");
//         menuItem.setAttribute("class", "sideNavMenu menu_item_"+menus[i].menuCode);
//         menuItem.innerHTML = menus[i].menuName;
//         menuItem.onclick = () => {
//           this.fetchChildMenus(menus[i].menuCode);
//         }
//         menuContainer.appendChild(menuItem);
//       }
//       let childMenuContainer = document.createElement("div");
//       childMenuContainer.setAttribute("class", menuCode+"_childElemContainer");
//       menuContainer.appendChild(childMenuContainer);

//       $("."+menuCode+"_childElemContainer").html(menuContainer);
//   })
// }

// Function used to navigate to a page by routing
onSelect(menuVariable: any, childMenus: any) {
  if(childMenus != 0) {
    return;
  } else {
    if($('#side-nav').attr('class')!.indexOf("active") != -1) {
      this.menuVariable = menuVariable;
      this.fetchUserAccessRights(this.menuVariable, 'menu');
      menuVariable = this.appSname + "/" + menuVariable;
      
      this.informationservice.setMenuPath(menuVariable);

      setTimeout(()=>{
        if(this.appSname != '') {
          this.router.navigate([menuVariable]);
          this.commonFunctions.navigateToPage(menuVariable);
        } else {
          this.commonFunctions.navigateToPage(menuVariable);
        }
        this.toggleSwitch();
      },100);

    }
  }
}

fetchUserAccessRights(routeObj:any, sourceOfAccess:any) {
  let menuVar: any;

  if(sourceOfAccess == "breadcrumb") {
    menuVar = routeObj.route.path;
  }

  if(sourceOfAccess == "menu") {
    menuVar = routeObj;
  }

  this.http.get<any>(GlobalConstants.checkIsMenuManaged + menuVar).subscribe(
    (res: String) => {
      this.isManaged = res.toString();
      this.informationservice.setIsManaged(this.isManaged);

      if(this.isManaged == "1") {
        this.http.get<any>(GlobalConstants.checkAccessRight +  menuVar + "/" + this.userId).subscribe(
          (res: any) => {
            this.informationservice.setAccessRights(JSON.stringify(res));
            this.commonFunctions.navigateToPage(routeObj.url);
          },
          (error) => {
            console.log(error);
          }
        );
      }
    },
    (error) => {
      console.log(error);
    }
  );
}

// Function used to show arrow on menu containing child menus
toggleChildNavigation(menuId:any) {
  if($(".side-nav").attr("class")?.indexOf("active") != -1) {
    $(".navigateToChildArrow").css("display", "none");
    $("#childNav_"+menuId).toggle();
  }
}

// Function used to toggle side-nav menu
toggleSwitch() {
  $(".navigateToChildArrow").css("display", "none");
  if($(".side-nav").attr("class")?.indexOf("active") != -1) {
    $(".side-nav .body-section").css({"overflow-y":"auto", "scrollbar-width":""});
    $(".side-nav-body-content").removeClass("active");
    $(".side-nav").removeClass("active");
    $(".top-section-1 img").addClass("active");
    $(".app-logo").addClass("collapsed");
    $(".top-section").addClass("collapsed");
    $(".goBackDiv").addClass("collapsed");
    $(".side-nav-icon-img").addClass("collapsed");
    $(".title").addClass("collapsed");
    $(".list").addClass("collapsed");
  } else {
    $(".side-nav .body-section").css({"overflow-y":"hidden", "scrollbar-width":"none"});
    $(".side-nav-body-content").addClass("active");
    $(".side-nav").addClass("active");
    $(".top-section-1 img").removeClass("active");
    $(".app-logo").removeClass("collapsed");
    $(".top-section").removeClass("collapsed");
    $(".goBackDiv").removeClass("collapsed");
    $(".side-nav-icon-img").removeClass("collapsed");
    $(".list").removeClass("collapsed");
    setTimeout(() => {$(".title").removeClass("collapsed")}, 500);
  }
}

// Function used to logout from application
logoutApplication() {
  this.authenticationService.logout();
}

fetchUserData() {
  
  this.http.get<any>(GlobalConstants.fetchUSMUserApi + this.informationservice.getUserId(), { headers: GlobalConstants.headers }).subscribe(
    (data) => {
      if(data.email == null) {
        this.loggedInEmail = 'No Email';
      } else {
        this.loggedInEmail = data.email;
      }
      if(data.firstName == null && data.lastName == null) {
        this.loggedInUserFullName = 'No Name'
      } else {
        this.loggedInUserFullName = data.firstName + " " + data.lastName;
      }
      if(data.userImage == null) {
        this.loggedInImage = "assets/img/Profile-PNG-File.png";
      } else {
        this.loggedInImage = "data:image/png;base64,"+data.userImage;
      }
      this.loggedInUsername = data.username;
      this.loggedInFirstName = data.firstName;
    }
  );
}

handleOnLoadDesign() {
  $(".app-logo").addClass("collapsed");
  $(".top-section").addClass("collapsed");
  $(".goBackDiv").addClass("collapsed");
  $(".side-nav-icon-img").addClass("collapsed");
  $(".title").addClass("collapsed");
  $(".list").addClass("collapsed");
  $(".body-section").removeClass("hideElement");
  $(".body-section").addClass("showElement");
}

toggleUserProfileDropdown() {
  $("#myDropdown0").removeClass("show");
  $("#myDropdown1").toggleClass("show");
}

toggleAppDrawerDropdown() {
  $("#myDropdown1").removeClass("show");
  $("#myDropdown0").toggleClass("show");
}

openAppPreferences() {
  $("#myDropdown1 .section-1").hide();
  $("#myDropdown1 .section-1-hr").hide();
  $("#myDropdown1 .section-2").hide();
  $("#myDropdown1 .section-2-hr").hide();
  $("#myDropdown1 .section-3").hide();

  $("#myDropdown1 .section-2-app-pref").show();
}

backToUserProfilefromAppPref() {
  $("#myDropdown1 .section-1").show();
  $("#myDropdown1 .section-1-hr").show();
  $("#myDropdown1 .section-2").show();
  $("#myDropdown1 .section-2-hr").show();
  $("#myDropdown1 .section-3").show();

  $("#myDropdown1 .section-2-app-pref").hide();
}

}


