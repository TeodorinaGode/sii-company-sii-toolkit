import { Component, Input, HostBinding } from '@angular/core';
import * as i0 from "@angular/core";
export class BadgeComponent {
    set appearance(val) {
        if (val !== undefined && this.primaryColors.indexOf(val) !== -1) {
            this.hostClass = 'sii-badge-appearance-' + val;
        }
        else {
            this.hostClass = '';
        }
    }
    ;
    set background(val) {
        if (this.hostClass === '') {
            this.styleBgColor = val;
        }
    }
    ;
    set color(val) {
        if (this.hostClass === '') {
            this.styleColor = val;
        }
    }
    ;
    constructor() {
        this.primaryColors = ['warning', 'error', 'success', 'info'];
        this.hostClass = '';
        this.styleBgColor = '';
        this.styleColor = '';
    }
    ngOnInit() {
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: BadgeComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "18.2.13", type: BadgeComponent, isStandalone: true, selector: "sii-badge", inputs: { appearance: "appearance", background: "background", color: "color" }, host: { properties: { "class": "this.hostClass", "style.backgroundColor": "this.styleBgColor", "style.color": "this.styleColor" } }, ngImport: i0, template: "<ng-content></ng-content>\r\n", styles: [":host{background-color:gray;border-radius:12px;color:#fff;font-size:11px;line-height:14px;padding:5px 12px;letter-spacing:.33px;font-weight:lighter}\n"] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: BadgeComponent, decorators: [{
            type: Component,
            args: [{ selector: 'sii-badge', standalone: true, template: "<ng-content></ng-content>\r\n", styles: [":host{background-color:gray;border-radius:12px;color:#fff;font-size:11px;line-height:14px;padding:5px 12px;letter-spacing:.33px;font-weight:lighter}\n"] }]
        }], ctorParameters: () => [], propDecorators: { hostClass: [{
                type: HostBinding,
                args: ['class']
            }], appearance: [{
                type: Input
            }], styleBgColor: [{
                type: HostBinding,
                args: ['style.backgroundColor']
            }], background: [{
                type: Input
            }], styleColor: [{
                type: HostBinding,
                args: ['style.color']
            }], color: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFkZ2UuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvc2lpLXRvb2xraXQvc3JjL2xpYi9jb21wb25lbnRzL2JhZGdlL2JhZGdlLmNvbXBvbmVudC50cyIsIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL3NpaS10b29sa2l0L3NyYy9saWIvY29tcG9uZW50cy9iYWRnZS9iYWRnZS5jb21wb25lbnQuaHRtbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFVLEtBQUssRUFBRSxXQUFXLEVBQUUsTUFBTSxlQUFlLENBQUM7O0FBUXRFLE1BQU0sT0FBTyxjQUFjO0lBSXpCLElBQWEsVUFBVSxDQUFDLEdBQUc7UUFDekIsSUFBRyxHQUFHLEtBQUssU0FBUyxJQUFJLElBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFHLENBQUMsQ0FBQyxFQUFDLENBQUM7WUFDNUQsSUFBSSxDQUFDLFNBQVMsR0FBQyx1QkFBdUIsR0FBQyxHQUFHLENBQUM7UUFDN0MsQ0FBQzthQUFJLENBQUM7WUFDSixJQUFJLENBQUMsU0FBUyxHQUFDLEVBQUUsQ0FBQztRQUNwQixDQUFDO0lBQ0gsQ0FBQztJQUFBLENBQUM7SUFHRixJQUFhLFVBQVUsQ0FBQyxHQUFHO1FBQ3pCLElBQUcsSUFBSSxDQUFDLFNBQVMsS0FBRyxFQUFFLEVBQUMsQ0FBQztZQUN0QixJQUFJLENBQUMsWUFBWSxHQUFDLEdBQUcsQ0FBQztRQUN4QixDQUFDO0lBQ0gsQ0FBQztJQUFBLENBQUM7SUFHRixJQUFhLEtBQUssQ0FBQyxHQUFHO1FBQ3BCLElBQUcsSUFBSSxDQUFDLFNBQVMsS0FBRyxFQUFFLEVBQUMsQ0FBQztZQUN0QixJQUFJLENBQUMsVUFBVSxHQUFDLEdBQUcsQ0FBQztRQUN0QixDQUFDO0lBQ0gsQ0FBQztJQUFBLENBQUM7SUFJRjtRQTFCQSxrQkFBYSxHQUFDLENBQUMsU0FBUyxFQUFDLE9BQU8sRUFBQyxTQUFTLEVBQUMsTUFBTSxDQUFDLENBQUM7UUFDN0IsY0FBUyxHQUFDLEVBQUUsQ0FBQztRQVNHLGlCQUFZLEdBQUMsRUFBRSxDQUFDO1FBTzFCLGVBQVUsR0FBQyxFQUFFLENBQUM7SUFTMUIsQ0FBQztJQUVqQixRQUFRO0lBQ1IsQ0FBQzsrR0EvQlUsY0FBYzttR0FBZCxjQUFjLDBSQ1IzQiwrQkFDQTs7NEZET2EsY0FBYztrQkFOMUIsU0FBUzsrQkFDSSxXQUFXLGNBR1QsSUFBSTt3REFLSSxTQUFTO3NCQUE5QixXQUFXO3VCQUFDLE9BQU87Z0JBQ1AsVUFBVTtzQkFBdEIsS0FBSztnQkFRZ0MsWUFBWTtzQkFBakQsV0FBVzt1QkFBQyx1QkFBdUI7Z0JBQ3ZCLFVBQVU7c0JBQXRCLEtBQUs7Z0JBTXNCLFVBQVU7c0JBQXJDLFdBQVc7dUJBQUMsYUFBYTtnQkFDYixLQUFLO3NCQUFqQixLQUFLIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBPbkluaXQsIElucHV0LCBIb3N0QmluZGluZyB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgICBzZWxlY3RvcjogJ3NpaS1iYWRnZScsXHJcbiAgICB0ZW1wbGF0ZVVybDogJy4vYmFkZ2UuY29tcG9uZW50Lmh0bWwnLFxyXG4gICAgc3R5bGVVcmxzOiBbJy4vYmFkZ2UuY29tcG9uZW50LmNzcyddLFxyXG4gICAgc3RhbmRhbG9uZTogdHJ1ZVxyXG59KVxyXG5leHBvcnQgY2xhc3MgQmFkZ2VDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xyXG4gIFxyXG4gIHByaW1hcnlDb2xvcnM9Wyd3YXJuaW5nJywnZXJyb3InLCdzdWNjZXNzJywnaW5mbyddO1xyXG4gIEBIb3N0QmluZGluZygnY2xhc3MnKSBob3N0Q2xhc3M9Jyc7XHJcbiAgQElucHV0KCkgc2V0IGFwcGVhcmFuY2UodmFsKXtcclxuICAgIGlmKHZhbCAhPT0gdW5kZWZpbmVkICYmIHRoaXMucHJpbWFyeUNvbG9ycy5pbmRleE9mKHZhbCkhPT0tMSl7XHJcbiAgICAgIHRoaXMuaG9zdENsYXNzPSdzaWktYmFkZ2UtYXBwZWFyYW5jZS0nK3ZhbDtcclxuICAgIH1lbHNle1xyXG4gICAgICB0aGlzLmhvc3RDbGFzcz0nJztcclxuICAgIH1cclxuICB9O1xyXG5cclxuICBASG9zdEJpbmRpbmcoJ3N0eWxlLmJhY2tncm91bmRDb2xvcicpIHN0eWxlQmdDb2xvcj0nJztcclxuICBASW5wdXQoKSBzZXQgYmFja2dyb3VuZCh2YWwpe1xyXG4gICAgaWYodGhpcy5ob3N0Q2xhc3M9PT0nJyl7XHJcbiAgICAgIHRoaXMuc3R5bGVCZ0NvbG9yPXZhbDtcclxuICAgIH1cclxuICB9O1xyXG5cclxuICBASG9zdEJpbmRpbmcoJ3N0eWxlLmNvbG9yJykgc3R5bGVDb2xvcj0nJztcclxuICBASW5wdXQoKSBzZXQgY29sb3IodmFsKXtcclxuICAgIGlmKHRoaXMuaG9zdENsYXNzPT09Jycpe1xyXG4gICAgICB0aGlzLnN0eWxlQ29sb3I9dmFsO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG5cclxuXHJcbiAgY29uc3RydWN0b3IoKSB7IH1cclxuXHJcbiAgbmdPbkluaXQoKTogdm9pZCB7XHJcbiAgfVxyXG5cclxufVxyXG4iLCI8bmctY29udGVudD48L25nLWNvbnRlbnQ+XHJcbiJdfQ==