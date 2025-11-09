import { Component } from '@angular/core';
import { FlexLayoutModule } from 'ngx-flexible-layout';
import { CenterDirective } from '../../common/directives/center.directive';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttproutingService } from '../../common/services/httprouting.service';
import { Serverresponse } from '../../common/models/serverresponse';
import { AuthService } from '../../common/services/auth.service';

@Component({
  selector: 'app-login',
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
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginForm!: FormGroup;
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
  ngOnInit() {
    this.loginForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required, Validators.minLength(6)])
    });
  }
  signIn() {
    if (this.loginForm.valid) {
      const LoginData = {
        email: this.loginForm.get('email')?.value,
        password: this.loginForm.get('password')?.value
      }
      this.httpService.postMethod('signIn', LoginData).subscribe({
        next: res => {
          let response = res as Serverresponse;
          if (response.success) {
            sessionStorage.setItem('currentUser', response.data.toString());
            this.route.navigate(['/app/home']);
          }
        },
        error: err => console.error(err)
      });
    }
  }
}
