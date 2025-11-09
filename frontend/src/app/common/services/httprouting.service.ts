import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment.dev';
import { HeaderService } from './header.service';

@Injectable({
  providedIn: 'root'
})
export class HttproutingService {
  private apiUrl = environment.apiUrl;
  private root = environment.root;

  constructor(
    private http: HttpClient,
    private headerService: HeaderService
  ){}

  postMethod(url: string, body: any){
    return this.http.post(this.apiUrl + this.root + url, body);
  }

  getJSONData(){
    return this.http.get('/assets/messages.json');
  }
}
