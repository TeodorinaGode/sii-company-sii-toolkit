import { Router } from '@angular/router';
import { BreadcrumbItem, SiiBreadcrumbService } from './services/breadcrumb.service';
import * as i0 from "@angular/core";
export declare class BreadcrumbComponent {
    private breadcrumbService;
    private router;
    externalHome: string | URL;
    home: any[];
    get breadcrumbList(): import("rxjs").Observable<BreadcrumbItem[]>;
    constructor(breadcrumbService: SiiBreadcrumbService, router: Router);
    routerLinkClicked(event: Event, index: number, breadItem: BreadcrumbItem): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<BreadcrumbComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<BreadcrumbComponent, "sii-breadcrumb", never, { "externalHome": { "alias": "externalHome"; "required": false; }; "home": { "alias": "home"; "required": false; }; }, {}, never, never, true, never>;
}
