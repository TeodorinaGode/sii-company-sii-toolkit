import { Pipe } from '@angular/core';
import * as i0 from "@angular/core";
export class GlobalMenuVoicesFilterPipe {
    transform(menuVoices, company, textFilter) {
        if (!menuVoices || (!textFilter && (!company || company.length === 0))) {
            return menuVoices;
        }
        return menuVoices.filter(mv => (!mv.companyDep
            || company == null || company.length === 0
            || (!!mv.companies && mv.companies.find(cmp => cmp === company) != null)))
            .filter(mv => mv.title.toLowerCase().indexOf(textFilter.toLowerCase()) !== -1);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: GlobalMenuVoicesFilterPipe, deps: [], target: i0.ɵɵFactoryTarget.Pipe }); }
    static { this.ɵpipe = i0.ɵɵngDeclarePipe({ minVersion: "14.0.0", version: "18.2.13", ngImport: i0, type: GlobalMenuVoicesFilterPipe, isStandalone: true, name: "globalMenuVoicesFilter" }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: GlobalMenuVoicesFilterPipe, decorators: [{
            type: Pipe,
            args: [{
                    name: 'globalMenuVoicesFilter',
                    standalone: true
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2xvYmFsLW1lbnUtdm9pY2VzLWZpbHRlci5waXBlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvc2lpLXRvb2xraXQvc3JjL2xpYi9jb21wb25lbnRzL21lbnUvZ2xvYmFsLW1lbnUvdXRpbHMvZ2xvYmFsLW1lbnUtdm9pY2VzLWZpbHRlci5waXBlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxJQUFJLEVBQWlCLE1BQU0sZUFBZSxDQUFDOztBQVFwRCxNQUFNLE9BQU8sMEJBQTBCO0lBRXJDLFNBQVMsQ0FBQyxVQUEwQixFQUFFLE9BQWMsRUFBRSxVQUFpQjtRQUNyRSxJQUFJLENBQUMsVUFBVSxJQUFJLENBQUMsQ0FBQyxVQUFVLElBQUksQ0FBQyxDQUFDLE9BQU8sSUFBSSxPQUFPLENBQUMsTUFBTSxLQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztZQUNyRSxPQUFPLFVBQVUsQ0FBQztRQUNwQixDQUFDO1FBQ0QsT0FBTyxVQUFVLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQSxFQUFFLENBQUEsQ0FDSCxDQUFDLEVBQUUsQ0FBQyxVQUFVO2VBQ1gsT0FBTyxJQUFFLElBQUksSUFBSSxPQUFPLENBQUMsTUFBTSxLQUFHLENBQUM7ZUFDbkMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLFNBQVMsSUFBSSxFQUFFLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUEsRUFBRSxDQUFDLEdBQUcsS0FBRyxPQUFPLENBQUMsSUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDO2FBQzFFLE1BQU0sQ0FBQyxFQUFFLENBQUEsRUFBRSxDQUFBLEVBQUUsQ0FBQyxLQUFLLENBQUMsV0FBVyxFQUFFLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxLQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDakcsQ0FBQzsrR0FYVSwwQkFBMEI7NkdBQTFCLDBCQUEwQjs7NEZBQTFCLDBCQUEwQjtrQkFKdEMsSUFBSTttQkFBQztvQkFDRixJQUFJLEVBQUUsd0JBQXdCO29CQUM5QixVQUFVLEVBQUUsSUFBSTtpQkFDbkIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBQaXBlLCBQaXBlVHJhbnNmb3JtIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IFNpaU1lbnVGb2xkZXIgfSBmcm9tICcuLi9kdG8vbWVudS1mb2xkZXInO1xyXG5pbXBvcnQgeyBTaWlNZW51Vm9pY2UgfSBmcm9tICcuLi9kdG8vbWVudS12b2ljZSc7XHJcblxyXG5AUGlwZSh7XHJcbiAgICBuYW1lOiAnZ2xvYmFsTWVudVZvaWNlc0ZpbHRlcicsXHJcbiAgICBzdGFuZGFsb25lOiB0cnVlXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBHbG9iYWxNZW51Vm9pY2VzRmlsdGVyUGlwZSBpbXBsZW1lbnRzIFBpcGVUcmFuc2Zvcm0ge1xyXG5cclxuICB0cmFuc2Zvcm0obWVudVZvaWNlczogU2lpTWVudVZvaWNlW10sIGNvbXBhbnk6c3RyaW5nLCB0ZXh0RmlsdGVyOnN0cmluZykge1xyXG4gICAgaWYgKCFtZW51Vm9pY2VzIHx8ICghdGV4dEZpbHRlciAmJiAoIWNvbXBhbnkgfHwgY29tcGFueS5sZW5ndGg9PT0wKSkpIHtcclxuICAgICAgcmV0dXJuIG1lbnVWb2ljZXM7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gbWVudVZvaWNlcy5maWx0ZXIobXY9PihcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIW12LmNvbXBhbnlEZXBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfHwgY29tcGFueT09bnVsbCB8fCBjb21wYW55Lmxlbmd0aD09PTBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfHwgKCEhbXYuY29tcGFuaWVzICYmIG12LmNvbXBhbmllcy5maW5kKGNtcD0+IGNtcD09PWNvbXBhbnkpIT1udWxsKSkpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5maWx0ZXIobXY9Pm12LnRpdGxlLnRvTG93ZXJDYXNlKCkuaW5kZXhPZih0ZXh0RmlsdGVyLnRvTG93ZXJDYXNlKCkpIT09LTEpO1xyXG4gIH1cclxuXHJcbn1cclxuIl19