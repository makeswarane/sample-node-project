import { Component } from '@angular/core';
import { FlexLayoutModule } from 'ngx-flexible-layout';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-pagenotfound',
  imports: [
    FlexLayoutModule,
    RouterLink
  ],
  templateUrl: './pagenotfound.component.html',
  styleUrl: './pagenotfound.component.scss'
})
export class PagenotfoundComponent {}