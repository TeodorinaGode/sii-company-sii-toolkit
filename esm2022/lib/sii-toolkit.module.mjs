import { APP_INITIALIZER, LOCALE_ID, NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { SiiHttpInterceptorService } from './service/sii-http-interceptor.service';
import { SiiToolkitService } from './sii-toolkit.service';
import { SIIDateAdapter } from './common/SiiDateAdapter';
import { registerLocaleData } from '@angular/common';
import localeIt from '@angular/common/locales/it';
import localeEn from '@angular/common/locales/en';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { SiiDatePipe } from './components/util/sii-date.pipe';
import { DialogNoIEComponent } from './common/dialog-no-ie/dialog-no-ie.component';
import { SiiEngageService } from './service/sii-engage.service';
import { SiiBreadcrumbService } from './components/breadcrumb/services/breadcrumb.service';
import * as i0 from "@angular/core";
import * as i1 from "@angular/material/icon";
import * as i2 from "@angular/platform-browser";
import * as i3 from "@angular/material/dialog";
registerLocaleData(localeIt);
registerLocaleData(localeEn);
// export const ENGAGE_CONFIG = new InjectionToken<BehaviorSubject<EngageConfigDTO>>('toolkit.engageConfig');
export class SiiToolkitModule {
    constructor(matIconRegistry, domSanitizer, dialog) {
        //  this.checkIfOldBrowser();
        this.dialog = dialog;
        matIconRegistry.addSvgIconSet(domSanitizer.bypassSecurityTrustResourceUrl('./assets/sii_icons.svg'));
        matIconRegistry.addSvgIcon('upload-solid', domSanitizer.bypassSecurityTrustResourceUrl('./assets/icons/upload-solid.svg'));
        matIconRegistry.addSvgIcon('attachment', domSanitizer.bypassSecurityTrustResourceUrl('./assets/icons/attachment.svg'));
        matIconRegistry.addSvgIcon('file_signature', domSanitizer.bypassSecurityTrustResourceUrl('./assets/icons/file_signature.svg'));
        matIconRegistry.addSvgIcon('receipt_download', domSanitizer.bypassSecurityTrustResourceUrl('./assets/icons/receipt_download.svg'));
        matIconRegistry.addSvgIcon('logo_engage', domSanitizer.bypassSecurityTrustResourceUrl('./assets/icons/logo-engage-neg.svg'));
        matIconRegistry.addSvgIcon('file', domSanitizer.bypassSecurityTrustResourceUrl('./assets/icons/file-solid.svg'));
        matIconRegistry.addSvgIcon('file-csv', domSanitizer.bypassSecurityTrustResourceUrl('./assets/icons/file-csv-solid.svg'));
        matIconRegistry.addSvgIcon('file-excel', domSanitizer.bypassSecurityTrustResourceUrl('./assets/icons/file-excel-solid.svg'));
        matIconRegistry.addSvgIcon('file-image', domSanitizer.bypassSecurityTrustResourceUrl('./assets/icons/file-image-solid.svg'));
        matIconRegistry.addSvgIcon('file-pdf', domSanitizer.bypassSecurityTrustResourceUrl('./assets/icons/file-pdf-solid.svg'));
        matIconRegistry.addSvgIcon('file-powerpoint', domSanitizer.bypassSecurityTrustResourceUrl('./assets/icons/file-powerpoint-solid.svg'));
        matIconRegistry.addSvgIcon('file-word', domSanitizer.bypassSecurityTrustResourceUrl('./assets/icons/file-word-solid.svg'));
        matIconRegistry.addSvgIcon('menu-calendar', domSanitizer.bypassSecurityTrustResourceUrl('./assets/icons/menu-icon-calendar.svg'));
        matIconRegistry.addSvgIcon('menu-notifications', domSanitizer.bypassSecurityTrustResourceUrl('./assets/icons/menu-icon-notifiche.svg'));
        matIconRegistry.addSvgIcon('menu-download', domSanitizer.bypassSecurityTrustResourceUrl('./assets/icons/menu-download.svg'));
    }
    checkIfOldBrowser() {
        const ua = window.navigator.userAgent; // Check the userAgent property of the window.navigator object
        const msie = ua.indexOf('MSIE '); // IE 10 or older
        const trident = ua.indexOf('Trident/'); // IE 11
        if (msie > 0 || trident > 0) {
            this.dialog.open(DialogNoIEComponent, {
                disableClose: true,
                minHeight: '100vh',
                maxHeight: '100vh',
                minWidth: '100vw',
                maxWidth: '100vw'
            });
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: SiiToolkitModule, deps: [{ token: i1.MatIconRegistry }, { token: i2.DomSanitizer }, { token: i3.MatDialog }], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "18.2.13", ngImport: i0, type: SiiToolkitModule }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: SiiToolkitModule, providers: [
            // SiiWaitService,
            SiiDatePipe,
            { provide: HTTP_INTERCEPTORS, useClass: SiiHttpInterceptorService, multi: true },
            // { provide: HTTP_INTERCEPTORS, useClass:  DotCmsInterceptorService, multi: true},
            {
                provide: APP_INITIALIZER,
                // useFactory: (sts) => sts.initializeMySelf(),
                useFactory(sts) { return sts.initializeMySelf(); },
                deps: [SiiToolkitService],
                multi: true
            },
            {
                provide: APP_INITIALIZER,
                // useFactory: (sts) => sts.initializeMySelf(),
                useFactory(sts) { return sts.fetchEngageConfig(); },
                deps: [SiiEngageService],
                multi: true
            },
            {
                provide: APP_INITIALIZER,
                // useFactory: (sts) => sts.initializeMySelf(),
                useFactory(sbs) { return sbs.init(); },
                deps: [SiiBreadcrumbService],
                multi: true
            },
            // {
            //   provide:  ENGAGE_CONFIG,
            //   useFactory(sts){return sts.engageConfig; },
            //   deps: [EngageConfigurationsParamsService],
            // },
            {
                provide: LOCALE_ID,
                deps: [SiiToolkitService],
                useFactory(siiToolkitService) {
                    // return 'en';
                    return siiToolkitService.loggedUser.value.locale || 'it';
                }
            },
            { provide: DateAdapter, useClass: SIIDateAdapter },
            { provide: MAT_DATE_FORMATS, deps: [SiiToolkitService], useFactory: (st) => st.getMatDateConfig() },
            provideHttpClient(withInterceptorsFromDi()),
        ] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: SiiToolkitModule, decorators: [{
            type: NgModule,
            args: [{
                    providers: [
                        // SiiWaitService,
                        SiiDatePipe,
                        { provide: HTTP_INTERCEPTORS, useClass: SiiHttpInterceptorService, multi: true },
                        // { provide: HTTP_INTERCEPTORS, useClass:  DotCmsInterceptorService, multi: true},
                        {
                            provide: APP_INITIALIZER,
                            // useFactory: (sts) => sts.initializeMySelf(),
                            useFactory(sts) { return sts.initializeMySelf(); },
                            deps: [SiiToolkitService],
                            multi: true
                        },
                        {
                            provide: APP_INITIALIZER,
                            // useFactory: (sts) => sts.initializeMySelf(),
                            useFactory(sts) { return sts.fetchEngageConfig(); },
                            deps: [SiiEngageService],
                            multi: true
                        },
                        {
                            provide: APP_INITIALIZER,
                            // useFactory: (sts) => sts.initializeMySelf(),
                            useFactory(sbs) { return sbs.init(); },
                            deps: [SiiBreadcrumbService],
                            multi: true
                        },
                        // {
                        //   provide:  ENGAGE_CONFIG,
                        //   useFactory(sts){return sts.engageConfig; },
                        //   deps: [EngageConfigurationsParamsService],
                        // },
                        {
                            provide: LOCALE_ID,
                            deps: [SiiToolkitService],
                            useFactory(siiToolkitService) {
                                // return 'en';
                                return siiToolkitService.loggedUser.value.locale || 'it';
                            }
                        },
                        { provide: DateAdapter, useClass: SIIDateAdapter },
                        { provide: MAT_DATE_FORMATS, deps: [SiiToolkitService], useFactory: (st) => st.getMatDateConfig() },
                        provideHttpClient(withInterceptorsFromDi()),
                    ]
                }]
        }], ctorParameters: () => [{ type: i1.MatIconRegistry }, { type: i2.DomSanitizer }, { type: i3.MatDialog }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2lpLXRvb2xraXQubW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vcHJvamVjdHMvc2lpLXRvb2xraXQvc3JjL2xpYi9zaWktdG9vbGtpdC5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLGVBQWUsRUFBRSxTQUFTLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRXJFLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxpQkFBaUIsRUFBRSxzQkFBc0IsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBR3BHLE9BQU8sRUFBRSx5QkFBeUIsRUFBRSxNQUFNLHdDQUF3QyxDQUFDO0FBRW5GLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBQzFELE9BQU8sRUFBQyxjQUFjLEVBQUMsTUFBTSx5QkFBeUIsQ0FBQztBQUV2RCxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUNyRCxPQUFPLFFBQVEsTUFBTSw0QkFBNEIsQ0FBQztBQUNsRCxPQUFPLFFBQVEsTUFBTSw0QkFBNEIsQ0FBQztBQUNsRCxPQUFPLEVBQUUsV0FBVyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sd0JBQXdCLENBQUM7QUFDdkUsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLGlDQUFpQyxDQUFDO0FBQzlELE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxNQUFNLDhDQUE4QyxDQUFDO0FBRW5GLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLDhCQUE4QixDQUFDO0FBQ2hFLE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxNQUFNLHFEQUFxRCxDQUFDOzs7OztBQUkzRixrQkFBa0IsQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUM3QixrQkFBa0IsQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUU3Qiw2R0FBNkc7QUFpRDdHLE1BQU0sT0FBTyxnQkFBZ0I7SUFDM0IsWUFBWSxlQUFnQyxFQUFFLFlBQTBC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Q0QsSUFBSTt3QkFDSiw2QkFBNkI7d0JBQzdCLGdEQUFnRDt3QkFDaEQsK0NBQStDO3dCQUMvQyxLQUFLO3dCQUNMOzRCQUNJLE9BQU8sRUFBRSxTQUFTOzRCQUNsQixJQUFJLEVBQUUsQ0FBQyxpQkFBaUIsQ0FBQzs0QkFDekIsVUFBVSxDQUFDLGlCQUFvQztnQ0FDM0MsZUFBZTtnQ0FDZixPQUFPLGlCQUFpQixDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQzs0QkFDN0QsQ0FBQzt5QkFDSjt3QkFDRCxFQUFFLE9BQU8sRUFBRSxXQUFXLEVBQUUsUUFBUSxFQUFFLGNBQWMsRUFBRTt3QkFDbEQsRUFBRSxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsSUFBSSxFQUFFLENBQUMsaUJBQWlCLENBQUMsRUFBRSxVQUFVLEVBQUUsQ0FBQyxFQUFxQixFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsZ0JBQWdCLEVBQUUsRUFBRTt3QkFDdEgsaUJBQWlCLENBQUMsc0JBQXNCLEVBQUUsQ0FBQztxQkFDOUM7aUJBQUUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBUFBfSU5JVElBTElaRVIsIExPQ0FMRV9JRCwgTmdNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgRG9tU2FuaXRpemVyIH0gZnJvbSAnQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3Nlcic7XHJcbmltcG9ydCB7IEhUVFBfSU5URVJDRVBUT1JTLCBwcm92aWRlSHR0cENsaWVudCwgd2l0aEludGVyY2VwdG9yc0Zyb21EaSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcclxuXHJcbmltcG9ydCB7IEVycm9yRGlzcGxheVNlcnZpY2UgfSBmcm9tICcuL2NvbXBvbmVudHMvZXJyb3ItZGlzcGxheS1kaWFsb2cvZXJyb3ItZGlzcGxheS5zZXJ2aWNlJztcclxuaW1wb3J0IHsgU2lpSHR0cEludGVyY2VwdG9yU2VydmljZSB9IGZyb20gJy4vc2VydmljZS9zaWktaHR0cC1pbnRlcmNlcHRvci5zZXJ2aWNlJztcclxuaW1wb3J0IHsgTWF0SWNvblJlZ2lzdHJ5IH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvaWNvbic7XHJcbmltcG9ydCB7IFNpaVRvb2xraXRTZXJ2aWNlIH0gZnJvbSAnLi9zaWktdG9vbGtpdC5zZXJ2aWNlJztcclxuaW1wb3J0IHtTSUlEYXRlQWRhcHRlcn0gZnJvbSAnLi9jb21tb24vU2lpRGF0ZUFkYXB0ZXInO1xyXG5cclxuaW1wb3J0IHsgcmVnaXN0ZXJMb2NhbGVEYXRhIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcclxuaW1wb3J0IGxvY2FsZUl0IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9sb2NhbGVzL2l0JztcclxuaW1wb3J0IGxvY2FsZUVuIGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9sb2NhbGVzL2VuJztcclxuaW1wb3J0IHsgRGF0ZUFkYXB0ZXIsIE1BVF9EQVRFX0ZPUk1BVFMgfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9jb3JlJztcclxuaW1wb3J0IHsgU2lpRGF0ZVBpcGUgfSBmcm9tICcuL2NvbXBvbmVudHMvdXRpbC9zaWktZGF0ZS5waXBlJztcclxuaW1wb3J0IHsgRGlhbG9nTm9JRUNvbXBvbmVudCB9IGZyb20gJy4vY29tbW9uL2RpYWxvZy1uby1pZS9kaWFsb2ctbm8taWUuY29tcG9uZW50JztcclxuaW1wb3J0IHsgTWF0RGlhbG9nIH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvZGlhbG9nJztcclxuaW1wb3J0IHsgU2lpRW5nYWdlU2VydmljZSB9IGZyb20gJy4vc2VydmljZS9zaWktZW5nYWdlLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBTaWlCcmVhZGNydW1iU2VydmljZSB9IGZyb20gJy4vY29tcG9uZW50cy9icmVhZGNydW1iL3NlcnZpY2VzL2JyZWFkY3J1bWIuc2VydmljZSc7XHJcbmltcG9ydCB7IFNpaURvd25sb2FkU2VydmljZSB9IGZyb20gJy4vc2VydmljZS9zaWktZG93bmxvYWQtc2VydmljZSc7XHJcblxyXG5cclxucmVnaXN0ZXJMb2NhbGVEYXRhKGxvY2FsZUl0KTtcclxucmVnaXN0ZXJMb2NhbGVEYXRhKGxvY2FsZUVuKTtcclxuXHJcbi8vIGV4cG9ydCBjb25zdCBFTkdBR0VfQ09ORklHID0gbmV3IEluamVjdGlvblRva2VuPEJlaGF2aW9yU3ViamVjdDxFbmdhZ2VDb25maWdEVE8+PigndG9vbGtpdC5lbmdhZ2VDb25maWcnKTtcclxuXHJcblxyXG5ATmdNb2R1bGUoe1xyXG4gICAgcHJvdmlkZXJzOiBbXHJcbiAgICAgICAgLy8gU2lpV2FpdFNlcnZpY2UsXHJcbiAgICAgICAgU2lpRGF0ZVBpcGUsXHJcbiAgICAgICAgeyBwcm92aWRlOiBIVFRQX0lOVEVSQ0VQVE9SUywgdXNlQ2xhc3M6IFNpaUh0dHBJbnRlcmNlcHRvclNlcnZpY2UsIG11bHRpOiB0cnVlIH0sXHJcbiAgICAgICAgLy8geyBwcm92aWRlOiBIVFRQX0lOVEVSQ0VQVE9SUywgdXNlQ2xhc3M6ICBEb3RDbXNJbnRlcmNlcHRvclNlcnZpY2UsIG11bHRpOiB0cnVlfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHByb3ZpZGU6IEFQUF9JTklUSUFMSVpFUixcclxuICAgICAgICAgICAgLy8gdXNlRmFjdG9yeTogKHN0cykgPT4gc3RzLmluaXRpYWxpemVNeVNlbGYoKSxcclxuICAgICAgICAgICAgdXNlRmFjdG9yeShzdHMpIHsgcmV0dXJuIHN0cy5pbml0aWFsaXplTXlTZWxmKCk7IH0sXHJcbiAgICAgICAgICAgIGRlcHM6IFtTaWlUb29sa2l0U2VydmljZV0sXHJcbiAgICAgICAgICAgIG11bHRpOiB0cnVlXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHByb3ZpZGU6IEFQUF9JTklUSUFMSVpFUixcclxuICAgICAgICAgICAgLy8gdXNlRmFjdG9yeTogKHN0cykgPT4gc3RzLmluaXRpYWxpemVNeVNlbGYoKSxcclxuICAgICAgICAgICAgdXNlRmFjdG9yeShzdHMpIHsgcmV0dXJuIHN0cy5mZXRjaEVuZ2FnZUNvbmZpZygpOyB9LFxyXG4gICAgICAgICAgICBkZXBzOiBbU2lpRW5nYWdlU2VydmljZV0sXHJcbiAgICAgICAgICAgIG11bHRpOiB0cnVlXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHByb3ZpZGU6IEFQUF9JTklUSUFMSVpFUixcclxuICAgICAgICAgICAgLy8gdXNlRmFjdG9yeTogKHN0cykgPT4gc3RzLmluaXRpYWxpemVNeVNlbGYoKSxcclxuICAgICAgICAgICAgdXNlRmFjdG9yeShzYnMpIHsgcmV0dXJuIHNicy5pbml0KCk7IH0sXHJcbiAgICAgICAgICAgIGRlcHM6IFtTaWlCcmVhZGNydW1iU2VydmljZV0sXHJcbiAgICAgICAgICAgIG11bHRpOiB0cnVlXHJcbiAgICAgICAgfSxcclxuICAgICAgICAvLyB7XHJcbiAgICAgICAgLy8gICBwcm92aWRlOiAgRU5HQUdFX0NPTkZJRyxcclxuICAgICAgICAvLyAgIHVzZUZhY3Rvcnkoc3RzKXtyZXR1cm4gc3RzLmVuZ2FnZUNvbmZpZzsgfSxcclxuICAgICAgICAvLyAgIGRlcHM6IFtFbmdhZ2VDb25maWd1cmF0aW9uc1BhcmFtc1NlcnZpY2VdLFxyXG4gICAgICAgIC8vIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBwcm92aWRlOiBMT0NBTEVfSUQsXHJcbiAgICAgICAgICAgIGRlcHM6IFtTaWlUb29sa2l0U2VydmljZV0sXHJcbiAgICAgICAgICAgIHVzZUZhY3Rvcnkoc2lpVG9vbGtpdFNlcnZpY2U6IFNpaVRvb2xraXRTZXJ2aWNlKSB7XHJcbiAgICAgICAgICAgICAgICAvLyByZXR1cm4gJ2VuJztcclxuICAgICAgICAgICAgICAgIHJldHVybiBzaWlUb29sa2l0U2VydmljZS5sb2dnZWRVc2VyLnZhbHVlLmxvY2FsZSB8fCAnaXQnO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICB7IHByb3ZpZGU6IERhdGVBZGFwdGVyLCB1c2VDbGFzczogU0lJRGF0ZUFkYXB0ZXIgfSxcclxuICAgICAgICB7IHByb3ZpZGU6IE1BVF9EQVRFX0ZPUk1BVFMsIGRlcHM6IFtTaWlUb29sa2l0U2VydmljZV0sIHVzZUZhY3Rvcnk6IChzdDogU2lpVG9vbGtpdFNlcnZpY2UpID0+IHN0LmdldE1hdERhdGVDb25maWcoKSB9LFxyXG4gICAgICAgIHByb3ZpZGVIdHRwQ2xpZW50KHdpdGhJbnRlcmNlcHRvcnNGcm9tRGkoKSksXHJcbiAgICBdIH0pXHJcblxyXG5cclxuZXhwb3J0IGNsYXNzIFNpaVRvb2xraXRNb2R1bGUge1xyXG4gIGNvbnN0cnVjdG9yKG1hdEljb25SZWdpc3RyeTogTWF0SWNvblJlZ2lzdHJ5LCBkb21TYW5pdGl6ZXI6IERvbVNhbml0aXplciwgcHJpdmF0ZSBkaWFsb2c6IE1hdERpYWxvZykge1xyXG4gICAgLy8gIHRoaXMuY2hlY2tJZk9sZEJyb3dzZXIoKTtcclxuXHJcbiBcclxuICAgICBtYXRJY29uUmVnaXN0cnkuYWRkU3ZnSWNvblNldChkb21TYW5pdGl6ZXIuYnlwYXNzU2VjdXJpdHlUcnVzdFJlc291cmNlVXJsKCcuL2Fzc2V0cy9zaWlfaWNvbnMuc3ZnJykpO1xyXG4gICAgIG1hdEljb25SZWdpc3RyeS5hZGRTdmdJY29uKCd1cGxvYWQtc29saWQnLCBkb21TYW5pdGl6ZXIuYnlwYXNzU2VjdXJpdHlUcnVzdFJlc291cmNlVXJsKCcuL2Fzc2V0cy9pY29ucy91cGxvYWQtc29saWQuc3ZnJykpO1xyXG4gICAgIG1hdEljb25SZWdpc3RyeS5hZGRTdmdJY29uKCdhdHRhY2htZW50JywgZG9tU2FuaXRpemVyLmJ5cGFzc1NlY3VyaXR5VHJ1c3RSZXNvdXJjZVVybCgnLi9hc3NldHMvaWNvbnMvYXR0YWNobWVudC5zdmcnKSk7XHJcbiAgICAgbWF0SWNvblJlZ2lzdHJ5LmFkZFN2Z0ljb24oJ2ZpbGVfc2lnbmF0dXJlJywgZG9tU2FuaXRpemVyLmJ5cGFzc1NlY3VyaXR5VHJ1c3RSZXNvdXJjZVVybCgnLi9hc3NldHMvaWNvbnMvZmlsZV9zaWduYXR1cmUuc3ZnJykpO1xyXG4gICAgIG1hdEljb25SZWdpc3RyeS5hZGRTdmdJY29uKCdyZWNlaXB0X2Rvd25sb2FkJywgZG9tU2FuaXRpemVyLmJ5cGFzc1NlY3VyaXR5VHJ1c3RSZXNvdXJjZVVybCgnLi9hc3NldHMvaWNvbnMvcmVjZWlwdF9kb3dubG9hZC5zdmcnKSk7XHJcbiAgICAgbWF0SWNvblJlZ2lzdHJ5LmFkZFN2Z0ljb24oJ2xvZ29fZW5nYWdlJywgZG9tU2FuaXRpemVyLmJ5cGFzc1NlY3VyaXR5VHJ1c3RSZXNvdXJjZVVybCgnLi9hc3NldHMvaWNvbnMvbG9nby1lbmdhZ2UtbmVnLnN2ZycpKTtcclxuXHJcbiAgICAgbWF0SWNvblJlZ2lzdHJ5LmFkZFN2Z0ljb24oJ2ZpbGUnLCBkb21TYW5pdGl6ZXIuYnlwYXNzU2VjdXJpdHlUcnVzdFJlc291cmNlVXJsKCcuL2Fzc2V0cy9pY29ucy9maWxlLXNvbGlkLnN2ZycpKTtcclxuICAgICBtYXRJY29uUmVnaXN0cnkuYWRkU3ZnSWNvbignZmlsZS1jc3YnLCBkb21TYW5pdGl6ZXIuYnlwYXNzU2VjdXJpdHlUcnVzdFJlc291cmNlVXJsKCcuL2Fzc2V0cy9pY29ucy9maWxlLWNzdi1zb2xpZC5zdmcnKSk7XHJcbiAgICAgbWF0SWNvblJlZ2lzdHJ5LmFkZFN2Z0ljb24oJ2ZpbGUtZXhjZWwnLCBkb21TYW5pdGl6ZXIuYnlwYXNzU2VjdXJpdHlUcnVzdFJlc291cmNlVXJsKCcuL2Fzc2V0cy9pY29ucy9maWxlLWV4Y2VsLXNvbGlkLnN2ZycpKTtcclxuICAgICBtYXRJY29uUmVnaXN0cnkuYWRkU3ZnSWNvbignZmlsZS1pbWFnZScsIGRvbVNhbml0aXplci5ieXBhc3NTZWN1cml0eVRydXN0UmVzb3VyY2VVcmwoJy4vYXNzZXRzL2ljb25zL2ZpbGUtaW1hZ2Utc29saWQuc3ZnJykpO1xyXG4gICAgIG1hdEljb25SZWdpc3RyeS5hZGRTdmdJY29uKCdmaWxlLXBkZicsIGRvbVNhbml0aXplci5ieXBhc3NTZWN1cml0eVRydXN0UmVzb3VyY2VVcmwoJy4vYXNzZXRzL2ljb25zL2ZpbGUtcGRmLXNvbGlkLnN2ZycpKTtcclxuICAgICBtYXRJY29uUmVnaXN0cnkuYWRkU3ZnSWNvbignZmlsZS1wb3dlcnBvaW50JywgZG9tU2FuaXRpemVyLmJ5cGFzc1NlY3VyaXR5VHJ1c3RSZXNvdXJjZVVybCgnLi9hc3NldHMvaWNvbnMvZmlsZS1wb3dlcnBvaW50LXNvbGlkLnN2ZycpKTtcclxuICAgICBtYXRJY29uUmVnaXN0cnkuYWRkU3ZnSWNvbignZmlsZS13b3JkJywgZG9tU2FuaXRpemVyLmJ5cGFzc1NlY3VyaXR5VHJ1c3RSZXNvdXJjZVVybCgnLi9hc3NldHMvaWNvbnMvZmlsZS13b3JkLXNvbGlkLnN2ZycpKTtcclxuXHJcbiAgICAgbWF0SWNvblJlZ2lzdHJ5LmFkZFN2Z0ljb24oJ21lbnUtY2FsZW5kYXInLCBkb21TYW5pdGl6ZXIuYnlwYXNzU2VjdXJpdHlUcnVzdFJlc291cmNlVXJsKCcuL2Fzc2V0cy9pY29ucy9tZW51LWljb24tY2FsZW5kYXIuc3ZnJykpO1xyXG4gICAgIG1hdEljb25SZWdpc3RyeS5hZGRTdmdJY29uKCdtZW51LW5vdGlmaWNhdGlvbnMnLCBkb21TYW5pdGl6ZXIuYnlwYXNzU2VjdXJpdHlUcnVzdFJlc291cmNlVXJsKCcuL2Fzc2V0cy9pY29ucy9tZW51LWljb24tbm90aWZpY2hlLnN2ZycpKTtcclxuICAgICBtYXRJY29uUmVnaXN0cnkuYWRkU3ZnSWNvbignbWVudS1kb3dubG9hZCcsIGRvbVNhbml0aXplci5ieXBhc3NTZWN1cml0eVRydXN0UmVzb3VyY2VVcmwoJy4vYXNzZXRzL2ljb25zL21lbnUtZG93bmxvYWQuc3ZnJykpO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgY2hlY2tJZk9sZEJyb3dzZXIoKSB7XHJcbiAgICBjb25zdCB1YSA9IHdpbmRvdy5uYXZpZ2F0b3IudXNlckFnZW50OyAvLyBDaGVjayB0aGUgdXNlckFnZW50IHByb3BlcnR5IG9mIHRoZSB3aW5kb3cubmF2aWdhdG9yIG9iamVjdFxyXG4gICAgY29uc3QgbXNpZSA9IHVhLmluZGV4T2YoJ01TSUUgJyk7IC8vIElFIDEwIG9yIG9sZGVyXHJcbiAgICBjb25zdCB0cmlkZW50ID0gdWEuaW5kZXhPZignVHJpZGVudC8nKTsgLy8gSUUgMTFcclxuICAgIGlmIChtc2llID4gMCB8fCB0cmlkZW50ID4gMCl7XHJcbiAgICB0aGlzLmRpYWxvZy5vcGVuKERpYWxvZ05vSUVDb21wb25lbnQsIHtcclxuICAgICAgICBkaXNhYmxlQ2xvc2U6IHRydWUsXHJcbiAgICAgICAgbWluSGVpZ2h0OiAnMTAwdmgnLFxyXG4gICAgICAgIG1heEhlaWdodDogJzEwMHZoJyxcclxuICAgICAgICBtaW5XaWR0aDogJzEwMHZ3JyxcclxuICAgICAgICBtYXhXaWR0aDogJzEwMHZ3J1xyXG4gICAgICB9KTtcclxuICAgIH1cclxufVxyXG59XHJcblxyXG4iXX0=