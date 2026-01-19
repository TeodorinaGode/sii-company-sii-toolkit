import { OnChanges, SimpleChanges } from '@angular/core';
import { SiiToolkitService } from '../../sii-toolkit.service';
import { WorkerContactInformationComponent } from '../worker-contact-information/worker-contact-information.component';
import * as i0 from "@angular/core";
export declare class WorkerIconComponent implements OnChanges {
    siiToolkitService: SiiToolkitService;
    wci: WorkerContactInformationComponent;
    lavuid: string;
    showContact: boolean;
    siiWorkerContactInformationServiceUrl?: string;
    photoURL: string;
    constructor(siiToolkitService: SiiToolkitService);
    ngOnChanges(changes: SimpleChanges): void;
    openContactInformation(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<WorkerIconComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<WorkerIconComponent, "sii-worker-icon", never, { "lavuid": { "alias": "lavuid"; "required": false; }; "showContact": { "alias": "showContact"; "required": false; }; "siiWorkerContactInformationServiceUrl": { "alias": "siiWorkerContactInformationServiceUrl"; "required": false; }; }, {}, never, never, true, never>;
}
