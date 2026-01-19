import { Component, HostBinding, Input, ViewChild } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { CdkObserveContent } from '@angular/cdk/observers';
import * as i0 from "@angular/core";
export class PageContentComponent {
    set width(val) {
        this.hostWidth = (val !== undefined && new RegExp(/^\d+$/g).test(val)) ? val + 'px' :
            (val !== undefined && new RegExp(/^\d+(px|vw|%)$/g).test(val)) ? val : this.defaultMinWidth;
    }
    get toolbarHeight() { return this.pctbHeightSubj.value + 'px'; }
    constructor(el, ref, zone) {
        this.el = el;
        this.ref = ref;
        this.zone = zone;
        this.defaultMinWidth = '500px';
        this.hostWidth = this.defaultMinWidth;
        this.fix = false;
        this.pctbFixedHeightSubj = new BehaviorSubject(0);
        this.pctbFixedHeight = this.pctbFixedHeightSubj.asObservable();
        this.pctbHeightSubj = new BehaviorSubject(0);
        this.pctbHeight = this.pctbHeightSubj.asObservable();
        this.pcbWidthSubj = new Subject();
        this.pcbWidth = this.pcbWidthSubj.asObservable();
        this.utils = {
            lastpctChildrensHeight: {},
            lastpctbItems: 0
        };
        this.pctbObserver = new ResizeObserver(entries => {
            this.zone.run(() => {
                if (this.utils.lastpctbItems !== entries[0].target.childElementCount) {
                    this.utils.lastpctChildrensHeight = {};
                }
                const currpctChildrensHeight = Array.from(entries[0].target.children)
                    .reduce((acc, curr) => {
                    if (!curr.classList.contains('hiddenToolbar')) {
                        acc[curr.getAttribute('siiRef')] = Math.floor(curr.getBoundingClientRect().height);
                    }
                    return acc;
                }, JSON.parse(JSON.stringify(this.utils.lastpctChildrensHeight)));
                if ((entries[0].contentRect.height !== 0 || entries[0].contentRect.height !== this.pctbFixedHeightSubj.value) &&
                    (this.utils.lastpctbItems !== entries[0].target.childElementCount || JSON.stringify(currpctChildrensHeight) !== JSON.stringify(this.utils.lastpctChildrensHeight))) {
                    this.pctbFixedHeightSubj.next(entries[0].contentRect.height);
                }
                this.pctbHeightSubj.next(entries[0].contentRect.height);
                this.utils.lastpctChildrensHeight = currpctChildrensHeight;
                this.utils.lastpctbItems = entries[0].target.childElementCount;
            });
        });
        this.pcbObserver = new ResizeObserver(entries => {
            this.zone.run(() => {
                this.pcbWidthSubj.next(entries[0].contentRect.width);
            });
        });
        window.addEventListener('pageContainerToolbarsHeightChange', () => {
            // this is a fix for pagetoolbar background image
            this.pctb.nativeElement.style.width = (this.pctb.nativeElement.offsetWidth + 1) + 'px';
            this.pctb.nativeElement.style.width = (this.pctb.nativeElement.offsetWidth - 1) + 'px';
        });
    }
    ngAfterViewInit() {
        this.pctbObserver.observe(this.pctb.nativeElement);
        this.pcbObserver.observe(this.pcb.nativeElement);
    }
    ngOnInit() {
    }
    ngOnDestroy() {
        this.pctbObserver.unobserve(this.pctb.nativeElement);
        this.pcbObserver.unobserve(this.pcb.nativeElement);
    }
    getRealWidth() {
        return parseInt(getComputedStyle(this.el.nativeElement, null).width.replace('px', ''), 10);
    }
    getMinWidthInPx() {
        if (new RegExp(/^\d+$/g).test(this.hostWidth)) {
            return parseInt(this.hostWidth, 10);
        }
        else if (new RegExp(/^\d+(px)$/g).test(this.hostWidth)) {
            return parseInt(this.hostWidth.match(/^\d+/g)[0], 10);
        }
        else if (new RegExp(/^\d+(%)$/g).test(this.hostWidth)) {
            const parentw = parseInt(getComputedStyle(this.el.nativeElement.parentElement, null).width.replace('px', ''), 10);
            return (parentw / 100) * parseInt(this.hostWidth.match(/^\d+/g)[0], 10);
        }
    }
    // getOffsetHeight(s){return s.offsetHeight+"  -  "+(new Date()).getTime(); }
    toolbarsHeightChange() {
        // this.toolbarsHeight = this.pctb.nativeElement.offsetHeight;
        this.zone.run(() => {
            this.ref.detectChanges();
        });
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: PageContentComponent, deps: [{ token: i0.ElementRef }, { token: i0.ChangeDetectorRef }, { token: i0.NgZone }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "18.2.13", type: PageContentComponent, isStandalone: true, selector: "sii-page-content", inputs: { width: "width", bodyStyle: "bodyStyle", bodyClass: "bodyClass" }, host: { properties: { "style.width": "this.hostWidth", "style.display": "this.display", "class.fix": "this.fix", "style.--pageContainerToolbarHeight": "this.toolbarHeight" } }, viewQueries: [{ propertyName: "pctb", first: true, predicate: ["pctb"], descendants: true }, { propertyName: "pcb", first: true, predicate: ["pcb"], descendants: true }], ngImport: i0, template: "<div class=\"pc-toolbars\" #pctb (cdkObserveContent)=\"toolbarsHeightChange()\" [style.width.px]=\"pcbWidth | async\">\r\n  <ng-content select=\"sii-page-content-toolbar\"  ></ng-content>\r\n</div>\r\n<div class=\"pc-body\" #pcb [style]=\"bodyStyle\" class=\"{{bodyClass}}\"  [style.marginTop.px]=\"pctbFixedHeight | async\">\r\n  <ng-content></ng-content>\r\n</div>\r\n<!-- [style.marginTop.px]=\"getOffsetHeight(pctb)\"  -->\r\n", styles: [":host{flex:1 1 auto;max-width:100vw}.pc-body{display:flex;flex-direction:column;position:relative}.pc-toolbars{position:fixed;background-size:cover;background-repeat:no-repeat;background-image:linear-gradient(-186.39deg,#090909 -7.89%,#161721 26.77%,#000 59.41%,#323551 94.42%);background-attachment:fixed;z-index:1;top:calc(var(--toolbarHeight) + var(--pageContentToolbarsContainerHeight) + var(--headerHeight))}:host::ng-deep sii-page-content-toolbar.hiddenToolbar{display:none}:host::ng-deep sii-page-content-toolbar:not(.hiddenToolbar)+sii-page-content-toolbar:not(:first-child) .pct_container_filterButton{display:none}\n"], dependencies: [{ kind: "directive", type: CdkObserveContent, selector: "[cdkObserveContent]", inputs: ["cdkObserveContentDisabled", "debounce"], outputs: ["cdkObserveContent"], exportAs: ["cdkObserveContent"] }, { kind: "pipe", type: AsyncPipe, name: "async" }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: PageContentComponent, decorators: [{
            type: Component,
            args: [{ selector: 'sii-page-content', standalone: true, imports: [CdkObserveContent, AsyncPipe], template: "<div class=\"pc-toolbars\" #pctb (cdkObserveContent)=\"toolbarsHeightChange()\" [style.width.px]=\"pcbWidth | async\">\r\n  <ng-content select=\"sii-page-content-toolbar\"  ></ng-content>\r\n</div>\r\n<div class=\"pc-body\" #pcb [style]=\"bodyStyle\" class=\"{{bodyClass}}\"  [style.marginTop.px]=\"pctbFixedHeight | async\">\r\n  <ng-content></ng-content>\r\n</div>\r\n<!-- [style.marginTop.px]=\"getOffsetHeight(pctb)\"  -->\r\n", styles: [":host{flex:1 1 auto;max-width:100vw}.pc-body{display:flex;flex-direction:column;position:relative}.pc-toolbars{position:fixed;background-size:cover;background-repeat:no-repeat;background-image:linear-gradient(-186.39deg,#090909 -7.89%,#161721 26.77%,#000 59.41%,#323551 94.42%);background-attachment:fixed;z-index:1;top:calc(var(--toolbarHeight) + var(--pageContentToolbarsContainerHeight) + var(--headerHeight))}:host::ng-deep sii-page-content-toolbar.hiddenToolbar{display:none}:host::ng-deep sii-page-content-toolbar:not(.hiddenToolbar)+sii-page-content-toolbar:not(:first-child) .pct_container_filterButton{display:none}\n"] }]
        }], ctorParameters: () => [{ type: i0.ElementRef }, { type: i0.ChangeDetectorRef }, { type: i0.NgZone }], propDecorators: { hostWidth: [{
                type: HostBinding,
                args: ['style.width']
            }], display: [{
                type: HostBinding,
                args: ['style.display']
            }], fix: [{
                type: HostBinding,
                args: ['class.fix']
            }], width: [{
                type: Input
            }], bodyStyle: [{
                type: Input
            }], bodyClass: [{
                type: Input
            }], pctb: [{
                type: ViewChild,
                args: ['pctb', { static: false }]
            }], pcb: [{
                type: ViewChild,
                args: ['pcb', { static: false }]
            }], toolbarHeight: [{
                type: HostBinding,
                args: ['style.--pageContainerToolbarHeight']
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFnZS1jb250ZW50LmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL3NpaS10b29sa2l0L3NyYy9saWIvY29tcG9uZW50cy9wYWdlLWNvbnRhaW5lci9wYWdlLWNvbnRlbnQvcGFnZS1jb250ZW50LmNvbXBvbmVudC50cyIsIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL3NpaS10b29sa2l0L3NyYy9saWIvY29tcG9uZW50cy9wYWdlLWNvbnRhaW5lci9wYWdlLWNvbnRlbnQvcGFnZS1jb250ZW50LmNvbXBvbmVudC5odG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBb0MsU0FBUyxFQUFjLFdBQVcsRUFBRSxLQUFLLEVBQTZCLFNBQVMsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUNsSixPQUFPLEVBQUUsZUFBZSxFQUFFLE9BQU8sRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUVoRCxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDNUMsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sd0JBQXdCLENBQUM7O0FBUzNELE1BQU0sT0FBTyxvQkFBb0I7SUFNL0IsSUFBYSxLQUFLLENBQUMsR0FBRztRQUNwQixJQUFJLENBQUMsU0FBUyxHQUFHLENBQUMsR0FBRyxLQUFLLFNBQVMsSUFBSSxJQUFJLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxDQUFDO1lBQ3JFLENBQUMsR0FBRyxLQUFLLFNBQVMsSUFBSSxJQUFJLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFFLElBQUksQ0FBQyxlQUFlLENBQUM7SUFDL0csQ0FBQztJQU9E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InNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFmdGVyVmlld0luaXQsIENoYW5nZURldGVjdG9yUmVmLCBDb21wb25lbnQsIEVsZW1lbnRSZWYsIEhvc3RCaW5kaW5nLCBJbnB1dCwgTmdab25lLCBPbkRlc3Ryb3ksIE9uSW5pdCwgVmlld0NoaWxkIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IEJlaGF2aW9yU3ViamVjdCwgU3ViamVjdCB9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQgeyBkZWJvdW5jZVRpbWUgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XHJcbmltcG9ydCB7IEFzeW5jUGlwZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XHJcbmltcG9ydCB7IENka09ic2VydmVDb250ZW50IH0gZnJvbSAnQGFuZ3VsYXIvY2RrL29ic2VydmVycyc7XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICAgIHNlbGVjdG9yOiAnc2lpLXBhZ2UtY29udGVudCcsXHJcbiAgICB0ZW1wbGF0ZVVybDogJy4vcGFnZS1jb250ZW50LmNvbXBvbmVudC5odG1sJyxcclxuICAgIHN0eWxlVXJsczogWycuL3BhZ2UtY29udGVudC5jb21wb25lbnQuc2NzcyddLFxyXG4gICAgc3RhbmRhbG9uZTogdHJ1ZSxcclxuICAgIGltcG9ydHM6IFtDZGtPYnNlcnZlQ29udGVudCwgQXN5bmNQaXBlXVxyXG59KVxyXG5leHBvcnQgY2xhc3MgUGFnZUNvbnRlbnRDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQgLCBPbkRlc3Ryb3kgLCBBZnRlclZpZXdJbml0e1xyXG5cclxuICBkZWZhdWx0TWluV2lkdGggPSAnNTAwcHgnO1xyXG4gIEBIb3N0QmluZGluZygnc3R5bGUud2lkdGgnKWhvc3RXaWR0aCA9IHRoaXMuZGVmYXVsdE1pbldpZHRoO1xyXG4gIEBIb3N0QmluZGluZygnc3R5bGUuZGlzcGxheScpIGRpc3BsYXk7XHJcbiAgQEhvc3RCaW5kaW5nKCdjbGFzcy5maXgnKSBmaXggPSBmYWxzZTtcclxuICBASW5wdXQoKSBzZXQgd2lkdGgodmFsKXtcclxuICAgIHRoaXMuaG9zdFdpZHRoID0gKHZhbCAhPT0gdW5kZWZpbmVkICYmIG5ldyBSZWdFeHAoL15cXGQrJC9nKS50ZXN0KHZhbCkpID8gdmFsICsgJ3B4JyA6XHJcbiAgICAgICAgICAgICAgICAgICAgKHZhbCAhPT0gdW5kZWZpbmVkICYmIG5ldyBSZWdFeHAoL15cXGQrKHB4fHZ3fCUpJC9nKS50ZXN0KHZhbCkpID8gdmFsIDogIHRoaXMuZGVmYXVsdE1pbldpZHRoO1xyXG4gIH1cclxuICBASW5wdXQoKSBib2R5U3R5bGU7XHJcbiAgQElucHV0KCkgYm9keUNsYXNzO1xyXG5cclxuICBAVmlld0NoaWxkKCdwY3RiJywgeyBzdGF0aWM6IGZhbHNlIH0pICBwY3RiOiBFbGVtZW50UmVmO1xyXG4gIEBWaWV3Q2hpbGQoJ3BjYicsIHsgc3RhdGljOiBmYWxzZSB9KSAgcGNiOiBFbGVtZW50UmVmO1xyXG5cclxuICBASG9zdEJpbmRpbmcoJ3N0eWxlLi0tcGFnZUNvbnRhaW5lclRvb2xiYXJIZWlnaHQnKSAgZ2V0IHRvb2xiYXJIZWlnaHQoKXsgcmV0dXJuIHRoaXMucGN0YkhlaWdodFN1YmoudmFsdWUgKyAncHgnOyB9XHJcblxyXG4gIHBjdGJGaXhlZEhlaWdodFN1YmogPSBuZXcgQmVoYXZpb3JTdWJqZWN0PG51bWJlcj4oMCk7XHJcbiAgcGN0YkZpeGVkSGVpZ2h0ID0gdGhpcy5wY3RiRml4ZWRIZWlnaHRTdWJqLmFzT2JzZXJ2YWJsZSgpO1xyXG5cclxuXHJcbiAgcGN0YkhlaWdodFN1YmogPSBuZXcgQmVoYXZpb3JTdWJqZWN0PG51bWJlcj4oMCk7XHJcbiAgcGN0YkhlaWdodCA9IHRoaXMucGN0YkhlaWdodFN1YmouYXNPYnNlcnZhYmxlKCk7XHJcblxyXG4gIHBjYldpZHRoU3ViaiA9IG5ldyBTdWJqZWN0PG51bWJlcj4oKTtcclxuICBwY2JXaWR0aCA9IHRoaXMucGNiV2lkdGhTdWJqLmFzT2JzZXJ2YWJsZSgpO1xyXG5cclxuICBwY3RiT2JzZXJ2ZXI7XHJcbiAgcGNiT2JzZXJ2ZXI7XHJcblxyXG4gIHV0aWxzID0ge1xyXG4gICAgbGFzdHBjdENoaWxkcmVuc0hlaWdodDoge30sXHJcbiAgICBsYXN0cGN0Ykl0ZW1zOiAwXHJcbiAgfTtcclxuXHJcbiAgY29uc3RydWN0b3IocHVibGljICBlbDogRWxlbWVudFJlZiwgcHJpdmF0ZSByZWY6IENoYW5nZURldGVjdG9yUmVmLCAgcHJpdmF0ZSB6b25lOiBOZ1pvbmUpIHtcclxuXHJcblxyXG4gIHRoaXMucGN0Yk9ic2VydmVyID0gbmV3IFJlc2l6ZU9ic2VydmVyKGVudHJpZXMgPT4ge1xyXG4gICAgdGhpcy56b25lLnJ1bigoKSA9PiB7XHJcbiAgICAgICAgaWYgKHRoaXMudXRpbHMubGFzdHBjdGJJdGVtcyAhPT0gZW50cmllc1swXS50YXJnZXQuY2hpbGRFbGVtZW50Q291bnQpe1xyXG4gICAgICAgICAgdGhpcy51dGlscy5sYXN0cGN0Q2hpbGRyZW5zSGVpZ2h0ID0ge307XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBjdXJycGN0Q2hpbGRyZW5zSGVpZ2h0ID0gQXJyYXkuZnJvbShlbnRyaWVzWzBdLnRhcmdldC5jaGlsZHJlbilcclxuICAgICAgICAucmVkdWNlKChhY2MsIGN1cnIpID0+IHtcclxuICAgICAgICAgIGlmICghY3Vyci5jbGFzc0xpc3QuY29udGFpbnMoJ2hpZGRlblRvb2xiYXInKSl7XHJcbiAgICAgICAgICAgIGFjY1tjdXJyLmdldEF0dHJpYnV0ZSgnc2lpUmVmJyldID0gTWF0aC5mbG9vcihjdXJyLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmhlaWdodCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICByZXR1cm4gYWNjOyB9ICwgSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeSh0aGlzLnV0aWxzLmxhc3RwY3RDaGlsZHJlbnNIZWlnaHQpKSk7XHJcblxyXG4gICAgICAgIGlmICggKCBlbnRyaWVzWzBdLmNvbnRlbnRSZWN0LmhlaWdodCAhPT0gMCB8fCBlbnRyaWVzWzBdLmNvbnRlbnRSZWN0LmhlaWdodCAhPT0gdGhpcy5wY3RiRml4ZWRIZWlnaHRTdWJqLnZhbHVlKSAgJiZcclxuICAgICAgICAgICh0aGlzLnV0aWxzLmxhc3RwY3RiSXRlbXMgIT09IGVudHJpZXNbMF0udGFyZ2V0LmNoaWxkRWxlbWVudENvdW50IHx8ICBKU09OLnN0cmluZ2lmeShjdXJycGN0Q2hpbGRyZW5zSGVpZ2h0KSAhPT0gSlNPTi5zdHJpbmdpZnkodGhpcy51dGlscy5sYXN0cGN0Q2hpbGRyZW5zSGVpZ2h0KSkpe1xyXG4gICAgICAgICAgdGhpcy5wY3RiRml4ZWRIZWlnaHRTdWJqLm5leHQoZW50cmllc1swXS5jb250ZW50UmVjdC5oZWlnaHQpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMucGN0YkhlaWdodFN1YmoubmV4dChlbnRyaWVzWzBdLmNvbnRlbnRSZWN0LmhlaWdodCk7XHJcbiAgICAgICAgdGhpcy51dGlscy5sYXN0cGN0Q2hpbGRyZW5zSGVpZ2h0ID0gY3VycnBjdENoaWxkcmVuc0hlaWdodDtcclxuICAgICAgICB0aGlzLnV0aWxzLmxhc3RwY3RiSXRlbXMgPSBlbnRyaWVzWzBdLnRhcmdldC5jaGlsZEVsZW1lbnRDb3VudDtcclxuXHJcbiAgICB9KTtcclxuICB9KTtcclxuICB0aGlzLnBjYk9ic2VydmVyID0gbmV3IFJlc2l6ZU9ic2VydmVyKGVudHJpZXMgPT4ge1xyXG4gICAgdGhpcy56b25lLnJ1bigoKSA9PiB7XHJcbiAgICAgIHRoaXMucGNiV2lkdGhTdWJqLm5leHQoZW50cmllc1swXS5jb250ZW50UmVjdC53aWR0aCk7XHJcbiAgICB9KTtcclxuICB9KTtcclxuXHJcbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3BhZ2VDb250YWluZXJUb29sYmFyc0hlaWdodENoYW5nZScsICgpID0+IHtcclxuICAgIC8vIHRoaXMgaXMgYSBmaXggZm9yIHBhZ2V0b29sYmFyIGJhY2tncm91bmQgaW1hZ2VcclxuICAgIHRoaXMucGN0Yi5uYXRpdmVFbGVtZW50LnN0eWxlLndpZHRoID0gKHRoaXMucGN0Yi5uYXRpdmVFbGVtZW50Lm9mZnNldFdpZHRoICsgMSkgKyAncHgnO1xyXG4gICAgdGhpcy5wY3RiLm5hdGl2ZUVsZW1lbnQuc3R5bGUud2lkdGggPSAodGhpcy5wY3RiLm5hdGl2ZUVsZW1lbnQub2Zmc2V0V2lkdGggLSAxKSArICdweCc7XHJcbn0pO1xyXG5cclxufVxyXG5cclxubmdBZnRlclZpZXdJbml0KCk6IHZvaWQge1xyXG4gIHRoaXMucGN0Yk9ic2VydmVyLm9ic2VydmUodGhpcy5wY3RiLm5hdGl2ZUVsZW1lbnQpO1xyXG4gIHRoaXMucGNiT2JzZXJ2ZXIub2JzZXJ2ZSh0aGlzLnBjYi5uYXRpdmVFbGVtZW50KTtcclxuICB9XHJcblxyXG4gIG5nT25Jbml0KCk6IHZvaWQge1xyXG4gIH1cclxuXHJcbiAgbmdPbkRlc3Ryb3koKSB7XHJcbiAgICB0aGlzLnBjdGJPYnNlcnZlci51bm9ic2VydmUodGhpcy5wY3RiLm5hdGl2ZUVsZW1lbnQpO1xyXG4gICAgdGhpcy5wY2JPYnNlcnZlci51bm9ic2VydmUodGhpcy5wY2IubmF0aXZlRWxlbWVudCk7XHJcbiAgfVxyXG5cclxuICBnZXRSZWFsV2lkdGgoKXsgLy8gbGFyZ2hlenphIGVmZmV0dGl2YVxyXG4gICAgcmV0dXJuIHBhcnNlSW50KGdldENvbXB1dGVkU3R5bGUodGhpcy5lbC5uYXRpdmVFbGVtZW50LCBudWxsKS53aWR0aC5yZXBsYWNlKCdweCcsICcnKSwgMTApO1xyXG4gIH1cclxuXHJcbiAgZ2V0TWluV2lkdGhJblB4KCk6IG51bWJlcntcclxuICAgIGlmIChuZXcgUmVnRXhwKC9eXFxkKyQvZykudGVzdCh0aGlzLmhvc3RXaWR0aCkpe1xyXG4gICAgICByZXR1cm4gcGFyc2VJbnQodGhpcy5ob3N0V2lkdGgsIDEwKTtcclxuICAgIH1lbHNlIGlmIChuZXcgUmVnRXhwKC9eXFxkKyhweCkkL2cpLnRlc3QodGhpcy5ob3N0V2lkdGgpKXtcclxuICAgICAgcmV0dXJuIHBhcnNlSW50KHRoaXMuaG9zdFdpZHRoLm1hdGNoKC9eXFxkKy9nKVswXSwgMTApO1xyXG4gICAgfWVsc2UgaWYgKG5ldyBSZWdFeHAoL15cXGQrKCUpJC9nKS50ZXN0KHRoaXMuaG9zdFdpZHRoKSl7XHJcbiAgICAgIGNvbnN0IHBhcmVudHcgPSBwYXJzZUludChnZXRDb21wdXRlZFN0eWxlKHRoaXMuZWwubmF0aXZlRWxlbWVudC5wYXJlbnRFbGVtZW50LCBudWxsKS53aWR0aC5yZXBsYWNlKCdweCcsICcnKSwgMTApO1xyXG4gICAgICByZXR1cm4gKHBhcmVudHcgLyAxMDApICogcGFyc2VJbnQodGhpcy5ob3N0V2lkdGgubWF0Y2goL15cXGQrL2cpWzBdLCAxMCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvLyBnZXRPZmZzZXRIZWlnaHQocyl7cmV0dXJuIHMub2Zmc2V0SGVpZ2h0K1wiICAtICBcIisobmV3IERhdGUoKSkuZ2V0VGltZSgpOyB9XHJcblxyXG4gIHRvb2xiYXJzSGVpZ2h0Q2hhbmdlKCl7XHJcbiAgICAgIC8vIHRoaXMudG9vbGJhcnNIZWlnaHQgPSB0aGlzLnBjdGIubmF0aXZlRWxlbWVudC5vZmZzZXRIZWlnaHQ7XHJcbiAgICAgIHRoaXMuem9uZS5ydW4oKCkgPT4ge1xyXG4gICAgICAgIHRoaXMucmVmLmRldGVjdENoYW5nZXMoKTtcclxuICAgICAgfSk7XHJcbiAgfVxyXG59XHJcbiIsIjxkaXYgY2xhc3M9XCJwYy10b29sYmFyc1wiICNwY3RiIChjZGtPYnNlcnZlQ29udGVudCk9XCJ0b29sYmFyc0hlaWdodENoYW5nZSgpXCIgW3N0eWxlLndpZHRoLnB4XT1cInBjYldpZHRoIHwgYXN5bmNcIj5cclxuICA8bmctY29udGVudCBzZWxlY3Q9XCJzaWktcGFnZS1jb250ZW50LXRvb2xiYXJcIiAgPjwvbmctY29udGVudD5cclxuPC9kaXY+XHJcbjxkaXYgY2xhc3M9XCJwYy1ib2R5XCIgI3BjYiBbc3R5bGVdPVwiYm9keVN0eWxlXCIgY2xhc3M9XCJ7e2JvZHlDbGFzc319XCIgIFtzdHlsZS5tYXJnaW5Ub3AucHhdPVwicGN0YkZpeGVkSGVpZ2h0IHwgYXN5bmNcIj5cclxuICA8bmctY29udGVudD48L25nLWNvbnRlbnQ+XHJcbjwvZGl2PlxyXG48IS0tIFtzdHlsZS5tYXJnaW5Ub3AucHhdPVwiZ2V0T2Zmc2V0SGVpZ2h0KHBjdGIpXCIgIC0tPlxyXG4iXX0=