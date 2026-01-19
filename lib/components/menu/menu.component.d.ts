import { OnInit } from '@angular/core';
import { SiiMenuVoice } from './global-menu/dto/menu-voice';
import { Location } from '@angular/common';
import * as i0 from "@angular/core";
export declare class MenuComponent implements OnInit {
    private location;
    voices: SiiMenuVoice[];
    showMenu: boolean;
    enableGlobalMenu: boolean;
    showGlobalMenu: boolean;
    constructor(location: Location);
    ngOnInit(): void;
    onLinkClicked(voice: SiiMenuVoice, event: any): void;
    toggleMenu(): void;
    closeGlobalMenu(): void;
    doLogout(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<MenuComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MenuComponent, "sii-menu", never, { "voices": { "alias": "voices"; "required": false; }; "enableGlobalMenu": { "alias": "enableGlobalMenu"; "required": false; }; }, {}, never, never, true, never>;
}
