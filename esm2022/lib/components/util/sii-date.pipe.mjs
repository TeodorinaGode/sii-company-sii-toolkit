import { Pipe } from '@angular/core';
// import * as moment_ from 'moment';
// const moment = moment_;
import moment from 'moment';
import * as i0 from "@angular/core";
import * as i1 from "../../sii-toolkit.service";
export class SiiDatePipe {
    constructor(siiToolkitService) {
        this.siiToolkitService = siiToolkitService;
    }
    transform(date, showTime = false) {
        let dateObj = null;
        if (date != null) {
            if (date instanceof Date) {
                dateObj = date;
            }
            else if (date instanceof Array && date.length === 3) { // LocalDate
                // 				new Date(year, monthIndex [, day [, hours [, minutes [, seconds [, milliseconds]]]]])
                dateObj = new Date(date[0], date[1] - 1, date[2]);
            }
            else if (date instanceof Array && (date.length >= 5 && date.length <= 7)) { // LocalDateTime
                // 				new Date(year, monthIndex [, day [, hours [, minutes [, seconds [, milliseconds]]]]])
                dateObj = new Date(date[0], date[1] - 1, date[2], date[3], date[4], (date[5] || 0));
            }
            else if (date instanceof String || typeof date === 'string') {
                const m = moment(date, this.siiToolkitService.loggedUser.value.inputDatePattern);
                dateObj = m.isValid() ? m.toDate() : null;
            }
            else if (date instanceof Number || typeof date === 'number') {
                dateObj = new Date(date);
            }
        }
        if (dateObj == null) {
            return null;
        }
        else {
            const m = moment(dateObj);
            return m.isValid() ? m.format(this.siiToolkitService.loggedUser.value.displayDatePattern + (!!showTime ? ' HH:mm' : '')) : null;
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: SiiDatePipe, deps: [{ token: i1.SiiToolkitService }], target: i0.ɵɵFactoryTarget.Pipe }); }
    static { this.ɵpipe = i0.ɵɵngDeclarePipe({ minVersion: "14.0.0", version: "18.2.13", ngImport: i0, type: SiiDatePipe, isStandalone: true, name: "siiDate" }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: SiiDatePipe, decorators: [{
            type: Pipe,
            args: [{
                    name: 'siiDate',
                    standalone: true
                }]
        }], ctorParameters: () => [{ type: i1.SiiToolkitService }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2lpLWRhdGUucGlwZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL3NpaS10b29sa2l0L3NyYy9saWIvY29tcG9uZW50cy91dGlsL3NpaS1kYXRlLnBpcGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLElBQUksRUFBaUIsTUFBTSxlQUFlLENBQUM7QUFFcEQscUNBQXFDO0FBQ3JDLDBCQUEwQjtBQUMxQixPQUFPLE1BQU0sTUFBTSxRQUFRLENBQUM7OztBQU81QixNQUFNLE9BQU8sV0FBVztJQUV0QixZQUFvQixpQkFBb0M7UUFBcEMsc0JBQWlCLEdBQWpCLGlCQUFpQixDQUFtQjtJQUFFLENBQUM7SUFFM0QsU0FBUyxDQUFDLElBQXlDLEVBQUUsUUFBUSxHQUFFLEtBQUs7UUFDcEUsSUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDO1FBR25CLElBQUksSUFBSSxJQUFJLElBQUksRUFBQyxDQUFDO1lBQ2hCLElBQUksSUFBSSxZQUFZLElBQUksRUFBQyxDQUFDO2dCQUN4QixPQUFPLEdBQUcsSUFBSSxDQUFDO1lBQ2pCLENBQUM7aUJBQ0ksSUFBSSxJQUFJLFlBQVksS0FBSyxJQUFJLElBQUksQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFHLENBQUMsQ0FBQSxZQUFZO2dCQUN2RSw0RkFBNEY7Z0JBQ3RGLE9BQU8sR0FBSSxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNyRCxDQUFDO2lCQUFLLElBQUksSUFBSSxZQUFZLEtBQUssSUFBSyxDQUFDLElBQUksQ0FBQyxNQUFNLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxNQUFNLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFBLGdCQUFnQjtnQkFDakcsNEZBQTRGO2dCQUN0RixPQUFPLEdBQUksSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN2RixDQUFDO2lCQUNJLElBQUksSUFBSSxZQUFZLE1BQU0sSUFBSSxPQUFPLElBQUksS0FBSyxRQUFRLEVBQUMsQ0FBQztnQkFDM0QsTUFBTSxDQUFDLEdBQUcsTUFBTSxDQUFFLElBQWUsRUFBRyxJQUFJLENBQUMsaUJBQWlCLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO2dCQUM5RixPQUFPLEdBQUksQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztZQUM3QyxDQUFDO2lCQUNJLElBQUksSUFBSSxZQUFZLE1BQU0sSUFBSSxPQUFPLElBQUksS0FBSyxRQUFRLEVBQUMsQ0FBQztnQkFDM0QsT0FBTyxHQUFLLElBQUksSUFBSSxDQUFDLElBQWMsQ0FBQyxDQUFFO1lBQ3hDLENBQUM7UUFDSCxDQUFDO1FBR0QsSUFBSSxPQUFPLElBQUksSUFBSSxFQUFDLENBQUM7WUFDbkIsT0FBTyxJQUFJLENBQUM7UUFDZCxDQUFDO2FBQUksQ0FBQztZQUNKLE1BQU0sQ0FBQyxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUMxQixPQUFPLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxrQkFBa0IsR0FBRyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO1FBQ2xJLENBQUM7SUFDRCxDQUFDOytHQW5DVSxXQUFXOzZHQUFYLFdBQVc7OzRGQUFYLFdBQVc7a0JBSnZCLElBQUk7bUJBQUM7b0JBQ0YsSUFBSSxFQUFFLFNBQVM7b0JBQ2YsVUFBVSxFQUFFLElBQUk7aUJBQ25CIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgUGlwZSwgUGlwZVRyYW5zZm9ybSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBTaWlUb29sa2l0U2VydmljZSB9IGZyb20gJy4uLy4uL3NpaS10b29sa2l0LnNlcnZpY2UnO1xyXG4vLyBpbXBvcnQgKiBhcyBtb21lbnRfIGZyb20gJ21vbWVudCc7XHJcbi8vIGNvbnN0IG1vbWVudCA9IG1vbWVudF87XHJcbmltcG9ydCBtb21lbnQgZnJvbSAnbW9tZW50JztcclxuXHJcblxyXG5AUGlwZSh7XHJcbiAgICBuYW1lOiAnc2lpRGF0ZScsXHJcbiAgICBzdGFuZGFsb25lOiB0cnVlXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBTaWlEYXRlUGlwZSBpbXBsZW1lbnRzIFBpcGVUcmFuc2Zvcm0ge1xyXG5cclxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHNpaVRvb2xraXRTZXJ2aWNlOiBTaWlUb29sa2l0U2VydmljZSl7fVxyXG5cclxuICB0cmFuc2Zvcm0oZGF0ZTogRGF0ZSB8IHN0cmluZyB8IEFycmF5PGFueT4gfCBudW1iZXIsIHNob3dUaW1lPSBmYWxzZSk6IHN0cmluZyB7XHJcbiAgbGV0IGRhdGVPYmogPSBudWxsO1xyXG5cclxuXHJcbiAgaWYgKGRhdGUgIT0gbnVsbCl7XHJcbiAgICBpZiAoZGF0ZSBpbnN0YW5jZW9mIERhdGUpe1xyXG4gICAgICBkYXRlT2JqID0gZGF0ZTtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKGRhdGUgaW5zdGFuY2VvZiBBcnJheSAmJiBkYXRlLmxlbmd0aCA9PT0gMyAgKXsvLyBMb2NhbERhdGVcclxuLy8gXHRcdFx0XHRuZXcgRGF0ZSh5ZWFyLCBtb250aEluZGV4IFssIGRheSBbLCBob3VycyBbLCBtaW51dGVzIFssIHNlY29uZHMgWywgbWlsbGlzZWNvbmRzXV1dXV0pXHJcbiAgICAgIGRhdGVPYmogPSAgbmV3IERhdGUoZGF0ZVswXSwgZGF0ZVsxXSAtIDEsIGRhdGVbMl0pO1xyXG4gICAgfWVsc2UgaWYgKGRhdGUgaW5zdGFuY2VvZiBBcnJheSAmJiAgKGRhdGUubGVuZ3RoID49IDUgJiYgZGF0ZS5sZW5ndGggPD0gNykgKXsvLyBMb2NhbERhdGVUaW1lXHJcbi8vIFx0XHRcdFx0bmV3IERhdGUoeWVhciwgbW9udGhJbmRleCBbLCBkYXkgWywgaG91cnMgWywgbWludXRlcyBbLCBzZWNvbmRzIFssIG1pbGxpc2Vjb25kc11dXV1dKVxyXG4gICAgICBkYXRlT2JqID0gIG5ldyBEYXRlKGRhdGVbMF0sIGRhdGVbMV0gLSAxLCBkYXRlWzJdLCBkYXRlWzNdLCBkYXRlWzRdLCAoZGF0ZVs1XSB8fCAwKSk7XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmIChkYXRlIGluc3RhbmNlb2YgU3RyaW5nIHx8IHR5cGVvZiBkYXRlID09PSAnc3RyaW5nJyl7XHJcbiAgICAgIGNvbnN0IG0gPSBtb21lbnQoKGRhdGUgYXMgc3RyaW5nKSAsIHRoaXMuc2lpVG9vbGtpdFNlcnZpY2UubG9nZ2VkVXNlci52YWx1ZS5pbnB1dERhdGVQYXR0ZXJuKTtcclxuICAgICAgZGF0ZU9iaiA9ICBtLmlzVmFsaWQoKSA/IG0udG9EYXRlKCkgOiBudWxsO1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAoZGF0ZSBpbnN0YW5jZW9mIE51bWJlciB8fCB0eXBlb2YgZGF0ZSA9PT0gJ251bWJlcicpe1xyXG4gICAgICBkYXRlT2JqID0gICBuZXcgRGF0ZShkYXRlIGFzIG51bWJlcikgO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcblxyXG4gIGlmIChkYXRlT2JqID09IG51bGwpe1xyXG4gICAgcmV0dXJuIG51bGw7XHJcbiAgfWVsc2V7XHJcbiAgICBjb25zdCBtID0gbW9tZW50KGRhdGVPYmopO1xyXG4gICAgcmV0dXJuIG0uaXNWYWxpZCgpID8gbS5mb3JtYXQodGhpcy5zaWlUb29sa2l0U2VydmljZS5sb2dnZWRVc2VyLnZhbHVlLmRpc3BsYXlEYXRlUGF0dGVybiArICghIXNob3dUaW1lID8gJyBISDptbScgOiAnJykpIDogbnVsbDtcclxuICB9XHJcbiAgfVxyXG5cclxufVxyXG5cclxuIl19