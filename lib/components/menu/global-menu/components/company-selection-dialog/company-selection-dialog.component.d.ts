import { MatDialogRef } from '@angular/material/dialog';
import { EngCompany } from '../../dto/menu-user-Info.dto';
import * as i0 from "@angular/core";
export interface CompanySelectionDialogComponentData {
    companies: EngCompany[];
    title: string;
}
export declare class CompanySelectionDialogComponent {
    dialogRef: MatDialogRef<CompanySelectionDialogComponent>;
    data: CompanySelectionDialogComponentData;
    constructor(dialogRef: MatDialogRef<CompanySelectionDialogComponent>, data: CompanySelectionDialogComponentData);
    selectCompany(companyId: string): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<CompanySelectionDialogComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<CompanySelectionDialogComponent, "sii-company-selection-dialog", never, {}, {}, never, never, true, never>;
}
