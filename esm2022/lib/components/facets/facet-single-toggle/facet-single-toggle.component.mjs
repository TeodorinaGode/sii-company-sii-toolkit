import { Component, Input } from '@angular/core';
import { PrimitiveFacetDirective } from '../common/primitive-facet/primitive-facet.directive';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import * as i0 from "@angular/core";
import * as i1 from "../common/service/sii-facet.service";
export class FacetSingleToggleComponent extends PrimitiveFacetDirective {
    set target(val) {
        this.config = { name: val, facetOptions: null };
    }
    constructor(siiFacetService) {
        super(siiFacetService);
        this.optionsInitValue = false; // valore di inizializzazione
        // --------override parent funct
        this.addSelection = (item) => {
            this.siiFacetService.facetObj[this.config.name] = true;
            this.updateFacetSelection();
        };
        // --------override parent funct
        this.removeSelection = (item) => {
            delete this.siiFacetService.facetObj[this.config.name];
            this.updateFacetSelection();
        };
        this.removeFacetSelectionFromFacetSummaryCallback = (fs) => {
            if (fs.name === this.config.name) {
                this.removeSelection(null);
            }
        };
        this.getInitSelection = () => {
            return this.siiFacetService._initFacetToSet.facets[this.config.name] || this.optionsInitValue;
        };
    }
    onToggleChange(ev) {
        // this.siiFacetService.facetObj[this.config.name]=ev.checked;
        // this.updateFacetSelection();
        ev.checked ? this.addSelection(null) : this.removeSelection(null);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: FacetSingleToggleComponent, deps: [{ token: i1.SiiFacetService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "18.2.13", type: FacetSingleToggleComponent, isStandalone: true, selector: "sii-facet-single-toggle", inputs: { label: "label", target: "target" }, usesInheritance: true, ngImport: i0, template: "<mat-slide-toggle [checked]=\"selectedFacets==true\"  (change)=\"onToggleChange($event)\" [labelPosition]=\"'before'\">{{label}}</mat-slide-toggle>\r\n", styles: [":host{display:block}\n"], dependencies: [{ kind: "component", type: MatSlideToggle, selector: "mat-slide-toggle", inputs: ["name", "id", "labelPosition", "aria-label", "aria-labelledby", "aria-describedby", "required", "color", "disabled", "disableRipple", "tabIndex", "checked", "hideIcon", "disabledInteractive"], outputs: ["change", "toggleChange"], exportAs: ["matSlideToggle"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: FacetSingleToggleComponent, decorators: [{
            type: Component,
            args: [{ selector: 'sii-facet-single-toggle', standalone: true, imports: [MatSlideToggle], template: "<mat-slide-toggle [checked]=\"selectedFacets==true\"  (change)=\"onToggleChange($event)\" [labelPosition]=\"'before'\">{{label}}</mat-slide-toggle>\r\n", styles: [":host{display:block}\n"] }]
        }], ctorParameters: () => [{ type: i1.SiiFacetService }], propDecorators: { label: [{
                type: Input
            }], target: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmFjZXQtc2luZ2xlLXRvZ2dsZS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9zaWktdG9vbGtpdC9zcmMvbGliL2NvbXBvbmVudHMvZmFjZXRzL2ZhY2V0LXNpbmdsZS10b2dnbGUvZmFjZXQtc2luZ2xlLXRvZ2dsZS5jb21wb25lbnQudHMiLCIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9zaWktdG9vbGtpdC9zcmMvbGliL2NvbXBvbmVudHMvZmFjZXRzL2ZhY2V0LXNpbmdsZS10b2dnbGUvZmFjZXQtc2luZ2xlLXRvZ2dsZS5jb21wb25lbnQuaHRtbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFVLEtBQUssRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUN6RCxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsTUFBTSxxREFBcUQsQ0FBQztBQUU5RixPQUFPLEVBQXdCLGNBQWMsRUFBRSxNQUFNLGdDQUFnQyxDQUFDOzs7QUFXdEYsTUFBTSxPQUFPLDBCQUEyQixTQUFRLHVCQUF1QjtJQUVyRSxJQUNJLE1BQU0sQ0FBQyxHQUFVO1FBQ25CLElBQUksQ0FBQyxNQUFNLEdBQUMsRUFBQyxJQUFJLEVBQUMsR0FBRyxFQUFDLFlBQVksRUFBQyxJQUFJLEVBQUMsQ0FBQztJQUMzQyxDQUFDO0lBRUQsWUFBWSxlQUErQjtRQUN6QyxLQUFLLENBQUMsZUFBZSxDQUFDLENBQUM7UUFDdkIsSUFBSSxDQUFDLGdCQUFnQixHQUFDLEtBQUssQ0FBQyxDQUFDLDZCQUE2QjtRQUUxRCxnQ0FBZ0M7UUFDbEMsSUFBSSxDQUFDLFlBQVksR0FBQyxDQUFDLElBQXNCLEVBQUMsRUFBRTtZQUMxQyxJQUFJLENBQUMsZUFBZSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFDLElBQUksQ0FBQztZQUNyRCxJQUFJLENBQUMsb0JBQW9CLEVBQUUsQ0FBQztRQUM5QixDQUFDLENBQUE7UUFFSCxnQ0FBZ0M7UUFDOUIsSUFBSSxDQUFDLGVBQWUsR0FBQyxDQUFDLElBQXNCLEVBQUMsRUFBRTtZQUM3QyxPQUFPLElBQUksQ0FBQyxlQUFlLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDdkQsSUFBSSxDQUFDLG9CQUFvQixFQUFFLENBQUM7UUFDOUIsQ0FBQyxDQUFBO1FBRUQsSUFBSSxDQUFDLDRDQUE0QyxHQUFDLENBQUMsRUFBZSxFQUFDLEVBQUU7WUFDbkUsSUFBRyxFQUFFLENBQUMsSUFBSSxLQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFDLENBQUM7Z0JBQzdCLElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDN0IsQ0FBQztRQUNILENBQUMsQ0FBQTtRQUVELElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxHQUFFLEVBQUU7WUFDMUIsT0FBTyxJQUFJLENBQUMsZUFBZSxDQUFDLGVBQWUsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsZ0JBQWdCLENBQUM7UUFDOUYsQ0FBQyxDQUFBO0lBQ0gsQ0FBQztJQUVELGNBQWMsQ0FBRSxFQUF1QjtRQUNyQyw4REFBOEQ7UUFDOUQsK0JBQStCO1FBQy9CLEVBQUUsQ0FBQyxPQUFPLENBQUEsQ0FBQyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUEsQ0FBQyxDQUFBLElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLENBQUE7SUFDaEUsQ0FBQzsrR0F0Q1UsMEJBQTBCO21HQUExQiwwQkFBMEIsd0pDZHZDLHlKQUNBLGdGRFdjLGNBQWM7OzRGQUVmLDBCQUEwQjtrQkFQdEMsU0FBUzsrQkFDSSx5QkFBeUIsY0FHdkIsSUFBSSxXQUNQLENBQUMsY0FBYyxDQUFDO29GQUdsQixLQUFLO3NCQUFiLEtBQUs7Z0JBRUYsTUFBTTtzQkFEVCxLQUFLIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBPbkluaXQsIElucHV0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IFByaW1pdGl2ZUZhY2V0RGlyZWN0aXZlIH0gZnJvbSAnLi4vY29tbW9uL3ByaW1pdGl2ZS1mYWNldC9wcmltaXRpdmUtZmFjZXQuZGlyZWN0aXZlJztcclxuaW1wb3J0IHsgU2lpRmFjZXRTZXJ2aWNlIH0gZnJvbSAnLi4vY29tbW9uL3NlcnZpY2Uvc2lpLWZhY2V0LnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBNYXRTbGlkZVRvZ2dsZUNoYW5nZSwgTWF0U2xpZGVUb2dnbGUgfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9zbGlkZS10b2dnbGUnO1xyXG5pbXBvcnQgeyBTaWlGYWNldE9wdGlvbkR0byB9IGZyb20gJy4uL2NvbW1vbi9kdG8vaS1zaWktZmFjZXQtb3B0aW9uLmR0byc7XHJcbmltcG9ydCB7IFNpaUZhY2V0RHRvIH0gZnJvbSAnLi4vY29tbW9uL2R0by9pLXNpaS1mYWNldC5kdG8nO1xyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgICBzZWxlY3RvcjogJ3NpaS1mYWNldC1zaW5nbGUtdG9nZ2xlJyxcclxuICAgIHRlbXBsYXRlVXJsOiAnLi9mYWNldC1zaW5nbGUtdG9nZ2xlLmNvbXBvbmVudC5odG1sJyxcclxuICAgIHN0eWxlVXJsczogWycuL2ZhY2V0LXNpbmdsZS10b2dnbGUuY29tcG9uZW50LmNzcyddLFxyXG4gICAgc3RhbmRhbG9uZTogdHJ1ZSxcclxuICAgIGltcG9ydHM6IFtNYXRTbGlkZVRvZ2dsZV1cclxufSlcclxuZXhwb3J0IGNsYXNzIEZhY2V0U2luZ2xlVG9nZ2xlQ29tcG9uZW50IGV4dGVuZHMgUHJpbWl0aXZlRmFjZXREaXJlY3RpdmUge1xyXG4gIEBJbnB1dCgpIGxhYmVsO1xyXG4gIEBJbnB1dCgpXHJcbiAgc2V0IHRhcmdldCh2YWw6c3RyaW5nKXtcclxuICAgIHRoaXMuY29uZmlnPXtuYW1lOnZhbCxmYWNldE9wdGlvbnM6bnVsbH07XHJcbiAgfVxyXG5cclxuICBjb25zdHJ1Y3RvcihzaWlGYWNldFNlcnZpY2U6U2lpRmFjZXRTZXJ2aWNlKSB7XHJcbiAgICBzdXBlcihzaWlGYWNldFNlcnZpY2UpO1xyXG4gICAgdGhpcy5vcHRpb25zSW5pdFZhbHVlPWZhbHNlOyAvLyB2YWxvcmUgZGkgaW5pemlhbGl6emF6aW9uZVxyXG5cclxuICAgIC8vIC0tLS0tLS0tb3ZlcnJpZGUgcGFyZW50IGZ1bmN0XHJcbiAgdGhpcy5hZGRTZWxlY3Rpb249KGl0ZW06U2lpRmFjZXRPcHRpb25EdG8pPT57XHJcbiAgICB0aGlzLnNpaUZhY2V0U2VydmljZS5mYWNldE9ialt0aGlzLmNvbmZpZy5uYW1lXT10cnVlO1xyXG4gICAgdGhpcy51cGRhdGVGYWNldFNlbGVjdGlvbigpO1xyXG4gIH1cclxuXHJcbi8vIC0tLS0tLS0tb3ZlcnJpZGUgcGFyZW50IGZ1bmN0XHJcbiAgdGhpcy5yZW1vdmVTZWxlY3Rpb249KGl0ZW06U2lpRmFjZXRPcHRpb25EdG8pPT57XHJcbiAgICBkZWxldGUgdGhpcy5zaWlGYWNldFNlcnZpY2UuZmFjZXRPYmpbdGhpcy5jb25maWcubmFtZV07XHJcbiAgICB0aGlzLnVwZGF0ZUZhY2V0U2VsZWN0aW9uKCk7XHJcbiAgfVxyXG5cclxuICB0aGlzLnJlbW92ZUZhY2V0U2VsZWN0aW9uRnJvbUZhY2V0U3VtbWFyeUNhbGxiYWNrPShmczogU2lpRmFjZXREdG8pPT57XHJcbiAgICBpZihmcy5uYW1lPT09dGhpcy5jb25maWcubmFtZSl7XHJcbiAgICAgIHRoaXMucmVtb3ZlU2VsZWN0aW9uKG51bGwpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgdGhpcy5nZXRJbml0U2VsZWN0aW9uID0gKCk9PntcclxuICAgIHJldHVybiB0aGlzLnNpaUZhY2V0U2VydmljZS5faW5pdEZhY2V0VG9TZXQuZmFjZXRzW3RoaXMuY29uZmlnLm5hbWVdIHx8IHRoaXMub3B0aW9uc0luaXRWYWx1ZTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIG9uVG9nZ2xlQ2hhbmdlKCBldjpNYXRTbGlkZVRvZ2dsZUNoYW5nZSl7XHJcbiAgICAvLyB0aGlzLnNpaUZhY2V0U2VydmljZS5mYWNldE9ialt0aGlzLmNvbmZpZy5uYW1lXT1ldi5jaGVja2VkO1xyXG4gICAgLy8gdGhpcy51cGRhdGVGYWNldFNlbGVjdGlvbigpO1xyXG4gICAgZXYuY2hlY2tlZD8gdGhpcy5hZGRTZWxlY3Rpb24obnVsbCk6dGhpcy5yZW1vdmVTZWxlY3Rpb24obnVsbClcclxuICB9XHJcblxyXG5cclxuXHJcbn1cclxuIiwiPG1hdC1zbGlkZS10b2dnbGUgW2NoZWNrZWRdPVwic2VsZWN0ZWRGYWNldHM9PXRydWVcIiAgKGNoYW5nZSk9XCJvblRvZ2dsZUNoYW5nZSgkZXZlbnQpXCIgW2xhYmVsUG9zaXRpb25dPVwiJ2JlZm9yZSdcIj57e2xhYmVsfX08L21hdC1zbGlkZS10b2dnbGU+XHJcbiJdfQ==