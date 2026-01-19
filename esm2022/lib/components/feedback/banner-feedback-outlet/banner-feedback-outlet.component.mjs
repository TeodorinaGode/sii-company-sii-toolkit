import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgTemplateOutlet } from '@angular/common';
import * as i0 from "@angular/core";
import * as i1 from "@angular/material/dialog";
export class BannerFeedbackOutletComponent {
    constructor(dialogRef, data, el) {
        this.dialogRef = dialogRef;
        this.data = data;
        this.el = el;
    }
    ngAfterViewInit() {
        const bannerEl = this.el.nativeElement.getElementsByTagName('sii-banner-feedback').item(0);
        if (bannerEl) {
            bannerEl.addEventListener('SII-BANNER-FEEDBACK-CLOSE', () => {
                this.dialogRef.close();
            });
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: BannerFeedbackOutletComponent, deps: [{ token: i1.MatDialogRef }, { token: MAT_DIALOG_DATA }, { token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "18.2.13", type: BannerFeedbackOutletComponent, isStandalone: true, selector: "sii-banner-feedback-outlet", ngImport: i0, template: "<ng-container *ngTemplateOutlet=\"data.templateRef; context:{$implicit:data}\" ></ng-container>\r\n\r\n", dependencies: [{ kind: "directive", type: NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: BannerFeedbackOutletComponent, decorators: [{
            type: Component,
            args: [{ selector: 'sii-banner-feedback-outlet', standalone: true, imports: [NgTemplateOutlet], template: "<ng-container *ngTemplateOutlet=\"data.templateRef; context:{$implicit:data}\" ></ng-container>\r\n\r\n" }]
        }], ctorParameters: () => [{ type: i1.MatDialogRef }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [MAT_DIALOG_DATA]
                }] }, { type: i0.ElementRef }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFubmVyLWZlZWRiYWNrLW91dGxldC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9zaWktdG9vbGtpdC9zcmMvbGliL2NvbXBvbmVudHMvZmVlZGJhY2svYmFubmVyLWZlZWRiYWNrLW91dGxldC9iYW5uZXItZmVlZGJhY2stb3V0bGV0LmNvbXBvbmVudC50cyIsIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL3NpaS10b29sa2l0L3NyYy9saWIvY29tcG9uZW50cy9mZWVkYmFjay9iYW5uZXItZmVlZGJhY2stb3V0bGV0L2Jhbm5lci1mZWVkYmFjay1vdXRsZXQuY29tcG9uZW50Lmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBVSxNQUFNLEVBQTZCLE1BQU0sZUFBZSxDQUFDO0FBQ3JGLE9BQU8sRUFBRSxlQUFlLEVBQWdCLE1BQU0sMEJBQTBCLENBQUM7QUFDekUsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0saUJBQWlCLENBQUM7OztBQVFuRCxNQUFNLE9BQU8sNkJBQTZCO0lBRXhDLFlBQW1CLFNBQXNELEVBQ3ZDLElBQVMsRUFBUyxFQUFjO1FBRC9DLGNBQVMsR0FBVCxTQUFTLENBQTZDO1FBQ3ZDLFNBQUksR0FBSixJQUFJLENBQUs7UUFBUyxPQUFFLEdBQUYsRUFBRSxDQUFZO0lBQy9ELENBQUM7SUFHRCxlQUFlO1FBQ2QsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxhQUFhLENBQUMsb0JBQW9CLENBQUMscUJBQXFCLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDM0YsSUFBRyxRQUFRLEVBQUMsQ0FBQztZQUNYLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQywyQkFBMkIsRUFBQyxHQUFFLEVBQUU7Z0JBQ3pELElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLENBQUM7WUFDeEIsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDO0lBQ0gsQ0FBQzsrR0FkUSw2QkFBNkIsOENBRzlCLGVBQWU7bUdBSGQsNkJBQTZCLHNGQ1YxQyx5R0FFQSw0Q0RNYyxnQkFBZ0I7OzRGQUVqQiw2QkFBNkI7a0JBTnpDLFNBQVM7K0JBQ0ksNEJBQTRCLGNBRTFCLElBQUksV0FDUCxDQUFDLGdCQUFnQixDQUFDOzswQkFLMUIsTUFBTTsyQkFBQyxlQUFlIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBPbkluaXQsIEluamVjdCwgRWxlbWVudFJlZiwgQWZ0ZXJWaWV3SW5pdCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBNQVRfRElBTE9HX0RBVEEsIE1hdERpYWxvZ1JlZiB9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2RpYWxvZyc7XHJcbmltcG9ydCB7IE5nVGVtcGxhdGVPdXRsZXQgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgICBzZWxlY3RvcjogJ3NpaS1iYW5uZXItZmVlZGJhY2stb3V0bGV0JyxcclxuICAgIHRlbXBsYXRlVXJsOiAnLi9iYW5uZXItZmVlZGJhY2stb3V0bGV0LmNvbXBvbmVudC5odG1sJyxcclxuICAgIHN0YW5kYWxvbmU6IHRydWUsXHJcbiAgICBpbXBvcnRzOiBbTmdUZW1wbGF0ZU91dGxldF0sXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBCYW5uZXJGZWVkYmFja091dGxldENvbXBvbmVudCBpbXBsZW1lbnRzIEFmdGVyVmlld0luaXQge1xyXG5cclxuICBjb25zdHJ1Y3RvcihwdWJsaWMgZGlhbG9nUmVmOiBNYXREaWFsb2dSZWY8QmFubmVyRmVlZGJhY2tPdXRsZXRDb21wb25lbnQ+LFxyXG4gICAgQEluamVjdChNQVRfRElBTE9HX0RBVEEpIHB1YmxpYyBkYXRhOiBhbnkscHVibGljICBlbDogRWxlbWVudFJlZikge1xyXG4gICAgIH1cclxuXHJcblxyXG4gICAgIG5nQWZ0ZXJWaWV3SW5pdCgpOiB2b2lkIHtcclxuICAgICAgY29uc3QgYmFubmVyRWwgPSB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ3NpaS1iYW5uZXItZmVlZGJhY2snKS5pdGVtKDApO1xyXG4gICAgICBpZihiYW5uZXJFbCl7XHJcbiAgICAgICAgYmFubmVyRWwuYWRkRXZlbnRMaXN0ZW5lcignU0lJLUJBTk5FUi1GRUVEQkFDSy1DTE9TRScsKCk9PntcclxuICAgICAgICAgdGhpcy5kaWFsb2dSZWYuY2xvc2UoKTtcclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuXHJcbn1cclxuIiwiPG5nLWNvbnRhaW5lciAqbmdUZW1wbGF0ZU91dGxldD1cImRhdGEudGVtcGxhdGVSZWY7IGNvbnRleHQ6eyRpbXBsaWNpdDpkYXRhfVwiID48L25nLWNvbnRhaW5lcj5cclxuXHJcbiJdfQ==