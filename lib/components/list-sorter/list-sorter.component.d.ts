import { AfterViewInit, QueryList } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { ListSorterOptionComponent } from './list-sorter-option/list-sorter-option.component';
import { SiiListController } from '../../service/sii-list-controller.service';
import { SiiSortGroup } from '../../dto/i-sii-group.dto';
import * as i0 from "@angular/core";
export declare class ListSorterComponent implements AfterViewInit {
    private siiListService;
    listSorterOptions: QueryList<ListSorterOptionComponent>;
    options: any[];
    showLabel: boolean;
    get selectedValue(): string;
    set selectedValue(sv: string);
    get sortAsc(): boolean;
    set sortAsc(val: boolean);
    get selectedGroup(): SiiSortGroup;
    set selectedGroup(sv: SiiSortGroup);
    constructor(siiListService: SiiListController);
    ngAfterViewInit(): void;
    selectionChange(selev: MatSelectChange): void;
    toggleOrderAsc: () => void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ListSorterComponent, [{ optional: true; }]>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ListSorterComponent, "sii-list-sorter", never, { "showLabel": { "alias": "showLabel"; "required": false; }; }, {}, ["listSorterOptions"], ["*"], true, never>;
}
