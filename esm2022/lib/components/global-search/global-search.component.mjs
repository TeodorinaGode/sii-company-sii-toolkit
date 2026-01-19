import { Component, ViewChild, Input, forwardRef, HostBinding } from '@angular/core';
import { NG_VALUE_ACCESSOR, NG_VALIDATORS, UntypedFormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import * as i0 from "@angular/core";
import * as i1 from "@angular/forms";
export class GlobalSearchComponent {
    get haveValue() {
        return this.inputFormCtrl.value != null && this.inputFormCtrl.value.length > 0;
    }
    constructor() {
        this.label = 'Search';
        this.inputFormCtrl = new UntypedFormControl();
        this.propagateChange = () => { };
        this.onTouchedCallback = () => { };
        this.validatorCallback = () => { };
    }
    validate(control) {
        return null;
    }
    writeValue(obj) {
        this.inputFormCtrl.setValue(obj);
    }
    registerOnChange(fn) {
        this.propagateChange = fn;
    }
    registerOnTouched(fn) {
        this.onTouchedCallback = fn;
    }
    registerOnValidatorChange(fn) {
        this.validatorCallback = fn;
    }
    setDisabledState(isDisabled) {
        if (isDisabled) {
            this.inputFormCtrl.disable();
        }
        else {
            this.inputFormCtrl.enable();
        }
    }
    ngAfterViewInit() {
        this.initSiiFacet();
    }
    initSiiFacet() {
        this.inputFormCtrl.valueChanges.subscribe((val) => {
            this.propagateChange(val);
        });
    }
    focusInput() {
        this.inputElement.nativeElement.focus();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: GlobalSearchComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "18.2.13", type: GlobalSearchComponent, isStandalone: true, selector: "sii-global-search", inputs: { label: "label" }, host: { properties: { "class.globalSearchWithValue": "this.haveValue" } }, providers: [
            {
                provide: NG_VALUE_ACCESSOR,
                useExisting: forwardRef(() => GlobalSearchComponent),
                multi: true,
            },
            { provide: NG_VALIDATORS, useExisting: GlobalSearchComponent, multi: true },
        ], viewQueries: [{ propertyName: "inputElement", first: true, predicate: ["searchBox"], descendants: true }], ngImport: i0, template: "<input [formControl]=\"inputFormCtrl\"   #searchBox id=\"search-box\"\r\n    i18n-placeholder=\"@@Full_text_search\"\r\n    [placeholder]=\"label\"\r\n    type=\"text\">\r\n\r\n<mat-icon class=\"search-icon\" (click)=\"focusInput()\">search</mat-icon>\r\n\r\n", styles: [":host{display:flex;align-items:center;margin:auto 20px;height:41px;background-color:#001f36;border-radius:6px;padding:0 14px;color:#ffffff8f}.search-icon{margin:0 0 0 8px}input#search-box{flex:1 1 auto;outline:none;border:0;background:transparent;width:100%;font-size:1.1em;color:#fff}input#search-box::placeholder{color:#ffffff8f;font-size:11px;opacity:1}input#search-box:-ms-input-placeholder{color:#ffffff8f}input#search-box::-ms-input-placeholder{color:#ffffff8f}input#search-box:focus,.globalSearchWithValue{background-color:#fff!important;color:#004191}:host:focus-within,:host.globalSearchWithValue{background-color:#fff!important;color:#004191!important}:host:focus-within input#search-box,:host.globalSearchWithValue input#search-box{color:#004191!important}@media only screen and (max-width: 500px){:host{background-color:transparent}input#search-box{position:absolute;color:transparent!important;width:40px;height:50px}input#search-box:focus{display:block;position:relative;width:unset;height:unset}input#search-box::placeholder{color:transparent}input#search-box:-ms-input-placeholder{color:transparent}input#search-box::-ms-input-placeholder{color:transparent}:host:focus-within{display:flex;position:absolute;left:5px;margin:0;height:50px;top:8px;z-index:1;width:calc(100% - 10px);box-sizing:border-box}}\n"], dependencies: [{ kind: "ngmodule", type: FormsModule }, { kind: "directive", type: i1.DefaultValueAccessor, selector: "input:not([type=checkbox])[formControlName],textarea[formControlName],input:not([type=checkbox])[formControl],textarea[formControl],input:not([type=checkbox])[ngModel],textarea[ngModel],[ngDefaultControl]" }, { kind: "directive", type: i1.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "ngmodule", type: ReactiveFormsModule }, { kind: "directive", type: i1.FormControlDirective, selector: "[formControl]", inputs: ["formControl", "disabled", "ngModel"], outputs: ["ngModelChange"], exportAs: ["ngForm"] }, { kind: "component", type: MatIcon, selector: "mat-icon", inputs: ["color", "inline", "svgIcon", "fontSet", "fontIcon"], exportAs: ["matIcon"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: GlobalSearchComponent, decorators: [{
            type: Component,
            args: [{ selector: 'sii-global-search', providers: [
                        {
                            provide: NG_VALUE_ACCESSOR,
                            useExisting: forwardRef(() => GlobalSearchComponent),
                            multi: true,
                        },
                        { provide: NG_VALIDATORS, useExisting: GlobalSearchComponent, multi: true },
                    ], standalone: true, imports: [
                        FormsModule,
                        ReactiveFormsModule,
                        MatIcon,
                    ], template: "<input [formControl]=\"inputFormCtrl\"   #searchBox id=\"search-box\"\r\n    i18n-placeholder=\"@@Full_text_search\"\r\n    [placeholder]=\"label\"\r\n    type=\"text\">\r\n\r\n<mat-icon class=\"search-icon\" (click)=\"focusInput()\">search</mat-icon>\r\n\r\n", styles: [":host{display:flex;align-items:center;margin:auto 20px;height:41px;background-color:#001f36;border-radius:6px;padding:0 14px;color:#ffffff8f}.search-icon{margin:0 0 0 8px}input#search-box{flex:1 1 auto;outline:none;border:0;background:transparent;width:100%;font-size:1.1em;color:#fff}input#search-box::placeholder{color:#ffffff8f;font-size:11px;opacity:1}input#search-box:-ms-input-placeholder{color:#ffffff8f}input#search-box::-ms-input-placeholder{color:#ffffff8f}input#search-box:focus,.globalSearchWithValue{background-color:#fff!important;color:#004191}:host:focus-within,:host.globalSearchWithValue{background-color:#fff!important;color:#004191!important}:host:focus-within input#search-box,:host.globalSearchWithValue input#search-box{color:#004191!important}@media only screen and (max-width: 500px){:host{background-color:transparent}input#search-box{position:absolute;color:transparent!important;width:40px;height:50px}input#search-box:focus{display:block;position:relative;width:unset;height:unset}input#search-box::placeholder{color:transparent}input#search-box:-ms-input-placeholder{color:transparent}input#search-box::-ms-input-placeholder{color:transparent}:host:focus-within{display:flex;position:absolute;left:5px;margin:0;height:50px;top:8px;z-index:1;width:calc(100% - 10px);box-sizing:border-box}}\n"] }]
        }], ctorParameters: () => [], propDecorators: { label: [{
                type: Input
            }], inputElement: [{
                type: ViewChild,
                args: ['searchBox', { static: false }]
            }], haveValue: [{
                type: HostBinding,
                args: ['class.globalSearchWithValue']
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2xvYmFsLXNlYXJjaC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9zaWktdG9vbGtpdC9zcmMvbGliL2NvbXBvbmVudHMvZ2xvYmFsLXNlYXJjaC9nbG9iYWwtc2VhcmNoLmNvbXBvbmVudC50cyIsIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL3NpaS10b29sa2l0L3NyYy9saWIvY29tcG9uZW50cy9nbG9iYWwtc2VhcmNoL2dsb2JhbC1zZWFyY2guY29tcG9uZW50Lmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBVSxTQUFTLEVBQTZCLEtBQUssRUFBRSxVQUFVLEVBQUUsV0FBVyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBSXhILE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxhQUFhLEVBQXNFLGtCQUFrQixFQUFFLFdBQVcsRUFBRSxtQkFBbUIsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQzVMLE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSx3QkFBd0IsQ0FBQzs7O0FBcUJqRCxNQUFNLE9BQU8scUJBQXFCO0lBSWhDLElBQWdELFNBQVM7UUFDdkQsT0FBTyxJQUFJLENBQUMsYUFBYSxDQUFDLEtBQUssSUFBRSxJQUFJLElBQUksSUFBSSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFDLENBQUMsQ0FBQTtJQUFBLENBQUM7SUFRN0U7UUFaUyxVQUFLLEdBQUMsUUFBUSxDQUFDO1FBTXhCLGtCQUFhLEdBQUcsSUFBSSxrQkFBa0IsRUFBRSxDQUFDO1FBRXpDLG9CQUFlLEdBQVEsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQ2pDLHNCQUFpQixHQUFRLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztRQUNuQyxzQkFBaUIsR0FBUSxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7SUFFbkIsQ0FBQztJQUNqQixRQUFRLENBQUMsT0FBd0I7UUFDaEMsT0FBTyxJQUFJLENBQUM7SUFDYixDQUFDO0lBRUQsVUFBVSxDQUFDLEdBQVE7UUFDakIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDbkMsQ0FBQztJQUNILGdCQUFnQixDQUFDLEVBQU87UUFDcEIsSUFBSSxDQUFDLGVBQWUsR0FBRyxFQUFFLENBQUM7SUFDNUIsQ0FBQztJQUVELGlCQUFpQixDQUFDLEVBQU87UUFDdkIsSUFBSSxDQUFDLGlCQUFpQixHQUFHLEVBQUUsQ0FBQztJQUM5QixDQUFDO0lBRUQseUJBQXlCLENBQUUsRUFBYztRQUN2QyxJQUFJLENBQUMsaUJBQWlCLEdBQUcsRUFBRSxDQUFDO0lBQzlCLENBQUM7SUFDRCxnQkFBZ0IsQ0FBRSxVQUFtQjtRQUNuQyxJQUFJLFVBQVUsRUFBRSxDQUFDO1lBQ2YsSUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUMvQixDQUFDO2FBQU0sQ0FBQztZQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsTUFBTSxFQUFFLENBQUM7UUFBQyxDQUFDO0lBQ3pDLENBQUM7SUFFRCxlQUFlO1FBQ2QsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO0lBQ3JCLENBQUM7SUFFRCxZQUFZO1FBRVYsSUFBSSxDQUFDLGFBQWEsQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDLENBQUMsR0FBRyxFQUFDLEVBQUU7WUFDL0MsSUFBSSxDQUFDLGVBQWUsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUU1QixDQUFDLENBQUMsQ0FBQTtJQUNKLENBQUM7SUFFRCxVQUFVO1FBQ1IsSUFBSSxDQUFDLFlBQVksQ0FBQyxhQUFhLENBQUMsS0FBSyxFQUFFLENBQUM7SUFDMUMsQ0FBQzsrR0FwRFUscUJBQXFCO21HQUFyQixxQkFBcUIsdUtBZm5CO1lBQ1A7Z0JBQ0ksT0FBTyxFQUFFLGlCQUFpQjtnQkFDMUIsV0FBVyxFQUFFLFVBQVUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxxQkFBcUIsQ0FBQztnQkFDcEQsS0FBSyxFQUFFLElBQUk7YUFDZDtZQUNELEVBQUUsT0FBTyxFQUFFLGFBQWEsRUFBRSxXQUFXLEVBQUUscUJBQXFCLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRTtTQUM5RSxxSUNsQkwscVFBT0EsaTJDRGNRLFdBQVcsc1pBQ1gsbUJBQW1CLGtOQUNuQixPQUFPOzs0RkFHRixxQkFBcUI7a0JBbkJqQyxTQUFTOytCQUNJLG1CQUFtQixhQUdsQjt3QkFDUDs0QkFDSSxPQUFPLEVBQUUsaUJBQWlCOzRCQUMxQixXQUFXLEVBQUUsVUFBVSxDQUFDLEdBQUcsRUFBRSxzQkFBc0IsQ0FBQzs0QkFDcEQsS0FBSyxFQUFFLElBQUk7eUJBQ2Q7d0JBQ0QsRUFBRSxPQUFPLEVBQUUsYUFBYSxFQUFFLFdBQVcsdUJBQXVCLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRTtxQkFDOUUsY0FDVyxJQUFJLFdBQ1A7d0JBQ0wsV0FBVzt3QkFDWCxtQkFBbUI7d0JBQ25CLE9BQU87cUJBQ1Y7d0RBR00sS0FBSztzQkFBYixLQUFLO2dCQUNzQyxZQUFZO3NCQUF2RCxTQUFTO3VCQUFDLFdBQVcsRUFBRSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUU7Z0JBRU8sU0FBUztzQkFBeEQsV0FBVzt1QkFBQyw2QkFBNkIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIE9uSW5pdCwgVmlld0NoaWxkLCBBZnRlclZpZXdJbml0LCBFbGVtZW50UmVmLCBJbnB1dCwgZm9yd2FyZFJlZiwgSG9zdEJpbmRpbmcgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgZnJvbUV2ZW50IH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7IG1hcCwgZGlzdGluY3RVbnRpbENoYW5nZWQsIGRlYm91bmNlVGltZSB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcclxuaW1wb3J0IHsgRmFjZXRzQ29udGFpbmVyQ29tcG9uZW50IH0gZnJvbSAnLi4vZmFjZXRzL2ZhY2V0cy1jb250YWluZXIvZmFjZXRzLWNvbnRhaW5lci5jb21wb25lbnQnO1xyXG5pbXBvcnQgeyBOR19WQUxVRV9BQ0NFU1NPUiwgTkdfVkFMSURBVE9SUywgQ29udHJvbFZhbHVlQWNjZXNzb3IsIFZhbGlkYXRvciwgQWJzdHJhY3RDb250cm9sLCBWYWxpZGF0aW9uRXJyb3JzLCBVbnR5cGVkRm9ybUNvbnRyb2wsIEZvcm1zTW9kdWxlLCBSZWFjdGl2ZUZvcm1zTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xyXG5pbXBvcnQgeyBNYXRJY29uIH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvaWNvbic7XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICAgIHNlbGVjdG9yOiAnc2lpLWdsb2JhbC1zZWFyY2gnLFxyXG4gICAgdGVtcGxhdGVVcmw6ICcuL2dsb2JhbC1zZWFyY2guY29tcG9uZW50Lmh0bWwnLFxyXG4gICAgc3R5bGVVcmxzOiBbJy4vZ2xvYmFsLXNlYXJjaC5jb21wb25lbnQuY3NzJ10sXHJcbiAgICBwcm92aWRlcnM6IFtcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHByb3ZpZGU6IE5HX1ZBTFVFX0FDQ0VTU09SLFxyXG4gICAgICAgICAgICB1c2VFeGlzdGluZzogZm9yd2FyZFJlZigoKSA9PiBHbG9iYWxTZWFyY2hDb21wb25lbnQpLFxyXG4gICAgICAgICAgICBtdWx0aTogdHJ1ZSxcclxuICAgICAgICB9LFxyXG4gICAgICAgIHsgcHJvdmlkZTogTkdfVkFMSURBVE9SUywgdXNlRXhpc3Rpbmc6IEdsb2JhbFNlYXJjaENvbXBvbmVudCwgbXVsdGk6IHRydWUgfSxcclxuICAgIF0sXHJcbiAgICBzdGFuZGFsb25lOiB0cnVlLFxyXG4gICAgaW1wb3J0czogW1xyXG4gICAgICAgIEZvcm1zTW9kdWxlLFxyXG4gICAgICAgIFJlYWN0aXZlRm9ybXNNb2R1bGUsXHJcbiAgICAgICAgTWF0SWNvbixcclxuICAgIF0sXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBHbG9iYWxTZWFyY2hDb21wb25lbnQgaW1wbGVtZW50cyBBZnRlclZpZXdJbml0LCBDb250cm9sVmFsdWVBY2Nlc3NvciwgVmFsaWRhdG9yIHtcclxuICBASW5wdXQoKSBsYWJlbD0nU2VhcmNoJztcclxuICBAVmlld0NoaWxkKCdzZWFyY2hCb3gnLCB7IHN0YXRpYzogZmFsc2UgfSkgIGlucHV0RWxlbWVudDogRWxlbWVudFJlZjtcclxuXHJcbiAgQEhvc3RCaW5kaW5nKCdjbGFzcy5nbG9iYWxTZWFyY2hXaXRoVmFsdWUnKSBnZXQgaGF2ZVZhbHVlKCl7XHJcbiAgICByZXR1cm4gdGhpcy5pbnB1dEZvcm1DdHJsLnZhbHVlIT1udWxsICYmIHRoaXMuaW5wdXRGb3JtQ3RybC52YWx1ZS5sZW5ndGg+MH1cclxuXHJcbiAgaW5wdXRGb3JtQ3RybCA9IG5ldyBVbnR5cGVkRm9ybUNvbnRyb2woKTtcclxuXHJcbiAgcHJvcGFnYXRlQ2hhbmdlOiBhbnkgPSAoKSA9PiB7IH07XHJcbiAgb25Ub3VjaGVkQ2FsbGJhY2s6IGFueSA9ICgpID0+IHsgfTtcclxuICB2YWxpZGF0b3JDYWxsYmFjazogYW55ID0gKCkgPT4geyB9O1xyXG5cclxuICBjb25zdHJ1Y3RvcigpIHsgfVxyXG4gIHZhbGlkYXRlKGNvbnRyb2w6IEFic3RyYWN0Q29udHJvbCk6IFZhbGlkYXRpb25FcnJvcnMge1xyXG4gICByZXR1cm4gbnVsbDtcclxuICB9XHJcblxyXG4gIHdyaXRlVmFsdWUob2JqOiBhbnkpOiB2b2lkIHtcclxuICAgIHRoaXMuaW5wdXRGb3JtQ3RybC5zZXRWYWx1ZShvYmopO1xyXG4gIH1cclxucmVnaXN0ZXJPbkNoYW5nZShmbjogYW55KTogdm9pZCB7XHJcbiAgICB0aGlzLnByb3BhZ2F0ZUNoYW5nZSA9IGZuO1xyXG4gIH1cclxuXHJcbiAgcmVnaXN0ZXJPblRvdWNoZWQoZm46IGFueSkge1xyXG4gICAgdGhpcy5vblRvdWNoZWRDYWxsYmFjayA9IGZuO1xyXG4gIH1cclxuXHJcbiAgcmVnaXN0ZXJPblZhbGlkYXRvckNoYW5nZT8oZm46ICgpID0+IHZvaWQpOiB2b2lkIHtcclxuICAgIHRoaXMudmFsaWRhdG9yQ2FsbGJhY2sgPSBmbjtcclxuICB9XHJcbiAgc2V0RGlzYWJsZWRTdGF0ZT8oaXNEaXNhYmxlZDogYm9vbGVhbik6IHZvaWQge1xyXG4gICAgaWYgKGlzRGlzYWJsZWQpIHtcclxuICAgICAgdGhpcy5pbnB1dEZvcm1DdHJsLmRpc2FibGUoKTtcclxuICAgIH0gZWxzZSB7IHRoaXMuaW5wdXRGb3JtQ3RybC5lbmFibGUoKTsgfVxyXG4gIH1cclxuXHJcbiAgbmdBZnRlclZpZXdJbml0KCk6IHZvaWQge1xyXG4gICB0aGlzLmluaXRTaWlGYWNldCgpO1xyXG4gIH1cclxuXHJcbiAgaW5pdFNpaUZhY2V0KCl7XHJcblxyXG4gICAgdGhpcy5pbnB1dEZvcm1DdHJsLnZhbHVlQ2hhbmdlcy5zdWJzY3JpYmUoKHZhbCk9PntcclxuICAgICAgdGhpcy5wcm9wYWdhdGVDaGFuZ2UodmFsKTtcclxuXHJcbiAgICB9KVxyXG4gIH1cclxuXHJcbiAgZm9jdXNJbnB1dCgpIHtcclxuICAgIHRoaXMuaW5wdXRFbGVtZW50Lm5hdGl2ZUVsZW1lbnQuZm9jdXMoKTtcclxuICB9XHJcblxyXG59XHJcbiIsIjxpbnB1dCBbZm9ybUNvbnRyb2xdPVwiaW5wdXRGb3JtQ3RybFwiICAgI3NlYXJjaEJveCBpZD1cInNlYXJjaC1ib3hcIlxyXG4gICAgaTE4bi1wbGFjZWhvbGRlcj1cIkBARnVsbF90ZXh0X3NlYXJjaFwiXHJcbiAgICBbcGxhY2Vob2xkZXJdPVwibGFiZWxcIlxyXG4gICAgdHlwZT1cInRleHRcIj5cclxuXHJcbjxtYXQtaWNvbiBjbGFzcz1cInNlYXJjaC1pY29uXCIgKGNsaWNrKT1cImZvY3VzSW5wdXQoKVwiPnNlYXJjaDwvbWF0LWljb24+XHJcblxyXG4iXX0=