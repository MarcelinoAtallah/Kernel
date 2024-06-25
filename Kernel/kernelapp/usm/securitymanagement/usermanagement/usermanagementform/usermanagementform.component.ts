import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, AbstractControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalConstants } from 'src/app/Kernel/common/GlobalConstants';
import { DatePipe } from '@angular/common';
import { CommonFunctions } from 'src/app/Kernel/common/CommonFunctions';
import * as shajs from 'sha.js';
import { AgColumns } from 'src/app/Kernel/common/AGColumns';
import { from, lastValueFrom } from 'rxjs';
import axios from 'axios';
import { InformationService } from 'src/app/Kernel/services/information.service';


@Component({
  selector: 'app-usermanagementform',
  templateUrl: './usermanagementform.component.html',
  styleUrls: ['./usermanagementform.component.css'],
})
export class Usermanagementform implements OnInit {
  [x: string]: any;
  public getUSMUsersApi: any = GlobalConstants.fetchUSMUsersApi;
  public comboDatasource = [{}];
  public userId: string = '';
  public actionType: string = '';
  public userImage: string = '';
  public usmRolesApi: string = GlobalConstants.fetchUSMRolesApi;
  public radioData: any;
  public passwordExpires: any;
  public statusCombo: any;
  public languageCombo: any;
  public ispwd: boolean;
  public bugType: any;
  public civilStatus: any;
  public currency: any;
  public bugName: any;
  public roleName: any;
  public defaultRoleName: any;
  public showHideTabs = false;
  public isReadOnly: boolean = false;
  public isShown: boolean = false;
  public roleIsDisabled: boolean = false;
  public bugIsDisabled: boolean = false;
  public showPasswordExpiresPeriodically: boolean = false;
  public showPasswordExpires: boolean = false;
  public bugIsRequired: any = false;
  public roleIsRequired: any = false;
  public pwdExpType: any;
  public defaultRoleBody: any;
  public passwordIsRequired: boolean = false;
  public fileIsRequired: boolean = false;
  
  public menuPath: any = this.informationservice.getMenuPath();
  public comboAppType: any = GlobalConstants.fetchUSMRolesAppComboApi;
  public roleId: any;

  public isImgRequired: boolean = false;

  constructor(
    private _Activatedroute: ActivatedRoute,
    public datepipe: DatePipe,
    private commonFunctions: CommonFunctions,
    private route: Router,
    public informationservice: InformationService
  ) { }

  userForm = new FormGroup({
    username: new FormControl(''),
    password: new FormControl(''),
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    ispwd: new FormControl(''),
    email: new FormControl(''),
    gender: new FormControl(''),
    civilStatus: new FormControl(''),
    dateOfBirth: new FormControl(''),
    language: new FormControl(''),
    currency: new FormControl(''),
    firstAddress: new FormControl(''),
    secondAddress: new FormControl(''),
    phone: new FormControl(''),
    mobile: new FormControl(''),
    postalCode: new FormControl(''),
    media: new FormControl(''),
    role: new FormControl(''),
    status: new FormControl(''),
    bug: new FormControl(''),
    bugType: new FormControl(''),
    defaultRole: new FormControl(''),
    fakePassword: new FormControl(''),
    oldPassword: new FormControl(''),
    newPassword: new FormControl(''),
    confirmNewPassword: new FormControl(''),
    changePassword: new FormControl(''),
    passwordExpiries: new FormControl(''),
    passwordExpiresPeriodically: new FormControl(''),
    passwordExpires: new FormControl(''),
    passwordExpiresPeriodNbr: new FormControl(''),
    //application: new FormControl(''),
  });

