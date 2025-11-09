import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './common/services/auth.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor } from './common/services/token.interceptor';
import { HeaderService } from './common/services/header.service';
import { environment } from './common/environments/environment.dev';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: TokenInterceptor,
    multi: true
  }],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  apiUrl = environment.apiUrl;
  constructor(
    private authService: AuthService,
    private headerService: HeaderService
  ) {
    authService.getMessages();
    headerService.setHeaders( this.apiUrl + 'v1/login', 'content-type', 'application/json');
  }
}
