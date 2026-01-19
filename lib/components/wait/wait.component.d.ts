import { OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { SiiWaitService } from './sii-wait.service';
import * as i0 from "@angular/core";
export declare class WaitComponent implements OnInit {
    private wait;
    display$: Observable<boolean>;
    constructor(wait: SiiWaitService);
    ngOnInit(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<WaitComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<WaitComponent, "sii-wait", never, {}, {}, never, never, true, never>;
}
