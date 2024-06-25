import { Component, HostListener, OnInit } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { GlobalConstants } from 'src/app/Kernel/common/GlobalConstants';
import { HttpClient } from '@angular/common/http';
import { SignInData } from '../../model/signInData';
import { CommonFunctions } from '../../common/CommonFunctions';
import { LoaderService } from '../../services/loader.service';
import { InformationService } from 'src/app/Kernel/services/information.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class Login implements OnInit {

  public customStyle: any;
  public currentYear: any;
  public appSlogant: any;
  public appVersion: any = '';
  public errorMessage: any = '';
  loginForm = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
    captchaField: new FormControl('')

  });

  get username(){return this.loginForm.get("username")}
  get password(){return this.loginForm.get("password")}

  areCredentialsInvalid = false;

  ngOnInit(): void {
    // Login button custom style
    this.customStyle = "width: 100%; color: var(--white-color); font-size: 16px; padding-left: 50px; padding-right: 50px; padding-top: 8px; padding-bottom: 8px;"
    // Set current year dynamically
    this.currentYear = new Date().getFullYear();
    // Application Version
    // $("#appVersion").html("System version: " + this.appVersion);
    $("#appVersion").html("System Version: V21 - 5");
    // Set application slogant using jQuery in order to use break lines if needed
    $("#appSlogant").html("You Have The Value, <br> We Bring You The Added Value");
  }

  constructor(private authenticationService: AuthenticationService,
              private http: HttpClient,
              private commonFunctions: CommonFunctions,
              public loaderService: LoaderService,
              public informationservice: InformationService) {}

  // Submit event listener on enter click
  @HostListener('document:keypress', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (event.key === "Enter") {
      this.submitForm();
    }
  }

  submitForm() {

    this.loaderService.isLoading.next(true);

    const username = this.loginForm.get('username')?.value;
    const password = this.loginForm.get('password')?.value;

    if (!this.loginForm.valid) {
      this.areCredentialsInvalid = false;
      this.loginForm.markAllAsTouched();
      return;
    }

    if (this.loginForm.valid) {
      
      this.http.post<any>(GlobalConstants.checkCaptcha+this.loginForm.get("captchaField").value+"/"+this.informationservice.getLogSerial(), {}).subscribe(
        (res) => {
         if(res==1){

          this.http.post<any>(GlobalConstants.loginApi, {username: username, password: password}).subscribe(
            (res) => {
              if(res.code == "0") {
                const user = new SignInData(username, password, '', '', res.userId, res.roleName,res.roleId);
                this.loaderService.isLoading.next(false);                
                this.authenticationService.handleAuthentication(user);
                this.commonFunctions.navigateToPage('./dashboard');
              }
    
              if(res.code == "1") {
                this.errorMessage = "Invalid credentials";
                this.areCredentialsInvalid = true;
                $("#regenerateCaptcha").trigger("click");

              }
            },
            (error) => {
              this.loginForm.reset();
              this.errorMessage = "Something went wrong";
              console.log("error ---> " , error);
              $("#regenerateCaptcha").trigger("click");

            }
          );
        }
         else{
          this.loginForm.reset();
          this.errorMessage = "Captcha does not match";
          $("#regenerateCaptcha").trigger("click");

         }
        },
      );
   }
  }

}
