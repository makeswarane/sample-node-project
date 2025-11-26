import { Component } from '@angular/core';
import { FlexLayoutModule } from 'ngx-flexible-layout';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-forgetpassword',
  imports: [
    FlexLayoutModule,
    RouterOutlet
  ],
  templateUrl: './forgetpassword.component.html',
  styleUrl: './forgetpassword.component.scss'
})
export class ForgetpasswordComponent {
}