  ngOnInit(): void {
    this.statusCombo = GlobalConstants.fetchUSMStatusComboApi;
    this.languageCombo = GlobalConstants.fetchUSMLanguageComboApi;
    this.bugType = GlobalConstants.fetchUSMBugTypeComboApi;
    this.civilStatus = GlobalConstants.fetchUSMCivilStatusApi;
    this.currency = GlobalConstants.fetchUSMCurrencyApi;
    this.roleName = GlobalConstants.fetchUSMRoleNameApi;

    this.radioData = [
      { value: '1', name: 'Female' },
      { value: '2', name: 'Male' },
    ];

    this.passwordExpires = [
      { value: '1', name: 'Password Never Expires' },
      { value: '2', name: 'Password Expires' },
      { value: '3', name: 'Password Expiries Periodically' },
    ];

    this.pwdExpType = GlobalConstants.getUSMPwdExpPeriodApi;

    this._Activatedroute.paramMap.subscribe((params) => {
      this.userId = params.get('id');
      
      this.informationservice.setUserId(this.userId);

      this.actionType = params.get('actionType');
    });

    if (this.actionType == 'create') {
      this.passwordIsRequired = true;
      this.userImage = 'assets/img/Profile-PNG-File.png';
      this.bugName = "";
      this.defaultRoleName = "";
      this.fileIsRequired = true;
      this.isReadOnly = true;
      this.isShown = true;
      this.roleIsDisabled = true;
      this.bugIsDisabled = true;
      this.userForm.controls['passwordExpiries'].setValue('1');
    }

    if (this.userId != '' && this.actionType == 'update') {
      this.showHideTabs = true;
      this.isReadOnly = false;
      this.fetchUserData();
      this.onOldPasswordChange();
    }

    // Make image required if creating a user, else make it not required
    this.isImgRequired = this.actionType == "create" ? true : false;
  }

  onPasswordExpiresChange(value: any) {

    if (value == '3') {
      this.showPasswordExpires = false;
      this.showPasswordExpiresPeriodically = true;
      this.userForm.controls['passwordExpires'].setValue("");

    } else if (value == '2') {
      this.showPasswordExpiresPeriodically = false;
      this.showPasswordExpires = true;
      this.userForm.controls['passwordExpiresPeriodNbr'].setValue("");
      this.userForm.controls['passwordExpiresPeriodically'].setValue(null);
    }
    else {
      this.showPasswordExpiresPeriodically = false;
      this.showPasswordExpires = false;
      this.userForm.controls['passwordExpiresPeriodNbr'].setValue("");
      this.userForm.controls['passwordExpiresPeriodically'].setValue(null);
      this.userForm.controls['passwordExpires'].setValue("");

    }
  }

  passwordCompare() {
    var newPassword = this.userForm.get('newPassword').value;
    var confirmNewPassword = this.userForm.get('confirmNewPassword').value;

    if (newPassword != '' && confirmNewPassword != '') {
      if (confirmNewPassword != newPassword) {
        this.userForm.controls['newPassword'].setValue('');
        this.userForm.controls['confirmNewPassword'].setValue('');
        this.commonFunctions.alert("alert", 'Passwords do not match');
      }
    }
  }

  onOldPasswordChange() {
    var oldPassword = this.userForm.get('oldPassword').value;
    var password = this.userForm.get('password').value;

    if (oldPassword != '') {
      if (shajs('sha256').update(oldPassword).digest('hex') == password) {
        this.isShown = true;
        this.passwordIsRequired = true;
      } else {
        this.commonFunctions.alert("alert", 'Old Password Incorrect');
        this.userForm.controls['oldPassword'].setValue('');
        this.isShown = false;
        this.passwordIsRequired = false;
      }
    } else {
      this.userForm.controls['newPassword'].setValue('');
      this.userForm.controls['confirmNewPassword'].setValue('');
      this.isShown = false;
      this.passwordIsRequired = false;
    }
  }

