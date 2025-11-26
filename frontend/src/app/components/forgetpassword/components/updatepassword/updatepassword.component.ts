import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { FlexLayoutModule } from 'ngx-flexible-layout';
import { CenterDirective } from '../../../../common/directives/center.directive';
import { HttproutingService } from '../../../../common/services/httprouting.service';
import { Serverresponse } from '../../../../common/models/serverresponse';

@Component({
  selector: 'app-updatepassword',
  imports: [
    MatInputModule,
    MatIconModule,
    MatFormFieldModule,
    MatButtonModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    CenterDirective,
    MatIconModule
  ],
  templateUrl: './updatepassword.component.html',
  styleUrl: './updatepassword.component.scss'
})
export class UpdatepasswordComponent {
  updatePasswordForm!: FormGroup;
  email!: string | null;
  constructor(
    private router: Router,
    private httpService: HttproutingService
  ) {}
  ngOnInit(){
    this.email = sessionStorage.getItem('data') ?? '';
    this.updatePasswordForm = new FormGroup({
      email: new FormControl(this.email),
      password: new FormControl(null, [Validators.required, Validators.minLength(6)]),
      confirmPassword: new FormControl(null, [Validators.required, Validators.minLength(6)])
    })
  }
  ngOnDestroy(){
    sessionStorage.removeItem('data');
  }
  updatepassword() {
    if(this.updatePasswordForm.valid){
      const updatepasswordObj = {
        email: this.updatePasswordForm.get('email')?.value,
        password: this.updatePasswordForm.get('password')?.value,
        confirmPassword: this.updatePasswordForm.get('confirmPassword')?.value
      }
      this.httpService.postMethod('updatePassword', updatepasswordObj).subscribe({
        next: res => {
          const response = res as Serverresponse;
          if(response.success){
            this.router.navigate(['/login']);
          }else{
            alert(`${response.error?.message}`);
          }
        }
      })
    }
  }
}
