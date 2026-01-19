import { Injectable } from '@angular/core';
import { DelegationDialogComponent } from './delegation-dialog/delegation-dialog.component';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
import * as i2 from "../../../sii-toolkit.service";
import * as i3 from "@angular/material/dialog";
export class DelegationService {
    constructor(http, siiToolkitService, dialog) {
        this.http = http;
        this.siiToolkitService = siiToolkitService;
        this.dialog = dialog;
    }
    logout() {
        window.open(this.siiToolkitService.environment.domain + '/delegate/logout', '_self');
        // this.http.get(this.siiToolkitService.environment.domain+'/delegate/logout').subscribe(()=>{
        //   window.location.reload();
        // })
    }
    openDelegation() {
        this.dialog.open(DelegationDialogComponent, {})
            .afterClosed().subscribe((result) => {
            if (!!result) {
                window.open(this.siiToolkitService.environment.domain + '/delegate?userid=' + result.username, '_self');
            }
        });
        ;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: DelegationService, deps: [{ token: i1.HttpClient }, { token: i2.SiiToolkitService }, { token: i3.MatDialog }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: DelegationService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: DelegationService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: () => [{ type: i1.HttpClient }, { type: i2.SiiToolkitService }, { type: i3.MatDialog }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVsZWdhdGlvbi5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvc2lpLXRvb2xraXQvc3JjL2xpYi9jb21wb25lbnRzL2RzaWktY29tcG9uZW50cy9kZWxlZ2F0aW9uL2RlbGVnYXRpb24uc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBTTNDLE9BQU8sRUFBRSx5QkFBeUIsRUFBRSxNQUFNLGlEQUFpRCxDQUFDOzs7OztBQUs1RixNQUFNLE9BQU8saUJBQWlCO0lBRTVCLFlBQW9CLElBQWdCLEVBQVUsaUJBQW1DLEVBQVEsTUFBaUI7UUFBdEYsU0FBSSxHQUFKLElBQUksQ0FBWTtRQUFVLHNCQUFpQixHQUFqQixpQkFBaUIsQ0FBa0I7UUFBUSxXQUFNLEdBQU4sTUFBTSxDQUFXO0lBQUksQ0FBQztJQUcvRyxNQUFNO1FBRUosTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsV0FBVyxDQUFDLE1BQU0sR0FBQyxrQkFBa0IsRUFBRSxPQUFPLENBQUMsQ0FBQTtRQUNsRiw4RkFBOEY7UUFDOUYsOEJBQThCO1FBQzlCLEtBQUs7SUFDUCxDQUFDO0lBRUQsY0FBYztRQUNaLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLHlCQUF5QixFQUN4QyxFQUNDLENBQUM7YUFDRCxXQUFXLEVBQUUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxNQUEwQixFQUFFLEVBQUU7WUFFeEQsSUFBRyxDQUFDLENBQUMsTUFBTSxFQUFDLENBQUM7Z0JBQ2IsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsV0FBVyxDQUFDLE1BQU0sR0FBQyxtQkFBbUIsR0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxDQUFBO1lBQ25HLENBQUM7UUFFSCxDQUFDLENBQUMsQ0FBQztRQUFBLENBQUM7SUFDTixDQUFDOytHQXhCVSxpQkFBaUI7bUhBQWpCLGlCQUFpQixjQUZoQixNQUFNOzs0RkFFUCxpQkFBaUI7a0JBSDdCLFVBQVU7bUJBQUM7b0JBQ1YsVUFBVSxFQUFFLE1BQU07aUJBQ25CIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7IElMb29rdXBFbXBsb3llZURUTyB9IGZyb20gJy4uL2xvb2t1cC1lbXBsb3llZS9kb21haW4vbG9va3VwLWVtcGxveWVlLmR0byc7XHJcbmltcG9ydCB7IEh0dHBQYXJhbXMsIEh0dHBDbGllbnQgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XHJcbmltcG9ydCB7IFNpaVRvb2xraXRTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vLi4vc2lpLXRvb2xraXQuc2VydmljZSc7XHJcbmltcG9ydCB7IE1hdERpYWxvZyB9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2RpYWxvZyc7XHJcbmltcG9ydCB7IERlbGVnYXRpb25EaWFsb2dDb21wb25lbnQgfSBmcm9tICcuL2RlbGVnYXRpb24tZGlhbG9nL2RlbGVnYXRpb24tZGlhbG9nLmNvbXBvbmVudCc7XHJcblxyXG5ASW5qZWN0YWJsZSh7XHJcbiAgcHJvdmlkZWRJbjogJ3Jvb3QnXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBEZWxlZ2F0aW9uU2VydmljZSB7XHJcblxyXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgaHR0cDogSHR0cENsaWVudCwgcHJpdmF0ZSBzaWlUb29sa2l0U2VydmljZTpTaWlUb29sa2l0U2VydmljZSxwdWJsaWMgZGlhbG9nOiBNYXREaWFsb2cpIHsgfVxyXG5cclxuICBcclxuICBsb2dvdXQoKXtcclxuXHJcbiAgICB3aW5kb3cub3Blbih0aGlzLnNpaVRvb2xraXRTZXJ2aWNlLmVudmlyb25tZW50LmRvbWFpbisnL2RlbGVnYXRlL2xvZ291dCcsICdfc2VsZicpXHJcbiAgICAvLyB0aGlzLmh0dHAuZ2V0KHRoaXMuc2lpVG9vbGtpdFNlcnZpY2UuZW52aXJvbm1lbnQuZG9tYWluKycvZGVsZWdhdGUvbG9nb3V0Jykuc3Vic2NyaWJlKCgpPT57XHJcbiAgICAvLyAgIHdpbmRvdy5sb2NhdGlvbi5yZWxvYWQoKTtcclxuICAgIC8vIH0pXHJcbiAgfVxyXG5cclxuICBvcGVuRGVsZWdhdGlvbigpe1xyXG4gICAgdGhpcy5kaWFsb2cub3BlbihEZWxlZ2F0aW9uRGlhbG9nQ29tcG9uZW50LFxyXG4gICAgICB7XHJcbiAgICAgIH0pXHJcbiAgICAgIC5hZnRlckNsb3NlZCgpLnN1YnNjcmliZSgocmVzdWx0OiBJTG9va3VwRW1wbG95ZWVEVE8pID0+IHtcclxuXHJcbiAgICAgIGlmKCEhcmVzdWx0KXtcclxuICAgICAgd2luZG93Lm9wZW4odGhpcy5zaWlUb29sa2l0U2VydmljZS5lbnZpcm9ubWVudC5kb21haW4rJy9kZWxlZ2F0ZT91c2VyaWQ9JytyZXN1bHQudXNlcm5hbWUsICdfc2VsZicpXHJcbiAgICAgIH1cclxuXHJcbiAgICB9KTs7XHJcbiAgfVxyXG5cclxufVxyXG4iXX0=