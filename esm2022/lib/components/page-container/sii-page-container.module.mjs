import { NgModule } from '@angular/core';
import { SiiPageContainerComponent } from './page-container.component';
import { PageFiltersComponent } from './page-filters/page-filters.component';
import { PageDetailComponent } from './page-detail/page-detail.component';
import { PageContentComponent } from './page-content/page-content.component';
import { ToolbarComponent } from '../toolbar/toolbar.component';
import { PageContentToolbarComponent } from './page-content/page-content-toolbar/page-content-toolbar.component';
import * as i0 from "@angular/core";
export class SiiPageContainerModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: SiiPageContainerModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "18.2.13", ngImport: i0, type: SiiPageContainerModule, imports: [SiiPageContainerComponent,
            PageFiltersComponent,
            PageDetailComponent,
            PageContentComponent,
            ToolbarComponent,
            PageContentToolbarComponent], exports: [SiiPageContainerComponent,
            PageFiltersComponent,
            PageDetailComponent,
            PageContentComponent,
            ToolbarComponent,
            PageContentToolbarComponent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: SiiPageContainerModule, imports: [PageFiltersComponent,
            ToolbarComponent,
            PageContentToolbarComponent] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: SiiPageContainerModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [
                        SiiPageContainerComponent,
                        PageFiltersComponent,
                        PageDetailComponent,
                        PageContentComponent,
                        ToolbarComponent,
                        PageContentToolbarComponent,
                    ],
                    exports: [
                        SiiPageContainerComponent,
                        PageFiltersComponent,
                        PageDetailComponent,
                        PageContentComponent,
                        ToolbarComponent,
                        PageContentToolbarComponent,
                    ]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2lpLXBhZ2UtY29udGFpbmVyLm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL3NpaS10b29sa2l0L3NyYy9saWIvY29tcG9uZW50cy9wYWdlLWNvbnRhaW5lci9zaWktcGFnZS1jb250YWluZXIubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDekMsT0FBTyxFQUFFLHlCQUF5QixFQUFFLE1BQU0sNEJBQTRCLENBQUM7QUFDdkUsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0sdUNBQXVDLENBQUM7QUFDN0UsT0FBTyxFQUFFLG1CQUFtQixFQUFFLE1BQU0scUNBQXFDLENBQUM7QUFDMUUsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0sdUNBQXVDLENBQUM7QUFDN0UsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sOEJBQThCLENBQUM7QUFDaEUsT0FBTyxFQUFFLDJCQUEyQixFQUFFLE1BQU0sb0VBQW9FLENBQUM7O0FBc0JqSCxNQUFNLE9BQU8sc0JBQXNCOytHQUF0QixzQkFBc0I7Z0hBQXRCLHNCQUFzQixZQWhCL0IseUJBQXlCO1lBQ3pCLG9CQUFvQjtZQUNwQixtQkFBbUI7WUFDbkIsb0JBQW9CO1lBQ3BCLGdCQUFnQjtZQUNoQiwyQkFBMkIsYUFHM0IseUJBQXlCO1lBQ3pCLG9CQUFvQjtZQUNwQixtQkFBbUI7WUFDbkIsb0JBQW9CO1lBQ3BCLGdCQUFnQjtZQUNoQiwyQkFBMkI7Z0hBR2xCLHNCQUFzQixZQWYvQixvQkFBb0I7WUFHcEIsZ0JBQWdCO1lBQ2hCLDJCQUEyQjs7NEZBV2xCLHNCQUFzQjtrQkFsQmxDLFFBQVE7bUJBQUM7b0JBQ1IsT0FBTyxFQUFFO3dCQUNQLHlCQUF5Qjt3QkFDekIsb0JBQW9CO3dCQUNwQixtQkFBbUI7d0JBQ25CLG9CQUFvQjt3QkFDcEIsZ0JBQWdCO3dCQUNoQiwyQkFBMkI7cUJBQzVCO29CQUNELE9BQU8sRUFBRTt3QkFDUCx5QkFBeUI7d0JBQ3pCLG9CQUFvQjt3QkFDcEIsbUJBQW1CO3dCQUNuQixvQkFBb0I7d0JBQ3BCLGdCQUFnQjt3QkFDaEIsMkJBQTJCO3FCQUM1QjtpQkFDRiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5nTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IFNpaVBhZ2VDb250YWluZXJDb21wb25lbnQgfSBmcm9tICcuL3BhZ2UtY29udGFpbmVyLmNvbXBvbmVudCc7XHJcbmltcG9ydCB7IFBhZ2VGaWx0ZXJzQ29tcG9uZW50IH0gZnJvbSAnLi9wYWdlLWZpbHRlcnMvcGFnZS1maWx0ZXJzLmNvbXBvbmVudCc7XHJcbmltcG9ydCB7IFBhZ2VEZXRhaWxDb21wb25lbnQgfSBmcm9tICcuL3BhZ2UtZGV0YWlsL3BhZ2UtZGV0YWlsLmNvbXBvbmVudCc7XHJcbmltcG9ydCB7IFBhZ2VDb250ZW50Q29tcG9uZW50IH0gZnJvbSAnLi9wYWdlLWNvbnRlbnQvcGFnZS1jb250ZW50LmNvbXBvbmVudCc7XHJcbmltcG9ydCB7IFRvb2xiYXJDb21wb25lbnQgfSBmcm9tICcuLi90b29sYmFyL3Rvb2xiYXIuY29tcG9uZW50JztcclxuaW1wb3J0IHsgUGFnZUNvbnRlbnRUb29sYmFyQ29tcG9uZW50IH0gZnJvbSAnLi9wYWdlLWNvbnRlbnQvcGFnZS1jb250ZW50LXRvb2xiYXIvcGFnZS1jb250ZW50LXRvb2xiYXIuY29tcG9uZW50JztcclxuXHJcblxyXG5cclxuQE5nTW9kdWxlKHsgXHJcbiAgaW1wb3J0czogW1xyXG4gICAgU2lpUGFnZUNvbnRhaW5lckNvbXBvbmVudCxcclxuICAgIFBhZ2VGaWx0ZXJzQ29tcG9uZW50LFxyXG4gICAgUGFnZURldGFpbENvbXBvbmVudCxcclxuICAgIFBhZ2VDb250ZW50Q29tcG9uZW50LFxyXG4gICAgVG9vbGJhckNvbXBvbmVudCxcclxuICAgIFBhZ2VDb250ZW50VG9vbGJhckNvbXBvbmVudCxcclxuICBdLFxyXG4gIGV4cG9ydHM6IFtcclxuICAgIFNpaVBhZ2VDb250YWluZXJDb21wb25lbnQsXHJcbiAgICBQYWdlRmlsdGVyc0NvbXBvbmVudCxcclxuICAgIFBhZ2VEZXRhaWxDb21wb25lbnQsXHJcbiAgICBQYWdlQ29udGVudENvbXBvbmVudCxcclxuICAgIFRvb2xiYXJDb21wb25lbnQsXHJcbiAgICBQYWdlQ29udGVudFRvb2xiYXJDb21wb25lbnQsXHJcbiAgXVxyXG59KVxyXG5leHBvcnQgY2xhc3MgU2lpUGFnZUNvbnRhaW5lck1vZHVsZSB7IH1cclxuIl19