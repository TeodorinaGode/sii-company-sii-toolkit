import { Injectable } from '@angular/core';
import { DefaultUrlSerializer, GuardsCheckEnd, NavigationStart } from '@angular/router';
import { BehaviorSubject, Subject } from 'rxjs';
import { filter } from 'rxjs/operators';
import * as i0 from "@angular/core";
import * as i1 from "@angular/router";
/**
 * available states for routing
 *
 * breacbrumb        -> the custom name of the current path
 * breadcrumbReset   -> to reset the breadcrumb to the current route
 * breadcrumbHome    -> to set the current path as home if is different of '' or '**'
 *
 */
export class SiiBreadcrumbService {
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: SiiBreadcrumbService, deps: [{ token: i1.Router }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: SiiBreadcrumbService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: SiiBreadcrumbService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                }]
        }], ctorParameters: () => [{ type: i1.Router }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnJlYWRjcnVtYi5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvc2lpLXRvb2xraXQvc3JjL2xpYi9jb21wb25lbnRzL2JyZWFkY3J1bWIvc2VydmljZXMvYnJlYWRjcnVtYi5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0MsT0FBTyxFQUFxRSxvQkFBb0IsRUFDekYsY0FBYyxFQUFPLGVBQWUsRUFBcUIsTUFBTSxpQkFBaUIsQ0FBQztBQUN4RixPQUFPLEVBQUUsZUFBZSxFQUFFLE9BQU8sRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUNoRCxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7OztBQVl4Qzs7Ozs7OztHQU9HO0FBUUgsTUFBTSxPQUFPLG9CQUFvQjtJQVcvQixZQUFxQixNQUFjO1FBQWQsV0FBTSxHQUFOLE1BQU0sQ0FBUTtRQVQzQix5QkFBb0IsR0FBRyxJQUFJLE9BQU8sRUFBK0IsQ0FBQztRQUNuRSxxQkFBZ0IsR0FBRyxJQUFJLENBQUMsb0JBQW9CLENBQUMsWUFBWSxFQUFFLENBQUM7UUFFM0QsbUJBQWMsR0FBcUIsRUFBRSxDQUFDO1FBQ3RDLG1CQUFjLEdBQUcsSUFBSSxlQUFlLENBQW1CLEVBQUUsQ0FBQyxDQUFDO1FBQzVELGVBQVUsR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLFlBQVksRUFBRSxDQUFDO1FBTXJELElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFTLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRTtZQUN0QyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3RDLENBQUMsQ0FBQyxDQUFDO0lBRUgsQ0FBQztJQUdILElBQUk7UUFDRixPQUFPLEdBQWlCLEVBQUU7WUFD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QUMsQ0FBQyxJQUFJLEtBQUssRUFBRSxJQUFLLFFBQVEsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDO0lBQ25HLENBQUM7SUFHTSxvQkFBb0IsQ0FBQyxLQUFhO1FBQ3JDLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsRUFBQyxNQUFNLEVBQUUseUJBQXlCLEVBQUUsSUFBSSxFQUFFLEVBQUMsS0FBSyxFQUFDLEVBQUMsQ0FBQyxDQUFDO0lBQ3ZGLENBQUM7SUFFTSxlQUFlO1FBQ3BCLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsRUFBQyxNQUFNLEVBQUUsbUJBQW1CLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBQyxDQUFDLENBQUM7SUFFNUUsQ0FBQztJQUVNLEtBQUs7UUFDVixJQUFJLENBQUMsb0JBQW9CLENBQUMsSUFBSSxDQUFDLEVBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFDLENBQUMsQ0FBQztJQUVoRSxDQUFDOytHQXRNVSxvQkFBb0I7bUhBQXBCLG9CQUFvQixjQUZuQixNQUFNOzs0RkFFUCxvQkFBb0I7a0JBSGhDLFVBQVU7bUJBQUM7b0JBQ1YsVUFBVSxFQUFFLE1BQU07aUJBQ25CIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyAgQWN0aXZhdGVkUm91dGUsICBBY3RpdmF0ZWRSb3V0ZVNuYXBzaG90LCAgICBBY3RpdmF0aW9uU3RhcnQsICAgICAgRGVmYXVsdFVybFNlcmlhbGl6ZXIsXHJcbiAgICAgICBHdWFyZHNDaGVja0VuZCwgICAgICBOYXZpZ2F0aW9uU3RhcnQsICBSb3V0ZXIsICBVcmxUcmVlIH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcclxuaW1wb3J0IHsgQmVoYXZpb3JTdWJqZWN0LCBTdWJqZWN0IH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7IGZpbHRlciB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcclxuXHJcblxyXG5leHBvcnQgdHlwZSBCcmVhZGNydW1iSXRlbT0ge1xyXG4gIHVybDogc3RyaW5nO1xyXG4gIGxhYmVsOiBzdHJpbmc7XHJcbiAgZnJhZ21lbnQ6IHN0cmluZztcclxuICBxdWVyeVBhcmFtczogYW55O1xyXG59O1xyXG5cclxuXHJcblxyXG4vKipcclxuICogYXZhaWxhYmxlIHN0YXRlcyBmb3Igcm91dGluZ1xyXG4gKlxyXG4gKiBicmVhY2JydW1iICAgICAgICAtPiB0aGUgY3VzdG9tIG5hbWUgb2YgdGhlIGN1cnJlbnQgcGF0aFxyXG4gKiBicmVhZGNydW1iUmVzZXQgICAtPiB0byByZXNldCB0aGUgYnJlYWRjcnVtYiB0byB0aGUgY3VycmVudCByb3V0ZVxyXG4gKiBicmVhZGNydW1iSG9tZSAgICAtPiB0byBzZXQgdGhlIGN1cnJlbnQgcGF0aCBhcyBob21lIGlmIGlzIGRpZmZlcmVudCBvZiAnJyBvciAnKionXHJcbiAqXHJcbiAqL1xyXG5cclxuXHJcblxyXG5cclxuQEluamVjdGFibGUoe1xyXG4gIHByb3ZpZGVkSW46ICdyb290JyxcclxufSlcclxuZXhwb3J0IGNsYXNzIFNpaUJyZWFkY3J1bWJTZXJ2aWNlIHtcclxuXHJcbiAgcHJpdmF0ZSBicmVhZGNydW1iQWN0aW9uU3ViaiA9IG5ldyBTdWJqZWN0PHthY3Rpb246IHN0cmluZywgZGF0YTogYW55fT4oKTtcclxuICBwdWJsaWMgYnJlYWRjcnVtYkFjdGlvbiA9IHRoaXMuYnJlYWRjcnVtYkFjdGlvblN1YmouYXNPYnNlcnZhYmxlKCk7XHJcblxyXG4gIHByaXZhdGUgYnJlYWRjcnVtYkxpc3Q6IEJyZWFkY3J1bWJJdGVtW10gPSBbXTtcclxuICBwcml2YXRlIGJyZWFkY3J1bWJTdWJqID0gbmV3IEJlaGF2aW9yU3ViamVjdDxCcmVhZGNydW1iSXRlbVtdPihbXSk7XHJcbiAgcHVibGljIGJyZWFkY3J1bWIgPSB0aGlzLmJyZWFkY3J1bWJTdWJqLmFzT2JzZXJ2YWJsZSgpO1xyXG5cclxuICBwcml2YXRlIGN1cnJOYXZpZ2F0aW9uU3RhcnQ/OiBOYXZpZ2F0aW9uU3RhcnQ7XHJcblxyXG4gIGNvbnN0cnVjdG9yKCBwcml2YXRlIHJvdXRlcjogUm91dGVyKSB7XHJcblxyXG4gICAgdGhpcy5icmVhZGNydW1iQWN0aW9uLnN1YnNjcmliZSgocmVzKSA9PiB7XHJcbiAgICAgIHRoaXMuZG9BY3Rpb24ocmVzLmFjdGlvbiwgcmVzLmRhdGEpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgfVxyXG5cclxuXHJcbiAgaW5pdCgpe1xyXG4gICAgcmV0dXJuICgpOiBQcm9taXNlPGFueT4gPT4ge1xyXG4gICAgICByZXR1cm4gbmV3IFByb21pc2U8dm9pZD4oKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgIHRoaXMuaW5pdEJyZWFkY3J1bWIoKTtcclxuICAgICAgICByZXNvbHZlKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH07XHJcbiAgfVxyXG5cclxuXHJcbiAgcHJpdmF0ZSBkb0FjdGlvbihhY3Rpb25UeXBlOiBzdHJpbmcsIGFjdGlvbkRhdGE6IGFueSl7XHJcblxyXG4gICAgc3dpdGNoIChhY3Rpb25UeXBlKXtcclxuICAgICAgY2FzZSAnUEFHRV9DSEFOR0UnIDpcclxuICAgICAgICAgdGhpcy5wYWdlQ2hhbmdlKCBhY3Rpb25EYXRhLnVybCAsICBhY3Rpb25EYXRhLnNuYXBzaG90KTtcclxuICAgICAgICAgZGVsZXRlIHRoaXMuY3Vyck5hdmlnYXRpb25TdGFydDtcclxuICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICBjYXNlICdDSEFOR0VfTEFTVF9CUkVBRF9MQUJFTCc6XHJcbiAgICAgICAgdGhpcy5icmVhZGNydW1iTGlzdFt0aGlzLmJyZWFkY3J1bWJMaXN0Lmxlbmd0aCAtIDFdLmxhYmVsID0gYWN0aW9uRGF0YS5sYWJlbDtcclxuICAgICAgICB0aGlzLmJyZWFkY3J1bWJTdWJqLm5leHQodGhpcy5icmVhZGNydW1iTGlzdCk7XHJcbiAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICBjYXNlICdSRU1PVkVfTEFTVF9CUkVBRCc6XHJcbiAgICAgICAgdGhpcy5icmVhZGNydW1iTGlzdC5sZW5ndGggPSB0aGlzLmJyZWFkY3J1bWJMaXN0Lmxlbmd0aCAtIDE7XHJcbiAgICAgICAgdGhpcy5icmVhZGNydW1iU3Viai5uZXh0KHRoaXMuYnJlYWRjcnVtYkxpc3QpO1xyXG4gICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgY2FzZSAnUkVTRVQnOlxyXG4gICAgICAgIHRoaXMuYnJlYWRjcnVtYkxpc3QubGVuZ3RoID0gMDtcclxuICAgICAgICBicmVhaztcclxuICAgIH1cclxuXHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGZpbmRDdXJyZW50Um91dGUodXJsOiBVcmxUcmVlLCByb290OiBBY3RpdmF0ZWRSb3V0ZVNuYXBzaG90KXtcclxuICAgIGlmICh1cmwucm9vdC5jaGlsZHJlbi5wcmltYXJ5ID09PSB1bmRlZmluZWQpe1xyXG4gICAgICByZXR1cm4gcm9vdC5maXJzdENoaWxkO1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICAgY29uc3QgZnVsbFVybCA9IHRoaXMuZ2V0RnVsbFVybChyb290KTtcclxuICAgIGlmICggcm9vdC5mcmFnbWVudCA9PT0gdXJsLmZyYWdtZW50ICYmXHJcbiAgICAgICBKU09OLnN0cmluZ2lmeShyb290LnF1ZXJ5UGFyYW1zKSA9PT0gSlNPTi5zdHJpbmdpZnkodXJsLnF1ZXJ5UGFyYW1zKSAmJlxyXG4gICAgICAgIEpTT04uc3RyaW5naWZ5KHVybC5yb290LmNoaWxkcmVuLnByaW1hcnkuc2VnbWVudHMpID09PSBKU09OLnN0cmluZ2lmeShmdWxsVXJsKVxyXG4gICAgICAgICl7XHJcbiAgICAgIHJldHVybiByb290O1xyXG4gICAgfWVsc2UgaWYgKHJvb3QuZmlyc3RDaGlsZCAhPSBudWxsKXtcclxuICAgICAgcmV0dXJuIHRoaXMuZmluZEN1cnJlbnRSb3V0ZSh1cmwsIHJvb3QuZmlyc3RDaGlsZCk7XHJcbiAgICB9ZWxzZXtcclxuICAgICAgY29uc29sZS5sb2coJ1JPVFRBIE5PTiBUUk9WQVRBJyk7XHJcbiAgICB9XHJcblxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBpbml0QnJlYWRjcnVtYigpe1xyXG5cclxuICAgIHRoaXMucm91dGVyLmV2ZW50c1xyXG4gICAgLnBpcGUoZmlsdGVyKGV2ZW50ID0+IGV2ZW50IGluc3RhbmNlb2YgR3VhcmRzQ2hlY2tFbmQgfHwgZXZlbnQgaW5zdGFuY2VvZiBOYXZpZ2F0aW9uU3RhcnQgKSlcclxuICAgIC5zdWJzY3JpYmUoKGV2ZW50OiBHdWFyZHNDaGVja0VuZCB8IE5hdmlnYXRpb25TdGFydCApID0+IHtcclxuXHJcbiAgICAgIGlmIChldmVudCBpbnN0YW5jZW9mIE5hdmlnYXRpb25TdGFydCl7XHJcbiAgICAgICAgaWYgKGV2ZW50Lm5hdmlnYXRpb25UcmlnZ2VyID09PSAncG9wc3RhdGUnICl7XHJcbiAgICAgICAgICAvLyBzZSBiYWNjaW8gYmFjayBvIGZvd2FyZCBjb24gaWwgYnJvd3NlciwgcmVzZXR0byBsYSBicmVhZGNydW1iXHJcbiAgICAgICAgICB0aGlzLmJyZWFkY3J1bWJBY3Rpb25TdWJqLm5leHQoe2FjdGlvbjogJ1JFU0VUJywgZGF0YTogbnVsbH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgfWVsc2V7XHJcbiAgICAgICAgY29uc3QgdXJsID0gKG5ldyBEZWZhdWx0VXJsU2VyaWFsaXplcigpKS5wYXJzZShldmVudC51cmwpO1xyXG4gICAgICAgIGNvbnN0IGN1cnJBY3RpdmF0ZWRSb3V0ZVNuYXBzaG90ID0gdGhpcy5maW5kQ3VycmVudFJvdXRlKHVybCwgZXZlbnQuc3RhdGUucm9vdCk7XHJcbiAgICAgICAgdGhpcy5icmVhZGNydW1iQWN0aW9uU3Viai5uZXh0KHthY3Rpb246ICdQQUdFX0NIQU5HRScsIGRhdGE6IHt1cmw6IGV2ZW50LnVybCwgc25hcHNob3Q6IGN1cnJBY3RpdmF0ZWRSb3V0ZVNuYXBzaG90IH19KTtcclxuICAgICAgfVxyXG5cclxuICAgIH0pO1xyXG4gICAgLy8gdGhpcy5yb3V0ZXIuZXZlbnRzXHJcbiAgICAvLyAucGlwZShmaWx0ZXIoKGV2ZW50KSA9PiBldmVudCBpbnN0YW5jZW9mIEFjdGl2YXRpb25TdGFydCB8fCBldmVudCBpbnN0YW5jZW9mIE5hdmlnYXRpb25TdGFydCkpXHJcbiAgICAvLyAuc3Vic2NyaWJlKChldmVudDogQWN0aXZhdGlvblN0YXJ0IHwgTmF2aWdhdGlvblN0YXJ0KSAgPT4ge1xyXG5cclxuICAgIC8vICAgaWYgKGV2ZW50IGluc3RhbmNlb2YgQWN0aXZhdGlvblN0YXJ0ICApe1xyXG4gICAgLy8gICAgIHRoaXMuYnJlYWRjcnVtYkFjdGlvblN1YmoubmV4dCh7YWN0aW9uOiAnUEFHRV9DSEFOR0UnLCBkYXRhOiB7dXJsOiB0aGlzLmN1cnJOYXZpZ2F0aW9uU3RhcnQudXJsLCBzdGF0ZTogZXZlbnQgfX0pO1xyXG4gICAgLy8gICB9ZWxzZSBpZiAoZXZlbnQgaW5zdGFuY2VvZiBOYXZpZ2F0aW9uU3RhcnQpe1xyXG4gICAgLy8gICAgIHRoaXMuY3Vyck5hdmlnYXRpb25TdGFydCA9IGV2ZW50O1xyXG4gICAgLy8gICB9XHJcbiAgICAvLyB9KTtcclxuICAgIC8vIC5waXBlKGZpbHRlcigoZXZlbnQpID0+IGV2ZW50IGluc3RhbmNlb2YgTmF2aWdhdGlvbkVuZCkpXHJcbiAgICAvLyAuc3Vic2NyaWJlKChldmVudDogTmF2aWdhdGlvbkVuZCkgPT4ge1xyXG4gICAgLy8gICAgIHRoaXMucGFnZUNoYW5nZSh0aGlzLnJvdXRlci5yb3V0ZXJTdGF0ZS5zbmFwc2hvdCk7XHJcbiAgICAvLyB9KTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgcGFnZUNoYW5nZSggdXJsOiBzdHJpbmcgLCAgc25hcHNob3Q6IEFjdGl2YXRlZFJvdXRlU25hcHNob3Qpe1xyXG4gICAgY29uc3QgaXNSb290ID0gdGhpcy5pc1Jvb3QoIHNuYXBzaG90KTtcclxuICAgIGlmIChpc1Jvb3Qpe1xyXG4gICAgICB0aGlzLmJyZWFkY3J1bWJMaXN0ID0gW3RoaXMuYnVpbGRCcmVhZGNydW1iSXRlbSh1cmwsIHNuYXBzaG90KV07XHJcbiAgICB9ZWxzZSBpZiAodGhpcy5icmVhZGNydW1iTGlzdC5sZW5ndGggPT09IDAgfHwgISFzbmFwc2hvdC5yb3V0ZUNvbmZpZy5kYXRhLmJyZWFkY3J1bWJSZXNldCl7XHJcbiAgICAgIHRoaXMuYnJlYWRjcnVtYkxpc3QgPSBbe3VybDogJy8nLCBsYWJlbDogJ0hvbWUnLCBmcmFnbWVudDogbnVsbCwgcXVlcnlQYXJhbXM6IG51bGx9XTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoIWlzUm9vdCl7XHJcbiAgICAgIHRoaXMuYnJlYWRjcnVtYkxpc3QucHVzaCh0aGlzLmJ1aWxkQnJlYWRjcnVtYkl0ZW0odXJsLCBzbmFwc2hvdCkpO1xyXG4gICAgICBjb25zdCBsYXN0Q3J1bWIgPSB0aGlzLmJyZWFkY3J1bWJMaXN0W3RoaXMuYnJlYWRjcnVtYkxpc3QubGVuZ3RoIC0gMV07XHJcbiAgICAgIGNvbnN0IGZpcnN0SW5kZXhPZk5ld1VybCA9IHRoaXMuYnJlYWRjcnVtYkxpc3QuZmluZEluZGV4KGkgPT4gaS51cmwgPT09IGxhc3RDcnVtYi51cmwpO1xyXG5cclxuICAgICAgaWYgKGZpcnN0SW5kZXhPZk5ld1VybCAhPT0gdGhpcy5icmVhZGNydW1iTGlzdC5sZW5ndGggLSAxKXtcclxuICAgICAgICB0aGlzLmJyZWFkY3J1bWJMaXN0Lmxlbmd0aCA9IGZpcnN0SW5kZXhPZk5ld1VybCArIDE7XHJcbiAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5icmVhZGNydW1iU3Viai5uZXh0KHRoaXMuYnJlYWRjcnVtYkxpc3QpO1xyXG4gIH1cclxuICAvLyBwcml2YXRlIHBhZ2VDaGFuZ2UoIHVybDogc3RyaW5nICwgIHN0YXRlOiBBY3RpdmF0aW9uU3RhcnQpe1xyXG4gIC8vICAgaWYgKHRoaXMuYnJlYWRjcnVtYkxpc3QubGVuZ3RoID09PSAwIHx8ICEhc3RhdGUuc25hcHNob3Qucm91dGVDb25maWcuZGF0YS5icmVhZGNydW1iUmVzZXQpe1xyXG4gIC8vICAgICB0aGlzLmJyZWFkY3J1bWJMaXN0ID0gW3t1cmw6ICcvJywgbGFiZWw6ICdIb21lJywgZnJhZ21lbnQ6IG51bGwsIHF1ZXJ5UGFyYW1zOiBudWxsfV07XHJcbiAgLy8gICB9XHJcblxyXG4gIC8vICAgaWYgKCF0aGlzLmlzUm9vdCh1cmwsIHN0YXRlKSl7XHJcbiAgLy8gICAgIHRoaXMuYnJlYWRjcnVtYkxpc3QucHVzaCh0aGlzLmJ1aWxkQnJlYWRjcnVtYkl0ZW0odXJsLCBzdGF0ZS5zbmFwc2hvdCkpO1xyXG4gIC8vICAgICBjb25zdCBsYXN0Q3J1bWIgPSB0aGlzLmJyZWFkY3J1bWJMaXN0W3RoaXMuYnJlYWRjcnVtYkxpc3QubGVuZ3RoIC0gMV07XHJcbiAgLy8gICAgIGNvbnN0IGZpcnN0SW5kZXhPZk5ld1VybCA9IHRoaXMuYnJlYWRjcnVtYkxpc3QuZmluZEluZGV4KGkgPT4gaS51cmwgPT09IGxhc3RDcnVtYi51cmwpO1xyXG5cclxuICAvLyAgICAgaWYgKGZpcnN0SW5kZXhPZk5ld1VybCAhPT0gdGhpcy5icmVhZGNydW1iTGlzdC5sZW5ndGggLSAxKXtcclxuICAvLyAgICAgICB0aGlzLmJyZWFkY3J1bWJMaXN0Lmxlbmd0aCA9IGZpcnN0SW5kZXhPZk5ld1VybCArIDE7XHJcbiAgLy8gICAgIH1cclxuXHJcbiAgLy8gICB9XHJcblxyXG4gIC8vICAgdGhpcy5icmVhZGNydW1iU3Viai5uZXh0KHRoaXMuYnJlYWRjcnVtYkxpc3QpO1xyXG4gIC8vIH1cclxuXHJcbiAgYnVpbGRCcmVhZGNydW1iSXRlbSh1cmw6IHN0cmluZywgc3RhdGU6IEFjdGl2YXRlZFJvdXRlU25hcHNob3QpOiBCcmVhZGNydW1iSXRlbXtcclxuXHJcbiAgICAvLyBjb25zdCB1cmxPYmogPSBuZXcgVVJMKHVybCwgJ2h0dHA6Ly9leGFtcGxlLmNvbScpO1xyXG4gICAgLy8gY29uc3Qgc2VhcmNoUGFyYW1PYmogPSB7fTtcclxuICAgIC8vIHVybE9iai5zZWFyY2hQYXJhbXMuZm9yRWFjaCgodmFsdWUsIGtleSkgPT4ge1xyXG4gICAgLy8gICBzZWFyY2hQYXJhbU9ialtrZXldID0gdmFsdWU7XHJcbiAgICAvLyB9KTtcclxuXHJcbiAgICAvLyBjb25zdCBmcmFnbWVudCA9IHVybE9iai5oYXNoICE9PSAnJyA/IHVybE9iai5oYXNoLnJlcGxhY2UoJyMnLCAnJykgOiBudWxsO1xyXG5cclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICB1cmw6ICcvJyArIHRoaXMuZ2V0RnVsbFVybChzdGF0ZSkubWFwKCBwID0+IHAucGF0aCkuam9pbignLycpLFxyXG4gICAgICAvLyB1cmw6IHN0YXRlLnVybC5yZWR1Y2UoKGFjYywgYXR0KSA9PiBhY2MgKyBhdHQucGF0aCArICcvJywgJycpLFxyXG4gICAgICAvLyB1cmxPbGQ6IHVybE9iai5wYXRobmFtZSxcclxuICAgICAgbGFiZWw6IHN0YXRlLnJvdXRlQ29uZmlnPy5kYXRhPy5icmVhZGNydW1iIHx8ICh1cmwuc3RhcnRzV2l0aChcIi9cIikgPyB1cmwuc2xpY2UoMSk6IHVybCkucmVwbGFjZShcIi9cIixcIiAvIFwiKSxcclxuICAgICAgZnJhZ21lbnQ6IHN0YXRlLmZyYWdtZW50LFxyXG4gICAgICBxdWVyeVBhcmFtczogc3RhdGUucXVlcnlQYXJhbXNcclxuICAgIH0gO1xyXG5cclxuICB9XHJcblxyXG4gIGdldEZ1bGxVcmwocm9vdDogQWN0aXZhdGVkUm91dGVTbmFwc2hvdCwgYXJyPSBbXSl7XHJcbiAgICBpZiAocm9vdC5wYXJlbnQgIT0gbnVsbCl7XHJcbiAgICAgIHRoaXMuZ2V0RnVsbFVybChyb290LnBhcmVudCwgYXJyKTtcclxuICAgIH1cclxuXHJcbiAgICByb290LnVybC5mb3JFYWNoKGkgPT4gYXJyLnB1c2goaSkpO1xyXG4gICAgcmV0dXJuIGFycjtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgaXNSb290KHNuYXBzaG90OiBBY3RpdmF0ZWRSb3V0ZVNuYXBzaG90KXtcclxuICAgIHJldHVybiBzbmFwc2hvdC51cmwubGVuZ3RoID09PSAwIHx8IHNuYXBzaG90LnVybFswXS5wYXRoID09PSAnJyAgfHwgc25hcHNob3QuZGF0YS5icmVhZGNydW1iSG9tZTtcclxuICB9XHJcblxyXG5cclxuICBwdWJsaWMgY2hhbmdlTGFzdEJyZWFkTGFiZWwobGFiZWw6IHN0cmluZyl7XHJcbiAgICAgIHRoaXMuYnJlYWRjcnVtYkFjdGlvblN1YmoubmV4dCh7YWN0aW9uOiAnQ0hBTkdFX0xBU1RfQlJFQURfTEFCRUwnLCBkYXRhOiB7bGFiZWx9fSk7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgcmVtb3ZlTGFzdEJyZWFkKCl7XHJcbiAgICB0aGlzLmJyZWFkY3J1bWJBY3Rpb25TdWJqLm5leHQoe2FjdGlvbjogJ1JFTU9WRV9MQVNUX0JSRUFEJywgZGF0YTogbnVsbH0pO1xyXG5cclxuICB9XHJcblxyXG4gIHB1YmxpYyByZXNldCgpe1xyXG4gICAgdGhpcy5icmVhZGNydW1iQWN0aW9uU3Viai5uZXh0KHthY3Rpb246ICdSRVNFVCcsIGRhdGE6IG51bGx9KTtcclxuXHJcbiAgfVxyXG5cclxufVxyXG4iXX0=