  async fetchUserData() {
    this.isReadOnly = false;
    this.fileIsRequired = false;

    this.onOldPasswordChange();

    const fetchUSMUser = from(axios.get(GlobalConstants.fetchUSMUserApi + this.userId));
    const fetchUSMUserUrl = await lastValueFrom(fetchUSMUser);
    let res = fetchUSMUserUrl.data;

    if (res.bugType != null && res.bugType != '') {
      this.bugName = GlobalConstants.fetchUSMBugNameApi + '/' + res.bugType + '/' + this.userId;
    }
    if (res.usmRoles != null && res.usmRoles != '') {
      const defaultRoleJson = { 'id': res.usmRoles };
      
      this.informationservice.setUserRoleId(String(defaultRoleJson.id));

      this.defaultRoleName = GlobalConstants.fetchUSMDefaultRoleNameApi;
      this.defaultRoleBody = defaultRoleJson;

    }
    // this.userForm.controls['media'].setValue(res.userImage);
    this.userForm.controls['username'].setValue(res.username);
    this.userForm.controls['password'].setValue(res.password);
    if (this.actionType == 'update') {
      this.userForm.controls['fakePassword'].setValue('0000');
    }
    this.userForm.controls['email'].setValue(res.email);
    this.userForm.controls['firstName'].setValue(res.firstName);
    this.userForm.controls['lastName'].setValue(res.lastName);
    this.userForm.controls['gender'].setValue(res.gender);
    this.userForm.controls['civilStatus'].setValue(res.civilStatus);
    if (res.dateOfBirth != "" && res.dateOfBirth != "null") {
      this.userForm.controls['dateOfBirth'].setValue(
        this.commonFunctions.formatDate(
          this.datepipe.transform(res.dateOfBirth, 'MM-dd-YYYY')
        )
      );
    }

    this.userForm.controls['language'].setValue(res.lanId);
    // this.userForm.controls['numberSetting'].setValue(res.numberSetting);
    this.userForm.controls['currency'].setValue(res.currency);
    this.userForm.controls['firstAddress'].setValue(res.firstAddress);
    this.userForm.controls['secondAddress'].setValue(res.secondAddress);
    this.userForm.controls['phone'].setValue(res.phone);
    this.userForm.controls['mobile'].setValue(res.mobile);
    this.userForm.controls['postalCode'].setValue(res.postalCode);
    this.userForm.controls['status'].setValue(res.status);
    this.userForm.controls['bugType'].setValue(res.bugType);
    this.userForm.controls['bug'].setValue(res.usmMdmBsnUnitGroup);
    this.userForm.controls['defaultRole'].setValue(res.defaultRole);
    this.userForm.controls['role'].setValue(res.usmRoles);

    if (res.changePassword == "0") {
      this.userForm.controls['changePassword'].setValue(false);
    } else {
      this.userForm.controls['changePassword'].setValue(true);
    }

    if (res.pwdExpDate != "" && res.pwdExpDate != "null") {
      this.showPasswordExpires = true;
      this.userForm.controls['passwordExpires'].setValue(this.commonFunctions.formatDate(this.datepipe.transform(res.pwdExpDate, 'MM-dd-YYYY')));
      this.userForm.controls['passwordExpiries'].setValue("2");
    } else if (res.pwdExpPrdNbr != "" && res.pwdExpPrd != "" && res.pwdExpPrdNbr != "null" && res.pwdExpPrd != "null") {
      this.showPasswordExpiresPeriodically = true;
      this.userForm.controls['passwordExpiresPeriodNbr'].setValue(res.pwdExpPrdNbr);
      this.userForm.controls['passwordExpiresPeriodically'].setValue(res.pwdExpPrd);
      this.userForm.controls['passwordExpiries'].setValue("3");
    } else {
      this.userForm.controls['passwordExpiries'].setValue("1");
    }

    if (res.usmRoles != '') {
      this.roleIsDisabled = false;
      this.roleIsRequired = true;
    } else {
      this.roleIsDisabled = true;
      this.roleIsRequired = false;
    }

    if (res.usmMdmBsnUnitGroup != '') {
      this.bugIsDisabled = false;
      this.bugIsRequired = true;
    } else {
      this.bugIsDisabled = true;
      this.bugIsRequired = false;
    }

    if (res.isPwdLdapAuth == '1') {
      this.ispwd = true;
      this.userForm.controls['ispwd'].setValue(this.ispwd);
    } else {
      this.ispwd = false;
      this.userForm.controls['ispwd'].setValue(this.ispwd);
    }

    if (typeof res.userImage == 'undefined') {
      this.userImage = 'assets/img/Profile-PNG-File.png';
    } else {
      this.userImage = 'data:image/png;base64,' + res.userImage;
    }

    // Comparing logged in user with the updated user, if they are equal then updated the application user profile accordingly
    if (this.informationservice.getLogeduserId() == this.userId) {
      $('.sideNavPhoto').attr('src', this.userImage);
    }
  }

