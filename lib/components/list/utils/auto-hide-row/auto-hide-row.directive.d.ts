import { ElementRef, OnDestroy, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import * as i0 from "@angular/core";
export declare class AutoHideRowDirective implements OnInit, OnDestroy {
    el: ElementRef;
    private templateRef;
    private viewContainer;
    siiAutoHideRow: string;
    get id(): string;
    get offsetTop(): any;
    private get targetItem();
    fakeElement: any;
    isVisible: boolean;
    constructor(el: ElementRef, templateRef: TemplateRef<any>, viewContainer: ViewContainerRef);
    ngOnDestroy(): void;
    ngOnInit(): void;
    private createFakeItem;
    hide(): void;
    show(): void;
    private refresh;
    check(refresh?: boolean): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<AutoHideRowDirective, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<AutoHideRowDirective, "[siiAutoHideRow]", never, { "siiAutoHideRow": { "alias": "siiAutoHideRow"; "required": false; }; }, {}, never, never, true, never>;
}
