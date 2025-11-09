import { PreloadingStrategy, Route } from '@angular/router';
import { Observable, of, timer } from 'rxjs';
import { Injectable } from '@angular/core';
import { mergeMap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class CustomPreloadingStrategy implements PreloadingStrategy {
    preload(route: Route, load: () => Observable<any>): Observable<any> {
        const shouldPreload = route.data && route.data['preload'];
        const preloadDelay = route.data?.['delay'] || 0;
        if (shouldPreload) {
            return timer(preloadDelay).pipe(mergeMap(() => load()));
        } else {
            return of(null);
        }
    }
}
