import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
import * as i2 from "../../../../sii-toolkit.service";
import * as i3 from "../../../wait/sii-wait.service";
import * as i4 from "@angular/router";
import * as i5 from "../../../../service/sii-engage.service";
export class SdacPreviewService {
    get isEngage() {
        return this.es.isEngage;
    }
    constructor(http, siiToolkitService, waitServ, router, es) {
        this.http = http;
        this.siiToolkitService = siiToolkitService;
        this.waitServ = waitServ;
        this.router = router;
        this.es = es;
        this.ticketPreview = new BehaviorSubject([]);
        this.notificationPreview = new BehaviorSubject([]);
        this.ticketCount = 0;
        this.notificationCount = 0;
        this.refreshInProgress = new BehaviorSubject(false);
        if (!siiToolkitService.isServerless) {
            this.loadSdacPreview();
        }
    }
    loadSdacPreview() {
        this.refreshInProgress.next(true);
        this.waitServ.skipNext();
        const headers = new HttpHeaders().set('siiHideError', 'true');
        this.http.get(`${this.siiToolkitService.environment.domain}/sdac_lookup/preview`, { headers })
            .subscribe(cmp => {
            this.ticketPreview.next(cmp.items);
            this.notificationPreview.next(cmp.notification);
            this.ticketCount = (cmp.items || []).reduce((acc, ticketGroup) => (acc + ticketGroup.count), 0);
            this.notificationCount = (cmp.notification || []).reduce((acc, ticketGroup) => (acc + ticketGroup.count), 0);
            this.refreshInProgress.next(false);
        }, () => {
            this.refreshInProgress.next(false);
        });
    }
    openSdacTiketsByCode(ssRef) {
        if (this.es.engageAvailable) {
            if (this.isEngage) {
                this.router.navigate(['sdac'], { queryParams: !!ssRef ? { sdacSS: ssRef } : {} });
            }
            else {
                const ref = encodeURIComponent(ssRef);
                window.open(this.es.engageDomain + (!!ssRef ? `sdac?sdacSS=${ref}` : 'sdac'), '_blank');
            }
        }
        else {
            alert('engage unavailable');
        }
    }
    openSdacType(notifica) {
        const type = !!notifica ? 'TICKET_TYPE_NOTIFICA' : 'TICKET_TYPE_TICKET';
        if (this.es.engageAvailable) {
            if (this.isEngage) {
                this.router.navigate(['sdac'], { queryParams: { sdacType: type } });
            }
            else {
                window.open(this.es.engageDomain + `sdac?sdacType=${type}`, '_blank');
            }
        }
        else {
            alert('engage unavailable');
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: SdacPreviewService, deps: [{ token: i1.HttpClient }, { token: i2.SiiToolkitService }, { token: i3.SiiWaitService }, { token: i4.Router }, { token: i5.SiiEngageService }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: SdacPreviewService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: SdacPreviewService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: () => [{ type: i1.HttpClient }, { type: i2.SiiToolkitService }, { type: i3.SiiWaitService }, { type: i4.Router }, { type: i5.SiiEngageService }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2RhYy1wcmV2aWV3LnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9zaWktdG9vbGtpdC9zcmMvbGliL2NvbXBvbmVudHMvZHNpaS1jb21wb25lbnRzL3NkYWMtcHJldmlldy9zZXJ2aWNlL3NkYWMtcHJldmlldy5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0MsT0FBTyxFQUFjLFdBQVcsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBRS9ELE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSxNQUFNLENBQUM7Ozs7Ozs7QUFTdkMsTUFBTSxPQUFPLGtCQUFrQjtJQUU3QixJQUFJLFFBQVE7UUFDWCxPQUFPLElBQUksQ0FBQyxFQUFFLENBQUMsUUFBUSxDQUFDO0lBQ3pCLENBQUM7SUFRRCxZQUFvQixJQUFnQixFQUFTLGlCQUFvQyxFQUFVLFFBQXdCLEVBQVUsTUFBYyxFQUFVLEVBQW9CO1FBQXJKLFNBQUksR0FBSixJQUFJLENBQVk7UUFBUyxzQkFBaUIsR0FBakIsaUJBQWlCLENBQW1CO1FBQVUsYUFBUSxHQUFSLFFBQVEsQ0FBZ0I7UUFBVSxXQUFNLEdBQU4sTUFBTSxDQUFRO1FBQVUsT0FBRSxHQUFGLEVBQUUsQ0FBa0I7UUFOekssa0JBQWEsR0FBRyxJQUFJLGVBQWUsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUN4Qyx3QkFBbUIsR0FBRyxJQUFJLGVBQWUsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUM5QyxnQkFBVyxHQUFHLENBQUMsQ0FBQztRQUNoQixzQkFBaUIsR0FBRyxDQUFDLENBQUM7UUFDdEIsc0JBQWlCLEdBQUcsSUFBSSxlQUFlLENBQVUsS0FBSyxDQUFDLENBQUM7UUFHdEQsSUFBSSxDQUFDLGlCQUFpQixDQUFDLFlBQVksRUFBQyxDQUFDO1lBQ25DLElBQUksQ0FBQyxlQUFl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RUFBRyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFDdkUsQ0FBQztpQkFBSSxDQUFDO2dCQUNKLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxZQUFZLEdBQUcsaUJBQWlCLElBQUksRUFBRSxFQUFHLFFBQVEsQ0FBRSxDQUFDO1lBQzFFLENBQUM7UUFDSCxDQUFDO2FBQUksQ0FBQztZQUNKLEtBQUssQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO1FBQzlCLENBQUM7SUFFSCxDQUFDOytHQTVEVSxrQkFBa0I7bUhBQWxCLGtCQUFrQixjQUZqQixNQUFNOzs0RkFFUCxrQkFBa0I7a0JBSDlCLFVBQVU7bUJBQUM7b0JBQ1YsVUFBVSxFQUFFLE1BQU07aUJBQ25CIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBIdHRwQ2xpZW50LCBIdHRwSGVhZGVycyB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcclxuaW1wb3J0IHsgU2lpVG9vbGtpdFNlcnZpY2UgfSBmcm9tICcuLi8uLi8uLi8uLi9zaWktdG9vbGtpdC5zZXJ2aWNlJztcclxuaW1wb3J0IHsgQmVoYXZpb3JTdWJqZWN0IH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7IFNpaVdhaXRTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vLi4vd2FpdC9zaWktd2FpdC5zZXJ2aWNlJztcclxuaW1wb3J0IHsgU2lpU2RhY1ByZXZpZXdSZXNwb25zZSB9IGZyb20gJy4uL2R0by9zZGFjLXByZXZpZXctcmVzcG9uc2UuZHRvJztcclxuaW1wb3J0IHsgUm91dGVyIH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcclxuaW1wb3J0IHsgU2lpRW5nYWdlU2VydmljZSB9IGZyb20gJy4uLy4uLy4uLy4uL3NlcnZpY2Uvc2lpLWVuZ2FnZS5zZXJ2aWNlJztcclxuXHJcbkBJbmplY3RhYmxlKHtcclxuICBwcm92aWRlZEluOiAncm9vdCdcclxufSlcclxuZXhwb3J0IGNsYXNzIFNkYWNQcmV2aWV3U2VydmljZSB7XHJcblxyXG4gIGdldCBpc0VuZ2FnZSgpe1xyXG4gICByZXR1cm4gdGhpcy5lcy5pc0VuZ2FnZTtcclxuICB9XHJcblxyXG4gIHRpY2tldFByZXZpZXcgPSBuZXcgQmVoYXZpb3JTdWJqZWN0KFtdKTtcclxuICBub3RpZmljYXRpb25QcmV2aWV3ID0gbmV3IEJlaGF2aW9yU3ViamVjdChbXSk7XHJcbiAgdGlja2V0Q291bnQgPSAwO1xyXG4gIG5vdGlmaWNhdGlvbkNvdW50ID0gMDtcclxuICByZWZyZXNoSW5Qcm9ncmVzcyA9IG5ldyBCZWhhdmlvclN1YmplY3Q8Ym9vbGVhbj4oZmFsc2UpO1xyXG5cclxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGh0dHA6IEh0dHBDbGllbnQsIHB1YmxpYyBzaWlUb29sa2l0U2VydmljZTogU2lpVG9vbGtpdFNlcnZpY2UsIHByaXZhdGUgd2FpdFNlcnY6IFNpaVdhaXRTZXJ2aWNlLCBwcml2YXRlIHJvdXRlcjogUm91dGVyLCBwcml2YXRlIGVzOiBTaWlFbmdhZ2VTZXJ2aWNlICkge1xyXG4gICAgaWYgKCFzaWlUb29sa2l0U2VydmljZS5pc1NlcnZlcmxlc3Mpe1xyXG4gICAgICB0aGlzLmxvYWRTZGFjUHJldmlldygpO1xyXG4gICAgfVxyXG4gICB9XHJcblxyXG4gIHB1YmxpYyBsb2FkU2RhY1ByZXZpZXcoKXtcclxuXHJcbiAgICB0aGlzLnJlZnJlc2hJblByb2dyZXNzLm5leHQodHJ1ZSk7XHJcbiAgICB0aGlzLndhaXRTZXJ2LnNraXBOZXh0KCk7XHJcbiAgICBjb25zdCBoZWFkZXJzID0gbmV3IEh0dHBIZWFkZXJzKCkuc2V0KCdzaWlIaWRlRXJyb3InLCAndHJ1ZScpO1xyXG4gICAgdGhpcy5odHRwLmdldDxTaWlTZGFjUHJldmlld1Jlc3BvbnNlPihgJHt0aGlzLnNpaVRvb2xraXRTZXJ2aWNlLmVudmlyb25tZW50LmRvbWFpbn0vc2RhY19sb29rdXAvcHJldmlld2AsIHtoZWFkZXJzfSlcclxuICAgICAgLnN1YnNjcmliZShjbXAgPT4ge1xyXG4gICAgICAgIHRoaXMudGlja2V0UHJldmlldy5uZXh0KGNtcC5pdGVtcykgO1xyXG4gICAgICAgIHRoaXMubm90aWZpY2F0aW9uUHJldmlldy5uZXh0KGNtcC5ub3RpZmljYXRpb24pIDtcclxuICAgICAgICB0aGlzLnRpY2tldENvdW50ID0gKGNtcC5pdGVtc3x8W10pLnJlZHVjZSgoYWNjLCB0aWNrZXRHcm91cCkgPT4gKGFjYyArIHRpY2tldEdyb3VwLmNvdW50KSwgMCk7XHJcbiAgICAgICAgdGhpcy5ub3RpZmljYXRpb25Db3VudCA9IChjbXAubm90aWZpY2F0aW9ufHxbXSkucmVkdWNlKChhY2MsIHRpY2tldEdyb3VwKSA9PiAoYWNjICsgdGlja2V0R3JvdXAuY291bnQpLCAwKTtcclxuICAgICAgICB0aGlzLnJlZnJlc2hJblByb2dyZXNzLm5leHQoZmFsc2UpO1xyXG4gICAgICB9LCAoKSA9PiB7XHJcbiAgICAgICAgdGhpcy5yZWZyZXNoSW5Qcm9ncmVzcy5uZXh0KGZhbHNlKTtcclxuICAgICAgfSk7XHJcbiAgfVxyXG5cclxuICBvcGVuU2RhY1Rpa2V0c0J5Q29kZShzc1JlZj86IHN0cmluZyApe1xyXG4gICAgaWYodGhpcy5lcy5lbmdhZ2VBdmFpbGFibGUpe1xyXG4gICAgICBpZiAodGhpcy5pc0VuZ2FnZSl7XHJcbiAgICAgICAgdGhpcy5yb3V0ZXIubmF2aWdhdGUoWydzZGFjJ10sIHsgcXVlcnlQYXJhbXM6ICEhc3NSZWYgPyAgeyBzZGFjU1M6IHNzUmVmIH0gOiB7fSB9KTtcclxuICAgICAgfWVsc2V7XHJcbiAgICAgICAgY29uc3QgcmVmID0gZW5jb2RlVVJJQ29tcG9uZW50KHNzUmVmKTtcclxuICAgICAgICB3aW5kb3cub3Blbih0aGlzLmVzLmVuZ2FnZURvbWFpbiArICghIXNzUmVmID8gYHNkYWM/c2RhY1NTPSR7cmVmfWAgOiAnc2RhYycpLCAnX2JsYW5rJywgKTtcclxuICAgICAgfVxyXG4gICAgfWVsc2V7XHJcbiAgICAgIGFsZXJ0KCdlbmdhZ2UgdW5hdmFpbGFibGUnKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIG9wZW5TZGFjVHlwZShub3RpZmljYT86Ym9vbGVhbil7XHJcbiAgICBjb25zdCB0eXBlPSEhbm90aWZpY2EgPyAgJ1RJQ0tFVF9UWVBFX05PVElGSUNBJzonVElDS0VUX1RZUEVfVElDS0VUJztcclxuICAgIGlmKHRoaXMuZXMuZW5nYWdlQXZhaWxhYmxlKXtcclxuICAgICAgaWYgKHRoaXMuaXNFbmdhZ2Upe1xyXG4gICAgICAgIHRoaXMucm91dGVyLm5hdmlnYXRlKFsnc2RhYyddLCB7IHF1ZXJ5UGFyYW1zOiAgeyBzZGFjVHlwZTogdHlwZSB9IH0pO1xyXG4gICAgICB9ZWxzZXtcclxuICAgICAgICB3aW5kb3cub3Blbih0aGlzLmVzLmVuZ2FnZURvbWFpbiArIGBzZGFjP3NkYWNUeXBlPSR7dHlwZX1gICwgJ19ibGFuaycgKTtcclxuICAgICAgfVxyXG4gICAgfWVsc2V7XHJcbiAgICAgIGFsZXJ0KCdlbmdhZ2UgdW5hdmFpbGFibGUnKTtcclxuICAgIH1cclxuXHJcbiAgfVxyXG5cclxufVxyXG4iXX0=