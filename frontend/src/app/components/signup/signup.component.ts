import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FlexLayoutModule } from 'ngx-flexible-layout';
import { CenterDirective } from '../../common/directives/center.directive';
import { Router, RouterLink } from '@angular/router';
import { FormControl, ReactiveFormsModule, FormGroup, Validators } from '@angular/forms';
import { HttproutingService } from '../../common/services/httprouting.service';
import { Serverresponse } from '../../common/models/serverresponse';
import { AuthService } from '../../common/services/auth.service';

@Component({
  selector: 'app-signup',
  imports: [
    FlexLayoutModule,
    CenterDirective,
    MatInputModule,
    MatIconModule,
    MatFormFieldModule,
    MatButtonModule,
    RouterLink,
    ReactiveFormsModule
  ],
  templateUrl: './signup.component.html',
  styleUrls: [
    './signup.component.scss',
    '../login/login.component.scss'
  ]
})
export class SignupComponent {
  signupForm!: FormGroup;
  messages: any;
  constructor(
    private httpService: HttproutingService,
    private route: Router,
    private authService: AuthService
    ){
      this.authService.messages.subscribe((res: any) => {
        this.messages = res;
      });
    }
  ngOnInit(){
    this.signupForm = new FormGroup({
      name: new FormControl(null,[Validators.required, Validators.minLength(3), Validators.maxLength(20)]),
      email: new FormControl(null, [Validators.required, Validators.email]),
      phoneNumber: new FormControl(null, [Validators.required, Validators.pattern('^[0-9]+$'), Validators.minLength(10), Validators.maxLength(10)]),
      password: new FormControl(null, [Validators.required, Validators.minLength(6)]),
      confirmPassword: new FormControl(null, [Validators.required, Validators.minLength(6)])
    });
    this.signupForm.get('password')?.valueChanges.subscribe(val => {
      if (!this.signupForm.get('password')?.errors) {
        this.signupForm.get('password')?.setErrors((val.length < 6) ? { 'minLength': true } : null);
      }
    });
    this.signupForm.get('confirmPassword')?.valueChanges.subscribe(val => {
      if (!this.signupForm.get('confirmPassword')?.errors){
        this.signupForm.get('confirmPassword')?.setErrors(
          (val !== this.signupForm.get('password')?.value)
            ? { 'unmatchPassword': true }
            : null
        );
      }
    })
  }
  onSubmit(){
    if(this.signupForm.valid){
      const SignUpData = {
        name: this.signupForm.get('name')?.value,
        email: this.signupForm.get('email')?.value,
        phoneNumber: this.signupForm.get('phoneNumber')?.value,
        password: this.signupForm.get('password')?.value,
        confirmPassword: this.signupForm.get('confirmPassword')?.value
      }
      this.httpService.postMethod('signUp', SignUpData).subscribe({
        next: res => {
          let response = res as Serverresponse;
          if(response.success){
            this.route.navigate(['/login']);
          }
        }
      });
    }
  }
}
