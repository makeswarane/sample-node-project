import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FlexLayoutModule } from 'ngx-flexible-layout';
import { CenterDirective } from '../../../../common/directives/center.directive';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttproutingService } from '../../../../common/services/httprouting.service';
import { Serverresponse } from '../../../../common/models/serverresponse';

@Component({
  selector: 'app-verifyemail',
  imports: [
    MatInputModule,
    MatIconModule,
    MatFormFieldModule,
    MatButtonModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    CenterDirective,
    MatIconModule,
    RouterLink
  ],
  templateUrl: './verifyemail.component.html',
  styleUrl: './verifyemail.component.scss'
})
export class VerifyemailComponent {
  isOTPSent: boolean = false;
  email!: string;
  emailVerificationForm!: FormGroup;
  otpVerificationForm!: FormGroup;
  constructor(
    private httpService: HttproutingService,
    private router: Router,
    private route: ActivatedRoute
  ) { }
  ngOnInit() {
    // For Verify Email
    this.emailVerificationForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email])
    });
    // Verify Email with OTP - After OTP was sent
    this.otpVerificationForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      otp: new FormControl(null, [Validators.required, Validators.pattern('^[0-9]+$'), Validators.minLength(4), Validators.maxLength(4)])
    });
    // Check State of Verifcation - For reloading of page
    this.isOTPSent = this.getCookie('isTrue') === 'true';
    if(this.isOTPSent) {
      this.email = sessionStorage.getItem('data') ?? '';
      // Set the email on OTP Form
      this.otpVerificationForm.get('email')?.setValue(this.email);
      this.otpVerificationForm.get('email')?.disable();
    }
  }
  // For Cookie
  setCookie(name: string, value: string, minutes: number) {
    const expires = new Date(Date.now() + minutes * 60 * 1000).toUTCString();
    document.cookie = `${name}=${value}; expires=${expires}; path=/`;
  }
  getCookie(name: string): string | null {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : null;
  }
  deleteCookie(name: string){
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  }
  // Verification of email
  verifyEmail() {
    if (this.emailVerificationForm.valid) {
      const emailObj = {
        email: this.emailVerificationForm.get('email')?.value
      };
      this.httpService.postMethod('forgetPassword', emailObj).subscribe({
        next: res => {
          const response = res as Serverresponse;
          if (response.success) {
            // Set OTP Status as Cookie
            this.isOTPSent = true;
            this.setCookie('isTrue', this.isOTPSent.toString(), 10);
            // Set email as Data in Session
            sessionStorage.setItem('data',emailObj.email);
            this.email = sessionStorage.getItem('data') ?? '';
            // Set email value on OTP Form
            this.otpVerificationForm.get('email')?.setValue(this.email);
            this.otpVerificationForm.get('email')?.disable();
          } else {
            alert(`${response?.error?.message}`);
          }
        },
        error: err => {
          console.error(err);
        }
      });
    }
  }
  // Verify OTP
  verifyOTP() {
    if (this.otpVerificationForm.valid) {
      const OTPObj = {
        email: this.otpVerificationForm.get('email')?.value,
        otp: this.otpVerificationForm.get('otp')?.value
      };
      this.httpService.postMethod('verifyOtp', OTPObj).subscribe({
        next: res => {
          const response = res as Serverresponse;
          if (response?.success) {
            this.deleteCookie('isTrue');
            this.router.navigate(['/forgetpassword/update'], { relativeTo: this.route });
          }
        },
        error: err => {
          console.error("error: ", err);
        }
      });
    }
  }
}

