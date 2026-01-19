import { Pipe } from '@angular/core';
import * as i0 from "@angular/core";
export class SiiMemoryPipe {
    transform(value, ...args) {
        // value in byte
        if (value < 1024) {
            return Math.ceil(value) + 'B';
        }
        else if (value < (1024 * 1024)) {
            return Math.ceil(value / 1024) + 'KB';
        }
        else if (value < (1024 * 1024 * 1024)) {
            return Math.ceil(value / (1024 * 1024)) + 'MB';
        }
        else {
            return Math.ceil(value / (1024 * 1024 * 1024)) + 'GB';
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: SiiMemoryPipe, deps: [], target: i0.ɵɵFactoryTarget.Pipe }); }
    static { this.ɵpipe = i0.ɵɵngDeclarePipe({ minVersion: "14.0.0", version: "18.2.13", ngImport: i0, type: SiiMemoryPipe, isStandalone: true, name: "siiMemory" }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: SiiMemoryPipe, decorators: [{
            type: Pipe,
            args: [{
                    name: 'siiMemory',
                    standalone: true
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2lpLW1lbW9yeS5waXBlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvc2lpLXRvb2xraXQvc3JjL2xpYi9jb21wb25lbnRzL3V0aWwvc2lpLW1lbW9yeS5waXBlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxJQUFJLEVBQWlCLE1BQU0sZUFBZSxDQUFDOztBQU1wRCxNQUFNLE9BQU8sYUFBYTtJQUV4QixTQUFTLENBQUMsS0FBYSxFQUFFLEdBQUcsSUFBZTtRQUN6QyxnQkFBZ0I7UUFDaEIsSUFBSyxLQUFLLEdBQUcsSUFBSSxFQUFHLENBQUM7WUFDbkIsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLEdBQUcsQ0FBQztRQUNoQyxDQUFDO2FBQUssSUFBSSxLQUFLLEdBQUcsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLEVBQUMsQ0FBQztZQUMvQixPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQztRQUN4QyxDQUFDO2FBQUssSUFBSSxLQUFLLEdBQUcsQ0FBQyxJQUFJLEdBQUcsSUFBSSxHQUFHLElBQUksQ0FBQyxFQUFDLENBQUM7WUFDdEMsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQztRQUNsRCxDQUFDO2FBQUksQ0FBQztZQUNKLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxJQUFJLEdBQUcsSUFBSSxHQUFHLElBQUksQ0FBRSxDQUFDLEdBQUcsSUFBSSxDQUFDO1FBQ3pELENBQUM7SUFFSCxDQUFDOytHQWRVLGFBQWE7NkdBQWIsYUFBYTs7NEZBQWIsYUFBYTtrQkFKekIsSUFBSTttQkFBQztvQkFDRixJQUFJLEVBQUUsV0FBVztvQkFDakIsVUFBVSxFQUFFLElBQUk7aUJBQ25CIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgUGlwZSwgUGlwZVRyYW5zZm9ybSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5cclxuQFBpcGUoe1xyXG4gICAgbmFtZTogJ3NpaU1lbW9yeScsXHJcbiAgICBzdGFuZGFsb25lOiB0cnVlXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBTaWlNZW1vcnlQaXBlIGltcGxlbWVudHMgUGlwZVRyYW5zZm9ybSB7XHJcblxyXG4gIHRyYW5zZm9ybSh2YWx1ZTogbnVtYmVyLCAuLi5hcmdzOiB1bmtub3duW10pOiB1bmtub3duIHtcclxuICAgIC8vIHZhbHVlIGluIGJ5dGVcclxuICAgIGlmICggdmFsdWUgPCAxMDI0ICkge1xyXG4gICAgICByZXR1cm4gTWF0aC5jZWlsKHZhbHVlKSArICdCJztcclxuICAgIH1lbHNlIGlmICh2YWx1ZSA8ICgxMDI0ICogMTAyNCkpe1xyXG4gICAgICByZXR1cm4gTWF0aC5jZWlsKHZhbHVlIC8gMTAyNCkgKyAnS0InO1xyXG4gICAgfWVsc2UgaWYgKHZhbHVlIDwgKDEwMjQgKiAxMDI0ICogMTAyNCkpe1xyXG4gICAgICByZXR1cm4gTWF0aC5jZWlsKHZhbHVlIC8gKDEwMjQgKiAxMDI0ICkpICsgJ01CJztcclxuICAgIH1lbHNle1xyXG4gICAgICByZXR1cm4gTWF0aC5jZWlsKHZhbHVlIC8gKDEwMjQgKiAxMDI0ICogMTAyNCApKSArICdHQic7XHJcbiAgICB9XHJcblxyXG4gIH1cclxuXHJcbn1cclxuIl19