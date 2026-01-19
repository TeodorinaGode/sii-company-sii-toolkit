import * as i0 from '@angular/core';
import { InjectionToken, Injectable, Optional, Inject, Component, Pipe, APP_INITIALIZER, LOCALE_ID, NgModule, Input, ViewChild, HostBinding, EventEmitter, Output, Directive, ContentChild, ContentChildren, HostListener, forwardRef, Self, TemplateRef, ViewChildren, Host } from '@angular/core';
import * as i1 from '@angular/common/http';
import { HttpHeaders, HttpParams, HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { BehaviorSubject, throwError, of, Subject, timer, Subscription, merge, from, zip, fromEvent } from 'rxjs';
import { skip, tap, distinctUntilChanged, catchError, finalize, startWith, filter, map, publishReplay, refCount, switchMap, concatMap, debounceTime, groupBy, mergeMap, toArray } from 'rxjs/operators';
import moment from 'moment';
import * as i1$2 from '@angular/material/dialog';
import { MAT_DIALOG_DATA, MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose } from '@angular/material/dialog';
import { MatButton, MatIconButton, MatMiniFabButton, MatFabButton } from '@angular/material/button';
import { CdkScrollable } from '@angular/cdk/scrolling';
import * as i1$1 from '@angular/common';
import { registerLocaleData, NgStyle, AsyncPipe, NgTemplateOutlet, NgClass, SlicePipe, CommonModule } from '@angular/common';
import { NativeDateAdapter, MAT_DATE_LOCALE, DateAdapter, MAT_DATE_FORMATS, MatOptgroup, MatOption } from '@angular/material/core';
import localeIt from '@angular/common/locales/it';
import localeEn from '@angular/common/locales/en';
import * as i4 from '@angular/router';
import { GuardsCheckEnd, NavigationStart, DefaultUrlSerializer, RouterLink, RouterModule } from '@angular/router';
import * as i1$3 from '@angular/material/icon';
import { MatIcon } from '@angular/material/icon';
import * as i1$4 from '@angular/platform-browser';
import { MatMenuTrigger, MatMenu, MatMenuItem } from '@angular/material/menu';
import { MatTooltip } from '@angular/material/tooltip';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import * as i2 from '@angular/cdk/clipboard';
import { MatSelectionList, MatListOption, MatNavList, MatListItem } from '@angular/material/list';
import * as i1$6 from '@angular/forms';
import { FormsModule, UntypedFormControl, ReactiveFormsModule, NG_VALUE_ACCESSOR, NG_VALIDATORS } from '@angular/forms';
import * as i3$1 from '@angular/material/input';
import { MatInput } from '@angular/material/input';
import * as i3 from '@angular/material/form-field';
import { MatFormField, MatSuffix, MatLabel, MatHint, MAT_FORM_FIELD, MatFormFieldControl } from '@angular/material/form-field';
import * as i1$5 from '@angular/cdk/layout';
import { Breakpoints } from '@angular/cdk/layout';
import { MatBadge } from '@angular/material/badge';
import { CdkObserveContent } from '@angular/cdk/observers';
import { MatSidenavContainer, MatSidenav } from '@angular/material/sidenav';
import { MatTabNav, MatTabLink, MatTabGroup, MatTab } from '@angular/material/tabs';
import * as i1$7 from '@angular/material/snack-bar';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import * as i9 from '@angular/material/autocomplete';
import { MatAutocompleteTrigger, MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, MatSortHeader } from '@angular/material/sort';
import { MatTableDataSource, MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow } from '@angular/material/table';
import { MatProgressBar } from '@angular/material/progress-bar';
import { coerceBooleanProperty, coerceNumberProperty } from '@angular/cdk/coercion';
import * as i2$1 from 'ngx-image-cropper';
import { ImageCropperModule } from 'ngx-image-cropper';
import * as i2$2 from '@angular/cdk/platform';
import * as i7 from '@angular/material/datepicker';
import { MatStartDate, MatEndDate } from '@angular/material/datepicker';
import * as i2$3 from '@angular/cdk/a11y';
import * as i4$1 from '@angular/material/select';
import { MatSelect } from '@angular/material/select';
import { MAT_CHECKBOX_DEFAULT_OPTIONS, MatCheckbox } from '@angular/material/checkbox';
import { MatAccordion, MatExpansionPanel, MatExpansionPanelHeader } from '@angular/material/expansion';
import { MatChipSet, MatChip, MatChipRemove } from '@angular/material/chips';
import * as i5 from '@angular/material/slide-toggle';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import * as i6 from '@angular/material/radio';

const SII_ENVIRONMENT = new InjectionToken('toolkit.environment');
const SII_SESSION_WAITING = new InjectionToken('toolkit.sessionwait');
const SII_APP_REF = new InjectionToken('toolkit.appref');
class SiiToolkitService {
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

class ErrorDisplayDialogComponent {
    constructor(data, location) {
        this.data = data;
        this.location = location;
        this.errorTitle = data.errorTitle;
        this.errorContent = data.errorContent;
    }
    ngOnInit() {
    }
    goToHome() {
        this.location.go('./');
        location.reload();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: ErrorDisplayDialogComponent, deps: [{ token: MAT_DIALOG_DATA }, { token: i1$1.Location }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "18.2.13", type: ErrorDisplayDialogComponent, isStandalone: true, selector: "sii-error-display-dialog", ngImport: i0, template: "<h2 mat-dialog-title>{{errorTitle}}</h2>\r\n<mat-dialog-content>\r\n  <span style=\"white-space: pre-line\" [innerHTML]=\"errorContent\"></span>\r\n</mat-dialog-content>\r\n<mat-dialog-actions style=\"float: right\">\r\n  <button mat-button class=\"sii-button-light\" [mat-dialog-close]=\"true\" i18n=\"Close button@@closeButton\">CLOSE</button>\r\n  <button mat-button class=\"sii-button-light\" (click)=\"goToHome()\" i18n=\"Go To Home Button@@goToHomeButton\">GO TO HOME</button>\r\n</mat-dialog-actions>\r\n", styles: [""], dependencies: [{ kind: "directive", type: MatDialogTitle, selector: "[mat-dialog-title], [matDialogTitle]", inputs: ["id"], exportAs: ["matDialogTitle"] }, { kind: "directive", type: MatDialogContent, selector: "[mat-dialog-content], mat-dialog-content, [matDialogContent]" }, { kind: "directive", type: MatDialogActions, selector: "[mat-dialog-actions], mat-dialog-actions, [matDialogActions]", inputs: ["align"] }, { kind: "component", type: MatButton, selector: "    button[mat-button], button[mat-raised-button], button[mat-flat-button],    button[mat-stroked-button]  ", exportAs: ["matButton"] }, { kind: "directive", type: MatDialogClose, selector: "[mat-dialog-close], [matDialogClose]", inputs: ["aria-label", "type", "mat-dialog-close", "matDialogClose"], exportAs: ["matDialogClose"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: ErrorDisplayDialogComponent, decorators: [{
            type: Component,
            args: [{ selector: 'sii-error-display-dialog', standalone: true, imports: [MatDialogTitle, CdkScrollable, MatDialogContent, MatDialogActions, MatButton, MatDialogClose], template: "<h2 mat-dialog-title>{{errorTitle}}</h2>\r\n<mat-dialog-content>\r\n  <span style=\"white-space: pre-line\" [innerHTML]=\"errorContent\"></span>\r\n</mat-dialog-content>\r\n<mat-dialog-actions style=\"float: right\">\r\n  <button mat-button class=\"sii-button-light\" [mat-dialog-close]=\"true\" i18n=\"Close button@@closeButton\">CLOSE</button>\r\n  <button mat-button class=\"sii-button-light\" (click)=\"goToHome()\" i18n=\"Go To Home Button@@goToHomeButton\">GO TO HOME</button>\r\n</mat-dialog-actions>\r\n" }]
        }], ctorParameters: () => [{ type: undefined, decorators: [{
                    type: Inject,
                    args: [MAT_DIALOG_DATA]
                }] }, { type: i1$1.Location }] });

class ErrorDisplayService {
    constructor(dialog) {
        this.dialog = dialog;
    }
    /**
     * Show an error dialog ore returns the current one if already opened
     * @param errorTitle the title of the dialog
     * @param errorContent the content of the dialog
     */
    showDialog(errorTitle, errorContent) {
        const dialogArr = this.dialog.openDialogs.filter((ref) => ref.id === 'errorDisplayDialog');
        if (dialogArr.length > 0) {
            return dialogArr[0];
        }
        return this.dialog.open(ErrorDisplayDialogComponent, {
            data: {
                errorTitle,
                errorContent,
            },
            id: 'errorDisplayDialog',
        });
    }
    isAlreadyOpened() {
        return this.dialog.openDialogs.filter((ref) => ref.id === 'errorDisplayDialog').length > 0;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: ErrorDisplayService, deps: [{ token: i1$2.MatDialog }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: ErrorDisplayService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: ErrorDisplayService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: () => [{ type: i1$2.MatDialog }] });

class SiiWaitService {
    get haveShowToSkip() { return this._showToSkip > 0; }
    constructor() {
        // tslint:disable-next-line:variable-name
        this._display$ = new BehaviorSubject(false);
        this.display$ = this._display$.asObservable().pipe(
        // tap((val: boolean ) => { console.log(val);}),
        distinctUntilChanged());
        this.semaphore = 0;
        this._showToSkip = 0;
    }
    hide() {
        this.semaphore--;
        if (this.semaphore < 0) {
            this.semaphore = 0;
        }
        if (this.semaphore === 0) {
            Promise.resolve().then(() => this._display$.next(false));
        }
    }
    show() {
        if (this.semaphore === 0) {
            Promise.resolve().then(() => this._display$.next(true));
        }
        this.semaphore++;
    }
    skipNext() {
        this._showToSkip++;
    }
    showSkipped() {
        this._showToSkip--;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: SiiWaitService, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: SiiWaitService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: SiiWaitService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: () => [] });

class SiiHttpInterceptorService {
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: SiiHttpInterceptorService, deps: [{ token: ErrorDisplayService }, { token: SiiWaitService }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: SiiHttpInterceptorService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: SiiHttpInterceptorService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: () => [{ type: ErrorDisplayService }, { type: SiiWaitService }] });

class SIIDateAdapter extends NativeDateAdapter {
    constructor(matDateLocale, siiToolkitService) {
        super(matDateLocale);
        this.siiToolkitService = siiToolkitService;
    }
    format(date, displayFormat) {
        return date == null ? null : moment(date).format(displayFormat);
    }
    parse(dateString) {
        if (dateString == null || dateString.length === 0) {
            return null;
        }
        const m = moment(dateString, this.siiToolkitService.loggedUser.value.inputDatePattern, true);
        return m.isValid() ? m.toDate() : new Date(NaN);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: SIIDateAdapter, deps: [{ token: MAT_DATE_LOCALE, optional: true }, { token: SiiToolkitService }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: SIIDateAdapter }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: SIIDateAdapter, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [MAT_DATE_LOCALE]
                }] }, { type: SiiToolkitService }] });

class SiiDatePipe {
    constructor(siiToolkitService) {
        this.siiToolkitService = siiToolkitService;
    }
    transform(date, showTime = false) {
        let dateObj = null;
        if (date != null) {
            if (date instanceof Date) {
                dateObj = date;
            }
            else if (date instanceof Array && date.length === 3) { // LocalDate
                // 				new Date(year, monthIndex [, day [, hours [, minutes [, seconds [, milliseconds]]]]])
                dateObj = new Date(date[0], date[1] - 1, date[2]);
            }
            else if (date instanceof Array && (date.length >= 5 && date.length <= 7)) { // LocalDateTime
                // 				new Date(year, monthIndex [, day [, hours [, minutes [, seconds [, milliseconds]]]]])
                dateObj = new Date(date[0], date[1] - 1, date[2], date[3], date[4], (date[5] || 0));
            }
            else if (date instanceof String || typeof date === 'string') {
                const m = moment(date, this.siiToolkitService.loggedUser.value.inputDatePattern);
                dateObj = m.isValid() ? m.toDate() : null;
            }
            else if (date instanceof Number || typeof date === 'number') {
                dateObj = new Date(date);
            }
        }
        if (dateObj == null) {
            return null;
        }
        else {
            const m = moment(dateObj);
            return m.isValid() ? m.format(this.siiToolkitService.loggedUser.value.displayDatePattern + (!!showTime ? ' HH:mm' : '')) : null;
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: SiiDatePipe, deps: [{ token: SiiToolkitService }], target: i0.ɵɵFactoryTarget.Pipe }); }
    static { this.ɵpipe = i0.ɵɵngDeclarePipe({ minVersion: "14.0.0", version: "18.2.13", ngImport: i0, type: SiiDatePipe, isStandalone: true, name: "siiDate" }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: SiiDatePipe, decorators: [{
            type: Pipe,
            args: [{
                    name: 'siiDate',
                    standalone: true
                }]
        }], ctorParameters: () => [{ type: SiiToolkitService }] });

class DialogNoIEComponent {
    constructor() { }
    ngOnInit() {
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: DialogNoIEComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "18.2.13", type: DialogNoIEComponent, isStandalone: true, selector: "sii-dialog-no-ie", ngImport: i0, template: "NON USARE EXPLORER\r\n", styles: [""] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: DialogNoIEComponent, decorators: [{
            type: Component,
            args: [{ selector: 'sii-dialog-no-ie', standalone: true, template: "NON USARE EXPLORER\r\n" }]
        }], ctorParameters: () => [] });

var SiiEventStatus;
(function (SiiEventStatus) {
    SiiEventStatus["VECCHIA"] = "VECCHIA";
    SiiEventStatus["SCADUTA"] = "SCADUTA";
    SiiEventStatus["SCADENZA_OGGI"] = "SCADENZA_OGGI";
    SiiEventStatus["IN_SCADENZA"] = "IN_SCADENZA";
    SiiEventStatus["PROSSIMAMENTE"] = "PROSSIMAMENTE";
})(SiiEventStatus || (SiiEventStatus = {}));

// import { ENGAGE_CONFIG } from './engage-configurations-params.service';
// import { SiiToolkitService } from '../sii-toolkit.service';
class SiiEngageService {
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: SiiEngageService, deps: [{ token: i1.HttpClient }, { token: SII_ENVIRONMENT, optional: true }, { token: SiiToolkitService }, { token: SiiWaitService }], target: i0.ɵɵFactoryTarget.Injectable }); }
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
                }] }, { type: SiiToolkitService }, { type: SiiWaitService }] });

/**
 * available states for routing
 *
 * breacbrumb        -> the custom name of the current path
 * breadcrumbReset   -> to reset the breadcrumb to the current route
 * breadcrumbHome    -> to set the current path as home if is different of '' or '**'
 *
 */
class SiiBreadcrumbService {
    constructor(router) {
        this.router = router;
        this.breadcrumbActionSubj = new Subject();
        this.breadcrumbAction = this.breadcrumbActionSubj.asObservable();
        this.breadcrumbList = [];
        this.breadcrumbSubj = new BehaviorSubject([]);
        this.breadcrumb = this.breadcrumbSubj.asObservable();
        this.breadcrumbAction.subscribe((res) => {
            this.doAction(res.action, res.data);
        });
    }
    init() {
        return () => {
            return new Promise((resolve, reject) => {
                this.initBreadcrumb();
                resolve();
            });
        };
    }
    doAction(actionType, actionData) {
        switch (actionType) {
            case 'PAGE_CHANGE':
                this.pageChange(actionData.url, actionData.snapshot);
                delete this.currNavigationStart;
                break;
            case 'CHANGE_LAST_BREAD_LABEL':
                this.breadcrumbList[this.breadcrumbList.length - 1].label = actionData.label;
                this.breadcrumbSubj.next(this.breadcrumbList);
                break;
            case 'REMOVE_LAST_BREAD':
                this.breadcrumbList.length = this.breadcrumbList.length - 1;
                this.breadcrumbSubj.next(this.breadcrumbList);
                break;
            case 'RESET':
                this.breadcrumbList.length = 0;
                break;
        }
    }
    findCurrentRoute(url, root) {
        if (url.root.children.primary === undefined) {
            return root.firstChild;
        }
        const fullUrl = this.getFullUrl(root);
        if (root.fragment === url.fragment &&
            JSON.stringify(root.queryParams) === JSON.stringify(url.queryParams) &&
            JSON.stringify(url.root.children.primary.segments) === JSON.stringify(fullUrl)) {
            return root;
        }
        else if (root.firstChild != null) {
            return this.findCurrentRoute(url, root.firstChild);
        }
        else {
            console.log('ROTTA NON TROVATA');
        }
    }
    initBreadcrumb() {
        this.router.events
            .pipe(filter(event => event instanceof GuardsCheckEnd || event instanceof NavigationStart))
            .subscribe((event) => {
            if (event instanceof NavigationStart) {
                if (event.navigationTrigger === 'popstate') {
                    // se baccio back o foward con il browser, resetto la breadcrumb
                    this.breadcrumbActionSubj.next({ action: 'RESET', data: null });
                }
            }
            else {
                const url = (new DefaultUrlSerializer()).parse(event.url);
                const currActivatedRouteSnapshot = this.findCurrentRoute(url, event.state.root);
                this.breadcrumbActionSubj.next({ action: 'PAGE_CHANGE', data: { url: event.url, snapshot: currActivatedRouteSnapshot } });
            }
        });
        // this.router.events
        // .pipe(filter((event) => event instanceof ActivationStart || event instanceof NavigationStart))
        // .subscribe((event: ActivationStart | NavigationStart)  => {
        //   if (event instanceof ActivationStart  ){
        //     this.breadcrumbActionSubj.next({action: 'PAGE_CHANGE', data: {url: this.currNavigationStart.url, state: event }});
        //   }else if (event instanceof NavigationStart){
        //     this.currNavigationStart = event;
        //   }
        // });
        // .pipe(filter((event) => event instanceof NavigationEnd))
        // .subscribe((event: NavigationEnd) => {
        //     this.pageChange(this.router.routerState.snapshot);
        // });
    }
    pageChange(url, snapshot) {
        const isRoot = this.isRoot(snapshot);
        if (isRoot) {
            this.breadcrumbList = [this.buildBreadcrumbItem(url, snapshot)];
        }
        else if (this.breadcrumbList.length === 0 || !!snapshot.routeConfig.data.breadcrumbReset) {
            this.breadcrumbList = [{ url: '/', label: 'Home', fragment: null, queryParams: null }];
        }
        if (!isRoot) {
            this.breadcrumbList.push(this.buildBreadcrumbItem(url, snapshot));
            const lastCrumb = this.breadcrumbList[this.breadcrumbList.length - 1];
            const firstIndexOfNewUrl = this.breadcrumbList.findIndex(i => i.url === lastCrumb.url);
            if (firstIndexOfNewUrl !== this.breadcrumbList.length - 1) {
                this.breadcrumbList.length = firstIndexOfNewUrl + 1;
            }
        }
        this.breadcrumbSubj.next(this.breadcrumbList);
    }
    // private pageChange( url: string ,  state: ActivationStart){
    //   if (this.breadcrumbList.length === 0 || !!state.snapshot.routeConfig.data.breadcrumbReset){
    //     this.breadcrumbList = [{url: '/', label: 'Home', fragment: null, queryParams: null}];
    //   }
    //   if (!this.isRoot(url, state)){
    //     this.breadcrumbList.push(this.buildBreadcrumbItem(url, state.snapshot));
    //     const lastCrumb = this.breadcrumbList[this.breadcrumbList.length - 1];
    //     const firstIndexOfNewUrl = this.breadcrumbList.findIndex(i => i.url === lastCrumb.url);
    //     if (firstIndexOfNewUrl !== this.breadcrumbList.length - 1){
    //       this.breadcrumbList.length = firstIndexOfNewUrl + 1;
    //     }
    //   }
    //   this.breadcrumbSubj.next(this.breadcrumbList);
    // }
    buildBreadcrumbItem(url, state) {
        // const urlObj = new URL(url, 'http://example.com');
        // const searchParamObj = {};
        // urlObj.searchParams.forEach((value, key) => {
        //   searchParamObj[key] = value;
        // });
        // const fragment = urlObj.hash !== '' ? urlObj.hash.replace('#', '') : null;
        return {
            url: '/' + this.getFullUrl(state).map(p => p.path).join('/'),
            // url: state.url.reduce((acc, att) => acc + att.path + '/', ''),
            // urlOld: urlObj.pathname,
            label: state.routeConfig?.data?.breadcrumb || (url.startsWith("/") ? url.slice(1) : url).replace("/", " / "),
            fragment: state.fragment,
            queryParams: state.queryParams
        };
    }
    getFullUrl(root, arr = []) {
        if (root.parent != null) {
            this.getFullUrl(root.parent, arr);
        }
        root.url.forEach(i => arr.push(i));
        return arr;
    }
    isRoot(snapshot) {
        return snapshot.url.length === 0 || snapshot.url[0].path === '' || snapshot.data.breadcrumbHome;
    }
    changeLastBreadLabel(label) {
        this.breadcrumbActionSubj.next({ action: 'CHANGE_LAST_BREAD_LABEL', data: { label } });
    }
    removeLastBread() {
        this.breadcrumbActionSubj.next({ action: 'REMOVE_LAST_BREAD', data: null });
    }
    reset() {
        this.breadcrumbActionSubj.next({ action: 'RESET', data: null });
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: SiiBreadcrumbService, deps: [{ token: i4.Router }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: SiiBreadcrumbService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: SiiBreadcrumbService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                }]
        }], ctorParameters: () => [{ type: i4.Router }] });

registerLocaleData(localeIt);
registerLocaleData(localeEn);
// export const ENGAGE_CONFIG = new InjectionToken<BehaviorSubject<EngageConfigDTO>>('toolkit.engageConfig');
class SiiToolkitModule {
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: SiiToolkitModule, deps: [{ token: i1$3.MatIconRegistry }, { token: i1$4.DomSanitizer }, { token: i1$2.MatDialog }], target: i0.ɵɵFactoryTarget.NgModule }); }
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
        }], ctorParameters: () => [{ type: i1$3.MatIconRegistry }, { type: i1$4.DomSanitizer }, { type: i1$2.MatDialog }] });

class WorkerContactInformationComponent {
    constructor(siiToolkitService, clipboard, siiWait) {
        this.siiToolkitService = siiToolkitService;
        this.clipboard = clipboard;
        this.siiWait = siiWait;
        this.noContacsInformation = false;
    }
    ngOnChanges(changes) {
        if (changes.workerId.currentValue !== changes.workerId.previousValue) {
            this.data = null;
            this.noContacsInformation = false;
        }
    }
    ngOnInit() {
    }
    openMenu() {
        this.trigger.openMenu();
    }
    loadInformation() {
        if (this.data == null) {
            this.siiWait.skipNext();
            this.siiToolkitService.getWorkerContactInformation(this.workerId, this.serviceUrl).subscribe(r => {
                this.data = r;
                this.noContacsInformation = Object.values(r).findIndex(i => i != null) === -1;
            });
        }
    }
    call(phone) {
        this.createAndClickHref(`tel:${phone}`);
    }
    sendMail(mail) {
        this.createAndClickHref(`mailto:${mail}`);
    }
    openTeams(mail) {
        this.createAndClickHref(`sip:${mail}`);
    }
    createAndClickHref(href) {
        const openLink = document.createElement('a');
        openLink.href = href;
        document.body.appendChild(openLink);
        openLink.click();
        document.body.removeChild(openLink);
    }
    copyToClipboard(item, ev) {
        ev.stopPropagation();
        ev.target.classList.add('copingInProgress');
        this.clipboard.copy(item);
        setTimeout(() => {
            ev.target.classList.replace('copingInProgress', 'copingDone');
            setTimeout(() => {
                ev.target.classList.remove('copingDone');
            }, 1000);
        }, 500);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: WorkerContactInformationComponent, deps: [{ token: SiiToolkitService }, { token: i2.Clipboard }, { token: SiiWaitService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "18.2.13", type: WorkerContactInformationComponent, isStandalone: true, selector: "sii-worker-contact-information", inputs: { workerId: "workerId", serviceUrl: "serviceUrl" }, viewQueries: [{ propertyName: "trigger", first: true, predicate: MatMenuTrigger, descendants: true }], usesOnChanges: true, ngImport: i0, template: "@if (workerId!=null) {\r\n  <button mat-icon-button (menuOpened)=\"loadInformation()\" [matMenuTriggerFor]=\"menu\" aria-label=\"Example icon-button with a menu\">\r\n    <mat-icon>contacts</mat-icon>\r\n  </button>\r\n}\r\n<mat-menu #menu=\"matMenu\">\r\n  @if (data==null) {\r\n    <mat-spinner style=\"margin: 25px;\"></mat-spinner>\r\n  }\r\n  @if (noContacsInformation) {\r\n    <span style=\"display:block; padding: 15px;\" i18n=\"@@NoDataAvailable\">No Data Available</span>\r\n  }\r\n  @if (data!=null) {\r\n    @if (data.businessOfficePhone) {\r\n      <button mat-menu-item (click)=\"call(data.businessOfficePhone)\"  i18n-matTooltip=\"@@Businessofficephonenumber\" matTooltipShowDelay='2000' matTooltip=\"Business office phone number\">\r\n        <mat-icon matTooltipShowDelay='500' matTooltipPosition=\"right\"  i18n-matTooltip=\"@@copyToClipboard\" matTooltip=\"Copy to clipboard\" class=\"copyEle\" (click)=\"copyToClipboard(data.businessOfficePhone,$event)\">phone</mat-icon>\r\n        <span>{{data.businessOfficePhone}}</span>\r\n      </button>\r\n    }\r\n    @if (data.businessCellphone) {\r\n      <button mat-menu-item (click)=\"call(data.businessCellphone)\"  i18n-matTooltip=\"@@Businesscellphonenumber\" matTooltipShowDelay='2000' matTooltip=\"Business cell phone number\">\r\n        <mat-icon matTooltipShowDelay='500' matTooltipPosition=\"right\"  i18n-matTooltip=\"@@copyToClipboard\" matTooltip=\"Copy to clipboard\" class=\"copyEle\" (click)=\"copyToClipboard(data.businessCellphone,$event)\">smartphone</mat-icon>\r\n        <span>{{data.businessCellphone}}</span>\r\n      </button>\r\n    }\r\n    @if (data.personalCellphone) {\r\n      <button mat-menu-item (click)=\"call(data.personalCellphone)\"  i18n-matTooltip=\"@@Personalcellphonenumber\" matTooltipShowDelay='2000' matTooltip=\"Personal cell phone number\">\r\n        <mat-icon matTooltipShowDelay='500' matTooltipPosition=\"right\"  i18n-matTooltip=\"@@copyToClipboard\" matTooltip=\"Copy to clipboard\" class=\"copyEle\" (click)=\"copyToClipboard(data.personalCellphone,$event)\">remember_me</mat-icon>\r\n        <span>{{data.personalCellphone}}</span>\r\n      </button>\r\n    }\r\n    @if (data.email) {\r\n      <button mat-menu-item (click)=\"sendMail(data.email)\">\r\n        <mat-icon matTooltipShowDelay='500' matTooltipPosition=\"right\"  i18n-matTooltip=\"@@copyToClipboard\" matTooltip=\"Copy to clipboard\" class=\"copyEle\" (click)=\"copyToClipboard(data.email,$event)\">mail</mat-icon>\r\n        <span>{{data.email}}</span>\r\n      </button>\r\n    }\r\n    @if (data.email) {\r\n      <button mat-menu-item (click)=\"openTeams(data.email)\">\r\n        <mat-icon ><svg xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" aria-hidden=\"true\" focusable=\"false\" width=\"1em\" height=\"1em\" style=\"-ms-transform: rotate(360deg); -webkit-transform: rotate(360deg); transform: rotate(360deg);\" preserveAspectRatio=\"xMidYMid meet\" viewBox=\"0 0 24 24\"><path d=\"M19.19 8.77q-.46 0-.86-.17q-.39-.17-.69-.47q-.3-.3-.47-.69q-.17-.4-.17-.86q0-.45.17-.85q.17-.4.47-.69q.3-.3.69-.47q.4-.18.86-.17q.45-.01.85.17q.4.17.7.47q.29.29.47.69q.17.4.17.85q0 .46-.17.86q-.17.39-.47.69q-.3.3-.7.47q-.4.17-.85.17m0-3.12q-.39 0-.69.27q-.25.27-.25.66t.25.67q.3.25.69.25q.39 0 .66-.25q.28-.25.28-.67q0-.39-.28-.66q-.27-.27-.66-.27M22 10.33V15q0 .63-.24 1.2q-.26.57-.67.99q-.43.43-1 .67q-.59.25-1.21.25q-.38 0-.76-.11q-.39-.07-.71-.25q-.24.79-.71 1.44q-.47.65-1.1 1.11q-.63.46-1.39.7q-.76.27-1.58.27q-.96 0-1.81-.33q-.82-.33-1.5-.94q-.66-.57-1.09-1.36q-.44-.8-.57-1.74H2.83q-.33 0-.59-.25q-.24-.24-.24-.58V7.73q0-.34.24-.59q.26-.24.59-.24H10q-.29-.6-.29-1.25q0-.61.23-1.15q.22-.5.62-.92q.4-.39.94-.62q.5-.23 1.12-.23q.61 0 1.14.23q.53.23.93.62q.4.42.62.92q.23.54.23 1.15q0 .6-.23 1.14q-.22.53-.62.92q-.4.4-.93.63q-.53.23-1.14.23q-.15 0-.31-.02q-.15-.02-.31-.05v.9h9.06q.39 0 .67.27q.27.27.27.66M12.63 4q-.35 0-.63.11q-.33.13-.56.36q-.22.23-.35.53q-.13.31-.13.65q0 .35.13.65q.13.3.35.53q.23.22.56.36q.28.13.63.13q.34 0 .64-.13q.3-.14.53-.36q.23-.23.36-.53q.14-.3.14-.65q0-.34-.14-.65q-.13-.3-.36-.53q-.23-.23-.53-.36q-.3-.11-.64-.11m-4.85 6.18h1.88V8.62H4.34v1.56h1.88v5h1.56m8.6 1.09v-5.62H12v5.42q0 .34-.24.58q-.26.25-.59.25H8.92q.13.67.47 1.25q.34.57.82.99q.48.41 1.1.65q.61.21 1.32.21q.77 0 1.45-.27q.68-.3 1.2-.81q.51-.51.8-1.19q.3-.68.3-1.46M20.75 15v-4.35h-3.12v5.71q.25.25.57.38q.3.12.68.12q.39 0 .73-.15q.34-.15.59-.4q.26-.25.4-.6q.15-.34.15-.71z\" fill=\"#626262\"/></svg></mat-icon>\r\n        <span i18n=\"@@contactOnTeams\">Contact on Teams</span>\r\n      </button>\r\n    }\r\n  }\r\n</mat-menu>\r\n", styles: ["@charset \"UTF-8\";.copyEle{cursor:pointer}.copyEle:hover{color:#000}.copingInProgress{color:green}.copingDone:after{content:\"\\2714\";display:block;position:absolute;top:12px;left:16px;background:#fff;width:28px;height:28px}.mat-mdc-menu-item:hover .copingDone:after{background:#f5f5f5}\n"], dependencies: [{ kind: "component", type: MatIconButton, selector: "button[mat-icon-button]", exportAs: ["matButton"] }, { kind: "directive", type: MatMenuTrigger, selector: "[mat-menu-trigger-for], [matMenuTriggerFor]", inputs: ["mat-menu-trigger-for", "matMenuTriggerFor", "matMenuTriggerData", "matMenuTriggerRestoreFocus"], outputs: ["menuOpened", "onMenuOpen", "menuClosed", "onMenuClose"], exportAs: ["matMenuTrigger"] }, { kind: "component", type: MatIcon, selector: "mat-icon", inputs: ["color", "inline", "svgIcon", "fontSet", "fontIcon"], exportAs: ["matIcon"] }, { kind: "component", type: MatMenu, selector: "mat-menu", inputs: ["backdropClass", "aria-label", "aria-labelledby", "aria-describedby", "xPosition", "yPosition", "overlapTrigger", "hasBackdrop", "class", "classList"], outputs: ["closed", "close"], exportAs: ["matMenu"] }, { kind: "component", type: MatProgressSpinner, selector: "mat-progress-spinner, mat-spinner", inputs: ["color", "mode", "value", "diameter", "strokeWidth"], exportAs: ["matProgressSpinner"] }, { kind: "component", type: MatMenuItem, selector: "[mat-menu-item]", inputs: ["role", "disabled", "disableRipple"], exportAs: ["matMenuItem"] }, { kind: "directive", type: MatTooltip, selector: "[matTooltip]", inputs: ["matTooltipPosition", "matTooltipPositionAtOrigin", "matTooltipDisabled", "matTooltipShowDelay", "matTooltipHideDelay", "matTooltipTouchGestures", "matTooltip", "matTooltipClass"], exportAs: ["matTooltip"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: WorkerContactInformationComponent, decorators: [{
            type: Component,
            args: [{ selector: 'sii-worker-contact-information', standalone: true, imports: [MatIconButton, MatMenuTrigger, MatIcon, MatMenu, MatProgressSpinner, MatMenuItem, MatTooltip], template: "@if (workerId!=null) {\r\n  <button mat-icon-button (menuOpened)=\"loadInformation()\" [matMenuTriggerFor]=\"menu\" aria-label=\"Example icon-button with a menu\">\r\n    <mat-icon>contacts</mat-icon>\r\n  </button>\r\n}\r\n<mat-menu #menu=\"matMenu\">\r\n  @if (data==null) {\r\n    <mat-spinner style=\"margin: 25px;\"></mat-spinner>\r\n  }\r\n  @if (noContacsInformation) {\r\n    <span style=\"display:block; padding: 15px;\" i18n=\"@@NoDataAvailable\">No Data Available</span>\r\n  }\r\n  @if (data!=null) {\r\n    @if (data.businessOfficePhone) {\r\n      <button mat-menu-item (click)=\"call(data.businessOfficePhone)\"  i18n-matTooltip=\"@@Businessofficephonenumber\" matTooltipShowDelay='2000' matTooltip=\"Business office phone number\">\r\n        <mat-icon matTooltipShowDelay='500' matTooltipPosition=\"right\"  i18n-matTooltip=\"@@copyToClipboard\" matTooltip=\"Copy to clipboard\" class=\"copyEle\" (click)=\"copyToClipboard(data.businessOfficePhone,$event)\">phone</mat-icon>\r\n        <span>{{data.businessOfficePhone}}</span>\r\n      </button>\r\n    }\r\n    @if (data.businessCellphone) {\r\n      <button mat-menu-item (click)=\"call(data.businessCellphone)\"  i18n-matTooltip=\"@@Businesscellphonenumber\" matTooltipShowDelay='2000' matTooltip=\"Business cell phone number\">\r\n        <mat-icon matTooltipShowDelay='500' matTooltipPosition=\"right\"  i18n-matTooltip=\"@@copyToClipboard\" matTooltip=\"Copy to clipboard\" class=\"copyEle\" (click)=\"copyToClipboard(data.businessCellphone,$event)\">smartphone</mat-icon>\r\n        <span>{{data.businessCellphone}}</span>\r\n      </button>\r\n    }\r\n    @if (data.personalCellphone) {\r\n      <button mat-menu-item (click)=\"call(data.personalCellphone)\"  i18n-matTooltip=\"@@Personalcellphonenumber\" matTooltipShowDelay='2000' matTooltip=\"Personal cell phone number\">\r\n        <mat-icon matTooltipShowDelay='500' matTooltipPosition=\"right\"  i18n-matTooltip=\"@@copyToClipboard\" matTooltip=\"Copy to clipboard\" class=\"copyEle\" (click)=\"copyToClipboard(data.personalCellphone,$event)\">remember_me</mat-icon>\r\n        <span>{{data.personalCellphone}}</span>\r\n      </button>\r\n    }\r\n    @if (data.email) {\r\n      <button mat-menu-item (click)=\"sendMail(data.email)\">\r\n        <mat-icon matTooltipShowDelay='500' matTooltipPosition=\"right\"  i18n-matTooltip=\"@@copyToClipboard\" matTooltip=\"Copy to clipboard\" class=\"copyEle\" (click)=\"copyToClipboard(data.email,$event)\">mail</mat-icon>\r\n        <span>{{data.email}}</span>\r\n      </button>\r\n    }\r\n    @if (data.email) {\r\n      <button mat-menu-item (click)=\"openTeams(data.email)\">\r\n        <mat-icon ><svg xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" aria-hidden=\"true\" focusable=\"false\" width=\"1em\" height=\"1em\" style=\"-ms-transform: rotate(360deg); -webkit-transform: rotate(360deg); transform: rotate(360deg);\" preserveAspectRatio=\"xMidYMid meet\" viewBox=\"0 0 24 24\"><path d=\"M19.19 8.77q-.46 0-.86-.17q-.39-.17-.69-.47q-.3-.3-.47-.69q-.17-.4-.17-.86q0-.45.17-.85q.17-.4.47-.69q.3-.3.69-.47q.4-.18.86-.17q.45-.01.85.17q.4.17.7.47q.29.29.47.69q.17.4.17.85q0 .46-.17.86q-.17.39-.47.69q-.3.3-.7.47q-.4.17-.85.17m0-3.12q-.39 0-.69.27q-.25.27-.25.66t.25.67q.3.25.69.25q.39 0 .66-.25q.28-.25.28-.67q0-.39-.28-.66q-.27-.27-.66-.27M22 10.33V15q0 .63-.24 1.2q-.26.57-.67.99q-.43.43-1 .67q-.59.25-1.21.25q-.38 0-.76-.11q-.39-.07-.71-.25q-.24.79-.71 1.44q-.47.65-1.1 1.11q-.63.46-1.39.7q-.76.27-1.58.27q-.96 0-1.81-.33q-.82-.33-1.5-.94q-.66-.57-1.09-1.36q-.44-.8-.57-1.74H2.83q-.33 0-.59-.25q-.24-.24-.24-.58V7.73q0-.34.24-.59q.26-.24.59-.24H10q-.29-.6-.29-1.25q0-.61.23-1.15q.22-.5.62-.92q.4-.39.94-.62q.5-.23 1.12-.23q.61 0 1.14.23q.53.23.93.62q.4.42.62.92q.23.54.23 1.15q0 .6-.23 1.14q-.22.53-.62.92q-.4.4-.93.63q-.53.23-1.14.23q-.15 0-.31-.02q-.15-.02-.31-.05v.9h9.06q.39 0 .67.27q.27.27.27.66M12.63 4q-.35 0-.63.11q-.33.13-.56.36q-.22.23-.35.53q-.13.31-.13.65q0 .35.13.65q.13.3.35.53q.23.22.56.36q.28.13.63.13q.34 0 .64-.13q.3-.14.53-.36q.23-.23.36-.53q.14-.3.14-.65q0-.34-.14-.65q-.13-.3-.36-.53q-.23-.23-.53-.36q-.3-.11-.64-.11m-4.85 6.18h1.88V8.62H4.34v1.56h1.88v5h1.56m8.6 1.09v-5.62H12v5.42q0 .34-.24.58q-.26.25-.59.25H8.92q.13.67.47 1.25q.34.57.82.99q.48.41 1.1.65q.61.21 1.32.21q.77 0 1.45-.27q.68-.3 1.2-.81q.51-.51.8-1.19q.3-.68.3-1.46M20.75 15v-4.35h-3.12v5.71q.25.25.57.38q.3.12.68.12q.39 0 .73-.15q.34-.15.59-.4q.26-.25.4-.6q.15-.34.15-.71z\" fill=\"#626262\"/></svg></mat-icon>\r\n        <span i18n=\"@@contactOnTeams\">Contact on Teams</span>\r\n      </button>\r\n    }\r\n  }\r\n</mat-menu>\r\n", styles: ["@charset \"UTF-8\";.copyEle{cursor:pointer}.copyEle:hover{color:#000}.copingInProgress{color:green}.copingDone:after{content:\"\\2714\";display:block;position:absolute;top:12px;left:16px;background:#fff;width:28px;height:28px}.mat-mdc-menu-item:hover .copingDone:after{background:#f5f5f5}\n"] }]
        }], ctorParameters: () => [{ type: SiiToolkitService }, { type: i2.Clipboard }, { type: SiiWaitService }], propDecorators: { workerId: [{
                type: Input
            }], serviceUrl: [{
                type: Input
            }], trigger: [{
                type: ViewChild,
                args: [MatMenuTrigger]
            }] } });

class WorkerIconComponent {
    constructor(siiToolkitService) {
        this.siiToolkitService = siiToolkitService;
        this.showContact = false;
    }
    ngOnChanges(changes) {
        if (changes.lavuid) {
            this.photoURL = `${this.siiToolkitService.environment.domain}/sii_common/photo/${changes.lavuid.currentValue}.jpg`;
        }
    }
    openContactInformation() {
        if (this.showContact) {
            this.wci.openMenu();
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: WorkerIconComponent, deps: [{ token: SiiToolkitService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "18.2.13", type: WorkerIconComponent, isStandalone: true, selector: "sii-worker-icon", inputs: { lavuid: "lavuid", showContact: "showContact", siiWorkerContactInformationServiceUrl: "siiWorkerContactInformationServiceUrl" }, viewQueries: [{ propertyName: "wci", first: true, predicate: WorkerContactInformationComponent, descendants: true }], usesOnChanges: true, ngImport: i0, template: "<svg class=\"list-ico list-ico-selected\" [attr.width]=\"40\" [attr.height]=\"40\" fill=\"#AAA\" viewBox=\"2 2 20 20\" >\r\n  <path d=\"M0 0h24v24H0z\" fill=\"none\" />\r\n  <path d=\"M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z\" />\r\n</svg>\r\n\r\n<button class=\"sii-profile-button__avatar list-ico-unselected\" mat-mini-fab (click)=\"openContactInformation()\"\r\n[ngStyle]=\"{'background-image':'url(' + photoURL + ')'}\"></button>\r\n\r\n@if (showContact) {\r\n  <sii-worker-contact-information [workerId]=\"lavuid\" [serviceUrl]=\"siiWorkerContactInformationServiceUrl\"  #wci ></sii-worker-contact-information>\r\n}\r\n", styles: [":host{min-width:40px;position:relative}button{width:40px;height:40px;background-size:cover}.list-ico{flex:0 0 auto;position:absolute}.list-ico-selected{display:none}sii-worker-contact-information ::ng-deep .mat-mdc-menu-trigger mat-icon{display:none}sii-worker-contact-information ::ng-deep .mat-mdc-menu-trigger{visibility:hidden;width:1px!important;height:1px!important}sii-worker-contact-information{position:absolute}\n"], dependencies: [{ kind: "component", type: MatMiniFabButton, selector: "button[mat-mini-fab]", exportAs: ["matButton"] }, { kind: "directive", type: NgStyle, selector: "[ngStyle]", inputs: ["ngStyle"] }, { kind: "component", type: WorkerContactInformationComponent, selector: "sii-worker-contact-information", inputs: ["workerId", "serviceUrl"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: WorkerIconComponent, decorators: [{
            type: Component,
            args: [{ selector: 'sii-worker-icon', standalone: true, imports: [MatMiniFabButton, NgStyle, WorkerContactInformationComponent], template: "<svg class=\"list-ico list-ico-selected\" [attr.width]=\"40\" [attr.height]=\"40\" fill=\"#AAA\" viewBox=\"2 2 20 20\" >\r\n  <path d=\"M0 0h24v24H0z\" fill=\"none\" />\r\n  <path d=\"M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z\" />\r\n</svg>\r\n\r\n<button class=\"sii-profile-button__avatar list-ico-unselected\" mat-mini-fab (click)=\"openContactInformation()\"\r\n[ngStyle]=\"{'background-image':'url(' + photoURL + ')'}\"></button>\r\n\r\n@if (showContact) {\r\n  <sii-worker-contact-information [workerId]=\"lavuid\" [serviceUrl]=\"siiWorkerContactInformationServiceUrl\"  #wci ></sii-worker-contact-information>\r\n}\r\n", styles: [":host{min-width:40px;position:relative}button{width:40px;height:40px;background-size:cover}.list-ico{flex:0 0 auto;position:absolute}.list-ico-selected{display:none}sii-worker-contact-information ::ng-deep .mat-mdc-menu-trigger mat-icon{display:none}sii-worker-contact-information ::ng-deep .mat-mdc-menu-trigger{visibility:hidden;width:1px!important;height:1px!important}sii-worker-contact-information{position:absolute}\n"] }]
        }], ctorParameters: () => [{ type: SiiToolkitService }], propDecorators: { wci: [{
                type: ViewChild,
                args: [WorkerContactInformationComponent]
            }], lavuid: [{
                type: Input
            }], showContact: [{
                type: Input
            }], siiWorkerContactInformationServiceUrl: [{
                type: Input
            }] } });

class DelegationDialogComponent {
    constructor(dialogRef, siiToolkitService) {
        this.dialogRef = dialogRef;
        this.availableDelegations = [];
        this.availableDelegations = siiToolkitService.loggedUser.value.delegatedUsers;
    }
    ngOnInit() {
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: DelegationDialogComponent, deps: [{ token: i1$2.MatDialogRef }, { token: SiiToolkitService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "18.2.13", type: DelegationDialogComponent, isStandalone: true, selector: "sii-delegation-dialog", ngImport: i0, template: "<h2 mat-dialog-title i18n=\"@@DelegateLogin\">Login as delegated</h2>\r\n\r\n<div mat-dialog-content>\r\n  <mat-selection-list #deluser [multiple]=\"false\">\r\n    @for (del of  this.availableDelegations; track del) {\r\n      <mat-list-option [value]=\"del\">\r\n        <div class=\"usrRow\">\r\n          <sii-worker-icon [lavuid]=\"del.username\"></sii-worker-icon>\r\n          <div class=\"infoName\">{{del.name}} {{del.surname}}</div>\r\n        </div>\r\n      </mat-list-option>\r\n    }\r\n  </mat-selection-list>\r\n\r\n</div>\r\n\r\n\r\n<div mat-dialog-actions style=\"justify-content: flex-end;\">\r\n  <button mat-button mat-dialog-close  i18n=\"@@cancel\">Cancel</button>\r\n  <button mat-flat-button cdkFocusInitial [mat-dialog-close]=\"deluser?.selectedOptions?.selected[0]?.value\" color=\"primary\"   [disabled]=\"!deluser.selectedOptions.hasValue()\">Perform Relogin</button>\r\n</div>\r\n", styles: [".usrRow{display:flex;align-items:center}.usrRow .infoName{width:200px}.usrRow>*{margin-right:10px}.usrRow sii-worker-icon::ng-deep button{box-shadow:none}\n"], dependencies: [{ kind: "directive", type: MatDialogTitle, selector: "[mat-dialog-title], [matDialogTitle]", inputs: ["id"], exportAs: ["matDialogTitle"] }, { kind: "directive", type: MatDialogContent, selector: "[mat-dialog-content], mat-dialog-content, [matDialogContent]" }, { kind: "component", type: MatSelectionList, selector: "mat-selection-list", inputs: ["color", "compareWith", "multiple", "hideSingleSelectionIndicator", "disabled"], outputs: ["selectionChange"], exportAs: ["matSelectionList"] }, { kind: "component", type: MatListOption, selector: "mat-list-option", inputs: ["togglePosition", "checkboxPosition", "color", "value", "selected"], outputs: ["selectedChange"], exportAs: ["matListOption"] }, { kind: "component", type: WorkerIconComponent, selector: "sii-worker-icon", inputs: ["lavuid", "showContact", "siiWorkerContactInformationServiceUrl"] }, { kind: "directive", type: MatDialogActions, selector: "[mat-dialog-actions], mat-dialog-actions, [matDialogActions]", inputs: ["align"] }, { kind: "component", type: MatButton, selector: "    button[mat-button], button[mat-raised-button], button[mat-flat-button],    button[mat-stroked-button]  ", exportAs: ["matButton"] }, { kind: "directive", type: MatDialogClose, selector: "[mat-dialog-close], [matDialogClose]", inputs: ["aria-label", "type", "mat-dialog-close", "matDialogClose"], exportAs: ["matDialogClose"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: DelegationDialogComponent, decorators: [{
            type: Component,
            args: [{ selector: 'sii-delegation-dialog', standalone: true, imports: [MatDialogTitle, CdkScrollable, MatDialogContent, MatSelectionList, MatListOption, WorkerIconComponent, MatDialogActions, MatButton, MatDialogClose], template: "<h2 mat-dialog-title i18n=\"@@DelegateLogin\">Login as delegated</h2>\r\n\r\n<div mat-dialog-content>\r\n  <mat-selection-list #deluser [multiple]=\"false\">\r\n    @for (del of  this.availableDelegations; track del) {\r\n      <mat-list-option [value]=\"del\">\r\n        <div class=\"usrRow\">\r\n          <sii-worker-icon [lavuid]=\"del.username\"></sii-worker-icon>\r\n          <div class=\"infoName\">{{del.name}} {{del.surname}}</div>\r\n        </div>\r\n      </mat-list-option>\r\n    }\r\n  </mat-selection-list>\r\n\r\n</div>\r\n\r\n\r\n<div mat-dialog-actions style=\"justify-content: flex-end;\">\r\n  <button mat-button mat-dialog-close  i18n=\"@@cancel\">Cancel</button>\r\n  <button mat-flat-button cdkFocusInitial [mat-dialog-close]=\"deluser?.selectedOptions?.selected[0]?.value\" color=\"primary\"   [disabled]=\"!deluser.selectedOptions.hasValue()\">Perform Relogin</button>\r\n</div>\r\n", styles: [".usrRow{display:flex;align-items:center}.usrRow .infoName{width:200px}.usrRow>*{margin-right:10px}.usrRow sii-worker-icon::ng-deep button{box-shadow:none}\n"] }]
        }], ctorParameters: () => [{ type: i1$2.MatDialogRef }, { type: SiiToolkitService }] });

class DelegationService {
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: DelegationService, deps: [{ token: i1.HttpClient }, { token: SiiToolkitService }, { token: i1$2.MatDialog }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: DelegationService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: DelegationService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: () => [{ type: i1.HttpClient }, { type: SiiToolkitService }, { type: i1$2.MatDialog }] });

class SdacPreviewService {
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: SdacPreviewService, deps: [{ token: i1.HttpClient }, { token: SiiToolkitService }, { token: SiiWaitService }, { token: i4.Router }, { token: SiiEngageService }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: SdacPreviewService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: SdacPreviewService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: () => [{ type: i1.HttpClient }, { type: SiiToolkitService }, { type: SiiWaitService }, { type: i4.Router }, { type: SiiEngageService }] });

class ProfileButtonComponent {
    get sdacTicketCount() {
        return this.sdacPreviewService.ticketCount;
    }
    get sdacNotificationCount() {
        return this.sdacPreviewService.notificationCount;
    }
    get corporateItCalendarEventsCount() {
        return this.engageService.corporateCalendarEventsCount;
    }
    constructor(siiToolkitService, delegationService, router, sdacPreviewService, engageService) {
        this.siiToolkitService = siiToolkitService;
        this.delegationService = delegationService;
        this.router = router;
        this.sdacPreviewService = sdacPreviewService;
        this.engageService = engageService;
    }
    ngOnInit() {
        // this.photoURL = `${this.siiToolkitService.environment.domain}/sii_common/photo.jpg?${(new Date()).getTime()}`;
        this.photoURL = `${this.siiToolkitService.environment.domain}/sii_common/photo.jpg?${btoa(this.siiToolkitService.loggedUser.value.workerId || '')}`;
    }
    doLogout() {
        window.location.href = `${this.siiToolkitService.environment.domain}/sii_common/logout`;
    }
    doDelegation() {
        this.delegationService.openDelegation();
    }
    doDelegationLogout() {
        this.delegationService.logout();
    }
    openSdacTiketsByCode(code) {
        this.sdacPreviewService.openSdacTiketsByCode(code);
    }
    openSdacNotification() {
        this.sdacPreviewService.openSdacType(true);
    }
    openSdacTicket() {
        this.sdacPreviewService.openSdacType(false);
    }
    goToDeadlines() {
        if (this.engageService.engageAvailable) {
            if (this.engageService.isEngage) {
                this.router.navigateByUrl('deadlines');
            }
            else {
                this.openUrlInWindow(this.engageService.engageDomain + '/deadlines');
            }
        }
        else {
            alert('enagage unavailable');
        }
    }
    goToProfile() {
        if (this.engageService.engageAvailable) {
            if (this.engageService.isEngage) {
                this.router.navigateByUrl('profile');
            }
            else {
                this.openUrlInWindow(this.engageService.engageDomain + '/profile');
            }
        }
        else {
            alert('enagage unavailable');
        }
    }
    openUrlInWindow(url) {
        window.open(url, '_blank', `target=_blank,width=4000,height=4000`);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: ProfileButtonComponent, deps: [{ token: SiiToolkitService }, { token: DelegationService }, { token: i4.Router }, { token: SdacPreviewService }, { token: SiiEngageService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "18.2.13", type: ProfileButtonComponent, isStandalone: true, selector: "sii-profile-button", inputs: { mySelf: "mySelf", hideDetail: "hideDetail" }, ngImport: i0, template: "\r\n<button class=\"sii-profile-button__avatar\" mat-mini-fab\r\n  [ngStyle]=\"{'background-image':'url(' + photoURL + ')'}\"\r\n  >\r\n  @if (corporateItCalendarEventsCount!=0) {\r\n    <span class=\"notificationCount\"> {{corporateItCalendarEventsCount}}</span>\r\n  }\r\n  @if (sdacTicketCount!=0 || sdacNotificationCount!=0) {\r\n    <span    class=\"notificationCountSdac\">{{sdacTicketCount+sdacNotificationCount}}</span>\r\n  }\r\n</button>\r\n@if (!hideDetail) {\r\n  <div class=\"profButtDetailBox\">\r\n    <div class=\"profButtDetailBox_spacer\"></div>\r\n    <div class=\"profButtDetail_container\">\r\n      <div class=\"profile\">\r\n        <p   class=\"text-uppercase name\"><b>{{mySelf?.firstName}} {{mySelf?.lastName}}</b></p>\r\n        <!-- Dettagli utente -->\r\n        <dl class=\"eng-user-details \">\r\n          <dt i18n=\"@@toolbar_workerId\">Worker ID</dt>\r\n          <dd>{{mySelf?.workerId}}</dd>\r\n          <dt><abbr i18n-title=\"@@toolbar_cc\" title=\"Competence Center\" i18n=\"@@toolbar_cc_dim\">CC</abbr></dt>\r\n          <dd><abbr  [title]=\"mySelf.costCenterDescr\" >{{mySelf?.costCenterId}}</abbr></dd>\r\n          <!-- <dd [matTooltip]=\"mySelf.costCenterDescr\">{{mySelf?.costCenterId}}</dd> -->\r\n          <dt i18n=\"@@toolbar_manager\">Manager</dt>\r\n          <dd>{{mySelf.costCenterResp?.firstName}} {{mySelf.costCenterResp?.lastName}}</dd>\r\n          @if (!!mySelf.tutorWorkerId) {\r\n            <dt i18n=\"@@toolbar_tutor\">Tutor</dt>\r\n            <dd>{{mySelf.tutorFistName}} {{mySelf.tutorLastName}}</dd>\r\n          }\r\n          @if (!!mySelf.evaluatorWorkerId) {\r\n            <dt i18n=\"@@toolbar_evaluator\">Evaluator</dt>\r\n            <dd>{{mySelf.evaluatorFistName}} {{mySelf.evaluatorLastName}}</dd>\r\n          }\r\n        </dl>\r\n        <ul class=\"list-unstyled user-actions\">\r\n          <li><a (click)=\"goToProfile()\" tabindex=\"0\" title=\"\" class=\"\"><b i18n=\"@@navbar_goToProfile\">Go To Profile</b> <mat-icon>navigate_next</mat-icon></a></li>\r\n          <li><a href=\"https://password.eng.it/\" target=\"_blank\" title=\"\" class=\"\"><b i18n=\"@@navbar_changePassford\">Change Password</b> <mat-icon>navigate_next</mat-icon></a></li>\r\n          <li><a href=\"https://mysignins.microsoft.com/security-info\" target=\"_blank\" title=\"\" class=\"\"><b i18n=\"@@navbar_mfaSettings\">MFA Settings</b> <mat-icon>navigate_next</mat-icon></a></li>\r\n          <li><a  (click)=\"doLogout()\" tabindex=\"0\" title=\"\" class=\"\"><b i18n=\"@@navbar_logout\">Logout</b> <mat-icon>navigate_next</mat-icon></a></li>\r\n          <br><br>\r\n          @if (!!mySelf.delegatedUsers) {\r\n            <li (click)=\"doDelegation()\" ><a       title=\"\" class=\"\"><b i18n=\"@@DelegateLogin\">Login as delegated</b> <mat-icon>navigate_next</mat-icon></a></li>\r\n          }\r\n          @if (!!mySelf.isInDelegation) {\r\n            <li (click)=\"doDelegationLogout()\"><a  title=\"\" class=\"\"><b ii18n=\"@@DelegateLogout\">Logout from delegation</b> <mat-icon>navigate_next</mat-icon></a></li>\r\n          }\r\n        </ul>\r\n      </div>\r\n    </div>\r\n  </div>\r\n}\r\n\r\n", styles: [":host{margin:auto 10px 10px 0;z-index:1}.sii-profile-button__avatar,.sii-profile-button__menu_avatar{background-size:cover;outline:none}.sii-profile-button__avatar{width:40px;height:40px}.sii-profile-button__menu_avatar{margin-right:10px;width:48px;height:48px;border:2px solid white;box-shadow:none}::ng-deep .sii-profile-button__menu{width:260px;max-width:100vw!important;padding:20px 0 20px 23px}::ng-deep .sii-profile-button__menu .mat-mdc-menu-content{padding:0!important}.sii-profile-button__menu_toolbar{display:flex;flex-direction:row}.sii-profile-button__menu_toolbar_right{display:flex;flex-direction:column}.sii-profile-button__menu_toolbar_name{font-size:18px;line-height:20px}.sii-profile-button__menu_goto_profile{color:#0073b1;font-size:12px;cursor:pointer}.sii-profile-button__menu_userInfo{padding-top:20px}.sii-profile-button__menu_actions>div{display:flex;align-items:center;height:45px;cursor:pointer}.sii-profile-button__menu_actions>div mat-icon{padding-right:10px}.sii-profile-button__menu_category_divider{font-size:14px;font-weight:700;background-color:#f3f6f8;line-height:28px;padding:0 6px;border-top:1px solid lightgray;border-bottom:1px solid lightgray;color:gray}.profButtDetailBox{display:none;max-height:calc(100vh - 62px);flex-direction:column;width:350px;max-width:100vw;position:absolute;right:0}.profButtDetailBox .profButtDetailBox_spacer{min-height:10px}.profButtDetailBox .profButtDetail_container{padding:30px;overflow:auto;box-sizing:border-box;background-color:#09090917;-webkit-backdrop-filter:blur(12px) brightness(.75);backdrop-filter:blur(12px) brightness(.75)}.profButtDetailBox .profButtDetail_container .name{font-size:16px}:host:hover .profButtDetailBox{display:flex}.text-uppercase{text-transform:uppercase}.list-unstyled{padding-left:0;list-style:none}.eng-user-details{margin-top:1rem;display:flex;flex-wrap:wrap}.eng-user-details dt{font-weight:700;text-transform:uppercase;font-size:.65rem;flex:0 0 42%;max-width:42%}.eng-user-details dd{text-transform:none;flex:0 0 58%;max-width:58%;margin-bottom:.5rem;margin-left:0}.user-actions li a{display:flex;align-items:center;padding:.33rem;padding-left:0;font-size:1.16em;color:#fff;outline:none;text-decoration:none;cursor:pointer}.notificationCount{background-color:#c51b88;top:-25px;display:none}.notificationCountSdac{background-color:#918d8d;bottom:-25px;display:none}.notificationCount,.notificationCountSdac{padding:2px 2px 1px;border-radius:10rem;color:#fff;position:absolute;line-height:15px;font-size:10px;letter-spacing:1.1px;left:9px;min-width:17px}@media screen and (max-width: 1050px){.notificationCountSdac,.notificationCount{display:block}}@media screen and (min-width: 576px){.profButtDetail_content{width:540px}}@media screen and (min-width: 768px){.profButtDetail_content{width:720px}}@media screen and (min-width: 992px){.profButtDetail_content{width:960px}}@media screen and (min-width: 1200px){.profButtDetail_content{width:1140px}}@media screen and (min-width: 1440px){.profButtDetail_content{width:1320px}}@media screen and (min-width: 1600px){.profButtDetail_content{width:1450px}}@media screen and (min-width: 1920px){.profButtDetail_content{width:1610px}}\n"], dependencies: [{ kind: "component", type: MatMiniFabButton, selector: "button[mat-mini-fab]", exportAs: ["matButton"] }, { kind: "directive", type: NgStyle, selector: "[ngStyle]", inputs: ["ngStyle"] }, { kind: "component", type: MatIcon, selector: "mat-icon", inputs: ["color", "inline", "svgIcon", "fontSet", "fontIcon"], exportAs: ["matIcon"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: ProfileButtonComponent, decorators: [{
            type: Component,
            args: [{ selector: 'sii-profile-button', standalone: true, imports: [MatMiniFabButton, NgStyle, MatIcon], template: "\r\n<button class=\"sii-profile-button__avatar\" mat-mini-fab\r\n  [ngStyle]=\"{'background-image':'url(' + photoURL + ')'}\"\r\n  >\r\n  @if (corporateItCalendarEventsCount!=0) {\r\n    <span class=\"notificationCount\"> {{corporateItCalendarEventsCount}}</span>\r\n  }\r\n  @if (sdacTicketCount!=0 || sdacNotificationCount!=0) {\r\n    <span    class=\"notificationCountSdac\">{{sdacTicketCount+sdacNotificationCount}}</span>\r\n  }\r\n</button>\r\n@if (!hideDetail) {\r\n  <div class=\"profButtDetailBox\">\r\n    <div class=\"profButtDetailBox_spacer\"></div>\r\n    <div class=\"profButtDetail_container\">\r\n      <div class=\"profile\">\r\n        <p   class=\"text-uppercase name\"><b>{{mySelf?.firstName}} {{mySelf?.lastName}}</b></p>\r\n        <!-- Dettagli utente -->\r\n        <dl class=\"eng-user-details \">\r\n          <dt i18n=\"@@toolbar_workerId\">Worker ID</dt>\r\n          <dd>{{mySelf?.workerId}}</dd>\r\n          <dt><abbr i18n-title=\"@@toolbar_cc\" title=\"Competence Center\" i18n=\"@@toolbar_cc_dim\">CC</abbr></dt>\r\n          <dd><abbr  [title]=\"mySelf.costCenterDescr\" >{{mySelf?.costCenterId}}</abbr></dd>\r\n          <!-- <dd [matTooltip]=\"mySelf.costCenterDescr\">{{mySelf?.costCenterId}}</dd> -->\r\n          <dt i18n=\"@@toolbar_manager\">Manager</dt>\r\n          <dd>{{mySelf.costCenterResp?.firstName}} {{mySelf.costCenterResp?.lastName}}</dd>\r\n          @if (!!mySelf.tutorWorkerId) {\r\n            <dt i18n=\"@@toolbar_tutor\">Tutor</dt>\r\n            <dd>{{mySelf.tutorFistName}} {{mySelf.tutorLastName}}</dd>\r\n          }\r\n          @if (!!mySelf.evaluatorWorkerId) {\r\n            <dt i18n=\"@@toolbar_evaluator\">Evaluator</dt>\r\n            <dd>{{mySelf.evaluatorFistName}} {{mySelf.evaluatorLastName}}</dd>\r\n          }\r\n        </dl>\r\n        <ul class=\"list-unstyled user-actions\">\r\n          <li><a (click)=\"goToProfile()\" tabindex=\"0\" title=\"\" class=\"\"><b i18n=\"@@navbar_goToProfile\">Go To Profile</b> <mat-icon>navigate_next</mat-icon></a></li>\r\n          <li><a href=\"https://password.eng.it/\" target=\"_blank\" title=\"\" class=\"\"><b i18n=\"@@navbar_changePassford\">Change Password</b> <mat-icon>navigate_next</mat-icon></a></li>\r\n          <li><a href=\"https://mysignins.microsoft.com/security-info\" target=\"_blank\" title=\"\" class=\"\"><b i18n=\"@@navbar_mfaSettings\">MFA Settings</b> <mat-icon>navigate_next</mat-icon></a></li>\r\n          <li><a  (click)=\"doLogout()\" tabindex=\"0\" title=\"\" class=\"\"><b i18n=\"@@navbar_logout\">Logout</b> <mat-icon>navigate_next</mat-icon></a></li>\r\n          <br><br>\r\n          @if (!!mySelf.delegatedUsers) {\r\n            <li (click)=\"doDelegation()\" ><a       title=\"\" class=\"\"><b i18n=\"@@DelegateLogin\">Login as delegated</b> <mat-icon>navigate_next</mat-icon></a></li>\r\n          }\r\n          @if (!!mySelf.isInDelegation) {\r\n            <li (click)=\"doDelegationLogout()\"><a  title=\"\" class=\"\"><b ii18n=\"@@DelegateLogout\">Logout from delegation</b> <mat-icon>navigate_next</mat-icon></a></li>\r\n          }\r\n        </ul>\r\n      </div>\r\n    </div>\r\n  </div>\r\n}\r\n\r\n", styles: [":host{margin:auto 10px 10px 0;z-index:1}.sii-profile-button__avatar,.sii-profile-button__menu_avatar{background-size:cover;outline:none}.sii-profile-button__avatar{width:40px;height:40px}.sii-profile-button__menu_avatar{margin-right:10px;width:48px;height:48px;border:2px solid white;box-shadow:none}::ng-deep .sii-profile-button__menu{width:260px;max-width:100vw!important;padding:20px 0 20px 23px}::ng-deep .sii-profile-button__menu .mat-mdc-menu-content{padding:0!important}.sii-profile-button__menu_toolbar{display:flex;flex-direction:row}.sii-profile-button__menu_toolbar_right{display:flex;flex-direction:column}.sii-profile-button__menu_toolbar_name{font-size:18px;line-height:20px}.sii-profile-button__menu_goto_profile{color:#0073b1;font-size:12px;cursor:pointer}.sii-profile-button__menu_userInfo{padding-top:20px}.sii-profile-button__menu_actions>div{display:flex;align-items:center;height:45px;cursor:pointer}.sii-profile-button__menu_actions>div mat-icon{padding-right:10px}.sii-profile-button__menu_category_divider{font-size:14px;font-weight:700;background-color:#f3f6f8;line-height:28px;padding:0 6px;border-top:1px solid lightgray;border-bottom:1px solid lightgray;color:gray}.profButtDetailBox{display:none;max-height:calc(100vh - 62px);flex-direction:column;width:350px;max-width:100vw;position:absolute;right:0}.profButtDetailBox .profButtDetailBox_spacer{min-height:10px}.profButtDetailBox .profButtDetail_container{padding:30px;overflow:auto;box-sizing:border-box;background-color:#09090917;-webkit-backdrop-filter:blur(12px) brightness(.75);backdrop-filter:blur(12px) brightness(.75)}.profButtDetailBox .profButtDetail_container .name{font-size:16px}:host:hover .profButtDetailBox{display:flex}.text-uppercase{text-transform:uppercase}.list-unstyled{padding-left:0;list-style:none}.eng-user-details{margin-top:1rem;display:flex;flex-wrap:wrap}.eng-user-details dt{font-weight:700;text-transform:uppercase;font-size:.65rem;flex:0 0 42%;max-width:42%}.eng-user-details dd{text-transform:none;flex:0 0 58%;max-width:58%;margin-bottom:.5rem;margin-left:0}.user-actions li a{display:flex;align-items:center;padding:.33rem;padding-left:0;font-size:1.16em;color:#fff;outline:none;text-decoration:none;cursor:pointer}.notificationCount{background-color:#c51b88;top:-25px;display:none}.notificationCountSdac{background-color:#918d8d;bottom:-25px;display:none}.notificationCount,.notificationCountSdac{padding:2px 2px 1px;border-radius:10rem;color:#fff;position:absolute;line-height:15px;font-size:10px;letter-spacing:1.1px;left:9px;min-width:17px}@media screen and (max-width: 1050px){.notificationCountSdac,.notificationCount{display:block}}@media screen and (min-width: 576px){.profButtDetail_content{width:540px}}@media screen and (min-width: 768px){.profButtDetail_content{width:720px}}@media screen and (min-width: 992px){.profButtDetail_content{width:960px}}@media screen and (min-width: 1200px){.profButtDetail_content{width:1140px}}@media screen and (min-width: 1440px){.profButtDetail_content{width:1320px}}@media screen and (min-width: 1600px){.profButtDetail_content{width:1450px}}@media screen and (min-width: 1920px){.profButtDetail_content{width:1610px}}\n"] }]
        }], ctorParameters: () => [{ type: SiiToolkitService }, { type: DelegationService }, { type: i4.Router }, { type: SdacPreviewService }, { type: SiiEngageService }], propDecorators: { mySelf: [{
                type: Input
            }], hideDetail: [{
                type: Input
            }] } });

class WaitComponent {
    constructor(wait) {
        this.wait = wait;
    }
    ngOnInit() {
        this.display$ = this.wait.display$;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: WaitComponent, deps: [{ token: SiiWaitService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "18.2.13", type: WaitComponent, isStandalone: true, selector: "sii-wait", ngImport: i0, template: "@if (display$ | async) {\r\n  <div class=\"sii-wait-screen\">\r\n    <mat-spinner ></mat-spinner>\r\n  </div>\r\n}\r\n", styles: [".sii-wait-screen{z-index:1001;border:0;margin:0;padding:0;height:100%;width:100%;top:0;left:0;position:fixed;background-color:#0000001a;align-items:center;justify-content:center;display:flex}\n"], dependencies: [{ kind: "component", type: MatProgressSpinner, selector: "mat-progress-spinner, mat-spinner", inputs: ["color", "mode", "value", "diameter", "strokeWidth"], exportAs: ["matProgressSpinner"] }, { kind: "pipe", type: AsyncPipe, name: "async" }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: WaitComponent, decorators: [{
            type: Component,
            args: [{ selector: 'sii-wait', standalone: true, imports: [MatProgressSpinner, AsyncPipe], template: "@if (display$ | async) {\r\n  <div class=\"sii-wait-screen\">\r\n    <mat-spinner ></mat-spinner>\r\n  </div>\r\n}\r\n", styles: [".sii-wait-screen{z-index:1001;border:0;margin:0;padding:0;height:100%;width:100%;top:0;left:0;position:fixed;background-color:#0000001a;align-items:center;justify-content:center;display:flex}\n"] }]
        }], ctorParameters: () => [{ type: SiiWaitService }] });

class SiiOutComponent {
    set appearance(val) {
        if (val !== undefined && this.appearanceProp.indexOf(val) !== -1) {
            this.hostClass = 'sii-out-appearance-' + val;
        }
        else {
            this.hostClass = 'sii-out-appearance-column';
        }
    }
    ;
    constructor() {
        this.appearanceProp = ['column', 'inline', 'column-reverse'];
        this.hostClass = 'sii-out-appearance-column';
    }
    ngOnInit() {
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: SiiOutComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "18.2.13", type: SiiOutComponent, isStandalone: true, selector: "sii-out", inputs: { appearance: "appearance" }, host: { properties: { "class": "this.hostClass" } }, ngImport: i0, template: "<span class=\"siiOUT_label\"><ng-content select=\"label\"></ng-content></span>\r\n<span class=\"siiOUT_content\"><ng-content select=\"content\"></ng-content></span>\r\n", styles: [":host{display:flex;flex-direction:column}:host.sii-out-appearance-inline{flex-direction:row}:host.sii-out-appearance-column-reverse{flex-direction:column-reverse;text-align:center;line-height:14px}:host.sii-out-appearance-column-reverse .siiOUT_label{font-size:10px;padding-right:0}:host.sii-out-appearance-column-reverse .siiOUT_content{font-size:24px;line-height:20px}:host.sii-out-appearance-column{text-align:center;line-height:14px}:host.sii-out-appearance-column .siiOUT_label{font-size:10px}:host.sii-out-appearance-column .siiOUT_content{font-size:24px}.siiOUT_label{text-transform:uppercase;padding-right:10px;letter-spacing:1px}\n"] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: SiiOutComponent, decorators: [{
            type: Component,
            args: [{ selector: 'sii-out', standalone: true, template: "<span class=\"siiOUT_label\"><ng-content select=\"label\"></ng-content></span>\r\n<span class=\"siiOUT_content\"><ng-content select=\"content\"></ng-content></span>\r\n", styles: [":host{display:flex;flex-direction:column}:host.sii-out-appearance-inline{flex-direction:row}:host.sii-out-appearance-column-reverse{flex-direction:column-reverse;text-align:center;line-height:14px}:host.sii-out-appearance-column-reverse .siiOUT_label{font-size:10px;padding-right:0}:host.sii-out-appearance-column-reverse .siiOUT_content{font-size:24px;line-height:20px}:host.sii-out-appearance-column{text-align:center;line-height:14px}:host.sii-out-appearance-column .siiOUT_label{font-size:10px}:host.sii-out-appearance-column .siiOUT_content{font-size:24px}.siiOUT_label{text-transform:uppercase;padding-right:10px;letter-spacing:1px}\n"] }]
        }], ctorParameters: () => [], propDecorators: { hostClass: [{
                type: HostBinding,
                args: ['class']
            }], appearance: [{
                type: Input
            }] } });

class PageHoverMaskComponent {
    constructor() {
        this.display = 'none';
    }
    ngOnInit() {
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: PageHoverMaskComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "18.2.13", type: PageHoverMaskComponent, isStandalone: true, selector: "sii-page-hover-mask", host: { properties: { "style.display": "this.display" } }, ngImport: i0, template: '', isInline: true, styles: [":host{position:fixed;width:calc(100vw - var(--safe-area-inset-right) - var(--safe-area-inset-left));height:100%;background-color:#3e353578;left:0;top:var(--toolbarHeight);overscroll-behavior:contain;overflow:auto}\n"] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: PageHoverMaskComponent, decorators: [{
            type: Component,
            args: [{ selector: 'sii-page-hover-mask', template: '', standalone: true, styles: [":host{position:fixed;width:calc(100vw - var(--safe-area-inset-right) - var(--safe-area-inset-left));height:100%;background-color:#3e353578;left:0;top:var(--toolbarHeight);overscroll-behavior:contain;overflow:auto}\n"] }]
        }], ctorParameters: () => [], propDecorators: { display: [{
                type: HostBinding,
                args: ['style.display']
            }] } });

// here is the code that deals with the legacy systems.
class SIILinkManager {
    constructor() {
        this.openedLinks = [];
    }
    openLink(menuVoice, openInThisWindow, companyId) {
        let urlToCall = menuVoice.link;
        const windowTarget = openInThisWindow ? '_self' : 'blank';
        const features = `target=${windowTarget},width=400,height=400,resizable=0,scrollbars=1,status=1,toolbar=0,menubar=0`;
        if (urlToCall.indexOf('?') < 0) {
            urlToCall += '?';
        }
        urlToCall += '&WebCacheLocalId=' + new Date().getTime().toString();
        if (companyId) {
            urlToCall += '&soccodice=' + companyId;
        }
        // the 2°parameter is the name of the opened window. if a window with the same name is opened, the same widow is used
        // if add the 3°parameter features , the new link is opened in a new window intead of tab
        const win = window.open(urlToCall, openInThisWindow ? '_self' : `${menuVoice.title}${(' - ' + companyId) || ''}`, features);
        if (!openInThisWindow) {
            win.addEventListener('load', () => {
                if (win.location.href.toLowerCase().indexOf('login') !== -1) {
                    console.log('sessione scaduta');
                    win.close();
                    window.location.reload();
                }
            }, false);
        }
        this.openedLinks.push(win);
        return win;
    }
    closeAllOpenedLinks() {
        for (const win of this.openedLinks) {
            win.close();
        }
    }
}
/*
window.SII_LEGACY = {};
(function (window, document, undefined) {
  window.SII_LEGACY.openedLinks = [];
  window.SII_LEGACY.openLinkInNewWIndow = (URL,companyId) => openLink(URL,companyId, '_blank');
  window.SII_LEGACY.closeAllOpenedLinks = () => closeAllOpenedLinks();

  function closeAllOpenedLinks() {
    for (var idx in window.SII_LEGACY.openedLinks) {
      var win = window.SII_LEGACY.openedLinks[idx];
      win.close();
    }
  }

  function openLink(URL, windowName, companyId) {
    if (target.indexOf('?') < 0) {
      target += '?';
    }
    target += '&WebCacheLocalId=' + eval('(new Date().getTime())');
    target += '&sii_cod_soc=' + companyId;
    var win = window.open(URL, windowName, 'target=' + windowName + ',
    width=400,height=400,resizable=0,scrollbars=1,status=1,toolbar=0,menubar=0');
    window.SII_LEGACY.openLinks.push(win)
    return win;
  }


})(window, document);
*/

class CompanySelectionDialogComponent {
    constructor(dialogRef, data) {
        this.dialogRef = dialogRef;
        this.data = data;
    }
    selectCompany(companyId) {
        this.dialogRef.close(companyId);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: CompanySelectionDialogComponent, deps: [{ token: i1$2.MatDialogRef }, { token: MAT_DIALOG_DATA }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "18.2.13", type: CompanySelectionDialogComponent, isStandalone: true, selector: "sii-company-selection-dialog", ngImport: i0, template: "<h2 mat-dialog-title>{{data.title}} - <span i18n=\"@@dialogSelectCompany-choose_company\">choose a company</span></h2>\r\n<mat-dialog-content>\r\n  @for (company of data.companies; track company) {\r\n    <div class=\"item-word-wrap\" (click)=\"selectCompany(company.id)\">\r\n      <div class=\"item-title\"> {{company?.briefDescription}}</div>\r\n    </div>\r\n  }\r\n</mat-dialog-content>\r\n<mat-dialog-actions>\r\n  <button mat-button mat-dialog-close i18n=\"@@cancel\">Cancel</button>\r\n</mat-dialog-actions>\r\n", styles: ["mat-dialog-content{display:grid;grid-template-columns:repeat(2,1fr);grid-column-gap:8px;padding-bottom:5px}mat-dialog-actions{justify-content:flex-end}.item-word-wrap{height:30px;display:flex;flex-direction:row;justify-content:space-between;align-items:center;cursor:pointer}.item-word-wrap:hover{background-color:#eee;box-shadow:0 3px 1px -2px #0003,0 2px 2px #00000024,0 1px 5px #0000001f}.item-word-wrap:hover .submenu{display:block}.submenu{display:none}.space{flex-grow:2}.popUp{display:flex}.popUpText{font-size:12px}\n"], dependencies: [{ kind: "directive", type: MatDialogTitle, selector: "[mat-dialog-title], [matDialogTitle]", inputs: ["id"], exportAs: ["matDialogTitle"] }, { kind: "directive", type: MatDialogContent, selector: "[mat-dialog-content], mat-dialog-content, [matDialogContent]" }, { kind: "directive", type: MatDialogActions, selector: "[mat-dialog-actions], mat-dialog-actions, [matDialogActions]", inputs: ["align"] }, { kind: "component", type: MatButton, selector: "    button[mat-button], button[mat-raised-button], button[mat-flat-button],    button[mat-stroked-button]  ", exportAs: ["matButton"] }, { kind: "directive", type: MatDialogClose, selector: "[mat-dialog-close], [matDialogClose]", inputs: ["aria-label", "type", "mat-dialog-close", "matDialogClose"], exportAs: ["matDialogClose"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: CompanySelectionDialogComponent, decorators: [{
            type: Component,
            args: [{ selector: 'sii-company-selection-dialog', standalone: true, imports: [MatDialogTitle, CdkScrollable, MatDialogContent, MatDialogActions, MatButton, MatDialogClose], template: "<h2 mat-dialog-title>{{data.title}} - <span i18n=\"@@dialogSelectCompany-choose_company\">choose a company</span></h2>\r\n<mat-dialog-content>\r\n  @for (company of data.companies; track company) {\r\n    <div class=\"item-word-wrap\" (click)=\"selectCompany(company.id)\">\r\n      <div class=\"item-title\"> {{company?.briefDescription}}</div>\r\n    </div>\r\n  }\r\n</mat-dialog-content>\r\n<mat-dialog-actions>\r\n  <button mat-button mat-dialog-close i18n=\"@@cancel\">Cancel</button>\r\n</mat-dialog-actions>\r\n", styles: ["mat-dialog-content{display:grid;grid-template-columns:repeat(2,1fr);grid-column-gap:8px;padding-bottom:5px}mat-dialog-actions{justify-content:flex-end}.item-word-wrap{height:30px;display:flex;flex-direction:row;justify-content:space-between;align-items:center;cursor:pointer}.item-word-wrap:hover{background-color:#eee;box-shadow:0 3px 1px -2px #0003,0 2px 2px #00000024,0 1px 5px #0000001f}.item-word-wrap:hover .submenu{display:block}.submenu{display:none}.space{flex-grow:2}.popUp{display:flex}.popUpText{font-size:12px}\n"] }]
        }], ctorParameters: () => [{ type: i1$2.MatDialogRef }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [MAT_DIALOG_DATA]
                }] }] });

class GlobalMenuVoicesFilterPipe {
    transform(menuVoices, company, textFilter) {
        if (!menuVoices || (!textFilter && (!company || company.length === 0))) {
            return menuVoices;
        }
        return menuVoices.filter(mv => (!mv.companyDep
            || company == null || company.length === 0
            || (!!mv.companies && mv.companies.find(cmp => cmp === company) != null)))
            .filter(mv => mv.title.toLowerCase().indexOf(textFilter.toLowerCase()) !== -1);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: GlobalMenuVoicesFilterPipe, deps: [], target: i0.ɵɵFactoryTarget.Pipe }); }
    static { this.ɵpipe = i0.ɵɵngDeclarePipe({ minVersion: "14.0.0", version: "18.2.13", ngImport: i0, type: GlobalMenuVoicesFilterPipe, isStandalone: true, name: "globalMenuVoicesFilter" }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: GlobalMenuVoicesFilterPipe, decorators: [{
            type: Pipe,
            args: [{
                    name: 'globalMenuVoicesFilter',
                    standalone: true
                }]
        }] });

class GlobalMenuFilterPipe {
    transform(menuCategories, company, textFilter) {
        if (!menuCategories || (!textFilter && (!company || company.length === 0))) {
            return menuCategories;
        }
        // filter items array, items which match and return true will be
        // kept, false will be filtered out
        // return items.filter(item => item.title.indexOf(filter.title) !== -1);
        return menuCategories.map((menuCat) => {
            const filtredMenu = { ...menuCat };
            filtredMenu.voices = filtredMenu.voices
                .filter(mv => (!mv.companyDep
                || company == null || company.length === 0
                || (!!mv.companies && mv.companies.find(cmp => cmp === company) != null)))
                .filter(mv => menuCat.category.toLowerCase().indexOf(textFilter.toLowerCase()) !== -1
                || mv.title.toLowerCase().indexOf(textFilter.toLowerCase()) !== -1);
            return filtredMenu;
        }).filter(mc => mc.voices.length > 0);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: GlobalMenuFilterPipe, deps: [], target: i0.ɵɵFactoryTarget.Pipe }); }
    static { this.ɵpipe = i0.ɵɵngDeclarePipe({ minVersion: "14.0.0", version: "18.2.13", ngImport: i0, type: GlobalMenuFilterPipe, isStandalone: true, name: "globalMenuFilter" }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: GlobalMenuFilterPipe, decorators: [{
            type: Pipe,
            args: [{
                    name: 'globalMenuFilter',
                    standalone: true
                }]
        }] });

class GlobalMenuService {
    constructor(http, siiToolkitService) {
        this.http = http;
        this.siiToolkitService = siiToolkitService;
        // favoriteVoices=[] as SiiMenuVoice[];
        this.favoriteVoice = new BehaviorSubject([]);
        this.menu = new BehaviorSubject([]);
        this.selectedCompany = new BehaviorSubject(null);
        this.availableCompany = new BehaviorSubject([]);
    }
    initMenu() {
        // load if never loaded before
        if (this.menu.value.length === 0) {
            this.loadMenu();
        }
    }
    loadMenu() {
        this.http.get(`${this.siiToolkitService.environment.domain}/sii-menu/menu/voices`)
            // publishReplay(1), refCount() means cache the value
            .pipe(map(menuFolders => this.enrichMenus(menuFolders)), publishReplay(1), refCount()).subscribe(menus => {
            this.menu.next(menus);
            this.loadMenuUserInfo();
            this.loadFavoriteVoices();
        });
    }
    buildAvailableCompany() {
        let cmp = [];
        this.menu.value.forEach(menu => menu.voices.forEach(voice => cmp = (voice.companies ? Array.from(new Set(cmp.concat(voice.companies))) : cmp)));
        const cmpObj = cmp.map(c => this.menuUserInfo.companies[c]);
        cmpObj.sort((a, b) => a.briefDescription.localeCompare(b.briefDescription));
        this.availableCompany.next(cmpObj);
    }
    loadMenuUserInfo() {
        this.http.get(`${this.siiToolkitService.environment.domain}/sii-menu/menu/user_info`)
            // rxjs way to do caching
            .pipe(
        // map(userInfo => this.enrichUserInfo(userInfo)),
        publishReplay(1), refCount()).subscribe(cmp => {
            this.menuUserInfo = cmp;
            this.buildAvailableCompany();
            this.initSelectedCompany();
        });
    }
    enrichMenus(folders) {
        folders.forEach((f) => this.enrichMenu(f));
        return folders;
    }
    enrichMenu(folder) {
        switch (folder.category.toUpperCase()) {
            // case 'SIIWEB': folder.icon = 'assignment'; // siiweb
            //         break;
            case 'MODULI SIIWEBLITE':
                folder.icon = 'moduli'; // modules
                break;
            case 'SCUOLA':
                folder.icon = 'scuola'; // modules
                break;
            case 'COMMESSE':
                folder.icon = 'commesse'; // internal order
                break;
            case 'LAVORATORI':
                folder.icon = 'lavoratori_dipendenti'; // workers
                break;
            case 'ACQUISTI':
                folder.icon = 'acquisti'; // Purchase management
                break;
            case 'UTILITY':
                folder.icon = 'utility'; // utility
                break;
            case 'VENDITE':
                folder.icon = 'vendite'; // Sales management
                break;
            case 'REPORT':
                folder.icon = 'report'; // REPORT
                break;
            case 'PREFERENZE':
                folder.icon = 'preferenze'; // Preferenze
                break;
            case 'CDC':
                folder.icon = 'cdc'; // cost center
                break;
            case 'ALTRE APPLICAZIONI':
                folder.icon = 'altri_applicativi'; // other
                break;
            case 'DIPENDENTI':
                folder.icon = 'lavoratori_dipendenti'; // employees
                break;
            case 'ESTERNI':
                folder.icon = 'lavoratori_esterni'; // freelancers
                break;
            case 'ORME':
                folder.icon = 'orme'; // OrME
                break;
            case 'TRAVELLENG':
                folder.icon = 'tram'; // TravellENG
                break;
            default:
                folder.icon = 'application';
                console.log(`icona per categoria menu ${folder.category} non censita`);
        }
        return folder;
    }
    SelectCompany(company) {
        this.selectedCompany.next(company);
        localStorage.setItem('lastSelCompany', JSON.stringify({ company, user: this.menuUserInfo.workerId }));
    }
    initSelectedCompany() {
        const value = localStorage.getItem('lastSelCompany');
        if (value) {
            const lsc = JSON.parse(localStorage.getItem('lastSelCompany'));
            if (lsc.user === this.menuUserInfo.workerId && this.menuUserInfo.companies.hasOwnProperty(lsc.company)) {
                this.SelectCompany(lsc.company);
            }
        }
    }
    saveFavorites() {
        this.http.post(`${this.siiToolkitService.environment.domain}/sii-menu/menu/favorite`, this.favoriteVoice.value.map(fv => fv.id))
            .subscribe((res) => {
            console.log('favorite saved');
        });
    }
    loadFavoriteVoices() {
        this.http.get(`${this.siiToolkitService.environment.domain}/sii-menu/menu/favorite`)
            .subscribe((res) => {
            if (res.length > 0) {
                const f = [];
                this.menu.value.forEach(m => {
                    m.voices.forEach(v => {
                        if (res.indexOf(v.id) !== -1) {
                            f.push(v);
                        }
                    });
                });
                this.favoriteVoice.next(f);
            }
        });
    }
    addToFavorites(voice) {
        const fv = [...this.favoriteVoice.value];
        fv.push(voice);
        this.favoriteVoice.next(fv);
        this.saveFavorites();
    }
    removeFromFavorites(voice, index) {
        const fv = [...this.favoriteVoice.value];
        fv.splice(index, 1);
        this.favoriteVoice.next(fv);
        this.saveFavorites();
    }
    isInFavorites(voice) {
        return this.favoriteVoice.value.some(e => e.title === voice.title);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: GlobalMenuService, deps: [{ token: i1.HttpClient }, { token: SiiToolkitService }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: GlobalMenuService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: GlobalMenuService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: () => [{ type: i1.HttpClient }, { type: SiiToolkitService }] });

class SiiCompanySelectionComponent {
    get companies() {
        return this.menuRepository.availableCompany.value;
    }
    get selectedCompany() {
        return this.menuRepository.menuUserInfo?.companies[this.menuRepository.selectedCompany.value];
    }
    constructor(menuRepository) {
        this.menuRepository = menuRepository;
    }
    ngOnInit() { }
    onCompanySelect(company, event) {
        this.menuRepository.SelectCompany(company);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: SiiCompanySelectionComponent, deps: [{ token: GlobalMenuService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "18.2.13", type: SiiCompanySelectionComponent, isStandalone: true, selector: "sii-company-selection", ngImport: i0, template: "<div class=\"companySel-trigger\" [matMenuTriggerFor]=\"menu\">\r\n  <mat-icon svgIcon=\"sii-company\"  style=\"    padding-right: 10px;\"></mat-icon>\r\n  @if (selectedCompany) {\r\n    <div [matTooltip]=\"selectedCompany?.code3 +' - '+selectedCompany?.longDescription\" matTooltipShowDelay=\"1000\">{{selectedCompany.briefDescription}}</div>\r\n  } @else {\r\n    <ng-container i18n=\"@@SiiCompanySel\u00F2ection-no_company_selected\">No company Selected</ng-container>\r\n  }\r\n</div>\r\n<mat-menu #menu=\"matMenu\">\r\n  <button (click)=\"onCompanySelect(null, $event)\"  [ngStyle]=\"{'font-weight' : !selectedCompany? 'bold': 'normal'}\"\r\n  mat-menu-item>---</button>\r\n  @for (company of companies; track company) {\r\n    <button (click)=\"onCompanySelect(company.id, $event)\" [ngStyle]=\"{'font-weight' : selectedCompany==company? 'bold': 'normal'}\"\r\n    mat-menu-item  [matTooltip]=\"company?.code3 +' - '+company?.longDescription\" matTooltipShowDelay=\"1000\">{{company?.briefDescription}}</button>\r\n  }\r\n</mat-menu>\r\n", styles: ["::ng-deep .mat-mdc-menu-content{max-height:500px}.companySel-trigger{display:flex;background-color:#fff;border:1px solid #d3d3d3;border-radius:3px;height:40px;align-items:center;padding:0 10px}\n"], dependencies: [{ kind: "directive", type: MatMenuTrigger, selector: "[mat-menu-trigger-for], [matMenuTriggerFor]", inputs: ["mat-menu-trigger-for", "matMenuTriggerFor", "matMenuTriggerData", "matMenuTriggerRestoreFocus"], outputs: ["menuOpened", "onMenuOpen", "menuClosed", "onMenuClose"], exportAs: ["matMenuTrigger"] }, { kind: "component", type: MatIcon, selector: "mat-icon", inputs: ["color", "inline", "svgIcon", "fontSet", "fontIcon"], exportAs: ["matIcon"] }, { kind: "directive", type: MatTooltip, selector: "[matTooltip]", inputs: ["matTooltipPosition", "matTooltipPositionAtOrigin", "matTooltipDisabled", "matTooltipShowDelay", "matTooltipHideDelay", "matTooltipTouchGestures", "matTooltip", "matTooltipClass"], exportAs: ["matTooltip"] }, { kind: "component", type: MatMenu, selector: "mat-menu", inputs: ["backdropClass", "aria-label", "aria-labelledby", "aria-describedby", "xPosition", "yPosition", "overlapTrigger", "hasBackdrop", "class", "classList"], outputs: ["closed", "close"], exportAs: ["matMenu"] }, { kind: "component", type: MatMenuItem, selector: "[mat-menu-item]", inputs: ["role", "disabled", "disableRipple"], exportAs: ["matMenuItem"] }, { kind: "directive", type: NgStyle, selector: "[ngStyle]", inputs: ["ngStyle"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: SiiCompanySelectionComponent, decorators: [{
            type: Component,
            args: [{ selector: 'sii-company-selection', standalone: true, imports: [MatMenuTrigger, MatIcon, MatTooltip, MatMenu, MatMenuItem, NgStyle], template: "<div class=\"companySel-trigger\" [matMenuTriggerFor]=\"menu\">\r\n  <mat-icon svgIcon=\"sii-company\"  style=\"    padding-right: 10px;\"></mat-icon>\r\n  @if (selectedCompany) {\r\n    <div [matTooltip]=\"selectedCompany?.code3 +' - '+selectedCompany?.longDescription\" matTooltipShowDelay=\"1000\">{{selectedCompany.briefDescription}}</div>\r\n  } @else {\r\n    <ng-container i18n=\"@@SiiCompanySel\u00F2ection-no_company_selected\">No company Selected</ng-container>\r\n  }\r\n</div>\r\n<mat-menu #menu=\"matMenu\">\r\n  <button (click)=\"onCompanySelect(null, $event)\"  [ngStyle]=\"{'font-weight' : !selectedCompany? 'bold': 'normal'}\"\r\n  mat-menu-item>---</button>\r\n  @for (company of companies; track company) {\r\n    <button (click)=\"onCompanySelect(company.id, $event)\" [ngStyle]=\"{'font-weight' : selectedCompany==company? 'bold': 'normal'}\"\r\n    mat-menu-item  [matTooltip]=\"company?.code3 +' - '+company?.longDescription\" matTooltipShowDelay=\"1000\">{{company?.briefDescription}}</button>\r\n  }\r\n</mat-menu>\r\n", styles: ["::ng-deep .mat-mdc-menu-content{max-height:500px}.companySel-trigger{display:flex;background-color:#fff;border:1px solid #d3d3d3;border-radius:3px;height:40px;align-items:center;padding:0 10px}\n"] }]
        }], ctorParameters: () => [{ type: GlobalMenuService }] });

class PageContentToolbarComponent {
    constructor(el, breakpointObserver) {
        // debugger
        // breakpointObserver.observe(['max-width: 500px']).subscribe(result => {
        //   this.isMobile=result.matches
        // });
        this.el = el;
        this.breakpointObserver = breakpointObserver;
        this.hideCount = false;
        this.itemsCountLabel = 'Items';
        this.autoHide = false;
        this.siiRef = new Date().getTime();
        this.isMobile = false;
        this.breakpointObserver
            .observe([Breakpoints.XSmall])
            .subscribe((state) => { this.isMobile = state.matches; });
    }
    ngOnInit() {
    }
    doToggle() {
        this.toggleFilterPanelRef();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: PageContentToolbarComponent, deps: [{ token: i0.ElementRef }, { token: i1$5.BreakpointObserver }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "18.2.13", type: PageContentToolbarComponent, isStandalone: true, selector: "sii-page-content-toolbar", inputs: { filtersCount: "filtersCount", hideCount: "hideCount", itemsCount: "itemsCount", itemsCountLabel: "itemsCountLabel", autoHide: "autoHide", filterIcon: "filterIcon" }, host: { attributes: { "hostID": new Date().getTime().toString() }, properties: { "attr.siiRef": "this.siiRef" } }, ngImport: i0, template: "<div class=\"pct_container\">\r\n  @if (toggleFilterPanelRef && filterPanelRef?.isOpen==false) {\r\n    <button class=\"pct_container_filterButton\" mat-icon-button aria-label=\"toggle filter panel\" (click)=\"doToggle()\">\r\n      <mat-icon [matBadgeColor]=\"'accent'\" [matBadge]=\"filtersCount\" [matBadgeHidden]=\"filtersCount==0\" matBadgeSize=\"small\"\r\n      [svgIcon]=\"!!filterIcon?filterIcon:'sii-show-filters'\"   ></mat-icon>\r\n    </button>\r\n  }\r\n  <ng-content select=\"sii-breadcrumb\"></ng-content>\r\n  <ng-content select=\"[siiPageContentToolbarBegin]\"></ng-content>\r\n  <ng-content select=\"sii-list-select-all\"></ng-content>\r\n  @if (itemsCount  && !hideCount) {\r\n    <div class=\"pct_itemsCount\"  >{{itemsCount}}&nbsp;<span class=\"pct_itemCountLabel\">{{isMobile?itemsCountLabel.substring(0,3)+\".\":itemsCountLabel}}</span></div>\r\n  }\r\n  <ng-content select=\"sii-list-sorter\"></ng-content>\r\n\r\n  <span style=\"flex:1\"></span>\r\n  <ng-content></ng-content>\r\n</div>\r\n\r\n<!-- [class.pct_itemsCount_with_filter]=\"toggleFilterPanelRef && filterPanelRef?.isOpen==false\" -->\r\n", styles: [".pct_container{min-height:64px;display:flex;align-items:center;flex-wrap:wrap}.pct_container::ng-deep sii-breadcrumb{padding:0 15px}.pct_itemsCount{display:flex;font-size:16px;letter-spacing:.5px;padding:0 15px}::ng-deep sii-list-sorter{margin-left:20px}::ng-deep sii-list-select-all ::ng-deep .mdc-checkbox__background{border-color:#ffffffc7!important}@media only screen and (max-width: 599px){::ng-deep sii-list-sorter{width:160px}.pct_itemCountLabel{padding-right:0}}\n"], dependencies: [{ kind: "component", type: MatIconButton, selector: "button[mat-icon-button]", exportAs: ["matButton"] }, { kind: "component", type: MatIcon, selector: "mat-icon", inputs: ["color", "inline", "svgIcon", "fontSet", "fontIcon"], exportAs: ["matIcon"] }, { kind: "directive", type: MatBadge, selector: "[matBadge]", inputs: ["matBadgeColor", "matBadgeOverlap", "matBadgeDisabled", "matBadgePosition", "matBadge", "matBadgeDescription", "matBadgeSize", "matBadgeHidden"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: PageContentToolbarComponent, decorators: [{
            type: Component,
            args: [{ selector: 'sii-page-content-toolbar', standalone: true, imports: [MatIconButton, MatIcon, MatBadge], host: { 'hostID': new Date().getTime().toString() }, template: "<div class=\"pct_container\">\r\n  @if (toggleFilterPanelRef && filterPanelRef?.isOpen==false) {\r\n    <button class=\"pct_container_filterButton\" mat-icon-button aria-label=\"toggle filter panel\" (click)=\"doToggle()\">\r\n      <mat-icon [matBadgeColor]=\"'accent'\" [matBadge]=\"filtersCount\" [matBadgeHidden]=\"filtersCount==0\" matBadgeSize=\"small\"\r\n      [svgIcon]=\"!!filterIcon?filterIcon:'sii-show-filters'\"   ></mat-icon>\r\n    </button>\r\n  }\r\n  <ng-content select=\"sii-breadcrumb\"></ng-content>\r\n  <ng-content select=\"[siiPageContentToolbarBegin]\"></ng-content>\r\n  <ng-content select=\"sii-list-select-all\"></ng-content>\r\n  @if (itemsCount  && !hideCount) {\r\n    <div class=\"pct_itemsCount\"  >{{itemsCount}}&nbsp;<span class=\"pct_itemCountLabel\">{{isMobile?itemsCountLabel.substring(0,3)+\".\":itemsCountLabel}}</span></div>\r\n  }\r\n  <ng-content select=\"sii-list-sorter\"></ng-content>\r\n\r\n  <span style=\"flex:1\"></span>\r\n  <ng-content></ng-content>\r\n</div>\r\n\r\n<!-- [class.pct_itemsCount_with_filter]=\"toggleFilterPanelRef && filterPanelRef?.isOpen==false\" -->\r\n", styles: [".pct_container{min-height:64px;display:flex;align-items:center;flex-wrap:wrap}.pct_container::ng-deep sii-breadcrumb{padding:0 15px}.pct_itemsCount{display:flex;font-size:16px;letter-spacing:.5px;padding:0 15px}::ng-deep sii-list-sorter{margin-left:20px}::ng-deep sii-list-select-all ::ng-deep .mdc-checkbox__background{border-color:#ffffffc7!important}@media only screen and (max-width: 599px){::ng-deep sii-list-sorter{width:160px}.pct_itemCountLabel{padding-right:0}}\n"] }]
        }], ctorParameters: () => [{ type: i0.ElementRef }, { type: i1$5.BreakpointObserver }], propDecorators: { filtersCount: [{
                type: Input
            }], hideCount: [{
                type: Input
            }], itemsCount: [{
                type: Input
            }], itemsCountLabel: [{
                type: Input
            }], autoHide: [{
                type: Input
            }], filterIcon: [{
                type: Input
            }], siiRef: [{
                type: HostBinding,
                args: ['attr.siiRef']
            }] } });

class PageContentComponent {
    set width(val) {
        this.hostWidth = (val !== undefined && new RegExp(/^\d+$/g).test(val)) ? val + 'px' :
            (val !== undefined && new RegExp(/^\d+(px|vw|%)$/g).test(val)) ? val : this.defaultMinWidth;
    }
    get toolbarHeight() { return this.pctbHeightSubj.value + 'px'; }
    constructor(el, ref, zone) {
        this.el = el;
        this.ref = ref;
        this.zone = zone;
        this.defaultMinWidth = '500px';
        this.hostWidth = this.defaultMinWidth;
        this.fix = false;
        this.pctbFixedHeightSubj = new BehaviorSubject(0);
        this.pctbFixedHeight = this.pctbFixedHeightSubj.asObservable();
        this.pctbHeightSubj = new BehaviorSubject(0);
        this.pctbHeight = this.pctbHeightSubj.asObservable();
        this.pcbWidthSubj = new Subject();
        this.pcbWidth = this.pcbWidthSubj.asObservable();
        this.utils = {
            lastpctChildrensHeight: {},
            lastpctbItems: 0
        };
        this.pctbObserver = new ResizeObserver(entries => {
            this.zone.run(() => {
                if (this.utils.lastpctbItems !== entries[0].target.childElementCount) {
                    this.utils.lastpctChildrensHeight = {};
                }
                const currpctChildrensHeight = Array.from(entries[0].target.children)
                    .reduce((acc, curr) => {
                    if (!curr.classList.contains('hiddenToolbar')) {
                        acc[curr.getAttribute('siiRef')] = Math.floor(curr.getBoundingClientRect().height);
                    }
                    return acc;
                }, JSON.parse(JSON.stringify(this.utils.lastpctChildrensHeight)));
                if ((entries[0].contentRect.height !== 0 || entries[0].contentRect.height !== this.pctbFixedHeightSubj.value) &&
                    (this.utils.lastpctbItems !== entries[0].target.childElementCount || JSON.stringify(currpctChildrensHeight) !== JSON.stringify(this.utils.lastpctChildrensHeight))) {
                    this.pctbFixedHeightSubj.next(entries[0].contentRect.height);
                }
                this.pctbHeightSubj.next(entries[0].contentRect.height);
                this.utils.lastpctChildrensHeight = currpctChildrensHeight;
                this.utils.lastpctbItems = entries[0].target.childElementCount;
            });
        });
        this.pcbObserver = new ResizeObserver(entries => {
            this.zone.run(() => {
                this.pcbWidthSubj.next(entries[0].contentRect.width);
            });
        });
        window.addEventListener('pageContainerToolbarsHeightChange', () => {
            // this is a fix for pagetoolbar background image
            this.pctb.nativeElement.style.width = (this.pctb.nativeElement.offsetWidth + 1) + 'px';
            this.pctb.nativeElement.style.width = (this.pctb.nativeElement.offsetWidth - 1) + 'px';
        });
    }
    ngAfterViewInit() {
        this.pctbObserver.observe(this.pctb.nativeElement);
        this.pcbObserver.observe(this.pcb.nativeElement);
    }
    ngOnInit() {
    }
    ngOnDestroy() {
        this.pctbObserver.unobserve(this.pctb.nativeElement);
        this.pcbObserver.unobserve(this.pcb.nativeElement);
    }
    getRealWidth() {
        return parseInt(getComputedStyle(this.el.nativeElement, null).width.replace('px', ''), 10);
    }
    getMinWidthInPx() {
        if (new RegExp(/^\d+$/g).test(this.hostWidth)) {
            return parseInt(this.hostWidth, 10);
        }
        else if (new RegExp(/^\d+(px)$/g).test(this.hostWidth)) {
            return parseInt(this.hostWidth.match(/^\d+/g)[0], 10);
        }
        else if (new RegExp(/^\d+(%)$/g).test(this.hostWidth)) {
            const parentw = parseInt(getComputedStyle(this.el.nativeElement.parentElement, null).width.replace('px', ''), 10);
            return (parentw / 100) * parseInt(this.hostWidth.match(/^\d+/g)[0], 10);
        }
    }
    // getOffsetHeight(s){return s.offsetHeight+"  -  "+(new Date()).getTime(); }
    toolbarsHeightChange() {
        // this.toolbarsHeight = this.pctb.nativeElement.offsetHeight;
        this.zone.run(() => {
            this.ref.detectChanges();
        });
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: PageContentComponent, deps: [{ token: i0.ElementRef }, { token: i0.ChangeDetectorRef }, { token: i0.NgZone }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "18.2.13", type: PageContentComponent, isStandalone: true, selector: "sii-page-content", inputs: { width: "width", bodyStyle: "bodyStyle", bodyClass: "bodyClass" }, host: { properties: { "style.width": "this.hostWidth", "style.display": "this.display", "class.fix": "this.fix", "style.--pageContainerToolbarHeight": "this.toolbarHeight" } }, viewQueries: [{ propertyName: "pctb", first: true, predicate: ["pctb"], descendants: true }, { propertyName: "pcb", first: true, predicate: ["pcb"], descendants: true }], ngImport: i0, template: "<div class=\"pc-toolbars\" #pctb (cdkObserveContent)=\"toolbarsHeightChange()\" [style.width.px]=\"pcbWidth | async\">\r\n  <ng-content select=\"sii-page-content-toolbar\"  ></ng-content>\r\n</div>\r\n<div class=\"pc-body\" #pcb [style]=\"bodyStyle\" class=\"{{bodyClass}}\"  [style.marginTop.px]=\"pctbFixedHeight | async\">\r\n  <ng-content></ng-content>\r\n</div>\r\n<!-- [style.marginTop.px]=\"getOffsetHeight(pctb)\"  -->\r\n", styles: [":host{flex:1 1 auto;max-width:100vw}.pc-body{display:flex;flex-direction:column;position:relative}.pc-toolbars{position:fixed;background-size:cover;background-repeat:no-repeat;background-image:linear-gradient(-186.39deg,#090909 -7.89%,#161721 26.77%,#000 59.41%,#323551 94.42%);background-attachment:fixed;z-index:1;top:calc(var(--toolbarHeight) + var(--pageContentToolbarsContainerHeight) + var(--headerHeight))}:host::ng-deep sii-page-content-toolbar.hiddenToolbar{display:none}:host::ng-deep sii-page-content-toolbar:not(.hiddenToolbar)+sii-page-content-toolbar:not(:first-child) .pct_container_filterButton{display:none}\n"], dependencies: [{ kind: "directive", type: CdkObserveContent, selector: "[cdkObserveContent]", inputs: ["cdkObserveContentDisabled", "debounce"], outputs: ["cdkObserveContent"], exportAs: ["cdkObserveContent"] }, { kind: "pipe", type: AsyncPipe, name: "async" }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: PageContentComponent, decorators: [{
            type: Component,
            args: [{ selector: 'sii-page-content', standalone: true, imports: [CdkObserveContent, AsyncPipe], template: "<div class=\"pc-toolbars\" #pctb (cdkObserveContent)=\"toolbarsHeightChange()\" [style.width.px]=\"pcbWidth | async\">\r\n  <ng-content select=\"sii-page-content-toolbar\"  ></ng-content>\r\n</div>\r\n<div class=\"pc-body\" #pcb [style]=\"bodyStyle\" class=\"{{bodyClass}}\"  [style.marginTop.px]=\"pctbFixedHeight | async\">\r\n  <ng-content></ng-content>\r\n</div>\r\n<!-- [style.marginTop.px]=\"getOffsetHeight(pctb)\"  -->\r\n", styles: [":host{flex:1 1 auto;max-width:100vw}.pc-body{display:flex;flex-direction:column;position:relative}.pc-toolbars{position:fixed;background-size:cover;background-repeat:no-repeat;background-image:linear-gradient(-186.39deg,#090909 -7.89%,#161721 26.77%,#000 59.41%,#323551 94.42%);background-attachment:fixed;z-index:1;top:calc(var(--toolbarHeight) + var(--pageContentToolbarsContainerHeight) + var(--headerHeight))}:host::ng-deep sii-page-content-toolbar.hiddenToolbar{display:none}:host::ng-deep sii-page-content-toolbar:not(.hiddenToolbar)+sii-page-content-toolbar:not(:first-child) .pct_container_filterButton{display:none}\n"] }]
        }], ctorParameters: () => [{ type: i0.ElementRef }, { type: i0.ChangeDetectorRef }, { type: i0.NgZone }], propDecorators: { hostWidth: [{
                type: HostBinding,
                args: ['style.width']
            }], display: [{
                type: HostBinding,
                args: ['style.display']
            }], fix: [{
                type: HostBinding,
                args: ['class.fix']
            }], width: [{
                type: Input
            }], bodyStyle: [{
                type: Input
            }], bodyClass: [{
                type: Input
            }], pctb: [{
                type: ViewChild,
                args: ['pctb', { static: false }]
            }], pcb: [{
                type: ViewChild,
                args: ['pcb', { static: false }]
            }], toolbarHeight: [{
                type: HostBinding,
                args: ['style.--pageContainerToolbarHeight']
            }] } });

var ToolbarSubmenuItemOpenIn;
(function (ToolbarSubmenuItemOpenIn) {
    ToolbarSubmenuItemOpenIn["self"] = "self";
    ToolbarSubmenuItemOpenIn["tab"] = "tab";
    ToolbarSubmenuItemOpenIn["popup"] = "popup";
})(ToolbarSubmenuItemOpenIn || (ToolbarSubmenuItemOpenIn = {}));

class SiiDownloadService {
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: SiiDownloadService, deps: [{ token: i1.HttpClient }, { token: SiiToolkitService }, { token: SiiWaitService }, { token: SII_APP_REF, optional: true }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: SiiDownloadService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: SiiDownloadService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: () => [{ type: i1.HttpClient }, { type: SiiToolkitService }, { type: SiiWaitService }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [SII_APP_REF]
                }] }] });

class BadgeComponent {
    set appearance(val) {
        if (val !== undefined && this.primaryColors.indexOf(val) !== -1) {
            this.hostClass = 'sii-badge-appearance-' + val;
        }
        else {
            this.hostClass = '';
        }
    }
    ;
    set background(val) {
        if (this.hostClass === '') {
            this.styleBgColor = val;
        }
    }
    ;
    set color(val) {
        if (this.hostClass === '') {
            this.styleColor = val;
        }
    }
    ;
    constructor() {
        this.primaryColors = ['warning', 'error', 'success', 'info'];
        this.hostClass = '';
        this.styleBgColor = '';
        this.styleColor = '';
    }
    ngOnInit() {
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: BadgeComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "18.2.13", type: BadgeComponent, isStandalone: true, selector: "sii-badge", inputs: { appearance: "appearance", background: "background", color: "color" }, host: { properties: { "class": "this.hostClass", "style.backgroundColor": "this.styleBgColor", "style.color": "this.styleColor" } }, ngImport: i0, template: "<ng-content></ng-content>\r\n", styles: [":host{background-color:gray;border-radius:12px;color:#fff;font-size:11px;line-height:14px;padding:5px 12px;letter-spacing:.33px;font-weight:lighter}\n"] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: BadgeComponent, decorators: [{
            type: Component,
            args: [{ selector: 'sii-badge', standalone: true, template: "<ng-content></ng-content>\r\n", styles: [":host{background-color:gray;border-radius:12px;color:#fff;font-size:11px;line-height:14px;padding:5px 12px;letter-spacing:.33px;font-weight:lighter}\n"] }]
        }], ctorParameters: () => [], propDecorators: { hostClass: [{
                type: HostBinding,
                args: ['class']
            }], appearance: [{
                type: Input
            }], styleBgColor: [{
                type: HostBinding,
                args: ['style.backgroundColor']
            }], background: [{
                type: Input
            }], styleColor: [{
                type: HostBinding,
                args: ['style.color']
            }], color: [{
                type: Input
            }] } });

class ToolbarComponent {
    toggleMenuSidebar(forceStatus) {
        if (forceStatus == undefined) {
            this.menuSidebarVisible = !this.menuSidebarVisible;
        }
        else {
            this.menuSidebarVisible = forceStatus;
        }
        !!this.menuSidebarVisible ? document.body.classList.add('unscrollableBody') : document.body.classList.remove('unscrollableBody');
    }
    // mySelf: MyselfDTO;
    get mySelf() {
        return this.siiToolkitService.loggedUser.value;
    }
    get haveNotification() {
        return this.sdacNotificationCount + this.sdacTicketCount > 0;
    }
    get sdacNotification() {
        return this.sdacPreviewService.notificationPreview;
    }
    get sdacTichet() {
        return this.sdacPreviewService.ticketPreview;
    }
    get sdacTicketCount() {
        return this.sdacPreviewService.ticketCount;
    }
    get sdacNotificationCount() {
        return this.sdacPreviewService.notificationCount;
    }
    get corporateItCalendarEvents() {
        return this.engageServ.corporateCalendarEvents;
    }
    get corporateItCalendarEventsCount() {
        return this.engageServ.corporateCalendarEventsCount;
    }
    get isServerless() { return this.siiToolkitService.isServerless; }
    get isEngage() { return this.engageServ.isEngage; }
    get isEngageAvailable() { return this.engageServ.engageAvailable; }
    get engMenuOk() {
        return this.isEngageAvailable && !!this.menuVoices.value?.menu;
    }
    get appMenuOk() {
        return this.applicationMenu?.length !== 0;
    }
    get appMenuActive() {
        return this.activeMobMenu === 'app';
    }
    // @HostBinding('style.box-shadow') boxShadow = 'initial';
    get boxShadow() {
        return this.siiToolkitService.loggedUser.value.toolbarMode === undefined ? 'initial' :
            this.siiToolkitService.loggedUser.value.toolbarMode + ' 0px 2px 20px 16px inset';
    }
    constructor(siiToolkitService, el, engageServ, sdacPreviewService, router, breakpointObserver, siiBreadcrumbServ, delegationService, siiDownloadService) {
        this.siiToolkitService = siiToolkitService;
        this.el = el;
        this.engageServ = engageServ;
        this.sdacPreviewService = sdacPreviewService;
        this.router = router;
        this.breakpointObserver = breakpointObserver;
        this.siiBreadcrumbServ = siiBreadcrumbServ;
        this.delegationService = delegationService;
        this.siiDownloadService = siiDownloadService;
        this.autoHide = true;
        this.applicationMenu = [];
        this.showEngageSearch = false;
        this.showEngageMenu = true;
        // @Input() showGlobalSearch = false;
        // @Input() enableGlobalMenu = false;
        this.showCloseButton = false;
        this.closeAction = new EventEmitter();
        this.menuVoices = new BehaviorSubject({});
        this.menuMobileOpen = false;
        this.subMenuOpenStatus = {};
        this.mobileToolbar = false;
        this.activeMobMenu = 'app';
        this.menuSidebarVisible = false;
        this.subscriptions = new Subscription();
        this.breakpointObserver
            .observe(['(max-width: 1050px)'])
            .subscribe((state) => { this.mobileToolbar = state.matches; });
    }
    ngOnChanges(changes) {
        if (!!changes.menu) {
            this.applicationMenu = changes.menu.currentValue.map((m) => ({
                label: m.title,
                location: 'interna',
                url: m.link
            }));
        }
    }
    ngAfterViewInit() {
        if (this.isEngage || this.showEngageMenu) {
            this.engageServ.getToolbarMenuVoices().subscribe((res) => {
                this.menuVoices.next(res);
                this.engageServ.currentMenu.pipe(startWith(this.engageServ.currentMenu.value))
                    .subscribe((currMenRes) => {
                    if (currMenRes.length > 0) {
                        this.checkProfiledVoices(currMenRes);
                    }
                });
            });
        }
        if (this.helpId !== undefined) {
            this.subscriptions.add(this.siiToolkitService.getHelpPage(this.helpId).subscribe((helPage) => {
                this.helPage = helPage;
            }));
        }
    }
    ngOnInit() {
    }
    ngOnDestroy() {
        // not needed since it's a cold observable but good practice
        this.subscriptions.unsubscribe();
        document.body.classList.remove('unscrollableBody');
    }
    goToHelpPage() {
        if (this.helPage && this.helPage.url) {
            window.open(this.helPage.url);
        }
    }
    closeAct() {
        this.closeAction.next();
    }
    openUrlInWindow(url, openIn) {
        if (openIn == ToolbarSubmenuItemOpenIn.self) {
            window.open(url, '_self');
        }
        else if (openIn == ToolbarSubmenuItemOpenIn.tab) {
            window.open(url, '_blank');
        }
        else {
            window.open(url, '_blank', `target=_blank,width=4000,height=4000`);
        }
    }
    navigateUrl(voice, engageVoice = false) {
        this.siiBreadcrumbServ.reset();
        if ((engageVoice && this.engageServ.isEngage && voice.location === 'interna') || (!engageVoice && voice.location !== 'esterna')) {
            const splu = voice.url.split('?');
            let qp = {};
            if (!!splu[1]) {
                qp = splu[1].split('&').map(i => i.split('=')).reduce((acc, item) => { acc[item[0]] = item[1]; return acc; }, {});
            }
            this.router.navigate([splu[0]], { queryParams: qp });
        }
        else {
            // debugger
            //aggiungo la company di default
            const duc = window.localStorage.getItem('defaultUserCompany-' + this.mySelf.workerId);
            if (!!duc) {
                let urlToCall = voice.url;
                if (urlToCall.indexOf('?') < 0) {
                    urlToCall += '?';
                }
                urlToCall += '&WebCacheLocalId=' + new Date().getTime().toString();
                urlToCall += '&soccodice=' + duc;
                this.openUrlInWindow(urlToCall, voice.openIn);
            }
            else {
                this.openUrlInWindow(voice.url, voice.openIn);
            }
        }
    }
    performSearch(txtSearch) {
        if (this.engageServ.engageAvailable) {
            if (this.engageServ.isEngage) {
                this.router.navigate(['search'], { queryParams: (!!txtSearch ? { search: txtSearch } : {}) });
            }
            else {
                this.openUrlInWindow(this.engageServ.engageDomain + (!!txtSearch ? `search?search=${txtSearch}` : 'search'));
            }
        }
        else {
            alert('enagage unavailable');
        }
    }
    checkProfiledVoices(voices) {
        const tmpMenu = this.menuVoices.getValue();
        // mostro le voci della navbar se l utente  ne ha visibilità
        voices.forEach(category => {
            category.voices.forEach(voice => {
                tmpMenu.menu.forEach(mv => {
                    mv.submenu?.columns.forEach(sc => {
                        sc.items?.forEach(v => {
                            if (v.profiling === voice.id) {
                                v.visibleProfiling = true;
                            }
                        });
                    });
                });
            });
        });
        this.menuVoices.next(tmpMenu);
    }
    goToHome() {
        this.router.navigate(['/']);
    }
    mobileMenuClick() {
        this.subMenuOpenStatus = {};
        this.menuMobileOpen = !this.menuMobileOpen;
    }
    toggleSubmenu(event, smIndex) {
        event.stopImmediatePropagation();
        this.subMenuOpenStatus[smIndex] = !this.subMenuOpenStatus[smIndex];
    }
    doLogout() {
        window.location.href = `${this.siiToolkitService.environment.domain}/sii_common/logout`;
    }
    doDelegation() {
        this.delegationService.openDelegation();
    }
    doDelegationLogout() {
        this.delegationService.logout();
    }
    openSdacTiketsByCode(code) {
        this.sdacPreviewService.openSdacTiketsByCode(code);
    }
    openSdacNotification() {
        this.sdacPreviewService.openSdacType(true);
    }
    openSdacTicket() {
        this.sdacPreviewService.openSdacType(false);
    }
    goToDeadlines() {
        if (this.engageServ.isEngage) {
            this.router.navigateByUrl('deadlines');
        }
        else {
            this.openUrlInWindow(this.engageServ.engageDomain + '/deadlines');
        }
    }
    goToProfile() {
        if (this.engageServ.isEngage) {
            this.router.navigateByUrl('profile');
        }
        else {
            this.openUrlInWindow(this.engageServ.engageDomain + '/profile');
        }
    }
    // sidenavVisibleChange(visible: boolean){
    //   // document.body.style.overflow = visible ? 'hidden' : '';
    //   visible ? document.body.classList.add('unscrollableBody') : document.body.classList.remove('unscrollableBody');
    // }
    toggleProfileInfo(event) {
        const status = !this.subMenuOpenStatus.profile;
        if (this.mobileToolbar) {
            event.stopImmediatePropagation();
            this.menuMobileOpen = status;
            this.toggleMenuSidebar(status);
            this.subMenuOpenStatus.profile = status;
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: ToolbarComponent, deps: [{ token: SiiToolkitService }, { token: i0.ElementRef }, { token: SiiEngageService }, { token: SdacPreviewService }, { token: i4.Router }, { token: i1$5.BreakpointObserver }, { token: SiiBreadcrumbService }, { token: DelegationService }, { token: SiiDownloadService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "18.2.13", type: ToolbarComponent, isStandalone: true, selector: "sii-toolbar", inputs: { autoHide: "autoHide", toolbarTitle: "toolbarTitle", menu: "menu", applicationMenu: "applicationMenu", helpId: "helpId", showEngageSearch: "showEngageSearch", showEngageMenu: "showEngageMenu", showCloseButton: "showCloseButton" }, outputs: { closeAction: "closeAction" }, host: { properties: { "style.box-shadow": "this.boxShadow" } }, providers: [SiiDownloadService, SiiDatePipe], usesOnChanges: true, ngImport: i0, template: "\r\n\r\n@if (showCloseButton) {\r\n  <button mat-icon-button aria-label=\"Close\" (click)=\"closeAct()\">\r\n    <mat-icon>close</mat-icon>\r\n  </button>\r\n}\r\n\r\n<!-- <sii-menu *ngIf=\"(menu && menu.length>0) || enableGlobalMenu\" [voices]=\"menu\" [enableGlobalMenu]=\"enableGlobalMenu\"></sii-menu> -->\r\n<!-- <img class=\"sii-toolbar__logo\" src=\"assets/icons/logo.png\" > -->\r\n<div class=\"sii-toolbar_logo_box\" (click)=\"goToHome()\" >\r\n  <mat-icon class=\"sii-toolbar_logo_engage\" svgIcon=\"logo_engage\"></mat-icon>\r\n  <div class=\"sii-toolbar__title\"> {{toolbarTitle}} </div>\r\n</div>\r\n<div class=\"sii-toolbar__container\" >\r\n  <!-- <div class=\"sii-toolbar__title\"> {{toolbarTitle}} </div> -->\r\n  <div class=\"sii-toolbar__content\">\r\n\r\n    <!--\r\n\r\n    isEngage  |  appMenuOk | engMenuOk |  eng  | app | minEng\r\n    1          1           1         -       1     1\r\n    1          1           0         -       1     -\r\n    1          0           1         1       -     -\r\n    1          0           0         -       -     -\r\n    0          1           1         -       1     1\r\n    0          1           0         -       1     -\r\n    0          0           1         -       -     1\r\n    0          0           0         -       -     -\r\n\r\n    eng     => isEngage && engMenuOk && !appMenuOk\r\n    app     => appMenuOk\r\n    minEng  => (isEngage && appMenuOk && engMenuOk) || (!isEngage && engMenuOk)\r\n\r\n    -->\r\n\r\n\r\n\r\n    @if ( isEngage && engMenuOk && !appMenuOk) {\r\n      <ng-container  *ngTemplateOutlet=\"toolbarMenuTemplate;context:{$implicit: (menuVoices | async)?.menu, isEngageMenu:true}\" >    </ng-container>\r\n    }\r\n\r\n    @if (appMenuOk) {\r\n      <ng-container  *ngTemplateOutlet=\"toolbarMenuTemplate;context:{$implicit: applicationMenu , isEngageMenu:false}\" >    </ng-container>\r\n    }\r\n\r\n\r\n    <span [style.marginLeft]=\"'auto'\"></span>\r\n\r\n    <ng-content></ng-content>\r\n\r\n\r\n\r\n\r\n    <!-- <sii-global-search *ngIf=\"showGlobalSearch\"></sii-global-search> -->\r\n    <ul class=\"sii_toolbar_navbar_nav searchNavItem\" style=\"padding-right: 0;\">\r\n      <!-- search -->\r\n      @if (isEngage || showEngageSearch) {\r\n        <li class=\"sii_toolbar_nav_item\" >\r\n          <a class=\"sii_toolbar_nav_link searchLink\" aria-label=\"Search\"><span class=\"toolbarSearchLabel\" >Search</span> <mat-icon class=\"search-icon\" >search</mat-icon></a>\r\n          <div class=\"toolbarMenuSubVoices searchPanel\">\r\n            <div>\r\n              <form class=\"search-form\"  (submit)=\"performSearch(dsv.value); $event.preventDefault()\">\r\n                <input #dsv id=\"search-form-input\" type=\"text\" name=\"search\" i18n-placeholder=\"@@toolbarSearchMessage\" placeholder=\"What are you looking for?\" class=\"search-form__search-input\">\r\n                <button mat-icon-button   type=\"submit\" aria-label=\"search\" >\r\n                  <mat-icon>search</mat-icon>\r\n                </button>\r\n              </form>\r\n            </div>\r\n            <div class=\"search-actions\">\r\n              <a tabindex=\"0\" (click)=\"performSearch()\"   title=\"\" class=\"top-sii_toolbar_nav_link\">\r\n                <mat-icon class=\"advsearchIcon\">tune</mat-icon> <b i18n=\"@@toolbar_advancedSearch\">Advanced Search</b><mat-icon>chevron_right</mat-icon>\r\n              </a>\r\n            </div>\r\n          </div>\r\n        </li>\r\n      }\r\n      <!-- <li class=\"sii_toolbar_nav_item gotosiiwebButton\" *ngIf=\"isEngage\" >\r\n      <a class=\"sii_toolbar_nav_link \" href=\"https://siiweb.eng.it\" target=\"_blank\" title=\"\">Go To Siiweb  1<mat-icon>launch</mat-icon></a>\r\n    </li> -->\r\n    @if ((isEngage && appMenuOk && engMenuOk) || (!isEngage && engMenuOk)) {\r\n      <li class=\"sii_toolbar_nav_item engageMenuItem\">\r\n        <a class=\"sii_toolbar_nav_link engageMenuItem_link\" aria-label=\"menu engage\">Menu Engage</a>\r\n        <div class=\"engageMenuItem_box\">\r\n          <ng-container  *ngTemplateOutlet=\"toolbarMenuTemplate;context:{$implicit:(menuVoices | async)?.menu , isEngageMenu:true}\" >    </ng-container>\r\n        </div>\r\n      </li>\r\n    }\r\n\r\n    @if (helPage) {\r\n      <li class=\"sii_toolbar_nav_item sii-toolbar__icon_button \" >\r\n        <a class=\"sii_toolbar_nav_link\" aria-label=\"help\" (click)=\"goToHelpPage()\">\r\n          <mat-icon svgIcon=\"sii-help-online\"></mat-icon>\r\n        </a>\r\n      </li>\r\n    }\r\n\r\n\r\n\r\n    @if (!isServerless && siiDownloadService.utils.count>0) {\r\n      <li class=\"sii_toolbar_nav_item sii-toolbar__icon_button alwaysVisible\" >\r\n        <a class=\"sii_toolbar_nav_link\" aria-label=\"Attachments\">\r\n          <mat-icon aria-hidden=\"false\" [ngClass]=\"{'changeIncoming':siiDownloadService.utils.someChanges,'changeRequired':siiDownloadService.utils.countChange}\" [matBadge]=\"siiDownloadService.utils.count\" matBadgeColor=\"primary\" matBadgePosition=\"before\" matBadgeSize=\"small\" svgIcon=\"menu-download\"></mat-icon>\r\n        </a>\r\n        <div class=\"toolbarSmallContainer\">\r\n          <p class=\"text-uppercase categoryTitle\" style=\"display: flex;\">\r\n            <b style=\"margin-right:10px ;\" i18n=\"@@appDownload\">Downloaded files</b>\r\n            @if (siiDownloadService.utils.fetchInProgress>0) {\r\n              <mat-spinner [color]=\"'accent'\" [diameter]=\"20\"></mat-spinner>\r\n            }\r\n            @if (siiDownloadService.utils.fetchInProgress==0) {\r\n              <button style=\"margin: -15px 0 -13px -11px;\" mat-icon-button (click)=\"siiDownloadService._fetchData()\"><mat-icon>refresh</mat-icon></button>\r\n            }\r\n          </p>\r\n          <div class=\" attachmentContainer \"  >\r\n            @for (attach of siiDownloadService.utils.list ; track attach) {\r\n              <div  class=\"attachmentRow\">\r\n                <div class=\"attachmentInfoPanel\">\r\n                  <span class=\"attachNameLabel\">{{attach.fileName}}</span>\r\n                  <div class=\"attachSubRow\">{{attach.createdDate | siiDate:true}}</div>\r\n                </div>\r\n                <div class=\"attachment_action\">\r\n                  @if (attach.status==10) {\r\n                    <mat-spinner [diameter]=\"30\"></mat-spinner>\r\n                  }\r\n                  @if (attach.status==30) {\r\n                    <button  mat-icon-button style=\"margin-right: -12px;    margin-top: -10px;\" (click)=\"siiDownloadService._download(attach.id)\" ><mat-icon>download</mat-icon></button>\r\n                  }\r\n                  @if (attach.status==40) {\r\n                    <mat-icon  style=\"color: red;\" [matTooltip]=\"attach.error\">error_outline</mat-icon>\r\n                  }\r\n                  @if (!attach._readyForDelete) {\r\n                    <button  mat-icon-button class=\"attachDeleteButton\" (click)=\"siiDownloadService._markReadyForDelete(attach)\" ><mat-icon>delete</mat-icon></button>\r\n                  }\r\n                  @if (!!attach._readyForDelete) {\r\n                    <div class=\"delete_action_panel\" >\r\n                      <button  mat-icon-button  (click)=\"siiDownloadService._clearReadyForTimeout(attach)\" ><mat-icon>clear</mat-icon></button>\r\n                      <button  mat-icon-button   (click)=\"siiDownloadService._delete(attach)\" ><mat-icon>check</mat-icon></button>\r\n                    </div>\r\n                  }\r\n                </div>\r\n              </div>\r\n            }\r\n          </div>\r\n        </div>\r\n      </li>\r\n    }\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n    @if (!isServerless && !!haveNotification) {\r\n      <li class=\"sii_toolbar_nav_item sii-toolbar__icon_button\" >\r\n        <a class=\"sii_toolbar_nav_link\" aria-label=\"Notification\">\r\n          <mat-icon aria-hidden=\"false\" [matBadge]=\"sdacTicketCount+sdacNotificationCount\" matBadgeColor=\"primary\" matBadgePosition=\"before\" matBadgeSize=\"small\" svgIcon=\"menu-notifications\"></mat-icon>\r\n        </a>\r\n        <div class=\"toolbarSmallContainer\">\r\n          @if (sdacNotificationCount!=0) {\r\n            <p class=\"text-uppercase categoryTitle\"><b i18n=\"@@toolbar_Notification\">Notification</b></p>\r\n            <div class=\" notificheContainer \"  >\r\n              @for (ticket of sdacNotification | async ; track ticket) {\r\n                <div  (click)=\"openSdacTiketsByCode(ticket.ssCode)\">\r\n                  <span class=\"notificheContainerLabel\">{{ticket.ssDescr}}</span>\r\n                  <div class=\"notifSub\" >{{ticket.count}} <span i18n=\"@@ticket_items\">{ticket.count,plural,=1 {Item} other {Items}}</span></div>\r\n                </div>\r\n              }\r\n            </div>\r\n            <div (click)=\"openSdacNotification()\"  class=\"allNotif\"><b i18n=\"@@toolbar_seeAllNotification\">See all notification</b> <mat-icon>navigate_next</mat-icon></div>\r\n          }\r\n          @if (sdacTicketCount!=0) {\r\n            <p class=\"text-uppercase categoryTitle\"><b i18n=\"@@toolbar_taskManagement\">Task Management</b></p>\r\n            <div class=\" notificheContainer \"  >\r\n              @for (ticket of sdacTichet | async ; track ticket) {\r\n                <div  (click)=\"openSdacTiketsByCode(ticket.ssCode)\">\r\n                  <span class=\"notificheContainerLabel\">{{ticket.ssDescr}}</span>\r\n                  <div class=\"notifSub\"  >{{ticket.count}} <span i18n=\"@@task_ite\">{ticket.count,plural,=1 {Task} other {Tasks}}</span></div>\r\n                </div>\r\n              }\r\n            </div>\r\n            <div (click)=\"openSdacTicket()\"  class=\"allNotif\"><b i18n=\"@@toolbar_seeAllTask\">See all tasks</b> <mat-icon>navigate_next</mat-icon></div>\r\n          }\r\n        </div>\r\n      </li>\r\n    }\r\n    @if (!isServerless) {\r\n      <li class=\"sii_toolbar_nav_item sii-toolbar__icon_button\" >\r\n        <a class=\"sii_toolbar_nav_link\" aria-label=\"event\">\r\n          <mat-icon aria-hidden=\"false\" [matBadge]=\"corporateItCalendarEventsCount\" matBadgeColor=\"warn\" matBadgePosition=\"before\" matBadgeSize=\"small\" [matBadgeHidden]=\"corporateItCalendarEventsCount==0\" svgIcon=\"menu-calendar\" ></mat-icon>\r\n        </a>\r\n        <div class=\"toolbarSmallContainer\">\r\n          <!-- <ng-container *ngIf=\"corporateItCalendarEventsCount>0\"> -->\r\n          <p class=\"text-uppercase categoryTitle\"><b  i18n=\"@@toolbar_deadlines\">Deadlines</b></p>\r\n          <div  class=\"notificheContainer\">\r\n            @for (item of corporateItCalendarEvents | async; track item; let index = $index) {\r\n              @if (!item.hideData && item.status=='SCADENZA_OGGI') {\r\n                <p style=\"width:100%\"><sii-badge style=\"padding: 2px 10px; font-weight: 700;\" [background]=\"'#ff9db4'\" [color]=\"'black'\" i18n=\"@@deadline_today\">today</sii-badge></p>\r\n              }\r\n              @if (!item.hideData && item.status=='IN_SCADENZA') {\r\n                <p style=\"width:100%\">  <sii-badge style=\"padding: 2px 10px; font-weight: 700;\" [background]=\"'#eabf30'\" [color]=\"'black'\" i18n=\"@@deadline_tomorrow\">tomorrow</sii-badge></p>\r\n              }\r\n              <div >\r\n                <div class=\"notificheContainerLabel\" style=\"margin-bottom:20px;\">@if (!item.isAllDay) {\r\n                  <span>{{item.time}} - </span>\r\n                }{{item.subject}}</div>\r\n              </div>\r\n            }\r\n          </div>\r\n          <div  (click)=\"goToDeadlines()\"  class=\"allNotif\"><b i18n=\"@@toolbar_allDeadlines\">See all deadlines</b> <mat-icon>navigate_next</mat-icon></div>\r\n        </div>\r\n      </li>\r\n    }\r\n\r\n    @if (!isServerless) {\r\n      <li class=\"sii_toolbar_nav_item sii_toolbar_profile_link\" >\r\n        <sii-profile-button style=\"padding-left: 7px;\"   [mySelf]='mySelf' (click)=\"toggleProfileInfo($event)\" [hideDetail]=\"mobileToolbar\"></sii-profile-button>\r\n      </li>\r\n    }\r\n  </ul>\r\n\r\n\r\n\r\n\r\n  <div role=\"button\" aria-label=\"menu\" (click)=\"mobileMenuClick();toggleMenuSidebar();\" id=\"menuToggle\" class=\"hidden-lg-up\">\r\n    <div class=\"sii_toolbar_manu_bar\" [ngClass]=\"{'animate':menuMobileOpen}\"></div>\r\n  </div>\r\n</div>\r\n\r\n</div>\r\n\r\n@if (menuSidebarVisible) {\r\n<div class=\"menu-sidebar\">\r\n<!-- <mat-sidenav-container > -->\r\n  <!-- <mat-sidenav class=\"menuSidenav\" #snav  mode=\"side\" position=\"end\" fixedInViewport=\"true\" fixedTopGap=\"72\"  > -->\r\n\r\n\r\n\r\n\r\n    <ul class=\"sii_toolbar_mobile-navbar\">\r\n\r\n      <!--\r\n\r\n      appMenuActive  |  appMenuOk | engMenuOk |  toolbar | eng  | app\r\n      1          1           1          V       -       V\r\n      1          1           0          -       -       V\r\n      1          0           1          -       V       -\r\n      1          0           0          -       -       -\r\n      0          1           1          V       V       -\r\n      0          1           0          -       -       V\r\n      0          0           1          -       V       -\r\n      0          0           0          -       -       -\r\n\r\n      toolbar => appMenuOk && engMenuOk\r\n      eng     => (appMenuOk && engMenuOk && !appMenuActive) || (engMenuOk && !appMenuOk)\r\n      app     => (appMenuOk && engMenuOk && appMenuActive) ||  (!engMenuOk && appMenuOk)\r\n\r\n      -->\r\n\r\n\r\n\r\n\r\n      @if (appMenuOk && engMenuOk) {\r\n        <nav mat-tab-nav-bar mat-stretch-tabs class=\"sidenavMenuNav\"\r\n          >\r\n          <!-- *ngIf=\"!isEngage && isEngageAvailable && applicationMenu.length>0  && (menuVoices | async)?.menu   \"> -->\r\n          <a mat-tab-link (click)=\"activeMobMenu = 'app'\"       [active]=\"appMenuActive\" >Menu App</a>\r\n          <a mat-tab-link (click)=\"activeMobMenu = 'engage'\"    [active]=\"!appMenuActive\" >Menu Engage</a>\r\n        </nav>\r\n      }\r\n\r\n      @if ((appMenuOk && engMenuOk && !appMenuActive) || (engMenuOk && !appMenuOk) ) {\r\n        <!-- <ng-container *ngIf=\"isEngage || (applicationMenu.length==0 && isEngageAvailable && (menuVoices | async)?.menu) || activeMobMenu == 'engage' \"> -->\r\n        <ng-container  *ngTemplateOutlet=\"toolbarMobileMenuTemplate;context:{$implicit: (menuVoices | async)?.menu, isEngageMenu:true}\" >    </ng-container>\r\n      }\r\n\r\n      @if ((appMenuOk && engMenuOk && appMenuActive) ||  (!engMenuOk && appMenuOk) ) {\r\n        <ng-container  *ngTemplateOutlet=\"toolbarMobileMenuTemplate;context:{$implicit: applicationMenu , isEngageMenu:false}\" >    </ng-container>\r\n      }\r\n\r\n\r\n      <li class=\"custom-divider\"></li>\r\n\r\n\r\n      @if (isEngage) {\r\n        <li class=\"sii_toolbar_nav_item \"><a class=\"sii_toolbar_nav_link \" href=\"https://siiweb.eng.it\" target=\"_blank\" title=\"\"><span i18n=\"@@navbar_goToSiiweb\">Go To Siiweb</span> <mat-icon>chevron_right</mat-icon></a></li>\r\n      }\r\n      @if (helPage) {\r\n        <li class=\"sii_toolbar_nav_item \"  ><a class=\"sii_toolbar_nav_link \" (click)=\"goToHelpPage()\" tabindex=\"0\" title=\"\"><span i18n=\"@@navbar_goToHelpPage\">Go To Help Page</span> <mat-icon>chevron_right</mat-icon></a></li>\r\n      }\r\n\r\n      <li class=\"sii_toolbar_nav_item  profile\" >\r\n        <!-- <sii-profile-button (click)=\"toggleSubmenu($event,'profile')\" [mySelf]='mySelf' [hideDetail]=\"true\"></sii-profile-button> -->\r\n        <!-- <mat-icon style=\"margin-left: 10px;\" (click)=\"toggleSubmenu($event,'profile')\" >chevron_right</mat-icon> -->\r\n        <div class=\"sii_toolbar_submenu\" [ngClass]=\"!!subMenuOpenStatus['profile']?'is-open':'is-closed' \">\r\n          <mat-icon  class=\"sii_toolbar_submenu-icon-back\" (click)=\"toggleProfileInfo($event)\">chevron_left</mat-icon>\r\n          <ul class=\"sii_toolbar_subnav notification\">\r\n\r\n            <li><p><b >{{mySelf?.firstName}} {{mySelf?.lastName}}</b></p></li>\r\n            <li class=\"sii_toolbar_subnav-item\">\r\n              <div class=\"profile\">\r\n                <!-- Dettagli utente -->\r\n                <dl class=\"eng-user-details\">\r\n                  <dt  i18n=\"@@toolbar_workerId\">Worker ID</dt>\r\n                  <dd >{{mySelf?.workerId}}</dd>\r\n                  <dt ><abbr i18n-title=\"@@toolbar_cc\" title=\"Competence Center\" i18n=\"@@toolbar_cc_dim\">CC</abbr></dt>\r\n                  <dd>{{mySelf?.costCenterId}}</dd>\r\n                  <dt ><abbr  i18n=\"@@toolbar_manager\">Manager</abbr></dt>\r\n                  <dd >{{mySelf.costCenterResp?.firstName}} {{mySelf.costCenterResp?.lastName}}</dd>\r\n                  @if (!!mySelf.tutorWorkerId) {\r\n                    <dt ><abbr i18n=\"@@toolbar_tutor\">Tutor</abbr></dt>\r\n                    <dd>{{mySelf.tutorFistName}} {{mySelf.tutorLastName}}</dd>\r\n                  }\r\n\r\n                  @if (!!mySelf.evaluatorWorkerId) {\r\n                    <dt ><abbr i18n=\"@@toolbar_evaluator\">Evaluator</abbr></dt>\r\n                    <dd>{{mySelf.evaluatorFistName}} {{mySelf.evaluatorLastName}}</dd>\r\n                  }\r\n                </dl>\r\n              </div>\r\n            </li>\r\n            <ul class=\"list-unstyled user-actions\">\r\n              <li><a (click)=\"goToProfile()\"   tabindex=\"0\"  title=\"\" class=\"\"><b i18n=\"@@navbar_goToProfile\">Go To Profile</b> <mat-icon>navigate_next</mat-icon></a></li>\r\n              <li><a href=\"https://password.eng.it/\" target=\"_blank\" title=\"\" class=\"\"><b i18n=\"@@navbar_changePassford\">Change Password</b> <mat-icon>navigate_next</mat-icon></a></li>\r\n              <li><a href=\"https://mysignins.microsoft.com/security-info\" target=\"_blank\" title=\"\" class=\"\"><b i18n=\"@@navbar_mfaSettings\">MFA Settings</b> <mat-icon>navigate_next</mat-icon></a></li>\r\n              <li><a  (click)=\"doLogout()\" tabindex=\"0\" title=\"\" class=\"\"><b i18n=\"@@navbar_logout\">Logout</b> <mat-icon>navigate_next</mat-icon></a></li>\r\n              @if (!!mySelf.delegatedUsers) {\r\n                <li><a  (click)=\"doDelegation()\"     title=\"\" class=\"\"><b i18n=\"@@DelegateLogin\">Login as delegated</b> <mat-icon>navigate_next</mat-icon></a></li>\r\n              }\r\n              @if (!!mySelf.isInDelegation) {\r\n                <li><a (click)=\"doDelegationLogout()\" title=\"\" class=\"\"><b ii18n=\"@@DelegateLogout\">Logout from delegation</b> <mat-icon>navigate_next</mat-icon></a></li>\r\n              }\r\n\r\n            </ul>\r\n\r\n            <li class=\"custom-divider mr-4 \"></li>\r\n\r\n            @if (corporateItCalendarEventsCount!=0) {\r\n              <li><p><b i18n=\"@@toolbar_deadlines\">Deadlines</b></p></li>\r\n              @for (item of corporateItCalendarEvents | async; track item; let index = $index) {\r\n                @if (!item.hideData && item.status=='SCADENZA_OGGI') {\r\n                  <p style=\"width:100% ; margin-top: 1em;\"><sii-badge style=\"padding: 2px 10px; font-weight: 700;\" [background]=\"'#ff9db4'\" [color]=\"'black'\" i18n=\"@@deadline_today\" >today</sii-badge></p>\r\n                }\r\n                @if (!item.hideData && item.status=='IN_SCADENZA') {\r\n                  <p style=\"width:100% ; margin-top: 1em;\">  <sii-badge style=\"padding: 2px 10px; font-weight: 700;\" [background]=\"'#eabf30'\" [color]=\"'black'\" i18n=\"@@deadline_tomorrow\" >tomorrow</sii-badge></p>\r\n                }\r\n                <li  class=\"sii_toolbar_subnav-item\" >\r\n                  <div class=\"notifPreview\">\r\n                    <div  style=\"margin-bottom:20px;\" class=\"notifLabel\">@if (!item.isAllDay) {\r\n                      <span >{{item.time}} - </span>\r\n                    }{{item.subject}}</div>\r\n                    <!-- <div style=\"margin-bottom:12px;\">{{item.date}}</div> -->\r\n                  </div>\r\n                </li>\r\n              }\r\n              <div  (click)=\"goToDeadlines()\"  class=\"allNotif\"><b i18n=\"@@toolbar_allDeadlines\">See all deadlines</b> <mat-icon>navigate_next</mat-icon></div>\r\n              <li class=\"custom-divider mr-4 \"></li>\r\n            }\r\n            @if (sdacNotificationCount!=0) {\r\n              <li class=\"sdacFieldRef\"><p><b i18n=\"@@toolbar_Notification\">Notification</b></p></li>\r\n              @for (ticket of sdacNotification | async ; track ticket) {\r\n                <li class=\"sii_toolbar_subnav-item\">\r\n                  <div class=\"notifPreview\"  (click)=\"openSdacTiketsByCode(ticket.ssCode)\">\r\n                    <span class=\"notifLabel\">{{ticket.ssDescr}}</span>\r\n                    <div style=\"margin-bottom:12px;\">{{ticket.count}} <span i18n=\"@@ticket_items\">{ticket.count,plural,=1 {Item} other {Items}}</span></div>\r\n                  </div>\r\n                </li>\r\n              }\r\n              <div (click)=\"openSdacNotification()\"  class=\"allNotif\"><b i18n=\"@@toolbar_seeAllNotification\">See all notification</b> <mat-icon>navigate_next</mat-icon></div>\r\n              <li class=\"custom-divider mr-4\"></li>\r\n            }\r\n\r\n            @if (sdacTicketCount!=0) {\r\n              <li class=\"sdacFieldRef\"><p><b i18n=\"@@toolbar_taskManagement\">Task Management</b></p></li>\r\n              @for (ticket of sdacTichet | async ; track ticket) {\r\n                <li class=\"sii_toolbar_subnav-item\">\r\n                  <div class=\"notifPreview\"  (click)=\"openSdacTiketsByCode(ticket.ssCode)\">\r\n                    <span class=\"notifLabel\">{{ticket.ssDescr}}</span>\r\n                    <div style=\"margin-bottom:12px;\">{{ticket.count}} <span i18n=\"@@task_ite\">{ticket.count,plural,=1 {Task} other {Tasks}}</span></div>\r\n                  </div>\r\n                </li>\r\n              }\r\n              <div (click)=\"openSdacTicket()\"  class=\"allNotif\"><b i18n=\"@@toolbar_seeAllTask\">See all tasks</b> <mat-icon>navigate_next</mat-icon></div>\r\n              <li class=\"custom-divider mr-4\"></li>\r\n            }\r\n\r\n\r\n\r\n          </ul>\r\n        </div>\r\n\r\n      </li>\r\n    </ul>\r\n  <!-- </mat-sidenav> -->\r\n<!-- </mat-sidenav-container> -->\r\n</div>\r\n}\r\n\r\n\r\n\r\n<ng-template #toolbarMobileMenuTemplate let-currMenu let-isEngageMenu=\"isEngageMenu\">\r\n\r\n  @for (menu of currMenu; track menu; let menuIndex = $index) {\r\n    <li class=\"sii_toolbar_nav_item\"   >\r\n      @if (!menu.submenu || !menu.submenu.columns) {\r\n        <a class=\"sii_toolbar_nav_link\" [ngClass]=\"{'mobileCurrentPage':router.url==menu.url}\"  tabindex=\"0\" (click)=\"navigateUrl(menu,isEngageMenu)\" [title]=\"menu.label\">{{menu.label}}</a>\r\n      }\r\n      @if (menu.submenu && menu.submenu.columns) {\r\n        <a (click)=\"toggleSubmenu($event,menuIndex)\"  class=\"sii_toolbar_nav_link\" [ngClass]=\"{'mobileCurrentPage':router.url==menu.url}\"  [title]=\"menu.label\">{{menu.label}}\r\n          <mat-icon>chevron_right</mat-icon>\r\n        </a>\r\n        <div class=\"sii_toolbar_submenu \" [ngClass]=\"!!subMenuOpenStatus[menuIndex]?'is-open':'is-closed' \" >\r\n          <mat-icon  class=\"sii_toolbar_submenu-icon-back\" (click)=\"toggleSubmenu($event,menuIndex)\">chevron_left</mat-icon>\r\n          <ul class=\"sii_toolbar_subnav\">\r\n            @for (colMenu of menu.submenu.columns; track colMenu) {\r\n              @for (mv of colMenu.items; track mv) {\r\n                @if (!mv.profiling || !!mv.visibleProfiling) {\r\n                  <li   class=\"sii_toolbar_subnav-item\" >\r\n                    <a  class=\"sii_toolbar_subnav__link\" [ngClass]=\"{'mobileCurrentPage':router.url==mv.url}\" tabindex=\"0\" (click)=\"navigateUrl(mv,isEngageMenu);$event.stopImmediatePropagation()\" [title]=\"mv.label\">{{mv.label}}</a>\r\n                  </li>\r\n                }\r\n              }\r\n              @if (colMenu.items?.length>0) {\r\n                <li class=\"custom-divider\"></li>\r\n              }\r\n            }\r\n          </ul>\r\n        </div>\r\n      }\r\n    </li>\r\n  }\r\n</ng-template>\r\n\r\n<ng-template #toolbarMenuTemplate let-currMenu let-isEngageMenu=\"isEngageMenu\">\r\n  <ul class=\"sii_toolbar_navbar_nav menuNavItem\">\r\n    @for (menu of currMenu; track menu) {\r\n      @if (!menu.submenu || !menu.submenu.columns) {\r\n        <li  class=\"sii_toolbar_nav_item menuVoice\" [ngClass]=\"{'currentPage':router.url==menu.url}\">\r\n          <a class=\"sii_toolbar_nav_link\" tabindex=\"0\" (click)=\"navigateUrl(menu, isEngageMenu)\"   [title]=\"menu.label\">{{menu.label}}</a>\r\n        </li>\r\n      }\r\n      @if (menu.submenu && menu.submenu.columns) {\r\n        <li  class=\"sii_toolbar_nav_item menuVoice\"  data-toggle=\"dropdown\"  [ngClass]=\"{'currentPage':router.url==menu.url}\">\r\n          <a  class=\"sii_toolbar_nav_link \"  [title]=\"menu.label\">{{menu.label}} </a>\r\n          <div class=\"toolbarMenuSubVoices\">\r\n            @for (colMenu of menu.submenu.columns; track colMenu) {\r\n              <ul class=\"toolbarMenuSubVoicesCol\" role=\"menu\">\r\n                @for (mv of colMenu.items; track mv) {\r\n                  @if (!mv.profiling || !!mv.visibleProfiling) {\r\n                    <li   >\r\n                      <a tabindex=\"0\" class=\"sii_toolbar_dropdown__link\"  [ngClass]=\"{'mobileCurrentPage':router.url==mv.url}\" [title]=\"mv.label\" (click)=\"navigateUrl(mv, isEngageMenu)\" >{{mv.label}}</a>\r\n                    </li>\r\n                  }\r\n                }\r\n              </ul>\r\n            }\r\n          </div>\r\n        </li>\r\n      }\r\n    }\r\n  </ul>\r\n</ng-template>\r\n", styles: [":host{box-shadow:0 2px 8px #0003;color:#fff;height:72px;padding:0 10px;display:flex;align-items:center;align-content:center;position:relative}a{color:unset}.sii-toolbar_logo_box{position:relative;display:flex;cursor:pointer}.sii-toolbar_logo_engage{height:42px;width:137px;box-sizing:border-box;margin:0 10px}.sii-toolbar__container{display:flex;flex:1;overflow:hidden;flex-wrap:wrap;height:100%}.sii-toolbar__title{text-transform:uppercase;margin-top:auto;margin-bottom:-2px;letter-spacing:.92px;position:absolute;top:-6.3px;left:56.2px;line-height:8px;height:24px;display:flex;align-items:flex-end;font-family:CocoEng;font-size:9px}.text-uppercase{text-transform:uppercase}.categoryTitle{opacity:.8;font-size:12px}.notificheContainer{display:flex;flex-wrap:wrap}.notificheContainer>div{flex:1 1 270px;padding-right:20px;cursor:pointer}.notificheContainer>div .notificheContainerLabel{font-size:1rem;font-weight:900}.notificheContainer>div .notifSub{margin-bottom:12px;opacity:.8;font-size:12px}.allNotif{cursor:pointer;width:200px;display:flex;align-items:center}.sii-toolbar__content{display:flex;flex:1}.sii-toolbar__icon_button{margin:24px 0 0}ul.sii_toolbar_navbar_nav{list-style:none;display:flex;flex-direction:row;flex:1;padding:0 10px 0 5px;margin:0;max-width:1192px}ul.sii_toolbar_navbar_nav.searchNavItem{padding:0 10px;flex:0}ul.sii_toolbar_navbar_nav li.sii_toolbar_nav_item{letter-spacing:.03rem;display:flex;justify-content:center}ul.sii_toolbar_navbar_nav li.sii_toolbar_nav_item.currentPage>.sii_toolbar_nav_link:after,ul.sii_toolbar_navbar_nav li.sii_toolbar_nav_item:hover>.sii_toolbar_nav_link:after{width:calc(100% - 16px)}ul.sii_toolbar_navbar_nav li.sii_toolbar_nav_item.sii_toolbar_profile_link:hover:after{width:40px}ul.sii_toolbar_navbar_nav li.sii_toolbar_nav_item.sii-toolbar__icon_button .sii_toolbar_nav_link{padding-left:7px;padding-right:7px}ul.sii_toolbar_navbar_nav li.sii_toolbar_nav_item.sii-toolbar__icon_button .sii_toolbar_nav_link mat-icon{margin-bottom:-5px}ul.sii_toolbar_navbar_nav li.sii_toolbar_nav_item .sii_toolbar_nav_link{color:#fff;font-size:12px;font-weight:700;line-height:12px;text-transform:uppercase;position:relative;display:flex;padding:0 15px 23px;outline:none;text-decoration:none;transition:all .3s ease-in-out;cursor:pointer;height:100%;align-items:flex-end;box-sizing:border-box}ul.sii_toolbar_navbar_nav li.sii_toolbar_nav_item .sii_toolbar_nav_link:after,ul.sii_toolbar_navbar_nav li.sii_toolbar_nav_item.sii_toolbar_profile_link:after{content:\"\";display:block;width:0;height:4px;background:#c51b88;transition:width .3s;position:absolute;bottom:0;left:8px}ul.sii_toolbar_navbar_nav li.sii_toolbar_nav_item.sii_toolbar_profile_link:after{left:unset}ul.sii_toolbar_navbar_nav li.sii_toolbar_nav_item .sii_toolbar_nav_link:hover,ul.sii_toolbar_navbar_nav li.sii_toolbar_nav_item .sii_toolbar_nav_link:focus,ul.sii_toolbar_navbar_nav li.sii_toolbar_nav_item .sii_toolbar_dropdown__link:hover,ul.sii_toolbar_navbar_nav li.sii_toolbar_nav_item .sii_toolbar_dropdown__link:focus{color:#ffffffe6}ul.sii_toolbar_navbar_nav li.sii_toolbar_nav_item:hover>.toolbarMenuSubVoices,ul.sii_toolbar_navbar_nav li.sii_toolbar_nav_item:hover>.toolbarSmallContainer{display:flex}ul.sii_toolbar_navbar_nav li.sii_toolbar_nav_item .searchPanel{flex-direction:column}ul.sii_toolbar_navbar_nav li.sii_toolbar_nav_item .searchPanel .search-actions{display:flex;justify-content:flex-end;font-size:13px;color:#fff;outline:none;text-decoration:none;transition:all .3s ease-in-out}ul.sii_toolbar_navbar_nav li.sii_toolbar_nav_item .searchPanel .search-actions a{display:flex;align-items:center;cursor:pointer}ul.sii_toolbar_navbar_nav li.sii_toolbar_nav_item .searchPanel .search-actions .mat-icon.advsearchIcon{margin-right:5px;transform:scale(.8)}ul.sii_toolbar_navbar_nav li.sii_toolbar_nav_item .searchPanel .search-form{position:relative;width:100%;margin-top:1rem;margin-bottom:1.8rem;display:flex}ul.sii_toolbar_navbar_nav li.sii_toolbar_nav_item .searchPanel .search-form .mat-mdc-icon-button{position:absolute;top:8px;right:0}ul.sii_toolbar_navbar_nav li.sii_toolbar_nav_item .searchPanel .search-form .mat-mdc-icon-button mat-icon{font-size:32px}ul.sii_toolbar_navbar_nav li.sii_toolbar_nav_item .searchPanel .search-form .search-form__search-input{background-color:transparent;border:none;border-bottom:1px solid rgba(11,22,2,.4);box-sizing:border-box;height:50px;width:100%;position:relative;color:#ffffffbf;border-color:#ffffff40;text-transform:uppercase;font-size:1.25rem;overflow:visible}ul.sii_toolbar_navbar_nav li.sii_toolbar_nav_item .searchPanel .search-form .search-form__search-input:focus{outline:none}ul.sii_toolbar_navbar_nav li.sii_toolbar_nav_item .searchPanel .search-form .search-form__search-input::placeholder{color:#ffffffbf;text-transform:uppercase;font-size:1.25rem}ul.sii_toolbar_navbar_nav li.sii_toolbar_nav_item .searchPanel .search-form .search-form__search-icon{font-size:24px;color:#fff;position:absolute;top:16px;right:10px;border:0;background:none;cursor:pointer}ul.sii_toolbar_navbar_nav li.sii_toolbar_nav_item .toolbarSmallContainer{display:none;flex-direction:column;width:350px;position:absolute;overflow:auto;max-height:calc(100vh - var(--toolbarHeight));right:0;background-color:#09090917;-webkit-backdrop-filter:blur(12px) brightness(.75);backdrop-filter:blur(12px) brightness(.75);padding:30px;top:100%;z-index:1000;box-sizing:border-box}ul.sii_toolbar_navbar_nav li.sii_toolbar_nav_item .toolbarMenuSubVoices{display:none;width:100%;position:absolute;right:0;background-color:#09090917;-webkit-backdrop-filter:blur(12px) brightness(.75);backdrop-filter:blur(12px) brightness(.75);padding:1.5rem 3rem;top:100%;z-index:1000;box-sizing:border-box}ul.sii_toolbar_navbar_nav li.sii_toolbar_nav_item .toolbarMenuSubVoices .toolbarMenuSubVoicesCol{flex:1;padding-left:0;list-style:none}ul.sii_toolbar_navbar_nav li.sii_toolbar_nav_item .toolbarMenuSubVoices .toolbarMenuSubVoicesCol li{border-left:.07rem solid rgba(255,255,255,.3);padding-left:1rem;cursor:pointer}ul.sii_toolbar_navbar_nav li.sii_toolbar_nav_item .toolbarMenuSubVoices .toolbarMenuSubVoicesCol li a{text-transform:uppercase;padding:.25rem 0;opacity:1;font-size:.75rem;letter-spacing:.02rem}#menuToggle{z-index:1001;display:none;align-items:center;color:#fff;cursor:pointer;height:unset}#menuToggle .sii_toolbar_manu_bar,#menuToggle .sii_toolbar_manu_bar:after,#menuToggle .sii_toolbar_manu_bar:before{width:30px;height:2px}#menuToggle .sii_toolbar_manu_bar{position:relative;background:#fff;transition:all 0 .3s}#menuToggle .sii_toolbar_manu_bar:before{content:\"\";position:absolute;left:0;bottom:9px;background:#fff;transition:bottom .3s .3s cubic-bezier(.23,1,.32,1),transform .3s cubic-bezier(.23,1,.32,1)}#menuToggle .sii_toolbar_manu_bar:after{content:\"\";position:absolute;left:0;top:9px;background:#fff;transition:top .3s .3s cubic-bezier(.23,1,.32,1),transform .3s cubic-bezier(.23,1,.32,1)}#menuToggle .sii_toolbar_manu_bar.animate{background:#fff0}#menuToggle .sii_toolbar_manu_bar.animate:after{top:0;background:#fff;transform:rotate(45deg);transition:top .3s cubic-bezier(.23,1,.32,1),transform .3s .3s cubic-bezier(.23,1,.32,1)}#menuToggle .sii_toolbar_manu_bar.animate:before{bottom:0;background:#fff;transform:rotate(-45deg);transition:bottom .3s cubic-bezier(.23,1,.32,1),transform .3s .3s cubic-bezier(.23,1,.32,1)}.menu-sidebar{border:0px;background-color:#090909;overflow-y:auto;overflow-x:hidden;display:block;width:100vw;position:fixed;top:var(--fixedToolbarHeight);right:0;height:calc(100vh - var(--fixedToolbarHeight));left:var(--safe-area-inset-left)}.menu-sidebar .custom-divider{height:0;margin:.75rem 0;overflow:hidden;border-top:1px solid #F5F5F5;opacity:.25}.menu-sidebar ul.sii_toolbar_mobile-navbar{position:relative;list-style:none;text-align:left;margin-left:30px;display:block;padding-left:0}.menu-sidebar ul.sii_toolbar_mobile-navbar .sidenavMenuNav{color:#fff;margin-left:-30px}.menu-sidebar ul.sii_toolbar_mobile-navbar .sidenavMenuNav ::ng-deep mat-ink-bar{background-color:#c51b88!important}.menu-sidebar ul.sii_toolbar_mobile-navbar li.profile mat-icon{transform:scale(1.5);opacity:.5;color:#fff}.menu-sidebar ul.sii_toolbar_mobile-navbar li.profile .user-actions{list-style:none;padding:0}.menu-sidebar ul.sii_toolbar_mobile-navbar li.profile .user-actions li a{display:flex;align-items:center;padding:.33rem;padding-left:0;font-size:1.16em;color:#fff;outline:none;text-decoration:none;cursor:pointer}.menu-sidebar ul.sii_toolbar_mobile-navbar li.profile .eng-user-details{margin-top:1rem;display:flex;flex-wrap:wrap}.menu-sidebar ul.sii_toolbar_mobile-navbar li.profile .eng-user-details dt{font-weight:700;text-transform:uppercase;font-size:.65rem;flex:0 0 42%;max-width:42%}.menu-sidebar ul.sii_toolbar_mobile-navbar li.profile .eng-user-details dd{text-transform:none;flex:0 0 58%;max-width:58%;margin-bottom:.5rem;margin-left:0}.menu-sidebar ul.sii_toolbar_mobile-navbar li.sii_toolbar_nav_item{text-transform:uppercase;font-size:.75rem;padding:0;display:block}.menu-sidebar ul.sii_toolbar_mobile-navbar li.sii_toolbar_nav_item .sii_toolbar_nav_link{font-size:16px;font-weight:700;line-height:1.2;text-transform:none;position:relative;display:flex;align-items:center;padding:.75rem 0;color:#fff;text-decoration:none;cursor:pointer}.menu-sidebar ul.sii_toolbar_mobile-navbar li.sii_toolbar_nav_item .sii_toolbar_nav_link mat-icon{transform:scale(1.5);opacity:.5}.menu-sidebar ul.sii_toolbar_mobile-navbar li.sii_toolbar_nav_item .sii_toolbar_submenu{position:absolute;background-color:#090909;color:#fff;top:12px;transition:left .4s ease;z-index:2;margin-left:-60px;width:calc(100% + 60px);margin-top:-16px;height:calc(100vh - 72px)}.menu-sidebar ul.sii_toolbar_mobile-navbar li.sii_toolbar_nav_item .sii_toolbar_submenu.is-closed{display:none}.menu-sidebar ul.sii_toolbar_mobile-navbar li.sii_toolbar_nav_item .sii_toolbar_submenu.is-open{display:flex}.menu-sidebar ul.sii_toolbar_mobile-navbar li.sii_toolbar_nav_item .sii_toolbar_submenu .sii_toolbar_submenu-icon-back{margin:26px 15px 0 10px;transform:scale(1.5);opacity:.5}.menu-sidebar ul.sii_toolbar_mobile-navbar li.sii_toolbar_nav_item .sii_toolbar_submenu ul.sii_toolbar_subnav{position:relative;list-style:none;text-align:left;margin-left:0;display:block;padding-left:0;overflow:auto;padding-top:1rem;padding-bottom:8rem;flex:1;padding-right:20px}.menu-sidebar ul.sii_toolbar_mobile-navbar li.sii_toolbar_nav_item .sii_toolbar_submenu ul.sii_toolbar_subnav a.sii_toolbar_subnav__link{font-size:16px;text-transform:none;font-weight:400;display:block;line-height:1.25;padding:.75rem 0}.toolbarSearchLabel{margin-right:.25rem}li.sii_toolbar_nav_item.gotosiiwebButton{width:153px}li.sii_toolbar_nav_item.gotosiiwebButton mat-icon{font-size:15px;padding-left:5px;height:17px}.engageMenuItem .engageMenuItem_link{width:130px}.engageMenuItem .engageMenuItem_box{display:none;justify-content:flex-end;background-color:#041f2ee8;width:100%;position:absolute;right:0;height:60px;top:var(--toolbarHeight)}.engageMenuItem .engageMenuItem_box .sii_toolbar_navbar_nav{justify-content:flex-end}.engageMenuItem:hover .engageMenuItem_box{display:flex}.searchLink{padding-right:7px!important}.search-icon{margin-bottom:-6px}@media screen and (max-width: 576px){.menu-sidebar{height:100vh}.searchPanel{padding:10px!important}}@media screen and (max-width: 1050px){sii-profile-button{margin-bottom:auto!important}#menuToggle{display:flex}.sii-toolbar__container :not(.alwaysVisible).menuNavItem,.sii-toolbar__container :not(.alwaysVisible).sii-toolbar__help,.sii-toolbar__container :not(.alwaysVisible).gotosiiwebButton,.sii-toolbar__container :not(.alwaysVisible).engageMenuItem,.sii-toolbar__container :not(.alwaysVisible).sii-toolbar__icon_button{display:none!important}.toolbarSearchLabel{display:none!important}.search-icon{width:40px;height:40px;font-size:40px;margin-bottom:-5px}}.allNotif{cursor:pointer;display:flex;align-items:center}.notifPreview{padding-bottom:10px;cursor:pointer}.notifPreview .notifLabel{margin:0}.mobileCurrentPage{text-decoration:underline #c51b88!important;text-decoration-thickness:2px!important}.attachmentContainer{display:flex;flex-wrap:wrap}.attachmentContainer .attachmentRow{cursor:pointer;flex:1 1 270px;display:flex;border-bottom:1px solid white;margin-bottom:10px;padding-bottom:10px}.attachmentContainer .attachmentRow .attachmentInfoPanel{display:flex;flex-direction:column;flex:1}.attachmentContainer .attachmentRow .attachmentInfoPanel .attachNameLabel{overflow-wrap:break-word;max-width:240px}.attachmentContainer .attachmentRow .attachmentInfoPanel .attachSubRow{opacity:.8;font-size:12px}.attachmentContainer .attachmentRow .attachment_action{display:flex;flex-direction:column}.attachmentContainer .attachmentRow .attachment_action mat-spinner{margin-left:10px;margin-right:-5px}.attachmentContainer .attachmentRow .attachment_action .attachDeleteButton{margin-right:-12px;margin-top:-11px;margin-bottom:-15px;opacity:.5}.attachmentContainer .attachmentRow .attachment_action .attachDeleteButton:hover{opacity:1}.attachmentContainer .attachmentRow .attachment_action .delete_action_panel{display:flex;margin:-11px -12px -15px -48px}.changeIncoming{animation:pulse 2s infinite}.changeRequired{animation:attention 2s infinite}@keyframes pulse{0%{transform:scale(1.25);fill:gold}70%{transform:scale(1)}to{transform:scale(1.25);fill:gold}}@keyframes attention{0%{transform:scale(4)}to{transform:scale(1)}}\n"], dependencies: [{ kind: "component", type: MatIconButton, selector: "button[mat-icon-button]", exportAs: ["matButton"] }, { kind: "component", type: MatIcon, selector: "mat-icon", inputs: ["color", "inline", "svgIcon", "fontSet", "fontIcon"], exportAs: ["matIcon"] }, { kind: "directive", type: NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "ngmodule", type: FormsModule }, { kind: "directive", type: i1$6.ɵNgNoValidate, selector: "form:not([ngNoForm]):not([ngNativeValidate])" }, { kind: "directive", type: i1$6.NgControlStatusGroup, selector: "[formGroupName],[formArrayName],[ngModelGroup],[formGroup],form:not([ngNoForm]),[ngForm]" }, { kind: "directive", type: i1$6.NgForm, selector: "form:not([ngNoForm]):not([formGroup]),ng-form,[ngForm]", inputs: ["ngFormOptions"], outputs: ["ngSubmit"], exportAs: ["ngForm"] }, { kind: "directive", type: NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: MatBadge, selector: "[matBadge]", inputs: ["matBadgeColor", "matBadgeOverlap", "matBadgeDisabled", "matBadgePosition", "matBadge", "matBadgeDescription", "matBadgeSize", "matBadgeHidden"] }, { kind: "component", type: MatProgressSpinner, selector: "mat-progress-spinner, mat-spinner", inputs: ["color", "mode", "value", "diameter", "strokeWidth"], exportAs: ["matProgressSpinner"] }, { kind: "directive", type: MatTooltip, selector: "[matTooltip]", inputs: ["matTooltipPosition", "matTooltipPositionAtOrigin", "matTooltipDisabled", "matTooltipShowDelay", "matTooltipHideDelay", "matTooltipTouchGestures", "matTooltip", "matTooltipClass"], exportAs: ["matTooltip"] }, { kind: "component", type: BadgeComponent, selector: "sii-badge", inputs: ["appearance", "background", "color"] }, { kind: "component", type: ProfileButtonComponent, selector: "sii-profile-button", inputs: ["mySelf", "hideDetail"] }, { kind: "component", type: MatTabNav, selector: "[mat-tab-nav-bar]", inputs: ["fitInkBarToContent", "mat-stretch-tabs", "animationDuration", "backgroundColor", "disableRipple", "color", "tabPanel"], exportAs: ["matTabNavBar", "matTabNav"] }, { kind: "component", type: MatTabLink, selector: "[mat-tab-link], [matTabLink]", inputs: ["active", "disabled", "disableRipple", "tabIndex", "id"], exportAs: ["matTabLink"] }, { kind: "pipe", type: AsyncPipe, name: "async" }, { kind: "pipe", type: SiiDatePipe, name: "siiDate" }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: ToolbarComponent, decorators: [{
            type: Component,
            args: [{ selector: 'sii-toolbar', standalone: true, imports: [MatIconButton, MatIcon, NgTemplateOutlet, FormsModule, NgClass, MatBadge, MatProgressSpinner, MatTooltip, BadgeComponent, ProfileButtonComponent, MatSidenavContainer, MatSidenav, MatTabNav, MatTabLink, AsyncPipe, SiiDatePipe], providers: [SiiDownloadService, SiiDatePipe], template: "\r\n\r\n@if (showCloseButton) {\r\n  <button mat-icon-button aria-label=\"Close\" (click)=\"closeAct()\">\r\n    <mat-icon>close</mat-icon>\r\n  </button>\r\n}\r\n\r\n<!-- <sii-menu *ngIf=\"(menu && menu.length>0) || enableGlobalMenu\" [voices]=\"menu\" [enableGlobalMenu]=\"enableGlobalMenu\"></sii-menu> -->\r\n<!-- <img class=\"sii-toolbar__logo\" src=\"assets/icons/logo.png\" > -->\r\n<div class=\"sii-toolbar_logo_box\" (click)=\"goToHome()\" >\r\n  <mat-icon class=\"sii-toolbar_logo_engage\" svgIcon=\"logo_engage\"></mat-icon>\r\n  <div class=\"sii-toolbar__title\"> {{toolbarTitle}} </div>\r\n</div>\r\n<div class=\"sii-toolbar__container\" >\r\n  <!-- <div class=\"sii-toolbar__title\"> {{toolbarTitle}} </div> -->\r\n  <div class=\"sii-toolbar__content\">\r\n\r\n    <!--\r\n\r\n    isEngage  |  appMenuOk | engMenuOk |  eng  | app | minEng\r\n    1          1           1         -       1     1\r\n    1          1           0         -       1     -\r\n    1          0           1         1       -     -\r\n    1          0           0         -       -     -\r\n    0          1           1         -       1     1\r\n    0          1           0         -       1     -\r\n    0          0           1         -       -     1\r\n    0          0           0         -       -     -\r\n\r\n    eng     => isEngage && engMenuOk && !appMenuOk\r\n    app     => appMenuOk\r\n    minEng  => (isEngage && appMenuOk && engMenuOk) || (!isEngage && engMenuOk)\r\n\r\n    -->\r\n\r\n\r\n\r\n    @if ( isEngage && engMenuOk && !appMenuOk) {\r\n      <ng-container  *ngTemplateOutlet=\"toolbarMenuTemplate;context:{$implicit: (menuVoices | async)?.menu, isEngageMenu:true}\" >    </ng-container>\r\n    }\r\n\r\n    @if (appMenuOk) {\r\n      <ng-container  *ngTemplateOutlet=\"toolbarMenuTemplate;context:{$implicit: applicationMenu , isEngageMenu:false}\" >    </ng-container>\r\n    }\r\n\r\n\r\n    <span [style.marginLeft]=\"'auto'\"></span>\r\n\r\n    <ng-content></ng-content>\r\n\r\n\r\n\r\n\r\n    <!-- <sii-global-search *ngIf=\"showGlobalSearch\"></sii-global-search> -->\r\n    <ul class=\"sii_toolbar_navbar_nav searchNavItem\" style=\"padding-right: 0;\">\r\n      <!-- search -->\r\n      @if (isEngage || showEngageSearch) {\r\n        <li class=\"sii_toolbar_nav_item\" >\r\n          <a class=\"sii_toolbar_nav_link searchLink\" aria-label=\"Search\"><span class=\"toolbarSearchLabel\" >Search</span> <mat-icon class=\"search-icon\" >search</mat-icon></a>\r\n          <div class=\"toolbarMenuSubVoices searchPanel\">\r\n            <div>\r\n              <form class=\"search-form\"  (submit)=\"performSearch(dsv.value); $event.preventDefault()\">\r\n                <input #dsv id=\"search-form-input\" type=\"text\" name=\"search\" i18n-placeholder=\"@@toolbarSearchMessage\" placeholder=\"What are you looking for?\" class=\"search-form__search-input\">\r\n                <button mat-icon-button   type=\"submit\" aria-label=\"search\" >\r\n                  <mat-icon>search</mat-icon>\r\n                </button>\r\n              </form>\r\n            </div>\r\n            <div class=\"search-actions\">\r\n              <a tabindex=\"0\" (click)=\"performSearch()\"   title=\"\" class=\"top-sii_toolbar_nav_link\">\r\n                <mat-icon class=\"advsearchIcon\">tune</mat-icon> <b i18n=\"@@toolbar_advancedSearch\">Advanced Search</b><mat-icon>chevron_right</mat-icon>\r\n              </a>\r\n            </div>\r\n          </div>\r\n        </li>\r\n      }\r\n      <!-- <li class=\"sii_toolbar_nav_item gotosiiwebButton\" *ngIf=\"isEngage\" >\r\n      <a class=\"sii_toolbar_nav_link \" href=\"https://siiweb.eng.it\" target=\"_blank\" title=\"\">Go To Siiweb  1<mat-icon>launch</mat-icon></a>\r\n    </li> -->\r\n    @if ((isEngage && appMenuOk && engMenuOk) || (!isEngage && engMenuOk)) {\r\n      <li class=\"sii_toolbar_nav_item engageMenuItem\">\r\n        <a class=\"sii_toolbar_nav_link engageMenuItem_link\" aria-label=\"menu engage\">Menu Engage</a>\r\n        <div class=\"engageMenuItem_box\">\r\n          <ng-container  *ngTemplateOutlet=\"toolbarMenuTemplate;context:{$implicit:(menuVoices | async)?.menu , isEngageMenu:true}\" >    </ng-container>\r\n        </div>\r\n      </li>\r\n    }\r\n\r\n    @if (helPage) {\r\n      <li class=\"sii_toolbar_nav_item sii-toolbar__icon_button \" >\r\n        <a class=\"sii_toolbar_nav_link\" aria-label=\"help\" (click)=\"goToHelpPage()\">\r\n          <mat-icon svgIcon=\"sii-help-online\"></mat-icon>\r\n        </a>\r\n      </li>\r\n    }\r\n\r\n\r\n\r\n    @if (!isServerless && siiDownloadService.utils.count>0) {\r\n      <li class=\"sii_toolbar_nav_item sii-toolbar__icon_button alwaysVisible\" >\r\n        <a class=\"sii_toolbar_nav_link\" aria-label=\"Attachments\">\r\n          <mat-icon aria-hidden=\"false\" [ngClass]=\"{'changeIncoming':siiDownloadService.utils.someChanges,'changeRequired':siiDownloadService.utils.countChange}\" [matBadge]=\"siiDownloadService.utils.count\" matBadgeColor=\"primary\" matBadgePosition=\"before\" matBadgeSize=\"small\" svgIcon=\"menu-download\"></mat-icon>\r\n        </a>\r\n        <div class=\"toolbarSmallContainer\">\r\n          <p class=\"text-uppercase categoryTitle\" style=\"display: flex;\">\r\n            <b style=\"margin-right:10px ;\" i18n=\"@@appDownload\">Downloaded files</b>\r\n            @if (siiDownloadService.utils.fetchInProgress>0) {\r\n              <mat-spinner [color]=\"'accent'\" [diameter]=\"20\"></mat-spinner>\r\n            }\r\n            @if (siiDownloadService.utils.fetchInProgress==0) {\r\n              <button style=\"margin: -15px 0 -13px -11px;\" mat-icon-button (click)=\"siiDownloadService._fetchData()\"><mat-icon>refresh</mat-icon></button>\r\n            }\r\n          </p>\r\n          <div class=\" attachmentContainer \"  >\r\n            @for (attach of siiDownloadService.utils.list ; track attach) {\r\n              <div  class=\"attachmentRow\">\r\n                <div class=\"attachmentInfoPanel\">\r\n                  <span class=\"attachNameLabel\">{{attach.fileName}}</span>\r\n                  <div class=\"attachSubRow\">{{attach.createdDate | siiDate:true}}</div>\r\n                </div>\r\n                <div class=\"attachment_action\">\r\n                  @if (attach.status==10) {\r\n                    <mat-spinner [diameter]=\"30\"></mat-spinner>\r\n                  }\r\n                  @if (attach.status==30) {\r\n                    <button  mat-icon-button style=\"margin-right: -12px;    margin-top: -10px;\" (click)=\"siiDownloadService._download(attach.id)\" ><mat-icon>download</mat-icon></button>\r\n                  }\r\n                  @if (attach.status==40) {\r\n                    <mat-icon  style=\"color: red;\" [matTooltip]=\"attach.error\">error_outline</mat-icon>\r\n                  }\r\n                  @if (!attach._readyForDelete) {\r\n                    <button  mat-icon-button class=\"attachDeleteButton\" (click)=\"siiDownloadService._markReadyForDelete(attach)\" ><mat-icon>delete</mat-icon></button>\r\n                  }\r\n                  @if (!!attach._readyForDelete) {\r\n                    <div class=\"delete_action_panel\" >\r\n                      <button  mat-icon-button  (click)=\"siiDownloadService._clearReadyForTimeout(attach)\" ><mat-icon>clear</mat-icon></button>\r\n                      <button  mat-icon-button   (click)=\"siiDownloadService._delete(attach)\" ><mat-icon>check</mat-icon></button>\r\n                    </div>\r\n                  }\r\n                </div>\r\n              </div>\r\n            }\r\n          </div>\r\n        </div>\r\n      </li>\r\n    }\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n    @if (!isServerless && !!haveNotification) {\r\n      <li class=\"sii_toolbar_nav_item sii-toolbar__icon_button\" >\r\n        <a class=\"sii_toolbar_nav_link\" aria-label=\"Notification\">\r\n          <mat-icon aria-hidden=\"false\" [matBadge]=\"sdacTicketCount+sdacNotificationCount\" matBadgeColor=\"primary\" matBadgePosition=\"before\" matBadgeSize=\"small\" svgIcon=\"menu-notifications\"></mat-icon>\r\n        </a>\r\n        <div class=\"toolbarSmallContainer\">\r\n          @if (sdacNotificationCount!=0) {\r\n            <p class=\"text-uppercase categoryTitle\"><b i18n=\"@@toolbar_Notification\">Notification</b></p>\r\n            <div class=\" notificheContainer \"  >\r\n              @for (ticket of sdacNotification | async ; track ticket) {\r\n                <div  (click)=\"openSdacTiketsByCode(ticket.ssCode)\">\r\n                  <span class=\"notificheContainerLabel\">{{ticket.ssDescr}}</span>\r\n                  <div class=\"notifSub\" >{{ticket.count}} <span i18n=\"@@ticket_items\">{ticket.count,plural,=1 {Item} other {Items}}</span></div>\r\n                </div>\r\n              }\r\n            </div>\r\n            <div (click)=\"openSdacNotification()\"  class=\"allNotif\"><b i18n=\"@@toolbar_seeAllNotification\">See all notification</b> <mat-icon>navigate_next</mat-icon></div>\r\n          }\r\n          @if (sdacTicketCount!=0) {\r\n            <p class=\"text-uppercase categoryTitle\"><b i18n=\"@@toolbar_taskManagement\">Task Management</b></p>\r\n            <div class=\" notificheContainer \"  >\r\n              @for (ticket of sdacTichet | async ; track ticket) {\r\n                <div  (click)=\"openSdacTiketsByCode(ticket.ssCode)\">\r\n                  <span class=\"notificheContainerLabel\">{{ticket.ssDescr}}</span>\r\n                  <div class=\"notifSub\"  >{{ticket.count}} <span i18n=\"@@task_ite\">{ticket.count,plural,=1 {Task} other {Tasks}}</span></div>\r\n                </div>\r\n              }\r\n            </div>\r\n            <div (click)=\"openSdacTicket()\"  class=\"allNotif\"><b i18n=\"@@toolbar_seeAllTask\">See all tasks</b> <mat-icon>navigate_next</mat-icon></div>\r\n          }\r\n        </div>\r\n      </li>\r\n    }\r\n    @if (!isServerless) {\r\n      <li class=\"sii_toolbar_nav_item sii-toolbar__icon_button\" >\r\n        <a class=\"sii_toolbar_nav_link\" aria-label=\"event\">\r\n          <mat-icon aria-hidden=\"false\" [matBadge]=\"corporateItCalendarEventsCount\" matBadgeColor=\"warn\" matBadgePosition=\"before\" matBadgeSize=\"small\" [matBadgeHidden]=\"corporateItCalendarEventsCount==0\" svgIcon=\"menu-calendar\" ></mat-icon>\r\n        </a>\r\n        <div class=\"toolbarSmallContainer\">\r\n          <!-- <ng-container *ngIf=\"corporateItCalendarEventsCount>0\"> -->\r\n          <p class=\"text-uppercase categoryTitle\"><b  i18n=\"@@toolbar_deadlines\">Deadlines</b></p>\r\n          <div  class=\"notificheContainer\">\r\n            @for (item of corporateItCalendarEvents | async; track item; let index = $index) {\r\n              @if (!item.hideData && item.status=='SCADENZA_OGGI') {\r\n                <p style=\"width:100%\"><sii-badge style=\"padding: 2px 10px; font-weight: 700;\" [background]=\"'#ff9db4'\" [color]=\"'black'\" i18n=\"@@deadline_today\">today</sii-badge></p>\r\n              }\r\n              @if (!item.hideData && item.status=='IN_SCADENZA') {\r\n                <p style=\"width:100%\">  <sii-badge style=\"padding: 2px 10px; font-weight: 700;\" [background]=\"'#eabf30'\" [color]=\"'black'\" i18n=\"@@deadline_tomorrow\">tomorrow</sii-badge></p>\r\n              }\r\n              <div >\r\n                <div class=\"notificheContainerLabel\" style=\"margin-bottom:20px;\">@if (!item.isAllDay) {\r\n                  <span>{{item.time}} - </span>\r\n                }{{item.subject}}</div>\r\n              </div>\r\n            }\r\n          </div>\r\n          <div  (click)=\"goToDeadlines()\"  class=\"allNotif\"><b i18n=\"@@toolbar_allDeadlines\">See all deadlines</b> <mat-icon>navigate_next</mat-icon></div>\r\n        </div>\r\n      </li>\r\n    }\r\n\r\n    @if (!isServerless) {\r\n      <li class=\"sii_toolbar_nav_item sii_toolbar_profile_link\" >\r\n        <sii-profile-button style=\"padding-left: 7px;\"   [mySelf]='mySelf' (click)=\"toggleProfileInfo($event)\" [hideDetail]=\"mobileToolbar\"></sii-profile-button>\r\n      </li>\r\n    }\r\n  </ul>\r\n\r\n\r\n\r\n\r\n  <div role=\"button\" aria-label=\"menu\" (click)=\"mobileMenuClick();toggleMenuSidebar();\" id=\"menuToggle\" class=\"hidden-lg-up\">\r\n    <div class=\"sii_toolbar_manu_bar\" [ngClass]=\"{'animate':menuMobileOpen}\"></div>\r\n  </div>\r\n</div>\r\n\r\n</div>\r\n\r\n@if (menuSidebarVisible) {\r\n<div class=\"menu-sidebar\">\r\n<!-- <mat-sidenav-container > -->\r\n  <!-- <mat-sidenav class=\"menuSidenav\" #snav  mode=\"side\" position=\"end\" fixedInViewport=\"true\" fixedTopGap=\"72\"  > -->\r\n\r\n\r\n\r\n\r\n    <ul class=\"sii_toolbar_mobile-navbar\">\r\n\r\n      <!--\r\n\r\n      appMenuActive  |  appMenuOk | engMenuOk |  toolbar | eng  | app\r\n      1          1           1          V       -       V\r\n      1          1           0          -       -       V\r\n      1          0           1          -       V       -\r\n      1          0           0          -       -       -\r\n      0          1           1          V       V       -\r\n      0          1           0          -       -       V\r\n      0          0           1          -       V       -\r\n      0          0           0          -       -       -\r\n\r\n      toolbar => appMenuOk && engMenuOk\r\n      eng     => (appMenuOk && engMenuOk && !appMenuActive) || (engMenuOk && !appMenuOk)\r\n      app     => (appMenuOk && engMenuOk && appMenuActive) ||  (!engMenuOk && appMenuOk)\r\n\r\n      -->\r\n\r\n\r\n\r\n\r\n      @if (appMenuOk && engMenuOk) {\r\n        <nav mat-tab-nav-bar mat-stretch-tabs class=\"sidenavMenuNav\"\r\n          >\r\n          <!-- *ngIf=\"!isEngage && isEngageAvailable && applicationMenu.length>0  && (menuVoices | async)?.menu   \"> -->\r\n          <a mat-tab-link (click)=\"activeMobMenu = 'app'\"       [active]=\"appMenuActive\" >Menu App</a>\r\n          <a mat-tab-link (click)=\"activeMobMenu = 'engage'\"    [active]=\"!appMenuActive\" >Menu Engage</a>\r\n        </nav>\r\n      }\r\n\r\n      @if ((appMenuOk && engMenuOk && !appMenuActive) || (engMenuOk && !appMenuOk) ) {\r\n        <!-- <ng-container *ngIf=\"isEngage || (applicationMenu.length==0 && isEngageAvailable && (menuVoices | async)?.menu) || activeMobMenu == 'engage' \"> -->\r\n        <ng-container  *ngTemplateOutlet=\"toolbarMobileMenuTemplate;context:{$implicit: (menuVoices | async)?.menu, isEngageMenu:true}\" >    </ng-container>\r\n      }\r\n\r\n      @if ((appMenuOk && engMenuOk && appMenuActive) ||  (!engMenuOk && appMenuOk) ) {\r\n        <ng-container  *ngTemplateOutlet=\"toolbarMobileMenuTemplate;context:{$implicit: applicationMenu , isEngageMenu:false}\" >    </ng-container>\r\n      }\r\n\r\n\r\n      <li class=\"custom-divider\"></li>\r\n\r\n\r\n      @if (isEngage) {\r\n        <li class=\"sii_toolbar_nav_item \"><a class=\"sii_toolbar_nav_link \" href=\"https://siiweb.eng.it\" target=\"_blank\" title=\"\"><span i18n=\"@@navbar_goToSiiweb\">Go To Siiweb</span> <mat-icon>chevron_right</mat-icon></a></li>\r\n      }\r\n      @if (helPage) {\r\n        <li class=\"sii_toolbar_nav_item \"  ><a class=\"sii_toolbar_nav_link \" (click)=\"goToHelpPage()\" tabindex=\"0\" title=\"\"><span i18n=\"@@navbar_goToHelpPage\">Go To Help Page</span> <mat-icon>chevron_right</mat-icon></a></li>\r\n      }\r\n\r\n      <li class=\"sii_toolbar_nav_item  profile\" >\r\n        <!-- <sii-profile-button (click)=\"toggleSubmenu($event,'profile')\" [mySelf]='mySelf' [hideDetail]=\"true\"></sii-profile-button> -->\r\n        <!-- <mat-icon style=\"margin-left: 10px;\" (click)=\"toggleSubmenu($event,'profile')\" >chevron_right</mat-icon> -->\r\n        <div class=\"sii_toolbar_submenu\" [ngClass]=\"!!subMenuOpenStatus['profile']?'is-open':'is-closed' \">\r\n          <mat-icon  class=\"sii_toolbar_submenu-icon-back\" (click)=\"toggleProfileInfo($event)\">chevron_left</mat-icon>\r\n          <ul class=\"sii_toolbar_subnav notification\">\r\n\r\n            <li><p><b >{{mySelf?.firstName}} {{mySelf?.lastName}}</b></p></li>\r\n            <li class=\"sii_toolbar_subnav-item\">\r\n              <div class=\"profile\">\r\n                <!-- Dettagli utente -->\r\n                <dl class=\"eng-user-details\">\r\n                  <dt  i18n=\"@@toolbar_workerId\">Worker ID</dt>\r\n                  <dd >{{mySelf?.workerId}}</dd>\r\n                  <dt ><abbr i18n-title=\"@@toolbar_cc\" title=\"Competence Center\" i18n=\"@@toolbar_cc_dim\">CC</abbr></dt>\r\n                  <dd>{{mySelf?.costCenterId}}</dd>\r\n                  <dt ><abbr  i18n=\"@@toolbar_manager\">Manager</abbr></dt>\r\n                  <dd >{{mySelf.costCenterResp?.firstName}} {{mySelf.costCenterResp?.lastName}}</dd>\r\n                  @if (!!mySelf.tutorWorkerId) {\r\n                    <dt ><abbr i18n=\"@@toolbar_tutor\">Tutor</abbr></dt>\r\n                    <dd>{{mySelf.tutorFistName}} {{mySelf.tutorLastName}}</dd>\r\n                  }\r\n\r\n                  @if (!!mySelf.evaluatorWorkerId) {\r\n                    <dt ><abbr i18n=\"@@toolbar_evaluator\">Evaluator</abbr></dt>\r\n                    <dd>{{mySelf.evaluatorFistName}} {{mySelf.evaluatorLastName}}</dd>\r\n                  }\r\n                </dl>\r\n              </div>\r\n            </li>\r\n            <ul class=\"list-unstyled user-actions\">\r\n              <li><a (click)=\"goToProfile()\"   tabindex=\"0\"  title=\"\" class=\"\"><b i18n=\"@@navbar_goToProfile\">Go To Profile</b> <mat-icon>navigate_next</mat-icon></a></li>\r\n              <li><a href=\"https://password.eng.it/\" target=\"_blank\" title=\"\" class=\"\"><b i18n=\"@@navbar_changePassford\">Change Password</b> <mat-icon>navigate_next</mat-icon></a></li>\r\n              <li><a href=\"https://mysignins.microsoft.com/security-info\" target=\"_blank\" title=\"\" class=\"\"><b i18n=\"@@navbar_mfaSettings\">MFA Settings</b> <mat-icon>navigate_next</mat-icon></a></li>\r\n              <li><a  (click)=\"doLogout()\" tabindex=\"0\" title=\"\" class=\"\"><b i18n=\"@@navbar_logout\">Logout</b> <mat-icon>navigate_next</mat-icon></a></li>\r\n              @if (!!mySelf.delegatedUsers) {\r\n                <li><a  (click)=\"doDelegation()\"     title=\"\" class=\"\"><b i18n=\"@@DelegateLogin\">Login as delegated</b> <mat-icon>navigate_next</mat-icon></a></li>\r\n              }\r\n              @if (!!mySelf.isInDelegation) {\r\n                <li><a (click)=\"doDelegationLogout()\" title=\"\" class=\"\"><b ii18n=\"@@DelegateLogout\">Logout from delegation</b> <mat-icon>navigate_next</mat-icon></a></li>\r\n              }\r\n\r\n            </ul>\r\n\r\n            <li class=\"custom-divider mr-4 \"></li>\r\n\r\n            @if (corporateItCalendarEventsCount!=0) {\r\n              <li><p><b i18n=\"@@toolbar_deadlines\">Deadlines</b></p></li>\r\n              @for (item of corporateItCalendarEvents | async; track item; let index = $index) {\r\n                @if (!item.hideData && item.status=='SCADENZA_OGGI') {\r\n                  <p style=\"width:100% ; margin-top: 1em;\"><sii-badge style=\"padding: 2px 10px; font-weight: 700;\" [background]=\"'#ff9db4'\" [color]=\"'black'\" i18n=\"@@deadline_today\" >today</sii-badge></p>\r\n                }\r\n                @if (!item.hideData && item.status=='IN_SCADENZA') {\r\n                  <p style=\"width:100% ; margin-top: 1em;\">  <sii-badge style=\"padding: 2px 10px; font-weight: 700;\" [background]=\"'#eabf30'\" [color]=\"'black'\" i18n=\"@@deadline_tomorrow\" >tomorrow</sii-badge></p>\r\n                }\r\n                <li  class=\"sii_toolbar_subnav-item\" >\r\n                  <div class=\"notifPreview\">\r\n                    <div  style=\"margin-bottom:20px;\" class=\"notifLabel\">@if (!item.isAllDay) {\r\n                      <span >{{item.time}} - </span>\r\n                    }{{item.subject}}</div>\r\n                    <!-- <div style=\"margin-bottom:12px;\">{{item.date}}</div> -->\r\n                  </div>\r\n                </li>\r\n              }\r\n              <div  (click)=\"goToDeadlines()\"  class=\"allNotif\"><b i18n=\"@@toolbar_allDeadlines\">See all deadlines</b> <mat-icon>navigate_next</mat-icon></div>\r\n              <li class=\"custom-divider mr-4 \"></li>\r\n            }\r\n            @if (sdacNotificationCount!=0) {\r\n              <li class=\"sdacFieldRef\"><p><b i18n=\"@@toolbar_Notification\">Notification</b></p></li>\r\n              @for (ticket of sdacNotification | async ; track ticket) {\r\n                <li class=\"sii_toolbar_subnav-item\">\r\n                  <div class=\"notifPreview\"  (click)=\"openSdacTiketsByCode(ticket.ssCode)\">\r\n                    <span class=\"notifLabel\">{{ticket.ssDescr}}</span>\r\n                    <div style=\"margin-bottom:12px;\">{{ticket.count}} <span i18n=\"@@ticket_items\">{ticket.count,plural,=1 {Item} other {Items}}</span></div>\r\n                  </div>\r\n                </li>\r\n              }\r\n              <div (click)=\"openSdacNotification()\"  class=\"allNotif\"><b i18n=\"@@toolbar_seeAllNotification\">See all notification</b> <mat-icon>navigate_next</mat-icon></div>\r\n              <li class=\"custom-divider mr-4\"></li>\r\n            }\r\n\r\n            @if (sdacTicketCount!=0) {\r\n              <li class=\"sdacFieldRef\"><p><b i18n=\"@@toolbar_taskManagement\">Task Management</b></p></li>\r\n              @for (ticket of sdacTichet | async ; track ticket) {\r\n                <li class=\"sii_toolbar_subnav-item\">\r\n                  <div class=\"notifPreview\"  (click)=\"openSdacTiketsByCode(ticket.ssCode)\">\r\n                    <span class=\"notifLabel\">{{ticket.ssDescr}}</span>\r\n                    <div style=\"margin-bottom:12px;\">{{ticket.count}} <span i18n=\"@@task_ite\">{ticket.count,plural,=1 {Task} other {Tasks}}</span></div>\r\n                  </div>\r\n                </li>\r\n              }\r\n              <div (click)=\"openSdacTicket()\"  class=\"allNotif\"><b i18n=\"@@toolbar_seeAllTask\">See all tasks</b> <mat-icon>navigate_next</mat-icon></div>\r\n              <li class=\"custom-divider mr-4\"></li>\r\n            }\r\n\r\n\r\n\r\n          </ul>\r\n        </div>\r\n\r\n      </li>\r\n    </ul>\r\n  <!-- </mat-sidenav> -->\r\n<!-- </mat-sidenav-container> -->\r\n</div>\r\n}\r\n\r\n\r\n\r\n<ng-template #toolbarMobileMenuTemplate let-currMenu let-isEngageMenu=\"isEngageMenu\">\r\n\r\n  @for (menu of currMenu; track menu; let menuIndex = $index) {\r\n    <li class=\"sii_toolbar_nav_item\"   >\r\n      @if (!menu.submenu || !menu.submenu.columns) {\r\n        <a class=\"sii_toolbar_nav_link\" [ngClass]=\"{'mobileCurrentPage':router.url==menu.url}\"  tabindex=\"0\" (click)=\"navigateUrl(menu,isEngageMenu)\" [title]=\"menu.label\">{{menu.label}}</a>\r\n      }\r\n      @if (menu.submenu && menu.submenu.columns) {\r\n        <a (click)=\"toggleSubmenu($event,menuIndex)\"  class=\"sii_toolbar_nav_link\" [ngClass]=\"{'mobileCurrentPage':router.url==menu.url}\"  [title]=\"menu.label\">{{menu.label}}\r\n          <mat-icon>chevron_right</mat-icon>\r\n        </a>\r\n        <div class=\"sii_toolbar_submenu \" [ngClass]=\"!!subMenuOpenStatus[menuIndex]?'is-open':'is-closed' \" >\r\n          <mat-icon  class=\"sii_toolbar_submenu-icon-back\" (click)=\"toggleSubmenu($event,menuIndex)\">chevron_left</mat-icon>\r\n          <ul class=\"sii_toolbar_subnav\">\r\n            @for (colMenu of menu.submenu.columns; track colMenu) {\r\n              @for (mv of colMenu.items; track mv) {\r\n                @if (!mv.profiling || !!mv.visibleProfiling) {\r\n                  <li   class=\"sii_toolbar_subnav-item\" >\r\n                    <a  class=\"sii_toolbar_subnav__link\" [ngClass]=\"{'mobileCurrentPage':router.url==mv.url}\" tabindex=\"0\" (click)=\"navigateUrl(mv,isEngageMenu);$event.stopImmediatePropagation()\" [title]=\"mv.label\">{{mv.label}}</a>\r\n                  </li>\r\n                }\r\n              }\r\n              @if (colMenu.items?.length>0) {\r\n                <li class=\"custom-divider\"></li>\r\n              }\r\n            }\r\n          </ul>\r\n        </div>\r\n      }\r\n    </li>\r\n  }\r\n</ng-template>\r\n\r\n<ng-template #toolbarMenuTemplate let-currMenu let-isEngageMenu=\"isEngageMenu\">\r\n  <ul class=\"sii_toolbar_navbar_nav menuNavItem\">\r\n    @for (menu of currMenu; track menu) {\r\n      @if (!menu.submenu || !menu.submenu.columns) {\r\n        <li  class=\"sii_toolbar_nav_item menuVoice\" [ngClass]=\"{'currentPage':router.url==menu.url}\">\r\n          <a class=\"sii_toolbar_nav_link\" tabindex=\"0\" (click)=\"navigateUrl(menu, isEngageMenu)\"   [title]=\"menu.label\">{{menu.label}}</a>\r\n        </li>\r\n      }\r\n      @if (menu.submenu && menu.submenu.columns) {\r\n        <li  class=\"sii_toolbar_nav_item menuVoice\"  data-toggle=\"dropdown\"  [ngClass]=\"{'currentPage':router.url==menu.url}\">\r\n          <a  class=\"sii_toolbar_nav_link \"  [title]=\"menu.label\">{{menu.label}} </a>\r\n          <div class=\"toolbarMenuSubVoices\">\r\n            @for (colMenu of menu.submenu.columns; track colMenu) {\r\n              <ul class=\"toolbarMenuSubVoicesCol\" role=\"menu\">\r\n                @for (mv of colMenu.items; track mv) {\r\n                  @if (!mv.profiling || !!mv.visibleProfiling) {\r\n                    <li   >\r\n                      <a tabindex=\"0\" class=\"sii_toolbar_dropdown__link\"  [ngClass]=\"{'mobileCurrentPage':router.url==mv.url}\" [title]=\"mv.label\" (click)=\"navigateUrl(mv, isEngageMenu)\" >{{mv.label}}</a>\r\n                    </li>\r\n                  }\r\n                }\r\n              </ul>\r\n            }\r\n          </div>\r\n        </li>\r\n      }\r\n    }\r\n  </ul>\r\n</ng-template>\r\n", styles: [":host{box-shadow:0 2px 8px #0003;color:#fff;height:72px;padding:0 10px;display:flex;align-items:center;align-content:center;position:relative}a{color:unset}.sii-toolbar_logo_box{position:relative;display:flex;cursor:pointer}.sii-toolbar_logo_engage{height:42px;width:137px;box-sizing:border-box;margin:0 10px}.sii-toolbar__container{display:flex;flex:1;overflow:hidden;flex-wrap:wrap;height:100%}.sii-toolbar__title{text-transform:uppercase;margin-top:auto;margin-bottom:-2px;letter-spacing:.92px;position:absolute;top:-6.3px;left:56.2px;line-height:8px;height:24px;display:flex;align-items:flex-end;font-family:CocoEng;font-size:9px}.text-uppercase{text-transform:uppercase}.categoryTitle{opacity:.8;font-size:12px}.notificheContainer{display:flex;flex-wrap:wrap}.notificheContainer>div{flex:1 1 270px;padding-right:20px;cursor:pointer}.notificheContainer>div .notificheContainerLabel{font-size:1rem;font-weight:900}.notificheContainer>div .notifSub{margin-bottom:12px;opacity:.8;font-size:12px}.allNotif{cursor:pointer;width:200px;display:flex;align-items:center}.sii-toolbar__content{display:flex;flex:1}.sii-toolbar__icon_button{margin:24px 0 0}ul.sii_toolbar_navbar_nav{list-style:none;display:flex;flex-direction:row;flex:1;padding:0 10px 0 5px;margin:0;max-width:1192px}ul.sii_toolbar_navbar_nav.searchNavItem{padding:0 10px;flex:0}ul.sii_toolbar_navbar_nav li.sii_toolbar_nav_item{letter-spacing:.03rem;display:flex;justify-content:center}ul.sii_toolbar_navbar_nav li.sii_toolbar_nav_item.currentPage>.sii_toolbar_nav_link:after,ul.sii_toolbar_navbar_nav li.sii_toolbar_nav_item:hover>.sii_toolbar_nav_link:after{width:calc(100% - 16px)}ul.sii_toolbar_navbar_nav li.sii_toolbar_nav_item.sii_toolbar_profile_link:hover:after{width:40px}ul.sii_toolbar_navbar_nav li.sii_toolbar_nav_item.sii-toolbar__icon_button .sii_toolbar_nav_link{padding-left:7px;padding-right:7px}ul.sii_toolbar_navbar_nav li.sii_toolbar_nav_item.sii-toolbar__icon_button .sii_toolbar_nav_link mat-icon{margin-bottom:-5px}ul.sii_toolbar_navbar_nav li.sii_toolbar_nav_item .sii_toolbar_nav_link{color:#fff;font-size:12px;font-weight:700;line-height:12px;text-transform:uppercase;position:relative;display:flex;padding:0 15px 23px;outline:none;text-decoration:none;transition:all .3s ease-in-out;cursor:pointer;height:100%;align-items:flex-end;box-sizing:border-box}ul.sii_toolbar_navbar_nav li.sii_toolbar_nav_item .sii_toolbar_nav_link:after,ul.sii_toolbar_navbar_nav li.sii_toolbar_nav_item.sii_toolbar_profile_link:after{content:\"\";display:block;width:0;height:4px;background:#c51b88;transition:width .3s;position:absolute;bottom:0;left:8px}ul.sii_toolbar_navbar_nav li.sii_toolbar_nav_item.sii_toolbar_profile_link:after{left:unset}ul.sii_toolbar_navbar_nav li.sii_toolbar_nav_item .sii_toolbar_nav_link:hover,ul.sii_toolbar_navbar_nav li.sii_toolbar_nav_item .sii_toolbar_nav_link:focus,ul.sii_toolbar_navbar_nav li.sii_toolbar_nav_item .sii_toolbar_dropdown__link:hover,ul.sii_toolbar_navbar_nav li.sii_toolbar_nav_item .sii_toolbar_dropdown__link:focus{color:#ffffffe6}ul.sii_toolbar_navbar_nav li.sii_toolbar_nav_item:hover>.toolbarMenuSubVoices,ul.sii_toolbar_navbar_nav li.sii_toolbar_nav_item:hover>.toolbarSmallContainer{display:flex}ul.sii_toolbar_navbar_nav li.sii_toolbar_nav_item .searchPanel{flex-direction:column}ul.sii_toolbar_navbar_nav li.sii_toolbar_nav_item .searchPanel .search-actions{display:flex;justify-content:flex-end;font-size:13px;color:#fff;outline:none;text-decoration:none;transition:all .3s ease-in-out}ul.sii_toolbar_navbar_nav li.sii_toolbar_nav_item .searchPanel .search-actions a{display:flex;align-items:center;cursor:pointer}ul.sii_toolbar_navbar_nav li.sii_toolbar_nav_item .searchPanel .search-actions .mat-icon.advsearchIcon{margin-right:5px;transform:scale(.8)}ul.sii_toolbar_navbar_nav li.sii_toolbar_nav_item .searchPanel .search-form{position:relative;width:100%;margin-top:1rem;margin-bottom:1.8rem;display:flex}ul.sii_toolbar_navbar_nav li.sii_toolbar_nav_item .searchPanel .search-form .mat-mdc-icon-button{position:absolute;top:8px;right:0}ul.sii_toolbar_navbar_nav li.sii_toolbar_nav_item .searchPanel .search-form .mat-mdc-icon-button mat-icon{font-size:32px}ul.sii_toolbar_navbar_nav li.sii_toolbar_nav_item .searchPanel .search-form .search-form__search-input{background-color:transparent;border:none;border-bottom:1px solid rgba(11,22,2,.4);box-sizing:border-box;height:50px;width:100%;position:relative;color:#ffffffbf;border-color:#ffffff40;text-transform:uppercase;font-size:1.25rem;overflow:visible}ul.sii_toolbar_navbar_nav li.sii_toolbar_nav_item .searchPanel .search-form .search-form__search-input:focus{outline:none}ul.sii_toolbar_navbar_nav li.sii_toolbar_nav_item .searchPanel .search-form .search-form__search-input::placeholder{color:#ffffffbf;text-transform:uppercase;font-size:1.25rem}ul.sii_toolbar_navbar_nav li.sii_toolbar_nav_item .searchPanel .search-form .search-form__search-icon{font-size:24px;color:#fff;position:absolute;top:16px;right:10px;border:0;background:none;cursor:pointer}ul.sii_toolbar_navbar_nav li.sii_toolbar_nav_item .toolbarSmallContainer{display:none;flex-direction:column;width:350px;position:absolute;overflow:auto;max-height:calc(100vh - var(--toolbarHeight));right:0;background-color:#09090917;-webkit-backdrop-filter:blur(12px) brightness(.75);backdrop-filter:blur(12px) brightness(.75);padding:30px;top:100%;z-index:1000;box-sizing:border-box}ul.sii_toolbar_navbar_nav li.sii_toolbar_nav_item .toolbarMenuSubVoices{display:none;width:100%;position:absolute;right:0;background-color:#09090917;-webkit-backdrop-filter:blur(12px) brightness(.75);backdrop-filter:blur(12px) brightness(.75);padding:1.5rem 3rem;top:100%;z-index:1000;box-sizing:border-box}ul.sii_toolbar_navbar_nav li.sii_toolbar_nav_item .toolbarMenuSubVoices .toolbarMenuSubVoicesCol{flex:1;padding-left:0;list-style:none}ul.sii_toolbar_navbar_nav li.sii_toolbar_nav_item .toolbarMenuSubVoices .toolbarMenuSubVoicesCol li{border-left:.07rem solid rgba(255,255,255,.3);padding-left:1rem;cursor:pointer}ul.sii_toolbar_navbar_nav li.sii_toolbar_nav_item .toolbarMenuSubVoices .toolbarMenuSubVoicesCol li a{text-transform:uppercase;padding:.25rem 0;opacity:1;font-size:.75rem;letter-spacing:.02rem}#menuToggle{z-index:1001;display:none;align-items:center;color:#fff;cursor:pointer;height:unset}#menuToggle .sii_toolbar_manu_bar,#menuToggle .sii_toolbar_manu_bar:after,#menuToggle .sii_toolbar_manu_bar:before{width:30px;height:2px}#menuToggle .sii_toolbar_manu_bar{position:relative;background:#fff;transition:all 0 .3s}#menuToggle .sii_toolbar_manu_bar:before{content:\"\";position:absolute;left:0;bottom:9px;background:#fff;transition:bottom .3s .3s cubic-bezier(.23,1,.32,1),transform .3s cubic-bezier(.23,1,.32,1)}#menuToggle .sii_toolbar_manu_bar:after{content:\"\";position:absolute;left:0;top:9px;background:#fff;transition:top .3s .3s cubic-bezier(.23,1,.32,1),transform .3s cubic-bezier(.23,1,.32,1)}#menuToggle .sii_toolbar_manu_bar.animate{background:#fff0}#menuToggle .sii_toolbar_manu_bar.animate:after{top:0;background:#fff;transform:rotate(45deg);transition:top .3s cubic-bezier(.23,1,.32,1),transform .3s .3s cubic-bezier(.23,1,.32,1)}#menuToggle .sii_toolbar_manu_bar.animate:before{bottom:0;background:#fff;transform:rotate(-45deg);transition:bottom .3s cubic-bezier(.23,1,.32,1),transform .3s .3s cubic-bezier(.23,1,.32,1)}.menu-sidebar{border:0px;background-color:#090909;overflow-y:auto;overflow-x:hidden;display:block;width:100vw;position:fixed;top:var(--fixedToolbarHeight);right:0;height:calc(100vh - var(--fixedToolbarHeight));left:var(--safe-area-inset-left)}.menu-sidebar .custom-divider{height:0;margin:.75rem 0;overflow:hidden;border-top:1px solid #F5F5F5;opacity:.25}.menu-sidebar ul.sii_toolbar_mobile-navbar{position:relative;list-style:none;text-align:left;margin-left:30px;display:block;padding-left:0}.menu-sidebar ul.sii_toolbar_mobile-navbar .sidenavMenuNav{color:#fff;margin-left:-30px}.menu-sidebar ul.sii_toolbar_mobile-navbar .sidenavMenuNav ::ng-deep mat-ink-bar{background-color:#c51b88!important}.menu-sidebar ul.sii_toolbar_mobile-navbar li.profile mat-icon{transform:scale(1.5);opacity:.5;color:#fff}.menu-sidebar ul.sii_toolbar_mobile-navbar li.profile .user-actions{list-style:none;padding:0}.menu-sidebar ul.sii_toolbar_mobile-navbar li.profile .user-actions li a{display:flex;align-items:center;padding:.33rem;padding-left:0;font-size:1.16em;color:#fff;outline:none;text-decoration:none;cursor:pointer}.menu-sidebar ul.sii_toolbar_mobile-navbar li.profile .eng-user-details{margin-top:1rem;display:flex;flex-wrap:wrap}.menu-sidebar ul.sii_toolbar_mobile-navbar li.profile .eng-user-details dt{font-weight:700;text-transform:uppercase;font-size:.65rem;flex:0 0 42%;max-width:42%}.menu-sidebar ul.sii_toolbar_mobile-navbar li.profile .eng-user-details dd{text-transform:none;flex:0 0 58%;max-width:58%;margin-bottom:.5rem;margin-left:0}.menu-sidebar ul.sii_toolbar_mobile-navbar li.sii_toolbar_nav_item{text-transform:uppercase;font-size:.75rem;padding:0;display:block}.menu-sidebar ul.sii_toolbar_mobile-navbar li.sii_toolbar_nav_item .sii_toolbar_nav_link{font-size:16px;font-weight:700;line-height:1.2;text-transform:none;position:relative;display:flex;align-items:center;padding:.75rem 0;color:#fff;text-decoration:none;cursor:pointer}.menu-sidebar ul.sii_toolbar_mobile-navbar li.sii_toolbar_nav_item .sii_toolbar_nav_link mat-icon{transform:scale(1.5);opacity:.5}.menu-sidebar ul.sii_toolbar_mobile-navbar li.sii_toolbar_nav_item .sii_toolbar_submenu{position:absolute;background-color:#090909;color:#fff;top:12px;transition:left .4s ease;z-index:2;margin-left:-60px;width:calc(100% + 60px);margin-top:-16px;height:calc(100vh - 72px)}.menu-sidebar ul.sii_toolbar_mobile-navbar li.sii_toolbar_nav_item .sii_toolbar_submenu.is-closed{display:none}.menu-sidebar ul.sii_toolbar_mobile-navbar li.sii_toolbar_nav_item .sii_toolbar_submenu.is-open{display:flex}.menu-sidebar ul.sii_toolbar_mobile-navbar li.sii_toolbar_nav_item .sii_toolbar_submenu .sii_toolbar_submenu-icon-back{margin:26px 15px 0 10px;transform:scale(1.5);opacity:.5}.menu-sidebar ul.sii_toolbar_mobile-navbar li.sii_toolbar_nav_item .sii_toolbar_submenu ul.sii_toolbar_subnav{position:relative;list-style:none;text-align:left;margin-left:0;display:block;padding-left:0;overflow:auto;padding-top:1rem;padding-bottom:8rem;flex:1;padding-right:20px}.menu-sidebar ul.sii_toolbar_mobile-navbar li.sii_toolbar_nav_item .sii_toolbar_submenu ul.sii_toolbar_subnav a.sii_toolbar_subnav__link{font-size:16px;text-transform:none;font-weight:400;display:block;line-height:1.25;padding:.75rem 0}.toolbarSearchLabel{margin-right:.25rem}li.sii_toolbar_nav_item.gotosiiwebButton{width:153px}li.sii_toolbar_nav_item.gotosiiwebButton mat-icon{font-size:15px;padding-left:5px;height:17px}.engageMenuItem .engageMenuItem_link{width:130px}.engageMenuItem .engageMenuItem_box{display:none;justify-content:flex-end;background-color:#041f2ee8;width:100%;position:absolute;right:0;height:60px;top:var(--toolbarHeight)}.engageMenuItem .engageMenuItem_box .sii_toolbar_navbar_nav{justify-content:flex-end}.engageMenuItem:hover .engageMenuItem_box{display:flex}.searchLink{padding-right:7px!important}.search-icon{margin-bottom:-6px}@media screen and (max-width: 576px){.menu-sidebar{height:100vh}.searchPanel{padding:10px!important}}@media screen and (max-width: 1050px){sii-profile-button{margin-bottom:auto!important}#menuToggle{display:flex}.sii-toolbar__container :not(.alwaysVisible).menuNavItem,.sii-toolbar__container :not(.alwaysVisible).sii-toolbar__help,.sii-toolbar__container :not(.alwaysVisible).gotosiiwebButton,.sii-toolbar__container :not(.alwaysVisible).engageMenuItem,.sii-toolbar__container :not(.alwaysVisible).sii-toolbar__icon_button{display:none!important}.toolbarSearchLabel{display:none!important}.search-icon{width:40px;height:40px;font-size:40px;margin-bottom:-5px}}.allNotif{cursor:pointer;display:flex;align-items:center}.notifPreview{padding-bottom:10px;cursor:pointer}.notifPreview .notifLabel{margin:0}.mobileCurrentPage{text-decoration:underline #c51b88!important;text-decoration-thickness:2px!important}.attachmentContainer{display:flex;flex-wrap:wrap}.attachmentContainer .attachmentRow{cursor:pointer;flex:1 1 270px;display:flex;border-bottom:1px solid white;margin-bottom:10px;padding-bottom:10px}.attachmentContainer .attachmentRow .attachmentInfoPanel{display:flex;flex-direction:column;flex:1}.attachmentContainer .attachmentRow .attachmentInfoPanel .attachNameLabel{overflow-wrap:break-word;max-width:240px}.attachmentContainer .attachmentRow .attachmentInfoPanel .attachSubRow{opacity:.8;font-size:12px}.attachmentContainer .attachmentRow .attachment_action{display:flex;flex-direction:column}.attachmentContainer .attachmentRow .attachment_action mat-spinner{margin-left:10px;margin-right:-5px}.attachmentContainer .attachmentRow .attachment_action .attachDeleteButton{margin-right:-12px;margin-top:-11px;margin-bottom:-15px;opacity:.5}.attachmentContainer .attachmentRow .attachment_action .attachDeleteButton:hover{opacity:1}.attachmentContainer .attachmentRow .attachment_action .delete_action_panel{display:flex;margin:-11px -12px -15px -48px}.changeIncoming{animation:pulse 2s infinite}.changeRequired{animation:attention 2s infinite}@keyframes pulse{0%{transform:scale(1.25);fill:gold}70%{transform:scale(1)}to{transform:scale(1.25);fill:gold}}@keyframes attention{0%{transform:scale(4)}to{transform:scale(1)}}\n"] }]
        }], ctorParameters: () => [{ type: SiiToolkitService }, { type: i0.ElementRef }, { type: SiiEngageService }, { type: SdacPreviewService }, { type: i4.Router }, { type: i1$5.BreakpointObserver }, { type: SiiBreadcrumbService }, { type: DelegationService }, { type: SiiDownloadService }], propDecorators: { autoHide: [{
                type: Input
            }], toolbarTitle: [{
                type: Input
            }], menu: [{
                type: Input
            }], applicationMenu: [{
                type: Input
            }], helpId: [{
                type: Input
            }], showEngageSearch: [{
                type: Input
            }], showEngageMenu: [{
                type: Input
            }], showCloseButton: [{
                type: Input
            }], closeAction: [{
                type: Output
            }], boxShadow: [{
                type: HostBinding,
                args: ['style.box-shadow']
            }] } });

class PageDetailComponent {
    set width(val) {
        this.hostWidth = (val !== undefined && new RegExp(/^\d+$/g).test(val)) ? val + 'px' :
            (val !== undefined && new RegExp(/^\d+(px|vw|%)$/g).test(val)) ? val : this.defaultMinWidth;
    }
    constructor(el) {
        this.el = el;
        this.defaultMinWidth = '320px';
        this.hostWidth = this.defaultMinWidth;
        this.display = 'none';
        this.alwaysHover = false;
    }
    ngOnInit() {
    }
    getRealWidth() {
        return parseInt(getComputedStyle(this.el.nativeElement, null).width.replace('px', ''), 10);
    }
    getMinWidthInPx() {
        if (new RegExp(/^\d+$/g).test(this.hostWidth)) {
            return parseInt(this.hostWidth, 10);
        }
        else if (new RegExp(/^\d+(px)$/g).test(this.hostWidth)) {
            return parseInt(this.hostWidth.match(/^\d+/g)[0], 10);
        }
        else if (new RegExp(/^\d+(%)$/g).test(this.hostWidth)) {
            const parentw = parseInt(getComputedStyle(this.el.nativeElement.parentElement, null).width.replace('px', ''), 10);
            return (parentw / 100) * parseInt(this.hostWidth.match(/^\d+/g)[0], 10);
        }
    }
    hoverFullScreen(status) {
        status ? this.el.nativeElement.classList.add('pcd_hoverFullScreen') : this.el.nativeElement.classList.remove('pcd_hoverFullScreen');
    }
    hover(status) {
        if (!this.alwaysHover) {
            status ? this.el.nativeElement.classList.add('pcd_hover') : this.el.nativeElement.classList.remove('pcd_hover');
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: PageDetailComponent, deps: [{ token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "18.2.13", type: PageDetailComponent, isStandalone: true, selector: "sii-page-detail", inputs: { alwaysHover: "alwaysHover", width: "width" }, host: { properties: { "style.width": "this.hostWidth", "style.max-width": "this.hostWidth", "style.display": "this.display", "class.pcd_hover": "this.alwaysHover" } }, ngImport: i0, template: "<ng-content></ng-content>\r\n", styles: [":host{flex:1 1 auto}:host.pcd_hover{position:fixed;right:var(--safe-area-inset-right);height:calc(100% - var(--toolbarHeight))!important;background-color:#2a2b38;top:var(--toolbarHeight)}:host.pcd_hoverFullScreen{max-width:100%!important;min-width:100%!important;width:100%!important}\n"] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: PageDetailComponent, decorators: [{
            type: Component,
            args: [{ selector: 'sii-page-detail', standalone: true, template: "<ng-content></ng-content>\r\n", styles: [":host{flex:1 1 auto}:host.pcd_hover{position:fixed;right:var(--safe-area-inset-right);height:calc(100% - var(--toolbarHeight))!important;background-color:#2a2b38;top:var(--toolbarHeight)}:host.pcd_hoverFullScreen{max-width:100%!important;min-width:100%!important;width:100%!important}\n"] }]
        }], ctorParameters: () => [{ type: i0.ElementRef }], propDecorators: { hostWidth: [{
                type: HostBinding,
                args: ['style.width']
            }, {
                type: HostBinding,
                args: ['style.max-width']
            }], display: [{
                type: HostBinding,
                args: ['style.display']
            }], alwaysHover: [{
                type: Input
            }, {
                type: HostBinding,
                args: ['class.pcd_hover']
            }], width: [{
                type: Input
            }] } });

class PageFiltersComponent {
    set width(val) {
        this.hostWidth = (val !== undefined && new RegExp(/^\d+$/g).test(val)) ? val + 'px' :
            (val !== undefined && new RegExp(/^\d+(px|vw|%)$/g).test(val)) ? val : this.defaultMinWidth;
    }
    // @HostBinding('class.pcf_hover') hover=false;
    // @HostBinding('class.pcf_hoverFullScreen') hoverFullScreen=false;
    constructor(el) {
        this.el = el;
        this.defaultMinWidth = '256px';
        this.hostWidth = this.defaultMinWidth;
        this.display = 'block';
        this.closeFilterPanelEmitter = new EventEmitter();
    }
    ngOnInit() {
    }
    get isOpen() {
        return this.display === 'block';
    }
    getRealWidth() {
        return parseInt(getComputedStyle(this.el.nativeElement, null).width.replace('px', ''), 10);
    }
    getMinWidthInPx() {
        if (new RegExp(/^\d+$/g).test(this.hostWidth)) {
            return parseInt(this.hostWidth, 10);
        }
        else if (new RegExp(/^\d+(px)$/g).test(this.hostWidth)) {
            return parseInt(this.hostWidth.match(/^\d+/g)[0], 10);
        }
        else if (new RegExp(/^\d+(%)$/g).test(this.hostWidth)) {
            const parentw = parseInt(getComputedStyle(this.el.nativeElement.parentElement, null).width.replace('px', ''), 10);
            return (parentw / 100) * parseInt(this.hostWidth.match(/^\d+/g)[0], 10);
        }
    }
    hoverFullScreen(status) {
        status ? this.el.nativeElement.classList.add('pcf_hoverFullScreen') : this.el.nativeElement.classList.remove('pcf_hoverFullScreen');
    }
    hover(status) {
        status ? this.el.nativeElement.classList.add('pcf_hover') : this.el.nativeElement.classList.remove('pcf_hover');
    }
    closePanel() {
        this.closeFilterPanelEmitter.emit();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: PageFiltersComponent, deps: [{ token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "18.2.13", type: PageFiltersComponent, isStandalone: true, selector: "sii-page-filters", inputs: { toolbarTitle: "toolbarTitle", filterIcon: "filterIcon", width: "width" }, host: { properties: { "style.width": "this.hostWidth", "style.max-width": "this.hostWidth", "style.display": "this.display" } }, ngImport: i0, template: "<div class=\"pf-body\">\r\n  <ng-content select=\"sii-breadcrumb\"></ng-content>\r\n  <div class=\"pf_toolbar\">\r\n    @switch (toolbarTitle==null) {\r\n      @case (true) {\r\n        <h5 class=\"pf_toolbar_label\" i18n=\"@@filters\">Filters</h5>\r\n      }\r\n      @case (false) {\r\n        <h5 class=\"pf_toolbar_label\">{{toolbarTitle}}</h5>\r\n      }\r\n    }\r\n\r\n    <button mat-icon-button  aria-label=\"close filter panel\" (click)=\"closePanel()\">\r\n      <mat-icon  [svgIcon]=\"!!filterIcon?filterIcon:'sii-hide-filters'\" ></mat-icon>\r\n    </button>\r\n  </div>\r\n  <div class=\"pf_content\">\r\n    <ng-content></ng-content>\r\n  </div>\r\n</div>\r\n", styles: [":host{flex:1 1 auto;flex-direction:column;z-index:800}:host.pcf_hover{position:fixed;top:var(--toolbarHeight);height:calc(100% - var(--toolbarHeight))!important;background-color:#090909;opacity:.98}:host.pcf_hoverFullScreen{max-width:calc(100% - 60px)!important;min-width:calc(100% - 60px)!important;width:calc(100% - 60px)!important}@media screen and (max-width: 350px){:host.pcf_hoverFullScreen{max-width:100%!important;min-width:100%!important;width:100%!important}}.pf-body{display:flex;height:100%;flex-direction:column}.pf-body ::ng-deep sii-breadcrumb{padding-left:15px;padding-top:10px}.pf-body .pf_toolbar{padding:20px 23px 0 15px;display:flex}.pf-body .pf_toolbar .pf_toolbar_label{flex:1;text-transform:uppercase}.pf-body .pf_toolbar button{margin-top:-12px;margin-right:-20px}.pf-body .pf_content{padding:0 14px;flex:1 1 auto;overflow:auto;overscroll-behavior:contain}\n"], dependencies: [{ kind: "component", type: MatIconButton, selector: "button[mat-icon-button]", exportAs: ["matButton"] }, { kind: "component", type: MatIcon, selector: "mat-icon", inputs: ["color", "inline", "svgIcon", "fontSet", "fontIcon"], exportAs: ["matIcon"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: PageFiltersComponent, decorators: [{
            type: Component,
            args: [{ selector: 'sii-page-filters', standalone: true, imports: [MatIconButton, MatIcon], template: "<div class=\"pf-body\">\r\n  <ng-content select=\"sii-breadcrumb\"></ng-content>\r\n  <div class=\"pf_toolbar\">\r\n    @switch (toolbarTitle==null) {\r\n      @case (true) {\r\n        <h5 class=\"pf_toolbar_label\" i18n=\"@@filters\">Filters</h5>\r\n      }\r\n      @case (false) {\r\n        <h5 class=\"pf_toolbar_label\">{{toolbarTitle}}</h5>\r\n      }\r\n    }\r\n\r\n    <button mat-icon-button  aria-label=\"close filter panel\" (click)=\"closePanel()\">\r\n      <mat-icon  [svgIcon]=\"!!filterIcon?filterIcon:'sii-hide-filters'\" ></mat-icon>\r\n    </button>\r\n  </div>\r\n  <div class=\"pf_content\">\r\n    <ng-content></ng-content>\r\n  </div>\r\n</div>\r\n", styles: [":host{flex:1 1 auto;flex-direction:column;z-index:800}:host.pcf_hover{position:fixed;top:var(--toolbarHeight);height:calc(100% - var(--toolbarHeight))!important;background-color:#090909;opacity:.98}:host.pcf_hoverFullScreen{max-width:calc(100% - 60px)!important;min-width:calc(100% - 60px)!important;width:calc(100% - 60px)!important}@media screen and (max-width: 350px){:host.pcf_hoverFullScreen{max-width:100%!important;min-width:100%!important;width:100%!important}}.pf-body{display:flex;height:100%;flex-direction:column}.pf-body ::ng-deep sii-breadcrumb{padding-left:15px;padding-top:10px}.pf-body .pf_toolbar{padding:20px 23px 0 15px;display:flex}.pf-body .pf_toolbar .pf_toolbar_label{flex:1;text-transform:uppercase}.pf-body .pf_toolbar button{margin-top:-12px;margin-right:-20px}.pf-body .pf_content{padding:0 14px;flex:1 1 auto;overflow:auto;overscroll-behavior:contain}\n"] }]
        }], ctorParameters: () => [{ type: i0.ElementRef }], propDecorators: { hostWidth: [{
                type: HostBinding,
                args: ['style.width']
            }, {
                type: HostBinding,
                args: ['style.max-width']
            }], display: [{
                type: HostBinding,
                args: ['style.display']
            }], toolbarTitle: [{
                type: Input
            }], filterIcon: [{
                type: Input
            }], width: [{
                type: Input
            }] } });

class PageFooterDirective {
    constructor(el) {
        this.el = el;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: PageFooterDirective, deps: [{ token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "18.2.13", type: PageFooterDirective, isStandalone: true, selector: "[siiPageFooter]", ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: PageFooterDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[siiPageFooter]',
                    standalone: true
                }]
        }], ctorParameters: () => [{ type: i0.ElementRef }] });

class SiiPageContainerComponent {
    get toolbarHeight() { return this.pageToolbarContainerHeightSubj.value + 'px'; }
    get pageContentToolbarsContainerHeightVal() { return this.pageContentToolbarsContainerHeightSubj.value + 'px'; }
    get fixedToolbarHeight() { return this.pageFixedToolbarContainerHeightSubj.value + 'px'; }
    get footerHeight() { return this.pageFooterContainerHeightSubj.value + 'px'; }
    get headeHeight() { return (this.showMiniHeader ? this.pageMiniHeaderContainerHeightSubj.value : this.pageHeaderContainerVisibleHeightSubj.value) + 'px'; }
    onResize(event) {
        this.fixLayout();
    }
    constructor(el, ref, sanitizer, zone) {
        this.el = el;
        this.ref = ref;
        this.sanitizer = sanitizer;
        this.zone = zone;
        this.clickOutsideDetail = new EventEmitter();
        this.toggleFilterPanel = new EventEmitter();
        this.autoHiddenToolbar = true;
        this.backgroundImgUrl = 'assets/images/bg-eng.jpg';
        this.hideBackgroundImg = false;
        this.lastToolbarVisibilityChangeTime = 0;
        this.hiddenSiiToolbar = false;
        this.siiPageScrolled = false;
        //  @HostBinding('class.hiddenHeader')  siiHiddenHeader = false;
        //  @HostBinding('class.siiPageScrolled') get pageScrolled(){
        //    return this.realScrollerRef  === document ? this.realScrollerRef.scrollingElement.scrollTop > 0 : this.realScrollerRef?.scrollTop > 0; }
        this.initialized = false;
        this.pageToolbarContainerHeightSubj = new BehaviorSubject(0);
        this.pageToolbarContainerHeight = this.pageToolbarContainerHeightSubj.asObservable();
        this.pageFixedToolbarContainerHeightSubj = new BehaviorSubject(0);
        this.pageFixedToolbarContainerHeight = this.pageFixedToolbarContainerHeightSubj.asObservable();
        this.pageContentToolbarsContainerHeightSubj = new BehaviorSubject(0);
        this.pageContentToolbarsContainerHeight = this.pageContentToolbarsContainerHeightSubj.asObservable();
        this.pageFixedContentToolbarsContainerHeightSubj = new BehaviorSubject(0);
        this.pageFixedContentToolbarsContainerHeight = this.pageFixedContentToolbarsContainerHeightSubj.asObservable();
        this.pageFooterContainerHeightSubj = new BehaviorSubject(0);
        this.pageFooterContainerHeight = this.pageFooterContainerHeightSubj.asObservable();
        this.pageHeaderContainerHeightSubj = new BehaviorSubject(0);
        this.pageHeaderContainerHeight = this.pageHeaderContainerHeightSubj.asObservable();
        this.pageMiniHeaderContainerHeightSubj = new BehaviorSubject(0);
        this.pageMiniHeaderContainerHeight = this.pageMiniHeaderContainerHeightSubj.asObservable();
        this.pageFooterContainerVisibleHeightSubj = new BehaviorSubject(0);
        this.pageFooterContainerVisibleHeight = this.pageFooterContainerVisibleHeightSubj.asObservable();
        this.pageHeaderContainerVisibleHeightSubj = new BehaviorSubject(0);
        this.pageHeaderContainerVisibleHeight = this.pageHeaderContainerVisibleHeightSubj.asObservable();
        this.showMiniHeader = false;
        this.addFooterSpace = false;
        this.lastScrollTop = 0;
        this.utils = {
            lastpctbItems: 0
        };
        this.scrollFunctionRef = function scroll(e) {
            if (e.target === e.currentTarget) {
                this.showHideToolbar(e.srcElement === document ? document.scrollingElement : e.srcElement);
            }
        }.bind(this);
        this.positiveOrZero = (val) => val > 0 ? val : 0;
        this.id = (new Date()).getTime();
        this.pageFooterContainerObserver = new ResizeObserver(entries => {
            const fh = entries.reduce((acc, c) => acc + c.contentRect.height, 0) || 0;
            this.pageFooterContainerHeightSubj.next(fh);
            this.checkFooterVisibility(this.realScrollerRef === document ? this.realScrollerRef.scrollingElement : this.realScrollerRef);
            //  this.pageToolbarsContainerHeightSubj.next(entries[0].contentRect.height);
        });
        this.pageHeaderContainerObserver = new ResizeObserver(entries => {
            const fh = entries.reduce((acc, c) => acc + c.contentRect.height, 0) || 0;
            this.pageHeaderContainerHeightSubj.next(fh);
            this.checkHeaderVisibility(this.realScrollerRef === document ? this.realScrollerRef.scrollingElement : this.realScrollerRef);
        });
        this.pageMiniHeaderContainerObserver = new ResizeObserver(entries => {
            const fh = entries.reduce((acc, c) => acc + c.contentRect.height, 0) || 0;
            this.pageMiniHeaderContainerHeightSubj.next(fh);
        });
        this.pageToolbarContainerObserver = new ResizeObserver(entries => {
            this.zone.run(() => {
                const th = entries.reduce((acc, c) => acc + c.contentRect.height, 0);
                if (th !== 0) {
                    this.pageFixedToolbarContainerHeightSubj.next(th);
                }
                this.pageToolbarContainerHeightSubj.next(th);
            });
        });
        this.pageContentToolbarsContainerObserver = new ResizeObserver(entries => {
            this.zone.run(() => {
                const pcth = entries.reduce((acc, c) => acc + c.contentRect.height, 0);
                if (pcth !== 0 && this.utils.lastpctbItems !== entries[0].target.childElementCount) {
                    this.pageFixedContentToolbarsContainerHeightSubj.next(pcth);
                }
                this.pageContentToolbarsContainerHeightSubj.next(pcth);
                this.utils.lastpctbItems = entries[0].target.childElementCount;
            });
        });
        this.scrollerContainerObserver = new ResizeObserver(entries => {
            this.zone.run(() => {
                this.checkFooterVisibility(this.realScrollerRef === document ? this.realScrollerRef.scrollingElement : this.realScrollerRef);
                this.checkHeaderVisibility(this.realScrollerRef === document ? this.realScrollerRef.scrollingElement : this.realScrollerRef);
            });
        });
    }
    ngOnChanges(changes) {
        if (!!changes.scrollerRef && !changes.scrollerRef.isFirstChange()
            && changes.scrollerRef.currentValue !== changes.scrollerRef.previousValue) {
            if (!!this.realScrollerRef) {
                this.realScrollerRef.removeEventListener('scroll', this.scrollFunctionRef, true);
            }
            this.initScroller();
            if (!!this.realScrollerRef) {
                // simuolo uno scroll verso l'alto per far comparire se necessario la toolbar
                this.lastScrollTop = this.realScrollerRef.scrollTop + 10;
                this.showHideToolbar(this.realScrollerRef);
            }
        }
        if (!!changes.backgroundImgUrl || !!changes.hideBackgroundImg) {
            this.updateBgImage();
        }
    }
    updateBgImage() {
        const bg = this.hideBackgroundImg ? '' : `url(${this.backgroundImgUrl})`;
        this.el.nativeElement.style.setProperty('--bgImageUrl', bg);
        ['containerbackground', 'ptContainer', 'pctContainer', 'footerContainer', 'headerContainer', 'miniHeaderContainer', 'pc-toolbars'].forEach((e) => {
            for (const item of this.el.nativeElement.getElementsByClassName(e)) {
                item.style.backgroundImage = bg;
            }
        });
    }
    ngOnDestroy() {
        this.pageToolbarContainerObserver.unobserve(this.ptContainer.nativeElement);
        this.pageContentToolbarsContainerObserver.unobserve(this.pctContainer.nativeElement);
        this.pageFooterContainerObserver.unobserve(this.footerContainer.nativeElement);
        this.pageHeaderContainerObserver.unobserve(this.headerContainer.nativeElement);
        this.pageMiniHeaderContainerObserver.unobserve(this.miniHeaderContainer.nativeElement);
        if (this.realScrollerRef != null) {
            this.scrollerContainerObserver.unobserve(this.realScrollerRef === document ? this.realScrollerRef.scrollingElement : this.realScrollerRef);
        }
        this.disableContentScroll(false);
        this.hiddenSiiToolbar = false;
        this.siiPageScrolled = false;
    }
    ngAfterViewInit() {
        this.updateBgImage();
        this.pageToolbarContainerObserver.observe(this.ptContainer.nativeElement);
        this.pageContentToolbarsContainerObserver.observe(this.pctContainer.nativeElement);
        this.pageFooterContainerObserver.observe(this.footerContainer.nativeElement);
        this.pageHeaderContainerObserver.observe(this.headerContainer.nativeElement);
        this.pageMiniHeaderContainerObserver.observe(this.miniHeaderContainer.nativeElement);
        if (this.pageContentToolbarComponent.length > 0 && this.pageFiltersComponent) {
            Promise.resolve().then(() => {
                this.pageContentToolbarComponent.forEach(f => {
                    f.toggleFilterPanelRef = () => { this.toggleFiltersPanel(); };
                    f.filterPanelRef = this.pageFiltersComponent;
                });
            });
        }
        if (this.pageFiltersComponent) {
            this.pageContentToolbarComponent.changes.subscribe((res) => {
                res.filter(i => !i.filterPanelRef).forEach(f => {
                    f.toggleFilterPanelRef = () => { this.toggleFiltersPanel(); };
                    f.filterPanelRef = this.pageFiltersComponent;
                });
            });
            this.pageFiltersComponent.closeFilterPanelEmitter.subscribe(() => this.toggleFiltersPanel(false));
        }
        this.initScroller();
        this.fixLayout(true);
        Promise.resolve().then(() => {
            this.initialized = true;
        });
    }
    checkFooterVisibility(srcElement) {
        if (!srcElement) {
            return;
        }
        const prevVal = this.pageFooterContainerVisibleHeightSubj.value;
        this.pageFooterContainerVisibleHeightSubj.next(this.positiveOrZero(srcElement.clientHeight - this.footerContainer.nativeElement.getBoundingClientRect().top));
        const currVal = this.pageFooterContainerVisibleHeightSubj.value;
        if (prevVal !== currVal) {
            this.zone.run(() => {
                this.ref.detectChanges();
            });
        }
    }
    checkHeaderVisibility(srcElement) {
        const prevVal = this.pageHeaderContainerVisibleHeightSubj.value;
        this.pageHeaderContainerVisibleHeightSubj.next(this.headerContainer.nativeElement.getBoundingClientRect().height == 0 ? 0 :
            this.positiveOrZero(this.headerContainer.nativeElement.getBoundingClientRect().bottom - this.pageContentToolbarsContainerHeightSubj.value - this.pageToolbarContainerHeightSubj.value));
        const currVal = this.pageHeaderContainerVisibleHeightSubj.value;
        // this.siiHiddenHeader = currVal==0;
        if (prevVal !== currVal) {
            this.showMiniHeader = currVal <= this.pageMiniHeaderContainerHeightSubj.value;
            this.zone.run(() => {
                this.ref.detectChanges();
            });
        }
    }
    //  isScrolledToBottom(srcElement){
    //   //  console.log( Math.round(srcElement.clientHeight + srcElement.scrollTop) - (srcElement.scrollHeight - this.pageFooterContainerHeightSubj.value) );
    //    return Math.round(srcElement.clientHeight + srcElement.scrollTop) >= (srcElement.scrollHeight - this.pageFooterContainerHeightSubj.value) ;
    //  }
    showHideToolbar(srcElement) {
        this.siiPageScrolled = srcElement.scrollTop > 0;
        if (((new Date().getTime()) - this.lastToolbarVisibilityChangeTime < 200) &&
            ((this.siiPageScrolled && this.hiddenSiiToolbar) || (!this.siiPageScrolled && !this.hiddenSiiToolbar))) {
            return;
        }
        const st = srcElement.scrollTop;
        const siiToolbar = this.toolbarComponent !== undefined && this.toolbarComponent.autoHide ? this.toolbarComponent.el.nativeElement.clientHeight : 0;
        const siiFooter = this.footerComponent !== undefined ? this.footerComponent.el.nativeElement.clientHeight : 0;
        let siiContentToolbar = 0;
        // if (this.pageContentToolbarComponent2.length>0 ){
        this.pageContentToolbarComponent.filter(t => t.autoHide).forEach(t => siiContentToolbar += t.el.nativeElement.clientHeight);
        // siiContentToolbar = this.pageContentToolbarComponent.el.nativeElement.clientHeight;
        // }
        this.checkFooterVisibility(srcElement);
        this.checkHeaderVisibility(srcElement);
        const toolbarH = siiToolbar + siiFooter + siiContentToolbar + 20;
        if (Math.abs(this.lastScrollTop - st) <= 10 && st > toolbarH + 50) {
            return;
        }
        let toolbarVisibilityChange = false;
        if (st > this.lastScrollTop && st > toolbarH + 50) {
            // sto scrollando verso il basso di un altezza abbastanza grande da contenere la toolbar
            if (this.toolbarComponent && this.toolbarComponent.autoHide) {
                if (!this.hiddenSiiToolbar) {
                    toolbarVisibilityChange = true;
                    this.hiddenSiiToolbar = true;
                }
            }
            // if (this.pageContentToolbarComponent && this.pageContentToolbarComponent.autoHide){
            // this.pageContentToolbarComponent.filter(t => t.autoHide).forEach(t => t.el.nativeElement.style.display = 'none');
            this.pageContentToolbarComponent.filter(t => t.autoHide).forEach(t => {
                if (!t.el.nativeElement.classList.contains('hiddenToolbar')) {
                    toolbarVisibilityChange = true;
                    t.el.nativeElement.classList.add('hiddenToolbar');
                }
            });
            // this.pageContentToolbarComponent.el.nativeElement.style.display = 'none';
            // }
            this.lastScrollTop = st - toolbarH;
        }
        else if (st < this.lastScrollTop && (st < 10 || this.lastScrollTop - st > 50)) {
            // sono arrivato in cima oppure ho fatto uno scoll molto rapido
            // if(st + this.el.nativeElement.clientHeight < this.el.nativeElement.clientHeight) {
            if (this.toolbarComponent && this.toolbarComponent.autoHide) {
                if (this.hiddenSiiToolbar) {
                    toolbarVisibilityChange = true;
                    this.hiddenSiiToolbar = false;
                }
                // if (this.toolbarComponent.el.nativeElement.style.display === 'none'){
                //   toolbarVisibilityChange = true;
                //   this.toolbarComponent.el.nativeElement.style.display = '';
                // }
            }
            // this.pageContentToolbarComponent.filter(t => t.autoHide).forEach(t => t.el.nativeElement.style.display = '');
            this.pageContentToolbarComponent.filter(t => t.autoHide).forEach(t => {
                if (t.el.nativeElement.classList.contains('hiddenToolbar')) {
                    toolbarVisibilityChange = true;
                    t.el.nativeElement.classList.remove('hiddenToolbar');
                }
            });
            // if (this.pageContentToolbarComponent && this.pageContentToolbarComponent.autoHide){
            //   this.pageContentToolbarComponent.el.nativeElement.style.display = '';
            // }
            this.lastScrollTop = st;
            // }
        }
        else {
            this.lastScrollTop = st;
        }
        if (toolbarVisibilityChange) {
            this.emitToolbarHideEvent();
        }
    }
    emitToolbarHideEvent() {
        this.lastToolbarVisibilityChangeTime = new Date().getTime();
    }
    initScroller() {
        if ((this.toolbarComponent || this.pageContentToolbarComponent.length > 0) && this.autoHiddenToolbar === true) {
            if (this.scrollerRef !== undefined && this.scrollerRef.addEventListener !== undefined) {
                // l'elemento può essere scollato
                this.realScrollerRef = this.scrollerRef;
            }
            else if (this.scrollerRef !== undefined && this.scrollerRef.addEventListener === undefined &&
                this.scrollerRef.scrollerEl !== undefined) {
                this.realScrollerRef = this.scrollerRef.scrollerEl;
            }
            else {
                // this.realScrollerRef = this.pageContentComponent.el.nativeElement.getElementsByClassName('pc-body')[0];
                this.realScrollerRef = document;
            }
            this.subscribeScrollInterceptor();
            this.scrollerContainerObserver.observe(this.realScrollerRef === document ? this.realScrollerRef.scrollingElement : this.realScrollerRef);
            this.checkFooterVisibility(this.realScrollerRef === document ? this.realScrollerRef.scrollingElement : this.realScrollerRef);
            this.checkHeaderVisibility(this.realScrollerRef === document ? this.realScrollerRef.scrollingElement : this.realScrollerRef);
            this.emitToolbarHideEvent();
        }
    }
    subscribeScrollInterceptor() {
        if (this.pageContentComponent) {
            this.realScrollerRef.addEventListener('scroll', this.scrollFunctionRef, { capture: true, passive: true });
        }
    }
    toggleFiltersPanel(forceStatusVisible) {
        if (this.pageFiltersComponent) {
            if (forceStatusVisible != null) {
                if (forceStatusVisible && this.pageFiltersComponent.display !== 'block') {
                    this.showFiltersPanel();
                }
                else if (!forceStatusVisible && this.pageFiltersComponent.display === 'block') {
                    this.hideFiltersPanel();
                }
            }
            else {
                if (this.pageFiltersComponent.display === 'block') {
                    this.hideFiltersPanel();
                }
                else {
                    this.showFiltersPanel();
                }
            }
        }
    }
    toggleDetailPanel(forceStatusVisible) {
        if (this.pageDetailComponent) {
            if (forceStatusVisible != null) {
                if (forceStatusVisible && this.pageDetailComponent.display !== 'block') {
                    this.showDetailPanel();
                }
                else if (!forceStatusVisible && this.pageDetailComponent.display === 'block') {
                    this.hideDetailPanel();
                }
            }
            else {
                if (this.pageDetailComponent.display === 'block') {
                    this.hideDetailPanel();
                }
                else {
                    this.showDetailPanel();
                }
            }
        }
    }
    fixLayout(isInit = false) {
        if (this.pageDetailComponent && this.pageDetailComponent.display !== 'none') {
            this.showDetailPanel();
        }
        if (this.pageFiltersComponent) {
            if (isInit) {
                // tslint:disable-next-line:max-line-length
                const spaceAvailable = this.pageContentComponent.getMinWidthInPx() + this.pageFiltersComponent.el.nativeElement.clientWidth < this.el.nativeElement.offsetWidth;
                if (!spaceAvailable && this.pageFiltersComponent.display !== 'none') {
                    // il pannello dei filtri è visibile ma non c'è spazio
                    this.hideFiltersPanel();
                }
            }
            else if (this.pageFiltersComponent.display !== 'none') {
                this.showFiltersPanel();
            }
        }
    }
    showDetailPanel() {
        // delete $this.utils.style.detail.display;
        Promise.resolve().then(() => this.pageDetailComponent.display = 'block');
        // controllo che ci sia abbastanza spazio per mostrare sia il pannello dei filtri e sia il pannello del dettaglio
        const compW = this.el.nativeElement.offsetWidth;
        // larghezza attualmente visibile
        const fCw = this.pageFiltersComponent?.el.nativeElement.clientWidth || 0;
        let cCw = this.pageContentComponent.el.nativeElement.clientWidth;
        const dCw = this.pageDetailComponent.el.nativeElement.clientWidth;
        // $this.utils.components.detailPanel.removeClass("odcHoverFullScreen");//rimuovo se presente
        this.pageDetailComponent.hoverFullScreen(false);
        // larghezza effettiva quando il pannello del dettaglio è visibile
        const dw = this.pageDetailComponent.getRealWidth();
        const cw = this.pageContentComponent.getMinWidthInPx();
        // pannello dei filtri aperto e larghezza dettaglio da visibile maggiore della finestra => chiudo pannello filtri e
        // ricalcolo la larghezza visibile del contenitore
        if (fCw > 0 && cw + fCw + dw > compW) {
            this.toggleFiltersPanel(false);
            // safeApply();
            cCw = this.pageContentComponent.el.nativeElement.clientWidth;
        }
        // dettaglio + contenuto > finestra => apro in hover il dettaglio
        if (cw + dw > compW) {
            this.pageDetailComponent.hover(true);
            this.disableContentScroll(true);
            // $this.utils.components.detailPanel.addClass("odcHover");
            if (compW - dw < 200) {
                // se la dimensione del contenitore è troppo piccola, metto il pannello del dettaglio al 100%
                this.pageDetailComponent.hoverFullScreen(true);
                // $this.utils.components.detailPanel.addClass("odcHoverFullScreen");
            }
            this.showHideDetailHoverMask(true);
        }
        else {
            this.pageDetailComponent.hover(this.pageDetailComponent.alwaysHover ? true : false);
            // $this.utils.components.detailPanel.removeClass("odcHover");
            this.showHideDetailHoverMask(this.pageDetailComponent.alwaysHover ? true : false);
            this.disableContentScroll(this.pageDetailComponent.alwaysHover ? true : false);
        }
    }
    hideDetailPanel() {
        // $this.utils.style.detail.display='none';
        Promise.resolve().then(() => this.pageDetailComponent.display = 'none');
        this.pageDetailComponent.hover(false);
        this.pageDetailComponent.hoverFullScreen(false);
        this.disableContentScroll(false);
        this.showHideDetailHoverMask(false);
    }
    showHideDetailHoverMask(vis) {
        // if($this.utils.components.component!=undefined){
        Promise.resolve().then(() => this.detailHoverMask.display = vis ? 'block' : 'none');
        //  vis? $this.utils.components.component.addClass("odcHoverMask") : $this.utils.components.component.removeClass("odcHoverMask")
        // }
    }
    showFiltersPanel() {
        // delete $this.utils.style.filters.display;
        Promise.resolve().then(() => this.pageFiltersComponent.display = 'block');
        this.toggleFilterPanel.emit(true);
        // controllo che ci sia abbastanza spazio per mostrare sia il pannello dei filtri e sia il pannello del dettaglio
        const compW = this.el.nativeElement.offsetWidth;
        // larghezza attualmente visibile
        const fCw = this.pageFiltersComponent.el.nativeElement.clientWidth;
        const cCw = this.pageContentComponent.el.nativeElement.clientWidth;
        const dCw = this.pageDetailComponent?.el.nativeElement.clientWidth || 0;
        const cw = this.pageContentComponent.getMinWidthInPx();
        this.pageFiltersComponent.hoverFullScreen(false);
        // // larghezza effettiva quando il pannello dei filtri  è visibile
        const fw = this.pageFiltersComponent.getRealWidth();
        if (cw + dCw + fw > compW) {
            // mostro il pannello dei filtri in hover
            this.pageFiltersComponent.hover(true);
            this.disableContentScroll(true);
            if (compW - fw < 200) {
                // se la dimensione del contenitore è troppo piccola, metto il pannello del dettaglio al 100%
                this.pageFiltersComponent.hoverFullScreen(true);
            }
            this.showHideFiltersHoverMask(true);
        }
        else {
            this.pageFiltersComponent.hover(false);
            this.disableContentScroll(false);
            this.showHideFiltersHoverMask(false);
        }
    }
    showHideFiltersHoverMask(vis) {
        // if($this.utils.components.component!=undefined){
        Promise.resolve().then(() => this.filterHoverMask.display = vis ? 'block' : 'none');
        //  vis? $this.utils.components.component.addClass("odcHoverMask") : $this.utils.components.component.removeClass("odcHoverMask")
        // }
    }
    hideFiltersPanel() {
        Promise.resolve().then(() => this.pageFiltersComponent.display = 'none');
        this.toggleFilterPanel.emit(false);
        // if($this.utils.components.filtersPanel!=undefined){.
        this.pageFiltersComponent.hover(false);
        this.disableContentScroll(false);
        this.pageFiltersComponent.hoverFullScreen(false);
        // }
        this.showHideFiltersHoverMask(false);
    }
    getRealWidth() {
        return parseInt(getComputedStyle(this.el.nativeElement, null).width.replace('px', ''), 10);
    }
    detailHoverMaskClick() {
        this.clickOutsideDetail.emit();
    }
    filterHoverMaskClick() {
        this.hideFiltersPanel();
    }
    toolbarsHeightChange() {
        // this.toolbarsHeight = this.pctb.nativeElement.offsetHeight;
        this.zone.run(() => {
            this.ref.detectChanges();
            window.dispatchEvent(new CustomEvent('pageContainerToolbarsHeightChange'));
        });
    }
    disableContentScroll(enable) {
        document.getElementsByTagName('html')[0].style.overflow = enable ? 'hidden' : '';
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: SiiPageContainerComponent, deps: [{ token: i0.ElementRef }, { token: i0.ChangeDetectorRef }, { token: i1$4.DomSanitizer }, { token: i0.NgZone }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "18.2.13", type: SiiPageContainerComponent, isStandalone: true, selector: "sii-page-container", inputs: { autoHiddenToolbar: "autoHiddenToolbar", scrollerRef: "scrollerRef", backgroundImgUrl: "backgroundImgUrl", hideBackgroundImg: "hideBackgroundImg", backgroundClass: "backgroundClass" }, outputs: { clickOutsideDetail: "clickOutsideDetail", toggleFilterPanel: "toggleFilterPanel" }, host: { listeners: { "window:resize": "onResize($event)" }, properties: { "style.--toolbarHeight": "this.toolbarHeight", "style.--pageContentToolbarsContainerHeight": "this.pageContentToolbarsContainerHeightVal", "style.--fixedToolbarHeight": "this.fixedToolbarHeight", "style.--footerHeight": "this.footerHeight", "style.--headerHeight": "this.headeHeight", "class.hiddenSiiToolbar": "this.hiddenSiiToolbar", "class.siiPageScrolled": "this.siiPageScrolled", "class.siiInitialized": "this.initialized" } }, queries: [{ propertyName: "pageFiltersComponent", first: true, predicate: PageFiltersComponent, descendants: true }, { propertyName: "pageDetailComponent", first: true, predicate: PageDetailComponent, descendants: true }, { propertyName: "pageContentComponent", first: true, predicate: PageContentComponent, descendants: true }, { propertyName: "toolbarComponent", first: true, predicate: ToolbarComponent, descendants: true }, { propertyName: "footerComponent", first: true, predicate: PageFooterDirective, descendants: true }, { propertyName: "pageContentToolbarComponent", predicate: PageContentToolbarComponent, descendants: true }], viewQueries: [{ propertyName: "filterHoverMask", first: true, predicate: ["FILTERHOVERMASK"], descendants: true }, { propertyName: "detailHoverMask", first: true, predicate: ["DETAILHOVERMASK"], descendants: true }, { propertyName: "ptContainer", first: true, predicate: ["ptContainer"], descendants: true }, { propertyName: "pctContainer", first: true, predicate: ["pctContainer"], descendants: true }, { propertyName: "footerContainer", first: true, predicate: ["footerContainer"], descendants: true }, { propertyName: "headerContainer", first: true, predicate: ["headerContainer"], descendants: true }, { propertyName: "miniHeaderContainer", first: true, predicate: ["miniHeaderContainer"], descendants: true }], usesOnChanges: true, ngImport: i0, template: "\r\n<div #ptContainer class=\"ptContainer\" (cdkObserveContent)=\"toolbarsHeightChange()\">\r\n  <ng-content select=\"sii-toolbar\"></ng-content>\r\n</div>\r\n<div #pctContainer class=\"pctContainer\" (cdkObserveContent)=\"toolbarsHeightChange()\">\r\n  <ng-content select=\"sii-page-content-toolbar\"></ng-content>\r\n</div>\r\n<div class=\"containerbackground\"  [ngClass]=\"backgroundClass\"></div>\r\n\r\n\r\n<!-- HEADERS -->\r\n<div #miniHeaderContainer class=\"miniHeaderContainer\" [style.visibility]=\"showMiniHeader ? 'visible':'hidden'\" [style.top.px]=\"((pageToolbarContainerHeight | async) + (pageContentToolbarsContainerHeight | async) )\">\r\n  <ng-content select=\"[siiPageMiniHeader]\"></ng-content>\r\n</div>\r\n\r\n<div #headerContainer class=\"headerContainer\" (cdkObserveContent)=\"toolbarsHeightChange()\" [style.marginTop.px]=\"((pageFixedToolbarContainerHeight | async) + (pageFixedContentToolbarsContainerHeight | async) )\">\r\n  <ng-content select=\"[siiPageHeader]\"></ng-content>\r\n</div>\r\n<!-- HEADERS fine -->\r\n\r\n<div class=\"pc_container\" >\r\n\r\n <!-- FILTER PANEL -->\r\n <div class=\"pageFilterContentBox\" [style.top.px]=\"((pageToolbarContainerHeight | async) + (pageContentToolbarsContainerHeight | async) +   (showMiniHeader ? (pageMiniHeaderContainerHeight | async):(pageHeaderContainerVisibleHeight | async)))\"\r\n [style.height]=\"sanitizer.bypassSecurityTrustStyle('calc(100vh - '+( (pageToolbarContainerHeight | async) + (pageContentToolbarsContainerHeight | async) +  (pageFooterContainerVisibleHeight | async)   + (showMiniHeader ? (pageMiniHeaderContainerHeight | async):(pageHeaderContainerVisibleHeight | async)) )+'px)')\" >\r\n <ng-content select=\"sii-page-filters\"></ng-content>\r\n</div>\r\n<!-- FILTER PANEL fine -->\r\n\r\n  <!-- CONTENT PANEL -->\r\n  <ng-content select=\"sii-page-content\"></ng-content>\r\n  <!-- CONTENT PANEL fine-->\r\n\r\n\r\n  <!-- DETAIL PANEL -->\r\n  <div class=\"pageDetailContentBox\" [style.top.px]=\"((pageToolbarContainerHeight | async) + (pageContentToolbarsContainerHeight | async) + (showMiniHeader ? (pageMiniHeaderContainerHeight | async):(pageHeaderContainerVisibleHeight | async)))\"\r\n  [style.height]=\"sanitizer.bypassSecurityTrustStyle('calc(100vh - '+( (pageToolbarContainerHeight | async) + (pageContentToolbarsContainerHeight | async) + (pageFooterContainerVisibleHeight | async)   +(showMiniHeader ? (pageMiniHeaderContainerHeight | async):(pageHeaderContainerVisibleHeight | async))  )+'px)')\" >\r\n  <ng-content select=\"sii-page-detail\"></ng-content>\r\n</div>\r\n<!-- DETAIL PANEL fine-->\r\n\r\n\r\n  <!-- HOVER MASK -->\r\n  <sii-page-hover-mask #DETAILHOVERMASK style=\"z-index: 3;\" class=\"sii-page-hover-mask\" (click)=\"detailHoverMaskClick()\"></sii-page-hover-mask>\r\n  <sii-page-hover-mask #FILTERHOVERMASK style=\"z-index: 2;\" class=\"sii-page-hover-mask\" (click)=\"filterHoverMaskClick()\"></sii-page-hover-mask>\r\n  <!-- HOVER MASK fine-->\r\n\r\n  <!-- FOOTER -->\r\n  <div #footerContainer class=\"footerContainer\" (cdkObserveContent)=\"toolbarsHeightChange()\">\r\n    <ng-content select=\"[siiPageFooter]\"></ng-content>\r\n  </div>\r\n  <!-- FOOTER fine-->\r\n</div>\r\n\r\n\r\n", styles: [":host{display:flex;flex-direction:column;min-height:100vh;position:relative;background-color:#2a2b38}:host ::ng-deep>sii-page-content-toolbar{z-index:804}:host:not(.siiInitialized) .ptContainer,:host:not(.siiInitialized) .pctContainer,:host:not(.siiInitialized) .footerContainer,:host:not(.siiInitialized) .headerContainer,:host:not(.siiInitialized) .miniHeaderContainer,:host:not(.siiInitialized) .pc_container,:host:not(.siiInitialized) .pc_container ::ng-deep{visibility:hidden!important}:host:not(.siiInitialized) ::ng-deep .pf_content{display:none}.containerbackground{position:absolute;width:100%;height:100%;background-size:cover;background-repeat:no-repeat;background-image:linear-gradient(-186.39deg,#090909 -7.89%,#161721 26.77%,#000 59.41%,#323551 94.42%);background-attachment:fixed}@media screen and (max-width: 576px){:host .ptContainer,:host .pctContainer,:host .footerContainer,:host .miniHeaderContainer,:host ::ng-deep .pc-toolbars{background-image:none!important;-webkit-backdrop-filter:blur(12px) brightness(.75)!important;backdrop-filter:blur(12px) brightness(.75)!important}}:host::ng-deep sii-toolbar{z-index:804}.ptContainer{position:fixed;top:0;width:calc(100% - var(--safe-area-inset-right) - var(--safe-area-inset-left));background-size:cover;background-repeat:no-repeat;background-color:#2a2b38;background-attachment:fixed;z-index:5}.pctContainer{position:fixed;top:var(--toolbarHeight);width:calc(100% - var(--safe-area-inset-right) - var(--safe-area-inset-left));background-size:cover;background-repeat:no-repeat;background-image:linear-gradient(-186.39deg,#090909 -7.89%,#161721 26.77%,#000 59.41%,#323551 94.42%);background-attachment:fixed;z-index:2}.footerContainer{position:absolute;bottom:0;left:0;width:100%;background-size:cover;background-repeat:no-repeat;background-image:linear-gradient(-186.39deg,#090909 -7.89%,#161721 26.77%,#000 59.41%,#323551 94.42%);background-attachment:fixed;z-index:2}.headerContainer{width:100%;background-size:cover;background-repeat:no-repeat;background-image:linear-gradient(-186.39deg,#090909 -7.89%,#161721 26.77%,#000 59.41%,#323551 94.42%);background-attachment:fixed;z-index:1}.miniHeaderContainer{position:fixed;z-index:2;background-size:cover;background-repeat:no-repeat;background-image:linear-gradient(-186.39deg,#090909 -7.89%,#161721 26.77%,#000 59.41%,#323551 94.42%);background-attachment:fixed;width:100%}.pc_container{display:flex}.pc_container .pageDetailContentBox{position:sticky;z-index:4}.pc_container .pageDetailContentBox ::ng-deep sii-page-detail{overscroll-behavior:contain;overflow:auto;height:100%}.pc_container .pageFilterContentBox{position:sticky;z-index:3}.pc_container .pageFilterContentBox ::ng-deep sii-page-filters{height:100%}:host.hiddenSiiToolbar::ng-deep sii-toolbar,:host::ng-deep sii-page-content-toolbar.hiddenToolbar{display:none}:host::ng-deep>.pctContainer sii-page-content-toolbar .pct_container_filterButton{display:none}:host .pctContainer::ng-deep sii-page-content-toolbar .pct_container{margin:0 auto;width:100%}.pc_container{width:100%;margin-left:auto;margin-right:auto}@media screen and (min-width: 1440px){:host .pctContainer::ng-deep sii-page-content-toolbar .pct_container,.pc_container{width:1320px}}@media screen and (min-width: 1600px){:host .pctContainer::ng-deep sii-page-content-toolbar .pct_container,.pc_container{width:1450px}}@media screen and (min-width: 1920px){:host .pctContainer::ng-deep sii-page-content-toolbar .pct_container,.pc_container{width:1610px}}:host::ng-deep [siipagefooter]{z-index:0;display:block}:host::ng-deep .pc-body{margin-bottom:var(--footerHeight)}\n"], dependencies: [{ kind: "directive", type: CdkObserveContent, selector: "[cdkObserveContent]", inputs: ["cdkObserveContentDisabled", "debounce"], outputs: ["cdkObserveContent"], exportAs: ["cdkObserveContent"] }, { kind: "directive", type: NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "component", type: PageHoverMaskComponent, selector: "sii-page-hover-mask" }, { kind: "pipe", type: AsyncPipe, name: "async" }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: SiiPageContainerComponent, decorators: [{
            type: Component,
            args: [{ selector: 'sii-page-container', standalone: true, imports: [
                        CdkObserveContent,
                        NgClass,
                        PageHoverMaskComponent,
                        AsyncPipe,
                    ], template: "\r\n<div #ptContainer class=\"ptContainer\" (cdkObserveContent)=\"toolbarsHeightChange()\">\r\n  <ng-content select=\"sii-toolbar\"></ng-content>\r\n</div>\r\n<div #pctContainer class=\"pctContainer\" (cdkObserveContent)=\"toolbarsHeightChange()\">\r\n  <ng-content select=\"sii-page-content-toolbar\"></ng-content>\r\n</div>\r\n<div class=\"containerbackground\"  [ngClass]=\"backgroundClass\"></div>\r\n\r\n\r\n<!-- HEADERS -->\r\n<div #miniHeaderContainer class=\"miniHeaderContainer\" [style.visibility]=\"showMiniHeader ? 'visible':'hidden'\" [style.top.px]=\"((pageToolbarContainerHeight | async) + (pageContentToolbarsContainerHeight | async) )\">\r\n  <ng-content select=\"[siiPageMiniHeader]\"></ng-content>\r\n</div>\r\n\r\n<div #headerContainer class=\"headerContainer\" (cdkObserveContent)=\"toolbarsHeightChange()\" [style.marginTop.px]=\"((pageFixedToolbarContainerHeight | async) + (pageFixedContentToolbarsContainerHeight | async) )\">\r\n  <ng-content select=\"[siiPageHeader]\"></ng-content>\r\n</div>\r\n<!-- HEADERS fine -->\r\n\r\n<div class=\"pc_container\" >\r\n\r\n <!-- FILTER PANEL -->\r\n <div class=\"pageFilterContentBox\" [style.top.px]=\"((pageToolbarContainerHeight | async) + (pageContentToolbarsContainerHeight | async) +   (showMiniHeader ? (pageMiniHeaderContainerHeight | async):(pageHeaderContainerVisibleHeight | async)))\"\r\n [style.height]=\"sanitizer.bypassSecurityTrustStyle('calc(100vh - '+( (pageToolbarContainerHeight | async) + (pageContentToolbarsContainerHeight | async) +  (pageFooterContainerVisibleHeight | async)   + (showMiniHeader ? (pageMiniHeaderContainerHeight | async):(pageHeaderContainerVisibleHeight | async)) )+'px)')\" >\r\n <ng-content select=\"sii-page-filters\"></ng-content>\r\n</div>\r\n<!-- FILTER PANEL fine -->\r\n\r\n  <!-- CONTENT PANEL -->\r\n  <ng-content select=\"sii-page-content\"></ng-content>\r\n  <!-- CONTENT PANEL fine-->\r\n\r\n\r\n  <!-- DETAIL PANEL -->\r\n  <div class=\"pageDetailContentBox\" [style.top.px]=\"((pageToolbarContainerHeight | async) + (pageContentToolbarsContainerHeight | async) + (showMiniHeader ? (pageMiniHeaderContainerHeight | async):(pageHeaderContainerVisibleHeight | async)))\"\r\n  [style.height]=\"sanitizer.bypassSecurityTrustStyle('calc(100vh - '+( (pageToolbarContainerHeight | async) + (pageContentToolbarsContainerHeight | async) + (pageFooterContainerVisibleHeight | async)   +(showMiniHeader ? (pageMiniHeaderContainerHeight | async):(pageHeaderContainerVisibleHeight | async))  )+'px)')\" >\r\n  <ng-content select=\"sii-page-detail\"></ng-content>\r\n</div>\r\n<!-- DETAIL PANEL fine-->\r\n\r\n\r\n  <!-- HOVER MASK -->\r\n  <sii-page-hover-mask #DETAILHOVERMASK style=\"z-index: 3;\" class=\"sii-page-hover-mask\" (click)=\"detailHoverMaskClick()\"></sii-page-hover-mask>\r\n  <sii-page-hover-mask #FILTERHOVERMASK style=\"z-index: 2;\" class=\"sii-page-hover-mask\" (click)=\"filterHoverMaskClick()\"></sii-page-hover-mask>\r\n  <!-- HOVER MASK fine-->\r\n\r\n  <!-- FOOTER -->\r\n  <div #footerContainer class=\"footerContainer\" (cdkObserveContent)=\"toolbarsHeightChange()\">\r\n    <ng-content select=\"[siiPageFooter]\"></ng-content>\r\n  </div>\r\n  <!-- FOOTER fine-->\r\n</div>\r\n\r\n\r\n", styles: [":host{display:flex;flex-direction:column;min-height:100vh;position:relative;background-color:#2a2b38}:host ::ng-deep>sii-page-content-toolbar{z-index:804}:host:not(.siiInitialized) .ptContainer,:host:not(.siiInitialized) .pctContainer,:host:not(.siiInitialized) .footerContainer,:host:not(.siiInitialized) .headerContainer,:host:not(.siiInitialized) .miniHeaderContainer,:host:not(.siiInitialized) .pc_container,:host:not(.siiInitialized) .pc_container ::ng-deep{visibility:hidden!important}:host:not(.siiInitialized) ::ng-deep .pf_content{display:none}.containerbackground{position:absolute;width:100%;height:100%;background-size:cover;background-repeat:no-repeat;background-image:linear-gradient(-186.39deg,#090909 -7.89%,#161721 26.77%,#000 59.41%,#323551 94.42%);background-attachment:fixed}@media screen and (max-width: 576px){:host .ptContainer,:host .pctContainer,:host .footerContainer,:host .miniHeaderContainer,:host ::ng-deep .pc-toolbars{background-image:none!important;-webkit-backdrop-filter:blur(12px) brightness(.75)!important;backdrop-filter:blur(12px) brightness(.75)!important}}:host::ng-deep sii-toolbar{z-index:804}.ptContainer{position:fixed;top:0;width:calc(100% - var(--safe-area-inset-right) - var(--safe-area-inset-left));background-size:cover;background-repeat:no-repeat;background-color:#2a2b38;background-attachment:fixed;z-index:5}.pctContainer{position:fixed;top:var(--toolbarHeight);width:calc(100% - var(--safe-area-inset-right) - var(--safe-area-inset-left));background-size:cover;background-repeat:no-repeat;background-image:linear-gradient(-186.39deg,#090909 -7.89%,#161721 26.77%,#000 59.41%,#323551 94.42%);background-attachment:fixed;z-index:2}.footerContainer{position:absolute;bottom:0;left:0;width:100%;background-size:cover;background-repeat:no-repeat;background-image:linear-gradient(-186.39deg,#090909 -7.89%,#161721 26.77%,#000 59.41%,#323551 94.42%);background-attachment:fixed;z-index:2}.headerContainer{width:100%;background-size:cover;background-repeat:no-repeat;background-image:linear-gradient(-186.39deg,#090909 -7.89%,#161721 26.77%,#000 59.41%,#323551 94.42%);background-attachment:fixed;z-index:1}.miniHeaderContainer{position:fixed;z-index:2;background-size:cover;background-repeat:no-repeat;background-image:linear-gradient(-186.39deg,#090909 -7.89%,#161721 26.77%,#000 59.41%,#323551 94.42%);background-attachment:fixed;width:100%}.pc_container{display:flex}.pc_container .pageDetailContentBox{position:sticky;z-index:4}.pc_container .pageDetailContentBox ::ng-deep sii-page-detail{overscroll-behavior:contain;overflow:auto;height:100%}.pc_container .pageFilterContentBox{position:sticky;z-index:3}.pc_container .pageFilterContentBox ::ng-deep sii-page-filters{height:100%}:host.hiddenSiiToolbar::ng-deep sii-toolbar,:host::ng-deep sii-page-content-toolbar.hiddenToolbar{display:none}:host::ng-deep>.pctContainer sii-page-content-toolbar .pct_container_filterButton{display:none}:host .pctContainer::ng-deep sii-page-content-toolbar .pct_container{margin:0 auto;width:100%}.pc_container{width:100%;margin-left:auto;margin-right:auto}@media screen and (min-width: 1440px){:host .pctContainer::ng-deep sii-page-content-toolbar .pct_container,.pc_container{width:1320px}}@media screen and (min-width: 1600px){:host .pctContainer::ng-deep sii-page-content-toolbar .pct_container,.pc_container{width:1450px}}@media screen and (min-width: 1920px){:host .pctContainer::ng-deep sii-page-content-toolbar .pct_container,.pc_container{width:1610px}}:host::ng-deep [siipagefooter]{z-index:0;display:block}:host::ng-deep .pc-body{margin-bottom:var(--footerHeight)}\n"] }]
        }], ctorParameters: () => [{ type: i0.ElementRef }, { type: i0.ChangeDetectorRef }, { type: i1$4.DomSanitizer }, { type: i0.NgZone }], propDecorators: { clickOutsideDetail: [{
                type: Output
            }], toggleFilterPanel: [{
                type: Output
            }], autoHiddenToolbar: [{
                type: Input
            }], scrollerRef: [{
                type: Input
            }], backgroundImgUrl: [{
                type: Input
            }], hideBackgroundImg: [{
                type: Input
            }], backgroundClass: [{
                type: Input
            }], toolbarHeight: [{
                type: HostBinding,
                args: ['style.--toolbarHeight']
            }], pageContentToolbarsContainerHeightVal: [{
                type: HostBinding,
                args: ['style.--pageContentToolbarsContainerHeight']
            }], fixedToolbarHeight: [{
                type: HostBinding,
                args: ['style.--fixedToolbarHeight']
            }], footerHeight: [{
                type: HostBinding,
                args: ['style.--footerHeight']
            }], headeHeight: [{
                type: HostBinding,
                args: ['style.--headerHeight']
            }], filterHoverMask: [{
                type: ViewChild,
                args: ['FILTERHOVERMASK']
            }], detailHoverMask: [{
                type: ViewChild,
                args: ['DETAILHOVERMASK']
            }], pageFiltersComponent: [{
                type: ContentChild,
                args: [PageFiltersComponent]
            }], pageDetailComponent: [{
                type: ContentChild,
                args: [PageDetailComponent]
            }], pageContentComponent: [{
                type: ContentChild,
                args: [PageContentComponent]
            }], pageContentToolbarComponent: [{
                type: ContentChildren,
                args: [PageContentToolbarComponent, { descendants: true }]
            }], toolbarComponent: [{
                type: ContentChild,
                args: [ToolbarComponent]
            }], footerComponent: [{
                type: ContentChild,
                args: [PageFooterDirective]
            }], ptContainer: [{
                type: ViewChild,
                args: ['ptContainer', { static: false }]
            }], pctContainer: [{
                type: ViewChild,
                args: ['pctContainer', { static: false }]
            }], footerContainer: [{
                type: ViewChild,
                args: ['footerContainer', { static: false }]
            }], headerContainer: [{
                type: ViewChild,
                args: ['headerContainer', { static: false }]
            }], miniHeaderContainer: [{
                type: ViewChild,
                args: ['miniHeaderContainer', { static: false }]
            }], hiddenSiiToolbar: [{
                type: HostBinding,
                args: ['class.hiddenSiiToolbar']
            }], siiPageScrolled: [{
                type: HostBinding,
                args: ['class.siiPageScrolled']
            }], initialized: [{
                type: HostBinding,
                args: ['class.siiInitialized']
            }], onResize: [{
                type: HostListener,
                args: ['window:resize', ['$event']]
            }] } });

class GlobalMenuComponent {
    get menus() {
        return this.globalMenuService.menu;
    }
    get company() {
        return this.globalMenuService.selectedCompany.value;
    }
    constructor(globalMenuService, matDialog) {
        this.globalMenuService = globalMenuService;
        this.matDialog = matDialog;
        this.showCloseButton = true;
        this.closeAction = new EventEmitter();
        this.linkManager = new SIILinkManager();
        this.searchFilter = '';
        this.globalMenuService.initMenu();
    }
    close() {
        this.closeAction.next();
    }
    onLinkClicked(voice, openInThisWindow = false) {
        if (!voice.companyDep) { // if there is no reason to choose the company the link refers to
            this.linkManager.openLink(voice, openInThisWindow);
        }
        else if (voice.companies.length === 1 && (this.company === null || this.company === '')) {
            this.linkManager.openLink(voice, openInThisWindow, voice.companies[0]);
        }
        else if (!this.company) {
            this.matDialog.open(CompanySelectionDialogComponent, {
                maxWidth: '95vw',
                data: {
                    companies: voice.companies.map(c => this.globalMenuService.menuUserInfo.companies[c]),
                    title: voice.title
                },
            }).afterClosed().subscribe(companyIdSelected => {
                if (companyIdSelected) {
                    this.linkManager.openLink(voice, openInThisWindow, companyIdSelected);
                }
            });
        }
        else {
            this.linkManager.openLink(voice, openInThisWindow, this.company);
        }
    }
    reset() {
        this.searchFilter = '';
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: GlobalMenuComponent, deps: [{ token: GlobalMenuService }, { token: i1$2.MatDialog }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "18.2.13", type: GlobalMenuComponent, isStandalone: true, selector: "sii-global-menu", inputs: { showCloseButton: "showCloseButton" }, outputs: { closeAction: "closeAction" }, ngImport: i0, template: "<sii-page-container>\r\n  <sii-toolbar toolbarTitle=\"SIAL\"  [showCloseButton]=\"showCloseButton\" (closeAction)=\"close()\"></sii-toolbar>\r\n  <sii-page-content [bodyStyle]=\"'padding:0px'\" bodyClass=\"globalMenuBody\">\r\n    <sii-page-content-toolbar>\r\n      <div class=\"page-content-toolbar-body\">\r\n        <mat-form-field class=\"menu_filter\" appearance=\"outline\">\r\n          <input #searchBox  [(ngModel)]=\"searchFilter\" matInput placeholder=\"Search on menu\">\r\n          @if (!searchBox.value) {\r\n            <mat-icon matSuffix>search</mat-icon>\r\n          }\r\n          @if (searchBox.value) {\r\n            <mat-icon matSuffix   aria-label=\"Clear\" (click)=\"reset()\" style=\"cursor: pointer;\">close</mat-icon>\r\n          }\r\n        </mat-form-field>\r\n\r\n        <span [style.flex]=\"1\"></span>\r\n        <sii-company-selection></sii-company-selection>\r\n      </div>\r\n    </sii-page-content-toolbar>\r\n    <sii-company-selection class=\"bodyCompanySelection\"></sii-company-selection>\r\n\r\n\r\n    <div class=\"masonry-wrapper\"  >\r\n      <div class=\"masonry\">\r\n\r\n        <!-- PREFERITI -->\r\n        <!-- *ngIf=\"(globalMenuService.favoriteVoices | async)?.length>0\" -->\r\n        <div class=\"masonry-item preferiti-menu\" >\r\n          <div class=\"category-title\">\r\n            <mat-icon>star</mat-icon>\r\n            <span>Preferiti</span>\r\n          </div>\r\n          <mat-nav-list dense disableRipple=\"true\">\r\n            @for (favVoice of globalMenuService.favoriteVoice | async | globalMenuVoicesFilter:company:searchFilter ; track favVoice; let i = $index) {\r\n              <!-- *ngIf=\"globalMenuService.isEnabledForCurrentSelectedCompany(favVoice,company)\"  -->\r\n              <mat-list-item  (click)=\"onLinkClicked(favVoice)\">\r\n                <div class=\"menu-voice\"  > {{favVoice.title}} </div>\r\n                <button mat-icon-button class=\"submenu\" [matMenuTriggerFor]=\"submenu\" (click)=\"$event.stopPropagation()\">\r\n                  <mat-icon>more_vert</mat-icon>\r\n                </button>\r\n                <mat-menu #submenu=\"matMenu\">\r\n                  <button mat-menu-item (click)=\"globalMenuService.removeFromFavorites(favVoice, i)\">\r\n                    <mat-icon>star_border</mat-icon>\r\n                    <span class=\"font12\" i18n=\"@@removeFavorites\">Remove from favorites</span>\r\n                  </button>\r\n                  <button mat-menu-item  (click)=\"onLinkClicked(favVoice,true)\">\r\n                    <mat-icon>launch</mat-icon>\r\n                    <span class=\"font12\" i18n=\"@@openThisWindow\">Open in this window</span>\r\n                  </button>\r\n                </mat-menu>\r\n              </mat-list-item>\r\n            }\r\n\r\n          </mat-nav-list>\r\n        </div>\r\n\r\n\r\n        @for (menu of (menus | async) | globalMenuFilter:company:searchFilter; track menu) {\r\n          <div class=\"masonry-item\">\r\n            <div class=\"category-title\">\r\n              <mat-icon [svgIcon]=\"menu.icon\"></mat-icon>\r\n              <span>{{menu.category}}</span>\r\n            </div>\r\n            <mat-nav-list dense disableRipple=\"true\">\r\n              @for (voice of menu.voices  ; track voice) {\r\n                <mat-list-item   (click)=\"onLinkClicked(voice)\" >\r\n                  <div class=\"menu-voice\"> {{voice.title}} </div>\r\n                  <button mat-icon-button class=\"submenu\" [matMenuTriggerFor]=\"submenu\" (click)=\"$event.stopPropagation()\">\r\n                    <mat-icon i18n-matTooltip=\"@@openSubmenu\" matTooltip=\"Open Submenu\">more_vert</mat-icon>\r\n                  </button>\r\n                  <mat-menu #submenu=\"matMenu\">\r\n                    <button mat-menu-item [disabled]=\"globalMenuService.isInFavorites(voice)\"  (click)=\"globalMenuService.addToFavorites(voice)\">\r\n                      <mat-icon>star_border</mat-icon>\r\n                      <span class=\"font12\" i18n=\"@@addFavorites\">Add to favorites</span>\r\n                    </button>\r\n                    <button mat-menu-item  (click)=\"onLinkClicked(voice,true)\">\r\n                      <mat-icon>launch</mat-icon>\r\n                      <span class=\"font12\" i18n=\"@@openThisWindow\">Open in this window</span>\r\n                    </button>\r\n                  </mat-menu>\r\n                </mat-list-item>\r\n              }\r\n            </mat-nav-list>\r\n          </div>\r\n        }\r\n      </div>\r\n    </div>\r\n\r\n\r\n\r\n  </sii-page-content>\r\n</sii-page-container>\r\n", styles: [":host{right:0;top:0;position:absolute;width:100vw;height:100vh;z-index:11}sii-page-content{background-color:#f6f7f8;color:#000}.page-content-toolbar-body{padding:0 10px;display:flex;flex:1 1 100%}sii-sdac-preview{margin:10px!important}.masonry-wrapper{margin:0!important;flex:1 1 auto;overflow:auto}.masonry{columns:1;column-gap:30px;position:relative;padding:0 10px}.masonry-item{display:inline-block;vertical-align:top;margin:15px 0;width:100%;background-color:#fff;box-shadow:0 1px 3px #0003}.category-title{color:#427f9f;display:flex;align-items:center;padding:10px;letter-spacing:.36px;font-size:18px}.preferiti-menu .category-title{color:#c51b88}.category-title mat-icon{padding-right:10px}.menu-voice{flex:1;overflow:hidden;text-overflow:ellipsis;font-size:14px;line-height:14px;letter-spacing:.43px}.submenu{display:none;margin-right:-16px}mat-list-item:hover .submenu{display:inline-block}.menu_filter input{font-size:17px;line-height:43px;color:#000;margin-top:5px}mat-form-field.menu_filter::ng-deep .mat-form-field-infix{padding:0;border:0}mat-form-field.menu_filter::ng-deep .mat-form-field-wrapper{margin:0;padding:0}mat-form-field.menu_filter::ng-deep .mat-form-field-suffix{top:-7px;color:#0009}mat-form-field.menu_filter::ng-deep .mat-form-field-flex:hover .mat-form-field-outline,mat-form-field.menu_filter::ng-deep .mat-form-field-outline{background-color:#fff;border-radius:5px}.bodyCompanySelection{display:none;margin:10px!important}::ng-deep .globalMenuBody{flex-direction:row-reverse}@media only screen and (max-width: 500px){.menu_filter{flex:1 1 100%}.page-content-toolbar-body sii-company-selection{display:none}.bodyCompanySelection{display:block}}@media only screen and (max-width: 840px){::ng-deep .globalMenuBody{flex-direction:column}::ng-deep .globalMenuBody .masonry-wrapper{overflow:unset}}@media only screen and (min-width: 700px) and (max-width: 840px){.masonry{columns:2}}@media only screen and (min-width: 841px) and (max-width: 1090px){.masonry{columns:2}.masonry-wrapper.withSdac .masonry{columns:1}}@media only screen and (min-width: 1091px) and (max-width: 1340px){.masonry{columns:3}.masonry-wrapper.withSdac .masonry{columns:2}}@media only screen and (min-width: 1341px) and (max-width: 1590px){.masonry{columns:4}.masonry-wrapper.withSdac .masonry{columns:3}}@media only screen and (min-width: 1591px){.masonry{columns:5}.masonry-wrapper.withSdac .masonry{columns:4}}\n"], dependencies: [{ kind: "component", type: SiiPageContainerComponent, selector: "sii-page-container", inputs: ["autoHiddenToolbar", "scrollerRef", "backgroundImgUrl", "hideBackgroundImg", "backgroundClass"], outputs: ["clickOutsideDetail", "toggleFilterPanel"] }, { kind: "component", type: ToolbarComponent, selector: "sii-toolbar", inputs: ["autoHide", "toolbarTitle", "menu", "applicationMenu", "helpId", "showEngageSearch", "showEngageMenu", "showCloseButton"], outputs: ["closeAction"] }, { kind: "component", type: PageContentComponent, selector: "sii-page-content", inputs: ["width", "bodyStyle", "bodyClass"] }, { kind: "component", type: PageContentToolbarComponent, selector: "sii-page-content-toolbar", inputs: ["filtersCount", "hideCount", "itemsCount", "itemsCountLabel", "autoHide", "filterIcon"] }, { kind: "component", type: MatFormField, selector: "mat-form-field", inputs: ["hideRequiredMarker", "color", "floatLabel", "appearance", "subscriptSizing", "hintLabel"], exportAs: ["matFormField"] }, { kind: "directive", type: MatInput, selector: "input[matInput], textarea[matInput], select[matNativeControl],      input[matNativeControl], textarea[matNativeControl]", inputs: ["disabled", "id", "placeholder", "name", "required", "type", "errorStateMatcher", "aria-describedby", "value", "readonly"], exportAs: ["matInput"] }, { kind: "ngmodule", type: FormsModule }, { kind: "directive", type: i1$6.DefaultValueAccessor, selector: "input:not([type=checkbox])[formControlName],textarea[formControlName],input:not([type=checkbox])[formControl],textarea[formControl],input:not([type=checkbox])[ngModel],textarea[ngModel],[ngDefaultControl]" }, { kind: "directive", type: i1$6.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i1$6.NgModel, selector: "[ngModel]:not([formControlName]):not([formControl])", inputs: ["name", "disabled", "ngModel", "ngModelOptions"], outputs: ["ngModelChange"], exportAs: ["ngModel"] }, { kind: "component", type: MatIcon, selector: "mat-icon", inputs: ["color", "inline", "svgIcon", "fontSet", "fontIcon"], exportAs: ["matIcon"] }, { kind: "directive", type: MatSuffix, selector: "[matSuffix], [matIconSuffix], [matTextSuffix]", inputs: ["matTextSuffix"] }, { kind: "component", type: SiiCompanySelectionComponent, selector: "sii-company-selection" }, { kind: "component", type: MatNavList, selector: "mat-nav-list", exportAs: ["matNavList"] }, { kind: "component", type: MatListItem, selector: "mat-list-item, a[mat-list-item], button[mat-list-item]", inputs: ["activated"], exportAs: ["matListItem"] }, { kind: "component", type: MatIconButton, selector: "button[mat-icon-button]", exportAs: ["matButton"] }, { kind: "directive", type: MatMenuTrigger, selector: "[mat-menu-trigger-for], [matMenuTriggerFor]", inputs: ["mat-menu-trigger-for", "matMenuTriggerFor", "matMenuTriggerData", "matMenuTriggerRestoreFocus"], outputs: ["menuOpened", "onMenuOpen", "menuClosed", "onMenuClose"], exportAs: ["matMenuTrigger"] }, { kind: "component", type: MatMenu, selector: "mat-menu", inputs: ["backdropClass", "aria-label", "aria-labelledby", "aria-describedby", "xPosition", "yPosition", "overlapTrigger", "hasBackdrop", "class", "classList"], outputs: ["closed", "close"], exportAs: ["matMenu"] }, { kind: "component", type: MatMenuItem, selector: "[mat-menu-item]", inputs: ["role", "disabled", "disableRipple"], exportAs: ["matMenuItem"] }, { kind: "directive", type: MatTooltip, selector: "[matTooltip]", inputs: ["matTooltipPosition", "matTooltipPositionAtOrigin", "matTooltipDisabled", "matTooltipShowDelay", "matTooltipHideDelay", "matTooltipTouchGestures", "matTooltip", "matTooltipClass"], exportAs: ["matTooltip"] }, { kind: "pipe", type: AsyncPipe, name: "async" }, { kind: "pipe", type: GlobalMenuFilterPipe, name: "globalMenuFilter" }, { kind: "pipe", type: GlobalMenuVoicesFilterPipe, name: "globalMenuVoicesFilter" }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: GlobalMenuComponent, decorators: [{
            type: Component,
            args: [{ selector: 'sii-global-menu', standalone: true, imports: [SiiPageContainerComponent, ToolbarComponent, PageContentComponent, PageContentToolbarComponent, MatFormField, MatInput, FormsModule, MatIcon, MatSuffix, SiiCompanySelectionComponent, MatNavList, MatListItem, MatIconButton, MatMenuTrigger, MatMenu, MatMenuItem, MatTooltip, AsyncPipe, GlobalMenuFilterPipe, GlobalMenuVoicesFilterPipe], template: "<sii-page-container>\r\n  <sii-toolbar toolbarTitle=\"SIAL\"  [showCloseButton]=\"showCloseButton\" (closeAction)=\"close()\"></sii-toolbar>\r\n  <sii-page-content [bodyStyle]=\"'padding:0px'\" bodyClass=\"globalMenuBody\">\r\n    <sii-page-content-toolbar>\r\n      <div class=\"page-content-toolbar-body\">\r\n        <mat-form-field class=\"menu_filter\" appearance=\"outline\">\r\n          <input #searchBox  [(ngModel)]=\"searchFilter\" matInput placeholder=\"Search on menu\">\r\n          @if (!searchBox.value) {\r\n            <mat-icon matSuffix>search</mat-icon>\r\n          }\r\n          @if (searchBox.value) {\r\n            <mat-icon matSuffix   aria-label=\"Clear\" (click)=\"reset()\" style=\"cursor: pointer;\">close</mat-icon>\r\n          }\r\n        </mat-form-field>\r\n\r\n        <span [style.flex]=\"1\"></span>\r\n        <sii-company-selection></sii-company-selection>\r\n      </div>\r\n    </sii-page-content-toolbar>\r\n    <sii-company-selection class=\"bodyCompanySelection\"></sii-company-selection>\r\n\r\n\r\n    <div class=\"masonry-wrapper\"  >\r\n      <div class=\"masonry\">\r\n\r\n        <!-- PREFERITI -->\r\n        <!-- *ngIf=\"(globalMenuService.favoriteVoices | async)?.length>0\" -->\r\n        <div class=\"masonry-item preferiti-menu\" >\r\n          <div class=\"category-title\">\r\n            <mat-icon>star</mat-icon>\r\n            <span>Preferiti</span>\r\n          </div>\r\n          <mat-nav-list dense disableRipple=\"true\">\r\n            @for (favVoice of globalMenuService.favoriteVoice | async | globalMenuVoicesFilter:company:searchFilter ; track favVoice; let i = $index) {\r\n              <!-- *ngIf=\"globalMenuService.isEnabledForCurrentSelectedCompany(favVoice,company)\"  -->\r\n              <mat-list-item  (click)=\"onLinkClicked(favVoice)\">\r\n                <div class=\"menu-voice\"  > {{favVoice.title}} </div>\r\n                <button mat-icon-button class=\"submenu\" [matMenuTriggerFor]=\"submenu\" (click)=\"$event.stopPropagation()\">\r\n                  <mat-icon>more_vert</mat-icon>\r\n                </button>\r\n                <mat-menu #submenu=\"matMenu\">\r\n                  <button mat-menu-item (click)=\"globalMenuService.removeFromFavorites(favVoice, i)\">\r\n                    <mat-icon>star_border</mat-icon>\r\n                    <span class=\"font12\" i18n=\"@@removeFavorites\">Remove from favorites</span>\r\n                  </button>\r\n                  <button mat-menu-item  (click)=\"onLinkClicked(favVoice,true)\">\r\n                    <mat-icon>launch</mat-icon>\r\n                    <span class=\"font12\" i18n=\"@@openThisWindow\">Open in this window</span>\r\n                  </button>\r\n                </mat-menu>\r\n              </mat-list-item>\r\n            }\r\n\r\n          </mat-nav-list>\r\n        </div>\r\n\r\n\r\n        @for (menu of (menus | async) | globalMenuFilter:company:searchFilter; track menu) {\r\n          <div class=\"masonry-item\">\r\n            <div class=\"category-title\">\r\n              <mat-icon [svgIcon]=\"menu.icon\"></mat-icon>\r\n              <span>{{menu.category}}</span>\r\n            </div>\r\n            <mat-nav-list dense disableRipple=\"true\">\r\n              @for (voice of menu.voices  ; track voice) {\r\n                <mat-list-item   (click)=\"onLinkClicked(voice)\" >\r\n                  <div class=\"menu-voice\"> {{voice.title}} </div>\r\n                  <button mat-icon-button class=\"submenu\" [matMenuTriggerFor]=\"submenu\" (click)=\"$event.stopPropagation()\">\r\n                    <mat-icon i18n-matTooltip=\"@@openSubmenu\" matTooltip=\"Open Submenu\">more_vert</mat-icon>\r\n                  </button>\r\n                  <mat-menu #submenu=\"matMenu\">\r\n                    <button mat-menu-item [disabled]=\"globalMenuService.isInFavorites(voice)\"  (click)=\"globalMenuService.addToFavorites(voice)\">\r\n                      <mat-icon>star_border</mat-icon>\r\n                      <span class=\"font12\" i18n=\"@@addFavorites\">Add to favorites</span>\r\n                    </button>\r\n                    <button mat-menu-item  (click)=\"onLinkClicked(voice,true)\">\r\n                      <mat-icon>launch</mat-icon>\r\n                      <span class=\"font12\" i18n=\"@@openThisWindow\">Open in this window</span>\r\n                    </button>\r\n                  </mat-menu>\r\n                </mat-list-item>\r\n              }\r\n            </mat-nav-list>\r\n          </div>\r\n        }\r\n      </div>\r\n    </div>\r\n\r\n\r\n\r\n  </sii-page-content>\r\n</sii-page-container>\r\n", styles: [":host{right:0;top:0;position:absolute;width:100vw;height:100vh;z-index:11}sii-page-content{background-color:#f6f7f8;color:#000}.page-content-toolbar-body{padding:0 10px;display:flex;flex:1 1 100%}sii-sdac-preview{margin:10px!important}.masonry-wrapper{margin:0!important;flex:1 1 auto;overflow:auto}.masonry{columns:1;column-gap:30px;position:relative;padding:0 10px}.masonry-item{display:inline-block;vertical-align:top;margin:15px 0;width:100%;background-color:#fff;box-shadow:0 1px 3px #0003}.category-title{color:#427f9f;display:flex;align-items:center;padding:10px;letter-spacing:.36px;font-size:18px}.preferiti-menu .category-title{color:#c51b88}.category-title mat-icon{padding-right:10px}.menu-voice{flex:1;overflow:hidden;text-overflow:ellipsis;font-size:14px;line-height:14px;letter-spacing:.43px}.submenu{display:none;margin-right:-16px}mat-list-item:hover .submenu{display:inline-block}.menu_filter input{font-size:17px;line-height:43px;color:#000;margin-top:5px}mat-form-field.menu_filter::ng-deep .mat-form-field-infix{padding:0;border:0}mat-form-field.menu_filter::ng-deep .mat-form-field-wrapper{margin:0;padding:0}mat-form-field.menu_filter::ng-deep .mat-form-field-suffix{top:-7px;color:#0009}mat-form-field.menu_filter::ng-deep .mat-form-field-flex:hover .mat-form-field-outline,mat-form-field.menu_filter::ng-deep .mat-form-field-outline{background-color:#fff;border-radius:5px}.bodyCompanySelection{display:none;margin:10px!important}::ng-deep .globalMenuBody{flex-direction:row-reverse}@media only screen and (max-width: 500px){.menu_filter{flex:1 1 100%}.page-content-toolbar-body sii-company-selection{display:none}.bodyCompanySelection{display:block}}@media only screen and (max-width: 840px){::ng-deep .globalMenuBody{flex-direction:column}::ng-deep .globalMenuBody .masonry-wrapper{overflow:unset}}@media only screen and (min-width: 700px) and (max-width: 840px){.masonry{columns:2}}@media only screen and (min-width: 841px) and (max-width: 1090px){.masonry{columns:2}.masonry-wrapper.withSdac .masonry{columns:1}}@media only screen and (min-width: 1091px) and (max-width: 1340px){.masonry{columns:3}.masonry-wrapper.withSdac .masonry{columns:2}}@media only screen and (min-width: 1341px) and (max-width: 1590px){.masonry{columns:4}.masonry-wrapper.withSdac .masonry{columns:3}}@media only screen and (min-width: 1591px){.masonry{columns:5}.masonry-wrapper.withSdac .masonry{columns:4}}\n"] }]
        }], ctorParameters: () => [{ type: GlobalMenuService }, { type: i1$2.MatDialog }], propDecorators: { showCloseButton: [{
                type: Input
            }], closeAction: [{
                type: Output
            }] } });

class MenuComponent {
    constructor(location) {
        this.location = location;
        this.showMenu = false;
        this.enableGlobalMenu = false;
        this.showGlobalMenu = false;
    }
    ngOnInit() {
    }
    onLinkClicked(voice, event) {
        if (voice.link.startsWith('/') || voice.link.startsWith('act/')) {
            this.location.go(voice.link);
            location.reload();
        }
        else {
            window.open(voice.link, '_self');
        }
    }
    toggleMenu() {
        if (!this.voices || this.voices.length === 0) {
            this.showGlobalMenu = !this.showGlobalMenu;
        }
        else {
            this.showMenu = !this.showMenu;
        }
    }
    closeGlobalMenu() {
        this.showGlobalMenu = !this.showGlobalMenu;
    }
    doLogout() {
        this.location.go('../logout');
        location.reload();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: MenuComponent, deps: [{ token: i1$1.Location }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "18.2.13", type: MenuComponent, isStandalone: true, selector: "sii-menu", inputs: { voices: "voices", enableGlobalMenu: "enableGlobalMenu" }, ngImport: i0, template: "<button mat-icon-button (click)=\"toggleMenu()\">\r\n  <mat-icon>menu</mat-icon>\r\n</button>\r\n\r\n\r\n\r\n\r\n@if (showMenu) {\r\n  <div class=\"menu-container\">\r\n    <div [style.display]=\"'flex'\" class=\"menu-toolbar\">\r\n      <span [style.flex]=\"1\"></span>\r\n      <button  mat-icon-button (click)=\"showMenu=false\">\r\n        <mat-icon>close</mat-icon>\r\n      </button>\r\n    </div>\r\n    <div class=\"menu\">\r\n      <mat-nav-list>\r\n        @for (voice of voices; track voice) {\r\n          <mat-list-item class=\"mat-list-item-word-wrap\" (click)=\"onLinkClicked(voice, $event)\">\r\n            {{voice.title}}\r\n          </mat-list-item>\r\n        }\r\n      </mat-nav-list>\r\n      <!-- <div (click)=doLogout()>\r\n      LOGOUT\r\n    </div> -->\r\n  </div>\r\n  @if (enableGlobalMenu) {\r\n    <div class=\"menu-footer\">\r\n      <button class=\"showGlobalMenuButton\" (click)=\"showGlobalMenu=true\" mat-button>\r\n        <mat-icon>dashboard</mat-icon>\r\n        SIAL\r\n      </button>\r\n    </div>\r\n  }\r\n</div>\r\n}\r\n@if (showMenu) {\r\n  <div class=\"menu-back\" (click)=\"showMenu=false\"></div>\r\n}\r\n@if (showGlobalMenu) {\r\n  <sii-global-menu   (closeAction)=\"closeGlobalMenu()\"></sii-global-menu>\r\n}\r\n", styles: [".menu-container{position:absolute;height:100vh;top:0;left:0;width:255px;z-index:10;background-color:#fff;color:#000;display:flex;flex-direction:column}.menu{flex:1}.menu .mat-mdc-list-item{color:#000000de;font-size:14px;letter-spacing:.43px}.menu-footer{border-top:1px solid #D0D8DD}.menu-footer .showGlobalMenuButton{width:100%;text-align:start}.menu-back{position:absolute;width:100vw;height:100vh;top:0;left:0;z-index:9;background-color:#00000080}\n"], dependencies: [{ kind: "component", type: MatIconButton, selector: "button[mat-icon-button]", exportAs: ["matButton"] }, { kind: "component", type: MatIcon, selector: "mat-icon", inputs: ["color", "inline", "svgIcon", "fontSet", "fontIcon"], exportAs: ["matIcon"] }, { kind: "component", type: MatNavList, selector: "mat-nav-list", exportAs: ["matNavList"] }, { kind: "component", type: MatListItem, selector: "mat-list-item, a[mat-list-item], button[mat-list-item]", inputs: ["activated"], exportAs: ["matListItem"] }, { kind: "component", type: MatButton, selector: "    button[mat-button], button[mat-raised-button], button[mat-flat-button],    button[mat-stroked-button]  ", exportAs: ["matButton"] }, { kind: "component", type: GlobalMenuComponent, selector: "sii-global-menu", inputs: ["showCloseButton"], outputs: ["closeAction"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: MenuComponent, decorators: [{
            type: Component,
            args: [{ selector: 'sii-menu', standalone: true, imports: [MatIconButton, MatIcon, MatNavList, MatListItem, MatButton, GlobalMenuComponent], template: "<button mat-icon-button (click)=\"toggleMenu()\">\r\n  <mat-icon>menu</mat-icon>\r\n</button>\r\n\r\n\r\n\r\n\r\n@if (showMenu) {\r\n  <div class=\"menu-container\">\r\n    <div [style.display]=\"'flex'\" class=\"menu-toolbar\">\r\n      <span [style.flex]=\"1\"></span>\r\n      <button  mat-icon-button (click)=\"showMenu=false\">\r\n        <mat-icon>close</mat-icon>\r\n      </button>\r\n    </div>\r\n    <div class=\"menu\">\r\n      <mat-nav-list>\r\n        @for (voice of voices; track voice) {\r\n          <mat-list-item class=\"mat-list-item-word-wrap\" (click)=\"onLinkClicked(voice, $event)\">\r\n            {{voice.title}}\r\n          </mat-list-item>\r\n        }\r\n      </mat-nav-list>\r\n      <!-- <div (click)=doLogout()>\r\n      LOGOUT\r\n    </div> -->\r\n  </div>\r\n  @if (enableGlobalMenu) {\r\n    <div class=\"menu-footer\">\r\n      <button class=\"showGlobalMenuButton\" (click)=\"showGlobalMenu=true\" mat-button>\r\n        <mat-icon>dashboard</mat-icon>\r\n        SIAL\r\n      </button>\r\n    </div>\r\n  }\r\n</div>\r\n}\r\n@if (showMenu) {\r\n  <div class=\"menu-back\" (click)=\"showMenu=false\"></div>\r\n}\r\n@if (showGlobalMenu) {\r\n  <sii-global-menu   (closeAction)=\"closeGlobalMenu()\"></sii-global-menu>\r\n}\r\n", styles: [".menu-container{position:absolute;height:100vh;top:0;left:0;width:255px;z-index:10;background-color:#fff;color:#000;display:flex;flex-direction:column}.menu{flex:1}.menu .mat-mdc-list-item{color:#000000de;font-size:14px;letter-spacing:.43px}.menu-footer{border-top:1px solid #D0D8DD}.menu-footer .showGlobalMenuButton{width:100%;text-align:start}.menu-back{position:absolute;width:100vw;height:100vh;top:0;left:0;z-index:9;background-color:#00000080}\n"] }]
        }], ctorParameters: () => [{ type: i1$1.Location }], propDecorators: { voices: [{
                type: Input
            }], enableGlobalMenu: [{
                type: Input
            }] } });

class SnackbarFeedbackComponent {
    constructor(el) {
        this.el = el;
    }
    ngOnInit() { }
    doClickAction() {
        this.el.nativeElement.dispatchEvent(new Event('SII-SNACKBAR-FEEDBACK'));
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: SnackbarFeedbackComponent, deps: [{ token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "18.2.13", type: SnackbarFeedbackComponent, isStandalone: true, selector: "sii-snackbar-feedback", inputs: { action: "action" }, ngImport: i0, template: "\r\n<mat-icon class=\"successIcon\" svgIcon=\"sii-feedback-success\" ></mat-icon>\r\n<mat-icon class=\"errorIcon\" svgIcon=\"sii-feedback-error\" ></mat-icon>\r\n<mat-icon class=\"infoIcon\" svgIcon=\"sii-feedback-info\" ></mat-icon>\r\n\r\n<ng-content></ng-content>\r\n\r\n<span [style.flex]=\"1\"></span>\r\n@if (!!action) {\r\n  <button  class=\"feedback_action_button\" mat-button  (click)=\"doClickAction()\">\r\n    {{action}}\r\n  </button>\r\n}\r\n", styles: [":host{display:flex;align-items:center}\n"], dependencies: [{ kind: "component", type: MatIcon, selector: "mat-icon", inputs: ["color", "inline", "svgIcon", "fontSet", "fontIcon"], exportAs: ["matIcon"] }, { kind: "component", type: MatButton, selector: "    button[mat-button], button[mat-raised-button], button[mat-flat-button],    button[mat-stroked-button]  ", exportAs: ["matButton"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: SnackbarFeedbackComponent, decorators: [{
            type: Component,
            args: [{ selector: 'sii-snackbar-feedback', standalone: true, imports: [MatIcon, MatButton], template: "\r\n<mat-icon class=\"successIcon\" svgIcon=\"sii-feedback-success\" ></mat-icon>\r\n<mat-icon class=\"errorIcon\" svgIcon=\"sii-feedback-error\" ></mat-icon>\r\n<mat-icon class=\"infoIcon\" svgIcon=\"sii-feedback-info\" ></mat-icon>\r\n\r\n<ng-content></ng-content>\r\n\r\n<span [style.flex]=\"1\"></span>\r\n@if (!!action) {\r\n  <button  class=\"feedback_action_button\" mat-button  (click)=\"doClickAction()\">\r\n    {{action}}\r\n  </button>\r\n}\r\n", styles: [":host{display:flex;align-items:center}\n"] }]
        }], ctorParameters: () => [{ type: i0.ElementRef }], propDecorators: { action: [{
                type: Input
            }] } });

class BannerFeedbackComponent {
    set type(t) {
        switch (t) {
            case 'success':
                this.hostClass = 'sii-feedback-banner sii-success-feedback-banner';
                break;
            case 'error':
                this.hostClass = 'sii-feedback-banner sii-error-feedback-banner';
                break;
            case 'info':
                this.hostClass = 'sii-feedback-banner sii-info-feedback-banner';
                break;
        }
    }
    constructor(el) {
        this.el = el;
        this.hostClass = '';
    }
    ngOnInit() {
    }
    close() {
        this.el.nativeElement.dispatchEvent(new Event('SII-BANNER-FEEDBACK-CLOSE'));
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: BannerFeedbackComponent, deps: [{ token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "18.2.13", type: BannerFeedbackComponent, isStandalone: true, selector: "sii-banner-feedback", inputs: { type: "type" }, host: { properties: { "class": "this.hostClass" } }, ngImport: i0, template: "\r\n<div class=\"sii-banner-toolbar\">\r\n  <mat-icon class=\"successIcon\" svgIcon=\"sii-feedback-success\" ></mat-icon>\r\n  <mat-icon class=\"errorIcon\" svgIcon=\"sii-feedback-error\" ></mat-icon>\r\n  <mat-icon class=\"infoIcon\" svgIcon=\"sii-feedback-info\" ></mat-icon>\r\n  <ng-content select=\"[feedback-toolbar]\"></ng-content>\r\n</div>\r\n\r\n<ng-content select=\"[feedback-body]\"></ng-content>\r\n<ng-content select=\"[feedback-action]\"></ng-content>\r\n", styles: [""], dependencies: [{ kind: "component", type: MatIcon, selector: "mat-icon", inputs: ["color", "inline", "svgIcon", "fontSet", "fontIcon"], exportAs: ["matIcon"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: BannerFeedbackComponent, decorators: [{
            type: Component,
            args: [{ selector: 'sii-banner-feedback', standalone: true, imports: [MatIcon], template: "\r\n<div class=\"sii-banner-toolbar\">\r\n  <mat-icon class=\"successIcon\" svgIcon=\"sii-feedback-success\" ></mat-icon>\r\n  <mat-icon class=\"errorIcon\" svgIcon=\"sii-feedback-error\" ></mat-icon>\r\n  <mat-icon class=\"infoIcon\" svgIcon=\"sii-feedback-info\" ></mat-icon>\r\n  <ng-content select=\"[feedback-toolbar]\"></ng-content>\r\n</div>\r\n\r\n<ng-content select=\"[feedback-body]\"></ng-content>\r\n<ng-content select=\"[feedback-action]\"></ng-content>\r\n" }]
        }], ctorParameters: () => [{ type: i0.ElementRef }], propDecorators: { hostClass: [{
                type: HostBinding,
                args: ['class']
            }], type: [{
                type: Input
            }] } });

class BannerFeedbackOutletComponent {
    constructor(dialogRef, data, el) {
        this.dialogRef = dialogRef;
        this.data = data;
        this.el = el;
    }
    ngAfterViewInit() {
        const bannerEl = this.el.nativeElement.getElementsByTagName('sii-banner-feedback').item(0);
        if (bannerEl) {
            bannerEl.addEventListener('SII-BANNER-FEEDBACK-CLOSE', () => {
                this.dialogRef.close();
            });
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: BannerFeedbackOutletComponent, deps: [{ token: i1$2.MatDialogRef }, { token: MAT_DIALOG_DATA }, { token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "18.2.13", type: BannerFeedbackOutletComponent, isStandalone: true, selector: "sii-banner-feedback-outlet", ngImport: i0, template: "<ng-container *ngTemplateOutlet=\"data.templateRef; context:{$implicit:data}\" ></ng-container>\r\n\r\n", dependencies: [{ kind: "directive", type: NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: BannerFeedbackOutletComponent, decorators: [{
            type: Component,
            args: [{ selector: 'sii-banner-feedback-outlet', standalone: true, imports: [NgTemplateOutlet], template: "<ng-container *ngTemplateOutlet=\"data.templateRef; context:{$implicit:data}\" ></ng-container>\r\n\r\n" }]
        }], ctorParameters: () => [{ type: i1$2.MatDialogRef }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [MAT_DIALOG_DATA]
                }] }, { type: i0.ElementRef }] });

class SnackbarFeedbackOutletComponent {
    constructor(data, snackBarRef, el) {
        this.data = data;
        this.snackBarRef = snackBarRef;
        this.el = el;
    }
    ngAfterViewInit() {
        const snackEl = this.el.nativeElement.getElementsByTagName('sii-snackbar-feedback').item(0);
        if (snackEl) {
            snackEl.addEventListener('SII-SNACKBAR-FEEDBACK', () => {
                this.doClickAction();
            });
        }
    }
    ngOnInit() {
    }
    doClickAction() {
        this.snackBarRef.dismissWithAction();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: SnackbarFeedbackOutletComponent, deps: [{ token: MAT_SNACK_BAR_DATA }, { token: i1$7.MatSnackBarRef }, { token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "18.2.13", type: SnackbarFeedbackOutletComponent, isStandalone: true, selector: "sii-snackbar-feedback-outlet", ngImport: i0, template: "<ng-container *ngTemplateOutlet=\"data.templateRef; context:{$implicit:data}\" ></ng-container>\r\n\r\n", dependencies: [{ kind: "directive", type: NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: SnackbarFeedbackOutletComponent, decorators: [{
            type: Component,
            args: [{ selector: 'sii-snackbar-feedback-outlet', standalone: true, imports: [NgTemplateOutlet], template: "<ng-container *ngTemplateOutlet=\"data.templateRef; context:{$implicit:data}\" ></ng-container>\r\n\r\n" }]
        }], ctorParameters: () => [{ type: undefined, decorators: [{
                    type: Inject,
                    args: [MAT_SNACK_BAR_DATA]
                }] }, { type: i1$7.MatSnackBarRef }, { type: i0.ElementRef }] });

class SiiPageContainerModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: SiiPageContainerModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "18.2.13", ngImport: i0, type: SiiPageContainerModule, imports: [SiiPageContainerComponent,
            PageFiltersComponent,
            PageDetailComponent,
            PageContentComponent,
            ToolbarComponent,
            PageContentToolbarComponent], exports: [SiiPageContainerComponent,
            PageFiltersComponent,
            PageDetailComponent,
            PageContentComponent,
            ToolbarComponent,
            PageContentToolbarComponent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: SiiPageContainerModule, imports: [PageFiltersComponent,
            ToolbarComponent,
            PageContentToolbarComponent] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: SiiPageContainerModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [
                        SiiPageContainerComponent,
                        PageFiltersComponent,
                        PageDetailComponent,
                        PageContentComponent,
                        ToolbarComponent,
                        PageContentToolbarComponent,
                    ],
                    exports: [
                        SiiPageContainerComponent,
                        PageFiltersComponent,
                        PageDetailComponent,
                        PageContentComponent,
                        ToolbarComponent,
                        PageContentToolbarComponent,
                    ]
                }]
        }] });

class SearchWorkOrderDialogComponent {
    constructor(dialogRef, siiToolkitService, http, data) {
        this.dialogRef = dialogRef;
        this.siiToolkitService = siiToolkitService;
        this.http = http;
        this.data = data;
        this.internalOrderFormControl = new UntypedFormControl();
        this.internalOrderDisplayedColumns = ['itemId', 'itemDescription', 'cdcCodice', 'comCp', 'comInizioValidita'];
        this.internalOrderResultsLength = 0;
        this.cdcFormControl = new UntypedFormControl();
        this.cdcDisplayedColumns = ['itemId', 'itemDescription'];
        this.cdcResultsLength = 0;
        this.utils = {
            ioActivated: false,
            cdcActivated: false,
        };
    }
    ngAfterViewInit() {
        if (this.data.hideIO) {
            this.activateSubscribes(1);
        }
        else {
            this.activateSubscribes(0);
        }
    }
    ngOnInit() {
    }
    activateSubscribes(tabIndex) {
        if (tabIndex === 0 && !this.utils.ioActivated && this.internalOrderPaginator != null
            && this.internalOrderSort != null && this.internalOrderFormControl != null) {
            this.utils.ioActivated = true;
            this.internalOrderSort.sortChange.subscribe(() => this.internalOrderPaginator.firstPage());
            this.internalOrderFormControl.valueChanges.subscribe(() => this.internalOrderPaginator.firstPage());
            merge(this.internalOrderSort.sortChange, this.internalOrderPaginator.page, this.internalOrderFormControl.valueChanges).pipe(startWith({}), debounceTime(500), switchMap((data) => {
                return this.fetchInternalOrderDataFromServer().pipe(map(x => { x.content.forEach(i => i.type = 'IO'); return x; }));
            })).subscribe((resp) => {
                this.updateInternalOrderData(resp);
            });
        }
        if (tabIndex === 1 && !this.utils.cdcActivated && this.cdcPaginator != null
            && this.cdcSort != null && this.cdcFormControl != null) {
            this.utils.cdcActivated = true;
            this.cdcSort.sortChange.subscribe(() => this.cdcPaginator.firstPage());
            this.cdcFormControl.valueChanges.subscribe(() => this.cdcPaginator.firstPage());
            merge(this.cdcSort.sortChange, this.cdcPaginator.page, this.cdcFormControl.valueChanges).pipe(startWith({}), debounceTime(500), switchMap((data) => {
                return this.fetchCdcDataFromServer().pipe(map(x => { x.content.forEach(i => i.type = 'CDC'); return x; }));
            })).subscribe((resp) => {
                this.updateCdcData(resp);
            });
        }
    }
    tabChange(val) {
        this.activateSubscribes(val.index);
    }
    updateInternalOrderData(data) {
        this.internalOrderDataSource = new MatTableDataSource(data.content);
        this.internalOrderResultsLength = data.totalElements;
    }
    updateCdcData(data) {
        this.cdcDataSource = new MatTableDataSource(data.content);
        this.cdcResultsLength = data.totalElements;
    }
    fetchInternalOrderDataFromServer() {
        if (this.data.customPageableIORestFunct === undefined) {
            return this.http.post(`${this.siiToolkitService.environment.domain}/lookup/internal_order`, {
                text: this.internalOrderFormControl.value,
                codSociety: this.data.codSociety,
                page: this.internalOrderPaginator.pageIndex,
                size: this.internalOrderPaginator.pageSize,
                sortField: this.internalOrderSort.active,
                sortDirection: this.internalOrderSort.direction.toUpperCase(),
            });
        }
        else {
            return this.data.customPageableIORestFunct(this.internalOrderFormControl.value, this.internalOrderPaginator.pageIndex, this.internalOrderPaginator.pageSize, this.internalOrderSort.active, this.internalOrderSort.direction.toUpperCase());
        }
    }
    fetchCdcDataFromServer() {
        if (this.data.customPageableCdcRestFunct === undefined) {
            return this.http.post(`${this.siiToolkitService.environment.domain}/lookup/cdc`, {
                text: this.cdcFormControl.value,
                codSociety: this.data.codSociety,
                page: this.cdcPaginator.pageIndex,
                size: this.cdcPaginator.pageSize,
                sortField: this.cdcSort.active,
                sortDirection: this.cdcSort.direction.toUpperCase(),
            });
        }
        else {
            return this.data.customPageableCdcRestFunct(this.cdcFormControl.value, this.cdcPaginator.pageIndex, this.cdcPaginator.pageSize, this.cdcSort.active, this.cdcSort.direction.toUpperCase());
        }
    }
    selectInternalOrderRow(row, event) {
        if (event.view.getSelection().type !== 'Range') {
            this.dialogRef.close(row);
        }
    }
    selectCdcRow(row, event) {
        if (event.view.getSelection().type !== 'Range') {
            this.dialogRef.close(row);
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: SearchWorkOrderDialogComponent, deps: [{ token: i1$2.MatDialogRef }, { token: SiiToolkitService }, { token: i1.HttpClient }, { token: MAT_DIALOG_DATA }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "18.2.13", type: SearchWorkOrderDialogComponent, isStandalone: true, selector: "sii-search-work-order-dialog", viewQueries: [{ propertyName: "internalOrderPaginator", first: true, predicate: ["internalOrderPaginator"], descendants: true, read: MatPaginator }, { propertyName: "internalOrderSort", first: true, predicate: ["internalOrderSort"], descendants: true, read: MatSort }, { propertyName: "cdcPaginator", first: true, predicate: ["cdcPaginator"], descendants: true, read: MatPaginator }, { propertyName: "cdcSort", first: true, predicate: ["cdcSort"], descendants: true, read: MatSort }], ngImport: i0, template: "\r\n<div mat-dialog-content>\r\n\r\n  <mat-tab-group (selectedTabChange) =\"tabChange($event)\" >\r\n    @if (!data.hideIO) {\r\n      <mat-tab label=\"Internal Order\" i18n-label=\"@@siodialog_internal_order_tab_label\">\r\n        <div class=\"siod_tabContent\">\r\n          <mat-form-field>\r\n            <input matInput [formControl]=\"internalOrderFormControl\"  placeholder=\"Filter\" i18n-placeholder=\"@@siodialog_Filter\">\r\n          </mat-form-field>\r\n          <div class=\"siod_tableContainer\">\r\n            <table mat-table [dataSource]=\"internalOrderDataSource\" class=\"mat-elevation-z8\"\r\n              matSort matSortActive=\"com_inizio_validita\" matSortDisableClear matSortDirection=\"desc\" #internalOrderSort>\r\n              <!-- itemId Column -->\r\n              <ng-container matColumnDef=\"itemId\">\r\n                <th mat-header-cell *matHeaderCellDef mat-sort-header=\"ITEM_ID\" i18n=\"@@siodialog_internal_order\"> internal Order </th>\r\n                <td mat-cell *matCellDef=\"let element\"> {{element.itemId}} </td>\r\n              </ng-container>\r\n              <!-- itemDescription Column -->\r\n              <ng-container matColumnDef=\"itemDescription\">\r\n                <th mat-header-cell *matHeaderCellDef mat-sort-header=\"ITEM_DESCRIPTION\" i18n=\"@@siodialog_description\"> Description </th>\r\n                <td mat-cell *matCellDef=\"let element\"> {{element.itemDescription}} </td>\r\n              </ng-container>\r\n              <!-- cdcCodice Column -->\r\n              <ng-container matColumnDef=\"cdcCodice\">\r\n                <th mat-header-cell *matHeaderCellDef mat-sort-header=\"cdc_codice\" i18n=\"@@siodialog_cdc\"> CDC </th>\r\n                <td mat-cell *matCellDef=\"let element\"> {{element.cdcCodice}} </td>\r\n              </ng-container>\r\n              <!-- comCp Column -->\r\n              <ng-container matColumnDef=\"comCp\">\r\n                <th mat-header-cell *matHeaderCellDef mat-sort-header=\"com_cp\" i18n=\"@@siodialog_cp\"> Cp </th>\r\n                <td mat-cell *matCellDef=\"let element\"> {{element.comCp}} </td>\r\n              </ng-container>\r\n              <!-- comInizioValidita Column -->\r\n              <ng-container matColumnDef=\"comInizioValidita\">\r\n                <th mat-header-cell *matHeaderCellDef mat-sort-header=\"com_inizio_validita\" i18n=\"@@siodialog_validity\"> Validity </th>\r\n                <td mat-cell *matCellDef=\"let element\"> {{element.comInizioValidita}} </td>\r\n              </ng-container>\r\n              <tr mat-header-row *matHeaderRowDef=\"internalOrderDisplayedColumns;sticky: true\"></tr>\r\n              <tr mat-row *matRowDef=\"let row; columns: internalOrderDisplayedColumns;\" (click)=\"selectInternalOrderRow(row,$event)\" ></tr>\r\n            </table>\r\n          </div>\r\n          <mat-paginator #internalOrderPaginator [length]=\"internalOrderResultsLength\" [pageSize]=\"10\" [pageSizeOptions]=\"[5, 10, 20]\"></mat-paginator>\r\n        </div>\r\n      </mat-tab>\r\n    }\r\n    @if (!data.hideCdc) {\r\n      <mat-tab label=\"CDC\" i18n-label=\"@@siodialog_cdc_tab_label\">\r\n        <div class=\"siod_tabContent\">\r\n          <mat-form-field>\r\n            <input matInput [formControl]=\"cdcFormControl\"  placeholder=\"Filter\" i18n=\"@@siodialog_filter\">\r\n          </mat-form-field>\r\n          <div class=\"siod_tableContainer\">\r\n            <table mat-table [dataSource]=\"cdcDataSource\" class=\"mat-elevation-z8\"\r\n              matSort matSortActive=\"ITEM_ID\" matSortDisableClear matSortDirection=\"desc\" #cdcSort>\r\n              <!-- itemId Column -->\r\n              <ng-container matColumnDef=\"itemId\">\r\n                <th mat-header-cell *matHeaderCellDef mat-sort-header=\"ITEM_ID\" i18n=\"@@siodialog_cdc\"> CDC </th>\r\n                  <td mat-cell *matCellDef=\"let element\"> {{element.itemId}} </td>\r\n                </ng-container>\r\n                <!-- itemDescription Column -->\r\n                <ng-container matColumnDef=\"itemDescription\">\r\n                  <th mat-header-cell *matHeaderCellDef mat-sort-header=\"ITEM_DESCRIPTION\" i18n=\"@@siodialog_description\"> Description </th>\r\n                    <td mat-cell *matCellDef=\"let element\"> {{element.itemDescription}} </td>\r\n                  </ng-container>\r\n                  <tr mat-header-row *matHeaderRowDef=\"cdcDisplayedColumns;sticky: true\"></tr>\r\n                  <tr mat-row *matRowDef=\"let row; columns: cdcDisplayedColumns;\" (click)=\"selectCdcRow(row,$event)\" ></tr>\r\n                </table>\r\n              </div>\r\n              <mat-paginator #cdcPaginator [length]=\"cdcResultsLength\" [pageSize]=\"10\" [pageSizeOptions]=\"[5, 10, 20]\"></mat-paginator>\r\n            </div>\r\n          </mat-tab>\r\n        }\r\n      </mat-tab-group>\r\n\r\n\r\n\r\n\r\n    </div>\r\n    <div mat-dialog-actions style=\"float:right\">\r\n      <button mat-button class=\"sii-button-light\" [mat-dialog-close] i18n=\"@@siodialog_cancel_button\">Cancel Operation</button>\r\n      </div>\r\n", styles: [":host{display:flex;flex-direction:column;height:100%}.siod_tabContent{width:100%;height:100%;display:flex;flex-direction:column}table{width:100%}.mat-mdc-form-field{font-size:14px;width:100%}.mat-mdc-dialog-content{flex:1;max-height:initial;display:flex;flex-direction:column}.siod_tableContainer{flex:1 1 auto;overflow:auto;padding:0 3px}tr.mat-mdc-row{cursor:pointer}tr.mat-mdc-row:hover{background-color:#efefef}\n"], dependencies: [{ kind: "directive", type: MatDialogContent, selector: "[mat-dialog-content], mat-dialog-content, [matDialogContent]" }, { kind: "component", type: MatTabGroup, selector: "mat-tab-group", inputs: ["color", "fitInkBarToContent", "mat-stretch-tabs", "dynamicHeight", "selectedIndex", "headerPosition", "animationDuration", "contentTabIndex", "disablePagination", "disableRipple", "preserveContent", "backgroundColor", "aria-label", "aria-labelledby"], outputs: ["selectedIndexChange", "focusChange", "animationDone", "selectedTabChange"], exportAs: ["matTabGroup"] }, { kind: "component", type: MatTab, selector: "mat-tab", inputs: ["disabled", "label", "aria-label", "aria-labelledby", "labelClass", "bodyClass"], exportAs: ["matTab"] }, { kind: "component", type: MatFormField, selector: "mat-form-field", inputs: ["hideRequiredMarker", "color", "floatLabel", "appearance", "subscriptSizing", "hintLabel"], exportAs: ["matFormField"] }, { kind: "directive", type: MatInput, selector: "input[matInput], textarea[matInput], select[matNativeControl],      input[matNativeControl], textarea[matNativeControl]", inputs: ["disabled", "id", "placeholder", "name", "required", "type", "errorStateMatcher", "aria-describedby", "value", "readonly"], exportAs: ["matInput"] }, { kind: "ngmodule", type: FormsModule }, { kind: "directive", type: i1$6.DefaultValueAccessor, selector: "input:not([type=checkbox])[formControlName],textarea[formControlName],input:not([type=checkbox])[formControl],textarea[formControl],input:not([type=checkbox])[ngModel],textarea[ngModel],[ngDefaultControl]" }, { kind: "directive", type: i1$6.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "ngmodule", type: ReactiveFormsModule }, { kind: "directive", type: i1$6.FormControlDirective, selector: "[formControl]", inputs: ["formControl", "disabled", "ngModel"], outputs: ["ngModelChange"], exportAs: ["ngForm"] }, { kind: "component", type: MatTable, selector: "mat-table, table[mat-table]", exportAs: ["matTable"] }, { kind: "directive", type: MatSort, selector: "[matSort]", inputs: ["matSortActive", "matSortStart", "matSortDirection", "matSortDisableClear", "matSortDisabled"], outputs: ["matSortChange"], exportAs: ["matSort"] }, { kind: "directive", type: MatColumnDef, selector: "[matColumnDef]", inputs: ["matColumnDef"] }, { kind: "directive", type: MatHeaderCellDef, selector: "[matHeaderCellDef]" }, { kind: "directive", type: MatHeaderCell, selector: "mat-header-cell, th[mat-header-cell]" }, { kind: "component", type: MatSortHeader, selector: "[mat-sort-header]", inputs: ["mat-sort-header", "arrowPosition", "start", "disabled", "sortActionDescription", "disableClear"], exportAs: ["matSortHeader"] }, { kind: "directive", type: MatCellDef, selector: "[matCellDef]" }, { kind: "directive", type: MatCell, selector: "mat-cell, td[mat-cell]" }, { kind: "directive", type: MatHeaderRowDef, selector: "[matHeaderRowDef]", inputs: ["matHeaderRowDef", "matHeaderRowDefSticky"] }, { kind: "component", type: MatHeaderRow, selector: "mat-header-row, tr[mat-header-row]", exportAs: ["matHeaderRow"] }, { kind: "directive", type: MatRowDef, selector: "[matRowDef]", inputs: ["matRowDefColumns", "matRowDefWhen"] }, { kind: "component", type: MatRow, selector: "mat-row, tr[mat-row]", exportAs: ["matRow"] }, { kind: "component", type: MatPaginator, selector: "mat-paginator", inputs: ["color", "pageIndex", "length", "pageSize", "pageSizeOptions", "hidePageSize", "showFirstLastButtons", "selectConfig", "disabled"], outputs: ["page"], exportAs: ["matPaginator"] }, { kind: "directive", type: MatDialogActions, selector: "[mat-dialog-actions], mat-dialog-actions, [matDialogActions]", inputs: ["align"] }, { kind: "component", type: MatButton, selector: "    button[mat-button], button[mat-raised-button], button[mat-flat-button],    button[mat-stroked-button]  ", exportAs: ["matButton"] }, { kind: "directive", type: MatDialogClose, selector: "[mat-dialog-close], [matDialogClose]", inputs: ["aria-label", "type", "mat-dialog-close", "matDialogClose"], exportAs: ["matDialogClose"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: SearchWorkOrderDialogComponent, decorators: [{
            type: Component,
            args: [{ selector: 'sii-search-work-order-dialog', standalone: true, imports: [
                        CdkScrollable,
                        MatDialogContent,
                        MatTabGroup,
                        MatTab,
                        MatFormField,
                        MatInput,
                        FormsModule,
                        ReactiveFormsModule,
                        MatTable,
                        MatSort,
                        MatColumnDef,
                        MatHeaderCellDef,
                        MatHeaderCell,
                        MatSortHeader,
                        MatCellDef,
                        MatCell,
                        MatHeaderRowDef,
                        MatHeaderRow,
                        MatRowDef,
                        MatRow,
                        MatPaginator,
                        MatDialogActions,
                        MatButton,
                        MatDialogClose,
                    ], template: "\r\n<div mat-dialog-content>\r\n\r\n  <mat-tab-group (selectedTabChange) =\"tabChange($event)\" >\r\n    @if (!data.hideIO) {\r\n      <mat-tab label=\"Internal Order\" i18n-label=\"@@siodialog_internal_order_tab_label\">\r\n        <div class=\"siod_tabContent\">\r\n          <mat-form-field>\r\n            <input matInput [formControl]=\"internalOrderFormControl\"  placeholder=\"Filter\" i18n-placeholder=\"@@siodialog_Filter\">\r\n          </mat-form-field>\r\n          <div class=\"siod_tableContainer\">\r\n            <table mat-table [dataSource]=\"internalOrderDataSource\" class=\"mat-elevation-z8\"\r\n              matSort matSortActive=\"com_inizio_validita\" matSortDisableClear matSortDirection=\"desc\" #internalOrderSort>\r\n              <!-- itemId Column -->\r\n              <ng-container matColumnDef=\"itemId\">\r\n                <th mat-header-cell *matHeaderCellDef mat-sort-header=\"ITEM_ID\" i18n=\"@@siodialog_internal_order\"> internal Order </th>\r\n                <td mat-cell *matCellDef=\"let element\"> {{element.itemId}} </td>\r\n              </ng-container>\r\n              <!-- itemDescription Column -->\r\n              <ng-container matColumnDef=\"itemDescription\">\r\n                <th mat-header-cell *matHeaderCellDef mat-sort-header=\"ITEM_DESCRIPTION\" i18n=\"@@siodialog_description\"> Description </th>\r\n                <td mat-cell *matCellDef=\"let element\"> {{element.itemDescription}} </td>\r\n              </ng-container>\r\n              <!-- cdcCodice Column -->\r\n              <ng-container matColumnDef=\"cdcCodice\">\r\n                <th mat-header-cell *matHeaderCellDef mat-sort-header=\"cdc_codice\" i18n=\"@@siodialog_cdc\"> CDC </th>\r\n                <td mat-cell *matCellDef=\"let element\"> {{element.cdcCodice}} </td>\r\n              </ng-container>\r\n              <!-- comCp Column -->\r\n              <ng-container matColumnDef=\"comCp\">\r\n                <th mat-header-cell *matHeaderCellDef mat-sort-header=\"com_cp\" i18n=\"@@siodialog_cp\"> Cp </th>\r\n                <td mat-cell *matCellDef=\"let element\"> {{element.comCp}} </td>\r\n              </ng-container>\r\n              <!-- comInizioValidita Column -->\r\n              <ng-container matColumnDef=\"comInizioValidita\">\r\n                <th mat-header-cell *matHeaderCellDef mat-sort-header=\"com_inizio_validita\" i18n=\"@@siodialog_validity\"> Validity </th>\r\n                <td mat-cell *matCellDef=\"let element\"> {{element.comInizioValidita}} </td>\r\n              </ng-container>\r\n              <tr mat-header-row *matHeaderRowDef=\"internalOrderDisplayedColumns;sticky: true\"></tr>\r\n              <tr mat-row *matRowDef=\"let row; columns: internalOrderDisplayedColumns;\" (click)=\"selectInternalOrderRow(row,$event)\" ></tr>\r\n            </table>\r\n          </div>\r\n          <mat-paginator #internalOrderPaginator [length]=\"internalOrderResultsLength\" [pageSize]=\"10\" [pageSizeOptions]=\"[5, 10, 20]\"></mat-paginator>\r\n        </div>\r\n      </mat-tab>\r\n    }\r\n    @if (!data.hideCdc) {\r\n      <mat-tab label=\"CDC\" i18n-label=\"@@siodialog_cdc_tab_label\">\r\n        <div class=\"siod_tabContent\">\r\n          <mat-form-field>\r\n            <input matInput [formControl]=\"cdcFormControl\"  placeholder=\"Filter\" i18n=\"@@siodialog_filter\">\r\n          </mat-form-field>\r\n          <div class=\"siod_tableContainer\">\r\n            <table mat-table [dataSource]=\"cdcDataSource\" class=\"mat-elevation-z8\"\r\n              matSort matSortActive=\"ITEM_ID\" matSortDisableClear matSortDirection=\"desc\" #cdcSort>\r\n              <!-- itemId Column -->\r\n              <ng-container matColumnDef=\"itemId\">\r\n                <th mat-header-cell *matHeaderCellDef mat-sort-header=\"ITEM_ID\" i18n=\"@@siodialog_cdc\"> CDC </th>\r\n                  <td mat-cell *matCellDef=\"let element\"> {{element.itemId}} </td>\r\n                </ng-container>\r\n                <!-- itemDescription Column -->\r\n                <ng-container matColumnDef=\"itemDescription\">\r\n                  <th mat-header-cell *matHeaderCellDef mat-sort-header=\"ITEM_DESCRIPTION\" i18n=\"@@siodialog_description\"> Description </th>\r\n                    <td mat-cell *matCellDef=\"let element\"> {{element.itemDescription}} </td>\r\n                  </ng-container>\r\n                  <tr mat-header-row *matHeaderRowDef=\"cdcDisplayedColumns;sticky: true\"></tr>\r\n                  <tr mat-row *matRowDef=\"let row; columns: cdcDisplayedColumns;\" (click)=\"selectCdcRow(row,$event)\" ></tr>\r\n                </table>\r\n              </div>\r\n              <mat-paginator #cdcPaginator [length]=\"cdcResultsLength\" [pageSize]=\"10\" [pageSizeOptions]=\"[5, 10, 20]\"></mat-paginator>\r\n            </div>\r\n          </mat-tab>\r\n        }\r\n      </mat-tab-group>\r\n\r\n\r\n\r\n\r\n    </div>\r\n    <div mat-dialog-actions style=\"float:right\">\r\n      <button mat-button class=\"sii-button-light\" [mat-dialog-close] i18n=\"@@siodialog_cancel_button\">Cancel Operation</button>\r\n      </div>\r\n", styles: [":host{display:flex;flex-direction:column;height:100%}.siod_tabContent{width:100%;height:100%;display:flex;flex-direction:column}table{width:100%}.mat-mdc-form-field{font-size:14px;width:100%}.mat-mdc-dialog-content{flex:1;max-height:initial;display:flex;flex-direction:column}.siod_tableContainer{flex:1 1 auto;overflow:auto;padding:0 3px}tr.mat-mdc-row{cursor:pointer}tr.mat-mdc-row:hover{background-color:#efefef}\n"] }]
        }], ctorParameters: () => [{ type: i1$2.MatDialogRef }, { type: SiiToolkitService }, { type: i1.HttpClient }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [MAT_DIALOG_DATA]
                }] }], propDecorators: { internalOrderPaginator: [{
                type: ViewChild,
                args: ['internalOrderPaginator', { read: MatPaginator, }]
            }], internalOrderSort: [{
                type: ViewChild,
                args: ['internalOrderSort', { read: MatSort }]
            }], cdcPaginator: [{
                type: ViewChild,
                args: ['cdcPaginator', { read: MatPaginator }]
            }], cdcSort: [{
                type: ViewChild,
                args: ['cdcSort', { read: MatSort }]
            }] } });

class LookupWorkOrderComponent {
    ngOnInit() {
        // this.checkSubSystemValue();
    }
    constructor(http, dialog, siiToolkitService) {
        this.http = http;
        this.dialog = dialog;
        this.siiToolkitService = siiToolkitService;
        this.hideCdc = false;
        this.hideIO = false;
        this.hideSS = false;
        this.appearance = 'outline';
        this.required = false;
        this.disabled = false;
        this.defaultComSS = { comSS: 'AA01', comSSDescription: 'AA01' };
        this.lookupInternalOrderComponentCtrl = new UntypedFormControl();
        this.lookupSubSystemComponentCtrl = new UntypedFormControl();
        this.subSystemData = [];
        this.subjectSubSystemDataChange = new Subject();
        this.subjectOnChange = new Subject();
        this.selectedItem = {};
        this.utils = {
            subsystemLoadingInProgress: false,
            ioLoadingInProgress: false,
            cdcLoadingInProgress: false,
            internalOrderValid: true,
            subSystemValid: true,
            forceSearch: 0,
        };
        this.propagateChange = () => { };
        this.onTouchedCallback = () => { };
        this.validatorCallback = () => { };
        // ricerco le commessa in base al valore inserito nel campo di input
        this.internalOrderRestObs = this.getcommCdcInputValueChangeObserver()
            .pipe(tap((res) => this.utils.ioLoadingInProgress = true), 
        // switchMap((val) => this.getIODataFromServer(val)),
        switchMap((val) => this.getIODataFromServer(val)), tap((res) => this.utils.ioLoadingInProgress = false));
        // ricerco i cdc in base al valore inserito nel campo di input
        this.cdcRestObs = this.getcommCdcInputValueChangeObserver()
            .pipe(tap((res) => this.utils.cdcLoadingInProgress = true), switchMap((val) => this.getCDCDataFromServer(val)), tap((res) => this.utils.cdcLoadingInProgress = false));
        // ricerco i sottosistemi in base al valore inserito nel campo di input o al cambiamento di commessa/cdc
        this.subSystemDataObs = merge(this.lookupSubSystemComponentCtrl.valueChanges, this.subjectSubSystemDataChange)
            .pipe(startWith(null), tap((text) => { if (typeof text === 'string') {
            this.comSSChange({ comSS: text, comSSDescription: text }, false);
        } }), filter((text) => text == null || typeof text === 'string'), map((txt) => {
            return txt ? this._filterSubSystem(txt) : this.subSystemData.slice();
        }));
        this.subjectOnChange.pipe(debounceTime(500)).subscribe(() => this.onChange());
    }
    ngOnChanges(changes) {
        if (changes.refresh && this.refresh != null) {
            this.refresh.subscribe((ioCdcText) => {
                this.utils.forceSearch = 2;
                this.lookupInternalOrderComponentCtrl.setValue(ioCdcText);
            });
        }
    }
    getcommCdcInputValueChangeObserver() {
        return this.lookupInternalOrderComponentCtrl.valueChanges
            .pipe(tap((text) => { if (typeof text === 'string') {
            this.ioCdcChange(null);
            this.comSSChange(null);
        } }), filter((text) => typeof text === 'string' && (!!this.utils.forceSearch || text.length > 2)), debounceTime(500), distinctUntilChanged((a, b) => { return a === b && !this.utils.forceSearch; }), tap(() => this.utils.forceSearch--));
    }
    displayFn(intOrd) {
        return intOrd ? intOrd.itemId : undefined;
    }
    displayComSSFn(intOrd) {
        return intOrd ? intOrd.comSS : undefined;
    }
    // selezione di comSS dall'autocomplete
    onComSSSelectionChanged(event) {
        this.comSSChange(event.option.value, false);
    }
    comSSChange(comSS, updateInputValue = true) {
        this.selectedItem.comSS = comSS != null ? comSS.comSS : null;
        this.selectedItem.comSSDescrizione = comSS != null ? comSS.comSSDescription : null;
        this.selectedItem.comSSDescrizione = comSS != null ? comSS.comSSDescription : null;
        if (updateInputValue) {
            this.updateSubSystemComponentValue();
        }
        this.subjectOnChange.next();
    }
    ioCdcChange(item) {
        this.selectedItem.commessa = item != null ? item.itemId : null;
        this.selectedItem.commessaDescrizione = item != null ? item.itemDescription : null;
        this.selectedItem.type = item != null ? item.type : null;
        this.selectedItem._dbData = item;
        this.subjectOnChange.next();
        if (!this.hideSS) {
            this.loadSubSystem();
        }
    }
    onSelectionChanged(event) {
        this.ioCdcChange(event.option.value);
    }
    loadSubSystem() {
        this.subSystemData = [];
        this.subjectSubSystemDataChange.next();
        if (this.selectedItem != null && this.selectedItem.commessa != null) {
            this.utils.subsystemLoadingInProgress = true;
            this.http.get(`${this.siiToolkitService.environment.domain}/lookup/comSS?internalOrder=${encodeURIComponent(this.selectedItem.commessa)}`)
                .subscribe((res) => {
                this.subSystemData = res;
                this.comSSChange(res.length > 0 ? res[0] : this.defaultComSS);
                this.subjectSubSystemDataChange.next();
                this.utils.subsystemLoadingInProgress = false;
            });
        }
    }
    checkEnableComSS() {
        // tslint:disable-next-line:max-line-length
        const itemValueValidAndEnabled = this.selectedItem != null && this.selectedItem.commessa != null && this.lookupInternalOrderComponentCtrl.enabled;
        if (itemValueValidAndEnabled && this.lookupSubSystemComponentCtrl.disabled) {
            this.lookupSubSystemComponentCtrl.enable();
        }
        else if (!itemValueValidAndEnabled && this.lookupSubSystemComponentCtrl.enabled) {
            this.lookupSubSystemComponentCtrl.disable();
        }
    }
    _filterSubSystem(value) {
        const filterValue = value.toLowerCase();
        return this.subSystemData.filter((val) => val.comSS.toLowerCase().indexOf(filterValue) === 0);
    }
    getIODataFromServer(txt) {
        return (this.customIORestFunct === undefined ? this.useIODefaultRestObs(txt) : this.customIORestFunct(txt))
            .pipe(map(x => { x.forEach(i => i.type = 'IO'); return x; }));
    }
    getCDCDataFromServer(txt) {
        return (this.customCDCRestFunct === undefined ? this.useCDCDefaultRestObs(txt) : this.customCDCRestFunct(txt))
            .pipe(map(x => { x.forEach(i => i.type = 'CDC'); return x; }));
        ;
    }
    useIODefaultRestObs(txt) {
        return this.http.post(`${this.siiToolkitService.environment.domain}/lookup/internal_order/simple`, {
            text: txt,
            codSociety: this.codSociety,
        });
    }
    useCDCDefaultRestObs(txt) {
        return this.http.post(`${this.siiToolkitService.environment.domain}/lookup/cdc/simple`, {
            text: txt,
            codSociety: this.codSociety,
        });
    }
    searchPopup() {
        const dialogRef = this.dialog.open(SearchWorkOrderDialogComponent, {
            width: '100vw',
            height: '95%',
            data: {
                codSociety: this.codSociety,
                customPageableIORestFunct: this.customPageableIORestFunct,
                customPageableCdcRestFunct: this.customPageableCDCRestFunct,
                hideCdc: this.hideCdc,
                hideIO: this.hideIO
            },
        });
        dialogRef.afterClosed().subscribe((result) => {
            if (result !== undefined) {
                this.ioCdcChange(result);
                this.updateIOComponentValue();
            }
        });
    }
    updateIOComponentValue() {
        this.lookupInternalOrderComponentCtrl.setValue({
            itemId: this.selectedItem != null ? (this.selectedItem.commessa || '') : '',
            itemDescription: this.selectedItem != null ? (this.selectedItem.commessaDescrizione || '') : '',
        });
    }
    updateSubSystemComponentValue() {
        this.lookupSubSystemComponentCtrl.setValue({
            comSS: this.selectedItem != null ? (this.selectedItem.comSS || '') : '',
            comSSDescription: this.selectedItem != null ? (this.selectedItem.comSSDescrizione || '') : '',
        });
    }
    // metodi per la gestione dell'ngModel
    writeValue(value) {
        this.selectedItem = value;
        this.updateIOComponentValue();
        this.updateSubSystemComponentValue();
        this.checkEnableComSS();
    }
    onChange() {
        // this.onTouchedCallback();
        // console.log(this.selectedItem)
        this.propagateChange(this.selectedItem);
        this.checkEnableComSS();
    }
    registerOnChange(fn) {
        this.propagateChange = fn;
    }
    registerOnTouched(fn) {
        this.onTouchedCallback = fn;
    }
    registerOnValidatorChange(fn) {
        this.validatorCallback = fn;
    }
    // Allows Angular to disable the input.
    setDisabledState(isDisabled) {
        this.disabled = isDisabled;
        if (this.disabled) {
            this.lookupInternalOrderComponentCtrl.disable();
        }
        else {
            this.lookupInternalOrderComponentCtrl.enable();
        }
        this.checkEnableComSS();
    }
    validate(control) {
        const internalOrderInputValue = this.lookupInternalOrderComponentCtrl.value;
        const respErr = {};
        let iovalid = true;
        let ssValid = true;
        // validazione commessa/cdc
        if (this.required !== false) { // obbligatorio
            if (this.selectedItem == null || this.selectedItem.commessa == null) {
                respErr.required = true;
                iovalid = false;
            }
        }
        else { // non obbligatorio
            if (typeof internalOrderInputValue === 'string' && internalOrderInputValue.trim() !== '') {
                respErr.internalOrderInvalid = true;
                iovalid = false;
            }
        }
        // validazione sottosistema
        if (!this.hideSS) {
            if (this.required !== false) { // obbligatorio
                if (this.selectedItem == null || this.selectedItem.comSS == null || this.selectedItem.comSS.length !== 4) {
                    respErr.subSystemInvalid = true;
                    respErr.subSystemRequired = true;
                    ssValid = false;
                }
            }
            else { // non obbligatorio
                if (this.selectedItem != null && this.selectedItem.comSS != null &&
                    (this.selectedItem.comSS.length > 0 && this.selectedItem.comSS.length !== 4)) {
                    respErr.subSystemInvalid = true;
                    ssValid = false;
                }
            }
        }
        this.utils.internalOrderValid = iovalid;
        this.utils.subSystemValid = ssValid;
        return Object.keys(respErr).length === 0 ? null : respErr;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: LookupWorkOrderComponent, deps: [{ token: i1.HttpClient }, { token: i1$2.MatDialog }, { token: SiiToolkitService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "18.2.13", type: LookupWorkOrderComponent, isStandalone: true, selector: "sii-lookup-work-order", inputs: { label: "label", hideCdc: "hideCdc", hideIO: "hideIO", hideSS: "hideSS", appearance: "appearance", codSociety: "codSociety", required: "required", disabled: "disabled", customIORestFunct: "customIORestFunct", customCDCRestFunct: "customCDCRestFunct", customPageableIORestFunct: "customPageableIORestFunct", customPageableCDCRestFunct: "customPageableCDCRestFunct", refresh: "refresh" }, providers: [
            {
                provide: NG_VALUE_ACCESSOR,
                useExisting: forwardRef(() => LookupWorkOrderComponent),
                multi: true,
            },
            { provide: NG_VALIDATORS, useExisting: LookupWorkOrderComponent, multi: true },
        ], usesOnChanges: true, ngImport: i0, template: "<div class=\"lio-mff-container lio-io-cont\" >\r\n  <mat-form-field [appearance]=\"appearance\"  [ngClass]=\"{'lio_fc_invalid': !utils.internalOrderValid}\" >\r\n\r\n    @if(!!label){\r\n      <mat-label>{{label}}</mat-label>\r\n    }\r\n    @else if (!hideIO && !hideCdc) {\r\n        <mat-label i18n=\"@@lookIOCdc_internalorder_cdc\" >Work Order / CDC</mat-label>\r\n      }\r\n    @else if (hideIO) {\r\n        <mat-label i18n=\"@@lookIOCdc_cdc\" >CDC</mat-label>\r\n      }\r\n    @else if (hideCdc) {\r\n        <mat-label i18n=\"@@lookIOCdc_internalorder\" >Work Order</mat-label>\r\n      }\r\n    \r\n\r\n    <input matInput [required]=\"required\"\r\n      aria-label=\"Internal order / cdc\"\r\n      [matAutocomplete]=\"lookupInternalOrderAutocompleteRef\"\r\n      [formControl]=\"lookupInternalOrderComponentCtrl\"  >\r\n      <mat-autocomplete #lookupInternalOrderAutocompleteRef=\"matAutocomplete\"  [displayWith]=\"displayFn\"  class=\"lioAutoComplete\" (optionSelected)=\"onSelectionChanged($event)\">\r\n\r\n        @if (!hideIO) {\r\n          <mat-optgroup label=\"Work Orders\" i18n-label=\"@@lookIOCdc_internalorders\">\r\n            @for (intOrd of internalOrderRestObs | async; track intOrd) {\r\n              <mat-option [value]=\"intOrd\" style=\"border-bottom: 1px solid lightgray;\"\r\n                [matTooltip]=\"intOrd.itemId +' | ' +intOrd.itemDescription\" matTooltipShowDelay=1000>\r\n                <div class=\"lioAutocompleteItems\">\r\n                  <span class=\"lioAutocompleteItemsId\">{{intOrd.itemId}}</span>\r\n                  <span class=\"lioAutocompleteItemsDescr\">{{intOrd.itemDescription}}</span>\r\n                </div>\r\n              </mat-option>\r\n            }\r\n          </mat-optgroup>\r\n        }\r\n\r\n        @if (!hideCdc) {\r\n          <mat-optgroup label=\"CDC\" i18n-label=\"@@lookIOCdc_cdc\">\r\n            @for (intOrd of cdcRestObs | async; track intOrd) {\r\n              <mat-option [value]=\"intOrd\" style=\"border-bottom: 1px solid lightgray;\"\r\n                [matTooltip]=\"intOrd.itemId +' | ' +intOrd.itemDescription\" matTooltipShowDelay=1000>\r\n                <div class=\"lioAutocompleteItems\">\r\n                  <span class=\"lioAutocompleteItemsId\">{{intOrd.itemId}}</span>\r\n                  <span class=\"lioAutocompleteItemsDescr\">{{intOrd.itemDescription}}</span>\r\n                </div>\r\n              </mat-option>\r\n            }\r\n          </mat-optgroup>\r\n        }\r\n      </mat-autocomplete>\r\n\r\n      @if (selectedItem!=undefined) {\r\n        <mat-hint class=\"lioHint\"  [matTooltip]=\"selectedItem.commessaDescrizione\" >{{selectedItem.commessaDescrizione}}</mat-hint>\r\n      }\r\n      <mat-icon [style.visibility]=\"!(disabled!==false) ? 'initial' : 'hidden'\" style=\"cursor: pointer;\" matSuffix (click)=\"searchPopup();$event.stopPropagation();\">search</mat-icon>\r\n    </mat-form-field>\r\n    @if (utils.ioLoadingInProgress || utils.cdcLoadingInProgress) {\r\n      <mat-progress-bar class=\"lioProgressBar\" mode=\"query\"></mat-progress-bar>\r\n    }\r\n  </div>\r\n\r\n\r\n\r\n\r\n  @if(!hideSS){\r\n  <div class=\"lio-mff-container\">\r\n    <mat-form-field [appearance]=\"appearance\"    [ngClass]=\"{'lio_fc_invalid': !utils.subSystemValid}\" >\r\n      <mat-label i18n=\"@@lookIOCdc_subsystem\" >Sub System</mat-label>\r\n      <input matInput [required]=\"required\"\r\n        aria-label=\"Sub System\"\r\n        [matAutocomplete]=\"lookupSubSystemAutocompleteRef\"\r\n        [formControl]=\"lookupSubSystemComponentCtrl\"  >\r\n\r\n        <mat-autocomplete #lookupSubSystemAutocompleteRef=\"matAutocomplete\"    class=\"lioAutoComplete\" [displayWith]=\"displayComSSFn\" (optionSelected)=\"onComSSSelectionChanged($event)\">\r\n          @for (comss of subSystemDataObs | async; track comss) {\r\n            <mat-option [value]=\"comss\"\r\n              [matTooltip]=\"comss.comSS +' | ' +comss.comSSDescription\" matTooltipShowDelay=1000>\r\n              <div class=\"lioAutocompleteItems\">\r\n                <span class=\"lioAutocompleteItemsId\">{{comss.comSS}}</span>\r\n                <span class=\"lioAutocompleteItemsDescr\">{{comss.comSSDescription}}</span>\r\n              </div>\r\n            </mat-option>\r\n          }\r\n        </mat-autocomplete>\r\n        @if (selectedItem!=undefined) {\r\n          <mat-hint class=\"lioHint\"  [matTooltip]=\"selectedItem.comSSDescrizione\" >{{selectedItem.comSSDescrizione}}</mat-hint>\r\n        }\r\n      </mat-form-field>\r\n      @if (utils.subsystemLoadingInProgress) {\r\n        <mat-progress-bar class=\"lioProgressBar\" mode=\"query\"></mat-progress-bar>\r\n      }\r\n    </div>\r\n  }", styles: [":host{display:flex;flex-wrap:wrap}.lioHint{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.lio-io-cont{margin-right:10px}.lioAutocompleteItems{display:flex;flex-direction:column}.lioAutocompleteItems .lioAutocompleteItemsId{line-height:20px}.lioAutocompleteItems .lioAutocompleteItemsDescr{line-height:12px;font-size:10px;max-height:24px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}::ng-deep .lioAutoComplete .mat-mdc-option{padding:0 5px!important;border-bottom:1px solid lightgray}::ng-deep .lioAutoComplete .mat-mdc-optgroup-label{background-color:#d3d3d3;text-align:center;font-weight:700;color:#000}.lio_fc_invalid.ng-touched::ng-deep .mdc-notched-outline>*{border-color:red!important}.lio_fc_invalid.ng-touched::ng-deep mat-label{color:red!important}.lio_fc_invalid.ng-touched::ng-deep .mdc-line-ripple:before,.lio_fc_invalid.ng-touched::ng-deep .mdc-line-ripple:after{border-bottom-color:red!important}.lio-mff-container{position:relative;flex:1}.lio-mff-container>mat-form-field{width:100%}.lioProgressBar{height:2px;position:absolute;bottom:16px}\n"], dependencies: [{ kind: "component", type: MatFormField, selector: "mat-form-field", inputs: ["hideRequiredMarker", "color", "floatLabel", "appearance", "subscriptSizing", "hintLabel"], exportAs: ["matFormField"] }, { kind: "directive", type: NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: MatLabel, selector: "mat-label" }, { kind: "directive", type: MatInput, selector: "input[matInput], textarea[matInput], select[matNativeControl],      input[matNativeControl], textarea[matNativeControl]", inputs: ["disabled", "id", "placeholder", "name", "required", "type", "errorStateMatcher", "aria-describedby", "value", "readonly"], exportAs: ["matInput"] }, { kind: "directive", type: MatAutocompleteTrigger, selector: "input[matAutocomplete], textarea[matAutocomplete]", inputs: ["matAutocomplete", "matAutocompletePosition", "matAutocompleteConnectedTo", "autocomplete", "matAutocompleteDisabled"], exportAs: ["matAutocompleteTrigger"] }, { kind: "ngmodule", type: FormsModule }, { kind: "directive", type: i1$6.DefaultValueAccessor, selector: "input:not([type=checkbox])[formControlName],textarea[formControlName],input:not([type=checkbox])[formControl],textarea[formControl],input:not([type=checkbox])[ngModel],textarea[ngModel],[ngDefaultControl]" }, { kind: "directive", type: i1$6.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i1$6.RequiredValidator, selector: ":not([type=checkbox])[required][formControlName],:not([type=checkbox])[required][formControl],:not([type=checkbox])[required][ngModel]", inputs: ["required"] }, { kind: "ngmodule", type: ReactiveFormsModule }, { kind: "directive", type: i1$6.FormControlDirective, selector: "[formControl]", inputs: ["formControl", "disabled", "ngModel"], outputs: ["ngModelChange"], exportAs: ["ngForm"] }, { kind: "component", type: MatAutocomplete, selector: "mat-autocomplete", inputs: ["aria-label", "aria-labelledby", "displayWith", "autoActiveFirstOption", "autoSelectActiveOption", "requireSelection", "panelWidth", "disableRipple", "class", "hideSingleSelectionIndicator"], outputs: ["optionSelected", "opened", "closed", "optionActivated"], exportAs: ["matAutocomplete"] }, { kind: "component", type: MatOptgroup, selector: "mat-optgroup", inputs: ["label", "disabled"], exportAs: ["matOptgroup"] }, { kind: "component", type: MatOption, selector: "mat-option", inputs: ["value", "id", "disabled"], outputs: ["onSelectionChange"], exportAs: ["matOption"] }, { kind: "directive", type: MatTooltip, selector: "[matTooltip]", inputs: ["matTooltipPosition", "matTooltipPositionAtOrigin", "matTooltipDisabled", "matTooltipShowDelay", "matTooltipHideDelay", "matTooltipTouchGestures", "matTooltip", "matTooltipClass"], exportAs: ["matTooltip"] }, { kind: "directive", type: MatHint, selector: "mat-hint", inputs: ["align", "id"] }, { kind: "component", type: MatIcon, selector: "mat-icon", inputs: ["color", "inline", "svgIcon", "fontSet", "fontIcon"], exportAs: ["matIcon"] }, { kind: "directive", type: MatSuffix, selector: "[matSuffix], [matIconSuffix], [matTextSuffix]", inputs: ["matTextSuffix"] }, { kind: "component", type: MatProgressBar, selector: "mat-progress-bar", inputs: ["color", "value", "bufferValue", "mode"], outputs: ["animationEnd"], exportAs: ["matProgressBar"] }, { kind: "pipe", type: AsyncPipe, name: "async" }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: LookupWorkOrderComponent, decorators: [{
            type: Component,
            args: [{ selector: 'sii-lookup-work-order', providers: [
                        {
                            provide: NG_VALUE_ACCESSOR,
                            useExisting: forwardRef(() => LookupWorkOrderComponent),
                            multi: true,
                        },
                        { provide: NG_VALIDATORS, useExisting: LookupWorkOrderComponent, multi: true },
                    ], standalone: true, imports: [
                        MatFormField,
                        NgClass,
                        MatLabel,
                        MatInput,
                        MatAutocompleteTrigger,
                        FormsModule,
                        ReactiveFormsModule,
                        MatAutocomplete,
                        MatOptgroup,
                        MatOption,
                        MatTooltip,
                        MatHint,
                        MatIcon,
                        MatSuffix,
                        MatProgressBar,
                        AsyncPipe,
                    ], template: "<div class=\"lio-mff-container lio-io-cont\" >\r\n  <mat-form-field [appearance]=\"appearance\"  [ngClass]=\"{'lio_fc_invalid': !utils.internalOrderValid}\" >\r\n\r\n    @if(!!label){\r\n      <mat-label>{{label}}</mat-label>\r\n    }\r\n    @else if (!hideIO && !hideCdc) {\r\n        <mat-label i18n=\"@@lookIOCdc_internalorder_cdc\" >Work Order / CDC</mat-label>\r\n      }\r\n    @else if (hideIO) {\r\n        <mat-label i18n=\"@@lookIOCdc_cdc\" >CDC</mat-label>\r\n      }\r\n    @else if (hideCdc) {\r\n        <mat-label i18n=\"@@lookIOCdc_internalorder\" >Work Order</mat-label>\r\n      }\r\n    \r\n\r\n    <input matInput [required]=\"required\"\r\n      aria-label=\"Internal order / cdc\"\r\n      [matAutocomplete]=\"lookupInternalOrderAutocompleteRef\"\r\n      [formControl]=\"lookupInternalOrderComponentCtrl\"  >\r\n      <mat-autocomplete #lookupInternalOrderAutocompleteRef=\"matAutocomplete\"  [displayWith]=\"displayFn\"  class=\"lioAutoComplete\" (optionSelected)=\"onSelectionChanged($event)\">\r\n\r\n        @if (!hideIO) {\r\n          <mat-optgroup label=\"Work Orders\" i18n-label=\"@@lookIOCdc_internalorders\">\r\n            @for (intOrd of internalOrderRestObs | async; track intOrd) {\r\n              <mat-option [value]=\"intOrd\" style=\"border-bottom: 1px solid lightgray;\"\r\n                [matTooltip]=\"intOrd.itemId +' | ' +intOrd.itemDescription\" matTooltipShowDelay=1000>\r\n                <div class=\"lioAutocompleteItems\">\r\n                  <span class=\"lioAutocompleteItemsId\">{{intOrd.itemId}}</span>\r\n                  <span class=\"lioAutocompleteItemsDescr\">{{intOrd.itemDescription}}</span>\r\n                </div>\r\n              </mat-option>\r\n            }\r\n          </mat-optgroup>\r\n        }\r\n\r\n        @if (!hideCdc) {\r\n          <mat-optgroup label=\"CDC\" i18n-label=\"@@lookIOCdc_cdc\">\r\n            @for (intOrd of cdcRestObs | async; track intOrd) {\r\n              <mat-option [value]=\"intOrd\" style=\"border-bottom: 1px solid lightgray;\"\r\n                [matTooltip]=\"intOrd.itemId +' | ' +intOrd.itemDescription\" matTooltipShowDelay=1000>\r\n                <div class=\"lioAutocompleteItems\">\r\n                  <span class=\"lioAutocompleteItemsId\">{{intOrd.itemId}}</span>\r\n                  <span class=\"lioAutocompleteItemsDescr\">{{intOrd.itemDescription}}</span>\r\n                </div>\r\n              </mat-option>\r\n            }\r\n          </mat-optgroup>\r\n        }\r\n      </mat-autocomplete>\r\n\r\n      @if (selectedItem!=undefined) {\r\n        <mat-hint class=\"lioHint\"  [matTooltip]=\"selectedItem.commessaDescrizione\" >{{selectedItem.commessaDescrizione}}</mat-hint>\r\n      }\r\n      <mat-icon [style.visibility]=\"!(disabled!==false) ? 'initial' : 'hidden'\" style=\"cursor: pointer;\" matSuffix (click)=\"searchPopup();$event.stopPropagation();\">search</mat-icon>\r\n    </mat-form-field>\r\n    @if (utils.ioLoadingInProgress || utils.cdcLoadingInProgress) {\r\n      <mat-progress-bar class=\"lioProgressBar\" mode=\"query\"></mat-progress-bar>\r\n    }\r\n  </div>\r\n\r\n\r\n\r\n\r\n  @if(!hideSS){\r\n  <div class=\"lio-mff-container\">\r\n    <mat-form-field [appearance]=\"appearance\"    [ngClass]=\"{'lio_fc_invalid': !utils.subSystemValid}\" >\r\n      <mat-label i18n=\"@@lookIOCdc_subsystem\" >Sub System</mat-label>\r\n      <input matInput [required]=\"required\"\r\n        aria-label=\"Sub System\"\r\n        [matAutocomplete]=\"lookupSubSystemAutocompleteRef\"\r\n        [formControl]=\"lookupSubSystemComponentCtrl\"  >\r\n\r\n        <mat-autocomplete #lookupSubSystemAutocompleteRef=\"matAutocomplete\"    class=\"lioAutoComplete\" [displayWith]=\"displayComSSFn\" (optionSelected)=\"onComSSSelectionChanged($event)\">\r\n          @for (comss of subSystemDataObs | async; track comss) {\r\n            <mat-option [value]=\"comss\"\r\n              [matTooltip]=\"comss.comSS +' | ' +comss.comSSDescription\" matTooltipShowDelay=1000>\r\n              <div class=\"lioAutocompleteItems\">\r\n                <span class=\"lioAutocompleteItemsId\">{{comss.comSS}}</span>\r\n                <span class=\"lioAutocompleteItemsDescr\">{{comss.comSSDescription}}</span>\r\n              </div>\r\n            </mat-option>\r\n          }\r\n        </mat-autocomplete>\r\n        @if (selectedItem!=undefined) {\r\n          <mat-hint class=\"lioHint\"  [matTooltip]=\"selectedItem.comSSDescrizione\" >{{selectedItem.comSSDescrizione}}</mat-hint>\r\n        }\r\n      </mat-form-field>\r\n      @if (utils.subsystemLoadingInProgress) {\r\n        <mat-progress-bar class=\"lioProgressBar\" mode=\"query\"></mat-progress-bar>\r\n      }\r\n    </div>\r\n  }", styles: [":host{display:flex;flex-wrap:wrap}.lioHint{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.lio-io-cont{margin-right:10px}.lioAutocompleteItems{display:flex;flex-direction:column}.lioAutocompleteItems .lioAutocompleteItemsId{line-height:20px}.lioAutocompleteItems .lioAutocompleteItemsDescr{line-height:12px;font-size:10px;max-height:24px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}::ng-deep .lioAutoComplete .mat-mdc-option{padding:0 5px!important;border-bottom:1px solid lightgray}::ng-deep .lioAutoComplete .mat-mdc-optgroup-label{background-color:#d3d3d3;text-align:center;font-weight:700;color:#000}.lio_fc_invalid.ng-touched::ng-deep .mdc-notched-outline>*{border-color:red!important}.lio_fc_invalid.ng-touched::ng-deep mat-label{color:red!important}.lio_fc_invalid.ng-touched::ng-deep .mdc-line-ripple:before,.lio_fc_invalid.ng-touched::ng-deep .mdc-line-ripple:after{border-bottom-color:red!important}.lio-mff-container{position:relative;flex:1}.lio-mff-container>mat-form-field{width:100%}.lioProgressBar{height:2px;position:absolute;bottom:16px}\n"] }]
        }], ctorParameters: () => [{ type: i1.HttpClient }, { type: i1$2.MatDialog }, { type: SiiToolkitService }], propDecorators: { label: [{
                type: Input
            }], hideCdc: [{
                type: Input
            }], hideIO: [{
                type: Input
            }], hideSS: [{
                type: Input
            }], appearance: [{
                type: Input
            }], codSociety: [{
                type: Input
            }], required: [{
                type: Input
            }], disabled: [{
                type: Input
            }], customIORestFunct: [{
                type: Input
            }], customCDCRestFunct: [{
                type: Input
            }], customPageableIORestFunct: [{
                type: Input
            }], customPageableCDCRestFunct: [{
                type: Input
            }], refresh: [{
                type: Input
            }] } });

class LookupOdaPosComponent {
    constructor(http, dialog, siiToolkitService) {
        this.http = http;
        this.dialog = dialog;
        this.siiToolkitService = siiToolkitService;
        this.appearance = 'legacy';
        this.disabled = false;
        this.required = false;
        this.utils = {
            odaValid: false,
            odaLength: -1,
            loadingInProgress: false,
        };
        this.selectedItem = { pos: null, oda: null };
        this.lookupOdaComponentCtrl = new UntypedFormControl();
        this.propagateChange = () => { };
        this.onTouchedCallback = () => { };
        this.validatorCallback = () => { };
        this.odaRestObs = this.lookupOdaComponentCtrl.valueChanges
            .pipe(startWith(''), debounceTime(500), tap((text) => { if (typeof text === 'string') {
            this.onChange(null);
        } }), 
        // tslint:disable-next-line:max-line-length
        map((text) => (typeof text === 'object' && (text.oda === undefined || text.oda === null)) ? '' : text), filter((text) => typeof text === 'string'), distinctUntilChanged(), tap((res) => this.utils.loadingInProgress = true), switchMap((val) => this.getOdaDataFromServer(val)), tap((res) => {
            this.utils.odaLength = res.length;
            this.utils.loadingInProgress = false;
        }));
    }
    getOdaDataFromServer(val) {
        return true ? this.useOdaDefaultRestObs(val) : null;
    }
    useOdaDefaultRestObs(txt) {
        return this.http.post(`${this.siiToolkitService.environment.domain}/lookup/oda/simple`, {
            text: txt && txt.trim().length !== 0 ? txt : null,
            codSociety: this.codSociety,
            codSupplier: this.codSupplier,
            lavMatricola: this.lavMatricola,
            tipologie: this.tipologie,
        });
    }
    displayOdaFn(oda) {
        return oda ? oda.oda : undefined;
    }
    // disabilitato, da completare su richiesta
    // searchPopup() {
    //   const dialogRef = this.dialog.open(SearchOdaPosDialogComponent, {
    //     width: '100vw',
    //     height: '95%',
    //     data: {
    //       codSociety: this.codSociety,
    //       codSupplier: this.codSupplier,
    //       lavMatricola: this.lavMatricola,
    //       tipologie: this.tipologie,
    //     },
    //   });
    //   dialogRef.afterClosed().subscribe((result: ILookupOdaDataDTO) => {
    //     if (result !== undefined) {
    //       this.onChange(result);
    //       this.lookupOdaComponentCtrl.setValue(result);
    //     }
    //   });
    // }
    onSelectionChanged(event) {
        this.onChange(event.option.value);
    }
    onChange(item) {
        this.onTouchedCallback();
        this.selectedItem.oda = item != null ? item.oda : null;
        this.selectedItem.pos = item != null ? item.pos : null;
        this.propagateChange(this.selectedItem);
    }
    validate(control) {
        const odaval = this.lookupOdaComponentCtrl.value;
        const respErr = {};
        if (odaval === null || typeof odaval === 'string') {
            if (this.required !== false) {
                respErr.odaValid = false;
                respErr.required = true;
            }
            else if ((odaval || '').trim() !== '') {
                respErr.odaValid = false;
            }
        }
        this.utils.odaValid = Object.keys(respErr).length === 0;
        return this.utils.odaValid ? null : respErr;
    }
    registerOnValidatorChange(fn) {
        this.validatorCallback = fn;
    }
    writeValue(obj) {
        this.selectedItem = obj;
        this.lookupOdaComponentCtrl.setValue(this.selectedItem);
    }
    registerOnChange(fn) { this.propagateChange = fn; }
    registerOnTouched(fn) { this.onTouchedCallback = fn; }
    setDisabledState(isDisabled) {
        this.disabled = isDisabled;
        if (this.disabled) {
            this.lookupOdaComponentCtrl.disable();
        }
        else {
            this.lookupOdaComponentCtrl.enable();
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: LookupOdaPosComponent, deps: [{ token: i1.HttpClient }, { token: i1$2.MatDialog }, { token: SiiToolkitService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "18.2.13", type: LookupOdaPosComponent, isStandalone: true, selector: "sii-lookup-oda-pos", inputs: { appearance: "appearance", codSociety: "codSociety", codSupplier: "codSupplier", lavMatricola: "lavMatricola", tipologie: "tipologie", disabled: "disabled", required: "required" }, providers: [
            {
                provide: NG_VALUE_ACCESSOR,
                useExisting: forwardRef(() => LookupOdaPosComponent),
                multi: true,
            },
            { provide: NG_VALIDATORS, useExisting: LookupOdaPosComponent, multi: true },
        ], ngImport: i0, template: "<mat-form-field [appearance]=\"appearance\" class=\"lop_mff\" [ngClass]=\"{'lop_fc_invalid': !utils.odaValid}\">\r\n  <mat-label i18n=\"@@lookOdaPos__oda\" >ODA</mat-label>\r\n  <input matInput\r\n    [required]=\"required\"\r\n    aria-label=\"ODA\"\r\n    [matAutocomplete]=\"lookupOdaAutocompleteRef\"\r\n    [formControl]=\"lookupOdaComponentCtrl\"  >\r\n\r\n    <mat-autocomplete #lookupOdaAutocompleteRef=\"matAutocomplete\" class=\"lopAutoComplete\" [displayWith]=\"displayOdaFn\" (optionSelected)=\"onSelectionChanged($event)\">\r\n      @for (odaItem of odaRestObs | async; track odaItem) {\r\n        <mat-option [value]=\"odaItem\" style=\"border-bottom: 1px solid lightgray;\">\r\n          <div class=\"lopAutocompleteItems\">\r\n            <span class=\"lopAutocompleteItemsId\"> ODA/POS : <b>{{odaItem.oda}} / {{odaItem.pos}}</b></span>\r\n            <span class=\"lopAutocompleteItemsDescr\" [matTooltip]=\"odaItem.noteOda\" matTooltipShowDelay=500>{{odaItem.noteOda}}</span>\r\n            <ul class=\"lopAutocompleteListItemsDescr\">\r\n              @for (mat of odaItem.materiali; track mat) {\r\n                <li  [matTooltip]=\"mat\" matTooltipShowDelay=500>{{mat}}</li>\r\n              }\r\n            </ul>\r\n            <!-- <span class=\"lopAutocompleteItemsDescr\" [matTooltip]=\"odaItem.materiale +' - '+odaItem.descrizioneRiga\" matTooltipShowDelay=1000>{{odaItem.materiale +' - '+odaItem.descrizioneRiga}}</span>  -->\r\n          </div>\r\n        </mat-option>\r\n      }\r\n    </mat-autocomplete>\r\n\r\n    @if (selectedItem?.pos!=null) {\r\n      <div matSuffix style=\"width: 80px; \">\r\n        <div><mat-label i18n=\"@@lookOdaPos_pos\">POS</mat-label>: {{selectedItem?.pos}}</div>\r\n        <!-- disabilitato, da completare su richiesta -->\r\n        <!-- <mat-icon class=\"lopSearchIcon\" [style.visibility]=\"!(disabled!==false) ? 'initial' : 'hidden'\" style=\"cursor: pointer;\"  (click)=\"searchPopup();$event.stopPropagation();\">search</mat-icon> -->\r\n      </div>\r\n    }\r\n\r\n    @if (utils.odaLength==0) {\r\n      <mat-hint i18n=\"@@lookOdaPos_no_available_oda\">No Available Oda</mat-hint>\r\n    }\r\n  </mat-form-field>\r\n  @if (utils.loadingInProgress) {\r\n    <mat-progress-bar class=\"lopProgressBar\" mode=\"query\"></mat-progress-bar>\r\n  }\r\n", styles: [":host{position:relative}.lop_mff{width:100%}::ng-deep .lopAutoComplete .mat-mdc-option{padding:5px!important;border-bottom:1px solid lightgray;height:unset}.lopAutocompleteItems{display:flex;flex-direction:column}.lopAutocompleteListItemsDescr{padding-left:0;margin:0}.lopAutocompleteListItemsDescr>li{line-height:10px;font-size:10px;list-style-position:inside;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.lopAutocompleteItems .lopAutocompleteItemsId{line-height:12px;font-size:13px}.lopAutocompleteItems .lopAutocompleteItemsDescr{line-height:10px;font-size:10px;max-height:24px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;padding-left:8px}.lopProgressBar{height:2px;position:absolute;bottom:16px}.lop_mff .lop_pos_label{margin-top:-18px}.lop_mff.mat-form-field-appearance-outline .lop_pos_label{margin-top:-30px;background-color:#fff;width:40px;padding-left:6px;margin-left:-6px}.lop_fc_invalid.ng-touched::ng-deep .mdc-notched-outline>*{border-color:red!important}.lop_fc_invalid.ng-touched::ng-deep mat-label{color:red!important}.lop_fc_invalid.ng-touched::ng-deep .mdc-line-ripple:before,.lop_fc_invalid.ng-touched::ng-deep .mdc-line-ripple:after{border-bottom-color:red!important}.lopSearchIcon{position:absolute;top:-9px;right:0}.lop_mff.mat-form-field-appearance-outline .lopSearchIcon{top:-7px}\n"], dependencies: [{ kind: "component", type: MatFormField, selector: "mat-form-field", inputs: ["hideRequiredMarker", "color", "floatLabel", "appearance", "subscriptSizing", "hintLabel"], exportAs: ["matFormField"] }, { kind: "directive", type: NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: MatLabel, selector: "mat-label" }, { kind: "directive", type: MatInput, selector: "input[matInput], textarea[matInput], select[matNativeControl],      input[matNativeControl], textarea[matNativeControl]", inputs: ["disabled", "id", "placeholder", "name", "required", "type", "errorStateMatcher", "aria-describedby", "value", "readonly"], exportAs: ["matInput"] }, { kind: "directive", type: MatAutocompleteTrigger, selector: "input[matAutocomplete], textarea[matAutocomplete]", inputs: ["matAutocomplete", "matAutocompletePosition", "matAutocompleteConnectedTo", "autocomplete", "matAutocompleteDisabled"], exportAs: ["matAutocompleteTrigger"] }, { kind: "ngmodule", type: FormsModule }, { kind: "directive", type: i1$6.DefaultValueAccessor, selector: "input:not([type=checkbox])[formControlName],textarea[formControlName],input:not([type=checkbox])[formControl],textarea[formControl],input:not([type=checkbox])[ngModel],textarea[ngModel],[ngDefaultControl]" }, { kind: "directive", type: i1$6.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i1$6.RequiredValidator, selector: ":not([type=checkbox])[required][formControlName],:not([type=checkbox])[required][formControl],:not([type=checkbox])[required][ngModel]", inputs: ["required"] }, { kind: "ngmodule", type: ReactiveFormsModule }, { kind: "directive", type: i1$6.FormControlDirective, selector: "[formControl]", inputs: ["formControl", "disabled", "ngModel"], outputs: ["ngModelChange"], exportAs: ["ngForm"] }, { kind: "component", type: MatAutocomplete, selector: "mat-autocomplete", inputs: ["aria-label", "aria-labelledby", "displayWith", "autoActiveFirstOption", "autoSelectActiveOption", "requireSelection", "panelWidth", "disableRipple", "class", "hideSingleSelectionIndicator"], outputs: ["optionSelected", "opened", "closed", "optionActivated"], exportAs: ["matAutocomplete"] }, { kind: "component", type: MatOption, selector: "mat-option", inputs: ["value", "id", "disabled"], outputs: ["onSelectionChange"], exportAs: ["matOption"] }, { kind: "directive", type: MatTooltip, selector: "[matTooltip]", inputs: ["matTooltipPosition", "matTooltipPositionAtOrigin", "matTooltipDisabled", "matTooltipShowDelay", "matTooltipHideDelay", "matTooltipTouchGestures", "matTooltip", "matTooltipClass"], exportAs: ["matTooltip"] }, { kind: "directive", type: MatSuffix, selector: "[matSuffix], [matIconSuffix], [matTextSuffix]", inputs: ["matTextSuffix"] }, { kind: "directive", type: MatHint, selector: "mat-hint", inputs: ["align", "id"] }, { kind: "component", type: MatProgressBar, selector: "mat-progress-bar", inputs: ["color", "value", "bufferValue", "mode"], outputs: ["animationEnd"], exportAs: ["matProgressBar"] }, { kind: "pipe", type: AsyncPipe, name: "async" }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: LookupOdaPosComponent, decorators: [{
            type: Component,
            args: [{ selector: 'sii-lookup-oda-pos', providers: [
                        {
                            provide: NG_VALUE_ACCESSOR,
                            useExisting: forwardRef(() => LookupOdaPosComponent),
                            multi: true,
                        },
                        { provide: NG_VALIDATORS, useExisting: LookupOdaPosComponent, multi: true },
                    ], standalone: true, imports: [
                        MatFormField,
                        NgClass,
                        MatLabel,
                        MatInput,
                        MatAutocompleteTrigger,
                        FormsModule,
                        ReactiveFormsModule,
                        MatAutocomplete,
                        MatOption,
                        MatTooltip,
                        MatSuffix,
                        MatHint,
                        MatProgressBar,
                        AsyncPipe,
                    ], template: "<mat-form-field [appearance]=\"appearance\" class=\"lop_mff\" [ngClass]=\"{'lop_fc_invalid': !utils.odaValid}\">\r\n  <mat-label i18n=\"@@lookOdaPos__oda\" >ODA</mat-label>\r\n  <input matInput\r\n    [required]=\"required\"\r\n    aria-label=\"ODA\"\r\n    [matAutocomplete]=\"lookupOdaAutocompleteRef\"\r\n    [formControl]=\"lookupOdaComponentCtrl\"  >\r\n\r\n    <mat-autocomplete #lookupOdaAutocompleteRef=\"matAutocomplete\" class=\"lopAutoComplete\" [displayWith]=\"displayOdaFn\" (optionSelected)=\"onSelectionChanged($event)\">\r\n      @for (odaItem of odaRestObs | async; track odaItem) {\r\n        <mat-option [value]=\"odaItem\" style=\"border-bottom: 1px solid lightgray;\">\r\n          <div class=\"lopAutocompleteItems\">\r\n            <span class=\"lopAutocompleteItemsId\"> ODA/POS : <b>{{odaItem.oda}} / {{odaItem.pos}}</b></span>\r\n            <span class=\"lopAutocompleteItemsDescr\" [matTooltip]=\"odaItem.noteOda\" matTooltipShowDelay=500>{{odaItem.noteOda}}</span>\r\n            <ul class=\"lopAutocompleteListItemsDescr\">\r\n              @for (mat of odaItem.materiali; track mat) {\r\n                <li  [matTooltip]=\"mat\" matTooltipShowDelay=500>{{mat}}</li>\r\n              }\r\n            </ul>\r\n            <!-- <span class=\"lopAutocompleteItemsDescr\" [matTooltip]=\"odaItem.materiale +' - '+odaItem.descrizioneRiga\" matTooltipShowDelay=1000>{{odaItem.materiale +' - '+odaItem.descrizioneRiga}}</span>  -->\r\n          </div>\r\n        </mat-option>\r\n      }\r\n    </mat-autocomplete>\r\n\r\n    @if (selectedItem?.pos!=null) {\r\n      <div matSuffix style=\"width: 80px; \">\r\n        <div><mat-label i18n=\"@@lookOdaPos_pos\">POS</mat-label>: {{selectedItem?.pos}}</div>\r\n        <!-- disabilitato, da completare su richiesta -->\r\n        <!-- <mat-icon class=\"lopSearchIcon\" [style.visibility]=\"!(disabled!==false) ? 'initial' : 'hidden'\" style=\"cursor: pointer;\"  (click)=\"searchPopup();$event.stopPropagation();\">search</mat-icon> -->\r\n      </div>\r\n    }\r\n\r\n    @if (utils.odaLength==0) {\r\n      <mat-hint i18n=\"@@lookOdaPos_no_available_oda\">No Available Oda</mat-hint>\r\n    }\r\n  </mat-form-field>\r\n  @if (utils.loadingInProgress) {\r\n    <mat-progress-bar class=\"lopProgressBar\" mode=\"query\"></mat-progress-bar>\r\n  }\r\n", styles: [":host{position:relative}.lop_mff{width:100%}::ng-deep .lopAutoComplete .mat-mdc-option{padding:5px!important;border-bottom:1px solid lightgray;height:unset}.lopAutocompleteItems{display:flex;flex-direction:column}.lopAutocompleteListItemsDescr{padding-left:0;margin:0}.lopAutocompleteListItemsDescr>li{line-height:10px;font-size:10px;list-style-position:inside;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.lopAutocompleteItems .lopAutocompleteItemsId{line-height:12px;font-size:13px}.lopAutocompleteItems .lopAutocompleteItemsDescr{line-height:10px;font-size:10px;max-height:24px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;padding-left:8px}.lopProgressBar{height:2px;position:absolute;bottom:16px}.lop_mff .lop_pos_label{margin-top:-18px}.lop_mff.mat-form-field-appearance-outline .lop_pos_label{margin-top:-30px;background-color:#fff;width:40px;padding-left:6px;margin-left:-6px}.lop_fc_invalid.ng-touched::ng-deep .mdc-notched-outline>*{border-color:red!important}.lop_fc_invalid.ng-touched::ng-deep mat-label{color:red!important}.lop_fc_invalid.ng-touched::ng-deep .mdc-line-ripple:before,.lop_fc_invalid.ng-touched::ng-deep .mdc-line-ripple:after{border-bottom-color:red!important}.lopSearchIcon{position:absolute;top:-9px;right:0}.lop_mff.mat-form-field-appearance-outline .lopSearchIcon{top:-7px}\n"] }]
        }], ctorParameters: () => [{ type: i1.HttpClient }, { type: i1$2.MatDialog }, { type: SiiToolkitService }], propDecorators: { appearance: [{
                type: Input
            }], codSociety: [{
                type: Input
            }], codSupplier: [{
                type: Input
            }], lavMatricola: [{
                type: Input
            }], tipologie: [{
                type: Input
            }], disabled: [{
                type: Input
            }], required: [{
                type: Input
            }] } });

class SearchOdaPosDialogComponent {
    constructor(dialogRef, siiToolkitService, http, data) {
        this.dialogRef = dialogRef;
        this.siiToolkitService = siiToolkitService;
        this.http = http;
        this.data = data;
        this.odaposFormControl = new UntypedFormControl();
        this.odaposDisplayedColumns = ['oda', 'pos'];
        this.odaposResultsLength = 0;
    }
    ngAfterViewInit() {
        this.odaposSort.sortChange.subscribe(() => this.odaposPaginator.firstPage());
        this.odaposFormControl.valueChanges.subscribe(() => this.odaposPaginator.firstPage());
        merge(this.odaposSort.sortChange, this.odaposPaginator.page, this.odaposFormControl.valueChanges).pipe(startWith({}), debounceTime(500), switchMap((data) => {
            return this.fetchOdaposDataFromServer();
        })).subscribe((resp) => {
            this.updateOdaposData(resp);
        });
    }
    updateOdaposData(data) {
        this.odaposDataSource = new MatTableDataSource(data.content);
        this.odaposResultsLength = data.totalElements;
    }
    fetchOdaposDataFromServer() {
        return this.http.post(`${this.siiToolkitService.environment.domain}/lookup/oda`, {
            text: this.odaposFormControl.value,
            codSociety: this.data.codSociety,
            codSupplier: this.data.codSupplier,
            lavMatricola: this.data.lavMatricola,
            tipologie: this.data.tipologie,
            page: this.odaposPaginator.pageIndex,
            size: this.odaposPaginator.pageSize,
            sortField: this.odaposSort.active,
            sortDirection: this.odaposSort.direction.toUpperCase(),
        });
    }
    selectOdaposRow(row, event) {
        if (event.view.getSelection().type !== 'Range') {
            this.dialogRef.close(row);
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: SearchOdaPosDialogComponent, deps: [{ token: i1$2.MatDialogRef }, { token: SiiToolkitService }, { token: i1.HttpClient }, { token: MAT_DIALOG_DATA }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "18.2.13", type: SearchOdaPosDialogComponent, isStandalone: true, selector: "sii-search-oda-pos-dialog", viewQueries: [{ propertyName: "odaposPaginator", first: true, predicate: ["odaposPaginator"], descendants: true, read: MatPaginator, static: true }, { propertyName: "odaposSort", first: true, predicate: ["odaposSort"], descendants: true, read: MatSort, static: true }], ngImport: i0, template: "\r\n<div mat-dialog-content>\r\n    <mat-form-field>\r\n        <input matInput [formControl]=\"odaposFormControl\"  placeholder=\"Filter\" i18n-placeholder=\"@@siodialog_Filter\">\r\n      </mat-form-field>\r\n\r\n      <div class=\"siod_tableContainer\">\r\n        <table mat-table [dataSource]=\"odaposDataSource\" class=\"mat-elevation-z8\"\r\n        matSort matSortActive=\"oda\" matSortDisableClear matSortDirection=\"desc\" #odaposSort>\r\n\r\n          <!-- itemId Column -->\r\n          <ng-container matColumnDef=\"oda\">\r\n            <th mat-header-cell *matHeaderCellDef mat-sort-header=\"ITEM_ID\" i18n=\"@@oda\">Oda</th>\r\n            <td mat-cell *matCellDef=\"let element\"> {{element.oda}} </td>\r\n          </ng-container>\r\n\r\n          <!-- itemDescription Column -->\r\n          <ng-container matColumnDef=\"pos\">\r\n            <th mat-header-cell *matHeaderCellDef mat-sort-header=\"ITEM_DESCRIPTION\" > Pos </th>\r\n            <td mat-cell *matCellDef=\"let element\"> {{element.pos}} </td>\r\n          </ng-container>\r\n\r\n\r\n          <tr mat-header-row *matHeaderRowDef=\"odaposDisplayedColumns;sticky: true\"></tr>\r\n          <tr mat-row *matRowDef=\"let row; columns: odaposDisplayedColumns;\" (click)=\"selectOdaposRow(row,$event)\" ></tr>\r\n        </table>\r\n\r\n      </div>\r\n\r\n        <mat-paginator #odaposPaginator [length]=\"odaposResultsLength\" [pageSize]=\"10\" [pageSizeOptions]=\"[5, 10, 20]\"></mat-paginator>\r\n\r\n  </div>\r\n  <div mat-dialog-actions style=\"float:right\">\r\n    <button mat-button class=\"sii-button-light\" [mat-dialog-close] i18n=\"@@siodialog_cancel_button\">Cancel Operation</button>\r\n  </div>\r\n", styles: [""], dependencies: [{ kind: "directive", type: MatDialogContent, selector: "[mat-dialog-content], mat-dialog-content, [matDialogContent]" }, { kind: "component", type: MatFormField, selector: "mat-form-field", inputs: ["hideRequiredMarker", "color", "floatLabel", "appearance", "subscriptSizing", "hintLabel"], exportAs: ["matFormField"] }, { kind: "directive", type: MatInput, selector: "input[matInput], textarea[matInput], select[matNativeControl],      input[matNativeControl], textarea[matNativeControl]", inputs: ["disabled", "id", "placeholder", "name", "required", "type", "errorStateMatcher", "aria-describedby", "value", "readonly"], exportAs: ["matInput"] }, { kind: "ngmodule", type: FormsModule }, { kind: "directive", type: i1$6.DefaultValueAccessor, selector: "input:not([type=checkbox])[formControlName],textarea[formControlName],input:not([type=checkbox])[formControl],textarea[formControl],input:not([type=checkbox])[ngModel],textarea[ngModel],[ngDefaultControl]" }, { kind: "directive", type: i1$6.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "ngmodule", type: ReactiveFormsModule }, { kind: "directive", type: i1$6.FormControlDirective, selector: "[formControl]", inputs: ["formControl", "disabled", "ngModel"], outputs: ["ngModelChange"], exportAs: ["ngForm"] }, { kind: "component", type: MatTable, selector: "mat-table, table[mat-table]", exportAs: ["matTable"] }, { kind: "directive", type: MatSort, selector: "[matSort]", inputs: ["matSortActive", "matSortStart", "matSortDirection", "matSortDisableClear", "matSortDisabled"], outputs: ["matSortChange"], exportAs: ["matSort"] }, { kind: "directive", type: MatColumnDef, selector: "[matColumnDef]", inputs: ["matColumnDef"] }, { kind: "directive", type: MatHeaderCellDef, selector: "[matHeaderCellDef]" }, { kind: "directive", type: MatHeaderCell, selector: "mat-header-cell, th[mat-header-cell]" }, { kind: "component", type: MatSortHeader, selector: "[mat-sort-header]", inputs: ["mat-sort-header", "arrowPosition", "start", "disabled", "sortActionDescription", "disableClear"], exportAs: ["matSortHeader"] }, { kind: "directive", type: MatCellDef, selector: "[matCellDef]" }, { kind: "directive", type: MatCell, selector: "mat-cell, td[mat-cell]" }, { kind: "directive", type: MatHeaderRowDef, selector: "[matHeaderRowDef]", inputs: ["matHeaderRowDef", "matHeaderRowDefSticky"] }, { kind: "component", type: MatHeaderRow, selector: "mat-header-row, tr[mat-header-row]", exportAs: ["matHeaderRow"] }, { kind: "directive", type: MatRowDef, selector: "[matRowDef]", inputs: ["matRowDefColumns", "matRowDefWhen"] }, { kind: "component", type: MatRow, selector: "mat-row, tr[mat-row]", exportAs: ["matRow"] }, { kind: "component", type: MatPaginator, selector: "mat-paginator", inputs: ["color", "pageIndex", "length", "pageSize", "pageSizeOptions", "hidePageSize", "showFirstLastButtons", "selectConfig", "disabled"], outputs: ["page"], exportAs: ["matPaginator"] }, { kind: "directive", type: MatDialogActions, selector: "[mat-dialog-actions], mat-dialog-actions, [matDialogActions]", inputs: ["align"] }, { kind: "component", type: MatButton, selector: "    button[mat-button], button[mat-raised-button], button[mat-flat-button],    button[mat-stroked-button]  ", exportAs: ["matButton"] }, { kind: "directive", type: MatDialogClose, selector: "[mat-dialog-close], [matDialogClose]", inputs: ["aria-label", "type", "mat-dialog-close", "matDialogClose"], exportAs: ["matDialogClose"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: SearchOdaPosDialogComponent, decorators: [{
            type: Component,
            args: [{ selector: 'sii-search-oda-pos-dialog', standalone: true, imports: [
                        CdkScrollable,
                        MatDialogContent,
                        MatFormField,
                        MatInput,
                        FormsModule,
                        ReactiveFormsModule,
                        MatTable,
                        MatSort,
                        MatColumnDef,
                        MatHeaderCellDef,
                        MatHeaderCell,
                        MatSortHeader,
                        MatCellDef,
                        MatCell,
                        MatHeaderRowDef,
                        MatHeaderRow,
                        MatRowDef,
                        MatRow,
                        MatPaginator,
                        MatDialogActions,
                        MatButton,
                        MatDialogClose,
                    ], template: "\r\n<div mat-dialog-content>\r\n    <mat-form-field>\r\n        <input matInput [formControl]=\"odaposFormControl\"  placeholder=\"Filter\" i18n-placeholder=\"@@siodialog_Filter\">\r\n      </mat-form-field>\r\n\r\n      <div class=\"siod_tableContainer\">\r\n        <table mat-table [dataSource]=\"odaposDataSource\" class=\"mat-elevation-z8\"\r\n        matSort matSortActive=\"oda\" matSortDisableClear matSortDirection=\"desc\" #odaposSort>\r\n\r\n          <!-- itemId Column -->\r\n          <ng-container matColumnDef=\"oda\">\r\n            <th mat-header-cell *matHeaderCellDef mat-sort-header=\"ITEM_ID\" i18n=\"@@oda\">Oda</th>\r\n            <td mat-cell *matCellDef=\"let element\"> {{element.oda}} </td>\r\n          </ng-container>\r\n\r\n          <!-- itemDescription Column -->\r\n          <ng-container matColumnDef=\"pos\">\r\n            <th mat-header-cell *matHeaderCellDef mat-sort-header=\"ITEM_DESCRIPTION\" > Pos </th>\r\n            <td mat-cell *matCellDef=\"let element\"> {{element.pos}} </td>\r\n          </ng-container>\r\n\r\n\r\n          <tr mat-header-row *matHeaderRowDef=\"odaposDisplayedColumns;sticky: true\"></tr>\r\n          <tr mat-row *matRowDef=\"let row; columns: odaposDisplayedColumns;\" (click)=\"selectOdaposRow(row,$event)\" ></tr>\r\n        </table>\r\n\r\n      </div>\r\n\r\n        <mat-paginator #odaposPaginator [length]=\"odaposResultsLength\" [pageSize]=\"10\" [pageSizeOptions]=\"[5, 10, 20]\"></mat-paginator>\r\n\r\n  </div>\r\n  <div mat-dialog-actions style=\"float:right\">\r\n    <button mat-button class=\"sii-button-light\" [mat-dialog-close] i18n=\"@@siodialog_cancel_button\">Cancel Operation</button>\r\n  </div>\r\n" }]
        }], ctorParameters: () => [{ type: i1$2.MatDialogRef }, { type: SiiToolkitService }, { type: i1.HttpClient }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [MAT_DIALOG_DATA]
                }] }], propDecorators: { odaposPaginator: [{
                type: ViewChild,
                args: ['odaposPaginator', { read: MatPaginator, static: true }]
            }], odaposSort: [{
                type: ViewChild,
                args: ['odaposSort', { read: MatSort, static: true }]
            }] } });

class LookupEmployeeComponent {
    constructor() {
        this.appearance = 'outline';
        this.minLength = 3;
        this.disabled = false;
        this.required = false;
        this.valueChange = new EventEmitter();
        this.hideWorkerContactInformation = false;
        this.loadOnInit = false;
        this.selectedItem = null;
        this.lookupEmployeeComponentCtrl = new UntypedFormControl();
        this.utils = {
            employeeValid: true,
            loadingInProgress: false,
        };
        this.propagateChange = () => { };
        this.onTouchedCallback = () => { };
        this.validatorCallback = () => { };
        this.employeeRestObs = this.lookupEmployeeComponentCtrl.valueChanges
            .pipe(debounceTime(500), tap((text) => { if (typeof text === 'string' && this.selectedItem != null) {
            this.onChange(null);
        } }), 
        // tslint:disable-next-line:max-line-length
        map((text) => (text == null || (typeof text === 'object' && text.workerId === undefined) ? '' : text)), filter((text) => typeof text === 'string' && text.length >= this.minLength), distinctUntilChanged(), tap((res) => this.utils.loadingInProgress = true), switchMap((val) => this.restService(val)), tap((res) => {
            this.utils.loadingInProgress = false;
        }));
    }
    ngAfterViewInit() {
        if (this.loadOnInit === true) {
            setTimeout(() => {
                this.lookupEmployeeComponentCtrl.setValue('');
            }, 1000);
        }
    }
    onSelectionChanged(event) {
        this.onChange(event.option.value);
    }
    displayEmployeeFn(employee) {
        return employee && employee.workerId !== undefined ? employee.workerId : undefined;
    }
    onChange(item) {
        this.onTouchedCallback();
        this.selectedItem = item;
        this.propagateChange(this.selectedItem);
        this.valueChange.next(this.selectedItem);
    }
    writeValue(obj) {
        this.selectedItem = obj;
        this.lookupEmployeeComponentCtrl.setValue(this.selectedItem);
    }
    registerOnChange(fn) { this.propagateChange = fn; }
    registerOnTouched(fn) { this.onTouchedCallback = fn; }
    setDisabledState(isDisabled) {
        this.disabled = isDisabled;
        if (this.disabled) {
            this.lookupEmployeeComponentCtrl.disable();
        }
        else {
            this.lookupEmployeeComponentCtrl.enable();
        }
    }
    validate(control) {
        const employeeval = this.lookupEmployeeComponentCtrl.value;
        const respErr = {};
        if (employeeval === null || typeof employeeval === 'string') {
            if (this.required !== false) {
                respErr.employeeValid = false;
                respErr.required = true;
            }
            else if ((employeeval || '').trim() !== '') {
                respErr.employeeValid = false;
            }
        }
        this.utils.employeeValid = Object.keys(respErr).length === 0;
        return this.utils.employeeValid ? null : respErr;
    }
    registerOnValidatorChange(fn) {
        this.validatorCallback = fn;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: LookupEmployeeComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "18.2.13", type: LookupEmployeeComponent, isStandalone: true, selector: "sii-lookup-employee", inputs: { appearance: "appearance", minLength: "minLength", label: "label", disabled: "disabled", required: "required", restService: "restService", hideWorkerContactInformation: "hideWorkerContactInformation", loadOnInit: "loadOnInit", siiWorkerContactInformationServiceUrl: "siiWorkerContactInformationServiceUrl" }, outputs: { valueChange: "valueChange" }, providers: [
            {
                provide: NG_VALUE_ACCESSOR,
                useExisting: forwardRef(() => LookupEmployeeComponent),
                multi: true,
            },
            { provide: NG_VALIDATORS, useExisting: LookupEmployeeComponent, multi: true },
        ], ngImport: i0, template: "<mat-form-field [appearance]=\"appearance\" class=\"lempl_mff\" [ngClass]=\"{'lempl_fc_invalid': !utils.employeeValid}\">\r\n  @if (!label) {\r\n    <mat-label i18n=\"@@lookEmployee__employee\" >Employee</mat-label>\r\n  }\r\n  @if (!!label) {\r\n    <mat-label >{{label}}</mat-label>\r\n  }\r\n  <input matInput\r\n    [required]=\"required\"\r\n    aria-label=\"Employee\"\r\n    [matAutocomplete]=\"lookupEmployeeAutocompleteRef\"\r\n    [formControl]=\"lookupEmployeeComponentCtrl\"  >\r\n\r\n    <mat-autocomplete #lookupEmployeeAutocompleteRef=\"matAutocomplete\" class=\"lemplAutoComplete\" [displayWith]=\"displayEmployeeFn\" (optionSelected)=\"onSelectionChanged($event)\">\r\n      @for (employeeItem of employeeRestObs | async; track employeeItem) {\r\n        <mat-option [value]=\"employeeItem\" style=\"border-bottom: 1px solid lightgray;min-height: 35px;\">\r\n          <div class=\"lioAutocompleteItems\">\r\n            <span class=\"lioAutocompleteItemsId\">{{employeeItem.workerId}}</span>\r\n            <span class=\"lioAutocompleteItemsDescr\">{{employeeItem.surname}} {{employeeItem.name}}</span>\r\n          </div>\r\n        </mat-option>\r\n      }\r\n    </mat-autocomplete>\r\n    @if (!hideWorkerContactInformation && selectedItem!=undefined && selectedItem.workerId!=undefined) {\r\n      <sii-worker-contact-information (click)=\"$event.stopPropagation()\" matSuffix [serviceUrl]=\"siiWorkerContactInformationServiceUrl\" [workerId]=\"selectedItem.workerId\"></sii-worker-contact-information>\r\n    }\r\n    @if (selectedItem!=undefined && selectedItem.workerId!=undefined) {\r\n      <mat-hint class=\"lioHint\" [matTooltip]=\"selectedItem.surname+' '+selectedItem.name\" >{{selectedItem.surname+' '+selectedItem.name}}</mat-hint>\r\n    }\r\n  </mat-form-field>\r\n  @if (utils.loadingInProgress) {\r\n    <mat-progress-bar class=\"lemplProgressBar\" mode=\"query\"></mat-progress-bar>\r\n  }\r\n", styles: [":host{position:relative;display:block}.lempl_mff{width:100%}::ng-deep .lemplAutoComplete .mat-mdc-option{padding:5px!important;border-bottom:1px solid lightgray;height:unset}.lemplProgressBar{height:2px;position:absolute;bottom:16px}.lempl_fc_invalid.ng-touched::ng-deep .mdc-notched-outline>*{border-color:red!important}.lempl_fc_invalid.ng-touched::ng-deep mat-label{color:red!important}.lempl_fc_invalid.ng-touched::ng-deep .mdc-line-ripple:before,.lempl_fc_invalid.ng-touched::ng-deep .mdc-line-ripple:after{border-bottom-color:red!important}.lemplSearchIcon{position:absolute;top:-9px;right:0}.lempl_mff.mat-form-field-appearance-outline .lemplSearchIcon{top:-7px}.lioHint{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.lioAutocompleteItems{display:flex;flex-direction:column}.lioAutocompleteItems .lioAutocompleteItemsId{line-height:20px}.lioAutocompleteItems .lioAutocompleteItemsDescr{line-height:12px;font-size:10px;max-height:24px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}\n"], dependencies: [{ kind: "component", type: MatFormField, selector: "mat-form-field", inputs: ["hideRequiredMarker", "color", "floatLabel", "appearance", "subscriptSizing", "hintLabel"], exportAs: ["matFormField"] }, { kind: "directive", type: NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: MatLabel, selector: "mat-label" }, { kind: "directive", type: MatInput, selector: "input[matInput], textarea[matInput], select[matNativeControl],      input[matNativeControl], textarea[matNativeControl]", inputs: ["disabled", "id", "placeholder", "name", "required", "type", "errorStateMatcher", "aria-describedby", "value", "readonly"], exportAs: ["matInput"] }, { kind: "directive", type: MatAutocompleteTrigger, selector: "input[matAutocomplete], textarea[matAutocomplete]", inputs: ["matAutocomplete", "matAutocompletePosition", "matAutocompleteConnectedTo", "autocomplete", "matAutocompleteDisabled"], exportAs: ["matAutocompleteTrigger"] }, { kind: "ngmodule", type: FormsModule }, { kind: "directive", type: i1$6.DefaultValueAccessor, selector: "input:not([type=checkbox])[formControlName],textarea[formControlName],input:not([type=checkbox])[formControl],textarea[formControl],input:not([type=checkbox])[ngModel],textarea[ngModel],[ngDefaultControl]" }, { kind: "directive", type: i1$6.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i1$6.RequiredValidator, selector: ":not([type=checkbox])[required][formControlName],:not([type=checkbox])[required][formControl],:not([type=checkbox])[required][ngModel]", inputs: ["required"] }, { kind: "ngmodule", type: ReactiveFormsModule }, { kind: "directive", type: i1$6.FormControlDirective, selector: "[formControl]", inputs: ["formControl", "disabled", "ngModel"], outputs: ["ngModelChange"], exportAs: ["ngForm"] }, { kind: "component", type: MatAutocomplete, selector: "mat-autocomplete", inputs: ["aria-label", "aria-labelledby", "displayWith", "autoActiveFirstOption", "autoSelectActiveOption", "requireSelection", "panelWidth", "disableRipple", "class", "hideSingleSelectionIndicator"], outputs: ["optionSelected", "opened", "closed", "optionActivated"], exportAs: ["matAutocomplete"] }, { kind: "component", type: MatOption, selector: "mat-option", inputs: ["value", "id", "disabled"], outputs: ["onSelectionChange"], exportAs: ["matOption"] }, { kind: "component", type: WorkerContactInformationComponent, selector: "sii-worker-contact-information", inputs: ["workerId", "serviceUrl"] }, { kind: "directive", type: MatSuffix, selector: "[matSuffix], [matIconSuffix], [matTextSuffix]", inputs: ["matTextSuffix"] }, { kind: "directive", type: MatHint, selector: "mat-hint", inputs: ["align", "id"] }, { kind: "directive", type: MatTooltip, selector: "[matTooltip]", inputs: ["matTooltipPosition", "matTooltipPositionAtOrigin", "matTooltipDisabled", "matTooltipShowDelay", "matTooltipHideDelay", "matTooltipTouchGestures", "matTooltip", "matTooltipClass"], exportAs: ["matTooltip"] }, { kind: "component", type: MatProgressBar, selector: "mat-progress-bar", inputs: ["color", "value", "bufferValue", "mode"], outputs: ["animationEnd"], exportAs: ["matProgressBar"] }, { kind: "pipe", type: AsyncPipe, name: "async" }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: LookupEmployeeComponent, decorators: [{
            type: Component,
            args: [{ selector: 'sii-lookup-employee', providers: [
                        {
                            provide: NG_VALUE_ACCESSOR,
                            useExisting: forwardRef(() => LookupEmployeeComponent),
                            multi: true,
                        },
                        { provide: NG_VALIDATORS, useExisting: LookupEmployeeComponent, multi: true },
                    ], standalone: true, imports: [
                        MatFormField,
                        NgClass,
                        MatLabel,
                        MatInput,
                        MatAutocompleteTrigger,
                        FormsModule,
                        ReactiveFormsModule,
                        MatAutocomplete,
                        MatOption,
                        WorkerContactInformationComponent,
                        MatSuffix,
                        MatHint,
                        MatTooltip,
                        MatProgressBar,
                        AsyncPipe,
                    ], template: "<mat-form-field [appearance]=\"appearance\" class=\"lempl_mff\" [ngClass]=\"{'lempl_fc_invalid': !utils.employeeValid}\">\r\n  @if (!label) {\r\n    <mat-label i18n=\"@@lookEmployee__employee\" >Employee</mat-label>\r\n  }\r\n  @if (!!label) {\r\n    <mat-label >{{label}}</mat-label>\r\n  }\r\n  <input matInput\r\n    [required]=\"required\"\r\n    aria-label=\"Employee\"\r\n    [matAutocomplete]=\"lookupEmployeeAutocompleteRef\"\r\n    [formControl]=\"lookupEmployeeComponentCtrl\"  >\r\n\r\n    <mat-autocomplete #lookupEmployeeAutocompleteRef=\"matAutocomplete\" class=\"lemplAutoComplete\" [displayWith]=\"displayEmployeeFn\" (optionSelected)=\"onSelectionChanged($event)\">\r\n      @for (employeeItem of employeeRestObs | async; track employeeItem) {\r\n        <mat-option [value]=\"employeeItem\" style=\"border-bottom: 1px solid lightgray;min-height: 35px;\">\r\n          <div class=\"lioAutocompleteItems\">\r\n            <span class=\"lioAutocompleteItemsId\">{{employeeItem.workerId}}</span>\r\n            <span class=\"lioAutocompleteItemsDescr\">{{employeeItem.surname}} {{employeeItem.name}}</span>\r\n          </div>\r\n        </mat-option>\r\n      }\r\n    </mat-autocomplete>\r\n    @if (!hideWorkerContactInformation && selectedItem!=undefined && selectedItem.workerId!=undefined) {\r\n      <sii-worker-contact-information (click)=\"$event.stopPropagation()\" matSuffix [serviceUrl]=\"siiWorkerContactInformationServiceUrl\" [workerId]=\"selectedItem.workerId\"></sii-worker-contact-information>\r\n    }\r\n    @if (selectedItem!=undefined && selectedItem.workerId!=undefined) {\r\n      <mat-hint class=\"lioHint\" [matTooltip]=\"selectedItem.surname+' '+selectedItem.name\" >{{selectedItem.surname+' '+selectedItem.name}}</mat-hint>\r\n    }\r\n  </mat-form-field>\r\n  @if (utils.loadingInProgress) {\r\n    <mat-progress-bar class=\"lemplProgressBar\" mode=\"query\"></mat-progress-bar>\r\n  }\r\n", styles: [":host{position:relative;display:block}.lempl_mff{width:100%}::ng-deep .lemplAutoComplete .mat-mdc-option{padding:5px!important;border-bottom:1px solid lightgray;height:unset}.lemplProgressBar{height:2px;position:absolute;bottom:16px}.lempl_fc_invalid.ng-touched::ng-deep .mdc-notched-outline>*{border-color:red!important}.lempl_fc_invalid.ng-touched::ng-deep mat-label{color:red!important}.lempl_fc_invalid.ng-touched::ng-deep .mdc-line-ripple:before,.lempl_fc_invalid.ng-touched::ng-deep .mdc-line-ripple:after{border-bottom-color:red!important}.lemplSearchIcon{position:absolute;top:-9px;right:0}.lempl_mff.mat-form-field-appearance-outline .lemplSearchIcon{top:-7px}.lioHint{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.lioAutocompleteItems{display:flex;flex-direction:column}.lioAutocompleteItems .lioAutocompleteItemsId{line-height:20px}.lioAutocompleteItems .lioAutocompleteItemsDescr{line-height:12px;font-size:10px;max-height:24px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}\n"] }]
        }], ctorParameters: () => [], propDecorators: { appearance: [{
                type: Input
            }], minLength: [{
                type: Input
            }], label: [{
                type: Input
            }], disabled: [{
                type: Input
            }], required: [{
                type: Input
            }], restService: [{
                type: Input
            }], valueChange: [{
                type: Output
            }], hideWorkerContactInformation: [{
                type: Input
            }], loadOnInit: [{
                type: Input
            }], siiWorkerContactInformationServiceUrl: [{
                type: Input
            }] } });

class GlobalSearchComponent {
    get haveValue() {
        return this.inputFormCtrl.value != null && this.inputFormCtrl.value.length > 0;
    }
    constructor() {
        this.label = 'Search';
        this.inputFormCtrl = new UntypedFormControl();
        this.propagateChange = () => { };
        this.onTouchedCallback = () => { };
        this.validatorCallback = () => { };
    }
    validate(control) {
        return null;
    }
    writeValue(obj) {
        this.inputFormCtrl.setValue(obj);
    }
    registerOnChange(fn) {
        this.propagateChange = fn;
    }
    registerOnTouched(fn) {
        this.onTouchedCallback = fn;
    }
    registerOnValidatorChange(fn) {
        this.validatorCallback = fn;
    }
    setDisabledState(isDisabled) {
        if (isDisabled) {
            this.inputFormCtrl.disable();
        }
        else {
            this.inputFormCtrl.enable();
        }
    }
    ngAfterViewInit() {
        this.initSiiFacet();
    }
    initSiiFacet() {
        this.inputFormCtrl.valueChanges.subscribe((val) => {
            this.propagateChange(val);
        });
    }
    focusInput() {
        this.inputElement.nativeElement.focus();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: GlobalSearchComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "18.2.13", type: GlobalSearchComponent, isStandalone: true, selector: "sii-global-search", inputs: { label: "label" }, host: { properties: { "class.globalSearchWithValue": "this.haveValue" } }, providers: [
            {
                provide: NG_VALUE_ACCESSOR,
                useExisting: forwardRef(() => GlobalSearchComponent),
                multi: true,
            },
            { provide: NG_VALIDATORS, useExisting: GlobalSearchComponent, multi: true },
        ], viewQueries: [{ propertyName: "inputElement", first: true, predicate: ["searchBox"], descendants: true }], ngImport: i0, template: "<input [formControl]=\"inputFormCtrl\"   #searchBox id=\"search-box\"\r\n    i18n-placeholder=\"@@Full_text_search\"\r\n    [placeholder]=\"label\"\r\n    type=\"text\">\r\n\r\n<mat-icon class=\"search-icon\" (click)=\"focusInput()\">search</mat-icon>\r\n\r\n", styles: [":host{display:flex;align-items:center;margin:auto 20px;height:41px;background-color:#001f36;border-radius:6px;padding:0 14px;color:#ffffff8f}.search-icon{margin:0 0 0 8px}input#search-box{flex:1 1 auto;outline:none;border:0;background:transparent;width:100%;font-size:1.1em;color:#fff}input#search-box::placeholder{color:#ffffff8f;font-size:11px;opacity:1}input#search-box:-ms-input-placeholder{color:#ffffff8f}input#search-box::-ms-input-placeholder{color:#ffffff8f}input#search-box:focus,.globalSearchWithValue{background-color:#fff!important;color:#004191}:host:focus-within,:host.globalSearchWithValue{background-color:#fff!important;color:#004191!important}:host:focus-within input#search-box,:host.globalSearchWithValue input#search-box{color:#004191!important}@media only screen and (max-width: 500px){:host{background-color:transparent}input#search-box{position:absolute;color:transparent!important;width:40px;height:50px}input#search-box:focus{display:block;position:relative;width:unset;height:unset}input#search-box::placeholder{color:transparent}input#search-box:-ms-input-placeholder{color:transparent}input#search-box::-ms-input-placeholder{color:transparent}:host:focus-within{display:flex;position:absolute;left:5px;margin:0;height:50px;top:8px;z-index:1;width:calc(100% - 10px);box-sizing:border-box}}\n"], dependencies: [{ kind: "ngmodule", type: FormsModule }, { kind: "directive", type: i1$6.DefaultValueAccessor, selector: "input:not([type=checkbox])[formControlName],textarea[formControlName],input:not([type=checkbox])[formControl],textarea[formControl],input:not([type=checkbox])[ngModel],textarea[ngModel],[ngDefaultControl]" }, { kind: "directive", type: i1$6.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "ngmodule", type: ReactiveFormsModule }, { kind: "directive", type: i1$6.FormControlDirective, selector: "[formControl]", inputs: ["formControl", "disabled", "ngModel"], outputs: ["ngModelChange"], exportAs: ["ngForm"] }, { kind: "component", type: MatIcon, selector: "mat-icon", inputs: ["color", "inline", "svgIcon", "fontSet", "fontIcon"], exportAs: ["matIcon"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: GlobalSearchComponent, decorators: [{
            type: Component,
            args: [{ selector: 'sii-global-search', providers: [
                        {
                            provide: NG_VALUE_ACCESSOR,
                            useExisting: forwardRef(() => GlobalSearchComponent),
                            multi: true,
                        },
                        { provide: NG_VALIDATORS, useExisting: GlobalSearchComponent, multi: true },
                    ], standalone: true, imports: [
                        FormsModule,
                        ReactiveFormsModule,
                        MatIcon,
                    ], template: "<input [formControl]=\"inputFormCtrl\"   #searchBox id=\"search-box\"\r\n    i18n-placeholder=\"@@Full_text_search\"\r\n    [placeholder]=\"label\"\r\n    type=\"text\">\r\n\r\n<mat-icon class=\"search-icon\" (click)=\"focusInput()\">search</mat-icon>\r\n\r\n", styles: [":host{display:flex;align-items:center;margin:auto 20px;height:41px;background-color:#001f36;border-radius:6px;padding:0 14px;color:#ffffff8f}.search-icon{margin:0 0 0 8px}input#search-box{flex:1 1 auto;outline:none;border:0;background:transparent;width:100%;font-size:1.1em;color:#fff}input#search-box::placeholder{color:#ffffff8f;font-size:11px;opacity:1}input#search-box:-ms-input-placeholder{color:#ffffff8f}input#search-box::-ms-input-placeholder{color:#ffffff8f}input#search-box:focus,.globalSearchWithValue{background-color:#fff!important;color:#004191}:host:focus-within,:host.globalSearchWithValue{background-color:#fff!important;color:#004191!important}:host:focus-within input#search-box,:host.globalSearchWithValue input#search-box{color:#004191!important}@media only screen and (max-width: 500px){:host{background-color:transparent}input#search-box{position:absolute;color:transparent!important;width:40px;height:50px}input#search-box:focus{display:block;position:relative;width:unset;height:unset}input#search-box::placeholder{color:transparent}input#search-box:-ms-input-placeholder{color:transparent}input#search-box::-ms-input-placeholder{color:transparent}:host:focus-within{display:flex;position:absolute;left:5px;margin:0;height:50px;top:8px;z-index:1;width:calc(100% - 10px);box-sizing:border-box}}\n"] }]
        }], ctorParameters: () => [], propDecorators: { label: [{
                type: Input
            }], inputElement: [{
                type: ViewChild,
                args: ['searchBox', { static: false }]
            }], haveValue: [{
                type: HostBinding,
                args: ['class.globalSearchWithValue']
            }] } });

class GroupListToolbarComponent {
    constructor(sanitizer, el) {
        this.sanitizer = sanitizer;
        this.el = el;
        this.prev = "0px";
        this.utils = {
            plt: null,
            lt: null,
        };
        window.addEventListener('listToolbarToggled', () => {
            // workaround per far rerendizzare lo sfondo al toggle
            this.el.nativeElement.style.color = 'white';
            setTimeout(() => {
                this.el.nativeElement.style.color = '';
            }, 0);
        });
    }
    ngAfterViewInit() {
        Promise.resolve().then(() => {
            if (!!this.group.parentGroupLabelTransform) {
                this.utils.plt = this.sanitizer.bypassSecurityTrustHtml(this.group.parentGroupLabelTransform(this.group.parentGroupKey, this.group.parentGroupValue, this.group.items));
            }
            if (!!this.group.groupLabelTransform) {
                this.utils.lt = this.sanitizer.bypassSecurityTrustHtml(this.group.groupLabelTransform(this.group.key, this.group.label, this.group.items));
            }
            setTimeout(() => {
                this.evaluateTop();
            }, 500);
        });
    }
    evaluateTop() {
        if (!this.group.isFirstOfparentGroup) {
            const e = this.el.nativeElement;
            if (e.parentElement == null) {
                return;
            }
            const allGroups = e.parentElement.querySelectorAll("sii-group-list-toolbar");
            let prevItem;
            for (let i = 0; i <= allGroups.length; i++) {
                if (allGroups[i].querySelectorAll(".lt_box_parent").length > 0) {
                    prevItem = allGroups[i];
                }
                if (allGroups[i] == this.el.nativeElement) {
                    break;
                }
            }
            if (prevItem != null) {
                prevItem.getElementsByClassName('lt_box_parent');
                this.prev = prevItem.getElementsByClassName('lt_box_parent')[0].getBoundingClientRect().height + "px";
            }
            else {
                this.prev = "0px";
            }
        }
    }
    toggleGroup() {
        this.ds.toggleGroup(this.group);
        this.refresh();
    }
    toggleParentGroup() {
        this.ds.toggleparentGroup(this.group.parentGroupKey);
        this.refresh();
    }
    refresh() {
        window.dispatchEvent(new CustomEvent('listToolbarToggled'));
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: GroupListToolbarComponent, deps: [{ token: i1$4.DomSanitizer }, { token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "18.2.13", type: GroupListToolbarComponent, isStandalone: true, selector: "sii-group-list-toolbar", inputs: { ds: "ds", group: "group" }, host: { properties: { "style.--prevGroupParent": "this.prev" } }, ngImport: i0, template: "\r\n@if (group.isFirstOfparentGroup) {\r\n  <div class=\"lt_box lt_box_parent \">\r\n    <button  class=\"expPB\" mat-icon-button  aria-label=\"expand/reduce group\" (click)=\"toggleParentGroup();\">\r\n      @switch (ds.isParentGroupCollapsed(group.parentGroupKey)) {\r\n        @case (true) {\r\n          <mat-icon>expand_more</mat-icon>\r\n        }\r\n        @case (false) {\r\n          <mat-icon>expand_less</mat-icon>\r\n        }\r\n      }\r\n    </button>\r\n    <div class=\"lt_parentlabel\">\r\n      @if (!!group.parentGroupLabelTransform) {\r\n        <div [innerHtml]=\"utils.plt\"></div>\r\n      }\r\n      @if (!group.parentGroupLabelTransform) {\r\n        <div>{{group.parentGroupValue}}</div>\r\n      }\r\n      @if (ds.isParentGroupCollapsed(group.parentGroupKey)) {\r\n        <sii-badge>{{ds.parentGroupSize(group.parentGroupKey)}}</sii-badge>\r\n      }\r\n    </div>\r\n\r\n    @if(group.parentGroupAction!=null  ){\r\n      <button class=\"actionButton\" [style.display]=\"parentMenuGroup?.items?.length>0 ? 'block':'none'\"  mat-icon-button [matMenuTriggerFor]=\"parentMenuGroup\"><mat-icon>more_vert</mat-icon></button>\r\n      <mat-menu #parentMenuGroup=\"matMenu\">\r\n        @for (mi of  group.parentGroupAction; track mi) {\r\n          @if(  mi.visible==null || mi.visible(group.parentGroupKey,group.parentGroupValue,group.items)){\r\n            <button   mat-menu-item (click)=\"mi.action(group.parentGroupKey,group.parentGroupValue,group.items)\"><mat-icon>{{mi.icon}}</mat-icon>{{mi.label}}</button>\r\n          }\r\n        }\r\n      </mat-menu> \r\n    }\r\n  </div>\r\n}\r\n\r\n\r\n\r\n\r\n@if (!ds.isParentGroupCollapsed(group.parentGroupKey)) {\r\n  <div class=\"lt_box\">\r\n    <button class=\"expB\" (click)=\"toggleGroup();\"   mat-icon-button   aria-label=\"expand/reduce group\">\r\n      @switch (ds.isGroupCollapsed(group.key)) {\r\n        @case (true) {\r\n          <mat-icon>expand_more</mat-icon>\r\n        }\r\n        @case (false) {\r\n          <mat-icon>expand_less</mat-icon>\r\n        }\r\n      }\r\n    </button>\r\n    <div class=\"lt_label\">\r\n      @if (!!group.groupLabelTransform) {\r\n        <div  [innerHtml]=\"utils.lt\"></div>\r\n      }\r\n      @if (!group.groupLabelTransform) {\r\n        <div>{{group.label}}</div>\r\n      }\r\n      @if (ds.isGroupCollapsed(group.key)) {\r\n        <sii-badge>{{group.items.length}}</sii-badge>\r\n      }\r\n    </div>\r\n\r\n    @if(group.groupAction!=null  ){\r\n      <button class=\"actionButton\"   [style.display]=\"menuGroup?.items?.length>0 ? 'block':'none'\" mat-icon-button [matMenuTriggerFor]=\"menuGroup\"><mat-icon>more_vert</mat-icon></button>\r\n      <mat-menu #menuGroup=\"matMenu\">\r\n        @for (mi of  group.groupAction; track mi) {\r\n          @if(mi.visible==null || mi.visible(group.key,group.label,group.items)){\r\n          <button mat-menu-item  (click)=\"mi.action(group.key,group.label,group.items)\"><mat-icon>{{mi.icon}}</mat-icon>{{mi.label}}</button>\r\n       }\r\n      }\r\n      </mat-menu> \r\n    }\r\n\r\n  </div>\r\n}\r\n\r\n", styles: [":host{display:flex;flex-direction:column;width:100%}:host.refresh{background-color:red}.lt_box{display:flex;width:100%;color:#ffffffc7;align-items:center}.lt_label{flex:1;margin:auto;padding-left:10px;font-size:18px;letter-spacing:.84px;font-family:neue-haas-grotesk-display,Roboto,Helvetica Neue,\"sans-serif\";line-height:20px;display:flex;align-items:center}.lt_parentlabel{flex:1;margin:auto;padding-left:10px;font-size:28px;letter-spacing:.84px;font-family:neue-haas-grotesk-display,Roboto,Helvetica Neue,\"sans-serif\";line-height:30px;display:flex;align-items:center}.lt_parentlabel>div,.lt_label>div{max-width:100%;display:-webkit-box;-webkit-line-clamp:1;-webkit-box-orient:vertical;overflow:hidden}sii-badge{font-size:16px;background-color:#04202e8f;margin-left:10px}.expB,.expPB{transform:scale(.8)}.expB mat-icon,.expPB mat-icon{transform:scale(2);display:block}@media screen and (max-width: 992px){.lt_label{font-size:16px;line-height:18px}.lt_parentlabel{font-size:18px;line-height:20px}}sii-badge{padding:1px 12px}\n"], dependencies: [{ kind: "component", type: MatIconButton, selector: "button[mat-icon-button]", exportAs: ["matButton"] }, { kind: "component", type: MatIcon, selector: "mat-icon", inputs: ["color", "inline", "svgIcon", "fontSet", "fontIcon"], exportAs: ["matIcon"] }, { kind: "component", type: BadgeComponent, selector: "sii-badge", inputs: ["appearance", "background", "color"] }, { kind: "component", type: MatMenu, selector: "mat-menu", inputs: ["backdropClass", "aria-label", "aria-labelledby", "aria-describedby", "xPosition", "yPosition", "overlapTrigger", "hasBackdrop", "class", "classList"], outputs: ["closed", "close"], exportAs: ["matMenu"] }, { kind: "directive", type: MatMenuTrigger, selector: "[mat-menu-trigger-for], [matMenuTriggerFor]", inputs: ["mat-menu-trigger-for", "matMenuTriggerFor", "matMenuTriggerData", "matMenuTriggerRestoreFocus"], outputs: ["menuOpened", "onMenuOpen", "menuClosed", "onMenuClose"], exportAs: ["matMenuTrigger"] }, { kind: "component", type: MatMenuItem, selector: "[mat-menu-item]", inputs: ["role", "disabled", "disableRipple"], exportAs: ["matMenuItem"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: GroupListToolbarComponent, decorators: [{
            type: Component,
            args: [{ selector: 'sii-group-list-toolbar', standalone: true, imports: [MatIconButton, MatIcon, BadgeComponent, MatMenu, MatMenuTrigger, MatMenuItem], template: "\r\n@if (group.isFirstOfparentGroup) {\r\n  <div class=\"lt_box lt_box_parent \">\r\n    <button  class=\"expPB\" mat-icon-button  aria-label=\"expand/reduce group\" (click)=\"toggleParentGroup();\">\r\n      @switch (ds.isParentGroupCollapsed(group.parentGroupKey)) {\r\n        @case (true) {\r\n          <mat-icon>expand_more</mat-icon>\r\n        }\r\n        @case (false) {\r\n          <mat-icon>expand_less</mat-icon>\r\n        }\r\n      }\r\n    </button>\r\n    <div class=\"lt_parentlabel\">\r\n      @if (!!group.parentGroupLabelTransform) {\r\n        <div [innerHtml]=\"utils.plt\"></div>\r\n      }\r\n      @if (!group.parentGroupLabelTransform) {\r\n        <div>{{group.parentGroupValue}}</div>\r\n      }\r\n      @if (ds.isParentGroupCollapsed(group.parentGroupKey)) {\r\n        <sii-badge>{{ds.parentGroupSize(group.parentGroupKey)}}</sii-badge>\r\n      }\r\n    </div>\r\n\r\n    @if(group.parentGroupAction!=null  ){\r\n      <button class=\"actionButton\" [style.display]=\"parentMenuGroup?.items?.length>0 ? 'block':'none'\"  mat-icon-button [matMenuTriggerFor]=\"parentMenuGroup\"><mat-icon>more_vert</mat-icon></button>\r\n      <mat-menu #parentMenuGroup=\"matMenu\">\r\n        @for (mi of  group.parentGroupAction; track mi) {\r\n          @if(  mi.visible==null || mi.visible(group.parentGroupKey,group.parentGroupValue,group.items)){\r\n            <button   mat-menu-item (click)=\"mi.action(group.parentGroupKey,group.parentGroupValue,group.items)\"><mat-icon>{{mi.icon}}</mat-icon>{{mi.label}}</button>\r\n          }\r\n        }\r\n      </mat-menu> \r\n    }\r\n  </div>\r\n}\r\n\r\n\r\n\r\n\r\n@if (!ds.isParentGroupCollapsed(group.parentGroupKey)) {\r\n  <div class=\"lt_box\">\r\n    <button class=\"expB\" (click)=\"toggleGroup();\"   mat-icon-button   aria-label=\"expand/reduce group\">\r\n      @switch (ds.isGroupCollapsed(group.key)) {\r\n        @case (true) {\r\n          <mat-icon>expand_more</mat-icon>\r\n        }\r\n        @case (false) {\r\n          <mat-icon>expand_less</mat-icon>\r\n        }\r\n      }\r\n    </button>\r\n    <div class=\"lt_label\">\r\n      @if (!!group.groupLabelTransform) {\r\n        <div  [innerHtml]=\"utils.lt\"></div>\r\n      }\r\n      @if (!group.groupLabelTransform) {\r\n        <div>{{group.label}}</div>\r\n      }\r\n      @if (ds.isGroupCollapsed(group.key)) {\r\n        <sii-badge>{{group.items.length}}</sii-badge>\r\n      }\r\n    </div>\r\n\r\n    @if(group.groupAction!=null  ){\r\n      <button class=\"actionButton\"   [style.display]=\"menuGroup?.items?.length>0 ? 'block':'none'\" mat-icon-button [matMenuTriggerFor]=\"menuGroup\"><mat-icon>more_vert</mat-icon></button>\r\n      <mat-menu #menuGroup=\"matMenu\">\r\n        @for (mi of  group.groupAction; track mi) {\r\n          @if(mi.visible==null || mi.visible(group.key,group.label,group.items)){\r\n          <button mat-menu-item  (click)=\"mi.action(group.key,group.label,group.items)\"><mat-icon>{{mi.icon}}</mat-icon>{{mi.label}}</button>\r\n       }\r\n      }\r\n      </mat-menu> \r\n    }\r\n\r\n  </div>\r\n}\r\n\r\n", styles: [":host{display:flex;flex-direction:column;width:100%}:host.refresh{background-color:red}.lt_box{display:flex;width:100%;color:#ffffffc7;align-items:center}.lt_label{flex:1;margin:auto;padding-left:10px;font-size:18px;letter-spacing:.84px;font-family:neue-haas-grotesk-display,Roboto,Helvetica Neue,\"sans-serif\";line-height:20px;display:flex;align-items:center}.lt_parentlabel{flex:1;margin:auto;padding-left:10px;font-size:28px;letter-spacing:.84px;font-family:neue-haas-grotesk-display,Roboto,Helvetica Neue,\"sans-serif\";line-height:30px;display:flex;align-items:center}.lt_parentlabel>div,.lt_label>div{max-width:100%;display:-webkit-box;-webkit-line-clamp:1;-webkit-box-orient:vertical;overflow:hidden}sii-badge{font-size:16px;background-color:#04202e8f;margin-left:10px}.expB,.expPB{transform:scale(.8)}.expB mat-icon,.expPB mat-icon{transform:scale(2);display:block}@media screen and (max-width: 992px){.lt_label{font-size:16px;line-height:18px}.lt_parentlabel{font-size:18px;line-height:20px}}sii-badge{padding:1px 12px}\n"] }]
        }], ctorParameters: () => [{ type: i1$4.DomSanitizer }, { type: i0.ElementRef }], propDecorators: { ds: [{
                type: Input
            }], group: [{
                type: Input
            }], prev: [{
                type: HostBinding,
                args: ['style.--prevGroupParent']
            }] } });

class FakeListItemDirective {
    // prependedEl:HTMLElement;
    constructor(el, template, view) {
        this.el = el;
        this.template = template;
        this.view = view;
        // checkInterval;
        this.elements = [];
        // createDestroyNodeListener(){
        //   return this.siiFakeListItem.firstElementChild.addEventListener('DOMNodeRemoved', () => {
        //     console.log('createDestroyNodeListener change');
        //     setTimeout(() => {
        //       this.updateStyles();
        //       this.eventListeDom = this.createDestroyNodeListener();
        //     });
        //     });
        // }
        this.updateStyles = () => {
            if (!!this.siiFakeListItem.firstElementChild) {
                const cs = window.getComputedStyle(this.siiFakeListItem.firstElementChild);
                this.elements.forEach((elNode) => {
                    elNode.style.width = Math.ceil(this.siiFakeListItem.firstElementChild.offsetWidth) + 'px';
                    elNode.style.marginLeft = cs.marginLeft;
                    elNode.style.marginRight = cs.marginRight;
                    elNode.style.flex = cs.flex;
                    elNode.style.maxWidth = cs.maxWidth;
                });
            }
        };
    }
    ngOnDestroy() {
        // clearInterval(this.checkInterval);
    }
    ngAfterViewInit() {
        this.changes = new MutationObserver((mutations) => {
            this.updateStyles();
        });
        this.changes.observe(this.siiFakeListItem, {
            childList: true,
            subtree: false,
            attributes: false,
            characterData: false,
        });
        // setTimeout(()=>{
        // this.eventListeDom= this.createDestroyNodeListener();
        this.elements.push(this.view.createEmbeddedView(this.template).rootNodes[0]);
        this.elements.push(this.view.createEmbeddedView(this.template).rootNodes[0]);
        this.elements.push(this.view.createEmbeddedView(this.template).rootNodes[0]);
        this.elements.push(this.view.createEmbeddedView(this.template).rootNodes[0]);
        this.elements.push(this.view.createEmbeddedView(this.template).rootNodes[0]);
        this.updateStyles();
        // this.checkInterval= setInterval(()=>{
        //   this.updateStyles();
        // },1000)
        // },0)
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: FakeListItemDirective, deps: [{ token: i0.ElementRef }, { token: i0.TemplateRef }, { token: i0.ViewContainerRef }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "18.2.13", type: FakeListItemDirective, isStandalone: true, selector: "[siiFakeListItem]", inputs: { siiFakeListItem: "siiFakeListItem" }, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: FakeListItemDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[siiFakeListItem]',
                    standalone: true,
                }]
        }], ctorParameters: () => [{ type: i0.ElementRef }, { type: i0.TemplateRef }, { type: i0.ViewContainerRef }], propDecorators: { siiFakeListItem: [{
                type: Input
            }] } });

class CropImageDialogComponent {
    constructor(data, dialogRef, renderer, cdref) {
        // this.fileCanvas.nativeElement.getContext('2d').drawImage(data.file, 0, 0);
        this.data = data;
        this.dialogRef = dialogRef;
        this.renderer = renderer;
        this.cdref = cdref;
        this.utils = {
            maxWidth: 'inherit',
            rotation: 0,
            originalImageWidth: 0,
            originalImageHeight: 0,
            initImageWidth: null,
            initImageHeight: null,
            isVerticalOriginalImage: false,
            quality: 1,
            errorImageLoad: false
        };
        this.isVertical = false;
        this.croppedImage = '';
        this.loadImageFailed = () => {
            this.utils.errorImageLoad = true;
        };
        // A Blob() is almost a File() - it's just missing the two properties below which we will add
        this.blobToFile = (theBlob, fileName, mimeType) => {
            // const b: any = theBlob;
            // b.lastModifiedDate = new Date();
            // b.name = fileName;
            return new File([theBlob], fileName, { type: mimeType });
            // return theBlob as File;
        };
    }
    ngOnInit() {
    }
    onNoClick() {
        this.dialogRef.close();
    }
    confirmImage() {
        if (this.likeSize(this.cropperCanvas.nativeElement.width, this.utils.initImageWidth)
            && this.likeSize(this.cropperCanvas.nativeElement.height, this.utils.initImageHeight)) {
            // console.log('originalImage')
            if ((this.data.file.size / (1024 * 1024)) > this.data.maxSize) {
                console.log('originalImage too Big.. use edited image');
                this.dialogRef.close(this.photoToSave);
            }
            else {
                this.dialogRef.close(this.data.file);
            }
        }
        else {
            // console.log('editedImage')
            this.dialogRef.close(this.photoToSave);
        }
    }
    likeSize(size1, size2) {
        return Math.abs(size1 - size2) < 3;
    }
    rotate() {
        this.utils.rotation = (this.utils.rotation - 1) % 4;
        const tmp = this.utils.originalImageWidth;
        this.utils.originalImageWidth = this.utils.originalImageHeight;
        this.utils.originalImageHeight = tmp;
        this.croppedImage = '';
        this.calculateOriginalImageProp();
    }
    imageCropped(crop) {
        // this.croppedImage = crop.base64;
        // put the created cropped image to canvas and reduce the size
        this.renderer.setProperty(this.cropperCanvas.nativeElement, 'width', crop.width);
        this.renderer.setProperty(this.cropperCanvas.nativeElement, 'height', crop.height);
        this.isVertical = crop.width < crop.height;
        const image = new Image();
        image.onload = () => {
            this.cropperCanvas.nativeElement.getContext('2d').drawImage(image, 0, 0);
            this.updatePhotoCroppedFromCanvas(this.cropperCanvas.nativeElement, 'image/jpeg', 1.0);
        };
        image.src = crop.base64;
    }
    fileImageLoaded(data) {
        this.utils.initImageWidth = this.utils.initImageWidth || data.transformed.size.width;
        this.utils.initImageHeight = this.utils.initImageHeight || data.transformed.size.height;
        this.utils.originalImageWidth = data.transformed.size.width;
        this.utils.originalImageHeight = data.transformed.size.height;
        this.calculateOriginalImageProp();
    }
    calculateOriginalImageProp() {
        this.utils.isVerticalOriginalImage = this.utils.originalImageWidth < this.utils.originalImageHeight;
        this.utils.maxWidth = ((80 * this.utils.originalImageWidth) / this.utils.originalImageHeight) + 'vh';
    }
    updatePhotoCroppedFromCanvas(canvas, mimeType, qualityArgument) {
        canvas.toBlob((blob) => {
            const fileCreated = this.blobToFile(blob, this.data.file.name.split('.')[0].replace('_crp', '') + '_crp.jpeg', mimeType);
            if (qualityArgument < 0) {
                console.log('unable to resize image to minSize of upload');
                this.dialogRef.close(this.data.file);
            }
            // console.log('canvasBlob size:' + (blob.size / (1024 * 1024)));
            if ((fileCreated.size / (1024 * 1024)) > this.data.maxSize) {
                console.log('TOO BIG, reduce');
                this.updatePhotoCroppedFromCanvas(canvas, mimeType, qualityArgument - 0.1);
                // this.utils.quality -= 0.1;
            }
            else {
                // this.croppedImage = blob;
                const reader = new FileReader();
                reader.readAsDataURL(blob);
                reader.onloadend = () => {
                    this.croppedImage = reader.result;
                    this.cdref.detectChanges();
                    this.cdref.markForCheck();
                };
                this.photoToSave = fileCreated;
                // console.log('FINAL PHOTO size:'+ (fileCreated.size/(1024*1024)),this.photoToSave)
                this.cdref.detectChanges();
                this.cdref.markForCheck();
            }
        }, mimeType, qualityArgument);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: CropImageDialogComponent, deps: [{ token: MAT_DIALOG_DATA }, { token: i1$2.MatDialogRef }, { token: i0.Renderer2 }, { token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "18.2.13", type: CropImageDialogComponent, isStandalone: true, selector: "sii-crop-image-dialog", viewQueries: [{ propertyName: "cropperCanvas", first: true, predicate: ["cropper_canvas"], descendants: true }], ngImport: i0, template: "<!-- <span mat-dialog-title>Take a pic</span> -->\r\n<div mat-dialog-content style=\"max-height: none;\">\r\n\r\n  @if (utils.errorImageLoad) {\r\n    <div class=\"ErrorLoadImage\" i18n=\"@@siiUploadCorruptedImage\">The Uploaded Image Is Corrupt And Cannot Be Processed</div>\r\n  }\r\n\r\n\r\n  <!-- <video #video id=\"video\" class=\"pd_video_player\" autoplay></video> -->\r\n  <!-- <canvas #file_canvas style=\"display: none;\"></canvas> -->\r\n  <canvas #cropper_canvas style=\"display: none;\"></canvas>\r\n\r\n  <!-- [resizeToWidth]=\"205\" -->\r\n  <!-- [cropperMinWidth]=\"205\" -->\r\n  <!-- [aspectRatio]=\"205 / 256\" -->\r\n  <!-- [maintainAspectRatio]=\"true\" -->\r\n  <!-- [onlyScaleDown]=\"true\" -->\r\n  @if (!utils.errorImageLoad) {\r\n    <div  class=\"pd_canvas\" [ngClass]=\"{'verticalpdCanvas':utils.isVerticalOriginalImage}\">\r\n      <image-cropper [style.maxWidth]=\"utils.maxWidth\"\r\n        [imageQuality]=\"100\"\r\n        [imageFile]=\"data.file\"\r\n        [maintainAspectRatio]=\"!!data.aspectRatio\"\r\n        [aspectRatio]=\"data.aspectRatio\"\r\n        [resizeToWidth]=\"data.resizeToWidth\"\r\n        format=\"jpeg\"\r\n        (imageCropped)=\"imageCropped($event)\"\r\n        (imageLoaded)=\"fileImageLoaded($event)\"\r\n        [canvasRotation]=\"utils.rotation\"\r\n        (loadImageFailed)=\"loadImageFailed()\"\r\n        >\r\n      </image-cropper>\r\n      <img class=\"finalImage\"  [ngClass]=\"{'verticalFinalImage':isVertical}\" [src]=\"croppedImage\" />\r\n      <button  mat-icon-button (click)=\"rotate()\" class=\"rotateButton\">\r\n        <mat-icon>crop_rotate</mat-icon>\r\n      </button>\r\n    </div>\r\n  }\r\n\r\n</div>\r\n<div mat-dialog-actions align=\"end\">\r\n  <button type=\"button\" mat-button (click)=\"onNoClick()\" i18n=\"pict@@cancelOperation\">Cancel</button>\r\n  @if (!utils.errorImageLoad) {\r\n    <button  type=\"button\" mat-raised-button color=\"primary\"   (click)=\"confirmImage()\" i18n=\"pict@@confirmPhoto\">Confirm</button>\r\n  }\r\n</div>\r\n\r\n", styles: [".pd_canvas{position:relative;margin:0 auto}image-cropper{margin:auto}.finalImage{position:absolute;bottom:15px;right:0;border:2px solid white;width:25%}.finalImage:hover{width:75%;transition-delay:1s}.finalImage.verticalFinalImage{width:auto;height:35%}.finalImage.verticalFinalImage:hover{width:auto;height:75%}.rotateButton{position:absolute;top:7px;right:0;background-color:#ffffff96}\n"], dependencies: [{ kind: "directive", type: MatDialogContent, selector: "[mat-dialog-content], mat-dialog-content, [matDialogContent]" }, { kind: "directive", type: NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "ngmodule", type: ImageCropperModule }, { kind: "component", type: i2$1.ImageCropperComponent, selector: "image-cropper", inputs: ["imageChangedEvent", "imageURL", "imageBase64", "imageFile", "imageAltText", "format", "transform", "maintainAspectRatio", "aspectRatio", "resetCropOnAspectRatioChange", "resizeToWidth", "resizeToHeight", "cropperMinWidth", "cropperMinHeight", "cropperMaxHeight", "cropperMaxWidth", "cropperStaticWidth", "cropperStaticHeight", "canvasRotation", "initialStepSize", "roundCropper", "onlyScaleDown", "imageQuality", "autoCrop", "backgroundColor", "containWithinAspectRatio", "hideResizeSquares", "allowMoveImage", "cropper", "alignImage", "disabled", "hidden"], outputs: ["imageCropped", "startCropImage", "imageLoaded", "cropperReady", "loadImageFailed", "transformChange"] }, { kind: "component", type: MatIconButton, selector: "button[mat-icon-button]", exportAs: ["matButton"] }, { kind: "component", type: MatIcon, selector: "mat-icon", inputs: ["color", "inline", "svgIcon", "fontSet", "fontIcon"], exportAs: ["matIcon"] }, { kind: "directive", type: MatDialogActions, selector: "[mat-dialog-actions], mat-dialog-actions, [matDialogActions]", inputs: ["align"] }, { kind: "component", type: MatButton, selector: "    button[mat-button], button[mat-raised-button], button[mat-flat-button],    button[mat-stroked-button]  ", exportAs: ["matButton"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: CropImageDialogComponent, decorators: [{
            type: Component,
            args: [{ selector: 'sii-crop-image-dialog', standalone: true, imports: [CdkScrollable, MatDialogContent, NgClass, ImageCropperModule, MatIconButton, MatIcon, MatDialogActions, MatButton], template: "<!-- <span mat-dialog-title>Take a pic</span> -->\r\n<div mat-dialog-content style=\"max-height: none;\">\r\n\r\n  @if (utils.errorImageLoad) {\r\n    <div class=\"ErrorLoadImage\" i18n=\"@@siiUploadCorruptedImage\">The Uploaded Image Is Corrupt And Cannot Be Processed</div>\r\n  }\r\n\r\n\r\n  <!-- <video #video id=\"video\" class=\"pd_video_player\" autoplay></video> -->\r\n  <!-- <canvas #file_canvas style=\"display: none;\"></canvas> -->\r\n  <canvas #cropper_canvas style=\"display: none;\"></canvas>\r\n\r\n  <!-- [resizeToWidth]=\"205\" -->\r\n  <!-- [cropperMinWidth]=\"205\" -->\r\n  <!-- [aspectRatio]=\"205 / 256\" -->\r\n  <!-- [maintainAspectRatio]=\"true\" -->\r\n  <!-- [onlyScaleDown]=\"true\" -->\r\n  @if (!utils.errorImageLoad) {\r\n    <div  class=\"pd_canvas\" [ngClass]=\"{'verticalpdCanvas':utils.isVerticalOriginalImage}\">\r\n      <image-cropper [style.maxWidth]=\"utils.maxWidth\"\r\n        [imageQuality]=\"100\"\r\n        [imageFile]=\"data.file\"\r\n        [maintainAspectRatio]=\"!!data.aspectRatio\"\r\n        [aspectRatio]=\"data.aspectRatio\"\r\n        [resizeToWidth]=\"data.resizeToWidth\"\r\n        format=\"jpeg\"\r\n        (imageCropped)=\"imageCropped($event)\"\r\n        (imageLoaded)=\"fileImageLoaded($event)\"\r\n        [canvasRotation]=\"utils.rotation\"\r\n        (loadImageFailed)=\"loadImageFailed()\"\r\n        >\r\n      </image-cropper>\r\n      <img class=\"finalImage\"  [ngClass]=\"{'verticalFinalImage':isVertical}\" [src]=\"croppedImage\" />\r\n      <button  mat-icon-button (click)=\"rotate()\" class=\"rotateButton\">\r\n        <mat-icon>crop_rotate</mat-icon>\r\n      </button>\r\n    </div>\r\n  }\r\n\r\n</div>\r\n<div mat-dialog-actions align=\"end\">\r\n  <button type=\"button\" mat-button (click)=\"onNoClick()\" i18n=\"pict@@cancelOperation\">Cancel</button>\r\n  @if (!utils.errorImageLoad) {\r\n    <button  type=\"button\" mat-raised-button color=\"primary\"   (click)=\"confirmImage()\" i18n=\"pict@@confirmPhoto\">Confirm</button>\r\n  }\r\n</div>\r\n\r\n", styles: [".pd_canvas{position:relative;margin:0 auto}image-cropper{margin:auto}.finalImage{position:absolute;bottom:15px;right:0;border:2px solid white;width:25%}.finalImage:hover{width:75%;transition-delay:1s}.finalImage.verticalFinalImage{width:auto;height:35%}.finalImage.verticalFinalImage:hover{width:auto;height:75%}.rotateButton{position:absolute;top:7px;right:0;background-color:#ffffff96}\n"] }]
        }], ctorParameters: () => [{ type: undefined, decorators: [{
                    type: Inject,
                    args: [MAT_DIALOG_DATA]
                }] }, { type: i1$2.MatDialogRef }, { type: i0.Renderer2 }, { type: i0.ChangeDetectorRef }], propDecorators: { cropperCanvas: [{
                type: ViewChild,
                args: ['cropper_canvas']
            }] } });

class FilePreviewDialogComponent {
    constructor(file, sanitizer, dialogRef) {
        this.file = file;
        this.sanitizer = sanitizer;
        this.dialogRef = dialogRef;
        this.utils = {
            isImage: null,
            fileUrl: null
        };
        this.utils.isImage = file.type.match(/image\/*/) != null;
        this.utils.fileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(file));
        // const reader = new FileReader();
        // reader.readAsDataURL(file);
        // reader.onloadend = () =>  this.utils.fileUrl =  this.sanitizer.bypassSecurityTrustResourceUrl(reader.result as string);
    }
    ngOnInit() {
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: FilePreviewDialogComponent, deps: [{ token: MAT_DIALOG_DATA }, { token: i1$4.DomSanitizer }, { token: i1$2.MatDialogRef }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "18.2.13", type: FilePreviewDialogComponent, isStandalone: true, selector: "sii-file-preview-dialog", ngImport: i0, template: "<mat-dialog-content>\r\n  @if (utils.fileUrl) {\r\n    @switch (utils.isImage) {\r\n      @default {\r\n        <iframe [src]=\"utils.fileUrl\"></iframe>\r\n      }\r\n      @case (true) {\r\n        <img  class=\"previewImg\" [src]=\"utils.fileUrl\">\r\n      }\r\n    }\r\n  }\r\n</mat-dialog-content>\r\n<mat-dialog-actions align=\"end\">\r\n\r\n  <span class=\"fileName\">{{file.name}}</span>\r\n  <button mat-button mat-dialog-close i18n=\"@@close\">Close</button>\r\n\r\n</mat-dialog-actions>\r\n\r\n", styles: ["mat-dialog-content{max-height:98vh;height:calc(98vh - 50px)}img.previewImg{width:100%;height:100%;object-fit:contain;margin:-4px 0}iframe{height:100%;margin-bottom:-8px;border:none;width:100%}.fileName{flex:1;text-align:left}\n"], dependencies: [{ kind: "directive", type: MatDialogContent, selector: "[mat-dialog-content], mat-dialog-content, [matDialogContent]" }, { kind: "directive", type: MatDialogActions, selector: "[mat-dialog-actions], mat-dialog-actions, [matDialogActions]", inputs: ["align"] }, { kind: "component", type: MatButton, selector: "    button[mat-button], button[mat-raised-button], button[mat-flat-button],    button[mat-stroked-button]  ", exportAs: ["matButton"] }, { kind: "directive", type: MatDialogClose, selector: "[mat-dialog-close], [matDialogClose]", inputs: ["aria-label", "type", "mat-dialog-close", "matDialogClose"], exportAs: ["matDialogClose"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: FilePreviewDialogComponent, decorators: [{
            type: Component,
            args: [{ selector: 'sii-file-preview-dialog', standalone: true, imports: [CdkScrollable, MatDialogContent, MatDialogActions, MatButton, MatDialogClose], template: "<mat-dialog-content>\r\n  @if (utils.fileUrl) {\r\n    @switch (utils.isImage) {\r\n      @default {\r\n        <iframe [src]=\"utils.fileUrl\"></iframe>\r\n      }\r\n      @case (true) {\r\n        <img  class=\"previewImg\" [src]=\"utils.fileUrl\">\r\n      }\r\n    }\r\n  }\r\n</mat-dialog-content>\r\n<mat-dialog-actions align=\"end\">\r\n\r\n  <span class=\"fileName\">{{file.name}}</span>\r\n  <button mat-button mat-dialog-close i18n=\"@@close\">Close</button>\r\n\r\n</mat-dialog-actions>\r\n\r\n", styles: ["mat-dialog-content{max-height:98vh;height:calc(98vh - 50px)}img.previewImg{width:100%;height:100%;object-fit:contain;margin:-4px 0}iframe{height:100%;margin-bottom:-8px;border:none;width:100%}.fileName{flex:1;text-align:left}\n"] }]
        }], ctorParameters: () => [{ type: undefined, decorators: [{
                    type: Inject,
                    args: [MAT_DIALOG_DATA]
                }] }, { type: i1$4.DomSanitizer }, { type: i1$2.MatDialogRef }] });

class PictDialogComponent {
    constructor(data, cdref, renderer, dialogRef) {
        this.data = data;
        this.cdref = cdref;
        this.renderer = renderer;
        this.dialogRef = dialogRef;
        this.pictDone = false;
        this.videoWidth = 0;
        this.videoHeight = 0;
        this.videoActive = false;
        this.isVertical = false;
        this.croppedImage = '';
        this.cameraConstraints = {
            video: {
                width: { ideal: 4096 },
                height: { ideal: 2160 }
            }
        };
        // createFile(canvas,mimeType:string, qualityArgument:number){
        //   canvas.toBlob((blob) =>{
        //     const fileCreated=this.blobToFile(blob,'image'+new Date().getTime()+'.jpeg',mimeType);
        //     if((fileCreated.size/(1024*1024))>this.data.maxSize){
        //       this.createFile(canvas, mimeType,qualityArgument-0.1)
        //     }else{
        //       this.photoToSave=fileCreated;
        //       this.cdref.detectChanges();
        //       this.cdref.markForCheck();
        //     }
        //   }, mimeType,qualityArgument);
        // }
        // A Blob() is almost a File() - it's just missing the two properties below which we will add
        this.blobToFile = (theBlob, fileName, mimeType) => {
            // const b: any = theBlob;
            // b.lastModifiedDate = new Date();
            // b.name = fileName;
            return new File([theBlob], fileName, { type: mimeType });
            // return theBlob as File;
        };
    }
    ngOnInit() {
        this.startCamera();
    }
    ngOnDestroy() {
        this.stopVideo();
    }
    startCamera() {
        this.pictDone = false;
        this.photoToSave = null;
        if (!!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)) {
            navigator.mediaDevices.getUserMedia(this.cameraConstraints)
                .then((stream) => { this.videoStream = stream; this.attachVideo(); })
                .catch((error) => alert(error));
        }
        else {
            alert('Sorry, camera not available.');
        }
    }
    attachVideo() {
        this.renderer.setProperty(this.videoElement.nativeElement, 'srcObject', this.videoStream);
        this.renderer.listen(this.videoElement.nativeElement, 'play', (event) => {
            this.videoHeight = this.videoElement.nativeElement.videoHeight;
            this.videoWidth = this.videoElement.nativeElement.videoWidth;
            this.videoActive = true;
        });
    }
    stopVideo() {
        this.videoStream.getTracks().forEach(element => { element.stop(); });
        this.videoActive = false;
    }
    onNoClick() {
        this.dialogRef.close();
    }
    doPict() {
        this.renderer.setProperty(this.videoCanvas.nativeElement, 'width', this.videoWidth);
        this.renderer.setProperty(this.videoCanvas.nativeElement, 'height', this.videoHeight);
        this.videoCanvas.nativeElement.getContext('2d').drawImage(this.videoElement.nativeElement, 0, 0);
        this.stopVideo();
        this.updatePhotoExtractionFromCanvas(this.videoCanvas.nativeElement, 'image/jpeg', 1.0);
    }
    updatePhotoExtractionFromCanvas(canvas, mimeType, qualityArgument) {
        canvas.toBlob((blob) => {
            // const fileCreated=this.blobToFile(blob,'image'+new Date().getTime()+'.jpeg',mimeType);
            // console.log(fileCreated)
            this.canvasPhotoExtraction = blob;
            // console.log('firstCanvasSize '+ this.blobToFile(blob,'image'+new Date().getTime()+'.jpeg',mimeType).size);
            this.cdref.detectChanges();
            this.cdref.markForCheck();
        }, mimeType, qualityArgument);
    }
    webCamIageLoaded() {
        this.pictDone = true;
    }
    imageCropped(crop) {
        // this.croppedImage = crop.base64;
        // put the created cropped image to canvas and reduce the size
        this.renderer.setProperty(this.cropperCanvas.nativeElement, 'width', crop.width);
        this.renderer.setProperty(this.cropperCanvas.nativeElement, 'height', crop.height);
        this.isVertical = crop.width < crop.height;
        const image = new Image();
        image.onload = () => {
            this.cropperCanvas.nativeElement.getContext('2d').drawImage(image, 0, 0);
            this.updatePhotoCroppedFromCanvas(this.cropperCanvas.nativeElement, 'image/jpeg', 0.92);
        };
        image.src = crop.base64;
    }
    updatePhotoCroppedFromCanvas(canvas, mimeType, qualityArgument) {
        canvas.toBlob((blob) => {
            console.log('canvasBlob size:' + (blob.size / (1024 * 1024)));
            const fileCreated = this.blobToFile(blob, 'image' + new Date().getTime() + '.jpeg', mimeType);
            if ((fileCreated.size / (1024 * 1024)) > this.data.maxSize) {
                console.log('TOO BIG, reduce');
                this.updatePhotoCroppedFromCanvas(canvas, mimeType, qualityArgument - 0.1);
            }
            else {
                // this.croppedImage = blob;
                const reader = new FileReader();
                reader.readAsDataURL(blob);
                reader.onloadend = () => this.croppedImage = reader.result;
                this.photoToSave = fileCreated;
                // console.log('FINAL PHOTO size:'+ (fileCreated.size/(1024*1024)),this.photoToSave)
                this.cdref.detectChanges();
                this.cdref.markForCheck();
            }
        }, mimeType, qualityArgument);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: PictDialogComponent, deps: [{ token: MAT_DIALOG_DATA }, { token: i0.ChangeDetectorRef }, { token: i0.Renderer2 }, { token: i1$2.MatDialogRef }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "18.2.13", type: PictDialogComponent, isStandalone: true, selector: "sii-pict-dialog", host: { properties: { "class.pictDone": "this.pictDone" } }, viewQueries: [{ propertyName: "videoElement", first: true, predicate: ["video"], descendants: true }, { propertyName: "videoCanvas", first: true, predicate: ["video_canvas"], descendants: true }, { propertyName: "cropperCanvas", first: true, predicate: ["cropper_canvas"], descendants: true }], ngImport: i0, template: "<!-- <span mat-dialog-title>Take a pic</span> -->\r\n<div mat-dialog-content style=\"max-height: none;\">\r\n  <video #video id=\"video\" class=\"pd_video_player\" autoplay></video>\r\n  <canvas #video_canvas style=\"display: none;\"></canvas>\r\n  <canvas #cropper_canvas style=\"display: none;\"></canvas>\r\n\r\n  <!-- [resizeToWidth]=\"205\" -->\r\n  <!-- [cropperMinWidth]=\"205\" -->\r\n  <!-- [aspectRatio]=\"205 / 256\" -->\r\n  <!-- [maintainAspectRatio]=\"true\" -->\r\n  <!-- [onlyScaleDown]=\"true\" -->\r\n  <!-- [imageQuality]=\"100\" -->\r\n  <div class=\"pd_canvas\">\r\n    <image-cropper\r\n      [imageFile]=\"canvasPhotoExtraction\"\r\n      [maintainAspectRatio]=\"!!data.aspectRatio\"\r\n      [aspectRatio]=\"data.aspectRatio\"\r\n      [resizeToWidth]=\"data.resizeToWidth\"\r\n      format=\"jpeg\"\r\n      (imageCropped)=\"imageCropped($event)\"\r\n      (imageLoaded)=\"webCamIageLoaded()\" >\r\n    </image-cropper>\r\n    <img class=\"finalImage\"  [ngClass]=\"{'verticalFinalImage':isVertical}\" [src]=\"croppedImage\" />\r\n  </div>\r\n\r\n</div>\r\n<div mat-dialog-actions>\r\n  <button type=\"button\" mat-button (click)=\"onNoClick()\" i18n=\"pict@@cancelOperation\">Cancel</button>\r\n  <span style=\"flex: 1;\"></span>\r\n  <button type=\"button\" mat-stroked-button class=\"ricatturaImmagine\"   (click)=\"startCamera()\" i18n=\"pict@@retry\">Retry</button>\r\n  <button type=\"button\" [disabled]=\"!videoActive\" mat-fab class=\"catturaImmagine\"    (click)=\"doPict()\" cdkFocusInitial><mat-icon>photo_camera</mat-icon></button>\r\n  <span style=\"flex: 1;\"></span>\r\n  <button type=\"button\" mat-raised-button color=\"primary\" [disabled]=\"!photoToSave\"  [mat-dialog-close]=\"photoToSave\" i18n=\"pict@@confirmPhoto\">Confirm</button>\r\n</div>\r\n\r\n", styles: [".pd_video_player,.pd_canvas{width:100vh;max-width:70vw}.pd_canvas{display:none;position:relative}.finalImage{position:absolute;bottom:15px;right:0;border:2px solid white;width:25%}.finalImage:hover{width:75%;transition-delay:1s}.finalImage.verticalFinalImage{width:auto;height:35%}.finalImage.verticalFinalImage:hover{width:auto;height:75%}:host.pictDone .pd_canvas{display:block}:host.pictDone .pd_video_player{display:none}.ricatturaImmagine{display:none}:host.pictDone .ricatturaImmagine{display:block}:host.pictDone .catturaImmagine{display:none}\n"], dependencies: [{ kind: "directive", type: MatDialogContent, selector: "[mat-dialog-content], mat-dialog-content, [matDialogContent]" }, { kind: "ngmodule", type: ImageCropperModule }, { kind: "component", type: i2$1.ImageCropperComponent, selector: "image-cropper", inputs: ["imageChangedEvent", "imageURL", "imageBase64", "imageFile", "imageAltText", "format", "transform", "maintainAspectRatio", "aspectRatio", "resetCropOnAspectRatioChange", "resizeToWidth", "resizeToHeight", "cropperMinWidth", "cropperMinHeight", "cropperMaxHeight", "cropperMaxWidth", "cropperStaticWidth", "cropperStaticHeight", "canvasRotation", "initialStepSize", "roundCropper", "onlyScaleDown", "imageQuality", "autoCrop", "backgroundColor", "containWithinAspectRatio", "hideResizeSquares", "allowMoveImage", "cropper", "alignImage", "disabled", "hidden"], outputs: ["imageCropped", "startCropImage", "imageLoaded", "cropperReady", "loadImageFailed", "transformChange"] }, { kind: "directive", type: NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: MatDialogActions, selector: "[mat-dialog-actions], mat-dialog-actions, [matDialogActions]", inputs: ["align"] }, { kind: "component", type: MatButton, selector: "    button[mat-button], button[mat-raised-button], button[mat-flat-button],    button[mat-stroked-button]  ", exportAs: ["matButton"] }, { kind: "component", type: MatFabButton, selector: "button[mat-fab]", inputs: ["extended"], exportAs: ["matButton"] }, { kind: "component", type: MatIcon, selector: "mat-icon", inputs: ["color", "inline", "svgIcon", "fontSet", "fontIcon"], exportAs: ["matIcon"] }, { kind: "directive", type: MatDialogClose, selector: "[mat-dialog-close], [matDialogClose]", inputs: ["aria-label", "type", "mat-dialog-close", "matDialogClose"], exportAs: ["matDialogClose"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: PictDialogComponent, decorators: [{
            type: Component,
            args: [{ selector: 'sii-pict-dialog', standalone: true, imports: [CdkScrollable, MatDialogContent, ImageCropperModule, NgClass, MatDialogActions, MatButton, MatFabButton, MatIcon, MatDialogClose], template: "<!-- <span mat-dialog-title>Take a pic</span> -->\r\n<div mat-dialog-content style=\"max-height: none;\">\r\n  <video #video id=\"video\" class=\"pd_video_player\" autoplay></video>\r\n  <canvas #video_canvas style=\"display: none;\"></canvas>\r\n  <canvas #cropper_canvas style=\"display: none;\"></canvas>\r\n\r\n  <!-- [resizeToWidth]=\"205\" -->\r\n  <!-- [cropperMinWidth]=\"205\" -->\r\n  <!-- [aspectRatio]=\"205 / 256\" -->\r\n  <!-- [maintainAspectRatio]=\"true\" -->\r\n  <!-- [onlyScaleDown]=\"true\" -->\r\n  <!-- [imageQuality]=\"100\" -->\r\n  <div class=\"pd_canvas\">\r\n    <image-cropper\r\n      [imageFile]=\"canvasPhotoExtraction\"\r\n      [maintainAspectRatio]=\"!!data.aspectRatio\"\r\n      [aspectRatio]=\"data.aspectRatio\"\r\n      [resizeToWidth]=\"data.resizeToWidth\"\r\n      format=\"jpeg\"\r\n      (imageCropped)=\"imageCropped($event)\"\r\n      (imageLoaded)=\"webCamIageLoaded()\" >\r\n    </image-cropper>\r\n    <img class=\"finalImage\"  [ngClass]=\"{'verticalFinalImage':isVertical}\" [src]=\"croppedImage\" />\r\n  </div>\r\n\r\n</div>\r\n<div mat-dialog-actions>\r\n  <button type=\"button\" mat-button (click)=\"onNoClick()\" i18n=\"pict@@cancelOperation\">Cancel</button>\r\n  <span style=\"flex: 1;\"></span>\r\n  <button type=\"button\" mat-stroked-button class=\"ricatturaImmagine\"   (click)=\"startCamera()\" i18n=\"pict@@retry\">Retry</button>\r\n  <button type=\"button\" [disabled]=\"!videoActive\" mat-fab class=\"catturaImmagine\"    (click)=\"doPict()\" cdkFocusInitial><mat-icon>photo_camera</mat-icon></button>\r\n  <span style=\"flex: 1;\"></span>\r\n  <button type=\"button\" mat-raised-button color=\"primary\" [disabled]=\"!photoToSave\"  [mat-dialog-close]=\"photoToSave\" i18n=\"pict@@confirmPhoto\">Confirm</button>\r\n</div>\r\n\r\n", styles: [".pd_video_player,.pd_canvas{width:100vh;max-width:70vw}.pd_canvas{display:none;position:relative}.finalImage{position:absolute;bottom:15px;right:0;border:2px solid white;width:25%}.finalImage:hover{width:75%;transition-delay:1s}.finalImage.verticalFinalImage{width:auto;height:35%}.finalImage.verticalFinalImage:hover{width:auto;height:75%}:host.pictDone .pd_canvas{display:block}:host.pictDone .pd_video_player{display:none}.ricatturaImmagine{display:none}:host.pictDone .ricatturaImmagine{display:block}:host.pictDone .catturaImmagine{display:none}\n"] }]
        }], ctorParameters: () => [{ type: undefined, decorators: [{
                    type: Inject,
                    args: [MAT_DIALOG_DATA]
                }] }, { type: i0.ChangeDetectorRef }, { type: i0.Renderer2 }, { type: i1$2.MatDialogRef }], propDecorators: { videoElement: [{
                type: ViewChild,
                args: ['video']
            }], videoCanvas: [{
                type: ViewChild,
                args: ['video_canvas']
            }], cropperCanvas: [{
                type: ViewChild,
                args: ['cropper_canvas']
            }], pictDone: [{
                type: HostBinding,
                args: ['class.pictDone']
            }] } });

class SiiMemoryPipe {
    transform(value, ...args) {
        // value in byte
        if (value < 1024) {
            return Math.ceil(value) + 'B';
        }
        else if (value < (1024 * 1024)) {
            return Math.ceil(value / 1024) + 'KB';
        }
        else if (value < (1024 * 1024 * 1024)) {
            return Math.ceil(value / (1024 * 1024)) + 'MB';
        }
        else {
            return Math.ceil(value / (1024 * 1024 * 1024)) + 'GB';
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: SiiMemoryPipe, deps: [], target: i0.ɵɵFactoryTarget.Pipe }); }
    static { this.ɵpipe = i0.ɵɵngDeclarePipe({ minVersion: "14.0.0", version: "18.2.13", ngImport: i0, type: SiiMemoryPipe, isStandalone: true, name: "siiMemory" }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: SiiMemoryPipe, decorators: [{
            type: Pipe,
            args: [{
                    name: 'siiMemory',
                    standalone: true
                }]
        }] });

class UploadComponent {
    get acceptArray() {
        return this.accept !== '' ? this.accept.split(',') : [];
    }
    get acceptText() {
        return this.acceptArray.map(a => a.split('/').pop()).join(', ');
    }
    constructor(dialog, platform, sanitizer, ts) {
        this.dialog = dialog;
        this.platform = platform;
        this.sanitizer = sanitizer;
        this.ts = ts;
        this.webcamAvailable = false;
        // tslint:disable-next-line:variable-name
        this._multiple = false;
        this.isMaxSizeDefault = true;
        this.isMaxSizeSingleDefault = true;
        // tslint:disable-next-line:variable-name
        this._maxSize = 20;
        // tslint:disable-next-line:variable-name
        this._maxSizeSingleFile = 20;
        this.accept = '';
        this.enableCamera = false;
        this.disableDelete = false;
        this.disableCrop = false;
        this.uploadErrorMessage = false;
        this.invalidExt = false;
        this.invalidSize = false;
        this.invalidSizeSingleFile = false;
        this.invalidLength = false;
        this.disabled = false;
        // uploadContainerControl = new FormControl();
        this.selectedFiles = [];
        this.propagateChange = () => { };
        this.onTouchedCallback = () => { };
        this.validatorCallback = () => { };
        this.webcamAvailable = !platform.IOS && !platform.ANDROID && !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
    }
    get multiple() {
        return this._multiple;
    }
    set multiple(value) {
        this._multiple = coerceBooleanProperty(value);
    }
    get maxSize() {
        if (this.isMaxSizeDefault && !this.isMaxSizeSingleDefault) {
            return Math.max(this._maxSize, this._maxSizeSingleFile);
        }
        return this._maxSize;
    }
    set maxSize(value) {
        this._maxSize = coerceNumberProperty(value);
        this.isMaxSizeDefault = false;
    }
    get maxSizeSingleFile() {
        if (!this.isMaxSizeDefault && !this.isMaxSizeSingleDefault) {
            return Math.min(this._maxSize, this._maxSizeSingleFile);
        }
        else if (!this.isMaxSizeDefault && this.isMaxSizeSingleDefault) {
            return this._maxSize;
        }
        return this._maxSizeSingleFile;
    }
    set maxSizeSingleFile(value) {
        this._maxSizeSingleFile = coerceNumberProperty(value);
        this.isMaxSizeSingleDefault = false;
    }
    // Dragover listener
    onDragOver(evt) {
        evt.preventDefault();
        evt.stopPropagation();
        if (!this.disabled) {
            this.fileOver = true;
        }
    }
    // Dragleave listener
    onDragLeave(evt) {
        evt.preventDefault();
        evt.stopPropagation();
        this.fileOver = false;
    }
    // Drop listener
    ondrop(evt) {
        evt.preventDefault();
        evt.stopPropagation();
        this.fileOver = false;
        if (!this.disabled) {
            const files = evt.dataTransfer.files;
            if (files.length > 0) {
                this.onFileDropped(files);
                // this.fileDropped.emit(files);
            }
        }
    }
    registerOnValidatorChange(fn) {
        this.validatorCallback = fn;
    }
    writeValue(obj) {
        if (obj != null) {
            if (this.multiple) {
                this.selectedFiles = obj.map(f => ({ ...f, ...{ _type: this.getFileType(f.file) } }));
            }
            else {
                this.selectedFiles = [obj].map(f => ({ ...f, ...{ _type: this.getFileType(f.file) } }));
            }
        }
        else {
            this.selectedFiles = [];
        }
        // this.uploadContainerControl.setValue(this.selectedFiles);
    }
    registerOnChange(fn) {
        this.propagateChange = fn;
    }
    registerOnTouched(fn) {
        this.onTouchedCallback = fn;
    }
    setDisabledState(isDisabled) {
        this.disabled = isDisabled;
        // isDisabled? this.uploadContainerControl.disable():this.uploadContainerControl.enable();
    }
    onFileDropped($event) {
        if (!!$event && $event.length > 0) {
            this.checkImageToCrop($event).then((fileToLoad) => {
                this.prepareFilesList(fileToLoad);
            }, () => { });
        }
    }
    fileBrowseHandler(files) {
        if (!!files && files.length > 0) {
            this.checkImageToCrop(files).then((fileToLoad) => {
                this.prepareFilesList(fileToLoad);
            }, () => { });
        }
    }
    deleteFile(index, file) {
        const perform = (i) => {
            this.selectedFiles.splice(i, 1);
            this.change(this.selectedFiles);
        };
        if (!!this.deleteService) {
            this.deleteService(file).subscribe(deleted => {
                if (deleted) {
                    perform(index);
                }
            });
        }
        else {
            perform(index);
        }
    }
    loadFilePreviewInformation(fu, force = false) {
        return new Promise((resolve, reject) => {
            if (!fu._imagePreviewUrl || force) {
                const isImage = fu.file.type.match(/image\/*/) != null;
                const isPdf = fu.file.type.match(/pdf\/*/) != null;
                if (isImage || isPdf) {
                    // const reader = new FileReader();
                    // reader.readAsDataURL(fu.file as File);
                    fu._isImage = isImage;
                    fu._imagePreviewUrl = this.sanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(fu.file));
                    resolve();
                    // reader.onloadend = () => {
                    //    fu._imagePreviewUrl =  this.sanitizer.bypassSecurityTrustResourceUrl(reader.result as string);
                    // resolve();
                    //   };
                }
            }
            else {
                resolve();
            }
        });
    }
    downloadableFile(fu) {
        return (fu?.file instanceof File) || this.downloadService != null || this.previewService != null;
    }
    previewableFile(fu) {
        return !!fu?._imagePreviewUrl ||
            (this.previewService != null &&
                (fu?.file?.type?.match(/image\/*/) != null
                    ||
                        fu?.file?.type?.match(/pdf\/*/) != null));
    }
    cropableFile(fu) {
        return (!!fu?._imagePreviewUrl && !!fu._isImage) ||
            (this.previewService != null && fu?.file?.type?.match(/image\/*/) != null);
    }
    cropFile(fu, index) {
        if (fu.file != null && fu.file instanceof File) {
            this.performCropFile(index);
        }
        else if (this.previewService != null) {
            // il file non c'è
            this.previewService(fu.id).subscribe((resp) => {
                const respFile = this.previewServiceResponseToFile(resp, fu);
                if (respFile != null) {
                    fu.file = respFile;
                    this.loadFilePreviewInformation(fu).then(() => {
                        if (fu._isImage) {
                            this.performCropFile(index);
                        }
                        else {
                            console.error('the downloaded file is not of type image or pdf');
                        }
                    });
                }
                else {
                    fu._isImage = false;
                    console.error('the downloaded file is not of type File');
                }
            });
        }
    }
    previewServiceResponseToFile(resp, fu) {
        if (resp instanceof File) {
            return resp;
        }
        else if (resp instanceof Blob) {
            return new File([resp], fu.file.name, { type: resp.type });
        }
        else {
            return null;
        }
    }
    previewFile(fu) {
        if (!!fu?._imagePreviewUrl) {
            this.openPreviewDialog(fu);
        }
        else if (this.previewService != null) {
            this.previewService(fu.id).subscribe((resp) => {
                const respFile = this.previewServiceResponseToFile(resp, fu);
                if (respFile != null) {
                    fu.file = respFile;
                    this.loadFilePreviewInformation(fu).then(() => {
                        if (!!fu._imagePreviewUrl) {
                            this.openPreviewDialog(fu);
                        }
                        else {
                            console.error('the downloaded file is not of type image or pdf');
                        }
                    });
                }
                else {
                    fu._isImage = false;
                    console.error('the downloaded file is not of type File');
                }
            });
        }
        else {
            console.log('error on preview');
        }
    }
    downloadFile(fu) {
        if (fu.file != null && fu.file instanceof File) {
            // il file c'è
            this.buildDownloadLink(fu);
        }
        else if (this.downloadService != null) {
            this.downloadService(fu.id);
        }
        else if (this.previewService != null) {
            // il file non c'è
            this.previewService(fu.id).subscribe((resp) => {
                const respFile = this.previewServiceResponseToFile(resp, fu);
                if (respFile != null) {
                    fu.file = respFile;
                    this.loadFilePreviewInformation(fu).then(() => {
                        this.buildDownloadLink(fu);
                    });
                }
                else {
                    fu._isImage = false;
                    console.error('the downloaded file is not of type File');
                }
            });
        }
    }
    buildDownloadLink(fu) {
        const downloadLink = document.createElement('a');
        downloadLink.href = window.URL.createObjectURL(fu.file);
        downloadLink.setAttribute('download', fu.file.name);
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    }
    prepareFilesList(files) {
        this.checkFile(files).then(() => {
            if (!this.multiple) {
                this.selectedFiles = [];
            }
            for (const it of files) {
                // clono l'oggetto per modificarne la data con quella attuale
                const item = new File([it], it.name, { type: it.type });
                const duplicated = this.selectedFiles.find(sf => sf.file.name === item.name) != null;
                const cf = {
                    name: duplicated ? 'copy-' + item.name : item.name,
                    file: item,
                    creationUser: {
                        firstname: this.ts.loggedUser.value.firstName,
                        lastname: this.ts.loggedUser.value.lastName,
                        userid: this.ts.loggedUser.value.username
                    },
                    id: null,
                    _type: this.getFileType(item)
                };
                this.selectedFiles.push(cf);
                this.loadFilePreviewInformation(cf);
            }
            this.change(this.selectedFiles);
            this.onTouchedCallback();
            this.inputEle.nativeElement.value = '';
        }, (err) => {
            this.uploadErrorMessage = true;
            switch (err) {
                case 'INVALID-FILE-EXTENSION':
                    this.invalidExt = true;
                    break;
                case 'INVALID-FILE-SIZE':
                    this.invalidSize = true;
                    break;
                case 'INVALID-FILE-SIZE-SINGLE-FILE':
                    this.invalidSizeSingleFile = true;
                    break;
                case 'INVALID-FILE-LENGTH':
                    this.invalidLength = true;
                    break;
            }
            setTimeout(() => {
                this.uploadErrorMessage = false;
                this.invalidExt = false;
                this.invalidSize = false;
                this.invalidSizeSingleFile = false;
                this.invalidLength = false;
            }, 4000);
            // remove the file selected
            // if(this.selectedFiles){
            //   this.selectedFiles.length=0;
            // }
            // this.uploadContainerControl.setValue(this.selectedFiles);
            this.inputEle.nativeElement.value = '';
        });
    }
    change(files) {
        if (this.multiple) {
            this.propagateChange(files);
        }
        else {
            this.propagateChange(files.length === 0 ? null : files[0]);
        }
    }
    getFileType(file) {
        if (file.type.match(/image\/*/) != null) {
            return 'IMAGE';
        }
        else if (file.type.match(/pdf\/*/) != null) {
            return 'PDF';
        }
        else if (file.type.match(/csv$/) != null) {
            return 'CSV';
        }
        else if (file.type.match(/\.spreadsheetml$/) != null) {
            return 'EXCEL';
        }
        else if (file.type.match(/\.document$/) != null) {
            return 'WORD';
        }
        else if (file.type.match(/\.presentation$/) != null) {
            return 'POWERPOINT';
        }
    }
    checkImageToCrop(files) {
        return new Promise((resolve, reject) => {
            // get all images file
            const imagesFile = [];
            const othersFile = [];
            for (const f of files) {
                if (f.type.match(/image\/*/) != null) {
                    imagesFile.push(f);
                }
                else {
                    othersFile.push(f);
                }
            }
            // const imagesFile = files.filter(f => f.type.match(/image\/*/) != null);
            if (imagesFile.length === 0 || imagesFile.length > 1) {
                resolve(files);
                return;
            }
            // if i'm here there is only 1 image file
            this.openCropDialog(imagesFile[0])
                .subscribe((photo) => {
                if (!!photo) {
                    othersFile.push(photo);
                    resolve(othersFile);
                }
                else {
                    reject();
                }
            });
        });
    }
    performCropFile(index) {
        this.openCropDialog(this.selectedFiles[index].file)
            .subscribe((photo) => {
            if (!!photo) {
                // remove the id to perform a new upload
                this.selectedFiles[index].prevId = this.selectedFiles[index].id;
                this.selectedFiles[index].id = null;
                this.selectedFiles[index].file = photo;
                this.loadFilePreviewInformation(this.selectedFiles[index], true);
                this.change(this.selectedFiles);
            }
        });
    }
    openCropDialog(file) {
        return this.dialog.open(CropImageDialogComponent, {
            disableClose: true,
            width: '98vw',
            maxWidth: '98vw',
            data: {
                maxSize: (this.multiple ? this.maxSizeSingleFile : this.maxSize),
                aspectRatio: this.aspectRatio,
                resizeToWidth: this.resizeToWidth,
                file
            }
        }).afterClosed();
    }
    openPreviewDialog(fu) {
        if (fu.file.size > (1000 * 1024 * 4)) {
            // Create a link pointing to the ObjectURL containing the blob.
            const url = window.URL.createObjectURL(fu.file);
            const anchor = document.createElement('a');
            anchor.href = url;
            anchor.target = '_blank';
            anchor.click();
            setTimeout(() => {
                // For Firefox it is necessary to delay revoking the ObjectURL
                window.URL.revokeObjectURL(url);
            }, 100);
        }
        else {
            this.dialog.open(FilePreviewDialogComponent, {
                width: '98%',
                maxWidth: '100%',
                // height: '98%',
                // maxHeight: '98%',
                data: fu.file
            });
        }
    }
    checkFile(files) {
        return new Promise((resolve, reject) => {
            if (!this.multiple && files.length > 1) {
                reject('INVALID-FILE-LENGTH');
                return;
            }
            if (this.acceptArray.length !== 0) {
                // check the format
                for (const f of files) {
                    if (!this.isValidFormat(f, this.acceptArray)) {
                        reject('INVALID-FILE-EXTENSION');
                        return;
                    }
                }
            }
            for (const f of files) {
                // check max size
                if (!this.isValidSize(f)) {
                    reject('INVALID-FILE-SIZE-SINGLE-FILE');
                    return;
                }
            }
            let totalSize = 0;
            for (const f of files) {
                totalSize += f.size;
            }
            // SUM ALSO THE ACTUAL SELECTED FILES if is multiple
            if (this.multiple && this.selectedFiles != null) {
                this.selectedFiles.forEach(sf => {
                    if (sf.file != null && sf.file.size != null) {
                        totalSize += sf.file?.size || 0;
                    }
                    else {
                        console.error('some files of Sii-Upload have null file object. Please return an empty object with only the size');
                    }
                });
            }
            if ((totalSize / (1020 * 1024)) > this.maxSize) {
                reject('INVALID-FILE-SIZE');
                return;
            }
            resolve(null);
        });
    }
    isValidFormat(f, acceptArray) {
        return acceptArray.find(acc => acc === f.type) != null;
        // return acceptArray.includes(f.type);
    }
    isValidSize(f) {
        return (f.size / (1024 * 1024)) <= (this.multiple ? this.maxSizeSingleFile : this.maxSize);
    }
    pictImage() {
        this.dialog.open(PictDialogComponent, {
            disableClose: true,
            data: {
                maxSize: (this.multiple ? this.maxSizeSingleFile : this.maxSize),
                aspectRatio: this.aspectRatio,
                resizeToWidth: this.resizeToWidth,
            }
        }).afterClosed()
            .subscribe((photo) => {
            this.prepareFilesList(!!photo ? [photo] : []);
        });
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: UploadComponent, deps: [{ token: i1$2.MatDialog }, { token: i2$2.Platform }, { token: i1$4.DomSanitizer }, { token: SiiToolkitService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "18.2.13", type: UploadComponent, isStandalone: true, selector: "sii-upload", inputs: { multiple: "multiple", maxSize: "maxSize", maxSizeSingleFile: "maxSizeSingleFile", accept: "accept", enableCamera: "enableCamera", disableDelete: "disableDelete", disableCrop: "disableCrop", aspectRatio: "aspectRatio", resizeToWidth: "resizeToWidth", downloadService: "downloadService", previewService: "previewService", deleteService: "deleteService" }, host: { listeners: { "dragover": "onDragOver($event)", "dragleave": "onDragLeave($event)", "drop": "ondrop($event)" }, properties: { "class.uploadErrorMessage": "this.uploadErrorMessage", "class.invalidExtension": "this.invalidExt", "class.invalidSize": "this.invalidSize", "class.invalidSizeSingle": "this.invalidSizeSingleFile", "class.invalidLength": "this.invalidLength", "class.fileover": "this.fileOver" } }, providers: [
            {
                provide: NG_VALUE_ACCESSOR,
                useExisting: forwardRef(() => UploadComponent),
                multi: true,
            },
            SiiDatePipe
            // { provide: NG_VALIDATORS, useExisting: UploadContainerComponent, multi: true },
        ], viewQueries: [{ propertyName: "inputEle", first: true, predicate: ["fileDropRef"], descendants: true }], ngImport: i0, template: "<input type=\"file\"  style=\"display: none;\" [accept]=\"accept\"   #fileDropRef id=\"fileDropRef\" [multiple]=\"multiple\" (change)=\"fileBrowseHandler($event.target.files)\" />\r\n\r\n\r\n<ng-content select=\"[sii-upload-title]\"></ng-content>\r\n\r\n<div class=\"siiUploadBox\">\r\n\r\n\r\n  <div class=\"container\"  >\r\n\r\n    <div class=\"UC_Drop_row_fullScreen\" >\r\n      <mat-icon style=\"    width: 40px;      height: 40px;      margin: 10px;\" svgIcon=\"upload-solid\"></mat-icon>\r\n      <span style=\"    margin-left: 10px;\" i18n=\"@@DropFileHere\">Drop file here</span>\r\n    </div>\r\n\r\n    <div class=\"invalidExtensionFile\" >\r\n      <b><h2 i18n=\"@@FU_invalidFileType\">Invalid File Type</h2></b>\r\n      <span i18n=\"@@FU_supportedType\">Supported types are</span>\r\n\r\n      @for (t of acceptArray; track t) {\r\n        <div>{{t}}</div>\r\n      }\r\n    </div>\r\n\r\n    <div class=\"invalidSizeFile\" >\r\n      <b><h2 i18n=\"@@FU_invalidFileSize\">Invalid Size</h2></b>\r\n      <span i18n=\"@@FU_maxSize\">Max size for the upload is : {{maxSize}} MB</span>\r\n    </div>\r\n    <div class=\"invalidSizeSingleFile\" >\r\n      <b><h2 i18n=\"@@FU_invalidFileSize\">Invalid Size</h2></b>\r\n      <span i18n=\"@@FU_maxSizeSingleFile\">Max size for single file is : {{maxSizeSingleFile}} MB</span>\r\n    </div>\r\n\r\n    <div  class=\"invalidLengthFile\" >\r\n      <b><h2 i18n=\"@@FU_invalidLengthSize\">Invalid Length</h2></b>\r\n      <span i18n=\"@@FU_onlyOne\">You can upload only 1 file</span>\r\n    </div>\r\n\r\n\r\n\r\n    <ng-content select=\"[sii-upload-description]\"></ng-content>\r\n\r\n    @if (!disabled) {\r\n      <div class=\"infoBox\" >\r\n        <div class=\"specifiche\">\r\n          @if (multiple) {\r\n            <span class=\"UC_multiple\" i18n=\"sii-upload-component@@multipleFileSelection\">more than one file can be uploaded</span>\r\n          }\r\n          <span class=\"UC_max_size\" >\r\n            <span i18n=\"@@FU_maxSize_small\">Max Size</span>:{{(maxSize*1024*1024) | siiMemory}}\r\n            @if (multiple || true) {\r\n              -  <span i18n=\"@@FU_maxSizeSingle_small\">Max Size Single File</span>: {{(maxSizeSingleFile *1024*1024) | siiMemory}}\r\n            }\r\n          </span>\r\n          @if (accept!='') {\r\n            <span class=\"UC_accept\"><span i18n=\"@@fileTypes\">File type:</span>&nbsp;{{acceptText}}</span>\r\n          }\r\n        </div>\r\n        <div class=\"UC_Drop_row\">\r\n          <mat-icon style=\"    width: 20px;\" svgIcon=\"upload-solid\"></mat-icon>\r\n          <span style=\"    margin-left: 10px;\" i18n=\"@@DropFileHere\">Drop file here</span>\r\n        </div>\r\n      </div>\r\n    }\r\n\r\n\r\n\r\n\r\n\r\n  </div>\r\n\r\n\r\n  <div class=\"UC-file-list\">\r\n\r\n    @for (file of selectedFiles; track file; let i = $index) {\r\n      <div class=\"UC-file-selected-item\">\r\n        <div class=\"UC-file-selected-item-box\">\r\n          <span  class=\"UC-file-selected-item-attribute titleCol\">\r\n            @if (!!file._imagePreviewUrl && !!file._isImage) {\r\n              <img class=\"rowPreviewImage\" [src]=\"file._imagePreviewUrl\">\r\n            }\r\n            @if (!(!!file._imagePreviewUrl && !!file._isImage)) {\r\n              @switch (file._type) {\r\n                @case ('CSV') {\r\n                  <mat-icon svgIcon=\"file-csv\"></mat-icon>\r\n                }\r\n                @case ('EXCEL') {\r\n                  <mat-icon svgIcon=\"file-excel\"></mat-icon>\r\n                }\r\n                @case ('IMAGE') {\r\n                  <mat-icon svgIcon=\"file-image\"></mat-icon>\r\n                }\r\n                @case ('PDF') {\r\n                  <mat-icon svgIcon=\"file-pdf\"></mat-icon>\r\n                }\r\n                @case ('POWERPOINT') {\r\n                  <mat-icon svgIcon=\"file-powerpoint\"></mat-icon>\r\n                }\r\n                @case ('WORD') {\r\n                  <mat-icon svgIcon=\"file-word\"></mat-icon>\r\n                }\r\n                @default {\r\n                  <mat-icon svgIcon=\"file_download\"></mat-icon>\r\n                }\r\n              }\r\n            }\r\n            <span class=\"fileName\">{{ file?.file.name }}</span>\r\n          </span>\r\n          <span  class=\"UC-file-selected-item-attribute creuser\">\r\n            @if (!!file?.creationUser?.firstname) {\r\n              <mat-icon>person</mat-icon>\r\n              <span>{{file?.creationUser?.firstname +' '+ file?.creationUser?.lastname }}</span>\r\n            }\r\n          </span>\r\n          <span  class=\"UC-file-selected-item-attribute lastmod\">\r\n            @if (!!file?.file?.lastModified) {\r\n              <mat-icon>event</mat-icon>\r\n              <span>{{file?.file?.lastModified | siiDate}}</span>\r\n            }\r\n          </span>\r\n          <span  class=\"UC-file-selected-item-attribute size\">\r\n            @if (!!file?.file?.size) {\r\n              <mat-icon>memory</mat-icon>\r\n              <span>{{file?.file?.size | siiMemory}}</span>\r\n            }\r\n          </span>\r\n        </div>\r\n        <button type=\"button\" [matMenuTriggerFor]=\"action\"   mat-icon-button ><mat-icon>more_vert</mat-icon></button>\r\n        <mat-menu #action=\"matMenu\"   >\r\n          @if (!disableCrop && !this.disabled && cropableFile(file) && file.readonly!=true) {\r\n            <button type=\"button\" mat-menu-item (click)=\"cropFile(file, i)\"><mat-icon>crop</mat-icon><span i18n=\"@@SiiUploadCrop\">Crop</span></button>\r\n          }\r\n          @if (downloadableFile(file)) {\r\n            <button type=\"button\" mat-menu-item (click)=\"downloadFile(file)\"><mat-icon>file_download</mat-icon><span i18n=\"@@SiiUploadDownload\">Download</span></button>\r\n          }\r\n          @if (!disabled && !disableDelete && file.readonly!=true) {\r\n            <button type=\"button\" mat-menu-item (click)=\"deleteFile(i,file)\"><mat-icon>delete_outline</mat-icon><span i18n=\"@@SiiUploadDelete\">Delete</span></button>\r\n          }\r\n          @if (previewableFile(file)) {\r\n            <button type=\"button\" mat-menu-item (click)=\"previewFile(file)\"><mat-icon>visibility</mat-icon><span i18n=\"@@SiiUploadPreview\">Preview</span></button>\r\n          }\r\n        </mat-menu>\r\n      </div>\r\n    }\r\n  </div>\r\n\r\n\r\n  @if (!disabled) {\r\n    <div class=\"UC_fileSelectionsRow\">\r\n      <button type=\"button\" mat-button  (click)=\"fileDropRef.click() \" >\r\n        <mat-icon style=\"    width: 17px;      margin-right: 4px;\" svgIcon=\"attachment\"></mat-icon>\r\n        <span i18n=\"@@Choose_File\">Choose file</span>\r\n      </button>\r\n      @if (enableCamera && webcamAvailable) {\r\n        <button type=\"button\" mat-button (click)=\"pictImage() \">\r\n          <mat-icon style=\"margin-right: 4px;\">photo_camera</mat-icon>\r\n          <span i18n=\"@@takeAPhoto\">Take a Photo</span>\r\n        </button>\r\n      }\r\n    </div>\r\n  }\r\n</div>\r\n\r\n\r\n", styles: [":host{display:flex;flex-direction:column;width:500px;max-width:100%;min-height:200px;box-shadow:0 0 5px #0003}:host::ng-deep [sii-upload-title]{border-bottom:1px solid lightgray;min-height:41px;display:flex;align-items:center;padding:0 10px}.container *,:host::ng-deep [sii-upload-description]{pointer-events:none}.siiUploadBox{overflow:hidden;display:flex;flex:1;flex-direction:column}:host.fileover .container{border:2px dashed gray}.container{position:relative;box-sizing:border-box;display:flex;flex-direction:column}.container ::ng-deep>*{padding:5px 10px}.UC_Drop_row{display:flex;align-items:center;font-size:13px}.UC_Drop_row_fullScreen{display:none;flex-direction:column;align-items:center;position:absolute;background:#fff;width:100%;height:100%;left:0;top:0;justify-content:center;font-size:25px;font-weight:700;color:gray;z-index:5;box-sizing:border-box}:host.fileover .UC_Drop_row_fullScreen{display:flex}.UC_fileSelectionsRow{min-height:41px;border-bottom:1px solid lightgray;border-top:1px solid lightgray;display:flex;justify-content:flex-end;align-items:center}.UC-file-list{overflow:auto;flex:1}.UC-file-list .UC-file-selected-item{display:flex;align-items:center;margin:0 5px;min-height:40px;border-bottom:1px solid lightgray}.UC-file-list .UC-file-selected-item:last-child{border-bottom:none}.UC-file-list .UC-file-selected-item .UC-file-selected-item-box{flex:1;flex-wrap:wrap;display:flex;align-items:center;padding:5px 0}.UC-file-list .UC-file-selected-item .UC-file-selected-item-box .UC-file-selected-item-attribute{display:flex;align-items:center;padding:0 5px}.UC-file-list .UC-file-selected-item .UC-file-selected-item-box .UC-file-selected-item-attribute.size{width:90px}.UC-file-list .UC-file-selected-item .UC-file-selected-item-box .UC-file-selected-item-attribute.creuser{width:170px}.UC-file-list .UC-file-selected-item .UC-file-selected-item-box .UC-file-selected-item-attribute.lastmod{width:110px}.UC-file-list .UC-file-selected-item .UC-file-selected-item-box .UC-file-selected-item-attribute.titleCol{flex:1 1 300px}.UC-file-list .UC-file-selected-item .UC-file-selected-item-box .UC-file-selected-item-attribute.titleCol mat-icon{transform:scale(.9)}.UC-file-list .UC-file-selected-item .UC-file-selected-item-box .UC-file-selected-item-attribute>*{opacity:.75}.UC-file-list .UC-file-selected-item .UC-file-selected-item-box .UC-file-selected-item-attribute .fileName{flex:1;color:#427f9f;opacity:1}:host.uploadErrorMessage .container{animation:shake 1s;animation-duration:1s;border-color:red}.invalidExtensionFile,.invalidSizeFile,.invalidSizeSingleFile,.invalidLengthFile{display:none;flex-direction:column;position:absolute;width:100%;background-color:#fff;top:0;left:0;color:red;z-index:1;padding:10px}:host.uploadErrorMessage.invalidExtension .invalidExtensionFile,:host.uploadErrorMessage.invalidSize .invalidSizeFile,:host.uploadErrorMessage.invalidSizeSingle .invalidSizeSingleFile,:host.uploadErrorMessage.invalidLength .invalidLengthFile{display:flex}.infoBox{display:flex;flex-wrap:wrap;opacity:.8}.infoBox .specifiche{flex:1;padding-bottom:12px;display:flex;flex-direction:column}.UC_max_size,.UC_multiple,.UC_accept{font-size:12px}.rowPreviewImage{max-width:40px;max-height:40px;margin-right:5px}@keyframes shake{0%{transform:translate(1px,1px) rotate(0)}10%{transform:translate(-1px,-2px) rotate(-1deg)}20%{transform:translate(-3px) rotate(1deg)}30%{transform:translate(3px,2px) rotate(0)}40%{transform:translate(1px,-1px) rotate(1deg)}50%{transform:translate(-1px,2px) rotate(-1deg)}60%{transform:translate(-3px,1px) rotate(0)}70%{transform:translate(3px,1px) rotate(-1deg)}80%{transform:translate(-1px,-1px) rotate(1deg)}90%{transform:translate(1px,2px) rotate(0)}to{transform:translate(1px,-2px) rotate(-1deg)}}@media only screen and (max-width: 840px){.UC_Drop_row{display:none}}\n"], dependencies: [{ kind: "component", type: MatIcon, selector: "mat-icon", inputs: ["color", "inline", "svgIcon", "fontSet", "fontIcon"], exportAs: ["matIcon"] }, { kind: "component", type: MatIconButton, selector: "button[mat-icon-button]", exportAs: ["matButton"] }, { kind: "directive", type: MatMenuTrigger, selector: "[mat-menu-trigger-for], [matMenuTriggerFor]", inputs: ["mat-menu-trigger-for", "matMenuTriggerFor", "matMenuTriggerData", "matMenuTriggerRestoreFocus"], outputs: ["menuOpened", "onMenuOpen", "menuClosed", "onMenuClose"], exportAs: ["matMenuTrigger"] }, { kind: "component", type: MatMenu, selector: "mat-menu", inputs: ["backdropClass", "aria-label", "aria-labelledby", "aria-describedby", "xPosition", "yPosition", "overlapTrigger", "hasBackdrop", "class", "classList"], outputs: ["closed", "close"], exportAs: ["matMenu"] }, { kind: "component", type: MatMenuItem, selector: "[mat-menu-item]", inputs: ["role", "disabled", "disableRipple"], exportAs: ["matMenuItem"] }, { kind: "component", type: MatButton, selector: "    button[mat-button], button[mat-raised-button], button[mat-flat-button],    button[mat-stroked-button]  ", exportAs: ["matButton"] }, { kind: "pipe", type: SiiDatePipe, name: "siiDate" }, { kind: "pipe", type: SiiMemoryPipe, name: "siiMemory" }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: UploadComponent, decorators: [{
            type: Component,
            args: [{ selector: 'sii-upload', providers: [
                        {
                            provide: NG_VALUE_ACCESSOR,
                            useExisting: forwardRef(() => UploadComponent),
                            multi: true,
                        },
                        SiiDatePipe
                        // { provide: NG_VALIDATORS, useExisting: UploadContainerComponent, multi: true },
                    ], standalone: true, imports: [
                        MatIcon,
                        MatIconButton,
                        MatMenuTrigger,
                        MatMenu,
                        MatMenuItem,
                        MatButton,
                        SiiDatePipe,
                        SiiMemoryPipe,
                    ], template: "<input type=\"file\"  style=\"display: none;\" [accept]=\"accept\"   #fileDropRef id=\"fileDropRef\" [multiple]=\"multiple\" (change)=\"fileBrowseHandler($event.target.files)\" />\r\n\r\n\r\n<ng-content select=\"[sii-upload-title]\"></ng-content>\r\n\r\n<div class=\"siiUploadBox\">\r\n\r\n\r\n  <div class=\"container\"  >\r\n\r\n    <div class=\"UC_Drop_row_fullScreen\" >\r\n      <mat-icon style=\"    width: 40px;      height: 40px;      margin: 10px;\" svgIcon=\"upload-solid\"></mat-icon>\r\n      <span style=\"    margin-left: 10px;\" i18n=\"@@DropFileHere\">Drop file here</span>\r\n    </div>\r\n\r\n    <div class=\"invalidExtensionFile\" >\r\n      <b><h2 i18n=\"@@FU_invalidFileType\">Invalid File Type</h2></b>\r\n      <span i18n=\"@@FU_supportedType\">Supported types are</span>\r\n\r\n      @for (t of acceptArray; track t) {\r\n        <div>{{t}}</div>\r\n      }\r\n    </div>\r\n\r\n    <div class=\"invalidSizeFile\" >\r\n      <b><h2 i18n=\"@@FU_invalidFileSize\">Invalid Size</h2></b>\r\n      <span i18n=\"@@FU_maxSize\">Max size for the upload is : {{maxSize}} MB</span>\r\n    </div>\r\n    <div class=\"invalidSizeSingleFile\" >\r\n      <b><h2 i18n=\"@@FU_invalidFileSize\">Invalid Size</h2></b>\r\n      <span i18n=\"@@FU_maxSizeSingleFile\">Max size for single file is : {{maxSizeSingleFile}} MB</span>\r\n    </div>\r\n\r\n    <div  class=\"invalidLengthFile\" >\r\n      <b><h2 i18n=\"@@FU_invalidLengthSize\">Invalid Length</h2></b>\r\n      <span i18n=\"@@FU_onlyOne\">You can upload only 1 file</span>\r\n    </div>\r\n\r\n\r\n\r\n    <ng-content select=\"[sii-upload-description]\"></ng-content>\r\n\r\n    @if (!disabled) {\r\n      <div class=\"infoBox\" >\r\n        <div class=\"specifiche\">\r\n          @if (multiple) {\r\n            <span class=\"UC_multiple\" i18n=\"sii-upload-component@@multipleFileSelection\">more than one file can be uploaded</span>\r\n          }\r\n          <span class=\"UC_max_size\" >\r\n            <span i18n=\"@@FU_maxSize_small\">Max Size</span>:{{(maxSize*1024*1024) | siiMemory}}\r\n            @if (multiple || true) {\r\n              -  <span i18n=\"@@FU_maxSizeSingle_small\">Max Size Single File</span>: {{(maxSizeSingleFile *1024*1024) | siiMemory}}\r\n            }\r\n          </span>\r\n          @if (accept!='') {\r\n            <span class=\"UC_accept\"><span i18n=\"@@fileTypes\">File type:</span>&nbsp;{{acceptText}}</span>\r\n          }\r\n        </div>\r\n        <div class=\"UC_Drop_row\">\r\n          <mat-icon style=\"    width: 20px;\" svgIcon=\"upload-solid\"></mat-icon>\r\n          <span style=\"    margin-left: 10px;\" i18n=\"@@DropFileHere\">Drop file here</span>\r\n        </div>\r\n      </div>\r\n    }\r\n\r\n\r\n\r\n\r\n\r\n  </div>\r\n\r\n\r\n  <div class=\"UC-file-list\">\r\n\r\n    @for (file of selectedFiles; track file; let i = $index) {\r\n      <div class=\"UC-file-selected-item\">\r\n        <div class=\"UC-file-selected-item-box\">\r\n          <span  class=\"UC-file-selected-item-attribute titleCol\">\r\n            @if (!!file._imagePreviewUrl && !!file._isImage) {\r\n              <img class=\"rowPreviewImage\" [src]=\"file._imagePreviewUrl\">\r\n            }\r\n            @if (!(!!file._imagePreviewUrl && !!file._isImage)) {\r\n              @switch (file._type) {\r\n                @case ('CSV') {\r\n                  <mat-icon svgIcon=\"file-csv\"></mat-icon>\r\n                }\r\n                @case ('EXCEL') {\r\n                  <mat-icon svgIcon=\"file-excel\"></mat-icon>\r\n                }\r\n                @case ('IMAGE') {\r\n                  <mat-icon svgIcon=\"file-image\"></mat-icon>\r\n                }\r\n                @case ('PDF') {\r\n                  <mat-icon svgIcon=\"file-pdf\"></mat-icon>\r\n                }\r\n                @case ('POWERPOINT') {\r\n                  <mat-icon svgIcon=\"file-powerpoint\"></mat-icon>\r\n                }\r\n                @case ('WORD') {\r\n                  <mat-icon svgIcon=\"file-word\"></mat-icon>\r\n                }\r\n                @default {\r\n                  <mat-icon svgIcon=\"file_download\"></mat-icon>\r\n                }\r\n              }\r\n            }\r\n            <span class=\"fileName\">{{ file?.file.name }}</span>\r\n          </span>\r\n          <span  class=\"UC-file-selected-item-attribute creuser\">\r\n            @if (!!file?.creationUser?.firstname) {\r\n              <mat-icon>person</mat-icon>\r\n              <span>{{file?.creationUser?.firstname +' '+ file?.creationUser?.lastname }}</span>\r\n            }\r\n          </span>\r\n          <span  class=\"UC-file-selected-item-attribute lastmod\">\r\n            @if (!!file?.file?.lastModified) {\r\n              <mat-icon>event</mat-icon>\r\n              <span>{{file?.file?.lastModified | siiDate}}</span>\r\n            }\r\n          </span>\r\n          <span  class=\"UC-file-selected-item-attribute size\">\r\n            @if (!!file?.file?.size) {\r\n              <mat-icon>memory</mat-icon>\r\n              <span>{{file?.file?.size | siiMemory}}</span>\r\n            }\r\n          </span>\r\n        </div>\r\n        <button type=\"button\" [matMenuTriggerFor]=\"action\"   mat-icon-button ><mat-icon>more_vert</mat-icon></button>\r\n        <mat-menu #action=\"matMenu\"   >\r\n          @if (!disableCrop && !this.disabled && cropableFile(file) && file.readonly!=true) {\r\n            <button type=\"button\" mat-menu-item (click)=\"cropFile(file, i)\"><mat-icon>crop</mat-icon><span i18n=\"@@SiiUploadCrop\">Crop</span></button>\r\n          }\r\n          @if (downloadableFile(file)) {\r\n            <button type=\"button\" mat-menu-item (click)=\"downloadFile(file)\"><mat-icon>file_download</mat-icon><span i18n=\"@@SiiUploadDownload\">Download</span></button>\r\n          }\r\n          @if (!disabled && !disableDelete && file.readonly!=true) {\r\n            <button type=\"button\" mat-menu-item (click)=\"deleteFile(i,file)\"><mat-icon>delete_outline</mat-icon><span i18n=\"@@SiiUploadDelete\">Delete</span></button>\r\n          }\r\n          @if (previewableFile(file)) {\r\n            <button type=\"button\" mat-menu-item (click)=\"previewFile(file)\"><mat-icon>visibility</mat-icon><span i18n=\"@@SiiUploadPreview\">Preview</span></button>\r\n          }\r\n        </mat-menu>\r\n      </div>\r\n    }\r\n  </div>\r\n\r\n\r\n  @if (!disabled) {\r\n    <div class=\"UC_fileSelectionsRow\">\r\n      <button type=\"button\" mat-button  (click)=\"fileDropRef.click() \" >\r\n        <mat-icon style=\"    width: 17px;      margin-right: 4px;\" svgIcon=\"attachment\"></mat-icon>\r\n        <span i18n=\"@@Choose_File\">Choose file</span>\r\n      </button>\r\n      @if (enableCamera && webcamAvailable) {\r\n        <button type=\"button\" mat-button (click)=\"pictImage() \">\r\n          <mat-icon style=\"margin-right: 4px;\">photo_camera</mat-icon>\r\n          <span i18n=\"@@takeAPhoto\">Take a Photo</span>\r\n        </button>\r\n      }\r\n    </div>\r\n  }\r\n</div>\r\n\r\n\r\n", styles: [":host{display:flex;flex-direction:column;width:500px;max-width:100%;min-height:200px;box-shadow:0 0 5px #0003}:host::ng-deep [sii-upload-title]{border-bottom:1px solid lightgray;min-height:41px;display:flex;align-items:center;padding:0 10px}.container *,:host::ng-deep [sii-upload-description]{pointer-events:none}.siiUploadBox{overflow:hidden;display:flex;flex:1;flex-direction:column}:host.fileover .container{border:2px dashed gray}.container{position:relative;box-sizing:border-box;display:flex;flex-direction:column}.container ::ng-deep>*{padding:5px 10px}.UC_Drop_row{display:flex;align-items:center;font-size:13px}.UC_Drop_row_fullScreen{display:none;flex-direction:column;align-items:center;position:absolute;background:#fff;width:100%;height:100%;left:0;top:0;justify-content:center;font-size:25px;font-weight:700;color:gray;z-index:5;box-sizing:border-box}:host.fileover .UC_Drop_row_fullScreen{display:flex}.UC_fileSelectionsRow{min-height:41px;border-bottom:1px solid lightgray;border-top:1px solid lightgray;display:flex;justify-content:flex-end;align-items:center}.UC-file-list{overflow:auto;flex:1}.UC-file-list .UC-file-selected-item{display:flex;align-items:center;margin:0 5px;min-height:40px;border-bottom:1px solid lightgray}.UC-file-list .UC-file-selected-item:last-child{border-bottom:none}.UC-file-list .UC-file-selected-item .UC-file-selected-item-box{flex:1;flex-wrap:wrap;display:flex;align-items:center;padding:5px 0}.UC-file-list .UC-file-selected-item .UC-file-selected-item-box .UC-file-selected-item-attribute{display:flex;align-items:center;padding:0 5px}.UC-file-list .UC-file-selected-item .UC-file-selected-item-box .UC-file-selected-item-attribute.size{width:90px}.UC-file-list .UC-file-selected-item .UC-file-selected-item-box .UC-file-selected-item-attribute.creuser{width:170px}.UC-file-list .UC-file-selected-item .UC-file-selected-item-box .UC-file-selected-item-attribute.lastmod{width:110px}.UC-file-list .UC-file-selected-item .UC-file-selected-item-box .UC-file-selected-item-attribute.titleCol{flex:1 1 300px}.UC-file-list .UC-file-selected-item .UC-file-selected-item-box .UC-file-selected-item-attribute.titleCol mat-icon{transform:scale(.9)}.UC-file-list .UC-file-selected-item .UC-file-selected-item-box .UC-file-selected-item-attribute>*{opacity:.75}.UC-file-list .UC-file-selected-item .UC-file-selected-item-box .UC-file-selected-item-attribute .fileName{flex:1;color:#427f9f;opacity:1}:host.uploadErrorMessage .container{animation:shake 1s;animation-duration:1s;border-color:red}.invalidExtensionFile,.invalidSizeFile,.invalidSizeSingleFile,.invalidLengthFile{display:none;flex-direction:column;position:absolute;width:100%;background-color:#fff;top:0;left:0;color:red;z-index:1;padding:10px}:host.uploadErrorMessage.invalidExtension .invalidExtensionFile,:host.uploadErrorMessage.invalidSize .invalidSizeFile,:host.uploadErrorMessage.invalidSizeSingle .invalidSizeSingleFile,:host.uploadErrorMessage.invalidLength .invalidLengthFile{display:flex}.infoBox{display:flex;flex-wrap:wrap;opacity:.8}.infoBox .specifiche{flex:1;padding-bottom:12px;display:flex;flex-direction:column}.UC_max_size,.UC_multiple,.UC_accept{font-size:12px}.rowPreviewImage{max-width:40px;max-height:40px;margin-right:5px}@keyframes shake{0%{transform:translate(1px,1px) rotate(0)}10%{transform:translate(-1px,-2px) rotate(-1deg)}20%{transform:translate(-3px) rotate(1deg)}30%{transform:translate(3px,2px) rotate(0)}40%{transform:translate(1px,-1px) rotate(1deg)}50%{transform:translate(-1px,2px) rotate(-1deg)}60%{transform:translate(-3px,1px) rotate(0)}70%{transform:translate(3px,1px) rotate(-1deg)}80%{transform:translate(-1px,-1px) rotate(1deg)}90%{transform:translate(1px,2px) rotate(0)}to{transform:translate(1px,-2px) rotate(-1deg)}}@media only screen and (max-width: 840px){.UC_Drop_row{display:none}}\n"] }]
        }], ctorParameters: () => [{ type: i1$2.MatDialog }, { type: i2$2.Platform }, { type: i1$4.DomSanitizer }, { type: SiiToolkitService }], propDecorators: { multiple: [{
                type: Input
            }], maxSize: [{
                type: Input
            }], maxSizeSingleFile: [{
                type: Input
            }], accept: [{
                type: Input
            }], enableCamera: [{
                type: Input
            }], disableDelete: [{
                type: Input
            }], disableCrop: [{
                type: Input
            }], aspectRatio: [{
                type: Input
            }], resizeToWidth: [{
                type: Input
            }], downloadService: [{
                type: Input
            }], previewService: [{
                type: Input
            }], deleteService: [{
                type: Input
            }], uploadErrorMessage: [{
                type: HostBinding,
                args: ['class.uploadErrorMessage']
            }], invalidExt: [{
                type: HostBinding,
                args: ['class.invalidExtension']
            }], invalidSize: [{
                type: HostBinding,
                args: ['class.invalidSize']
            }], invalidSizeSingleFile: [{
                type: HostBinding,
                args: ['class.invalidSizeSingle']
            }], invalidLength: [{
                type: HostBinding,
                args: ['class.invalidLength']
            }], inputEle: [{
                type: ViewChild,
                args: ['fileDropRef']
            }], fileOver: [{
                type: HostBinding,
                args: ['class.fileover']
            }], onDragOver: [{
                type: HostListener,
                args: ['dragover', ['$event']]
            }], onDragLeave: [{
                type: HostListener,
                args: ['dragleave', ['$event']]
            }], ondrop: [{
                type: HostListener,
                args: ['drop', ['$event']]
            }] } });

class NotarizationComponent {
    constructor() { }
    ngOnInit() {
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: NotarizationComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "18.2.13", type: NotarizationComponent, isStandalone: true, selector: "sii-notarization", ngImport: i0, template: "<div  mat-dialog-title class=\"notar_title_content\">\r\n  <span class=\"notar_title\">\r\n      <span i18n=\"@@Notarization\">Notarization</span>&nbsp;-&nbsp;\r\n      <ng-content select=\"notarization-title\"></ng-content>\r\n  </span>\r\n  <ng-content select=\"notarization-subtitle\"></ng-content>\r\n</div>\r\n<div mat-dialog-content>\r\n  <ng-content select=\"notarization-content\"></ng-content>\r\n</div>\r\n<div mat-dialog-actions>\r\n  <button mat-button mat-dialog-close>Cancel</button>\r\n  <span [style.flex]=\"1\"></span>\r\n  <button mat-raised-button color=\"primary\" [mat-dialog-close]=\"true\" cdkFocusInitial>\r\n    <mat-icon style=\"padding-right: 10px;\" svgIcon=\"file_signature\" ></mat-icon>\r\n    <span i18n=\"@@NotarizeDocument\">Notarize Document</span>\r\n  </button>\r\n</div>\r\n", styles: [".notar_title_content{display:flex;flex-direction:column;font-size:14px;line-height:14px}.notar_title{font-size:25px;line-height:25px}.mat-mdc-dialog-actions{border-top:1px solid lightgray;padding:0 12px;width:calc(100% + 44px);margin-left:-22px;box-sizing:border-box;margin-top:10px}\n"], dependencies: [{ kind: "directive", type: MatDialogTitle, selector: "[mat-dialog-title], [matDialogTitle]", inputs: ["id"], exportAs: ["matDialogTitle"] }, { kind: "directive", type: MatDialogContent, selector: "[mat-dialog-content], mat-dialog-content, [matDialogContent]" }, { kind: "directive", type: MatDialogActions, selector: "[mat-dialog-actions], mat-dialog-actions, [matDialogActions]", inputs: ["align"] }, { kind: "component", type: MatButton, selector: "    button[mat-button], button[mat-raised-button], button[mat-flat-button],    button[mat-stroked-button]  ", exportAs: ["matButton"] }, { kind: "directive", type: MatDialogClose, selector: "[mat-dialog-close], [matDialogClose]", inputs: ["aria-label", "type", "mat-dialog-close", "matDialogClose"], exportAs: ["matDialogClose"] }, { kind: "component", type: MatIcon, selector: "mat-icon", inputs: ["color", "inline", "svgIcon", "fontSet", "fontIcon"], exportAs: ["matIcon"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: NotarizationComponent, decorators: [{
            type: Component,
            args: [{ selector: 'sii-notarization', standalone: true, imports: [MatDialogTitle, CdkScrollable, MatDialogContent, MatDialogActions, MatButton, MatDialogClose, MatIcon], template: "<div  mat-dialog-title class=\"notar_title_content\">\r\n  <span class=\"notar_title\">\r\n      <span i18n=\"@@Notarization\">Notarization</span>&nbsp;-&nbsp;\r\n      <ng-content select=\"notarization-title\"></ng-content>\r\n  </span>\r\n  <ng-content select=\"notarization-subtitle\"></ng-content>\r\n</div>\r\n<div mat-dialog-content>\r\n  <ng-content select=\"notarization-content\"></ng-content>\r\n</div>\r\n<div mat-dialog-actions>\r\n  <button mat-button mat-dialog-close>Cancel</button>\r\n  <span [style.flex]=\"1\"></span>\r\n  <button mat-raised-button color=\"primary\" [mat-dialog-close]=\"true\" cdkFocusInitial>\r\n    <mat-icon style=\"padding-right: 10px;\" svgIcon=\"file_signature\" ></mat-icon>\r\n    <span i18n=\"@@NotarizeDocument\">Notarize Document</span>\r\n  </button>\r\n</div>\r\n", styles: [".notar_title_content{display:flex;flex-direction:column;font-size:14px;line-height:14px}.notar_title{font-size:25px;line-height:25px}.mat-mdc-dialog-actions{border-top:1px solid lightgray;padding:0 12px;width:calc(100% + 44px);margin-left:-22px;box-sizing:border-box;margin-top:10px}\n"] }]
        }], ctorParameters: () => [] });

class NotarizationResponseDialogComponent {
    constructor(data, http) {
        this.data = data;
        this.http = http;
    }
    printReceipt() {
        this.http.post(this.data.notarizationPrintReceiptUrl, {
            documentName: this.data.notarizResp.documentName,
            transactionId: this.data.notarizResp.transactionId,
            fileHash: this.data.notarizResp.fileHash
        }, { responseType: 'blob' })
            .subscribe((res) => {
            const dataType = res.type;
            const binaryData = [];
            binaryData.push(res);
            const downloadLink = document.createElement('a');
            downloadLink.href = window.URL.createObjectURL(new Blob(binaryData, { type: dataType }));
            downloadLink.setAttribute('download', `NOTARIZATION_${this.data.notarizResp.documentName}`);
            document.body.appendChild(downloadLink);
            downloadLink.click();
        });
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: NotarizationResponseDialogComponent, deps: [{ token: MAT_DIALOG_DATA }, { token: i1.HttpClient }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "18.2.13", type: NotarizationResponseDialogComponent, isStandalone: true, selector: "sii-notarization-response-dialog", ngImport: i0, template: "<sii-banner-feedback>\r\n  <div feedback-toolbar></div>\r\n  <div feedback-body style=\"display: flex; flex-direction: column; padding: 10px;\">\r\n\r\n    @switch (data.notarizResp.status) {\r\n      @case ('DONE') {\r\n        <p i18n=\"@@dialogDocumentSuccessNotarized\">The document has been correctly notarized</p>\r\n        <p i18n=\"@@dialogDocumentSuccessNotarizedData\">The operation data are as follows</p>\r\n        <p> <span i18n=\"@@transactionId\">Transaction ID</span>: {{data.notarizResp.transactionId}}</p>\r\n        <p> <span i18n=\"@@fileHash\">File Hash</span>: {{data.notarizResp.fileHash}}</p>\r\n      }\r\n      @case ('PENDING') {\r\n        <p i18n=\"@@notarizationPending\">The notarization request has been sent. You will receive a communication once it is processed. </p>\r\n      }\r\n    }\r\n\r\n\r\n\r\n  </div>\r\n  <div feedback-action>\r\n    @if (data.notarizResp.status=='DONE' && !!data.notarizationPrintReceiptUrl) {\r\n      <button mat-button (click)=\"printReceipt()\">\r\n        <mat-icon svgIcon=\"receipt_download\"></mat-icon>\r\n        <span  i18n=\"@@printreceipt\">Print Receipt</span>\r\n      </button>\r\n    }\r\n    <span [style.flex]=\"1\"></span>\r\n    <button mat-button mat-dialog-close cdkFocusInitial>OK</button>\r\n  </div>\r\n</sii-banner-feedback>\r\n", styles: [""], dependencies: [{ kind: "component", type: BannerFeedbackComponent, selector: "sii-banner-feedback", inputs: ["type"] }, { kind: "component", type: MatButton, selector: "    button[mat-button], button[mat-raised-button], button[mat-flat-button],    button[mat-stroked-button]  ", exportAs: ["matButton"] }, { kind: "component", type: MatIcon, selector: "mat-icon", inputs: ["color", "inline", "svgIcon", "fontSet", "fontIcon"], exportAs: ["matIcon"] }, { kind: "directive", type: MatDialogClose, selector: "[mat-dialog-close], [matDialogClose]", inputs: ["aria-label", "type", "mat-dialog-close", "matDialogClose"], exportAs: ["matDialogClose"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: NotarizationResponseDialogComponent, decorators: [{
            type: Component,
            args: [{ selector: 'sii-notarization-response-dialog', standalone: true, imports: [BannerFeedbackComponent, MatButton, MatIcon, MatDialogClose], template: "<sii-banner-feedback>\r\n  <div feedback-toolbar></div>\r\n  <div feedback-body style=\"display: flex; flex-direction: column; padding: 10px;\">\r\n\r\n    @switch (data.notarizResp.status) {\r\n      @case ('DONE') {\r\n        <p i18n=\"@@dialogDocumentSuccessNotarized\">The document has been correctly notarized</p>\r\n        <p i18n=\"@@dialogDocumentSuccessNotarizedData\">The operation data are as follows</p>\r\n        <p> <span i18n=\"@@transactionId\">Transaction ID</span>: {{data.notarizResp.transactionId}}</p>\r\n        <p> <span i18n=\"@@fileHash\">File Hash</span>: {{data.notarizResp.fileHash}}</p>\r\n      }\r\n      @case ('PENDING') {\r\n        <p i18n=\"@@notarizationPending\">The notarization request has been sent. You will receive a communication once it is processed. </p>\r\n      }\r\n    }\r\n\r\n\r\n\r\n  </div>\r\n  <div feedback-action>\r\n    @if (data.notarizResp.status=='DONE' && !!data.notarizationPrintReceiptUrl) {\r\n      <button mat-button (click)=\"printReceipt()\">\r\n        <mat-icon svgIcon=\"receipt_download\"></mat-icon>\r\n        <span  i18n=\"@@printreceipt\">Print Receipt</span>\r\n      </button>\r\n    }\r\n    <span [style.flex]=\"1\"></span>\r\n    <button mat-button mat-dialog-close cdkFocusInitial>OK</button>\r\n  </div>\r\n</sii-banner-feedback>\r\n" }]
        }], ctorParameters: () => [{ type: undefined, decorators: [{
                    type: Inject,
                    args: [MAT_DIALOG_DATA]
                }] }, { type: i1.HttpClient }] });

class DateHintDirective {
    constructor(el, siiDatePipe, siiToolkitService) {
        this.el = el;
        this.siiDatePipe = siiDatePipe;
        this.siiToolkitService = siiToolkitService;
    }
    ngAfterContentInit() {
        if (this.matInput != null) {
            this.dateHint = document.createElement('span');
            this.initialize(this.matInput.ngControl, this.dateHint);
            this.matInput.stateChanges.pipe(debounceTime(100)).subscribe((res) => {
                if (this.el.nativeElement.getElementsByClassName("mat-mdc-form-field-error-wrapper").length > 0) {
                    this.dateHint.style.display = 'none';
                }
                else {
                    this.dateHint.style.display = '';
                }
            });
        }
        if (this.endDate != null && this.startDate != null) {
            this.endDateHint = document.createElement('span');
            this.startDateHint = document.createElement('span');
            this.initialize(this.endDate.ngControl, this.endDateHint);
            this.initialize(this.startDate.ngControl, this.startDateHint, true);
            this.startDate.stateChanges.pipe(debounceTime(100)).subscribe((res) => {
                this.checkForError();
            });
            this.endDate.stateChanges.pipe(debounceTime(100)).subscribe((res) => {
                this.checkForError();
            });
        }
    }
    checkForError() {
        if (this.el.nativeElement.getElementsByClassName("mat-mdc-form-field-error-wrapper").length > 0) {
            this.startDateHint.style.display = 'none';
            this.endDateHint.style.display = 'none';
        }
        else {
            this.startDateHint.style.display = '';
            this.endDateHint.style.display = '';
        }
    }
    initialize(control, hintSpan, addSeparator = false) {
        hintSpan.classList.add('mat-hint');
        this.el.nativeElement.getElementsByClassName('mat-mdc-form-field-bottom-align')[0].
            insertAdjacentElement('afterbegin', hintSpan);
        control.valueChanges
            .pipe(startWith(control.value), distinctUntilChanged())
            .subscribe((val) => {
            if (val instanceof Array) {
                Promise.resolve().then(() => {
                    control.control.setValue(new Date(val[0], val[1] - 1, val[2]), { emitEvent: false });
                });
            }
            if (val != null) {
                if (this.siiToolkitService.loggedUser.value.inputDatePattern.toLowerCase() === this.siiToolkitService.loggedUser.value.displayDatePattern.toLowerCase()) {
                    hintSpan.innerHTML = '';
                }
                else {
                    hintSpan.innerHTML = this.siiDatePipe.transform(val) + (addSeparator ? " - " : "");
                }
            }
            else {
                hintSpan.innerHTML = this.siiToolkitService.loggedUser.value.inputDatePattern.toLowerCase() + (addSeparator ? " - " : "");
            }
        });
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: DateHintDirective, deps: [{ token: i0.ElementRef }, { token: SiiDatePipe }, { token: SiiToolkitService }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "18.2.13", type: DateHintDirective, isStandalone: true, selector: "[siiDateHint]", providers: [SiiDatePipe], queries: [{ propertyName: "matInput", first: true, predicate: MatInput, descendants: true }, { propertyName: "startDate", first: true, predicate: MatStartDate, descendants: true }, { propertyName: "endDate", first: true, predicate: MatEndDate, descendants: true }], ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: DateHintDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[siiDateHint]',
                    providers: [SiiDatePipe],
                    standalone: true
                }]
        }], ctorParameters: () => [{ type: i0.ElementRef }, { type: SiiDatePipe }, { type: SiiToolkitService }], propDecorators: { matInput: [{
                type: ContentChild,
                args: [MatInput]
            }], startDate: [{
                type: ContentChild,
                args: [MatStartDate]
            }], endDate: [{
                type: ContentChild,
                args: [MatEndDate]
            }] } });

/** Data structure for holding year month item. */
class SiiYearMonth {
    constructor(year, month) {
        this.year = year;
        this.month = month;
    }
}
/** Custom `MatFormFieldControl` for telephone number input. */
class YearMonthInputComponent {
    get empty() {
        const { value: { year, month } } = this.parts;
        return !month && !year;
    }
    get emptyMonth() {
        const { value: { month } } = this.parts;
        return !month;
    }
    get emptyYear() {
        const { value: { year } } = this.parts;
        return !year;
    }
    get shouldLabelFloat() {
        return this.focused || !this.empty;
    }
    get placeholder() {
        return this._placeholder;
    }
    set placeholder(value) {
        this._placeholder = value;
        this.stateChanges.next();
    }
    get required() {
        return this._required;
    }
    set required(value) {
        this._required = coerceBooleanProperty(value);
        this.stateChanges.next();
    }
    get disabled() {
        return this._disabled;
    }
    set disabled(value) {
        this._disabled = coerceBooleanProperty(value);
        this._disabled ? this.parts.disable() : this.parts.enable();
        this.stateChanges.next();
    }
    get value() {
        if (this.parts.valid) {
            const { value: { year, month } } = this.parts;
            return new SiiYearMonth(year, month);
        }
        return null;
    }
    set value(my) {
        const { year, month } = my || new SiiYearMonth('', '');
        this.parts.setValue({ year, month });
        this.stateChanges.next();
    }
    get errorState() {
        return (this.parts.dirty || (!!this.ngControl && this.ngControl.control.touched))
            &&
                this.isInvalid;
    }
    get isInvalid() {
        return this.required ? (this.emptyMonth || this.emptyYear || this.parts.invalid)
            : ((this.emptyMonth && !this.emptyYear) || (!this.emptyMonth && this.emptyYear) || (!this.empty && this.parts.invalid));
    }
    get isValid() {
        return !this.isInvalid;
    }
    constructor(formBuilder, focusMonitor, elementRef, formField, ngControl) {
        this.focusMonitor = focusMonitor;
        this.elementRef = elementRef;
        this.formField = formField;
        this.ngControl = ngControl;
        this.valueChange = new EventEmitter();
        this.stateChanges = new Subject();
        this.focused = false;
        this.controlType = 'sii-year-month-input';
        this.id = `sii-year-month-input-${YearMonthInputComponent.nextId++}`;
        this._required = false;
        this._disabled = false;
        this.onChange = (_) => { };
        this.onTouched = () => { };
        this.parts = formBuilder.group({
            month: [null, validMonth(this.required)],
            year: [null, validYear(this.required)]
        });
        focusMonitor.monitor(elementRef, true).subscribe(origin => {
            if (this.focused && !origin) {
                this.onTouched();
            }
            this.focused = !!origin;
            this.stateChanges.next();
        });
        if (this.ngControl != null) {
            this.ngControl.valueAccessor = this;
        }
    }
    static { this.nextId = 0; }
    ngAfterViewInit() {
        if (!!this.ngControl) {
            if (hasRequiredField(this.ngControl.control)) {
                this.required = true;
            }
            Promise.resolve().then(() => {
                this.ngControl.control.setValidators(this.validate.bind(this));
                this.ngControl.control.updateValueAndValidity();
            });
        }
    }
    autoFocusNext(control, nextElement) {
        if (!control.errors && nextElement) {
            this.focusMonitor.focusVia(nextElement, 'program');
        }
    }
    autoFocusPrev(control, prevElement) {
        if ((control.value || '').length < 1) {
            this.focusMonitor.focusVia(prevElement, 'program');
        }
    }
    ngOnDestroy() {
        this.stateChanges.complete();
        this.focusMonitor.stopMonitoring(this.elementRef);
    }
    setDescribedByIds(ids) {
        const controlElement = this.elementRef.nativeElement.querySelector('.sii-year-month-input-container');
        controlElement.setAttribute('aria-describedby', ids.join(' '));
    }
    onContainerClick(ev) {
        if (ev.target.tagName !== 'INPUT') {
            if (!this.emptyYear && this.parts.controls.year.valid) {
                this.focusMonitor.focusVia(this.monthInput, 'program');
            }
            else {
                this.focusMonitor.focusVia(this.yearInput, 'program');
            }
        }
    }
    writeValue(tel) {
        this.value = tel;
    }
    registerOnChange(fn) {
        this.onChange = fn;
    }
    registerOnTouched(fn) {
        this.onTouched = fn;
    }
    setDisabledState(isDisabled) {
        this.disabled = isDisabled;
    }
    validate(c) {
        return this.isInvalid ? { invalid: true } : null;
    }
    _handleInput(control, nextElement) {
        this.autoFocusNext(control, nextElement);
        this.onChange(this.value);
        this.valueChange.emit(this.value);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: YearMonthInputComponent, deps: [{ token: i1$6.UntypedFormBuilder }, { token: i2$3.FocusMonitor }, { token: i0.ElementRef }, { token: MAT_FORM_FIELD, optional: true }, { token: i1$6.NgControl, optional: true, self: true }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "18.2.13", type: YearMonthInputComponent, isStandalone: true, selector: "sii-year-month-input", inputs: { placeholder: "placeholder", required: "required", disabled: "disabled", value: "value", userAriaDescribedBy: ["aria-describedby", "userAriaDescribedBy"] }, outputs: { valueChange: "valueChange" }, host: { properties: { "class.example-floating": "shouldLabelFloat", "id": "id" } }, providers: [{ provide: MatFormFieldControl, useExisting: YearMonthInputComponent }], viewQueries: [{ propertyName: "yearInput", first: true, predicate: ["year"], descendants: true }, { propertyName: "monthInput", first: true, predicate: ["month"], descendants: true }], ngImport: i0, template: "<div role=\"group\" class=\"sii-year-month-input-container\"\r\n     [formGroup]=\"parts\"\r\n     [attr.aria-labelledby]=\"formField?.getLabelId()\">\r\n  <input class=\"sii-year-month-input-element\" style=\"width:45px\"\r\n         formControlName=\"year\"\r\n         maxLength=\"4\"\r\n         size=\"4\"\r\n         placeholder=\"YYYY\"\r\n         aria-label=\"Year\"\r\n         (input)=\"_handleInput(parts.controls.year,month)\"\r\n         #year>\r\n  <span class=\"sii-year-month-input-spacer\">/</span>\r\n  <input class=\"sii-year-month-input-element\" style=\"margin-left: 5px;\"\r\n         formControlName=\"month\" size=\"2\"\r\n         maxLength=\"2\"\r\n         placeholder=\"MM\"\r\n         aria-label=\"Month\"\r\n         (input)=\"_handleInput(parts.controls.month)\"\r\n         (keyup.backspace)=\"autoFocusPrev(parts.controls.month, year)\"\r\n         #month>\r\n\r\n</div>\r\n", styles: [".sii-year-month-input-container{display:flex}.sii-year-month-input-element{border:none;background:none;padding:0;outline:none;font:inherit}.sii-year-month-input-spacer,.sii-year-month-input-element{opacity:0;transition:opacity .2s}:host.example-floating .sii-year-month-input-spacer,:host.example-floating .sii-year-month-input-element{opacity:1}\n"], dependencies: [{ kind: "ngmodule", type: FormsModule }, { kind: "directive", type: i1$6.DefaultValueAccessor, selector: "input:not([type=checkbox])[formControlName],textarea[formControlName],input:not([type=checkbox])[formControl],textarea[formControl],input:not([type=checkbox])[ngModel],textarea[ngModel],[ngDefaultControl]" }, { kind: "directive", type: i1$6.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i1$6.NgControlStatusGroup, selector: "[formGroupName],[formArrayName],[ngModelGroup],[formGroup],form:not([ngNoForm]),[ngForm]" }, { kind: "ngmodule", type: ReactiveFormsModule }, { kind: "directive", type: i1$6.FormGroupDirective, selector: "[formGroup]", inputs: ["formGroup"], outputs: ["ngSubmit"], exportAs: ["ngForm"] }, { kind: "directive", type: i1$6.FormControlName, selector: "[formControlName]", inputs: ["formControlName", "disabled", "ngModel"], outputs: ["ngModelChange"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: YearMonthInputComponent, decorators: [{
            type: Component,
            args: [{ selector: 'sii-year-month-input', providers: [{ provide: MatFormFieldControl, useExisting: YearMonthInputComponent }], host: {
                        '[class.example-floating]': 'shouldLabelFloat',
                        '[id]': 'id',
                    }, standalone: true, imports: [FormsModule, ReactiveFormsModule], template: "<div role=\"group\" class=\"sii-year-month-input-container\"\r\n     [formGroup]=\"parts\"\r\n     [attr.aria-labelledby]=\"formField?.getLabelId()\">\r\n  <input class=\"sii-year-month-input-element\" style=\"width:45px\"\r\n         formControlName=\"year\"\r\n         maxLength=\"4\"\r\n         size=\"4\"\r\n         placeholder=\"YYYY\"\r\n         aria-label=\"Year\"\r\n         (input)=\"_handleInput(parts.controls.year,month)\"\r\n         #year>\r\n  <span class=\"sii-year-month-input-spacer\">/</span>\r\n  <input class=\"sii-year-month-input-element\" style=\"margin-left: 5px;\"\r\n         formControlName=\"month\" size=\"2\"\r\n         maxLength=\"2\"\r\n         placeholder=\"MM\"\r\n         aria-label=\"Month\"\r\n         (input)=\"_handleInput(parts.controls.month)\"\r\n         (keyup.backspace)=\"autoFocusPrev(parts.controls.month, year)\"\r\n         #month>\r\n\r\n</div>\r\n", styles: [".sii-year-month-input-container{display:flex}.sii-year-month-input-element{border:none;background:none;padding:0;outline:none;font:inherit}.sii-year-month-input-spacer,.sii-year-month-input-element{opacity:0;transition:opacity .2s}:host.example-floating .sii-year-month-input-spacer,:host.example-floating .sii-year-month-input-element{opacity:1}\n"] }]
        }], ctorParameters: () => [{ type: i1$6.UntypedFormBuilder }, { type: i2$3.FocusMonitor }, { type: i0.ElementRef }, { type: i3.MatFormField, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [MAT_FORM_FIELD]
                }] }, { type: i1$6.NgControl, decorators: [{
                    type: Optional
                }, {
                    type: Self
                }] }], propDecorators: { valueChange: [{
                type: Output
            }], placeholder: [{
                type: Input
            }], required: [{
                type: Input
            }], disabled: [{
                type: Input
            }], value: [{
                type: Input
            }], yearInput: [{
                type: ViewChild,
                args: ['year']
            }], monthInput: [{
                type: ViewChild,
                args: ['month']
            }], userAriaDescribedBy: [{
                type: Input,
                args: ['aria-describedby']
            }] } });
function validMonth(required) {
    return (control) => {
        let valid = false;
        const validMonthValue = (m) => m.length === 2 && !isNaN(Number(m)) && Number(m) >= 1 && Number(m) <= 12;
        if (required) {
            valid = !isEmpty(control.value) && validMonthValue(control.value);
        }
        else {
            valid = isEmpty(control.value) || validMonthValue(control.value);
        }
        return !valid ? { invalidMonth: { value: control.value } } : null;
    };
}
function validYear(required) {
    return (control) => {
        let valid = false;
        const validYearValue = (m) => m.length === 4 && !isNaN(Number(m)) && Number(m) >= 1;
        if (required) {
            valid = !isEmpty(control.value) && validYearValue(control.value);
        }
        else {
            valid = isEmpty(control.value) || validYearValue(control.value);
        }
        return !valid ? { invalidYear: { value: control.value } } : null;
    };
}
function isEmpty(item) {
    return item == null || item === undefined || item.length === 0;
}
const hasRequiredField = (abstractControl) => {
    if (abstractControl.validator) {
        const validator = abstractControl.validator({});
        if (validator && validator.required) {
            return true;
        }
    }
    // if (abstractControl.controls) {
    //     for (const controlName in abstractControl.controls) {
    //         if (abstractControl.controls[controlName]) {
    //             if (hasRequiredField(abstractControl.controls[controlName])) {
    //                 return true;
    //             }
    //         }
    //     }
    // }
    return false;
};

class AutoHideRowDirective {
    get id() {
        return this.siiAutoHideRow;
    }
    get offsetTop() {
        return !!this.targetItem ? this.targetItem.getBoundingClientRect().bottom : 0;
    }
    get targetItem() {
        return this.isVisible ? this.el.nativeElement.previousElementSibling.firstChild.firstChild : this.fakeElement;
    }
    constructor(el, templateRef, viewContainer) {
        this.el = el;
        this.templateRef = templateRef;
        this.viewContainer = viewContainer;
        this.isVisible = false;
    }
    ngOnDestroy() {
        if (!!this.fakeElement) {
            this.fakeElement.parentNode.removeChild(this.fakeElement);
            this.fakeElement = null;
        }
    }
    ngOnInit() {
        this.show();
    }
    createFakeItem() {
        const fi = document.createElement('span');
        // fi.classList.add('gluglu');
        // fi.classList.add('glu' + this.id);
        const cs = window.getComputedStyle(this.targetItem);
        // Array.from(cs).forEach(key => fi.style.setProperty(key, cs.getPropertyValue(key), cs.getPropertyPriority(key)));
        fi.style.height = cs.height;
        fi.style.width = cs.width;
        fi.style.minHeight = cs.minHeight;
        fi.style.minWidth = cs.minWidth;
        fi.style.padding = cs.padding;
        fi.style.margin = cs.margin;
        fi.style.border = cs.border;
        fi.style.flex = cs.flex;
        // fi.style.backgroundColor = 'gray';
        // fi.innerHTML = this.id;
        return fi;
    }
    hide() {
        if (this.isVisible) {
            this.fakeElement = this.createFakeItem();
            this.el.nativeElement.parentNode.insertBefore(this.fakeElement, this.el.nativeElement.previousElementSibling);
            this.viewContainer.clear();
            this.isVisible = false;
        }
    }
    show() {
        if (!this.isVisible) {
            this.viewContainer.createEmbeddedView(this.templateRef);
            this.isVisible = true;
            if (!!this.fakeElement) {
                this.fakeElement.parentNode.removeChild(this.fakeElement);
                this.fakeElement = null;
            }
        }
    }
    refresh() {
        this.fakeElement.parentNode.removeChild(this.fakeElement);
        this.viewContainer.createEmbeddedView(this.templateRef);
        this.isVisible = true;
        setTimeout(() => {
            // Promise.resolve().then(() => {
            this.fakeElement = this.createFakeItem();
            this.viewContainer.clear();
            this.isVisible = false;
            this.el.nativeElement.parentNode.insertBefore(this.fakeElement, this.el.nativeElement.previousElementSibling);
            // });
        }, 0);
    }
    check(refresh = false) {
        if (this.offsetTop < -1000) {
            if (refresh && !this.isVisible) {
                this.refresh();
            }
            else {
                this.hide();
            }
        }
        else {
            this.show();
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: AutoHideRowDirective, deps: [{ token: i0.ElementRef }, { token: i0.TemplateRef }, { token: i0.ViewContainerRef }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "18.2.13", type: AutoHideRowDirective, isStandalone: true, selector: "[siiAutoHideRow]", inputs: { siiAutoHideRow: "siiAutoHideRow" }, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: AutoHideRowDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[siiAutoHideRow]',
                    standalone: true
                }]
        }], ctorParameters: () => [{ type: i0.ElementRef }, { type: i0.TemplateRef }, { type: i0.ViewContainerRef }], propDecorators: { siiAutoHideRow: [{
                type: Input
            }] } });

class SiiFacetTemplateDirective {
    constructor() {
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: SiiFacetTemplateDirective, deps: [], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "18.2.13", type: SiiFacetTemplateDirective, isStandalone: true, selector: "[siiFacetTemplate]", ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: SiiFacetTemplateDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[siiFacetTemplate]',
                    standalone: true
                }]
        }], ctorParameters: () => [] });

class BreadcrumbComponent {
    get breadcrumbList() {
        return this.breadcrumbService.breadcrumb;
    }
    constructor(breadcrumbService, router) {
        this.breadcrumbService = breadcrumbService;
        this.router = router;
    }
    routerLinkClicked(event, index, breadItem) {
        if (index == 0 && !!this.externalHome || !!this.home) {
            event.stopImmediatePropagation();
            if (!!this.home) {
                this.router.navigate(this.home);
            }
            else {
                window.open(this.externalHome, "_self");
            }
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: BreadcrumbComponent, deps: [{ token: SiiBreadcrumbService }, { token: i4.Router }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "18.2.13", type: BreadcrumbComponent, isStandalone: true, selector: "sii-breadcrumb", inputs: { externalHome: "externalHome", home: "home" }, ngImport: i0, template: "\r\n@if ((breadcrumbList | async); as lista) {\r\n  <nav>\r\n    @for (bread of lista; track bread; let last = $last; let index = $index) {\r\n      @if (  index==0 || index == lista.length-2 || last) {\r\n        <a  (click)=\"routerLinkClicked($event,index,bread)\" [routerLink]=\" bread.url\" [fragment]=\"bread.fragment\" [queryParams]=\"bread.queryParams\"  [ngClass]=\"{'currentBread':last}\"> {{bread.label}}</a>\r\n        @if (!last) {\r\n          <span style=\" padding: 0 10px;\">/</span>\r\n        }\r\n      }\r\n      @if (lista.length>3 &&  index==1 ) {\r\n        <button mat-button [matMenuTriggerFor]=\"menu\" class=\"ellipsedItemsButton\">...</button>\r\n        <mat-menu #menu=\"matMenu\">\r\n          @for (menubread of lista; track menubread; let lastmb = $last; let indexmb = $index) {\r\n            @if (indexmb>=1 && indexmb<lista.length-2) {\r\n              <a mat-menu-item  [routerLink]=\" menubread.url\" [fragment]=\"menubread.fragment\" [queryParams]=\"menubread.queryParams\"   >{{menubread.label}}</a>\r\n            }\r\n          }\r\n        </mat-menu>\r\n        @if (!last) {\r\n          <span style=\" padding: 0 10px;\">/</span>\r\n        }\r\n      }\r\n    }\r\n  </nav>\r\n}\r\n", styles: ["nav a{color:inherit;text-decoration:auto;display:inline-block;text-transform:capitalize}nav a:hover{text-decoration:underline}nav a.currentBread{pointer-events:none;opacity:.8}nav a.currentBread:after{content:unset}.ellipsedItemsButton{min-width:20px;margin:0 -15px}\n"], dependencies: [{ kind: "directive", type: RouterLink, selector: "[routerLink]", inputs: ["target", "queryParams", "fragment", "queryParamsHandling", "state", "info", "relativeTo", "preserveFragment", "skipLocationChange", "replaceUrl", "routerLink"] }, { kind: "directive", type: NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "component", type: MatButton, selector: "    button[mat-button], button[mat-raised-button], button[mat-flat-button],    button[mat-stroked-button]  ", exportAs: ["matButton"] }, { kind: "directive", type: MatMenuTrigger, selector: "[mat-menu-trigger-for], [matMenuTriggerFor]", inputs: ["mat-menu-trigger-for", "matMenuTriggerFor", "matMenuTriggerData", "matMenuTriggerRestoreFocus"], outputs: ["menuOpened", "onMenuOpen", "menuClosed", "onMenuClose"], exportAs: ["matMenuTrigger"] }, { kind: "component", type: MatMenu, selector: "mat-menu", inputs: ["backdropClass", "aria-label", "aria-labelledby", "aria-describedby", "xPosition", "yPosition", "overlapTrigger", "hasBackdrop", "class", "classList"], outputs: ["closed", "close"], exportAs: ["matMenu"] }, { kind: "component", type: MatMenuItem, selector: "[mat-menu-item]", inputs: ["role", "disabled", "disableRipple"], exportAs: ["matMenuItem"] }, { kind: "pipe", type: AsyncPipe, name: "async" }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: BreadcrumbComponent, decorators: [{
            type: Component,
            args: [{ selector: 'sii-breadcrumb', standalone: true, imports: [
                        RouterLink,
                        NgClass,
                        MatButton,
                        MatMenuTrigger,
                        MatMenu,
                        MatMenuItem,
                        AsyncPipe,
                    ], template: "\r\n@if ((breadcrumbList | async); as lista) {\r\n  <nav>\r\n    @for (bread of lista; track bread; let last = $last; let index = $index) {\r\n      @if (  index==0 || index == lista.length-2 || last) {\r\n        <a  (click)=\"routerLinkClicked($event,index,bread)\" [routerLink]=\" bread.url\" [fragment]=\"bread.fragment\" [queryParams]=\"bread.queryParams\"  [ngClass]=\"{'currentBread':last}\"> {{bread.label}}</a>\r\n        @if (!last) {\r\n          <span style=\" padding: 0 10px;\">/</span>\r\n        }\r\n      }\r\n      @if (lista.length>3 &&  index==1 ) {\r\n        <button mat-button [matMenuTriggerFor]=\"menu\" class=\"ellipsedItemsButton\">...</button>\r\n        <mat-menu #menu=\"matMenu\">\r\n          @for (menubread of lista; track menubread; let lastmb = $last; let indexmb = $index) {\r\n            @if (indexmb>=1 && indexmb<lista.length-2) {\r\n              <a mat-menu-item  [routerLink]=\" menubread.url\" [fragment]=\"menubread.fragment\" [queryParams]=\"menubread.queryParams\"   >{{menubread.label}}</a>\r\n            }\r\n          }\r\n        </mat-menu>\r\n        @if (!last) {\r\n          <span style=\" padding: 0 10px;\">/</span>\r\n        }\r\n      }\r\n    }\r\n  </nav>\r\n}\r\n", styles: ["nav a{color:inherit;text-decoration:auto;display:inline-block;text-transform:capitalize}nav a:hover{text-decoration:underline}nav a.currentBread{pointer-events:none;opacity:.8}nav a.currentBread:after{content:unset}.ellipsedItemsButton{min-width:20px;margin:0 -15px}\n"] }]
        }], ctorParameters: () => [{ type: SiiBreadcrumbService }, { type: i4.Router }], propDecorators: { externalHome: [{
                type: Input
            }], home: [{
                type: Input
            }] } });

class ListRowDirective {
    constructor() { }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: ListRowDirective, deps: [], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "18.2.13", type: ListRowDirective, isStandalone: true, selector: "[siiListRow]", ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: ListRowDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[siiListRow]',
                    standalone: true
                }]
        }], ctorParameters: () => [] });

class EmptyListMessageDirective {
    constructor() {
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: EmptyListMessageDirective, deps: [], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "18.2.13", type: EmptyListMessageDirective, isStandalone: true, selector: "[siiEmptyListMessage]", ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: EmptyListMessageDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[siiEmptyListMessage]',
                    standalone: true
                }]
        }], ctorParameters: () => [] });

class SiiGroupedInfiniteScrollDataSource {
    get data() { return this._dataStream; }
    get dataValue() { return this._dataStream.value; }
    get fetchSize() {
        return this.siiListController._fetchSize;
    }
    get listSize() {
        return this._cachedData.length;
    }
    get displayedListSize() {
        return this._displayedData.length;
    }
    get visibleGroups() {
        return this.utils.groups.byVisiblePos;
    }
    get bySiiId() {
        return this.utils.groups.bySiiId;
    }
    constructor(siiListController, ref) {
        this.siiListController = siiListController;
        this.ref = ref;
        this.utils = {
            lastRequestedPage: undefined,
            groups: { byKey: {}, byRealPos: {}, byVisiblePos: {}, byParentGroupKey: {}, bySiiId: {} },
            collapsedGroup: [],
            collapsedParentGroup: {},
            itemsToFetchAfterCollapse: undefined,
            selectAllFetchedPage: undefined
        };
        this.lastFetchedpage = -1;
        this._cachedData = [];
        this._displayedData = Array.from({ length: this.fetchSize });
        this._dataStream = new BehaviorSubject(this._cachedData);
        this._subscription = new Subscription();
        this.listChangeSubscriptionFunction = (page, res, reset) => {
            // console.log(`listChangeSubscriptionFunction - ${page}`)
            if (reset) {
                this._cachedData = [];
                this.lastFetchedpage = page;
                this.utils.collapsedGroup.length = 0;
                this.utils.collapsedParentGroup = {};
            }
            // if(reset || res.count> this._cachedData.length){
            //   this._cachedData.length= res.count
            // }
            // console.log(`page: ${page} -> splice(${page*this.fetchSize},${res.data.length}, data)   -> dataLength=${this._cachedData.length}`)
            this.fillCachedData(page * this.fetchSize);
            let idTime = new Date().getTime();
            this._cachedData.splice(page * this.fetchSize, res.data.length, ...res.data.map(d => ({ ...d, ...{ _siiId: idTime++ } })));
            // console.log( `dataLength=${this._cachedData.length}` )
            this.buildGroups();
            this.siiListController.lastFetchRequestInfo = { ...res, data: null };
        };
        this.fillCachedData = (toIndex) => {
            for (let i = 0; i < toIndex; i++) {
                if (!this._cachedData[i]) {
                    this._cachedData[i] = undefined;
                }
            }
        };
        this._subscription.add(siiListController.fetchPageData.subscribe((resp) => {
            this.listChangeSubscriptionFunction(resp.page, resp.rows, resp.reset);
            this.fetchItemsAfterCollapse();
            this.checkForSelectAll(resp.page);
        }));
        this._subscription.add(siiListController.selectAllObs.subscribe((resp) => this.selectAllSubscriptionFunction()));
        this._subscription.add(siiListController.refreshObs.subscribe((resp) => this.refreshSubscriptionFunction()));
    }
    fetchNextPage() {
        this._fetchPage(this.lastFetchedpage + 1);
    }
    get haveCollapsedGroups() {
        return this.utils.collapsedGroup.length > 0;
    }
    isGroupCollapsed(key) {
        return this.utils.collapsedGroup.indexOf(key) !== -1;
    }
    isParentGroupCollapsed(key) {
        return !!this.utils.collapsedParentGroup[key];
    }
    parentGroupSize(key) {
        return this.utils.groups.byParentGroupKey[key].reduce((a, g) => a + g.length, 0);
    }
    _fetchPage(page) {
        // if (this._fetchedPages.has(page)) {
        //   return;
        // }
        if (page === 0 || page < this.siiListController.lastFetchRequestInfo.maxPage) {
            this.lastFetchedpage = page;
            // console.log(`_fetchPage ${page}`, this._fetchedPages);
            this.siiListController.doFetchPage.next(page);
        }
        else {
            // console.log('NO MORE PAGES')
        }
    }
    buildData() {
        this.utils.groups.byVisiblePos = {};
        // recupero la dimensione degli elementi collassati
        const collapsedDim = this.utils.collapsedGroup.map(cg => this.utils.groups.byKey[cg]?.length).reduce((a, i) => { a += i; return a; }, 0);
        const newData = Array.from({ length: this._cachedData.length - collapsedDim });
        const grPosArr = Object.keys(this.utils.groups.byRealPos);
        let collapsedItemCount = 0;
        for (const grPos of grPosArr) {
            const currGr = this.utils.groups.byRealPos[grPos];
            if (this.utils.collapsedGroup.findIndex(k => k === currGr.key) !== -1) {
                // se il gruppo  è collassato aggiungo solo in puntatore
                this.addGroupPointer(currGr.firstItem - collapsedItemCount, currGr);
                collapsedItemCount += currGr.length;
            }
            else {
                // aggiungo gli elementi in base alla loro posizione rispetto al gruppo
                this.addGroupPointer((+grPos - collapsedItemCount), currGr);
                for (let z = 0, j = +grPos; z < currGr.length; j++, z++) {
                    newData[j - collapsedItemCount] = currGr.items[z];
                }
            }
        }
        this._displayedData = newData;
        this._dataStream.next(this._displayedData);
        this.ref.markForCheck();
        this.ref.detectChanges();
    }
    addGroupPointer(pos, item) {
        if (this.utils.groups.byVisiblePos[pos] === undefined) {
            this.utils.groups.byVisiblePos[pos] = [];
        }
        this.utils.groups.byVisiblePos[pos].push(item);
    }
    getGroupKey(record) {
        return record[this.siiListController._groupField.groupKey] + (!!this.siiListController._groupField.parentGroupKey ? record[this.siiListController._groupField.parentGroupKey] : '');
    }
    buildGroups() {
        const groups = [];
        if (!this.siiListController._groupField.groupKey) {
            groups.push({
                label: undefined,
                items: this._cachedData,
                key: '##NOGROUP##',
                firstItem: 0,
                lastItem: this._cachedData.length - 1,
                length: this._cachedData.length
            });
        }
        else {
            from(this._cachedData)
                .pipe(filter(r => r !== undefined), groupBy(record => this.getGroupKey(record), p => p), mergeMap(group => zip(of(group.key), group.pipe(toArray()))))
                .subscribe((res) => {
                const parentGroupKey = !!this.siiListController._groupField.parentGroupKey ? res[1][0][this.siiListController._groupField.parentGroupKey] : null;
                const gta = {
                    key: (parentGroupKey || '') + res[1][0][this.siiListController._groupField.groupKey],
                    label: res[1][0][this.siiListController._groupField.groupValue],
                    groupKey: res[1][0][this.siiListController._groupField.groupKey],
                    items: res[1],
                    firstItem: this._cachedData.indexOf(res[1][0]),
                    lastItem: this._cachedData.indexOf(res[1][res[1].length - 1]),
                    length: res[1].length,
                    parentGroupKey,
                    parentGroupValue: !!this.siiListController._groupField.parentGroupValue ? res[1][0][this.siiListController._groupField.parentGroupValue] : null,
                    parentGroupLabelTransform: this.siiListController._groupField.parentGroupLabelTransform,
                    groupLabelTransform: this.siiListController._groupField.groupLabelTransform,
                    groupAction: this.siiListController._groupField.groupAction,
                    parentGroupAction: this.siiListController._groupField.parentGroupAction
                };
                if (!!this.siiListController._groupField.parentGroupKey && (groups.length === 0 || groups[groups.length - 1].parentGroupKey !== gta.parentGroupKey)) {
                    gta.isFirstOfparentGroup = true;
                }
                groups.push(gta);
            });
        }
        this.utils.groups.byKey = groups.reduce((a, i) => { a[i.key] = i; return a; }, {});
        this.utils.groups.byRealPos = groups.reduce((a, i) => { a[i.firstItem] = i; return a; }, {});
        this.utils.groups.bySiiId = groups.reduce((a, i) => { i.items.forEach(el => a[el._siiId] = i); return a; }, {});
        // groups.forEach((g) => {
        //   for (let i = g.firstItem; i <= g.lastItem; i++){
        //     this.utils.groups.byRowIndex[i] = g;
        //   }
        // });
        if (!!this.siiListController._groupField.parentGroupKey) {
            this.utils.groups.byParentGroupKey = {};
            groups.forEach((g) => {
                if (!this.utils.groups.byParentGroupKey[g.parentGroupKey]) {
                    this.utils.groups.byParentGroupKey[g.parentGroupKey] = [];
                }
                this.utils.groups.byParentGroupKey[g.parentGroupKey].push(g);
                if (this.utils.collapsedParentGroup.hasOwnProperty(g.parentGroupKey) && !this.isGroupCollapsed(g.key)) {
                    this.toggleGroup(g);
                }
            });
            // console.log('build groups', this.utils.groups.byParentGroupKey);
        }
        this.buildData();
    }
    toggleparentGroup(parentGroupId) {
        if (!this.utils.collapsedParentGroup.hasOwnProperty(parentGroupId)) {
            // collasso il gruppo
            this.utils.collapsedParentGroup[parentGroupId] = true;
            this.utils.groups.byParentGroupKey[parentGroupId].forEach(g => {
                if (!this.isGroupCollapsed(g.key)) {
                    this.toggleGroup(g);
                }
            });
        }
        else {
            delete this.utils.collapsedParentGroup[parentGroupId];
        }
    }
    toggleGroup(group) {
        const gk = this.utils.collapsedGroup.findIndex(k => group.key === k);
        if (gk === -1) {
            // collasso il gruppo
            this.utils.collapsedGroup.push(group.key);
            this.utils.itemsToFetchAfterCollapse = {
                size: group.length,
                group: group.key
            };
            this.fetchItemsAfterCollapse();
        }
        else {
            // rimuovo collasso
            this.utils.collapsedGroup.splice(gk, 1);
        }
        this.buildData();
    }
    fetchItemsAfterCollapse() {
        if (this.utils.itemsToFetchAfterCollapse !== undefined) {
            let allLoaded = true;
            const group = this.utils.groups.byKey[this.utils.itemsToFetchAfterCollapse.group];
            // for(let i=group.lastItem+1;i<Math.min(this._cachedData.length,(group.lastItem+this.utils.itemsToFetchAfterCollapse.size+1));i++){
            for (let i = group.lastItem + 1; i < Math.min(this.siiListController.api.itemsCount, (group.lastItem + this.utils.itemsToFetchAfterCollapse.size + 1)); i++) {
                if (this._cachedData[i] === undefined) {
                    allLoaded = false;
                    break;
                }
            }
            if (allLoaded) {
                this.utils.itemsToFetchAfterCollapse = undefined;
            }
            else {
                this.fetchNextPage();
            }
        }
    }
    refreshSubscriptionFunction() {
        // const pages=[...this._fetchedPages];
        // this._fetchedPages.clear();
        const pages = [];
        this._cachedData.length = 0;
        const lfp = this.lastFetchedpage;
        this.lastFetchedpage = -1;
        for (let i = 0; i <= lfp; i++) {
            pages.push(i);
            this._fetchPage(i);
        }
        // pages.forEach((page)=>{
        //   // console.log(`refresh page ${page}`)
        //   this._fetchPage(page)
        // })
        // dopo che ho caricato tutte le pagine, deseleziono gli elementi che non sono più presenti
        // mi metto quindi in ascolto per intercettare le response di tutte le pagine, e alla fine faccio l'operazione
        const fetchSubsc = this.siiListController.fetchPageData.subscribe((resp) => {
            pages.splice(pages.indexOf(resp.page), 1);
            if (pages.length === 0) {
                fetchSubsc.unsubscribe();
                Promise.resolve().then(() => {
                    this.siiListController.removeMissingSelection(this._cachedData);
                });
            }
        });
    }
    selectAllSubscriptionFunction() {
        const loadedItem = this._cachedData.reduce((acc, i) => {
            acc += i === undefined ? 0 : 1;
            return acc;
        }, 0);
        // se ho tutti gli elementi
        if (loadedItem === this.siiListController.lastFetchRequestInfo.count) {
            this.siiListController.markAsSelected(this._cachedData);
        }
        else {
            this.siiListController.selectAllInProgress = true;
            const newData = Array.from({ length: this.siiListController.api.itemsCount });
            this._cachedData.forEach((cd, index) => newData[index] = cd);
            this._cachedData = newData;
            for (let i = 0; i < this.siiListController.lastFetchRequestInfo.maxPage; i++) {
                if (i > this.lastFetchedpage) {
                    this._fetchPage(i);
                    if (this.utils.selectAllFetchedPage === undefined) {
                        this.utils.selectAllFetchedPage = [];
                    }
                    this.utils.selectAllFetchedPage.push(i);
                }
            }
        }
    }
    checkForSelectAll(page) {
        // console.log(`checkForSelectAll -> ${page}` ,this.selectAllFetchedPage)
        if (this.utils.selectAllFetchedPage !== undefined) {
            this.utils.selectAllFetchedPage.splice(this.utils.selectAllFetchedPage.indexOf(page), 1);
            if (this.utils.selectAllFetchedPage.length === 0) {
                this.utils.selectAllFetchedPage = undefined;
                this.siiListController.markAsSelected(this._cachedData);
                this.siiListController.selectAllInProgress = false;
            }
        }
    }
}

class SiiListController {
    set lastFetchRequestInfo(lfri) {
        this._lastFetchRequestInfo = lfri;
        this.api.itemsCount = lfri.count;
    }
    get lastFetchRequestInfo() {
        return this._lastFetchRequestInfo;
    }
    constructor(waitService) {
        this.waitService = waitService;
        this._autosaveId = null;
        this._skipInitFacets = false;
        this._fetchSize = 20;
        this._currentpage = 0;
        this._lastEvaluatedKeyOfPage = {};
        this._maxFetchSize = 1000;
        this._sortField = { sort: null, sortAscending: true };
        this._groupField = { groupKey: null, groupValue: null };
        this.selectAllInProgress = false;
        this.currentFetchCall = Array();
        this.lastFacetRequest = { facets: {}, searchText: '' };
        this._selectionStatus = 'N';
        this._selectionMap = {};
        this._facetChangeSubj = new Subject();
        this.facetsData = this._facetChangeSubj.asObservable();
        this.doFetchPage = new Subject();
        this.fetchPage = this.doFetchPage.asObservable();
        this.executeSearch = new Subject();
        this.executeSearchObs = this.executeSearch.asObservable();
        this.facetsChange = new Subject();
        this.facetsChangeObs = this.facetsChange.asObservable();
        this.facetsReset = new Subject();
        this.facetsResetObs = this.facetsReset.asObservable();
        this.sortChange = new Subject();
        this.sortChangeObs = this.sortChange.asObservable();
        this._fetchPageDataSubj = new Subject();
        this.fetchPageData = this._fetchPageDataSubj.asObservable();
        this._selectedItemChangeSubj = new Subject();
        this._selectedItemsChangeSubj = new Subject();
        this._selectAllSubj = new Subject();
        this.selectAllObs = this._selectAllSubj.asObservable();
        this._refreshSubj = new Subject();
        this.refreshObs = this._refreshSubj.asObservable();
        this.setInitFacetsSubj = new Subject();
        this.setInitFacetsObs = this.setInitFacetsSubj.asObservable();
        this.changeFacetsSubj = new Subject();
        this.changeFacetsObs = this.changeFacetsSubj.asObservable();
        this.changeSearchTextSubj = new Subject();
        this.changeSearchTextObs = this.changeSearchTextSubj.asObservable();
        this.semaphoreFetch = 0;
        this.fetchInProgress = new BehaviorSubject(false);
        this.fetchInProgressObs = this.fetchInProgress.asObservable().pipe(distinctUntilChanged());
        this.api = {
            setAutoSave: (id, skipInitFacets = true) => { this.setAutosave(id, skipInitFacets); },
            setFetchService: (restService) => this._fetchService = restService,
            setFetchSize: (fs) => this._fetchSize = fs,
            setItemId: (id) => this._itemId = id,
            setMaxFetchSize: (mfs) => this._maxFetchSize = mfs,
            setInitFacets: (initFacets, searchText = '') => this.setInitfacets({ facets: initFacets, searchText }),
            changeFacets: (facets, searchText, resetOthers = true) => this.changeFacets(facets, searchText, resetOthers),
            selectedItemChange: this._selectedItemChangeSubj.asObservable(),
            selectedItemsChange: this._selectedItemsChangeSubj.asObservable(),
            selectAll: () => this.selectAll(),
            deselectAll: () => this.deselectAll(),
            refresh: () => this._refreshSubj.next(),
            reset: () => this.executeSearch.next(true),
            getFacet: (facetRef) => (this.lastFacetRequest || { facets: {} }).facets[facetRef],
            itemsCount: 0,
            selectedItemsCount: 0,
            getSelectedItems: () => Object.values(this._selectionMap),
            getFetchRequestData: () => this.getFetchRequestData()
        };
        // private changeSearchText(data: string){
        //   this.changeSearchTextSubj.next(data);
        // }
        this.getFetchRequestData = () => {
            return {
                fetchSize: this._fetchSize,
                page: this._currentpage,
                startKey: this._currentpage != 0 ? this._lastEvaluatedKeyOfPage[this._currentpage - 1] : null,
                selected: this.lastFacetRequest.facets,
                sort: this._sortField,
                group: this._groupField,
                textSearch: (this.lastFacetRequest.searchText.length === 0 ? null : this.lastFacetRequest.searchText)
            };
        };
        this.isSelected = (item) => {
            return this._selectionMap[item[this._itemId]] !== undefined;
        };
        this.fetchPage.subscribe((pagaReq) => {
            this._currentpage = pagaReq;
            this.executeSearch.next(false);
        });
        this.facetsChangeObs.subscribe((facetsChanges) => {
            this.lastFacetRequest = facetsChanges;
            this.executeSearch.next(true);
        });
        this.facetsResetObs.subscribe((facets) => {
            this.lastFacetRequest = facets;
            this.executeSearch.next(true);
        });
        this.sortChangeObs.subscribe(() => {
            this.executeSearch.next(true);
        });
        // this.searchChangeObs.subscribe((txt)=>{
        //   this._textSerch=txt;
        //   this.executeSearch.next(true);
        // })
        this.executeSearchObs
            .subscribe((reset) => {
            this.executeSearchFunction(reset);
        });
    }
    setAutosave(autosaveId, skipInitFacets) {
        this._autosaveId = autosaveId;
        const asaveDate = window.localStorage.getItem('siiList-' + this._autosaveId + 'date');
        if (asaveDate == null || ((new Date().getTime()) - parseInt(asaveDate, 10) - (1 * 24 * 60 * 60 * 1000) < 0)) {
            // se non è passato un giorno dall'ultimo salvataggio, riutilizzo i filtri salvati
            const asave = window.localStorage.getItem('siiList-' + this._autosaveId);
            if (asave != null && skipInitFacets) {
                try {
                    const jsonAsave = JSON.parse(asave);
                    this.setInitfacets({
                        facets: jsonAsave.selected,
                        searchText: (jsonAsave.textSearch || ''),
                        sort: jsonAsave.sort,
                        group: jsonAsave.group
                    });
                    this._skipInitFacets = true;
                }
                catch (err) {
                    console.log('Errore recupero configurazione lista salvata');
                }
            }
        }
    }
    setInitfacets(inif) {
        if (!this._skipInitFacets) {
            this.lastFacetRequest = inif;
            if (!!inif.sort) {
                this._sortField = inif.sort;
            }
            if (!!inif.group) {
                this._groupField = inif.group;
            }
            Promise.resolve().then(() => {
                this.setInitFacetsSubj.next(inif);
            });
        }
        else {
            this._skipInitFacets = false;
        }
    }
    changeFacets(facets, searchText, resetOthers) {
        if (facets != null || resetOthers) {
            this.changeFacetsSubj.next({ facets: (facets || {}), reset: resetOthers });
        }
        if (searchText != null || resetOthers) {
            this.changeSearchTextSubj.next(searchText || '');
        }
    }
    executeSearchFunction(reset = false) {
        if (reset) {
            this._currentpage = 0;
            this.deselectAll();
            this.currentFetchCall.forEach(i => i.unsubscribe());
            this.currentFetchCall.length == 0;
            this.semaphoreFetch = 0;
            this.hideFetchSpinner();
        }
        const page = this._currentpage;
        const ps = this._fetchSize;
        const fr = this.getFetchRequestData();
        this.waitService.skipNext();
        this.showFetchSpinner();
        this.currentFetchCall.push(this._fetchService(fr)
            .subscribe((resp) => {
            resp.rows.currPage = page;
            resp.rows.pageSize = ps;
            if (resp.rows.count == null) {
                resp.rows.count = ps * page + (resp.rows.data || []).length;
            }
            if (!!resp.rows?.lastEvaluatedKey) {
                this._lastEvaluatedKeyOfPage[page] = resp.rows?.lastEvaluatedKey;
                resp.rows.count += resp.rows?.lastEvaluatedKey == null ? 0 : 1;
            }
            resp.rows.maxPage = Math.ceil(resp.rows.count / ps);
            if (resp.facets != null) {
                this._facetChangeSubj.next(resp.facets);
            }
            this._fetchPageDataSubj.next({ page, rows: resp.rows, reset });
            this.hideFetchSpinner();
            if (!!this._autosaveId) {
                window.localStorage.setItem('siiList-' + this._autosaveId, JSON.stringify(fr));
                window.localStorage.setItem('siiList-' + this._autosaveId + 'date', new Date().getTime().toString());
            }
        }));
    }
    hideFetchSpinner() {
        this.semaphoreFetch--;
        if (this.semaphoreFetch < 0) {
            this.semaphoreFetch = 0;
        }
        if (this.semaphoreFetch === 0) {
            Promise.resolve().then(() => this.fetchInProgress.next(false));
        }
    }
    showFetchSpinner() {
        if (this.semaphoreFetch === 0) {
            Promise.resolve().then(() => this.fetchInProgress.next(true));
        }
        this.semaphoreFetch++;
    }
    // ----------start------------selections
    multiselectItemClick(selecteditem) {
        if (this._selectionMap[selecteditem[this._itemId]] === undefined) {
            // add item
            this._selectionMap[selecteditem[this._itemId]] = selecteditem;
        }
        else {
            // remove item
            delete this._selectionMap[selecteditem[this._itemId]];
        }
        this._selectedItemsChangeSubj.next(Object.values(this._selectionMap));
        this.updateSelectionStatus();
    }
    markAsSelected(items) {
        items.forEach((item) => {
            this._selectionMap[item[this._itemId]] = item;
        });
        this._selectedItemsChangeSubj.next(Object.values(this._selectionMap));
        this.updateSelectionStatus();
    }
    removeMissingSelection(items) {
        let someChange = false;
        Object.keys(this._selectionMap).forEach(selItemId => {
            if (items.filter(e => e !== undefined).findIndex(item => '' + item[this._itemId] === '' + selItemId) === -1) {
                delete this._selectionMap[selItemId];
                console.log(`rimuovo elemento ${selItemId} dopo il reload`);
                someChange = true;
            }
        });
        if (someChange) {
            this._selectedItemsChangeSubj.next(Object.values(this._selectionMap));
            this.updateSelectionStatus();
        }
    }
    singleselectItemClick(selecteditem) {
        if (this._selectionMap[selecteditem[this._itemId]] === undefined) {
            // add item
            this._selectionMap = {};
            this._selectionMap[selecteditem[this._itemId]] = selecteditem;
            this._selectedItemChangeSubj.next(this._selectionMap[selecteditem[this._itemId]]);
        }
        else {
            // remove item
            this._selectionMap = {};
            this._selectedItemChangeSubj.next(null);
        }
        this._selectedItemsChangeSubj.next(Object.values(this._selectionMap));
        this.updateSelectionStatus();
    }
    updateSelectionStatus() {
        this.api.selectedItemsCount = Object.values(this._selectionMap).length;
        switch (this.api.selectedItemsCount) {
            case 0:
                this._selectionStatus = 'N';
                break;
            case this.lastFetchRequestInfo.count:
                this._selectionStatus = 'A';
                break;
            default:
                this._selectionStatus = 'P';
                break;
        }
    }
    get selectionStatus() {
        return this._selectionStatus;
    }
    selectAll() {
        // se ci sono troppi elementi non posso fare la selezione
        // todo
        if (this.lastFetchRequestInfo.count > this._maxFetchSize) {
            alert('troppi elementi');
            return;
        }
        this._selectAllSubj.next();
    }
    deselectAll() {
        this._selectionMap = {};
        this._selectedItemsChangeSubj.next([]);
        this._selectedItemChangeSubj.next(null);
        this.updateSelectionStatus();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: SiiListController, deps: [{ token: SiiWaitService }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: SiiListController }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: SiiListController, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: SiiWaitService }] });

class GroupedInfiniteScrollComponent {
    constructor(el, siiListController, changeDetector) {
        this.el = el;
        this.siiListController = siiListController;
        this.changeDetector = changeDetector;
        this.multiselect = false;
        this.selectable = true;
        this.selectOnlyWithHandler = false; //la selezione singola o multipla avviene sollo dal sii-list-multiselect-handler
        this.itemClick = new EventEmitter();
        this.subscription = new Subscription();
        this.utils = {
            lastContentWidth: 0,
            hideNotVisibleRowObserver: new Subject(),
            resizeObserver: new Subject()
        };
        this.ds = new SiiGroupedInfiniteScrollDataSource(this.siiListController, this.changeDetector);
        // // lastScrollHeight=0;
        // public get scrollerEl():HTMLElement{
        //   return this.scrolleRef.nativeElement;
        // }
        this.scrollerEl = document;
        this.scrollerFunctionRef = (event) => {
            this.utils.hideNotVisibleRowObserver.next();
            if (event.target === event.currentTarget && !this.siiListController.fetchInProgress.value && this.isScrolledAtEndOfPage()) {
                //  console.log(` distance from bottom ${document.body.offsetHeight - Math.ceil(window.innerHeight + window.scrollY)}
                //  -> condition to fetch -> ${Math.ceil(window.innerHeight + window.scrollY) >= document.body.offsetHeight}`);
                //  condition to fetch -> ${Math.ceil(window.innerHeight + window.scrollY) >= document.body.offsetHeight}`);
                this.ds.fetchNextPage();
            }
        };
        this.clickedOnMultiselectHandler = (ev) => {
            return ev.target.closest('[sii-list-multiselect-handler]') !== null;
        };
        this.subscription.add(this.utils.hideNotVisibleRowObserver.pipe(debounceTime(100)).subscribe(() => this.hideNotVisibleRow()));
        this.subscription.add(this.utils.resizeObserver.pipe(debounceTime(100)).subscribe(() => {
            this.hideNotVisibleRow(true);
            this.checkForAvailableSpaceAfterResize();
        }));
        this.containerObserver = new ResizeObserver(entries => {
            if (entries[0].contentRect.width !== this.utils.lastContentWidth) {
                this.utils.lastContentWidth = entries[0].contentRect.width;
                this.utils.resizeObserver.next();
            }
        });
        this.subscription.add(siiListController.fetchPageData.subscribe((resp) => {
            if (resp.reset) {
                this.scrollerEl.scrollingElement.scrollTo({ top: 0 });
                // this.lastScrollHeight=0;
            }
            setTimeout(() => {
                // console.log(`infinitescroll fetchPageData
                // this.scrollerEl.offsetHeight===this.scrollerEl.scrollHeight=${this.scrollerEl.offsetHeight===this.scrollerEl.scrollHeight}
                // || this.lastScrollHeight(${this.lastScrollHeight})===this.scrollerEl.scrollHeight ${this.scrollerEl.scrollHeight} = ${this.lastScrollHeight===this.scrollerEl.scrollHeight}
                // &&resp.rows.maxPage>resp.rows.currPage= ${resp.rows.maxPage>resp.rows.currPage}`)
                if ((window.scrollY >= document.body.offsetHeight // scroll not visible
                    || this.isScrolledAtEndOfPage()
                // || this.lastScrollHeight===this.scrollerEl.scrollHeight     // l'ultima posizione non è variata
                ) && resp.rows.maxPage > resp.rows.currPage) {
                    // console.log('fetchBy setTimeout');
                    this.ds.fetchNextPage();
                    // this.lastScrollHeight=this.scrollerEl.scrollHeight;
                }
            }, 1000);
        }));
    }
    ngAfterViewInit() {
        this.containerObserver.observe(this.listContainer.nativeElement);
        // lancio la ricerca
        Promise.resolve().then(() => this.ds.fetchNextPage());
        this.scrollerEl.addEventListener('scroll', this.scrollerFunctionRef, { capture: true, passive: true });
    }
    isScrolledAtEndOfPage() {
        // aggiungo 2 px di margine
        return Math.round(window.innerHeight + window.scrollY + 2) >= document.body.offsetHeight;
    }
    hideNotVisibleRow(refresh = false) {
        this.listRows.forEach((i) => { i.check(refresh); });
        if (refresh) {
            this.utils.hideNotVisibleRowObserver.next();
        }
    }
    ngOnDestroy() {
        this.containerObserver.unobserve(this.listContainer.nativeElement);
        this.subscription.unsubscribe();
        if (this.widthWatchInterval) {
            clearInterval(this.widthWatchInterval);
        }
        this.scrollerEl.removeEventListener('scroll', this.scrollerFunctionRef, true);
    }
    itemClicked(item, ev) {
        this.itemClick.next(item);
        if (this.selectable) {
            if (this.multiselect && this.clickedOnMultiselectHandler(ev)) {
                this.siiListController.multiselectItemClick(item);
            }
            else {
                if (!this.selectOnlyWithHandler) {
                    this.siiListController.singleselectItemClick(item);
                }
            }
        }
    }
    checkForAvailableSpaceAfterResize() {
        if ((window.scrollY >= document.body.offsetHeight // scroll not visible
            || this.isScrolledAtEndOfPage() // i'm at the end of the page
        )
            && !this.siiListController.fetchInProgress.value
            //  && this.scrollerEl.scrollHeight!==this.lastScrollHeight
            && this.siiListController.lastFetchRequestInfo !== undefined
            && this.siiListController.lastFetchRequestInfo.maxPage > this.siiListController.lastFetchRequestInfo.currPage) {
            // console.log(`infiniteScroll. fetch page`)
            // console.log('fetchBy resize');
            this.ds.fetchNextPage();
            // this.lastScrollHeight=this.scrollerEl.scrollHeight;
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: GroupedInfiniteScrollComponent, deps: [{ token: i0.ElementRef }, { token: SiiListController }, { token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "18.2.13", type: GroupedInfiniteScrollComponent, isStandalone: true, selector: "sii-grouped-infinite-scroll", inputs: { multiselect: "multiselect", selectable: "selectable", selectOnlyWithHandler: "selectOnlyWithHandler", groupListToolbarClass: "groupListToolbarClass" }, outputs: { itemClick: "itemClick" }, queries: [{ propertyName: "templateRef", first: true, predicate: ListRowDirective, descendants: true, read: TemplateRef }, { propertyName: "noDataFoundTpl", first: true, predicate: EmptyListMessageDirective, descendants: true, read: TemplateRef }], viewQueries: [{ propertyName: "listContainer", first: true, predicate: ["vs_ref"], descendants: true }, { propertyName: "listRows", predicate: AutoHideRowDirective, descendants: true }], ngImport: i0, template: "<!-- <mat-progress-bar mode=\"query\" ></mat-progress-bar> -->\r\n@if (siiListController.fetchInProgressObs | async) {\r\n  <mat-progress-bar mode=\"query\"></mat-progress-bar>\r\n}\r\n\r\n<div class=\"infiniteScrollListContainer\" #vs_ref  >\r\n  <ng-content select=\"[listHeader]\"></ng-content>\r\n\r\n  @if (ds.listSize==0 && !(siiListController.fetchInProgressObs | async)) {\r\n    <div class=\"emptyListContainer\">\r\n      <ng-container  *ngTemplateOutlet=\"noDataFoundTpl || defaultEmptyData\" ></ng-container>\r\n    </div>\r\n  }\r\n\r\n  <!-- <div  [@fadeInOut]  style=\"width: 200px;height: 200px; background-color: red;\" *ngIf=\"vv\"></div> -->\r\n\r\n  @if (ds.displayedListSize==0 &&   ds.visibleGroups[0]!=undefined ) {\r\n    @for (gr of ds.visibleGroups[0]; track gr.key) {\r\n      <sii-group-list-toolbar [ngClass]=\"groupListToolbarClass\" [group]=\"gr\" [ds]=\"ds\"></sii-group-list-toolbar>\r\n    }\r\n  }\r\n\r\n\r\n  @for (item of ds.data | async  ; track item['_siiId']; let index = $index; let last = $last) {\r\n    @if (ds.visibleGroups[index] && (index!=0 || ds.visibleGroups[0][0].key!='##NOGROUP##' )) {\r\n      @for (gr of ds.visibleGroups[index]; track gr.key) {\r\n        <sii-group-list-toolbar [ngClass]=\"groupListToolbarClass\"  [group]=\"gr\" [ds]=\"ds\"></sii-group-list-toolbar>\r\n      }\r\n    }\r\n    <!-- siiFakeListItem [@fadeIn]-->\r\n    @if (item) {\r\n      <span *siiAutoHideRow=\"'AAR'+index\"  class=\"siiAutoHide\">\r\n        <div #itemRef  class=\"infiniteScrollItem\" [class.sii-infinite-scroll-selected]=\"item && siiListController.isSelected(item)\" (click)=\"itemClicked(item,$event)\">\r\n          <ng-container   *ngTemplateOutlet=\"templateRef; context:{$implicit:item, index:index, items:ds.dataValue,\r\n              prev: (index==0?null : ds.dataValue[index-1]),\r\n              next:(last?null:ds.dataValue[index+1]),\r\n              group: ds.bySiiId[item['_siiId']]   } \" ></ng-container>\r\n        </div>\r\n        @if (last || ds.visibleGroups[index+1]) {\r\n          <span  *siiFakeListItem=\"itemRef;\"></span>\r\n        }\r\n      </span>\r\n    }\r\n  }\r\n\r\n  @if (ds.displayedListSize>0 &&   ds.visibleGroups[ds.displayedListSize]!=undefined ) {\r\n    @for (gr of ds.visibleGroups[ds.displayedListSize]; track gr.key) {\r\n      <sii-group-list-toolbar [ngClass]=\"groupListToolbarClass\" [group]=\"gr\" [ds]=\"ds\"></sii-group-list-toolbar>\r\n    }\r\n  }\r\n\r\n  <ng-content select=\"[listFooter]\"></ng-content>\r\n</div>\r\n\r\n\r\n<ng-template #defaultEmptyData>\r\n  <sii-banner-feedback type='info' style=\"flex:1\" >\r\n    <div feedback-toolbar>No Data Found</div>\r\n  </sii-banner-feedback>\r\n</ng-template>\r\n", styles: [":host{display:flex;min-height:200px;width:100%;position:relative}.infiniteScrollListContainer{width:100%;display:flex;flex-direction:row;flex-wrap:wrap;justify-content:space-around;align-items:flex-start;align-content:flex-start}mat-progress-bar{position:fixed;z-index:3;top:calc(var(--toolbarHeight) + var(--pageContentToolbarsContainerHeight) + var(--pageContainerToolbarHeight))}.emptyListContainer{display:flex;padding:10px;width:100%;box-sizing:border-box}.cis_group_toolbar{display:flex}.infiniteScrollItem,.siiAutoHide{display:contents}sii-group-list-toolbar{position:sticky;top:calc(var(--toolbarHeight) + var(--pageContentToolbarsContainerHeight) + var(--pageContainerToolbarHeight) + var(--prevGroupParent));background-image:var(--bgImageUrl);background-size:cover;background-repeat:no-repeat;background-image:linear-gradient(-186.39deg,#090909 -7.89%,#161721 26.77%,#000 59.41%,#323551 94.42%);background-attachment:fixed;z-index:2}\n"], dependencies: [{ kind: "component", type: MatProgressBar, selector: "mat-progress-bar", inputs: ["color", "value", "bufferValue", "mode"], outputs: ["animationEnd"], exportAs: ["matProgressBar"] }, { kind: "directive", type: NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "component", type: GroupListToolbarComponent, selector: "sii-group-list-toolbar", inputs: ["ds", "group"] }, { kind: "directive", type: NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: AutoHideRowDirective, selector: "[siiAutoHideRow]", inputs: ["siiAutoHideRow"] }, { kind: "directive", type: FakeListItemDirective, selector: "[siiFakeListItem]", inputs: ["siiFakeListItem"] }, { kind: "component", type: BannerFeedbackComponent, selector: "sii-banner-feedback", inputs: ["type"] }, { kind: "pipe", type: AsyncPipe, name: "async" }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: GroupedInfiniteScrollComponent, decorators: [{
            type: Component,
            args: [{ selector: 'sii-grouped-infinite-scroll', standalone: true, imports: [
                        MatProgressBar,
                        NgTemplateOutlet,
                        GroupListToolbarComponent,
                        NgClass,
                        AutoHideRowDirective,
                        FakeListItemDirective,
                        BannerFeedbackComponent,
                        AsyncPipe,
                    ], template: "<!-- <mat-progress-bar mode=\"query\" ></mat-progress-bar> -->\r\n@if (siiListController.fetchInProgressObs | async) {\r\n  <mat-progress-bar mode=\"query\"></mat-progress-bar>\r\n}\r\n\r\n<div class=\"infiniteScrollListContainer\" #vs_ref  >\r\n  <ng-content select=\"[listHeader]\"></ng-content>\r\n\r\n  @if (ds.listSize==0 && !(siiListController.fetchInProgressObs | async)) {\r\n    <div class=\"emptyListContainer\">\r\n      <ng-container  *ngTemplateOutlet=\"noDataFoundTpl || defaultEmptyData\" ></ng-container>\r\n    </div>\r\n  }\r\n\r\n  <!-- <div  [@fadeInOut]  style=\"width: 200px;height: 200px; background-color: red;\" *ngIf=\"vv\"></div> -->\r\n\r\n  @if (ds.displayedListSize==0 &&   ds.visibleGroups[0]!=undefined ) {\r\n    @for (gr of ds.visibleGroups[0]; track gr.key) {\r\n      <sii-group-list-toolbar [ngClass]=\"groupListToolbarClass\" [group]=\"gr\" [ds]=\"ds\"></sii-group-list-toolbar>\r\n    }\r\n  }\r\n\r\n\r\n  @for (item of ds.data | async  ; track item['_siiId']; let index = $index; let last = $last) {\r\n    @if (ds.visibleGroups[index] && (index!=0 || ds.visibleGroups[0][0].key!='##NOGROUP##' )) {\r\n      @for (gr of ds.visibleGroups[index]; track gr.key) {\r\n        <sii-group-list-toolbar [ngClass]=\"groupListToolbarClass\"  [group]=\"gr\" [ds]=\"ds\"></sii-group-list-toolbar>\r\n      }\r\n    }\r\n    <!-- siiFakeListItem [@fadeIn]-->\r\n    @if (item) {\r\n      <span *siiAutoHideRow=\"'AAR'+index\"  class=\"siiAutoHide\">\r\n        <div #itemRef  class=\"infiniteScrollItem\" [class.sii-infinite-scroll-selected]=\"item && siiListController.isSelected(item)\" (click)=\"itemClicked(item,$event)\">\r\n          <ng-container   *ngTemplateOutlet=\"templateRef; context:{$implicit:item, index:index, items:ds.dataValue,\r\n              prev: (index==0?null : ds.dataValue[index-1]),\r\n              next:(last?null:ds.dataValue[index+1]),\r\n              group: ds.bySiiId[item['_siiId']]   } \" ></ng-container>\r\n        </div>\r\n        @if (last || ds.visibleGroups[index+1]) {\r\n          <span  *siiFakeListItem=\"itemRef;\"></span>\r\n        }\r\n      </span>\r\n    }\r\n  }\r\n\r\n  @if (ds.displayedListSize>0 &&   ds.visibleGroups[ds.displayedListSize]!=undefined ) {\r\n    @for (gr of ds.visibleGroups[ds.displayedListSize]; track gr.key) {\r\n      <sii-group-list-toolbar [ngClass]=\"groupListToolbarClass\" [group]=\"gr\" [ds]=\"ds\"></sii-group-list-toolbar>\r\n    }\r\n  }\r\n\r\n  <ng-content select=\"[listFooter]\"></ng-content>\r\n</div>\r\n\r\n\r\n<ng-template #defaultEmptyData>\r\n  <sii-banner-feedback type='info' style=\"flex:1\" >\r\n    <div feedback-toolbar>No Data Found</div>\r\n  </sii-banner-feedback>\r\n</ng-template>\r\n", styles: [":host{display:flex;min-height:200px;width:100%;position:relative}.infiniteScrollListContainer{width:100%;display:flex;flex-direction:row;flex-wrap:wrap;justify-content:space-around;align-items:flex-start;align-content:flex-start}mat-progress-bar{position:fixed;z-index:3;top:calc(var(--toolbarHeight) + var(--pageContentToolbarsContainerHeight) + var(--pageContainerToolbarHeight))}.emptyListContainer{display:flex;padding:10px;width:100%;box-sizing:border-box}.cis_group_toolbar{display:flex}.infiniteScrollItem,.siiAutoHide{display:contents}sii-group-list-toolbar{position:sticky;top:calc(var(--toolbarHeight) + var(--pageContentToolbarsContainerHeight) + var(--pageContainerToolbarHeight) + var(--prevGroupParent));background-image:var(--bgImageUrl);background-size:cover;background-repeat:no-repeat;background-image:linear-gradient(-186.39deg,#090909 -7.89%,#161721 26.77%,#000 59.41%,#323551 94.42%);background-attachment:fixed;z-index:2}\n"] }]
        }], ctorParameters: () => [{ type: i0.ElementRef }, { type: SiiListController }, { type: i0.ChangeDetectorRef }], propDecorators: { templateRef: [{
                type: ContentChild,
                args: [ListRowDirective, { read: TemplateRef }]
            }], listRows: [{
                type: ViewChildren,
                args: [AutoHideRowDirective]
            }], noDataFoundTpl: [{
                type: ContentChild,
                args: [EmptyListMessageDirective, { read: TemplateRef }]
            }], multiselect: [{
                type: Input
            }], selectable: [{
                type: Input
            }], selectOnlyWithHandler: [{
                type: Input
            }], groupListToolbarClass: [{
                type: Input
            }], itemClick: [{
                type: Output
            }], listContainer: [{
                type: ViewChild,
                args: ['vs_ref']
            }] } });

class SiiInfiniteScrollDataSource {
    get data() { return this._dataStream; }
    get dataValue() { return this._dataStream.value; }
    get fetchSize() {
        return this.siiListController._fetchSize;
    }
    get listSize() {
        return this._cachedData.length;
    }
    // public fetchRequestService:(page: number, fetchSize: number) => Observable<ISiiPageResponseDTO<any>>,
    constructor(siiListController) {
        this.siiListController = siiListController;
        // private _fetchedPages = new Set<number>();
        this.lastFetchedpage = -1;
        this._cachedData = [];
        this._dataStream = new BehaviorSubject(this._cachedData);
        this._subscription = new Subscription();
        this.performSearch = new Subject();
        this.selectAllFetchedPage = undefined;
        this.utils = {
            lastRequestedPage: undefined,
        };
        this.listChangeSubscriptionFunction = (page, res, reset) => {
            // console.log(`listChangeSubscriptionFunction - ${page}`)
            if (reset) {
                this._cachedData = [];
                this.lastFetchedpage = page;
                // this._fetchedPages.clear();
                // this._fetchedPages.add(page);
            }
            // if(reset || res.count> this._cachedData.length){
            //   this._cachedData.length= res.count
            // }
            this._cachedData.splice(page * this.fetchSize, this.fetchSize, ...res.data);
            this._dataStream.next(this._cachedData);
            this.siiListController.lastFetchRequestInfo = { ...res, data: null };
        };
        this._subscription.add(siiListController.fetchPageData.subscribe((resp) => {
            this.listChangeSubscriptionFunction(resp.page, resp.rows, resp.reset);
            this.checkForSelectAll(resp.page);
        }));
        this._subscription.add(siiListController.selectAllObs.subscribe((resp) => this.selectAllSubscriptionFunction()));
        this._subscription.add(siiListController.refreshObs.subscribe((resp) => this.refreshSubscriptionFunction()));
        this._subscription.add(this.performSearch.pipe(debounceTime(500)).subscribe((resp) => this._fetchPage(this.lastFetchedpage + 1)));
    }
    fetchNextPage() {
        this.performSearch.next();
    }
    // connect(collectionViewer: CollectionViewer): Observable<(object | undefined)[]> {
    //   this._subscription.add(collectionViewer.viewChange.subscribe(range => {
    //     const startPage = this._getPageForIndex(range.start);
    //     const endPage = this._getPageForIndex(range.end - 1);
    //     this.utils.lastRequestedPage= `${startPage}-${endPage}`;
    //     // console.log(`viewChange RANGE: ${range.start} - ${range.end - 1} PAGE: ${startPage} - ${endPage}  `)
    //     setTimeout(()=>{
    //       if(this.utils.lastRequestedPage===`${startPage}-${endPage}`){
    //       const startFetchPage= startPage===0 ? 0:startPage-1
    //       const endFetchPage= this.siiListController.lastFetchRequestInfo?.maxPage===undefined ?
    //        endPage :  Math.min(endPage+1, this.siiListController.lastFetchRequestInfo.maxPage-1);
    //         for ( let i =startFetchPage; i <= endFetchPage;  i++) {
    //           this._fetchPage(i);
    //         }
    //       }
    //     },500);
    //   }));
    //   return this._dataStream;
    // }
    // disconnect(): void {
    //   this._subscription.unsubscribe();
    // }
    // private _getPageForIndex(index: number): number {
    //   return Math.floor(index / this.fetchSize);
    // }
    _fetchPage(page) {
        // if (this._fetchedPages.has(page)) {
        //   return;
        // }
        if (page === 0 || page < this.siiListController.lastFetchRequestInfo.maxPage) {
            this.lastFetchedpage = page;
            // console.log(`_fetchPage ${page}`, this._fetchedPages);
            this.siiListController.doFetchPage.next(page);
        }
        else {
            console.log('NO MORE PAGES');
        }
    }
    refreshSubscriptionFunction() {
        // const pages=[...this._fetchedPages];
        // this._fetchedPages.clear();
        const pages = [];
        this._cachedData.length = 0;
        const lfp = this.lastFetchedpage;
        this.lastFetchedpage = -1;
        for (let i = 0; i <= lfp; i++) {
            pages.push(i);
            this._fetchPage(i);
        }
        // pages.forEach((page)=>{
        //   // console.log(`refresh page ${page}`)
        //   this._fetchPage(page)
        // })
        // dopo che ho caricato tutte le pagine, deseleziono gli elementi che non sono più presenti
        // mi metto quindi in ascolto per intercettare le response di tutte le pagine, e alla fine faccio l'operazione
        const fetchSubsc = this.siiListController.fetchPageData.subscribe((resp) => {
            pages.splice(pages.indexOf(resp.page), 1);
            if (pages.length === 0) {
                fetchSubsc.unsubscribe();
                Promise.resolve().then(() => {
                    this.siiListController.removeMissingSelection(this._cachedData);
                });
            }
        });
    }
    selectAllSubscriptionFunction() {
        const loadedItem = this._cachedData.reduce((acc, i) => {
            acc += i === undefined ? 0 : 1;
            return acc;
        }, 0);
        // se ho tutti gli elementi
        if (loadedItem === this.siiListController.lastFetchRequestInfo.count) {
            this.siiListController.markAsSelected(this._cachedData);
        }
        else {
            this.siiListController.selectAllInProgress = true;
            const newData = Array.from({ length: this.siiListController.api.itemsCount });
            this._cachedData.forEach((cd, index) => newData[index] = cd);
            this._cachedData = newData;
            for (let i = 0; i < this.siiListController.lastFetchRequestInfo.maxPage; i++) {
                if (i > this.lastFetchedpage) {
                    this._fetchPage(i);
                    if (this.selectAllFetchedPage === undefined) {
                        this.selectAllFetchedPage = [];
                    }
                    this.selectAllFetchedPage.push(i);
                }
            }
        }
    }
    checkForSelectAll(page) {
        // console.log(`checkForSelectAll -> ${page}` ,this.selectAllFetchedPage)
        if (this.selectAllFetchedPage !== undefined) {
            this.selectAllFetchedPage.splice(this.selectAllFetchedPage.indexOf(page), 1);
            if (this.selectAllFetchedPage.length === 0) {
                this.selectAllFetchedPage = undefined;
                this.siiListController.markAsSelected(this._cachedData);
                this.siiListController.selectAllInProgress = false;
            }
        }
    }
}

class InfiniteScrollComponent {
    constructor(el, siiListController) {
        this.el = el;
        this.siiListController = siiListController;
        this.multiselect = false;
        this.selectable = true;
        this.itemClick = new EventEmitter();
        this.initialized = false;
        this.subscription = new Subscription();
        this.ds = new SiiInfiniteScrollDataSource(this.siiListController);
        // @ViewChild('vs_ref') scrolleRef: ElementRef;
        // public get scrollerEl(): HTMLElement{
        //   return this.scrolleRef.nativeElement;
        // }
        this.scrollerEl = document;
        this.scrollerFunctionRef = (event) => {
            if (event.target === event.currentTarget && this.isScrolledAtEndOfPage()) {
                this.ds.fetchNextPage();
            }
        };
        this.clickedOnMultiselectHandler = (ev) => {
            return ev.target.closest('[sii-list-multiselect-handler]') !== null;
        };
        this.subscription.add(siiListController.fetchPageData.subscribe((resp) => {
            this.initialized = true;
            if (resp.reset) {
                this.scrollerEl.scrollingElement.scrollTo({ top: 0 });
            }
            setTimeout(() => {
                if ((window.scrollY >= document.body.offsetHeight // scroll not visible
                    || this.isScrolledAtEndOfPage()
                // || this.lastScrollHeight===this.scrollerEl.scrollHeight     // l'ultima posizione non è variata
                )
                    && resp.rows.maxPage > resp.rows.currPage) {
                    this.ds.fetchNextPage();
                }
            }, 0);
        }));
    }
    isScrolledAtEndOfPage() {
        return Math.round(window.innerHeight + window.scrollY) >= document.body.offsetHeight;
    }
    ngAfterViewInit() {
        // lancio la ricerca
        Promise.resolve().then(() => {
            this.ds.fetchNextPage();
        });
        this.scrollerEl.addEventListener('scroll', this.scrollerFunctionRef, { capture: true, passive: true });
    }
    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.scrollerEl.removeEventListener('scroll', this.scrollerFunctionRef, true);
    }
    itemClicked(item, ev) {
        this.itemClick.next(item);
        if (this.selectable) {
            if (this.multiselect && this.clickedOnMultiselectHandler(ev)) {
                this.siiListController.multiselectItemClick(item);
            }
            else {
                this.siiListController.singleselectItemClick(item);
            }
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: InfiniteScrollComponent, deps: [{ token: i0.ElementRef }, { token: SiiListController }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "18.2.13", type: InfiniteScrollComponent, isStandalone: true, selector: "sii-infinite-scroll", inputs: { multiselect: "multiselect", selectable: "selectable" }, outputs: { itemClick: "itemClick" }, queries: [{ propertyName: "templateRef", first: true, predicate: ListRowDirective, descendants: true, read: TemplateRef }, { propertyName: "noDataFoundTpl", first: true, predicate: EmptyListMessageDirective, descendants: true, read: TemplateRef }], ngImport: i0, template: "@if (siiListController.fetchInProgressObs | async) {\r\n  <mat-progress-bar mode=\"query\"></mat-progress-bar>\r\n}\r\n<div class=\"infiniteScrollListContainer\" #vs_ref  >\r\n  <ng-content select=\"[listHeader]\"></ng-content>\r\n\r\n  @if (initialized && ds.listSize==0 && !(siiListController.fetchInProgressObs | async)) {\r\n    <div class=\"emptyListContainer\">\r\n      <ng-container  *ngTemplateOutlet=\"noDataFoundTpl || defaultEmptyData\" ></ng-container>\r\n    </div>\r\n  }\r\n\r\n  @for (item of ds.data | async  ; track item; let index = $index; let last = $last) {\r\n    <div\r\n      class=\"infiniteScrollItem\" [class.sii-infinite-scroll-selected]=\"item && siiListController.isSelected(item)\" (click)=\"itemClicked(item,$event)\">\r\n      <ng-container *ngTemplateOutlet=\"templateRef; context:{$implicit:item, index:index, items:ds.dataValue,  prev: (index==0?null : ds.dataValue[index-1]), next:(last?null:ds.dataValue[index+1])}\" ></ng-container>\r\n    </div>\r\n  }\r\n  <ng-content select=\"[listFooter]\"></ng-content>\r\n</div>\r\n\r\n\r\n<ng-template #defaultEmptyData>\r\n  <sii-banner-feedback type='info' style=\"flex:1\" >\r\n    <div feedback-toolbar>No Data Found</div>\r\n  </sii-banner-feedback>\r\n</ng-template>\r\n", styles: [":host{display:flex;width:100%;position:relative}.infiniteScrollListContainer{width:100%;display:flex;flex-direction:row;flex-wrap:wrap;justify-content:space-around;align-items:flex-start;align-content:flex-start}mat-progress-bar{position:fixed;z-index:1}.emptyListContainer{display:flex;padding:10px;width:100%;box-sizing:border-box}.infiniteScrollItem{display:contents}\n"], dependencies: [{ kind: "component", type: MatProgressBar, selector: "mat-progress-bar", inputs: ["color", "value", "bufferValue", "mode"], outputs: ["animationEnd"], exportAs: ["matProgressBar"] }, { kind: "directive", type: NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "component", type: BannerFeedbackComponent, selector: "sii-banner-feedback", inputs: ["type"] }, { kind: "pipe", type: AsyncPipe, name: "async" }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: InfiniteScrollComponent, decorators: [{
            type: Component,
            args: [{ selector: 'sii-infinite-scroll', standalone: true, imports: [MatProgressBar, NgTemplateOutlet, BannerFeedbackComponent, AsyncPipe], template: "@if (siiListController.fetchInProgressObs | async) {\r\n  <mat-progress-bar mode=\"query\"></mat-progress-bar>\r\n}\r\n<div class=\"infiniteScrollListContainer\" #vs_ref  >\r\n  <ng-content select=\"[listHeader]\"></ng-content>\r\n\r\n  @if (initialized && ds.listSize==0 && !(siiListController.fetchInProgressObs | async)) {\r\n    <div class=\"emptyListContainer\">\r\n      <ng-container  *ngTemplateOutlet=\"noDataFoundTpl || defaultEmptyData\" ></ng-container>\r\n    </div>\r\n  }\r\n\r\n  @for (item of ds.data | async  ; track item; let index = $index; let last = $last) {\r\n    <div\r\n      class=\"infiniteScrollItem\" [class.sii-infinite-scroll-selected]=\"item && siiListController.isSelected(item)\" (click)=\"itemClicked(item,$event)\">\r\n      <ng-container *ngTemplateOutlet=\"templateRef; context:{$implicit:item, index:index, items:ds.dataValue,  prev: (index==0?null : ds.dataValue[index-1]), next:(last?null:ds.dataValue[index+1])}\" ></ng-container>\r\n    </div>\r\n  }\r\n  <ng-content select=\"[listFooter]\"></ng-content>\r\n</div>\r\n\r\n\r\n<ng-template #defaultEmptyData>\r\n  <sii-banner-feedback type='info' style=\"flex:1\" >\r\n    <div feedback-toolbar>No Data Found</div>\r\n  </sii-banner-feedback>\r\n</ng-template>\r\n", styles: [":host{display:flex;width:100%;position:relative}.infiniteScrollListContainer{width:100%;display:flex;flex-direction:row;flex-wrap:wrap;justify-content:space-around;align-items:flex-start;align-content:flex-start}mat-progress-bar{position:fixed;z-index:1}.emptyListContainer{display:flex;padding:10px;width:100%;box-sizing:border-box}.infiniteScrollItem{display:contents}\n"] }]
        }], ctorParameters: () => [{ type: i0.ElementRef }, { type: SiiListController }], propDecorators: { templateRef: [{
                type: ContentChild,
                args: [ListRowDirective, { read: TemplateRef }]
            }], noDataFoundTpl: [{
                type: ContentChild,
                args: [EmptyListMessageDirective, { read: TemplateRef }]
            }], multiselect: [{
                type: Input
            }], selectable: [{
                type: Input
            }], itemClick: [{
                type: Output
            }] } });

class ListIconComponent {
    onHostClick(event) {
        if (!!this.disabled) {
            event.stopPropagation();
        }
    }
    constructor() {
        // @Input() selected = false;
        this.color = 'gray';
        this.textColor = 'black';
        this.prefix = '';
        this.size = '40';
        this.disabled = false;
    }
    ngOnInit() {
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: ListIconComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "18.2.13", type: ListIconComponent, isStandalone: true, selector: "sii-list-icon", inputs: { color: "color", textColor: "textColor", prefix: "prefix", size: "size", disabled: "disabled" }, host: { listeners: { "click": "onHostClick($event)" } }, ngImport: i0, template: "<svg class=\"list-ico list-ico-selected\" [attr.width]=\"size\" [attr.height]=\"size\" fill=\"#AAA\" viewBox=\"2 2 20 20\" >\r\n  <path d=\"M0 0h24v24H0z\" fill=\"none\" />\r\n  <path d=\"M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z\" />\r\n</svg>\r\n\r\n<svg class=\"list-ico list-ico-unselected\"  [attr.width]=\"size\" [attr.height]=\"size\" viewBox=\"0 0 32 32\" >\r\n  <circle class=\"icon-circle\" cx=\"16\" cy=\"16\" r=\"16\" [attr.fill]=\"color\" />\r\n  <text class=\"icon-text li-size-{{(prefix||'').length}}\" x=\"16\" y=\"20\" [attr.fill]=\"textColor\" text-anchor=\"middle\">{{prefix}}</text>\r\n  <circle class=\"icon-circle-hollow\" cx=\"16\" cy=\"16\" r=\"13\" stroke-width=\"3\"  stroke=\"#AAA\" fill=\"none\" />\r\n</svg>\r\n<div class=\" list-ico-transcluded-content list-ico-unselected\" [style.color]=\"textColor\" [style.width.px]=\"size\" [style.height.px]=\"size\">\r\n  <ng-content></ng-content>\r\n</div>\r\n\r\n\r\n<div class=\"spacer\" [style.width.px]=\"size\" [style.height.px]=\"size\"></div>\r\n", styles: [":host{display:flex;position:relative}.icon-text{font-family:Roboto,Helvetica Neue,sans-serif;font-size:12px;font-weight:700}.list-ico{flex:0 0 auto;position:absolute}.spacer{flex:0 0 auto}.hollowable:hover .icon-text,.hollowable:hover .icon-circle{display:none}.hollowable:hover .icon-circle-hollow{display:block}.icon-circle-hollow,.list-ico-selected{display:none}.list-ico-transcluded-content{position:absolute;z-index:2;display:flex;justify-content:center;align-items:center}.li-size-4{font-size:10px}.li-size-5{font-size:8px}.li-size-6{font-size:7px}\n"] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: ListIconComponent, decorators: [{
            type: Component,
            args: [{ selector: 'sii-list-icon', standalone: true, template: "<svg class=\"list-ico list-ico-selected\" [attr.width]=\"size\" [attr.height]=\"size\" fill=\"#AAA\" viewBox=\"2 2 20 20\" >\r\n  <path d=\"M0 0h24v24H0z\" fill=\"none\" />\r\n  <path d=\"M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z\" />\r\n</svg>\r\n\r\n<svg class=\"list-ico list-ico-unselected\"  [attr.width]=\"size\" [attr.height]=\"size\" viewBox=\"0 0 32 32\" >\r\n  <circle class=\"icon-circle\" cx=\"16\" cy=\"16\" r=\"16\" [attr.fill]=\"color\" />\r\n  <text class=\"icon-text li-size-{{(prefix||'').length}}\" x=\"16\" y=\"20\" [attr.fill]=\"textColor\" text-anchor=\"middle\">{{prefix}}</text>\r\n  <circle class=\"icon-circle-hollow\" cx=\"16\" cy=\"16\" r=\"13\" stroke-width=\"3\"  stroke=\"#AAA\" fill=\"none\" />\r\n</svg>\r\n<div class=\" list-ico-transcluded-content list-ico-unselected\" [style.color]=\"textColor\" [style.width.px]=\"size\" [style.height.px]=\"size\">\r\n  <ng-content></ng-content>\r\n</div>\r\n\r\n\r\n<div class=\"spacer\" [style.width.px]=\"size\" [style.height.px]=\"size\"></div>\r\n", styles: [":host{display:flex;position:relative}.icon-text{font-family:Roboto,Helvetica Neue,sans-serif;font-size:12px;font-weight:700}.list-ico{flex:0 0 auto;position:absolute}.spacer{flex:0 0 auto}.hollowable:hover .icon-text,.hollowable:hover .icon-circle{display:none}.hollowable:hover .icon-circle-hollow{display:block}.icon-circle-hollow,.list-ico-selected{display:none}.list-ico-transcluded-content{position:absolute;z-index:2;display:flex;justify-content:center;align-items:center}.li-size-4{font-size:10px}.li-size-5{font-size:8px}.li-size-6{font-size:7px}\n"] }]
        }], ctorParameters: () => [], propDecorators: { color: [{
                type: Input
            }], textColor: [{
                type: Input
            }], prefix: [{
                type: Input
            }], size: [{
                type: Input
            }], disabled: [{
                type: Input
            }], onHostClick: [{
                type: HostListener,
                args: ['click', ['$event']]
            }] } });

class ListSorterOptionComponent {
    // tslint:disable-next-line:no-input-rename
    set LS(value) {
        this.listSortAttr = coerceBooleanProperty(value);
    }
    get viewValue() {
        return this.el.nativeElement.innerText;
    }
    constructor(el) {
        this.el = el;
        this.sortAsc = true;
        this.display = 'none';
        // const isor = el.nativeElement.attributes.getNamedItem('sii-list-init-sort');
        // this.isInitSort = isor != null && isor.value !== 'false';
    }
    ngAfterViewInit() {
        this.isInitSort = this.listSortAttr !== undefined && this.listSortAttr !== false;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: ListSorterOptionComponent, deps: [{ token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "18.2.13", type: ListSorterOptionComponent, isStandalone: true, selector: "sii-list-sorter-option", inputs: { value: "value", groupKey: "groupKey", groupValue: "groupValue", groupLabelTransform: "groupLabelTransform", parentGroupLabelTransform: "parentGroupLabelTransform", sortAsc: "sortAsc", groupAction: "groupAction", parentGroupAction: "parentGroupAction", LS: ["sii-list-init-sort", "LS"], parentGroupKey: "parentGroupKey", parentGroupValue: "parentGroupValue" }, host: { properties: { "style.display": "this.display" } }, ngImport: i0, template: '<ng-content></ng-content>', isInline: true }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: ListSorterOptionComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'sii-list-sorter-option',
                    template: '<ng-content></ng-content>',
                    standalone: true,
                }]
        }], ctorParameters: () => [{ type: i0.ElementRef }], propDecorators: { value: [{
                type: Input
            }], groupKey: [{
                type: Input
            }], groupValue: [{
                type: Input
            }], groupLabelTransform: [{
                type: Input
            }], parentGroupLabelTransform: [{
                type: Input
            }], sortAsc: [{
                type: Input
            }], groupAction: [{
                type: Input
            }], parentGroupAction: [{
                type: Input
            }], LS: [{
                type: Input,
                args: ['sii-list-init-sort']
            }], parentGroupKey: [{
                type: Input
            }], parentGroupValue: [{
                type: Input
            }], display: [{
                type: HostBinding,
                args: ['style.display']
            }] } });

class ListSorterComponent {
    get selectedValue() {
        return this.siiListService._sortField.sort;
    }
    set selectedValue(sv) {
        this.siiListService._sortField.sort = sv;
    }
    get sortAsc() {
        return this.siiListService._sortField.sortAscending;
    }
    set sortAsc(val) {
        this.siiListService._sortField.sortAscending = val;
    }
    get selectedGroup() {
        return this.siiListService._groupField;
    }
    set selectedGroup(sv) {
        this.siiListService._groupField = sv;
    }
    constructor(siiListService) {
        this.siiListService = siiListService;
        this.showLabel = false;
        this.toggleOrderAsc = () => {
            this.sortAsc = !this.sortAsc;
            this.siiListService.sortChange.next();
        };
    }
    ngAfterViewInit() {
        Promise.resolve().then(() => {
            this.options = this.listSorterOptions.map(x => {
                return {
                    value: x.value,
                    viewValue: x.viewValue,
                    groupKey: x.groupKey,
                    groupValue: x.groupValue,
                    groupLabelTransform: x.groupLabelTransform,
                    parentGroupKey: x.parentGroupKey,
                    parentGroupValue: x.parentGroupValue,
                    parentGroupLabelTransform: x.parentGroupLabelTransform,
                    groupAction: x.groupAction,
                    parentGroupAction: x.parentGroupAction
                };
            });
            let compareFunct = (x) => x.isInitSort;
            if (!!this.siiListService._sortField.sort) {
                compareFunct = (x) => x.value === this.siiListService._sortField.sort;
            }
            const initSort = this.listSorterOptions.find(compareFunct);
            let sortToInt = null;
            if (initSort != null) {
                if (!!this.siiListService._sortField.sort) {
                    initSort.sortAsc = this.siiListService._sortField.sortAscending;
                }
                sortToInt = initSort;
            }
            else if (this.options != null && this.options[0] !== undefined) {
                sortToInt = this.options[0];
            }
            if (this.selectedValue == null) {
                this.selectedValue = sortToInt.value;
                this.selectedGroup = {
                    groupKey: sortToInt.groupKey,
                    groupValue: sortToInt.groupValue,
                    groupLabelTransform: sortToInt.groupLabelTransform,
                    parentGroupKey: sortToInt.parentGroupKey,
                    parentGroupValue: sortToInt.parentGroupValue,
                    parentGroupLabelTransform: sortToInt.parentGroupLabelTransform,
                    groupAction: sortToInt.groupAction,
                    parentGroupAction: sortToInt.parentGroupAction
                };
                // this.siiListService.sortChange.next();
            }
            else if (this.selectedValue !== sortToInt.value || sortToInt.groupLabelTransform != null || sortToInt.parentGroupLabelTransform != null) {
                this.selectedValue = sortToInt.value;
                this.selectedGroup = {
                    groupKey: sortToInt.groupKey,
                    groupValue: sortToInt.groupValue,
                    groupLabelTransform: sortToInt.groupLabelTransform,
                    parentGroupKey: sortToInt.parentGroupKey,
                    parentGroupValue: sortToInt.parentGroupValue,
                    parentGroupLabelTransform: sortToInt.parentGroupLabelTransform,
                    groupAction: sortToInt.groupAction,
                    parentGroupAction: sortToInt.parentGroupAction
                };
            }
            if (initSort.sortAsc !== this.sortAsc) {
                this.sortAsc = !this.sortAsc;
            }
        });
    }
    selectionChange(selev) {
        const selVal = this.options.find(v => v.value === selev.value);
        this.selectedGroup = {
            groupKey: selVal.groupKey,
            groupValue: selVal.groupValue,
            groupLabelTransform: selVal.groupLabelTransform,
            parentGroupKey: selVal.parentGroupKey,
            parentGroupValue: selVal.parentGroupValue,
            parentGroupLabelTransform: selVal.parentGroupLabelTransform,
            groupAction: selVal.groupAction,
            parentGroupAction: selVal.parentGroupAction
        };
        this.siiListService.sortChange.next();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: ListSorterComponent, deps: [{ token: SiiListController, optional: true }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "18.2.13", type: ListSorterComponent, isStandalone: true, selector: "sii-list-sorter", inputs: { showLabel: "showLabel" }, queries: [{ propertyName: "listSorterOptions", predicate: ListSorterOptionComponent }], ngImport: i0, template: "<mat-form-field  appearance=\"outline\" class=\"siiFacetSorterFormField\">\r\n  @if (showLabel) {\r\n    <mat-label  i18n=\"@@listSorterOrderBy\">Order By</mat-label>\r\n  }\r\n  <mat-select  [(ngModel)]=\"selectedValue\" (selectionChange)=selectionChange($event)>\r\n    @for (option of options; track option) {\r\n      <mat-option [value]=\"option.value\">\r\n        {{ option.viewValue }}\r\n      </mat-option>\r\n    }\r\n  </mat-select>\r\n</mat-form-field>\r\n<button mat-icon-button class=\"sorterButton\" (click)=\"toggleOrderAsc()\">\r\n  <mat-icon [svgIcon]=\"sortAsc?'sii-sort-asc':'sii-sort-desc'\" ></mat-icon>\r\n</button>\r\n\r\n<!-- required for invisible transclusion -->\r\n<ng-content></ng-content>\r\n", styles: [":host{display:flex}.siiFacetSorterFormField{width:calc(100% - 40px)}.siiFacetSorterFormField::ng-deep .mat-mdc-form-field-subscript-wrapper{height:0}.siiFacetSorterFormField::ng-deep .mat-mdc-text-field-wrapper{background-color:#2a2b38}.siiFacetSorterFormField::ng-deep .mat-mdc-select-value,.siiFacetSorterFormField::ng-deep .mat-mdc-select-arrow{color:#ffffffde!important}.siiFacetSorterFormField::ng-deep .mat-mdc-form-field-infix{padding-top:8px;padding-bottom:8px;min-height:30px}.siiFacetSorterFormField::ng-deep .mdc-notched-outline>*{border-color:#ffffffde!important}.sorterButton{width:40px;height:40px;padding:7px}\n"], dependencies: [{ kind: "component", type: MatFormField, selector: "mat-form-field", inputs: ["hideRequiredMarker", "color", "floatLabel", "appearance", "subscriptSizing", "hintLabel"], exportAs: ["matFormField"] }, { kind: "directive", type: MatLabel, selector: "mat-label" }, { kind: "component", type: MatSelect, selector: "mat-select", inputs: ["aria-describedby", "panelClass", "disabled", "disableRipple", "tabIndex", "hideSingleSelectionIndicator", "placeholder", "required", "multiple", "disableOptionCentering", "compareWith", "value", "aria-label", "aria-labelledby", "errorStateMatcher", "typeaheadDebounceInterval", "sortComparator", "id", "panelWidth"], outputs: ["openedChange", "opened", "closed", "selectionChange", "valueChange"], exportAs: ["matSelect"] }, { kind: "ngmodule", type: FormsModule }, { kind: "directive", type: i1$6.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i1$6.NgModel, selector: "[ngModel]:not([formControlName]):not([formControl])", inputs: ["name", "disabled", "ngModel", "ngModelOptions"], outputs: ["ngModelChange"], exportAs: ["ngModel"] }, { kind: "component", type: MatOption, selector: "mat-option", inputs: ["value", "id", "disabled"], outputs: ["onSelectionChange"], exportAs: ["matOption"] }, { kind: "component", type: MatIconButton, selector: "button[mat-icon-button]", exportAs: ["matButton"] }, { kind: "component", type: MatIcon, selector: "mat-icon", inputs: ["color", "inline", "svgIcon", "fontSet", "fontIcon"], exportAs: ["matIcon"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: ListSorterComponent, decorators: [{
            type: Component,
            args: [{ selector: 'sii-list-sorter', standalone: true, imports: [MatFormField, MatLabel, MatSelect, FormsModule, MatOption, MatIconButton, MatIcon], template: "<mat-form-field  appearance=\"outline\" class=\"siiFacetSorterFormField\">\r\n  @if (showLabel) {\r\n    <mat-label  i18n=\"@@listSorterOrderBy\">Order By</mat-label>\r\n  }\r\n  <mat-select  [(ngModel)]=\"selectedValue\" (selectionChange)=selectionChange($event)>\r\n    @for (option of options; track option) {\r\n      <mat-option [value]=\"option.value\">\r\n        {{ option.viewValue }}\r\n      </mat-option>\r\n    }\r\n  </mat-select>\r\n</mat-form-field>\r\n<button mat-icon-button class=\"sorterButton\" (click)=\"toggleOrderAsc()\">\r\n  <mat-icon [svgIcon]=\"sortAsc?'sii-sort-asc':'sii-sort-desc'\" ></mat-icon>\r\n</button>\r\n\r\n<!-- required for invisible transclusion -->\r\n<ng-content></ng-content>\r\n", styles: [":host{display:flex}.siiFacetSorterFormField{width:calc(100% - 40px)}.siiFacetSorterFormField::ng-deep .mat-mdc-form-field-subscript-wrapper{height:0}.siiFacetSorterFormField::ng-deep .mat-mdc-text-field-wrapper{background-color:#2a2b38}.siiFacetSorterFormField::ng-deep .mat-mdc-select-value,.siiFacetSorterFormField::ng-deep .mat-mdc-select-arrow{color:#ffffffde!important}.siiFacetSorterFormField::ng-deep .mat-mdc-form-field-infix{padding-top:8px;padding-bottom:8px;min-height:30px}.siiFacetSorterFormField::ng-deep .mdc-notched-outline>*{border-color:#ffffffde!important}.sorterButton{width:40px;height:40px;padding:7px}\n"] }]
        }], ctorParameters: () => [{ type: SiiListController, decorators: [{
                    type: Optional
                }] }], propDecorators: { listSorterOptions: [{
                type: ContentChildren,
                args: [ListSorterOptionComponent]
            }], showLabel: [{
                type: Input
            }] } });

class SiiInfiniteScrollSelectAllComponent {
    constructor(siiListController) {
        this.siiListController = siiListController;
        this.clickAct = () => {
            if (this.siiListController.selectionStatus !== 'N') {
                this.siiListController.deselectAll();
            }
            else {
                this.siiListController.selectAll();
            }
        };
    }
    ngOnInit() {
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: SiiInfiniteScrollSelectAllComponent, deps: [{ token: SiiListController }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "18.2.13", type: SiiInfiniteScrollSelectAllComponent, isStandalone: true, selector: "sii-list-select-all", providers: [
            { provide: MAT_CHECKBOX_DEFAULT_OPTIONS, useValue: { clickAction: 'noop' } }
        ], ngImport: i0, template: "\r\n@if (!siiListController.selectAllInProgress) {\r\n  <mat-checkbox\r\n    [checked]=\"siiListController.selectionStatus=='A'\"\r\n    [indeterminate]=\"siiListController.selectionStatus=='P'\"\r\n    (click)=\"clickAct()\"\r\n    >\r\n  </mat-checkbox>\r\n}\r\n\r\n@if (siiListController.selectAllInProgress) {\r\n  <mat-spinner diameter='20'></mat-spinner>\r\n}\r\n\r\n<span class=\"siiSelectAllLabel\" i18n=\"@@sii-infinite-scroll-select-all\"> All</span>\r\n\r\n", styles: [":host{display:flex;padding:0 0 0 15px;align-items:center}.siiSelectAllLabel{margin-left:5px}.mat-mdc-checkbox{margin-right:-8px}\n"], dependencies: [{ kind: "component", type: MatCheckbox, selector: "mat-checkbox", inputs: ["aria-label", "aria-labelledby", "aria-describedby", "id", "required", "labelPosition", "name", "value", "disableRipple", "tabIndex", "color", "disabledInteractive", "checked", "disabled", "indeterminate"], outputs: ["change", "indeterminateChange"], exportAs: ["matCheckbox"] }, { kind: "component", type: MatProgressSpinner, selector: "mat-progress-spinner, mat-spinner", inputs: ["color", "mode", "value", "diameter", "strokeWidth"], exportAs: ["matProgressSpinner"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: SiiInfiniteScrollSelectAllComponent, decorators: [{
            type: Component,
            args: [{ selector: 'sii-list-select-all', providers: [
                        { provide: MAT_CHECKBOX_DEFAULT_OPTIONS, useValue: { clickAction: 'noop' } }
                    ], standalone: true, imports: [MatCheckbox, MatProgressSpinner], template: "\r\n@if (!siiListController.selectAllInProgress) {\r\n  <mat-checkbox\r\n    [checked]=\"siiListController.selectionStatus=='A'\"\r\n    [indeterminate]=\"siiListController.selectionStatus=='P'\"\r\n    (click)=\"clickAct()\"\r\n    >\r\n  </mat-checkbox>\r\n}\r\n\r\n@if (siiListController.selectAllInProgress) {\r\n  <mat-spinner diameter='20'></mat-spinner>\r\n}\r\n\r\n<span class=\"siiSelectAllLabel\" i18n=\"@@sii-infinite-scroll-select-all\"> All</span>\r\n\r\n", styles: [":host{display:flex;padding:0 0 0 15px;align-items:center}.siiSelectAllLabel{margin-left:5px}.mat-mdc-checkbox{margin-right:-8px}\n"] }]
        }], ctorParameters: () => [{ type: SiiListController }] });

class SiiListModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: SiiListModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "18.2.13", ngImport: i0, type: SiiListModule, imports: [GroupedInfiniteScrollComponent,
            InfiniteScrollComponent,
            ListIconComponent,
            ListSorterComponent,
            ListSorterOptionComponent,
            ListRowDirective,
            SiiInfiniteScrollSelectAllComponent,
            EmptyListMessageDirective], exports: [GroupedInfiniteScrollComponent,
            InfiniteScrollComponent,
            ListIconComponent,
            ListSorterComponent,
            ListSorterOptionComponent,
            ListRowDirective,
            SiiInfiniteScrollSelectAllComponent,
            EmptyListMessageDirective] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: SiiListModule, imports: [GroupedInfiniteScrollComponent,
            InfiniteScrollComponent,
            ListSorterComponent,
            SiiInfiniteScrollSelectAllComponent] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: SiiListModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [],
                    imports: [
                        GroupedInfiniteScrollComponent,
                        InfiniteScrollComponent,
                        ListIconComponent,
                        ListSorterComponent,
                        ListSorterOptionComponent,
                        ListRowDirective,
                        SiiInfiniteScrollSelectAllComponent,
                        EmptyListMessageDirective
                    ],
                    exports: [
                        GroupedInfiniteScrollComponent,
                        InfiniteScrollComponent,
                        ListIconComponent,
                        ListSorterComponent,
                        ListSorterOptionComponent,
                        ListRowDirective,
                        SiiInfiniteScrollSelectAllComponent,
                        EmptyListMessageDirective
                    ]
                }]
        }] });

class SiiFacetService {
    constructor() {
        this.facetObj = {};
        this.facetObjForBackEnd = {}; // mappa name, array di cod
        this.facetObjVal = {};
        this.selecteditemCount = 0;
        this.facetLabelMap = {};
        this.facetsMultiplicity = {};
        this.facetsHideSelection = {};
        this.facetsExpanded = {};
        this._textSerch = '';
        this._initFacetToSet = { searchText: '', facets: {} };
        this.facetChangeSubj = new Subject();
        this.facetChange$ = this.facetChangeSubj.asObservable().pipe(debounceTime(1000));
        this.facetResetSubj = new Subject();
        this.facetReset$ = this.facetResetSubj.asObservable();
        this.removeFacetSelectionSubj = new Subject();
        this.removeFacetSelection$ = this.removeFacetSelectionSubj.asObservable();
        this.removeAllFacetSelectionSubj = new Subject();
        this.removeAllFacetSelection$ = this.removeAllFacetSelectionSubj.asObservable();
        this.changeFacetsRequestSubj = new Subject();
        this.changeFacetsRequestObs = this.changeFacetsRequestSubj.asObservable();
        this.changeSearchTextRequestSubj = new Subject();
        this.changeSearchTextRequestObs = this.changeSearchTextRequestSubj.asObservable();
        this.searchFilterChange = (txt, propagateChange = true) => {
            this._textSerch = txt;
            if (propagateChange) {
                this.emitFacetChange();
            }
        };
    }
    get haveSearchText() { return this._textSerch.length > 0 ? true : false; }
    initializeFacet(name, optionsInitValue) {
        this.facetObj[name] = optionsInitValue;
        this.buildSelectionData();
        this.buildBackendData();
    }
    registerFacetLabel(key, label) {
        Promise.resolve().then(() => { this.facetLabelMap[key] = label; });
    }
    facetChange(facetChange, propagateChange = true) {
        this.facetObj[facetChange.name] = facetChange.facetOptions;
        this.buildSelectionData();
        this.buildBackendData();
        if (propagateChange) {
            this.emitFacetChange();
        }
    }
    emitFacetChange() {
        this.facetChangeSubj.next({ facets: this.facetObjForBackEnd, searchText: this._textSerch });
    }
    setInitFacets(initFacets) {
        this._initFacetToSet = initFacets;
    }
    removeFacetSelectionFromFacetSummary(facetChange) {
        this.removeFacetSelectionSubj.next(facetChange);
    }
    removeAllFilters() {
        this.removeAllFacetSelectionSubj.next();
        Promise.resolve().then(() => {
            // this.facetChangeSubj.next(this.facetObjForBackEnd);
            this.facetResetSubj.next({ facets: this.facetObjForBackEnd, searchText: '' });
        });
    }
    buildBackendData() {
        // build the obj for the backend
        const tmpFacetObjVal = {};
        for (const key in this.facetObj) {
            if (this.facetObj[key] != null) { // necessario per tslint
                if (this.facetObj[key] instanceof Array) {
                    tmpFacetObjVal[key] = this.facetObj[key].map(s => s.code);
                }
                else if (this.facetObj[key] instanceof Object && this.facetObj[key].hasOwnProperty('code')) {
                    tmpFacetObjVal[key] = this.facetObj[key].code;
                }
                else {
                    tmpFacetObjVal[key] = this.facetObj[key];
                }
            }
        }
        this.facetObjForBackEnd = tmpFacetObjVal;
    }
    buildSelectionData() {
        const tmpFacetObjVal = {};
        let count = 0;
        for (const key in this.facetObj) {
            if (this.facetObj[key] != null) { // necessario per tslint
                if (this.facetObj[key] instanceof Array) {
                    tmpFacetObjVal[key] = this.facetObj[key].reduce((acc, val) => { acc[val.code] = true; return acc; }, {});
                    count += this.facetObj[key].length;
                }
                else {
                    tmpFacetObjVal[key] = this.facetObj[key];
                    count += this.facetObj[key] ? 1 : 0;
                }
            }
        }
        this.facetObjVal = tmpFacetObjVal;
        this.selecteditemCount = count;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: SiiFacetService, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: SiiFacetService }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: SiiFacetService, decorators: [{
            type: Injectable
        }] });

class FacetToolbarSearchComponent {
    get haveValue() {
        return this.siiFacetService.haveSearchText;
    }
    constructor(siiFacetService) {
        this.siiFacetService = siiFacetService;
        this.siiFacetService.removeAllFacetSelection$.subscribe(() => {
            this.changeTxt('', false);
            // this.inputElement.nativeElement.value='';
            // this.siiFacetService.searchFilterChange('',false)
        });
        this.siiFacetService.changeSearchTextRequestObs.subscribe((req) => {
            this.changeTxt(req, true);
        });
        // siiListController.textSearchChangeObs.subscribe((txt)=>{
        //   this.inputElement.nativeElement.value=txt;
        // })
    }
    changeTxt(txt, propagateChange) {
        this.inputElement.nativeElement.value = txt;
        this.siiFacetService.searchFilterChange(txt, propagateChange);
    }
    ngAfterViewInit() {
        if (this.siiFacetService._initFacetToSet.searchText.length != null && this.siiFacetService._initFacetToSet.searchText.length > 0) {
            Promise.resolve().then(() => {
                this.changeTxt(this.siiFacetService._initFacetToSet.searchText, false);
            });
        }
        fromEvent(this.inputElement.nativeElement, 'keyup')
            .pipe(map((i) => i.currentTarget.value), distinctUntilChanged(), debounceTime(500))
            .subscribe((txt) => {
            this.siiFacetService.searchFilterChange(txt);
        });
    }
    reset() {
        this.changeTxt('', true);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: FacetToolbarSearchComponent, deps: [{ token: SiiFacetService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "18.2.13", type: FacetToolbarSearchComponent, isStandalone: true, selector: "sii-facet-toolbar-search", host: { properties: { "class.searchWithValue": "this.haveValue" } }, viewQueries: [{ propertyName: "inputElement", first: true, predicate: ["ftSearchBox"], descendants: true }], ngImport: i0, template: "<!-- <div>\r\n<input   #ftSearchBox id=\"search-box\"\r\n  i18n-placeholder=\"@@Full_text_search\"\r\n  placeholder=\"search...\"\r\n  type=\"text\">\r\n\r\n  <mat-icon class=\"search-icon\" (click)=\"focusInput()\">search</mat-icon>\r\n</div> -->\r\n\r\n\r\n\r\n<!-- <mat-form-field appearance=\"outline\" > -->\r\n<input  id=\"ftSearchBox\" #ftSearchBox matInput i18n-placeholder=\"@@Full_text_search\"  placeholder=\"search...\">\r\n@if (!ftSearchBox.value) {\r\n  <mat-icon matSuffix>search</mat-icon>\r\n}\r\n@if (ftSearchBox.value) {\r\n  <mat-icon matSuffix   aria-label=\"Clear\" (click)=\"reset()\" style=\"cursor: pointer;\">close</mat-icon>\r\n}\r\n\r\n<!-- </mat-form-field> -->\r\n", styles: [":host{background-color:#fff;display:flex;padding:8px;border-radius:5px;color:#004191}input#ftSearchBox{outline:none;border:0;background:transparent;width:100%;font-size:1.1em;color:#00000080}input#ftSearchBox::placeholder{color:#090909;font-size:11px;opacity:1;text-transform:capitalize}input#ftSearchBox:-ms-input-placeholder{color:#090909}input#ftSearchBox::-ms-input-placeholder{color:#090909}:host:focus-within input#ftSearchBox,:host.searchWithValue input#ftSearchBox{color:#004191!important}\n"], dependencies: [{ kind: "directive", type: MatInput, selector: "input[matInput], textarea[matInput], select[matNativeControl],      input[matNativeControl], textarea[matNativeControl]", inputs: ["disabled", "id", "placeholder", "name", "required", "type", "errorStateMatcher", "aria-describedby", "value", "readonly"], exportAs: ["matInput"] }, { kind: "component", type: MatIcon, selector: "mat-icon", inputs: ["color", "inline", "svgIcon", "fontSet", "fontIcon"], exportAs: ["matIcon"] }, { kind: "directive", type: MatSuffix, selector: "[matSuffix], [matIconSuffix], [matTextSuffix]", inputs: ["matTextSuffix"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: FacetToolbarSearchComponent, decorators: [{
            type: Component,
            args: [{ selector: 'sii-facet-toolbar-search', standalone: true, imports: [MatInput, MatIcon, MatSuffix], template: "<!-- <div>\r\n<input   #ftSearchBox id=\"search-box\"\r\n  i18n-placeholder=\"@@Full_text_search\"\r\n  placeholder=\"search...\"\r\n  type=\"text\">\r\n\r\n  <mat-icon class=\"search-icon\" (click)=\"focusInput()\">search</mat-icon>\r\n</div> -->\r\n\r\n\r\n\r\n<!-- <mat-form-field appearance=\"outline\" > -->\r\n<input  id=\"ftSearchBox\" #ftSearchBox matInput i18n-placeholder=\"@@Full_text_search\"  placeholder=\"search...\">\r\n@if (!ftSearchBox.value) {\r\n  <mat-icon matSuffix>search</mat-icon>\r\n}\r\n@if (ftSearchBox.value) {\r\n  <mat-icon matSuffix   aria-label=\"Clear\" (click)=\"reset()\" style=\"cursor: pointer;\">close</mat-icon>\r\n}\r\n\r\n<!-- </mat-form-field> -->\r\n", styles: [":host{background-color:#fff;display:flex;padding:8px;border-radius:5px;color:#004191}input#ftSearchBox{outline:none;border:0;background:transparent;width:100%;font-size:1.1em;color:#00000080}input#ftSearchBox::placeholder{color:#090909;font-size:11px;opacity:1;text-transform:capitalize}input#ftSearchBox:-ms-input-placeholder{color:#090909}input#ftSearchBox::-ms-input-placeholder{color:#090909}:host:focus-within input#ftSearchBox,:host.searchWithValue input#ftSearchBox{color:#004191!important}\n"] }]
        }], ctorParameters: () => [{ type: SiiFacetService }], propDecorators: { inputElement: [{
                type: ViewChild,
                args: ['ftSearchBox', { static: false }]
            }], haveValue: [{
                type: HostBinding,
                args: ['class.searchWithValue']
            }] } });

class FacetsContainerComponent {
    constructor(siiFacetService, siiListController) {
        this.siiFacetService = siiFacetService;
        this.siiListController = siiListController;
        this.facetsChange = new EventEmitter();
        this.hideToolbarSearch = false;
        this.objectKeys = Object.keys;
        this.utils = {
            loaded: false
        };
        this.siiFacetService.facetChange$.subscribe((r) => this.facetsSelectionChange(r));
        this.siiFacetService.facetReset$.subscribe((r) => this.facetsSelectionReset(r));
        this.siiListController?.setInitFacetsObs.subscribe((r) => { this.siiFacetService.setInitFacets(r); });
        this.siiListController?.changeFacetsObs.subscribe(r => this.siiFacetService.changeFacetsRequestSubj.next(r));
        this.siiListController?.changeSearchTextObs?.subscribe(r => this.siiFacetService.changeSearchTextRequestSubj.next(r));
    }
    ngAfterViewInit() {
        setTimeout(() => {
            this.utils.loaded = true;
        }, 2000);
    }
    facetsSelectionChange(facets) {
        this.facetsChange.emit(facets);
        this.siiListController?.facetsChange.next(facets);
    }
    facetsSelectionReset(facets) {
        this.facetsChange.emit(facets);
        this.siiListController?.facetsReset.next(facets);
    }
    removeSelectionFromSelectionSummary(name, option) {
        this.siiFacetService.removeFacetSelectionFromFacetSummary({ name, facetOptions: [option] });
    }
    removeAllFilters() {
        this.siiFacetService.removeAllFilters();
    }
    get count() {
        return this.siiFacetService.selecteditemCount + (this.siiFacetService.haveSearchText ? 1 : 0);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: FacetsContainerComponent, deps: [{ token: SiiFacetService }, { token: SiiListController, optional: true }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "18.2.13", type: FacetsContainerComponent, isStandalone: true, selector: "sii-facets-container", inputs: { hideToolbarSearch: "hideToolbarSearch" }, outputs: { facetsChange: "facetsChange" }, providers: [SiiFacetService], ngImport: i0, template: "@if (!hideToolbarSearch) {\r\n  <sii-facet-toolbar-search></sii-facet-toolbar-search>\r\n}\r\n\r\n\r\n@if (count>0 ) {\r\n  <div class=\"fc_remove_all\">\r\n    <div class=\"fc_remove_all_label\" i18n=\"@@RemoveFilters\">Remove Filters</div>\r\n    <button mat-icon-button (click)=\"removeAllFilters()\">\r\n      <mat-icon class=\"fc_remove_all_icon\">cancel</mat-icon>\r\n    </button>\r\n  </div>\r\n}\r\n\r\n<mat-chip-set class=\"fc-selectedChips\"  aria-label=\"selection\" [ngClass]=\"{'loadingInProgress':utils.loaded==false}\">\r\n  @for (key of objectKeys(siiFacetService.facetObj); track key) {\r\n    @if (siiFacetService.facetObj[key]!=undefined && !siiFacetService.facetsHideSelection[key] ) {\r\n      @switch (siiFacetService.facetObj[key].constructor.name) {\r\n        @case ('Object') {\r\n          <!-- si spera che sia del tipo  SiiFacetOptionDto -->\r\n          <mat-chip  [matTooltip]=\"siiFacetService.facetLabelMap[key]+' : '+ siiFacetService.facetObj[key].descr\" [matTooltipShowDelay]=\"1000\"\r\n            [removable]=\"true\" (removed)=\"removeSelectionFromSelectionSummary(key,siiFacetService.facetObj[key])\">\r\n            @if (!siiFacetService.facetObj[key].miss) {\r\n              <div class=\"facetChipsText\">{{siiFacetService.facetObj[key].descr}}</div>\r\n            }\r\n            @if (!!siiFacetService.facetObj[key].lost && !!siiFacetService.facetObj[key].miss) {\r\n              <div class=\"facetChipsText\"> {{ \"##\"+siiFacetService.facetObj[key].code }}</div>\r\n            }\r\n            <mat-icon matChipRemove>cancel</mat-icon>\r\n          </mat-chip>\r\n        }\r\n        @case ('Array') {\r\n          @for (option of siiFacetService.facetObj[key]; track option) {\r\n            <mat-chip  [matTooltip]=\"siiFacetService.facetLabelMap[key]+' : '+ option.descr\" [matTooltipShowDelay]=\"1000\"\r\n              [removable]=\"true\" (removed)=\"removeSelectionFromSelectionSummary(key,option)\">\r\n              @if (!option.miss) {\r\n                <div class=\"facetChipsText\">{{option.descr }}</div>\r\n              }\r\n              @if (!!option.miss  ) {\r\n                <div class=\"facetChipsText\">\r\n                  @if (!!option.lost  ) {\r\n                    {{\"##\"+option.code }}\r\n                  }\r\n                  @if (!option.lost ) {\r\n                    <mat-spinner diameter='20' color=\"accent\"></mat-spinner>\r\n                  }\r\n                </div>\r\n              }\r\n              <mat-icon matChipRemove>cancel</mat-icon>\r\n            </mat-chip>\r\n          }\r\n        }\r\n        @default {\r\n          @switch (siiFacetService.facetObj[key]==true) {\r\n            @case (true) {\r\n              <mat-chip [matTooltip]=\"siiFacetService.facetLabelMap[key]\" [matTooltipShowDelay]=\"1000\"\r\n                [removable]=\"true\" (removed)=\"removeSelectionFromSelectionSummary(key,null)\">\r\n                <div class=\"facetChipsText\">{{siiFacetService.facetLabelMap[key]}}</div>\r\n                <mat-icon matChipRemove>cancel</mat-icon>\r\n              </mat-chip>\r\n            }\r\n            @case (false) {\r\n              <mat-chip [matTooltip]=\"siiFacetService.facetLabelMap[key]+' : '+ siiFacetService.facetObj[key]\" [matTooltipShowDelay]=\"1000\"\r\n                [removable]=\"true\" (removed)=\"removeSelectionFromSelectionSummary(key,null)\">\r\n                <div class=\"facetChipsText\">{{siiFacetService.facetObj[key]}}</div>\r\n                <mat-icon matChipRemove>cancel</mat-icon>\r\n              </mat-chip>\r\n            }\r\n          }\r\n        }\r\n      }\r\n    }\r\n  }\r\n</mat-chip-set>\r\n\r\n\r\n<mat-accordion  multi=true class=\"fcAccordion\">\r\n  <ng-content></ng-content>\r\n</mat-accordion>\r\n", styles: [".fc-selectedChips mat-chip{background-color:#918d8d;min-height:28px;letter-spacing:.28px;font-size:14px;line-height:17px;max-width:100%}.fc-selectedChips mat-chip mat-icon{color:#ffffffde}mat-accordion{margin-top:16px;display:block}.fc_remove_all{display:flex;align-items:center;justify-content:flex-end;margin-right:-14px;padding-bottom:10px}.fc_remove_all_label{font-size:14px;line-height:18px;letter-spacing:.84px;text-transform:uppercase}.fc_remove_all_icon{color:#ffffffd4}.facetChipsText{overflow:hidden;white-space:nowrap;text-overflow:ellipsis;color:#ffffffde}.loadingInProgress{display:none}mat-accordion.fcAccordion::ng-deep mat-radio-button .mdc-form-field{color:#ffffffde!important}mat-accordion.fcAccordion::ng-deep mat-radio-button .mdc-radio__outer-circle,mat-accordion.fcAccordion::ng-deep mat-radio-button .mdc-radio__inner-circle{border-color:#5da0ff8a!important}mat-accordion.fcAccordion::ng-deep mat-slide-toggle .mdc-form-field{color:#ffffffde!important}mat-accordion.fcAccordion::ng-deep .mat-mdc-input-element::placeholder{color:#ffffffde!important}mat-accordion.fcAccordion::ng-deep mat-form-field{width:100%}mat-accordion.fcAccordion::ng-deep mat-form-field button{color:#ffffffde!important}mat-accordion.fcAccordion::ng-deep mat-form-field input{color:#ffffffde!important}mat-accordion.fcAccordion::ng-deep mat-form-field .mdc-notched-outline>*{border-color:#ffffffde!important}mat-accordion.fcAccordion::ng-deep mat-form-field .mat-mdc-text-field-wrapper{background-color:transparent}mat-accordion.fcAccordion::ng-deep mat-form-field mat-label,mat-accordion.fcAccordion::ng-deep mat-form-field .mat-mdc-select-value,mat-accordion.fcAccordion::ng-deep mat-form-field .mat-mdc-select-arrow{color:#ffffffde!important}mat-accordion.fcAccordion::ng-deep mat-form-field mat-label{font-size:16px;letter-spacing:1px}mat-accordion.fcAccordion::ng-deep mat-form-field .mdc-text-field--filled:not(.mdc-text-field--disabled) .mdc-line-ripple:before{border-bottom-color:#ffffffde}\n"], dependencies: [{ kind: "component", type: FacetToolbarSearchComponent, selector: "sii-facet-toolbar-search" }, { kind: "component", type: MatIconButton, selector: "button[mat-icon-button]", exportAs: ["matButton"] }, { kind: "component", type: MatIcon, selector: "mat-icon", inputs: ["color", "inline", "svgIcon", "fontSet", "fontIcon"], exportAs: ["matIcon"] }, { kind: "component", type: MatChipSet, selector: "mat-chip-set", inputs: ["disabled", "role", "tabIndex"] }, { kind: "directive", type: NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "component", type: MatChip, selector: "mat-basic-chip, [mat-basic-chip], mat-chip, [mat-chip]", inputs: ["role", "id", "aria-label", "aria-description", "value", "color", "removable", "highlighted", "disableRipple", "disabled"], outputs: ["removed", "destroyed"], exportAs: ["matChip"] }, { kind: "directive", type: MatTooltip, selector: "[matTooltip]", inputs: ["matTooltipPosition", "matTooltipPositionAtOrigin", "matTooltipDisabled", "matTooltipShowDelay", "matTooltipHideDelay", "matTooltipTouchGestures", "matTooltip", "matTooltipClass"], exportAs: ["matTooltip"] }, { kind: "directive", type: MatChipRemove, selector: "[matChipRemove]" }, { kind: "component", type: MatProgressSpinner, selector: "mat-progress-spinner, mat-spinner", inputs: ["color", "mode", "value", "diameter", "strokeWidth"], exportAs: ["matProgressSpinner"] }, { kind: "directive", type: MatAccordion, selector: "mat-accordion", inputs: ["hideToggle", "displayMode", "togglePosition"], exportAs: ["matAccordion"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: FacetsContainerComponent, decorators: [{
            type: Component,
            args: [{ selector: 'sii-facets-container', providers: [SiiFacetService], standalone: true, imports: [FacetToolbarSearchComponent, MatIconButton, MatIcon, MatChipSet, NgClass, MatChip, MatTooltip, MatChipRemove, MatProgressSpinner, MatAccordion], template: "@if (!hideToolbarSearch) {\r\n  <sii-facet-toolbar-search></sii-facet-toolbar-search>\r\n}\r\n\r\n\r\n@if (count>0 ) {\r\n  <div class=\"fc_remove_all\">\r\n    <div class=\"fc_remove_all_label\" i18n=\"@@RemoveFilters\">Remove Filters</div>\r\n    <button mat-icon-button (click)=\"removeAllFilters()\">\r\n      <mat-icon class=\"fc_remove_all_icon\">cancel</mat-icon>\r\n    </button>\r\n  </div>\r\n}\r\n\r\n<mat-chip-set class=\"fc-selectedChips\"  aria-label=\"selection\" [ngClass]=\"{'loadingInProgress':utils.loaded==false}\">\r\n  @for (key of objectKeys(siiFacetService.facetObj); track key) {\r\n    @if (siiFacetService.facetObj[key]!=undefined && !siiFacetService.facetsHideSelection[key] ) {\r\n      @switch (siiFacetService.facetObj[key].constructor.name) {\r\n        @case ('Object') {\r\n          <!-- si spera che sia del tipo  SiiFacetOptionDto -->\r\n          <mat-chip  [matTooltip]=\"siiFacetService.facetLabelMap[key]+' : '+ siiFacetService.facetObj[key].descr\" [matTooltipShowDelay]=\"1000\"\r\n            [removable]=\"true\" (removed)=\"removeSelectionFromSelectionSummary(key,siiFacetService.facetObj[key])\">\r\n            @if (!siiFacetService.facetObj[key].miss) {\r\n              <div class=\"facetChipsText\">{{siiFacetService.facetObj[key].descr}}</div>\r\n            }\r\n            @if (!!siiFacetService.facetObj[key].lost && !!siiFacetService.facetObj[key].miss) {\r\n              <div class=\"facetChipsText\"> {{ \"##\"+siiFacetService.facetObj[key].code }}</div>\r\n            }\r\n            <mat-icon matChipRemove>cancel</mat-icon>\r\n          </mat-chip>\r\n        }\r\n        @case ('Array') {\r\n          @for (option of siiFacetService.facetObj[key]; track option) {\r\n            <mat-chip  [matTooltip]=\"siiFacetService.facetLabelMap[key]+' : '+ option.descr\" [matTooltipShowDelay]=\"1000\"\r\n              [removable]=\"true\" (removed)=\"removeSelectionFromSelectionSummary(key,option)\">\r\n              @if (!option.miss) {\r\n                <div class=\"facetChipsText\">{{option.descr }}</div>\r\n              }\r\n              @if (!!option.miss  ) {\r\n                <div class=\"facetChipsText\">\r\n                  @if (!!option.lost  ) {\r\n                    {{\"##\"+option.code }}\r\n                  }\r\n                  @if (!option.lost ) {\r\n                    <mat-spinner diameter='20' color=\"accent\"></mat-spinner>\r\n                  }\r\n                </div>\r\n              }\r\n              <mat-icon matChipRemove>cancel</mat-icon>\r\n            </mat-chip>\r\n          }\r\n        }\r\n        @default {\r\n          @switch (siiFacetService.facetObj[key]==true) {\r\n            @case (true) {\r\n              <mat-chip [matTooltip]=\"siiFacetService.facetLabelMap[key]\" [matTooltipShowDelay]=\"1000\"\r\n                [removable]=\"true\" (removed)=\"removeSelectionFromSelectionSummary(key,null)\">\r\n                <div class=\"facetChipsText\">{{siiFacetService.facetLabelMap[key]}}</div>\r\n                <mat-icon matChipRemove>cancel</mat-icon>\r\n              </mat-chip>\r\n            }\r\n            @case (false) {\r\n              <mat-chip [matTooltip]=\"siiFacetService.facetLabelMap[key]+' : '+ siiFacetService.facetObj[key]\" [matTooltipShowDelay]=\"1000\"\r\n                [removable]=\"true\" (removed)=\"removeSelectionFromSelectionSummary(key,null)\">\r\n                <div class=\"facetChipsText\">{{siiFacetService.facetObj[key]}}</div>\r\n                <mat-icon matChipRemove>cancel</mat-icon>\r\n              </mat-chip>\r\n            }\r\n          }\r\n        }\r\n      }\r\n    }\r\n  }\r\n</mat-chip-set>\r\n\r\n\r\n<mat-accordion  multi=true class=\"fcAccordion\">\r\n  <ng-content></ng-content>\r\n</mat-accordion>\r\n", styles: [".fc-selectedChips mat-chip{background-color:#918d8d;min-height:28px;letter-spacing:.28px;font-size:14px;line-height:17px;max-width:100%}.fc-selectedChips mat-chip mat-icon{color:#ffffffde}mat-accordion{margin-top:16px;display:block}.fc_remove_all{display:flex;align-items:center;justify-content:flex-end;margin-right:-14px;padding-bottom:10px}.fc_remove_all_label{font-size:14px;line-height:18px;letter-spacing:.84px;text-transform:uppercase}.fc_remove_all_icon{color:#ffffffd4}.facetChipsText{overflow:hidden;white-space:nowrap;text-overflow:ellipsis;color:#ffffffde}.loadingInProgress{display:none}mat-accordion.fcAccordion::ng-deep mat-radio-button .mdc-form-field{color:#ffffffde!important}mat-accordion.fcAccordion::ng-deep mat-radio-button .mdc-radio__outer-circle,mat-accordion.fcAccordion::ng-deep mat-radio-button .mdc-radio__inner-circle{border-color:#5da0ff8a!important}mat-accordion.fcAccordion::ng-deep mat-slide-toggle .mdc-form-field{color:#ffffffde!important}mat-accordion.fcAccordion::ng-deep .mat-mdc-input-element::placeholder{color:#ffffffde!important}mat-accordion.fcAccordion::ng-deep mat-form-field{width:100%}mat-accordion.fcAccordion::ng-deep mat-form-field button{color:#ffffffde!important}mat-accordion.fcAccordion::ng-deep mat-form-field input{color:#ffffffde!important}mat-accordion.fcAccordion::ng-deep mat-form-field .mdc-notched-outline>*{border-color:#ffffffde!important}mat-accordion.fcAccordion::ng-deep mat-form-field .mat-mdc-text-field-wrapper{background-color:transparent}mat-accordion.fcAccordion::ng-deep mat-form-field mat-label,mat-accordion.fcAccordion::ng-deep mat-form-field .mat-mdc-select-value,mat-accordion.fcAccordion::ng-deep mat-form-field .mat-mdc-select-arrow{color:#ffffffde!important}mat-accordion.fcAccordion::ng-deep mat-form-field mat-label{font-size:16px;letter-spacing:1px}mat-accordion.fcAccordion::ng-deep mat-form-field .mdc-text-field--filled:not(.mdc-text-field--disabled) .mdc-line-ripple:before{border-bottom-color:#ffffffde}\n"] }]
        }], ctorParameters: () => [{ type: SiiFacetService }, { type: SiiListController, decorators: [{
                    type: Optional
                }] }], propDecorators: { facetsChange: [{
                type: Output
            }], hideToolbarSearch: [{
                type: Input
            }] } });

class FacetSkeletonComponent {
    constructor() {
        this.expanded = true;
        this.expandedChange = new EventEmitter();
        this.initalized = false;
    }
    ngAfterViewInit() {
        Promise.resolve().then(() => {
            // this is necessary to resolve the problem of flicking on reload
            this.initalized = true;
        });
    }
    ngOnInit() {
    }
    setLabel(label) {
        Promise.resolve().then(() => this.label = label);
    }
    setExpanded(expanded) {
        Promise.resolve().then(() => this.expanded = expanded);
    }
    expChange(ev) {
        this.expandedChange.next(ev);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: FacetSkeletonComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "18.2.13", type: FacetSkeletonComponent, isStandalone: true, selector: "sii-facet-skeleton", inputs: { expanded: "expanded", label: "label" }, outputs: { expandedChange: "expandedChange" }, ngImport: i0, template: "@if (initalized) {\r\n  <mat-expansion-panel [expanded]=\"expanded\" (expandedChange)=\"expChange($event)\">\r\n    <mat-expansion-panel-header>\r\n      {{label}}\r\n    </mat-expansion-panel-header>\r\n    <ng-content select=\"sii-facet-search\"></ng-content>\r\n    <div class=\"skelCont\">\r\n      <ng-content></ng-content>\r\n    </div>\r\n    <ng-content select=\"sii-facet-paginator\"></ng-content>\r\n  </mat-expansion-panel>\r\n}\r\n", styles: ["mat-expansion-panel{background-color:transparent;box-shadow:none!important;padding-bottom:10px}.mat-expansion-panel,:host ::ng-deep .mat-expansion-indicator:after{color:#fff!important}mat-expansion-panel-header{font-size:15px;line-height:20px;letter-spacing:.3px;padding:0 5px 0 0;text-transform:capitalize;font-weight:600;max-height:30px}:host ::ng-deep .mat-expansion-panel-body{padding:0 2px!important}\n"], dependencies: [{ kind: "component", type: MatExpansionPanel, selector: "mat-expansion-panel", inputs: ["hideToggle", "togglePosition"], outputs: ["afterExpand", "afterCollapse"], exportAs: ["matExpansionPanel"] }, { kind: "component", type: MatExpansionPanelHeader, selector: "mat-expansion-panel-header", inputs: ["expandedHeight", "collapsedHeight", "tabIndex"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: FacetSkeletonComponent, decorators: [{
            type: Component,
            args: [{ selector: 'sii-facet-skeleton', standalone: true, imports: [MatExpansionPanel, MatExpansionPanelHeader], template: "@if (initalized) {\r\n  <mat-expansion-panel [expanded]=\"expanded\" (expandedChange)=\"expChange($event)\">\r\n    <mat-expansion-panel-header>\r\n      {{label}}\r\n    </mat-expansion-panel-header>\r\n    <ng-content select=\"sii-facet-search\"></ng-content>\r\n    <div class=\"skelCont\">\r\n      <ng-content></ng-content>\r\n    </div>\r\n    <ng-content select=\"sii-facet-paginator\"></ng-content>\r\n  </mat-expansion-panel>\r\n}\r\n", styles: ["mat-expansion-panel{background-color:transparent;box-shadow:none!important;padding-bottom:10px}.mat-expansion-panel,:host ::ng-deep .mat-expansion-indicator:after{color:#fff!important}mat-expansion-panel-header{font-size:15px;line-height:20px;letter-spacing:.3px;padding:0 5px 0 0;text-transform:capitalize;font-weight:600;max-height:30px}:host ::ng-deep .mat-expansion-panel-body{padding:0 2px!important}\n"] }]
        }], ctorParameters: () => [], propDecorators: { expanded: [{
                type: Input
            }], expandedChange: [{
                type: Output
            }], label: [{
                type: Input
            }] } });

// @Component({
//   selector: 'sii-primitive-facet',
//   template: '',
//   styleUrls: ['./primitive-facet.component.css']
// })
// @Component({
//   selector: 'sii-primitive-facet',
//   template: ''
// })
class PrimitiveFacetDirective {
    set multiplicityToDisplay(val) {
        this.siiFacetService.facetsMultiplicity[this.config.name] = val;
    }
    get multiplicityToDisplay() {
        return this.siiFacetService.facetsMultiplicity[this.config.name] || 1;
    }
    set facetExpanded(val) {
        this.siiFacetService.facetsExpanded[this.config.name] = val;
    }
    get facetExpanded() {
        return this.siiFacetService.facetsExpanded[this.config.name];
    }
    set optionsInitValue(val) {
        this._optionsInitValue = val;
    }
    get optionsInitValue() {
        if (Array.isArray(this._optionsInitValue)) {
            return [...this._optionsInitValue];
        }
        else {
            return this._optionsInitValue;
        }
    }
    get facetSelection() { return this.siiFacetService.facetObj[this.config.name]; }
    set facetSelection(val) { this.siiFacetService.facetObj[this.config.name] = val; }
    get selectedFacets() { return this.siiFacetService.facetObjVal[this.config.name] || {}; }
    constructor(siiFacetService) {
        this.siiFacetService = siiFacetService;
        this.expanded = true; // Init value for expansion
        this.initMultiplicityToDisplay = 1; // the init value
        this.visibleFacetsSize = 5;
        this.hideSelection = false;
        this.subscriptions = new Subscription();
        this._optionsInitValue = [];
        this.siiFacetService.removeFacetSelection$.subscribe((fs) => {
            this.removeFacetSelectionFromFacetSummaryCallback(fs);
        });
        this.siiFacetService.removeAllFacetSelection$.subscribe(() => {
            this.removeAllSelections();
        });
        this.siiFacetService.changeFacetsRequestObs.subscribe((req) => {
            if (req.facets.hasOwnProperty(this.config.name)) {
                this.changeFacets(req.facets[this.config.name]);
            }
            else if (req.reset) {
                this.removeAllSelections();
            }
        });
    }
    ngOnChanges(changes) {
        if (!!changes.config) {
            if (this.facetSelection?.find(i => !!i.miss) != null) {
                this.facetSelection = this.extractFacetFromList(this.facetSelection.map(i => i.code));
                this.facetSelection?.filter(i => !!i.miss).forEach(i => i.lost = true);
                this.updateFacetSelection(false);
            }
        }
    }
    ngAfterViewInitCallback() { } // override da discendenti
    ngAfterViewInit() {
        if (this.siiFacetService.facetsHideSelection[this.config.name] === undefined) {
            Promise.resolve().then(() => {
                this.siiFacetService.facetsHideSelection[this.config.name] = this.hideSelection;
            });
        }
        // check if is firstInit
        if (this.siiFacetService.facetsMultiplicity[this.config.name] === undefined) {
            Promise.resolve().then(() => {
                this.multiplicityToDisplay = this.initMultiplicityToDisplay;
            });
        }
        else if (this.multiplicityToDisplay * this.visibleFacetsSize > this.config.facetOptions.length) {
            // there are less facets . reduce the multiplicity to the max available
            Promise.resolve().then(() => {
                this.multiplicityToDisplay = Math.ceil(this.config.facetOptions.length / this.visibleFacetsSize);
            });
        }
        if (this.facetSelection === undefined) {
            Promise.resolve().then(() => {
                this.siiFacetService.initializeFacet(this.config.name, this.getInitSelection());
            });
        }
        if (this.siiFacetService.facetsExpanded[this.config.name] === undefined) {
            Promise.resolve().then(() => {
                this.facetExpanded = this.expanded;
            });
        }
        if (this.skelRef) {
            // setto in automatico la label sul componente
            Promise.resolve().then(() => {
                this.skelRef.setLabel(this.label);
                this.skelRef.setExpanded(this.facetExpanded);
                this.subscriptions.add(this.skelRef.expandedChange.subscribe((ev) => this.facetExpanded = ev));
            });
        }
        this.siiFacetService.registerFacetLabel(this.config.name, this.label);
        Promise.resolve().then(() => {
            this.ngAfterViewInitCallback();
        });
    }
    ngOnDestroy() {
        // not needed since it's a cold observable but good practice
        this.subscriptions.unsubscribe();
    }
    removeFacetSelectionFromFacetSummaryCallback(fs) {
        if (fs.name === this.config.name) {
            for (const op in fs.facetOptions) {
                if (fs.facetOptions[op] != null) {
                    this.removeSelection(fs.facetOptions[op]);
                }
            }
        }
    }
    getInitSelection() {
        if (this.siiFacetService._initFacetToSet.facets[this.config.name] !== undefined) {
            const fcts = this.extractFacetFromList(this.siiFacetService._initFacetToSet.facets[this.config.name]);
            fcts.filter(i => !!i.miss).forEach(i => i.lost = true);
            return fcts;
        }
        else {
            return this.optionsInitValue || [];
        }
    }
    extractFacetFromList(items) {
        const itemsToAdd = [];
        const initVal = [...items];
        this.config.facetOptions?.forEach(op => {
            const initIndex = initVal.indexOf(op.code);
            if (initIndex !== -1) {
                itemsToAdd.push(op);
                initVal.splice(initIndex, 1);
            }
        });
        if (initVal.length > 0) {
            // init facet not in options.
            console.log('facet non presenti=', initVal);
            initVal.forEach(iv => {
                const missOp = { code: iv, descr: '!!' + iv, count: 0, miss: true };
                itemsToAdd.push(missOp);
            });
        }
        return itemsToAdd;
    }
    addSelection(item) {
        this.facetSelection.push(item);
        this.updateFacetSelection();
    }
    removeSelection(item, propagate = true) {
        const i = this.facetSelection.findIndex((e) => e.code === item.code);
        if (i !== -1) {
            this.facetSelection.splice(i, 1);
            this.updateFacetSelection(propagate);
        }
    }
    removeAllSelections() {
        this.facetSelection = this.optionsInitValue;
        this.updateFacetSelection(false);
    }
    changeFacets(facets) {
        this.facetSelection = this.extractFacetFromList(facets);
        this.updateFacetSelection(true);
    }
    toggle(opt) {
        this.selectedFacets[opt.code] === undefined ? this.addSelection(opt) : this.removeSelection(opt);
    }
    updateFacetSelection(propagateChange = true) {
        this.siiFacetService.facetChange({
            facetOptions: this.facetSelection,
            name: this.config.name
        }, propagateChange);
    }
    instanceOfSiiFacetOptionDto(object) {
        return (object instanceof Object) && ('code' in object && 'descr' in object);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: PrimitiveFacetDirective, deps: [{ token: SiiFacetService }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "18.2.13", type: PrimitiveFacetDirective, inputs: { config: "config", expanded: "expanded", label: "label", initMultiplicityToDisplay: "initMultiplicityToDisplay", visibleFacetsSize: "visibleFacetsSize", hideSelection: "hideSelection" }, viewQueries: [{ propertyName: "skelRef", first: true, predicate: FacetSkeletonComponent, descendants: true }], usesOnChanges: true, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: PrimitiveFacetDirective, decorators: [{
            type: Directive
        }], ctorParameters: () => [{ type: SiiFacetService }], propDecorators: { config: [{
                type: Input
            }], expanded: [{
                type: Input
            }], label: [{
                type: Input
            }], initMultiplicityToDisplay: [{
                type: Input
            }], visibleFacetsSize: [{
                type: Input
            }], hideSelection: [{
                type: Input
            }], skelRef: [{
                type: ViewChild,
                args: [FacetSkeletonComponent]
            }] } });

class FacetSearchComponent {
    constructor() {
        this.optionSelected = new EventEmitter();
        this.myControl = new UntypedFormControl();
    }
    ngOnInit() {
        this.filteredOptions = this.myControl.valueChanges.pipe(startWith(''), filter((v) => typeof v === 'string'), map(value => {
            return this._filter(value);
        }));
    }
    _filter(value) {
        const filterValue = value.toLowerCase();
        return this.options.filter(option => {
            return (!!option.descr && option.descr.toLowerCase().indexOf(filterValue) !== -1) ||
                ('' + option.code).toLowerCase().indexOf(filterValue) !== -1;
        });
    }
    displayFn(option) {
        return option && option.descr ? option.descr : '';
    }
    optionSelectedAction(sel) {
        this.optionSelected.emit(sel.option.value);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: FacetSearchComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "18.2.13", type: FacetSearchComponent, isStandalone: true, selector: "sii-facet-search", inputs: { options: "options", selected: "selected" }, outputs: { optionSelected: "optionSelected" }, ngImport: i0, template: "<form>\r\n  <mat-form-field appearance=\"outline\" class=\"siiFacetSearchFormField\">\r\n    <input type=\"text\"\r\n      placeholder=\"Search...\"\r\n      aria-label=\"Number\"\r\n      matInput\r\n      [formControl]=\"myControl\"\r\n      [matAutocomplete]=\"auto\">\r\n      <mat-icon class=\"fs_search_icon\" matSuffix >search</mat-icon>\r\n      <mat-autocomplete autoActiveFirstOption #auto=\"matAutocomplete\" (optionSelected)=\"optionSelectedAction($event)\" [displayWith]=\"displayFn\">\r\n        @for (option of filteredOptions  | async ; track option) {\r\n          <mat-option [value]=\"option\" [class.sii-facet-search-selected]=\"selected[option.code]\">\r\n            {{option.descr || \"##\"+option.code}}\r\n          </mat-option>\r\n        }\r\n      </mat-autocomplete>\r\n    </mat-form-field>\r\n  </form>\r\n", styles: [".siiFacetSearchFormField{width:100%;font-size:12px}.siiFacetSearchFormField::ng-deep .mat-mdc-text-field-wrapper{background-color:#061a36}.siiFacetSearchFormField::ng-deep .mat-mdc-select-value,.siiFacetSearchFormField::ng-deep .mat-mdc-select-arrow{color:#ffffffde!important}.siiFacetSearchFormField::ng-deep .mat-mdc-form-field-infix{padding-top:8px;padding-bottom:8px;min-height:30px}.siiFacetSearchFormField::ng-deep .mdc-notched-outline>*{border-color:#ffffffde!important}.mat-mdc-input-element::placeholder{color:#ffffffd4!important;letter-spacing:1.1px}.fs_search_icon{font-size:22px;color:#ffffffd4;padding:8px}\n"], dependencies: [{ kind: "ngmodule", type: FormsModule }, { kind: "directive", type: i1$6.ɵNgNoValidate, selector: "form:not([ngNoForm]):not([ngNativeValidate])" }, { kind: "directive", type: i1$6.DefaultValueAccessor, selector: "input:not([type=checkbox])[formControlName],textarea[formControlName],input:not([type=checkbox])[formControl],textarea[formControl],input:not([type=checkbox])[ngModel],textarea[ngModel],[ngDefaultControl]" }, { kind: "directive", type: i1$6.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i1$6.NgControlStatusGroup, selector: "[formGroupName],[formArrayName],[ngModelGroup],[formGroup],form:not([ngNoForm]),[ngForm]" }, { kind: "directive", type: i1$6.NgForm, selector: "form:not([ngNoForm]):not([formGroup]),ng-form,[ngForm]", inputs: ["ngFormOptions"], outputs: ["ngSubmit"], exportAs: ["ngForm"] }, { kind: "component", type: MatFormField, selector: "mat-form-field", inputs: ["hideRequiredMarker", "color", "floatLabel", "appearance", "subscriptSizing", "hintLabel"], exportAs: ["matFormField"] }, { kind: "directive", type: MatInput, selector: "input[matInput], textarea[matInput], select[matNativeControl],      input[matNativeControl], textarea[matNativeControl]", inputs: ["disabled", "id", "placeholder", "name", "required", "type", "errorStateMatcher", "aria-describedby", "value", "readonly"], exportAs: ["matInput"] }, { kind: "directive", type: MatAutocompleteTrigger, selector: "input[matAutocomplete], textarea[matAutocomplete]", inputs: ["matAutocomplete", "matAutocompletePosition", "matAutocompleteConnectedTo", "autocomplete", "matAutocompleteDisabled"], exportAs: ["matAutocompleteTrigger"] }, { kind: "ngmodule", type: ReactiveFormsModule }, { kind: "directive", type: i1$6.FormControlDirective, selector: "[formControl]", inputs: ["formControl", "disabled", "ngModel"], outputs: ["ngModelChange"], exportAs: ["ngForm"] }, { kind: "component", type: MatIcon, selector: "mat-icon", inputs: ["color", "inline", "svgIcon", "fontSet", "fontIcon"], exportAs: ["matIcon"] }, { kind: "directive", type: MatSuffix, selector: "[matSuffix], [matIconSuffix], [matTextSuffix]", inputs: ["matTextSuffix"] }, { kind: "component", type: MatAutocomplete, selector: "mat-autocomplete", inputs: ["aria-label", "aria-labelledby", "displayWith", "autoActiveFirstOption", "autoSelectActiveOption", "requireSelection", "panelWidth", "disableRipple", "class", "hideSingleSelectionIndicator"], outputs: ["optionSelected", "opened", "closed", "optionActivated"], exportAs: ["matAutocomplete"] }, { kind: "component", type: MatOption, selector: "mat-option", inputs: ["value", "id", "disabled"], outputs: ["onSelectionChange"], exportAs: ["matOption"] }, { kind: "pipe", type: AsyncPipe, name: "async" }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: FacetSearchComponent, decorators: [{
            type: Component,
            args: [{ selector: 'sii-facet-search', standalone: true, imports: [FormsModule, MatFormField, MatInput, MatAutocompleteTrigger, ReactiveFormsModule, MatIcon, MatSuffix, MatAutocomplete, MatOption, AsyncPipe], template: "<form>\r\n  <mat-form-field appearance=\"outline\" class=\"siiFacetSearchFormField\">\r\n    <input type=\"text\"\r\n      placeholder=\"Search...\"\r\n      aria-label=\"Number\"\r\n      matInput\r\n      [formControl]=\"myControl\"\r\n      [matAutocomplete]=\"auto\">\r\n      <mat-icon class=\"fs_search_icon\" matSuffix >search</mat-icon>\r\n      <mat-autocomplete autoActiveFirstOption #auto=\"matAutocomplete\" (optionSelected)=\"optionSelectedAction($event)\" [displayWith]=\"displayFn\">\r\n        @for (option of filteredOptions  | async ; track option) {\r\n          <mat-option [value]=\"option\" [class.sii-facet-search-selected]=\"selected[option.code]\">\r\n            {{option.descr || \"##\"+option.code}}\r\n          </mat-option>\r\n        }\r\n      </mat-autocomplete>\r\n    </mat-form-field>\r\n  </form>\r\n", styles: [".siiFacetSearchFormField{width:100%;font-size:12px}.siiFacetSearchFormField::ng-deep .mat-mdc-text-field-wrapper{background-color:#061a36}.siiFacetSearchFormField::ng-deep .mat-mdc-select-value,.siiFacetSearchFormField::ng-deep .mat-mdc-select-arrow{color:#ffffffde!important}.siiFacetSearchFormField::ng-deep .mat-mdc-form-field-infix{padding-top:8px;padding-bottom:8px;min-height:30px}.siiFacetSearchFormField::ng-deep .mdc-notched-outline>*{border-color:#ffffffde!important}.mat-mdc-input-element::placeholder{color:#ffffffd4!important;letter-spacing:1.1px}.fs_search_icon{font-size:22px;color:#ffffffd4;padding:8px}\n"] }]
        }], ctorParameters: () => [], propDecorators: { options: [{
                type: Input
            }], selected: [{
                type: Input
            }], optionSelected: [{
                type: Output
            }] } });

class FacetPaginatorComponent {
    constructor() {
        this.size = 0;
        this.visibleFacetsSize = 5;
        this.multiplicityToDisplayChange = new EventEmitter();
    }
    ngOnInit() {
    }
    updateVal(incr) {
        this.multiplicityToDisplay = incr ? this.multiplicityToDisplay + 1 : this.multiplicityToDisplay - 1;
        this.multiplicityToDisplayChange.emit(this.multiplicityToDisplay);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: FacetPaginatorComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "18.2.13", type: FacetPaginatorComponent, isStandalone: true, selector: "sii-facet-paginator", inputs: { size: "size", visibleFacetsSize: "visibleFacetsSize", multiplicityToDisplay: "multiplicityToDisplay" }, outputs: { multiplicityToDisplayChange: "multiplicityToDisplayChange" }, ngImport: i0, template: "@if (size > visibleFacetsSize) {\r\n  <div class=\"showMoreOrLessButtonsContainer\">\r\n    @if (size > (visibleFacetsSize*multiplicityToDisplay)) {\r\n      <button mat-button (click)=\"updateVal(true)\"><mat-icon>add</mat-icon><span>Show more</span></button>\r\n    }\r\n    @if (multiplicityToDisplay !== 1) {\r\n      <button mat-button (click)=\"updateVal(false)\"><mat-icon>remove</mat-icon><span>Show less</span></button>\r\n    }\r\n  </div>\r\n}\r\n", styles: [".showMoreOrLessButtonsContainer{display:flex;justify-content:space-between}.showMoreOrLessButtonsContainer button{padding:0;color:#ffffffde!important}\n"], dependencies: [{ kind: "component", type: MatButton, selector: "    button[mat-button], button[mat-raised-button], button[mat-flat-button],    button[mat-stroked-button]  ", exportAs: ["matButton"] }, { kind: "component", type: MatIcon, selector: "mat-icon", inputs: ["color", "inline", "svgIcon", "fontSet", "fontIcon"], exportAs: ["matIcon"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: FacetPaginatorComponent, decorators: [{
            type: Component,
            args: [{ selector: 'sii-facet-paginator', standalone: true, imports: [MatButton, MatIcon], template: "@if (size > visibleFacetsSize) {\r\n  <div class=\"showMoreOrLessButtonsContainer\">\r\n    @if (size > (visibleFacetsSize*multiplicityToDisplay)) {\r\n      <button mat-button (click)=\"updateVal(true)\"><mat-icon>add</mat-icon><span>Show more</span></button>\r\n    }\r\n    @if (multiplicityToDisplay !== 1) {\r\n      <button mat-button (click)=\"updateVal(false)\"><mat-icon>remove</mat-icon><span>Show less</span></button>\r\n    }\r\n  </div>\r\n}\r\n", styles: [".showMoreOrLessButtonsContainer{display:flex;justify-content:space-between}.showMoreOrLessButtonsContainer button{padding:0;color:#ffffffde!important}\n"] }]
        }], ctorParameters: () => [], propDecorators: { size: [{
                type: Input
            }], visibleFacetsSize: [{
                type: Input
            }], multiplicityToDisplay: [{
                type: Input
            }], multiplicityToDisplayChange: [{
                type: Output
            }] } });

class FacetCheckboxComponent extends PrimitiveFacetDirective {
    constructor(siiFacetService) {
        super(siiFacetService);
    }
    check(opt, ev) {
        ev.checked ? this.addSelection(opt) : this.removeSelection(opt);
    }
    toggle(opt) {
        this.selectedFacets[opt.code] === undefined ? this.addSelection(opt) : this.removeSelection(opt);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: FacetCheckboxComponent, deps: [{ token: SiiFacetService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "18.2.13", type: FacetCheckboxComponent, isStandalone: true, selector: "sii-facet-checkbox", usesInheritance: true, ngImport: i0, template: "<sii-facet-skeleton >\r\n  @for (opt of config?.facetOptions | slice:0:visibleFacetsSize*multiplicityToDisplay; track opt.code; let i = $index) {\r\n    <div  class=\"facet-checkbox-item\" [class.facet-selected]=\"selectedFacets[opt.code]\">\r\n      <mat-checkbox [checked]=\"selectedFacets[opt.code]\" (change)=\"check(opt ,$event);\" color=\"primary\"></mat-checkbox>\r\n      <div   (click)=\"toggle(opt);\" [matTooltip]=\"opt.descr\"   [matTooltipShowDelay]=\"1000\" class=\"facet-checkbox-item-text\">{{opt.descr || \"##\"+opt.code}}</div>\r\n      <sii-badge [background]=\"'white'\" [color]=\"'#0D456F'\">{{opt.count}}</sii-badge>\r\n    </div>\r\n  }\r\n\r\n  <sii-facet-paginator [size]=\"config?.facetOptions.length\" [visibleFacetsSize]='visibleFacetsSize' [(multiplicityToDisplay)]=\"multiplicityToDisplay\"></sii-facet-paginator>\r\n  <sii-facet-search [selected]=\"selectedFacets\" [options]=\"config?.facetOptions\" (optionSelected)=\"toggle($event)\"></sii-facet-search>\r\n</sii-facet-skeleton>\r\n", styles: ["sii-badge{padding:1px 10px}mat-checkbox::ng-deep .mdc-checkbox__background{border-color:#ffffffb3!important}.facet-checkbox-item{display:flex;align-items:center;padding-bottom:5px}.facet-checkbox-item mat-checkbox{margin-top:-2px}.facet-checkbox-item-text{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;padding:0 8px;flex:1 1 auto;font-size:14px;line-height:14px}\n"], dependencies: [{ kind: "component", type: FacetSkeletonComponent, selector: "sii-facet-skeleton", inputs: ["expanded", "label"], outputs: ["expandedChange"] }, { kind: "component", type: MatCheckbox, selector: "mat-checkbox", inputs: ["aria-label", "aria-labelledby", "aria-describedby", "id", "required", "labelPosition", "name", "value", "disableRipple", "tabIndex", "color", "disabledInteractive", "checked", "disabled", "indeterminate"], outputs: ["change", "indeterminateChange"], exportAs: ["matCheckbox"] }, { kind: "directive", type: MatTooltip, selector: "[matTooltip]", inputs: ["matTooltipPosition", "matTooltipPositionAtOrigin", "matTooltipDisabled", "matTooltipShowDelay", "matTooltipHideDelay", "matTooltipTouchGestures", "matTooltip", "matTooltipClass"], exportAs: ["matTooltip"] }, { kind: "component", type: BadgeComponent, selector: "sii-badge", inputs: ["appearance", "background", "color"] }, { kind: "component", type: FacetPaginatorComponent, selector: "sii-facet-paginator", inputs: ["size", "visibleFacetsSize", "multiplicityToDisplay"], outputs: ["multiplicityToDisplayChange"] }, { kind: "component", type: FacetSearchComponent, selector: "sii-facet-search", inputs: ["options", "selected"], outputs: ["optionSelected"] }, { kind: "pipe", type: SlicePipe, name: "slice" }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: FacetCheckboxComponent, decorators: [{
            type: Component,
            args: [{ selector: 'sii-facet-checkbox', standalone: true, imports: [FacetSkeletonComponent, MatCheckbox, MatTooltip, BadgeComponent, FacetPaginatorComponent, FacetSearchComponent, SlicePipe], template: "<sii-facet-skeleton >\r\n  @for (opt of config?.facetOptions | slice:0:visibleFacetsSize*multiplicityToDisplay; track opt.code; let i = $index) {\r\n    <div  class=\"facet-checkbox-item\" [class.facet-selected]=\"selectedFacets[opt.code]\">\r\n      <mat-checkbox [checked]=\"selectedFacets[opt.code]\" (change)=\"check(opt ,$event);\" color=\"primary\"></mat-checkbox>\r\n      <div   (click)=\"toggle(opt);\" [matTooltip]=\"opt.descr\"   [matTooltipShowDelay]=\"1000\" class=\"facet-checkbox-item-text\">{{opt.descr || \"##\"+opt.code}}</div>\r\n      <sii-badge [background]=\"'white'\" [color]=\"'#0D456F'\">{{opt.count}}</sii-badge>\r\n    </div>\r\n  }\r\n\r\n  <sii-facet-paginator [size]=\"config?.facetOptions.length\" [visibleFacetsSize]='visibleFacetsSize' [(multiplicityToDisplay)]=\"multiplicityToDisplay\"></sii-facet-paginator>\r\n  <sii-facet-search [selected]=\"selectedFacets\" [options]=\"config?.facetOptions\" (optionSelected)=\"toggle($event)\"></sii-facet-search>\r\n</sii-facet-skeleton>\r\n", styles: ["sii-badge{padding:1px 10px}mat-checkbox::ng-deep .mdc-checkbox__background{border-color:#ffffffb3!important}.facet-checkbox-item{display:flex;align-items:center;padding-bottom:5px}.facet-checkbox-item mat-checkbox{margin-top:-2px}.facet-checkbox-item-text{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;padding:0 8px;flex:1 1 auto;font-size:14px;line-height:14px}\n"] }]
        }], ctorParameters: () => [{ type: SiiFacetService }] });

class FacetComponent extends PrimitiveFacetDirective {
    constructor(siiFacetService) {
        super(siiFacetService);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: FacetComponent, deps: [{ token: SiiFacetService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "18.2.13", type: FacetComponent, isStandalone: true, selector: "sii-facet", queries: [{ propertyName: "facetTemplate", first: true, predicate: SiiFacetTemplateDirective, descendants: true, read: TemplateRef }], usesInheritance: true, ngImport: i0, template: "@if (config?.facetOptions?.length>0) {\r\n  <sii-facet-skeleton >\r\n    @for (opt of config?.facetOptions | slice:0:visibleFacetsSize*multiplicityToDisplay; track opt.code; let i = $index) {\r\n      <div\r\n        class=\"facet-basic\" [class.facet-selected]=\"selectedFacets[opt.code]\" (click)=\"toggle(opt);\">\r\n        <div  [matTooltip]=\"opt.descr\"   [matTooltipShowDelay]=\"1000\" class=\"facet-item-text\">\r\n          <ng-container  *ngTemplateOutlet=\"facetTemplate || defaultFacetTemplate; context:{$implicit:opt, selected:selectedFacets[opt.code]}\" ></ng-container></div>\r\n          @if (opt.count!=null) {\r\n            <sii-badge [background]=\"'white'\" [color]=\"'#0D456F'\">{{opt.count}}</sii-badge>\r\n          }\r\n        </div>\r\n      }\r\n      <sii-facet-paginator [size]=\"config?.facetOptions.length\" [visibleFacetsSize]='visibleFacetsSize' [(multiplicityToDisplay)]=\"multiplicityToDisplay\"></sii-facet-paginator>\r\n      @if (config?.facetOptions.length>10) {\r\n        <sii-facet-search [selected]=\"selectedFacets\" [options]=\"config?.facetOptions\" (optionSelected)=\"toggle($event)\"></sii-facet-search>\r\n      }\r\n    </sii-facet-skeleton>\r\n  }\r\n\r\n\r\n  <ng-template #defaultFacetTemplate let-opt>\r\n    {{opt.descr || \"##\"+opt.code}}\r\n  </ng-template>\r\n", styles: ["sii-badge{padding:1px 10px}.facet-basic{display:flex;align-items:flex-end;padding:2px 0 3px;cursor:pointer}.facet-basic:hover{background-color:#00000012}.facet-item-text{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;padding:0 8px 0 0;flex:1 1 auto;font-size:14px;line-height:20px;letter-spacing:.28px}\n"], dependencies: [{ kind: "component", type: FacetSkeletonComponent, selector: "sii-facet-skeleton", inputs: ["expanded", "label"], outputs: ["expandedChange"] }, { kind: "directive", type: MatTooltip, selector: "[matTooltip]", inputs: ["matTooltipPosition", "matTooltipPositionAtOrigin", "matTooltipDisabled", "matTooltipShowDelay", "matTooltipHideDelay", "matTooltipTouchGestures", "matTooltip", "matTooltipClass"], exportAs: ["matTooltip"] }, { kind: "directive", type: NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "component", type: BadgeComponent, selector: "sii-badge", inputs: ["appearance", "background", "color"] }, { kind: "component", type: FacetPaginatorComponent, selector: "sii-facet-paginator", inputs: ["size", "visibleFacetsSize", "multiplicityToDisplay"], outputs: ["multiplicityToDisplayChange"] }, { kind: "component", type: FacetSearchComponent, selector: "sii-facet-search", inputs: ["options", "selected"], outputs: ["optionSelected"] }, { kind: "pipe", type: SlicePipe, name: "slice" }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: FacetComponent, decorators: [{
            type: Component,
            args: [{ selector: 'sii-facet', standalone: true, imports: [FacetSkeletonComponent, MatTooltip, NgTemplateOutlet, BadgeComponent, FacetPaginatorComponent, FacetSearchComponent, SlicePipe], template: "@if (config?.facetOptions?.length>0) {\r\n  <sii-facet-skeleton >\r\n    @for (opt of config?.facetOptions | slice:0:visibleFacetsSize*multiplicityToDisplay; track opt.code; let i = $index) {\r\n      <div\r\n        class=\"facet-basic\" [class.facet-selected]=\"selectedFacets[opt.code]\" (click)=\"toggle(opt);\">\r\n        <div  [matTooltip]=\"opt.descr\"   [matTooltipShowDelay]=\"1000\" class=\"facet-item-text\">\r\n          <ng-container  *ngTemplateOutlet=\"facetTemplate || defaultFacetTemplate; context:{$implicit:opt, selected:selectedFacets[opt.code]}\" ></ng-container></div>\r\n          @if (opt.count!=null) {\r\n            <sii-badge [background]=\"'white'\" [color]=\"'#0D456F'\">{{opt.count}}</sii-badge>\r\n          }\r\n        </div>\r\n      }\r\n      <sii-facet-paginator [size]=\"config?.facetOptions.length\" [visibleFacetsSize]='visibleFacetsSize' [(multiplicityToDisplay)]=\"multiplicityToDisplay\"></sii-facet-paginator>\r\n      @if (config?.facetOptions.length>10) {\r\n        <sii-facet-search [selected]=\"selectedFacets\" [options]=\"config?.facetOptions\" (optionSelected)=\"toggle($event)\"></sii-facet-search>\r\n      }\r\n    </sii-facet-skeleton>\r\n  }\r\n\r\n\r\n  <ng-template #defaultFacetTemplate let-opt>\r\n    {{opt.descr || \"##\"+opt.code}}\r\n  </ng-template>\r\n", styles: ["sii-badge{padding:1px 10px}.facet-basic{display:flex;align-items:flex-end;padding:2px 0 3px;cursor:pointer}.facet-basic:hover{background-color:#00000012}.facet-item-text{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;padding:0 8px 0 0;flex:1 1 auto;font-size:14px;line-height:20px;letter-spacing:.28px}\n"] }]
        }], ctorParameters: () => [{ type: SiiFacetService }], propDecorators: { facetTemplate: [{
                type: ContentChild,
                args: [SiiFacetTemplateDirective, { read: TemplateRef }]
            }] } });

class FacetSingleToggleComponent extends PrimitiveFacetDirective {
    set target(val) {
        this.config = { name: val, facetOptions: null };
    }
    constructor(siiFacetService) {
        super(siiFacetService);
        this.optionsInitValue = false; // valore di inizializzazione
        // --------override parent funct
        this.addSelection = (item) => {
            this.siiFacetService.facetObj[this.config.name] = true;
            this.updateFacetSelection();
        };
        // --------override parent funct
        this.removeSelection = (item) => {
            delete this.siiFacetService.facetObj[this.config.name];
            this.updateFacetSelection();
        };
        this.removeFacetSelectionFromFacetSummaryCallback = (fs) => {
            if (fs.name === this.config.name) {
                this.removeSelection(null);
            }
        };
        this.getInitSelection = () => {
            return this.siiFacetService._initFacetToSet.facets[this.config.name] || this.optionsInitValue;
        };
    }
    onToggleChange(ev) {
        // this.siiFacetService.facetObj[this.config.name]=ev.checked;
        // this.updateFacetSelection();
        ev.checked ? this.addSelection(null) : this.removeSelection(null);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: FacetSingleToggleComponent, deps: [{ token: SiiFacetService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "18.2.13", type: FacetSingleToggleComponent, isStandalone: true, selector: "sii-facet-single-toggle", inputs: { label: "label", target: "target" }, usesInheritance: true, ngImport: i0, template: "<mat-slide-toggle [checked]=\"selectedFacets==true\"  (change)=\"onToggleChange($event)\" [labelPosition]=\"'before'\">{{label}}</mat-slide-toggle>\r\n", styles: [":host{display:block}\n"], dependencies: [{ kind: "component", type: MatSlideToggle, selector: "mat-slide-toggle", inputs: ["name", "id", "labelPosition", "aria-label", "aria-labelledby", "aria-describedby", "required", "color", "disabled", "disableRipple", "tabIndex", "checked", "hideIcon", "disabledInteractive"], outputs: ["change", "toggleChange"], exportAs: ["matSlideToggle"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: FacetSingleToggleComponent, decorators: [{
            type: Component,
            args: [{ selector: 'sii-facet-single-toggle', standalone: true, imports: [MatSlideToggle], template: "<mat-slide-toggle [checked]=\"selectedFacets==true\"  (change)=\"onToggleChange($event)\" [labelPosition]=\"'before'\">{{label}}</mat-slide-toggle>\r\n", styles: [":host{display:block}\n"] }]
        }], ctorParameters: () => [{ type: SiiFacetService }], propDecorators: { label: [{
                type: Input
            }], target: [{
                type: Input
            }] } });

class SiiFilterDirective extends PrimitiveFacetDirective {
    set siiFilter(val) {
        this.config = { name: val, facetOptions: null };
    }
    get multiple() {
        return this.privMmultiple;
    }
    set multiple(value) {
        this.privMmultiple = coerceBooleanProperty(value);
    }
    constructor(el, siiFacetService, siiDatePipe, matInput, matSelect, matSlideToggle, matRadioGroup, matDatepicker, lookupEmployee, matAutocomplete, yearMonthInput) {
        super(siiFacetService);
        this.el = el;
        this.siiDatePipe = siiDatePipe;
        this.matInput = matInput;
        this.matSelect = matSelect;
        this.matSlideToggle = matSlideToggle;
        this.matRadioGroup = matRadioGroup;
        this.matDatepicker = matDatepicker;
        this.lookupEmployee = lookupEmployee;
        this.matAutocomplete = matAutocomplete;
        this.yearMonthInput = yearMonthInput;
        this.privMmultiple = false;
        this.utils = {
            firstValidValueEmitted: false,
            initialized: false
        };
        this.valueChangeSubj = new Subject();
        this.valueChange = this.valueChangeSubj.asObservable();
        this.optionsInitValue = undefined; // valore di inizializzazione
        this.checkType();
        switch (this.type) {
            case 'INPUT':
                this.el.nativeElement.addEventListener('input', () => {
                    // console.log('input ValueChange');
                    this.valueChangeSubj.next(this.getOrDefault(this.el.nativeElement.value));
                });
                break;
            case 'SELECT':
                this.optionsInitValue = this.matSelect.multiple ? [] : undefined;
                this.matSelect.selectionChange.subscribe((ev) => {
                    // console.log('mat select selectionChange');
                    if (this.matSelect.multiple) {
                        const splittedValues = ev.source.triggerValue.split(',');
                        const selVAl = [];
                        for (let i = 0; i < ev.value.length; i++) {
                            selVAl.push({ code: ev.value[i], count: 1, descr: splittedValues[i] });
                        }
                        this.valueChangeSubj.next(this.getOrDefault(selVAl));
                    }
                    else {
                        this.valueChangeSubj.next(this.getOrDefault({ code: ev.value, count: 1, descr: ev.source.triggerValue }));
                    }
                });
                break;
            case 'TOGGLE':
                this.matSlideToggle.change.subscribe((ev) => {
                    // console.log('mat-slide ValueChange');
                    this.valueChangeSubj.next(this.getOrDefault(ev.checked));
                });
                break;
            case 'RADIO':
                this.matRadioGroup.change.subscribe((ev) => {
                    // console.log('mat-radio ValueChange');
                    this.valueChangeSubj.next(this.getOrDefault(ev.value));
                });
                break;
            case 'DATEPICKER':
                this.matDatepicker.dateChange.subscribe((ev) => {
                    // console.log('mat-datepicker ValueChange');
                    this.valueChangeSubj.next(ev.value != null ? this.getOrDefault(ev.value) : null);
                    // this.valueChangeSubj.next(ev.value)
                });
                break;
            case 'LOOKUP_EMPLOYEE':
                this.lookupEmployee.valueChange.subscribe((val) => {
                    // console.log('LOOKUP_EMPLOYEE ValueChange');
                    if (this.multiple) {
                        if (val != null) {
                            const v = this.getOrDefault(val, { code: val.workerId, count: 1, descr: val.surname + ' ' + val.name });
                            const itemIndex = (this.facetSelection || []).findIndex(i => i.code === v.code);
                            if (itemIndex === -1) {
                                this.valueChangeSubj.next((this.facetSelection || []).concat(v));
                            }
                            // clearValue
                            this.lookupEmployee.writeValue(null);
                        }
                    }
                    else {
                        const v = val != null ? this.getOrDefault(val, { code: val.workerId, count: 1, descr: val.surname + ' ' + val.name }) : null;
                        this.valueChangeSubj.next(v);
                    }
                });
                break;
            case 'AUTOCOMPLETE':
                this.optionsInitValue = this.multiple ? [] : undefined;
                this.matAutocomplete.optionSelected.subscribe((ev) => {
                    if (this.multiple) {
                        if (ev.option.value != null) {
                            const val = this.getOrDefault(ev.option.value);
                            const itemIndex = (this.facetSelection || []).findIndex(i => i.code === val.code);
                            if (itemIndex === -1) {
                                this.valueChangeSubj.next((this.facetSelection || []).concat(val));
                            }
                            this.clearAutocomplete();
                        }
                    }
                    else {
                        this.valueChangeSubj.next(ev.option.value != null ? this.getOrDefault(ev.option.value) : null);
                    }
                });
                break;
            case 'YEAR_MONTH':
                this.yearMonthInput.valueChange.subscribe((val) => {
                    const invalidValue = val == null || val.year == null || val.month == null || val.year === '' || val.month === '';
                    if (!invalidValue || this.utils.firstValidValueEmitted) {
                        this.utils.firstValidValueEmitted = true;
                        if (invalidValue) {
                            this.valueChangeSubj.next(null);
                        }
                        else {
                            this.valueChangeSubj.next(this.getOrDefault(val, { code: val, count: 1, descr: val.year + '/' + val.month }));
                        }
                    }
                });
                break;
        }
        this.valueChange.pipe(
        // distinctUntilChanged(),
        debounceTime(500))
            .subscribe((val) => {
            if (val instanceof Array) {
                this.facetSelection = val.map((v) => {
                    if (this.instanceOfSiiFacetOptionDto(v)) {
                        return v;
                    }
                    else {
                        return { code: v, count: 1, descr: v };
                    }
                });
            }
            else if (typeof val === 'string') {
                if (val.trim().length === 0) {
                    this.facetSelection = undefined;
                }
                else {
                    this.facetSelection = val;
                }
            }
            else if (typeof val === 'boolean') {
                if (val) {
                    this.facetSelection = val;
                }
                else {
                    this.facetSelection = undefined;
                }
            }
            else if (val instanceof Date) {
                // this.facetSelection = val;
                this.facetSelection = { code: val, count: 1, descr: this.siiDatePipe.transform(val) };
            }
            else {
                this.facetSelection = val;
            }
            // uso this.utils.initialized per evitare di eseguire 2 volte la request
            this.updateFacetSelection(this.utils.initialized);
            this.utils.initialized = true;
        });
        this.ngAfterViewInitCallback = () => {
            if (this.type === 'AUTOCOMPLETE' && this.valueTransform === undefined) {
                throw new Error(`SiiFilter :element AUTOCOMPLETE needs the declaration of [valueTransform] `);
            }
            if (this.type === 'AUTOCOMPLETE' && this.siiFilterInpuRef === undefined) {
                throw new Error(`SiiFilter :element AUTOCOMPLETE needs the declaration of [siiFilterInpuRef] `);
            }
            const initSelVal = this.getInitSelection();
            if (initSelVal !== undefined) {
                this.setValue(initSelVal);
                setTimeout(() => {
                    this.utils.initialized = true;
                }, 800);
            }
            else {
                this.utils.initialized = true;
            }
        };
        // --------override parent funct
        this.addSelection = () => {
            // this.facetSelection=item.code;
            // this.updateFacetSelection();
            // console.log('####################### siifilter addSelection ');
        };
        // --------override parent funct
        this.removeSelection = (item, propagate = true) => {
            switch (this.type) {
                case 'INPUT':
                    this.matInput.value = '';
                    this.facetSelection = undefined;
                    break;
                case 'SELECT':
                    if (this.matSelect.multiple) {
                        const i = this.matSelect.value.findIndex((e) => e === item.code);
                        if (i !== -1) {
                            this.matSelect.writeValue(this.matSelect.value.filter((item, index) => index !== i));
                            const splittedValues = this.matSelect.triggerValue.split(',');
                            const selVAl = [];
                            for (let i = 0; i < this.matSelect.value.length; i++) {
                                selVAl.push({ code: this.matSelect.value[i], count: 1, descr: splittedValues[i] });
                            }
                            this.facetSelection = selVAl;
                        }
                    }
                    else {
                        this.matSelect.value = this.optionsInitValue;
                        this.facetSelection = this.optionsInitValue;
                    }
                    break;
                case 'TOGGLE':
                    this.matSlideToggle.toggle();
                    this.facetSelection = this.matSlideToggle.checked ? true : undefined;
                    break;
                case 'RADIO':
                    this.matRadioGroup.value = undefined;
                    this.facetSelection = undefined;
                    break;
                case 'DATEPICKER':
                    this.matDatepicker.value = undefined;
                    this.facetSelection = undefined;
                    break;
                case 'YEAR_MONTH':
                    this.yearMonthInput.writeValue(null);
                    this.facetSelection = undefined;
                    break;
                case 'LOOKUP_EMPLOYEE':
                    this.lookupEmployee.writeValue(null);
                    if (this.multiple) {
                        const leItemIndex = this.facetSelection.findIndex(i => i.code === item.code);
                        if (leItemIndex !== -1) {
                            this.facetSelection.splice(leItemIndex, 1);
                        }
                    }
                    else {
                        this.facetSelection = undefined;
                    }
                    break;
                case 'AUTOCOMPLETE':
                    this.clearAutocomplete();
                    if (this.multiple) {
                        const ACitemIndex = this.facetSelection.findIndex(i => i.code === item.code);
                        if (ACitemIndex !== -1) {
                            this.facetSelection.splice(ACitemIndex, 1);
                        }
                    }
                    else {
                        this.facetSelection = undefined;
                    }
                    break;
            }
            if (propagate) {
                this.updateFacetSelection();
            }
        };
        // --------override parent funct
        this.removeAllSelections = () => {
            if (this.facetSelection !== undefined) {
                if (this.facetSelection !== undefined && this.facetSelection instanceof Array) {
                    [...this.facetSelection].forEach(f => this.removeSelection(f, false));
                }
                else {
                    this.removeSelection(this.facetSelection, false);
                }
                this.updateFacetSelection(false);
            }
        };
        this.removeFacetSelectionFromFacetSummaryCallback = (fs) => {
            if (fs.name === this.config.name) {
                fs.facetOptions.forEach(f => this.removeSelection(f));
            }
        };
        this.getInitSelection = () => {
            return this.siiFacetService._initFacetToSet.facets[this.config.name] || this.optionsInitValue;
        };
        this.changeFacets = (facets) => {
            this.setValue(facets);
        };
    }
    multiMatSelectValueExtraction(initSelVal) {
        const splittedValues = this.matSelect.triggerValue.split(',');
        const selVAl = [];
        for (let i = 0; i < initSelVal.length; i++) {
            selVAl.push({ code: initSelVal[i], count: 1, descr: splittedValues[i] });
        }
        return this.getOrDefault(selVAl);
    }
    ngOnDestroy() {
        this.valueChangeSubj.unsubscribe();
    }
    getOrDefault(value, defaultVal) {
        if (this.valueTransform !== undefined) {
            return this.valueTransform(value);
        }
        else {
            return defaultVal !== undefined ? defaultVal : value;
        }
    }
    clearAutocomplete() {
        this.siiFilterInpuRef.value = '';
        this.siiFilterInpuRef.dispatchEvent(new Event('input')); // this is to update the list of autcomplete
        // const t = new MatOption(null, null, this.matAutocomplete, null);
        // t.value = null;
        // const event = new MatAutocompleteSelectedEvent(this.matAutocomplete, t);
        // this.matAutocomplete.optionSelected.emit(event);
    }
    checkType() {
        if (this.matInput) {
            if (this.matDatepicker) {
                // this because datapicker works in matInput
                this.type = 'DATEPICKER';
            }
            else {
                this.type = 'INPUT';
            }
        }
        else if (this.matSelect) {
            this.type = 'SELECT';
        }
        else if (this.matSlideToggle) {
            this.type = 'TOGGLE';
        }
        else if (this.matRadioGroup) {
            this.type = 'RADIO';
        }
        else if (this.lookupEmployee) {
            this.type = 'LOOKUP_EMPLOYEE';
        }
        else if (this.matAutocomplete) {
            this.type = 'AUTOCOMPLETE';
        }
        else if (this.yearMonthInput) {
            this.type = 'YEAR_MONTH';
        }
        if (this.type === undefined) {
            throw new Error(`SiiFilter elemento ${this.el.nativeElement.localName} non gestito`);
        }
    }
    setValue(initSelVal) {
        switch (this.type) {
            case 'INPUT':
                this.matInput.value = initSelVal;
                this.valueChangeSubj.next(this.getOrDefault(initSelVal));
                break;
            case 'SELECT':
                if (this.matSelect.multiple) {
                    this.matSelect.writeValue(initSelVal);
                    if (this.matSelect.triggerValue === '') {
                        // if the options values are not just loaded
                        this.valueChangeSubj.next(initSelVal);
                        const vcs = this.matSelect.options.changes.subscribe(() => {
                            vcs.unsubscribe();
                            Promise.resolve().then(() => {
                                const splittedValues = this.matSelect.triggerValue.split(',');
                                const selMap = {};
                                for (let i = 0; i < initSelVal.length; i++) {
                                    selMap[initSelVal[i]] = splittedValues[i];
                                }
                                this.facetSelection.forEach((i => i.descr = selMap[i.code]));
                            });
                        });
                    }
                    else {
                        const splittedValues = this.matSelect.triggerValue.split(',');
                        const selVAl = [];
                        for (let i = 0; i < initSelVal.length; i++) {
                            selVAl.push({ code: initSelVal[i], count: 1, descr: splittedValues[i] });
                        }
                        this.valueChangeSubj.next(this.getOrDefault(selVAl));
                    }
                }
                else {
                    this.matSelect.value = initSelVal;
                    setTimeout(() => {
                        this.valueChangeSubj.next(this.getOrDefault({ code: initSelVal, count: 1, descr: this.matSelect.triggerValue }));
                    }, 500);
                }
                // this.valueChangeSubj.next(this.getOrDefault(initSelVal));
                break;
            case 'TOGGLE':
                this.matSlideToggle.checked = initSelVal;
                // this.valueChangeSubj.next(this.getOrDefault(initSelVal));
                break;
            case 'RADIO':
                this.matRadioGroup.value = initSelVal;
                this.valueChangeSubj.next(this.getOrDefault(initSelVal));
                break;
            case 'DATEPICKER':
                if (initSelVal != null) {
                    initSelVal = new Date(initSelVal);
                    if (isNaN(initSelVal)) {
                        initSelVal = null;
                    }
                }
                this.matDatepicker.value = initSelVal;
                this.valueChangeSubj.next(initSelVal != null ? this.getOrDefault(initSelVal) : null);
                break;
            case 'LOOKUP_EMPLOYEE':
                if (this.multiple) {
                    if (initSelVal != null) {
                        if (initSelVal instanceof Array) {
                            // tslint:disable-next-line:max-line-length
                            this.valueChangeSubj.next(initSelVal.map(i => this.getOrDefault(i, { code: i.workerId, count: 1, descr: i.surname + ' ' + i.name })));
                        }
                        else {
                            // tslint:disable-next-line:max-line-length
                            this.valueChangeSubj.next([this.getOrDefault(initSelVal, { code: initSelVal.workerId, count: 1, descr: initSelVal.surname + ' ' + initSelVal.name })]);
                        }
                    }
                }
                else {
                    this.lookupEmployee.writeValue(initSelVal);
                    const v = initSelVal != null ? this.getOrDefault(initSelVal, { code: initSelVal.workerId, count: 1, descr: initSelVal.surname + ' ' + initSelVal.name }) : null;
                    this.valueChangeSubj.next(v);
                }
                break;
            case 'AUTOCOMPLETE':
                this.siiFilterInpuRef.value = this.matAutocomplete.displayWith(initSelVal);
                // this.matAutocomplete.optionSelected.emit(initSelVal);
                const t = new MatOption(null, null, this.matAutocomplete, null);
                t.value = initSelVal;
                const event = new MatAutocompleteSelectedEvent(this.matAutocomplete, t);
                if (this.multiple) {
                    if (initSelVal != null) {
                        if (initSelVal instanceof Array) {
                            this.valueChangeSubj.next(initSelVal.map(i => this.getOrDefault(i)));
                        }
                        else {
                            this.valueChangeSubj.next([this.getOrDefault(initSelVal)]);
                        }
                        this.clearAutocomplete();
                    }
                }
                else {
                    this.matAutocomplete.optionSelected.emit(event);
                    this.valueChangeSubj.next(this.getOrDefault(initSelVal));
                }
                break;
            case 'YEAR_MONTH':
                this.yearMonthInput.writeValue(initSelVal);
                // tslint:disable-next-line:max-line-length
                const vym = initSelVal != null ? this.getOrDefault(initSelVal, { code: initSelVal, count: 1, descr: initSelVal.year + '/' + initSelVal.month }) : null;
                this.valueChangeSubj.next(vym);
                break;
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: SiiFilterDirective, deps: [{ token: i0.ElementRef }, { token: SiiFacetService }, { token: SiiDatePipe }, { token: i3$1.MatInput, host: true, optional: true }, { token: i4$1.MatSelect, host: true, optional: true }, { token: i5.MatSlideToggle, host: true, optional: true }, { token: i6.MatRadioGroup, host: true, optional: true }, { token: i7.MatDatepickerInput, host: true, optional: true }, { token: LookupEmployeeComponent, host: true, optional: true }, { token: i9.MatAutocomplete, host: true, optional: true }, { token: YearMonthInputComponent, host: true, optional: true }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "18.2.13", type: SiiFilterDirective, isStandalone: true, selector: "[siiFilter]", inputs: { siiFilter: "siiFilter", valueTransform: "valueTransform", siiFilterInpuRef: "siiFilterInpuRef", multiple: "multiple" }, providers: [SiiDatePipe], usesInheritance: true, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: SiiFilterDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[siiFilter]',
                    providers: [SiiDatePipe],
                    standalone: true,
                }]
        }], ctorParameters: () => [{ type: i0.ElementRef }, { type: SiiFacetService }, { type: SiiDatePipe }, { type: i3$1.MatInput, decorators: [{
                    type: Host
                }, {
                    type: Optional
                }] }, { type: i4$1.MatSelect, decorators: [{
                    type: Host
                }, {
                    type: Optional
                }] }, { type: i5.MatSlideToggle, decorators: [{
                    type: Host
                }, {
                    type: Optional
                }] }, { type: i6.MatRadioGroup, decorators: [{
                    type: Host
                }, {
                    type: Optional
                }] }, { type: i7.MatDatepickerInput, decorators: [{
                    type: Host
                }, {
                    type: Optional
                }] }, { type: LookupEmployeeComponent, decorators: [{
                    type: Host
                }, {
                    type: Optional
                }] }, { type: i9.MatAutocomplete, decorators: [{
                    type: Host
                }, {
                    type: Optional
                }] }, { type: YearMonthInputComponent, decorators: [{
                    type: Host
                }, {
                    type: Optional
                }] }], propDecorators: { siiFilter: [{
                type: Input
            }], valueTransform: [{
                type: Input
            }], siiFilterInpuRef: [{
                type: Input
            }], multiple: [{
                type: Input
            }] } });

class SiiFiltersModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: SiiFiltersModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "18.2.13", ngImport: i0, type: SiiFiltersModule, imports: [FacetsContainerComponent,
            FacetCheckboxComponent,
            FacetSkeletonComponent,
            FacetComponent,
            // FacetPaginatorComponent,
            // FacetSearchComponent,
            FacetSingleToggleComponent,
            FacetToolbarSearchComponent,
            SiiFilterDirective], exports: [FacetsContainerComponent,
            FacetCheckboxComponent,
            FacetSkeletonComponent,
            FacetComponent,
            // FacetPaginatorComponent,
            // FacetSearchComponent,
            FacetSingleToggleComponent,
            FacetToolbarSearchComponent,
            SiiFilterDirective] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: SiiFiltersModule, imports: [FacetsContainerComponent,
            FacetCheckboxComponent,
            FacetSkeletonComponent,
            FacetComponent,
            // FacetPaginatorComponent,
            // FacetSearchComponent,
            FacetSingleToggleComponent,
            FacetToolbarSearchComponent] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: SiiFiltersModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [],
                    imports: [
                        FacetsContainerComponent,
                        FacetCheckboxComponent,
                        FacetSkeletonComponent,
                        FacetComponent,
                        // FacetPaginatorComponent,
                        // FacetSearchComponent,
                        FacetSingleToggleComponent,
                        FacetToolbarSearchComponent,
                        SiiFilterDirective
                    ],
                    exports: [
                        FacetsContainerComponent,
                        FacetCheckboxComponent,
                        FacetSkeletonComponent,
                        FacetComponent,
                        // FacetPaginatorComponent,
                        // FacetSearchComponent,
                        FacetSingleToggleComponent,
                        FacetToolbarSearchComponent,
                        SiiFilterDirective
                    ]
                }]
        }] });

// export const ENGAGE_CONFIG = new InjectionToken<BehaviorSubject<EngageConfigDTO>>('toolkit.engageConfig');
class SiiToolkitComponentsModule {
    constructor() {
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: SiiToolkitComponentsModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "18.2.13", ngImport: i0, type: SiiToolkitComponentsModule, imports: [FormsModule,
            CommonModule,
            ReactiveFormsModule,
            ImageCropperModule,
            SiiPageContainerModule,
            SiiListModule,
            SiiFiltersModule,
            RouterModule, ProfileButtonComponent,
            WaitComponent,
            ErrorDisplayDialogComponent,
            SiiOutComponent,
            PageHoverMaskComponent,
            MenuComponent,
            SnackbarFeedbackComponent,
            BannerFeedbackComponent,
            BannerFeedbackOutletComponent,
            SnackbarFeedbackOutletComponent,
            WorkerIconComponent,
            BadgeComponent,
            LookupWorkOrderComponent,
            LookupOdaPosComponent,
            SearchWorkOrderDialogComponent,
            SearchOdaPosDialogComponent,
            LookupEmployeeComponent,
            GlobalSearchComponent,
            GroupListToolbarComponent,
            GlobalMenuComponent,
            GlobalMenuFilterPipe,
            GlobalMenuVoicesFilterPipe,
            SiiCompanySelectionComponent,
            CompanySelectionDialogComponent,
            FakeListItemDirective,
            DelegationDialogComponent,
            UploadComponent,
            PictDialogComponent,
            NotarizationComponent,
            NotarizationResponseDialogComponent,
            SiiDatePipe,
            DateHintDirective,
            WorkerContactInformationComponent,
            YearMonthInputComponent,
            CropImageDialogComponent,
            FilePreviewDialogComponent,
            DialogNoIEComponent,
            PageFooterDirective,
            AutoHideRowDirective,
            SiiMemoryPipe,
            SiiFacetTemplateDirective,
            BreadcrumbComponent], exports: [ProfileButtonComponent,
            WaitComponent,
            ErrorDisplayDialogComponent,
            SiiOutComponent,
            SiiPageContainerModule,
            SiiListModule,
            SiiFiltersModule,
            PageHoverMaskComponent,
            MenuComponent,
            SnackbarFeedbackComponent,
            BannerFeedbackComponent,
            WorkerIconComponent,
            BadgeComponent,
            LookupWorkOrderComponent,
            LookupOdaPosComponent,
            LookupEmployeeComponent,
            GroupListToolbarComponent,
            GlobalMenuComponent,
            GlobalSearchComponent,
            UploadComponent,
            NotarizationComponent,
            SiiDatePipe,
            DateHintDirective,
            WorkerContactInformationComponent,
            YearMonthInputComponent,
            PageFooterDirective,
            AutoHideRowDirective,
            SiiFacetTemplateDirective,
            BreadcrumbComponent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: SiiToolkitComponentsModule, imports: [FormsModule,
            CommonModule,
            ReactiveFormsModule,
            ImageCropperModule,
            SiiPageContainerModule,
            SiiListModule,
            SiiFiltersModule,
            RouterModule, ProfileButtonComponent,
            WaitComponent,
            ErrorDisplayDialogComponent,
            MenuComponent,
            SnackbarFeedbackComponent,
            BannerFeedbackComponent,
            WorkerIconComponent,
            LookupWorkOrderComponent,
            LookupOdaPosComponent,
            SearchWorkOrderDialogComponent,
            SearchOdaPosDialogComponent,
            LookupEmployeeComponent,
            GlobalSearchComponent,
            GroupListToolbarComponent,
            GlobalMenuComponent,
            SiiCompanySelectionComponent,
            CompanySelectionDialogComponent,
            DelegationDialogComponent,
            UploadComponent,
            PictDialogComponent,
            NotarizationComponent,
            NotarizationResponseDialogComponent,
            WorkerContactInformationComponent,
            YearMonthInputComponent,
            CropImageDialogComponent,
            FilePreviewDialogComponent,
            BreadcrumbComponent, SiiPageContainerModule,
            SiiListModule,
            SiiFiltersModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: SiiToolkitComponentsModule, decorators: [{
            type: NgModule,
            args: [{
                    exports: [
                        ProfileButtonComponent,
                        WaitComponent,
                        ErrorDisplayDialogComponent,
                        SiiOutComponent,
                        SiiPageContainerModule,
                        SiiListModule,
                        SiiFiltersModule,
                        PageHoverMaskComponent,
                        MenuComponent,
                        SnackbarFeedbackComponent,
                        BannerFeedbackComponent,
                        WorkerIconComponent,
                        BadgeComponent,
                        LookupWorkOrderComponent,
                        LookupOdaPosComponent,
                        LookupEmployeeComponent,
                        GroupListToolbarComponent,
                        GlobalMenuComponent,
                        GlobalSearchComponent,
                        UploadComponent,
                        NotarizationComponent,
                        SiiDatePipe,
                        DateHintDirective,
                        WorkerContactInformationComponent,
                        YearMonthInputComponent,
                        PageFooterDirective,
                        AutoHideRowDirective,
                        SiiFacetTemplateDirective,
                        BreadcrumbComponent,
                    ],
                    imports: [
                        FormsModule,
                        CommonModule,
                        ReactiveFormsModule,
                        ImageCropperModule,
                        SiiPageContainerModule,
                        SiiListModule,
                        SiiFiltersModule,
                        RouterModule, ProfileButtonComponent,
                        WaitComponent,
                        ErrorDisplayDialogComponent,
                        SiiOutComponent,
                        PageHoverMaskComponent,
                        MenuComponent,
                        SnackbarFeedbackComponent,
                        BannerFeedbackComponent,
                        BannerFeedbackOutletComponent,
                        SnackbarFeedbackOutletComponent,
                        WorkerIconComponent,
                        BadgeComponent,
                        LookupWorkOrderComponent,
                        LookupOdaPosComponent,
                        SearchWorkOrderDialogComponent,
                        SearchOdaPosDialogComponent,
                        LookupEmployeeComponent,
                        GlobalSearchComponent,
                        GroupListToolbarComponent,
                        GlobalMenuComponent,
                        GlobalMenuFilterPipe,
                        GlobalMenuVoicesFilterPipe,
                        SiiCompanySelectionComponent,
                        CompanySelectionDialogComponent,
                        FakeListItemDirective,
                        DelegationDialogComponent,
                        UploadComponent,
                        PictDialogComponent,
                        NotarizationComponent,
                        NotarizationResponseDialogComponent,
                        SiiDatePipe,
                        DateHintDirective,
                        WorkerContactInformationComponent,
                        YearMonthInputComponent,
                        CropImageDialogComponent,
                        FilePreviewDialogComponent,
                        DialogNoIEComponent,
                        PageFooterDirective,
                        AutoHideRowDirective,
                        SiiMemoryPipe,
                        SiiFacetTemplateDirective,
                        BreadcrumbComponent
                    ]
                }]
        }], ctorParameters: () => [] });

// import { ENGAGE_CONFIG } from './engage-configurations-params.service';
class DotCmsInterceptorService {
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: DotCmsInterceptorService, deps: [{ token: i4.Router }, { token: SII_ENVIRONMENT }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: DotCmsInterceptorService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: DotCmsInterceptorService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: () => [{ type: i4.Router }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [SII_ENVIRONMENT]
                }] }] });

class SiiFeedbackService {
    constructor(snackBar, dialog) {
        this.snackBar = snackBar;
        this.dialog = dialog;
    }
    showSuccessFeedback(templateRef, config) {
        return this.showFeedback('sii-success-feedback', templateRef, config);
    }
    showErrorFeedback(templateRef, config) {
        return this.showFeedback('sii-error-feedback', templateRef, config);
    }
    showInfoFeedback(templateRef, config) {
        return this.showFeedback('sii-info-feedback', templateRef, config);
    }
    showSuccessToastFeedback(templateRef, config) {
        return this.showToastFeedback('sii-success-feedback', templateRef, config);
    }
    showErrorToastFeedback(templateRef, config) {
        return this.showToastFeedback('sii-error-feedback', templateRef, config);
    }
    showInfoToastFeedback(templateRef, config) {
        return this.showToastFeedback('sii-info-feedback', templateRef, config);
    }
    showSuccessBanner(templateRef, config) {
        return this.showFeedbackBanner('sii-success-feedback-banner', templateRef, config);
    }
    showErrorBanner(templateRef, config) {
        return this.showFeedbackBanner('sii-error-feedback-banner', templateRef, config);
    }
    showInfoBanner(templateRef, config) {
        return this.showFeedbackBanner('sii-info-feedback-banner', templateRef, config);
    }
    showFeedback(panelClass, templateRef, config) {
        const data = config || {};
        data.panelClass = [panelClass, 'sii-full-snackbar'];
        data.data = config?.data || {};
        data.data.templateRef = templateRef;
        if (data.duration === undefined) {
            data.duration = 2000;
        }
        return this.snackBar.openFromComponent(SnackbarFeedbackOutletComponent, data);
    }
    showToastFeedback(panelClass, templateRef, config) {
        const data = config || {};
        data.panelClass = [panelClass, 'sii-snackbar-feedback-toast'];
        data.data = config?.data || {};
        data.data.templateRef = templateRef;
        //  data.data.duration= 2000;
        if (data.duration === undefined) {
            data.duration = 2000;
        }
        return this.snackBar.openFromComponent(SnackbarFeedbackOutletComponent, data);
    }
    showFeedbackBanner(panelClass, templateRef, config) {
        const data = config || {};
        data.panelClass = [panelClass, 'sii-feedback-banner'];
        data.data = config?.data || {};
        data.data.templateRef = templateRef;
        data.width = '900px';
        data.maxWidth = '100vw';
        if (templateRef instanceof TemplateRef) {
            return this.dialog.open(BannerFeedbackOutletComponent, config);
        }
        else {
            return this.dialog.open(templateRef, config);
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: SiiFeedbackService, deps: [{ token: i1$7.MatSnackBar }, { token: i1$2.MatDialog }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: SiiFeedbackService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: SiiFeedbackService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: () => [{ type: i1$7.MatSnackBar }, { type: i1$2.MatDialog }] });

class SiiNotarizationService {
    constructor(dialog, siiToolkitService, feedbackService) {
        this.dialog = dialog;
        this.siiToolkitService = siiToolkitService;
        this.feedbackService = feedbackService;
    }
    notarize(notarizationComponent, notarizationRestService, notarizationPrintReceiptUrl, config) {
        const subscrRet = new Subject();
        const data = config || {};
        data.data = config?.data || {};
        data.width = data.width || '900px';
        data.maxWidth = data.maxWidth || '100vw';
        this.dialog.open(notarizationComponent, data)
            .afterClosed()
            .subscribe((resp) => {
            if (resp) {
                notarizationRestService
                    .subscribe((notarizResp) => {
                    if (!!notarizResp) {
                        this.showNotarizationResponse(notarizResp, notarizationPrintReceiptUrl).afterClosed().subscribe(() => {
                            subscrRet.next(notarizResp);
                        });
                    }
                    else {
                        subscrRet.next(null);
                    }
                });
            }
            else {
                subscrRet.next(null);
            }
        });
        return subscrRet;
    }
    showNotarizationResponse(notarizResp, notarizationPrintReceiptUrl) {
        if (notarizResp.status === 'DONE') {
            return this.feedbackService.showSuccessBanner(NotarizationResponseDialogComponent, { data: { notarizResp, notarizationPrintReceiptUrl } });
        }
        else {
            return this.feedbackService.showInfoBanner(NotarizationResponseDialogComponent, { data: { notarizResp, notarizationPrintReceiptUrl } });
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: SiiNotarizationService, deps: [{ token: i1$2.MatDialog }, { token: SiiToolkitService }, { token: SiiFeedbackService }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: SiiNotarizationService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: SiiNotarizationService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: () => [{ type: i1$2.MatDialog }, { type: SiiToolkitService }, { type: SiiFeedbackService }] });

class SiiPingService {
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: SiiPingService, deps: [{ token: i1.HttpClient }, { token: SiiWaitService }, { token: SiiToolkitService }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: SiiPingService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: SiiPingService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: () => [{ type: i1.HttpClient }, { type: SiiWaitService }, { type: SiiToolkitService }] });

// Il gestore delle popup. Le popup create saranno modali
const PopupManager = window.PopupManager = {
    popupStack: null,
    // Crea una nuova popup e la pone in cima allo stack
    // L'eventuale popup precedentemente attiva viene freezata
    //
    //  urlContenuto l'url da aprire nella finestra
    //  callerReturnFunction vedi sotto
    //  innerWidth   la larghezza utile della finestra
    //  innerHeight  l'altezza utile della finestra
    //  reloadOnClose indica che la popup causa il reload della sottostante qualora venga chiusa
    // callerReturnFunction e' una opzionale funzione javascript della popup
    // chiamante che riceve l'eventuale oggetto che la popup chiamata invia alla chiusura
    // tramite una chiamata tipo parent.PopupManager.getLastPopup().returnToCaller(valore)
    // oppure tramite parent.PopupManager.closeLastPopup() nel qualcaso non viene restituito
    // nulla
    addPopupSdac(url, newPage) {
        if (newPage) {
            const win = window.open(url, '_blank', `target=_blank,width=400,height=400,resizable=0,scrollbars=1,status=1,toolbar=0,menubar=0`);
            var pollTimer = window.setInterval(function () {
                if (win?.closed !== false) { // !== is required for compatibility with Opera
                    window.clearInterval(pollTimer);
                    document.getElementById('btnReload')?.click();
                }
            }, 1000);
        }
        else {
            const w = 950;
            const h = 525;
            this.addPopup(url, () => { document.getElementById('btnReload')?.click(); }, w, h);
        }
    },
    addPopup(urlContenuto, callerReturnFunction, innerWidth, innerHeight, reloadOnClose) {
        if (!reloadOnClose || reloadOnClose === null) {
            reloadOnClose = false;
        }
        if (this.popupStack == null) {
            this.popupStack = new Array();
        }
        if (this.popupStack.length > 0) {
            this.popupStack[this.popupStack.length - 1].freeze();
        }
        const popup = new Popup(this.popupStack.length);
        popup.setInnerHeight(innerHeight);
        popup.setInnerWidth(innerWidth);
        popup.setSpostabile(true);
        // Forzo l'esclusione dalla cache.Serve per un bug di ie (clem)
        if (urlContenuto.indexOf('?') === -1) {
            urlContenuto += '?';
        }
        else {
            urlContenuto += '&';
        }
        urlContenuto += 'iernd=' + Math.random();
        popup.setContenuto(urlContenuto);
        popup.show();
        popup.setReloadOnClose(reloadOnClose);
        popup.setCallerReturnFunction(callerReturnFunction);
        this.popupStack.push(popup);
    },
    getLastPopup() {
        if (this.popupStack == null || this.popupStack.length === 0) {
            return null;
        }
        return this.popupStack[(this.popupStack).length - 1];
    },
    // Chiude l'ultima popup in cima allo stasck e 'scongela' l'eventuale penultima
    // La chiusura dell'ultima popup causa la chiusura della finestra.
    // oggetto e' un eventiale valore da restiotuire alla popup scongelata nel caso
    // che l'utente creandola abbia specificato l'opzione callerReturnFunction
    // reload           se true opera il reload prenotato dal chiamante, qualora sia stato specificato
    //                 per default e' true
    //                 se false non fa in nessun caso il reload
    closeLastPopup(oggetto, reload) {
        if (reload !== false) {
            reload = true;
        }
        /*if (this.popupStack == null || this.popupStack.length <= 1) {
          // alert(this.popupStack);
          setTimeout( function (){
          if (reload) {
          // Reload per sdac
            // PopupManager.reloadOpener();
          }
          // window.opener='x';//Workaround per evitare messaggio di chiusura
            try{window.close();} catch(e) {}
          },100);
        return;
        }*/
        const popup = this.popupStack.pop();
        const reloadOnClose = popup.getReloadOnClose();
        const callerReturnFunction = popup.callerReturnFunction;
        let lastPopup = null;
        if (this.popupStack.length > 0) {
            lastPopup = this.popupStack[(this.popupStack).length - 1];
        }
        setTimeout(() => {
            if (callerReturnFunction && callerReturnFunction != null && callerReturnFunction !== '') {
                if (reload) {
                    callerReturnFunction(oggetto);
                }
            }
            popup.chiudi();
            // Se la popup deve essere ricaricata l'unfreeze viene posticipato all'onload della finestra
            if (reload && lastPopup && lastPopup !== null) {
                if (!reloadOnClose) {
                    lastPopup.unfreeze();
                }
                else {
                    // le ultime due condizioni sono state aggiunte per consentire che la
                    // callerReturnFunction non venga annullata dal submit del form
                    if (lastPopup.contenutoFinestra && !reload && !(callerReturnFunction === null)) {
                        if (isIE()) {
                            lastPopup.contenutoFinestra.contentWindow.window.document.forms[0].submit();
                        }
                        else {
                            lastPopup.contenutoFinestra.contentDocument.forms[0].submit();
                        }
                    }
                }
            }
            else if (!reload) {
                lastPopup.unfreeze();
            }
        }, 100);
    },
    // Interessante, restituisce l'html attualmente renderizzato della finestra:
    // obj.document.documentElement.innerHTML
    // Sfrutto la proprieta' che la popup e' la proprieta' popup di un DIV che contiene l'iframe
    // della stessa
    getEclosingPopup(obj) {
        // forse non serve cercarlo in this.PopupManager
        let enclosing = this.getLastPopup != null ? this.getLastPopup() : this.PopupManager.getLastPopup();
        let tmp = obj;
        while (tmp && tmp != null) {
            if (tmp.body) {
                const doc = tmp;
                const frm = window.frames;
                for (let i = frm.length - 1; i >= 0; i--) {
                    const iframe = frm[i];
                    if (iframe.document === doc) {
                        // Ho trovato il frame che contiene l'obj
                        enclosing = iframe.frameElement.popup;
                        break;
                    }
                }
                break;
            }
            tmp = tmp.parentNode;
        }
        return enclosing;
    },
    reloadOpener(obj) {
        // se sono mio padre (!) evto di ricaricarmi
        if (window && window.opener && window.self && window.opener === window.self) {
            return;
        }
        if (window && window.parent && window.parent.opener && window.parent.opener.frames && window.parent.opener.frames.length > 0) {
            try {
                window.parent.opener.frames[0].location.href = window.parent.opener.frames[0].location.href;
            }
            catch (e) { }
        }
        if (window && window.parent && window.parent.opener) {
            try {
                window.parent.opener.location.href = window.parent.opener.location.href;
            }
            catch (e) { }
        }
        if (window && window.opener) {
            try {
                window.opener.location.href = window.opener.location.href;
            }
            catch (e) { }
        }
    }
};
// Il class attribute della popup : modalWindow
// Il costruttore della popup
//  zIndex lo zIndex della finestra
//
//  popupDiv           il div esterno
//  bordoFinestra
//  contenutoFinestra  l'iframe con il contenuto
function Popup(id) {
    const zIndex = 1000 + (id + 1) * 2 + 5;
    this.spostabile = false;
    this.altezzaTitoloPopup = 25;
    this.freezed = false;
    /***if (window.parent) this.popupDiv =window.parent.document.createElement('div');
    else*/ this.popupDiv = window.document.createElement('div');
    this.popupDiv.style.position = 'fixed';
    this.popupDiv.style.left = 0 + 'px';
    this.popupDiv.style.top = 0 + 'px';
    this.popupDiv.style.width = 0 + 'px';
    this.popupDiv.style.height = 0 + 'px';
    this.popupDiv.style.boxShadow = '0px 0px 3px 0px #000000b5';
    this.popupDiv.style.visibility = 'hidden';
    this.popupDiv.className = 'modalWindow';
    this.popupDiv.style.zIndex = zIndex;
    this.popupDiv.style.backgroundColor = '#FFFFFF';
    this.popupDiv.style.maxWidth = '99vw';
    this.popupDiv.style.maxHeight = '99vh';
    /***if (window.parent) this.bordoFinestra = window.parent.document.createElement('div');
    else*/ this.bordoFinestra = window.document.createElement('div');
    this.bordoFinestra.id = 'popupBordo_' + zIndex;
    this.bordoFinestra.border = '0px';
    this.bordoFinestra.style.fontSize = '0px';
    this.bordoFinestra.style.margin = '0px';
    this.bordoFinestra.style.cursor = 'move';
    this.bordoFinestra.style.backgroundColor = '#090909';
    this.bordoFinestra.style.height = this.altezzaTitoloPopup + 'px';
    this.bordoFinestra.style.width = '100%';
    this.bordoFinestra.style.maxWidth = '99vw';
    this.bordoFinestra.style.maxHeight = '99vh';
    this.bordoFinestra.style.zIndex = zIndex;
    this.popupDiv.appendChild(this.bordoFinestra);
    const closeButton = window.document.createElement('span');
    closeButton.textContent = 'X';
    closeButton.style.fontSize = '15px';
    closeButton.style.position = 'absolute';
    closeButton.style.right = '5px';
    closeButton.style.cursor = 'pointer';
    closeButton.style.border = '2px solid white';
    closeButton.style.color = 'white';
    closeButton.style.borderRadius = '50%';
    closeButton.style.padding = '0px 5px';
    closeButton.style.fontWeight = 'bold';
    closeButton.style.zIndex = '' + zIndex;
    closeButton.onclick = (ev) => { ev.stopPropagation(); PopupManager.closeLastPopup(undefined); };
    this.bordoFinestra.appendChild(closeButton);
    /***if (window.parent) this.contenutoFinestra = window.parent.document.createElement('iframe');
    else*/ this.contenutoFinestra = window.document.createElement('iframe');
    // Mi assicuro che se un popup ricaricata e' l'ultima dello stack venga unfreezata
    this.contenutoFinestra.name = 'popupIFrame_' + zIndex;
    this.contenutoFinestra.id = 'popupIFrame_' + zIndex;
    this.contenutoFinestra.style.border = '0px';
    this.contenutoFinestra.style.margin = '0px';
    this.contenutoFinestra.frameBorder = 'no';
    this.contenutoFinestra.style.height = '100%';
    this.contenutoFinestra.style.width = '100%';
    this.contenutoFinestra.style.maxHeight = '99vh';
    this.contenutoFinestra.style.maxWidth = '99vw';
    this.contenutoFinestra.scrolling = 'yes';
    this.contenutoFinestra.style.zIndex = zIndex;
    this.popupDiv.appendChild(this.contenutoFinestra);
    this.pannelloGrigio = creaPannelloGrigio('popupPannelloGrigio_' + zIndex, zIndex + 1);
    this.popupDiv.appendChild(this.pannelloGrigio);
    // Aggiungo all'iframe della popup la popup stessa per consentirne la referenziazione nel DOM tramite window
    this.contenutoFinestra.popup = this;
    /***if (window.parent)window.parent.document.body.appendChild(this.popupDiv);
    else*/ window.document.body.appendChild(this.popupDiv);
}
Popup.prototype.returnToCaller = (oggetto) => {
    PopupManager.closeLastPopup(oggetto);
};
Popup.prototype.setCallerReturnFunction = function (callerReturnFunction) {
    this.callerReturnFunction = callerReturnFunction;
};
Popup.prototype.chiudi = function () {
    // window.document.body.removeChild(objDivWin);
    const _this = this;
    // const campo = (document.getElementById('campo_focus_per_bug_ie') as HTMLInputElement);
    // campo.value = campo.value + _this.popupDiv;
    // TODO:su ie la chiusura freeza la finestra sottostante
    setTimeout(() => {
        // _this.popupDiv.blur();
        // window.document.body.focus();
        // campo.focus();
        // _this.popupDiv.innerHTML='';
        // _this.popupDiv.style.display='none';
        // _this.popupDiv.style.visibility='hidden';
        /***if (window.parent) window.parent.document.body.removeChild(_this.popupDiv);
        else*/ window.document.body.removeChild(_this.popupDiv);
        // _this.popupDiv=null;
    }, 100);
};
Popup.prototype.setContenuto = function (src) {
    this.contenutoFinestra.src = src;
};
Popup.prototype.setSpostabile = function (spostabile) {
    this.spostabile = spostabile;
};
Popup.prototype.setTop = function (top) {
    this.popupDiv.style.top = top + 'px';
};
Popup.prototype.setLeft = function (left) {
    this.popupDiv.style.left = left + 'px';
};
Popup.prototype.setInnerHeight = function (innerHeight) {
    this.contenutoFinestra.style.height = innerHeight + 'px';
    this.setHeight(innerHeight + this.altezzaTitoloPopup);
};
Popup.prototype.setInnerWidth = function (innerWidth) {
    this.contenutoFinestra.style.width = innerWidth + 'px';
    this.setWidth(innerWidth);
};
Popup.prototype.setHeight = function (height) {
    this.popupDiv.style.height = height + 'px';
    this.pannelloGrigio.style.height = height + 'px';
};
Popup.prototype.setWidth = function (width) {
    this.popupDiv.style.width = width + 'px';
    this.pannelloGrigio.style.width = width + 'px';
    this.bordoFinestra.style.width = width + 'px';
};
Popup.prototype.isSpostabile = function () {
    return this.spostabile;
};
Popup.prototype.getTop = function () {
    return parseInt(this.popupDiv.style.top, 10);
};
Popup.prototype.getLeft = function () {
    return parseInt(this.popupDiv.style.left, 10);
};
Popup.prototype.getHeight = function () {
    return parseInt(this.popupDiv.style.height, 10);
};
Popup.prototype.getWidth = function () {
    return parseInt(this.popupDiv.style.width, 10);
};
Popup.prototype.unfreeze = function () {
    this.freezed = false;
    this.spostabile = true;
    this.mostraContenuto();
    this.bordoFinestra.popup = this;
    this.bordoFinestra.onmousedown = mouseDownListener;
};
Popup.prototype.freeze = function () {
    this.freezed = true;
    this.oscuraContenuto();
    this.spostabile = false;
    this.bordoFinestra.onmousedown = null;
    document.onmousemove = null;
    document.onmouseup = null;
};
// Centra ed attribuisce lo z-index corretto
Popup.prototype.show = function () {
    this.centra();
    // WinLevel(this.Id);
    if (this.spostabile) {
        // Workaround per passare l'oggetto al listener
        this.bordoFinestra.popup = this;
        this.bordoFinestra.onmousedown = mouseDownListener;
    }
    this.popupDiv.style.visibility = 'visible';
};
Popup.prototype.hide = function (width) {
    this.popupDiv.style.visibility = 'hidden';
};
Popup.prototype.centra = function () {
    try {
        const _isIE = isIE();
        // let scLeft = 0;
        // let scTop = 0;
        let fullHeight = 0;
        let fullWidth = 0;
        if (!isIE()) {
            // scLeft = pageXOffset;
            // scTop = pageYOffset;
            fullWidth = window.innerWidth - 20;
            fullHeight = window.innerHeight;
            // IE 6+ in 'standards compliant mode'
        }
        else if (document.documentElement && (document.documentElement.clientWidth || document.documentElement.clientHeight)) {
            // scLeft = document.documentElement.scrollLeft;
            // scTop = document.documentElement.scrollTop;
            fullWidth = document.documentElement.clientWidth;
            fullHeight = document.documentElement.clientHeight;
            // IE 4 compatible
        }
        else if (document.body) {
            // scLeft = document.body.scrollLeft;
            // scTop = document.body.scrollTop;
            fullWidth = document.body.clientWidth;
            fullHeight = document.body.clientHeight;
        }
        // if (scLeft < 0) {
        //   scLeft = 0;
        // }
        // if (scTop < 0) {
        //   scTop = 0;
        // }
        if (fullHeight < 200) {
            fullHeight = screen.availHeight * .8;
        }
        if (fullWidth < 200) {
            fullWidth = screen.availWidth * .9;
        }
        let winTop = (fullHeight - this.getHeight()) / 2;
        let winLeft = (fullWidth - this.getWidth()) / 2;
        if (winTop < 10) {
            winTop = 10;
        }
        if (winLeft < 0) {
            winLeft = 0;
        }
        this.setTop(winTop);
        this.setLeft(winLeft);
    }
    catch (err) { }
};
Popup.prototype.oscuraContenuto = function () {
    this.pannelloGrigio.style.visibility = 'visible';
    this.contenutoFinestra.style.visibility = 'visible';
};
Popup.prototype.nascondiContenuto = function () {
    this.contenutoFinestra.style.visibility = 'hidden';
};
Popup.prototype.mostraContenuto = function () {
    this.pannelloGrigio.style.visibility = 'hidden';
    this.contenutoFinestra.style.visibility = 'visible';
};
Popup.prototype.stopListening = function () {
    document.onmousemove = null;
    document.onmouseup = null;
    this.mostraContenuto();
};
Popup.prototype.getIFrame = function () {
    return this.contenutoFinestra;
};
Popup.prototype.isFreezed = function () {
    return this.freezed;
};
Popup.prototype.setReloadOnClose = function (reloadOnClose) {
    this.reloadOnClose = reloadOnClose;
};
Popup.prototype.getReloadOnClose = function () {
    return this.reloadOnClose;
};
// Nota: i listener non possono essere membri
function mouseDownListener(event) {
    const popup = this.popup;
    popup.nascondiContenuto();
    popup.offX = parseInt(popup.popupDiv.style.left + 0) - (isNS() ? event.clientX : event.clientX);
    popup.offY = parseInt(popup.popupDiv.style.top + 0) - (isNS() ? event.clientY : event.clientY);
    // workaround per selezione popup da parte di ie
    document.body.ondrag = function () { return false; };
    document.body.onselectstart = function () { return false; };
    document.onmouseup = function mouseUpListener(e) {
        popup.stopListening();
    };
    document.onmousemove = function mouseMoveListener(e) {
        const xPos = (isNS() ? e.clientX : event.clientX) + popup.offX;
        const yPos = (isNS() ? e.clientY : event.clientY) + popup.offY;
        if (xPos < 0 || yPos < 0) {
            popup.stopListening();
            return false;
        }
        popup.popupDiv.style.left = xPos + 'px';
        popup.popupDiv.style.top = yPos + 'px';
        return false;
    };
    return false;
}
function inviaForm(obj) {
    // Se la popup e' freezata non ne consento il submit
    // l'utente ha aperto un'altra
    const thisPopup = parent.PopupManager.PopupManager.getEclosingPopup(obj);
    if (!thisPopup.isFreezed()) {
        const pannelloGrigio = creaPannelloGrigio('tmp', 99);
        pannelloGrigio.style.visibility = 'visible';
        pannelloGrigio.style.height = getHeight(document.body) + 'px';
        document.body.appendChild(pannelloGrigio);
        obj.form.submit();
    }
}
function addSpaces(valore, lunghezza) {
    if (!valore || valore == null) {
        valore = '';
    }
    while (valore.length < lunghezza) {
        valore += ' ';
    }
    return valore;
}
// dato un elemento del DOM ne restituisce la posizione x
function getXPos(campo) {
    let xPos = 0;
    if (campo.offsetParent) {
        while (1) {
            xPos += campo.offsetLeft;
            if (!campo.offsetParent) {
                break;
            }
            campo = campo.offsetParent;
        }
    }
    else if (campo.x) {
        xPos += campo.x;
    }
    return xPos;
}
// dato un elemento del DOM ne restituisce la posizione y
function getYPos(campo) {
    let yPos = 0;
    if (campo.offsetParent) {
        while (1) {
            yPos += campo.offsetTop;
            if (!campo.offsetParent) {
                break;
            }
            campo = campo.offsetParent;
        }
    }
    else if (campo.y) {
        yPos += campo.y;
    }
    return yPos;
}
function getWidth(campo) {
    return campo.clientWidth ? campo.clientWidth : campo.width;
}
function getHeight(campo) {
    return campo.clientHeight ? campo.clientHeight : campo.height;
}
// Fa comparire un messaggio di testo sotto un elemento del DOM
function testMessaggio(campo, messaggio) {
    const msg = new MessageBox(campo);
    msg.setMessaggio(messaggio);
    msg.show();
}
// Inizio Classe MessageBox
// Rappresenta il tasto premuto
function MessageBox(campo) {
    // this.padre = campo.parentNode;
    this.padre = document.body;
    this.xPos = getXPos(campo);
    this.yPos = getYPos(campo) + getHeight(campo);
    this.visibile = false;
    this.messaggio = '';
}
MessageBox.prototype.setMessaggio = function (messaggio) {
    this.messaggio = messaggio;
};
MessageBox.prototype.show = function () {
    const box = document.createElement('div');
    // box.style.position='absolute';
    // box.style.zIndex = 99;
    // Li do nel class attribute
    box.className = 'MessageBoxStyleClass';
    box.style.top = this.yPos + 'px';
    box.style.left = this.xPos + 'px';
    // TODO:onclick=close
    box.innerHTML = this.messaggio;
    this.padre.appendChild(box);
};
function leftTrim(stringa) {
    while (stringa.substring(0, 1) === ' ') {
        stringa = stringa.substring(1, stringa.length);
    }
    return stringa;
}
function rightTrim(stringa) {
    while (stringa.substring(stringa.length - 1, stringa.length) === ' ') {
        stringa = stringa.substring(0, stringa.length - 1);
    }
    return stringa;
}
function trim(stringa) {
    while (stringa.substring(0, 1) === ' ') {
        stringa = stringa.substring(1, stringa.length);
    }
    while (stringa.substring(stringa.length - 1, stringa.length) === ' ') {
        stringa = stringa.substring(0, stringa.length - 1);
    }
}
function creaPannelloGrigio(id, zIndex) {
    const pannelloGrigio = document.createElement('DIV');
    pannelloGrigio.id = id;
    pannelloGrigio.style.position = 'absolute';
    pannelloGrigio.style.left = 0 + 'px';
    pannelloGrigio.style.top = 0 + 'px';
    pannelloGrigio.style.zIndex = zIndex;
    pannelloGrigio.style.width = '100%';
    pannelloGrigio.style.height = '100%';
    pannelloGrigio.style.maxWidth = '99vw';
    pannelloGrigio.style.maxHeight = '99vh';
    pannelloGrigio.style.backgroundColor = '#808080';
    if (isIE()) {
        pannelloGrigio.style.filter = 'alpha(opacity=' + 40 + ')';
    }
    else {
        pannelloGrigio.style.opacity = '.4';
    }
    pannelloGrigio.style.visibility = 'hidden';
    return pannelloGrigio;
}
function isIE() {
    return navigator.userAgent.indexOf('MSIE') !== -1;
}
// Netscape o firefox
function isNS() {
    return navigator.appName.indexOf('Netscape') !== -1;
}
// Risale il dom fino a trovare la prima occorrenza di un tag
// numeroLivelli indica il numero di livelli da risalire, di default 1
function risaliByTag(obj, tag, numeroLivelli) {
    if (!numeroLivelli) {
        numeroLivelli = 1;
    }
    let res = obj;
    let livelloCorrente = 0;
    while (res && res != null && (new String(res.tagName).toLowerCase() !== tag.toLowerCase() || ++livelloCorrente < numeroLivelli)) {
        res = res.parentNode;
    }
    if (!res) {
        res = null;
    }
    return res;
}
function nextByTag(obj, tag) {
    let res = obj;
    while (res && res != null && new String(res.tagName).toLowerCase() !== tag.toLowerCase()) {
        res = res.nextSibling;
    }
    if (!res) {
        res = null;
    }
    return res;
}
// rimuove un elemento dal dom
function rimuoviElemento(obj) {
    setTimeout(function () {
        if (obj && obj.parentNode) {
            obj.parentNode.removeChild(obj);
        }
    }, 100);
}
// addPopupSdac('#{servlet_url}?#{rec.url}');

/*
 * Public API Surface of sii-toolkit
 */

/**
 * Generated bundle index. Do not edit.
 */

export { AutoHideRowDirective, BadgeComponent, BannerFeedbackComponent, BreadcrumbComponent, DateHintDirective, DotCmsInterceptorService, EmptyListMessageDirective, ErrorDisplayDialogComponent, ErrorDisplayService, FacetCheckboxComponent, FacetComponent, FacetSingleToggleComponent, FacetSkeletonComponent, FacetToolbarSearchComponent, FacetsContainerComponent, GlobalMenuComponent, GlobalSearchComponent, GroupListToolbarComponent, GroupedInfiniteScrollComponent, InfiniteScrollComponent, ListIconComponent, ListRowDirective, ListSorterComponent, ListSorterOptionComponent, LookupEmployeeComponent, LookupOdaPosComponent, LookupWorkOrderComponent, MenuComponent, NotarizationComponent, PageContentComponent, PageContentToolbarComponent, PageDetailComponent, PageFiltersComponent, PageFooterDirective, PageHoverMaskComponent, PopupManager, ProfileButtonComponent, SIIDateAdapter, SII_APP_REF, SII_ENVIRONMENT, SII_SESSION_WAITING, SdacPreviewService, SearchOdaPosDialogComponent, SearchWorkOrderDialogComponent, SiiBreadcrumbService, SiiDatePipe, SiiDownloadService, SiiEngageService, SiiFacetTemplateDirective, SiiFeedbackService, SiiFilterDirective, SiiFiltersModule, SiiHttpInterceptorService, SiiInfiniteScrollSelectAllComponent, SiiListController, SiiListModule, SiiNotarizationService, SiiOutComponent, SiiPageContainerComponent, SiiPageContainerModule, SiiPingService, SiiToolkitComponentsModule, SiiToolkitModule, SiiToolkitService, SiiWaitService, SiiYearMonth, SnackbarFeedbackComponent, ToolbarComponent, UploadComponent, WaitComponent, WorkerContactInformationComponent, WorkerIconComponent, YearMonthInputComponent, hasRequiredField, isEmpty, validMonth, validYear };
//# sourceMappingURL=sii-eng-sii-toolkit.mjs.map
