import { OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MyselfDelegateduserDTO } from '../../../../dto/myself.dto';
import { SiiToolkitService } from '../../../../sii-toolkit.service';
import * as i0 from "@angular/core";
export declare class DelegationDialogComponent implements OnInit {
    dialogRef: MatDialogRef<DelegationDialogComponent>;
    availableDelegations: MyselfDelegateduserDTO[];
    constructor(dialogRef: MatDialogRef<DelegationDialogComponent>, siiToolkitService: SiiToolkitService);
    ngOnInit(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<DelegationDialogComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<DelegationDialogComponent, "sii-delegation-dialog", never, {}, {}, never, never, true, never>;
}
