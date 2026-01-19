import { ElementRef, AfterViewInit } from '@angular/core';
import * as i0 from "@angular/core";
export interface SorterGroupAction {
    label: string;
    icon: string;
    action: (key: string, value: string, items: any[]) => void;
    visible: (key: string, value: string, items: any[]) => boolean;
}
export declare class ListSorterOptionComponent implements AfterViewInit {
    private el;
    value: any;
    groupKey: any;
    groupValue: any;
    groupLabelTransform: (id: any, value: any, obj: any) => string;
    parentGroupLabelTransform: (rid: any, value: any, obj: any) => string;
    sortAsc: boolean;
    groupAction: SorterGroupAction[];
    parentGroupAction: SorterGroupAction[];
    listSortAttr: any;
    set LS(value: boolean | string);
    parentGroupKey: any;
    parentGroupValue: any;
    display: string;
    isInitSort: boolean;
    get viewValue(): any;
    constructor(el: ElementRef);
    ngAfterViewInit(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ListSorterOptionComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ListSorterOptionComponent, "sii-list-sorter-option", never, { "value": { "alias": "value"; "required": false; }; "groupKey": { "alias": "groupKey"; "required": false; }; "groupValue": { "alias": "groupValue"; "required": false; }; "groupLabelTransform": { "alias": "groupLabelTransform"; "required": false; }; "parentGroupLabelTransform": { "alias": "parentGroupLabelTransform"; "required": false; }; "sortAsc": { "alias": "sortAsc"; "required": false; }; "groupAction": { "alias": "groupAction"; "required": false; }; "parentGroupAction": { "alias": "parentGroupAction"; "required": false; }; "LS": { "alias": "sii-list-init-sort"; "required": false; }; "parentGroupKey": { "alias": "parentGroupKey"; "required": false; }; "parentGroupValue": { "alias": "parentGroupValue"; "required": false; }; }, {}, never, ["*"], true, never>;
}
