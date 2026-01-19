import { OnInit } from '@angular/core';
import * as i0 from "@angular/core";
export declare class BadgeComponent implements OnInit {
    primaryColors: string[];
    hostClass: string;
    set appearance(val: any);
    styleBgColor: string;
    set background(val: any);
    styleColor: string;
    set color(val: any);
    constructor();
    ngOnInit(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<BadgeComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<BadgeComponent, "sii-badge", never, { "appearance": { "alias": "appearance"; "required": false; }; "background": { "alias": "background"; "required": false; }; "color": { "alias": "color"; "required": false; }; }, {}, never, ["*"], true, never>;
}
