import { Inject, Injectable, Optional } from '@angular/core';
import { MAT_DATE_LOCALE, NativeDateAdapter } from '@angular/material/core';
// import * as moment_ from 'moment';
// const moment = moment_;
import moment from 'moment';
import * as i0 from "@angular/core";
import * as i1 from "../sii-toolkit.service";
export class SIIDateAdapter extends NativeDateAdapter {
    constructor(matDateLocale, siiToolkitService) {
        super(matDateLocale);
        this.siiToolkitService = siiToolkitService;
    }
    format(date, displayFormat) {
        return date == null ? null : moment(date).format(displayFormat);
    }
    parse(dateString) {
        if (dateString == null || dateString.length === 0) {
            return null;
        }
        const m = moment(dateString, this.siiToolkitService.loggedUser.value.inputDatePattern, true);
        return m.isValid() ? m.toDate() : new Date(NaN);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: SIIDateAdapter, deps: [{ token: MAT_DATE_LOCALE, optional: true }, { token: i1.SiiToolkitService }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: SIIDateAdapter }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: SIIDateAdapter, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [MAT_DATE_LOCALE]
                }] }, { type: i1.SiiToolkitService }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU2lpRGF0ZUFkYXB0ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9zaWktdG9vbGtpdC9zcmMvbGliL2NvbW1vbi9TaWlEYXRlQWRhcHRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQSxPQUFPLEVBQUUsTUFBTSxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDN0QsT0FBTyxFQUFFLGVBQWUsRUFBRSxpQkFBaUIsRUFBRSxNQUFNLHdCQUF3QixDQUFDO0FBRzVFLHFDQUFxQztBQUNyQywwQkFBMEI7QUFDMUIsT0FBTyxNQUFNLE1BQU0sUUFBUSxDQUFDOzs7QUFJNUIsTUFBTSxPQUFPLGNBQWUsU0FBUSxpQkFBaUI7SUFFakQsWUFBaUQsYUFBcUIsRUFDbEQsaUJBQW9DO1FBRXhELEtBQUssQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUZELHNCQUFpQixHQUFqQixpQkFBaUIsQ0FBbUI7SUFHMUQsQ0FBQztJQUdELE1BQU0sQ0FBQyxJQUFVLEVBQUUsYUFBcUI7UUFDdEMsT0FBTyxJQUFJLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLENBQUM7SUFDbkUsQ0FBQztJQUNELEtBQUssQ0FBQyxVQUFrQjtRQUN0QixJQUFJLFVBQVUsSUFBSSxJQUFJLElBQUksVUFBVSxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUMsQ0FBQztZQUNqRCxPQUFPLElBQUksQ0FBQztRQUNkLENBQUM7UUFDRCxNQUFNLENBQUMsR0FBRyxNQUFNLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLGdCQUFnQixFQUFFLElBQUksQ0FBQyxDQUFDO1FBQzdGLE9BQU8sQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ2xELENBQUM7K0dBbEJVLGNBQWMsa0JBRVMsZUFBZTttSEFGdEMsY0FBYzs7NEZBQWQsY0FBYztrQkFEMUIsVUFBVTs7MEJBR00sUUFBUTs7MEJBQUksTUFBTTsyQkFBQyxlQUFlIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgUGxhdGZvcm0gfSBmcm9tICdAYW5ndWxhci9jZGsvcGxhdGZvcm0nO1xyXG5pbXBvcnQgeyBJbmplY3QsIEluamVjdGFibGUsIE9wdGlvbmFsIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IE1BVF9EQVRFX0xPQ0FMRSwgTmF0aXZlRGF0ZUFkYXB0ZXIgfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9jb3JlJztcclxuaW1wb3J0IHsgU2lpVG9vbGtpdFNlcnZpY2UgfSBmcm9tICcuLi9zaWktdG9vbGtpdC5zZXJ2aWNlJztcclxuXHJcbi8vIGltcG9ydCAqIGFzIG1vbWVudF8gZnJvbSAnbW9tZW50JztcclxuLy8gY29uc3QgbW9tZW50ID0gbW9tZW50XztcclxuaW1wb3J0IG1vbWVudCBmcm9tICdtb21lbnQnO1xyXG5cclxuXHJcbkBJbmplY3RhYmxlKClcclxuZXhwb3J0IGNsYXNzIFNJSURhdGVBZGFwdGVyIGV4dGVuZHMgTmF0aXZlRGF0ZUFkYXB0ZXJ7XHJcblxyXG4gICAgY29uc3RydWN0b3IoQE9wdGlvbmFsKCkgQEluamVjdChNQVRfREFURV9MT0NBTEUpIG1hdERhdGVMb2NhbGU6IHN0cmluZywgXHJcbiAgICAgICAgICAgICAgICBwcml2YXRlIHNpaVRvb2xraXRTZXJ2aWNlOiBTaWlUb29sa2l0U2VydmljZSl7XHJcblxyXG4gICAgc3VwZXIobWF0RGF0ZUxvY2FsZSk7XHJcbiAgfVxyXG5cclxuXHJcbiAgZm9ybWF0KGRhdGU6IERhdGUsIGRpc3BsYXlGb3JtYXQ6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICByZXR1cm4gZGF0ZSA9PSBudWxsID8gbnVsbCA6ICBtb21lbnQoZGF0ZSkuZm9ybWF0KGRpc3BsYXlGb3JtYXQpO1xyXG4gIH1cclxuICBwYXJzZShkYXRlU3RyaW5nOiBzdHJpbmcpOiBEYXRlIHwgbnVsbCAge1xyXG4gICAgaWYgKGRhdGVTdHJpbmcgPT0gbnVsbCB8fCBkYXRlU3RyaW5nLmxlbmd0aCA9PT0gMCl7XHJcbiAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG4gICAgY29uc3QgbSA9IG1vbWVudChkYXRlU3RyaW5nLCB0aGlzLnNpaVRvb2xraXRTZXJ2aWNlLmxvZ2dlZFVzZXIudmFsdWUuaW5wdXREYXRlUGF0dGVybiwgdHJ1ZSk7XHJcbiAgICByZXR1cm4gbS5pc1ZhbGlkKCkgPyBtLnRvRGF0ZSgpIDogbmV3IERhdGUoTmFOKTtcclxuICB9XHJcblxyXG5cclxufVxyXG4iXX0=