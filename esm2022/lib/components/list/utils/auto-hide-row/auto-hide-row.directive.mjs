import { Directive, Input } from '@angular/core';
import * as i0 from "@angular/core";
export class AutoHideRowDirective {
    get id() {
        return this.siiAutoHideRow;
    }
    get offsetTop() {
        return !!this.targetItem ? this.targetItem.getBoundingClientRect().bottom : 0;
    }
    get targetItem() {
        return this.isVisible ? this.el.nativeElement.previousElementSibling.firstChild.firstChild : this.fakeElement;
    }
    constructor(el, templateRef, viewContainer) {
        this.el = el;
        this.templateRef = templateRef;
        this.viewContainer = viewContainer;
        this.isVisible = false;
    }
    ngOnDestroy() {
        if (!!this.fakeElement) {
            this.fakeElement.parentNode.removeChild(this.fakeElement);
            this.fakeElement = null;
        }
    }
    ngOnInit() {
        this.show();
    }
    createFakeItem() {
        const fi = document.createElement('span');
        // fi.classList.add('gluglu');
        // fi.classList.add('glu' + this.id);
        const cs = window.getComputedStyle(this.targetItem);
        // Array.from(cs).forEach(key => fi.style.setProperty(key, cs.getPropertyValue(key), cs.getPropertyPriority(key)));
        fi.style.height = cs.height;
        fi.style.width = cs.width;
        fi.style.minHeight = cs.minHeight;
        fi.style.minWidth = cs.minWidth;
        fi.style.padding = cs.padding;
        fi.style.margin = cs.margin;
        fi.style.border = cs.border;
        fi.style.flex = cs.flex;
        // fi.style.backgroundColor = 'gray';
        // fi.innerHTML = this.id;
        return fi;
    }
    hide() {
        if (this.isVisible) {
            this.fakeElement = this.createFakeItem();
            this.el.nativeElement.parentNode.insertBefore(this.fakeElement, this.el.nativeElement.previousElementSibling);
            this.viewContainer.clear();
            this.isVisible = false;
        }
    }
    show() {
        if (!this.isVisible) {
            this.viewContainer.createEmbeddedView(this.templateRef);
            this.isVisible = true;
            if (!!this.fakeElement) {
                this.fakeElement.parentNode.removeChild(this.fakeElement);
                this.fakeElement = null;
            }
        }
    }
    refresh() {
        this.fakeElement.parentNode.removeChild(this.fakeElement);
        this.viewContainer.createEmbeddedView(this.templateRef);
        this.isVisible = true;
        setTimeout(() => {
            // Promise.resolve().then(() => {
            this.fakeElement = this.createFakeItem();
            this.viewContainer.clear();
            this.isVisible = false;
            this.el.nativeElement.parentNode.insertBefore(this.fakeElement, this.el.nativeElement.previousElementSibling);
            // });
        }, 0);
    }
    check(refresh = false) {
        if (this.offsetTop < -1000) {
            if (refresh && !this.isVisible) {
                this.refresh();
            }
            else {
                this.hide();
            }
        }
        else {
            this.show();
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: AutoHideRowDirective, deps: [{ token: i0.ElementRef }, { token: i0.TemplateRef }, { token: i0.ViewContainerRef }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "18.2.13", type: AutoHideRowDirective, isStandalone: true, selector: "[siiAutoHideRow]", inputs: { siiAutoHideRow: "siiAutoHideRow" }, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: AutoHideRowDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[siiAutoHideRow]',
                    standalone: true
                }]
        }], ctorParameters: () => [{ type: i0.ElementRef }, { type: i0.TemplateRef }, { type: i0.ViewContainerRef }], propDecorators: { siiAutoHideRow: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0by1oaWRlLXJvdy5kaXJlY3RpdmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9zaWktdG9vbGtpdC9zcmMvbGliL2NvbXBvbmVudHMvbGlzdC91dGlscy9hdXRvLWhpZGUtcm93L2F1dG8taGlkZS1yb3cuZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQWMsS0FBSyxFQUFvRCxNQUFNLGVBQWUsQ0FBQzs7QUFNL0csTUFBTSxPQUFPLG9CQUFvQjtJQUUvQixJQUFXLEVBQUU7UUFDWCxPQUFPLElBQUksQ0FBQyxjQUFjLENBQUM7SUFDN0IsQ0FBQztJQUNELElBQVcsU0FBUztRQUNsQixPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLHFCQUFxQixFQUFFLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDaEYsQ0FBQztJQUVELElBQVksVUFBVTtRQUNwQixPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsYUFBYSxDQUFDLHNCQUFzQixDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUM7SUFDaEgsQ0FBQztJQUlELFlBQW1CLEVBQWMsRUFBVyxXQUE2QixFQUFhLGFBQStCO1FBQWxHLE9BQUUsR0FBRixFQUFFLENBQVk7UUFBVyxnQkFBVyxHQUFYLFdBQVcsQ0FBa0I7UUFBYSxrQkFBYSxHQUFiLGFBQWEsQ0FBa0I7UUFEckgsY0FBUyxHQUFHLEtBQUssQ0FBQztJQUVqQixDQUFDO0lBQ0YsV0FBVztRQUNULElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUMsQ0FBQztZQUN0QixJQUFJLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxX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UyxHQUFHLEtBQUssQ0FBQztZQUN2QixJQUFJLENBQUMsRUFBRSxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLEVBQUUsQ0FBQyxhQUFhLENBQUMsc0JBQXNCLENBQUMsQ0FBQztZQUM1RyxNQUFNO1FBQ1IsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBRVAsQ0FBQztJQUVELEtBQUssQ0FBQyxPQUFPLEdBQUUsS0FBSztRQUNsQixJQUFJLElBQUksQ0FBQyxTQUFTLEdBQUcsQ0FBQyxJQUFJLEVBQUMsQ0FBQztZQUMzQixJQUFJLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztnQkFDL0IsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO1lBQ2pCLENBQUM7aUJBQUksQ0FBQztnQkFDSixJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDZCxDQUFDO1FBRUgsQ0FBQzthQUFJLENBQUM7WUFDSixJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDYixDQUFDO0lBQ0gsQ0FBQzsrR0EvRlMsb0JBQW9CO21HQUFwQixvQkFBb0I7OzRGQUFwQixvQkFBb0I7a0JBSmhDLFNBQVM7bUJBQUM7b0JBQ1AsUUFBUSxFQUFFLGtCQUFrQjtvQkFDNUIsVUFBVSxFQUFFLElBQUk7aUJBQ25CO3dJQUVVLGNBQWM7c0JBQXRCLEtBQUsiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBEaXJlY3RpdmUsIEVsZW1lbnRSZWYsIElucHV0LCBPbkRlc3Ryb3ksIE9uSW5pdCwgVGVtcGxhdGVSZWYsIFZpZXdDb250YWluZXJSZWYgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuXHJcbkBEaXJlY3RpdmUoe1xyXG4gICAgc2VsZWN0b3I6ICdbc2lpQXV0b0hpZGVSb3ddJyxcclxuICAgIHN0YW5kYWxvbmU6IHRydWVcclxufSlcclxuZXhwb3J0IGNsYXNzIEF1dG9IaWRlUm93RGlyZWN0aXZlIGltcGxlbWVudHMgT25Jbml0LCBPbkRlc3Ryb3l7XHJcbiAgQElucHV0KCkgc2lpQXV0b0hpZGVSb3c6IHN0cmluZztcclxuICBwdWJsaWMgZ2V0IGlkKCl7XHJcbiAgICByZXR1cm4gdGhpcy5zaWlBdXRvSGlkZVJvdztcclxuICB9XHJcbiAgcHVibGljIGdldCBvZmZzZXRUb3AoKXtcclxuICAgIHJldHVybiAhIXRoaXMudGFyZ2V0SXRlbSA/IHRoaXMudGFyZ2V0SXRlbS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5ib3R0b20gOiAwO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBnZXQgdGFyZ2V0SXRlbSgpe1xyXG4gICAgcmV0dXJuIHRoaXMuaXNWaXNpYmxlID8gdGhpcy5lbC5uYXRpdmVFbGVtZW50LnByZXZpb3VzRWxlbWVudFNpYmxpbmcuZmlyc3RDaGlsZC5maXJzdENoaWxkIDogdGhpcy5mYWtlRWxlbWVudDtcclxuICB9XHJcblxyXG4gIGZha2VFbGVtZW50O1xyXG4gIGlzVmlzaWJsZSA9IGZhbHNlO1xyXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBlbDogRWxlbWVudFJlZiwgIHByaXZhdGUgdGVtcGxhdGVSZWY6IFRlbXBsYXRlUmVmPGFueT4sICAgIHByaXZhdGUgdmlld0NvbnRhaW5lcjogVmlld0NvbnRhaW5lclJlZikge1xyXG4gICB9XHJcbiAgbmdPbkRlc3Ryb3koKTogdm9pZCB7XHJcbiAgICBpZiAoISF0aGlzLmZha2VFbGVtZW50KXtcclxuICAgICAgdGhpcy5mYWtlRWxlbWVudC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHRoaXMuZmFrZUVsZW1lbnQpO1xyXG4gICAgICB0aGlzLmZha2VFbGVtZW50ID0gbnVsbDtcclxuICAgIH1cclxuICB9XHJcbiAgbmdPbkluaXQoKTogdm9pZCB7XHJcbiAgICB0aGlzLnNob3coKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgY3JlYXRlRmFrZUl0ZW0oKXtcclxuICAgIGNvbnN0IGZpID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xyXG4gICAgLy8gZmkuY2xhc3NMaXN0LmFkZCgnZ2x1Z2x1Jyk7XHJcbiAgICAvLyBmaS5jbGFzc0xpc3QuYWRkKCdnbHUnICsgdGhpcy5pZCk7XHJcbiAgICBjb25zdCBjcyA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKHRoaXMudGFyZ2V0SXRlbSk7XHJcblxyXG4gICAgLy8gQXJyYXkuZnJvbShjcykuZm9yRWFjaChrZXkgPT4gZmkuc3R5bGUuc2V0UHJvcGVydHkoa2V5LCBjcy5nZXRQcm9wZXJ0eVZhbHVlKGtleSksIGNzLmdldFByb3BlcnR5UHJpb3JpdHkoa2V5KSkpO1xyXG4gICAgZmkuc3R5bGUuaGVpZ2h0ID0gY3MuaGVpZ2h0O1xyXG4gICAgZmkuc3R5bGUud2lkdGggPSBjcy53aWR0aDtcclxuICAgIGZpLnN0eWxlLm1pbkhlaWdodCA9IGNzLm1pbkhlaWdodDtcclxuICAgIGZpLnN0eWxlLm1pbldpZHRoID0gY3MubWluV2lkdGg7XHJcbiAgICBmaS5zdHlsZS5wYWRkaW5nID0gY3MucGFkZGluZztcclxuICAgIGZpLnN0eWxlLm1hcmdpbiA9IGNzLm1hcmdpbjtcclxuICAgIGZpLnN0eWxlLmJvcmRlciA9IGNzLmJvcmRlcjtcclxuICAgIGZpLnN0eWxlLmZsZXggPSBjcy5mbGV4O1xyXG5cclxuICAgIC8vIGZpLnN0eWxlLmJhY2tncm91bmRDb2xvciA9ICdncmF5JztcclxuICAgIC8vIGZpLmlubmVySFRNTCA9IHRoaXMuaWQ7XHJcbiAgICByZXR1cm4gZmk7XHJcblxyXG4gIH1cclxuXHJcbiAgIHB1YmxpYyBoaWRlKCl7XHJcbiAgICAgaWYgKHRoaXMuaXNWaXNpYmxlKXtcclxuICAgICAgIHRoaXMuZmFrZUVsZW1lbnQgPSB0aGlzLmNyZWF0ZUZha2VJdGVtKCk7XHJcbiAgICAgICB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUodGhpcy5mYWtlRWxlbWVudCwgdGhpcy5lbC5uYXRpdmVFbGVtZW50LnByZXZpb3VzRWxlbWVudFNpYmxpbmcpO1xyXG4gICAgICAgdGhpcy52aWV3Q29udGFpbmVyLmNsZWFyKCk7XHJcbiAgICAgICB0aGlzLmlzVmlzaWJsZSA9IGZhbHNlO1xyXG4gICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2hvdygpe1xyXG4gICAgICBpZiAoIXRoaXMuaXNWaXNpYmxlKXtcclxuICAgICAgICB0aGlzLnZpZXdDb250YWluZXIuY3JlYXRlRW1iZWRkZWRWaWV3KHRoaXMudGVtcGxhdGVSZWYpO1xyXG4gICAgICAgIHRoaXMuaXNWaXNpYmxlID0gdHJ1ZTtcclxuICAgICAgICBpZiAoISF0aGlzLmZha2VFbGVtZW50KXtcclxuICAgICAgICAgIHRoaXMuZmFrZUVsZW1lbnQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZCh0aGlzLmZha2VFbGVtZW50KTtcclxuICAgICAgICAgIHRoaXMuZmFrZUVsZW1lbnQgPSBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICB9XHJcblxyXG4gICBwcml2YXRlIHJlZnJlc2goKXtcclxuICAgIHRoaXMuZmFrZUVsZW1lbnQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZCh0aGlzLmZha2VFbGVtZW50KTtcclxuICAgIHRoaXMudmlld0NvbnRhaW5lci5jcmVhdGVFbWJlZGRlZFZpZXcodGhpcy50ZW1wbGF0ZVJlZik7XHJcbiAgICB0aGlzLmlzVmlzaWJsZSA9IHRydWU7XHJcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgIC8vIFByb21pc2UucmVzb2x2ZSgpLnRoZW4oKCkgPT4ge1xyXG4gICAgdGhpcy5mYWtlRWxlbWVudCA9IHRoaXMuY3JlYXRlRmFrZUl0ZW0oKTtcclxuICAgIHRoaXMudmlld0NvbnRhaW5lci5jbGVhcigpO1xyXG4gICAgdGhpcy5pc1Zpc2libGUgPSBmYWxzZTtcclxuICAgIHRoaXMuZWwubmF0aXZlRWxlbWVudC5wYXJlbnROb2RlLmluc2VydEJlZm9yZSh0aGlzLmZha2VFbGVtZW50LCB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQucHJldmlvdXNFbGVtZW50U2libGluZyk7XHJcbiAgICAgIC8vIH0pO1xyXG4gICAgfSwgMCk7XHJcblxyXG4gICB9XHJcblxyXG4gICBjaGVjayhyZWZyZXNoPSBmYWxzZSl7XHJcbiAgICAgaWYgKHRoaXMub2Zmc2V0VG9wIDwgLTEwMDApe1xyXG4gICAgICBpZiAocmVmcmVzaCAmJiAhdGhpcy5pc1Zpc2libGUgKXtcclxuICAgICAgICB0aGlzLnJlZnJlc2goKTtcclxuICAgICAgfWVsc2V7XHJcbiAgICAgICAgdGhpcy5oaWRlKCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICB9ZWxzZXtcclxuICAgICAgdGhpcy5zaG93KCk7XHJcbiAgICAgfVxyXG4gICB9XHJcblxyXG59XHJcbiJdfQ==