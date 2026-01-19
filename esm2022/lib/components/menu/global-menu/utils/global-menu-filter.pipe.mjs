import { Pipe } from '@angular/core';
import * as i0 from "@angular/core";
export class GlobalMenuFilterPipe {
    transform(menuCategories, company, textFilter) {
        if (!menuCategories || (!textFilter && (!company || company.length === 0))) {
            return menuCategories;
        }
        // filter items array, items which match and return true will be
        // kept, false will be filtered out
        // return items.filter(item => item.title.indexOf(filter.title) !== -1);
        return menuCategories.map((menuCat) => {
            const filtredMenu = { ...menuCat };
            filtredMenu.voices = filtredMenu.voices
                .filter(mv => (!mv.companyDep
                || company == null || company.length === 0
                || (!!mv.companies && mv.companies.find(cmp => cmp === company) != null)))
                .filter(mv => menuCat.category.toLowerCase().indexOf(textFilter.toLowerCase()) !== -1
                || mv.title.toLowerCase().indexOf(textFilter.toLowerCase()) !== -1);
            return filtredMenu;
        }).filter(mc => mc.voices.length > 0);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: GlobalMenuFilterPipe, deps: [], target: i0.ɵɵFactoryTarget.Pipe }); }
    static { this.ɵpipe = i0.ɵɵngDeclarePipe({ minVersion: "14.0.0", version: "18.2.13", ngImport: i0, type: GlobalMenuFilterPipe, isStandalone: true, name: "globalMenuFilter" }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: GlobalMenuFilterPipe, decorators: [{
            type: Pipe,
            args: [{
                    name: 'globalMenuFilter',
                    standalone: true
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2xvYmFsLW1lbnUtZmlsdGVyLnBpcGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9zaWktdG9vbGtpdC9zcmMvbGliL2NvbXBvbmVudHMvbWVudS9nbG9iYWwtbWVudS91dGlscy9nbG9iYWwtbWVudS1maWx0ZXIucGlwZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsSUFBSSxFQUFpQixNQUFNLGVBQWUsQ0FBQzs7QUFPcEQsTUFBTSxPQUFPLG9CQUFvQjtJQUUvQixTQUFTLENBQUMsY0FBK0IsRUFBRSxPQUFjLEVBQUUsVUFBaUI7UUFDMUUsSUFBSSxDQUFDLGNBQWMsSUFBSSxDQUFDLENBQUMsVUFBVSxJQUFJLENBQUMsQ0FBQyxPQUFPLElBQUksT0FBTyxDQUFDLE1BQU0sS0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7WUFDekUsT0FBTyxjQUFjLENBQUM7UUFDeEIsQ0FBQztRQUNILGdFQUFnRTtRQUNoRSxtQ0FBbUM7UUFDbkMsd0VBQXdFO1FBQ3hFLE9BQU8sY0FBYyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sRUFBQyxFQUFFO1lBQ25DLE1BQU0sV0FBVyxHQUFHLEVBQUMsR0FBRyxPQUFPLEVBQUUsQ0FBQztZQUNsQyxXQUFXLENBQUMsTUFBTSxHQUFDLFdBQVcsQ0FBQyxNQUFNO2lCQUNwQixNQUFNLENBQUMsRUFBRSxDQUFBLEVBQUUsQ0FBQyxDQUFFLENBQUMsRUFBRSxDQUFDLFVBQVU7bUJBQ1gsT0FBTyxJQUFFLElBQUksSUFBSSxPQUFPLENBQUMsTUFBTSxLQUFHLENBQUM7bUJBQ2xDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxTQUFTLElBQUksRUFBRSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFBLEVBQUUsQ0FBQyxHQUFHLEtBQUcsT0FBTyxDQUFDLElBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQztpQkFDcEYsTUFBTSxDQUFDLEVBQUUsQ0FBQSxFQUFFLENBQ1YsT0FBTyxDQUFDLFFBQVEsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLFdBQVcsRUFBRSxDQUFDLEtBQUcsQ0FBQyxDQUFDO21CQUNsRSxFQUFFLENBQUMsS0FBSyxDQUFDLFdBQVcsRUFBRSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsV0FBVyxFQUFFLENBQUMsS0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3BGLE9BQU8sV0FBVyxDQUFDO1FBQ3JCLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUEsRUFBRSxDQUFBLEVBQUUsQ0FBQyxNQUFNLENBQUMsTUFBTSxHQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2xDLENBQUM7K0dBcEJVLG9CQUFvQjs2R0FBcEIsb0JBQW9COzs0RkFBcEIsb0JBQW9CO2tCQUpoQyxJQUFJO21CQUFDO29CQUNGLElBQUksRUFBRSxrQkFBa0I7b0JBQ3hCLFVBQVUsRUFBRSxJQUFJO2lCQUNuQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFBpcGUsIFBpcGVUcmFuc2Zvcm0gfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgU2lpTWVudUZvbGRlciB9IGZyb20gJy4uL2R0by9tZW51LWZvbGRlcic7XHJcblxyXG5AUGlwZSh7XHJcbiAgICBuYW1lOiAnZ2xvYmFsTWVudUZpbHRlcicsXHJcbiAgICBzdGFuZGFsb25lOiB0cnVlXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBHbG9iYWxNZW51RmlsdGVyUGlwZSBpbXBsZW1lbnRzIFBpcGVUcmFuc2Zvcm0ge1xyXG5cclxuICB0cmFuc2Zvcm0obWVudUNhdGVnb3JpZXM6IFNpaU1lbnVGb2xkZXJbXSwgY29tcGFueTpzdHJpbmcsIHRleHRGaWx0ZXI6c3RyaW5nKSB7XHJcbiAgICBpZiAoIW1lbnVDYXRlZ29yaWVzIHx8ICghdGV4dEZpbHRlciAmJiAoIWNvbXBhbnkgfHwgY29tcGFueS5sZW5ndGg9PT0wKSkpIHtcclxuICAgICAgcmV0dXJuIG1lbnVDYXRlZ29yaWVzO1xyXG4gICAgfVxyXG4gIC8vIGZpbHRlciBpdGVtcyBhcnJheSwgaXRlbXMgd2hpY2ggbWF0Y2ggYW5kIHJldHVybiB0cnVlIHdpbGwgYmVcclxuICAvLyBrZXB0LCBmYWxzZSB3aWxsIGJlIGZpbHRlcmVkIG91dFxyXG4gIC8vIHJldHVybiBpdGVtcy5maWx0ZXIoaXRlbSA9PiBpdGVtLnRpdGxlLmluZGV4T2YoZmlsdGVyLnRpdGxlKSAhPT0gLTEpO1xyXG4gIHJldHVybiBtZW51Q2F0ZWdvcmllcy5tYXAoKG1lbnVDYXQpPT57XHJcbiAgICBjb25zdCBmaWx0cmVkTWVudT0gIHsuLi5tZW51Q2F0IH07XHJcbiAgICBmaWx0cmVkTWVudS52b2ljZXM9ZmlsdHJlZE1lbnUudm9pY2VzXHJcbiAgICAgICAgICAgICAgICAgICAgLmZpbHRlcihtdj0+ICggIW12LmNvbXBhbnlEZXBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8fCBjb21wYW55PT1udWxsIHx8IGNvbXBhbnkubGVuZ3RoPT09MFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHx8ICAoISFtdi5jb21wYW5pZXMgJiYgbXYuY29tcGFuaWVzLmZpbmQoY21wPT4gY21wPT09Y29tcGFueSkhPW51bGwpKSlcclxuICAgICAgICAgICAgICAgICAgICAuZmlsdGVyKG12PT5cclxuICAgICAgICAgICAgICAgICAgICAgIG1lbnVDYXQuY2F0ZWdvcnkudG9Mb3dlckNhc2UoKS5pbmRleE9mKHRleHRGaWx0ZXIudG9Mb3dlckNhc2UoKSkhPT0tMVxyXG4gICAgICAgICAgICAgICAgICAgICAgfHwgbXYudGl0bGUudG9Mb3dlckNhc2UoKS5pbmRleE9mKHRleHRGaWx0ZXIudG9Mb3dlckNhc2UoKSkhPT0tMSk7XHJcbiAgICByZXR1cm4gZmlsdHJlZE1lbnU7XHJcbiAgfSkuZmlsdGVyKG1jPT5tYy52b2ljZXMubGVuZ3RoPjApO1xyXG4gIH1cclxuXHJcbn1cclxuIl19