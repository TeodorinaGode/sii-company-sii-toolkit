import { Directive, Input, Host, Optional } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { PrimitiveFacetDirective } from '../common/primitive-facet/primitive-facet.directive';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatOption } from '@angular/material/core';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { SiiDatePipe } from '../../util/sii-date.pipe';
import * as i0 from "@angular/core";
import * as i1 from "../common/service/sii-facet.service";
import * as i2 from "../../util/sii-date.pipe";
import * as i3 from "@angular/material/input";
import * as i4 from "@angular/material/select";
import * as i5 from "@angular/material/slide-toggle";
import * as i6 from "@angular/material/radio";
import * as i7 from "@angular/material/datepicker";
import * as i8 from "../../dsii-components/lookup-employee/lookup-employee.component";
import * as i9 from "@angular/material/autocomplete";
import * as i10 from "../../year-month-input/year-month-input.component";
export class SiiFilterDirective extends PrimitiveFacetDirective {
    set siiFilter(val) {
        this.config = { name: val, facetOptions: null };
    }
    get multiple() {
        return this.privMmultiple;
    }
    set multiple(value) {
        this.privMmultiple = coerceBooleanProperty(value);
    }
    constructor(el, siiFacetService, siiDatePipe, matInput, matSelect, matSlideToggle, matRadioGroup, matDatepicker, lookupEmployee, matAutocomplete, yearMonthInput) {
        super(siiFacetService);
        this.el = el;
        this.siiDatePipe = siiDatePipe;
        this.matInput = matInput;
        this.matSelect = matSelect;
        this.matSlideToggle = matSlideToggle;
        this.matRadioGroup = matRadioGroup;
        this.matDatepicker = matDatepicker;
        this.lookupEmployee = lookupEmployee;
        this.matAutocomplete = matAutocomplete;
        this.yearMonthInput = yearMonthInput;
        this.privMmultiple = false;
        this.utils = {
            firstValidValueEmitted: false,
            initialized: false
        };
        this.valueChangeSubj = new Subject();
        this.valueChange = this.valueChangeSubj.asObservable();
        this.optionsInitValue = undefined; // valore di inizializzazione
        this.checkType();
        switch (this.type) {
            case 'INPUT':
                this.el.nativeElement.addEventListener('input', () => {
                    // console.log('input ValueChange');
                    this.valueChangeSubj.next(this.getOrDefault(this.el.nativeElement.value));
                });
                break;
            case 'SELECT':
                this.optionsInitValue = this.matSelect.multiple ? [] : undefined;
                this.matSelect.selectionChange.subscribe((ev) => {
                    // console.log('mat select selectionChange');
                    if (this.matSelect.multiple) {
                        const splittedValues = ev.source.triggerValue.split(',');
                        const selVAl = [];
                        for (let i = 0; i < ev.value.length; i++) {
                            selVAl.push({ code: ev.value[i], count: 1, descr: splittedValues[i] });
                        }
                        this.valueChangeSubj.next(this.getOrDefault(selVAl));
                    }
                    else {
                        this.valueChangeSubj.next(this.getOrDefault({ code: ev.value, count: 1, descr: ev.source.triggerValue }));
                    }
                });
                break;
            case 'TOGGLE':
                this.matSlideToggle.change.subscribe((ev) => {
                    // console.log('mat-slide ValueChange');
                    this.valueChangeSubj.next(this.getOrDefault(ev.checked));
                });
                break;
            case 'RADIO':
                this.matRadioGroup.change.subscribe((ev) => {
                    // console.log('mat-radio ValueChange');
                    this.valueChangeSubj.next(this.getOrDefault(ev.value));
                });
                break;
            case 'DATEPICKER':
                this.matDatepicker.dateChange.subscribe((ev) => {
                    // console.log('mat-datepicker ValueChange');
                    this.valueChangeSubj.next(ev.value != null ? this.getOrDefault(ev.value) : null);
                    // this.valueChangeSubj.next(ev.value)
                });
                break;
            case 'LOOKUP_EMPLOYEE':
                this.lookupEmployee.valueChange.subscribe((val) => {
                    // console.log('LOOKUP_EMPLOYEE ValueChange');
                    if (this.multiple) {
                        if (val != null) {
                            const v = this.getOrDefault(val, { code: val.workerId, count: 1, descr: val.surname + ' ' + val.name });
                            const itemIndex = (this.facetSelection || []).findIndex(i => i.code === v.code);
                            if (itemIndex === -1) {
                                this.valueChangeSubj.next((this.facetSelection || []).concat(v));
                            }
                            // clearValue
                            this.lookupEmployee.writeValue(null);
                        }
                    }
                    else {
                        const v = val != null ? this.getOrDefault(val, { code: val.workerId, count: 1, descr: val.surname + ' ' + val.name }) : null;
                        this.valueChangeSubj.next(v);
                    }
                });
                break;
            case 'AUTOCOMPLETE':
                this.optionsInitValue = this.multiple ? [] : undefined;
                this.matAutocomplete.optionSelected.subscribe((ev) => {
                    if (this.multiple) {
                        if (ev.option.value != null) {
                            const val = this.getOrDefault(ev.option.value);
                            const itemIndex = (this.facetSelection || []).findIndex(i => i.code === val.code);
                            if (itemIndex === -1) {
                                this.valueChangeSubj.next((this.facetSelection || []).concat(val));
                            }
                            this.clearAutocomplete();
                        }
                    }
                    else {
                        this.valueChangeSubj.next(ev.option.value != null ? this.getOrDefault(ev.option.value) : null);
                    }
                });
                break;
            case 'YEAR_MONTH':
                this.yearMonthInput.valueChange.subscribe((val) => {
                    const invalidValue = val == null || val.year == null || val.month == null || val.year === '' || val.month === '';
                    if (!invalidValue || this.utils.firstValidValueEmitted) {
                        this.utils.firstValidValueEmitted = true;
                        if (invalidValue) {
                            this.valueChangeSubj.next(null);
                        }
                        else {
                            this.valueChangeSubj.next(this.getOrDefault(val, { code: val, count: 1, descr: val.year + '/' + val.month }));
                        }
                    }
                });
                break;
        }
        this.valueChange.pipe(
        // distinctUntilChanged(),
        debounceTime(500))
            .subscribe((val) => {
            if (val instanceof Array) {
                this.facetSelection = val.map((v) => {
                    if (this.instanceOfSiiFacetOptionDto(v)) {
                        return v;
                    }
                    else {
                        return { code: v, count: 1, descr: v };
                    }
                });
            }
            else if (typeof val === 'string') {
                if (val.trim().length === 0) {
                    this.facetSelection = undefined;
                }
                else {
                    this.facetSelection = val;
                }
            }
            else if (typeof val === 'boolean') {
                if (val) {
                    this.facetSelection = val;
                }
                else {
                    this.facetSelection = undefined;
                }
            }
            else if (val instanceof Date) {
                // this.facetSelection = val;
                this.facetSelection = { code: val, count: 1, descr: this.siiDatePipe.transform(val) };
            }
            else {
                this.facetSelection = val;
            }
            // uso this.utils.initialized per evitare di eseguire 2 volte la request
            this.updateFacetSelection(this.utils.initialized);
            this.utils.initialized = true;
        });
        this.ngAfterViewInitCallback = () => {
            if (this.type === 'AUTOCOMPLETE' && this.valueTransform === undefined) {
                throw new Error(`SiiFilter :element AUTOCOMPLETE needs the declaration of [valueTransform] `);
            }
            if (this.type === 'AUTOCOMPLETE' && this.siiFilterInpuRef === undefined) {
                throw new Error(`SiiFilter :element AUTOCOMPLETE needs the declaration of [siiFilterInpuRef] `);
            }
            const initSelVal = this.getInitSelection();
            if (initSelVal !== undefined) {
                this.setValue(initSelVal);
                setTimeout(() => {
                    this.utils.initialized = true;
                }, 800);
            }
            else {
                this.utils.initialized = true;
            }
        };
        // --------override parent funct
        this.addSelection = () => {
            // this.facetSelection=item.code;
            // this.updateFacetSelection();
            // console.log('####################### siifilter addSelection ');
        };
        // --------override parent funct
        this.removeSelection = (item, propagate = true) => {
            switch (this.type) {
                case 'INPUT':
                    this.matInput.value = '';
                    this.facetSelection = undefined;
                    break;
                case 'SELECT':
                    if (this.matSelect.multiple) {
                        const i = this.matSelect.value.findIndex((e) => e === item.code);
                        if (i !== -1) {
                            this.matSelect.writeValue(this.matSelect.value.filter((item, index) => index !== i));
                            const splittedValues = this.matSelect.triggerValue.split(',');
                            const selVAl = [];
                            for (let i = 0; i < this.matSelect.value.length; i++) {
                                selVAl.push({ code: this.matSelect.value[i], count: 1, descr: splittedValues[i] });
                            }
                            this.facetSelection = selVAl;
                        }
                    }
                    else {
                        this.matSelect.value = this.optionsInitValue;
                        this.facetSelection = this.optionsInitValue;
                    }
                    break;
                case 'TOGGLE':
                    this.matSlideToggle.toggle();
                    this.facetSelection = this.matSlideToggle.checked ? true : undefined;
                    break;
                case 'RADIO':
                    this.matRadioGroup.value = undefined;
                    this.facetSelection = undefined;
                    break;
                case 'DATEPICKER':
                    this.matDatepicker.value = undefined;
                    this.facetSelection = undefined;
                    break;
                case 'YEAR_MONTH':
                    this.yearMonthInput.writeValue(null);
                    this.facetSelection = undefined;
                    break;
                case 'LOOKUP_EMPLOYEE':
                    this.lookupEmployee.writeValue(null);
                    if (this.multiple) {
                        const leItemIndex = this.facetSelection.findIndex(i => i.code === item.code);
                        if (leItemIndex !== -1) {
                            this.facetSelection.splice(leItemIndex, 1);
                        }
                    }
                    else {
                        this.facetSelection = undefined;
                    }
                    break;
                case 'AUTOCOMPLETE':
                    this.clearAutocomplete();
                    if (this.multiple) {
                        const ACitemIndex = this.facetSelection.findIndex(i => i.code === item.code);
                        if (ACitemIndex !== -1) {
                            this.facetSelection.splice(ACitemIndex, 1);
                        }
                    }
                    else {
                        this.facetSelection = undefined;
                    }
                    break;
            }
            if (propagate) {
                this.updateFacetSelection();
            }
        };
        // --------override parent funct
        this.removeAllSelections = () => {
            if (this.facetSelection !== undefined) {
                if (this.facetSelection !== undefined && this.facetSelection instanceof Array) {
                    [...this.facetSelection].forEach(f => this.removeSelection(f, false));
                }
                else {
                    this.removeSelection(this.facetSelection, false);
                }
                this.updateFacetSelection(false);
            }
        };
        this.removeFacetSelectionFromFacetSummaryCallback = (fs) => {
            if (fs.name === this.config.name) {
                fs.facetOptions.forEach(f => this.removeSelection(f));
            }
        };
        this.getInitSelection = () => {
            return this.siiFacetService._initFacetToSet.facets[this.config.name] || this.optionsInitValue;
        };
        this.changeFacets = (facets) => {
            this.setValue(facets);
        };
    }
    multiMatSelectValueExtraction(initSelVal) {
        const splittedValues = this.matSelect.triggerValue.split(',');
        const selVAl = [];
        for (let i = 0; i < initSelVal.length; i++) {
            selVAl.push({ code: initSelVal[i], count: 1, descr: splittedValues[i] });
        }
        return this.getOrDefault(selVAl);
    }
    ngOnDestroy() {
        this.valueChangeSubj.unsubscribe();
    }
    getOrDefault(value, defaultVal) {
        if (this.valueTransform !== undefined) {
            return this.valueTransform(value);
        }
        else {
            return defaultVal !== undefined ? defaultVal : value;
        }
    }
    clearAutocomplete() {
        this.siiFilterInpuRef.value = '';
        this.siiFilterInpuRef.dispatchEvent(new Event('input')); // this is to update the list of autcomplete
        // const t = new MatOption(null, null, this.matAutocomplete, null);
        // t.value = null;
        // const event = new MatAutocompleteSelectedEvent(this.matAutocomplete, t);
        // this.matAutocomplete.optionSelected.emit(event);
    }
    checkType() {
        if (this.matInput) {
            if (this.matDatepicker) {
                // this because datapicker works in matInput
                this.type = 'DATEPICKER';
            }
            else {
                this.type = 'INPUT';
            }
        }
        else if (this.matSelect) {
            this.type = 'SELECT';
        }
        else if (this.matSlideToggle) {
            this.type = 'TOGGLE';
        }
        else if (this.matRadioGroup) {
            this.type = 'RADIO';
        }
        else if (this.lookupEmployee) {
            this.type = 'LOOKUP_EMPLOYEE';
        }
        else if (this.matAutocomplete) {
            this.type = 'AUTOCOMPLETE';
        }
        else if (this.yearMonthInput) {
            this.type = 'YEAR_MONTH';
        }
        if (this.type === undefined) {
            throw new Error(`SiiFilter elemento ${this.el.nativeElement.localName} non gestito`);
        }
    }
    setValue(initSelVal) {
        switch (this.type) {
            case 'INPUT':
                this.matInput.value = initSelVal;
                this.valueChangeSubj.next(this.getOrDefault(initSelVal));
                break;
            case 'SELECT':
                if (this.matSelect.multiple) {
                    this.matSelect.writeValue(initSelVal);
                    if (this.matSelect.triggerValue === '') {
                        // if the options values are not just loaded
                        this.valueChangeSubj.next(initSelVal);
                        const vcs = this.matSelect.options.changes.subscribe(() => {
                            vcs.unsubscribe();
                            Promise.resolve().then(() => {
                                const splittedValues = this.matSelect.triggerValue.split(',');
                                const selMap = {};
                                for (let i = 0; i < initSelVal.length; i++) {
                                    selMap[initSelVal[i]] = splittedValues[i];
                                }
                                this.facetSelection.forEach((i => i.descr = selMap[i.code]));
                            });
                        });
                    }
                    else {
                        const splittedValues = this.matSelect.triggerValue.split(',');
                        const selVAl = [];
                        for (let i = 0; i < initSelVal.length; i++) {
                            selVAl.push({ code: initSelVal[i], count: 1, descr: splittedValues[i] });
                        }
                        this.valueChangeSubj.next(this.getOrDefault(selVAl));
                    }
                }
                else {
                    this.matSelect.value = initSelVal;
                    setTimeout(() => {
                        this.valueChangeSubj.next(this.getOrDefault({ code: initSelVal, count: 1, descr: this.matSelect.triggerValue }));
                    }, 500);
                }
                // this.valueChangeSubj.next(this.getOrDefault(initSelVal));
                break;
            case 'TOGGLE':
                this.matSlideToggle.checked = initSelVal;
                // this.valueChangeSubj.next(this.getOrDefault(initSelVal));
                break;
            case 'RADIO':
                this.matRadioGroup.value = initSelVal;
                this.valueChangeSubj.next(this.getOrDefault(initSelVal));
                break;
            case 'DATEPICKER':
                if (initSelVal != null) {
                    initSelVal = new Date(initSelVal);
                    if (isNaN(initSelVal)) {
                        initSelVal = null;
                    }
                }
                this.matDatepicker.value = initSelVal;
                this.valueChangeSubj.next(initSelVal != null ? this.getOrDefault(initSelVal) : null);
                break;
            case 'LOOKUP_EMPLOYEE':
                if (this.multiple) {
                    if (initSelVal != null) {
                        if (initSelVal instanceof Array) {
                            // tslint:disable-next-line:max-line-length
                            this.valueChangeSubj.next(initSelVal.map(i => this.getOrDefault(i, { code: i.workerId, count: 1, descr: i.surname + ' ' + i.name })));
                        }
                        else {
                            // tslint:disable-next-line:max-line-length
                            this.valueChangeSubj.next([this.getOrDefault(initSelVal, { code: initSelVal.workerId, count: 1, descr: initSelVal.surname + ' ' + initSelVal.name })]);
                        }
                    }
                }
                else {
                    this.lookupEmployee.writeValue(initSelVal);
                    const v = initSelVal != null ? this.getOrDefault(initSelVal, { code: initSelVal.workerId, count: 1, descr: initSelVal.surname + ' ' + initSelVal.name }) : null;
                    this.valueChangeSubj.next(v);
                }
                break;
            case 'AUTOCOMPLETE':
                this.siiFilterInpuRef.value = this.matAutocomplete.displayWith(initSelVal);
                // this.matAutocomplete.optionSelected.emit(initSelVal);
                const t = new MatOption(null, null, this.matAutocomplete, null);
                t.value = initSelVal;
                const event = new MatAutocompleteSelectedEvent(this.matAutocomplete, t);
                if (this.multiple) {
                    if (initSelVal != null) {
                        if (initSelVal instanceof Array) {
                            this.valueChangeSubj.next(initSelVal.map(i => this.getOrDefault(i)));
                        }
                        else {
                            this.valueChangeSubj.next([this.getOrDefault(initSelVal)]);
                        }
                        this.clearAutocomplete();
                    }
                }
                else {
                    this.matAutocomplete.optionSelected.emit(event);
                    this.valueChangeSubj.next(this.getOrDefault(initSelVal));
                }
                break;
            case 'YEAR_MONTH':
                this.yearMonthInput.writeValue(initSelVal);
                // tslint:disable-next-line:max-line-length
                const vym = initSelVal != null ? this.getOrDefault(initSelVal, { code: initSelVal, count: 1, descr: initSelVal.year + '/' + initSelVal.month }) : null;
                this.valueChangeSubj.next(vym);
                break;
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: SiiFilterDirective, deps: [{ token: i0.ElementRef }, { token: i1.SiiFacetService }, { token: i2.SiiDatePipe }, { token: i3.MatInput, host: true, optional: true }, { token: i4.MatSelect, host: true, optional: true }, { token: i5.MatSlideToggle, host: true, optional: true }, { token: i6.MatRadioGroup, host: true, optional: true }, { token: i7.MatDatepickerInput, host: true, optional: true }, { token: i8.LookupEmployeeComponent, host: true, optional: true }, { token: i9.MatAutocomplete, host: true, optional: true }, { token: i10.YearMonthInputComponent, host: true, optional: true }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "18.2.13", type: SiiFilterDirective, isStandalone: true, selector: "[siiFilter]", inputs: { siiFilter: "siiFilter", valueTransform: "valueTransform", siiFilterInpuRef: "siiFilterInpuRef", multiple: "multiple" }, providers: [SiiDatePipe], usesInheritance: true, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: SiiFilterDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[siiFilter]',
                    providers: [SiiDatePipe],
                    standalone: true,
                }]
        }], ctorParameters: () => [{ type: i0.ElementRef }, { type: i1.SiiFacetService }, { type: i2.SiiDatePipe }, { type: i3.MatInput, decorators: [{
                    type: Host
                }, {
                    type: Optional
                }] }, { type: i4.MatSelect, decorators: [{
                    type: Host
                }, {
                    type: Optional
                }] }, { type: i5.MatSlideToggle, decorators: [{
                    type: Host
                }, {
                    type: Optional
                }] }, { type: i6.MatRadioGroup, decorators: [{
                    type: Host
                }, {
                    type: Optional
                }] }, { type: i7.MatDatepickerInput, decorators: [{
                    type: Host
                }, {
                    type: Optional
                }] }, { type: i8.LookupEmployeeComponent, decorators: [{
                    type: Host
                }, {
                    type: Optional
                }] }, { type: i9.MatAutocomplete, decorators: [{
                    type: Host
                }, {
                    type: Optional
                }] }, { type: i10.YearMonthInputComponent, decorators: [{
                    type: Host
                }, {
                    type: Optional
                }] }], propDecorators: { siiFilter: [{
                type: Input
            }], valueTransform: [{
                type: Input
            }], siiFilterInpuRef: [{
                type: Input
            }], multiple: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsdGVyLmRpcmVjdGl2ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL3NpaS10b29sa2l0L3NyYy9saWIvY29tcG9uZW50cy9mYWNldHMvZmlsdGVyL2ZpbHRlci5kaXJlY3RpdmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBYyxLQUFLLEVBQWEsSUFBSSxFQUFFLFFBQVEsRUFBaUIsTUFBTSxlQUFlLENBQUM7QUFDdkcsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUMvQixPQUFPLEVBQUUsWUFBWSxFQUF3QixNQUFNLGdCQUFnQixDQUFDO0FBRXBFLE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxNQUFNLHFEQUFxRCxDQUFDO0FBVTlGLE9BQU8sRUFBbUIsNEJBQTRCLEVBQUUsTUFBTSxnQ0FBZ0MsQ0FBQztBQUMvRixPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sd0JBQXdCLENBQUM7QUFFbkQsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sdUJBQXVCLENBQUM7QUFDOUQsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLDBCQUEwQixDQUFDOzs7Ozs7Ozs7Ozs7QUFTdkQsTUFBTSxPQUFPLGtCQUFtQixTQUFRLHVCQUF1QjtJQUM3RCxJQUFhLFNBQVMsQ0FBQyxHQUFXO1FBQ2hDLElBQUksQ0FBQyxNQUFNLEdBQUcsRUFBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLFlBQVksRUFBRSxJQUFJLEVBQUMsQ0FBQztJQUNoRCxDQUFDO0lBTUQsSUFDSSxRQUFRO1FBQ1YsT0FBTyxJQUFJLENBQUMsYUFBYSxDQUFDO0lBQzVCLENBQUM7SUFDRCxJQUFJLFFBQVEsQ0FBQyxLQUFjO1FBQ3pCLElBQUksQ0FBQyxhQUFhLEdBQUcscUJBQXFCLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDcEQsQ0FBQztJQVlELFlBQW1CLEVBQWMsRUFBRSxlQUFnQyxF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QUFJLEVBQUUsVUFBVSxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUUsS0FBSyxFQUFFLFVBQVUsQ0FBQyxJQUFJLEdBQUcsR0FBRyxHQUFHLFVBQVUsQ0FBQyxLQUFLLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7Z0JBQ3JKLElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUMvQixNQUFNO1FBQ1YsQ0FBQztJQUNILENBQUM7K0dBOWVVLGtCQUFrQjttR0FBbEIsa0JBQWtCLDRMQUhoQixDQUFDLFdBQVcsQ0FBQzs7NEZBR2Ysa0JBQWtCO2tCQUw5QixTQUFTO21CQUFDO29CQUNQLFFBQVEsRUFBRSxhQUFhO29CQUN2QixTQUFTLEVBQUUsQ0FBQyxXQUFXLENBQUM7b0JBQ3hCLFVBQVUsRUFBRSxJQUFJO2lCQUNuQjs7MEJBNkJjLElBQUk7OzBCQUFJLFFBQVE7OzBCQUNoQixJQUFJOzswQkFBSSxRQUFROzswQkFDaEIsSUFBSTs7MEJBQUksUUFBUTs7MEJBQ2hCLElBQUk7OzBCQUFJLFFBQVE7OzBCQUNoQixJQUFJOzswQkFBSSxRQUFROzswQkFDaEIsSUFBSTs7MEJBQUksUUFBUTs7MEJBQ2hCLElBQUk7OzBCQUFJLFFBQVE7OzBCQUNoQixJQUFJOzswQkFBSSxRQUFRO3lDQWxDaEIsU0FBUztzQkFBckIsS0FBSztnQkFJRyxjQUFjO3NCQUF0QixLQUFLO2dCQUNHLGdCQUFnQjtzQkFBeEIsS0FBSztnQkFJRixRQUFRO3NCQURYLEtBQUsiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBEaXJlY3RpdmUsIEVsZW1lbnRSZWYsIElucHV0LCBPbkRlc3Ryb3ksIEhvc3QsIE9wdGlvbmFsLCBBZnRlclZpZXdJbml0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IFN1YmplY3QgfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHsgZGVib3VuY2VUaW1lLCBkaXN0aW5jdFVudGlsQ2hhbmdlZCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcclxuaW1wb3J0IHsgU2lpRmFjZXRTZXJ2aWNlIH0gZnJvbSAnLi4vY29tbW9uL3NlcnZpY2Uvc2lpLWZhY2V0LnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBQcmltaXRpdmVGYWNldERpcmVjdGl2ZSB9IGZyb20gJy4uL2NvbW1vbi9wcmltaXRpdmUtZmFjZXQvcHJpbWl0aXZlLWZhY2V0LmRpcmVjdGl2ZSc7XHJcbmltcG9ydCB7IFNpaUZhY2V0T3B0aW9uRHRvIH0gZnJvbSAnLi4vY29tbW9uL2R0by9pLXNpaS1mYWNldC1vcHRpb24uZHRvJztcclxuaW1wb3J0IHsgU2lpRmFjZXREdG8gfSBmcm9tICcuLi9jb21tb24vZHRvL2ktc2lpLWZhY2V0LmR0byc7XHJcbmltcG9ydCB7IE1hdFNlbGVjdCwgTWF0U2VsZWN0Q2hhbmdlIH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvc2VsZWN0JztcclxuaW1wb3J0IHsgTWF0U2xpZGVUb2dnbGVDaGFuZ2UsIE1hdFNsaWRlVG9nZ2xlIH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvc2xpZGUtdG9nZ2xlJztcclxuaW1wb3J0IHsgTWF0UmFkaW9DaGFuZ2UsIE1hdFJhZGlvR3JvdXAgfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9yYWRpbyc7XHJcbmltcG9ydCB7IE1hdElucHV0IH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvaW5wdXQnO1xyXG5pbXBvcnQgeyBNYXREYXRlcGlja2VySW5wdXQgfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9kYXRlcGlja2VyJztcclxuaW1wb3J0IHsgTG9va3VwRW1wbG95ZWVDb21wb25lbnQgfSBmcm9tICcuLi8uLi9kc2lpLWNvbXBvbmVudHMvbG9va3VwLWVtcGxveWVlL2xvb2t1cC1lbXBsb3llZS5jb21wb25lbnQnO1xyXG5pbXBvcnQgeyBJTG9va3VwRW1wbG95ZWVEVE8gfSBmcm9tICcuLi8uLi9kc2lpLWNvbXBvbmVudHMvbG9va3VwLWVtcGxveWVlL2RvbWFpbi9sb29rdXAtZW1wbG95ZWUuZHRvJztcclxuaW1wb3J0IHsgTWF0QXV0b2NvbXBsZXRlLCBNYXRBdXRvY29tcGxldGVTZWxlY3RlZEV2ZW50IH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvYXV0b2NvbXBsZXRlJztcclxuaW1wb3J0IHsgTWF0T3B0aW9uIH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvY29yZSc7XHJcbmltcG9ydCB7IFNpaVllYXJNb250aCwgWWVhck1vbnRoSW5wdXRDb21wb25lbnQgfSBmcm9tICcuLi8uLi95ZWFyLW1vbnRoLWlucHV0L3llYXItbW9udGgtaW5wdXQuY29tcG9uZW50JztcclxuaW1wb3J0IHsgY29lcmNlQm9vbGVhblByb3BlcnR5IH0gZnJvbSAnQGFuZ3VsYXIvY2RrL2NvZXJjaW9uJztcclxuaW1wb3J0IHsgU2lpRGF0ZVBpcGUgfSBmcm9tICcuLi8uLi91dGlsL3NpaS1kYXRlLnBpcGUnO1xyXG5cclxuZXhwb3J0IHR5cGUgRmlsdGVyc1R5cGU9ICdJTlBVVCcgfCAnU0VMRUNUJyB8ICdUT0dHTEUnIHwgJ1JBRElPJyB8ICdEQVRFUElDS0VSJyB8ICdMT09LVVBfRU1QTE9ZRUUnIHwgJ0FVVE9DT01QTEVURScgfCAnWUVBUl9NT05USCc7XHJcblxyXG5ARGlyZWN0aXZlKHtcclxuICAgIHNlbGVjdG9yOiAnW3NpaUZpbHRlcl0nLFxyXG4gICAgcHJvdmlkZXJzOiBbU2lpRGF0ZVBpcGVdLFxyXG4gICAgc3RhbmRhbG9uZTogdHJ1ZSxcclxufSlcclxuZXhwb3J0IGNsYXNzIFNpaUZpbHRlckRpcmVjdGl2ZSBleHRlbmRzIFByaW1pdGl2ZUZhY2V0RGlyZWN0aXZlICBpbXBsZW1lbnRzIE9uRGVzdHJveSAge1xyXG4gIEBJbnB1dCgpIHNldCBzaWlGaWx0ZXIodmFsOiBzdHJpbmcpe1xyXG4gICAgdGhpcy5jb25maWcgPSB7bmFtZTogdmFsLCBmYWNldE9wdGlvbnM6IG51bGx9O1xyXG4gIH1cclxuXHJcbiAgQElucHV0KCkgdmFsdWVUcmFuc2Zvcm06IChkZWZhdWx0VmFsOiBhbnkpID0+IFNpaUZhY2V0T3B0aW9uRHRvO1xyXG4gIEBJbnB1dCgpIHNpaUZpbHRlcklucHVSZWY6IEhUTUxJbnB1dEVsZW1lbnQ7XHJcblxyXG4gIHByaXZhdGUgcHJpdk1tdWx0aXBsZSA9IGZhbHNlO1xyXG4gIEBJbnB1dCgpXHJcbiAgZ2V0IG11bHRpcGxlKCk6IGJvb2xlYW4ge1xyXG4gICAgcmV0dXJuIHRoaXMucHJpdk1tdWx0aXBsZTtcclxuICB9XHJcbiAgc2V0IG11bHRpcGxlKHZhbHVlOiBib29sZWFuKSB7XHJcbiAgICB0aGlzLnByaXZNbXVsdGlwbGUgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsdWUpO1xyXG4gIH15O1xyXG5cclxuICB1dGlscyA9IHtcclxuICAgIGZpcnN0VmFsaWRWYWx1ZUVtaXR0ZWQ6IGZhbHNlLFxyXG4gICAgaW5pdGlhbGl6ZWQ6IGZhbHNlXHJcbiAgfTtcclxuXHJcbiAgdHlwZTogRmlsdGVyc1R5cGU7XHJcbiAgcHJpdmF0ZSB2YWx1ZUNoYW5nZVN1YmogPSBuZXcgU3ViamVjdDxhbnk+KCk7XHJcbiAgdmFsdWVDaGFuZ2UgPSB0aGlzLnZhbHVlQ2hhbmdlU3Viai5hc09ic2VydmFibGUoKTtcclxuXHJcblxyXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBlbDogRWxlbWVudFJlZiwgc2lpRmFjZXRTZXJ2aWNlOiBTaWlGYWNldFNlcnZpY2UsIHByaXZhdGUgc2lpRGF0ZVBpcGU6IFNpaURhdGVQaXBlLFxyXG4gICAgICAgICAgICAgIEBIb3N0KCkgQE9wdGlvbmFsKCkgcHJpdmF0ZSBtYXRJbnB1dDogTWF0SW5wdXQgLFxyXG4gICAgICAgICAgICAgIEBIb3N0KCkgQE9wdGlvbmFsKCkgcHJpdmF0ZSBtYXRTZWxlY3Q6IE1hdFNlbGVjdCxcclxuICAgICAgICAgICAgICBASG9zdCgpIEBPcHRpb25hbCgpIHByaXZhdGUgbWF0U2xpZGVUb2dnbGU6IE1hdFNsaWRlVG9nZ2xlLFxyXG4gICAgICAgICAgICAgIEBIb3N0KCkgQE9wdGlvbmFsKCkgcHJpdmF0ZSBtYXRSYWRpb0dyb3VwOiBNYXRSYWRpb0dyb3VwLFxyXG4gICAgICAgICAgICAgIEBIb3N0KCkgQE9wdGlvbmFsKCkgcHJpdmF0ZSBtYXREYXRlcGlja2VyOiBNYXREYXRlcGlja2VySW5wdXQ8YW55PixcclxuICAgICAgICAgICAgICBASG9zdCgpIEBPcHRpb25hbCgpIHByaXZhdGUgbG9va3VwRW1wbG95ZWU6IExvb2t1cEVtcGxveWVlQ29tcG9uZW50LFxyXG4gICAgICAgICAgICAgIEBIb3N0KCkgQE9wdGlvbmFsKCkgcHJpdmF0ZSBtYXRBdXRvY29tcGxldGU6IE1hdEF1dG9jb21wbGV0ZSAsXHJcbiAgICAgICAgICAgICAgQEhvc3QoKSBAT3B0aW9uYWwoKSBwcml2YXRlIHllYXJNb250aElucHV0OiBZZWFyTW9udGhJbnB1dENvbXBvbmVudCxcclxuICAgICkge1xyXG4gICAgc3VwZXIoc2lpRmFjZXRTZXJ2aWNlKTtcclxuXHJcbiAgICB0aGlzLm9wdGlvbnNJbml0VmFsdWUgPSB1bmRlZmluZWQ7IC8vIHZhbG9yZSBkaSBpbml6aWFsaXp6YXppb25lXHJcblxyXG4gICAgdGhpcy5jaGVja1R5cGUoKTtcclxuXHJcbiAgICBzd2l0Y2ggKHRoaXMudHlwZSl7XHJcbiAgICAgIGNhc2UgJ0lOUFVUJzpcclxuICAgICAgICB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCAoKSA9PiB7XHJcbiAgICAgICAgICAvLyBjb25zb2xlLmxvZygnaW5wdXQgVmFsdWVDaGFuZ2UnKTtcclxuICAgICAgICAgIHRoaXMudmFsdWVDaGFuZ2VTdWJqLm5leHQodGhpcy5nZXRPckRlZmF1bHQodGhpcy5lbC5uYXRpdmVFbGVtZW50LnZhbHVlKSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgJ1NFTEVDVCc6XHJcbiAgICAgICAgdGhpcy5vcHRpb25zSW5pdFZhbHVlID0gdGhpcy5tYXRTZWxlY3QubXVsdGlwbGUgPyBbXSA6IHVuZGVmaW5lZDtcclxuICAgICAgICB0aGlzLm1hdFNlbGVjdC5zZWxlY3Rpb25DaGFuZ2Uuc3Vic2NyaWJlKChldjogTWF0U2VsZWN0Q2hhbmdlKSA9PiB7XHJcbiAgICAgICAgICAvLyBjb25zb2xlLmxvZygnbWF0IHNlbGVjdCBzZWxlY3Rpb25DaGFuZ2UnKTtcclxuICAgICAgICAgIGlmICh0aGlzLm1hdFNlbGVjdC5tdWx0aXBsZSl7XHJcbiAgICAgICAgICAgY29uc3Qgc3BsaXR0ZWRWYWx1ZXMgPSBldi5zb3VyY2UudHJpZ2dlclZhbHVlLnNwbGl0KCcsJyk7XHJcbiAgICAgICAgICAgY29uc3Qgc2VsVkFsID0gW107XHJcbiAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBldi52YWx1ZS5sZW5ndGg7IGkrKyl7XHJcbiAgICAgICAgICAgIHNlbFZBbC5wdXNoKHtjb2RlOiBldi52YWx1ZVtpXSwgY291bnQ6IDEsIGRlc2NyOiBzcGxpdHRlZFZhbHVlc1tpXX0pO1xyXG4gICAgICAgICAgIH1cclxuICAgICAgICAgICB0aGlzLnZhbHVlQ2hhbmdlU3Viai5uZXh0KHRoaXMuZ2V0T3JEZWZhdWx0KHNlbFZBbCkpO1xyXG4gICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgIHRoaXMudmFsdWVDaGFuZ2VTdWJqLm5leHQodGhpcy5nZXRPckRlZmF1bHQoe2NvZGU6IGV2LnZhbHVlLCBjb3VudDogMSwgZGVzY3I6IGV2LnNvdXJjZS50cmlnZ2VyVmFsdWV9KSk7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlICdUT0dHTEUnOlxyXG4gICAgICAgIHRoaXMubWF0U2xpZGVUb2dnbGUuY2hhbmdlLnN1YnNjcmliZSgoZXY6IE1hdFNsaWRlVG9nZ2xlQ2hhbmdlKSA9PiB7XHJcbiAgICAgICAgICAvLyBjb25zb2xlLmxvZygnbWF0LXNsaWRlIFZhbHVlQ2hhbmdlJyk7XHJcbiAgICAgICAgICB0aGlzLnZhbHVlQ2hhbmdlU3Viai5uZXh0KHRoaXMuZ2V0T3JEZWZhdWx0KGV2LmNoZWNrZWQpKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSAnUkFESU8nOlxyXG4gICAgICAgIHRoaXMubWF0UmFkaW9Hcm91cC5jaGFuZ2Uuc3Vic2NyaWJlKChldjogTWF0UmFkaW9DaGFuZ2UpID0+IHtcclxuICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdtYXQtcmFkaW8gVmFsdWVDaGFuZ2UnKTtcclxuICAgICAgICAgIHRoaXMudmFsdWVDaGFuZ2VTdWJqLm5leHQodGhpcy5nZXRPckRlZmF1bHQoZXYudmFsdWUpKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSAnREFURVBJQ0tFUic6XHJcbiAgICAgICAgdGhpcy5tYXREYXRlcGlja2VyLmRhdGVDaGFuZ2Uuc3Vic2NyaWJlKChldjogTWF0UmFkaW9DaGFuZ2UpID0+IHtcclxuICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdtYXQtZGF0ZXBpY2tlciBWYWx1ZUNoYW5nZScpO1xyXG4gICAgICAgICAgdGhpcy52YWx1ZUNoYW5nZVN1YmoubmV4dChldi52YWx1ZSAhPSBudWxsID8gdGhpcy5nZXRPckRlZmF1bHQoZXYudmFsdWUpIDogbnVsbCk7XHJcbiAgICAgICAgICAvLyB0aGlzLnZhbHVlQ2hhbmdlU3Viai5uZXh0KGV2LnZhbHVlKVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlICdMT09LVVBfRU1QTE9ZRUUnOlxyXG4gICAgICAgIHRoaXMubG9va3VwRW1wbG95ZWUudmFsdWVDaGFuZ2Uuc3Vic2NyaWJlKCh2YWw6IElMb29rdXBFbXBsb3llZURUTykgPT4ge1xyXG4gICAgICAgICAgLy8gY29uc29sZS5sb2coJ0xPT0tVUF9FTVBMT1lFRSBWYWx1ZUNoYW5nZScpO1xyXG4gICAgICAgICAgaWYgKHRoaXMubXVsdGlwbGUpe1xyXG4gICAgICAgICAgICBpZiAodmFsICE9IG51bGwpe1xyXG4gICAgICAgICAgICAgIGNvbnN0IHYgPSB0aGlzLmdldE9yRGVmYXVsdCh2YWwsIHtjb2RlOiB2YWwud29ya2VySWQsIGNvdW50OiAxLCBkZXNjcjogdmFsLnN1cm5hbWUgKyAnICcgKyB2YWwubmFtZX0pO1xyXG4gICAgICAgICAgICAgIGNvbnN0IGl0ZW1JbmRleCA9ICh0aGlzLmZhY2V0U2VsZWN0aW9uIHx8IFtdKS5maW5kSW5kZXgoaSA9PiBpLmNvZGUgPT09IHYuY29kZSk7XHJcbiAgICAgICAgICAgICAgaWYgKGl0ZW1JbmRleCA9PT0gLTEpe1xyXG4gICAgICAgICAgICAgICAgICB0aGlzLnZhbHVlQ2hhbmdlU3Viai5uZXh0KCAodGhpcy5mYWNldFNlbGVjdGlvbiB8fCBbXSkuY29uY2F0KHYpKTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgLy8gY2xlYXJWYWx1ZVxyXG4gICAgICAgICAgICAgIHRoaXMubG9va3VwRW1wbG95ZWUud3JpdGVWYWx1ZShudWxsKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgIGNvbnN0IHYgPSB2YWwgIT0gbnVsbCA/IHRoaXMuZ2V0T3JEZWZhdWx0KHZhbCwge2NvZGU6IHZhbC53b3JrZXJJZCwgY291bnQ6IDEsIGRlc2NyOiB2YWwuc3VybmFtZSArICcgJyArIHZhbC5uYW1lfSkgOiBudWxsO1xyXG4gICAgICAgICAgICB0aGlzLnZhbHVlQ2hhbmdlU3Viai5uZXh0KHYpO1xyXG4gICAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgIGNhc2UgJ0FVVE9DT01QTEVURSc6XHJcbiAgICAgICAgICB0aGlzLm9wdGlvbnNJbml0VmFsdWUgPSB0aGlzLm11bHRpcGxlID8gW10gOiB1bmRlZmluZWQ7XHJcbiAgICAgICAgICB0aGlzLm1hdEF1dG9jb21wbGV0ZS5vcHRpb25TZWxlY3RlZC5zdWJzY3JpYmUoKGV2OiBNYXRBdXRvY29tcGxldGVTZWxlY3RlZEV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLm11bHRpcGxlKXtcclxuICAgICAgICAgICAgICBpZiAoZXYub3B0aW9uLnZhbHVlICE9IG51bGwpe1xyXG4gICAgICAgICAgICAgICAgY29uc3QgdmFsID0gdGhpcy5nZXRPckRlZmF1bHQoZXYub3B0aW9uLnZhbHVlKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGl0ZW1JbmRleCA9ICh0aGlzLmZhY2V0U2VsZWN0aW9uIHx8IFtdKS5maW5kSW5kZXgoaSA9PiBpLmNvZGUgPT09IHZhbC5jb2RlKTtcclxuICAgICAgICAgICAgICAgIGlmIChpdGVtSW5kZXggPT09IC0xKXtcclxuICAgICAgICAgICAgICAgICAgdGhpcy52YWx1ZUNoYW5nZVN1YmoubmV4dCggKHRoaXMuZmFjZXRTZWxlY3Rpb24gfHwgW10pLmNvbmNhdCh2YWwpKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRoaXMuY2xlYXJBdXRvY29tcGxldGUoKTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgIHRoaXMudmFsdWVDaGFuZ2VTdWJqLm5leHQoZXYub3B0aW9uLnZhbHVlICE9IG51bGwgPyB0aGlzLmdldE9yRGVmYXVsdChldi5vcHRpb24udmFsdWUpIDogbnVsbCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgY2FzZSAnWUVBUl9NT05USCc6XHJcbiAgICAgICAgICAgdGhpcy55ZWFyTW9udGhJbnB1dC52YWx1ZUNoYW5nZS5zdWJzY3JpYmUoKHZhbDogU2lpWWVhck1vbnRoKSA9PiB7XHJcblxyXG4gICAgICAgICAgICAgY29uc3QgaW52YWxpZFZhbHVlID0gdmFsID09IG51bGwgfHwgdmFsLnllYXIgPT0gbnVsbCB8fCB2YWwubW9udGggPT0gbnVsbCB8fCB2YWwueWVhciA9PT0gJycgfHwgdmFsLm1vbnRoID09PSAnJztcclxuICAgICAgICAgICAgIGlmICghaW52YWxpZFZhbHVlIHx8IHRoaXMudXRpbHMuZmlyc3RWYWxpZFZhbHVlRW1pdHRlZCl7XHJcbiAgICAgICAgICAgICAgdGhpcy51dGlscy5maXJzdFZhbGlkVmFsdWVFbWl0dGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICBpZiAoaW52YWxpZFZhbHVlKXtcclxuICAgICAgICAgICAgICAgICB0aGlzLnZhbHVlQ2hhbmdlU3Viai5uZXh0KG51bGwpO1xyXG4gICAgICAgICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgICAgIHRoaXMudmFsdWVDaGFuZ2VTdWJqLm5leHQodGhpcy5nZXRPckRlZmF1bHQodmFsLCB7Y29kZTogdmFsLCBjb3VudDogMSwgZGVzY3I6IHZhbC55ZWFyICsgJy8nICsgdmFsLm1vbnRofSkpO1xyXG4gICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgIGJyZWFrO1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG5cclxuICAgIHRoaXMudmFsdWVDaGFuZ2UucGlwZShcclxuICAgICAgICAvLyBkaXN0aW5jdFVudGlsQ2hhbmdlZCgpLFxyXG4gICAgICAgIGRlYm91bmNlVGltZSg1MDApKVxyXG4gICAgICAuc3Vic2NyaWJlKCh2YWw6IFNpaUZhY2V0T3B0aW9uRHRvfEFycmF5PGFueT58c3RyaW5nfGJvb2xlYW58RGF0ZSkgPT4ge1xyXG4gICAgICBpZiAodmFsIGluc3RhbmNlb2YgQXJyYXkpe1xyXG4gICAgICAgIHRoaXMuZmFjZXRTZWxlY3Rpb24gPSB2YWwubWFwKCh2KSA9PiB7XHJcbiAgICAgICAgICBpZiAodGhpcy5pbnN0YW5jZU9mU2lpRmFjZXRPcHRpb25EdG8odikpe1xyXG4gICAgICAgICAgICByZXR1cm4gdjtcclxuICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICByZXR1cm4ge2NvZGU6IHYsIGNvdW50OiAxLCBkZXNjcjogdn07XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1lbHNlIGlmICh0eXBlb2YgdmFsID09PSAnc3RyaW5nJyl7XHJcbiAgICAgICAgaWYgKHZhbC50cmltKCkubGVuZ3RoID09PSAwKXtcclxuICAgICAgICAgIHRoaXMuZmFjZXRTZWxlY3Rpb24gPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICB0aGlzLmZhY2V0U2VsZWN0aW9uID0gdmFsO1xyXG4gICAgICAgIH1cclxuICAgICAgfWVsc2UgaWYgKHR5cGVvZiB2YWwgPT09ICdib29sZWFuJyl7XHJcbiAgICAgICAgaWYgKHZhbCl7XHJcbiAgICAgICAgICB0aGlzLmZhY2V0U2VsZWN0aW9uID0gdmFsO1xyXG4gICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgdGhpcy5mYWNldFNlbGVjdGlvbiA9IHVuZGVmaW5lZDtcclxuICAgICAgICB9XHJcbiAgICAgIH1lbHNlIGlmICh2YWwgaW5zdGFuY2VvZiBEYXRlKXtcclxuICAgICAgICAvLyB0aGlzLmZhY2V0U2VsZWN0aW9uID0gdmFsO1xyXG4gICAgICAgIHRoaXMuZmFjZXRTZWxlY3Rpb24gPSB7Y29kZTogdmFsLCBjb3VudDogMSwgZGVzY3I6IHRoaXMuc2lpRGF0ZVBpcGUudHJhbnNmb3JtKHZhbCl9O1xyXG4gICAgICB9XHJcbiAgICAgIGVsc2V7XHJcbiAgICAgICAgdGhpcy5mYWNldFNlbGVjdGlvbiA9IHZhbDtcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gdXNvIHRoaXMudXRpbHMuaW5pdGlhbGl6ZWQgcGVyIGV2aXRhcmUgZGkgZXNlZ3VpcmUgMiB2b2x0ZSBsYSByZXF1ZXN0XHJcbiAgICAgIHRoaXMudXBkYXRlRmFjZXRTZWxlY3Rpb24odGhpcy51dGlscy5pbml0aWFsaXplZCk7XHJcbiAgICAgIHRoaXMudXRpbHMuaW5pdGlhbGl6ZWQgPSB0cnVlO1xyXG4gICAgfSk7XHJcblxyXG5cclxuICAgIHRoaXMubmdBZnRlclZpZXdJbml0Q2FsbGJhY2sgPSAoKSA9PiB7XHJcbiAgICAgIGlmICh0aGlzLnR5cGUgPT09ICdBVVRPQ09NUExFVEUnICYmIHRoaXMudmFsdWVUcmFuc2Zvcm0gPT09IHVuZGVmaW5lZCl7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBTaWlGaWx0ZXIgOmVsZW1lbnQgQVVUT0NPTVBMRVRFIG5lZWRzIHRoZSBkZWNsYXJhdGlvbiBvZiBbdmFsdWVUcmFuc2Zvcm1dIGApO1xyXG4gICAgICB9XHJcbiAgICAgIGlmICh0aGlzLnR5cGUgPT09ICdBVVRPQ09NUExFVEUnICYmIHRoaXMuc2lpRmlsdGVySW5wdVJlZiA9PT0gdW5kZWZpbmVkKXtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFNpaUZpbHRlciA6ZWxlbWVudCBBVVRPQ09NUExFVEUgbmVlZHMgdGhlIGRlY2xhcmF0aW9uIG9mIFtzaWlGaWx0ZXJJbnB1UmVmXSBgKTtcclxuICAgICAgfVxyXG5cclxuXHJcbiAgICAgIGNvbnN0IGluaXRTZWxWYWwgPSB0aGlzLmdldEluaXRTZWxlY3Rpb24oKTtcclxuICAgICAgaWYgKGluaXRTZWxWYWwgIT09IHVuZGVmaW5lZCl7XHJcbiAgICAgICAgdGhpcy5zZXRWYWx1ZShpbml0U2VsVmFsKTtcclxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgIHRoaXMudXRpbHMuaW5pdGlhbGl6ZWQgPSB0cnVlO1xyXG4gICAgICAgIH0sIDgwMCk7XHJcbiAgICAgIH1lbHNle1xyXG4gICAgICAgIHRoaXMudXRpbHMuaW5pdGlhbGl6ZWQgPSB0cnVlO1xyXG4gICAgICB9XHJcblxyXG5cclxuICAgIH07XHJcblxyXG4gICAgICAvLyAtLS0tLS0tLW92ZXJyaWRlIHBhcmVudCBmdW5jdFxyXG4gICAgdGhpcy5hZGRTZWxlY3Rpb24gPSAoKSA9PiB7XHJcbiAgICAvLyB0aGlzLmZhY2V0U2VsZWN0aW9uPWl0ZW0uY29kZTtcclxuICAgIC8vIHRoaXMudXBkYXRlRmFjZXRTZWxlY3Rpb24oKTtcclxuICAgIC8vIGNvbnNvbGUubG9nKCcjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyBzaWlmaWx0ZXIgYWRkU2VsZWN0aW9uICcpO1xyXG4gIH07XHJcblxyXG4gIC8vIC0tLS0tLS0tb3ZlcnJpZGUgcGFyZW50IGZ1bmN0XHJcbiAgICB0aGlzLnJlbW92ZVNlbGVjdGlvbiA9IChpdGVtOiBTaWlGYWNldE9wdGlvbkR0bywgcHJvcGFnYXRlPXRydWUpID0+IHtcclxuXHJcbiAgICBzd2l0Y2ggKHRoaXMudHlwZSl7XHJcbiAgICAgIGNhc2UgJ0lOUFVUJzpcclxuICAgICAgICB0aGlzLm1hdElucHV0LnZhbHVlID0gJyc7XHJcbiAgICAgICAgdGhpcy5mYWNldFNlbGVjdGlvbiA9IHVuZGVmaW5lZDtcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSAnU0VMRUNUJzpcclxuICAgICAgICBpZiAodGhpcy5tYXRTZWxlY3QubXVsdGlwbGUpe1xyXG4gICAgICAgICAgY29uc3QgaSA9IHRoaXMubWF0U2VsZWN0LnZhbHVlLmZpbmRJbmRleCgoZSkgPT4gZSA9PT0gaXRlbS5jb2RlKTtcclxuICAgICAgICAgIGlmIChpICE9PSAtMSl7XHJcbiAgICAgICAgICAgIHRoaXMubWF0U2VsZWN0LndyaXRlVmFsdWUodGhpcy5tYXRTZWxlY3QudmFsdWUuZmlsdGVyKChpdGVtLCBpbmRleCkgPT4gaW5kZXggIT09IGkpKTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IHNwbGl0dGVkVmFsdWVzID0gdGhpcy5tYXRTZWxlY3QudHJpZ2dlclZhbHVlLnNwbGl0KCcsJyk7XHJcbiAgICAgICAgICAgIGNvbnN0IHNlbFZBbCA9IFtdO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMubWF0U2VsZWN0LnZhbHVlLmxlbmd0aDsgaSsrKXtcclxuICAgICAgICAgICAgICAgICBzZWxWQWwucHVzaCh7Y29kZTogdGhpcy5tYXRTZWxlY3QudmFsdWVbaV0sIGNvdW50OiAxLCBkZXNjcjogc3BsaXR0ZWRWYWx1ZXNbaV19KTtcclxuICAgICAgICAgICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICAgICAgdGhpcy5mYWNldFNlbGVjdGlvbiA9IHNlbFZBbDtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgIHRoaXMubWF0U2VsZWN0LnZhbHVlID0gdGhpcy5vcHRpb25zSW5pdFZhbHVlO1xyXG4gICAgICAgICAgdGhpcy5mYWNldFNlbGVjdGlvbiA9IHRoaXMub3B0aW9uc0luaXRWYWx1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgJ1RPR0dMRSc6XHJcbiAgICAgICAgdGhpcy5tYXRTbGlkZVRvZ2dsZS50b2dnbGUoKTtcclxuICAgICAgICB0aGlzLmZhY2V0U2VsZWN0aW9uID0gdGhpcy5tYXRTbGlkZVRvZ2dsZS5jaGVja2VkID8gdHJ1ZSA6IHVuZGVmaW5lZDtcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSAnUkFESU8nOlxyXG4gICAgICAgIHRoaXMubWF0UmFkaW9Hcm91cC52YWx1ZSA9IHVuZGVmaW5lZDtcclxuICAgICAgICB0aGlzLmZhY2V0U2VsZWN0aW9uID0gdW5kZWZpbmVkO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlICdEQVRFUElDS0VSJzpcclxuICAgICAgICB0aGlzLm1hdERhdGVwaWNrZXIudmFsdWUgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgdGhpcy5mYWNldFNlbGVjdGlvbiA9IHVuZGVmaW5lZDtcclxuICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlICdZRUFSX01PTlRIJzpcclxuICAgICAgICAgIHRoaXMueWVhck1vbnRoSW5wdXQud3JpdGVWYWx1ZShudWxsKTtcclxuICAgICAgICAgIHRoaXMuZmFjZXRTZWxlY3Rpb24gPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSAnTE9PS1VQX0VNUExPWUVFJzpcclxuICAgICAgICB0aGlzLmxvb2t1cEVtcGxveWVlLndyaXRlVmFsdWUobnVsbCk7XHJcbiAgICAgICAgaWYgKHRoaXMubXVsdGlwbGUpe1xyXG4gICAgICAgICAgY29uc3QgbGVJdGVtSW5kZXggPSB0aGlzLmZhY2V0U2VsZWN0aW9uLmZpbmRJbmRleChpID0+IGkuY29kZSA9PT0gaXRlbS5jb2RlKTtcclxuICAgICAgICAgIGlmIChsZUl0ZW1JbmRleCAhPT0gLTEpe1xyXG4gICAgICAgICAgIHRoaXMuZmFjZXRTZWxlY3Rpb24uc3BsaWNlKGxlSXRlbUluZGV4LCAxKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgdGhpcy5mYWNldFNlbGVjdGlvbiA9IHVuZGVmaW5lZDtcclxuICAgICAgICAgfVxyXG5cclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSAnQVVUT0NPTVBMRVRFJzpcclxuICAgICAgIHRoaXMuY2xlYXJBdXRvY29tcGxldGUoKTtcclxuICAgICAgIGlmICh0aGlzLm11bHRpcGxlKXtcclxuICAgICAgICBjb25zdCBBQ2l0ZW1JbmRleCA9IHRoaXMuZmFjZXRTZWxlY3Rpb24uZmluZEluZGV4KGkgPT4gaS5jb2RlID09PSBpdGVtLmNvZGUpO1xyXG4gICAgICAgIGlmIChBQ2l0ZW1JbmRleCAhPT0gLTEpe1xyXG4gICAgICAgICB0aGlzLmZhY2V0U2VsZWN0aW9uLnNwbGljZShBQ2l0ZW1JbmRleCwgMSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgfWVsc2V7XHJcbiAgICAgICAgIHRoaXMuZmFjZXRTZWxlY3Rpb24gPSB1bmRlZmluZWQ7XHJcbiAgICAgICB9XHJcbiAgICAgICBicmVhaztcclxuXHJcbiAgICB9XHJcblxyXG4gICAgaWYocHJvcGFnYXRlKXtcclxuICAgICAgdGhpcy51cGRhdGVGYWNldFNlbGVjdGlvbigpO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG5cclxuXHJcbiAgLy8gLS0tLS0tLS1vdmVycmlkZSBwYXJlbnQgZnVuY3RcclxuICAgIHRoaXMucmVtb3ZlQWxsU2VsZWN0aW9ucyA9ICgpID0+IHtcclxuICAgIGlmICh0aGlzLmZhY2V0U2VsZWN0aW9uICE9PSB1bmRlZmluZWQpe1xyXG5cclxuICAgICAgaWYgKHRoaXMuZmFjZXRTZWxlY3Rpb24gIT09IHVuZGVmaW5lZCAmJiB0aGlzLmZhY2V0U2VsZWN0aW9uIGluc3RhbmNlb2YgQXJyYXkpe1xyXG4gICAgICAgIFsuLi50aGlzLmZhY2V0U2VsZWN0aW9uXS5mb3JFYWNoKGYgPT4gdGhpcy5yZW1vdmVTZWxlY3Rpb24oZixmYWxzZSkpO1xyXG4gICAgICB9ZWxzZXtcclxuICAgICAgICB0aGlzLnJlbW92ZVNlbGVjdGlvbih0aGlzLmZhY2V0U2VsZWN0aW9uLCBmYWxzZSApO1xyXG4gICAgICB9XHJcbiAgICAgIHRoaXMudXBkYXRlRmFjZXRTZWxlY3Rpb24oZmFsc2UpO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gICAgdGhpcy5yZW1vdmVGYWNldFNlbGVjdGlvbkZyb21GYWNldFN1bW1hcnlDYWxsYmFjayA9IChmczogU2lpRmFjZXREdG8pID0+IHtcclxuICAgIGlmIChmcy5uYW1lID09PSB0aGlzLmNvbmZpZy5uYW1lKXtcclxuICAgICAgZnMuZmFjZXRPcHRpb25zLmZvckVhY2goZiA9PiB0aGlzLnJlbW92ZVNlbGVjdGlvbihmKSk7XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgICB0aGlzLmdldEluaXRTZWxlY3Rpb24gPSAoKSA9PiB7XHJcbiAgICByZXR1cm4gdGhpcy5zaWlGYWNldFNlcnZpY2UuX2luaXRGYWNldFRvU2V0LmZhY2V0c1t0aGlzLmNvbmZpZy5uYW1lXSB8fCB0aGlzLm9wdGlvbnNJbml0VmFsdWU7XHJcbiAgICB9O1xyXG5cclxuICAgIHRoaXMuY2hhbmdlRmFjZXRzID0gKGZhY2V0czogQXJyYXk8c3RyaW5nPikgPT4ge1xyXG4gICAgICB0aGlzLnNldFZhbHVlKGZhY2V0cyk7XHJcbiAgICB9O1xyXG5cclxuICB9XHJcblxyXG4gIHByaXZhdGUgbXVsdGlNYXRTZWxlY3RWYWx1ZUV4dHJhY3Rpb24oaW5pdFNlbFZhbDogYW55KSB7XHJcbiAgICBjb25zdCBzcGxpdHRlZFZhbHVlcyA9IHRoaXMubWF0U2VsZWN0LnRyaWdnZXJWYWx1ZS5zcGxpdCgnLCcpO1xyXG4gICAgY29uc3Qgc2VsVkFsID0gW107XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGluaXRTZWxWYWwubGVuZ3RoOyBpKyspIHtcclxuICAgICAgc2VsVkFsLnB1c2goeyBjb2RlOiBpbml0U2VsVmFsW2ldLCBjb3VudDogMSwgZGVzY3I6IHNwbGl0dGVkVmFsdWVzW2ldIH0pO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRoaXMuZ2V0T3JEZWZhdWx0KHNlbFZBbCk7XHJcbiAgfVxyXG5cclxuICBuZ09uRGVzdHJveSgpOiB2b2lkIHtcclxuICAgIHRoaXMudmFsdWVDaGFuZ2VTdWJqLnVuc3Vic2NyaWJlKCk7XHJcbiAgfVxyXG5cclxuICBnZXRPckRlZmF1bHQodmFsdWU6IGFueSwgZGVmYXVsdFZhbD86IGFueSl7XHJcbiAgICBpZiAodGhpcy52YWx1ZVRyYW5zZm9ybSAhPT0gdW5kZWZpbmVkKXtcclxuICAgICAgcmV0dXJuIHRoaXMudmFsdWVUcmFuc2Zvcm0odmFsdWUpO1xyXG4gICAgfVxyXG4gICAgZWxzZXtcclxuICAgICAgcmV0dXJuIGRlZmF1bHRWYWwgIT09IHVuZGVmaW5lZCA/IGRlZmF1bHRWYWwgOiAgdmFsdWU7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBjbGVhckF1dG9jb21wbGV0ZSgpe1xyXG4gICAgdGhpcy5zaWlGaWx0ZXJJbnB1UmVmLnZhbHVlID0gJyc7XHJcbiAgICB0aGlzLnNpaUZpbHRlcklucHVSZWYuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoJ2lucHV0JykpOyAvLyB0aGlzIGlzIHRvIHVwZGF0ZSB0aGUgbGlzdCBvZiBhdXRjb21wbGV0ZVxyXG4gICAgLy8gY29uc3QgdCA9IG5ldyBNYXRPcHRpb24obnVsbCwgbnVsbCwgdGhpcy5tYXRBdXRvY29tcGxldGUsIG51bGwpO1xyXG4gICAgLy8gdC52YWx1ZSA9IG51bGw7XHJcbiAgICAvLyBjb25zdCBldmVudCA9IG5ldyBNYXRBdXRvY29tcGxldGVTZWxlY3RlZEV2ZW50KHRoaXMubWF0QXV0b2NvbXBsZXRlLCB0KTtcclxuICAgIC8vIHRoaXMubWF0QXV0b2NvbXBsZXRlLm9wdGlvblNlbGVjdGVkLmVtaXQoZXZlbnQpO1xyXG4gIH1cclxuXHJcbiAgY2hlY2tUeXBlKCl7XHJcblxyXG4gICAgaWYgKHRoaXMubWF0SW5wdXQpe1xyXG4gICAgICBpZiAodGhpcy5tYXREYXRlcGlja2VyKXtcclxuICAgICAgICAvLyB0aGlzIGJlY2F1c2UgZGF0YXBpY2tlciB3b3JrcyBpbiBtYXRJbnB1dFxyXG4gICAgICAgIHRoaXMudHlwZSA9ICdEQVRFUElDS0VSJztcclxuICAgICAgfWVsc2V7XHJcbiAgICAgICAgdGhpcy50eXBlID0gJ0lOUFVUJztcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAodGhpcy5tYXRTZWxlY3Qpe1xyXG4gICAgICB0aGlzLnR5cGUgPSAnU0VMRUNUJztcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKHRoaXMubWF0U2xpZGVUb2dnbGUpe1xyXG4gICAgICB0aGlzLnR5cGUgPSAnVE9HR0xFJztcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKHRoaXMubWF0UmFkaW9Hcm91cCl7XHJcbiAgICAgIHRoaXMudHlwZSA9ICdSQURJTyc7XHJcbiAgICB9ZWxzZSBpZiAodGhpcy5sb29rdXBFbXBsb3llZSl7XHJcbiAgICAgIHRoaXMudHlwZSA9ICdMT09LVVBfRU1QTE9ZRUUnO1xyXG4gICAgfWVsc2UgaWYgKHRoaXMubWF0QXV0b2NvbXBsZXRlKXtcclxuICAgICAgdGhpcy50eXBlID0gJ0FVVE9DT01QTEVURSc7XHJcbiAgICB9ZWxzZSBpZiAodGhpcy55ZWFyTW9udGhJbnB1dCl7XHJcbiAgICAgIHRoaXMudHlwZSA9ICdZRUFSX01PTlRIJztcclxuICAgIH1cclxuXHJcblxyXG4gICAgaWYgKHRoaXMudHlwZSA9PT0gdW5kZWZpbmVkKXtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKGBTaWlGaWx0ZXIgZWxlbWVudG8gJHt0aGlzLmVsLm5hdGl2ZUVsZW1lbnQubG9jYWxOYW1lfSBub24gZ2VzdGl0b2ApO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgc2V0VmFsdWUoaW5pdFNlbFZhbDogYW55KXtcclxuICAgIHN3aXRjaCAodGhpcy50eXBlKXtcclxuICAgICAgY2FzZSAnSU5QVVQnOlxyXG4gICAgICAgIHRoaXMubWF0SW5wdXQudmFsdWUgPSBpbml0U2VsVmFsO1xyXG4gICAgICAgIHRoaXMudmFsdWVDaGFuZ2VTdWJqLm5leHQodGhpcy5nZXRPckRlZmF1bHQoaW5pdFNlbFZhbCkpO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlICdTRUxFQ1QnOlxyXG4gICAgICAgIGlmICh0aGlzLm1hdFNlbGVjdC5tdWx0aXBsZSl7XHJcbiAgICAgICAgICAgIHRoaXMubWF0U2VsZWN0LndyaXRlVmFsdWUoaW5pdFNlbFZhbCk7XHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy5tYXRTZWxlY3QudHJpZ2dlclZhbHVlID09PSAnJyl7XHJcbiAgICAgICAgICAgICAgLy8gaWYgdGhlIG9wdGlvbnMgdmFsdWVzIGFyZSBub3QganVzdCBsb2FkZWRcclxuXHJcbiAgICAgICAgICAgICAgdGhpcy52YWx1ZUNoYW5nZVN1YmoubmV4dCggaW5pdFNlbFZhbCk7XHJcblxyXG5cclxuICAgICAgICAgICAgICBjb25zdCB2Y3MgPSB0aGlzLm1hdFNlbGVjdC5vcHRpb25zLmNoYW5nZXMuc3Vic2NyaWJlKCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgdmNzLnVuc3Vic2NyaWJlKCk7XHJcbiAgICAgICAgICAgICAgICAgIFByb21pc2UucmVzb2x2ZSgpLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHNwbGl0dGVkVmFsdWVzID0gdGhpcy5tYXRTZWxlY3QudHJpZ2dlclZhbHVlLnNwbGl0KCcsJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgc2VsTWFwID0ge307XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBpbml0U2VsVmFsLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICBzZWxNYXBbaW5pdFNlbFZhbFtpXV0gPSBzcGxpdHRlZFZhbHVlc1tpXTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgKHRoaXMuZmFjZXRTZWxlY3Rpb24gYXMgQXJyYXk8U2lpRmFjZXRPcHRpb25EdG8+KS5mb3JFYWNoKChpID0+IGkuZGVzY3IgPSBzZWxNYXBbaS5jb2RlXSkpO1xyXG4gICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9ZWxzZXtcclxuXHJcbiAgICAgICAgICAgICAgY29uc3Qgc3BsaXR0ZWRWYWx1ZXMgPSB0aGlzLm1hdFNlbGVjdC50cmlnZ2VyVmFsdWUuc3BsaXQoJywnKTtcclxuICAgICAgICAgICAgICBjb25zdCBzZWxWQWwgPSBbXTtcclxuICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGluaXRTZWxWYWwubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHNlbFZBbC5wdXNoKHsgY29kZTogaW5pdFNlbFZhbFtpXSwgY291bnQ6IDEsIGRlc2NyOiBzcGxpdHRlZFZhbHVlc1tpXSB9KTtcclxuICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgIHRoaXMudmFsdWVDaGFuZ2VTdWJqLm5leHQodGhpcy5nZXRPckRlZmF1bHQoc2VsVkFsKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICB0aGlzLm1hdFNlbGVjdC52YWx1ZSA9IGluaXRTZWxWYWw7XHJcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnZhbHVlQ2hhbmdlU3Viai5uZXh0KHRoaXMuZ2V0T3JEZWZhdWx0KHtjb2RlOiBpbml0U2VsVmFsLCBjb3VudDogMSwgZGVzY3I6IHRoaXMubWF0U2VsZWN0LnRyaWdnZXJWYWx1ZX0pKTtcclxuICAgICAgICAgIH0sIDUwMCk7XHJcbiAgICAgICAgICB9XHJcblxyXG5cclxuXHJcbiAgICAgICAgLy8gdGhpcy52YWx1ZUNoYW5nZVN1YmoubmV4dCh0aGlzLmdldE9yRGVmYXVsdChpbml0U2VsVmFsKSk7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgJ1RPR0dMRSc6XHJcbiAgICAgICAgdGhpcy5tYXRTbGlkZVRvZ2dsZS5jaGVja2VkID0gaW5pdFNlbFZhbDtcclxuICAgICAgICAvLyB0aGlzLnZhbHVlQ2hhbmdlU3Viai5uZXh0KHRoaXMuZ2V0T3JEZWZhdWx0KGluaXRTZWxWYWwpKTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSAnUkFESU8nOlxyXG4gICAgICAgIHRoaXMubWF0UmFkaW9Hcm91cC52YWx1ZSA9IGluaXRTZWxWYWw7XHJcbiAgICAgICAgdGhpcy52YWx1ZUNoYW5nZVN1YmoubmV4dCh0aGlzLmdldE9yRGVmYXVsdChpbml0U2VsVmFsKSk7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgJ0RBVEVQSUNLRVInOlxyXG4gICAgICAgIGlmIChpbml0U2VsVmFsICE9IG51bGwpe1xyXG4gICAgICAgICAgaW5pdFNlbFZhbCA9IG5ldyBEYXRlKGluaXRTZWxWYWwpO1xyXG4gICAgICAgICAgaWYgKGlzTmFOKGluaXRTZWxWYWwpKXtcclxuICAgICAgICAgICAgaW5pdFNlbFZhbCA9IG51bGw7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMubWF0RGF0ZXBpY2tlci52YWx1ZSA9IGluaXRTZWxWYWw7XHJcbiAgICAgICAgdGhpcy52YWx1ZUNoYW5nZVN1YmoubmV4dChpbml0U2VsVmFsICE9IG51bGwgPyB0aGlzLmdldE9yRGVmYXVsdChpbml0U2VsVmFsKSA6IG51bGwpO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlICdMT09LVVBfRU1QTE9ZRUUnOlxyXG4gICAgICAgIGlmICh0aGlzLm11bHRpcGxlKXtcclxuICAgICAgICAgIGlmIChpbml0U2VsVmFsICE9IG51bGwpe1xyXG4gICAgICAgICAgICBpZiAoaW5pdFNlbFZhbCBpbnN0YW5jZW9mIEFycmF5KXtcclxuICAgICAgICAgICAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bWF4LWxpbmUtbGVuZ3RoXHJcbiAgICAgICAgICAgICAgdGhpcy52YWx1ZUNoYW5nZVN1YmoubmV4dCggaW5pdFNlbFZhbC5tYXAoIGkgPT4gdGhpcy5nZXRPckRlZmF1bHQoaSwge2NvZGU6IGkud29ya2VySWQsIGNvdW50OiAxLCBkZXNjcjogaS5zdXJuYW1lICsgJyAnICsgaS5uYW1lfSkpKTtcclxuICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm1heC1saW5lLWxlbmd0aFxyXG4gICAgICAgICAgICAgIHRoaXMudmFsdWVDaGFuZ2VTdWJqLm5leHQoIFt0aGlzLmdldE9yRGVmYXVsdChpbml0U2VsVmFsLCB7Y29kZTogaW5pdFNlbFZhbC53b3JrZXJJZCwgY291bnQ6IDEsIGRlc2NyOiBpbml0U2VsVmFsLnN1cm5hbWUgKyAnICcgKyBpbml0U2VsVmFsLm5hbWV9KV0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICB0aGlzLmxvb2t1cEVtcGxveWVlLndyaXRlVmFsdWUoaW5pdFNlbFZhbCk7XHJcbiAgICAgICAgICBjb25zdCB2ID0gaW5pdFNlbFZhbCAhPSBudWxsID8gdGhpcy5nZXRPckRlZmF1bHQoaW5pdFNlbFZhbCwge2NvZGU6IGluaXRTZWxWYWwud29ya2VySWQsIGNvdW50OiAxLCBkZXNjcjogaW5pdFNlbFZhbC5zdXJuYW1lICsgJyAnICsgaW5pdFNlbFZhbC5uYW1lfSkgOiBudWxsO1xyXG4gICAgICAgICAgdGhpcy52YWx1ZUNoYW5nZVN1YmoubmV4dCh2KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgJ0FVVE9DT01QTEVURSc6XHJcbiAgICAgICAgdGhpcy5zaWlGaWx0ZXJJbnB1UmVmLnZhbHVlID0gdGhpcy5tYXRBdXRvY29tcGxldGUuZGlzcGxheVdpdGgoaW5pdFNlbFZhbCk7XHJcbiAgICAgICAgLy8gdGhpcy5tYXRBdXRvY29tcGxldGUub3B0aW9uU2VsZWN0ZWQuZW1pdChpbml0U2VsVmFsKTtcclxuICAgICAgICBjb25zdCB0ID0gbmV3IE1hdE9wdGlvbihudWxsLCBudWxsLCB0aGlzLm1hdEF1dG9jb21wbGV0ZSwgbnVsbCk7XHJcbiAgICAgICAgdC52YWx1ZSA9IGluaXRTZWxWYWw7XHJcbiAgICAgICAgY29uc3QgZXZlbnQgPSBuZXcgTWF0QXV0b2NvbXBsZXRlU2VsZWN0ZWRFdmVudCh0aGlzLm1hdEF1dG9jb21wbGV0ZSwgdCk7XHJcbiAgICAgICAgaWYgKHRoaXMubXVsdGlwbGUpe1xyXG4gICAgICAgICAgaWYgKGluaXRTZWxWYWwgIT0gbnVsbCl7XHJcbiAgICAgICAgICAgIGlmIChpbml0U2VsVmFsIGluc3RhbmNlb2YgQXJyYXkpe1xyXG4gICAgICAgICAgICAgIHRoaXMudmFsdWVDaGFuZ2VTdWJqLm5leHQoIGluaXRTZWxWYWwubWFwKCBpID0+IHRoaXMuZ2V0T3JEZWZhdWx0KGkpKSk7XHJcbiAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgIHRoaXMudmFsdWVDaGFuZ2VTdWJqLm5leHQoIFt0aGlzLmdldE9yRGVmYXVsdChpbml0U2VsVmFsKV0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuY2xlYXJBdXRvY29tcGxldGUoKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgIHRoaXMubWF0QXV0b2NvbXBsZXRlLm9wdGlvblNlbGVjdGVkLmVtaXQoZXZlbnQpO1xyXG4gICAgICAgICAgdGhpcy52YWx1ZUNoYW5nZVN1YmoubmV4dCh0aGlzLmdldE9yRGVmYXVsdChpbml0U2VsVmFsKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgY2FzZSAnWUVBUl9NT05USCc6XHJcbiAgICAgICAgdGhpcy55ZWFyTW9udGhJbnB1dC53cml0ZVZhbHVlKGluaXRTZWxWYWwpO1xyXG4gICAgICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTptYXgtbGluZS1sZW5ndGhcclxuICAgICAgICBjb25zdCB2eW0gPSBpbml0U2VsVmFsICE9IG51bGwgPyB0aGlzLmdldE9yRGVmYXVsdChpbml0U2VsVmFsLCB7Y29kZTogaW5pdFNlbFZhbCwgY291bnQ6IDEsIGRlc2NyOiBpbml0U2VsVmFsLnllYXIgKyAnLycgKyBpbml0U2VsVmFsLm1vbnRofSkgOiBudWxsO1xyXG4gICAgICAgIHRoaXMudmFsdWVDaGFuZ2VTdWJqLm5leHQodnltKTtcclxuICAgICAgICBicmVhaztcclxuICAgIH1cclxuICB9XHJcblxyXG59XHJcbiJdfQ==