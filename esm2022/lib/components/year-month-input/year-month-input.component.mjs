import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { Component, EventEmitter, Inject, Input, Optional, Output, Self, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_FORM_FIELD, MatFormFieldControl } from '@angular/material/form-field';
import { Subject } from 'rxjs';
import * as i0 from "@angular/core";
import * as i1 from "@angular/forms";
import * as i2 from "@angular/cdk/a11y";
import * as i3 from "@angular/material/form-field";
/** Data structure for holding year month item. */
export class SiiYearMonth {
    constructor(year, month) {
        this.year = year;
        this.month = month;
    }
}
/** Custom `MatFormFieldControl` for telephone number input. */
export class YearMonthInputComponent {
    get empty() {
        const { value: { year, month } } = this.parts;
        return !month && !year;
    }
    get emptyMonth() {
        const { value: { month } } = this.parts;
        return !month;
    }
    get emptyYear() {
        const { value: { year } } = this.parts;
        return !year;
    }
    get shouldLabelFloat() {
        return this.focused || !this.empty;
    }
    get placeholder() {
        return this._placeholder;
    }
    set placeholder(value) {
        this._placeholder = value;
        this.stateChanges.next();
    }
    get required() {
        return this._required;
    }
    set required(value) {
        this._required = coerceBooleanProperty(value);
        this.stateChanges.next();
    }
    get disabled() {
        return this._disabled;
    }
    set disabled(value) {
        this._disabled = coerceBooleanProperty(value);
        this._disabled ? this.parts.disable() : this.parts.enable();
        this.stateChanges.next();
    }
    get value() {
        if (this.parts.valid) {
            const { value: { year, month } } = this.parts;
            return new SiiYearMonth(year, month);
        }
        return null;
    }
    set value(my) {
        const { year, month } = my || new SiiYearMonth('', '');
        this.parts.setValue({ year, month });
        this.stateChanges.next();
    }
    get errorState() {
        return (this.parts.dirty || (!!this.ngControl && this.ngControl.control.touched))
            &&
                this.isInvalid;
    }
    get isInvalid() {
        return this.required ? (this.emptyMonth || this.emptyYear || this.parts.invalid)
            : ((this.emptyMonth && !this.emptyYear) || (!this.emptyMonth && this.emptyYear) || (!this.empty && this.parts.invalid));
    }
    get isValid() {
        return !this.isInvalid;
    }
    constructor(formBuilder, focusMonitor, elementRef, formField, ngControl) {
        this.focusMonitor = focusMonitor;
        this.elementRef = elementRef;
        this.formField = formField;
        this.ngControl = ngControl;
        this.valueChange = new EventEmitter();
        this.stateChanges = new Subject();
        this.focused = false;
        this.controlType = 'sii-year-month-input';
        this.id = `sii-year-month-input-${YearMonthInputComponent.nextId++}`;
        this._required = false;
        this._disabled = false;
        this.onChange = (_) => { };
        this.onTouched = () => { };
        this.parts = formBuilder.group({
            month: [null, validMonth(this.required)],
            year: [null, validYear(this.required)]
        });
        focusMonitor.monitor(elementRef, true).subscribe(origin => {
            if (this.focused && !origin) {
                this.onTouched();
            }
            this.focused = !!origin;
            this.stateChanges.next();
        });
        if (this.ngControl != null) {
            this.ngControl.valueAccessor = this;
        }
    }
    static { this.nextId = 0; }
    ngAfterViewInit() {
        if (!!this.ngControl) {
            if (hasRequiredField(this.ngControl.control)) {
                this.required = true;
            }
            Promise.resolve().then(() => {
                this.ngControl.control.setValidators(this.validate.bind(this));
                this.ngControl.control.updateValueAndValidity();
            });
        }
    }
    autoFocusNext(control, nextElement) {
        if (!control.errors && nextElement) {
            this.focusMonitor.focusVia(nextElement, 'program');
        }
    }
    autoFocusPrev(control, prevElement) {
        if ((control.value || '').length < 1) {
            this.focusMonitor.focusVia(prevElement, 'program');
        }
    }
    ngOnDestroy() {
        this.stateChanges.complete();
        this.focusMonitor.stopMonitoring(this.elementRef);
    }
    setDescribedByIds(ids) {
        const controlElement = this.elementRef.nativeElement.querySelector('.sii-year-month-input-container');
        controlElement.setAttribute('aria-describedby', ids.join(' '));
    }
    onContainerClick(ev) {
        if (ev.target.tagName !== 'INPUT') {
            if (!this.emptyYear && this.parts.controls.year.valid) {
                this.focusMonitor.focusVia(this.monthInput, 'program');
            }
            else {
                this.focusMonitor.focusVia(this.yearInput, 'program');
            }
        }
    }
    writeValue(tel) {
        this.value = tel;
    }
    registerOnChange(fn) {
        this.onChange = fn;
    }
    registerOnTouched(fn) {
        this.onTouched = fn;
    }
    setDisabledState(isDisabled) {
        this.disabled = isDisabled;
    }
    validate(c) {
        return this.isInvalid ? { invalid: true } : null;
    }
    _handleInput(control, nextElement) {
        this.autoFocusNext(control, nextElement);
        this.onChange(this.value);
        this.valueChange.emit(this.value);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: YearMonthInputComponent, deps: [{ token: i1.UntypedFormBuilder }, { token: i2.FocusMonitor }, { token: i0.ElementRef }, { token: MAT_FORM_FIELD, optional: true }, { token: i1.NgControl, optional: true, self: true }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "18.2.13", type: YearMonthInputComponent, isStandalone: true, selector: "sii-year-month-input", inputs: { placeholder: "placeholder", required: "required", disabled: "disabled", value: "value", userAriaDescribedBy: ["aria-describedby", "userAriaDescribedBy"] }, outputs: { valueChange: "valueChange" }, host: { properties: { "class.example-floating": "shouldLabelFloat", "id": "id" } }, providers: [{ provide: MatFormFieldControl, useExisting: YearMonthInputComponent }], viewQueries: [{ propertyName: "yearInput", first: true, predicate: ["year"], descendants: true }, { propertyName: "monthInput", first: true, predicate: ["month"], descendants: true }], ngImport: i0, template: "<div role=\"group\" class=\"sii-year-month-input-container\"\r\n     [formGroup]=\"parts\"\r\n     [attr.aria-labelledby]=\"formField?.getLabelId()\">\r\n  <input class=\"sii-year-month-input-element\" style=\"width:45px\"\r\n         formControlName=\"year\"\r\n         maxLength=\"4\"\r\n         size=\"4\"\r\n         placeholder=\"YYYY\"\r\n         aria-label=\"Year\"\r\n         (input)=\"_handleInput(parts.controls.year,month)\"\r\n         #year>\r\n  <span class=\"sii-year-month-input-spacer\">/</span>\r\n  <input class=\"sii-year-month-input-element\" style=\"margin-left: 5px;\"\r\n         formControlName=\"month\" size=\"2\"\r\n         maxLength=\"2\"\r\n         placeholder=\"MM\"\r\n         aria-label=\"Month\"\r\n         (input)=\"_handleInput(parts.controls.month)\"\r\n         (keyup.backspace)=\"autoFocusPrev(parts.controls.month, year)\"\r\n         #month>\r\n\r\n</div>\r\n", styles: [".sii-year-month-input-container{display:flex}.sii-year-month-input-element{border:none;background:none;padding:0;outline:none;font:inherit}.sii-year-month-input-spacer,.sii-year-month-input-element{opacity:0;transition:opacity .2s}:host.example-floating .sii-year-month-input-spacer,:host.example-floating .sii-year-month-input-element{opacity:1}\n"], dependencies: [{ kind: "ngmodule", type: FormsModule }, { kind: "directive", type: i1.DefaultValueAccessor, selector: "input:not([type=checkbox])[formControlName],textarea[formControlName],input:not([type=checkbox])[formControl],textarea[formControl],input:not([type=checkbox])[ngModel],textarea[ngModel],[ngDefaultControl]" }, { kind: "directive", type: i1.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i1.NgControlStatusGroup, selector: "[formGroupName],[formArrayName],[ngModelGroup],[formGroup],form:not([ngNoForm]),[ngForm]" }, { kind: "ngmodule", type: ReactiveFormsModule }, { kind: "directive", type: i1.FormGroupDirective, selector: "[formGroup]", inputs: ["formGroup"], outputs: ["ngSubmit"], exportAs: ["ngForm"] }, { kind: "directive", type: i1.FormControlName, selector: "[formControlName]", inputs: ["formControlName", "disabled", "ngModel"], outputs: ["ngModelChange"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: YearMonthInputComponent, decorators: [{
            type: Component,
            args: [{ selector: 'sii-year-month-input', providers: [{ provide: MatFormFieldControl, useExisting: YearMonthInputComponent }], host: {
                        '[class.example-floating]': 'shouldLabelFloat',
                        '[id]': 'id',
                    }, standalone: true, imports: [FormsModule, ReactiveFormsModule], template: "<div role=\"group\" class=\"sii-year-month-input-container\"\r\n     [formGroup]=\"parts\"\r\n     [attr.aria-labelledby]=\"formField?.getLabelId()\">\r\n  <input class=\"sii-year-month-input-element\" style=\"width:45px\"\r\n         formControlName=\"year\"\r\n         maxLength=\"4\"\r\n         size=\"4\"\r\n         placeholder=\"YYYY\"\r\n         aria-label=\"Year\"\r\n         (input)=\"_handleInput(parts.controls.year,month)\"\r\n         #year>\r\n  <span class=\"sii-year-month-input-spacer\">/</span>\r\n  <input class=\"sii-year-month-input-element\" style=\"margin-left: 5px;\"\r\n         formControlName=\"month\" size=\"2\"\r\n         maxLength=\"2\"\r\n         placeholder=\"MM\"\r\n         aria-label=\"Month\"\r\n         (input)=\"_handleInput(parts.controls.month)\"\r\n         (keyup.backspace)=\"autoFocusPrev(parts.controls.month, year)\"\r\n         #month>\r\n\r\n</div>\r\n", styles: [".sii-year-month-input-container{display:flex}.sii-year-month-input-element{border:none;background:none;padding:0;outline:none;font:inherit}.sii-year-month-input-spacer,.sii-year-month-input-element{opacity:0;transition:opacity .2s}:host.example-floating .sii-year-month-input-spacer,:host.example-floating .sii-year-month-input-element{opacity:1}\n"] }]
        }], ctorParameters: () => [{ type: i1.UntypedFormBuilder }, { type: i2.FocusMonitor }, { type: i0.ElementRef }, { type: i3.MatFormField, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [MAT_FORM_FIELD]
                }] }, { type: i1.NgControl, decorators: [{
                    type: Optional
                }, {
                    type: Self
                }] }], propDecorators: { valueChange: [{
                type: Output
            }], placeholder: [{
                type: Input
            }], required: [{
                type: Input
            }], disabled: [{
                type: Input
            }], value: [{
                type: Input
            }], yearInput: [{
                type: ViewChild,
                args: ['year']
            }], monthInput: [{
                type: ViewChild,
                args: ['month']
            }], userAriaDescribedBy: [{
                type: Input,
                args: ['aria-describedby']
            }] } });
export function validMonth(required) {
    return (control) => {
        let valid = false;
        const validMonthValue = (m) => m.length === 2 && !isNaN(Number(m)) && Number(m) >= 1 && Number(m) <= 12;
        if (required) {
            valid = !isEmpty(control.value) && validMonthValue(control.value);
        }
        else {
            valid = isEmpty(control.value) || validMonthValue(control.value);
        }
        return !valid ? { invalidMonth: { value: control.value } } : null;
    };
}
export function validYear(required) {
    return (control) => {
        let valid = false;
        const validYearValue = (m) => m.length === 4 && !isNaN(Number(m)) && Number(m) >= 1;
        if (required) {
            valid = !isEmpty(control.value) && validYearValue(control.value);
        }
        else {
            valid = isEmpty(control.value) || validYearValue(control.value);
        }
        return !valid ? { invalidYear: { value: control.value } } : null;
    };
}
export function isEmpty(item) {
    return item == null || item === undefined || item.length === 0;
}
export const hasRequiredField = (abstractControl) => {
    if (abstractControl.validator) {
        const validator = abstractControl.validator({});
        if (validator && validator.required) {
            return true;
        }
    }
    // if (abstractControl.controls) {
    //     for (const controlName in abstractControl.controls) {
    //         if (abstractControl.controls[controlName]) {
    //             if (hasRequiredField(abstractControl.controls[controlName])) {
    //                 return true;
    //             }
    //         }
    //     }
    // }
    return false;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoieWVhci1tb250aC1pbnB1dC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9zaWktdG9vbGtpdC9zcmMvbGliL2NvbXBvbmVudHMveWVhci1tb250aC1pbnB1dC95ZWFyLW1vbnRoLWlucHV0LmNvbXBvbmVudC50cyIsIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL3NpaS10b29sa2l0L3NyYy9saWIvY29tcG9uZW50cy95ZWFyLW1vbnRoLWlucHV0L3llYXItbW9udGgtaW5wdXQuY29tcG9uZW50Lmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0EsT0FBTyxFQUFDLHFCQUFxQixFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFDNUQsT0FBTyxFQUVMLFNBQVMsRUFFVCxZQUFZLEVBQ1osTUFBTSxFQUNOLEtBQUssRUFFTCxRQUFRLEVBQ1IsTUFBTSxFQUNOLElBQUksRUFDSixTQUFTLEVBQ1YsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUErSyxXQUFXLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUMvTyxPQUFPLEVBQUMsY0FBYyxFQUFnQixtQkFBbUIsRUFBQyxNQUFNLDhCQUE4QixDQUFDO0FBQy9GLE9BQU8sRUFBQyxPQUFPLEVBQUMsTUFBTSxNQUFNLENBQUM7Ozs7O0FBSTdCLGtEQUFrRDtBQUNsRCxNQUFNLE9BQU8sWUFBWTtJQUN2QixZQUNTLElBQVksRUFDWixLQUFhO1FBRGIsU0FBSSxHQUFKLElBQUksQ0FBUTtRQUNaLFVBQUssR0FBTCxLQUFLLENBQVE7SUFDbkIsQ0FBQztDQUNMO0FBRUQsK0RBQStEO0FBYS9ELE1BQU0sT0FBTyx1QkFBdUI7SUFLbEMsSUFBSSxLQUFLO1FBQ1AsTUFBTSxFQUNKLEtBQUssRUFBRSxFQUFFLElBQUksRUFBQyxLQUFLLEVBQUUsRUFDdEIsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO1FBRWYsT0FBTyxD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QUksSUFBSSxJQUFJLElBQUssSUFBSSxLQUFLLFNBQVMsSUFBSSxJQUFJLENBQUMsTUFBTSxLQUFNLENBQUMsQ0FBQztBQUNuRSxDQUFDO0FBRUQsTUFBTSxDQUFDLE1BQU0sZ0JBQWdCLEdBQUcsQ0FBQyxlQUFnQyxFQUFXLEVBQUU7SUFDNUUsSUFBSSxlQUFlLENBQUMsU0FBUyxFQUFFLENBQUM7UUFDNUIsTUFBTSxTQUFTLEdBQUcsZUFBZSxDQUFDLFNBQVMsQ0FBQyxFQUFvQixDQUFDLENBQUM7UUFDbEUsSUFBSSxTQUFTLElBQUksU0FBUyxDQUFDLFFBQVEsRUFBRSxDQUFDO1lBQ2xDLE9BQU8sSUFBSSxDQUFDO1FBQ2hCLENBQUM7SUFDTCxDQUFDO0lBQ0Qsa0NBQWtDO0lBQ2xDLDREQUE0RDtJQUM1RCx1REFBdUQ7SUFDdkQsNkVBQTZFO0lBQzdFLCtCQUErQjtJQUMvQixnQkFBZ0I7SUFDaEIsWUFBWTtJQUNaLFFBQVE7SUFDUixJQUFJO0lBQ0osT0FBTyxLQUFLLENBQUM7QUFDZixDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0ZvY3VzTW9uaXRvcn0gZnJvbSAnQGFuZ3VsYXIvY2RrL2ExMXknO1xyXG5pbXBvcnQge2NvZXJjZUJvb2xlYW5Qcm9wZXJ0eX0gZnJvbSAnQGFuZ3VsYXIvY2RrL2NvZXJjaW9uJztcclxuaW1wb3J0IHtcclxuICBBZnRlclZpZXdJbml0LFxyXG4gIENvbXBvbmVudCxcclxuICBFbGVtZW50UmVmLFxyXG4gIEV2ZW50RW1pdHRlcixcclxuICBJbmplY3QsXHJcbiAgSW5wdXQsXHJcbiAgT25EZXN0cm95LFxyXG4gIE9wdGlvbmFsLFxyXG4gIE91dHB1dCxcclxuICBTZWxmLFxyXG4gIFZpZXdDaGlsZFxyXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBBYnN0cmFjdENvbnRyb2wsIENvbnRyb2xWYWx1ZUFjY2Vzc29yLCBVbnR5cGVkRm9ybUJ1aWxkZXIsIFVudHlwZWRGb3JtQ29udHJvbCwgRm9ybUNvbnRyb2xEaXJlY3RpdmUsIFVudHlwZWRGb3JtR3JvdXAsIE5nQ29udHJvbCwgVmFsaWRhdGlvbkVycm9ycywgVmFsaWRhdG9yRm4sIFZhbGlkYXRvcnMsIEZvcm1zTW9kdWxlLCBSZWFjdGl2ZUZvcm1zTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xyXG5pbXBvcnQge01BVF9GT1JNX0ZJRUxELCBNYXRGb3JtRmllbGQsIE1hdEZvcm1GaWVsZENvbnRyb2x9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2Zvcm0tZmllbGQnO1xyXG5pbXBvcnQge1N1YmplY3R9IGZyb20gJ3J4anMnO1xyXG5cclxuXHJcblxyXG4vKiogRGF0YSBzdHJ1Y3R1cmUgZm9yIGhvbGRpbmcgeWVhciBtb250aCBpdGVtLiAqL1xyXG5leHBvcnQgY2xhc3MgU2lpWWVhck1vbnRoIHtcclxuICBjb25zdHJ1Y3RvcihcclxuICAgIHB1YmxpYyB5ZWFyOiBzdHJpbmcsXHJcbiAgICBwdWJsaWMgbW9udGg6IHN0cmluZ1xyXG4gICkge31cclxufVxyXG5cclxuLyoqIEN1c3RvbSBgTWF0Rm9ybUZpZWxkQ29udHJvbGAgZm9yIHRlbGVwaG9uZSBudW1iZXIgaW5wdXQuICovXHJcbkBDb21wb25lbnQoe1xyXG4gICAgc2VsZWN0b3I6ICdzaWkteWVhci1tb250aC1pbnB1dCcsXHJcbiAgICB0ZW1wbGF0ZVVybDogJy4veWVhci1tb250aC1pbnB1dC5jb21wb25lbnQuaHRtbCcsXHJcbiAgICBzdHlsZVVybHM6IFsnLi95ZWFyLW1vbnRoLWlucHV0LmNvbXBvbmVudC5zY3NzJ10sXHJcbiAgICBwcm92aWRlcnM6IFt7IHByb3ZpZGU6IE1hdEZvcm1GaWVsZENvbnRyb2wsIHVzZUV4aXN0aW5nOiBZZWFyTW9udGhJbnB1dENvbXBvbmVudCB9XSxcclxuICAgIGhvc3Q6IHtcclxuICAgICAgICAnW2NsYXNzLmV4YW1wbGUtZmxvYXRpbmddJzogJ3Nob3VsZExhYmVsRmxvYXQnLFxyXG4gICAgICAgICdbaWRdJzogJ2lkJyxcclxuICAgIH0sXHJcbiAgICBzdGFuZGFsb25lOiB0cnVlLFxyXG4gICAgaW1wb3J0czogW0Zvcm1zTW9kdWxlLCBSZWFjdGl2ZUZvcm1zTW9kdWxlXVxyXG59KVxyXG5leHBvcnQgY2xhc3MgWWVhck1vbnRoSW5wdXRDb21wb25lbnRcclxuICBpbXBsZW1lbnRzIENvbnRyb2xWYWx1ZUFjY2Vzc29yLCBNYXRGb3JtRmllbGRDb250cm9sPFNpaVllYXJNb250aD4sIE9uRGVzdHJveSwgQWZ0ZXJWaWV3SW5pdCB7XHJcblxyXG4gIEBPdXRwdXQoKSB2YWx1ZUNoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXI8U2lpWWVhck1vbnRoPigpO1xyXG5cclxuICBnZXQgZW1wdHkoKSB7XHJcbiAgICBjb25zdCB7XHJcbiAgICAgIHZhbHVlOiB7IHllYXIsbW9udGggfVxyXG4gICAgfSA9IHRoaXMucGFydHM7XHJcblxyXG4gICAgcmV0dXJuICFtb250aCAmJiAheWVhciA7XHJcbiAgfVxyXG4gIGdldCBlbXB0eU1vbnRoKCkge1xyXG4gICAgY29uc3Qge1xyXG4gICAgICB2YWx1ZTogeyBtb250aCB9XHJcbiAgICB9ID0gdGhpcy5wYXJ0cztcclxuXHJcbiAgICByZXR1cm4gIW1vbnRoIDtcclxuICB9XHJcbiAgZ2V0IGVtcHR5WWVhcigpIHtcclxuICAgIGNvbnN0IHtcclxuICAgICAgdmFsdWU6IHsgeWVhciB9XHJcbiAgICB9ID0gdGhpcy5wYXJ0cztcclxuXHJcbiAgICByZXR1cm4gIXllYXIgO1xyXG4gIH1cclxuXHJcblxyXG5cclxuICBnZXQgc2hvdWxkTGFiZWxGbG9hdCgpIHtcclxuICAgIHJldHVybiB0aGlzLmZvY3VzZWQgfHwgIXRoaXMuZW1wdHk7XHJcbiAgfVxyXG5cclxuICBASW5wdXQoKVxyXG4gIGdldCBwbGFjZWhvbGRlcigpOiBzdHJpbmcge1xyXG4gICAgcmV0dXJuIHRoaXMuX3BsYWNlaG9sZGVyO1xyXG4gIH1cclxuICBzZXQgcGxhY2Vob2xkZXIodmFsdWU6IHN0cmluZykge1xyXG4gICAgdGhpcy5fcGxhY2Vob2xkZXIgPSB2YWx1ZTtcclxuICAgIHRoaXMuc3RhdGVDaGFuZ2VzLm5leHQoKTtcclxuICB9XHJcblxyXG4gIEBJbnB1dCgpXHJcbiAgZ2V0IHJlcXVpcmVkKCk6IGJvb2xlYW4ge1xyXG4gICAgcmV0dXJuIHRoaXMuX3JlcXVpcmVkO1xyXG4gIH1cclxuICBzZXQgcmVxdWlyZWQodmFsdWU6IGJvb2xlYW4pIHtcclxuICAgIHRoaXMuX3JlcXVpcmVkID0gY29lcmNlQm9vbGVhblByb3BlcnR5KHZhbHVlKTtcclxuICAgIHRoaXMuc3RhdGVDaGFuZ2VzLm5leHQoKTtcclxuICB9XHJcblxyXG4gIEBJbnB1dCgpXHJcbiAgZ2V0IGRpc2FibGVkKCk6IGJvb2xlYW4ge1xyXG4gICAgcmV0dXJuIHRoaXMuX2Rpc2FibGVkO1xyXG4gIH1cclxuICBzZXQgZGlzYWJsZWQodmFsdWU6IGJvb2xlYW4pIHtcclxuICAgIHRoaXMuX2Rpc2FibGVkID0gY29lcmNlQm9vbGVhblByb3BlcnR5KHZhbHVlKTtcclxuICAgIHRoaXMuX2Rpc2FibGVkID8gdGhpcy5wYXJ0cy5kaXNhYmxlKCkgOiB0aGlzLnBhcnRzLmVuYWJsZSgpO1xyXG4gICAgdGhpcy5zdGF0ZUNoYW5nZXMubmV4dCgpO1xyXG4gIH1cclxuXHJcbiAgQElucHV0KClcclxuICBnZXQgdmFsdWUoKTogU2lpWWVhck1vbnRoIHwgbnVsbCB7XHJcbiAgICBpZiAodGhpcy5wYXJ0cy52YWxpZCkge1xyXG4gICAgICBjb25zdCB7XHJcbiAgICAgICAgdmFsdWU6IHsgeWVhcixtb250aCB9XHJcbiAgICAgIH0gPSB0aGlzLnBhcnRzO1xyXG4gICAgICByZXR1cm4gbmV3IFNpaVllYXJNb250aCh5ZWFyLG1vbnRoKTtcclxuICAgIH1cclxuICAgIHJldHVybiBudWxsO1xyXG4gIH1cclxuICBzZXQgdmFsdWUobXk6IFNpaVllYXJNb250aCB8IG51bGwpIHtcclxuICAgIGNvbnN0IHsgeWVhcixtb250aCB9ID0gbXkgfHwgbmV3IFNpaVllYXJNb250aCgnJywgJycpO1xyXG4gICAgdGhpcy5wYXJ0cy5zZXRWYWx1ZSh7IHllYXIsbW9udGggfSk7XHJcbiAgICB0aGlzLnN0YXRlQ2hhbmdlcy5uZXh0KCk7XHJcbiAgfVxyXG5cclxuICBnZXQgZXJyb3JTdGF0ZSgpOiBib29sZWFuIHtcclxuICAgIHJldHVybiAodGhpcy5wYXJ0cy5kaXJ0eSB8fCAoISF0aGlzLm5nQ29udHJvbCAmJiB0aGlzLm5nQ29udHJvbC5jb250cm9sLnRvdWNoZWQpKVxyXG4gICAgJiZcclxuICAgIHRoaXMuaXNJbnZhbGlkXHJcbiAgICA7XHJcbiAgfVxyXG5cclxuICBnZXQgaXNJbnZhbGlkKCl7XHJcbiAgICAgIHJldHVybiAgIHRoaXMucmVxdWlyZWQgPyAoIHRoaXMuZW1wdHlNb250aCB8fCB0aGlzLmVtcHR5WWVhciB8fCB0aGlzLnBhcnRzLmludmFsaWQgKVxyXG4gICAgICAgICAgICAgICAgOiAoICh0aGlzLmVtcHR5TW9udGggJiYgIXRoaXMuZW1wdHlZZWFyKSB8fCAoIXRoaXMuZW1wdHlNb250aCAmJiB0aGlzLmVtcHR5WWVhcikgfHwgICghdGhpcy5lbXB0eSAmJiB0aGlzLnBhcnRzLmludmFsaWQpKTtcclxuICB9XHJcblxyXG4gIGdldCBpc1ZhbGlkKCl7XHJcbiAgICByZXR1cm4gIXRoaXMuaXNJbnZhbGlkO1xyXG4gIH1cclxuXHJcbiAgY29uc3RydWN0b3IoXHJcbiAgICBmb3JtQnVpbGRlcjogVW50eXBlZEZvcm1CdWlsZGVyLFxyXG4gICAgcHJpdmF0ZSBmb2N1c01vbml0b3I6IEZvY3VzTW9uaXRvcixcclxuICAgIHByaXZhdGUgZWxlbWVudFJlZjogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4sXHJcbiAgICBAT3B0aW9uYWwoKSBASW5qZWN0KE1BVF9GT1JNX0ZJRUxEKSBwdWJsaWMgZm9ybUZpZWxkOiBNYXRGb3JtRmllbGQsXHJcbiAgICBAT3B0aW9uYWwoKSBAU2VsZigpIHB1YmxpYyBuZ0NvbnRyb2w6IE5nQ29udHJvbCkge1xyXG5cclxuICAgIHRoaXMucGFydHMgPSBmb3JtQnVpbGRlci5ncm91cCh7XHJcbiAgICAgIG1vbnRoOiBbbnVsbCwgdmFsaWRNb250aCh0aGlzLnJlcXVpcmVkKV0sXHJcbiAgICAgIHllYXI6IFtudWxsLCB2YWxpZFllYXIodGhpcy5yZXF1aXJlZCldXHJcbiAgICB9KTtcclxuXHJcblxyXG4gICAgZm9jdXNNb25pdG9yLm1vbml0b3IoZWxlbWVudFJlZiwgdHJ1ZSkuc3Vic2NyaWJlKG9yaWdpbiA9PiB7XHJcbiAgICAgIGlmICh0aGlzLmZvY3VzZWQgJiYgIW9yaWdpbikge1xyXG4gICAgICAgIHRoaXMub25Ub3VjaGVkKCk7XHJcbiAgICAgIH1cclxuICAgICAgdGhpcy5mb2N1c2VkID0gISFvcmlnaW47XHJcbiAgICAgIHRoaXMuc3RhdGVDaGFuZ2VzLm5leHQoKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGlmKHRoaXMubmdDb250cm9sIT1udWxsKXtcclxuICAgICAgdGhpcy5uZ0NvbnRyb2wudmFsdWVBY2Nlc3NvciA9IHRoaXM7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBzdGF0aWMgbmV4dElkID0gMDtcclxuXHJcbiAgLy8gc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX2Rpc2FibGVkOiBib29sZWFuIHwgc3RyaW5nIHwgbnVsbCB8IHVuZGVmaW5lZDtcclxuICAvLyBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfcmVxdWlyZWQ6IGJvb2xlYW4gfCBzdHJpbmcgfCBudWxsIHwgdW5kZWZpbmVkO1xyXG4gIEBWaWV3Q2hpbGQoJ3llYXInKSB5ZWFySW5wdXQ6IEhUTUxJbnB1dEVsZW1lbnQ7XHJcbiAgQFZpZXdDaGlsZCgnbW9udGgnKSBtb250aElucHV0OiBIVE1MSW5wdXRFbGVtZW50O1xyXG5cclxuICBwYXJ0czogVW50eXBlZEZvcm1Hcm91cDtcclxuICBzdGF0ZUNoYW5nZXMgPSBuZXcgU3ViamVjdDx2b2lkPigpO1xyXG4gIGZvY3VzZWQgPSBmYWxzZTtcclxuICBjb250cm9sVHlwZSA9ICdzaWkteWVhci1tb250aC1pbnB1dCc7XHJcbiAgaWQgPSBgc2lpLXllYXItbW9udGgtaW5wdXQtJHtZZWFyTW9udGhJbnB1dENvbXBvbmVudC5uZXh0SWQrK31gO1xyXG5cclxuICBASW5wdXQoJ2FyaWEtZGVzY3JpYmVkYnknKSB1c2VyQXJpYURlc2NyaWJlZEJ5OiBzdHJpbmc7XHJcbiAgcHJpdmF0ZSBfcGxhY2Vob2xkZXI6IHN0cmluZztcclxuICBwcml2YXRlIF9yZXF1aXJlZCA9IGZhbHNlO1xyXG4gIHByaXZhdGUgX2Rpc2FibGVkID0gZmFsc2U7XHJcblxyXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpOiB2b2lkIHtcclxuICAgIGlmKCEhdGhpcy5uZ0NvbnRyb2wpe1xyXG4gICAgICBpZiAoaGFzUmVxdWlyZWRGaWVsZCh0aGlzLm5nQ29udHJvbC5jb250cm9sKSl7XHJcbiAgICAgICAgdGhpcy5yZXF1aXJlZCA9IHRydWU7XHJcbiAgICAgIH1cclxuICAgICAgUHJvbWlzZS5yZXNvbHZlKCkudGhlbigoKSA9PiB7XHJcbiAgICAgICAgdGhpcy5uZ0NvbnRyb2wuY29udHJvbC5zZXRWYWxpZGF0b3JzKHRoaXMudmFsaWRhdGUuYmluZCh0aGlzKSk7XHJcbiAgICAgICAgdGhpcy5uZ0NvbnRyb2wuY29udHJvbC51cGRhdGVWYWx1ZUFuZFZhbGlkaXR5KCk7XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH1cclxuICBvbkNoYW5nZSA9IChfOiBhbnkpID0+IHt9O1xyXG4gIG9uVG91Y2hlZCA9ICgpID0+IHt9O1xyXG5cclxuICBhdXRvRm9jdXNOZXh0KGNvbnRyb2w6IEFic3RyYWN0Q29udHJvbCwgbmV4dEVsZW1lbnQ/OiBIVE1MSW5wdXRFbGVtZW50KTogdm9pZCB7XHJcbiAgICBpZiAoIWNvbnRyb2wuZXJyb3JzICYmIG5leHRFbGVtZW50KSB7XHJcbiAgICAgIHRoaXMuZm9jdXNNb25pdG9yLmZvY3VzVmlhKG5leHRFbGVtZW50LCAncHJvZ3JhbScpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgYXV0b0ZvY3VzUHJldihjb250cm9sOiBBYnN0cmFjdENvbnRyb2wsIHByZXZFbGVtZW50OiBIVE1MSW5wdXRFbGVtZW50KTogdm9pZCB7XHJcbiAgICBpZiAoKGNvbnRyb2wudmFsdWUgfHwgJycpLmxlbmd0aCA8IDEpIHtcclxuICAgICAgdGhpcy5mb2N1c01vbml0b3IuZm9jdXNWaWEocHJldkVsZW1lbnQsICdwcm9ncmFtJyk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBuZ09uRGVzdHJveSgpIHtcclxuICAgIHRoaXMuc3RhdGVDaGFuZ2VzLmNvbXBsZXRlKCk7XHJcbiAgICB0aGlzLmZvY3VzTW9uaXRvci5zdG9wTW9uaXRvcmluZyh0aGlzLmVsZW1lbnRSZWYpO1xyXG4gIH1cclxuXHJcbiAgc2V0RGVzY3JpYmVkQnlJZHMoaWRzOiBzdHJpbmdbXSkge1xyXG4gICAgY29uc3QgY29udHJvbEVsZW1lbnQgPSB0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuc2lpLXllYXItbW9udGgtaW5wdXQtY29udGFpbmVyJykhO1xyXG4gICAgY29udHJvbEVsZW1lbnQuc2V0QXR0cmlidXRlKCdhcmlhLWRlc2NyaWJlZGJ5JywgaWRzLmpvaW4oJyAnKSk7XHJcbiAgfVxyXG5cclxuICBvbkNvbnRhaW5lckNsaWNrKGV2KSB7XHJcblxyXG4gICAgaWYgKGV2LnRhcmdldC50YWdOYW1lICE9PSAnSU5QVVQnKXtcclxuICAgICAgaWYgKCF0aGlzLmVtcHR5WWVhciAmJiB0aGlzLnBhcnRzLmNvbnRyb2xzLnllYXIudmFsaWQpIHtcclxuICAgICAgIHRoaXMuZm9jdXNNb25pdG9yLmZvY3VzVmlhKHRoaXMubW9udGhJbnB1dCwgJ3Byb2dyYW0nKTtcclxuICAgICB9IGVsc2Uge1xyXG4gICAgICAgdGhpcy5mb2N1c01vbml0b3IuZm9jdXNWaWEodGhpcy55ZWFySW5wdXQsICdwcm9ncmFtJyk7XHJcbiAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgd3JpdGVWYWx1ZSh0ZWw6IFNpaVllYXJNb250aCB8IG51bGwpOiB2b2lkIHtcclxuICAgIHRoaXMudmFsdWUgPSB0ZWw7XHJcbiAgfVxyXG5cclxuICByZWdpc3Rlck9uQ2hhbmdlKGZuOiBhbnkpOiB2b2lkIHtcclxuICAgIHRoaXMub25DaGFuZ2UgPSBmbjtcclxuICB9XHJcblxyXG4gIHJlZ2lzdGVyT25Ub3VjaGVkKGZuOiBhbnkpOiB2b2lkIHtcclxuICAgIHRoaXMub25Ub3VjaGVkID0gZm47XHJcbiAgfVxyXG5cclxuICBzZXREaXNhYmxlZFN0YXRlKGlzRGlzYWJsZWQ6IGJvb2xlYW4pOiB2b2lkIHtcclxuICAgIHRoaXMuZGlzYWJsZWQgPSBpc0Rpc2FibGVkO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIHZhbGlkYXRlKGM6IFVudHlwZWRGb3JtQ29udHJvbCk6IFZhbGlkYXRpb25FcnJvcnMge1xyXG4gICAgcmV0dXJuIHRoaXMuaXNJbnZhbGlkID8gIHtpbnZhbGlkOiB0cnVlfSA6IG51bGw7XHJcbn1cclxuXHJcblxyXG4gIF9oYW5kbGVJbnB1dChjb250cm9sOiBBYnN0cmFjdENvbnRyb2wsIG5leHRFbGVtZW50PzogSFRNTElucHV0RWxlbWVudCk6IHZvaWQge1xyXG4gICAgdGhpcy5hdXRvRm9jdXNOZXh0KGNvbnRyb2wsIG5leHRFbGVtZW50KTtcclxuICAgIHRoaXMub25DaGFuZ2UodGhpcy52YWx1ZSk7XHJcbiAgICB0aGlzLnZhbHVlQ2hhbmdlLmVtaXQodGhpcy52YWx1ZSk7XHJcbiAgfVxyXG59XHJcblxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHZhbGlkTW9udGgocmVxdWlyZWQ6IGJvb2xlYW4pOiBWYWxpZGF0b3JGbiB7XHJcbiAgcmV0dXJuIChjb250cm9sOiBBYnN0cmFjdENvbnRyb2wpOiB7W2tleTogc3RyaW5nXTogYW55fSB8IG51bGwgPT4ge1xyXG4gICAgbGV0IHZhbGlkID0gZmFsc2U7XHJcbiAgICBjb25zdCB2YWxpZE1vbnRoVmFsdWUgPSAobSkgPT4gbS5sZW5ndGggPT09IDIgJiYgIWlzTmFOKE51bWJlcihtKSkgJiYgTnVtYmVyKG0pID49IDEgJiYgTnVtYmVyKG0pIDw9IDEyO1xyXG4gICAgaWYgKHJlcXVpcmVkKXtcclxuICAgICAgICB2YWxpZCA9ICFpc0VtcHR5KGNvbnRyb2wudmFsdWUpICYmIHZhbGlkTW9udGhWYWx1ZShjb250cm9sLnZhbHVlKTtcclxuICAgICAgfWVsc2V7XHJcbiAgICAgICAgdmFsaWQgPSBpc0VtcHR5KGNvbnRyb2wudmFsdWUpIHx8IHZhbGlkTW9udGhWYWx1ZShjb250cm9sLnZhbHVlKTtcclxuICAgICAgfVxyXG4gICAgcmV0dXJuICF2YWxpZCA/IHtpbnZhbGlkTW9udGg6IHt2YWx1ZTogY29udHJvbC52YWx1ZX19IDogbnVsbDtcclxuICB9O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gdmFsaWRZZWFyKHJlcXVpcmVkOiBib29sZWFuKTogVmFsaWRhdG9yRm4ge1xyXG4gIHJldHVybiAoY29udHJvbDogQWJzdHJhY3RDb250cm9sKToge1trZXk6IHN0cmluZ106IGFueX0gfCBudWxsID0+IHtcclxuICAgIGxldCB2YWxpZCA9IGZhbHNlO1xyXG4gICAgY29uc3QgdmFsaWRZZWFyVmFsdWUgPSAobSkgPT4gbS5sZW5ndGggPT09IDQgJiYgIWlzTmFOKE51bWJlcihtKSkgJiYgTnVtYmVyKG0pID49IDEgO1xyXG4gICAgaWYgKHJlcXVpcmVkKXtcclxuICAgICAgICB2YWxpZCA9ICFpc0VtcHR5KGNvbnRyb2wudmFsdWUpICYmIHZhbGlkWWVhclZhbHVlKGNvbnRyb2wudmFsdWUpO1xyXG4gICAgICB9ZWxzZXtcclxuICAgICAgICB2YWxpZCA9IGlzRW1wdHkoY29udHJvbC52YWx1ZSkgfHwgdmFsaWRZZWFyVmFsdWUoY29udHJvbC52YWx1ZSk7XHJcbiAgICAgIH1cclxuICAgIHJldHVybiAhdmFsaWQgPyB7aW52YWxpZFllYXI6IHt2YWx1ZTogY29udHJvbC52YWx1ZX19IDogbnVsbDtcclxuICB9O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gaXNFbXB0eShpdGVtOiBhbnkpe1xyXG4gIHJldHVybiBpdGVtID09IG51bGwgfHwgIGl0ZW0gPT09IHVuZGVmaW5lZCB8fCBpdGVtLmxlbmd0aCA9PT0gIDA7XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBoYXNSZXF1aXJlZEZpZWxkID0gKGFic3RyYWN0Q29udHJvbDogQWJzdHJhY3RDb250cm9sKTogYm9vbGVhbiA9PiB7XHJcbiAgaWYgKGFic3RyYWN0Q29udHJvbC52YWxpZGF0b3IpIHtcclxuICAgICAgY29uc3QgdmFsaWRhdG9yID0gYWJzdHJhY3RDb250cm9sLnZhbGlkYXRvcih7fWFzIEFic3RyYWN0Q29udHJvbCk7XHJcbiAgICAgIGlmICh2YWxpZGF0b3IgJiYgdmFsaWRhdG9yLnJlcXVpcmVkKSB7XHJcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgfVxyXG4gIH1cclxuICAvLyBpZiAoYWJzdHJhY3RDb250cm9sLmNvbnRyb2xzKSB7XHJcbiAgLy8gICAgIGZvciAoY29uc3QgY29udHJvbE5hbWUgaW4gYWJzdHJhY3RDb250cm9sLmNvbnRyb2xzKSB7XHJcbiAgLy8gICAgICAgICBpZiAoYWJzdHJhY3RDb250cm9sLmNvbnRyb2xzW2NvbnRyb2xOYW1lXSkge1xyXG4gIC8vICAgICAgICAgICAgIGlmIChoYXNSZXF1aXJlZEZpZWxkKGFic3RyYWN0Q29udHJvbC5jb250cm9sc1tjb250cm9sTmFtZV0pKSB7XHJcbiAgLy8gICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gIC8vICAgICAgICAgICAgIH1cclxuICAvLyAgICAgICAgIH1cclxuICAvLyAgICAgfVxyXG4gIC8vIH1cclxuICByZXR1cm4gZmFsc2U7XHJcbn07XHJcbiIsIjxkaXYgcm9sZT1cImdyb3VwXCIgY2xhc3M9XCJzaWkteWVhci1tb250aC1pbnB1dC1jb250YWluZXJcIlxyXG4gICAgIFtmb3JtR3JvdXBdPVwicGFydHNcIlxyXG4gICAgIFthdHRyLmFyaWEtbGFiZWxsZWRieV09XCJmb3JtRmllbGQ/LmdldExhYmVsSWQoKVwiPlxyXG4gIDxpbnB1dCBjbGFzcz1cInNpaS15ZWFyLW1vbnRoLWlucHV0LWVsZW1lbnRcIiBzdHlsZT1cIndpZHRoOjQ1cHhcIlxyXG4gICAgICAgICBmb3JtQ29udHJvbE5hbWU9XCJ5ZWFyXCJcclxuICAgICAgICAgbWF4TGVuZ3RoPVwiNFwiXHJcbiAgICAgICAgIHNpemU9XCI0XCJcclxuICAgICAgICAgcGxhY2Vob2xkZXI9XCJZWVlZXCJcclxuICAgICAgICAgYXJpYS1sYWJlbD1cIlllYXJcIlxyXG4gICAgICAgICAoaW5wdXQpPVwiX2hhbmRsZUlucHV0KHBhcnRzLmNvbnRyb2xzLnllYXIsbW9udGgpXCJcclxuICAgICAgICAgI3llYXI+XHJcbiAgPHNwYW4gY2xhc3M9XCJzaWkteWVhci1tb250aC1pbnB1dC1zcGFjZXJcIj4vPC9zcGFuPlxyXG4gIDxpbnB1dCBjbGFzcz1cInNpaS15ZWFyLW1vbnRoLWlucHV0LWVsZW1lbnRcIiBzdHlsZT1cIm1hcmdpbi1sZWZ0OiA1cHg7XCJcclxuICAgICAgICAgZm9ybUNvbnRyb2xOYW1lPVwibW9udGhcIiBzaXplPVwiMlwiXHJcbiAgICAgICAgIG1heExlbmd0aD1cIjJcIlxyXG4gICAgICAgICBwbGFjZWhvbGRlcj1cIk1NXCJcclxuICAgICAgICAgYXJpYS1sYWJlbD1cIk1vbnRoXCJcclxuICAgICAgICAgKGlucHV0KT1cIl9oYW5kbGVJbnB1dChwYXJ0cy5jb250cm9scy5tb250aClcIlxyXG4gICAgICAgICAoa2V5dXAuYmFja3NwYWNlKT1cImF1dG9Gb2N1c1ByZXYocGFydHMuY29udHJvbHMubW9udGgsIHllYXIpXCJcclxuICAgICAgICAgI21vbnRoPlxyXG5cclxuPC9kaXY+XHJcbiJdfQ==