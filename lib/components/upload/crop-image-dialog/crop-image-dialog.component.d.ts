import { ChangeDetectorRef, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import * as i0 from "@angular/core";
export declare class CropImageDialogComponent implements OnInit {
    data: any;
    dialogRef: MatDialogRef<CropImageDialogComponent>;
    private renderer;
    private cdref;
    utils: {
        maxWidth: string;
        rotation: number;
        originalImageWidth: number;
        originalImageHeight: number;
        initImageWidth: any;
        initImageHeight: any;
        isVerticalOriginalImage: boolean;
        quality: number;
        errorImageLoad: boolean;
    };
    isVertical: boolean;
    croppedImage: any;
    photoToSave: File;
    cropperCanvas: ElementRef;
    constructor(data: any, dialogRef: MatDialogRef<CropImageDialogComponent>, renderer: Renderer2, cdref: ChangeDetectorRef);
    ngOnInit(): void;
    onNoClick(): void;
    confirmImage(): void;
    likeSize(size1: any, size2: any): boolean;
    rotate(): void;
    imageCropped(crop: ImageCroppedEvent): void;
    fileImageLoaded(data: any): void;
    calculateOriginalImageProp(): void;
    updatePhotoCroppedFromCanvas(canvas: any, mimeType: string, qualityArgument: number): void;
    loadImageFailed: () => void;
    blobToFile: (theBlob: Blob, fileName: string, mimeType: string) => File;
    static ɵfac: i0.ɵɵFactoryDeclaration<CropImageDialogComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<CropImageDialogComponent, "sii-crop-image-dialog", never, {}, {}, never, never, true, never>;
}
