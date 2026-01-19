import { PipeTransform } from '@angular/core';
import { SiiMenuFolder } from '../dto/menu-folder';
import * as i0 from "@angular/core";
export declare class GlobalMenuFilterPipe implements PipeTransform {
    transform(menuCategories: SiiMenuFolder[], company: string, textFilter: string): SiiMenuFolder[];
    static ɵfac: i0.ɵɵFactoryDeclaration<GlobalMenuFilterPipe, never>;
    static ɵpipe: i0.ɵɵPipeDeclaration<GlobalMenuFilterPipe, "globalMenuFilter", true>;
}
