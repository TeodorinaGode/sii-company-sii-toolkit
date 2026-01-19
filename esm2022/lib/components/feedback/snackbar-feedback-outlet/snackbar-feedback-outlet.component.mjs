import { Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { NgTemplateOutlet } from '@angular/common';
import * as i0 from "@angular/core";
import * as i1 from "@angular/material/snack-bar";
export class SnackbarFeedbackOutletComponent {
    constructor(data, snackBarRef, el) {
        this.data = data;
        this.snackBarRef = snackBarRef;
        this.el = el;
    }
    ngAfterViewInit() {
        const snackEl = this.el.nativeElement.getElementsByTagName('sii-snackbar-feedback').item(0);
        if (snackEl) {
            snackEl.addEventListener('SII-SNACKBAR-FEEDBACK', () => {
                this.doClickAction();
            });
        }
    }
    ngOnInit() {
    }
    doClickAction() {
        this.snackBarRef.dismissWithAction();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: SnackbarFeedbackOutletComponent, deps: [{ token: MAT_SNACK_BAR_DATA }, { token: i1.MatSnackBarRef }, { token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "18.2.13", type: SnackbarFeedbackOutletComponent, isStandalone: true, selector: "sii-snackbar-feedback-outlet", ngImport: i0, template: "<ng-container *ngTemplateOutlet=\"data.templateRef; context:{$implicit:data}\" ></ng-container>\r\n\r\n", dependencies: [{ kind: "directive", type: NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: SnackbarFeedbackOutletComponent, decorators: [{
            type: Component,
            args: [{ selector: 'sii-snackbar-feedback-outlet', standalone: true, imports: [NgTemplateOutlet], template: "<ng-container *ngTemplateOutlet=\"data.templateRef; context:{$implicit:data}\" ></ng-container>\r\n\r\n" }]
        }], ctorParameters: () => [{ type: undefined, decorators: [{
                    type: Inject,
                    args: [MAT_SNACK_BAR_DATA]
                }] }, { type: i1.MatSnackBarRef }, { type: i0.ElementRef }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic25hY2tiYXItZmVlZGJhY2stb3V0bGV0LmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL3NpaS10b29sa2l0L3NyYy9saWIvY29tcG9uZW50cy9mZWVkYmFjay9zbmFja2Jhci1mZWVkYmFjay1vdXRsZXQvc25hY2tiYXItZmVlZGJhY2stb3V0bGV0LmNvbXBvbmVudC50cyIsIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL3NpaS10b29sa2l0L3NyYy9saWIvY29tcG9uZW50cy9mZWVkYmFjay9zbmFja2Jhci1mZWVkYmFjay1vdXRsZXQvc25hY2tiYXItZmVlZGJhY2stb3V0bGV0LmNvbXBvbmVudC5odG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQVUsTUFBTSxFQUFvRyxNQUFNLGVBQWUsQ0FBQztBQUM1SixPQUFPLEVBQWtCLGtCQUFrQixFQUFFLE1BQU0sNkJBQTZCLENBQUM7QUFFakYsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0saUJBQWlCLENBQUM7OztBQVFuRCxNQUFNLE9BQU8sK0JBQStCO0lBRTFDLFlBQStDLElBQVMsRUFBUyxXQUE0RCxFQUNySCxFQUFjO1FBRHlCLFNBQUksR0FBSixJQUFJLENBQUs7UUFBUyxnQkFBVyxHQUFYLFdBQVcsQ0FBaUQ7UUFDckgsT0FBRSxHQUFGLEVBQUUsQ0FBWTtJQUFJLENBQUM7SUFFM0IsZUFBZTtRQUNiLE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsYUFBYSxDQUFDLG9CQUFvQixDQUFDLHVCQUF1QixDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRTVGLElBQUcsT0FBTyxFQUFDLENBQUM7WUFDVixPQUFPLENBQUMsZ0JBQWdCLENBQUMsdUJBQXVCLEVBQUMsR0FBRSxFQUFFO2dCQUNwRCxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7WUFDdEIsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDO0lBQ0gsQ0FBQztJQUVELFFBQVE7SUFDUixDQUFDO0lBRUQsYUFBYTtRQUNYLElBQUksQ0FBQyxXQUFXLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztJQUN2QyxDQUFDOytHQXBCVSwrQkFBK0Isa0JBRXRCLGtCQUFrQjttR0FGM0IsK0JBQStCLHdGQ1g1Qyx5R0FFQSw0Q0RPYyxnQkFBZ0I7OzRGQUVqQiwrQkFBK0I7a0JBTjNDLFNBQVM7K0JBQ0ksOEJBQThCLGNBRTVCLElBQUksV0FDUCxDQUFDLGdCQUFnQixDQUFDOzswQkFJaEIsTUFBTTsyQkFBQyxrQkFBa0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIE9uSW5pdCwgSW5qZWN0LCBBZnRlckNvbnRlbnRJbml0LCBWaWV3Q2hpbGQsIEFmdGVyVmlld0luaXQsIFF1ZXJ5TGlzdCwgQ29udGVudENoaWxkLCBDb250ZW50Q2hpbGRyZW4sIEVsZW1lbnRSZWYgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgTWF0U25hY2tCYXJSZWYsIE1BVF9TTkFDS19CQVJfREFUQSB9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL3NuYWNrLWJhcic7XHJcbmltcG9ydCB7IFNuYWNrYmFyRmVlZGJhY2tDb21wb25lbnQgfSBmcm9tICcuLi9zbmFja2Jhci1mZWVkYmFjay9zbmFja2Jhci1mZWVkYmFjay5jb21wb25lbnQnO1xyXG5pbXBvcnQgeyBOZ1RlbXBsYXRlT3V0bGV0IH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcclxuXHJcbkBDb21wb25lbnQoe1xyXG4gICAgc2VsZWN0b3I6ICdzaWktc25hY2tiYXItZmVlZGJhY2stb3V0bGV0JyxcclxuICAgIHRlbXBsYXRlVXJsOiAnLi9zbmFja2Jhci1mZWVkYmFjay1vdXRsZXQuY29tcG9uZW50Lmh0bWwnLFxyXG4gICAgc3RhbmRhbG9uZTogdHJ1ZSxcclxuICAgIGltcG9ydHM6IFtOZ1RlbXBsYXRlT3V0bGV0XVxyXG59KVxyXG5leHBvcnQgY2xhc3MgU25hY2tiYXJGZWVkYmFja091dGxldENvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgQWZ0ZXJWaWV3SW5pdCB7XHJcblxyXG4gIGNvbnN0cnVjdG9yKEBJbmplY3QoTUFUX1NOQUNLX0JBUl9EQVRBKSBwdWJsaWMgZGF0YTogYW55LCBwdWJsaWMgc25hY2tCYXJSZWY6IE1hdFNuYWNrQmFyUmVmPFNuYWNrYmFyRmVlZGJhY2tPdXRsZXRDb21wb25lbnQ+LFxyXG4gIHB1YmxpYyAgZWw6IEVsZW1lbnRSZWYpIHsgfVxyXG5cclxuICBuZ0FmdGVyVmlld0luaXQoKTogdm9pZCB7XHJcbiAgICBjb25zdCBzbmFja0VsID0gdGhpcy5lbC5uYXRpdmVFbGVtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdzaWktc25hY2tiYXItZmVlZGJhY2snKS5pdGVtKDApO1xyXG5cclxuICAgIGlmKHNuYWNrRWwpe1xyXG4gICAgICBzbmFja0VsLmFkZEV2ZW50TGlzdGVuZXIoJ1NJSS1TTkFDS0JBUi1GRUVEQkFDSycsKCk9PntcclxuICAgICAgIHRoaXMuZG9DbGlja0FjdGlvbigpO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIG5nT25Jbml0KCk6IHZvaWQge1xyXG4gIH1cclxuXHJcbiAgZG9DbGlja0FjdGlvbigpe1xyXG4gICAgdGhpcy5zbmFja0JhclJlZi5kaXNtaXNzV2l0aEFjdGlvbigpO1xyXG4gIH1cclxuXHJcbn1cclxuIiwiPG5nLWNvbnRhaW5lciAqbmdUZW1wbGF0ZU91dGxldD1cImRhdGEudGVtcGxhdGVSZWY7IGNvbnRleHQ6eyRpbXBsaWNpdDpkYXRhfVwiID48L25nLWNvbnRhaW5lcj5cclxuXHJcbiJdfQ==