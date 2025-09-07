import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environment/environment.local';

@Injectable()
export class ApiHeadersInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let headers = req.headers
      .set('Accept', 'application/json')
    //   .set('Content-Type', 'application/json')
    //   .set('Cache-Control', 'no-cache')
    //   .set('Pragma', 'no-cache')
    //   .set('Expires', '0')
    //   .set('X-Requested-With', 'XMLHttpRequest');
    if (req.url.startsWith(environment.tmdbBaseUrl)) {
      const urlWithKey = req.url.includes('api_key=')
        ? req.url
        : req.url + (req.url.includes('?') ? '&' : '?') + `api_key=${environment.tmdbApiKey}`;
      const cloned = req.clone({ url: urlWithKey, headers });
      return next.handle(cloned);
    }
    return next.handle(req.clone({ headers }));
  }
}
