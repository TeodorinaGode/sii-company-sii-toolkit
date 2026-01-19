import { EventEmitter } from '@angular/core';
import { SiiMenuVoice } from './dto/menu-voice';
import { GlobalMenuService } from './service/global-menu.service';
import { SiiMenuFolder } from './dto/menu-folder';
import { BehaviorSubject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import * as i0 from "@angular/core";
export declare class GlobalMenuComponent {
    globalMenuService: GlobalMenuService;
    matDialog: MatDialog;
    showCloseButton: boolean;
    closeAction: EventEmitter<void>;
    private linkManager;
    searchFilter: string;
    get menus(): BehaviorSubject<SiiMenuFolder[]>;
    get company(): string;
    constructor(globalMenuService: GlobalMenuService, matDialog: MatDialog);
    close(): void;
    onLinkClicked(voice: SiiMenuVoice, openInThisWindow?: boolean): void;
    reset(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<GlobalMenuComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<GlobalMenuComponent, "sii-global-menu", never, { "showCloseButton": { "alias": "showCloseButton"; "required": false; }; }, { "closeAction": "closeAction"; }, never, never, true, never>;
}
