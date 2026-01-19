import { HttpHeaders, HttpParams } from '@angular/common/http';
import { Inject, Injectable, Optional } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
// import { ENGAGE_CONFIG } from '../sii-toolkit.module';
import { SII_ENVIRONMENT } from '../sii-toolkit.service';
import { startWith } from 'rxjs/operators';
import { SiiHttpInterceptorService } from './sii-http-interceptor.service';
import { SiiEventStatus } from '../dto/OfficeCalendarEvents.dto';
import { SiiDatePipe } from '../components/util/sii-date.pipe';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
import * as i2 from "../sii-toolkit.service";
import * as i3 from "../components/wait/sii-wait.service";
// import { ENGAGE_CONFIG } from './engage-configurations-params.service';
// import { SiiToolkitService } from '../sii-toolkit.service';
export class SiiEngageService {
    get isEngage() {
        return this.environment?.isEngage;
    }
    // get isServerless(){
    //   return !this.environment;
    // }
    get loggedUserId() {
        return this.toolkitServ.loggedUser.value.workerId;
    }
    get languageId() {
        return this.toolkitServ.loggedUser.value.locale;
    }
    get engageBEDomain() {
        return this.engageConfig.value.ENGAGE_DOTCMS;
    }
    get engageDomain() {
        return this.engageConfig.value.ENGAGE;
    }
    get engageAvailable() {
        return !!this.engageConfig.value;
    }
    // toolbarMenuVoices: string;
    constructor(http, environment, toolkitServ, siiwait) {
        this.http = http;
        this.environment = environment;
        this.toolkitServ = toolkitServ;
        this.siiwait = siiwait;
        this.currentMenu = new BehaviorSubject([]);
        this.favoriteItems = new BehaviorSubject([]);
        this.corporateCalendarEvents = new BehaviorSubject([]);
        this.corporateCalendarEventsCount = 0;
        // public engageNotification = new BehaviorSubject<any[]>([]);
        // public engageNotificationCount = 0;
        this.engageConfig = new BehaviorSubject(null);
        if (this.environment) {
            const subs = this.toolkitServ.loggedUser.pipe(startWith(this.toolkitServ.loggedUser.value)).subscribe(lu => {
                if (!!lu && !!lu.workerId) {
                    this.clearLocalstorage();
                    subs.unsubscribe();
                    this.preloadMenu();
                }
            });
            this.engageConfig.subscribe((res) => {
                if (res !== null) {
                    this.fetchMenu();
                    this.loadEventsFromCorporateITCalendar();
                }
            });
        }
    }
    clearLocalstorage() {
        Object.keys(window.localStorage).forEach((lsi) => {
            if (lsi.startsWith('menu-') && lsi !== 'menu-' + this.loggedUserId) {
                // console.log("rimuovo menu altro utente")
                window.localStorage.removeItem(lsi);
            }
            if (lsi.startsWith('favVoice-') && lsi !== 'favVoice-' + this.loggedUserId) {
                // console.log("rimuovo favVoice altro utente")
                window.localStorage.removeItem(lsi);
            }
        });
    }
    getToolbarMenuVoices() {
        if (this.engageAvailable) {
            const headers = new HttpHeaders().set(SiiHttpInterceptorService.HIDE_ERROR, 'true');
            return this.http.get(this.engageBEDomain + 'vtl/toolbarMenu?id=v1', { headers });
        }
        else {
            return of({ menu: [] });
        }
    }
    fetchEngageConfig() {
        return () => {
            return new Promise((resolve, reject) => {
                if (!this.environment) {
                    resolve();
                }
                else if (this.isEngage) {
                    const conf = { ENGAGE_DOTCMS: this.environment.domain.replace('/api', '/sii_content/api'), ENGAGE: this.environment.domain.replace('/sial/api', '/') };
                    this.resolveAfterUserResolve(conf, resolve);
                }
                else {
                    const headers = new HttpHeaders().set('siiHideError', 'true');
                    this.http.get(this.environment.domain + '/engage/config', { headers })
                        .subscribe((res) => {
                        localStorage.setItem('ecfg', JSON.stringify(res));
                        this.resolveAfterUserResolve(res, resolve);
                    }, () => {
                        const ec = this.findEngageConf();
                        this.resolveAfterUserResolve(ec, resolve);
                    });
                }
            });
        };
    }
    findEngageConf() {
        const ec = localStorage.getItem('ecfg');
        if (!!ec) {
            return JSON.parse(ec);
        }
    }
    endsBySlashP(s) {
        return (s.length - 1) === s.lastIndexOf('/');
    }
    resolveAfterUserResolve(configuration, resolve) {
        const luSubscr = this.toolkitServ.loggedUser.pipe(startWith(this.toolkitServ.loggedUser.value))
            .subscribe((user) => {
            if (user.workerId !== undefined) {
                if (!!configuration?.ENGAGE && !this.endsBySlashP(configuration.ENGAGE)) {
                    configuration.ENGAGE = configuration.ENGAGE + '/';
                }
                if (!!configuration?.ENGAGE_DOTCMS && !this.endsBySlashP(configuration.ENGAGE_DOTCMS)) {
                    configuration.ENGAGE_DOTCMS = configuration.ENGAGE_DOTCMS + '/';
                }
                this.engageConfig.next(configuration);
                resolve();
                setTimeout(() => {
                    luSubscr?.unsubscribe();
                }, 1000);
            }
        });
    }
    getMenuVoices() {
        this.siiwait.skipNext();
        const headers = new HttpHeaders().set('siiHideError', 'true');
        return this.http.get(`${this.toolkitServ.environment.domain}/sii-menu/menu/voices`, { headers });
    }
    forceReloadMenu() {
        Object.keys(window.localStorage).forEach((lsi) => {
            if (lsi.startsWith('menu-') || lsi.startsWith('favVoice-') || lsi === 'menuTimestamp') {
                // console.log("rimuovo menu altro utente")
                window.localStorage.removeItem(lsi);
            }
        });
        this.fetchMenu();
    }
    fetchMenu() {
        const mi = window.localStorage.getItem('menu-' + this.loggedUserId);
        const menuTimestamp = window.localStorage.getItem('menuTimestamp');
        if (mi == null || menuTimestamp == null || ((new Date().getTime()) - parseInt(menuTimestamp, 10) - (2 * 60 * 60 * 1000) > 0)) {
            this.getMenuVoices().subscribe((res) => {
                window.localStorage.setItem('menu-' + this.loggedUserId, JSON.stringify(res));
                window.localStorage.setItem('menuTimestamp', new Date().getTime().toString());
                this.currentMenu.next(res);
                this.fetchFavoritesVoices();
            });
        }
        else {
            // console.log('menu  già caricato nel preloadMenu');
            this.fetchFavoritesVoices();
        }
    }
    preloadMenu() {
        const mi = window.localStorage.getItem('menu-' + this.loggedUserId);
        if (mi != null) {
            this.currentMenu.next(JSON.parse(mi));
            this.preloadLocalFavoritesVoices();
        }
    }
    fetchFavoritesVoices() {
        this.getMenuFavoriteVoices().subscribe((res) => {
            if (this.favoriteItems.value == null || JSON.stringify(this.favoriteItems.value) !== JSON.stringify(res)) {
                // console.log('favoriti cambiati, li aggiorno');
                // se i favoriti non erano salvati in sessione oppure sono diversi da quelli caricati
                this.favoriteItems.next(res);
                window.localStorage.setItem('favVoice-' + this.loggedUserId, JSON.stringify(res));
            }
            else {
                // console.log('favoriti NON cambiati');
            }
        });
    }
    preloadLocalFavoritesVoices() {
        const localF = window.localStorage.getItem('favVoice-' + this.loggedUserId);
        if (localF != null) {
            this.favoriteItems.next(JSON.parse(localF));
        }
    }
    getMenuFavoriteVoices() {
        this.siiwait.skipNext();
        const headers = new HttpHeaders().set(SiiHttpInterceptorService.HIDE_ERROR, 'true');
        return this.http.get(`${this.toolkitServ.environment.domain}/sii-menu/menu/favorite`, { headers });
    }
    saveFavoritesVoice(fav) {
        return this.http.post(`${this.toolkitServ.environment.domain}/sii-menu/menu/saveFavorite`, fav.join(','));
    }
    // loadNotifications(){
    //   if (this.engageAvailable){
    //     const headers = new HttpHeaders().set(SiiHttpInterceptorService.HIDE_ERROR, 'true');
    //     this.http.get<any>(this.engageBEDomain + 'vtl/notifications?languageId=' + this.languageId, {headers})
    //       .subscribe(nj => {
    //           this.engageNotification.next(nj.results.map(i => {i.notificationDate = new Date(i.notificationDate); return i; }));
    //           this.engageNotificationCount = nj.results.length;
    //       }, err => this.engageNotification.next([])) ;
    //   }
    // }
    loadEventsFromCorporateITCalendar() {
        if (this.engageAvailable) {
            let headers = new HttpHeaders()
                .append('siiHideError', 'true');
            const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
            if (!!tz) {
                headers = headers.append('Prefer', `outlook.timezone="${tz}"`);
            }
            // const today=new Date();
            // const tomorrow=new Date();
            // tomorrow.setDate(tomorrow.getDate() + 1);//2mesi
            var start = new Date();
            start.setHours(0, 0, 0, 0);
            var end = new Date();
            end.setDate(end.getDate() + 1); //2mesi
            end.setHours(23, 59, 59, 999);
            let params = new HttpParams()
                .append('$select', "subject,body,bodyPreview,start,end,isAllDay")
                .append('startdatetime', start.toISOString())
                .append('enddatetime', end.toISOString())
                .append('$top', 15);
            this.siiwait.skipNext();
            this.http.get(this.engageDomain + 'sial/corporateCalendar/calendarview?languageId=' + this.languageId, { params, headers })
                .subscribe(nj => {
                this.corporateCalendarEvents.next(this.buildCorporateItEventData(nj.value));
                this.corporateCalendarEventsCount = nj.value.length;
            }, err => this.corporateCalendarEvents.next([]));
        }
    }
    buildCorporateItEventData(originalData) {
        const siiDatePipe = new SiiDatePipe(this.toolkitServ);
        const data = [...originalData];
        const today = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()).getTime();
        data.forEach((d, i, a) => {
            const eventDate = new Date(d.start.dateTime);
            const evDateNoTime = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate()).getTime();
            d.date = siiDatePipe.transform(eventDate);
            d.time = String(eventDate.getHours() % 12).padStart(2, '0') + ":" + String(eventDate.getMinutes()).padStart(2, '0') + (eventDate.getHours() > 12 ? ' PM' : ' AM');
            const dayDiff = Math.floor((evDateNoTime - today) / (24 * 3600 * 1000));
            if (dayDiff == 0) {
                d.status = SiiEventStatus.SCADENZA_OGGI;
            }
            else if (dayDiff < -5) {
                d.status = SiiEventStatus.VECCHIA;
            }
            else if (dayDiff < 0 && dayDiff >= -5) {
                d.status = SiiEventStatus.SCADUTA;
            }
            else if (dayDiff > 0 && dayDiff <= 5) {
                d.status = SiiEventStatus.IN_SCADENZA;
            }
            else if (dayDiff > 5) {
                d.status = SiiEventStatus.PROSSIMAMENTE;
            }
            if (i != 0) {
                const prevItemDate = new Date(a[i - 1].start.dateTime);
                d.hideData = new Date(prevItemDate.getFullYear(), prevItemDate.getMonth(), prevItemDate.getDate(), 0, 0, 0, 0).getTime() == evDateNoTime;
            }
        });
        // this.data=data;
        return data;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: SiiEngageService, deps: [{ token: i1.HttpClient }, { token: SII_ENVIRONMENT, optional: true }, { token: i2.SiiToolkitService }, { token: i3.SiiWaitService }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: SiiEngageService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: SiiEngageService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: () => [{ type: i1.HttpClient }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [SII_ENVIRONMENT]
                }] }, { type: i2.SiiToolkitService }, { type: i3.SiiWaitService }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2lpLWVuZ2FnZS5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvc2lpLXRvb2xraXQvc3JjL2xpYi9zZXJ2aWNlL3NpaS1lbmdhZ2Uuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQWMsV0FBVyxFQUFFLFVBQVUsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBQzNFLE9BQU8sRUFBRSxNQUFNLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUM3RCxPQUFPLEVBQUUsZUFBZSxFQUFFLEVBQUUsRUFBRSxNQUFNLE1BQU0sQ0FBQztBQU0zQyx5REFBeUQ7QUFDekQsT0FBTyxFQUFxQixlQUFlLEVBQUUsTUFBTSx3QkFBd0IsQ0FBQztBQUM1RSxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDM0MsT0FBTyxFQUFFLHlCQUF5QixFQUFFLE1BQU0sZ0NBQWdDLENBQUM7QUFDM0UsT0FBTyxFQUFxQyxjQUFjLEVBQUUsTUFBTSxpQ0FBaUMsQ0FBQztBQUNwRyxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sa0NBQWtDLENBQUM7Ozs7O0FBQy9ELDBFQUEwRTtBQUMxRSw4REFBOEQ7QUFLOUQsTUFBTSxPQUFPLGdCQUFnQjtJQUUzQixJQUFJLFFBQVE7UUFDVixPQUFPLElBQUksQ0FBQyxXQUFXLEVBQUUsUUFBUSxDQUFDO0lBQ3BDLENBQUM7SUFFRCxzQkFBc0I7SUFDdEIsOEJBQThCO0lBQzlCLElBQUk7SUFFSixJQUFJLFlBQVk7UUFDZCxPQUFPLElBQUksQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUM7SUFDcEQsQ0FBQztJQUNELElBQUksVUFBVTtRQUNaLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQztJQUNsRCxDQUFDO0lBU0Qs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QUFHLENBQUMsSUFBRSxDQUFDLEVBQUMsQ0FBQztnQkFDUCxNQUFNLFlBQVksR0FBRSxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQztnQkFDcEQsQ0FBQyxDQUFDLFFBQVEsR0FBRSxJQUFJLElBQUksQ0FBQyxZQUFZLENBQUMsV0FBVyxFQUFFLEVBQUUsWUFBWSxDQUFDLFFBQVEsRUFBRSxFQUFFLFlBQVksQ0FBQyxPQUFPLEVBQUUsRUFBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLEVBQUUsSUFBRSxZQUFZLENBQUM7WUFDcEksQ0FBQztRQUNILENBQUMsQ0FBQyxDQUFDO1FBQ0gsa0JBQWtCO1FBQ2xCLE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQzsrR0FoUlUsZ0JBQWdCLDRDQXNDK0IsZUFBZTttSEF0QzlELGdCQUFnQixjQUZmLE1BQU07OzRGQUVQLGdCQUFnQjtrQkFINUIsVUFBVTttQkFBQztvQkFDVixVQUFVLEVBQUUsTUFBTTtpQkFDbkI7OzBCQXVDd0MsUUFBUTs7MEJBQUksTUFBTTsyQkFBQyxlQUFlIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSHR0cENsaWVudCwgSHR0cEhlYWRlcnMsIEh0dHBQYXJhbXMgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XHJcbmltcG9ydCB7IEluamVjdCwgSW5qZWN0YWJsZSwgT3B0aW9uYWwgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgQmVoYXZpb3JTdWJqZWN0LCBvZiB9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQgeyBTaWlXYWl0U2VydmljZSB9IGZyb20gJy4uL2NvbXBvbmVudHMvd2FpdC9zaWktd2FpdC5zZXJ2aWNlJztcclxuaW1wb3J0IHsgU2lpTWVudUZvbGRlciB9IGZyb20gJy4uL2NvbXBvbmVudHMvbWVudS9nbG9iYWwtbWVudS9kdG8vbWVudS1mb2xkZXInO1xyXG5pbXBvcnQgeyBFbmdhZ2VDb25maWdEVE8gfSBmcm9tICcuLi9kdG8vZW5nYWdlLWNvbmZpZy5kdG8nO1xyXG5pbXBvcnQgeyBTaWlFbnZpcm9ubWVudCB9IGZyb20gJy4uL2R0by9zaWktZW52aXJvbm1lbnQuZHRvJztcclxuaW1wb3J0IHsgVG9vbGJhck1lbnVEdG8gfSBmcm9tICcuLi9kdG8vdG9vbGJhci1tZW51LmR0byc7XHJcbi8vIGltcG9ydCB7IEVOR0FHRV9DT05GSUcgfSBmcm9tICcuLi9zaWktdG9vbGtpdC5tb2R1bGUnO1xyXG5pbXBvcnQgeyBTaWlUb29sa2l0U2VydmljZSwgU0lJX0VOVklST05NRU5UIH0gZnJvbSAnLi4vc2lpLXRvb2xraXQuc2VydmljZSc7XHJcbmltcG9ydCB7IHN0YXJ0V2l0aCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcclxuaW1wb3J0IHsgU2lpSHR0cEludGVyY2VwdG9yU2VydmljZSB9IGZyb20gJy4vc2lpLWh0dHAtaW50ZXJjZXB0b3Iuc2VydmljZSc7XHJcbmltcG9ydCB7IE9mZmljZUNhbGVuZGFyRXZlbnRzLCBPZmZpY2VFdmVudCwgU2lpRXZlbnRTdGF0dXMgfSBmcm9tICcuLi9kdG8vT2ZmaWNlQ2FsZW5kYXJFdmVudHMuZHRvJztcclxuaW1wb3J0IHsgU2lpRGF0ZVBpcGUgfSBmcm9tICcuLi9jb21wb25lbnRzL3V0aWwvc2lpLWRhdGUucGlwZSc7XHJcbi8vIGltcG9ydCB7IEVOR0FHRV9DT05GSUcgfSBmcm9tICcuL2VuZ2FnZS1jb25maWd1cmF0aW9ucy1wYXJhbXMuc2VydmljZSc7XHJcbi8vIGltcG9ydCB7IFNpaVRvb2xraXRTZXJ2aWNlIH0gZnJvbSAnLi4vc2lpLXRvb2xraXQuc2VydmljZSc7XHJcblxyXG5ASW5qZWN0YWJsZSh7XHJcbiAgcHJvdmlkZWRJbjogJ3Jvb3QnXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBTaWlFbmdhZ2VTZXJ2aWNlIHtcclxuXHJcbiAgZ2V0IGlzRW5nYWdlKCl7XHJcbiAgICByZXR1cm4gdGhpcy5lbnZpcm9ubWVudD8uaXNFbmdhZ2U7XHJcbiAgfVxyXG5cclxuICAvLyBnZXQgaXNTZXJ2ZXJsZXNzKCl7XHJcbiAgLy8gICByZXR1cm4gIXRoaXMuZW52aXJvbm1lbnQ7XHJcbiAgLy8gfVxyXG5cclxuICBnZXQgbG9nZ2VkVXNlcklkKCl7XHJcbiAgICByZXR1cm4gdGhpcy50b29sa2l0U2Vydi5sb2dnZWRVc2VyLnZhbHVlLndvcmtlcklkO1xyXG4gIH1cclxuICBnZXQgbGFuZ3VhZ2VJZCgpe1xyXG4gICAgcmV0dXJuIHRoaXMudG9vbGtpdFNlcnYubG9nZ2VkVXNlci52YWx1ZS5sb2NhbGU7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgY3VycmVudE1lbnUgPSBuZXcgQmVoYXZpb3JTdWJqZWN0PFNpaU1lbnVGb2xkZXJbXT4oW10pO1xyXG4gIHB1YmxpYyBmYXZvcml0ZUl0ZW1zID0gbmV3IEJlaGF2aW9yU3ViamVjdDxzdHJpbmdbXT4oW10pO1xyXG4gIHB1YmxpYyBjb3Jwb3JhdGVDYWxlbmRhckV2ZW50cyA9IG5ldyBCZWhhdmlvclN1YmplY3Q8T2ZmaWNlRXZlbnRbXT4oW10pO1xyXG4gIHB1YmxpYyBjb3Jwb3JhdGVDYWxlbmRhckV2ZW50c0NvdW50ID0gMDtcclxuICAvLyBwdWJsaWMgZW5nYWdlTm90aWZpY2F0aW9uID0gbmV3IEJlaGF2aW9yU3ViamVjdDxhbnlbXT4oW10pO1xyXG4gIC8vIHB1YmxpYyBlbmdhZ2VOb3RpZmljYXRpb25Db3VudCA9IDA7XHJcbiAgcHJpdmF0ZSBlbmdhZ2VDb25maWcgPSBuZXcgQmVoYXZpb3JTdWJqZWN0PEVuZ2FnZUNvbmZpZ0RUTz4obnVsbCk7XHJcbiAgcHVibGljIGdldCBlbmdhZ2VCRURvbWFpbigpe1xyXG4gICAgcmV0dXJuIHRoaXMuZW5nYWdlQ29uZmlnLnZhbHVlLkVOR0FHRV9ET1RDTVM7XHJcbiAgfVxyXG4gIHB1YmxpYyBnZXQgZW5nYWdlRG9tYWluKCl7XHJcbiAgICByZXR1cm4gdGhpcy5lbmdhZ2VDb25maWcudmFsdWUuRU5HQUdFO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGdldCBlbmdhZ2VBdmFpbGFibGUoKXtcclxuICAgIHJldHVybiAhIXRoaXMuZW5nYWdlQ29uZmlnLnZhbHVlO1xyXG4gIH1cclxuXHJcblxyXG4gIC8vIHRvb2xiYXJNZW51Vm9pY2VzOiBzdHJpbmc7XHJcblxyXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgaHR0cDogSHR0cENsaWVudCwgQE9wdGlvbmFsKCkgQEluamVjdChTSUlfRU5WSVJPTk1FTlQpIHByaXZhdGUgZW52aXJvbm1lbnQ6IFNpaUVudmlyb25tZW50ICwgcHJpdmF0ZSB0b29sa2l0U2VydjogU2lpVG9vbGtpdFNlcnZpY2UsIHByaXZhdGUgIHNpaXdhaXQ6IFNpaVdhaXRTZXJ2aWNlKXtcclxuXHJcbiAgICBpZiAodGhpcy5lbnZpcm9ubWVudCl7XHJcbiAgICAgIGNvbnN0IHN1YnMgPSB0aGlzLnRvb2xraXRTZXJ2LmxvZ2dlZFVzZXIucGlwZShzdGFydFdpdGgodGhpcy50b29sa2l0U2Vydi5sb2dnZWRVc2VyLnZhbHVlKSkuc3Vic2NyaWJlKGx1ID0+IHtcclxuICAgICAgICBpZiAoISFsdSAmJiAhIWx1LndvcmtlcklkKXtcclxuICAgICAgICAgIHRoaXMuY2xlYXJMb2NhbHN0b3JhZ2UoKTtcclxuICAgICAgICAgIHN1YnMudW5zdWJzY3JpYmUoKTtcclxuICAgICAgICAgIHRoaXMucHJlbG9hZE1lbnUoKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgICB0aGlzLmVuZ2FnZUNvbmZpZy5zdWJzY3JpYmUoKHJlcykgPT4ge1xyXG4gICAgICAgIGlmIChyZXMgIT09IG51bGwpe1xyXG4gICAgICAgICAgdGhpcy5mZXRjaE1lbnUoKTtcclxuICAgICAgICAgIHRoaXMubG9hZEV2ZW50c0Zyb21Db3Jwb3JhdGVJVENhbGVuZGFyKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9XHJcblxyXG5cclxuXHJcbiAgY2xlYXJMb2NhbHN0b3JhZ2UoKXtcclxuICAgIE9iamVjdC5rZXlzKHdpbmRvdy5sb2NhbFN0b3JhZ2UpLmZvckVhY2goKGxzaSkgPT4ge1xyXG4gICAgICBpZiAobHNpLnN0YXJ0c1dpdGgoJ21lbnUtJykgJiYgbHNpICE9PSAnbWVudS0nICsgdGhpcy5sb2dnZWRVc2VySWQpe1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwicmltdW92byBtZW51IGFsdHJvIHV0ZW50ZVwiKVxyXG4gICAgICAgIHdpbmRvdy5sb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbShsc2kpO1xyXG4gICAgICB9XHJcbiAgICAgIGlmIChsc2kuc3RhcnRzV2l0aCgnZmF2Vm9pY2UtJykgJiYgbHNpICE9PSAnZmF2Vm9pY2UtJyArIHRoaXMubG9nZ2VkVXNlcklkKXtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZyhcInJpbXVvdm8gZmF2Vm9pY2UgYWx0cm8gdXRlbnRlXCIpXHJcbiAgICAgICAgd2luZG93LmxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKGxzaSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgZ2V0VG9vbGJhck1lbnVWb2ljZXMoKXtcclxuICAgIGlmICh0aGlzLmVuZ2FnZUF2YWlsYWJsZSl7XHJcbiAgICAgIGNvbnN0IGhlYWRlcnMgPSBuZXcgSHR0cEhlYWRlcnMoKS5zZXQoU2lpSHR0cEludGVyY2VwdG9yU2VydmljZS5ISURFX0VSUk9SLCAndHJ1ZScpO1xyXG4gICAgICByZXR1cm4gdGhpcy5odHRwLmdldDxUb29sYmFyTWVudUR0bz4odGhpcy5lbmdhZ2VCRURvbWFpbiArICd2dGwvdG9vbGJhck1lbnU/aWQ9djEnLCB7aGVhZGVyc30pO1xyXG4gICAgfWVsc2V7XHJcbiAgICAgIHJldHVybiBvZih7bWVudTogW119KTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGZldGNoRW5nYWdlQ29uZmlnKCl7XHJcbiAgICByZXR1cm4gKCk6IFByb21pc2U8YW55PiA9PiB7XHJcbiAgICAgIHJldHVybiBuZXcgUHJvbWlzZTx2b2lkPigocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmVudmlyb25tZW50KXtcclxuICAgICAgICAgIHJlc29sdmUoKTtcclxuICAgICAgICB9ZWxzZSAgaWYgKHRoaXMuaXNFbmdhZ2Upe1xyXG4gICAgICAgICAgY29uc3QgY29uZiA9IHtFTkdBR0VfRE9UQ01TOiB0aGlzLmVudmlyb25tZW50LmRvbWFpbi5yZXBsYWNlKCcvYXBpJywgJy9zaWlfY29udGVudC9hcGknKSwgRU5HQUdFOnRoaXMuZW52aXJvbm1lbnQuZG9tYWluLnJlcGxhY2UoJy9zaWFsL2FwaScsJy8nKX07XHJcbiAgICAgICAgICB0aGlzLnJlc29sdmVBZnRlclVzZXJSZXNvbHZlKGNvbmYsIHJlc29sdmUpO1xyXG4gICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgY29uc3QgaGVhZGVycyA9IG5ldyBIdHRwSGVhZGVycygpLnNldCgnc2lpSGlkZUVycm9yJywgJ3RydWUnKTtcclxuICAgICAgICAgIHRoaXMuaHR0cC5nZXQ8RW5nYWdlQ29uZmlnRFRPPih0aGlzLmVudmlyb25tZW50LmRvbWFpbiArICcvZW5nYWdlL2NvbmZpZycsIHtoZWFkZXJzfSlcclxuICAgICAgICAgIC5zdWJzY3JpYmUoXHJcbiAgICAgICAgICAgIChyZXMpID0+IHtcclxuICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnZWNmZycsIEpTT04uc3RyaW5naWZ5KHJlcykpO1xyXG4gICAgICAgICAgICAgIHRoaXMucmVzb2x2ZUFmdGVyVXNlclJlc29sdmUocmVzLCByZXNvbHZlKTsgICAgICAgICAgfSxcclxuICAgICAgICAgICAgKCkgPT4ge1xyXG4gICAgICAgICAgICAgIGNvbnN0IGVjID0gdGhpcy5maW5kRW5nYWdlQ29uZigpO1xyXG4gICAgICAgICAgICAgIHRoaXMucmVzb2x2ZUFmdGVyVXNlclJlc29sdmUoZWMsIHJlc29sdmUpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH07XHJcbiAgfVxyXG5cclxuICBmaW5kRW5nYWdlQ29uZigpOiBFbmdhZ2VDb25maWdEVE8gfCBudWxse1xyXG4gICAgY29uc3QgZWMgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnZWNmZycpO1xyXG4gICAgaWYgKCEhZWMpe1xyXG4gICAgICByZXR1cm4gSlNPTi5wYXJzZShlYyk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGVuZHNCeVNsYXNoUChzOiBzdHJpbmcpOiBib29sZWFuIHtcclxuICAgIHJldHVybiAocy5sZW5ndGggLSAxKSA9PT0gcy5sYXN0SW5kZXhPZignLycpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSByZXNvbHZlQWZ0ZXJVc2VyUmVzb2x2ZShjb25maWd1cmF0aW9uOiBFbmdhZ2VDb25maWdEVE8gLCByZXNvbHZlKXtcclxuICAgIGNvbnN0IGx1U3Vic2NyID0gdGhpcy50b29sa2l0U2Vydi5sb2dnZWRVc2VyLnBpcGUoc3RhcnRXaXRoKHRoaXMudG9vbGtpdFNlcnYubG9nZ2VkVXNlci52YWx1ZSkpXHJcbiAgICAuc3Vic2NyaWJlKCh1c2VyKSA9PiB7XHJcbiAgICAgIGlmICh1c2VyLndvcmtlcklkICE9PSB1bmRlZmluZWQpe1xyXG4gICAgICAgIGlmICghIWNvbmZpZ3VyYXRpb24/LkVOR0FHRSAmJiAhdGhpcy5lbmRzQnlTbGFzaFAoY29uZmlndXJhdGlvbi5FTkdBR0UpKXsgY29uZmlndXJhdGlvbi5FTkdBR0UgPSAgY29uZmlndXJhdGlvbi5FTkdBR0UgKyAnLyc7IH1cclxuICAgICAgICBpZiAoISFjb25maWd1cmF0aW9uPy5FTkdBR0VfRE9UQ01TICYmICF0aGlzLmVuZHNCeVNsYXNoUChjb25maWd1cmF0aW9uLkVOR0FHRV9ET1RDTVMpKXsgY29uZmlndXJhdGlvbi5FTkdBR0VfRE9UQ01TID0gIGNvbmZpZ3VyYXRpb24uRU5HQUdFX0RPVENNUyArICcvJzsgfVxyXG4gICAgICAgIHRoaXMuZW5nYWdlQ29uZmlnLm5leHQoY29uZmlndXJhdGlvbik7XHJcbiAgICAgICAgcmVzb2x2ZSgpO1xyXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgbHVTdWJzY3I/LnVuc3Vic2NyaWJlKCk7XHJcbiAgICAgICAgfSwgMTAwMCk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBnZXRNZW51Vm9pY2VzKCl7XHJcbiAgICB0aGlzLnNpaXdhaXQuc2tpcE5leHQoKTtcclxuICAgIGNvbnN0IGhlYWRlcnMgPSBuZXcgSHR0cEhlYWRlcnMoKS5zZXQoJ3NpaUhpZGVFcnJvcicsICd0cnVlJyk7XHJcbiAgICByZXR1cm4gdGhpcy5odHRwLmdldDxTaWlNZW51Rm9sZGVyW10+KGAke3RoaXMudG9vbGtpdFNlcnYuZW52aXJvbm1lbnQuZG9tYWlufS9zaWktbWVudS9tZW51L3ZvaWNlc2AsIHtoZWFkZXJzfSk7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgZm9yY2VSZWxvYWRNZW51KCl7XHJcbiAgICBPYmplY3Qua2V5cyh3aW5kb3cubG9jYWxTdG9yYWdlKS5mb3JFYWNoKChsc2kpID0+IHtcclxuICAgICAgaWYgKGxzaS5zdGFydHNXaXRoKCdtZW51LScpIHx8IGxzaS5zdGFydHNXaXRoKCdmYXZWb2ljZS0nKSAgfHwgbHNpID09PSAnbWVudVRpbWVzdGFtcCcpe1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwicmltdW92byBtZW51IGFsdHJvIHV0ZW50ZVwiKVxyXG4gICAgICAgIHdpbmRvdy5sb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbShsc2kpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICAgIHRoaXMuZmV0Y2hNZW51KCk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGZldGNoTWVudSgpe1xyXG5cclxuICAgIGNvbnN0IG1pID0gd2luZG93LmxvY2FsU3RvcmFnZS5nZXRJdGVtKCdtZW51LScgKyB0aGlzLmxvZ2dlZFVzZXJJZCk7XHJcbiAgICBjb25zdCBtZW51VGltZXN0YW1wID0gd2luZG93LmxvY2FsU3RvcmFnZS5nZXRJdGVtKCdtZW51VGltZXN0YW1wJyk7XHJcbiAgICBpZiAobWkgPT0gbnVsbCB8fCBtZW51VGltZXN0YW1wID09IG51bGwgfHwgKChuZXcgRGF0ZSgpLmdldFRpbWUoKSkgLSBwYXJzZUludChtZW51VGltZXN0YW1wLCAxMCkgIC0gKDIgKiA2MCAqIDYwICogMTAwMCkgPiAwKSl7XHJcbiAgICAgIHRoaXMuZ2V0TWVudVZvaWNlcygpLnN1YnNjcmliZSgocmVzKSA9PiB7XHJcbiAgICAgICAgd2luZG93LmxvY2FsU3RvcmFnZS5zZXRJdGVtKCdtZW51LScgKyB0aGlzLmxvZ2dlZFVzZXJJZCwgSlNPTi5zdHJpbmdpZnkocmVzKSk7XHJcbiAgICAgICAgd2luZG93LmxvY2FsU3RvcmFnZS5zZXRJdGVtKCdtZW51VGltZXN0YW1wJywgbmV3IERhdGUoKS5nZXRUaW1lKCkudG9TdHJpbmcoKSk7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50TWVudS5uZXh0KHJlcyk7XHJcbiAgICAgICAgdGhpcy5mZXRjaEZhdm9yaXRlc1ZvaWNlcygpO1xyXG4gICAgICB9KTtcclxuICAgIH1lbHNle1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdtZW51ICBnacOgIGNhcmljYXRvIG5lbCBwcmVsb2FkTWVudScpO1xyXG4gICAgICAgIHRoaXMuZmV0Y2hGYXZvcml0ZXNWb2ljZXMoKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHByaXZhdGUgcHJlbG9hZE1lbnUoKXtcclxuICAgIGNvbnN0IG1pID0gd2luZG93LmxvY2FsU3RvcmFnZS5nZXRJdGVtKCdtZW51LScgKyB0aGlzLmxvZ2dlZFVzZXJJZCk7XHJcbiAgICBpZiAobWkgIT0gbnVsbCl7XHJcbiAgICAgICAgIHRoaXMuY3VycmVudE1lbnUubmV4dChKU09OLnBhcnNlKG1pKSk7XHJcbiAgICAgICAgIHRoaXMucHJlbG9hZExvY2FsRmF2b3JpdGVzVm9pY2VzKCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBmZXRjaEZhdm9yaXRlc1ZvaWNlcygpe1xyXG4gICAgdGhpcy5nZXRNZW51RmF2b3JpdGVWb2ljZXMoKS5zdWJzY3JpYmUoKHJlcykgPT4ge1xyXG4gICAgICBpZiAodGhpcy5mYXZvcml0ZUl0ZW1zLnZhbHVlID09IG51bGwgfHwgSlNPTi5zdHJpbmdpZnkodGhpcy5mYXZvcml0ZUl0ZW1zLnZhbHVlKSAhPT0gSlNPTi5zdHJpbmdpZnkocmVzKSl7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ2Zhdm9yaXRpIGNhbWJpYXRpLCBsaSBhZ2dpb3JubycpO1xyXG4gICAgICAgIC8vIHNlIGkgZmF2b3JpdGkgbm9uIGVyYW5vIHNhbHZhdGkgaW4gc2Vzc2lvbmUgb3BwdXJlIHNvbm8gZGl2ZXJzaSBkYSBxdWVsbGkgY2FyaWNhdGlcclxuICAgICAgICB0aGlzLmZhdm9yaXRlSXRlbXMubmV4dChyZXMpO1xyXG4gICAgICAgIHdpbmRvdy5sb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnZmF2Vm9pY2UtJyArIHRoaXMubG9nZ2VkVXNlcklkLCBKU09OLnN0cmluZ2lmeShyZXMpKTtcclxuICAgICAgfWVsc2V7XHJcbiAgICAgIC8vIGNvbnNvbGUubG9nKCdmYXZvcml0aSBOT04gY2FtYmlhdGknKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gIH1cclxuXHJcbiAgcHJlbG9hZExvY2FsRmF2b3JpdGVzVm9pY2VzKCl7XHJcbiAgICBjb25zdCBsb2NhbEYgPSB3aW5kb3cubG9jYWxTdG9yYWdlLmdldEl0ZW0oJ2ZhdlZvaWNlLScgKyB0aGlzLmxvZ2dlZFVzZXJJZCk7XHJcbiAgICBpZiAobG9jYWxGICE9IG51bGwpe1xyXG4gICAgICB0aGlzLmZhdm9yaXRlSXRlbXMubmV4dChKU09OLnBhcnNlKGxvY2FsRikpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZ2V0TWVudUZhdm9yaXRlVm9pY2VzKCl7XHJcbiAgICB0aGlzLnNpaXdhaXQuc2tpcE5leHQoKTtcclxuICAgIGNvbnN0IGhlYWRlcnMgPSBuZXcgSHR0cEhlYWRlcnMoKS5zZXQoU2lpSHR0cEludGVyY2VwdG9yU2VydmljZS5ISURFX0VSUk9SLCAndHJ1ZScpO1xyXG4gICAgcmV0dXJuIHRoaXMuaHR0cC5nZXQ8c3RyaW5nW10+KGAke3RoaXMudG9vbGtpdFNlcnYuZW52aXJvbm1lbnQuZG9tYWlufS9zaWktbWVudS9tZW51L2Zhdm9yaXRlYCwge2hlYWRlcnN9KTtcclxuICB9XHJcbiAgc2F2ZUZhdm9yaXRlc1ZvaWNlKGZhdjogc3RyaW5nW10pe1xyXG4gICAgcmV0dXJuIHRoaXMuaHR0cC5wb3N0KGAke3RoaXMudG9vbGtpdFNlcnYuZW52aXJvbm1lbnQuZG9tYWlufS9zaWktbWVudS9tZW51L3NhdmVGYXZvcml0ZWAsIGZhdi5qb2luKCcsJykpO1xyXG4gIH1cclxuXHJcbiAgLy8gbG9hZE5vdGlmaWNhdGlvbnMoKXtcclxuICAvLyAgIGlmICh0aGlzLmVuZ2FnZUF2YWlsYWJsZSl7XHJcbiAgLy8gICAgIGNvbnN0IGhlYWRlcnMgPSBuZXcgSHR0cEhlYWRlcnMoKS5zZXQoU2lpSHR0cEludGVyY2VwdG9yU2VydmljZS5ISURFX0VSUk9SLCAndHJ1ZScpO1xyXG4gIC8vICAgICB0aGlzLmh0dHAuZ2V0PGFueT4odGhpcy5lbmdhZ2VCRURvbWFpbiArICd2dGwvbm90aWZpY2F0aW9ucz9sYW5ndWFnZUlkPScgKyB0aGlzLmxhbmd1YWdlSWQsIHtoZWFkZXJzfSlcclxuICAvLyAgICAgICAuc3Vic2NyaWJlKG5qID0+IHtcclxuICAvLyAgICAgICAgICAgdGhpcy5lbmdhZ2VOb3RpZmljYXRpb24ubmV4dChuai5yZXN1bHRzLm1hcChpID0+IHtpLm5vdGlmaWNhdGlvbkRhdGUgPSBuZXcgRGF0ZShpLm5vdGlmaWNhdGlvbkRhdGUpOyByZXR1cm4gaTsgfSkpO1xyXG4gIC8vICAgICAgICAgICB0aGlzLmVuZ2FnZU5vdGlmaWNhdGlvbkNvdW50ID0gbmoucmVzdWx0cy5sZW5ndGg7XHJcbiAgLy8gICAgICAgfSwgZXJyID0+IHRoaXMuZW5nYWdlTm90aWZpY2F0aW9uLm5leHQoW10pKSA7XHJcbiAgLy8gICB9XHJcbiAgLy8gfVxyXG5cclxuICBsb2FkRXZlbnRzRnJvbUNvcnBvcmF0ZUlUQ2FsZW5kYXIoKXtcclxuICAgIGlmICh0aGlzLmVuZ2FnZUF2YWlsYWJsZSl7XHJcbiAgICAgIGxldCBoZWFkZXJzID0gbmV3IEh0dHBIZWFkZXJzKClcclxuICAgICAgLmFwcGVuZCgnc2lpSGlkZUVycm9yJywgJ3RydWUnKTtcclxuXHJcbiAgICAgIGNvbnN0IHR6ID0gSW50bC5EYXRlVGltZUZvcm1hdCgpLnJlc29sdmVkT3B0aW9ucygpLnRpbWVab25lO1xyXG4gICAgICBpZiAoISF0eil7XHJcbiAgICAgICAgaGVhZGVycyA9IGhlYWRlcnMuYXBwZW5kKCdQcmVmZXInLGBvdXRsb29rLnRpbWV6b25lPVwiJHt0en1cImApO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBjb25zdCB0b2RheT1uZXcgRGF0ZSgpO1xyXG4gICAgICAvLyBjb25zdCB0b21vcnJvdz1uZXcgRGF0ZSgpO1xyXG4gICAgICAvLyB0b21vcnJvdy5zZXREYXRlKHRvbW9ycm93LmdldERhdGUoKSArIDEpOy8vMm1lc2lcclxuXHJcbiAgICAgIHZhciBzdGFydCA9IG5ldyBEYXRlKCk7XHJcbiAgICAgIHN0YXJ0LnNldEhvdXJzKDAsMCwwLDApO1xyXG5cclxuICAgICAgdmFyIGVuZCA9IG5ldyBEYXRlKCk7XHJcbiAgICAgIGVuZC5zZXREYXRlKGVuZC5nZXREYXRlKCkgKyAxKTsvLzJtZXNpXHJcbiAgICAgIGVuZC5zZXRIb3VycygyMyw1OSw1OSw5OTkpO1xyXG5cclxuICAgICAgbGV0IHBhcmFtcyA9IG5ldyBIdHRwUGFyYW1zKClcclxuICAgICAgLmFwcGVuZCgnJHNlbGVjdCcsIFwic3ViamVjdCxib2R5LGJvZHlQcmV2aWV3LHN0YXJ0LGVuZCxpc0FsbERheVwiKVxyXG4gICAgICAuYXBwZW5kKCdzdGFydGRhdGV0aW1lJywgc3RhcnQudG9JU09TdHJpbmcoKSlcclxuICAgICAgLmFwcGVuZCgnZW5kZGF0ZXRpbWUnLCBlbmQudG9JU09TdHJpbmcoKSlcclxuICAgICAgLmFwcGVuZCgnJHRvcCcsIDE1KTtcclxuXHJcbiAgICAgIHRoaXMuc2lpd2FpdC5za2lwTmV4dCgpXHJcbiAgICAgIHRoaXMuaHR0cC5nZXQ8T2ZmaWNlQ2FsZW5kYXJFdmVudHM+KHRoaXMuZW5nYWdlRG9tYWluICsgJ3NpYWwvY29ycG9yYXRlQ2FsZW5kYXIvY2FsZW5kYXJ2aWV3P2xhbmd1YWdlSWQ9JyArIHRoaXMubGFuZ3VhZ2VJZCwge3BhcmFtcyxoZWFkZXJzfSlcclxuICAgICAgICAuc3Vic2NyaWJlKG5qID0+IHtcclxuICAgICAgICAgICAgdGhpcy5jb3Jwb3JhdGVDYWxlbmRhckV2ZW50cy5uZXh0KHRoaXMuYnVpbGRDb3Jwb3JhdGVJdEV2ZW50RGF0YShuai52YWx1ZSkpO1xyXG4gICAgICAgICAgICB0aGlzLmNvcnBvcmF0ZUNhbGVuZGFyRXZlbnRzQ291bnQgPSBuai52YWx1ZS5sZW5ndGg7XHJcbiAgICAgICAgfSwgZXJyID0+IHRoaXMuY29ycG9yYXRlQ2FsZW5kYXJFdmVudHMubmV4dChbXSkpIDtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHByaXZhdGUgYnVpbGRDb3Jwb3JhdGVJdEV2ZW50RGF0YShvcmlnaW5hbERhdGE6T2ZmaWNlRXZlbnRbXSl7XHJcbiAgICBjb25zdCBzaWlEYXRlUGlwZSA9IG5ldyBTaWlEYXRlUGlwZSh0aGlzLnRvb2xraXRTZXJ2KVxyXG4gICAgY29uc3QgZGF0YT1bLi4ub3JpZ2luYWxEYXRhXVxyXG4gICAgY29uc3QgdG9kYXk9bmV3IERhdGUobmV3IERhdGUoKS5nZXRGdWxsWWVhcigpLCBuZXcgRGF0ZSgpLmdldE1vbnRoKCksIG5ldyBEYXRlKCkuZ2V0RGF0ZSgpKS5nZXRUaW1lKCk7XHJcbiAgICBkYXRhLmZvckVhY2goKGQsaSxhKT0+e1xyXG4gICAgICBjb25zdCBldmVudERhdGU9IG5ldyBEYXRlKGQuc3RhcnQuZGF0ZVRpbWUpXHJcbiAgICAgIGNvbnN0ICBldkRhdGVOb1RpbWU9IG5ldyBEYXRlKGV2ZW50RGF0ZS5nZXRGdWxsWWVhcigpLCBldmVudERhdGUuZ2V0TW9udGgoKSwgZXZlbnREYXRlLmdldERhdGUoKSkuZ2V0VGltZSgpO1xyXG4gICAgICBkLmRhdGU9IHNpaURhdGVQaXBlLnRyYW5zZm9ybShldmVudERhdGUpO1xyXG4gICAgICBkLnRpbWUgPSBTdHJpbmcoZXZlbnREYXRlLmdldEhvdXJzKCklMTIpLnBhZFN0YXJ0KDIsICcwJykrXCI6XCIrU3RyaW5nKGV2ZW50RGF0ZS5nZXRNaW51dGVzKCkpLnBhZFN0YXJ0KDIsICcwJykrKGV2ZW50RGF0ZS5nZXRIb3VycygpID4gMTIgPyAnIFBNJyA6ICcgQU0nKTtcclxuICAgICAgY29uc3QgZGF5RGlmZj0gTWF0aC5mbG9vcigoZXZEYXRlTm9UaW1lLXRvZGF5KS8oMjQqMzYwMCoxMDAwKSk7XHJcbiAgICAgIGlmKGRheURpZmY9PTApeyBkLnN0YXR1cz1TaWlFdmVudFN0YXR1cy5TQ0FERU5aQV9PR0dJO31cclxuICAgICAgZWxzZSBpZihkYXlEaWZmPC01KXsgZC5zdGF0dXM9U2lpRXZlbnRTdGF0dXMuVkVDQ0hJQTt9XHJcbiAgICAgIGVsc2UgaWYoZGF5RGlmZjwwICYmIGRheURpZmY+PS01KXsgZC5zdGF0dXM9U2lpRXZlbnRTdGF0dXMuU0NBRFVUQTt9XHJcbiAgICAgIGVsc2UgaWYoZGF5RGlmZj4wICYmIGRheURpZmY8PTUpeyBkLnN0YXR1cz1TaWlFdmVudFN0YXR1cy5JTl9TQ0FERU5aQTt9XHJcbiAgICAgIGVsc2UgaWYoZGF5RGlmZj41KXsgZC5zdGF0dXM9U2lpRXZlbnRTdGF0dXMuUFJPU1NJTUFNRU5URTt9XHJcblxyXG4gICAgICBpZihpIT0wKXtcclxuICAgICAgICBjb25zdCBwcmV2SXRlbURhdGU9IG5ldyBEYXRlKGFbaS0xXS5zdGFydC5kYXRlVGltZSk7XHJcbiAgICAgICAgZC5oaWRlRGF0YT0gbmV3IERhdGUocHJldkl0ZW1EYXRlLmdldEZ1bGxZZWFyKCksIHByZXZJdGVtRGF0ZS5nZXRNb250aCgpLCBwcmV2SXRlbURhdGUuZ2V0RGF0ZSgpLDAsMCwwLDApLmdldFRpbWUoKT09ZXZEYXRlTm9UaW1lO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICAgIC8vIHRoaXMuZGF0YT1kYXRhO1xyXG4gICAgcmV0dXJuIGRhdGE7XHJcbiAgfVxyXG5cclxuXHJcblxyXG5cclxufVxyXG4iXX0=