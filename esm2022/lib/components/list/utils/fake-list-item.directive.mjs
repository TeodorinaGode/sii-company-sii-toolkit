import { Directive, Input } from '@angular/core';
import * as i0 from "@angular/core";
export class FakeListItemDirective {
    // prependedEl:HTMLElement;
    constructor(el, template, view) {
        this.el = el;
        this.template = template;
        this.view = view;
        // checkInterval;
        this.elements = [];
        // createDestroyNodeListener(){
        //   return this.siiFakeListItem.firstElementChild.addEventListener('DOMNodeRemoved', () => {
        //     console.log('createDestroyNodeListener change');
        //     setTimeout(() => {
        //       this.updateStyles();
        //       this.eventListeDom = this.createDestroyNodeListener();
        //     });
        //     });
        // }
        this.updateStyles = () => {
            if (!!this.siiFakeListItem.firstElementChild) {
                const cs = window.getComputedStyle(this.siiFakeListItem.firstElementChild);
                this.elements.forEach((elNode) => {
                    elNode.style.width = Math.ceil(this.siiFakeListItem.firstElementChild.offsetWidth) + 'px';
                    elNode.style.marginLeft = cs.marginLeft;
                    elNode.style.marginRight = cs.marginRight;
                    elNode.style.flex = cs.flex;
                    elNode.style.maxWidth = cs.maxWidth;
                });
            }
        };
    }
    ngOnDestroy() {
        // clearInterval(this.checkInterval);
    }
    ngAfterViewInit() {
        this.changes = new MutationObserver((mutations) => {
            this.updateStyles();
        });
        this.changes.observe(this.siiFakeListItem, {
            childList: true,
            subtree: false,
            attributes: false,
            characterData: false,
        });
        // setTimeout(()=>{
        // this.eventListeDom= this.createDestroyNodeListener();
        this.elements.push(this.view.createEmbeddedView(this.template).rootNodes[0]);
        this.elements.push(this.view.createEmbeddedView(this.template).rootNodes[0]);
        this.elements.push(this.view.createEmbeddedView(this.template).rootNodes[0]);
        this.elements.push(this.view.createEmbeddedView(this.template).rootNodes[0]);
        this.elements.push(this.view.createEmbeddedView(this.template).rootNodes[0]);
        this.updateStyles();
        // this.checkInterval= setInterval(()=>{
        //   this.updateStyles();
        // },1000)
        // },0)
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: FakeListItemDirective, deps: [{ token: i0.ElementRef }, { token: i0.TemplateRef }, { token: i0.ViewContainerRef }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "18.2.13", type: FakeListItemDirective, isStandalone: true, selector: "[siiFakeListItem]", inputs: { siiFakeListItem: "siiFakeListItem" }, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: FakeListItemDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[siiFakeListItem]',
                    standalone: true,
                }]
        }], ctorParameters: () => [{ type: i0.ElementRef }, { type: i0.TemplateRef }, { type: i0.ViewContainerRef }], propDecorators: { siiFakeListItem: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmFrZS1saXN0LWl0ZW0uZGlyZWN0aXZlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvc2lpLXRvb2xraXQvc3JjL2xpYi9jb21wb25lbnRzL2xpc3QvdXRpbHMvZmFrZS1saXN0LWl0ZW0uZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQXdDLEtBQUssRUFBNEMsTUFBTSxlQUFlLENBQUM7O0FBTWpJLE1BQU0sT0FBTyxxQkFBcUI7SUFTaEMsMkJBQTJCO0lBQzNCLFlBQW1CLEVBQWMsRUFDZCxRQUEwQixFQUFTLElBQXNCO1FBRHpELE9BQUUsR0FBRixFQUFFLENBQVk7UUFDZCxhQUFRLEdBQVIsUUFBUSxDQUFrQjtRQUFTLFNBQUksR0FBSixJQUFJLENBQWtCO1FBVDVFLGlCQUFpQjtRQUNqQixhQUFRLEdBQVUsRUFBRSxDQUFDO1FBK0NyQiwrQkFBK0I7UUFDL0IsNkZBQTZGO1FBQzdGLHVEQUF1RDtRQUN2RCx5QkFBeUI7UUFDekIsNkJBQTZCO1FBQzdCLCtEQUErRDtRQUMvRCxVQUFVO1FBQ1YsVUFBVTtRQUNWLElBQUk7UUFFSixpQkFBWSxHQUFHLEdBQUcsRUFBRTtZQUNsQixJQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLGlCQUFpQixFQUFDLENBQUM7Z0JBQzdDLE1BQU0sRUFBRSxHQUFHLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLGlCQUFpQixDQUFDLENBQUM7Z0JBQzNFLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUMsTUFBTSxFQUFFLEVBQUU7b0JBQy9CLE1BQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxpQkFBaUIsQ0FBQyxXQUFXLENBQUMsR0FBRyxJQUFJLENBQUM7b0JBQzFGLE1BQU0sQ0FBQyxLQUFLLENBQUMsVUFBVSxHQUFHLEVBQUUsQ0FBQyxVQUFVLENBQUM7b0JBQ3hDLE1BQU0sQ0FBQyxLQUFLLENBQUMsV0FBVyxHQUFHLEVBQUUsQ0FBQyxXQUFXLENBQUM7b0JBQzFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUM7b0JBQzVCLE1BQU0sQ0FBQyxLQUFLLENBQUMsUUFBUSxHQUFHLEVBQUUsQ0FBQyxRQUFRLENBQUM7Z0JBQ3RDLENBQUMsQ0FBQyxDQUFDO1lBQ0wsQ0FBQztRQUNILENBQUMsQ0FBQTtJQTNESSxDQUFDO0lBRUosV0FBVztRQUNULHFDQUFxQztJQUN2QyxDQUFDO0lBRUgsZUFBZTtRQUViLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxnQkFBZ0IsQ0FBQyxDQUFDLFNBQTJCLEVBQUUsRUFBRTtZQUNsRSxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7UUFDcEIsQ0FBQyxDQUNBLENBQUM7UUFFSixJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsZUFBZSxFQUFFO1lBQ3pDLFNBQVMsRUFBRSxJQUFJO1lBQ2YsT0FBTyxFQUFFLEtBQUs7WUFDZCxVQUFVLEVBQUUsS0FBSztZQUNqQixhQUFhLEVBQUUsS0FBSztTQUNyQixDQUFDLENBQUM7UUFHSCxtQkFBbUI7UUFFakIsd0RBQXdEO1FBQzFELElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzdFLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzdFLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzdFLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzdFLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzdFLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUNsQix3Q0FBd0M7UUFDeEMseUJBQXlCO1FBQ3pCLFVBQVU7UUFHWixPQUFPO0lBQ1QsQ0FBQzsrR0FoRFUscUJBQXFCO21HQUFyQixxQkFBcUI7OzRGQUFyQixxQkFBcUI7a0JBSmpDLFNBQVM7bUJBQUM7b0JBQ1AsUUFBUSxFQUFFLG1CQUFtQjtvQkFDN0IsVUFBVSxFQUFFLElBQUk7aUJBQ25CO3dJQUVVLGVBQWU7c0JBQXZCLEtBQUsiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBEaXJlY3RpdmUsIEVsZW1lbnRSZWYsIFJlbmRlcmVyMiwgQWZ0ZXJWaWV3SW5pdCwgSW5wdXQsIFRlbXBsYXRlUmVmLCBWaWV3Q29udGFpbmVyUmVmLCBPbkRlc3Ryb3kgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuXHJcbkBEaXJlY3RpdmUoe1xyXG4gICAgc2VsZWN0b3I6ICdbc2lpRmFrZUxpc3RJdGVtXScsXHJcbiAgICBzdGFuZGFsb25lOiB0cnVlLFxyXG59KVxyXG5leHBvcnQgY2xhc3MgRmFrZUxpc3RJdGVtRGlyZWN0aXZlIGltcGxlbWVudHMgQWZ0ZXJWaWV3SW5pdCwgT25EZXN0cm95e1xyXG4gIEBJbnB1dCgpIHNpaUZha2VMaXN0SXRlbTtcclxuICAvLyBjaGVja0ludGVydmFsO1xyXG4gIGVsZW1lbnRzOiBhbnlbXSA9IFtdO1xyXG4gIC8vIGV2ZW50TGlzdGVEb207XHJcblxyXG4gIHByaXZhdGUgY2hhbmdlczogTXV0YXRpb25PYnNlcnZlcjtcclxuXHJcblxyXG4gIC8vIHByZXBlbmRlZEVsOkhUTUxFbGVtZW50O1xyXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBlbDogRWxlbWVudFJlZixcclxuICAgICAgICAgICAgICBwdWJsaWMgdGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT4sIHB1YmxpYyB2aWV3OiBWaWV3Q29udGFpbmVyUmVmXHJcbiAgICApIHt9XHJcblxyXG4gICAgbmdPbkRlc3Ryb3koKTogdm9pZCB7XHJcbiAgICAgIC8vIGNsZWFySW50ZXJ2YWwodGhpcy5jaGVja0ludGVydmFsKTtcclxuICAgIH1cclxuXHJcbiAgbmdBZnRlclZpZXdJbml0KCk6IHZvaWQge1xyXG5cclxuICAgIHRoaXMuY2hhbmdlcyA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKChtdXRhdGlvbnM6IE11dGF0aW9uUmVjb3JkW10pID0+IHtcclxuICAgICAgdGhpcy51cGRhdGVTdHlsZXMoKTtcclxuICAgICAgfVxyXG4gICAgICApO1xyXG5cclxuICAgIHRoaXMuY2hhbmdlcy5vYnNlcnZlKHRoaXMuc2lpRmFrZUxpc3RJdGVtLCB7XHJcbiAgICAgIGNoaWxkTGlzdDogdHJ1ZSxcclxuICAgICAgc3VidHJlZTogZmFsc2UsXHJcbiAgICAgIGF0dHJpYnV0ZXM6IGZhbHNlLFxyXG4gICAgICBjaGFyYWN0ZXJEYXRhOiBmYWxzZSxcclxuICAgIH0pO1xyXG5cclxuXHJcbiAgICAvLyBzZXRUaW1lb3V0KCgpPT57XHJcblxyXG4gICAgICAvLyB0aGlzLmV2ZW50TGlzdGVEb209IHRoaXMuY3JlYXRlRGVzdHJveU5vZGVMaXN0ZW5lcigpO1xyXG4gICAgdGhpcy5lbGVtZW50cy5wdXNoKHRoaXMudmlldy5jcmVhdGVFbWJlZGRlZFZpZXcodGhpcy50ZW1wbGF0ZSkucm9vdE5vZGVzWzBdKTtcclxuICAgIHRoaXMuZWxlbWVudHMucHVzaCh0aGlzLnZpZXcuY3JlYXRlRW1iZWRkZWRWaWV3KHRoaXMudGVtcGxhdGUpLnJvb3ROb2Rlc1swXSk7XHJcbiAgICB0aGlzLmVsZW1lbnRzLnB1c2godGhpcy52aWV3LmNyZWF0ZUVtYmVkZGVkVmlldyh0aGlzLnRlbXBsYXRlKS5yb290Tm9kZXNbMF0pO1xyXG4gICAgdGhpcy5lbGVtZW50cy5wdXNoKHRoaXMudmlldy5jcmVhdGVFbWJlZGRlZFZpZXcodGhpcy50ZW1wbGF0ZSkucm9vdE5vZGVzWzBdKTtcclxuICAgIHRoaXMuZWxlbWVudHMucHVzaCh0aGlzLnZpZXcuY3JlYXRlRW1iZWRkZWRWaWV3KHRoaXMudGVtcGxhdGUpLnJvb3ROb2Rlc1swXSk7XHJcbiAgICB0aGlzLnVwZGF0ZVN0eWxlcygpO1xyXG4gICAgICAvLyB0aGlzLmNoZWNrSW50ZXJ2YWw9IHNldEludGVydmFsKCgpPT57XHJcbiAgICAgIC8vICAgdGhpcy51cGRhdGVTdHlsZXMoKTtcclxuICAgICAgLy8gfSwxMDAwKVxyXG5cclxuXHJcbiAgICAvLyB9LDApXHJcbiAgfVxyXG5cclxuICAvLyBjcmVhdGVEZXN0cm95Tm9kZUxpc3RlbmVyKCl7XHJcbiAgLy8gICByZXR1cm4gdGhpcy5zaWlGYWtlTGlzdEl0ZW0uZmlyc3RFbGVtZW50Q2hpbGQuYWRkRXZlbnRMaXN0ZW5lcignRE9NTm9kZVJlbW92ZWQnLCAoKSA9PiB7XHJcbiAgLy8gICAgIGNvbnNvbGUubG9nKCdjcmVhdGVEZXN0cm95Tm9kZUxpc3RlbmVyIGNoYW5nZScpO1xyXG4gIC8vICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAvLyAgICAgICB0aGlzLnVwZGF0ZVN0eWxlcygpO1xyXG4gIC8vICAgICAgIHRoaXMuZXZlbnRMaXN0ZURvbSA9IHRoaXMuY3JlYXRlRGVzdHJveU5vZGVMaXN0ZW5lcigpO1xyXG4gIC8vICAgICB9KTtcclxuICAvLyAgICAgfSk7XHJcbiAgLy8gfVxyXG5cclxuICB1cGRhdGVTdHlsZXMgPSAoKSA9PiB7XHJcbiAgICBpZiAoICEhdGhpcy5zaWlGYWtlTGlzdEl0ZW0uZmlyc3RFbGVtZW50Q2hpbGQpe1xyXG4gICAgICBjb25zdCBjcyA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKHRoaXMuc2lpRmFrZUxpc3RJdGVtLmZpcnN0RWxlbWVudENoaWxkKTtcclxuICAgICAgdGhpcy5lbGVtZW50cy5mb3JFYWNoKChlbE5vZGUpID0+IHtcclxuICAgICAgICBlbE5vZGUuc3R5bGUud2lkdGggPSBNYXRoLmNlaWwodGhpcy5zaWlGYWtlTGlzdEl0ZW0uZmlyc3RFbGVtZW50Q2hpbGQub2Zmc2V0V2lkdGgpICsgJ3B4JztcclxuICAgICAgICBlbE5vZGUuc3R5bGUubWFyZ2luTGVmdCA9IGNzLm1hcmdpbkxlZnQ7XHJcbiAgICAgICAgZWxOb2RlLnN0eWxlLm1hcmdpblJpZ2h0ID0gY3MubWFyZ2luUmlnaHQ7XHJcbiAgICAgICAgZWxOb2RlLnN0eWxlLmZsZXggPSBjcy5mbGV4O1xyXG4gICAgICAgIGVsTm9kZS5zdHlsZS5tYXhXaWR0aCA9IGNzLm1heFdpZHRoO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9XHJcblxyXG59XHJcbiJdfQ==