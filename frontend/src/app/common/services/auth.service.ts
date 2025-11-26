import { Injectable } from '@angular/core';
import { HttproutingService } from './httprouting.service';
import { BehaviorSubject } from 'rxjs';
import { HeaderService } from './header.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  messages: any | null = new BehaviorSubject(null);
  constructor(
    private httpService: HttproutingService
  ){}
  isAuthenticated(){
    let token = sessionStorage.getItem('currentUser');
    if(token){
      return token !== null;
    }
    return false;
  }
  logout(){
    sessionStorage.removeItem('currentUser');
    return true;
  }
  getMessages(){
    this.httpService.getJSONData().subscribe({
      next: res => this.messages.next(res),
      error: err => console.error(err)
    });
  }
  getToken() {
    let token = sessionStorage.getItem('currentUser');
    return token ?? null;
  }
}
