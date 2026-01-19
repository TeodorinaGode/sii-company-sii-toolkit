import { Input, ViewChild, Directive } from '@angular/core';
import { FacetSkeletonComponent } from '../facet-skeleton/facet-skeleton.component';
import { Subscription } from 'rxjs';
import * as i0 from "@angular/core";
import * as i1 from "../service/sii-facet.service";
// @Component({
//   selector: 'sii-primitive-facet',
//   template: '',
//   styleUrls: ['./primitive-facet.component.css']
// })
// @Component({
//   selector: 'sii-primitive-facet',
//   template: ''
// })
export class PrimitiveFacetDirective {
    set multiplicityToDisplay(val) {
        this.siiFacetService.facetsMultiplicity[this.config.name] = val;
    }
    get multiplicityToDisplay() {
        return this.siiFacetService.facetsMultiplicity[this.config.name] || 1;
    }
    set facetExpanded(val) {
        this.siiFacetService.facetsExpanded[this.config.name] = val;
    }
    get facetExpanded() {
        return this.siiFacetService.facetsExpanded[this.config.name];
    }
    set optionsInitValue(val) {
        this._optionsInitValue = val;
    }
    get optionsInitValue() {
        if (Array.isArray(this._optionsInitValue)) {
            return [...this._optionsInitValue];
        }
        else {
            return this._optionsInitValue;
        }
    }
    get facetSelection() { return this.siiFacetService.facetObj[this.config.name]; }
    set facetSelection(val) { this.siiFacetService.facetObj[this.config.name] = val; }
    get selectedFacets() { return this.siiFacetService.facetObjVal[this.config.name] || {}; }
    constructor(siiFacetService) {
        this.siiFacetService = siiFacetService;
        this.expanded = true; // Init value for expansion
        this.initMultiplicityToDisplay = 1; // the init value
        this.visibleFacetsSize = 5;
        this.hideSelection = false;
        this.subscriptions = new Subscription();
        this._optionsInitValue = [];
        this.siiFacetService.removeFacetSelection$.subscribe((fs) => {
            this.removeFacetSelectionFromFacetSummaryCallback(fs);
        });
        this.siiFacetService.removeAllFacetSelection$.subscribe(() => {
            this.removeAllSelections();
        });
        this.siiFacetService.changeFacetsRequestObs.subscribe((req) => {
            if (req.facets.hasOwnProperty(this.config.name)) {
                this.changeFacets(req.facets[this.config.name]);
            }
            else if (req.reset) {
                this.removeAllSelections();
            }
        });
    }
    ngOnChanges(changes) {
        if (!!changes.config) {
            if (this.facetSelection?.find(i => !!i.miss) != null) {
                this.facetSelection = this.extractFacetFromList(this.facetSelection.map(i => i.code));
                this.facetSelection?.filter(i => !!i.miss).forEach(i => i.lost = true);
                this.updateFacetSelection(false);
            }
        }
    }
    ngAfterViewInitCallback() { } // override da discendenti
    ngAfterViewInit() {
        if (this.siiFacetService.facetsHideSelection[this.config.name] === undefined) {
            Promise.resolve().then(() => {
                this.siiFacetService.facetsHideSelection[this.config.name] = this.hideSelection;
            });
        }
        // check if is firstInit
        if (this.siiFacetService.facetsMultiplicity[this.config.name] === undefined) {
            Promise.resolve().then(() => {
                this.multiplicityToDisplay = this.initMultiplicityToDisplay;
            });
        }
        else if (this.multiplicityToDisplay * this.visibleFacetsSize > this.config.facetOptions.length) {
            // there are less facets . reduce the multiplicity to the max available
            Promise.resolve().then(() => {
                this.multiplicityToDisplay = Math.ceil(this.config.facetOptions.length / this.visibleFacetsSize);
            });
        }
        if (this.facetSelection === undefined) {
            Promise.resolve().then(() => {
                this.siiFacetService.initializeFacet(this.config.name, this.getInitSelection());
            });
        }
        if (this.siiFacetService.facetsExpanded[this.config.name] === undefined) {
            Promise.resolve().then(() => {
                this.facetExpanded = this.expanded;
            });
        }
        if (this.skelRef) {
            // setto in automatico la label sul componente
            Promise.resolve().then(() => {
                this.skelRef.setLabel(this.label);
                this.skelRef.setExpanded(this.facetExpanded);
                this.subscriptions.add(this.skelRef.expandedChange.subscribe((ev) => this.facetExpanded = ev));
            });
        }
        this.siiFacetService.registerFacetLabel(this.config.name, this.label);
        Promise.resolve().then(() => {
            this.ngAfterViewInitCallback();
        });
    }
    ngOnDestroy() {
        // not needed since it's a cold observable but good practice
        this.subscriptions.unsubscribe();
    }
    removeFacetSelectionFromFacetSummaryCallback(fs) {
        if (fs.name === this.config.name) {
            for (const op in fs.facetOptions) {
                if (fs.facetOptions[op] != null) {
                    this.removeSelection(fs.facetOptions[op]);
                }
            }
        }
    }
    getInitSelection() {
        if (this.siiFacetService._initFacetToSet.facets[this.config.name] !== undefined) {
            const fcts = this.extractFacetFromList(this.siiFacetService._initFacetToSet.facets[this.config.name]);
            fcts.filter(i => !!i.miss).forEach(i => i.lost = true);
            return fcts;
        }
        else {
            return this.optionsInitValue || [];
        }
    }
    extractFacetFromList(items) {
        const itemsToAdd = [];
        const initVal = [...items];
        this.config.facetOptions?.forEach(op => {
            const initIndex = initVal.indexOf(op.code);
            if (initIndex !== -1) {
                itemsToAdd.push(op);
                initVal.splice(initIndex, 1);
            }
        });
        if (initVal.length > 0) {
            // init facet not in options.
            console.log('facet non presenti=', initVal);
            initVal.forEach(iv => {
                const missOp = { code: iv, descr: '!!' + iv, count: 0, miss: true };
                itemsToAdd.push(missOp);
            });
        }
        return itemsToAdd;
    }
    addSelection(item) {
        this.facetSelection.push(item);
        this.updateFacetSelection();
    }
    removeSelection(item, propagate = true) {
        const i = this.facetSelection.findIndex((e) => e.code === item.code);
        if (i !== -1) {
            this.facetSelection.splice(i, 1);
            this.updateFacetSelection(propagate);
        }
    }
    removeAllSelections() {
        this.facetSelection = this.optionsInitValue;
        this.updateFacetSelection(false);
    }
    changeFacets(facets) {
        this.facetSelection = this.extractFacetFromList(facets);
        this.updateFacetSelection(true);
    }
    toggle(opt) {
        this.selectedFacets[opt.code] === undefined ? this.addSelection(opt) : this.removeSelection(opt);
    }
    updateFacetSelection(propagateChange = true) {
        this.siiFacetService.facetChange({
            facetOptions: this.facetSelection,
            name: this.config.name
        }, propagateChange);
    }
    instanceOfSiiFacetOptionDto(object) {
        return (object instanceof Object) && ('code' in object && 'descr' in object);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: PrimitiveFacetDirective, deps: [{ token: i1.SiiFacetService }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "18.2.13", type: PrimitiveFacetDirective, inputs: { config: "config", expanded: "expanded", label: "label", initMultiplicityToDisplay: "initMultiplicityToDisplay", visibleFacetsSize: "visibleFacetsSize", hideSelection: "hideSelection" }, viewQueries: [{ propertyName: "skelRef", first: true, predicate: FacetSkeletonComponent, descendants: true }], usesOnChanges: true, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: PrimitiveFacetDirective, decorators: [{
            type: Directive
        }], ctorParameters: () => [{ type: i1.SiiFacetService }], propDecorators: { config: [{
                type: Input
            }], expanded: [{
                type: Input
            }], label: [{
                type: Input
            }], initMultiplicityToDisplay: [{
                type: Input
            }], visibleFacetsSize: [{
                type: Input
            }], hideSelection: [{
                type: Input
            }], skelRef: [{
                type: ViewChild,
                args: [FacetSkeletonComponent]
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJpbWl0aXZlLWZhY2V0LmRpcmVjdGl2ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL3NpaS10b29sa2l0L3NyYy9saWIvY29tcG9uZW50cy9mYWNldHMvY29tbW9uL3ByaW1pdGl2ZS1mYWNldC9wcmltaXRpdmUtZmFjZXQuZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBcUIsS0FBSyxFQUFFLFNBQVMsRUFBaUYsU0FBUyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRTlKLE9BQU8sRUFBRSxzQkFBc0IsRUFBRSxNQUFNLDRDQUE0QyxDQUFDO0FBR3BGLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxNQUFNLENBQUM7OztBQUVwQyxlQUFlO0FBQ2YscUNBQXFDO0FBQ3JDLGtCQUFrQjtBQUNsQixtREFBbUQ7QUFDbkQsS0FBSztBQUNMLGVBQWU7QUFDZixxQ0FBcUM7QUFDckMsaUJBQWlCO0FBQ2pCLEtBQUs7QUFHTCxNQUFNLE9BQWdCLHVCQUF1QjtJQVUzQyxJQUFJLHFCQUFxQixDQUFDLEdBQVc7UUFDbkMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLEdBQUcsQ0FBQztJQUNsRSxDQUFDO0lBQ0QsSUFBSSxxQkFBcUI7UUFDdkIsT0FBTyxJQUFJLENBQUMsZUFBZSxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3hFLENBQUM7SUFFRCxJQUFJLGFBQWEsQ0FBQyxHQUFZO1FBQzVCLElBQUksQ0FBQyxlQUFlLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsR0FBRyxDQUFDO0lBQzlELENBQUM7SUFDRCxJQUFJLGFBQWE7UUFDZixPQUFPLElBQUksQ0FBQyxlQUFl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RUQsTUFBTSxDQUFDLEdBQXNCO1FBQzNCLElBQUksQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNuRyxDQUFDO0lBRUQsb0JBQW9CLENBQUMsZUFBZSxHQUFFLElBQUk7UUFDeEMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxXQUFXLENBQzlCO1lBQ0UsWUFBWSxFQUFFLElBQUksQ0FBQyxjQUFjO1lBQ2pDLElBQUksRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUk7U0FDdkIsRUFDRCxlQUFlLENBQ2QsQ0FBQztJQUVOLENBQUM7SUFFRCwyQkFBMkIsQ0FBQyxNQUFXO1FBQ3JDLE9BQU8sQ0FBQyxNQUFNLFlBQVksTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLElBQUksTUFBTSxJQUFLLE9BQU8sSUFBSSxNQUFNLENBQUMsQ0FBQztJQUNoRixDQUFDOytHQXBObUIsdUJBQXVCO21HQUF2Qix1QkFBdUIsdVFBMEJoQyxzQkFBc0I7OzRGQTFCYix1QkFBdUI7a0JBRDVDLFNBQVM7b0ZBSUMsTUFBTTtzQkFBZCxLQUFLO2dCQUNHLFFBQVE7c0JBQWhCLEtBQUs7Z0JBQ0csS0FBSztzQkFBYixLQUFLO2dCQUNHLHlCQUF5QjtzQkFBakMsS0FBSztnQkFDRyxpQkFBaUI7c0JBQXpCLEtBQUs7Z0JBQ0csYUFBYTtzQkFBckIsS0FBSztnQkFrQjZCLE9BQU87c0JBQXpDLFNBQVM7dUJBQUMsc0JBQXNCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBPbkluaXQsIElucHV0LCBWaWV3Q2hpbGQsIEFmdGVyVmlld0luaXQsIFNpbXBsZUNoYW5nZXMsIE9uQ2hhbmdlcywgRXZlbnRFbWl0dGVyLCBIb3N0QmluZGluZywgT25EZXN0cm95LCBEaXJlY3RpdmUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgU2lpRmFjZXRPcHRpb25EdG8gfSBmcm9tICcuLi9kdG8vaS1zaWktZmFjZXQtb3B0aW9uLmR0byc7XHJcbmltcG9ydCB7IEZhY2V0U2tlbGV0b25Db21wb25lbnQgfSBmcm9tICcuLi9mYWNldC1za2VsZXRvbi9mYWNldC1za2VsZXRvbi5jb21wb25lbnQnO1xyXG5pbXBvcnQgeyBTaWlGYWNldFNlcnZpY2UgfSBmcm9tICcuLi9zZXJ2aWNlL3NpaS1mYWNldC5zZXJ2aWNlJztcclxuaW1wb3J0IHsgU2lpRmFjZXREdG8gfSBmcm9tICcuLi9kdG8vaS1zaWktZmFjZXQuZHRvJztcclxuaW1wb3J0IHsgU3Vic2NyaXB0aW9uIH0gZnJvbSAncnhqcyc7XHJcblxyXG4vLyBAQ29tcG9uZW50KHtcclxuLy8gICBzZWxlY3RvcjogJ3NpaS1wcmltaXRpdmUtZmFjZXQnLFxyXG4vLyAgIHRlbXBsYXRlOiAnJyxcclxuLy8gICBzdHlsZVVybHM6IFsnLi9wcmltaXRpdmUtZmFjZXQuY29tcG9uZW50LmNzcyddXHJcbi8vIH0pXHJcbi8vIEBDb21wb25lbnQoe1xyXG4vLyAgIHNlbGVjdG9yOiAnc2lpLXByaW1pdGl2ZS1mYWNldCcsXHJcbi8vICAgdGVtcGxhdGU6ICcnXHJcbi8vIH0pXHJcblxyXG5ARGlyZWN0aXZlKClcclxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIFByaW1pdGl2ZUZhY2V0RGlyZWN0aXZlIGltcGxlbWVudHMgIE9uRGVzdHJveSwgQWZ0ZXJWaWV3SW5pdCAsIE9uQ2hhbmdlc3tcclxuXHJcbiAgLy8gQElucHV0KCkgZGF0YTpTaWlGYWNldE9wdGlvbkR0b1tdO1xyXG4gIEBJbnB1dCgpIGNvbmZpZzogU2lpRmFjZXREdG87XHJcbiAgQElucHV0KCkgZXhwYW5kZWQgPSB0cnVlOyAvLyBJbml0IHZhbHVlIGZvciBleHBhbnNpb25cclxuICBASW5wdXQoKSBsYWJlbDogc3RyaW5nO1xyXG4gIEBJbnB1dCgpIGluaXRNdWx0aXBsaWNpdHlUb0Rpc3BsYXkgPSAxOyAvLyB0aGUgaW5pdCB2YWx1ZVxyXG4gIEBJbnB1dCgpIHZpc2libGVGYWNldHNTaXplID0gNTtcclxuICBASW5wdXQoKSBoaWRlU2VsZWN0aW9uPWZhbHNlO1xyXG5cclxuICBzZXQgbXVsdGlwbGljaXR5VG9EaXNwbGF5KHZhbDogbnVtYmVyKXtcclxuICAgIHRoaXMuc2lpRmFjZXRTZXJ2aWNlLmZhY2V0c011bHRpcGxpY2l0eVt0aGlzLmNvbmZpZy5uYW1lXSA9IHZhbDtcclxuICB9XHJcbiAgZ2V0IG11bHRpcGxpY2l0eVRvRGlzcGxheSgpe1xyXG4gICAgcmV0dXJuIHRoaXMuc2lpRmFjZXRTZXJ2aWNlLmZhY2V0c011bHRpcGxpY2l0eVt0aGlzLmNvbmZpZy5uYW1lXSB8fCAxO1xyXG4gIH1cclxuXHJcbiAgc2V0IGZhY2V0RXhwYW5kZWQodmFsOiBib29sZWFuKXtcclxuICAgIHRoaXMuc2lpRmFjZXRTZXJ2aWNlLmZhY2V0c0V4cGFuZGVkW3RoaXMuY29uZmlnLm5hbWVdID0gdmFsO1xyXG4gIH1cclxuICBnZXQgZmFjZXRFeHBhbmRlZCgpe1xyXG4gICAgcmV0dXJuIHRoaXMuc2lpRmFjZXRTZXJ2aWNlLmZhY2V0c0V4cGFuZGVkW3RoaXMuY29uZmlnLm5hbWVdO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSByZWFkb25seSBzdWJzY3JpcHRpb25zOiBTdWJzY3JpcHRpb24gID0gbmV3IFN1YnNjcmlwdGlvbigpO1xyXG5cclxuICBAVmlld0NoaWxkKEZhY2V0U2tlbGV0b25Db21wb25lbnQpIHNrZWxSZWY6IEZhY2V0U2tlbGV0b25Db21wb25lbnQ7XHJcblxyXG4gIF9vcHRpb25zSW5pdFZhbHVlOiBhbnkgPSBbXTtcclxuICBzZXQgb3B0aW9uc0luaXRWYWx1ZSh2YWw6IGFueSl7XHJcbiAgICB0aGlzLl9vcHRpb25zSW5pdFZhbHVlID0gdmFsO1xyXG4gIH1cclxuXHJcbiAgZ2V0IG9wdGlvbnNJbml0VmFsdWUoKXtcclxuICAgIGlmIChBcnJheS5pc0FycmF5KHRoaXMuX29wdGlvbnNJbml0VmFsdWUpKXtcclxuICAgICAgcmV0dXJuIFsuLi50aGlzLl9vcHRpb25zSW5pdFZhbHVlXTtcclxuICAgIH1lbHNlIHtcclxuICAgICAgcmV0dXJuIHRoaXMuX29wdGlvbnNJbml0VmFsdWU7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuXHJcbiAgZ2V0IGZhY2V0U2VsZWN0aW9uKCkgeyByZXR1cm4gdGhpcy5zaWlGYWNldFNlcnZpY2UuZmFjZXRPYmpbdGhpcy5jb25maWcubmFtZV07IH1cclxuICBzZXQgZmFjZXRTZWxlY3Rpb24oIHZhbCkgeyB0aGlzLnNpaUZhY2V0U2VydmljZS5mYWNldE9ialt0aGlzLmNvbmZpZy5uYW1lXSA9IHZhbDsgfVxyXG4gIGdldCBzZWxlY3RlZEZhY2V0cygpIHsgcmV0dXJuIHRoaXMuc2lpRmFjZXRTZXJ2aWNlLmZhY2V0T2JqVmFsW3RoaXMuY29uZmlnLm5hbWVdIHx8IHt9OyB9XHJcblxyXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBzaWlGYWNldFNlcnZpY2U6IFNpaUZhY2V0U2VydmljZSkge1xyXG4gICAgdGhpcy5zaWlGYWNldFNlcnZpY2UucmVtb3ZlRmFjZXRTZWxlY3Rpb24kLnN1YnNjcmliZSgoZnMpID0+IHtcclxuICAgICAgdGhpcy5yZW1vdmVGYWNldFNlbGVjdGlvbkZyb21GYWNldFN1bW1hcnlDYWxsYmFjayhmcyk7XHJcbiAgICB9KTtcclxuICAgIHRoaXMuc2lpRmFjZXRTZXJ2aWNlLnJlbW92ZUFsbEZhY2V0U2VsZWN0aW9uJC5zdWJzY3JpYmUoKCkgPT4ge1xyXG4gICAgICB0aGlzLnJlbW92ZUFsbFNlbGVjdGlvbnMoKTtcclxuICAgIH0pO1xyXG4gICAgdGhpcy5zaWlGYWNldFNlcnZpY2UuY2hhbmdlRmFjZXRzUmVxdWVzdE9icy5zdWJzY3JpYmUoKHJlcToge2ZhY2V0czogb2JqZWN0LCByZXNldDogYm9vbGVhbn0pID0+IHtcclxuICAgICAgaWYocmVxLmZhY2V0cy5oYXNPd25Qcm9wZXJ0eSh0aGlzLmNvbmZpZy5uYW1lKSl7XHJcbiAgICAgICAgdGhpcy5jaGFuZ2VGYWNldHMocmVxLmZhY2V0c1t0aGlzLmNvbmZpZy5uYW1lXSk7XHJcbiAgICAgIH1lbHNlIGlmKHJlcS5yZXNldCl7XHJcbiAgICAgICAgdGhpcy5yZW1vdmVBbGxTZWxlY3Rpb25zKCk7XHJcbiAgICAgIH1cclxuICAgIH0pXHJcbiAgfVxyXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpOiB2b2lkIHtcclxuICAgIGlmKCEhY2hhbmdlcy5jb25maWcpe1xyXG4gICAgICBpZih0aGlzLmZhY2V0U2VsZWN0aW9uPy5maW5kKGkgPT4gISFpLm1pc3MpICE9IG51bGwpe1xyXG4gICAgICAgIHRoaXMuZmFjZXRTZWxlY3Rpb24gPSB0aGlzLmV4dHJhY3RGYWNldEZyb21MaXN0KHRoaXMuZmFjZXRTZWxlY3Rpb24ubWFwKGkgPT4gaS5jb2RlKSk7XHJcbiAgICAgICAgdGhpcy5mYWNldFNlbGVjdGlvbj8uZmlsdGVyKGkgPT4gISFpLm1pc3MpLmZvckVhY2goaSA9PiBpLmxvc3QgPSB0cnVlKTtcclxuICAgICAgICB0aGlzLnVwZGF0ZUZhY2V0U2VsZWN0aW9uKGZhbHNlKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgbmdBZnRlclZpZXdJbml0Q2FsbGJhY2soKXt9IC8vIG92ZXJyaWRlIGRhIGRpc2NlbmRlbnRpXHJcbiAgbmdBZnRlclZpZXdJbml0KCk6IHZvaWQge1xyXG5cclxuICAgIGlmICh0aGlzLnNpaUZhY2V0U2VydmljZS5mYWNldHNIaWRlU2VsZWN0aW9uW3RoaXMuY29uZmlnLm5hbWVdID09PSB1bmRlZmluZWQpe1xyXG4gICAgICBQcm9taXNlLnJlc29sdmUoKS50aGVuKCgpID0+IHtcclxuICAgICAgICB0aGlzLnNpaUZhY2V0U2VydmljZS5mYWNldHNIaWRlU2VsZWN0aW9uW3RoaXMuY29uZmlnLm5hbWVdID0gdGhpcy5oaWRlU2VsZWN0aW9uO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgLy8gY2hlY2sgaWYgaXMgZmlyc3RJbml0XHJcbiAgICBpZiAodGhpcy5zaWlGYWNldFNlcnZpY2UuZmFjZXRzTXVsdGlwbGljaXR5W3RoaXMuY29uZmlnLm5hbWVdID09PSB1bmRlZmluZWQpe1xyXG4gICAgICBQcm9taXNlLnJlc29sdmUoKS50aGVuKCgpID0+IHtcclxuICAgICAgICB0aGlzLm11bHRpcGxpY2l0eVRvRGlzcGxheSA9IHRoaXMuaW5pdE11bHRpcGxpY2l0eVRvRGlzcGxheTtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmICh0aGlzLm11bHRpcGxpY2l0eVRvRGlzcGxheSAqIHRoaXMudmlzaWJsZUZhY2V0c1NpemUgPiB0aGlzLmNvbmZpZy5mYWNldE9wdGlvbnMubGVuZ3RoKXtcclxuICAgICAgLy8gdGhlcmUgYXJlIGxlc3MgZmFjZXRzIC4gcmVkdWNlIHRoZSBtdWx0aXBsaWNpdHkgdG8gdGhlIG1heCBhdmFpbGFibGVcclxuICAgICAgUHJvbWlzZS5yZXNvbHZlKCkudGhlbigoKSA9PiB7XHJcbiAgICAgICAgdGhpcy5tdWx0aXBsaWNpdHlUb0Rpc3BsYXkgPSBNYXRoLmNlaWwodGhpcy5jb25maWcuZmFjZXRPcHRpb25zLmxlbmd0aCAvIHRoaXMudmlzaWJsZUZhY2V0c1NpemUpO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgaWYgKHRoaXMuZmFjZXRTZWxlY3Rpb24gPT09IHVuZGVmaW5lZCl7XHJcbiAgICAgIFByb21pc2UucmVzb2x2ZSgpLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgICAgdGhpcy5zaWlGYWNldFNlcnZpY2UuaW5pdGlhbGl6ZUZhY2V0KHRoaXMuY29uZmlnLm5hbWUsIHRoaXMuZ2V0SW5pdFNlbGVjdGlvbigpKTtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIGlmICh0aGlzLnNpaUZhY2V0U2VydmljZS5mYWNldHNFeHBhbmRlZFt0aGlzLmNvbmZpZy5uYW1lXSA9PT0gdW5kZWZpbmVkKXtcclxuICAgICAgUHJvbWlzZS5yZXNvbHZlKCkudGhlbigoKSA9PiB7XHJcbiAgICAgICAgdGhpcy5mYWNldEV4cGFuZGVkID0gdGhpcy5leHBhbmRlZDtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKCB0aGlzLnNrZWxSZWYpe1xyXG4gICAgICAvLyBzZXR0byBpbiBhdXRvbWF0aWNvIGxhIGxhYmVsIHN1bCBjb21wb25lbnRlXHJcbiAgICAgIFByb21pc2UucmVzb2x2ZSgpLnRoZW4oKCkgPT4ge1xyXG4gICAgICB0aGlzLnNrZWxSZWYuc2V0TGFiZWwodGhpcy5sYWJlbCk7XHJcbiAgICAgIHRoaXMuc2tlbFJlZi5zZXRFeHBhbmRlZCh0aGlzLmZhY2V0RXhwYW5kZWQpO1xyXG4gICAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKHRoaXMuc2tlbFJlZi5leHBhbmRlZENoYW5nZS5zdWJzY3JpYmUoKGV2KSA9PiB0aGlzLmZhY2V0RXhwYW5kZWQgPSBldikpO1xyXG4gICAgfSk7XHJcbiAgICB9XHJcbiAgICB0aGlzLnNpaUZhY2V0U2VydmljZS5yZWdpc3RlckZhY2V0TGFiZWwodGhpcy5jb25maWcubmFtZSwgdGhpcy5sYWJlbCk7XHJcblxyXG4gICAgUHJvbWlzZS5yZXNvbHZlKCkudGhlbigoKSA9PiB7XHJcbiAgICAgIHRoaXMubmdBZnRlclZpZXdJbml0Q2FsbGJhY2soKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgbmdPbkRlc3Ryb3koKTogdm9pZCB7XHJcbiAgICAvLyBub3QgbmVlZGVkIHNpbmNlIGl0J3MgYSBjb2xkIG9ic2VydmFibGUgYnV0IGdvb2QgcHJhY3RpY2VcclxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy51bnN1YnNjcmliZSgpO1xyXG4gIH1cclxuXHJcbiAgcmVtb3ZlRmFjZXRTZWxlY3Rpb25Gcm9tRmFjZXRTdW1tYXJ5Q2FsbGJhY2soZnM6IFNpaUZhY2V0RHRvKXtcclxuICAgIGlmIChmcy5uYW1lID09PSB0aGlzLmNvbmZpZy5uYW1lKXtcclxuICAgICAgZm9yIChjb25zdCBvcCBpbiBmcy5mYWNldE9wdGlvbnMpe1xyXG4gICAgICAgIGlmICggZnMuZmFjZXRPcHRpb25zW29wXSAhPSBudWxsKXtcclxuICAgICAgICAgIHRoaXMucmVtb3ZlU2VsZWN0aW9uKGZzLmZhY2V0T3B0aW9uc1tvcF0pO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZ2V0SW5pdFNlbGVjdGlvbigpe1xyXG4gICAgaWYgKHRoaXMuc2lpRmFjZXRTZXJ2aWNlLl9pbml0RmFjZXRUb1NldC5mYWNldHNbdGhpcy5jb25maWcubmFtZV0gIT09IHVuZGVmaW5lZCl7XHJcbiAgICAgIGNvbnN0IGZjdHMgPSB0aGlzLmV4dHJhY3RGYWNldEZyb21MaXN0KHRoaXMuc2lpRmFjZXRTZXJ2aWNlLl9pbml0RmFjZXRUb1NldC5mYWNldHNbdGhpcy5jb25maWcubmFtZV0gKTtcclxuICAgICAgZmN0cy5maWx0ZXIoaSA9PiAhIWkubWlzcykuZm9yRWFjaChpID0+IGkubG9zdCA9IHRydWUpO1xyXG4gICAgICByZXR1cm4gZmN0cztcclxuXHJcbiAgICB9ZWxzZXtcclxuICAgICAgcmV0dXJuIHRoaXMub3B0aW9uc0luaXRWYWx1ZSB8fCBbXTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHByaXZhdGUgZXh0cmFjdEZhY2V0RnJvbUxpc3QoaXRlbXM6IEFycmF5PGFueT4pe1xyXG4gICAgY29uc3QgaXRlbXNUb0FkZCA9IFtdO1xyXG4gICAgY29uc3QgaW5pdFZhbCA9IFsuLi5pdGVtc107XHJcbiAgICB0aGlzLmNvbmZpZy5mYWNldE9wdGlvbnM/LmZvckVhY2gob3AgPT4ge1xyXG4gICAgICBjb25zdCBpbml0SW5kZXggPSBpbml0VmFsLmluZGV4T2Yob3AuY29kZSk7XHJcbiAgICAgIGlmIChpbml0SW5kZXggIT09IC0xICl7XHJcbiAgICAgICAgaXRlbXNUb0FkZC5wdXNoKG9wKTtcclxuICAgICAgICBpbml0VmFsLnNwbGljZShpbml0SW5kZXgsIDEpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICBpZiAoaW5pdFZhbC5sZW5ndGggPiAwKXtcclxuICAgICAgLy8gaW5pdCBmYWNldCBub3QgaW4gb3B0aW9ucy5cclxuICAgICAgY29uc29sZS5sb2coJ2ZhY2V0IG5vbiBwcmVzZW50aT0nLCBpbml0VmFsKTtcclxuICAgICAgaW5pdFZhbC5mb3JFYWNoKGl2ID0+IHtcclxuICAgICAgICBjb25zdCBtaXNzT3AgPSB7Y29kZTogaXYsIGRlc2NyOiAnISEnICsgaXYsIGNvdW50OiAwLCBtaXNzOiB0cnVlfTtcclxuICAgICAgICBpdGVtc1RvQWRkLnB1c2gobWlzc09wKTtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGl0ZW1zVG9BZGQ7XHJcbiAgfVxyXG5cclxuICBhZGRTZWxlY3Rpb24oaXRlbTogU2lpRmFjZXRPcHRpb25EdG8pe1xyXG4gICAgdGhpcy5mYWNldFNlbGVjdGlvbi5wdXNoKGl0ZW0pO1xyXG4gICAgdGhpcy51cGRhdGVGYWNldFNlbGVjdGlvbigpO1xyXG4gIH1cclxuXHJcbiAgcmVtb3ZlU2VsZWN0aW9uKGl0ZW06IFNpaUZhY2V0T3B0aW9uRHRvLCAgcHJvcGFnYXRlPXRydWUpe1xyXG4gICAgY29uc3QgaSA9IHRoaXMuZmFjZXRTZWxlY3Rpb24uZmluZEluZGV4KChlKSA9PiBlLmNvZGUgPT09IGl0ZW0uY29kZSk7XHJcbiAgICBpZiAoaSAhPT0gLTEpe1xyXG4gICAgICB0aGlzLmZhY2V0U2VsZWN0aW9uLnNwbGljZShpLCAxKTtcclxuICAgICAgdGhpcy51cGRhdGVGYWNldFNlbGVjdGlvbihwcm9wYWdhdGUpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmVtb3ZlQWxsU2VsZWN0aW9ucygpe1xyXG4gICAgdGhpcy5mYWNldFNlbGVjdGlvbiA9IHRoaXMub3B0aW9uc0luaXRWYWx1ZTtcclxuICAgIHRoaXMudXBkYXRlRmFjZXRTZWxlY3Rpb24oZmFsc2UpO1xyXG4gIH1cclxuXHJcbiAgY2hhbmdlRmFjZXRzKGZhY2V0czogQXJyYXk8c3RyaW5nPil7XHJcbiAgICB0aGlzLmZhY2V0U2VsZWN0aW9uID0gdGhpcy5leHRyYWN0RmFjZXRGcm9tTGlzdChmYWNldHMpO1xyXG4gICAgdGhpcy51cGRhdGVGYWNldFNlbGVjdGlvbih0cnVlKTtcclxuICB9XHJcblxyXG4gIHRvZ2dsZShvcHQ6IFNpaUZhY2V0T3B0aW9uRHRvKXsgLy8gY2hpYW1hdG8gZGEgc2lpLWZhY2V0LXNlYXJjaFxyXG4gICAgdGhpcy5zZWxlY3RlZEZhY2V0c1tvcHQuY29kZV0gPT09IHVuZGVmaW5lZCA/IHRoaXMuYWRkU2VsZWN0aW9uKG9wdCkgOiB0aGlzLnJlbW92ZVNlbGVjdGlvbihvcHQpO1xyXG4gIH1cclxuXHJcbiAgdXBkYXRlRmFjZXRTZWxlY3Rpb24ocHJvcGFnYXRlQ2hhbmdlPSB0cnVlKXtcclxuICAgIHRoaXMuc2lpRmFjZXRTZXJ2aWNlLmZhY2V0Q2hhbmdlKFxyXG4gICAgICB7XHJcbiAgICAgICAgZmFjZXRPcHRpb25zOiB0aGlzLmZhY2V0U2VsZWN0aW9uLFxyXG4gICAgICAgIG5hbWU6IHRoaXMuY29uZmlnLm5hbWVcclxuICAgICAgfSxcclxuICAgICAgcHJvcGFnYXRlQ2hhbmdlXHJcbiAgICAgICk7XHJcblxyXG4gIH1cclxuXHJcbiAgaW5zdGFuY2VPZlNpaUZhY2V0T3B0aW9uRHRvKG9iamVjdDogYW55KTogb2JqZWN0IGlzIFNpaUZhY2V0T3B0aW9uRHRvIHtcclxuICAgIHJldHVybiAob2JqZWN0IGluc3RhbmNlb2YgT2JqZWN0KSAmJiAoJ2NvZGUnIGluIG9iamVjdCAgJiYgJ2Rlc2NyJyBpbiBvYmplY3QpO1xyXG4gIH1cclxuXHJcbn1cclxuIl19