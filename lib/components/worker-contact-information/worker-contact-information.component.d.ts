import { Clipboard } from '@angular/cdk/clipboard';
import { OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { WorkerContactInformationDto } from '../../dto/i-worker-contact-information.dto';
import { SiiToolkitService } from '../../sii-toolkit.service';
import { SiiWaitService } from '../wait/sii-wait.service';
import * as i0 from "@angular/core";
export declare class WorkerContactInformationComponent implements OnInit, OnChanges {
    siiToolkitService: SiiToolkitService;
    private clipboard;
    private siiWait;
    workerId: any;
    serviceUrl?: string;
    data: WorkerContactInformationDto;
    noContacsInformation: boolean;
    trigger: MatMenuTrigger;
    constructor(siiToolkitService: SiiToolkitService, clipboard: Clipboard, siiWait: SiiWaitService);
    ngOnChanges(changes: SimpleChanges): void;
    ngOnInit(): void;
    openMenu(): void;
    loadInformation(): void;
    call(phone: any): void;
    sendMail(mail: any): void;
    openTeams(mail: any): void;
    private createAndClickHref;
    copyToClipboard(item: any, ev: MouseEvent): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<WorkerContactInformationComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<WorkerContactInformationComponent, "sii-worker-contact-information", never, { "workerId": { "alias": "workerId"; "required": false; }; "serviceUrl": { "alias": "serviceUrl"; "required": false; }; }, {}, never, never, true, never>;
}
