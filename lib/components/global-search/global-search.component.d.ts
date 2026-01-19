import { AfterViewInit, ElementRef } from '@angular/core';
import { ControlValueAccessor, Validator, AbstractControl, ValidationErrors, UntypedFormControl } from '@angular/forms';
import * as i0 from "@angular/core";
export declare class GlobalSearchComponent implements AfterViewInit, ControlValueAccessor, Validator {
    label: string;
    inputElement: ElementRef;
    get haveValue(): boolean;
    inputFormCtrl: UntypedFormControl;
    propagateChange: any;
    onTouchedCallback: any;
    validatorCallback: any;
    constructor();
    validate(control: AbstractControl): ValidationErrors;
    writeValue(obj: any): void;
    registerOnChange(fn: any): void;
    registerOnTouched(fn: any): void;
    registerOnValidatorChange?(fn: () => void): void;
    setDisabledState?(isDisabled: boolean): void;
    ngAfterViewInit(): void;
    initSiiFacet(): void;
    focusInput(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<GlobalSearchComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<GlobalSearchComponent, "sii-global-search", never, { "label": { "alias": "label"; "required": false; }; }, {}, never, never, true, never>;
}
