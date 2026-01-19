import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { Component, Input, HostBinding } from '@angular/core';
import * as i0 from "@angular/core";
export class ListSorterOptionComponent {
    // tslint:disable-next-line:no-input-rename
    set LS(value) {
        this.listSortAttr = coerceBooleanProperty(value);
    }
    get viewValue() {
        return this.el.nativeElement.innerText;
    }
    constructor(el) {
        this.el = el;
        this.sortAsc = true;
        this.display = 'none';
        // const isor = el.nativeElement.attributes.getNamedItem('sii-list-init-sort');
        // this.isInitSort = isor != null && isor.value !== 'false';
    }
    ngAfterViewInit() {
        this.isInitSort = this.listSortAttr !== undefined && this.listSortAttr !== false;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: ListSorterOptionComponent, deps: [{ token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "18.2.13", type: ListSorterOptionComponent, isStandalone: true, selector: "sii-list-sorter-option", inputs: { value: "value", groupKey: "groupKey", groupValue: "groupValue", groupLabelTransform: "groupLabelTransform", parentGroupLabelTransform: "parentGroupLabelTransform", sortAsc: "sortAsc", groupAction: "groupAction", parentGroupAction: "parentGroupAction", LS: ["sii-list-init-sort", "LS"], parentGroupKey: "parentGroupKey", parentGroupValue: "parentGroupValue" }, host: { properties: { "style.display": "this.display" } }, ngImport: i0, template: '<ng-content></ng-content>', isInline: true }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: ListSorterOptionComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'sii-list-sorter-option',
                    template: '<ng-content></ng-content>',
                    standalone: true,
                }]
        }], ctorParameters: () => [{ type: i0.ElementRef }], propDecorators: { value: [{
                type: Input
            }], groupKey: [{
                type: Input
            }], groupValue: [{
                type: Input
            }], groupLabelTransform: [{
                type: Input
            }], parentGroupLabelTransform: [{
                type: Input
            }], sortAsc: [{
                type: Input
            }], groupAction: [{
                type: Input
            }], parentGroupAction: [{
                type: Input
            }], LS: [{
                type: Input,
                args: ['sii-list-init-sort']
            }], parentGroupKey: [{
                type: Input
            }], parentGroupValue: [{
                type: Input
            }], display: [{
                type: HostBinding,
                args: ['style.display']
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGlzdC1zb3J0ZXItb3B0aW9uLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL3NpaS10b29sa2l0L3NyYy9saWIvY29tcG9uZW50cy9saXN0LXNvcnRlci9saXN0LXNvcnRlci1vcHRpb24vbGlzdC1zb3J0ZXItb3B0aW9uLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQztBQUM5RCxPQUFPLEVBQUUsU0FBUyxFQUFVLEtBQUssRUFBYyxXQUFXLEVBQWlCLE1BQU0sZUFBZSxDQUFDOztBQWVqRyxNQUFNLE9BQU8seUJBQXlCO0lBV3BDLDJDQUEyQztJQUMzQyxJQUNJLEVBQUUsQ0FBQyxLQUFxQjtRQUMxQixJQUFJLENBQUMsWUFBWSxHQUFHLHFCQUFxQixDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ25ELENBQUM7SUFPRCxJQUFJLFNBQVM7UUFDWCxPQUFPLElBQUksQ0FBQyxFQUFFLENBQUMsYUFBYSxDQUFDLFNBQVMsQ0FBQztJQUN6QyxDQUFDO0lBQ0QsWUFBb0IsRUFBYztRQUFkLE9BQUUsR0FBRixFQUFFLENBQVk7UUFuQnpCLFlBQU8sR0FBRyxJQUFJLENBQUM7UUFhTSxZQUFPLEdBQUcsTUFBTSxDQUFDO1FBTzdDLCtFQUErRTtRQUMvRSw0REFBNEQ7SUFDOUQsQ0FBQztJQUNELGVBQWU7UUFDYixJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxZQUFZLEtBQUssU0FBUyxJQUFLLElBQUksQ0FBQyxZQUFZLEtBQUssS0FBSyxDQUFDO0lBQ3BGLENBQUM7K0dBL0JVLHlCQUF5QjttR0FBekIseUJBQXlCLCtmQUh4QiwyQkFBMkI7OzRGQUc1Qix5QkFBeUI7a0JBTHJDLFNBQVM7bUJBQUM7b0JBQ1AsUUFBUSxFQUFFLHdCQUF3QjtvQkFDbEMsUUFBUSxFQUFFLDJCQUEyQjtvQkFDckMsVUFBVSxFQUFFLElBQUk7aUJBQ25COytFQUVVLEtBQUs7c0JBQWIsS0FBSztnQkFDRyxRQUFRO3NCQUFoQixLQUFLO2dCQUNHLFVBQVU7c0JBQWxCLEtBQUs7Z0JBQ0csbUJBQW1CO3NCQUEzQixLQUFLO2dCQUNHLHlCQUF5QjtzQkFBakMsS0FBSztnQkFDRyxPQUFPO3NCQUFmLEtBQUs7Z0JBQ0csV0FBVztzQkFBbkIsS0FBSztnQkFDRyxpQkFBaUI7c0JBQXpCLEtBQUs7Z0JBS0YsRUFBRTtzQkFETCxLQUFLO3VCQUFDLG9CQUFvQjtnQkFLbEIsY0FBYztzQkFBdEIsS0FBSztnQkFDRyxnQkFBZ0I7c0JBQXhCLEtBQUs7Z0JBQ3dCLE9BQU87c0JBQXBDLFdBQVc7dUJBQUMsZUFBZSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSB9IGZyb20gJ0Bhbmd1bGFyL2Nkay9jb2VyY2lvbic7XHJcbmltcG9ydCB7IENvbXBvbmVudCwgT25Jbml0LCBJbnB1dCwgRWxlbWVudFJlZiwgSG9zdEJpbmRpbmcsIEFmdGVyVmlld0luaXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuXHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIFNvcnRlckdyb3VwQWN0aW9uIHtcclxuICBsYWJlbDogc3RyaW5nO1xyXG4gIGljb246IHN0cmluZztcclxuICBhY3Rpb246ICgga2V5OiBzdHJpbmcsIHZhbHVlOnN0cmluZywgaXRlbXM6YW55W10gKSA9PiB2b2lkO1xyXG4gIHZpc2libGU6ICgga2V5OiBzdHJpbmcsIHZhbHVlOnN0cmluZywgaXRlbXM6YW55W10gKSA9PiBib29sZWFuO1xyXG59XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICAgIHNlbGVjdG9yOiAnc2lpLWxpc3Qtc29ydGVyLW9wdGlvbicsXHJcbiAgICB0ZW1wbGF0ZTogJzxuZy1jb250ZW50PjwvbmctY29udGVudD4nLFxyXG4gICAgc3RhbmRhbG9uZTogdHJ1ZSxcclxufSlcclxuZXhwb3J0IGNsYXNzIExpc3RTb3J0ZXJPcHRpb25Db21wb25lbnQgaW1wbGVtZW50cyBBZnRlclZpZXdJbml0IHtcclxuICBASW5wdXQoKSB2YWx1ZTtcclxuICBASW5wdXQoKSBncm91cEtleTtcclxuICBASW5wdXQoKSBncm91cFZhbHVlO1xyXG4gIEBJbnB1dCgpIGdyb3VwTGFiZWxUcmFuc2Zvcm06IChpZDogYW55LCB2YWx1ZTogYW55LCBvYmo6IGFueSkgPT4gc3RyaW5nO1xyXG4gIEBJbnB1dCgpIHBhcmVudEdyb3VwTGFiZWxUcmFuc2Zvcm06IChyaWQ6IGFueSwgdmFsdWU6IGFueSwgb2JqOiBhbnkpID0+IHN0cmluZztcclxuICBASW5wdXQoKSBzb3J0QXNjID0gdHJ1ZTtcclxuICBASW5wdXQoKSBncm91cEFjdGlvbjogU29ydGVyR3JvdXBBY3Rpb25bXTtcclxuICBASW5wdXQoKSBwYXJlbnRHcm91cEFjdGlvbjogU29ydGVyR3JvdXBBY3Rpb25bXTtcclxuXHJcbiAgbGlzdFNvcnRBdHRyO1xyXG4gIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1pbnB1dC1yZW5hbWVcclxuICBASW5wdXQoJ3NpaS1saXN0LWluaXQtc29ydCcpXHJcbiAgc2V0IExTKHZhbHVlOiBib29sZWFufHN0cmluZykge1xyXG4gICAgdGhpcy5saXN0U29ydEF0dHIgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsdWUpO1xyXG4gIH1cclxuXHJcbiAgQElucHV0KCkgcGFyZW50R3JvdXBLZXk7XHJcbiAgQElucHV0KCkgcGFyZW50R3JvdXBWYWx1ZTtcclxuICBASG9zdEJpbmRpbmcoJ3N0eWxlLmRpc3BsYXknKSBkaXNwbGF5ID0gJ25vbmUnO1xyXG4gIGlzSW5pdFNvcnQ6IGJvb2xlYW47XHJcblxyXG4gIGdldCB2aWV3VmFsdWUoKXtcclxuICAgIHJldHVybiB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQuaW5uZXJUZXh0O1xyXG4gIH1cclxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGVsOiBFbGVtZW50UmVmKSB7XHJcbiAgICAvLyBjb25zdCBpc29yID0gZWwubmF0aXZlRWxlbWVudC5hdHRyaWJ1dGVzLmdldE5hbWVkSXRlbSgnc2lpLWxpc3QtaW5pdC1zb3J0Jyk7XHJcbiAgICAvLyB0aGlzLmlzSW5pdFNvcnQgPSBpc29yICE9IG51bGwgJiYgaXNvci52YWx1ZSAhPT0gJ2ZhbHNlJztcclxuICB9XHJcbiAgbmdBZnRlclZpZXdJbml0KCk6IHZvaWQge1xyXG4gICAgdGhpcy5pc0luaXRTb3J0ID0gdGhpcy5saXN0U29ydEF0dHIgIT09IHVuZGVmaW5lZCAmJiAgdGhpcy5saXN0U29ydEF0dHIgIT09IGZhbHNlO1xyXG4gIH1cclxuXHJcblxyXG59XHJcbiJdfQ==