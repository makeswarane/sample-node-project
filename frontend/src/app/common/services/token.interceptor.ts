import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { catchError, Observable, throwError } from "rxjs";
import { HeaderService } from "./header.service";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class TokenInterceptor implements HttpInterceptor {
    constructor(
        private headerService: HeaderService
    ){}
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>{
        return next.handle(this.setHeaders(request)).pipe(catchError((err: any) => {
            if (err instanceof HttpErrorResponse && err.status === 401){
                console.error('Unauthorized request detected in interceptor.');
                return throwError(err);
            }
            return throwError(err);
        }));
    }
    setHeaders(request: HttpRequest<any>){
        const headers = this.headerService.getHeaders(request.url)
        return headers ? request.clone({
            setHeaders: headers
        }): request;
    }
}