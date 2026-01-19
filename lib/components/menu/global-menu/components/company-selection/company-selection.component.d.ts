import { OnInit } from '@angular/core';
import { GlobalMenuService } from '../../service/global-menu.service';
import { EngCompany } from '../../dto/menu-user-Info.dto';
import * as i0 from "@angular/core";
export declare class SiiCompanySelectionComponent implements OnInit {
    private menuRepository;
    get companies(): EngCompany[];
    get selectedCompany(): EngCompany;
    constructor(menuRepository: GlobalMenuService);
    ngOnInit(): void;
    onCompanySelect(company: string, event: any): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<SiiCompanySelectionComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<SiiCompanySelectionComponent, "sii-company-selection", never, {}, {}, never, never, true, never>;
}
