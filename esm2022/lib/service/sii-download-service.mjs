import { HttpHeaders } from '@angular/common/http';
import { Inject, Injectable, Optional } from '@angular/core';
import { SII_APP_REF } from '../sii-toolkit.service';
import { BehaviorSubject, timer } from 'rxjs';
import { concatMap, distinctUntilChanged, tap, switchMap, filter } from 'rxjs/operators';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
import * as i2 from "../sii-toolkit.service";
import * as i3 from "../components/wait/sii-wait.service";
export class SiiDownloadService {
    constructor(http, siiToolkitService, waitServ, appRef) {
        this.http = http;
        this.siiToolkitService = siiToolkitService;
        this.waitServ = waitServ;
        this.appRef = appRef;
        this.utils = {
            count: 0,
            list: [],
            fetchInProgress: 0,
            someChanges: false,
            countChange: false,
            refreshPollInProgress: false
        };
        if (!siiToolkitService.isServerless && appRef != null) {
            const headers = new HttpHeaders().set('siiHideError', 'true');
            this.servToCall = this.http.get(`${this.siiToolkitService.environment.domain}/sii_files/fetchDownloadRequest?app=${this.appRef}`, { headers });
            this._fetchData();
        }
    }
    _fetchData() {
        this.utils.fetchInProgress++;
        this.waitServ.skipNext();
        this.servToCall
            .subscribe(r => {
            this.utils.list = r;
            this.utils.count = r.length;
            this.utils.fetchInProgress--;
        });
    }
    _delete(attach) {
        clearTimeout(attach._readyForDelete);
        this.waitServ.skipNext();
        this.http.post(`${this.siiToolkitService.environment.domain}/sii_files/deleteFile/${attach.id}`, {})
            .subscribe(() => {
            this.utils.list = this.utils.list.filter(i => i.id != attach.id);
            this.utils.count = this.utils.list.length;
            attach._readyForDelete = null;
        });
    }
    _markReadyForDelete(attach) {
        attach._readyForDelete = setTimeout(() => { attach._readyForDelete = null; }, 5000);
    }
    _clearReadyForTimeout(attach) {
        clearTimeout(attach._readyForDelete);
        attach._readyForDelete = null;
    }
    _download(id) {
        this.http.post(`${this.siiToolkitService.environment.domain}/sii_files/downloadFile/${id}`, {}, { responseType: 'blob', observe: 'response' })
            .subscribe((response) => {
            const blob = new Blob([response.body], { type: response.body.type });
            const a = document.createElement("a");
            document.body.appendChild(a);
            a.style.display = "none";
            const url = window.URL.createObjectURL(blob);
            a.href = url;
            a.download = response.headers.get('File-Name');
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        });
    }
    refresh() {
        setTimeout(() => {
            if (!this.utils.refreshPollInProgress) {
                this.utils.refreshPollInProgress = true;
                //aggiorno finchè tutti i record non osno completati
                const poll = new BehaviorSubject('');
                const subsc = poll.pipe(switchMap(_ => timer(0, 1000 * 10).pipe(filter(i => this.utils.fetchInProgress == 0), tap(i => this.utils.fetchInProgress++), tap(i => this.waitServ.skipNext()), concatMap(_ => this.servToCall), tap(i => this.utils.fetchInProgress--), distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b))))).subscribe(r => {
                    this.utils.list = r;
                    if (this.utils.count != r.length) {
                        this.utils.countChange = true;
                        setTimeout(() => {
                            this.utils.countChange = false;
                        }, 3000);
                    }
                    this.utils.count = r.length;
                    if (!r.find(i => i.status == 10)) {
                        poll.complete();
                        subsc.unsubscribe();
                        this.utils.refreshPollInProgress = false;
                        this.utils.someChanges = true;
                    }
                    setTimeout(() => {
                        this.utils.someChanges = false;
                    }, 2000);
                });
            }
        }, 500);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: SiiDownloadService, deps: [{ token: i1.HttpClient }, { token: i2.SiiToolkitService }, { token: i3.SiiWaitService }, { token: SII_APP_REF, optional: true }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: SiiDownloadService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: SiiDownloadService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: () => [{ type: i1.HttpClient }, { type: i2.SiiToolkitService }, { type: i3.SiiWaitService }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [SII_APP_REF]
                }] }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2lpLWRvd25sb2FkLXNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9zaWktdG9vbGtpdC9zcmMvbGliL3NlcnZpY2Uvc2lpLWRvd25sb2FkLXNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFjLFdBQVcsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBQy9ELE9BQU8sRUFBRSxNQUFNLEVBQUUsVUFBVSxFQUFhLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUV4RSxPQUFPLEVBQUUsV0FBVyxFQUFxQixNQUFNLHdCQUF3QixDQUFDO0FBRXhFLE9BQU8sRUFBRSxlQUFlLEVBQWUsS0FBSyxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQzNELE9BQU8sRUFBRSxTQUFTLEVBQUcsb0JBQW9CLEVBQUcsR0FBRyxFQUFFLFNBQVMsRUFBRSxNQUFNLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQzs7Ozs7QUFLM0YsTUFBTSxPQUFPLGtCQUFrQjtJQWE3QixZQUFvQixJQUFnQixFQUFRLGlCQUFvQyxFQUFXLFFBQXdCLEVBQ3hFLE1BQWM7UUFEckMsU0FBSSxHQUFKLElBQUksQ0FBWTtRQUFRLHNCQUFpQixHQUFqQixpQkFBaUIsQ0FBbUI7UUFBVyxhQUFRLEdBQVIsUUFBUSxDQUFnQjtRQUN4RSxXQUFNLEdBQU4sTUFBTSxDQUFRO1FBVnpELFVBQUssR0FBQztZQUNKLEtBQUssRUFBQyxDQUFDO1lBQ1AsSUFBSSxFQUFDLEVBQTBCO1lBQy9CLGVBQWUsRUFBQyxDQUFDO1lBQ2pCLFdBQVcsRUFBQyxLQUFLO1lBQ2pCLFdBQVcsRUFBQyxLQUFLO1lBQ2pCLHFCQUFxQixFQUFDLEtBQUs7U0FDNUIsQ0FBQTtRQU1DLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxZQUFZLElBQUksTUFBTSxJQUFFLElBQUksRUFBQyxDQUFDO1lBQ25ELE1BQU0sT0FBTyxHQUFHLElBQUksV0FBVyxFQUFFLENB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QztvQkFDOUIsQ0FBQztvQkFDRCxVQUFVLENBQUMsR0FBRyxFQUFFO3dCQUNkLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxHQUFDLEtBQUssQ0FBQztvQkFDL0IsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO2dCQUNWLENBQUMsQ0FBQyxDQUFDO1lBR0osQ0FBQztRQUNILENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQztJQUVWLENBQUM7K0dBaklVLGtCQUFrQiwyR0FjUCxXQUFXO21IQWR0QixrQkFBa0IsY0FGakIsTUFBTTs7NEZBRVAsa0JBQWtCO2tCQUg5QixVQUFVO21CQUFDO29CQUNWLFVBQVUsRUFBRSxNQUFNO2lCQUNuQjs7MEJBZUksUUFBUTs7MEJBQUksTUFBTTsyQkFBQyxXQUFXIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSHR0cENsaWVudCwgSHR0cEhlYWRlcnMgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XHJcbmltcG9ydCB7IEluamVjdCwgSW5qZWN0YWJsZSwgT25EZXN0cm95LCBPcHRpb25hbCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnOyBcclxuaW1wb3J0IHsgU2lpV2FpdFNlcnZpY2UgfSBmcm9tICcuLi9jb21wb25lbnRzL3dhaXQvc2lpLXdhaXQuc2VydmljZSc7XHJcbmltcG9ydCB7IFNJSV9BUFBfUkVGLCBTaWlUb29sa2l0U2VydmljZSB9IGZyb20gJy4uL3NpaS10b29sa2l0LnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBTaWlEb3dubG9hZEl0ZW1EVE8gfSBmcm9tICcuLi9kdG8vaS1zaWktZG93bmxvYWQuZHRvJztcclxuaW1wb3J0IHsgQmVoYXZpb3JTdWJqZWN0LCBPYnNlcnZhYmxlLCAgdGltZXIgfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHsgY29uY2F0TWFwLCAgZGlzdGluY3RVbnRpbENoYW5nZWQsICB0YXAsIHN3aXRjaE1hcCwgZmlsdGVyIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xyXG5cclxuQEluamVjdGFibGUoe1xyXG4gIHByb3ZpZGVkSW46ICdyb290J1xyXG59KVxyXG5leHBvcnQgY2xhc3MgU2lpRG93bmxvYWRTZXJ2aWNlICB7XHJcblxyXG4gIC8vIHB1bGxlZERvd25sb2FkRmlsZXMkOiBPYnNlcnZhYmxlPFNpaURvd25sb2FkSXRlbURUT1tdPjtcclxuICBzZXJ2VG9DYWxsOk9ic2VydmFibGU8U2lpRG93bmxvYWRJdGVtRFRPW10+O1xyXG4gIHV0aWxzPXtcclxuICAgIGNvdW50OjAsXHJcbiAgICBsaXN0OltdIGFzIFNpaURvd25sb2FkSXRlbURUT1tdLFxyXG4gICAgZmV0Y2hJblByb2dyZXNzOjAsXHJcbiAgICBzb21lQ2hhbmdlczpmYWxzZSxcclxuICAgIGNvdW50Q2hhbmdlOmZhbHNlLFxyXG4gICAgcmVmcmVzaFBvbGxJblByb2dyZXNzOmZhbHNlXHJcbiAgfVxyXG5cclxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGh0dHA6IEh0dHBDbGllbnQscHVibGljIHNpaVRvb2xraXRTZXJ2aWNlOiBTaWlUb29sa2l0U2VydmljZSwgIHByaXZhdGUgd2FpdFNlcnY6IFNpaVdhaXRTZXJ2aWNlLFxyXG4gICAgQE9wdGlvbmFsKCkgQEluamVjdChTSUlfQVBQX1JFRikgcHJpdmF0ZSBhcHBSZWY6IHN0cmluZ1xyXG4gICApIHsgXHJcblxyXG4gICAgaWYgKCFzaWlUb29sa2l0U2VydmljZS5pc1NlcnZlcmxlc3MgJiYgYXBwUmVmIT1udWxsKXtcclxuICAgICAgY29uc3QgaGVhZGVycyA9IG5ldyBIdHRwSGVhZGVycygpLnNldCgnc2lpSGlkZUVycm9yJywgJ3RydWUnKTtcclxuICAgICAgdGhpcy5zZXJ2VG9DYWxsID10aGlzLmh0dHAuZ2V0PFNpaURvd25sb2FkSXRlbURUT1tdPihgJHt0aGlzLnNpaVRvb2xraXRTZXJ2aWNlLmVudmlyb25tZW50LmRvbWFpbn0vc2lpX2ZpbGVzL2ZldGNoRG93bmxvYWRSZXF1ZXN0P2FwcD0ke3RoaXMuYXBwUmVmfWAsIHtoZWFkZXJzfSlcclxuICAgICAgdGhpcy5fZmV0Y2hEYXRhKCk7XHJcbiAgICB9XHJcbiAgfVxyXG4gICBcclxuXHJcblxyXG5cclxuICBfZmV0Y2hEYXRhKCl7XHJcbiAgICB0aGlzLnV0aWxzLmZldGNoSW5Qcm9ncmVzcysrXHJcbiAgICB0aGlzLndhaXRTZXJ2LnNraXBOZXh0KCk7XHJcbiAgICB0aGlzLnNlcnZUb0NhbGxcclxuICAgIC5zdWJzY3JpYmUocj0+eyAgXHJcbiAgICAgIHRoaXMudXRpbHMubGlzdD1yO1xyXG4gICAgICB0aGlzLnV0aWxzLmNvdW50PXIubGVuZ3RoO1xyXG4gICAgICB0aGlzLnV0aWxzLmZldGNoSW5Qcm9ncmVzcy0tO1xyXG4gICAgIH0pO1xyXG5cclxuICB9XHJcbiAgX2RlbGV0ZShhdHRhY2g6U2lpRG93bmxvYWRJdGVtRFRPKXtcclxuICAgIGNsZWFyVGltZW91dChhdHRhY2guX3JlYWR5Rm9yRGVsZXRlKTtcclxuICAgIHRoaXMud2FpdFNlcnYuc2tpcE5leHQoKTtcclxuICAgIHRoaXMuaHR0cC5wb3N0PGFueT4oYCR7dGhpcy5zaWlUb29sa2l0U2VydmljZS5lbnZpcm9ubWVudC5kb21haW59L3NpaV9maWxlcy9kZWxldGVGaWxlLyR7YXR0YWNoLmlkfWAse30pXHJcbiAgICAuc3Vic2NyaWJlKCgpPT57XHJcbiAgICAgIHRoaXMudXRpbHMubGlzdD0gdGhpcy51dGlscy5saXN0LmZpbHRlcihpPT5pLmlkIT1hdHRhY2guaWQpO1xyXG4gICAgICB0aGlzLnV0aWxzLmNvdW50PSB0aGlzLnV0aWxzLmxpc3QubGVuZ3RoO1xyXG4gICAgICBhdHRhY2guX3JlYWR5Rm9yRGVsZXRlPW51bGw7XHJcbiAgICAgIFxyXG4gICAgfSlcclxuICB9XHJcbiAgXHJcbiAgX21hcmtSZWFkeUZvckRlbGV0ZShhdHRhY2g6U2lpRG93bmxvYWRJdGVtRFRPKXtcclxuICAgIGF0dGFjaC5fcmVhZHlGb3JEZWxldGU9IHNldFRpbWVvdXQoKCkgPT4ge2F0dGFjaC5fcmVhZHlGb3JEZWxldGU9bnVsbDt9LCA1MDAwKTtcclxuICB9XHJcbiAgX2NsZWFyUmVhZHlGb3JUaW1lb3V0KGF0dGFjaCl7XHJcbiAgICBjbGVhclRpbWVvdXQoYXR0YWNoLl9yZWFkeUZvckRlbGV0ZSk7XHJcbiAgICBhdHRhY2guX3JlYWR5Rm9yRGVsZXRlPW51bGw7XHJcbiAgfVxyXG5cclxuXHJcbiAgX2Rvd25sb2FkKGlkKXtcclxuICAgIHRoaXMuaHR0cC5wb3N0PGFueT4oYCR7dGhpcy5zaWlUb29sa2l0U2VydmljZS5lbnZpcm9ubWVudC5kb21haW59L3NpaV9maWxlcy9kb3dubG9hZEZpbGUvJHtpZH1gLFxyXG4gICAgICAgeyB9LFxyXG4gICAgICAgeyByZXNwb25zZVR5cGU6ICdibG9iJyBhcyAnanNvbicsIG9ic2VydmU6ICdyZXNwb25zZScgfSlcclxuICAgICAgIC5zdWJzY3JpYmUoKHJlc3BvbnNlKSA9PiB7XHJcbiAgICAgICAgY29uc3QgYmxvYiA9IG5ldyBCbG9iKFtyZXNwb25zZS5ib2R5XSwgeyB0eXBlOiByZXNwb25zZS5ib2R5LnR5cGUgfSk7XHJcbiAgICAgICAgICBjb25zdCBhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImFcIik7XHJcbiAgICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGEpO1xyXG4gICAgICAgICAgYS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XHJcbiAgICAgICAgICBjb25zdCB1cmwgPSB3aW5kb3cuVVJMLmNyZWF0ZU9iamVjdFVSTChibG9iKTtcclxuICAgICAgICAgIGEuaHJlZiA9IHVybDtcclxuICAgICAgICAgIGEuZG93bmxvYWQgPXJlc3BvbnNlLmhlYWRlcnMuZ2V0KCdGaWxlLU5hbWUnKSE7XHJcbiAgICAgICAgICBhLmNsaWNrKCk7XHJcbiAgICAgICAgICB3aW5kb3cuVVJMLnJldm9rZU9iamVjdFVSTCh1cmwpO1xyXG5cclxuICAgICAgICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQoYSk7XHJcbiAgICAgICB9KVxyXG4gICAgICAgIDtcclxuICB9XHJcblxyXG5cclxuICByZWZyZXNoKCl7XHJcblxyXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XHJcblxyXG4gICAgICBpZighdGhpcy51dGlscy5yZWZyZXNoUG9sbEluUHJvZ3Jlc3Mpe1xyXG4gICAgICAgIHRoaXMudXRpbHMucmVmcmVzaFBvbGxJblByb2dyZXNzPXRydWU7XHJcbiAgICAgICAgLy9hZ2dpb3JubyBmaW5jaMOoIHR1dHRpIGkgcmVjb3JkIG5vbiBvc25vIGNvbXBsZXRhdGlcclxuICAgICAgY29uc3QgcG9sbCA9IG5ldyBCZWhhdmlvclN1YmplY3QoJycpO1xyXG4gICAgICAgY29uc3Qgc3Vic2M9IHBvbGwucGlwZShcclxuICAgICAgICAgIHN3aXRjaE1hcChfID0+ICB0aW1lcigwLCAxMDAwICogMTApLnBpcGUoXHJcbiAgICAgICAgICAgIGZpbHRlcihpPT50aGlzLnV0aWxzLmZldGNoSW5Qcm9ncmVzcz09MCksXHJcbiAgICAgICAgICAgIHRhcChpPT50aGlzLnV0aWxzLmZldGNoSW5Qcm9ncmVzcysrKSAsXHJcbiAgICAgICAgICAgIHRhcChpPT50aGlzLndhaXRTZXJ2LnNraXBOZXh0KCkpLFxyXG4gICAgICAgICAgICBjb25jYXRNYXAoXyA9PiB0aGlzLnNlcnZUb0NhbGwpLFxyXG4gICAgICAgICAgICB0YXAoaT0+dGhpcy51dGlscy5mZXRjaEluUHJvZ3Jlc3MtLSkgLFxyXG4gICAgICAgICAgICBkaXN0aW5jdFVudGlsQ2hhbmdlZCgoYSwgYikgPT4gSlNPTi5zdHJpbmdpZnkoYSkgPT09IEpTT04uc3RyaW5naWZ5KGIpKVxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICApXHJcbiAgICAgICAgIClcclxuICAgICAgICkuc3Vic2NyaWJlKHI9PnsgXHJcbiAgICAgICBcclxuICAgICAgICB0aGlzLnV0aWxzLmxpc3Q9cjtcclxuICAgIFxyXG4gICAgICAgIGlmKCB0aGlzLnV0aWxzLmNvdW50IT1yLmxlbmd0aCl7XHJcbiAgICAgICAgICB0aGlzLnV0aWxzLmNvdW50Q2hhbmdlPXRydWU7IFxyXG4gICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMudXRpbHMuY291bnRDaGFuZ2U9ZmFsc2U7XHJcbiAgICAgICAgICB9LCAzMDAwKTtcclxuICAgICAgICB9XHJcbiAgXHJcbiAgICAgICAgdGhpcy51dGlscy5jb3VudD1yLmxlbmd0aDtcclxuICBcclxuICBcclxuICBcclxuICAgICAgICBpZighci5maW5kKGk9Pmkuc3RhdHVzPT0xMCkpe1xyXG4gICAgICAgICAgcG9sbC5jb21wbGV0ZSgpO1xyXG4gICAgICAgICAgc3Vic2MudW5zdWJzY3JpYmUoKTtcclxuICAgICAgICAgIHRoaXMudXRpbHMucmVmcmVzaFBvbGxJblByb2dyZXNzPWZhbHNlO1xyXG4gICAgICAgICAgdGhpcy51dGlscy5zb21lQ2hhbmdlcz10cnVlOyBcclxuICAgICAgICB9XHJcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICB0aGlzLnV0aWxzLnNvbWVDaGFuZ2VzPWZhbHNlO1xyXG4gICAgICAgIH0sIDIwMDApO1xyXG4gICAgICAgfSk7XHJcbiAgICAgICAgXHJcblxyXG4gICAgICB9XHJcbiAgICB9LCA1MDApO1xyXG4gXHJcbiAgfVxyXG5cclxuXHJcbiAgXHJcblxyXG5cclxuXHJcbn1cclxuIl19