  // Submit Form Action
  async submitForm() {
    console.log("rony test usm")
    var newPassword = this.userForm.get('newPassword').value;
    var confirmPassword = this.userForm.get('confirmNewPassword').value;
    var oldPassword = this.userForm.get('oldPassword').value;
    var password = this.userForm.get('password').value;

    if (this.userForm.status != 'INVALID') {
      if (this.actionType == 'create') {
        if (newPassword == confirmPassword) {
          const formData = new FormData();

          if (this.userForm.get('media').value.get('media') != '') {
            formData.append('media', this.userForm.get('media').value.get('media')
            );
          } else {
            var f = new File(['dummyFile'], 'DummyTxtFile.txt', {
              type: 'text/plain',
              lastModified: null,
            });
            formData.append('media', f);
          }

          formData.append('username', this.userForm.get('username').value);
          formData.append('password', newPassword);
          formData.append('firstName', this.userForm.get('firstName').value);
          formData.append('lastName', this.userForm.get('lastName').value);
          formData.append('email', this.userForm.get('email').value);
          formData.append('gender', this.userForm.get('gender').value);
          formData.append('userId', this.informationservice.getLogeduserId());
          formData.append('civilStatus', this.userForm.get('civilStatus').value);
          formData.append('dateOfBirth', this.datepipe.transform(this.userForm.get('dateOfBirth').value, 'MM-dd-YYYY'));
          formData.append('language', this.userForm.get('language').value);
          formData.append('bugType', this.userForm.get('bugType').value);
          formData.append('bugName', this.userForm.get('bug').value);
          formData.append('status', this.userForm.get('status').value);
          formData.append('defaultRole',this.userForm.get('defaultRole').value);
          formData.append('role', this.userForm.get('role').value);
          formData.append('currency', this.userForm.get('currency').value);
          formData.append( 'firstAddress', this.userForm.get('firstAddress').value);
          formData.append('secondAddress',this.userForm.get('secondAddress').value);
          formData.append('phone', this.userForm.get('phone').value);
          formData.append('mobile', this.userForm.get('mobile').value);
          formData.append('postalCode', this.userForm.get('postalCode').value);
          formData.append('ispwd', this.userForm.get('ispwd').value);
          formData.append('changePassword', this.userForm.get('changePassword').value);
          formData.append('pwdExpPrdNbr', this.userForm.get('passwordExpiresPeriodNbr').value);
          formData.append('pwdExpPrd', this.userForm.get('passwordExpiresPeriodically').value);
          formData.append('pwdExpDate', this.datepipe.transform(this.userForm.get('passwordExpires').value, 'MM-dd-YYYY'));

          const addUSMUser = from(axios.post(GlobalConstants.addUSMUserApi, formData));
          const addUSMUserUrl = await lastValueFrom(addUSMUser);
          let res = addUSMUserUrl.data;

          if (res.body.status == 'Fail') {
            this.commonFunctions.alert("alert", res.body.description);
          } else {
            this.commonFunctions.alert("alert", res.body.description);
            this.userId = res.body.userId;
            this.actionType = 'update';
            this.route.navigateByUrl(this.menuPath + "/form/" + this.actionType + "/" + this.userId);
            this.fetchUserData();
          }
        } else {
          this.commonFunctions.alert("alert", 'Passwords do not match');
        }
      }

      if (this.actionType == 'update') {
        this.showHideTabs = true;
        if (
          shajs('sha256').update(oldPassword).digest('hex') != '' &&
          shajs('sha256').update(oldPassword).digest('hex') == password
        ) {
          if (newPassword == confirmPassword) {

            const formData = new FormData();
            formData.append('username', this.userForm.get('username').value);
            formData.append('password', newPassword);
            formData.append('firstName', this.userForm.get('firstName').value);
            formData.append('lastName', this.userForm.get('lastName').value);
            formData.append('email', this.userForm.get('email').value);
            formData.append('userId', this.informationservice.getLogeduserId());
            if (this.userForm.get('media').value != '') {
              formData.append('media', this.userForm.get('media').value.get('media'));
            } else {
              var f = new File(['dummyFile'], 'DummyTxtFile.txt', {
                type: 'text/plain',
                lastModified: null,
              });
              formData.append('media', f);
            }
            formData.append('gender', this.userForm.get('gender').value);
            formData.append('civilStatus', this.userForm.get('civilStatus').value);
            formData.append('dateOfBirth', this.datepipe.transform(this.userForm.get('dateOfBirth').value, 'MM-dd-YYYY'));
            formData.append('language', this.userForm.get('language').value);
            formData.append('bugType', this.userForm.get('bugType').value);
            formData.append('bugName', this.userForm.get('bug').value);
            formData.append('status', this.userForm.get('status').value);
            formData.append('defaultRole',this.userForm.get('defaultRole').value);
            formData.append('role', this.userForm.get('role').value);
            formData.append('currency', this.userForm.get('currency').value);
            formData.append('firstAddress',this.userForm.get('firstAddress').value );
            formData.append('secondAddress',this.userForm.get('secondAddress').value );
            formData.append('phone', this.userForm.get('phone').value);
            formData.append('mobile', this.userForm.get('mobile').value);
            formData.append('postalCode',this.userForm.get('postalCode').value);
            formData.append('ispwd', this.userForm.get('ispwd').value);
            formData.append('pwdExpPrdNbr', this.userForm.get('passwordExpiresPeriodNbr').value);
            formData.append('pwdExpPrd', this.userForm.get('passwordExpiresPeriodically').value);
            formData.append('pwdExpDate', this.datepipe.transform(this.userForm.get('passwordExpires').value, 'MM-dd-YYYY'));
            formData.append('changePassword', this.userForm.get('changePassword').value);

            const updateUSMUser = from(axios.put(GlobalConstants.updateUSMUserApi + this.userId, formData));
            const updateUSMUserUrl = await lastValueFrom(updateUSMUser);
            this.commonFunctions.alert("alert", updateUSMUserUrl.data.body.description);
            this.fetchUserData();
          } else {
            this.commonFunctions.alert("alert", 'Passwords do not match');
          }
        } else {
          const formData = new FormData();
          formData.append('username', this.userForm.get('username').value);
          formData.append('password', password);
          formData.append('firstName', this.userForm.get('firstName').value);
          formData.append('lastName', this.userForm.get('lastName').value);
          formData.append('email', this.userForm.get('email').value);
          formData.append('userId', this.userId);
          if (this.userForm.get('media').value != '') {
            formData.append('media', this.userForm.get('media').value.get('media'));
          } else {
            var f = new File(['dummyFile'], 'DummyTxtFile.txt', {
              type: 'text/plain',
              lastModified: null,
            });
            formData.append('media', f);
          }
          formData.append('gender', this.userForm.get('gender').value);
          formData.append('civilStatus', this.userForm.get('civilStatus').value);
          formData.append('dateOfBirth', this.datepipe.transform(this.userForm.get('dateOfBirth').value, 'MM-dd-YYYY'));
          formData.append('language', this.userForm.get('language').value);
          formData.append('bugType', this.userForm.get('bugType').value);
          formData.append('bugName', this.userForm.get('bug').value);
          formData.append('status', this.userForm.get('status').value);
          formData.append('defaultRole', this.userForm.get('defaultRole').value);
          formData.append('role', this.userForm.get('role').value);
          formData.append('currency', this.userForm.get('currency').value);
          formData.append('firstAddress', this.userForm.get('firstAddress').value);
          formData.append('secondAddress', this.userForm.get('secondAddress').value);
          formData.append('phone', this.userForm.get('phone').value);
          formData.append('mobile', this.userForm.get('mobile').value);
          formData.append('postalCode', this.userForm.get('postalCode').value);
          formData.append('ispwd', this.userForm.get('ispwd').value);
          formData.append('pwdExpPrdNbr', this.userForm.get('passwordExpiresPeriodNbr').value);
          formData.append('pwdExpPrd', this.userForm.get('passwordExpiresPeriodically').value);
          formData.append('pwdExpDate', this.datepipe.transform(this.userForm.get('passwordExpires').value, 'MM-dd-YYYY'));
          formData.append('changePassword', this.userForm.get('changePassword').value);

          const updateUSMUser = from(axios.put(GlobalConstants.updateUSMUserApi + this.userId, formData));
          const updateUSMUserUrl = await lastValueFrom(updateUSMUser);
          this.commonFunctions.alert("alert", updateUSMUserUrl.data.description);
          this.fetchUserData();
        }

        this.userForm.controls['oldPassword'].setValue('');
        this.userForm.controls['newPassword'].setValue('');
        this.userForm.controls['confirmNewPassword'].setValue('');
        this.isShown = false;
      }
    }
  }
  onBugTypeChange(value: any) {
    if (value != '') {
      this.bugIsDisabled = false;
      this.bugIsRequired = true;
      this.bugName = GlobalConstants.fetchUSMBugNameApi + '/' + value + '/' + this.userId;
    } else {
      this.bugName = ""
      this.bugIsDisabled = true;
      this.bugIsRequired = false;
    }
  }

  onRoleChange(value: any) {
    if (value != '') {
      const defaultRoleJson = { 'userRoleid': value };
      
      this.informationservice.setUserRoleId(String(defaultRoleJson.userRoleid)); // Store the value in localStorage
      
      this.roleId = this.informationservice.getUserRoleId(); // Retrieve the value from localStorage
      this.userForm.controls['defaultRole'].setValue(this.userForm.get('role').value);
    } else {
      this.userForm.controls['defaultRole'].setValue('');
      this.roleIsDisabled = true;
      this.roleIsRequired = false;
    }
  }
}
