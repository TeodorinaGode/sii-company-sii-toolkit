import * as i0 from "@angular/core";
export declare class SiiWaitService {
    private _display$;
    display$: import("rxjs").Observable<boolean>;
    private semaphore;
    private _showToSkip;
    get haveShowToSkip(): boolean;
    constructor();
    hide(): void;
    show(): void;
    skipNext(): void;
    showSkipped(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<SiiWaitService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<SiiWaitService>;
}
