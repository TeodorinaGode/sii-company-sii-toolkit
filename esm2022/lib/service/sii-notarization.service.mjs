import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { NotarizationResponseDialogComponent } from '../components/notarization/utils/notarization-response-dialog/notarization-response-dialog.component';
import * as i0 from "@angular/core";
import * as i1 from "@angular/material/dialog";
import * as i2 from "../sii-toolkit.service";
import * as i3 from "./sii-feedback.service";
export class SiiNotarizationService {
    constructor(dialog, siiToolkitService, feedbackService) {
        this.dialog = dialog;
        this.siiToolkitService = siiToolkitService;
        this.feedbackService = feedbackService;
    }
    notarize(notarizationComponent, notarizationRestService, notarizationPrintReceiptUrl, config) {
        const subscrRet = new Subject();
        const data = config || {};
        data.data = config?.data || {};
        data.width = data.width || '900px';
        data.maxWidth = data.maxWidth || '100vw';
        this.dialog.open(notarizationComponent, data)
            .afterClosed()
            .subscribe((resp) => {
            if (resp) {
                notarizationRestService
                    .subscribe((notarizResp) => {
                    if (!!notarizResp) {
                        this.showNotarizationResponse(notarizResp, notarizationPrintReceiptUrl).afterClosed().subscribe(() => {
                            subscrRet.next(notarizResp);
                        });
                    }
                    else {
                        subscrRet.next(null);
                    }
                });
            }
            else {
                subscrRet.next(null);
            }
        });
        return subscrRet;
    }
    showNotarizationResponse(notarizResp, notarizationPrintReceiptUrl) {
        if (notarizResp.status === 'DONE') {
            return this.feedbackService.showSuccessBanner(NotarizationResponseDialogComponent, { data: { notarizResp, notarizationPrintReceiptUrl } });
        }
        else {
            return this.feedbackService.showInfoBanner(NotarizationResponseDialogComponent, { data: { notarizResp, notarizationPrintReceiptUrl } });
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: SiiNotarizationService, deps: [{ token: i1.MatDialog }, { token: i2.SiiToolkitService }, { token: i3.SiiFeedbackService }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: SiiNotarizationService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: SiiNotarizationService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: () => [{ type: i1.MatDialog }, { type: i2.SiiToolkitService }, { type: i3.SiiFeedbackService }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2lpLW5vdGFyaXphdGlvbi5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvc2lpLXRvb2xraXQvc3JjL2xpYi9zZXJ2aWNlL3NpaS1ub3Rhcml6YXRpb24uc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFlLE1BQU0sZUFBZSxDQUFDO0FBSXhELE9BQU8sRUFBZSxPQUFPLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFHNUMsT0FBTyxFQUFFLG1DQUFtQyxFQUFFLE1BQU0sc0dBQXNHLENBQUM7Ozs7O0FBSzNKLE1BQU0sT0FBTyxzQkFBc0I7SUFFakMsWUFBbUIsTUFBaUIsRUFDakIsaUJBQW9DLEVBQ25DLGVBQW1DO1FBRnBDLFdBQU0sR0FBTixNQUFNLENBQVc7UUFDakIsc0JBQWlCLEdBQWpCLGlCQUFpQixDQUFtQjtRQUNuQyxvQkFBZSxHQUFmLGVBQWUsQ0FBb0I7SUFBSSxDQUFDO0lBRXJELFFBQVEsQ0FBRSxxQkFBNEQsRUFDNUQsdUJBQTRELEVBQzVELDJCQUFtQyxFQUNuQyxNQUE2QjtRQUU1QyxNQUFNLFNBQVMsR0FBRyxJQUFJLE9BQU8sRUFBa0MsQ0FBQztRQUNoRSxNQUFNLElBQUksR0FBRyxNQUFNLElBQUksRUFBRSxDQUFDO1FBQzFCLElBQUksQ0FBQyxJQUFJLEdBQUcsTUFBTSxFQUFFLElBQUksSUFBSSxFQUFFLENBQUM7UUFDL0IsSUFBSSxDQUFDLEtBQUssR0FBSSxJQUFJLENBQUMsS0FBSyxJQUFJLE9BQU8sQ0FBQztRQUNwQyxJQUFJLENBQUMsUUFBUSxHQUFLLElBQUksQ0FBQyxRQUFRLElBQUksT0FBTyxDQUFDO1FBQzNDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFFLHFCQUFxQixFQUFFLElBQUksQ0FBQzthQUM3QyxXQUFXLEVBQUU7YUFDYixTQUFTLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRTtZQUNsQixJQUFJLElBQUksRUFBQyxDQUFDO2dCQUNKLHVCQUF1QjtxQkFDcEIsU0FBUyxDQUFDLENBQUMsV0FBVyxFQUFFLEVBQUU7b0JBQ3pCLElBQUksQ0FBQyxDQUFDLFdBQVcsRUFBQyxDQUFDO3dCQUNqQixJQUFJLENBQUMsd0JBQXdCLENBQUMsV0FBVyxFQUFFLDJCQUEyQixDQUFDLENBQUMsV0FBVyxFQUFFLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRTs0QkFDbkcsU0FBUyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQzt3QkFDOUIsQ0FBQyxDQUFDLENBQUM7b0JBQ0wsQ0FBQzt5QkFBSSxDQUFDO3dCQUNKLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ3ZCLENBQUM7Z0JBQ0gsQ0FBQyxDQUFDLENBQUM7WUFDWCxDQUFDO2lCQUFJLENBQUM7Z0JBQ0osU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUN2QixDQUFDO1FBQ0gsQ0FBQyxDQUFDLENBQUM7UUFFSCxPQUFPLFNBQVMsQ0FBQztJQUNqQixDQUFDO0lBSUssd0JBQXdCLENBQUMsV0FBb0MsRUFBRSwyQkFBbUM7UUFDeEcsSUFBSSxXQUFXLENBQUMsTUFBTSxLQUFLLE1BQU0sRUFBQyxDQUFDO1lBQ2pDLE9BQU8sSUFBSSxDQUFDLGVBQWUsQ0FBQyxpQkFBaUIsQ0FBQyxtQ0FBbUMsRUFBRSxFQUFDLElBQUksRUFBRSxFQUFDLFdBQVcsRUFBRSwyQkFBMkIsRUFBQyxFQUFDLENBQUMsQ0FBQztRQUN6SSxDQUFDO2FBQUksQ0FBQztZQUNKLE9BQU8sSUFBSSxDQUFDLGVBQWUsQ0FBQyxjQUFjLENBQUMsbUNBQW1DLEVBQUUsRUFBQyxJQUFJLEVBQUUsRUFBQyxXQUFXLEVBQUUsMkJBQTJCLEVBQUMsRUFBQyxDQUFDLENBQUM7UUFDdEksQ0FBQztJQUNILENBQUM7K0dBOUNVLHNCQUFzQjttSEFBdEIsc0JBQXNCLGNBRnJCLE1BQU07OzRGQUVQLHNCQUFzQjtrQkFIbEMsVUFBVTttQkFBQztvQkFDVixVQUFVLEVBQUUsTUFBTTtpQkFDbkIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlLCBUZW1wbGF0ZVJlZiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBTaWlUb29sa2l0U2VydmljZSB9IGZyb20gJy4uL3NpaS10b29sa2l0LnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBNYXREaWFsb2csIE1hdERpYWxvZ0NvbmZpZyB9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2RpYWxvZyc7XHJcbmltcG9ydCB7IENvbXBvbmVudFR5cGUgfSBmcm9tICdAYW5ndWxhci9jZGsvcG9ydGFsJztcclxuaW1wb3J0IHsgIE9ic2VydmFibGUsIFN1YmplY3QgfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHsgU2lpTm90YXJpemF0aW9uUmVzcG9uc2UgfSBmcm9tICcuLi9kdG8vbm90YXJpemF0aW9uLXJlc3BvbnNlLmR0byc7XHJcbmltcG9ydCB7IFNpaUZlZWRiYWNrU2VydmljZSB9IGZyb20gJy4vc2lpLWZlZWRiYWNrLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBOb3Rhcml6YXRpb25SZXNwb25zZURpYWxvZ0NvbXBvbmVudCB9IGZyb20gJy4uL2NvbXBvbmVudHMvbm90YXJpemF0aW9uL3V0aWxzL25vdGFyaXphdGlvbi1yZXNwb25zZS1kaWFsb2cvbm90YXJpemF0aW9uLXJlc3BvbnNlLWRpYWxvZy5jb21wb25lbnQnO1xyXG5cclxuQEluamVjdGFibGUoe1xyXG4gIHByb3ZpZGVkSW46ICdyb290J1xyXG59KVxyXG5leHBvcnQgY2xhc3MgU2lpTm90YXJpemF0aW9uU2VydmljZSB7XHJcblxyXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBkaWFsb2c6IE1hdERpYWxvZyxcclxuICAgICAgICAgICAgICBwdWJsaWMgc2lpVG9vbGtpdFNlcnZpY2U6IFNpaVRvb2xraXRTZXJ2aWNlLFxyXG4gICAgICAgICAgICAgIHByaXZhdGUgZmVlZGJhY2tTZXJ2aWNlOiBTaWlGZWVkYmFja1NlcnZpY2UpIHsgfVxyXG5cclxuICBwdWJsaWMgbm90YXJpemUoIG5vdGFyaXphdGlvbkNvbXBvbmVudDogQ29tcG9uZW50VHlwZTxhbnk+IHwgVGVtcGxhdGVSZWY8YW55PiAsXHJcbiAgICAgICAgICAgICAgICAgICBub3Rhcml6YXRpb25SZXN0U2VydmljZTogT2JzZXJ2YWJsZTxTaWlOb3Rhcml6YXRpb25SZXNwb25zZT4sXHJcbiAgICAgICAgICAgICAgICAgICBub3Rhcml6YXRpb25QcmludFJlY2VpcHRVcmw6IHN0cmluZyxcclxuICAgICAgICAgICAgICAgICAgIGNvbmZpZz86IE1hdERpYWxvZ0NvbmZpZzxhbnk+KXtcclxuXHJcbiAgICBjb25zdCBzdWJzY3JSZXQgPSBuZXcgU3ViamVjdDxTaWlOb3Rhcml6YXRpb25SZXNwb25zZSB8IG51bGw+KCk7XHJcbiAgICBjb25zdCBkYXRhID0gY29uZmlnIHx8IHt9O1xyXG4gICAgZGF0YS5kYXRhID0gY29uZmlnPy5kYXRhIHx8IHt9O1xyXG4gICAgZGF0YS53aWR0aCA9ICBkYXRhLndpZHRoIHx8ICc5MDBweCc7XHJcbiAgICBkYXRhLm1heFdpZHRoID0gICBkYXRhLm1heFdpZHRoIHx8ICcxMDB2dyc7XHJcbiAgICB0aGlzLmRpYWxvZy5vcGVuKCBub3Rhcml6YXRpb25Db21wb25lbnQsIGRhdGEpXHJcbiAgICAuYWZ0ZXJDbG9zZWQoKVxyXG4gICAgLnN1YnNjcmliZSgocmVzcCkgPT4ge1xyXG4gICAgICBpZiAocmVzcCl7XHJcbiAgICAgICAgICAgIG5vdGFyaXphdGlvblJlc3RTZXJ2aWNlXHJcbiAgICAgICAgICAgICAgLnN1YnNjcmliZSgobm90YXJpelJlc3ApID0+IHtcclxuICAgICAgICAgICAgICAgIGlmICghIW5vdGFyaXpSZXNwKXtcclxuICAgICAgICAgICAgICAgICAgdGhpcy5zaG93Tm90YXJpemF0aW9uUmVzcG9uc2Uobm90YXJpelJlc3AsIG5vdGFyaXphdGlvblByaW50UmVjZWlwdFVybCkuYWZ0ZXJDbG9zZWQoKS5zdWJzY3JpYmUoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHN1YnNjclJldC5uZXh0KG5vdGFyaXpSZXNwKTtcclxuICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgICAgICAgc3Vic2NyUmV0Lm5leHQobnVsbCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgfSk7XHJcbiAgICAgIH1lbHNle1xyXG4gICAgICAgIHN1YnNjclJldC5uZXh0KG51bGwpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICByZXR1cm4gc3Vic2NyUmV0O1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gIHByaXZhdGUgc2hvd05vdGFyaXphdGlvblJlc3BvbnNlKG5vdGFyaXpSZXNwOiBTaWlOb3Rhcml6YXRpb25SZXNwb25zZSwgbm90YXJpemF0aW9uUHJpbnRSZWNlaXB0VXJsOiBzdHJpbmcpe1xyXG4gICAgaWYgKG5vdGFyaXpSZXNwLnN0YXR1cyA9PT0gJ0RPTkUnKXtcclxuICAgICAgcmV0dXJuIHRoaXMuZmVlZGJhY2tTZXJ2aWNlLnNob3dTdWNjZXNzQmFubmVyKE5vdGFyaXphdGlvblJlc3BvbnNlRGlhbG9nQ29tcG9uZW50LCB7ZGF0YToge25vdGFyaXpSZXNwLCBub3Rhcml6YXRpb25QcmludFJlY2VpcHRVcmx9fSk7XHJcbiAgICB9ZWxzZXtcclxuICAgICAgcmV0dXJuIHRoaXMuZmVlZGJhY2tTZXJ2aWNlLnNob3dJbmZvQmFubmVyKE5vdGFyaXphdGlvblJlc3BvbnNlRGlhbG9nQ29tcG9uZW50LCB7ZGF0YToge25vdGFyaXpSZXNwLCBub3Rhcml6YXRpb25QcmludFJlY2VpcHRVcmx9fSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxufVxyXG5cclxuIl19