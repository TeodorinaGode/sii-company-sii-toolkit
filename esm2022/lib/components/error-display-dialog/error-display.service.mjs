import { Injectable } from '@angular/core';
import { ErrorDisplayDialogComponent } from './error-display-dialog.component';
import * as i0 from "@angular/core";
import * as i1 from "@angular/material/dialog";
export class ErrorDisplayService {
    constructor(dialog) {
        this.dialog = dialog;
    }
    /**
     * Show an error dialog ore returns the current one if already opened
     * @param errorTitle the title of the dialog
     * @param errorContent the content of the dialog
     */
    showDialog(errorTitle, errorContent) {
        const dialogArr = this.dialog.openDialogs.filter((ref) => ref.id === 'errorDisplayDialog');
        if (dialogArr.length > 0) {
            return dialogArr[0];
        }
        return this.dialog.open(ErrorDisplayDialogComponent, {
            data: {
                errorTitle,
                errorContent,
            },
            id: 'errorDisplayDialog',
        });
    }
    isAlreadyOpened() {
        return this.dialog.openDialogs.filter((ref) => ref.id === 'errorDisplayDialog').length > 0;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: ErrorDisplayService, deps: [{ token: i1.MatDialog }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: ErrorDisplayService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: ErrorDisplayService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: () => [{ type: i1.MatDialog }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXJyb3ItZGlzcGxheS5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvc2lpLXRvb2xraXQvc3JjL2xpYi9jb21wb25lbnRzL2Vycm9yLWRpc3BsYXktZGlhbG9nL2Vycm9yLWRpc3BsYXkuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRTNDLE9BQU8sRUFBRSwyQkFBMkIsRUFBRSxNQUFNLGtDQUFrQyxDQUFDOzs7QUFLL0UsTUFBTSxPQUFPLG1CQUFtQjtJQUU5QixZQUFvQixNQUFpQjtRQUFqQixXQUFNLEdBQU4sTUFBTSxDQUFXO0lBQUksQ0FBQztJQUUxQzs7OztPQUlHO0lBQ0gsVUFBVSxDQUFDLFVBQWtCLEVBQUUsWUFBb0I7UUFDakQsTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBc0IsRUFBRSxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsS0FBSyxvQkFBb0IsQ0FBQyxDQUFDO1FBQzlHLElBQUksU0FBUyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUUsQ0FBQztZQUN6QixPQUFPLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN0QixDQUFDO1FBQ0QsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQywyQkFBMkIsRUFBRTtZQUNuRCxJQUFJLEVBQUU7Z0JBQ0osVUFBVTtnQkFDVixZQUFZO2FBQ2I7WUFDRCxFQUFFLEVBQUUsb0JBQW9CO1NBQ3pCLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRCxlQUFlO1FBQ2IsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFzQixFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxLQUFLLG9CQUFvQixDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztJQUNoSCxDQUFDOytHQXpCVSxtQkFBbUI7bUhBQW5CLG1CQUFtQixjQUZsQixNQUFNOzs0RkFFUCxtQkFBbUI7a0JBSC9CLFVBQVU7bUJBQUM7b0JBQ1YsVUFBVSxFQUFFLE1BQU07aUJBQ25CIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBNYXREaWFsb2csIE1hdERpYWxvZ1JlZiB9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2RpYWxvZyc7XHJcbmltcG9ydCB7IEVycm9yRGlzcGxheURpYWxvZ0NvbXBvbmVudCB9IGZyb20gJy4vZXJyb3ItZGlzcGxheS1kaWFsb2cuY29tcG9uZW50JztcclxuXHJcbkBJbmplY3RhYmxlKHtcclxuICBwcm92aWRlZEluOiAncm9vdCdcclxufSlcclxuZXhwb3J0IGNsYXNzIEVycm9yRGlzcGxheVNlcnZpY2Uge1xyXG5cclxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGRpYWxvZzogTWF0RGlhbG9nKSB7IH1cclxuXHJcbiAgLyoqXHJcbiAgICogU2hvdyBhbiBlcnJvciBkaWFsb2cgb3JlIHJldHVybnMgdGhlIGN1cnJlbnQgb25lIGlmIGFscmVhZHkgb3BlbmVkXHJcbiAgICogQHBhcmFtIGVycm9yVGl0bGUgdGhlIHRpdGxlIG9mIHRoZSBkaWFsb2dcclxuICAgKiBAcGFyYW0gZXJyb3JDb250ZW50IHRoZSBjb250ZW50IG9mIHRoZSBkaWFsb2dcclxuICAgKi9cclxuICBzaG93RGlhbG9nKGVycm9yVGl0bGU6IHN0cmluZywgZXJyb3JDb250ZW50OiBzdHJpbmcpOiBNYXREaWFsb2dSZWY8RXJyb3JEaXNwbGF5RGlhbG9nQ29tcG9uZW50LCBhbnk+IHtcclxuICAgIGNvbnN0IGRpYWxvZ0FyciA9IHRoaXMuZGlhbG9nLm9wZW5EaWFsb2dzLmZpbHRlcigocmVmOiBNYXREaWFsb2dSZWY8YW55PikgPT4gcmVmLmlkID09PSAnZXJyb3JEaXNwbGF5RGlhbG9nJyk7XHJcbiAgICBpZiAoZGlhbG9nQXJyLmxlbmd0aCA+IDApIHtcclxuICAgICAgcmV0dXJuIGRpYWxvZ0FyclswXTtcclxuICAgIH1cclxuICAgIHJldHVybiB0aGlzLmRpYWxvZy5vcGVuKEVycm9yRGlzcGxheURpYWxvZ0NvbXBvbmVudCwge1xyXG4gICAgICBkYXRhOiB7XHJcbiAgICAgICAgZXJyb3JUaXRsZSxcclxuICAgICAgICBlcnJvckNvbnRlbnQsXHJcbiAgICAgIH0sXHJcbiAgICAgIGlkOiAnZXJyb3JEaXNwbGF5RGlhbG9nJyxcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgaXNBbHJlYWR5T3BlbmVkKCk6IGJvb2xlYW4ge1xyXG4gICAgcmV0dXJuIHRoaXMuZGlhbG9nLm9wZW5EaWFsb2dzLmZpbHRlcigocmVmOiBNYXREaWFsb2dSZWY8YW55PikgPT4gcmVmLmlkID09PSAnZXJyb3JEaXNwbGF5RGlhbG9nJykubGVuZ3RoID4gMDtcclxuICB9XHJcbn1cclxuIl19