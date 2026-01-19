import { FocusMonitor } from '@angular/cdk/a11y';
import { AfterViewInit, ElementRef, EventEmitter, OnDestroy } from '@angular/core';
import { AbstractControl, ControlValueAccessor, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, NgControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { MatFormField, MatFormFieldControl } from '@angular/material/form-field';
import { Subject } from 'rxjs';
import * as i0 from "@angular/core";
/** Data structure for holding year month item. */
export declare class SiiYearMonth {
    year: string;
    month: string;
    constructor(year: string, month: string);
}
/** Custom `MatFormFieldControl` for telephone number input. */
export declare class YearMonthInputComponent implements ControlValueAccessor, MatFormFieldControl<SiiYearMonth>, OnDestroy, AfterViewInit {
    private focusMonitor;
    private elementRef;
    formField: MatFormField;
    ngControl: NgControl;
    valueChange: EventEmitter<SiiYearMonth>;
    get empty(): boolean;
    get emptyMonth(): boolean;
    get emptyYear(): boolean;
    get shouldLabelFloat(): boolean;
    get placeholder(): string;
    set placeholder(value: string);
    get required(): boolean;
    set required(value: boolean);
    get disabled(): boolean;
    set disabled(value: boolean);
    get value(): SiiYearMonth | null;
    set value(my: SiiYearMonth | null);
    get errorState(): boolean;
    get isInvalid(): boolean;
    get isValid(): boolean;
    constructor(formBuilder: UntypedFormBuilder, focusMonitor: FocusMonitor, elementRef: ElementRef<HTMLElement>, formField: MatFormField, ngControl: NgControl);
    static nextId: number;
    yearInput: HTMLInputElement;
    monthInput: HTMLInputElement;
    parts: UntypedFormGroup;
    stateChanges: Subject<void>;
    focused: boolean;
    controlType: string;
    id: string;
    userAriaDescribedBy: string;
    private _placeholder;
    private _required;
    private _disabled;
    ngAfterViewInit(): void;
    onChange: (_: any) => void;
    onTouched: () => void;
    autoFocusNext(control: AbstractControl, nextElement?: HTMLInputElement): void;
    autoFocusPrev(control: AbstractControl, prevElement: HTMLInputElement): void;
    ngOnDestroy(): void;
    setDescribedByIds(ids: string[]): void;
    onContainerClick(ev: any): void;
    writeValue(tel: SiiYearMonth | null): void;
    registerOnChange(fn: any): void;
    registerOnTouched(fn: any): void;
    setDisabledState(isDisabled: boolean): void;
    validate(c: UntypedFormControl): ValidationErrors;
    _handleInput(control: AbstractControl, nextElement?: HTMLInputElement): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<YearMonthInputComponent, [null, null, null, { optional: true; }, { optional: true; self: true; }]>;
    static ɵcmp: i0.ɵɵComponentDeclaration<YearMonthInputComponent, "sii-year-month-input", never, { "placeholder": { "alias": "placeholder"; "required": false; }; "required": { "alias": "required"; "required": false; }; "disabled": { "alias": "disabled"; "required": false; }; "value": { "alias": "value"; "required": false; }; "userAriaDescribedBy": { "alias": "aria-describedby"; "required": false; }; }, { "valueChange": "valueChange"; }, never, never, true, never>;
}
export declare function validMonth(required: boolean): ValidatorFn;
export declare function validYear(required: boolean): ValidatorFn;
export declare function isEmpty(item: any): boolean;
export declare const hasRequiredField: (abstractControl: AbstractControl) => boolean;
