import { Inject, Injectable, InjectionToken, Optional } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { skip, tap } from 'rxjs/operators';
// const moment = require('moment');
// import * as moment_ from 'moment';
// const moment = moment_;
// import 'moment/locale/it';
import moment from 'moment';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
export const SII_ENVIRONMENT = new InjectionToken('toolkit.environment');
export const SII_SESSION_WAITING = new InjectionToken('toolkit.sessionwait');
export const SII_APP_REF = new InjectionToken('toolkit.appref');
export class SiiToolkitService {
    // public viewportResize = new Subject<void>();
    get isServerless() {
        return !this.environment;
    }
    constructor(http, environment, ssw) {
        this.http = http;
        this.loggedUser = new BehaviorSubject({});
        this.environment = environment;
        if (!this.isServerless) {
            if (ssw == null) {
                this.loadMyself();
            }
            else {
                ssw.then(() => {
                    this.loadMyself();
                });
            }
        }
        else {
            console.log('DEFAULT CONFIG');
            const tmpUser = this.findMySelf();
            this.clearLocalstorageIfLanguageChange(tmpUser.locale);
            moment.locale(tmpUser.locale); //  initializr moment locale
            this.loggedUser.next(tmpUser);
        }
    }
    initializeMySelf() {
        const loading = document.createElement('img');
        loading.src = 'assets/icons/logo.png';
        loading.classList.add('siiAppLoader');
        document.body.insertAdjacentElement('beforebegin', loading);
        return () => {
            return new Promise((resolve, reject) => {
                if (this.isServerless) {
                    resolve();
                    loading.remove();
                }
                else {
                    this.loggedUser.pipe(skip(1), tap(() => { loading.remove(); }))
                        .subscribe(() => resolve(), () => resolve());
                }
            });
        };
    }
    // addEnvironment(environment: SiiEnvironment){
    //   this.environment = environment;
    // }
    // getMyself(): Observable<MyselfDTO> {
    //   return this.http.get<MyselfDTO>(this.environment.myselfURL);
    // }
    loadMyself(force = false) {
        // load the information only if is not loaded
        if (Object.keys(this.loggedUser.value).length === 0 || force) {
            const headers = new HttpHeaders().set('siiHideError', 'true');
            this.http.get(`${this.environment.domain}/sii_common/myself`, { headers })
                .subscribe((ms) => {
                // localStorage.setItem('msi', JSON.stringify(ms));
                this.clearLocalstorageIfLanguageChange(ms.locale);
                moment.locale(ms.locale); //  initializr moment locale
                this.loggedUser.next(ms);
            }, (ms) => {
                console.log('ERRORE NEL RECUPERO DELL\'UTENTE');
                const tmpUser = this.findMySelf();
                this.clearLocalstorageIfLanguageChange(tmpUser.locale);
                moment.locale(tmpUser.locale); //  initializr moment locale
                this.loggedUser.next(tmpUser);
            }
            // in caso di errore emetto comunque un valore per permettere comunque all'applicazione di partire
            );
        }
    }
    clearLocalstorageIfLanguageChange(currUserLang) {
        const l = window.localStorage.getItem('siiLang');
        if (l == null || l !== currUserLang) {
            console.log('siiLangChange');
            Object.keys(window.localStorage).forEach((lsi) => { window.localStorage.removeItem(lsi); });
        }
        window.localStorage.setItem('siiLang', currUserLang);
    }
    findMySelf() {
        // const myself = localStorage.getItem('msi');
        // if (!!myself){
        //   return JSON.parse(myself);
        // }else{
        const language = window.location.href.indexOf('/en/') === -1 ? 'it' : 'en';
        return {
            costCenterId: '',
            accessType: 'Unclassified',
            toolbarMode: 'initial',
            inputDatePattern: 'DD/MM/YYYY',
            displayDatePattern: 'DD MMM, YYYY',
            locale: language,
            username: '',
            workerId: '',
            companyId: '',
            firstName: '',
            lastName: '',
            email: '',
            costCenterDescr: '',
            costCenterResp: {
                username: '',
                firstName: '',
                lastName: '',
                workerId: '',
                id: ''
            },
            userInfo: ''
        };
        // }
    }
    getHelpPage(functionCode) {
        const headers = new HttpHeaders().set('siiHideError', 'true');
        return this.http.get(`${this.environment.domain}/sii_common/help`, { params: { functionCode }, headers });
    }
    getWorkerContactInformation(workerId, serviceUrl = `${this.environment.domain}/lookup/workerContactInformation`) {
        return this.http.get(serviceUrl, { params: { id: workerId } });
    }
    // fixWieport(){
    //   this.viewportResize.subscribe(() => {
    //     const doc = document.documentElement;
    //     doc.style.setProperty('--app-height', `${window.innerHeight}px`);
    //     // console.log('fixViewport ' + window.innerHeight);
    //   });
    //   // appHeight
    //   window.addEventListener('resize', () => {this.viewportResize.next(); } );
    //   this.viewportResize.next();
    //   }
    getMatDateConfig() {
        return {
            parse: {
                dateInput: this.loggedUser.value.inputDatePattern,
            },
            display: {
                dateInput: this.loggedUser.value.inputDatePattern,
                monthYearLabel: 'MMM YYYY',
                dateA11yLabel: 'LL',
                monthYearA11yLabel: 'MMMM YYYY',
            }
        };
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: SiiToolkitService, deps: [{ token: i1.HttpClient }, { token: SII_ENVIRONMENT, optional: true }, { token: SII_SESSION_WAITING, optional: true }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: SiiToolkitService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: SiiToolkitService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: () => [{ type: i1.HttpClient }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [SII_ENVIRONMENT]
                }] }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [SII_SESSION_WAITING]
                }] }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2lpLXRvb2xraXQuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL3NpaS10b29sa2l0L3NyYy9saWIvc2lpLXRvb2xraXQuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsTUFBTSxFQUFFLFVBQVUsRUFBRSxjQUFjLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRTdFLE9BQU8sRUFBYyxXQUFXLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQztBQUcvRCxPQUFPLEVBQWMsZUFBZSxFQUFlLE1BQU0sTUFBTSxDQUFDO0FBQ2hFLE9BQU8sRUFBZ0IsSUFBSSxFQUFhLEdBQUcsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQ3BFLG9DQUFvQztBQUVwQyxxQ0FBcUM7QUFDckMsMEJBQTBCO0FBRTFCLDZCQUE2QjtBQUU3QixPQUFPLE1BQU0sTUFBTSxRQUFRLENBQUM7OztBQUc1QixNQUFNLENBQUMsTUFBTSxlQUFlLEdBQUcsSUFBSSxjQUFjLENBQWlCLHFCQUFxQixDQUFDLENBQUM7QUFDekYsTUFBTSxDQUFDLE1BQU0sbUJBQW1CLEdBQUcsSUFBSSxjQUFjLENBQWdCLHFCQUFxQixDQUFDLENBQUM7QUFDNUYsTUFBTSxDQUFDLE1BQU0sV0FBVyxHQUFHLElBQUksY0FBYyxDQUFpQixnQkFBZ0IsQ0FBQyxDQUFDO0FBS2hGLE1BQU0sT0FBTyxpQkFBaUI7SUFHNUIsK0NBQStDO0lBRS9DLElBQUksWUFBWTtRQUNkLE9BQU8sQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDO0lBQzNCLENBQUM7SUFHRCxZQUFvQixJQUFnQixFQUF5QyxXQUEyQixFQUNsRCxHQUFRO1FBRDFDLFNBQUksR0FBSixJQUFJLENBQVk7UUFSN0IsZUFBVSxHQUFHLElBQUksZUFBZSxDQUFZLEVBQWUsQ0FBQyxDQUFDO1FBVWxFLElBQUksQ0FBQyxXQUFXLEdBQUcsV0FBVyxDQUFDO1FBRS9CLElBQUssQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFDLENBQUM7WUFDdkIsSUFBSSxHQUFHLElBQUksSUFBSSxFQUFDLENBQUM7Z0JBQ2YsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO1lBQ3BCLENBQUM7aUJBQUksQ0FBQztnQkFDSCxHQUFxQixDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUU7b0JBQy9CLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztnQkFDcEIsQ0FBQyxDQUFDLENBQUM7WUFDTCxDQUFDO1FBQ0gsQ0FBQzthQUFJLENBQUM7WUFDSixPQUFPLENBQUMsR0FBRyxDQUFDLGdCQUFnQixDQUFDLENBQUM7WUFDOUIsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO1lBQ2xDLElBQUksQ0FBQyxpQ0FBaUMsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDdkQsTUFBTSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyw0QkFBNEI7WUFDM0QsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDaEMsQ0FBQztJQUNILENBQUM7SUFFRCxnQkFBZ0I7UUFDZCxNQUFNLE9BQU8sR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzlDLE9BQU8sQ0FBQyxHQUFHLEdBQUksdUJBQXVCLENBQUM7UUFDdkMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLENBQUM7UUFFdEMsUUFBUSxDQUFDLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxhQUFhLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFHNUQsT0FBTyxHQUFpQixFQUFFO1lBQ3hCLE9BQU8sSUFBSSxPQUFPLENBQU8sQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLEVBQUU7Z0JBQzNDLElBQUksSUFBSSxDQUFDLFlBQVksRUFBQyxDQUFDO29CQUNyQixPQUFPLEVBQUUsQ0FBQztvQkFDVixPQUFPLENBQUMsTUFBTSxFQUFFLENBQUM7Z0JBQ25CLENBQUM7cUJBQUksQ0FBQztvQkFDSixJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FDbEIsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUNQLEdBQUcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzt5QkFDbEMsU0FBUyxDQUNSLEdBQUcsRUFBRSxDQUFDLE9BQU8sRUFBRSxFQUNmLEdBQUcsRUFBRSxDQUFDLE9BQU8sRUFBRSxDQUNkLENBQUM7Z0JBQ04sQ0FBQztZQUNELENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDO0lBQ04sQ0FBQztJQUVELCtDQUErQztJQUMvQyxvQ0FBb0M7SUFDcEMsSUFBSTtJQUVKLHVDQUF1QztJQUN2QyxpRUFBaUU7SUFDakUsSUFBSTtJQUVKLFVBQVUsQ0FBQyxLQUFLLEdBQUUsS0FBSztRQUNyQiw2Q0FBNkM7UUFDN0MsSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUMsTUFBTSxLQUFLLENBQUMsSUFBSSxLQUFLLEVBQUMsQ0FBQztZQUM1RCxNQUFNLE9BQU8sR0FBRyxJQUFJLFdBQVcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxjQUFjLEVBQUUsTUFBTSxDQUFDLENBQUM7WUFDOUQsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQVksR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sb0JBQW9CLEVBQUUsRUFBQyxPQUFPLEVBQUMsQ0FBQztpQkFDbEYsU0FBUyxDQUNSLENBQUMsRUFBRSxFQUFFLEVBQUU7Z0JBQ0wsbURBQW1EO2dCQUNuRCxJQUFJLENBQUMsaUNBQWlDLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDO2dCQUNsRCxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLDRCQUE0QjtnQkFDdEQsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7WUFBQyxDQUFDLEVBQzNCLENBQUMsRUFBRSxFQUFFLEVBQUU7Z0JBQ0wsT0FBTyxDQUFDLEdBQUcsQ0FBQyxrQ0FBa0MsQ0FBQyxDQUFDO2dCQUNoRCxNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7Z0JBQ2xDLElBQUksQ0FBQyxpQ0FBaUMsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7Z0JBQ3ZELE1BQU0sQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsNEJBQTRCO2dCQUMzRCxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUNqQyxDQUFDO1lBQ0Ysa0dBQWtHO2FBQ2pHLENBQUM7UUFDTixDQUFDO0lBQ0gsQ0FBQztJQUVELGlDQUFpQyxDQUFDLFlBQW9CO1FBQ3BELE1BQU0sQ0FBQyxHQUFHLE1BQU0sQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ2pELElBQUksQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLEtBQUssWUFBWSxFQUFDLENBQUM7WUFDbkMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxlQUFlLENBQUMsQ0FBQztZQUM3QixNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRSxHQUFFLE1BQU0sQ0FBQyxZQUFZLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFFLENBQUM7UUFDOUYsQ0FBQztRQUNELE1BQU0sQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFBRSxZQUFZLENBQUMsQ0FBQztJQUN2RCxDQUFDO0lBRUQsVUFBVTtRQUNSLDhDQUE4QztRQUM5QyxpQkFBaUI7UUFDakIsK0JBQStCO1FBQy9CLFNBQVM7UUFDUCxNQUFNLFFBQVEsR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO1FBRTNFLE9BQU87WUFDTCxZQUFZLEVBQUUsRUFBRTtZQUNoQixVQUFVLEVBQUUsY0FBYztZQUMxQixXQUFXLEVBQUUsU0FBUztZQUN0QixnQkFBZ0IsRUFBRSxZQUFZO1lBQzlCLGtCQUFrQixFQUFFLGNBQWM7WUFDbEMsTUFBTSxFQUFFLFFBQVE7WUFDaEIsUUFBUSxFQUFFLEVBQUU7WUFDWixRQUFRLEVBQUUsRUFBRTtZQUNaLFNBQVMsRUFBRSxFQUFFO1lBQ2IsU0FBUyxFQUFFLEVBQUU7WUFDYixRQUFRLEVBQUUsRUFBRTtZQUNaLEtBQUssRUFBRSxFQUFFO1lBQ1QsZUFBZSxFQUFFLEVBQUU7WUFDbkIsY0FBYyxFQUFFO2dCQUNkLFFBQVEsRUFBRSxFQUFFO2dCQUNaLFNBQVMsRUFBRSxFQUFFO2dCQUNiLFFBQVEsRUFBRSxFQUFFO2dCQUNaLFFBQVEsRUFBRSxFQUFFO2dCQUNaLEVBQUUsRUFBRSxFQUFFO2FBQ1A7WUFDRCxRQUFRLEVBQUUsRUFBRTtTQUNELENBQUM7UUFDaEIsSUFBSTtJQUNOLENBQUM7SUFFRCxXQUFXLENBQUMsWUFBb0I7UUFDOUIsTUFBTSxPQUFPLEdBQUcsSUFBSSxXQUFXLEVBQUUsQ0FBQyxHQUFHLENBQUMsY0FBYyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQzlELE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQWMsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sa0JBQWtCLEVBQUUsRUFBRSxNQUFNLEVBQUUsRUFBRSxZQUFZLEVBQUUsRUFBRyxPQUFPLEVBQUMsQ0FBQyxDQUFDO0lBQ3pILENBQUM7SUFDRCwyQkFBMkIsQ0FBQyxRQUFnQixFQUFDLFVBQVUsR0FBQyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxrQ0FBa0M7UUFDbEgsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBOEIsVUFBVSxFQUFFLEVBQUUsTUFBTSxFQUFFLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxFQUFFLENBQUMsQ0FBQztJQUM5RixDQUFDO0lBRUQsZ0JBQWdCO0lBQ2hCLDBDQUEwQztJQUMxQyw0Q0FBNEM7SUFDNUMsd0VBQXdFO0lBQ3hFLDJEQUEyRDtJQUMzRCxRQUFRO0lBQ1IsaUJBQWlCO0lBQ2pCLDhFQUE4RTtJQUM5RSxnQ0FBZ0M7SUFDaEMsTUFBTTtJQUVOLGdCQUFnQjtRQUNkLE9BQU87WUFDTCxLQUFLLEVBQUU7Z0JBQ0gsU0FBUyxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLGdCQUFnQjthQUNwRDtZQUNELE9BQU8sRUFBRTtnQkFDTCxTQUFTLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsZ0JBQWdCO2dCQUNqRCxjQUFjLEVBQUUsVUFBVTtnQkFDMUIsYUFBYSxFQUFFLElBQUk7Z0JBQ25CLGtCQUFrQixFQUFFLFdBQVc7YUFDbEM7U0FDRixDQUFDO0lBQ0osQ0FBQzsrR0FqS1UsaUJBQWlCLDRDQVUrQixlQUFlLDZCQUMxQyxtQkFBbUI7bUhBWHhDLGlCQUFpQixjQUZoQixNQUFNOzs0RkFFUCxpQkFBaUI7a0JBSDdCLFVBQVU7bUJBQUM7b0JBQ1YsVUFBVSxFQUFFLE1BQU07aUJBQ25COzswQkFXeUMsUUFBUTs7MEJBQUksTUFBTTsyQkFBQyxlQUFlOzswQkFDN0QsUUFBUTs7MEJBQUksTUFBTTsyQkFBQyxtQkFBbUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3QsIEluamVjdGFibGUsIEluamVjdGlvblRva2VuLCBPcHRpb25hbCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBTaWlFbnZpcm9ubWVudCB9IGZyb20gJy4vZHRvL3NpaS1lbnZpcm9ubWVudC5kdG8nO1xyXG5pbXBvcnQgeyBIdHRwQ2xpZW50LCBIdHRwSGVhZGVycyB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcclxuaW1wb3J0IHsgTXlzZWxmRFRPIH0gZnJvbSAnLi9kdG8vbXlzZWxmLmR0byc7XHJcbmltcG9ydCB7IEhlbHBQYWdlRFRPIH0gZnJvbSAnLi9kdG8vaGVscC1wYWdlLmR0byc7XHJcbmltcG9ydCB7IE9ic2VydmFibGUsIEJlaGF2aW9yU3ViamVjdCwgb2YsIFN1YmplY3QgfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHsgZGVib3VuY2VUaW1lLCBza2lwLCBzdGFydFdpdGgsIHRhcCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcclxuLy8gY29uc3QgbW9tZW50ID0gcmVxdWlyZSgnbW9tZW50Jyk7XHJcblxyXG4vLyBpbXBvcnQgKiBhcyBtb21lbnRfIGZyb20gJ21vbWVudCc7XHJcbi8vIGNvbnN0IG1vbWVudCA9IG1vbWVudF87XHJcblxyXG4vLyBpbXBvcnQgJ21vbWVudC9sb2NhbGUvaXQnO1xyXG5cclxuaW1wb3J0IG1vbWVudCBmcm9tICdtb21lbnQnO1xyXG5cclxuaW1wb3J0IHsgV29ya2VyQ29udGFjdEluZm9ybWF0aW9uRHRvIH0gZnJvbSAnLi9kdG8vaS13b3JrZXItY29udGFjdC1pbmZvcm1hdGlvbi5kdG8nO1xyXG5leHBvcnQgY29uc3QgU0lJX0VOVklST05NRU5UID0gbmV3IEluamVjdGlvblRva2VuPFNpaUVudmlyb25tZW50PigndG9vbGtpdC5lbnZpcm9ubWVudCcpO1xyXG5leHBvcnQgY29uc3QgU0lJX1NFU1NJT05fV0FJVElORyA9IG5ldyBJbmplY3Rpb25Ub2tlbjxQcm9taXNlPHZvaWQ+PigndG9vbGtpdC5zZXNzaW9ud2FpdCcpO1xyXG5leHBvcnQgY29uc3QgU0lJX0FQUF9SRUYgPSBuZXcgSW5qZWN0aW9uVG9rZW48U2lpRW52aXJvbm1lbnQ+KCd0b29sa2l0LmFwcHJlZicpO1xyXG5cclxuQEluamVjdGFibGUoe1xyXG4gIHByb3ZpZGVkSW46ICdyb290J1xyXG59KVxyXG5leHBvcnQgY2xhc3MgU2lpVG9vbGtpdFNlcnZpY2Uge1xyXG4gIGVudmlyb25tZW50OiBTaWlFbnZpcm9ubWVudDtcclxuICBwdWJsaWMgbG9nZ2VkVXNlciA9IG5ldyBCZWhhdmlvclN1YmplY3Q8TXlzZWxmRFRPPih7fSBhcyBNeXNlbGZEVE8pO1xyXG4gIC8vIHB1YmxpYyB2aWV3cG9ydFJlc2l6ZSA9IG5ldyBTdWJqZWN0PHZvaWQ+KCk7XHJcblxyXG4gIGdldCBpc1NlcnZlcmxlc3MoKXtcclxuICAgIHJldHVybiAhdGhpcy5lbnZpcm9ubWVudDtcclxuICB9XHJcblxyXG5cclxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGh0dHA6IEh0dHBDbGllbnQsICBAT3B0aW9uYWwoKSBASW5qZWN0KFNJSV9FTlZJUk9OTUVOVCkgIGVudmlyb25tZW50OiBTaWlFbnZpcm9ubWVudCxcclxuICAgICAgICAgICAgICBAT3B0aW9uYWwoKSBASW5qZWN0KFNJSV9TRVNTSU9OX1dBSVRJTkcpICBzc3c6IGFueSkge1xyXG4gICAgdGhpcy5lbnZpcm9ubWVudCA9IGVudmlyb25tZW50O1xyXG5cclxuICAgIGlmICggIXRoaXMuaXNTZXJ2ZXJsZXNzKXtcclxuICAgICAgaWYgKHNzdyA9PSBudWxsKXtcclxuICAgICAgICB0aGlzLmxvYWRNeXNlbGYoKTtcclxuICAgICAgfWVsc2V7XHJcbiAgICAgICAgKHNzdyAgYXMgUHJvbWlzZTxhbnk+KS50aGVuKCgpID0+IHtcclxuICAgICAgICAgIHRoaXMubG9hZE15c2VsZigpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICB9ZWxzZXtcclxuICAgICAgY29uc29sZS5sb2coJ0RFRkFVTFQgQ09ORklHJyk7XHJcbiAgICAgIGNvbnN0IHRtcFVzZXIgPSB0aGlzLmZpbmRNeVNlbGYoKTtcclxuICAgICAgdGhpcy5jbGVhckxvY2Fsc3RvcmFnZUlmTGFuZ3VhZ2VDaGFuZ2UodG1wVXNlci5sb2NhbGUpO1xyXG4gICAgICBtb21lbnQubG9jYWxlKHRtcFVzZXIubG9jYWxlKTsgLy8gIGluaXRpYWxpenIgbW9tZW50IGxvY2FsZVxyXG4gICAgICB0aGlzLmxvZ2dlZFVzZXIubmV4dCh0bXBVc2VyKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGluaXRpYWxpemVNeVNlbGYoKSB7XHJcbiAgICBjb25zdCBsb2FkaW5nID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW1nJyk7XHJcbiAgICBsb2FkaW5nLnNyYyA9ICAnYXNzZXRzL2ljb25zL2xvZ28ucG5nJztcclxuICAgIGxvYWRpbmcuY2xhc3NMaXN0LmFkZCgnc2lpQXBwTG9hZGVyJyk7XHJcblxyXG4gICAgZG9jdW1lbnQuYm9keS5pbnNlcnRBZGphY2VudEVsZW1lbnQoJ2JlZm9yZWJlZ2luJywgbG9hZGluZyk7XHJcblxyXG5cclxuICAgIHJldHVybiAoKTogUHJvbWlzZTxhbnk+ID0+IHtcclxuICAgICAgcmV0dXJuIG5ldyBQcm9taXNlPHZvaWQ+KChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICBpZiAodGhpcy5pc1NlcnZlcmxlc3Mpe1xyXG4gICAgICAgICAgcmVzb2x2ZSgpO1xyXG4gICAgICAgICAgbG9hZGluZy5yZW1vdmUoKTtcclxuICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgIHRoaXMubG9nZ2VkVXNlci5waXBlKFxyXG4gICAgICAgICAgICBza2lwKDEpLFxyXG4gICAgICAgICAgICB0YXAoKCkgPT4geyBsb2FkaW5nLnJlbW92ZSgpOyB9KSlcclxuICAgICAgICAgIC5zdWJzY3JpYmUoXHJcbiAgICAgICAgICAgICgpID0+IHJlc29sdmUoKSxcclxuICAgICAgICAgICAgKCkgPT4gcmVzb2x2ZSgpXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9O1xyXG4gIH1cclxuXHJcbiAgLy8gYWRkRW52aXJvbm1lbnQoZW52aXJvbm1lbnQ6IFNpaUVudmlyb25tZW50KXtcclxuICAvLyAgIHRoaXMuZW52aXJvbm1lbnQgPSBlbnZpcm9ubWVudDtcclxuICAvLyB9XHJcblxyXG4gIC8vIGdldE15c2VsZigpOiBPYnNlcnZhYmxlPE15c2VsZkRUTz4ge1xyXG4gIC8vICAgcmV0dXJuIHRoaXMuaHR0cC5nZXQ8TXlzZWxmRFRPPih0aGlzLmVudmlyb25tZW50Lm15c2VsZlVSTCk7XHJcbiAgLy8gfVxyXG5cclxuICBsb2FkTXlzZWxmKGZvcmNlPSBmYWxzZSl7XHJcbiAgICAvLyBsb2FkIHRoZSBpbmZvcm1hdGlvbiBvbmx5IGlmIGlzIG5vdCBsb2FkZWRcclxuICAgIGlmIChPYmplY3Qua2V5cyh0aGlzLmxvZ2dlZFVzZXIudmFsdWUpLmxlbmd0aCA9PT0gMCB8fCBmb3JjZSl7XHJcbiAgICAgIGNvbnN0IGhlYWRlcnMgPSBuZXcgSHR0cEhlYWRlcnMoKS5zZXQoJ3NpaUhpZGVFcnJvcicsICd0cnVlJyk7XHJcbiAgICAgIHRoaXMuaHR0cC5nZXQ8TXlzZWxmRFRPPihgJHt0aGlzLmVudmlyb25tZW50LmRvbWFpbn0vc2lpX2NvbW1vbi9teXNlbGZgLCB7aGVhZGVyc30pXHJcbiAgICAgIC5zdWJzY3JpYmUoXHJcbiAgICAgICAgKG1zKSA9PiB7XHJcbiAgICAgICAgICAvLyBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnbXNpJywgSlNPTi5zdHJpbmdpZnkobXMpKTtcclxuICAgICAgICAgIHRoaXMuY2xlYXJMb2NhbHN0b3JhZ2VJZkxhbmd1YWdlQ2hhbmdlKG1zLmxvY2FsZSk7XHJcbiAgICAgICAgICBtb21lbnQubG9jYWxlKG1zLmxvY2FsZSk7IC8vICBpbml0aWFsaXpyIG1vbWVudCBsb2NhbGVcclxuICAgICAgICAgIHRoaXMubG9nZ2VkVXNlci5uZXh0KG1zKTsgfSxcclxuICAgICAgICAgIChtcykgPT4ge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnRVJST1JFIE5FTCBSRUNVUEVSTyBERUxMXFwnVVRFTlRFJyk7XHJcbiAgICAgICAgICAgIGNvbnN0IHRtcFVzZXIgPSB0aGlzLmZpbmRNeVNlbGYoKTtcclxuICAgICAgICAgICAgdGhpcy5jbGVhckxvY2Fsc3RvcmFnZUlmTGFuZ3VhZ2VDaGFuZ2UodG1wVXNlci5sb2NhbGUpO1xyXG4gICAgICAgICAgICBtb21lbnQubG9jYWxlKHRtcFVzZXIubG9jYWxlKTsgLy8gIGluaXRpYWxpenIgbW9tZW50IGxvY2FsZVxyXG4gICAgICAgICAgICB0aGlzLmxvZ2dlZFVzZXIubmV4dCh0bXBVc2VyKTtcclxuICAgICAgICAgfVxyXG4gICAgICAgIC8vIGluIGNhc28gZGkgZXJyb3JlIGVtZXR0byBjb211bnF1ZSB1biB2YWxvcmUgcGVyIHBlcm1ldHRlcmUgY29tdW5xdWUgYWxsJ2FwcGxpY2F6aW9uZSBkaSBwYXJ0aXJlXHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGNsZWFyTG9jYWxzdG9yYWdlSWZMYW5ndWFnZUNoYW5nZShjdXJyVXNlckxhbmc6IHN0cmluZyl7XHJcbiAgICBjb25zdCBsID0gd2luZG93LmxvY2FsU3RvcmFnZS5nZXRJdGVtKCdzaWlMYW5nJyk7XHJcbiAgICBpZiAobCA9PSBudWxsIHx8IGwgIT09IGN1cnJVc2VyTGFuZyl7XHJcbiAgICAgIGNvbnNvbGUubG9nKCdzaWlMYW5nQ2hhbmdlJyk7XHJcbiAgICAgIE9iamVjdC5rZXlzKHdpbmRvdy5sb2NhbFN0b3JhZ2UpLmZvckVhY2goKGxzaSkgPT4ge3dpbmRvdy5sb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbShsc2kpOyB9ICk7XHJcbiAgICB9XHJcbiAgICB3aW5kb3cubG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3NpaUxhbmcnLCBjdXJyVXNlckxhbmcpO1xyXG4gIH1cclxuXHJcbiAgZmluZE15U2VsZigpOiBNeXNlbGZEVE97XHJcbiAgICAvLyBjb25zdCBteXNlbGYgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnbXNpJyk7XHJcbiAgICAvLyBpZiAoISFteXNlbGYpe1xyXG4gICAgLy8gICByZXR1cm4gSlNPTi5wYXJzZShteXNlbGYpO1xyXG4gICAgLy8gfWVsc2V7XHJcbiAgICAgIGNvbnN0IGxhbmd1YWdlID0gd2luZG93LmxvY2F0aW9uLmhyZWYuaW5kZXhPZignL2VuLycpID09PSAtMSA/ICdpdCcgOiAnZW4nO1xyXG5cclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICBjb3N0Q2VudGVySWQ6ICcnLFxyXG4gICAgICAgIGFjY2Vzc1R5cGU6ICdVbmNsYXNzaWZpZWQnLFxyXG4gICAgICAgIHRvb2xiYXJNb2RlOiAnaW5pdGlhbCcsXHJcbiAgICAgICAgaW5wdXREYXRlUGF0dGVybjogJ0REL01NL1lZWVknLFxyXG4gICAgICAgIGRpc3BsYXlEYXRlUGF0dGVybjogJ0REIE1NTSwgWVlZWScsXHJcbiAgICAgICAgbG9jYWxlOiBsYW5ndWFnZSxcclxuICAgICAgICB1c2VybmFtZTogJycsXHJcbiAgICAgICAgd29ya2VySWQ6ICcnLFxyXG4gICAgICAgIGNvbXBhbnlJZDogJycsXHJcbiAgICAgICAgZmlyc3ROYW1lOiAnJyxcclxuICAgICAgICBsYXN0TmFtZTogJycsXHJcbiAgICAgICAgZW1haWw6ICcnLFxyXG4gICAgICAgIGNvc3RDZW50ZXJEZXNjcjogJycsXHJcbiAgICAgICAgY29zdENlbnRlclJlc3A6IHtcclxuICAgICAgICAgIHVzZXJuYW1lOiAnJyxcclxuICAgICAgICAgIGZpcnN0TmFtZTogJycsXHJcbiAgICAgICAgICBsYXN0TmFtZTogJycsXHJcbiAgICAgICAgICB3b3JrZXJJZDogJycsXHJcbiAgICAgICAgICBpZDogJydcclxuICAgICAgICB9LFxyXG4gICAgICAgIHVzZXJJbmZvOiAnJ1xyXG4gICAgICB9YXMgTXlzZWxmRFRPO1xyXG4gICAgLy8gfVxyXG4gIH1cclxuXHJcbiAgZ2V0SGVscFBhZ2UoZnVuY3Rpb25Db2RlOiBzdHJpbmcpOiBPYnNlcnZhYmxlPEhlbHBQYWdlRFRPPiB7XHJcbiAgICBjb25zdCBoZWFkZXJzID0gbmV3IEh0dHBIZWFkZXJzKCkuc2V0KCdzaWlIaWRlRXJyb3InLCAndHJ1ZScpO1xyXG4gICAgcmV0dXJuIHRoaXMuaHR0cC5nZXQ8SGVscFBhZ2VEVE8+KGAke3RoaXMuZW52aXJvbm1lbnQuZG9tYWlufS9zaWlfY29tbW9uL2hlbHBgLCB7IHBhcmFtczogeyBmdW5jdGlvbkNvZGUgfSAsIGhlYWRlcnN9KTtcclxuICB9XHJcbiAgZ2V0V29ya2VyQ29udGFjdEluZm9ybWF0aW9uKHdvcmtlcklkOiBzdHJpbmcsc2VydmljZVVybD1gJHt0aGlzLmVudmlyb25tZW50LmRvbWFpbn0vbG9va3VwL3dvcmtlckNvbnRhY3RJbmZvcm1hdGlvbmApOiBPYnNlcnZhYmxlPFdvcmtlckNvbnRhY3RJbmZvcm1hdGlvbkR0bz4ge1xyXG4gICAgcmV0dXJuIHRoaXMuaHR0cC5nZXQ8V29ya2VyQ29udGFjdEluZm9ybWF0aW9uRHRvPihzZXJ2aWNlVXJsLCB7IHBhcmFtczogeyBpZDogd29ya2VySWQgfSB9KTtcclxuICB9XHJcblxyXG4gIC8vIGZpeFdpZXBvcnQoKXtcclxuICAvLyAgIHRoaXMudmlld3BvcnRSZXNpemUuc3Vic2NyaWJlKCgpID0+IHtcclxuICAvLyAgICAgY29uc3QgZG9jID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50O1xyXG4gIC8vICAgICBkb2Muc3R5bGUuc2V0UHJvcGVydHkoJy0tYXBwLWhlaWdodCcsIGAke3dpbmRvdy5pbm5lckhlaWdodH1weGApO1xyXG4gIC8vICAgICAvLyBjb25zb2xlLmxvZygnZml4Vmlld3BvcnQgJyArIHdpbmRvdy5pbm5lckhlaWdodCk7XHJcbiAgLy8gICB9KTtcclxuICAvLyAgIC8vIGFwcEhlaWdodFxyXG4gIC8vICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsICgpID0+IHt0aGlzLnZpZXdwb3J0UmVzaXplLm5leHQoKTsgfSApO1xyXG4gIC8vICAgdGhpcy52aWV3cG9ydFJlc2l6ZS5uZXh0KCk7XHJcbiAgLy8gICB9XHJcblxyXG4gIGdldE1hdERhdGVDb25maWcoKXtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHBhcnNlOiB7XHJcbiAgICAgICAgICBkYXRlSW5wdXQ6IHRoaXMubG9nZ2VkVXNlci52YWx1ZS5pbnB1dERhdGVQYXR0ZXJuLFxyXG4gICAgICB9LFxyXG4gICAgICBkaXNwbGF5OiB7XHJcbiAgICAgICAgICBkYXRlSW5wdXQ6IHRoaXMubG9nZ2VkVXNlci52YWx1ZS5pbnB1dERhdGVQYXR0ZXJuLFxyXG4gICAgICAgICAgbW9udGhZZWFyTGFiZWw6ICdNTU0gWVlZWScsXHJcbiAgICAgICAgICBkYXRlQTExeUxhYmVsOiAnTEwnLFxyXG4gICAgICAgICAgbW9udGhZZWFyQTExeUxhYmVsOiAnTU1NTSBZWVlZJyxcclxuICAgICAgfVxyXG4gICAgfTtcclxuICB9XHJcblxyXG59XHJcblxyXG5cclxuIl19