import { OnInit } from '@angular/core';
import * as i0 from "@angular/core";
export declare class ListIconComponent implements OnInit {
    color: string;
    textColor: string;
    prefix: string;
    size: string;
    disabled: boolean;
    onHostClick(event: MouseEvent): void;
    constructor();
    ngOnInit(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ListIconComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ListIconComponent, "sii-list-icon", never, { "color": { "alias": "color"; "required": false; }; "textColor": { "alias": "textColor"; "required": false; }; "prefix": { "alias": "prefix"; "required": false; }; "size": { "alias": "size"; "required": false; }; "disabled": { "alias": "disabled"; "required": false; }; }, {}, never, ["*"], true, never>;
}
