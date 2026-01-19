import { OnInit } from '@angular/core';
import { SiiListController } from '../../../../service/sii-list-controller.service';
import * as i0 from "@angular/core";
export declare class SiiInfiniteScrollSelectAllComponent implements OnInit {
    siiListController: SiiListController;
    constructor(siiListController: SiiListController);
    ngOnInit(): void;
    clickAct: () => void;
    static ɵfac: i0.ɵɵFactoryDeclaration<SiiInfiniteScrollSelectAllComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<SiiInfiniteScrollSelectAllComponent, "sii-list-select-all", never, {}, {}, never, never, true, never>;
}
