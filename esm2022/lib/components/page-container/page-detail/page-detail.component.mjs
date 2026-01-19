import { Component, HostBinding, Input } from '@angular/core';
import * as i0 from "@angular/core";
export class PageDetailComponent {
    set width(val) {
        this.hostWidth = (val !== undefined && new RegExp(/^\d+$/g).test(val)) ? val + 'px' :
            (val !== undefined && new RegExp(/^\d+(px|vw|%)$/g).test(val)) ? val : this.defaultMinWidth;
    }
    constructor(el) {
        this.el = el;
        this.defaultMinWidth = '320px';
        this.hostWidth = this.defaultMinWidth;
        this.display = 'none';
        this.alwaysHover = false;
    }
    ngOnInit() {
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
    hoverFullScreen(status) {
        status ? this.el.nativeElement.classList.add('pcd_hoverFullScreen') : this.el.nativeElement.classList.remove('pcd_hoverFullScreen');
    }
    hover(status) {
        if (!this.alwaysHover) {
            status ? this.el.nativeElement.classList.add('pcd_hover') : this.el.nativeElement.classList.remove('pcd_hover');
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: PageDetailComponent, deps: [{ token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "18.2.13", type: PageDetailComponent, isStandalone: true, selector: "sii-page-detail", inputs: { alwaysHover: "alwaysHover", width: "width" }, host: { properties: { "style.width": "this.hostWidth", "style.max-width": "this.hostWidth", "style.display": "this.display", "class.pcd_hover": "this.alwaysHover" } }, ngImport: i0, template: "<ng-content></ng-content>\r\n", styles: [":host{flex:1 1 auto}:host.pcd_hover{position:fixed;right:var(--safe-area-inset-right);height:calc(100% - var(--toolbarHeight))!important;background-color:#2a2b38;top:var(--toolbarHeight)}:host.pcd_hoverFullScreen{max-width:100%!important;min-width:100%!important;width:100%!important}\n"] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: PageDetailComponent, decorators: [{
            type: Component,
            args: [{ selector: 'sii-page-detail', standalone: true, template: "<ng-content></ng-content>\r\n", styles: [":host{flex:1 1 auto}:host.pcd_hover{position:fixed;right:var(--safe-area-inset-right);height:calc(100% - var(--toolbarHeight))!important;background-color:#2a2b38;top:var(--toolbarHeight)}:host.pcd_hoverFullScreen{max-width:100%!important;min-width:100%!important;width:100%!important}\n"] }]
        }], ctorParameters: () => [{ type: i0.ElementRef }], propDecorators: { hostWidth: [{
                type: HostBinding,
                args: ['style.width']
            }, {
                type: HostBinding,
                args: ['style.max-width']
            }], display: [{
                type: HostBinding,
                args: ['style.display']
            }], alwaysHover: [{
                type: Input
            }, {
                type: HostBinding,
                args: ['class.pcd_hover']
            }], width: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFnZS1kZXRhaWwuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvc2lpLXRvb2xraXQvc3JjL2xpYi9jb21wb25lbnRzL3BhZ2UtY29udGFpbmVyL3BhZ2UtZGV0YWlsL3BhZ2UtZGV0YWlsLmNvbXBvbmVudC50cyIsIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL3NpaS10b29sa2l0L3NyYy9saWIvY29tcG9uZW50cy9wYWdlLWNvbnRhaW5lci9wYWdlLWRldGFpbC9wYWdlLWRldGFpbC5jb21wb25lbnQuaHRtbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFjLFdBQVcsRUFBRSxLQUFLLEVBQVUsTUFBTSxlQUFlLENBQUM7O0FBUWxGLE1BQU0sT0FBTyxtQkFBbUI7SUFLOUIsSUFBYSxLQUFLLENBQUMsR0FBRztRQUNyQixJQUFJLENBQUMsU0FBUyxHQUFHLENBQUMsR0FBRyxLQUFLLFNBQVMsSUFBSSxJQUFJLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxDQUFDO1lBQ3JFLENBQUMsR0FBRyxLQUFLLFNBQVMsSUFBSSxJQUFJLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFFLElBQUksQ0FBQyxlQUFlLENBQUM7SUFDOUcsQ0FBQztJQUVELFlBQW9CLEVBQWM7UUFBZCxPQUFFLEdBQUYsRUFBRSxDQUFZO1FBVGxDLG9CQUFlLEdBQUcsT0FBTyxDQUFDO1FBQ29DLGNBQVMsR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDO1FBQ2pFLFlBQU8sR0FBRyxNQUFNLENBQUM7UUFDUCxnQkFBVyxHQUFHLEtBQUssQ0FBQztJQU10QixDQUFDO0lBRXZDLFFBQVE7SUFDUixDQUFDO0lBR0QsWUFBWTtRQUNWLE9BQU8sUUFBUSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsYUFBYSxFQUFFLElBQUksQ0FBQyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQzdGLENBQUM7SUFFRCxlQUFlO1FBQ2IsSUFBSSxJQUFJLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFDLENBQUM7WUFDN0MsT0FBTyxRQUFRLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUN0QyxDQUFDO2FBQUssSUFBSSxJQUFJLE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFDLENBQUM7WUFDdkQsT0FBTyxRQUFRLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDeEQsQ0FBQzthQUFLLElBQUksSUFBSSxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBQyxDQUFDO1lBQ3RELE1BQU0sT0FBTyxHQUFHLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLGFBQWEsQ0FBQyxhQUFhLEVBQUUsSUFBSSxDQUFDLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFDbEgsT0FBTyxDQUFDLE9BQU8sR0FBRyxHQUFHLENBQUMsR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDMUUsQ0FBQztJQUNILENBQUM7SUFFRCxlQUFlLENBQUMsTUFBZTtRQUM3QixNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsYUFBYSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMscUJBQXFCLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxhQUFhLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO0lBQ3RJLENBQUM7SUFDRCxLQUFLLENBQUMsTUFBZTtRQUNuQixJQUFHLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBQyxDQUFDO1lBQ3BCLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxhQUFhLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxhQUFhLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUNsSCxDQUFDO0lBQ0gsQ0FBQzsrR0F0Q1UsbUJBQW1CO21HQUFuQixtQkFBbUIsMlNDUmhDLCtCQUNBOzs0RkRPYSxtQkFBbUI7a0JBTi9CLFNBQVM7K0JBQ0ksaUJBQWlCLGNBR2YsSUFBSTsrRUFJNEMsU0FBUztzQkFBdEUsV0FBVzt1QkFBQyxhQUFhOztzQkFBRyxXQUFXO3VCQUFDLGlCQUFpQjtnQkFDNUIsT0FBTztzQkFBcEMsV0FBVzt1QkFBQyxlQUFlO2dCQUNZLFdBQVc7c0JBQWxELEtBQUs7O3NCQUFHLFdBQVc7dUJBQUMsaUJBQWlCO2dCQUN6QixLQUFLO3NCQUFqQixLQUFLIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBFbGVtZW50UmVmLCBIb3N0QmluZGluZywgSW5wdXQsIE9uSW5pdCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgICBzZWxlY3RvcjogJ3NpaS1wYWdlLWRldGFpbCcsXHJcbiAgICB0ZW1wbGF0ZVVybDogJy4vcGFnZS1kZXRhaWwuY29tcG9uZW50Lmh0bWwnLFxyXG4gICAgc3R5bGVVcmxzOiBbJy4vcGFnZS1kZXRhaWwuY29tcG9uZW50LnNjc3MnXSxcclxuICAgIHN0YW5kYWxvbmU6IHRydWVcclxufSlcclxuZXhwb3J0IGNsYXNzIFBhZ2VEZXRhaWxDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xyXG4gIGRlZmF1bHRNaW5XaWR0aCA9ICczMjBweCc7XHJcbiAgQEhvc3RCaW5kaW5nKCdzdHlsZS53aWR0aCcpIEBIb3N0QmluZGluZygnc3R5bGUubWF4LXdpZHRoJykgICBob3N0V2lkdGggPSB0aGlzLmRlZmF1bHRNaW5XaWR0aDtcclxuICBASG9zdEJpbmRpbmcoJ3N0eWxlLmRpc3BsYXknKSBkaXNwbGF5ID0gJ25vbmUnO1xyXG4gIEBJbnB1dCgpQEhvc3RCaW5kaW5nKCdjbGFzcy5wY2RfaG92ZXInKSBhbHdheXNIb3ZlciA9IGZhbHNlO1xyXG4gIEBJbnB1dCgpIHNldCB3aWR0aCh2YWwpe1xyXG4gICB0aGlzLmhvc3RXaWR0aCA9ICh2YWwgIT09IHVuZGVmaW5lZCAmJiBuZXcgUmVnRXhwKC9eXFxkKyQvZykudGVzdCh2YWwpKSA/IHZhbCArICdweCcgOlxyXG4gICAgICAgICAgICAgICAgICAgKHZhbCAhPT0gdW5kZWZpbmVkICYmIG5ldyBSZWdFeHAoL15cXGQrKHB4fHZ3fCUpJC9nKS50ZXN0KHZhbCkpID8gdmFsIDogIHRoaXMuZGVmYXVsdE1pbldpZHRoO1xyXG4gIH1cclxuXHJcbiAgY29uc3RydWN0b3IocHVibGljICBlbDogRWxlbWVudFJlZikgeyB9XHJcblxyXG4gIG5nT25Jbml0KCk6IHZvaWQge1xyXG4gIH1cclxuXHJcblxyXG4gIGdldFJlYWxXaWR0aCgpeyAvLyBsYXJnaGV6emEgZWZmZXR0aXZhXHJcbiAgICByZXR1cm4gcGFyc2VJbnQoZ2V0Q29tcHV0ZWRTdHlsZSh0aGlzLmVsLm5hdGl2ZUVsZW1lbnQsIG51bGwpLndpZHRoLnJlcGxhY2UoJ3B4JywgJycpLCAxMCk7XHJcbiAgfVxyXG5cclxuICBnZXRNaW5XaWR0aEluUHgoKTogbnVtYmVye1xyXG4gICAgaWYgKG5ldyBSZWdFeHAoL15cXGQrJC9nKS50ZXN0KHRoaXMuaG9zdFdpZHRoKSl7XHJcbiAgICAgIHJldHVybiBwYXJzZUludCh0aGlzLmhvc3RXaWR0aCwgMTApO1xyXG4gICAgfWVsc2UgaWYgKG5ldyBSZWdFeHAoL15cXGQrKHB4KSQvZykudGVzdCh0aGlzLmhvc3RXaWR0aCkpe1xyXG4gICAgICByZXR1cm4gcGFyc2VJbnQodGhpcy5ob3N0V2lkdGgubWF0Y2goL15cXGQrL2cpWzBdLCAxMCk7XHJcbiAgICB9ZWxzZSBpZiAobmV3IFJlZ0V4cCgvXlxcZCsoJSkkL2cpLnRlc3QodGhpcy5ob3N0V2lkdGgpKXtcclxuICAgICAgY29uc3QgcGFyZW50dyA9IHBhcnNlSW50KGdldENvbXB1dGVkU3R5bGUodGhpcy5lbC5uYXRpdmVFbGVtZW50LnBhcmVudEVsZW1lbnQsIG51bGwpLndpZHRoLnJlcGxhY2UoJ3B4JywgJycpLCAxMCk7XHJcbiAgICAgIHJldHVybiAocGFyZW50dyAvIDEwMCkgKiBwYXJzZUludCh0aGlzLmhvc3RXaWR0aC5tYXRjaCgvXlxcZCsvZylbMF0sIDEwKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGhvdmVyRnVsbFNjcmVlbihzdGF0dXM6IGJvb2xlYW4pe1xyXG4gICAgc3RhdHVzID8gdGhpcy5lbC5uYXRpdmVFbGVtZW50LmNsYXNzTGlzdC5hZGQoJ3BjZF9ob3ZlckZ1bGxTY3JlZW4nKSA6IHRoaXMuZWwubmF0aXZlRWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdwY2RfaG92ZXJGdWxsU2NyZWVuJyk7XHJcbiAgfVxyXG4gIGhvdmVyKHN0YXR1czogYm9vbGVhbil7XHJcbiAgICBpZighdGhpcy5hbHdheXNIb3Zlcil7XHJcbiAgICAgIHN0YXR1cyA/IHRoaXMuZWwubmF0aXZlRWxlbWVudC5jbGFzc0xpc3QuYWRkKCdwY2RfaG92ZXInKSA6IHRoaXMuZWwubmF0aXZlRWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdwY2RfaG92ZXInKTtcclxuICAgIH1cclxuICB9XHJcblxyXG5cclxufVxyXG4iLCI8bmctY29udGVudD48L25nLWNvbnRlbnQ+XHJcbiJdfQ==