import { NgModule } from '@angular/core';
import { GroupedInfiniteScrollComponent } from './grouped-infinite-scroll/grouped-infinite-scroll.component';
import { InfiniteScrollComponent } from './infinite-scroll/infinite-scroll.component';
import { ListIconComponent } from '../list-icon/list-icon.component';
import { ListSorterComponent } from '../list-sorter/list-sorter.component';
import { ListRowDirective } from './utils/list-row/list-row.directive';
import { ListSorterOptionComponent } from '../list-sorter/list-sorter-option/list-sorter-option.component';
import { SiiInfiniteScrollSelectAllComponent } from './utils/sii-infinite-scroll-select-all/sii-infinite-scroll-select-all.component';
import { EmptyListMessageDirective } from './utils/empty-list-message/empty-list-message.directive';
import * as i0 from "@angular/core";
export class SiiListModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: SiiListModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "18.2.13", ngImport: i0, type: SiiListModule, imports: [GroupedInfiniteScrollComponent,
            InfiniteScrollComponent,
            ListIconComponent,
            ListSorterComponent,
            ListSorterOptionComponent,
            ListRowDirective,
            SiiInfiniteScrollSelectAllComponent,
            EmptyListMessageDirective], exports: [GroupedInfiniteScrollComponent,
            InfiniteScrollComponent,
            ListIconComponent,
            ListSorterComponent,
            ListSorterOptionComponent,
            ListRowDirective,
            SiiInfiniteScrollSelectAllComponent,
            EmptyListMessageDirective] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: SiiListModule, imports: [GroupedInfiniteScrollComponent,
            InfiniteScrollComponent,
            ListSorterComponent,
            SiiInfiniteScrollSelectAllComponent] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: SiiListModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [],
                    imports: [
                        GroupedInfiniteScrollComponent,
                        InfiniteScrollComponent,
                        ListIconComponent,
                        ListSorterComponent,
                        ListSorterOptionComponent,
                        ListRowDirective,
                        SiiInfiniteScrollSelectAllComponent,
                        EmptyListMessageDirective
                    ],
                    exports: [
                        GroupedInfiniteScrollComponent,
                        InfiniteScrollComponent,
                        ListIconComponent,
                        ListSorterComponent,
                        ListSorterOptionComponent,
                        ListRowDirective,
                        SiiInfiniteScrollSelectAllComponent,
                        EmptyListMessageDirective
                    ]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2lpLWxpc3QubW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvc2lpLXRvb2xraXQvc3JjL2xpYi9jb21wb25lbnRzL2xpc3Qvc2lpLWxpc3QubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFekMsT0FBTyxFQUFFLDhCQUE4QixFQUFFLE1BQU0sNkRBQTZELENBQUM7QUFDN0csT0FBTyxFQUFFLHVCQUF1QixFQUFFLE1BQU0sNkNBQTZDLENBQUM7QUFDdEYsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sa0NBQWtDLENBQUM7QUFDckUsT0FBTyxFQUFFLG1CQUFtQixFQUFFLE1BQU0sc0NBQXNDLENBQUM7QUFDM0UsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0scUNBQXFDLENBQUM7QUFDdkUsT0FBTyxFQUFFLHlCQUF5QixFQUFFLE1BQU0sZ0VBQWdFLENBQUM7QUFDM0csT0FBTyxFQUFFLG1DQUFtQyxFQUFFLE1BQU0saUZBQWlGLENBQUM7QUFDdEksT0FBTyxFQUFFLHlCQUF5QixFQUFFLE1BQU0seURBQXlELENBQUM7O0FBMkJwRyxNQUFNLE9BQU8sYUFBYTsrR0FBYixhQUFhO2dIQUFiLGFBQWEsWUFwQnRCLDhCQUE4QjtZQUM5Qix1QkFBdUI7WUFDdkIsaUJBQWlCO1lBQ2pCLG1CQUFtQjtZQUNuQix5QkFBeUI7WUFDekIsZ0JBQWdCO1lBQ2hCLG1DQUFtQztZQUNuQyx5QkFBeUIsYUFHekIsOEJBQThCO1lBQzlCLHVCQUF1QjtZQUN2QixpQkFBaUI7WUFDakIsbUJBQW1CO1lBQ25CLHlCQUF5QjtZQUN6QixnQkFBZ0I7WUFDaEIsbUNBQW1DO1lBQ25DLHlCQUF5QjtnSEFHaEIsYUFBYSxZQXBCdEIsOEJBQThCO1lBQzlCLHVCQUF1QjtZQUV2QixtQkFBbUI7WUFHbkIsbUNBQW1DOzs0RkFjMUIsYUFBYTtrQkF2QnpCLFFBQVE7bUJBQUM7b0JBQ1IsWUFBWSxFQUFFLEVBQUU7b0JBQ2hCLE9BQU8sRUFBRTt3QkFDUCw4QkFBOEI7d0JBQzlCLHVCQUF1Qjt3QkFDdkIsaUJBQWlCO3dCQUNqQixtQkFBbUI7d0JBQ25CLHlCQUF5Qjt3QkFDekIsZ0JBQWdCO3dCQUNoQixtQ0FBbUM7d0JBQ25DLHlCQUF5QjtxQkFDMUI7b0JBQ0QsT0FBTyxFQUFFO3dCQUNQLDhCQUE4Qjt3QkFDOUIsdUJBQXVCO3dCQUN2QixpQkFBaUI7d0JBQ2pCLG1CQUFtQjt3QkFDbkIseUJBQXlCO3dCQUN6QixnQkFBZ0I7d0JBQ2hCLG1DQUFtQzt3QkFDbkMseUJBQXlCO3FCQUMxQjtpQkFDRiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5nTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XHJcbmltcG9ydCB7IEdyb3VwZWRJbmZpbml0ZVNjcm9sbENvbXBvbmVudCB9IGZyb20gJy4vZ3JvdXBlZC1pbmZpbml0ZS1zY3JvbGwvZ3JvdXBlZC1pbmZpbml0ZS1zY3JvbGwuY29tcG9uZW50JztcclxuaW1wb3J0IHsgSW5maW5pdGVTY3JvbGxDb21wb25lbnQgfSBmcm9tICcuL2luZmluaXRlLXNjcm9sbC9pbmZpbml0ZS1zY3JvbGwuY29tcG9uZW50JztcclxuaW1wb3J0IHsgTGlzdEljb25Db21wb25lbnQgfSBmcm9tICcuLi9saXN0LWljb24vbGlzdC1pY29uLmNvbXBvbmVudCc7XHJcbmltcG9ydCB7IExpc3RTb3J0ZXJDb21wb25lbnQgfSBmcm9tICcuLi9saXN0LXNvcnRlci9saXN0LXNvcnRlci5jb21wb25lbnQnO1xyXG5pbXBvcnQgeyBMaXN0Um93RGlyZWN0aXZlIH0gZnJvbSAnLi91dGlscy9saXN0LXJvdy9saXN0LXJvdy5kaXJlY3RpdmUnO1xyXG5pbXBvcnQgeyBMaXN0U29ydGVyT3B0aW9uQ29tcG9uZW50IH0gZnJvbSAnLi4vbGlzdC1zb3J0ZXIvbGlzdC1zb3J0ZXItb3B0aW9uL2xpc3Qtc29ydGVyLW9wdGlvbi5jb21wb25lbnQnO1xyXG5pbXBvcnQgeyBTaWlJbmZpbml0ZVNjcm9sbFNlbGVjdEFsbENvbXBvbmVudCB9IGZyb20gJy4vdXRpbHMvc2lpLWluZmluaXRlLXNjcm9sbC1zZWxlY3QtYWxsL3NpaS1pbmZpbml0ZS1zY3JvbGwtc2VsZWN0LWFsbC5jb21wb25lbnQnO1xyXG5pbXBvcnQgeyBFbXB0eUxpc3RNZXNzYWdlRGlyZWN0aXZlIH0gZnJvbSAnLi91dGlscy9lbXB0eS1saXN0LW1lc3NhZ2UvZW1wdHktbGlzdC1tZXNzYWdlLmRpcmVjdGl2ZSc7XHJcblxyXG5cclxuXHJcbkBOZ01vZHVsZSh7XHJcbiAgZGVjbGFyYXRpb25zOiBbXSxcclxuICBpbXBvcnRzOiBbXHJcbiAgICBHcm91cGVkSW5maW5pdGVTY3JvbGxDb21wb25lbnQsXHJcbiAgICBJbmZpbml0ZVNjcm9sbENvbXBvbmVudCxcclxuICAgIExpc3RJY29uQ29tcG9uZW50LFxyXG4gICAgTGlzdFNvcnRlckNvbXBvbmVudCxcclxuICAgIExpc3RTb3J0ZXJPcHRpb25Db21wb25lbnQsXHJcbiAgICBMaXN0Um93RGlyZWN0aXZlLFxyXG4gICAgU2lpSW5maW5pdGVTY3JvbGxTZWxlY3RBbGxDb21wb25lbnQsXHJcbiAgICBFbXB0eUxpc3RNZXNzYWdlRGlyZWN0aXZlXHJcbiAgXSxcclxuICBleHBvcnRzOiBbXHJcbiAgICBHcm91cGVkSW5maW5pdGVTY3JvbGxDb21wb25lbnQsXHJcbiAgICBJbmZpbml0ZVNjcm9sbENvbXBvbmVudCxcclxuICAgIExpc3RJY29uQ29tcG9uZW50LFxyXG4gICAgTGlzdFNvcnRlckNvbXBvbmVudCxcclxuICAgIExpc3RTb3J0ZXJPcHRpb25Db21wb25lbnQsXHJcbiAgICBMaXN0Um93RGlyZWN0aXZlLFxyXG4gICAgU2lpSW5maW5pdGVTY3JvbGxTZWxlY3RBbGxDb21wb25lbnQsXHJcbiAgICBFbXB0eUxpc3RNZXNzYWdlRGlyZWN0aXZlXHJcbiAgXVxyXG59KVxyXG5leHBvcnQgY2xhc3MgU2lpTGlzdE1vZHVsZSB7IH1cclxuIl19