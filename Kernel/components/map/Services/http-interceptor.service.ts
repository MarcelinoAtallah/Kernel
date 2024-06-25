import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, finalize, Observable, of, throwError } from "rxjs";
import { LoaderService } from "./loader.service";
import { GlobalConstants } from "src/app/Kernel/common/GlobalConstants";

@Injectable()
export class Http_Interceptor implements HttpInterceptor {

    totalRequests = 0;
    requestsCompleted = 0;

    constructor(public loaderService: LoaderService) {}

    // Request Interceptor Class
    intercept(
        request: HttpRequest<any>,
        next: HttpHandler
      ): Observable<HttpEvent<any>> {

        //console.log("startttttttttttttt")
        this.loaderService.show();
        this.totalRequests++;

        //console.log("Interceptor ---- > 111111111111111111111111111111" );
        const serverUrl = 'http://10.1.8.136:9999/ValooresAPI/ExecutiveMethod/Invoke';

        if (request.url.startsWith(serverUrl)) {
          const modifiedReq = request.clone({
            headers: request.headers.set('Authorization', 'Bearer token')
          });
    
          return next.handle(modifiedReq);
      }
      // else  if (request.url.includes('/api/getSimulationData/')) {
      //   // If it matches, skip the interceptor and pass the request directly
      //   this.loaderService.hide();
      //   // return next.handle(request);
      //   return of(new HttpResponse({ status: 200, body: 'Interceptor stopped' }));
      
      //     }
  
  

      // const reqRefreshToken = localStorage.getItem('jwtAccessToken');
      //const serverUrl = 'https://10.1.8.136:9999/cybercrowd/web/mapexplore/action/MapExploreV1Action.do?actionType=executeMapExplore';

      //if (req.url.startsWith(serverUrl)) {
      const reqWithAuth = request.clone({ headers: GlobalConstants.headers });
      //console.log("Interceptor ---- > " , request);

      //console.log("Interceptor ---- > " , reqWithAuth);
      //this.loaderService.isLoading.next(true);

        return next.handle(request).pipe(
          catchError((error: HttpErrorResponse) => {
            // //console.log('Error 1 ---- > ' , req.url);
            // //console.log('Interceptor Error 2 ---- > ' , error);
           // this.loaderService.isLoading.next(false);
            return throwError(error);
        }),
            finalize(() => {
              const req = `${request.method} "${request.urlWithParams}"`;
              // //console.log('Interceptor Request ---- > ' , request);
              // //console.log('Interceptor Headers ---- > ' , req.headers);
             // this.loaderService.isLoading.next(false);
              this.requestsCompleted++;
      
              //console.log(this.requestsCompleted, this.totalRequests);
      
              if (this.requestsCompleted === this.totalRequests) {
               
                //console.log("finalllllllllllllll")
                this.loaderService.hide();
                this.totalRequests = 0; 
                this.requestsCompleted = 0;
                
              }
            })
          );
    //} 

}
}
