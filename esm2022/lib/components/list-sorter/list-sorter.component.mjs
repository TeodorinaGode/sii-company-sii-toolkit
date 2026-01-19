import { Component, ContentChildren, Optional, Input } from '@angular/core';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { ListSorterOptionComponent } from './list-sorter-option/list-sorter-option.component';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import * as i0 from "@angular/core";
import * as i1 from "../../service/sii-list-controller.service";
import * as i2 from "@angular/forms";
export class ListSorterComponent {
    get selectedValue() {
        return this.siiListService._sortField.sort;
    }
    set selectedValue(sv) {
        this.siiListService._sortField.sort = sv;
    }
    get sortAsc() {
        return this.siiListService._sortField.sortAscending;
    }
    set sortAsc(val) {
        this.siiListService._sortField.sortAscending = val;
    }
    get selectedGroup() {
        return this.siiListService._groupField;
    }
    set selectedGroup(sv) {
        this.siiListService._groupField = sv;
    }
    constructor(siiListService) {
        this.siiListService = siiListService;
        this.showLabel = false;
        this.toggleOrderAsc = () => {
            this.sortAsc = !this.sortAsc;
            this.siiListService.sortChange.next();
        };
    }
    ngAfterViewInit() {
        Promise.resolve().then(() => {
            this.options = this.listSorterOptions.map(x => {
                return {
                    value: x.value,
                    viewValue: x.viewValue,
                    groupKey: x.groupKey,
                    groupValue: x.groupValue,
                    groupLabelTransform: x.groupLabelTransform,
                    parentGroupKey: x.parentGroupKey,
                    parentGroupValue: x.parentGroupValue,
                    parentGroupLabelTransform: x.parentGroupLabelTransform,
                    groupAction: x.groupAction,
                    parentGroupAction: x.parentGroupAction
                };
            });
            let compareFunct = (x) => x.isInitSort;
            if (!!this.siiListService._sortField.sort) {
                compareFunct = (x) => x.value === this.siiListService._sortField.sort;
            }
            const initSort = this.listSorterOptions.find(compareFunct);
            let sortToInt = null;
            if (initSort != null) {
                if (!!this.siiListService._sortField.sort) {
                    initSort.sortAsc = this.siiListService._sortField.sortAscending;
                }
                sortToInt = initSort;
            }
            else if (this.options != null && this.options[0] !== undefined) {
                sortToInt = this.options[0];
            }
            if (this.selectedValue == null) {
                this.selectedValue = sortToInt.value;
                this.selectedGroup = {
                    groupKey: sortToInt.groupKey,
                    groupValue: sortToInt.groupValue,
                    groupLabelTransform: sortToInt.groupLabelTransform,
                    parentGroupKey: sortToInt.parentGroupKey,
                    parentGroupValue: sortToInt.parentGroupValue,
                    parentGroupLabelTransform: sortToInt.parentGroupLabelTransform,
                    groupAction: sortToInt.groupAction,
                    parentGroupAction: sortToInt.parentGroupAction
                };
                // this.siiListService.sortChange.next();
            }
            else if (this.selectedValue !== sortToInt.value || sortToInt.groupLabelTransform != null || sortToInt.parentGroupLabelTransform != null) {
                this.selectedValue = sortToInt.value;
                this.selectedGroup = {
                    groupKey: sortToInt.groupKey,
                    groupValue: sortToInt.groupValue,
                    groupLabelTransform: sortToInt.groupLabelTransform,
                    parentGroupKey: sortToInt.parentGroupKey,
                    parentGroupValue: sortToInt.parentGroupValue,
                    parentGroupLabelTransform: sortToInt.parentGroupLabelTransform,
                    groupAction: sortToInt.groupAction,
                    parentGroupAction: sortToInt.parentGroupAction
                };
            }
            if (initSort.sortAsc !== this.sortAsc) {
                this.sortAsc = !this.sortAsc;
            }
        });
    }
    selectionChange(selev) {
        const selVal = this.options.find(v => v.value === selev.value);
        this.selectedGroup = {
            groupKey: selVal.groupKey,
            groupValue: selVal.groupValue,
            groupLabelTransform: selVal.groupLabelTransform,
            parentGroupKey: selVal.parentGroupKey,
            parentGroupValue: selVal.parentGroupValue,
            parentGroupLabelTransform: selVal.parentGroupLabelTransform,
            groupAction: selVal.groupAction,
            parentGroupAction: selVal.parentGroupAction
        };
        this.siiListService.sortChange.next();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: ListSorterComponent, deps: [{ token: i1.SiiListController, optional: true }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "18.2.13", type: ListSorterComponent, isStandalone: true, selector: "sii-list-sorter", inputs: { showLabel: "showLabel" }, queries: [{ propertyName: "listSorterOptions", predicate: ListSorterOptionComponent }], ngImport: i0, template: "<mat-form-field  appearance=\"outline\" class=\"siiFacetSorterFormField\">\r\n  @if (showLabel) {\r\n    <mat-label  i18n=\"@@listSorterOrderBy\">Order By</mat-label>\r\n  }\r\n  <mat-select  [(ngModel)]=\"selectedValue\" (selectionChange)=selectionChange($event)>\r\n    @for (option of options; track option) {\r\n      <mat-option [value]=\"option.value\">\r\n        {{ option.viewValue }}\r\n      </mat-option>\r\n    }\r\n  </mat-select>\r\n</mat-form-field>\r\n<button mat-icon-button class=\"sorterButton\" (click)=\"toggleOrderAsc()\">\r\n  <mat-icon [svgIcon]=\"sortAsc?'sii-sort-asc':'sii-sort-desc'\" ></mat-icon>\r\n</button>\r\n\r\n<!-- required for invisible transclusion -->\r\n<ng-content></ng-content>\r\n", styles: [":host{display:flex}.siiFacetSorterFormField{width:calc(100% - 40px)}.siiFacetSorterFormField::ng-deep .mat-mdc-form-field-subscript-wrapper{height:0}.siiFacetSorterFormField::ng-deep .mat-mdc-text-field-wrapper{background-color:#2a2b38}.siiFacetSorterFormField::ng-deep .mat-mdc-select-value,.siiFacetSorterFormField::ng-deep .mat-mdc-select-arrow{color:#ffffffde!important}.siiFacetSorterFormField::ng-deep .mat-mdc-form-field-infix{padding-top:8px;padding-bottom:8px;min-height:30px}.siiFacetSorterFormField::ng-deep .mdc-notched-outline>*{border-color:#ffffffde!important}.sorterButton{width:40px;height:40px;padding:7px}\n"], dependencies: [{ kind: "component", type: MatFormField, selector: "mat-form-field", inputs: ["hideRequiredMarker", "color", "floatLabel", "appearance", "subscriptSizing", "hintLabel"], exportAs: ["matFormField"] }, { kind: "directive", type: MatLabel, selector: "mat-label" }, { kind: "component", type: MatSelect, selector: "mat-select", inputs: ["aria-describedby", "panelClass", "disabled", "disableRipple", "tabIndex", "hideSingleSelectionIndicator", "placeholder", "required", "multiple", "disableOptionCentering", "compareWith", "value", "aria-label", "aria-labelledby", "errorStateMatcher", "typeaheadDebounceInterval", "sortComparator", "id", "panelWidth"], outputs: ["openedChange", "opened", "closed", "selectionChange", "valueChange"], exportAs: ["matSelect"] }, { kind: "ngmodule", type: FormsModule }, { kind: "directive", type: i2.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i2.NgModel, selector: "[ngModel]:not([formControlName]):not([formControl])", inputs: ["name", "disabled", "ngModel", "ngModelOptions"], outputs: ["ngModelChange"], exportAs: ["ngModel"] }, { kind: "component", type: MatOption, selector: "mat-option", inputs: ["value", "id", "disabled"], outputs: ["onSelectionChange"], exportAs: ["matOption"] }, { kind: "component", type: MatIconButton, selector: "button[mat-icon-button]", exportAs: ["matButton"] }, { kind: "component", type: MatIcon, selector: "mat-icon", inputs: ["color", "inline", "svgIcon", "fontSet", "fontIcon"], exportAs: ["matIcon"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: ListSorterComponent, decorators: [{
            type: Component,
            args: [{ selector: 'sii-list-sorter', standalone: true, imports: [MatFormField, MatLabel, MatSelect, FormsModule, MatOption, MatIconButton, MatIcon], template: "<mat-form-field  appearance=\"outline\" class=\"siiFacetSorterFormField\">\r\n  @if (showLabel) {\r\n    <mat-label  i18n=\"@@listSorterOrderBy\">Order By</mat-label>\r\n  }\r\n  <mat-select  [(ngModel)]=\"selectedValue\" (selectionChange)=selectionChange($event)>\r\n    @for (option of options; track option) {\r\n      <mat-option [value]=\"option.value\">\r\n        {{ option.viewValue }}\r\n      </mat-option>\r\n    }\r\n  </mat-select>\r\n</mat-form-field>\r\n<button mat-icon-button class=\"sorterButton\" (click)=\"toggleOrderAsc()\">\r\n  <mat-icon [svgIcon]=\"sortAsc?'sii-sort-asc':'sii-sort-desc'\" ></mat-icon>\r\n</button>\r\n\r\n<!-- required for invisible transclusion -->\r\n<ng-content></ng-content>\r\n", styles: [":host{display:flex}.siiFacetSorterFormField{width:calc(100% - 40px)}.siiFacetSorterFormField::ng-deep .mat-mdc-form-field-subscript-wrapper{height:0}.siiFacetSorterFormField::ng-deep .mat-mdc-text-field-wrapper{background-color:#2a2b38}.siiFacetSorterFormField::ng-deep .mat-mdc-select-value,.siiFacetSorterFormField::ng-deep .mat-mdc-select-arrow{color:#ffffffde!important}.siiFacetSorterFormField::ng-deep .mat-mdc-form-field-infix{padding-top:8px;padding-bottom:8px;min-height:30px}.siiFacetSorterFormField::ng-deep .mdc-notched-outline>*{border-color:#ffffffde!important}.sorterButton{width:40px;height:40px;padding:7px}\n"] }]
        }], ctorParameters: () => [{ type: i1.SiiListController, decorators: [{
                    type: Optional
                }] }], propDecorators: { listSorterOptions: [{
                type: ContentChildren,
                args: [ListSorterOptionComponent]
            }], showLabel: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGlzdC1zb3J0ZXIuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvc2lpLXRvb2xraXQvc3JjL2xpYi9jb21wb25lbnRzL2xpc3Qtc29ydGVyL2xpc3Qtc29ydGVyLmNvbXBvbmVudC50cyIsIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL3NpaS10b29sa2l0L3NyYy9saWIvY29tcG9uZW50cy9saXN0LXNvcnRlci9saXN0LXNvcnRlci5jb21wb25lbnQuaHRtbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUF5QixlQUFlLEVBQWEsUUFBUSxFQUFFLEtBQUssRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUM5RyxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sd0JBQXdCLENBQUM7QUFDbkQsT0FBTyxFQUFtQixTQUFTLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQztBQUN0RSxPQUFPLEVBQUMseUJBQXlCLEVBQUMsTUFBTSxtREFBbUQsQ0FBQztBQUc1RixPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sd0JBQXdCLENBQUM7QUFDakQsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLDBCQUEwQixDQUFDO0FBQ3pELE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUM3QyxPQUFPLEVBQUUsWUFBWSxFQUFFLFFBQVEsRUFBRSxNQUFNLDhCQUE4QixDQUFDOzs7O0FBU3RFLE1BQU0sT0FBTyxtQkFBbUI7SUFNOUIsSUFBSSxhQUFhO1FBQ2YsT0FBTyxJQUFJLENBQUMsY0FBYyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUM7SUFDN0MsQ0FBQztJQUNELElBQUksYUFBYSxDQUFFLEVBQVU7UUFDM0IsSUFBSSxDQUFDLGNBQWMsQ0FBQyxVQUFVLENBQUMsSUFBSSxHQUFHLEVBQUUsQ0FBQztJQUMzQyxDQUFDO0lBRUQsSUFBSSxPQUFPO1FBQ1QsT0FBTyxJ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QkFBaUI7c0JBQTVELGVBQWU7dUJBQUMseUJBQXlCO2dCQUdqQyxTQUFTO3NCQUFqQixLQUFLIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBPbkluaXQsIEFmdGVyVmlld0luaXQsIENvbnRlbnRDaGlsZHJlbiwgUXVlcnlMaXN0LCBPcHRpb25hbCwgSW5wdXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgTWF0T3B0aW9uIH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvY29yZSc7XHJcbmltcG9ydCB7IE1hdFNlbGVjdENoYW5nZSwgTWF0U2VsZWN0IH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvc2VsZWN0JztcclxuaW1wb3J0IHtMaXN0U29ydGVyT3B0aW9uQ29tcG9uZW50fSBmcm9tICcuL2xpc3Qtc29ydGVyLW9wdGlvbi9saXN0LXNvcnRlci1vcHRpb24uY29tcG9uZW50JztcclxuaW1wb3J0IHsgU2lpTGlzdENvbnRyb2xsZXIgfSBmcm9tICcuLi8uLi9zZXJ2aWNlL3NpaS1saXN0LWNvbnRyb2xsZXIuc2VydmljZSc7XHJcbmltcG9ydCB7IFNpaVNvcnRHcm91cCB9IGZyb20gJy4uLy4uL2R0by9pLXNpaS1ncm91cC5kdG8nO1xyXG5pbXBvcnQgeyBNYXRJY29uIH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvaWNvbic7XHJcbmltcG9ydCB7IE1hdEljb25CdXR0b24gfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9idXR0b24nO1xyXG5pbXBvcnQgeyBGb3Jtc01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcclxuaW1wb3J0IHsgTWF0Rm9ybUZpZWxkLCBNYXRMYWJlbCB9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2Zvcm0tZmllbGQnO1xyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgICBzZWxlY3RvcjogJ3NpaS1saXN0LXNvcnRlcicsXHJcbiAgICB0ZW1wbGF0ZVVybDogJy4vbGlzdC1zb3J0ZXIuY29tcG9uZW50Lmh0bWwnLFxyXG4gICAgc3R5bGVVcmxzOiBbJy4vbGlzdC1zb3J0ZXIuY29tcG9uZW50LnNjc3MnXSxcclxuICAgIHN0YW5kYWxvbmU6IHRydWUsXHJcbiAgICBpbXBvcnRzOiBbTWF0Rm9ybUZpZWxkLCBNYXRMYWJlbCwgTWF0U2VsZWN0LCBGb3Jtc01vZHVsZSwgTWF0T3B0aW9uLCBNYXRJY29uQnV0dG9uLCBNYXRJY29uXVxyXG59KVxyXG5leHBvcnQgY2xhc3MgTGlzdFNvcnRlckNvbXBvbmVudCBpbXBsZW1lbnRzIEFmdGVyVmlld0luaXQge1xyXG4gIEBDb250ZW50Q2hpbGRyZW4oTGlzdFNvcnRlck9wdGlvbkNvbXBvbmVudCkgbGlzdFNvcnRlck9wdGlvbnM6IFF1ZXJ5TGlzdDxMaXN0U29ydGVyT3B0aW9uQ29tcG9uZW50PjtcclxuICBvcHRpb25zOiBhbnlbXTtcclxuXHJcbiAgQElucHV0KCkgc2hvd0xhYmVsID0gZmFsc2U7XHJcblxyXG4gIGdldCBzZWxlY3RlZFZhbHVlKCl7XHJcbiAgICByZXR1cm4gdGhpcy5zaWlMaXN0U2VydmljZS5fc29ydEZpZWxkLnNvcnQ7XHJcbiAgfVxyXG4gIHNldCBzZWxlY3RlZFZhbHVlKCBzdjogc3RyaW5nKXtcclxuICAgIHRoaXMuc2lpTGlzdFNlcnZpY2UuX3NvcnRGaWVsZC5zb3J0ID0gc3Y7XHJcbiAgfVxyXG5cclxuICBnZXQgc29ydEFzYygpe1xyXG4gICAgcmV0dXJuIHRoaXMuc2lpTGlzdFNlcnZpY2UuX3NvcnRGaWVsZC5zb3J0QXNjZW5kaW5nO1xyXG4gIH1cclxuICBzZXQgc29ydEFzYyh2YWw6IGJvb2xlYW4pe1xyXG4gICAgdGhpcy5zaWlMaXN0U2VydmljZS5fc29ydEZpZWxkLnNvcnRBc2NlbmRpbmcgPSB2YWw7XHJcbiAgfVxyXG5cclxuICBnZXQgc2VsZWN0ZWRHcm91cCgpe1xyXG4gICAgcmV0dXJuIHRoaXMuc2lpTGlzdFNlcnZpY2UuX2dyb3VwRmllbGQ7XHJcbiAgfVxyXG4gIHNldCBzZWxlY3RlZEdyb3VwKCBzdjogU2lpU29ydEdyb3VwKXtcclxuICAgIHRoaXMuc2lpTGlzdFNlcnZpY2UuX2dyb3VwRmllbGQgPSBzdjtcclxuICB9XHJcblxyXG4gIGNvbnN0cnVjdG9yKCBAT3B0aW9uYWwoKSBwcml2YXRlIHNpaUxpc3RTZXJ2aWNlOiBTaWlMaXN0Q29udHJvbGxlciApIHsgfVxyXG5cclxuICBuZ0FmdGVyVmlld0luaXQoKTogdm9pZCB7XHJcblxyXG4gICAgUHJvbWlzZS5yZXNvbHZlKCkudGhlbigoKSA9PiB7XHJcbiAgICAgIHRoaXMub3B0aW9ucyA9IHRoaXMubGlzdFNvcnRlck9wdGlvbnMubWFwKHggPT4ge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgdmFsdWU6IHgudmFsdWUgLFxyXG4gICAgICAgICAgIHZpZXdWYWx1ZTogeC52aWV3VmFsdWUsXHJcbiAgICAgICAgICAgZ3JvdXBLZXk6IHguZ3JvdXBLZXksXHJcbiAgICAgICAgICAgZ3JvdXBWYWx1ZTogeC5ncm91cFZhbHVlLFxyXG4gICAgICAgICAgIGdyb3VwTGFiZWxUcmFuc2Zvcm06IHguZ3JvdXBMYWJlbFRyYW5zZm9ybSAsXHJcbiAgICAgICAgICAgcGFyZW50R3JvdXBLZXk6IHgucGFyZW50R3JvdXBLZXksXHJcbiAgICAgICAgICAgcGFyZW50R3JvdXBWYWx1ZTogeC5wYXJlbnRHcm91cFZhbHVlLFxyXG4gICAgICAgICAgIHBhcmVudEdyb3VwTGFiZWxUcmFuc2Zvcm06IHgucGFyZW50R3JvdXBMYWJlbFRyYW5zZm9ybSxcclxuICAgICAgICAgICBncm91cEFjdGlvbjogIHguZ3JvdXBBY3Rpb24sXHJcbiAgICAgICAgICAgcGFyZW50R3JvdXBBY3Rpb246ICB4LnBhcmVudEdyb3VwQWN0aW9uXHJcbiAgICAgICAgICAgfTtcclxuICAgICAgfSk7XHJcblxyXG5cclxuICAgICAgbGV0IGNvbXBhcmVGdW5jdCA9ICh4OiBMaXN0U29ydGVyT3B0aW9uQ29tcG9uZW50KSA9PiB4LmlzSW5pdFNvcnQ7XHJcbiAgICAgIGlmICghIXRoaXMuc2lpTGlzdFNlcnZpY2UuX3NvcnRGaWVsZC5zb3J0KXtcclxuICAgICAgICBjb21wYXJlRnVuY3QgPSAoeDogTGlzdFNvcnRlck9wdGlvbkNvbXBvbmVudCkgPT4geC52YWx1ZSA9PT0gdGhpcy5zaWlMaXN0U2VydmljZS5fc29ydEZpZWxkLnNvcnQ7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGNvbnN0IGluaXRTb3J0ID0gdGhpcy5saXN0U29ydGVyT3B0aW9ucy5maW5kKGNvbXBhcmVGdW5jdCk7XHJcbiAgICAgIGxldCBzb3J0VG9JbnQgPSBudWxsO1xyXG4gICAgICBpZiAoaW5pdFNvcnQgIT0gbnVsbCl7XHJcbiAgICAgICAgaWYgKCEhdGhpcy5zaWlMaXN0U2VydmljZS5fc29ydEZpZWxkLnNvcnQpe1xyXG4gICAgICAgICAgaW5pdFNvcnQuc29ydEFzYyA9IHRoaXMuc2lpTGlzdFNlcnZpY2UuX3NvcnRGaWVsZC5zb3J0QXNjZW5kaW5nO1xyXG4gICAgICAgIH1cclxuICAgICAgICBzb3J0VG9JbnQgPSBpbml0U29ydDtcclxuICAgICAgfSBlbHNlIGlmICh0aGlzLm9wdGlvbnMgIT0gbnVsbCAmJiB0aGlzLm9wdGlvbnNbMF0gIT09IHVuZGVmaW5lZCl7XHJcbiAgICAgICAgc29ydFRvSW50ID0gdGhpcy5vcHRpb25zWzBdO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAodGhpcy5zZWxlY3RlZFZhbHVlID09IG51bGwpe1xyXG4gICAgICAgIHRoaXMuc2VsZWN0ZWRWYWx1ZSA9IHNvcnRUb0ludC52YWx1ZTtcclxuICAgICAgICB0aGlzLnNlbGVjdGVkR3JvdXAgPSB7XHJcbiAgICAgICAgICAgZ3JvdXBLZXk6IHNvcnRUb0ludC5ncm91cEtleSAsXHJcbiAgICAgICAgICAgZ3JvdXBWYWx1ZTogc29ydFRvSW50Lmdyb3VwVmFsdWUsXHJcbiAgICAgICAgICAgZ3JvdXBMYWJlbFRyYW5zZm9ybTogc29ydFRvSW50Lmdyb3VwTGFiZWxUcmFuc2Zvcm0gLFxyXG4gICAgICAgICAgIHBhcmVudEdyb3VwS2V5OiBzb3J0VG9JbnQucGFyZW50R3JvdXBLZXksXHJcbiAgICAgICAgICAgcGFyZW50R3JvdXBWYWx1ZTogc29ydFRvSW50LnBhcmVudEdyb3VwVmFsdWUsXHJcbiAgICAgICAgICAgcGFyZW50R3JvdXBMYWJlbFRyYW5zZm9ybTogc29ydFRvSW50LnBhcmVudEdyb3VwTGFiZWxUcmFuc2Zvcm0sXHJcbiAgICAgICAgICAgZ3JvdXBBY3Rpb246IHNvcnRUb0ludC5ncm91cEFjdGlvbixcclxuICAgICAgICAgICBwYXJlbnRHcm91cEFjdGlvbjogc29ydFRvSW50LnBhcmVudEdyb3VwQWN0aW9uXHJcbiAgICAgICAgICAgfSA7XHJcbiAgICAgICAgLy8gdGhpcy5zaWlMaXN0U2VydmljZS5zb3J0Q2hhbmdlLm5leHQoKTtcclxuICAgICAgfWVsc2UgaWYgKHRoaXMuc2VsZWN0ZWRWYWx1ZSAhPT0gc29ydFRvSW50LnZhbHVlIHx8IHNvcnRUb0ludC5ncm91cExhYmVsVHJhbnNmb3JtIT1udWxsIHx8IHNvcnRUb0ludC5wYXJlbnRHcm91cExhYmVsVHJhbnNmb3JtIT1udWxsKXtcclxuICAgICAgICB0aGlzLnNlbGVjdGVkVmFsdWUgPSBzb3J0VG9JbnQudmFsdWU7XHJcbiAgICAgICAgdGhpcy5zZWxlY3RlZEdyb3VwID0ge1xyXG4gICAgICAgICAgZ3JvdXBLZXk6IHNvcnRUb0ludC5ncm91cEtleSAsXHJcbiAgICAgICAgICBncm91cFZhbHVlOiBzb3J0VG9JbnQuZ3JvdXBWYWx1ZSAsXHJcbiAgICAgICAgICBncm91cExhYmVsVHJhbnNmb3JtOiBzb3J0VG9JbnQuZ3JvdXBMYWJlbFRyYW5zZm9ybSAsXHJcbiAgICAgICAgICBwYXJlbnRHcm91cEtleTogc29ydFRvSW50LnBhcmVudEdyb3VwS2V5LFxyXG4gICAgICAgICAgcGFyZW50R3JvdXBWYWx1ZTogc29ydFRvSW50LnBhcmVudEdyb3VwVmFsdWUsXHJcbiAgICAgICAgICBwYXJlbnRHcm91cExhYmVsVHJhbnNmb3JtOiBzb3J0VG9JbnQucGFyZW50R3JvdXBMYWJlbFRyYW5zZm9ybSxcclxuICAgICAgICAgIGdyb3VwQWN0aW9uOiBzb3J0VG9JbnQuZ3JvdXBBY3Rpb24sXHJcbiAgICAgICAgICBwYXJlbnRHcm91cEFjdGlvbjogc29ydFRvSW50LnBhcmVudEdyb3VwQWN0aW9uXHJcbiAgICAgICAgICB9IDtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKCBpbml0U29ydC5zb3J0QXNjICE9PSB0aGlzLnNvcnRBc2Mpe1xyXG4gICAgICAgIHRoaXMuc29ydEFzYyA9ICF0aGlzLnNvcnRBc2M7XHJcbiAgICAgIH1cclxuXHJcbiAgICB9KTtcclxuXHJcbiAgfVxyXG5cclxuICBzZWxlY3Rpb25DaGFuZ2Uoc2VsZXY6IE1hdFNlbGVjdENoYW5nZSl7XHJcbiAgICBjb25zdCBzZWxWYWwgPSB0aGlzLm9wdGlvbnMuZmluZCh2ID0+IHYudmFsdWUgPT09IHNlbGV2LnZhbHVlKTtcclxuICAgIHRoaXMuc2VsZWN0ZWRHcm91cCA9IHtcclxuICAgICAgZ3JvdXBLZXk6IHNlbFZhbC5ncm91cEtleSAsXHJcbiAgICAgIGdyb3VwVmFsdWU6IHNlbFZhbC5ncm91cFZhbHVlLFxyXG4gICAgICBncm91cExhYmVsVHJhbnNmb3JtOiBzZWxWYWwuZ3JvdXBMYWJlbFRyYW5zZm9ybSAsXHJcbiAgICAgIHBhcmVudEdyb3VwS2V5OiBzZWxWYWwucGFyZW50R3JvdXBLZXksXHJcbiAgICAgIHBhcmVudEdyb3VwVmFsdWU6IHNlbFZhbC5wYXJlbnRHcm91cFZhbHVlLFxyXG4gICAgICBwYXJlbnRHcm91cExhYmVsVHJhbnNmb3JtOiBzZWxWYWwucGFyZW50R3JvdXBMYWJlbFRyYW5zZm9ybSAsXHJcbiAgICAgIGdyb3VwQWN0aW9uOiBzZWxWYWwuZ3JvdXBBY3Rpb24sXHJcbiAgICAgIHBhcmVudEdyb3VwQWN0aW9uOiBzZWxWYWwucGFyZW50R3JvdXBBY3Rpb25cclxuICAgICAgfSA7XHJcbiAgICB0aGlzLnNpaUxpc3RTZXJ2aWNlLnNvcnRDaGFuZ2UubmV4dCgpO1xyXG4gIH1cclxuXHJcbiAgdG9nZ2xlT3JkZXJBc2MgPSAoKSA9PiB7XHJcbiAgICB0aGlzLnNvcnRBc2MgPSAhdGhpcy5zb3J0QXNjO1xyXG4gICAgdGhpcy5zaWlMaXN0U2VydmljZS5zb3J0Q2hhbmdlLm5leHQoKTtcclxuICB9XHJcblxyXG5cclxufVxyXG4iLCI8bWF0LWZvcm0tZmllbGQgIGFwcGVhcmFuY2U9XCJvdXRsaW5lXCIgY2xhc3M9XCJzaWlGYWNldFNvcnRlckZvcm1GaWVsZFwiPlxyXG4gIEBpZiAoc2hvd0xhYmVsKSB7XHJcbiAgICA8bWF0LWxhYmVsICBpMThuPVwiQEBsaXN0U29ydGVyT3JkZXJCeVwiPk9yZGVyIEJ5PC9tYXQtbGFiZWw+XHJcbiAgfVxyXG4gIDxtYXQtc2VsZWN0ICBbKG5nTW9kZWwpXT1cInNlbGVjdGVkVmFsdWVcIiAoc2VsZWN0aW9uQ2hhbmdlKT1zZWxlY3Rpb25DaGFuZ2UoJGV2ZW50KT5cclxuICAgIEBmb3IgKG9wdGlvbiBvZiBvcHRpb25zOyB0cmFjayBvcHRpb24pIHtcclxuICAgICAgPG1hdC1vcHRpb24gW3ZhbHVlXT1cIm9wdGlvbi52YWx1ZVwiPlxyXG4gICAgICAgIHt7IG9wdGlvbi52aWV3VmFsdWUgfX1cclxuICAgICAgPC9tYXQtb3B0aW9uPlxyXG4gICAgfVxyXG4gIDwvbWF0LXNlbGVjdD5cclxuPC9tYXQtZm9ybS1maWVsZD5cclxuPGJ1dHRvbiBtYXQtaWNvbi1idXR0b24gY2xhc3M9XCJzb3J0ZXJCdXR0b25cIiAoY2xpY2spPVwidG9nZ2xlT3JkZXJBc2MoKVwiPlxyXG4gIDxtYXQtaWNvbiBbc3ZnSWNvbl09XCJzb3J0QXNjPydzaWktc29ydC1hc2MnOidzaWktc29ydC1kZXNjJ1wiID48L21hdC1pY29uPlxyXG48L2J1dHRvbj5cclxuXHJcbjwhLS0gcmVxdWlyZWQgZm9yIGludmlzaWJsZSB0cmFuc2NsdXNpb24gLS0+XHJcbjxuZy1jb250ZW50PjwvbmctY29udGVudD5cclxuIl19