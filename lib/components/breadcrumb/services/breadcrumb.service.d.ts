import { ActivatedRouteSnapshot, Router } from '@angular/router';
import * as i0 from "@angular/core";
export type BreadcrumbItem = {
    url: string;
    label: string;
    fragment: string;
    queryParams: any;
};
/**
 * available states for routing
 *
 * breacbrumb        -> the custom name of the current path
 * breadcrumbReset   -> to reset the breadcrumb to the current route
 * breadcrumbHome    -> to set the current path as home if is different of '' or '**'
 *
 */
export declare class SiiBreadcrumbService {
    private router;
    private breadcrumbActionSubj;
    breadcrumbAction: import("rxjs").Observable<{
        action: string;
        data: any;
    }>;
    private breadcrumbList;
    private breadcrumbSubj;
    breadcrumb: import("rxjs").Observable<BreadcrumbItem[]>;
    private currNavigationStart?;
    constructor(router: Router);
    init(): () => Promise<any>;
    private doAction;
    private findCurrentRoute;
    private initBreadcrumb;
    private pageChange;
    buildBreadcrumbItem(url: string, state: ActivatedRouteSnapshot): BreadcrumbItem;
    getFullUrl(root: ActivatedRouteSnapshot, arr?: any[]): any[];
    private isRoot;
    changeLastBreadLabel(label: string): void;
    removeLastBread(): void;
    reset(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<SiiBreadcrumbService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<SiiBreadcrumbService>;
}
