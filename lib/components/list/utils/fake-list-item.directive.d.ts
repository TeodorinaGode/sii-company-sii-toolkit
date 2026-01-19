import { ElementRef, AfterViewInit, TemplateRef, ViewContainerRef, OnDestroy } from '@angular/core';
import * as i0 from "@angular/core";
export declare class FakeListItemDirective implements AfterViewInit, OnDestroy {
    el: ElementRef;
    template: TemplateRef<any>;
    view: ViewContainerRef;
    siiFakeListItem: any;
    elements: any[];
    private changes;
    constructor(el: ElementRef, template: TemplateRef<any>, view: ViewContainerRef);
    ngOnDestroy(): void;
    ngAfterViewInit(): void;
    updateStyles: () => void;
    static ɵfac: i0.ɵɵFactoryDeclaration<FakeListItemDirective, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<FakeListItemDirective, "[siiFakeListItem]", never, { "siiFakeListItem": { "alias": "siiFakeListItem"; "required": false; }; }, {}, never, never, true, never>;
}
