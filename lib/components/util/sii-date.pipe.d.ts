import { PipeTransform } from '@angular/core';
import { SiiToolkitService } from '../../sii-toolkit.service';
import * as i0 from "@angular/core";
export declare class SiiDatePipe implements PipeTransform {
    private siiToolkitService;
    constructor(siiToolkitService: SiiToolkitService);
    transform(date: Date | string | Array<any> | number, showTime?: boolean): string;
    static ɵfac: i0.ɵɵFactoryDeclaration<SiiDatePipe, never>;
    static ɵpipe: i0.ɵɵPipeDeclaration<SiiDatePipe, "siiDate", true>;
}
