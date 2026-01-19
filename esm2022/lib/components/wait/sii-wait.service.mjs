import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import * as i0 from "@angular/core";
export class SiiWaitService {
    get haveShowToSkip() { return this._showToSkip > 0; }
    constructor() {
        // tslint:disable-next-line:variable-name
        this._display$ = new BehaviorSubject(false);
        this.display$ = this._display$.asObservable().pipe(
        // tap((val: boolean ) => { console.log(val);}),
        distinctUntilChanged());
        this.semaphore = 0;
        this._showToSkip = 0;
    }
    hide() {
        this.semaphore--;
        if (this.semaphore < 0) {
            this.semaphore = 0;
        }
        if (this.semaphore === 0) {
            Promise.resolve().then(() => this._display$.next(false));
        }
    }
    show() {
        if (this.semaphore === 0) {
            Promise.resolve().then(() => this._display$.next(true));
        }
        this.semaphore++;
    }
    skipNext() {
        this._showToSkip++;
    }
    showSkipped() {
        this._showToSkip--;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: SiiWaitService, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: SiiWaitService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: SiiWaitService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: () => [] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2lpLXdhaXQuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL3NpaS10b29sa2l0L3NyYy9saWIvY29tcG9uZW50cy93YWl0L3NpaS13YWl0LnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMzQyxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQ3ZDLE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxNQUFNLGdCQUFnQixDQUFDOztBQUt0RCxNQUFNLE9BQU8sY0FBYztJQVN6QixJQUFJLGNBQWMsS0FBRyxPQUFPLElBQUksQ0FBQyxXQUFXLEdBQUcsQ0FBQyxDQUFDLENBQUEsQ0FBQztJQUNsRDtRQVJBLHlDQUF5QztRQUNqQyxjQUFTLEdBQUcsSUFBSSxlQUFlLENBQVUsS0FBSyxDQUFDLENBQUM7UUFDeEQsYUFBUSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsWUFBWSxFQUFFLENBQUMsSUFBSTtRQUMzQyxnREFBZ0Q7UUFDaEQsb0JBQW9CLEVBQUUsQ0FBQyxDQUFDO1FBQ2xCLGNBQVMsR0FBRyxDQUFDLENBQUM7UUFDZCxnQkFBVyxHQUFFLENBQUMsQ0FBQztJQUVQLENBQUM7SUFFakIsSUFBSTtRQUNGLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztRQUNqQixJQUFJLElBQUksQ0FBQyxTQUFTLEdBQUcsQ0FBQyxFQUFHLENBQUM7WUFDeEIsSUFBSSxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUM7UUFDckIsQ0FBQztRQUNELElBQUksSUFBSSxDQUFDLFNBQVMsS0FBSyxDQUFDLEVBQUUsQ0FBQztZQUN6QixPQUFPLENBQUMsT0FBTyxFQUFFLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUMzQixJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FDMUIsQ0FBQztRQUNKLENBQUM7SUFDSCxDQUFDO0lBRUQsSUFBSTtRQUNGLElBQUksSUFBSSxDQUFDLFNBQVMsS0FBSyxDQUFDLEVBQUUsQ0FBQztZQUN6QixPQUFPLENBQUMsT0FBTyxFQUFFLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUM1QixJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FDeEIsQ0FBQztRQUNKLENBQUM7UUFDRCxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7SUFDbkIsQ0FBQztJQUVELFFBQVE7UUFDTixJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7SUFDckIsQ0FBQztJQUNELFdBQVc7UUFDVCxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7SUFDckIsQ0FBQzsrR0F0Q1UsY0FBYzttSEFBZCxjQUFjLGNBRmIsTUFBTTs7NEZBRVAsY0FBYztrQkFIMUIsVUFBVTttQkFBQztvQkFDVixVQUFVLEVBQUUsTUFBTTtpQkFDbkIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IEJlaGF2aW9yU3ViamVjdCB9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQgeyBkaXN0aW5jdFVudGlsQ2hhbmdlZCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcclxuXHJcbkBJbmplY3RhYmxlKHtcclxuICBwcm92aWRlZEluOiAncm9vdCdcclxufSlcclxuZXhwb3J0IGNsYXNzIFNpaVdhaXRTZXJ2aWNlIHtcclxuXHJcbiAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOnZhcmlhYmxlLW5hbWVcclxuICBwcml2YXRlIF9kaXNwbGF5JCA9IG5ldyBCZWhhdmlvclN1YmplY3Q8Ym9vbGVhbj4oZmFsc2UpO1xyXG4gIGRpc3BsYXkkID0gdGhpcy5fZGlzcGxheSQuYXNPYnNlcnZhYmxlKCkucGlwZShcclxuICAgIC8vIHRhcCgodmFsOiBib29sZWFuICkgPT4geyBjb25zb2xlLmxvZyh2YWwpO30pLFxyXG4gICAgZGlzdGluY3RVbnRpbENoYW5nZWQoKSk7XHJcbiAgcHJpdmF0ZSBzZW1hcGhvcmUgPSAwO1xyXG4gIHByaXZhdGUgX3Nob3dUb1NraXAgPTA7XHJcbiAgZ2V0IGhhdmVTaG93VG9Ta2lwKCl7cmV0dXJuIHRoaXMuX3Nob3dUb1NraXAgPiAwO31cclxuICBjb25zdHJ1Y3RvcigpIHsgfVxyXG5cclxuICBoaWRlKCkge1xyXG4gICAgdGhpcy5zZW1hcGhvcmUtLTtcclxuICAgIGlmICh0aGlzLnNlbWFwaG9yZSA8IDAgKSB7XHJcbiAgICAgIHRoaXMuc2VtYXBob3JlID0gMDtcclxuICAgIH1cclxuICAgIGlmICh0aGlzLnNlbWFwaG9yZSA9PT0gMCkge1xyXG4gICAgICBQcm9taXNlLnJlc29sdmUoKS50aGVuKCgpID0+XHJcbiAgICAgICB0aGlzLl9kaXNwbGF5JC5uZXh0KGZhbHNlKVxyXG4gICAgICApO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgc2hvdygpIHtcclxuICAgIGlmICh0aGlzLnNlbWFwaG9yZSA9PT0gMCkge1xyXG4gICAgICBQcm9taXNlLnJlc29sdmUoKS50aGVuKCgpID0+XHJcbiAgICAgIHRoaXMuX2Rpc3BsYXkkLm5leHQodHJ1ZSlcclxuICAgICAgKTtcclxuICAgIH1cclxuICAgIHRoaXMuc2VtYXBob3JlKys7XHJcbiAgfVxyXG5cclxuICBza2lwTmV4dCgpe1xyXG4gICAgdGhpcy5fc2hvd1RvU2tpcCsrO1xyXG4gIH1cclxuICBzaG93U2tpcHBlZCgpe1xyXG4gICAgdGhpcy5fc2hvd1RvU2tpcC0tO1xyXG4gIH1cclxufVxyXG4iXX0=