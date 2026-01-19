import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import * as i0 from "@angular/core";
import * as i1 from "../components/error-display-dialog/error-display.service";
import * as i2 from "../components/wait/sii-wait.service";
export class SiiHttpInterceptorService {
    static { this.HIDE_ERROR = 'siiHideError'; }
    constructor(errorDisplay, wait) {
        this.errorDisplay = errorDisplay;
        this.wait = wait;
        this.lastRequestTime = new Date().getTime();
        setInterval(() => {
            if (new Date().getTime() - this.lastRequestTime > 1000 * 60 * 20) {
                this.reloadPageAfterSessioExpired();
            }
        }, 1000 * 10);
    }
    intercept(request, next) {
        this.resetSessionTimeout();
        let clonedHeaders = request.headers;
        // add to all requests the timezone offset to manage the dates
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
        if (!!tz) {
            clonedHeaders = request.headers.set('timezoneId', Intl.DateTimeFormat().resolvedOptions().timeZone);
        }
        else { // IE and old browser fix
            clonedHeaders = request.headers.set('timezoneOffset', '' + (new Date()).getTimezoneOffset());
        }
        let hideERR = false;
        if (clonedHeaders.has(SiiHttpInterceptorService.HIDE_ERROR)) {
            clonedHeaders = clonedHeaders.delete(SiiHttpInterceptorService.HIDE_ERROR);
            hideERR = true;
        }
        const effectiveRequest = request.clone({
            withCredentials: true,
            headers: clonedHeaders
        });
        if (request.headers.get('siiIntergeptor') === 'N') {
            return next.handle(effectiveRequest);
        }
        let waitSkipped = false;
        if (this.wait.haveShowToSkip) {
            waitSkipped = true;
            this.wait.showSkipped();
        }
        else {
            this.wait.show();
        }
        return next.handle(effectiveRequest)
            // Intercepting HTTP responses
            .pipe(catchError((error, caught) => hideERR ? throwError(error) : this.handleError(error, caught)), finalize(() => {
            if (!waitSkipped) {
                this.wait.hide();
            }
        }));
    }
    handleError(errorResponse, caught) {
        console.error(errorResponse);
        this.wait.hide();
        let errorTitle;
        let errorContent;
        const contentType = errorResponse.headers.get('content-type');
        if (errorResponse.error) {
            if (errorResponse.error.error) { // spring boot error message structure
                errorTitle = errorResponse.error.error;
            }
            if (errorResponse.error.message) {
                errorContent = errorResponse.error.message;
            }
            else {
                errorTitle = errorResponse.name;
                errorContent = errorResponse.message;
            }
        }
        else {
            errorTitle = errorResponse.statusText;
            errorContent = errorResponse.message;
        }
        this.errorDisplay.showDialog(errorTitle, errorContent);
        // throw errorResponse;
        // if I retrow the exception unless there is another catchError in the caller,all the subscription will be terminated
        // return EMPTY;
        return throwError(errorResponse);
    }
    reloadPageAfterSessioExpired() {
        // alert('sessione scaduta');
        location.reload();
    }
    resetSessionTimeout() {
        this.lastRequestTime = new Date().getTime();
        // console.log('reset Time'  , this.lastRequestTime );
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: SiiHttpInterceptorService, deps: [{ token: i1.ErrorDisplayService }, { token: i2.SiiWaitService }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: SiiHttpInterceptorService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: SiiHttpInterceptorService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: () => [{ type: i1.ErrorDisplayService }, { type: i2.SiiWaitService }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2lpLWh0dHAtaW50ZXJjZXB0b3Iuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL3NpaS10b29sa2l0L3NyYy9saWIvc2VydmljZS9zaWktaHR0cC1pbnRlcmNlcHRvci5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFM0MsT0FBTyxFQUFxQixVQUFVLEVBQWtCLE1BQU0sTUFBTSxDQUFDO0FBQ3JFLE9BQU8sRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUF3QixNQUFNLGdCQUFnQixDQUFDOzs7O0FBTzVFLE1BQU0sT0FBTyx5QkFBeUI7YUFDN0IsZUFBVSxHQUFHLGNBQWMsQUFBakIsQ0FBa0I7SUFFbkMsWUFBb0IsWUFBaUMsRUFBVSxJQUFvQjtRQUEvRCxpQkFBWSxHQUFaLFlBQVksQ0FBcUI7UUFBVSxTQUFJLEdBQUosSUFBSSxDQUFnQjtRQURuRixvQkFBZSxHQUFHLElBQUksSUFBSSxFQUFFLENBQUMsT0FBTyxFQUFFLENBQUM7UUFFckMsV0FBVyxDQUFDLEdBQUcsRUFBRTtZQUNmLElBQUksSUFBSSxJQUFJLEVBQUUsQ0FBQyxPQUFPLEVBQUUsR0FBRyxJQUFJLENBQUMsZUFBZSxHQUFHLElBQUksR0FBRyxFQUFFLEdBQUcsRUFBRSxFQUFFLENBQUM7Z0JBQ2pFLElBQUksQ0FBQyw0QkFBNEIsRUFBRSxDQUFDO1lBQ3RDLENBQUM7UUFDSCxDQUFDLEVBQUUsSUFBSSxHQUFHLEVBQUUsQ0FBQyxDQUFDO0lBQ2hCLENBQUM7SUFFRCxTQUFTLENBQUMsT0FBeUIsRUFBRSxJQUFpQjtRQUNwRCxJQUFJLENBQUMsbUJBQW1CLEVBQUUsQ0FBQztRQUUzQixJQUFJLGFBQWEsR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDO1FBQ3BDLDhEQUE4RDtRQUM5RCxNQUFNLEVBQUUsR0FBRyxJQUFJLENBQUMsY0FBYyxF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QyxPQUFPLENBQUM7WUFDL0MsQ0FBQztpQkFBTSxDQUFDO2dCQUNKLFVBQVUsR0FBRyxhQUFhLENBQUMsSUFBSSxDQUFDO2dCQUNoQyxZQUFZLEdBQUcsYUFBYSxDQUFDLE9BQU8sQ0FBQztZQUN6QyxDQUFDO1FBQ0wsQ0FBQzthQUFNLENBQUM7WUFDSixVQUFVLEdBQUcsYUFBYSxDQUFDLFVBQVUsQ0FBQztZQUN0QyxZQUFZLEdBQUcsYUFBYSxDQUFDLE9BQU8sQ0FBQztRQUN6QyxDQUFDO1FBQ0QsSUFBSSxDQUFDLFlBQVksQ0FBQyxVQUFVLENBQUMsVUFBVSxFQUFFLFlBQVksQ0FBQyxDQUFDO1FBQ3ZELHVCQUF1QjtRQUN2QixxSEFBcUg7UUFDckgsZ0JBQWdCO1FBQ2hCLE9BQU8sVUFBVSxDQUFDLGFBQWEsQ0FBQyxDQUFDO0lBQ3JDLENBQUM7SUFHQyw0QkFBNEI7UUFDMUIsNkJBQTZCO1FBQzdCLFFBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQztJQUNwQixDQUFDO0lBRUQsbUJBQW1CO1FBQ2pCLElBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxJQUFJLEVBQUUsQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUM1QyxzREFBc0Q7SUFDeEQsQ0FBQzsrR0FoR1UseUJBQXlCO21IQUF6Qix5QkFBeUIsY0FGeEIsTUFBTTs7NEZBRVAseUJBQXlCO2tCQUhyQyxVQUFVO21CQUFDO29CQUNWLFVBQVUsRUFBRSxNQUFNO2lCQUNuQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgSHR0cEludGVyY2VwdG9yLCBIdHRwSGFuZGxlciwgSHR0cFJlcXVlc3QsIEh0dHBFcnJvclJlc3BvbnNlLCBIdHRwRXZlbnQgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XHJcbmltcG9ydCB7IE9ic2VydmFibGUsIEVNUFRZLCB0aHJvd0Vycm9yLCBTdWJqZWN0LCB0aW1lciB9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQgeyBjYXRjaEVycm9yLCBmaW5hbGl6ZSwgc3RhcnRXaXRoLCBzd2l0Y2hNYXAgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XHJcbmltcG9ydCB7IEVycm9yRGlzcGxheVNlcnZpY2UgfSBmcm9tICcuLi9jb21wb25lbnRzL2Vycm9yLWRpc3BsYXktZGlhbG9nL2Vycm9yLWRpc3BsYXkuc2VydmljZSc7XHJcbmltcG9ydCB7IFNpaVdhaXRTZXJ2aWNlIH0gZnJvbSAnLi4vY29tcG9uZW50cy93YWl0L3NpaS13YWl0LnNlcnZpY2UnO1xyXG5cclxuQEluamVjdGFibGUoe1xyXG4gIHByb3ZpZGVkSW46ICdyb290J1xyXG59KVxyXG5leHBvcnQgY2xhc3MgU2lpSHR0cEludGVyY2VwdG9yU2VydmljZSBpbXBsZW1lbnRzIEh0dHBJbnRlcmNlcHRvcntcclxuICBzdGF0aWMgSElERV9FUlJPUiA9ICdzaWlIaWRlRXJyb3InO1xyXG4gIGxhc3RSZXF1ZXN0VGltZSA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xyXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgZXJyb3JEaXNwbGF5OiBFcnJvckRpc3BsYXlTZXJ2aWNlLCBwcml2YXRlIHdhaXQ6IFNpaVdhaXRTZXJ2aWNlKSB7XHJcbiAgICBzZXRJbnRlcnZhbCgoKSA9PiB7XHJcbiAgICAgIGlmIChuZXcgRGF0ZSgpLmdldFRpbWUoKSAtIHRoaXMubGFzdFJlcXVlc3RUaW1lID4gMTAwMCAqIDYwICogMjAgKXtcclxuICAgICAgICB0aGlzLnJlbG9hZFBhZ2VBZnRlclNlc3Npb0V4cGlyZWQoKTtcclxuICAgICAgfVxyXG4gICAgfSwgMTAwMCAqIDEwKTtcclxuICB9XHJcblxyXG4gIGludGVyY2VwdChyZXF1ZXN0OiBIdHRwUmVxdWVzdDxhbnk+LCBuZXh0OiBIdHRwSGFuZGxlcik6IE9ic2VydmFibGU8YW55PiB7XHJcbiAgICB0aGlzLnJlc2V0U2Vzc2lvblRpbWVvdXQoKTtcclxuXHJcbiAgICBsZXQgY2xvbmVkSGVhZGVycyA9IHJlcXVlc3QuaGVhZGVycztcclxuICAgIC8vIGFkZCB0byBhbGwgcmVxdWVzdHMgdGhlIHRpbWV6b25lIG9mZnNldCB0byBtYW5hZ2UgdGhlIGRhdGVzXHJcbiAgICBjb25zdCB0eiA9IEludGwuRGF0ZVRpbWVGb3JtYXQoKS5yZXNvbHZlZE9wdGlvbnMoKS50aW1lWm9uZTtcclxuICAgIGlmICghIXR6KXtcclxuICAgICAgY2xvbmVkSGVhZGVycyA9IHJlcXVlc3QuaGVhZGVycy5zZXQoJ3RpbWV6b25lSWQnLCBJbnRsLkRhdGVUaW1lRm9ybWF0KCkucmVzb2x2ZWRPcHRpb25zKCkudGltZVpvbmUpO1xyXG4gIH1lbHNley8vIElFIGFuZCBvbGQgYnJvd3NlciBmaXhcclxuICAgIGNsb25lZEhlYWRlcnMgPSByZXF1ZXN0LmhlYWRlcnMuc2V0KCd0aW1lem9uZU9mZnNldCcgLCAnJyArIChuZXcgRGF0ZSgpKS5nZXRUaW1lem9uZU9mZnNldCgpKTtcclxuICB9XHJcblxyXG4gICAgbGV0IGhpZGVFUlIgPSBmYWxzZTtcclxuICAgIGlmIChjbG9uZWRIZWFkZXJzLmhhcyhTaWlIdHRwSW50ZXJjZXB0b3JTZXJ2aWNlLkhJREVfRVJST1IpKXtcclxuICAgICAgY2xvbmVkSGVhZGVycyA9IGNsb25lZEhlYWRlcnMuZGVsZXRlKFNpaUh0dHBJbnRlcmNlcHRvclNlcnZpY2UuSElERV9FUlJPUik7XHJcbiAgICAgIGhpZGVFUlIgPSB0cnVlO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBjb25zdCBlZmZlY3RpdmVSZXF1ZXN0ID0gcmVxdWVzdC5jbG9uZSh7XHJcbiAgICAgIHdpdGhDcmVkZW50aWFsczogdHJ1ZSxcclxuICAgICAgaGVhZGVyczogY2xvbmVkSGVhZGVyc1xyXG4gIH0pO1xyXG5cclxuXHJcblxyXG4gICAgaWYgKHJlcXVlc3QuaGVhZGVycy5nZXQoJ3NpaUludGVyZ2VwdG9yJykgPT09ICdOJykge1xyXG4gICAgICByZXR1cm4gbmV4dC5oYW5kbGUoZWZmZWN0aXZlUmVxdWVzdCk7XHJcbiAgfVxyXG4gICAgbGV0IHdhaXRTa2lwcGVkID0gZmFsc2U7XHJcbiAgICBpZiAodGhpcy53YWl0LmhhdmVTaG93VG9Ta2lwKXtcclxuICAgIHdhaXRTa2lwcGVkID0gdHJ1ZTtcclxuICAgIHRoaXMud2FpdC5zaG93U2tpcHBlZCgpO1xyXG4gIH1lbHNle1xyXG4gICAgdGhpcy53YWl0LnNob3coKTtcclxuICB9XHJcblxyXG4gICAgcmV0dXJuIG5leHQuaGFuZGxlKGVmZmVjdGl2ZVJlcXVlc3QpXHJcbiAgICAgIC8vIEludGVyY2VwdGluZyBIVFRQIHJlc3BvbnNlc1xyXG4gICAgICAucGlwZShcclxuICAgICAgICAgIGNhdGNoRXJyb3IoKGVycm9yOiBIdHRwRXJyb3JSZXNwb25zZSwgY2F1Z2h0KSA9PiBoaWRlRVJSID8gdGhyb3dFcnJvcihlcnJvcikgOiB0aGlzLmhhbmRsZUVycm9yKGVycm9yLCBjYXVnaHQpKSxcclxuICAgICAgICAgIGZpbmFsaXplKCgpID0+IHtcclxuICAgICAgICAgICAgaWYgKCF3YWl0U2tpcHBlZCl7XHJcbiAgICAgICAgICAgICAgdGhpcy53YWl0LmhpZGUoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgIH0pLFxyXG4gICAgICApO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBoYW5kbGVFcnJvcihlcnJvclJlc3BvbnNlOiBIdHRwRXJyb3JSZXNwb25zZSwgY2F1Z2h0OiBPYnNlcnZhYmxlPEh0dHBFdmVudDxhbnk+Pik6IE9ic2VydmFibGU8YW55PiB7XHJcbiAgICBjb25zb2xlLmVycm9yKGVycm9yUmVzcG9uc2UpO1xyXG4gICAgdGhpcy53YWl0LmhpZGUoKTtcclxuICAgIGxldCBlcnJvclRpdGxlOiBzdHJpbmc7XHJcbiAgICBsZXQgZXJyb3JDb250ZW50OiBzdHJpbmc7XHJcbiAgICBjb25zdCBjb250ZW50VHlwZSA9IGVycm9yUmVzcG9uc2UuaGVhZGVycy5nZXQoJ2NvbnRlbnQtdHlwZScpO1xyXG4gICAgaWYgKGVycm9yUmVzcG9uc2UuZXJyb3IpIHtcclxuICAgICAgICBpZiAoZXJyb3JSZXNwb25zZS5lcnJvci5lcnJvcikgey8vIHNwcmluZyBib290IGVycm9yIG1lc3NhZ2Ugc3RydWN0dXJlXHJcbiAgICAgICAgICAgIGVycm9yVGl0bGUgPSBlcnJvclJlc3BvbnNlLmVycm9yLmVycm9yO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoZXJyb3JSZXNwb25zZS5lcnJvci5tZXNzYWdlKSB7XHJcbiAgICAgICAgICAgIGVycm9yQ29udGVudCA9IGVycm9yUmVzcG9uc2UuZXJyb3IubWVzc2FnZTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBlcnJvclRpdGxlID0gZXJyb3JSZXNwb25zZS5uYW1lO1xyXG4gICAgICAgICAgICBlcnJvckNvbnRlbnQgPSBlcnJvclJlc3BvbnNlLm1lc3NhZ2U7XHJcbiAgICAgICAgfVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBlcnJvclRpdGxlID0gZXJyb3JSZXNwb25zZS5zdGF0dXNUZXh0O1xyXG4gICAgICAgIGVycm9yQ29udGVudCA9IGVycm9yUmVzcG9uc2UubWVzc2FnZTtcclxuICAgIH1cclxuICAgIHRoaXMuZXJyb3JEaXNwbGF5LnNob3dEaWFsb2coZXJyb3JUaXRsZSwgZXJyb3JDb250ZW50KTtcclxuICAgIC8vIHRocm93IGVycm9yUmVzcG9uc2U7XHJcbiAgICAvLyBpZiBJIHJldHJvdyB0aGUgZXhjZXB0aW9uIHVubGVzcyB0aGVyZSBpcyBhbm90aGVyIGNhdGNoRXJyb3IgaW4gdGhlIGNhbGxlcixhbGwgdGhlIHN1YnNjcmlwdGlvbiB3aWxsIGJlIHRlcm1pbmF0ZWRcclxuICAgIC8vIHJldHVybiBFTVBUWTtcclxuICAgIHJldHVybiB0aHJvd0Vycm9yKGVycm9yUmVzcG9uc2UpO1xyXG59XHJcblxyXG5cclxuICByZWxvYWRQYWdlQWZ0ZXJTZXNzaW9FeHBpcmVkKCl7XHJcbiAgICAvLyBhbGVydCgnc2Vzc2lvbmUgc2NhZHV0YScpO1xyXG4gICAgbG9jYXRpb24ucmVsb2FkKCk7XHJcbiAgfVxyXG5cclxuICByZXNldFNlc3Npb25UaW1lb3V0KCl7XHJcbiAgICB0aGlzLmxhc3RSZXF1ZXN0VGltZSA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xyXG4gICAgLy8gY29uc29sZS5sb2coJ3Jlc2V0IFRpbWUnICAsIHRoaXMubGFzdFJlcXVlc3RUaW1lICk7XHJcbiAgfVxyXG5cclxufVxyXG4iXX0=