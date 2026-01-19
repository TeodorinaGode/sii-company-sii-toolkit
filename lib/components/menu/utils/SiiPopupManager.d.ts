export interface IParentIframeWindowDto extends Element {
    popup: any;
}
export declare const PopupManager: {
    popupStack: any;
    addPopupSdac(url: any, newPage: any): void;
    addPopup(urlContenuto: any, callerReturnFunction: any, innerWidth: any, innerHeight: any, reloadOnClose: any): void;
    getLastPopup(): any;
    closeLastPopup(oggetto: any, reload?: boolean): void;
    getEclosingPopup(obj: any): any;
    reloadOpener(obj: any): void;
};
