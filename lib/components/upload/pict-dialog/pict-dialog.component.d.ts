import { ChangeDetectorRef, ElementRef, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import * as i0 from "@angular/core";
export declare class PictDialogComponent implements OnInit, OnDestroy {
    data: any;
    private cdref;
    private renderer;
    dialogRef: MatDialogRef<PictDialogComponent>;
    videoElement: ElementRef;
    videoCanvas: ElementRef;
    cropperCanvas: ElementRef;
    pictDone: boolean;
    photoToSave: File;
    canvasPhotoExtraction: any;
    videoStream: any;
    videoWidth: number;
    videoHeight: number;
    videoActive: boolean;
    isVertical: boolean;
    croppedImage: any;
    cameraConstraints: {
        video: {
            width: {
                ideal: number;
            };
            height: {
                ideal: number;
            };
        };
    };
    constructor(data: any, cdref: ChangeDetectorRef, renderer: Renderer2, dialogRef: MatDialogRef<PictDialogComponent>);
    ngOnInit(): void;
    ngOnDestroy(): void;
    startCamera(): void;
    attachVideo(): void;
    stopVideo(): void;
    onNoClick(): void;
    doPict(): void;
    updatePhotoExtractionFromCanvas(canvas: any, mimeType: string, qualityArgument: number): void;
    webCamIageLoaded(): void;
    imageCropped(crop: ImageCroppedEvent): void;
    updatePhotoCroppedFromCanvas(canvas: any, mimeType: string, qualityArgument: number): void;
    blobToFile: (theBlob: Blob, fileName: string, mimeType: string) => File;
    static ɵfac: i0.ɵɵFactoryDeclaration<PictDialogComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<PictDialogComponent, "sii-pict-dialog", never, {}, {}, never, never, true, never>;
}
