import { OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import * as i0 from "@angular/core";
export declare class FilePreviewDialogComponent implements OnInit {
    file: any;
    private sanitizer;
    dialogRef: MatDialogRef<FilePreviewDialogComponent>;
    utils: {
        isImage: any;
        fileUrl: any;
    };
    constructor(file: any, sanitizer: DomSanitizer, dialogRef: MatDialogRef<FilePreviewDialogComponent>);
    ngOnInit(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<FilePreviewDialogComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<FilePreviewDialogComponent, "sii-file-preview-dialog", never, {}, {}, never, never, true, never>;
}
