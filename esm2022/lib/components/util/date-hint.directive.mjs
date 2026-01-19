import { ContentChild, Directive } from '@angular/core';
import { MatInput } from '@angular/material/input';
import { MatEndDate, MatStartDate } from '@angular/material/datepicker';
import { debounceTime, distinctUntilChanged, startWith } from 'rxjs/operators';
import { SiiDatePipe } from './sii-date.pipe';
import * as i0 from "@angular/core";
import * as i1 from "./sii-date.pipe";
import * as i2 from "../../sii-toolkit.service";
export class DateHintDirective {
    constructor(el, siiDatePipe, siiToolkitService) {
        this.el = el;
        this.siiDatePipe = siiDatePipe;
        this.siiToolkitService = siiToolkitService;
    }
    ngAfterContentInit() {
        if (this.matInput != null) {
            this.dateHint = document.createElement('span');
            this.initialize(this.matInput.ngControl, this.dateHint);
            this.matInput.stateChanges.pipe(debounceTime(100)).subscribe((res) => {
                if (this.el.nativeElement.getElementsByClassName("mat-mdc-form-field-error-wrapper").length > 0) {
                    this.dateHint.style.display = 'none';
                }
                else {
                    this.dateHint.style.display = '';
                }
            });
        }
        if (this.endDate != null && this.startDate != null) {
            this.endDateHint = document.createElement('span');
            this.startDateHint = document.createElement('span');
            this.initialize(this.endDate.ngControl, this.endDateHint);
            this.initialize(this.startDate.ngControl, this.startDateHint, true);
            this.startDate.stateChanges.pipe(debounceTime(100)).subscribe((res) => {
                this.checkForError();
            });
            this.endDate.stateChanges.pipe(debounceTime(100)).subscribe((res) => {
                this.checkForError();
            });
        }
    }
    checkForError() {
        if (this.el.nativeElement.getElementsByClassName("mat-mdc-form-field-error-wrapper").length > 0) {
            this.startDateHint.style.display = 'none';
            this.endDateHint.style.display = 'none';
        }
        else {
            this.startDateHint.style.display = '';
            this.endDateHint.style.display = '';
        }
    }
    initialize(control, hintSpan, addSeparator = false) {
        hintSpan.classList.add('mat-hint');
        this.el.nativeElement.getElementsByClassName('mat-mdc-form-field-bottom-align')[0].
            insertAdjacentElement('afterbegin', hintSpan);
        control.valueChanges
            .pipe(startWith(control.value), distinctUntilChanged())
            .subscribe((val) => {
            if (val instanceof Array) {
                Promise.resolve().then(() => {
                    control.control.setValue(new Date(val[0], val[1] - 1, val[2]), { emitEvent: false });
                });
            }
            if (val != null) {
                if (this.siiToolkitService.loggedUser.value.inputDatePattern.toLowerCase() === this.siiToolkitService.loggedUser.value.displayDatePattern.toLowerCase()) {
                    hintSpan.innerHTML = '';
                }
                else {
                    hintSpan.innerHTML = this.siiDatePipe.transform(val) + (addSeparator ? " - " : "");
                }
            }
            else {
                hintSpan.innerHTML = this.siiToolkitService.loggedUser.value.inputDatePattern.toLowerCase() + (addSeparator ? " - " : "");
            }
        });
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: DateHintDirective, deps: [{ token: i0.ElementRef }, { token: i1.SiiDatePipe }, { token: i2.SiiToolkitService }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "18.2.13", type: DateHintDirective, isStandalone: true, selector: "[siiDateHint]", providers: [SiiDatePipe], queries: [{ propertyName: "matInput", first: true, predicate: MatInput, descendants: true }, { propertyName: "startDate", first: true, predicate: MatStartDate, descendants: true }, { propertyName: "endDate", first: true, predicate: MatEndDate, descendants: true }], ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: DateHintDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[siiDateHint]',
                    providers: [SiiDatePipe],
                    standalone: true
                }]
        }], ctorParameters: () => [{ type: i0.ElementRef }, { type: i1.SiiDatePipe }, { type: i2.SiiToolkitService }], propDecorators: { matInput: [{
                type: ContentChild,
                args: [MatInput]
            }], startDate: [{
                type: ContentChild,
                args: [MatStartDate]
            }], endDate: [{
                type: ContentChild,
                args: [MatEndDate]
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZS1oaW50LmRpcmVjdGl2ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL3NpaS10b29sa2l0L3NyYy9saWIvY29tcG9uZW50cy91dGlsL2RhdGUtaGludC5kaXJlY3RpdmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFtQyxZQUFZLEVBQW1CLFNBQVMsRUFBMEQsTUFBTSxlQUFlLENBQUM7QUFDbEssT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLHlCQUF5QixDQUFDO0FBQ25ELE9BQU8sRUFBc0IsVUFBVSxFQUFHLFlBQVksRUFBRSxNQUFNLDhCQUE4QixDQUFDO0FBQzdGLE9BQU8sRUFBRSxZQUFZLEVBQUUsb0JBQW9CLEVBQUUsU0FBUyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFFL0UsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLGlCQUFpQixDQUFDOzs7O0FBUzlDLE1BQU0sT0FBTyxpQkFBaUI7SUFXNUIsWUFBb0IsRUFBYyxFQUFVLFdBQXdCLEVBQVUsaUJBQW9DO1FBQTlGLE9BQUUsR0FBRixFQUFFLENBQVk7UUFBVSxnQkFBVyxHQUFYLFdBQVcsQ0FBYTtRQUFVLHNCQUFpQixHQUFqQixpQkFBaUIsQ0FBbUI7SUFFakgsQ0FBQztJQUVGLGtCQUFrQjtRQUdoQixJQUFHLElBQUksQ0FBQyxRQUFRLElBQUUsSUFBSSxFQUFDLENBQUM7WUFDdEIsSUFBSSxDQUFDLFFBQVEsR0FBRSxRQUFRLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQzlDLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLEVBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQ3pELElBQUksQ0FBQyxRQUFRLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxHQUFHLEVB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QkFBaUI7a0JBTDdCLFNBQVM7bUJBQUM7b0JBQ1AsUUFBUSxFQUFFLGVBQWU7b0JBQ3pCLFNBQVMsRUFBRSxDQUFDLFdBQVcsQ0FBQztvQkFDeEIsVUFBVSxFQUFFLElBQUk7aUJBQ25CO3lJQUV5QixRQUFRO3NCQUEvQixZQUFZO3VCQUFDLFFBQVE7Z0JBQ00sU0FBUztzQkFBcEMsWUFBWTt1QkFBQyxZQUFZO2dCQUNBLE9BQU87c0JBQWhDLFlBQVk7dUJBQUMsVUFBVSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFmdGVyQ29udGVudEluaXQsIEFmdGVyVmlld0luaXQsIENvbnRlbnRDaGlsZCwgQ29udGVudENoaWxkcmVuLCBEaXJlY3RpdmUsIEVsZW1lbnRSZWYsIE9uSW5pdCwgUXVlcnlMaXN0LCBWaWV3Q2hpbGQsIEhvc3RMaXN0ZW5lciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBNYXRJbnB1dCB9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2lucHV0JztcclxuaW1wb3J0IHsgTWF0RGF0ZVJhbmdlUGlja2VyLCBNYXRFbmREYXRlICwgTWF0U3RhcnREYXRlIH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvZGF0ZXBpY2tlcic7XHJcbmltcG9ydCB7IGRlYm91bmNlVGltZSwgZGlzdGluY3RVbnRpbENoYW5nZWQsIHN0YXJ0V2l0aCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcclxuaW1wb3J0IHsgU2lpVG9vbGtpdFNlcnZpY2UgfSBmcm9tICcuLi8uLi9zaWktdG9vbGtpdC5zZXJ2aWNlJztcclxuaW1wb3J0IHsgU2lpRGF0ZVBpcGUgfSBmcm9tICcuL3NpaS1kYXRlLnBpcGUnO1xyXG5pbXBvcnQgeyBGb3JtQ29udHJvbE5hbWUsIE5nQ29udHJvbCB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcclxuaW1wb3J0IHsgZm9ya0pvaW4gfSBmcm9tICdyeGpzJztcclxuXHJcbkBEaXJlY3RpdmUoe1xyXG4gICAgc2VsZWN0b3I6ICdbc2lpRGF0ZUhpbnRdJyxcclxuICAgIHByb3ZpZGVyczogW1NpaURhdGVQaXBlXSxcclxuICAgIHN0YW5kYWxvbmU6IHRydWVcclxufSlcclxuZXhwb3J0IGNsYXNzIERhdGVIaW50RGlyZWN0aXZlIGltcGxlbWVudHMgQWZ0ZXJDb250ZW50SW5pdHtcclxuICBAQ29udGVudENoaWxkKE1hdElucHV0KSBtYXRJbnB1dDogTWF0SW5wdXQ7XHJcbiAgQENvbnRlbnRDaGlsZChNYXRTdGFydERhdGUpIHN0YXJ0RGF0ZTogTWF0U3RhcnREYXRlPERhdGU+O1xyXG4gIEBDb250ZW50Q2hpbGQoTWF0RW5kRGF0ZSkgZW5kRGF0ZTogTWF0RW5kRGF0ZTxEYXRlPjtcclxuICBcclxuXHJcblxyXG4gIGRhdGVIaW50OiBIVE1MU3BhbkVsZW1lbnQ7XHJcbiAgc3RhcnREYXRlSGludDogSFRNTFNwYW5FbGVtZW50O1xyXG4gIGVuZERhdGVIaW50OiBIVE1MU3BhbkVsZW1lbnQ7XHJcblxyXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgZWw6IEVsZW1lbnRSZWYsIHByaXZhdGUgc2lpRGF0ZVBpcGU6IFNpaURhdGVQaXBlLCBwcml2YXRlIHNpaVRvb2xraXRTZXJ2aWNlOiBTaWlUb29sa2l0U2VydmljZSkge1xyXG5cclxuICAgfVxyXG5cclxuICBuZ0FmdGVyQ29udGVudEluaXQoKTogdm9pZCB7XHJcblxyXG5cclxuICAgIGlmKHRoaXMubWF0SW5wdXQhPW51bGwpe1xyXG4gICAgICB0aGlzLmRhdGVIaW50PSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XHJcbiAgICAgIHRoaXMuaW5pdGlhbGl6ZSh0aGlzLm1hdElucHV0Lm5nQ29udHJvbCAsIHRoaXMuZGF0ZUhpbnQpO1xyXG4gICAgICB0aGlzLm1hdElucHV0LnN0YXRlQ2hhbmdlcy5waXBlKGRlYm91bmNlVGltZSgxMDApKS5zdWJzY3JpYmUoKHJlcyk9PntcclxuICAgICAgICBpZih0aGlzLmVsLm5hdGl2ZUVsZW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcIm1hdC1tZGMtZm9ybS1maWVsZC1lcnJvci13cmFwcGVyXCIpLmxlbmd0aD4wKXtcclxuICAgICAgICAgIHRoaXMuZGF0ZUhpbnQuc3R5bGUuZGlzcGxheT0nbm9uZSdcclxuICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgIHRoaXMuZGF0ZUhpbnQuc3R5bGUuZGlzcGxheT0nJ1xyXG4gICAgICAgIH1cclxuICAgICAgfSlcclxuXHJcbiAgICAgIFxyXG4gICAgfVxyXG5cclxuICAgIGlmKHRoaXMuZW5kRGF0ZSE9bnVsbCAmJiB0aGlzLnN0YXJ0RGF0ZSE9bnVsbCl7XHJcbiAgICAgIHRoaXMuZW5kRGF0ZUhpbnQ9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcclxuICAgICAgdGhpcy5zdGFydERhdGVIaW50PSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XHJcbiAgICAgIHRoaXMuaW5pdGlhbGl6ZSh0aGlzLmVuZERhdGUubmdDb250cm9sICwgdGhpcy5lbmREYXRlSGludClcclxuICAgICAgdGhpcy5pbml0aWFsaXplKHRoaXMuc3RhcnREYXRlLm5nQ29udHJvbCAsIHRoaXMuc3RhcnREYXRlSGludCAsIHRydWUpXHJcblxyXG5cclxuICAgICAgdGhpcy5zdGFydERhdGUuc3RhdGVDaGFuZ2VzLnBpcGUoZGVib3VuY2VUaW1lKDEwMCkpLnN1YnNjcmliZSgocmVzKT0+e1xyXG4gICAgICAgIHRoaXMuY2hlY2tGb3JFcnJvcigpO1xyXG4gICAgICB9KTtcclxuICAgICAgdGhpcy5lbmREYXRlLnN0YXRlQ2hhbmdlcy5waXBlKGRlYm91bmNlVGltZSgxMDApKS5zdWJzY3JpYmUoKHJlcyk9PntcclxuICAgICAgICB0aGlzLmNoZWNrRm9yRXJyb3IoKTtcclxuICAgICAgfSlcclxuXHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgIFxyXG5cclxuXHJcblxyXG4gICBcclxuICB9XHJcblxyXG4gIGNoZWNrRm9yRXJyb3IoKXtcclxuICAgIGlmKHRoaXMuZWwubmF0aXZlRWxlbWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwibWF0LW1kYy1mb3JtLWZpZWxkLWVycm9yLXdyYXBwZXJcIikubGVuZ3RoPjApe1xyXG4gICAgICB0aGlzLnN0YXJ0RGF0ZUhpbnQuc3R5bGUuZGlzcGxheT0nbm9uZSdcclxuICAgICAgdGhpcy5lbmREYXRlSGludC5zdHlsZS5kaXNwbGF5PSdub25lJ1xyXG4gICAgfWVsc2V7XHJcbiAgICAgIHRoaXMuc3RhcnREYXRlSGludC5zdHlsZS5kaXNwbGF5PScnXHJcbiAgICAgIHRoaXMuZW5kRGF0ZUhpbnQuc3R5bGUuZGlzcGxheT0nJ1xyXG4gICAgfVxyXG4gIH1cclxuXHJcblxyXG4gIGluaXRpYWxpemUoY29udHJvbDpOZ0NvbnRyb2wsIGhpbnRTcGFuOkhUTUxTcGFuRWxlbWVudCAsIGFkZFNlcGFyYXRvcj1mYWxzZSl7XHJcbiAgICBoaW50U3Bhbi5jbGFzc0xpc3QuYWRkKCdtYXQtaGludCcpO1xyXG4gICAgdGhpcy5lbC5uYXRpdmVFbGVtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ21hdC1tZGMtZm9ybS1maWVsZC1ib3R0b20tYWxpZ24nKVswXS5cclxuICAgIGluc2VydEFkamFjZW50RWxlbWVudCgnYWZ0ZXJiZWdpbicsIGhpbnRTcGFuKTtcclxuIFxyXG4gICAgY29udHJvbC52YWx1ZUNoYW5nZXNcclxuICAgIC5waXBlKFxyXG4gICAgICBzdGFydFdpdGgoY29udHJvbC52YWx1ZSksXHJcbiAgICAgIGRpc3RpbmN0VW50aWxDaGFuZ2VkKClcclxuICAgICAgKVxyXG4gICAgICAuc3Vic2NyaWJlKCh2YWwpID0+IHtcclxuICAgICBpZiAodmFsIGluc3RhbmNlb2YgQXJyYXkpe1xyXG4gICAgICAgUHJvbWlzZS5yZXNvbHZlKCkudGhlbigoKSA9PiB7XHJcbiAgICAgICAgY29udHJvbC5jb250cm9sLnNldFZhbHVlKG5ldyBEYXRlKHZhbFswXSwgdmFsWzFdIC0gMSwgdmFsWzJdKSwge2VtaXRFdmVudDogZmFsc2V9KTtcclxuICAgICAgIH0pO1xyXG4gICAgIH1cclxuICAgICBcclxuIFxyXG4gICAgIGlmICh2YWwgIT0gbnVsbCl7XHJcbiAgICAgICBpZiAodGhpcy5zaWlUb29sa2l0U2VydmljZS5sb2dnZWRVc2VyLnZhbHVlLmlucHV0RGF0ZVBhdHRlcm4udG9Mb3dlckNhc2UoKSA9PT0gdGhpcy5zaWlUb29sa2l0U2VydmljZS5sb2dnZWRVc2VyLnZhbHVlLmRpc3BsYXlEYXRlUGF0dGVybi50b0xvd2VyQ2FzZSgpKXtcclxuICAgICAgICBoaW50U3Bhbi5pbm5lckhUTUwgPSAnJztcclxuICAgICAgIH1lbHNle1xyXG4gICAgICAgIGhpbnRTcGFuLmlubmVySFRNTCA9IHRoaXMuc2lpRGF0ZVBpcGUudHJhbnNmb3JtKHZhbCkgKyAoYWRkU2VwYXJhdG9yP1wiIC0gXCI6XCJcIik7XHJcbiAgICAgICB9XHJcbiAgICAgfWVsc2V7XHJcbiAgICAgIGhpbnRTcGFuLmlubmVySFRNTCA9IHRoaXMuc2lpVG9vbGtpdFNlcnZpY2UubG9nZ2VkVXNlci52YWx1ZS5pbnB1dERhdGVQYXR0ZXJuLnRvTG93ZXJDYXNlKCkrIChhZGRTZXBhcmF0b3I/XCIgLSBcIjpcIlwiKTtcclxuIFxyXG4gICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbn1cclxuIl19