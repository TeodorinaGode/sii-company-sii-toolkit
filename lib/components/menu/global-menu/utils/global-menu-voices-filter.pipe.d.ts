import { PipeTransform } from '@angular/core';
import { SiiMenuVoice } from '../dto/menu-voice';
import * as i0 from "@angular/core";
export declare class GlobalMenuVoicesFilterPipe implements PipeTransform {
    transform(menuVoices: SiiMenuVoice[], company: string, textFilter: string): SiiMenuVoice[];
    static ɵfac: i0.ɵɵFactoryDeclaration<GlobalMenuVoicesFilterPipe, never>;
    static ɵpipe: i0.ɵɵPipeDeclaration<GlobalMenuVoicesFilterPipe, "globalMenuVoicesFilter", true>;
}
