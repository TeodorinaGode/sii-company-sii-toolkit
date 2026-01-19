import { Component, Input, HostBinding } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import * as i0 from "@angular/core";
export class BannerFeedbackComponent {
    set type(t) {
        switch (t) {
            case 'success':
                this.hostClass = 'sii-feedback-banner sii-success-feedback-banner';
                break;
            case 'error':
                this.hostClass = 'sii-feedback-banner sii-error-feedback-banner';
                break;
            case 'info':
                this.hostClass = 'sii-feedback-banner sii-info-feedback-banner';
                break;
        }
    }
    constructor(el) {
        this.el = el;
        this.hostClass = '';
    }
    ngOnInit() {
    }
    close() {
        this.el.nativeElement.dispatchEvent(new Event('SII-BANNER-FEEDBACK-CLOSE'));
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: BannerFeedbackComponent, deps: [{ token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "18.2.13", type: BannerFeedbackComponent, isStandalone: true, selector: "sii-banner-feedback", inputs: { type: "type" }, host: { properties: { "class": "this.hostClass" } }, ngImport: i0, template: "\r\n<div class=\"sii-banner-toolbar\">\r\n  <mat-icon class=\"successIcon\" svgIcon=\"sii-feedback-success\" ></mat-icon>\r\n  <mat-icon class=\"errorIcon\" svgIcon=\"sii-feedback-error\" ></mat-icon>\r\n  <mat-icon class=\"infoIcon\" svgIcon=\"sii-feedback-info\" ></mat-icon>\r\n  <ng-content select=\"[feedback-toolbar]\"></ng-content>\r\n</div>\r\n\r\n<ng-content select=\"[feedback-body]\"></ng-content>\r\n<ng-content select=\"[feedback-action]\"></ng-content>\r\n", styles: [""], dependencies: [{ kind: "component", type: MatIcon, selector: "mat-icon", inputs: ["color", "inline", "svgIcon", "fontSet", "fontIcon"], exportAs: ["matIcon"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: BannerFeedbackComponent, decorators: [{
            type: Component,
            args: [{ selector: 'sii-banner-feedback', standalone: true, imports: [MatIcon], template: "\r\n<div class=\"sii-banner-toolbar\">\r\n  <mat-icon class=\"successIcon\" svgIcon=\"sii-feedback-success\" ></mat-icon>\r\n  <mat-icon class=\"errorIcon\" svgIcon=\"sii-feedback-error\" ></mat-icon>\r\n  <mat-icon class=\"infoIcon\" svgIcon=\"sii-feedback-info\" ></mat-icon>\r\n  <ng-content select=\"[feedback-toolbar]\"></ng-content>\r\n</div>\r\n\r\n<ng-content select=\"[feedback-body]\"></ng-content>\r\n<ng-content select=\"[feedback-action]\"></ng-content>\r\n" }]
        }], ctorParameters: () => [{ type: i0.ElementRef }], propDecorators: { hostClass: [{
                type: HostBinding,
                args: ['class']
            }], type: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFubmVyLWZlZWRiYWNrLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL3NpaS10b29sa2l0L3NyYy9saWIvY29tcG9uZW50cy9mZWVkYmFjay9iYW5uZXItZmVlZGJhY2svYmFubmVyLWZlZWRiYWNrLmNvbXBvbmVudC50cyIsIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL3NpaS10b29sa2l0L3NyYy9saWIvY29tcG9uZW50cy9mZWVkYmFjay9iYW5uZXItZmVlZGJhY2svYmFubmVyLWZlZWRiYWNrLmNvbXBvbmVudC5odG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQXNCLEtBQUssRUFBRSxXQUFXLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDbEYsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLHdCQUF3QixDQUFDOztBQVNqRCxNQUFNLE9BQU8sdUJBQXVCO0lBR2xDLElBQWEsSUFBSSxDQUFDLENBQUM7UUFDakIsUUFBTyxDQUFDLEVBQUMsQ0FBQztZQUNSLEtBQUssU0FBUztnQkFBRyxJQUFJLENBQUMsU0FBUyxHQUFFLGlEQUFpRCxDQUFDO2dCQUFBLE1BQU07WUFDekYsS0FBSyxPQUFPO2dCQUFHLElBQUksQ0FBQyxTQUFTLEdBQUUsK0NBQStDLENBQUM7Z0JBQUEsTUFBTTtZQUNyRixLQUFLLE1BQU07Z0JBQUcsSUFBSSxDQUFDLFNBQVMsR0FBRSw4Q0FBOEMsQ0FBQztnQkFBQSxNQUFNO1FBQ3JGLENBQUM7SUFDSCxDQUFDO0lBRUQsWUFBb0IsRUFBYztRQUFkLE9BQUUsR0FBRixFQUFFLENBQVk7UUFWWixjQUFTLEdBQUMsRUFBRSxDQUFDO0lBVUcsQ0FBQztJQUV2QyxRQUFRO0lBQ1IsQ0FBQztJQUVNLEtBQUs7UUFDVixJQUFJLENBQUMsRUFBRSxDQUFDLGFBQWEsQ0FBQyxhQUFhLENBQUUsSUFBSSxLQUFLLENBQUMsMkJBQTJCLENBQUMsQ0FBQyxDQUFDO0lBQy9FLENBQUM7K0dBbEJVLHVCQUF1QjttR0FBdkIsdUJBQXVCLDhKQ1ZwQyx3ZEFVQSwwRERGYyxPQUFPOzs0RkFFUix1QkFBdUI7a0JBUG5DLFNBQVM7K0JBQ0kscUJBQXFCLGNBR25CLElBQUksV0FDUCxDQUFDLE9BQU8sQ0FBQzsrRUFHRSxTQUFTO3NCQUE5QixXQUFXO3VCQUFDLE9BQU87Z0JBRVAsSUFBSTtzQkFBaEIsS0FBSyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgT25Jbml0LCBFbGVtZW50UmVmLCBJbnB1dCwgSG9zdEJpbmRpbmcgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgTWF0SWNvbiB9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2ljb24nO1xyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgICBzZWxlY3RvcjogJ3NpaS1iYW5uZXItZmVlZGJhY2snLFxyXG4gICAgdGVtcGxhdGVVcmw6ICcuL2Jhbm5lci1mZWVkYmFjay5jb21wb25lbnQuaHRtbCcsXHJcbiAgICBzdHlsZVVybHM6IFsnLi9iYW5uZXItZmVlZGJhY2suY29tcG9uZW50LmNzcyddLFxyXG4gICAgc3RhbmRhbG9uZTogdHJ1ZSxcclxuICAgIGltcG9ydHM6IFtNYXRJY29uXVxyXG59KVxyXG5leHBvcnQgY2xhc3MgQmFubmVyRmVlZGJhY2tDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xyXG4gIEBIb3N0QmluZGluZygnY2xhc3MnKSBob3N0Q2xhc3M9Jyc7XHJcblxyXG4gIEBJbnB1dCgpIHNldCB0eXBlKHQpe1xyXG4gICAgc3dpdGNoKHQpe1xyXG4gICAgICBjYXNlICdzdWNjZXNzJyA6IHRoaXMuaG9zdENsYXNzPSAnc2lpLWZlZWRiYWNrLWJhbm5lciBzaWktc3VjY2Vzcy1mZWVkYmFjay1iYW5uZXInO2JyZWFrO1xyXG4gICAgICBjYXNlICdlcnJvcicgOiB0aGlzLmhvc3RDbGFzcz0gJ3NpaS1mZWVkYmFjay1iYW5uZXIgc2lpLWVycm9yLWZlZWRiYWNrLWJhbm5lcic7YnJlYWs7XHJcbiAgICAgIGNhc2UgJ2luZm8nIDogdGhpcy5ob3N0Q2xhc3M9ICdzaWktZmVlZGJhY2stYmFubmVyIHNpaS1pbmZvLWZlZWRiYWNrLWJhbm5lcic7YnJlYWs7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBjb25zdHJ1Y3RvcihwdWJsaWMgIGVsOiBFbGVtZW50UmVmKSB7IH1cclxuXHJcbiAgbmdPbkluaXQoKTogdm9pZCB7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgY2xvc2UoKXtcclxuICAgIHRoaXMuZWwubmF0aXZlRWxlbWVudC5kaXNwYXRjaEV2ZW50KCBuZXcgRXZlbnQoJ1NJSS1CQU5ORVItRkVFREJBQ0stQ0xPU0UnKSk7XHJcbiAgfVxyXG5cclxufVxyXG4iLCJcclxuPGRpdiBjbGFzcz1cInNpaS1iYW5uZXItdG9vbGJhclwiPlxyXG4gIDxtYXQtaWNvbiBjbGFzcz1cInN1Y2Nlc3NJY29uXCIgc3ZnSWNvbj1cInNpaS1mZWVkYmFjay1zdWNjZXNzXCIgPjwvbWF0LWljb24+XHJcbiAgPG1hdC1pY29uIGNsYXNzPVwiZXJyb3JJY29uXCIgc3ZnSWNvbj1cInNpaS1mZWVkYmFjay1lcnJvclwiID48L21hdC1pY29uPlxyXG4gIDxtYXQtaWNvbiBjbGFzcz1cImluZm9JY29uXCIgc3ZnSWNvbj1cInNpaS1mZWVkYmFjay1pbmZvXCIgPjwvbWF0LWljb24+XHJcbiAgPG5nLWNvbnRlbnQgc2VsZWN0PVwiW2ZlZWRiYWNrLXRvb2xiYXJdXCI+PC9uZy1jb250ZW50PlxyXG48L2Rpdj5cclxuXHJcbjxuZy1jb250ZW50IHNlbGVjdD1cIltmZWVkYmFjay1ib2R5XVwiPjwvbmctY29udGVudD5cclxuPG5nLWNvbnRlbnQgc2VsZWN0PVwiW2ZlZWRiYWNrLWFjdGlvbl1cIj48L25nLWNvbnRlbnQ+XHJcbiJdfQ==