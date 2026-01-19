import { AfterViewInit, ChangeDetectorRef, ElementRef, NgZone, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import * as i0 from "@angular/core";
export declare class PageContentComponent implements OnInit, OnDestroy, AfterViewInit {
    el: ElementRef;
    private ref;
    private zone;
    defaultMinWidth: string;
    hostWidth: string;
    display: any;
    fix: boolean;
    set width(val: any);
    bodyStyle: any;
    bodyClass: any;
    pctb: ElementRef;
    pcb: ElementRef;
    get toolbarHeight(): string;
    pctbFixedHeightSubj: BehaviorSubject<number>;
    pctbFixedHeight: import("rxjs").Observable<number>;
    pctbHeightSubj: BehaviorSubject<number>;
    pctbHeight: import("rxjs").Observable<number>;
    pcbWidthSubj: Subject<number>;
    pcbWidth: import("rxjs").Observable<number>;
    pctbObserver: any;
    pcbObserver: any;
    utils: {
        lastpctChildrensHeight: {};
        lastpctbItems: number;
    };
    constructor(el: ElementRef, ref: ChangeDetectorRef, zone: NgZone);
    ngAfterViewInit(): void;
    ngOnInit(): void;
    ngOnDestroy(): void;
    getRealWidth(): number;
    getMinWidthInPx(): number;
    toolbarsHeightChange(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<PageContentComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<PageContentComponent, "sii-page-content", never, { "width": { "alias": "width"; "required": false; }; "bodyStyle": { "alias": "bodyStyle"; "required": false; }; "bodyClass": { "alias": "bodyClass"; "required": false; }; }, {}, never, ["sii-page-content-toolbar", "*"], true, never>;
}
