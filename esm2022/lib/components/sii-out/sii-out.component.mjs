import { Component, Input, HostBinding } from '@angular/core';
import * as i0 from "@angular/core";
export class SiiOutComponent {
    set appearance(val) {
        if (val !== undefined && this.appearanceProp.indexOf(val) !== -1) {
            this.hostClass = 'sii-out-appearance-' + val;
        }
        else {
            this.hostClass = 'sii-out-appearance-column';
        }
    }
    ;
    constructor() {
        this.appearanceProp = ['column', 'inline', 'column-reverse'];
        this.hostClass = 'sii-out-appearance-column';
    }
    ngOnInit() {
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: SiiOutComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "18.2.13", type: SiiOutComponent, isStandalone: true, selector: "sii-out", inputs: { appearance: "appearance" }, host: { properties: { "class": "this.hostClass" } }, ngImport: i0, template: "<span class=\"siiOUT_label\"><ng-content select=\"label\"></ng-content></span>\r\n<span class=\"siiOUT_content\"><ng-content select=\"content\"></ng-content></span>\r\n", styles: [":host{display:flex;flex-direction:column}:host.sii-out-appearance-inline{flex-direction:row}:host.sii-out-appearance-column-reverse{flex-direction:column-reverse;text-align:center;line-height:14px}:host.sii-out-appearance-column-reverse .siiOUT_label{font-size:10px;padding-right:0}:host.sii-out-appearance-column-reverse .siiOUT_content{font-size:24px;line-height:20px}:host.sii-out-appearance-column{text-align:center;line-height:14px}:host.sii-out-appearance-column .siiOUT_label{font-size:10px}:host.sii-out-appearance-column .siiOUT_content{font-size:24px}.siiOUT_label{text-transform:uppercase;padding-right:10px;letter-spacing:1px}\n"] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: SiiOutComponent, decorators: [{
            type: Component,
            args: [{ selector: 'sii-out', standalone: true, template: "<span class=\"siiOUT_label\"><ng-content select=\"label\"></ng-content></span>\r\n<span class=\"siiOUT_content\"><ng-content select=\"content\"></ng-content></span>\r\n", styles: [":host{display:flex;flex-direction:column}:host.sii-out-appearance-inline{flex-direction:row}:host.sii-out-appearance-column-reverse{flex-direction:column-reverse;text-align:center;line-height:14px}:host.sii-out-appearance-column-reverse .siiOUT_label{font-size:10px;padding-right:0}:host.sii-out-appearance-column-reverse .siiOUT_content{font-size:24px;line-height:20px}:host.sii-out-appearance-column{text-align:center;line-height:14px}:host.sii-out-appearance-column .siiOUT_label{font-size:10px}:host.sii-out-appearance-column .siiOUT_content{font-size:24px}.siiOUT_label{text-transform:uppercase;padding-right:10px;letter-spacing:1px}\n"] }]
        }], ctorParameters: () => [], propDecorators: { hostClass: [{
                type: HostBinding,
                args: ['class']
            }], appearance: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2lpLW91dC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9zaWktdG9vbGtpdC9zcmMvbGliL2NvbXBvbmVudHMvc2lpLW91dC9zaWktb3V0LmNvbXBvbmVudC50cyIsIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL3NpaS10b29sa2l0L3NyYy9saWIvY29tcG9uZW50cy9zaWktb3V0L3NpaS1vdXQuY29tcG9uZW50Lmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQVUsV0FBVyxFQUFFLE1BQU0sZUFBZSxDQUFDOztBQVF0RSxNQUFNLE9BQU8sZUFBZTtJQUkxQixJQUFhLFVBQVUsQ0FBQyxHQUFHO1FBQ3pCLElBQUcsR0FBRyxLQUFLLFNBQVMsSUFBSSxJQUFJLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBRyxDQUFDLENBQUMsRUFBQyxDQUFDO1lBQzdELElBQUksQ0FBQyxTQUFTLEdBQUMscUJBQXFCLEdBQUMsR0FBRyxDQUFDO1FBQzNDLENBQUM7YUFBSSxDQUFDO1lBQ0osSUFBSSxDQUFDLFNBQVMsR0FBQywyQkFBMkIsQ0FBQztRQUM3QyxDQUFDO0lBQ0gsQ0FBQztJQUFBLENBQUM7SUFHRjtRQVpBLG1CQUFjLEdBQUMsQ0FBQyxRQUFRLEVBQUMsUUFBUSxFQUFDLGdCQUFnQixDQUFDLENBQUM7UUFFOUIsY0FBUyxHQUFDLDJCQUEyQixDQUFDO0lBVTVDLENBQUM7SUFFakIsUUFBUTtJQUNSLENBQUM7K0dBaEJVLGVBQWU7bUdBQWYsZUFBZSw4SkNSNUIsMEtBRUE7OzRGRE1hLGVBQWU7a0JBTjNCLFNBQVM7K0JBQ0ksU0FBUyxjQUdQLElBQUk7d0RBS0ksU0FBUztzQkFBOUIsV0FBVzt1QkFBQyxPQUFPO2dCQUNQLFVBQVU7c0JBQXRCLEtBQUsiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIElucHV0LCBPbkluaXQsIEhvc3RCaW5kaW5nIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICAgIHNlbGVjdG9yOiAnc2lpLW91dCcsXHJcbiAgICB0ZW1wbGF0ZVVybDogJy4vc2lpLW91dC5jb21wb25lbnQuaHRtbCcsXHJcbiAgICBzdHlsZVVybHM6IFsnLi9zaWktb3V0LmNvbXBvbmVudC5zY3NzJ10sXHJcbiAgICBzdGFuZGFsb25lOiB0cnVlLFxyXG59KVxyXG5leHBvcnQgY2xhc3MgU2lpT3V0Q29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcclxuICBhcHBlYXJhbmNlUHJvcD1bJ2NvbHVtbicsJ2lubGluZScsJ2NvbHVtbi1yZXZlcnNlJ107XHJcblxyXG4gIEBIb3N0QmluZGluZygnY2xhc3MnKSBob3N0Q2xhc3M9J3NpaS1vdXQtYXBwZWFyYW5jZS1jb2x1bW4nO1xyXG4gIEBJbnB1dCgpIHNldCBhcHBlYXJhbmNlKHZhbCl7XHJcbiAgICBpZih2YWwgIT09IHVuZGVmaW5lZCAmJiB0aGlzLmFwcGVhcmFuY2VQcm9wLmluZGV4T2YodmFsKSE9PS0xKXtcclxuICAgICAgdGhpcy5ob3N0Q2xhc3M9J3NpaS1vdXQtYXBwZWFyYW5jZS0nK3ZhbDtcclxuICAgIH1lbHNle1xyXG4gICAgICB0aGlzLmhvc3RDbGFzcz0nc2lpLW91dC1hcHBlYXJhbmNlLWNvbHVtbic7XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcblxyXG4gIGNvbnN0cnVjdG9yKCkgeyB9XHJcblxyXG4gIG5nT25Jbml0KCkge1xyXG4gIH1cclxuXHJcbn1cclxuIiwiPHNwYW4gY2xhc3M9XCJzaWlPVVRfbGFiZWxcIj48bmctY29udGVudCBzZWxlY3Q9XCJsYWJlbFwiPjwvbmctY29udGVudD48L3NwYW4+XHJcbjxzcGFuIGNsYXNzPVwic2lpT1VUX2NvbnRlbnRcIj48bmctY29udGVudCBzZWxlY3Q9XCJjb250ZW50XCI+PC9uZy1jb250ZW50Pjwvc3Bhbj5cclxuIl19