import { ElementRef, OnDestroy, EventEmitter, AfterViewInit } from '@angular/core';
import { SiiListController } from '../../../service/sii-list-controller.service';
import { SiiInfiniteScrollDataSource } from './utils/sii-infinite-scroll-data-source';
import { ScrollerComponent } from '../../page-container/utils/dto/scroller-component.dto';
import * as i0 from "@angular/core";
export declare class InfiniteScrollComponent implements AfterViewInit, OnDestroy, ScrollerComponent {
    el: ElementRef;
    siiListController: SiiListController;
    templateRef: any;
    noDataFoundTpl: any;
    multiselect: boolean;
    selectable: boolean;
    itemClick: EventEmitter<any>;
    initialized: boolean;
    private subscription;
    ds: SiiInfiniteScrollDataSource;
    scrollerEl: Document;
    constructor(el: ElementRef, siiListController: SiiListController);
    isScrolledAtEndOfPage(): boolean;
    ngAfterViewInit(): void;
    ngOnDestroy(): void;
    scrollerFunctionRef: (event: Event) => void;
    itemClicked(item: any, ev: MouseEvent): void;
    clickedOnMultiselectHandler: (ev: any) => boolean;
    static ɵfac: i0.ɵɵFactoryDeclaration<InfiniteScrollComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<InfiniteScrollComponent, "sii-infinite-scroll", never, { "multiselect": { "alias": "multiselect"; "required": false; }; "selectable": { "alias": "selectable"; "required": false; }; }, { "itemClick": "itemClick"; }, ["templateRef", "noDataFoundTpl"], ["[listHeader]", "[listFooter]"], true, never>;
}
