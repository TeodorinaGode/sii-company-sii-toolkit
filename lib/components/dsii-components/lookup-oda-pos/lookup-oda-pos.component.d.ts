import { HttpClient } from '@angular/common/http';
import { AbstractControl, ControlValueAccessor, UntypedFormControl, Validator } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { ILookupOdaDataDTO } from './domain/lookup-oda-data.dto';
import { IOdaposDTO } from './domain/oda-pos.dto';
import { SiiToolkitService } from '../../../sii-toolkit.service';
import { MatFormFieldAppearance } from '@angular/material/form-field';
import * as i0 from "@angular/core";
export declare class LookupOdaPosComponent implements Validator, ControlValueAccessor {
    http: HttpClient;
    dialog: MatDialog;
    siiToolkitService: SiiToolkitService;
    appearance: MatFormFieldAppearance;
    codSociety: string;
    codSupplier: string;
    lavMatricola: string;
    tipologie: number[];
    disabled: boolean;
    required: boolean;
    utils: {
        odaValid: boolean;
        odaLength: number;
        loadingInProgress: boolean;
    };
    selectedItem: IOdaposDTO;
    lookupOdaComponentCtrl: UntypedFormControl;
    odaRestObs: Observable<ILookupOdaDataDTO[]>;
    propagateChange: any;
    onTouchedCallback: any;
    validatorCallback: any;
    constructor(http: HttpClient, dialog: MatDialog, siiToolkitService: SiiToolkitService);
    getOdaDataFromServer(val: string): Observable<ILookupOdaDataDTO[]>;
    useOdaDefaultRestObs(txt: string): Observable<ILookupOdaDataDTO[]>;
    displayOdaFn(oda: ILookupOdaDataDTO): string | undefined;
    onSelectionChanged(event: MatAutocompleteSelectedEvent): void;
    onChange(item: ILookupOdaDataDTO): void;
    validate(control: AbstractControl): {
        [key: string]: any;
    } | null;
    registerOnValidatorChange?(fn: () => void): void;
    writeValue(obj: any): void;
    registerOnChange(fn: any): void;
    registerOnTouched(fn: any): void;
    setDisabledState(isDisabled: boolean): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<LookupOdaPosComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<LookupOdaPosComponent, "sii-lookup-oda-pos", never, { "appearance": { "alias": "appearance"; "required": false; }; "codSociety": { "alias": "codSociety"; "required": false; }; "codSupplier": { "alias": "codSupplier"; "required": false; }; "lavMatricola": { "alias": "lavMatricola"; "required": false; }; "tipologie": { "alias": "tipologie"; "required": false; }; "disabled": { "alias": "disabled"; "required": false; }; "required": { "alias": "required"; "required": false; }; }, {}, never, never, true, never>;
}
