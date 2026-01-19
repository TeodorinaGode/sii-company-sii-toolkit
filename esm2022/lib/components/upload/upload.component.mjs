import { coerceBooleanProperty, coerceNumberProperty } from '@angular/cdk/coercion';
import { Component, forwardRef, HostBinding, HostListener, Input, ViewChild } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { CropImageDialogComponent } from './crop-image-dialog/crop-image-dialog.component';
import { FilePreviewDialogComponent } from './file-preview-dialog/file-preview-dialog.component';
import { PictDialogComponent } from './pict-dialog/pict-dialog.component';
import { SiiMemoryPipe } from '../util/sii-memory.pipe';
import { SiiDatePipe } from '../util/sii-date.pipe';
import { MatMenuTrigger, MatMenu, MatMenuItem } from '@angular/material/menu';
import { MatIconButton, MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import * as i0 from "@angular/core";
import * as i1 from "@angular/material/dialog";
import * as i2 from "@angular/cdk/platform";
import * as i3 from "@angular/platform-browser";
import * as i4 from "../../sii-toolkit.service";
export class UploadComponent {
    get acceptArray() {
        return this.accept !== '' ? this.accept.split(',') : [];
    }
    get acceptText() {
        return this.acceptArray.map(a => a.split('/').pop()).join(', ');
    }
    constructor(dialog, platform, sanitizer, ts) {
        this.dialog = dialog;
        this.platform = platform;
        this.sanitizer = sanitizer;
        this.ts = ts;
        this.webcamAvailable = false;
        // tslint:disable-next-line:variable-name
        this._multiple = false;
        this.isMaxSizeDefault = true;
        this.isMaxSizeSingleDefault = true;
        // tslint:disable-next-line:variable-name
        this._maxSize = 20;
        // tslint:disable-next-line:variable-name
        this._maxSizeSingleFile = 20;
        this.accept = '';
        this.enableCamera = false;
        this.disableDelete = false;
        this.disableCrop = false;
        this.uploadErrorMessage = false;
        this.invalidExt = false;
        this.invalidSize = false;
        this.invalidSizeSingleFile = false;
        this.invalidLength = false;
        this.disabled = false;
        // uploadContainerControl = new FormControl();
        this.selectedFiles = [];
        this.propagateChange = () => { };
        this.onTouchedCallback = () => { };
        this.validatorCallback = () => { };
        this.webcamAvailable = !platform.IOS && !platform.ANDROID && !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
    }
    get multiple() {
        return this._multiple;
    }
    set multiple(value) {
        this._multiple = coerceBooleanProperty(value);
    }
    get maxSize() {
        if (this.isMaxSizeDefault && !this.isMaxSizeSingleDefault) {
            return Math.max(this._maxSize, this._maxSizeSingleFile);
        }
        return this._maxSize;
    }
    set maxSize(value) {
        this._maxSize = coerceNumberProperty(value);
        this.isMaxSizeDefault = false;
    }
    get maxSizeSingleFile() {
        if (!this.isMaxSizeDefault && !this.isMaxSizeSingleDefault) {
            return Math.min(this._maxSize, this._maxSizeSingleFile);
        }
        else if (!this.isMaxSizeDefault && this.isMaxSizeSingleDefault) {
            return this._maxSize;
        }
        return this._maxSizeSingleFile;
    }
    set maxSizeSingleFile(value) {
        this._maxSizeSingleFile = coerceNumberProperty(value);
        this.isMaxSizeSingleDefault = false;
    }
    // Dragover listener
    onDragOver(evt) {
        evt.preventDefault();
        evt.stopPropagation();
        if (!this.disabled) {
            this.fileOver = true;
        }
    }
    // Dragleave listener
    onDragLeave(evt) {
        evt.preventDefault();
        evt.stopPropagation();
        this.fileOver = false;
    }
    // Drop listener
    ondrop(evt) {
        evt.preventDefault();
        evt.stopPropagation();
        this.fileOver = false;
        if (!this.disabled) {
            const files = evt.dataTransfer.files;
            if (files.length > 0) {
                this.onFileDropped(files);
                // this.fileDropped.emit(files);
            }
        }
    }
    registerOnValidatorChange(fn) {
        this.validatorCallback = fn;
    }
    writeValue(obj) {
        if (obj != null) {
            if (this.multiple) {
                this.selectedFiles = obj.map(f => ({ ...f, ...{ _type: this.getFileType(f.file) } }));
            }
            else {
                this.selectedFiles = [obj].map(f => ({ ...f, ...{ _type: this.getFileType(f.file) } }));
            }
        }
        else {
            this.selectedFiles = [];
        }
        // this.uploadContainerControl.setValue(this.selectedFiles);
    }
    registerOnChange(fn) {
        this.propagateChange = fn;
    }
    registerOnTouched(fn) {
        this.onTouchedCallback = fn;
    }
    setDisabledState(isDisabled) {
        this.disabled = isDisabled;
        // isDisabled? this.uploadContainerControl.disable():this.uploadContainerControl.enable();
    }
    onFileDropped($event) {
        if (!!$event && $event.length > 0) {
            this.checkImageToCrop($event).then((fileToLoad) => {
                this.prepareFilesList(fileToLoad);
            }, () => { });
        }
    }
    fileBrowseHandler(files) {
        if (!!files && files.length > 0) {
            this.checkImageToCrop(files).then((fileToLoad) => {
                this.prepareFilesList(fileToLoad);
            }, () => { });
        }
    }
    deleteFile(index, file) {
        const perform = (i) => {
            this.selectedFiles.splice(i, 1);
            this.change(this.selectedFiles);
        };
        if (!!this.deleteService) {
            this.deleteService(file).subscribe(deleted => {
                if (deleted) {
                    perform(index);
                }
            });
        }
        else {
            perform(index);
        }
    }
    loadFilePreviewInformation(fu, force = false) {
        return new Promise((resolve, reject) => {
            if (!fu._imagePreviewUrl || force) {
                const isImage = fu.file.type.match(/image\/*/) != null;
                const isPdf = fu.file.type.match(/pdf\/*/) != null;
                if (isImage || isPdf) {
                    // const reader = new FileReader();
                    // reader.readAsDataURL(fu.file as File);
                    fu._isImage = isImage;
                    fu._imagePreviewUrl = this.sanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(fu.file));
                    resolve();
                    // reader.onloadend = () => {
                    //    fu._imagePreviewUrl =  this.sanitizer.bypassSecurityTrustResourceUrl(reader.result as string);
                    // resolve();
                    //   };
                }
            }
            else {
                resolve();
            }
        });
    }
    downloadableFile(fu) {
        return (fu?.file instanceof File) || this.downloadService != null || this.previewService != null;
    }
    previewableFile(fu) {
        return !!fu?._imagePreviewUrl ||
            (this.previewService != null &&
                (fu?.file?.type?.match(/image\/*/) != null
                    ||
                        fu?.file?.type?.match(/pdf\/*/) != null));
    }
    cropableFile(fu) {
        return (!!fu?._imagePreviewUrl && !!fu._isImage) ||
            (this.previewService != null && fu?.file?.type?.match(/image\/*/) != null);
    }
    cropFile(fu, index) {
        if (fu.file != null && fu.file instanceof File) {
            this.performCropFile(index);
        }
        else if (this.previewService != null) {
            // il file non c'è
            this.previewService(fu.id).subscribe((resp) => {
                const respFile = this.previewServiceResponseToFile(resp, fu);
                if (respFile != null) {
                    fu.file = respFile;
                    this.loadFilePreviewInformation(fu).then(() => {
                        if (fu._isImage) {
                            this.performCropFile(index);
                        }
                        else {
                            console.error('the downloaded file is not of type image or pdf');
                        }
                    });
                }
                else {
                    fu._isImage = false;
                    console.error('the downloaded file is not of type File');
                }
            });
        }
    }
    previewServiceResponseToFile(resp, fu) {
        if (resp instanceof File) {
            return resp;
        }
        else if (resp instanceof Blob) {
            return new File([resp], fu.file.name, { type: resp.type });
        }
        else {
            return null;
        }
    }
    previewFile(fu) {
        if (!!fu?._imagePreviewUrl) {
            this.openPreviewDialog(fu);
        }
        else if (this.previewService != null) {
            this.previewService(fu.id).subscribe((resp) => {
                const respFile = this.previewServiceResponseToFile(resp, fu);
                if (respFile != null) {
                    fu.file = respFile;
                    this.loadFilePreviewInformation(fu).then(() => {
                        if (!!fu._imagePreviewUrl) {
                            this.openPreviewDialog(fu);
                        }
                        else {
                            console.error('the downloaded file is not of type image or pdf');
                        }
                    });
                }
                else {
                    fu._isImage = false;
                    console.error('the downloaded file is not of type File');
                }
            });
        }
        else {
            console.log('error on preview');
        }
    }
    downloadFile(fu) {
        if (fu.file != null && fu.file instanceof File) {
            // il file c'è
            this.buildDownloadLink(fu);
        }
        else if (this.downloadService != null) {
            this.downloadService(fu.id);
        }
        else if (this.previewService != null) {
            // il file non c'è
            this.previewService(fu.id).subscribe((resp) => {
                const respFile = this.previewServiceResponseToFile(resp, fu);
                if (respFile != null) {
                    fu.file = respFile;
                    this.loadFilePreviewInformation(fu).then(() => {
                        this.buildDownloadLink(fu);
                    });
                }
                else {
                    fu._isImage = false;
                    console.error('the downloaded file is not of type File');
                }
            });
        }
    }
    buildDownloadLink(fu) {
        const downloadLink = document.createElement('a');
        downloadLink.href = window.URL.createObjectURL(fu.file);
        downloadLink.setAttribute('download', fu.file.name);
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    }
    prepareFilesList(files) {
        this.checkFile(files).then(() => {
            if (!this.multiple) {
                this.selectedFiles = [];
            }
            for (const it of files) {
                // clono l'oggetto per modificarne la data con quella attuale
                const item = new File([it], it.name, { type: it.type });
                const duplicated = this.selectedFiles.find(sf => sf.file.name === item.name) != null;
                const cf = {
                    name: duplicated ? 'copy-' + item.name : item.name,
                    file: item,
                    creationUser: {
                        firstname: this.ts.loggedUser.value.firstName,
                        lastname: this.ts.loggedUser.value.lastName,
                        userid: this.ts.loggedUser.value.username
                    },
                    id: null,
                    _type: this.getFileType(item)
                };
                this.selectedFiles.push(cf);
                this.loadFilePreviewInformation(cf);
            }
            this.change(this.selectedFiles);
            this.onTouchedCallback();
            this.inputEle.nativeElement.value = '';
        }, (err) => {
            this.uploadErrorMessage = true;
            switch (err) {
                case 'INVALID-FILE-EXTENSION':
                    this.invalidExt = true;
                    break;
                case 'INVALID-FILE-SIZE':
                    this.invalidSize = true;
                    break;
                case 'INVALID-FILE-SIZE-SINGLE-FILE':
                    this.invalidSizeSingleFile = true;
                    break;
                case 'INVALID-FILE-LENGTH':
                    this.invalidLength = true;
                    break;
            }
            setTimeout(() => {
                this.uploadErrorMessage = false;
                this.invalidExt = false;
                this.invalidSize = false;
                this.invalidSizeSingleFile = false;
                this.invalidLength = false;
            }, 4000);
            // remove the file selected
            // if(this.selectedFiles){
            //   this.selectedFiles.length=0;
            // }
            // this.uploadContainerControl.setValue(this.selectedFiles);
            this.inputEle.nativeElement.value = '';
        });
    }
    change(files) {
        if (this.multiple) {
            this.propagateChange(files);
        }
        else {
            this.propagateChange(files.length === 0 ? null : files[0]);
        }
    }
    getFileType(file) {
        if (file.type.match(/image\/*/) != null) {
            return 'IMAGE';
        }
        else if (file.type.match(/pdf\/*/) != null) {
            return 'PDF';
        }
        else if (file.type.match(/csv$/) != null) {
            return 'CSV';
        }
        else if (file.type.match(/\.spreadsheetml$/) != null) {
            return 'EXCEL';
        }
        else if (file.type.match(/\.document$/) != null) {
            return 'WORD';
        }
        else if (file.type.match(/\.presentation$/) != null) {
            return 'POWERPOINT';
        }
    }
    checkImageToCrop(files) {
        return new Promise((resolve, reject) => {
            // get all images file
            const imagesFile = [];
            const othersFile = [];
            for (const f of files) {
                if (f.type.match(/image\/*/) != null) {
                    imagesFile.push(f);
                }
                else {
                    othersFile.push(f);
                }
            }
            // const imagesFile = files.filter(f => f.type.match(/image\/*/) != null);
            if (imagesFile.length === 0 || imagesFile.length > 1) {
                resolve(files);
                return;
            }
            // if i'm here there is only 1 image file
            this.openCropDialog(imagesFile[0])
                .subscribe((photo) => {
                if (!!photo) {
                    othersFile.push(photo);
                    resolve(othersFile);
                }
                else {
                    reject();
                }
            });
        });
    }
    performCropFile(index) {
        this.openCropDialog(this.selectedFiles[index].file)
            .subscribe((photo) => {
            if (!!photo) {
                // remove the id to perform a new upload
                this.selectedFiles[index].prevId = this.selectedFiles[index].id;
                this.selectedFiles[index].id = null;
                this.selectedFiles[index].file = photo;
                this.loadFilePreviewInformation(this.selectedFiles[index], true);
                this.change(this.selectedFiles);
            }
        });
    }
    openCropDialog(file) {
        return this.dialog.open(CropImageDialogComponent, {
            disableClose: true,
            width: '98vw',
            maxWidth: '98vw',
            data: {
                maxSize: (this.multiple ? this.maxSizeSingleFile : this.maxSize),
                aspectRatio: this.aspectRatio,
                resizeToWidth: this.resizeToWidth,
                file
            }
        }).afterClosed();
    }
    openPreviewDialog(fu) {
        if (fu.file.size > (1000 * 1024 * 4)) {
            // Create a link pointing to the ObjectURL containing the blob.
            const url = window.URL.createObjectURL(fu.file);
            const anchor = document.createElement('a');
            anchor.href = url;
            anchor.target = '_blank';
            anchor.click();
            setTimeout(() => {
                // For Firefox it is necessary to delay revoking the ObjectURL
                window.URL.revokeObjectURL(url);
            }, 100);
        }
        else {
            this.dialog.open(FilePreviewDialogComponent, {
                width: '98%',
                maxWidth: '100%',
                // height: '98%',
                // maxHeight: '98%',
                data: fu.file
            });
        }
    }
    checkFile(files) {
        return new Promise((resolve, reject) => {
            if (!this.multiple && files.length > 1) {
                reject('INVALID-FILE-LENGTH');
                return;
            }
            if (this.acceptArray.length !== 0) {
                // check the format
                for (const f of files) {
                    if (!this.isValidFormat(f, this.acceptArray)) {
                        reject('INVALID-FILE-EXTENSION');
                        return;
                    }
                }
            }
            for (const f of files) {
                // check max size
                if (!this.isValidSize(f)) {
                    reject('INVALID-FILE-SIZE-SINGLE-FILE');
                    return;
                }
            }
            let totalSize = 0;
            for (const f of files) {
                totalSize += f.size;
            }
            // SUM ALSO THE ACTUAL SELECTED FILES if is multiple
            if (this.multiple && this.selectedFiles != null) {
                this.selectedFiles.forEach(sf => {
                    if (sf.file != null && sf.file.size != null) {
                        totalSize += sf.file?.size || 0;
                    }
                    else {
                        console.error('some files of Sii-Upload have null file object. Please return an empty object with only the size');
                    }
                });
            }
            if ((totalSize / (1020 * 1024)) > this.maxSize) {
                reject('INVALID-FILE-SIZE');
                return;
            }
            resolve(null);
        });
    }
    isValidFormat(f, acceptArray) {
        return acceptArray.find(acc => acc === f.type) != null;
        // return acceptArray.includes(f.type);
    }
    isValidSize(f) {
        return (f.size / (1024 * 1024)) <= (this.multiple ? this.maxSizeSingleFile : this.maxSize);
    }
    pictImage() {
        this.dialog.open(PictDialogComponent, {
            disableClose: true,
            data: {
                maxSize: (this.multiple ? this.maxSizeSingleFile : this.maxSize),
                aspectRatio: this.aspectRatio,
                resizeToWidth: this.resizeToWidth,
            }
        }).afterClosed()
            .subscribe((photo) => {
            this.prepareFilesList(!!photo ? [photo] : []);
        });
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: UploadComponent, deps: [{ token: i1.MatDialog }, { token: i2.Platform }, { token: i3.DomSanitizer }, { token: i4.SiiToolkitService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "18.2.13", type: UploadComponent, isStandalone: true, selector: "sii-upload", inputs: { multiple: "multiple", maxSize: "maxSize", maxSizeSingleFile: "maxSizeSingleFile", accept: "accept", enableCamera: "enableCamera", disableDelete: "disableDelete", disableCrop: "disableCrop", aspectRatio: "aspectRatio", resizeToWidth: "resizeToWidth", downloadService: "downloadService", previewService: "previewService", deleteService: "deleteService" }, host: { listeners: { "dragover": "onDragOver($event)", "dragleave": "onDragLeave($event)", "drop": "ondrop($event)" }, properties: { "class.uploadErrorMessage": "this.uploadErrorMessage", "class.invalidExtension": "this.invalidExt", "class.invalidSize": "this.invalidSize", "class.invalidSizeSingle": "this.invalidSizeSingleFile", "class.invalidLength": "this.invalidLength", "class.fileover": "this.fileOver" } }, providers: [
            {
                provide: NG_VALUE_ACCESSOR,
                useExisting: forwardRef(() => UploadComponent),
                multi: true,
            },
            SiiDatePipe
            // { provide: NG_VALIDATORS, useExisting: UploadContainerComponent, multi: true },
        ], viewQueries: [{ propertyName: "inputEle", first: true, predicate: ["fileDropRef"], descendants: true }], ngImport: i0, template: "<input type=\"file\"  style=\"display: none;\" [accept]=\"accept\"   #fileDropRef id=\"fileDropRef\" [multiple]=\"multiple\" (change)=\"fileBrowseHandler($event.target.files)\" />\r\n\r\n\r\n<ng-content select=\"[sii-upload-title]\"></ng-content>\r\n\r\n<div class=\"siiUploadBox\">\r\n\r\n\r\n  <div class=\"container\"  >\r\n\r\n    <div class=\"UC_Drop_row_fullScreen\" >\r\n      <mat-icon style=\"    width: 40px;      height: 40px;      margin: 10px;\" svgIcon=\"upload-solid\"></mat-icon>\r\n      <span style=\"    margin-left: 10px;\" i18n=\"@@DropFileHere\">Drop file here</span>\r\n    </div>\r\n\r\n    <div class=\"invalidExtensionFile\" >\r\n      <b><h2 i18n=\"@@FU_invalidFileType\">Invalid File Type</h2></b>\r\n      <span i18n=\"@@FU_supportedType\">Supported types are</span>\r\n\r\n      @for (t of acceptArray; track t) {\r\n        <div>{{t}}</div>\r\n      }\r\n    </div>\r\n\r\n    <div class=\"invalidSizeFile\" >\r\n      <b><h2 i18n=\"@@FU_invalidFileSize\">Invalid Size</h2></b>\r\n      <span i18n=\"@@FU_maxSize\">Max size for the upload is : {{maxSize}} MB</span>\r\n    </div>\r\n    <div class=\"invalidSizeSingleFile\" >\r\n      <b><h2 i18n=\"@@FU_invalidFileSize\">Invalid Size</h2></b>\r\n      <span i18n=\"@@FU_maxSizeSingleFile\">Max size for single file is : {{maxSizeSingleFile}} MB</span>\r\n    </div>\r\n\r\n    <div  class=\"invalidLengthFile\" >\r\n      <b><h2 i18n=\"@@FU_invalidLengthSize\">Invalid Length</h2></b>\r\n      <span i18n=\"@@FU_onlyOne\">You can upload only 1 file</span>\r\n    </div>\r\n\r\n\r\n\r\n    <ng-content select=\"[sii-upload-description]\"></ng-content>\r\n\r\n    @if (!disabled) {\r\n      <div class=\"infoBox\" >\r\n        <div class=\"specifiche\">\r\n          @if (multiple) {\r\n            <span class=\"UC_multiple\" i18n=\"sii-upload-component@@multipleFileSelection\">more than one file can be uploaded</span>\r\n          }\r\n          <span class=\"UC_max_size\" >\r\n            <span i18n=\"@@FU_maxSize_small\">Max Size</span>:{{(maxSize*1024*1024) | siiMemory}}\r\n            @if (multiple || true) {\r\n              -  <span i18n=\"@@FU_maxSizeSingle_small\">Max Size Single File</span>: {{(maxSizeSingleFile *1024*1024) | siiMemory}}\r\n            }\r\n          </span>\r\n          @if (accept!='') {\r\n            <span class=\"UC_accept\"><span i18n=\"@@fileTypes\">File type:</span>&nbsp;{{acceptText}}</span>\r\n          }\r\n        </div>\r\n        <div class=\"UC_Drop_row\">\r\n          <mat-icon style=\"    width: 20px;\" svgIcon=\"upload-solid\"></mat-icon>\r\n          <span style=\"    margin-left: 10px;\" i18n=\"@@DropFileHere\">Drop file here</span>\r\n        </div>\r\n      </div>\r\n    }\r\n\r\n\r\n\r\n\r\n\r\n  </div>\r\n\r\n\r\n  <div class=\"UC-file-list\">\r\n\r\n    @for (file of selectedFiles; track file; let i = $index) {\r\n      <div class=\"UC-file-selected-item\">\r\n        <div class=\"UC-file-selected-item-box\">\r\n          <span  class=\"UC-file-selected-item-attribute titleCol\">\r\n            @if (!!file._imagePreviewUrl && !!file._isImage) {\r\n              <img class=\"rowPreviewImage\" [src]=\"file._imagePreviewUrl\">\r\n            }\r\n            @if (!(!!file._imagePreviewUrl && !!file._isImage)) {\r\n              @switch (file._type) {\r\n                @case ('CSV') {\r\n                  <mat-icon svgIcon=\"file-csv\"></mat-icon>\r\n                }\r\n                @case ('EXCEL') {\r\n                  <mat-icon svgIcon=\"file-excel\"></mat-icon>\r\n                }\r\n                @case ('IMAGE') {\r\n                  <mat-icon svgIcon=\"file-image\"></mat-icon>\r\n                }\r\n                @case ('PDF') {\r\n                  <mat-icon svgIcon=\"file-pdf\"></mat-icon>\r\n                }\r\n                @case ('POWERPOINT') {\r\n                  <mat-icon svgIcon=\"file-powerpoint\"></mat-icon>\r\n                }\r\n                @case ('WORD') {\r\n                  <mat-icon svgIcon=\"file-word\"></mat-icon>\r\n                }\r\n                @default {\r\n                  <mat-icon svgIcon=\"file_download\"></mat-icon>\r\n                }\r\n              }\r\n            }\r\n            <span class=\"fileName\">{{ file?.file.name }}</span>\r\n          </span>\r\n          <span  class=\"UC-file-selected-item-attribute creuser\">\r\n            @if (!!file?.creationUser?.firstname) {\r\n              <mat-icon>person</mat-icon>\r\n              <span>{{file?.creationUser?.firstname +' '+ file?.creationUser?.lastname }}</span>\r\n            }\r\n          </span>\r\n          <span  class=\"UC-file-selected-item-attribute lastmod\">\r\n            @if (!!file?.file?.lastModified) {\r\n              <mat-icon>event</mat-icon>\r\n              <span>{{file?.file?.lastModified | siiDate}}</span>\r\n            }\r\n          </span>\r\n          <span  class=\"UC-file-selected-item-attribute size\">\r\n            @if (!!file?.file?.size) {\r\n              <mat-icon>memory</mat-icon>\r\n              <span>{{file?.file?.size | siiMemory}}</span>\r\n            }\r\n          </span>\r\n        </div>\r\n        <button type=\"button\" [matMenuTriggerFor]=\"action\"   mat-icon-button ><mat-icon>more_vert</mat-icon></button>\r\n        <mat-menu #action=\"matMenu\"   >\r\n          @if (!disableCrop && !this.disabled && cropableFile(file) && file.readonly!=true) {\r\n            <button type=\"button\" mat-menu-item (click)=\"cropFile(file, i)\"><mat-icon>crop</mat-icon><span i18n=\"@@SiiUploadCrop\">Crop</span></button>\r\n          }\r\n          @if (downloadableFile(file)) {\r\n            <button type=\"button\" mat-menu-item (click)=\"downloadFile(file)\"><mat-icon>file_download</mat-icon><span i18n=\"@@SiiUploadDownload\">Download</span></button>\r\n          }\r\n          @if (!disabled && !disableDelete && file.readonly!=true) {\r\n            <button type=\"button\" mat-menu-item (click)=\"deleteFile(i,file)\"><mat-icon>delete_outline</mat-icon><span i18n=\"@@SiiUploadDelete\">Delete</span></button>\r\n          }\r\n          @if (previewableFile(file)) {\r\n            <button type=\"button\" mat-menu-item (click)=\"previewFile(file)\"><mat-icon>visibility</mat-icon><span i18n=\"@@SiiUploadPreview\">Preview</span></button>\r\n          }\r\n        </mat-menu>\r\n      </div>\r\n    }\r\n  </div>\r\n\r\n\r\n  @if (!disabled) {\r\n    <div class=\"UC_fileSelectionsRow\">\r\n      <button type=\"button\" mat-button  (click)=\"fileDropRef.click() \" >\r\n        <mat-icon style=\"    width: 17px;      margin-right: 4px;\" svgIcon=\"attachment\"></mat-icon>\r\n        <span i18n=\"@@Choose_File\">Choose file</span>\r\n      </button>\r\n      @if (enableCamera && webcamAvailable) {\r\n        <button type=\"button\" mat-button (click)=\"pictImage() \">\r\n          <mat-icon style=\"margin-right: 4px;\">photo_camera</mat-icon>\r\n          <span i18n=\"@@takeAPhoto\">Take a Photo</span>\r\n        </button>\r\n      }\r\n    </div>\r\n  }\r\n</div>\r\n\r\n\r\n", styles: [":host{display:flex;flex-direction:column;width:500px;max-width:100%;min-height:200px;box-shadow:0 0 5px #0003}:host::ng-deep [sii-upload-title]{border-bottom:1px solid lightgray;min-height:41px;display:flex;align-items:center;padding:0 10px}.container *,:host::ng-deep [sii-upload-description]{pointer-events:none}.siiUploadBox{overflow:hidden;display:flex;flex:1;flex-direction:column}:host.fileover .container{border:2px dashed gray}.container{position:relative;box-sizing:border-box;display:flex;flex-direction:column}.container ::ng-deep>*{padding:5px 10px}.UC_Drop_row{display:flex;align-items:center;font-size:13px}.UC_Drop_row_fullScreen{display:none;flex-direction:column;align-items:center;position:absolute;background:#fff;width:100%;height:100%;left:0;top:0;justify-content:center;font-size:25px;font-weight:700;color:gray;z-index:5;box-sizing:border-box}:host.fileover .UC_Drop_row_fullScreen{display:flex}.UC_fileSelectionsRow{min-height:41px;border-bottom:1px solid lightgray;border-top:1px solid lightgray;display:flex;justify-content:flex-end;align-items:center}.UC-file-list{overflow:auto;flex:1}.UC-file-list .UC-file-selected-item{display:flex;align-items:center;margin:0 5px;min-height:40px;border-bottom:1px solid lightgray}.UC-file-list .UC-file-selected-item:last-child{border-bottom:none}.UC-file-list .UC-file-selected-item .UC-file-selected-item-box{flex:1;flex-wrap:wrap;display:flex;align-items:center;padding:5px 0}.UC-file-list .UC-file-selected-item .UC-file-selected-item-box .UC-file-selected-item-attribute{display:flex;align-items:center;padding:0 5px}.UC-file-list .UC-file-selected-item .UC-file-selected-item-box .UC-file-selected-item-attribute.size{width:90px}.UC-file-list .UC-file-selected-item .UC-file-selected-item-box .UC-file-selected-item-attribute.creuser{width:170px}.UC-file-list .UC-file-selected-item .UC-file-selected-item-box .UC-file-selected-item-attribute.lastmod{width:110px}.UC-file-list .UC-file-selected-item .UC-file-selected-item-box .UC-file-selected-item-attribute.titleCol{flex:1 1 300px}.UC-file-list .UC-file-selected-item .UC-file-selected-item-box .UC-file-selected-item-attribute.titleCol mat-icon{transform:scale(.9)}.UC-file-list .UC-file-selected-item .UC-file-selected-item-box .UC-file-selected-item-attribute>*{opacity:.75}.UC-file-list .UC-file-selected-item .UC-file-selected-item-box .UC-file-selected-item-attribute .fileName{flex:1;color:#427f9f;opacity:1}:host.uploadErrorMessage .container{animation:shake 1s;animation-duration:1s;border-color:red}.invalidExtensionFile,.invalidSizeFile,.invalidSizeSingleFile,.invalidLengthFile{display:none;flex-direction:column;position:absolute;width:100%;background-color:#fff;top:0;left:0;color:red;z-index:1;padding:10px}:host.uploadErrorMessage.invalidExtension .invalidExtensionFile,:host.uploadErrorMessage.invalidSize .invalidSizeFile,:host.uploadErrorMessage.invalidSizeSingle .invalidSizeSingleFile,:host.uploadErrorMessage.invalidLength .invalidLengthFile{display:flex}.infoBox{display:flex;flex-wrap:wrap;opacity:.8}.infoBox .specifiche{flex:1;padding-bottom:12px;display:flex;flex-direction:column}.UC_max_size,.UC_multiple,.UC_accept{font-size:12px}.rowPreviewImage{max-width:40px;max-height:40px;margin-right:5px}@keyframes shake{0%{transform:translate(1px,1px) rotate(0)}10%{transform:translate(-1px,-2px) rotate(-1deg)}20%{transform:translate(-3px) rotate(1deg)}30%{transform:translate(3px,2px) rotate(0)}40%{transform:translate(1px,-1px) rotate(1deg)}50%{transform:translate(-1px,2px) rotate(-1deg)}60%{transform:translate(-3px,1px) rotate(0)}70%{transform:translate(3px,1px) rotate(-1deg)}80%{transform:translate(-1px,-1px) rotate(1deg)}90%{transform:translate(1px,2px) rotate(0)}to{transform:translate(1px,-2px) rotate(-1deg)}}@media only screen and (max-width: 840px){.UC_Drop_row{display:none}}\n"], dependencies: [{ kind: "component", type: MatIcon, selector: "mat-icon", inputs: ["color", "inline", "svgIcon", "fontSet", "fontIcon"], exportAs: ["matIcon"] }, { kind: "component", type: MatIconButton, selector: "button[mat-icon-button]", exportAs: ["matButton"] }, { kind: "directive", type: MatMenuTrigger, selector: "[mat-menu-trigger-for], [matMenuTriggerFor]", inputs: ["mat-menu-trigger-for", "matMenuTriggerFor", "matMenuTriggerData", "matMenuTriggerRestoreFocus"], outputs: ["menuOpened", "onMenuOpen", "menuClosed", "onMenuClose"], exportAs: ["matMenuTrigger"] }, { kind: "component", type: MatMenu, selector: "mat-menu", inputs: ["backdropClass", "aria-label", "aria-labelledby", "aria-describedby", "xPosition", "yPosition", "overlapTrigger", "hasBackdrop", "class", "classList"], outputs: ["closed", "close"], exportAs: ["matMenu"] }, { kind: "component", type: MatMenuItem, selector: "[mat-menu-item]", inputs: ["role", "disabled", "disableRipple"], exportAs: ["matMenuItem"] }, { kind: "component", type: MatButton, selector: "    button[mat-button], button[mat-raised-button], button[mat-flat-button],    button[mat-stroked-button]  ", exportAs: ["matButton"] }, { kind: "pipe", type: SiiDatePipe, name: "siiDate" }, { kind: "pipe", type: SiiMemoryPipe, name: "siiMemory" }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: UploadComponent, decorators: [{
            type: Component,
            args: [{ selector: 'sii-upload', providers: [
                        {
                            provide: NG_VALUE_ACCESSOR,
                            useExisting: forwardRef(() => UploadComponent),
                            multi: true,
                        },
                        SiiDatePipe
                        // { provide: NG_VALIDATORS, useExisting: UploadContainerComponent, multi: true },
                    ], standalone: true, imports: [
                        MatIcon,
                        MatIconButton,
                        MatMenuTrigger,
                        MatMenu,
                        MatMenuItem,
                        MatButton,
                        SiiDatePipe,
                        SiiMemoryPipe,
                    ], template: "<input type=\"file\"  style=\"display: none;\" [accept]=\"accept\"   #fileDropRef id=\"fileDropRef\" [multiple]=\"multiple\" (change)=\"fileBrowseHandler($event.target.files)\" />\r\n\r\n\r\n<ng-content select=\"[sii-upload-title]\"></ng-content>\r\n\r\n<div class=\"siiUploadBox\">\r\n\r\n\r\n  <div class=\"container\"  >\r\n\r\n    <div class=\"UC_Drop_row_fullScreen\" >\r\n      <mat-icon style=\"    width: 40px;      height: 40px;      margin: 10px;\" svgIcon=\"upload-solid\"></mat-icon>\r\n      <span style=\"    margin-left: 10px;\" i18n=\"@@DropFileHere\">Drop file here</span>\r\n    </div>\r\n\r\n    <div class=\"invalidExtensionFile\" >\r\n      <b><h2 i18n=\"@@FU_invalidFileType\">Invalid File Type</h2></b>\r\n      <span i18n=\"@@FU_supportedType\">Supported types are</span>\r\n\r\n      @for (t of acceptArray; track t) {\r\n        <div>{{t}}</div>\r\n      }\r\n    </div>\r\n\r\n    <div class=\"invalidSizeFile\" >\r\n      <b><h2 i18n=\"@@FU_invalidFileSize\">Invalid Size</h2></b>\r\n      <span i18n=\"@@FU_maxSize\">Max size for the upload is : {{maxSize}} MB</span>\r\n    </div>\r\n    <div class=\"invalidSizeSingleFile\" >\r\n      <b><h2 i18n=\"@@FU_invalidFileSize\">Invalid Size</h2></b>\r\n      <span i18n=\"@@FU_maxSizeSingleFile\">Max size for single file is : {{maxSizeSingleFile}} MB</span>\r\n    </div>\r\n\r\n    <div  class=\"invalidLengthFile\" >\r\n      <b><h2 i18n=\"@@FU_invalidLengthSize\">Invalid Length</h2></b>\r\n      <span i18n=\"@@FU_onlyOne\">You can upload only 1 file</span>\r\n    </div>\r\n\r\n\r\n\r\n    <ng-content select=\"[sii-upload-description]\"></ng-content>\r\n\r\n    @if (!disabled) {\r\n      <div class=\"infoBox\" >\r\n        <div class=\"specifiche\">\r\n          @if (multiple) {\r\n            <span class=\"UC_multiple\" i18n=\"sii-upload-component@@multipleFileSelection\">more than one file can be uploaded</span>\r\n          }\r\n          <span class=\"UC_max_size\" >\r\n            <span i18n=\"@@FU_maxSize_small\">Max Size</span>:{{(maxSize*1024*1024) | siiMemory}}\r\n            @if (multiple || true) {\r\n              -  <span i18n=\"@@FU_maxSizeSingle_small\">Max Size Single File</span>: {{(maxSizeSingleFile *1024*1024) | siiMemory}}\r\n            }\r\n          </span>\r\n          @if (accept!='') {\r\n            <span class=\"UC_accept\"><span i18n=\"@@fileTypes\">File type:</span>&nbsp;{{acceptText}}</span>\r\n          }\r\n        </div>\r\n        <div class=\"UC_Drop_row\">\r\n          <mat-icon style=\"    width: 20px;\" svgIcon=\"upload-solid\"></mat-icon>\r\n          <span style=\"    margin-left: 10px;\" i18n=\"@@DropFileHere\">Drop file here</span>\r\n        </div>\r\n      </div>\r\n    }\r\n\r\n\r\n\r\n\r\n\r\n  </div>\r\n\r\n\r\n  <div class=\"UC-file-list\">\r\n\r\n    @for (file of selectedFiles; track file; let i = $index) {\r\n      <div class=\"UC-file-selected-item\">\r\n        <div class=\"UC-file-selected-item-box\">\r\n          <span  class=\"UC-file-selected-item-attribute titleCol\">\r\n            @if (!!file._imagePreviewUrl && !!file._isImage) {\r\n              <img class=\"rowPreviewImage\" [src]=\"file._imagePreviewUrl\">\r\n            }\r\n            @if (!(!!file._imagePreviewUrl && !!file._isImage)) {\r\n              @switch (file._type) {\r\n                @case ('CSV') {\r\n                  <mat-icon svgIcon=\"file-csv\"></mat-icon>\r\n                }\r\n                @case ('EXCEL') {\r\n                  <mat-icon svgIcon=\"file-excel\"></mat-icon>\r\n                }\r\n                @case ('IMAGE') {\r\n                  <mat-icon svgIcon=\"file-image\"></mat-icon>\r\n                }\r\n                @case ('PDF') {\r\n                  <mat-icon svgIcon=\"file-pdf\"></mat-icon>\r\n                }\r\n                @case ('POWERPOINT') {\r\n                  <mat-icon svgIcon=\"file-powerpoint\"></mat-icon>\r\n                }\r\n                @case ('WORD') {\r\n                  <mat-icon svgIcon=\"file-word\"></mat-icon>\r\n                }\r\n                @default {\r\n                  <mat-icon svgIcon=\"file_download\"></mat-icon>\r\n                }\r\n              }\r\n            }\r\n            <span class=\"fileName\">{{ file?.file.name }}</span>\r\n          </span>\r\n          <span  class=\"UC-file-selected-item-attribute creuser\">\r\n            @if (!!file?.creationUser?.firstname) {\r\n              <mat-icon>person</mat-icon>\r\n              <span>{{file?.creationUser?.firstname +' '+ file?.creationUser?.lastname }}</span>\r\n            }\r\n          </span>\r\n          <span  class=\"UC-file-selected-item-attribute lastmod\">\r\n            @if (!!file?.file?.lastModified) {\r\n              <mat-icon>event</mat-icon>\r\n              <span>{{file?.file?.lastModified | siiDate}}</span>\r\n            }\r\n          </span>\r\n          <span  class=\"UC-file-selected-item-attribute size\">\r\n            @if (!!file?.file?.size) {\r\n              <mat-icon>memory</mat-icon>\r\n              <span>{{file?.file?.size | siiMemory}}</span>\r\n            }\r\n          </span>\r\n        </div>\r\n        <button type=\"button\" [matMenuTriggerFor]=\"action\"   mat-icon-button ><mat-icon>more_vert</mat-icon></button>\r\n        <mat-menu #action=\"matMenu\"   >\r\n          @if (!disableCrop && !this.disabled && cropableFile(file) && file.readonly!=true) {\r\n            <button type=\"button\" mat-menu-item (click)=\"cropFile(file, i)\"><mat-icon>crop</mat-icon><span i18n=\"@@SiiUploadCrop\">Crop</span></button>\r\n          }\r\n          @if (downloadableFile(file)) {\r\n            <button type=\"button\" mat-menu-item (click)=\"downloadFile(file)\"><mat-icon>file_download</mat-icon><span i18n=\"@@SiiUploadDownload\">Download</span></button>\r\n          }\r\n          @if (!disabled && !disableDelete && file.readonly!=true) {\r\n            <button type=\"button\" mat-menu-item (click)=\"deleteFile(i,file)\"><mat-icon>delete_outline</mat-icon><span i18n=\"@@SiiUploadDelete\">Delete</span></button>\r\n          }\r\n          @if (previewableFile(file)) {\r\n            <button type=\"button\" mat-menu-item (click)=\"previewFile(file)\"><mat-icon>visibility</mat-icon><span i18n=\"@@SiiUploadPreview\">Preview</span></button>\r\n          }\r\n        </mat-menu>\r\n      </div>\r\n    }\r\n  </div>\r\n\r\n\r\n  @if (!disabled) {\r\n    <div class=\"UC_fileSelectionsRow\">\r\n      <button type=\"button\" mat-button  (click)=\"fileDropRef.click() \" >\r\n        <mat-icon style=\"    width: 17px;      margin-right: 4px;\" svgIcon=\"attachment\"></mat-icon>\r\n        <span i18n=\"@@Choose_File\">Choose file</span>\r\n      </button>\r\n      @if (enableCamera && webcamAvailable) {\r\n        <button type=\"button\" mat-button (click)=\"pictImage() \">\r\n          <mat-icon style=\"margin-right: 4px;\">photo_camera</mat-icon>\r\n          <span i18n=\"@@takeAPhoto\">Take a Photo</span>\r\n        </button>\r\n      }\r\n    </div>\r\n  }\r\n</div>\r\n\r\n\r\n", styles: [":host{display:flex;flex-direction:column;width:500px;max-width:100%;min-height:200px;box-shadow:0 0 5px #0003}:host::ng-deep [sii-upload-title]{border-bottom:1px solid lightgray;min-height:41px;display:flex;align-items:center;padding:0 10px}.container *,:host::ng-deep [sii-upload-description]{pointer-events:none}.siiUploadBox{overflow:hidden;display:flex;flex:1;flex-direction:column}:host.fileover .container{border:2px dashed gray}.container{position:relative;box-sizing:border-box;display:flex;flex-direction:column}.container ::ng-deep>*{padding:5px 10px}.UC_Drop_row{display:flex;align-items:center;font-size:13px}.UC_Drop_row_fullScreen{display:none;flex-direction:column;align-items:center;position:absolute;background:#fff;width:100%;height:100%;left:0;top:0;justify-content:center;font-size:25px;font-weight:700;color:gray;z-index:5;box-sizing:border-box}:host.fileover .UC_Drop_row_fullScreen{display:flex}.UC_fileSelectionsRow{min-height:41px;border-bottom:1px solid lightgray;border-top:1px solid lightgray;display:flex;justify-content:flex-end;align-items:center}.UC-file-list{overflow:auto;flex:1}.UC-file-list .UC-file-selected-item{display:flex;align-items:center;margin:0 5px;min-height:40px;border-bottom:1px solid lightgray}.UC-file-list .UC-file-selected-item:last-child{border-bottom:none}.UC-file-list .UC-file-selected-item .UC-file-selected-item-box{flex:1;flex-wrap:wrap;display:flex;align-items:center;padding:5px 0}.UC-file-list .UC-file-selected-item .UC-file-selected-item-box .UC-file-selected-item-attribute{display:flex;align-items:center;padding:0 5px}.UC-file-list .UC-file-selected-item .UC-file-selected-item-box .UC-file-selected-item-attribute.size{width:90px}.UC-file-list .UC-file-selected-item .UC-file-selected-item-box .UC-file-selected-item-attribute.creuser{width:170px}.UC-file-list .UC-file-selected-item .UC-file-selected-item-box .UC-file-selected-item-attribute.lastmod{width:110px}.UC-file-list .UC-file-selected-item .UC-file-selected-item-box .UC-file-selected-item-attribute.titleCol{flex:1 1 300px}.UC-file-list .UC-file-selected-item .UC-file-selected-item-box .UC-file-selected-item-attribute.titleCol mat-icon{transform:scale(.9)}.UC-file-list .UC-file-selected-item .UC-file-selected-item-box .UC-file-selected-item-attribute>*{opacity:.75}.UC-file-list .UC-file-selected-item .UC-file-selected-item-box .UC-file-selected-item-attribute .fileName{flex:1;color:#427f9f;opacity:1}:host.uploadErrorMessage .container{animation:shake 1s;animation-duration:1s;border-color:red}.invalidExtensionFile,.invalidSizeFile,.invalidSizeSingleFile,.invalidLengthFile{display:none;flex-direction:column;position:absolute;width:100%;background-color:#fff;top:0;left:0;color:red;z-index:1;padding:10px}:host.uploadErrorMessage.invalidExtension .invalidExtensionFile,:host.uploadErrorMessage.invalidSize .invalidSizeFile,:host.uploadErrorMessage.invalidSizeSingle .invalidSizeSingleFile,:host.uploadErrorMessage.invalidLength .invalidLengthFile{display:flex}.infoBox{display:flex;flex-wrap:wrap;opacity:.8}.infoBox .specifiche{flex:1;padding-bottom:12px;display:flex;flex-direction:column}.UC_max_size,.UC_multiple,.UC_accept{font-size:12px}.rowPreviewImage{max-width:40px;max-height:40px;margin-right:5px}@keyframes shake{0%{transform:translate(1px,1px) rotate(0)}10%{transform:translate(-1px,-2px) rotate(-1deg)}20%{transform:translate(-3px) rotate(1deg)}30%{transform:translate(3px,2px) rotate(0)}40%{transform:translate(1px,-1px) rotate(1deg)}50%{transform:translate(-1px,2px) rotate(-1deg)}60%{transform:translate(-3px,1px) rotate(0)}70%{transform:translate(3px,1px) rotate(-1deg)}80%{transform:translate(-1px,-1px) rotate(1deg)}90%{transform:translate(1px,2px) rotate(0)}to{transform:translate(1px,-2px) rotate(-1deg)}}@media only screen and (max-width: 840px){.UC_Drop_row{display:none}}\n"] }]
        }], ctorParameters: () => [{ type: i1.MatDialog }, { type: i2.Platform }, { type: i3.DomSanitizer }, { type: i4.SiiToolkitService }], propDecorators: { multiple: [{
                type: Input
            }], maxSize: [{
                type: Input
            }], maxSizeSingleFile: [{
                type: Input
            }], accept: [{
                type: Input
            }], enableCamera: [{
                type: Input
            }], disableDelete: [{
                type: Input
            }], disableCrop: [{
                type: Input
            }], aspectRatio: [{
                type: Input
            }], resizeToWidth: [{
                type: Input
            }], downloadService: [{
                type: Input
            }], previewService: [{
                type: Input
            }], deleteService: [{
                type: Input
            }], uploadErrorMessage: [{
                type: HostBinding,
                args: ['class.uploadErrorMessage']
            }], invalidExt: [{
                type: HostBinding,
                args: ['class.invalidExtension']
            }], invalidSize: [{
                type: HostBinding,
                args: ['class.invalidSize']
            }], invalidSizeSingleFile: [{
                type: HostBinding,
                args: ['class.invalidSizeSingle']
            }], invalidLength: [{
                type: HostBinding,
                args: ['class.invalidLength']
            }], inputEle: [{
                type: ViewChild,
                args: ['fileDropRef']
            }], fileOver: [{
                type: HostBinding,
                args: ['class.fileover']
            }], onDragOver: [{
                type: HostListener,
                args: ['dragover', ['$event']]
            }], onDragLeave: [{
                type: HostListener,
                args: ['dragleave', ['$event']]
            }], ondrop: [{
                type: HostListener,
                args: ['drop', ['$event']]
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXBsb2FkLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL3NpaS10b29sa2l0L3NyYy9saWIvY29tcG9uZW50cy91cGxvYWQvdXBsb2FkLmNvbXBvbmVudC50cyIsIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL3NpaS10b29sa2l0L3NyYy9saWIvY29tcG9uZW50cy91cGxvYWQvdXBsb2FkLmNvbXBvbmVudC5odG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxxQkFBcUIsRUFBRSxvQkFBb0IsRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBRXBGLE9BQU8sRUFBRSxTQUFTLEVBQWMsVUFBVSxFQUFFLFdBQVcsRUFBRSxZQUFZLEVBQUUsS0FBSyxFQUFVLFNBQVMsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUN2SCxPQUFPLEVBQXFDLGlCQUFpQixFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFLdEYsT0FBTyxFQUFFLHdCQUF3QixFQUFFLE1BQU0saURBQWlELENBQUM7QUFDM0YsT0FBTyxFQUFFLDBCQUEwQixFQUFFLE1BQU0scURBQXFELENBQUM7QUFDakcsT0FBTyxFQUFFLG1CQUFtQixFQUFFLE1BQU0scUNBQXFDLENBQUM7QUFDMUUsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLHlCQUF5QixDQUFDO0FBQ3hELE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQztBQUNwRCxPQUFPLEVBQUUsY0FBYyxFQUFFLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSx3QkFBd0IsQ0FBQztBQUM5RSxPQUFPLEVBQUUsYUFBYSxFQUFFLFNBQVMsRUFBRSxNQUFNLDBCQUEwQixDQUFDO0FBQ3BFLE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSx3QkFBd0IsQ0FBQzs7Ozs7O0FBNEJqRCxNQUFNLE9BQU8sZUFBZTtJQUcxQixJQUFJLFdBQVc7UUFDYixPQUFPLElBQUks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QUFDLFFBQVEsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSwgY29lcmNlTnVtYmVyUHJvcGVydHkgfSBmcm9tICdAYW5ndWxhci9jZGsvY29lcmNpb24nO1xyXG5pbXBvcnQgeyBQbGF0Zm9ybSB9IGZyb20gJ0Bhbmd1bGFyL2Nkay9wbGF0Zm9ybSc7XHJcbmltcG9ydCB7IENvbXBvbmVudCwgRWxlbWVudFJlZiwgZm9yd2FyZFJlZiwgSG9zdEJpbmRpbmcsIEhvc3RMaXN0ZW5lciwgSW5wdXQsIE9uSW5pdCwgVmlld0NoaWxkIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IENvbnRyb2xWYWx1ZUFjY2Vzc29yLCBGb3JtQ29udHJvbCwgTkdfVkFMVUVfQUNDRVNTT1IgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XHJcbmltcG9ydCB7IE1hdERpYWxvZyB9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2RpYWxvZyc7XHJcbmltcG9ydCB7IERvbVNhbml0aXplciB9IGZyb20gJ0Bhbmd1bGFyL3BsYXRmb3JtLWJyb3dzZXInO1xyXG5pbXBvcnQgeyBpc09ic2VydmFibGUsIE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHsgU2lpVG9vbGtpdFNlcnZpY2UgfSBmcm9tICcuLi8uLi9zaWktdG9vbGtpdC5zZXJ2aWNlJztcclxuaW1wb3J0IHsgQ3JvcEltYWdlRGlhbG9nQ29tcG9uZW50IH0gZnJvbSAnLi9jcm9wLWltYWdlLWRpYWxvZy9jcm9wLWltYWdlLWRpYWxvZy5jb21wb25lbnQnO1xyXG5pbXBvcnQgeyBGaWxlUHJldmlld0RpYWxvZ0NvbXBvbmVudCB9IGZyb20gJy4vZmlsZS1wcmV2aWV3LWRpYWxvZy9maWxlLXByZXZpZXctZGlhbG9nLmNvbXBvbmVudCc7XHJcbmltcG9ydCB7IFBpY3REaWFsb2dDb21wb25lbnQgfSBmcm9tICcuL3BpY3QtZGlhbG9nL3BpY3QtZGlhbG9nLmNvbXBvbmVudCc7XHJcbmltcG9ydCB7IFNpaU1lbW9yeVBpcGUgfSBmcm9tICcuLi91dGlsL3NpaS1tZW1vcnkucGlwZSc7XHJcbmltcG9ydCB7IFNpaURhdGVQaXBlIH0gZnJvbSAnLi4vdXRpbC9zaWktZGF0ZS5waXBlJztcclxuaW1wb3J0IHsgTWF0TWVudVRyaWdnZXIsIE1hdE1lbnUsIE1hdE1lbnVJdGVtIH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvbWVudSc7XHJcbmltcG9ydCB7IE1hdEljb25CdXR0b24sIE1hdEJ1dHRvbiB9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2J1dHRvbic7XHJcbmltcG9ydCB7IE1hdEljb24gfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9pY29uJztcclxuXHJcblxyXG5AQ29tcG9uZW50KHtcclxuICAgIHNlbGVjdG9yOiAnc2lpLXVwbG9hZCcsXHJcbiAgICB0ZW1wbGF0ZVVybDogJy4vdXBsb2FkLmNvbXBvbmVudC5odG1sJyxcclxuICAgIHN0eWxlVXJsczogWycuL3VwbG9hZC5jb21wb25lbnQuc2NzcyddLFxyXG4gICAgcHJvdmlkZXJzOiBbXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBwcm92aWRlOiBOR19WQUxVRV9BQ0NFU1NPUixcclxuICAgICAgICAgICAgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gVXBsb2FkQ29tcG9uZW50KSxcclxuICAgICAgICAgICAgbXVsdGk6IHRydWUsXHJcbiAgICAgICAgfSxcclxuICAgICAgICBTaWlEYXRlUGlwZVxyXG4gICAgICAgIC8vIHsgcHJvdmlkZTogTkdfVkFMSURBVE9SUywgdXNlRXhpc3Rpbmc6IFVwbG9hZENvbnRhaW5lckNvbXBvbmVudCwgbXVsdGk6IHRydWUgfSxcclxuICAgIF0sXHJcbiAgICBzdGFuZGFsb25lOiB0cnVlLFxyXG4gICAgaW1wb3J0czogW1xyXG4gICAgICAgIE1hdEljb24sXHJcbiAgICAgICAgTWF0SWNvbkJ1dHRvbixcclxuICAgICAgICBNYXRNZW51VHJpZ2dlcixcclxuICAgICAgICBNYXRNZW51LFxyXG4gICAgICAgIE1hdE1lbnVJdGVtLFxyXG4gICAgICAgIE1hdEJ1dHRvbixcclxuICAgICAgICBTaWlEYXRlUGlwZSxcclxuICAgICAgICBTaWlNZW1vcnlQaXBlLFxyXG4gICAgXSxcclxufSlcclxuZXhwb3J0IGNsYXNzIFVwbG9hZENvbXBvbmVudCBpbXBsZW1lbnRzICBDb250cm9sVmFsdWVBY2Nlc3NvciB7XHJcblxyXG4gIHdlYmNhbUF2YWlsYWJsZSA9IGZhbHNlO1xyXG4gIGdldCBhY2NlcHRBcnJheSgpe1xyXG4gICAgcmV0dXJuIHRoaXMuYWNjZXB0ICE9PSAnJyA/IHRoaXMuYWNjZXB0LnNwbGl0KCcsJykgOiBbXTtcclxuICB9XHJcblxyXG4gIGdldCBhY2NlcHRUZXh0KCl7XHJcbiAgIHJldHVybiB0aGlzLmFjY2VwdEFycmF5Lm1hcChhID0+IGEuc3BsaXQoJy8nKS5wb3AoKSkuam9pbignLCAnKTtcclxuICB9XHJcblxyXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBkaWFsb2c6IE1hdERpYWxvZywgcHVibGljIHBsYXRmb3JtOiBQbGF0Zm9ybSwgcHJpdmF0ZSBzYW5pdGl6ZXI6IERvbVNhbml0aXplciwgcHJpdmF0ZSB0czogU2lpVG9vbGtpdFNlcnZpY2UpIHtcclxuICAgIHRoaXMud2ViY2FtQXZhaWxhYmxlID0gIXBsYXRmb3JtLklPUyAmJiAhcGxhdGZvcm0uQU5EUk9JRCAmJiAhIShuYXZpZ2F0b3IubWVkaWFEZXZpY2VzICYmIG5hdmlnYXRvci5tZWRpYURldmljZXMuZ2V0VXNlck1lZGlhKTtcclxuXHJcbiAgfVxyXG5cclxuICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6dmFyaWFibGUtbmFtZVxyXG4gIF9tdWx0aXBsZSA9IGZhbHNlO1xyXG4gIEBJbnB1dCgpXHJcbiAgZ2V0IG11bHRpcGxlKCk6IGJvb2xlYW4ge1xyXG4gICAgcmV0dXJuIHRoaXMuX211bHRpcGxlO1xyXG4gIH1cclxuICBzZXQgbXVsdGlwbGUodmFsdWU6IGJvb2xlYW4pIHtcclxuICAgIHRoaXMuX211bHRpcGxlID0gY29lcmNlQm9vbGVhblByb3BlcnR5KHZhbHVlKTtcclxuICB9XHJcblxyXG5cclxuICBwcml2YXRlIGlzTWF4U2l6ZURlZmF1bHQgPSB0cnVlO1xyXG4gIHByaXZhdGUgaXNNYXhTaXplU2luZ2xlRGVmYXVsdCA9IHRydWU7XHJcbiAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOnZhcmlhYmxlLW5hbWVcclxuICBfbWF4U2l6ZSA9IDIwO1xyXG4gICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6dmFyaWFibGUtbmFtZVxyXG4gIF9tYXhTaXplU2luZ2xlRmlsZSA9IDIwO1xyXG5cclxuICBASW5wdXQoKVxyXG4gICBnZXQgbWF4U2l6ZSgpOiBudW1iZXIge1xyXG4gICAgaWYgKHRoaXMuaXNNYXhTaXplRGVmYXVsdCAmJiAhdGhpcy5pc01heFNpemVTaW5nbGVEZWZhdWx0KXtcclxuICAgICAgcmV0dXJuIE1hdGgubWF4KHRoaXMuX21heFNpemUsIHRoaXMuX21heFNpemVTaW5nbGVGaWxlKTtcclxuICAgIH1cclxuICAgIHJldHVybiB0aGlzLl9tYXhTaXplO1xyXG4gIH1cclxuICBzZXQgbWF4U2l6ZSh2YWx1ZTogbnVtYmVyKSB7XHJcbiAgICB0aGlzLl9tYXhTaXplID0gY29lcmNlTnVtYmVyUHJvcGVydHkodmFsdWUpO1xyXG4gICAgdGhpcy5pc01heFNpemVEZWZhdWx0ID0gZmFsc2U7XHJcbiAgfVxyXG4gIEBJbnB1dCgpXHJcbiAgIGdldCBtYXhTaXplU2luZ2xlRmlsZSgpOiBudW1iZXIge1xyXG4gICAgaWYgKCF0aGlzLmlzTWF4U2l6ZURlZmF1bHQgJiYgIXRoaXMuaXNNYXhTaXplU2luZ2xlRGVmYXVsdCl7XHJcbiAgICAgIHJldHVybiBNYXRoLm1pbih0aGlzLl9tYXhTaXplLCB0aGlzLl9tYXhTaXplU2luZ2xlRmlsZSk7XHJcbiAgICB9ZWxzZSBpZiAoIXRoaXMuaXNNYXhTaXplRGVmYXVsdCAmJiB0aGlzLmlzTWF4U2l6ZVNpbmdsZURlZmF1bHQpe1xyXG4gICAgICByZXR1cm4gdGhpcy5fbWF4U2l6ZTtcclxuICAgIH1cclxuICAgIHJldHVybiB0aGlzLl9tYXhTaXplU2luZ2xlRmlsZTtcclxuICB9XHJcbiAgc2V0IG1heFNpemVTaW5nbGVGaWxlKHZhbHVlOiBudW1iZXIpIHtcclxuICAgIHRoaXMuX21heFNpemVTaW5nbGVGaWxlID0gY29lcmNlTnVtYmVyUHJvcGVydHkodmFsdWUpO1xyXG4gICAgdGhpcy5pc01heFNpemVTaW5nbGVEZWZhdWx0ID0gZmFsc2U7XHJcblxyXG5cclxuICB9XHJcblxyXG4gIEBJbnB1dCgpIGFjY2VwdCA9ICcnO1xyXG4gIEBJbnB1dCgpIGVuYWJsZUNhbWVyYSA9IGZhbHNlO1xyXG4gIEBJbnB1dCgpIGRpc2FibGVEZWxldGUgPSBmYWxzZTtcclxuICBASW5wdXQoKSBkaXNhYmxlQ3JvcCA9IGZhbHNlO1xyXG4gIEBJbnB1dCgpIGFzcGVjdFJhdGlvO1xyXG4gIEBJbnB1dCgpIHJlc2l6ZVRvV2lkdGg7XHJcblxyXG4gIEBJbnB1dCgpIGRvd25sb2FkU2VydmljZTogKGlkOiBhbnkpID0+IHZvaWQgfCBPYnNlcnZhYmxlPEZpbGU+O1xyXG4gIEBJbnB1dCgpIHByZXZpZXdTZXJ2aWNlOiAoaWQ6IGFueSkgPT4gIE9ic2VydmFibGU8RmlsZT47XHJcbiAgQElucHV0KCkgZGVsZXRlU2VydmljZTogKGZpbGU6IFVwbG9hZENvbnRhaW5lckZpbGUpID0+ICBPYnNlcnZhYmxlPGJvb2xlYW4+O1xyXG5cclxuICBASG9zdEJpbmRpbmcoJ2NsYXNzLnVwbG9hZEVycm9yTWVzc2FnZScpIHVwbG9hZEVycm9yTWVzc2FnZSA9IGZhbHNlO1xyXG4gIEBIb3N0QmluZGluZygnY2xhc3MuaW52YWxpZEV4dGVuc2lvbicpIGludmFsaWRFeHQgPSBmYWxzZTtcclxuICBASG9zdEJpbmRpbmcoJ2NsYXNzLmludmFsaWRTaXplJykgaW52YWxpZFNpemUgPSBmYWxzZTtcclxuICBASG9zdEJpbmRpbmcoJ2NsYXNzLmludmFsaWRTaXplU2luZ2xlJykgaW52YWxpZFNpemVTaW5nbGVGaWxlID0gZmFsc2U7XHJcbiAgQEhvc3RCaW5kaW5nKCdjbGFzcy5pbnZhbGlkTGVuZ3RoJykgaW52YWxpZExlbmd0aCA9IGZhbHNlO1xyXG4gIEBWaWV3Q2hpbGQoJ2ZpbGVEcm9wUmVmJykgaW5wdXRFbGU6IEVsZW1lbnRSZWY7XHJcblxyXG5cclxuICBASG9zdEJpbmRpbmcoJ2NsYXNzLmZpbGVvdmVyJykgZmlsZU92ZXI6IGJvb2xlYW47XHJcblxyXG4gIGRpc2FibGVkID0gZmFsc2U7XHJcblxyXG4gIC8vIHVwbG9hZENvbnRhaW5lckNvbnRyb2wgPSBuZXcgRm9ybUNvbnRyb2woKTtcclxuICBzZWxlY3RlZEZpbGVzOiBVcGxvYWRDb250YWluZXJGaWxlW10gPSBbXTtcclxuXHJcbiAgLy8gRHJhZ292ZXIgbGlzdGVuZXJcclxuICBASG9zdExpc3RlbmVyKCdkcmFnb3ZlcicsIFsnJGV2ZW50J10pIG9uRHJhZ092ZXIoZXZ0KSB7XHJcbiAgICBldnQucHJldmVudERlZmF1bHQoKTtcclxuICAgIGV2dC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgIGlmICghdGhpcy5kaXNhYmxlZCl7XHJcbiAgICAgIHRoaXMuZmlsZU92ZXIgPSB0cnVlO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLy8gRHJhZ2xlYXZlIGxpc3RlbmVyXHJcbiAgQEhvc3RMaXN0ZW5lcignZHJhZ2xlYXZlJywgWyckZXZlbnQnXSkgcHVibGljIG9uRHJhZ0xlYXZlKGV2dCkge1xyXG4gICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICBldnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICB0aGlzLmZpbGVPdmVyID0gZmFsc2U7XHJcbiAgfVxyXG5cclxuICAvLyBEcm9wIGxpc3RlbmVyXHJcbiAgQEhvc3RMaXN0ZW5lcignZHJvcCcsIFsnJGV2ZW50J10pIHB1YmxpYyBvbmRyb3AoZXZ0KSB7XHJcbiAgICBldnQucHJldmVudERlZmF1bHQoKTtcclxuICAgIGV2dC5zdG9wUHJvcGFnYXRpb24oKTtcclxuXHJcbiAgICB0aGlzLmZpbGVPdmVyID0gZmFsc2U7XHJcbiAgICBpZiAoIXRoaXMuZGlzYWJsZWQpe1xyXG4gICAgY29uc3QgZmlsZXMgPSBldnQuZGF0YVRyYW5zZmVyLmZpbGVzO1xyXG4gICAgaWYgKGZpbGVzLmxlbmd0aCA+IDApIHtcclxuICAgICAgdGhpcy5vbkZpbGVEcm9wcGVkKGZpbGVzKTtcclxuICAgICAgLy8gdGhpcy5maWxlRHJvcHBlZC5lbWl0KGZpbGVzKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICB9XHJcblxyXG4gIHByb3BhZ2F0ZUNoYW5nZTogYW55ID0gKCkgPT4geyB9O1xyXG4gIG9uVG91Y2hlZENhbGxiYWNrOiBhbnkgPSAoKSA9PiB7IH07XHJcbiAgdmFsaWRhdG9yQ2FsbGJhY2s6IGFueSA9ICgpID0+IHsgfTtcclxuXHJcblxyXG4gIHJlZ2lzdGVyT25WYWxpZGF0b3JDaGFuZ2U/KGZuOiAoKSA9PiB2b2lkKTogdm9pZCB7XHJcbiAgICB0aGlzLnZhbGlkYXRvckNhbGxiYWNrID0gZm47XHJcbiAgfVxyXG5cclxuICB3cml0ZVZhbHVlKG9iajogVXBsb2FkQ29udGFpbmVyRmlsZVtdIHwgVXBsb2FkQ29udGFpbmVyRmlsZSApOiB2b2lkIHtcclxuICAgIGlmIChvYmogIT0gbnVsbCl7XHJcbiAgICAgIGlmICh0aGlzLm11bHRpcGxlKXtcclxuICAgICAgICB0aGlzLnNlbGVjdGVkRmlsZXMgPSAoIG9iaiBhcyBVcGxvYWRDb250YWluZXJGaWxlW10pLm1hcChmID0+ICggey4uLmYsIC4uLnsgX3R5cGUgOiB0aGlzLmdldEZpbGVUeXBlKGYuZmlsZSkgfSB9ICkgKTtcclxuICAgICAgfWVsc2V7XHJcbiAgICAgICAgdGhpcy5zZWxlY3RlZEZpbGVzID0gW29iaiBhcyBVcGxvYWRDb250YWluZXJGaWxlXS5tYXAoZiA9PiAoIHsuLi5mLCAuLi57IF90eXBlIDogdGhpcy5nZXRGaWxlVHlwZShmLmZpbGUpIH0gfSApICk7XHJcbiAgICAgIH1cclxuICAgIH1lbHNle1xyXG4gICAgICB0aGlzLnNlbGVjdGVkRmlsZXMgPSBbXTtcclxuICAgIH1cclxuXHJcbiAgICAvLyB0aGlzLnVwbG9hZENvbnRhaW5lckNvbnRyb2wuc2V0VmFsdWUodGhpcy5zZWxlY3RlZEZpbGVzKTtcclxuICB9XHJcblxyXG4gIHJlZ2lzdGVyT25DaGFuZ2UoZm46IGFueSk6IHZvaWQge1xyXG4gICAgdGhpcy5wcm9wYWdhdGVDaGFuZ2UgPSBmbjtcclxuICB9XHJcblxyXG4gIHJlZ2lzdGVyT25Ub3VjaGVkKGZuOiBhbnkpIHtcclxuICAgIHRoaXMub25Ub3VjaGVkQ2FsbGJhY2sgPSBmbjtcclxuICB9XHJcblxyXG4gIHNldERpc2FibGVkU3RhdGU/KGlzRGlzYWJsZWQ6IGJvb2xlYW4pOiB2b2lkIHtcclxuICAgIHRoaXMuZGlzYWJsZWQgPSBpc0Rpc2FibGVkO1xyXG4gICAgLy8gaXNEaXNhYmxlZD8gdGhpcy51cGxvYWRDb250YWluZXJDb250cm9sLmRpc2FibGUoKTp0aGlzLnVwbG9hZENvbnRhaW5lckNvbnRyb2wuZW5hYmxlKCk7XHJcbiAgfVxyXG5cclxuICBvbkZpbGVEcm9wcGVkKCRldmVudCkge1xyXG4gICAgaWYgKCEhJGV2ZW50ICYmICRldmVudC5sZW5ndGggPiAwKXtcclxuICAgICAgdGhpcy5jaGVja0ltYWdlVG9Dcm9wKCRldmVudCkudGhlbigoZmlsZVRvTG9hZCkgPT4ge1xyXG4gICAgICAgIHRoaXMucHJlcGFyZUZpbGVzTGlzdChmaWxlVG9Mb2FkKTtcclxuICAgICAgfSwgKCkgPT4ge30pO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZmlsZUJyb3dzZUhhbmRsZXIoZmlsZXMpIHtcclxuICAgIGlmICghIWZpbGVzICYmIGZpbGVzLmxlbmd0aCA+IDApe1xyXG4gICAgICB0aGlzLmNoZWNrSW1hZ2VUb0Nyb3AoZmlsZXMpLnRoZW4oKGZpbGVUb0xvYWQpID0+IHtcclxuICAgICAgICB0aGlzLnByZXBhcmVGaWxlc0xpc3QoZmlsZVRvTG9hZCk7XHJcbiAgICAgIH0sICgpID0+IHt9KTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGRlbGV0ZUZpbGUoaW5kZXg6IG51bWJlciwgZmlsZTogVXBsb2FkQ29udGFpbmVyRmlsZSkge1xyXG4gICAgY29uc3QgcGVyZm9ybSA9IChpKSA9PiB7XHJcbiAgICAgIHRoaXMuc2VsZWN0ZWRGaWxlcy5zcGxpY2UoaSwgMSk7XHJcbiAgICAgIHRoaXMuY2hhbmdlKHRoaXMuc2VsZWN0ZWRGaWxlcyk7XHJcbiAgICB9O1xyXG5cclxuICAgIGlmICggISF0aGlzLmRlbGV0ZVNlcnZpY2UgKXtcclxuICAgICAgdGhpcy5kZWxldGVTZXJ2aWNlKGZpbGUpLnN1YnNjcmliZShkZWxldGVkID0+IHtcclxuICAgICAgICBpZiAoZGVsZXRlZCl7XHJcbiAgICAgICAgICBwZXJmb3JtKGluZGV4KTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfWVsc2V7XHJcbiAgICAgIHBlcmZvcm0oaW5kZXgpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgbG9hZEZpbGVQcmV2aWV3SW5mb3JtYXRpb24oZnU6IFVwbG9hZENvbnRhaW5lckZpbGUsIGZvcmNlPSBmYWxzZSApe1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlPHZvaWQ+KChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgaWYgKCFmdS5faW1hZ2VQcmV2aWV3VXJsIHx8IGZvcmNlKXtcclxuICAgICAgICBjb25zdCBpc0ltYWdlID0gZnUuZmlsZS50eXBlLm1hdGNoKC9pbWFnZVxcLyovKSAhPSBudWxsO1xyXG4gICAgICAgIGNvbnN0IGlzUGRmID0gZnUuZmlsZS50eXBlLm1hdGNoKC9wZGZcXC8qLykgIT0gbnVsbDtcclxuICAgICAgICBpZiAoaXNJbWFnZSB8fCBpc1BkZikge1xyXG4gICAgICAgIC8vIGNvbnN0IHJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKCk7XHJcbiAgICAgICAgLy8gcmVhZGVyLnJlYWRBc0RhdGFVUkwoZnUuZmlsZSBhcyBGaWxlKTtcclxuICAgICAgICBmdS5faXNJbWFnZSA9IGlzSW1hZ2U7XHJcbiAgICAgICAgZnUuX2ltYWdlUHJldmlld1VybCA9ICB0aGlzLnNhbml0aXplci5ieXBhc3NTZWN1cml0eVRydXN0UmVzb3VyY2VVcmwoIHdpbmRvdy5VUkwuY3JlYXRlT2JqZWN0VVJMKGZ1LmZpbGUgYXMgQmxvYikpO1xyXG4gICAgICAgIHJlc29sdmUoKTtcclxuICAgICAgICAvLyByZWFkZXIub25sb2FkZW5kID0gKCkgPT4ge1xyXG4gICAgICAgICAgLy8gICAgZnUuX2ltYWdlUHJldmlld1VybCA9ICB0aGlzLnNhbml0aXplci5ieXBhc3NTZWN1cml0eVRydXN0UmVzb3VyY2VVcmwocmVhZGVyLnJlc3VsdCBhcyBzdHJpbmcpO1xyXG4gICAgICAgICAgLy8gcmVzb2x2ZSgpO1xyXG4gICAgICAgIC8vICAgfTtcclxuICAgICAgfVxyXG4gICAgICB9ZWxzZXtcclxuICAgICAgICByZXNvbHZlKCk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuXHJcblxyXG4gIH1cclxuXHJcblxyXG4gIGRvd25sb2FkYWJsZUZpbGUoZnU6IFVwbG9hZENvbnRhaW5lckZpbGUgKXtcclxuICAgIHJldHVybiAoZnU/LmZpbGUgIGluc3RhbmNlb2YgIEZpbGUpICB8fCB0aGlzLmRvd25sb2FkU2VydmljZSAhPSBudWxsICB8fCB0aGlzLnByZXZpZXdTZXJ2aWNlICE9IG51bGw7XHJcbiAgfVxyXG5cclxuICBwcmV2aWV3YWJsZUZpbGUoZnU6IFVwbG9hZENvbnRhaW5lckZpbGUgKXtcclxuICAgIHJldHVybiAhIWZ1Py5faW1hZ2VQcmV2aWV3VXJsICB8fFxyXG4gICAgKCB0aGlzLnByZXZpZXdTZXJ2aWNlICE9IG51bGwgJiZcclxuICAgICAgIChcclxuICAgICAgICAgZnU/LmZpbGU/LnR5cGU/Lm1hdGNoKC9pbWFnZVxcLyovKSAhPSBudWxsXHJcbiAgICAgICAgfHxcclxuICAgICAgICBmdT8uZmlsZT8udHlwZT8ubWF0Y2goL3BkZlxcLyovKSAhPSBudWxsXHJcbiAgICAgICAgKSk7XHJcbiAgfVxyXG4gIGNyb3BhYmxlRmlsZShmdTogVXBsb2FkQ29udGFpbmVyRmlsZSApe1xyXG4gICAgcmV0dXJuICghIWZ1Py5faW1hZ2VQcmV2aWV3VXJsICYmICEhZnUuX2lzSW1hZ2UpICB8fFxyXG4gICAgKCB0aGlzLnByZXZpZXdTZXJ2aWNlICE9IG51bGwgJiYgZnU/LmZpbGU/LnR5cGU/Lm1hdGNoKC9pbWFnZVxcLyovKSAhPSBudWxsICApO1xyXG4gIH1cclxuXHJcbiAgY3JvcEZpbGUoIGZ1OiBVcGxvYWRDb250YWluZXJGaWxlLCBpbmRleCl7XHJcbiAgICBpZiAoZnUuZmlsZSAhPSBudWxsICYmIGZ1LmZpbGUgIGluc3RhbmNlb2YgIEZpbGUpe1xyXG4gICAgICB0aGlzLnBlcmZvcm1Dcm9wRmlsZShpbmRleCk7XHJcbiAgICB9ZWxzZSBpZiAodGhpcy5wcmV2aWV3U2VydmljZSAhPSBudWxsKXtcclxuICAgICAgLy8gaWwgZmlsZSBub24gYyfDqFxyXG4gICAgICB0aGlzLnByZXZpZXdTZXJ2aWNlKGZ1LmlkKS5zdWJzY3JpYmUoKHJlc3ApID0+IHtcclxuICAgICAgICBjb25zdCByZXNwRmlsZSA9IHRoaXMucHJldmlld1NlcnZpY2VSZXNwb25zZVRvRmlsZShyZXNwLCBmdSk7XHJcbiAgICAgICAgaWYgKHJlc3BGaWxlICE9IG51bGwgKXtcclxuICAgICAgICAgICAgZnUuZmlsZSA9IHJlc3BGaWxlO1xyXG4gICAgICAgICAgICB0aGlzLmxvYWRGaWxlUHJldmlld0luZm9ybWF0aW9uKGZ1KS50aGVuKCgpID0+IHtcclxuICAgICAgICAgICAgICBpZiAoZnUuX2lzSW1hZ2Upe1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wZXJmb3JtQ3JvcEZpbGUoaW5kZXgpO1xyXG4gICAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcigndGhlIGRvd25sb2FkZWQgZmlsZSBpcyBub3Qgb2YgdHlwZSBpbWFnZSBvciBwZGYnKTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgIGZ1Ll9pc0ltYWdlID0gZmFsc2U7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ3RoZSBkb3dubG9hZGVkIGZpbGUgaXMgbm90IG9mIHR5cGUgRmlsZScpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJldmlld1NlcnZpY2VSZXNwb25zZVRvRmlsZSggcmVzcCAsIGZ1OiBVcGxvYWRDb250YWluZXJGaWxlICl7XHJcbiAgICAgaWYgKHJlc3AgIGluc3RhbmNlb2YgIEZpbGUpe1xyXG4gICAgICByZXR1cm4gcmVzcDtcclxuICAgIH1lbHNlIGlmIChyZXNwIGluc3RhbmNlb2YgQmxvYil7XHJcbiAgICAgIHJldHVybiBuZXcgRmlsZShbcmVzcF0sIGZ1LmZpbGUubmFtZSwge3R5cGU6IHJlc3AudHlwZX0pO1xyXG4gICAgfWVsc2V7XHJcbiAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJldmlld0ZpbGUoZnU6IFVwbG9hZENvbnRhaW5lckZpbGUpe1xyXG4gICAgaWYgKCEhZnU/Ll9pbWFnZVByZXZpZXdVcmwpe1xyXG4gICAgICB0aGlzLm9wZW5QcmV2aWV3RGlhbG9nKGZ1KTtcclxuICAgIH1lbHNlIGlmICh0aGlzLnByZXZpZXdTZXJ2aWNlICE9IG51bGwpe1xyXG4gICAgICB0aGlzLnByZXZpZXdTZXJ2aWNlKGZ1LmlkKS5zdWJzY3JpYmUoKHJlc3ApID0+IHtcclxuICAgICAgICBjb25zdCByZXNwRmlsZSA9IHRoaXMucHJldmlld1NlcnZpY2VSZXNwb25zZVRvRmlsZShyZXNwLCBmdSk7XHJcbiAgICAgICAgaWYgKHJlc3BGaWxlICE9IG51bGwpe1xyXG4gICAgICAgICAgZnUuZmlsZSA9IHJlc3BGaWxlO1xyXG4gICAgICAgICAgdGhpcy5sb2FkRmlsZVByZXZpZXdJbmZvcm1hdGlvbihmdSkudGhlbigoKSA9PiB7XHJcbiAgICAgICAgICAgIGlmICghIWZ1Ll9pbWFnZVByZXZpZXdVcmwpe1xyXG4gICAgICAgICAgICAgIHRoaXMub3BlblByZXZpZXdEaWFsb2coZnUpO1xyXG4gICAgICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKCd0aGUgZG93bmxvYWRlZCBmaWxlIGlzIG5vdCBvZiB0eXBlIGltYWdlIG9yIHBkZicpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgIGZ1Ll9pc0ltYWdlID0gZmFsc2U7XHJcbiAgICAgICAgICBjb25zb2xlLmVycm9yKCd0aGUgZG93bmxvYWRlZCBmaWxlIGlzIG5vdCBvZiB0eXBlIEZpbGUnKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfWVsc2V7XHJcbiAgICAgIGNvbnNvbGUubG9nKCdlcnJvciBvbiBwcmV2aWV3Jyk7XHJcbiAgICB9XHJcblxyXG5cclxuICB9XHJcblxyXG5cclxuICBkb3dubG9hZEZpbGUoZnU6IFVwbG9hZENvbnRhaW5lckZpbGUgKXtcclxuICAgIGlmIChmdS5maWxlICE9IG51bGwgJiYgZnUuZmlsZSAgaW5zdGFuY2VvZiAgRmlsZSl7XHJcbiAgICAgIC8vIGlsIGZpbGUgYyfDqFxyXG4gICAgdGhpcy5idWlsZERvd25sb2FkTGluayhmdSk7XHJcbiAgICB9ZWxzZSBpZiAodGhpcy5kb3dubG9hZFNlcnZpY2UgIT0gbnVsbCl7XHJcbiAgICAgIHRoaXMuZG93bmxvYWRTZXJ2aWNlKGZ1LmlkKTtcclxuICAgIH1lbHNlIGlmICh0aGlzLnByZXZpZXdTZXJ2aWNlICE9IG51bGwpe1xyXG4gICAgICAvLyBpbCBmaWxlIG5vbiBjJ8OoXHJcbiAgICAgIHRoaXMucHJldmlld1NlcnZpY2UoZnUuaWQpLnN1YnNjcmliZSgocmVzcCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IHJlc3BGaWxlID0gdGhpcy5wcmV2aWV3U2VydmljZVJlc3BvbnNlVG9GaWxlKHJlc3AsIGZ1KTtcclxuICAgICAgICBpZiAocmVzcEZpbGUgIT0gbnVsbCl7XHJcbiAgICAgICAgICAgIGZ1LmZpbGUgPSByZXNwRmlsZTtcclxuICAgICAgICAgICAgdGhpcy5sb2FkRmlsZVByZXZpZXdJbmZvcm1hdGlvbihmdSkudGhlbigoKSA9PiB7XHJcbiAgICAgICAgICAgICAgdGhpcy5idWlsZERvd25sb2FkTGluayhmdSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgIGZ1Ll9pc0ltYWdlID0gZmFsc2U7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ3RoZSBkb3dubG9hZGVkIGZpbGUgaXMgbm90IG9mIHR5cGUgRmlsZScpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgYnVpbGREb3dubG9hZExpbmsoZnU6IFVwbG9hZENvbnRhaW5lckZpbGUpe1xyXG4gICAgY29uc3QgZG93bmxvYWRMaW5rID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xyXG4gICAgZG93bmxvYWRMaW5rLmhyZWYgPSB3aW5kb3cuVVJMLmNyZWF0ZU9iamVjdFVSTChmdS5maWxlIGFzIEZpbGUpO1xyXG4gICAgZG93bmxvYWRMaW5rLnNldEF0dHJpYnV0ZSgnZG93bmxvYWQnLCBmdS5maWxlLm5hbWUpO1xyXG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChkb3dubG9hZExpbmspO1xyXG4gICAgZG93bmxvYWRMaW5rLmNsaWNrKCk7XHJcbiAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKGRvd25sb2FkTGluayk7XHJcbiAgfVxyXG5cclxuXHJcbiAgcHJlcGFyZUZpbGVzTGlzdChmaWxlczogQXJyYXk8YW55Pikge1xyXG5cclxuICAgIHRoaXMuY2hlY2tGaWxlKGZpbGVzKS50aGVuKFxyXG4gICAgICAoKSA9PiB7XHJcblxyXG4gICAgICAgIGlmICghdGhpcy5tdWx0aXBsZSl7XHJcbiAgICAgICAgICB0aGlzLnNlbGVjdGVkRmlsZXMgPSBbXTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZvciAoY29uc3QgaXQgb2YgZmlsZXMpIHtcclxuICAgICAgICAgIC8vIGNsb25vIGwnb2dnZXR0byBwZXIgbW9kaWZpY2FybmUgbGEgZGF0YSBjb24gcXVlbGxhIGF0dHVhbGVcclxuICAgICAgICAgIGNvbnN0IGl0ZW0gPSBuZXcgRmlsZShbaXRdLCBpdC5uYW1lLCB7IHR5cGU6IGl0LnR5cGUgfSkgYXMgRmlsZTtcclxuICAgICAgICAgIGNvbnN0IGR1cGxpY2F0ZWQgPSB0aGlzLnNlbGVjdGVkRmlsZXMuZmluZChzZiA9PiBzZi5maWxlLm5hbWUgPT09IGl0ZW0ubmFtZSkgIT0gbnVsbDtcclxuXHJcbiAgICAgICAgICBjb25zdCBjZiA9IHtcclxuICAgICAgICAgICAgbmFtZTogZHVwbGljYXRlZCA/ICdjb3B5LScgKyBpdGVtLm5hbWUgOiBpdGVtLm5hbWUsXHJcbiAgICAgICAgICAgIGZpbGU6IGl0ZW0sXHJcbiAgICAgICAgICAgIGNyZWF0aW9uVXNlcjoge1xyXG4gICAgICAgICAgICAgIGZpcnN0bmFtZTogdGhpcy50cy5sb2dnZWRVc2VyLnZhbHVlLmZpcnN0TmFtZSxcclxuICAgICAgICAgICAgICBsYXN0bmFtZTogdGhpcy50cy5sb2dnZWRVc2VyLnZhbHVlLmxhc3ROYW1lLFxyXG4gICAgICAgICAgICAgIHVzZXJpZDogdGhpcy50cy5sb2dnZWRVc2VyLnZhbHVlLnVzZXJuYW1lXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGlkOiBudWxsLFxyXG4gICAgICAgICAgICBfdHlwZTogdGhpcy5nZXRGaWxlVHlwZShpdGVtKVxyXG4gICAgICAgICAgfSBhcyBVcGxvYWRDb250YWluZXJGaWxlO1xyXG5cclxuICAgICAgICAgIHRoaXMuc2VsZWN0ZWRGaWxlcy5wdXNoKGNmKTtcclxuXHJcbiAgICAgICAgICB0aGlzLmxvYWRGaWxlUHJldmlld0luZm9ybWF0aW9uKGNmKTtcclxuXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuY2hhbmdlKHRoaXMuc2VsZWN0ZWRGaWxlcyk7XHJcbiAgICAgICAgdGhpcy5vblRvdWNoZWRDYWxsYmFjaygpO1xyXG4gICAgICAgIHRoaXMuaW5wdXRFbGUubmF0aXZlRWxlbWVudC52YWx1ZSA9ICcnO1xyXG5cclxuICAgICAgfSxcclxuICAgICAgKGVycikgPT4ge1xyXG4gICAgICB0aGlzLnVwbG9hZEVycm9yTWVzc2FnZSA9IHRydWU7XHJcblxyXG4gICAgICBzd2l0Y2ggKGVycil7XHJcbiAgICAgICAgICBjYXNlICdJTlZBTElELUZJTEUtRVhURU5TSU9OJzogdGhpcy5pbnZhbGlkRXh0ID0gdHJ1ZTsgYnJlYWs7XHJcbiAgICAgICAgICBjYXNlICdJTlZBTElELUZJTEUtU0laRSc6IHRoaXMuaW52YWxpZFNpemUgPSB0cnVlOyBicmVhaztcclxuICAgICAgICAgIGNhc2UgJ0lOVkFMSUQtRklMRS1TSVpFLVNJTkdMRS1GSUxFJzogdGhpcy5pbnZhbGlkU2l6ZVNpbmdsZUZpbGUgPSB0cnVlOyBicmVhaztcclxuICAgICAgICAgIGNhc2UgJ0lOVkFMSUQtRklMRS1MRU5HVEgnOiB0aGlzLmludmFsaWRMZW5ndGggPSB0cnVlOyBicmVhaztcclxuICAgICAgICB9XHJcblxyXG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICB0aGlzLnVwbG9hZEVycm9yTWVzc2FnZSA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuaW52YWxpZEV4dCA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuaW52YWxpZFNpemUgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLmludmFsaWRTaXplU2luZ2xlRmlsZSA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuaW52YWxpZExlbmd0aCA9IGZhbHNlO1xyXG4gICAgICB9LCA0MDAwKTtcclxuXHJcbiAgICAgICAgLy8gcmVtb3ZlIHRoZSBmaWxlIHNlbGVjdGVkXHJcbiAgICAgICAgLy8gaWYodGhpcy5zZWxlY3RlZEZpbGVzKXtcclxuICAgICAgICAvLyAgIHRoaXMuc2VsZWN0ZWRGaWxlcy5sZW5ndGg9MDtcclxuICAgICAgICAvLyB9XHJcbiAgICAgICAgLy8gdGhpcy51cGxvYWRDb250YWluZXJDb250cm9sLnNldFZhbHVlKHRoaXMuc2VsZWN0ZWRGaWxlcyk7XHJcbiAgICAgIHRoaXMuaW5wdXRFbGUubmF0aXZlRWxlbWVudC52YWx1ZSA9ICcnO1xyXG5cclxuXHJcbiAgICAgIH0pO1xyXG5cclxuXHJcbiAgfVxyXG5cclxuICBjaGFuZ2UoZmlsZXMpe1xyXG4gICAgaWYgKHRoaXMubXVsdGlwbGUpe1xyXG4gICAgICB0aGlzLnByb3BhZ2F0ZUNoYW5nZShmaWxlcyk7XHJcbiAgICB9ZWxzZXtcclxuICAgICAgdGhpcy5wcm9wYWdhdGVDaGFuZ2UoZmlsZXMubGVuZ3RoID09PSAwID8gbnVsbCA6IGZpbGVzWzBdKTtcclxuICAgIH1cclxuXHJcbiAgfVxyXG5cclxuICBnZXRGaWxlVHlwZShmaWxlOiBGaWxlIHwgU2lpRmlsZSk6IHN0cmluZyB8IG51bGx7XHJcbiAgICBpZiAoIGZpbGUudHlwZS5tYXRjaCgvaW1hZ2VcXC8qLykgIT0gbnVsbCl7cmV0dXJuICdJTUFHRSc7IH1cclxuICAgIGVsc2UgaWYgKCBmaWxlLnR5cGUubWF0Y2goL3BkZlxcLyovKSAhPSBudWxsKXtyZXR1cm4gJ1BERic7IH1cclxuICAgIGVsc2UgaWYgKCBmaWxlLnR5cGUubWF0Y2goL2NzdiQvKSAhPSBudWxsKXtyZXR1cm4gJ0NTVic7IH1cclxuICAgIGVsc2UgaWYgKCBmaWxlLnR5cGUubWF0Y2goL1xcLnNwcmVhZHNoZWV0bWwkLykgIT0gbnVsbCl7cmV0dXJuICdFWENFTCc7IH1cclxuICAgIGVsc2UgaWYgKCBmaWxlLnR5cGUubWF0Y2goL1xcLmRvY3VtZW50JC8pICE9IG51bGwpe3JldHVybiAnV09SRCc7IH1cclxuICAgIGVsc2UgaWYgKCBmaWxlLnR5cGUubWF0Y2goL1xcLnByZXNlbnRhdGlvbiQvKSAhPSBudWxsKXtyZXR1cm4gJ1BPV0VSUE9JTlQnOyB9XHJcbiAgfVxyXG5cclxuXHJcbiAgY2hlY2tJbWFnZVRvQ3JvcChmaWxlczogQXJyYXk8YW55Pil7XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2U8IEFycmF5PGFueT4+KChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuXHJcbiAgICAgIC8vIGdldCBhbGwgaW1hZ2VzIGZpbGVcclxuICAgICAgY29uc3QgaW1hZ2VzRmlsZSA9IFtdO1xyXG4gICAgICBjb25zdCBvdGhlcnNGaWxlID0gW107XHJcbiAgICAgIGZvciAoY29uc3QgZiBvZiBmaWxlcykge1xyXG4gICAgICAgIGlmIChmLnR5cGUubWF0Y2goL2ltYWdlXFwvKi8pICE9IG51bGwpe1xyXG4gICAgICAgICAgaW1hZ2VzRmlsZS5wdXNoKGYpO1xyXG4gICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgb3RoZXJzRmlsZS5wdXNoKGYpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gY29uc3QgaW1hZ2VzRmlsZSA9IGZpbGVzLmZpbHRlcihmID0+IGYudHlwZS5tYXRjaCgvaW1hZ2VcXC8qLykgIT0gbnVsbCk7XHJcbiAgICAgIGlmIChpbWFnZXNGaWxlLmxlbmd0aCA9PT0gMCB8fCBpbWFnZXNGaWxlLmxlbmd0aCA+IDEpe1xyXG4gICAgICAgIHJlc29sdmUoZmlsZXMpO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gaWYgaSdtIGhlcmUgdGhlcmUgaXMgb25seSAxIGltYWdlIGZpbGVcclxuICAgICAgdGhpcy5vcGVuQ3JvcERpYWxvZyhpbWFnZXNGaWxlWzBdKVxyXG4gICAgICAuc3Vic2NyaWJlKChwaG90bzogRmlsZSkgPT4ge1xyXG4gICAgICAgIGlmICghIXBob3RvKXtcclxuICAgICAgICAgIG90aGVyc0ZpbGUucHVzaChwaG90byk7XHJcbiAgICAgICAgICByZXNvbHZlKG90aGVyc0ZpbGUpO1xyXG4gICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgcmVqZWN0KCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuXHJcblxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuXHJcblxyXG4gIHBlcmZvcm1Dcm9wRmlsZSggaW5kZXgpe1xyXG4gICAgdGhpcy5vcGVuQ3JvcERpYWxvZyggdGhpcy5zZWxlY3RlZEZpbGVzW2luZGV4XS5maWxlIGFzIEZpbGUpXHJcbiAgICAgIC5zdWJzY3JpYmUoKHBob3RvOiBGaWxlKSA9PiB7XHJcbiAgICAgICAgaWYgKCEhcGhvdG8pe1xyXG4gICAgICAgICAgLy8gcmVtb3ZlIHRoZSBpZCB0byBwZXJmb3JtIGEgbmV3IHVwbG9hZFxyXG4gICAgICAgICAgdGhpcy5zZWxlY3RlZEZpbGVzW2luZGV4XS5wcmV2SWQgPSB0aGlzLnNlbGVjdGVkRmlsZXNbaW5kZXhdLmlkO1xyXG4gICAgICAgICAgdGhpcy5zZWxlY3RlZEZpbGVzW2luZGV4XS5pZCA9IG51bGw7XHJcbiAgICAgICAgICB0aGlzLnNlbGVjdGVkRmlsZXNbaW5kZXhdLmZpbGUgPSBwaG90bztcclxuICAgICAgICAgIHRoaXMubG9hZEZpbGVQcmV2aWV3SW5mb3JtYXRpb24odGhpcy5zZWxlY3RlZEZpbGVzW2luZGV4XSwgdHJ1ZSk7XHJcbiAgICAgICAgICB0aGlzLmNoYW5nZSh0aGlzLnNlbGVjdGVkRmlsZXMpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgfVxyXG5cclxuICBvcGVuQ3JvcERpYWxvZyhmaWxlOiBGaWxlKXtcclxuICAgcmV0dXJuIHRoaXMuZGlhbG9nLm9wZW4oQ3JvcEltYWdlRGlhbG9nQ29tcG9uZW50LFxyXG4gICAgICB7XHJcbiAgICAgICAgZGlzYWJsZUNsb3NlOiB0cnVlLFxyXG4gICAgICAgIHdpZHRoOiAnOTh2dycsXHJcbiAgICAgICAgbWF4V2lkdGg6ICc5OHZ3JyxcclxuICAgICAgICBkYXRhOiB7XHJcbiAgICAgICAgICBtYXhTaXplOiAodGhpcy5tdWx0aXBsZSA/IHRoaXMubWF4U2l6ZVNpbmdsZUZpbGUgOiB0aGlzLm1heFNpemUgKSxcclxuICAgICAgICAgIGFzcGVjdFJhdGlvOiB0aGlzLmFzcGVjdFJhdGlvLFxyXG4gICAgICAgICAgcmVzaXplVG9XaWR0aDogdGhpcy5yZXNpemVUb1dpZHRoLFxyXG4gICAgICAgICAgZmlsZVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICApLmFmdGVyQ2xvc2VkKCk7XHJcbiAgfVxyXG5cclxuXHJcbiBwcml2YXRlIG9wZW5QcmV2aWV3RGlhbG9nKGZ1OiBVcGxvYWRDb250YWluZXJGaWxlKXtcclxuICBpZiAoIGZ1LmZpbGUuc2l6ZSA+ICgxMDAwICogMTAyNCAqIDQpICl7XHJcbiAgICAvLyBDcmVhdGUgYSBsaW5rIHBvaW50aW5nIHRvIHRoZSBPYmplY3RVUkwgY29udGFpbmluZyB0aGUgYmxvYi5cclxuICAgIGNvbnN0IHVybCA9IHdpbmRvdy5VUkwuY3JlYXRlT2JqZWN0VVJMKGZ1LmZpbGUgYXMgQmxvYik7XHJcbiAgICBjb25zdCBhbmNob3IgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XHJcbiAgICBhbmNob3IuaHJlZiA9IHVybDtcclxuICAgIGFuY2hvci50YXJnZXQgPSAnX2JsYW5rJztcclxuICAgIGFuY2hvci5jbGljaygpO1xyXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgIC8vIEZvciBGaXJlZm94IGl0IGlzIG5lY2Vzc2FyeSB0byBkZWxheSByZXZva2luZyB0aGUgT2JqZWN0VVJMXHJcbiAgICAgIHdpbmRvdy5VUkwucmV2b2tlT2JqZWN0VVJMKHVybCk7XHJcbiAgICB9LCAxMDApO1xyXG4gIH1lbHNle1xyXG5cclxuICAgICB0aGlzLmRpYWxvZy5vcGVuKEZpbGVQcmV2aWV3RGlhbG9nQ29tcG9uZW50LFxyXG4gICAgICAge1xyXG4gICAgICAgIHdpZHRoOiAnOTglJyxcclxuICAgICAgICBtYXhXaWR0aDogJzEwMCUnLFxyXG4gICAgICAgIC8vIGhlaWdodDogJzk4JScsXHJcbiAgICAgICAgLy8gbWF4SGVpZ2h0OiAnOTglJyxcclxuICAgICAgICAgZGF0YTogZnUuZmlsZVxyXG4gICAgICAgfVxyXG4gICAgICAgKTtcclxuICAgfVxyXG4gIH1cclxuXHJcblxyXG5cclxuXHJcbiAgICBjaGVja0ZpbGUoZmlsZXM6IEFycmF5PGFueT4pe1xyXG4gICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG5cclxuICAgICAgaWYgKCF0aGlzLm11bHRpcGxlICYmIGZpbGVzLmxlbmd0aCA+IDEgKXtcclxuICAgICAgICByZWplY3QoJ0lOVkFMSUQtRklMRS1MRU5HVEgnKTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmICh0aGlzLmFjY2VwdEFycmF5Lmxlbmd0aCAhPT0gMCl7XHJcbiAgICAgICAgLy8gY2hlY2sgdGhlIGZvcm1hdFxyXG4gICAgICAgIGZvciAoY29uc3QgZiBvZiBmaWxlcykge1xyXG4gICAgICAgICAgaWYgKCF0aGlzLmlzVmFsaWRGb3JtYXQoZiwgdGhpcy5hY2NlcHRBcnJheSkpe1xyXG4gICAgICAgICAgICByZWplY3QoJ0lOVkFMSUQtRklMRS1FWFRFTlNJT04nKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgZm9yIChjb25zdCBmIG9mIGZpbGVzKSB7XHJcbiAgICAgICAgLy8gY2hlY2sgbWF4IHNpemVcclxuICAgICAgICBpZiAoIXRoaXMuaXNWYWxpZFNpemUoZikpe1xyXG4gICAgICAgICAgcmVqZWN0KCdJTlZBTElELUZJTEUtU0laRS1TSU5HTEUtRklMRScpO1xyXG4gICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgbGV0IHRvdGFsU2l6ZSA9IDA7XHJcbiAgICAgIGZvciAoY29uc3QgZiBvZiBmaWxlcykge1xyXG4gICAgICAgIHRvdGFsU2l6ZSArPSAoZiBhcyBGaWxlKS5zaXplO1xyXG4gICAgICB9XHJcbiAgICAgIC8vIFNVTSBBTFNPIFRIRSBBQ1RVQUwgU0VMRUNURUQgRklMRVMgaWYgaXMgbXVsdGlwbGVcclxuICAgICAgaWYgKHRoaXMubXVsdGlwbGUgJiYgdGhpcy5zZWxlY3RlZEZpbGVzICE9IG51bGwpe1xyXG4gICAgICAgIHRoaXMuc2VsZWN0ZWRGaWxlcy5mb3JFYWNoKHNmID0+IHtcclxuICAgICAgICAgIGlmIChzZi5maWxlICE9IG51bGwgJiYgc2YuZmlsZS5zaXplICE9IG51bGwpe1xyXG4gICAgICAgICAgICB0b3RhbFNpemUgKz0gKHNmLmZpbGUgYXMgRmlsZSk/LnNpemUgfHwgMCA7XHJcbiAgICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcignc29tZSBmaWxlcyBvZiBTaWktVXBsb2FkIGhhdmUgbnVsbCBmaWxlIG9iamVjdC4gUGxlYXNlIHJldHVybiBhbiBlbXB0eSBvYmplY3Qgd2l0aCBvbmx5IHRoZSBzaXplJyk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKCh0b3RhbFNpemUgLyAoMTAyMCAqIDEwMjQpKSA+IHRoaXMubWF4U2l6ZSl7XHJcbiAgICAgICAgcmVqZWN0KCdJTlZBTElELUZJTEUtU0laRScpO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG5cclxuXHJcblxyXG4gICAgICByZXNvbHZlKG51bGwpO1xyXG5cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgaXNWYWxpZEZvcm1hdChmOiBGaWxlLCBhY2NlcHRBcnJheTogQXJyYXk8c3RyaW5nPik6IGJvb2xlYW57XHJcbiAgICByZXR1cm4gYWNjZXB0QXJyYXkuZmluZChhY2MgPT4gYWNjID09PSBmLnR5cGUpICE9IG51bGw7XHJcbiAgICAvLyByZXR1cm4gYWNjZXB0QXJyYXkuaW5jbHVkZXMoZi50eXBlKTtcclxuICB9XHJcbiAgaXNWYWxpZFNpemUoZjogRmlsZSk6IGJvb2xlYW57XHJcbiAgICByZXR1cm4gKGYuc2l6ZSAvICgxMDI0ICogMTAyNCkpIDw9ICh0aGlzLm11bHRpcGxlID8gdGhpcy5tYXhTaXplU2luZ2xlRmlsZSA6IHRoaXMubWF4U2l6ZSApO1xyXG4gIH1cclxuXHJcbiAgcGljdEltYWdlKCl7XHJcbiAgICB0aGlzLmRpYWxvZy5vcGVuKFBpY3REaWFsb2dDb21wb25lbnQsXHJcbiAgICAgIHtcclxuICAgICAgICBkaXNhYmxlQ2xvc2U6IHRydWUsXHJcbiAgICAgICAgZGF0YToge1xyXG4gICAgICAgICAgbWF4U2l6ZTogKHRoaXMubXVsdGlwbGUgPyB0aGlzLm1heFNpemVTaW5nbGVGaWxlIDogdGhpcy5tYXhTaXplICksXHJcbiAgICAgICAgICBhc3BlY3RSYXRpbzogdGhpcy5hc3BlY3RSYXRpbyxcclxuICAgICAgICAgIHJlc2l6ZVRvV2lkdGg6IHRoaXMucmVzaXplVG9XaWR0aCxcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgKS5hZnRlckNsb3NlZCgpXHJcbiAgICAuc3Vic2NyaWJlKChwaG90bzogRmlsZSkgPT4ge1xyXG4gICAgICB0aGlzLnByZXBhcmVGaWxlc0xpc3QoISFwaG90byA/IFtwaG90b10gOiBbXSk7XHJcbiAgICB9KTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgVXBsb2FkQ29udGFpbmVyRmlsZSB7XHJcbiAgaWQ6IG51bWJlcjtcclxuICBjcmVhdGlvblVzZXI/OiB7Zmlyc3RuYW1lOiBzdHJpbmcsIGxhc3RuYW1lOiBzdHJpbmcsIHVzZXJpZDogc3RyaW5nfTtcclxuICBmaWxlOiBGaWxlIHwgU2lpRmlsZTtcclxuICByZWFkb25seT86IGJvb2xlYW47XHJcbiAgcHJldklkPzogbnVtYmVyO1xyXG4gIF9pbWFnZVByZXZpZXdVcmw/OiBhbnkgO1xyXG4gIF9pc0ltYWdlPzogYW55IDtcclxuICBfdHlwZT86IHN0cmluZztcclxuXHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgU2lpRmlsZXtcclxuICBuYW1lOiBzdHJpbmc7XHJcbiAgbGFzdE1vZGlmaWVkOiBudW1iZXI7XHJcbiAgdHlwZTogc3RyaW5nO1xyXG4gIHNpemU6IG51bWJlcjtcclxufVxyXG5cclxuXHJcbi8vIHtcclxuLy8gICBpZDogbnVtYmVyO1xyXG4vLyBjcmVhdGlvblVzZXI6IHtmaXJzdG5hbWU6IHN0cmluZywgbGFzdG5hbWU6IHN0cmluZywgdXNlcmlkOiBzdHJpbmd9O1xyXG4vLyBmaWxlOiB7IG5hbWU6c3RyaW5nICwgbGFzdE1vZGlmaWVkOiBudW1iZXIsICB0eXBlOiBzdHJpbmcsICBzaXplOiBudW1iZXJ9O1xyXG4vLyByZWFkb25seT86IGJvb2xlYW47XHJcbi8vIH1cclxuIiwiPGlucHV0IHR5cGU9XCJmaWxlXCIgIHN0eWxlPVwiZGlzcGxheTogbm9uZTtcIiBbYWNjZXB0XT1cImFjY2VwdFwiICAgI2ZpbGVEcm9wUmVmIGlkPVwiZmlsZURyb3BSZWZcIiBbbXVsdGlwbGVdPVwibXVsdGlwbGVcIiAoY2hhbmdlKT1cImZpbGVCcm93c2VIYW5kbGVyKCRldmVudC50YXJnZXQuZmlsZXMpXCIgLz5cclxuXHJcblxyXG48bmctY29udGVudCBzZWxlY3Q9XCJbc2lpLXVwbG9hZC10aXRsZV1cIj48L25nLWNvbnRlbnQ+XHJcblxyXG48ZGl2IGNsYXNzPVwic2lpVXBsb2FkQm94XCI+XHJcblxyXG5cclxuICA8ZGl2IGNsYXNzPVwiY29udGFpbmVyXCIgID5cclxuXHJcbiAgICA8ZGl2IGNsYXNzPVwiVUNfRHJvcF9yb3dfZnVsbFNjcmVlblwiID5cclxuICAgICAgPG1hdC1pY29uIHN0eWxlPVwiICAgIHdpZHRoOiA0MHB4OyAgICAgIGhlaWdodDogNDBweDsgICAgICBtYXJnaW46IDEwcHg7XCIgc3ZnSWNvbj1cInVwbG9hZC1zb2xpZFwiPjwvbWF0LWljb24+XHJcbiAgICAgIDxzcGFuIHN0eWxlPVwiICAgIG1hcmdpbi1sZWZ0OiAxMHB4O1wiIGkxOG49XCJAQERyb3BGaWxlSGVyZVwiPkRyb3AgZmlsZSBoZXJlPC9zcGFuPlxyXG4gICAgPC9kaXY+XHJcblxyXG4gICAgPGRpdiBjbGFzcz1cImludmFsaWRFeHRlbnNpb25GaWxlXCIgPlxyXG4gICAgICA8Yj48aDIgaTE4bj1cIkBARlVfaW52YWxpZEZpbGVUeXBlXCI+SW52YWxpZCBGaWxlIFR5cGU8L2gyPjwvYj5cclxuICAgICAgPHNwYW4gaTE4bj1cIkBARlVfc3VwcG9ydGVkVHlwZVwiPlN1cHBvcnRlZCB0eXBlcyBhcmU8L3NwYW4+XHJcblxyXG4gICAgICBAZm9yICh0IG9mIGFjY2VwdEFycmF5OyB0cmFjayB0KSB7XHJcbiAgICAgICAgPGRpdj57e3R9fTwvZGl2PlxyXG4gICAgICB9XHJcbiAgICA8L2Rpdj5cclxuXHJcbiAgICA8ZGl2IGNsYXNzPVwiaW52YWxpZFNpemVGaWxlXCIgPlxyXG4gICAgICA8Yj48aDIgaTE4bj1cIkBARlVfaW52YWxpZEZpbGVTaXplXCI+SW52YWxpZCBTaXplPC9oMj48L2I+XHJcbiAgICAgIDxzcGFuIGkxOG49XCJAQEZVX21heFNpemVcIj5NYXggc2l6ZSBmb3IgdGhlIHVwbG9hZCBpcyA6IHt7bWF4U2l6ZX19IE1CPC9zcGFuPlxyXG4gICAgPC9kaXY+XHJcbiAgICA8ZGl2IGNsYXNzPVwiaW52YWxpZFNpemVTaW5nbGVGaWxlXCIgPlxyXG4gICAgICA8Yj48aDIgaTE4bj1cIkBARlVfaW52YWxpZEZpbGVTaXplXCI+SW52YWxpZCBTaXplPC9oMj48L2I+XHJcbiAgICAgIDxzcGFuIGkxOG49XCJAQEZVX21heFNpemVTaW5nbGVGaWxlXCI+TWF4IHNpemUgZm9yIHNpbmdsZSBmaWxlIGlzIDoge3ttYXhTaXplU2luZ2xlRmlsZX19IE1CPC9zcGFuPlxyXG4gICAgPC9kaXY+XHJcblxyXG4gICAgPGRpdiAgY2xhc3M9XCJpbnZhbGlkTGVuZ3RoRmlsZVwiID5cclxuICAgICAgPGI+PGgyIGkxOG49XCJAQEZVX2ludmFsaWRMZW5ndGhTaXplXCI+SW52YWxpZCBMZW5ndGg8L2gyPjwvYj5cclxuICAgICAgPHNwYW4gaTE4bj1cIkBARlVfb25seU9uZVwiPllvdSBjYW4gdXBsb2FkIG9ubHkgMSBmaWxlPC9zcGFuPlxyXG4gICAgPC9kaXY+XHJcblxyXG5cclxuXHJcbiAgICA8bmctY29udGVudCBzZWxlY3Q9XCJbc2lpLXVwbG9hZC1kZXNjcmlwdGlvbl1cIj48L25nLWNvbnRlbnQ+XHJcblxyXG4gICAgQGlmICghZGlzYWJsZWQpIHtcclxuICAgICAgPGRpdiBjbGFzcz1cImluZm9Cb3hcIiA+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cInNwZWNpZmljaGVcIj5cclxuICAgICAgICAgIEBpZiAobXVsdGlwbGUpIHtcclxuICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJVQ19tdWx0aXBsZVwiIGkxOG49XCJzaWktdXBsb2FkLWNvbXBvbmVudEBAbXVsdGlwbGVGaWxlU2VsZWN0aW9uXCI+bW9yZSB0aGFuIG9uZSBmaWxlIGNhbiBiZSB1cGxvYWRlZDwvc3Bhbj5cclxuICAgICAgICAgIH1cclxuICAgICAgICAgIDxzcGFuIGNsYXNzPVwiVUNfbWF4X3NpemVcIiA+XHJcbiAgICAgICAgICAgIDxzcGFuIGkxOG49XCJAQEZVX21heFNpemVfc21hbGxcIj5NYXggU2l6ZTwvc3Bhbj46e3sobWF4U2l6ZSoxMDI0KjEwMjQpIHwgc2lpTWVtb3J5fX1cclxuICAgICAgICAgICAgQGlmIChtdWx0aXBsZSB8fCB0cnVlKSB7XHJcbiAgICAgICAgICAgICAgLSAgPHNwYW4gaTE4bj1cIkBARlVfbWF4U2l6ZVNpbmdsZV9zbWFsbFwiPk1heCBTaXplIFNpbmdsZSBGaWxlPC9zcGFuPjoge3sobWF4U2l6ZVNpbmdsZUZpbGUgKjEwMjQqMTAyNCkgfCBzaWlNZW1vcnl9fVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICA8L3NwYW4+XHJcbiAgICAgICAgICBAaWYgKGFjY2VwdCE9JycpIHtcclxuICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJVQ19hY2NlcHRcIj48c3BhbiBpMThuPVwiQEBmaWxlVHlwZXNcIj5GaWxlIHR5cGU6PC9zcGFuPiZuYnNwO3t7YWNjZXB0VGV4dH19PC9zcGFuPlxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJVQ19Ecm9wX3Jvd1wiPlxyXG4gICAgICAgICAgPG1hdC1pY29uIHN0eWxlPVwiICAgIHdpZHRoOiAyMHB4O1wiIHN2Z0ljb249XCJ1cGxvYWQtc29saWRcIj48L21hdC1pY29uPlxyXG4gICAgICAgICAgPHNwYW4gc3R5bGU9XCIgICAgbWFyZ2luLWxlZnQ6IDEwcHg7XCIgaTE4bj1cIkBARHJvcEZpbGVIZXJlXCI+RHJvcCBmaWxlIGhlcmU8L3NwYW4+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgfVxyXG5cclxuXHJcblxyXG5cclxuXHJcbiAgPC9kaXY+XHJcblxyXG5cclxuICA8ZGl2IGNsYXNzPVwiVUMtZmlsZS1saXN0XCI+XHJcblxyXG4gICAgQGZvciAoZmlsZSBvZiBzZWxlY3RlZEZpbGVzOyB0cmFjayBmaWxlOyBsZXQgaSA9ICRpbmRleCkge1xyXG4gICAgICA8ZGl2IGNsYXNzPVwiVUMtZmlsZS1zZWxlY3RlZC1pdGVtXCI+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cIlVDLWZpbGUtc2VsZWN0ZWQtaXRlbS1ib3hcIj5cclxuICAgICAgICAgIDxzcGFuICBjbGFzcz1cIlVDLWZpbGUtc2VsZWN0ZWQtaXRlbS1hdHRyaWJ1dGUgdGl0bGVDb2xcIj5cclxuICAgICAgICAgICAgQGlmICghIWZpbGUuX2ltYWdlUHJldmlld1VybCAmJiAhIWZpbGUuX2lzSW1hZ2UpIHtcclxuICAgICAgICAgICAgICA8aW1nIGNsYXNzPVwicm93UHJldmlld0ltYWdlXCIgW3NyY109XCJmaWxlLl9pbWFnZVByZXZpZXdVcmxcIj5cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBAaWYgKCEoISFmaWxlLl9pbWFnZVByZXZpZXdVcmwgJiYgISFmaWxlLl9pc0ltYWdlKSkge1xyXG4gICAgICAgICAgICAgIEBzd2l0Y2ggKGZpbGUuX3R5cGUpIHtcclxuICAgICAgICAgICAgICAgIEBjYXNlICgnQ1NWJykge1xyXG4gICAgICAgICAgICAgICAgICA8bWF0LWljb24gc3ZnSWNvbj1cImZpbGUtY3N2XCI+PC9tYXQtaWNvbj5cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIEBjYXNlICgnRVhDRUwnKSB7XHJcbiAgICAgICAgICAgICAgICAgIDxtYXQtaWNvbiBzdmdJY29uPVwiZmlsZS1leGNlbFwiPjwvbWF0LWljb24+XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBAY2FzZSAoJ0lNQUdFJykge1xyXG4gICAgICAgICAgICAgICAgICA8bWF0LWljb24gc3ZnSWNvbj1cImZpbGUtaW1hZ2VcIj48L21hdC1pY29uPlxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgQGNhc2UgKCdQREYnKSB7XHJcbiAgICAgICAgICAgICAgICAgIDxtYXQtaWNvbiBzdmdJY29uPVwiZmlsZS1wZGZcIj48L21hdC1pY29uPlxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgQGNhc2UgKCdQT1dFUlBPSU5UJykge1xyXG4gICAgICAgICAgICAgICAgICA8bWF0LWljb24gc3ZnSWNvbj1cImZpbGUtcG93ZXJwb2ludFwiPjwvbWF0LWljb24+XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBAY2FzZSAoJ1dPUkQnKSB7XHJcbiAgICAgICAgICAgICAgICAgIDxtYXQtaWNvbiBzdmdJY29uPVwiZmlsZS13b3JkXCI+PC9tYXQtaWNvbj5cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIEBkZWZhdWx0IHtcclxuICAgICAgICAgICAgICAgICAgPG1hdC1pY29uIHN2Z0ljb249XCJmaWxlX2Rvd25sb2FkXCI+PC9tYXQtaWNvbj5cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJmaWxlTmFtZVwiPnt7IGZpbGU/LmZpbGUubmFtZSB9fTwvc3Bhbj5cclxuICAgICAgICAgIDwvc3Bhbj5cclxuICAgICAgICAgIDxzcGFuICBjbGFzcz1cIlVDLWZpbGUtc2VsZWN0ZWQtaXRlbS1hdHRyaWJ1dGUgY3JldXNlclwiPlxyXG4gICAgICAgICAgICBAaWYgKCEhZmlsZT8uY3JlYXRpb25Vc2VyPy5maXJzdG5hbWUpIHtcclxuICAgICAgICAgICAgICA8bWF0LWljb24+cGVyc29uPC9tYXQtaWNvbj5cclxuICAgICAgICAgICAgICA8c3Bhbj57e2ZpbGU/LmNyZWF0aW9uVXNlcj8uZmlyc3RuYW1lICsnICcrIGZpbGU/LmNyZWF0aW9uVXNlcj8ubGFzdG5hbWUgfX08L3NwYW4+XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIDwvc3Bhbj5cclxuICAgICAgICAgIDxzcGFuICBjbGFzcz1cIlVDLWZpbGUtc2VsZWN0ZWQtaXRlbS1hdHRyaWJ1dGUgbGFzdG1vZFwiPlxyXG4gICAgICAgICAgICBAaWYgKCEhZmlsZT8uZmlsZT8ubGFzdE1vZGlmaWVkKSB7XHJcbiAgICAgICAgICAgICAgPG1hdC1pY29uPmV2ZW50PC9tYXQtaWNvbj5cclxuICAgICAgICAgICAgICA8c3Bhbj57e2ZpbGU/LmZpbGU/Lmxhc3RNb2RpZmllZCB8IHNpaURhdGV9fTwvc3Bhbj5cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgPC9zcGFuPlxyXG4gICAgICAgICAgPHNwYW4gIGNsYXNzPVwiVUMtZmlsZS1zZWxlY3RlZC1pdGVtLWF0dHJpYnV0ZSBzaXplXCI+XHJcbiAgICAgICAgICAgIEBpZiAoISFmaWxlPy5maWxlPy5zaXplKSB7XHJcbiAgICAgICAgICAgICAgPG1hdC1pY29uPm1lbW9yeTwvbWF0LWljb24+XHJcbiAgICAgICAgICAgICAgPHNwYW4+e3tmaWxlPy5maWxlPy5zaXplIHwgc2lpTWVtb3J5fX08L3NwYW4+XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIDwvc3Bhbj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBbbWF0TWVudVRyaWdnZXJGb3JdPVwiYWN0aW9uXCIgICBtYXQtaWNvbi1idXR0b24gPjxtYXQtaWNvbj5tb3JlX3ZlcnQ8L21hdC1pY29uPjwvYnV0dG9uPlxyXG4gICAgICAgIDxtYXQtbWVudSAjYWN0aW9uPVwibWF0TWVudVwiICAgPlxyXG4gICAgICAgICAgQGlmICghZGlzYWJsZUNyb3AgJiYgIXRoaXMuZGlzYWJsZWQgJiYgY3JvcGFibGVGaWxlKGZpbGUpICYmIGZpbGUucmVhZG9ubHkhPXRydWUpIHtcclxuICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgbWF0LW1lbnUtaXRlbSAoY2xpY2spPVwiY3JvcEZpbGUoZmlsZSwgaSlcIj48bWF0LWljb24+Y3JvcDwvbWF0LWljb24+PHNwYW4gaTE4bj1cIkBAU2lpVXBsb2FkQ3JvcFwiPkNyb3A8L3NwYW4+PC9idXR0b24+XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBAaWYgKGRvd25sb2FkYWJsZUZpbGUoZmlsZSkpIHtcclxuICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgbWF0LW1lbnUtaXRlbSAoY2xpY2spPVwiZG93bmxvYWRGaWxlKGZpbGUpXCI+PG1hdC1pY29uPmZpbGVfZG93bmxvYWQ8L21hdC1pY29uPjxzcGFuIGkxOG49XCJAQFNpaVVwbG9hZERvd25sb2FkXCI+RG93bmxvYWQ8L3NwYW4+PC9idXR0b24+XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBAaWYgKCFkaXNhYmxlZCAmJiAhZGlzYWJsZURlbGV0ZSAmJiBmaWxlLnJlYWRvbmx5IT10cnVlKSB7XHJcbiAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIG1hdC1tZW51LWl0ZW0gKGNsaWNrKT1cImRlbGV0ZUZpbGUoaSxmaWxlKVwiPjxtYXQtaWNvbj5kZWxldGVfb3V0bGluZTwvbWF0LWljb24+PHNwYW4gaTE4bj1cIkBAU2lpVXBsb2FkRGVsZXRlXCI+RGVsZXRlPC9zcGFuPjwvYnV0dG9uPlxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgQGlmIChwcmV2aWV3YWJsZUZpbGUoZmlsZSkpIHtcclxuICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgbWF0LW1lbnUtaXRlbSAoY2xpY2spPVwicHJldmlld0ZpbGUoZmlsZSlcIj48bWF0LWljb24+dmlzaWJpbGl0eTwvbWF0LWljb24+PHNwYW4gaTE4bj1cIkBAU2lpVXBsb2FkUHJldmlld1wiPlByZXZpZXc8L3NwYW4+PC9idXR0b24+XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgPC9tYXQtbWVudT5cclxuICAgICAgPC9kaXY+XHJcbiAgICB9XHJcbiAgPC9kaXY+XHJcblxyXG5cclxuICBAaWYgKCFkaXNhYmxlZCkge1xyXG4gICAgPGRpdiBjbGFzcz1cIlVDX2ZpbGVTZWxlY3Rpb25zUm93XCI+XHJcbiAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIG1hdC1idXR0b24gIChjbGljayk9XCJmaWxlRHJvcFJlZi5jbGljaygpIFwiID5cclxuICAgICAgICA8bWF0LWljb24gc3R5bGU9XCIgICAgd2lkdGg6IDE3cHg7ICAgICAgbWFyZ2luLXJpZ2h0OiA0cHg7XCIgc3ZnSWNvbj1cImF0dGFjaG1lbnRcIj48L21hdC1pY29uPlxyXG4gICAgICAgIDxzcGFuIGkxOG49XCJAQENob29zZV9GaWxlXCI+Q2hvb3NlIGZpbGU8L3NwYW4+XHJcbiAgICAgIDwvYnV0dG9uPlxyXG4gICAgICBAaWYgKGVuYWJsZUNhbWVyYSAmJiB3ZWJjYW1BdmFpbGFibGUpIHtcclxuICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBtYXQtYnV0dG9uIChjbGljayk9XCJwaWN0SW1hZ2UoKSBcIj5cclxuICAgICAgICAgIDxtYXQtaWNvbiBzdHlsZT1cIm1hcmdpbi1yaWdodDogNHB4O1wiPnBob3RvX2NhbWVyYTwvbWF0LWljb24+XHJcbiAgICAgICAgICA8c3BhbiBpMThuPVwiQEB0YWtlQVBob3RvXCI+VGFrZSBhIFBob3RvPC9zcGFuPlxyXG4gICAgICAgIDwvYnV0dG9uPlxyXG4gICAgICB9XHJcbiAgICA8L2Rpdj5cclxuICB9XHJcbjwvZGl2PlxyXG5cclxuXHJcbiJdfQ==