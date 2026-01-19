import { NativeDateAdapter } from '@angular/material/core';
import { SiiToolkitService } from '../sii-toolkit.service';
import * as i0 from "@angular/core";
export declare class SIIDateAdapter extends NativeDateAdapter {
    private siiToolkitService;
    constructor(matDateLocale: string, siiToolkitService: SiiToolkitService);
    format(date: Date, displayFormat: string): string;
    parse(dateString: string): Date | null;
    static ɵfac: i0.ɵɵFactoryDeclaration<SIIDateAdapter, [{ optional: true; }, null]>;
    static ɵprov: i0.ɵɵInjectableDeclaration<SIIDateAdapter>;
}
