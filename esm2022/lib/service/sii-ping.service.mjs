import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
import * as i2 from "../components/wait/sii-wait.service";
import * as i3 from "../sii-toolkit.service";
export class SiiPingService {
    constructor(http, siiWait, siiToolkitService) {
        this.http = http;
        this.siiWait = siiWait;
        this.siiToolkitService = siiToolkitService;
        this.headers = new HttpHeaders().set('siiHideError', 'true');
    }
    enable() {
        this.pingInterval = setInterval(() => {
            this.siiWait.skipNext();
            this.http.get(this.siiToolkitService.environment.domain + '/sii_common/version', { headers: this.headers }).subscribe(() => { });
            console.log('ping');
        }, 1000 * 60 * 10);
    }
    disable() {
        console.log('stop ping');
        clearInterval(this.pingInterval);
        delete this.pingInterval;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: SiiPingService, deps: [{ token: i1.HttpClient }, { token: i2.SiiWaitService }, { token: i3.SiiToolkitService }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: SiiPingService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: SiiPingService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: () => [{ type: i1.HttpClient }, { type: i2.SiiWaitService }, { type: i3.SiiToolkitService }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2lpLXBpbmcuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL3NpaS10b29sa2l0L3NyYy9saWIvc2VydmljZS9zaWktcGluZy5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBYyxXQUFXLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQztBQUMvRCxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDOzs7OztBQU8zQyxNQUFNLE9BQU8sY0FBYztJQUl6QixZQUFvQixJQUFnQixFQUFVLE9BQXVCLEVBQVMsaUJBQW9DO1FBQTlGLFNBQUksR0FBSixJQUFJLENBQVk7UUFBVSxZQUFPLEdBQVAsT0FBTyxDQUFnQjtRQUFTLHNCQUFpQixHQUFqQixpQkFBaUIsQ0FBbUI7UUFEbEgsWUFBTyxHQUFHLElBQUksV0FBVyxFQUFFLENBQUMsR0FBRyxDQUFDLGNBQWMsRUFBRSxNQUFNLENBQUMsQ0FBQztJQUV4RCxDQUFDO0lBRVEsTUFBTTtRQUNYLElBQUksQ0FBQyxZQUFZLEdBQUcsV0FBVyxDQUFDLEdBQUcsRUFBRTtZQUNqQyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxDQUFDO1lBQ3hCLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxXQUFXLENBQUMsTUFBTSxHQUFHLHFCQUFxQixFQUFFLEVBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxPQUFPLEVBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUUsQ0FBQztZQUNoSSxPQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3hCLENBQUMsRUFBRSxJQUFJLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO0lBQ3JCLENBQUM7SUFFTSxPQUFPO1FBQ1osT0FBTyxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUN6QixhQUFhLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBQ2pDLE9BQU8sSUFBSSxDQUFDLFlBQVksQ0FBQztJQUMzQixDQUFDOytHQW5CUSxjQUFjO21IQUFkLGNBQWMsY0FGYixNQUFNOzs0RkFFUCxjQUFjO2tCQUgxQixVQUFVO21CQUFDO29CQUNWLFVBQVUsRUFBRSxNQUFNO2lCQUNuQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEh0dHBDbGllbnQsIEh0dHBIZWFkZXJzIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5pbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IFNpaVdhaXRTZXJ2aWNlIH0gZnJvbSAnLi4vY29tcG9uZW50cy93YWl0L3NpaS13YWl0LnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBTaWlUb29sa2l0U2VydmljZSB9IGZyb20gJy4uL3NpaS10b29sa2l0LnNlcnZpY2UnO1xyXG5cclxuQEluamVjdGFibGUoe1xyXG4gIHByb3ZpZGVkSW46ICdyb290J1xyXG59KVxyXG5leHBvcnQgY2xhc3MgU2lpUGluZ1NlcnZpY2Uge1xyXG4gIHByaXZhdGUgcGluZ0ludGVydmFsO1xyXG5cclxuICBoZWFkZXJzID0gbmV3IEh0dHBIZWFkZXJzKCkuc2V0KCdzaWlIaWRlRXJyb3InLCAndHJ1ZScpO1xyXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgaHR0cDogSHR0cENsaWVudCwgcHJpdmF0ZSBzaWlXYWl0OiBTaWlXYWl0U2VydmljZSwgcHVibGljIHNpaVRvb2xraXRTZXJ2aWNlOiBTaWlUb29sa2l0U2VydmljZSkge1xyXG4gIH1cclxuXHJcbiAgICBwdWJsaWMgZW5hYmxlKCl7XHJcbiAgICAgIHRoaXMucGluZ0ludGVydmFsID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xyXG4gICAgICAgICAgdGhpcy5zaWlXYWl0LnNraXBOZXh0KCk7XHJcbiAgICAgICAgICB0aGlzLmh0dHAuZ2V0KHRoaXMuc2lpVG9vbGtpdFNlcnZpY2UuZW52aXJvbm1lbnQuZG9tYWluICsgJy9zaWlfY29tbW9uL3ZlcnNpb24nLCB7aGVhZGVyczogdGhpcy5oZWFkZXJzfSkuc3Vic2NyaWJlKCgpID0+IHsgfSApO1xyXG4gICAgICAgICAgY29uc29sZS5sb2coJ3BpbmcnKTtcclxuICAgICAgfSwgMTAwMCAqIDYwICogMTApO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBkaXNhYmxlKCl7XHJcbiAgICAgIGNvbnNvbGUubG9nKCdzdG9wIHBpbmcnKTtcclxuICAgICAgY2xlYXJJbnRlcnZhbCh0aGlzLnBpbmdJbnRlcnZhbCk7XHJcbiAgICAgIGRlbGV0ZSB0aGlzLnBpbmdJbnRlcnZhbDtcclxuICAgIH1cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcbn1cclxuXHJcbiJdfQ==