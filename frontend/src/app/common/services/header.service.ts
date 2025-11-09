import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HeaderService {
  headers: {[url: string] : { [key: string] : string }} = {};

  setHeaders(url: string, key: string, value: string){
    console.log(this.headers);
    if(this.headers && this.headers.hasOwnProperty(url)){
      this.headers[url][key] = value;
    }
    else{
      this.headers[url] = { [key]: value };
    }
  }
  getHeaders(url: string){
    if(this.headers && this.headers[url]){
      return this.headers[url];
    }else{
      return this.headers['default'];
    }
  }
}
