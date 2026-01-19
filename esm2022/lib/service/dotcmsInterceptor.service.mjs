import { Inject, Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { SII_ENVIRONMENT } from '../sii-toolkit.service';
import * as i0 from "@angular/core";
import * as i1 from "@angular/router";
// import { ENGAGE_CONFIG } from './engage-configurations-params.service';
export class DotCmsInterceptorService {
    get engageBEDomain() {
        return this.environment.domain.replace('/api', '/sii_content/api');
    }
    constructor(router, environment) {
        this.router = router;
        this.environment = environment;
    }
    intercept(request, next) {
        if (!!this.engageBEDomain && request.url.startsWith(this.engageBEDomain)) {
            console.log('cms intercept for request ' + request.url);
            let clonedHeaders = request.headers;
            clonedHeaders = request.headers.set('DOTAUTH', window.btoa('admin@dotcms.com:admin'));
            const effectiveRequest = request.clone({
                withCredentials: false,
                headers: clonedHeaders
            });
            return next.handle(effectiveRequest).pipe(catchError((error, caught) => this.handleError(error, caught)), finalize(() => {
            }));
        }
        else {
            return next.handle(request);
        }
    }
    handleError(errorResponse, caught) {
        this.router.navigate(['/404']);
        return throwError(errorResponse);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: DotCmsInterceptorService, deps: [{ token: i1.Router }, { token: SII_ENVIRONMENT }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: DotCmsInterceptorService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: DotCmsInterceptorService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: () => [{ type: i1.Router }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [SII_ENVIRONMENT]
                }] }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZG90Y21zSW50ZXJjZXB0b3Iuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL3NpaS10b29sa2l0L3NyYy9saWIvc2VydmljZS9kb3RjbXNJbnRlcmNlcHRvci5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxNQUFNLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRW5ELE9BQU8sRUFBcUIsVUFBVSxFQUFtQixNQUFNLE1BQU0sQ0FBQztBQUN0RSxPQUFPLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBS3RELE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSx3QkFBd0IsQ0FBQzs7O0FBRXpELDBFQUEwRTtBQUsxRSxNQUFNLE9BQU8sd0JBQXdCO0lBRW5DLElBQUksY0FBYztRQUNoQixPQUFPLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsa0JBQWtCLENBQUMsQ0FBQztJQUNyRSxDQUFDO0lBQ0QsWUFBcUIsTUFBYyxFQUFvQyxXQUEyQjtRQUE3RSxXQUFNLEdBQU4sTUFBTSxDQUFRO1FBQW9DLGdCQUFXLEdBQVgsV0FBVyxDQUFnQjtJQUVqRyxDQUFDO0lBRUYsU0FBUyxDQUFDLE9BQXlCLEVBQUUsSUFBaUI7UUFDcEQsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLGNBQWMsSUFBSSxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLEVBQUMsQ0FBQztZQUN4RSxPQUFPLENBQUMsR0FBRyxDQUFDLDRCQUE0QixHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUN4RCxJQUFJLGFBQWEsR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDO1lBQ3BDLGFBQWEsR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxTQUFTLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDLENBQUM7WUFDdEYsTUFBTSxnQkFBZ0IsR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDO2dCQUNuQyxlQUFlLEVBQUUsS0FBSztnQkFDdEIsT0FBTyxFQUFFLGFBQWE7YUFDekIsQ0FBQyxDQUFDO1lBQ0gsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLGdCQUFnQixDQUFDLENBQUMsSUFBSSxDQUN2QyxVQUFVLENBQUMsQ0FBQyxLQUF3QixFQUFFLE1BQU0sRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUMsRUFDakYsUUFBUSxDQUFDLEdBQUcsRUFBRTtZQUNiLENBQUMsQ0FBQyxDQUNOLENBQUM7UUFDRixDQUFDO2FBQUksQ0FBQztZQUNKLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUM5QixDQUFDO0lBRUgsQ0FBQztJQUVPLFdBQVcsQ0FBQyxhQUFnQyxFQUFFLE1BQWtDO1FBQ3RGLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBRTtRQUNoQyxPQUFPLFVBQVUsQ0FBQyxhQUFhLENBQUMsQ0FBQztJQUNyQyxDQUFDOytHQWhDWSx3QkFBd0Isd0NBS1csZUFBZTttSEFMbEQsd0JBQXdCLGNBRnZCLE1BQU07OzRGQUVQLHdCQUF3QjtrQkFIcEMsVUFBVTttQkFBQztvQkFDVixVQUFVLEVBQUUsTUFBTTtpQkFDbkI7OzBCQU13QyxNQUFNOzJCQUFDLGVBQWUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3QsIEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgSHR0cEludGVyY2VwdG9yLCBIdHRwSGFuZGxlciwgSHR0cFJlcXVlc3QsIEh0dHBFcnJvclJlc3BvbnNlLCBIdHRwRXZlbnQgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XHJcbmltcG9ydCB7IE9ic2VydmFibGUsIEVNUFRZLCB0aHJvd0Vycm9yLCBCZWhhdmlvclN1YmplY3QgfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHsgY2F0Y2hFcnJvciwgZmluYWxpemUgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XHJcbmltcG9ydCB7IFJvdXRlciB9IGZyb20gJ0Bhbmd1bGFyL3JvdXRlcic7XHJcbmltcG9ydCB7IFNpaUVuZ2FnZVNlcnZpY2UgfSBmcm9tICcuL3NpaS1lbmdhZ2Uuc2VydmljZSc7XHJcbi8vIGltcG9ydCB7IEVOR0FHRV9DT05GSUcgfSBmcm9tICcuLi9zaWktdG9vbGtpdC5tb2R1bGUnO1xyXG5pbXBvcnQgeyBFbmdhZ2VDb25maWdEVE8gfSBmcm9tICcuLi9kdG8vZW5nYWdlLWNvbmZpZy5kdG8nO1xyXG5pbXBvcnQgeyBTSUlfRU5WSVJPTk1FTlQgfSBmcm9tICcuLi9zaWktdG9vbGtpdC5zZXJ2aWNlJztcclxuaW1wb3J0IHsgU2lpRW52aXJvbm1lbnQgfSBmcm9tICcuLi9kdG8vc2lpLWVudmlyb25tZW50LmR0byc7XHJcbi8vIGltcG9ydCB7IEVOR0FHRV9DT05GSUcgfSBmcm9tICcuL2VuZ2FnZS1jb25maWd1cmF0aW9ucy1wYXJhbXMuc2VydmljZSc7XHJcblxyXG5ASW5qZWN0YWJsZSh7XHJcbiAgcHJvdmlkZWRJbjogJ3Jvb3QnXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBEb3RDbXNJbnRlcmNlcHRvclNlcnZpY2UgaW1wbGVtZW50cyBIdHRwSW50ZXJjZXB0b3J7XHJcblxyXG4gIGdldCBlbmdhZ2VCRURvbWFpbigpe1xyXG4gICAgcmV0dXJuIHRoaXMuZW52aXJvbm1lbnQuZG9tYWluLnJlcGxhY2UoJy9hcGknLCAnL3NpaV9jb250ZW50L2FwaScpO1xyXG4gIH1cclxuICBjb25zdHJ1Y3RvciggcHJpdmF0ZSByb3V0ZXI6IFJvdXRlciwgIEBJbmplY3QoU0lJX0VOVklST05NRU5UKSBwcml2YXRlIGVudmlyb25tZW50OiBTaWlFbnZpcm9ubWVudCkge1xyXG5cclxuICAgfVxyXG5cclxuICBpbnRlcmNlcHQocmVxdWVzdDogSHR0cFJlcXVlc3Q8YW55PiwgbmV4dDogSHR0cEhhbmRsZXIpOiBPYnNlcnZhYmxlPGFueT4ge1xyXG4gICAgaWYgKCEhdGhpcy5lbmdhZ2VCRURvbWFpbiAmJiByZXF1ZXN0LnVybC5zdGFydHNXaXRoKHRoaXMuZW5nYWdlQkVEb21haW4pKXtcclxuICAgICAgY29uc29sZS5sb2coJ2NtcyBpbnRlcmNlcHQgZm9yIHJlcXVlc3QgJyArIHJlcXVlc3QudXJsKTtcclxuICAgICAgbGV0IGNsb25lZEhlYWRlcnMgPSByZXF1ZXN0LmhlYWRlcnM7XHJcbiAgICAgIGNsb25lZEhlYWRlcnMgPSByZXF1ZXN0LmhlYWRlcnMuc2V0KCdET1RBVVRIJywgd2luZG93LmJ0b2EoJ2FkbWluQGRvdGNtcy5jb206YWRtaW4nKSk7XHJcbiAgICAgIGNvbnN0IGVmZmVjdGl2ZVJlcXVlc3QgPSByZXF1ZXN0LmNsb25lKHtcclxuICAgICAgICAgIHdpdGhDcmVkZW50aWFsczogZmFsc2UsXHJcbiAgICAgICAgICBoZWFkZXJzOiBjbG9uZWRIZWFkZXJzXHJcbiAgICAgIH0pO1xyXG4gICAgICByZXR1cm4gbmV4dC5oYW5kbGUoZWZmZWN0aXZlUmVxdWVzdCkucGlwZShcclxuICAgICAgICBjYXRjaEVycm9yKChlcnJvcjogSHR0cEVycm9yUmVzcG9uc2UsIGNhdWdodCkgPT4gdGhpcy5oYW5kbGVFcnJvcihlcnJvciwgY2F1Z2h0KSksXHJcbiAgICAgICAgZmluYWxpemUoKCkgPT4ge1xyXG4gICAgICAgICB9KSxcclxuICAgICk7XHJcbiAgICB9ZWxzZXtcclxuICAgICAgcmV0dXJuIG5leHQuaGFuZGxlKHJlcXVlc3QpO1xyXG4gICAgfVxyXG5cclxuICB9XHJcblxyXG4gIHByaXZhdGUgaGFuZGxlRXJyb3IoZXJyb3JSZXNwb25zZTogSHR0cEVycm9yUmVzcG9uc2UsIGNhdWdodDogT2JzZXJ2YWJsZTxIdHRwRXZlbnQ8YW55Pj4pOiBPYnNlcnZhYmxlPGFueT4ge1xyXG4gICAgdGhpcy5yb3V0ZXIubmF2aWdhdGUoWycvNDA0J10pIDtcclxuICAgIHJldHVybiB0aHJvd0Vycm9yKGVycm9yUmVzcG9uc2UpO1xyXG59XHJcblxyXG59XHJcbiJdfQ==