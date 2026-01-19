import { BehaviorSubject, Subscription, Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
export class SiiInfiniteScrollDataSource {
    get data() { return this._dataStream; }
    get dataValue() { return this._dataStream.value; }
    get fetchSize() {
        return this.siiListController._fetchSize;
    }
    get listSize() {
        return this._cachedData.length;
    }
    // public fetchRequestService:(page: number, fetchSize: number) => Observable<ISiiPageResponseDTO<any>>,
    constructor(siiListController) {
        this.siiListController = siiListController;
        // private _fetchedPages = new Set<number>();
        this.lastFetchedpage = -1;
        this._cachedData = [];
        this._dataStream = new BehaviorSubject(this._cachedData);
        this._subscription = new Subscription();
        this.performSearch = new Subject();
        this.selectAllFetchedPage = undefined;
        this.utils = {
            lastRequestedPage: undefined,
        };
        this.listChangeSubscriptionFunction = (page, res, reset) => {
            // console.log(`listChangeSubscriptionFunction - ${page}`)
            if (reset) {
                this._cachedData = [];
                this.lastFetchedpage = page;
                // this._fetchedPages.clear();
                // this._fetchedPages.add(page);
            }
            // if(reset || res.count> this._cachedData.length){
            //   this._cachedData.length= res.count
            // }
            this._cachedData.splice(page * this.fetchSize, this.fetchSize, ...res.data);
            this._dataStream.next(this._cachedData);
            this.siiListController.lastFetchRequestInfo = { ...res, data: null };
        };
        this._subscription.add(siiListController.fetchPageData.subscribe((resp) => {
            this.listChangeSubscriptionFunction(resp.page, resp.rows, resp.reset);
            this.checkForSelectAll(resp.page);
        }));
        this._subscription.add(siiListController.selectAllObs.subscribe((resp) => this.selectAllSubscriptionFunction()));
        this._subscription.add(siiListController.refreshObs.subscribe((resp) => this.refreshSubscriptionFunction()));
        this._subscription.add(this.performSearch.pipe(debounceTime(500)).subscribe((resp) => this._fetchPage(this.lastFetchedpage + 1)));
    }
    fetchNextPage() {
        this.performSearch.next();
    }
    // connect(collectionViewer: CollectionViewer): Observable<(object | undefined)[]> {
    //   this._subscription.add(collectionViewer.viewChange.subscribe(range => {
    //     const startPage = this._getPageForIndex(range.start);
    //     const endPage = this._getPageForIndex(range.end - 1);
    //     this.utils.lastRequestedPage= `${startPage}-${endPage}`;
    //     // console.log(`viewChange RANGE: ${range.start} - ${range.end - 1} PAGE: ${startPage} - ${endPage}  `)
    //     setTimeout(()=>{
    //       if(this.utils.lastRequestedPage===`${startPage}-${endPage}`){
    //       const startFetchPage= startPage===0 ? 0:startPage-1
    //       const endFetchPage= this.siiListController.lastFetchRequestInfo?.maxPage===undefined ?
    //        endPage :  Math.min(endPage+1, this.siiListController.lastFetchRequestInfo.maxPage-1);
    //         for ( let i =startFetchPage; i <= endFetchPage;  i++) {
    //           this._fetchPage(i);
    //         }
    //       }
    //     },500);
    //   }));
    //   return this._dataStream;
    // }
    // disconnect(): void {
    //   this._subscription.unsubscribe();
    // }
    // private _getPageForIndex(index: number): number {
    //   return Math.floor(index / this.fetchSize);
    // }
    _fetchPage(page) {
        // if (this._fetchedPages.has(page)) {
        //   return;
        // }
        if (page === 0 || page < this.siiListController.lastFetchRequestInfo.maxPage) {
            this.lastFetchedpage = page;
            // console.log(`_fetchPage ${page}`, this._fetchedPages);
            this.siiListController.doFetchPage.next(page);
        }
        else {
            console.log('NO MORE PAGES');
        }
    }
    refreshSubscriptionFunction() {
        // const pages=[...this._fetchedPages];
        // this._fetchedPages.clear();
        const pages = [];
        this._cachedData.length = 0;
        const lfp = this.lastFetchedpage;
        this.lastFetchedpage = -1;
        for (let i = 0; i <= lfp; i++) {
            pages.push(i);
            this._fetchPage(i);
        }
        // pages.forEach((page)=>{
        //   // console.log(`refresh page ${page}`)
        //   this._fetchPage(page)
        // })
        // dopo che ho caricato tutte le pagine, deseleziono gli elementi che non sono più presenti
        // mi metto quindi in ascolto per intercettare le response di tutte le pagine, e alla fine faccio l'operazione
        const fetchSubsc = this.siiListController.fetchPageData.subscribe((resp) => {
            pages.splice(pages.indexOf(resp.page), 1);
            if (pages.length === 0) {
                fetchSubsc.unsubscribe();
                Promise.resolve().then(() => {
                    this.siiListController.removeMissingSelection(this._cachedData);
                });
            }
        });
    }
    selectAllSubscriptionFunction() {
        const loadedItem = this._cachedData.reduce((acc, i) => {
            acc += i === undefined ? 0 : 1;
            return acc;
        }, 0);
        // se ho tutti gli elementi
        if (loadedItem === this.siiListController.lastFetchRequestInfo.count) {
            this.siiListController.markAsSelected(this._cachedData);
        }
        else {
            this.siiListController.selectAllInProgress = true;
            const newData = Array.from({ length: this.siiListController.api.itemsCount });
            this._cachedData.forEach((cd, index) => newData[index] = cd);
            this._cachedData = newData;
            for (let i = 0; i < this.siiListController.lastFetchRequestInfo.maxPage; i++) {
                if (i > this.lastFetchedpage) {
                    this._fetchPage(i);
                    if (this.selectAllFetchedPage === undefined) {
                        this.selectAllFetchedPage = [];
                    }
                    this.selectAllFetchedPage.push(i);
                }
            }
        }
    }
    checkForSelectAll(page) {
        // console.log(`checkForSelectAll -> ${page}` ,this.selectAllFetchedPage)
        if (this.selectAllFetchedPage !== undefined) {
            this.selectAllFetchedPage.splice(this.selectAllFetchedPage.indexOf(page), 1);
            if (this.selectAllFetchedPage.length === 0) {
                this.selectAllFetchedPage = undefined;
                this.siiListController.markAsSelected(this._cachedData);
                this.siiListController.selectAllInProgress = false;
            }
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2lpLWluZmluaXRlLXNjcm9sbC1kYXRhLXNvdXJjZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL3NpaS10b29sa2l0L3NyYy9saWIvY29tcG9uZW50cy9saXN0L2luZmluaXRlLXNjcm9sbC91dGlscy9zaWktaW5maW5pdGUtc2Nyb2xsLWRhdGEtc291cmNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBLE9BQU8sRUFBYyxlQUFlLEVBQUUsWUFBWSxFQUFFLE9BQU8sRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUcxRSxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFHOUMsTUFBTSxPQUFPLDJCQUEyQjtJQVV0QyxJQUFJLElBQUksS0FBSSxPQUFPLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO0lBQ3RDLElBQUksU0FBUyxLQUFJLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0lBR2pELElBQUksU0FBUztRQUNYLE9BQU8sSUFBSSxDQUFDLGlCQUFpQixDQUFDLFVBQVUsQ0FBQztJQUMzQyxDQUFDO0lBRUQsSUFBSSxRQUFRO1FBQ1YsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQztJQUNqQyxDQUFDO0lBS0Qsd0dBQXdHO0lBQ3hHLFlBQXFCLGlCQUFvQztRQUFwQyxzQkFBaUIsR0FBakIsaUJBQWlCLENBQW1CO1FBeEJ6RCw2Q0FBNkM7UUFDckMsb0JBQWUsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUNyQixnQkFBVyxHQUFHLEVBQUUsQ0FBQztRQUNqQixnQkFBVyxHQUFHLElBQUksZUFBZSxDQUF5QixJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDNUUsa0JBQWEsR0FBRyxJQUFJLFlBQVksRUFBRSxDQUFDO1FBQ25DLGtCQUFhLEdBQUcsSUFBSSxPQUFPLEVBQVEsQ0FBQztRQUM1Qyx5QkFBb0Is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QUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLG9CQUFvQixDQUFDLE9BQU8sRUFBRSxDQUFDLEVBQUUsRUFBQyxDQUFDO2dCQUM1RSxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsZUFBZSxFQUFFLENBQUM7b0JBQzdCLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ25CLElBQUksSUFBSSxDQUFDLG9CQUFvQixLQUFLLFNBQVMsRUFBQyxDQUFDO3dCQUFBLElBQUksQ0FBQyxvQkFBb0IsR0FBRyxFQUFFLENBQUM7b0JBQUMsQ0FBQztvQkFDOUUsSUFBSSxDQUFDLG9CQUFvQixDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDcEMsQ0FBQztZQUNILENBQUM7UUFDSCxDQUFDO0lBRUwsQ0FBQztJQUVELGlCQUFpQixDQUFDLElBQUk7UUFDcEIseUVBQXlFO1FBQ3pFLElBQUksSUFBSSxDQUFDLG9CQUFvQixLQUFLLFNBQVMsRUFBQyxDQUFDO1lBQzNDLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLG9CQUFvQixDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUM3RSxJQUFJLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFDLENBQUM7Z0JBQzFDLElBQUksQ0FBQyxvQkFBb0IsR0FBRyxTQUFTLENBQUM7Z0JBQ3RDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO2dCQUN4RCxJQUFJLENBQUMsaUJBQWlCLENBQUMsbUJBQW1CLEdBQUcsS0FBSyxDQUFDO1lBQ3JELENBQUM7UUFDSCxDQUFDO0lBQ0gsQ0FBQztDQUVGIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29sbGVjdGlvblZpZXdlciwgRGF0YVNvdXJjZSB9IGZyb20gJ0Bhbmd1bGFyL2Nkay9jb2xsZWN0aW9ucyc7XHJcbmltcG9ydCB7IE9ic2VydmFibGUsIEJlaGF2aW9yU3ViamVjdCwgU3Vic2NyaXB0aW9uLCBTdWJqZWN0IH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7IFNpaUxpc3RDb250cm9sbGVyIH0gZnJvbSAnLi4vLi4vLi4vLi4vc2VydmljZS9zaWktbGlzdC1jb250cm9sbGVyLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBJU2lpUGFnZVJlc3BvbnNlRFRPIH0gZnJvbSAnLi4vLi4vLi4vLi4vZHRvL2ktc2lpLXBhZ2UtcmVzcG9uc2UuZHRvJztcclxuaW1wb3J0IHsgZGVib3VuY2VUaW1lIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xyXG5cclxuXHJcbmV4cG9ydCBjbGFzcyBTaWlJbmZpbml0ZVNjcm9sbERhdGFTb3VyY2UgIHtcclxuXHJcbiAgLy8gcHJpdmF0ZSBfZmV0Y2hlZFBhZ2VzID0gbmV3IFNldDxudW1iZXI+KCk7XHJcbiAgcHJpdmF0ZSBsYXN0RmV0Y2hlZHBhZ2UgPSAtMTtcclxuICBwcml2YXRlIF9jYWNoZWREYXRhID0gW107XHJcbiAgcHJpdmF0ZSBfZGF0YVN0cmVhbSA9IG5ldyBCZWhhdmlvclN1YmplY3Q8KG9iamVjdCB8IHVuZGVmaW5lZClbXT4odGhpcy5fY2FjaGVkRGF0YSk7XHJcbiAgcHJpdmF0ZSBfc3Vic2NyaXB0aW9uID0gbmV3IFN1YnNjcmlwdGlvbigpO1xyXG4gIHByaXZhdGUgcGVyZm9ybVNlYXJjaCA9IG5ldyBTdWJqZWN0PHZvaWQ+KCk7XHJcbiAgc2VsZWN0QWxsRmV0Y2hlZFBhZ2U6IEFycmF5PG51bWJlcj4gPSB1bmRlZmluZWQ7XHJcblxyXG4gIGdldCBkYXRhKCl7IHJldHVybiB0aGlzLl9kYXRhU3RyZWFtOyB9XHJcbiAgZ2V0IGRhdGFWYWx1ZSgpeyByZXR1cm4gdGhpcy5fZGF0YVN0cmVhbS52YWx1ZTsgfVxyXG4gIFxyXG5cclxuICBnZXQgZmV0Y2hTaXplKCl7XHJcbiAgICByZXR1cm4gdGhpcy5zaWlMaXN0Q29udHJvbGxlci5fZmV0Y2hTaXplO1xyXG4gIH1cclxuXHJcbiAgZ2V0IGxpc3RTaXplKCl7XHJcbiAgICByZXR1cm4gdGhpcy5fY2FjaGVkRGF0YS5sZW5ndGg7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHV0aWxzID0ge1xyXG4gICAgbGFzdFJlcXVlc3RlZFBhZ2U6IHVuZGVmaW5lZCxcclxuICB9O1xyXG4gIC8vIHB1YmxpYyBmZXRjaFJlcXVlc3RTZXJ2aWNlOihwYWdlOiBudW1iZXIsIGZldGNoU2l6ZTogbnVtYmVyKSA9PiBPYnNlcnZhYmxlPElTaWlQYWdlUmVzcG9uc2VEVE88YW55Pj4sXHJcbiAgY29uc3RydWN0b3IoICBwdWJsaWMgc2lpTGlzdENvbnRyb2xsZXI6IFNpaUxpc3RDb250cm9sbGVyKXtcclxuICAgIHRoaXMuX3N1YnNjcmlwdGlvbi5hZGQoXHJcbiAgICAgIHNpaUxpc3RDb250cm9sbGVyLmZldGNoUGFnZURhdGEuc3Vic2NyaWJlKChyZXNwKSA9PiB7XHJcbiAgICAgICAgdGhpcy5saXN0Q2hhbmdlU3Vic2NyaXB0aW9uRnVuY3Rpb24ocmVzcC5wYWdlLCByZXNwLnJvd3MsIHJlc3AucmVzZXQpO1xyXG4gICAgICAgIHRoaXMuY2hlY2tGb3JTZWxlY3RBbGwocmVzcC5wYWdlKTtcclxuICAgICAgfSlcclxuICAgICk7XHJcblxyXG4gICAgdGhpcy5fc3Vic2NyaXB0aW9uLmFkZChcclxuICAgICAgc2lpTGlzdENvbnRyb2xsZXIuc2VsZWN0QWxsT2JzLnN1YnNjcmliZSgocmVzcCkgPT4gdGhpcy5zZWxlY3RBbGxTdWJzY3JpcHRpb25GdW5jdGlvbigpIClcclxuICAgICk7XHJcblxyXG4gICAgdGhpcy5fc3Vic2NyaXB0aW9uLmFkZChcclxuICAgICAgc2lpTGlzdENvbnRyb2xsZXIucmVmcmVzaE9icy5zdWJzY3JpYmUoKHJlc3ApID0+IHRoaXMucmVmcmVzaFN1YnNjcmlwdGlvbkZ1bmN0aW9uKCkgKVxyXG4gICAgKTtcclxuICAgIHRoaXMuX3N1YnNjcmlwdGlvbi5hZGQoXHJcbiAgICAgdGhpcy5wZXJmb3JtU2VhcmNoLnBpcGUoZGVib3VuY2VUaW1lKDUwMCkpLnN1YnNjcmliZSgocmVzcCkgPT4gdGhpcy5fZmV0Y2hQYWdlKHRoaXMubGFzdEZldGNoZWRwYWdlICsgMSkgKVxyXG4gICAgKTtcclxuXHJcbiAgfVxyXG4gIGZldGNoTmV4dFBhZ2UoKXtcclxuICAgIHRoaXMucGVyZm9ybVNlYXJjaC5uZXh0KCk7XHJcblxyXG4gIH1cclxuXHJcbiAgbGlzdENoYW5nZVN1YnNjcmlwdGlvbkZ1bmN0aW9uID0gKHBhZ2U6IG51bWJlciAsIHJlczogSVNpaVBhZ2VSZXNwb25zZURUTzxhbnk+LCByZXNldDogYm9vbGVhbikgPT4ge1xyXG4gICAgLy8gY29uc29sZS5sb2coYGxpc3RDaGFuZ2VTdWJzY3JpcHRpb25GdW5jdGlvbiAtICR7cGFnZX1gKVxyXG4gICAgaWYgKHJlc2V0KXtcclxuICAgICAgdGhpcy5fY2FjaGVkRGF0YSA9IFtdO1xyXG4gICAgICB0aGlzLmxhc3RGZXRjaGVkcGFnZSA9IHBhZ2U7XHJcbiAgICAgIC8vIHRoaXMuX2ZldGNoZWRQYWdlcy5jbGVhcigpO1xyXG4gICAgICAvLyB0aGlzLl9mZXRjaGVkUGFnZXMuYWRkKHBhZ2UpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIGlmKHJlc2V0IHx8IHJlcy5jb3VudD4gdGhpcy5fY2FjaGVkRGF0YS5sZW5ndGgpe1xyXG4gICAgLy8gICB0aGlzLl9jYWNoZWREYXRhLmxlbmd0aD0gcmVzLmNvdW50XHJcbiAgICAvLyB9XHJcblxyXG4gICAgdGhpcy5fY2FjaGVkRGF0YS5zcGxpY2UocGFnZSAqIHRoaXMuZmV0Y2hTaXplLCB0aGlzLmZldGNoU2l6ZSwgLi4ucmVzLmRhdGEpO1xyXG4gICAgdGhpcy5fZGF0YVN0cmVhbS5uZXh0KHRoaXMuX2NhY2hlZERhdGEpO1xyXG4gICAgdGhpcy5zaWlMaXN0Q29udHJvbGxlci5sYXN0RmV0Y2hSZXF1ZXN0SW5mbyA9IHsuLi5yZXMsIGRhdGE6IG51bGwgfTtcclxuICB9XHJcblxyXG5cclxuXHJcbiAgLy8gY29ubmVjdChjb2xsZWN0aW9uVmlld2VyOiBDb2xsZWN0aW9uVmlld2VyKTogT2JzZXJ2YWJsZTwob2JqZWN0IHwgdW5kZWZpbmVkKVtdPiB7XHJcbiAgLy8gICB0aGlzLl9zdWJzY3JpcHRpb24uYWRkKGNvbGxlY3Rpb25WaWV3ZXIudmlld0NoYW5nZS5zdWJzY3JpYmUocmFuZ2UgPT4ge1xyXG4gIC8vICAgICBjb25zdCBzdGFydFBhZ2UgPSB0aGlzLl9nZXRQYWdlRm9ySW5kZXgocmFuZ2Uuc3RhcnQpO1xyXG4gIC8vICAgICBjb25zdCBlbmRQYWdlID0gdGhpcy5fZ2V0UGFnZUZvckluZGV4KHJhbmdlLmVuZCAtIDEpO1xyXG4gIC8vICAgICB0aGlzLnV0aWxzLmxhc3RSZXF1ZXN0ZWRQYWdlPSBgJHtzdGFydFBhZ2V9LSR7ZW5kUGFnZX1gO1xyXG5cclxuICAvLyAgICAgLy8gY29uc29sZS5sb2coYHZpZXdDaGFuZ2UgUkFOR0U6ICR7cmFuZ2Uuc3RhcnR9IC0gJHtyYW5nZS5lbmQgLSAxfSBQQUdFOiAke3N0YXJ0UGFnZX0gLSAke2VuZFBhZ2V9ICBgKVxyXG5cclxuXHJcbiAgLy8gICAgIHNldFRpbWVvdXQoKCk9PntcclxuICAvLyAgICAgICBpZih0aGlzLnV0aWxzLmxhc3RSZXF1ZXN0ZWRQYWdlPT09YCR7c3RhcnRQYWdlfS0ke2VuZFBhZ2V9YCl7XHJcbiAgLy8gICAgICAgY29uc3Qgc3RhcnRGZXRjaFBhZ2U9IHN0YXJ0UGFnZT09PTAgPyAwOnN0YXJ0UGFnZS0xXHJcbiAgLy8gICAgICAgY29uc3QgZW5kRmV0Y2hQYWdlPSB0aGlzLnNpaUxpc3RDb250cm9sbGVyLmxhc3RGZXRjaFJlcXVlc3RJbmZvPy5tYXhQYWdlPT09dW5kZWZpbmVkID9cclxuICAvLyAgICAgICAgZW5kUGFnZSA6ICBNYXRoLm1pbihlbmRQYWdlKzEsIHRoaXMuc2lpTGlzdENvbnRyb2xsZXIubGFzdEZldGNoUmVxdWVzdEluZm8ubWF4UGFnZS0xKTtcclxuXHJcblxyXG4gIC8vICAgICAgICAgZm9yICggbGV0IGkgPXN0YXJ0RmV0Y2hQYWdlOyBpIDw9IGVuZEZldGNoUGFnZTsgIGkrKykge1xyXG4gIC8vICAgICAgICAgICB0aGlzLl9mZXRjaFBhZ2UoaSk7XHJcbiAgLy8gICAgICAgICB9XHJcbiAgLy8gICAgICAgfVxyXG4gIC8vICAgICB9LDUwMCk7XHJcbiAgLy8gICB9KSk7XHJcbiAgLy8gICByZXR1cm4gdGhpcy5fZGF0YVN0cmVhbTtcclxuICAvLyB9XHJcblxyXG5cclxuICAvLyBkaXNjb25uZWN0KCk6IHZvaWQge1xyXG4gIC8vICAgdGhpcy5fc3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XHJcbiAgLy8gfVxyXG5cclxuICAvLyBwcml2YXRlIF9nZXRQYWdlRm9ySW5kZXgoaW5kZXg6IG51bWJlcik6IG51bWJlciB7XHJcbiAgLy8gICByZXR1cm4gTWF0aC5mbG9vcihpbmRleCAvIHRoaXMuZmV0Y2hTaXplKTtcclxuICAvLyB9XHJcblxyXG4gIHByaXZhdGUgX2ZldGNoUGFnZShwYWdlOiBudW1iZXIpIHtcclxuICAgIC8vIGlmICh0aGlzLl9mZXRjaGVkUGFnZXMuaGFzKHBhZ2UpKSB7XHJcbiAgICAvLyAgIHJldHVybjtcclxuICAgIC8vIH1cclxuICAgIGlmIChwYWdlID09PSAwIHx8IHBhZ2UgPCB0aGlzLnNpaUxpc3RDb250cm9sbGVyLmxhc3RGZXRjaFJlcXVlc3RJbmZvLm1heFBhZ2Upe1xyXG4gICAgICB0aGlzLmxhc3RGZXRjaGVkcGFnZSA9IHBhZ2U7XHJcbiAgICAgIC8vIGNvbnNvbGUubG9nKGBfZmV0Y2hQYWdlICR7cGFnZX1gLCB0aGlzLl9mZXRjaGVkUGFnZXMpO1xyXG4gICAgICB0aGlzLnNpaUxpc3RDb250cm9sbGVyLmRvRmV0Y2hQYWdlLm5leHQocGFnZSk7XHJcbiAgICB9ZWxzZXtcclxuICAgICAgY29uc29sZS5sb2coJ05PIE1PUkUgUEFHRVMnKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJlZnJlc2hTdWJzY3JpcHRpb25GdW5jdGlvbigpe1xyXG5cclxuICAgIC8vIGNvbnN0IHBhZ2VzPVsuLi50aGlzLl9mZXRjaGVkUGFnZXNdO1xyXG4gICAgLy8gdGhpcy5fZmV0Y2hlZFBhZ2VzLmNsZWFyKCk7XHJcbiAgICBjb25zdCBwYWdlcyA9IFtdO1xyXG4gICAgdGhpcy5fY2FjaGVkRGF0YS5sZW5ndGggPSAwO1xyXG4gICAgY29uc3QgbGZwID0gdGhpcy5sYXN0RmV0Y2hlZHBhZ2U7XHJcbiAgICB0aGlzLmxhc3RGZXRjaGVkcGFnZSA9IC0xO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPD0gbGZwOyBpKyspe1xyXG4gICAgICBwYWdlcy5wdXNoKGkpO1xyXG4gICAgICB0aGlzLl9mZXRjaFBhZ2UoaSk7XHJcbiAgICB9XHJcbiAgICAvLyBwYWdlcy5mb3JFYWNoKChwYWdlKT0+e1xyXG4gICAgLy8gICAvLyBjb25zb2xlLmxvZyhgcmVmcmVzaCBwYWdlICR7cGFnZX1gKVxyXG4gICAgLy8gICB0aGlzLl9mZXRjaFBhZ2UocGFnZSlcclxuICAgIC8vIH0pXHJcblxyXG4gICAgLy8gZG9wbyBjaGUgaG8gY2FyaWNhdG8gdHV0dGUgbGUgcGFnaW5lLCBkZXNlbGV6aW9ubyBnbGkgZWxlbWVudGkgY2hlIG5vbiBzb25vIHBpw7kgcHJlc2VudGlcclxuICAgIC8vIG1pIG1ldHRvIHF1aW5kaSBpbiBhc2NvbHRvIHBlciBpbnRlcmNldHRhcmUgbGUgcmVzcG9uc2UgZGkgdHV0dGUgbGUgcGFnaW5lLCBlIGFsbGEgZmluZSBmYWNjaW8gbCdvcGVyYXppb25lXHJcbiAgICBjb25zdCBmZXRjaFN1YnNjID0gdGhpcy5zaWlMaXN0Q29udHJvbGxlci5mZXRjaFBhZ2VEYXRhLnN1YnNjcmliZSgocmVzcCkgPT4ge1xyXG4gICAgICBwYWdlcy5zcGxpY2UocGFnZXMuaW5kZXhPZihyZXNwLnBhZ2UpLCAxKTtcclxuICAgICAgaWYgKHBhZ2VzLmxlbmd0aCA9PT0gMCl7XHJcbiAgICAgICAgZmV0Y2hTdWJzYy51bnN1YnNjcmliZSgpO1xyXG4gICAgICAgIFByb21pc2UucmVzb2x2ZSgpLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgICAgdGhpcy5zaWlMaXN0Q29udHJvbGxlci5yZW1vdmVNaXNzaW5nU2VsZWN0aW9uKHRoaXMuX2NhY2hlZERhdGEpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuXHJcblxyXG4gIH1cclxuXHJcbiAgc2VsZWN0QWxsU3Vic2NyaXB0aW9uRnVuY3Rpb24oKXtcclxuICAgIGNvbnN0IGxvYWRlZEl0ZW0gPSB0aGlzLl9jYWNoZWREYXRhLnJlZHVjZSgoYWNjLCBpKSA9PiB7XHJcbiAgICAgIGFjYyArPSBpID09PSB1bmRlZmluZWQgPyAwIDogMTtcclxuICAgICAgcmV0dXJuIGFjYzsgfSwgMCk7XHJcbiAgICAgIC8vIHNlIGhvIHR1dHRpIGdsaSBlbGVtZW50aVxyXG4gICAgaWYgKGxvYWRlZEl0ZW0gPT09IHRoaXMuc2lpTGlzdENvbnRyb2xsZXIubGFzdEZldGNoUmVxdWVzdEluZm8uY291bnQpe1xyXG4gICAgICAgIHRoaXMuc2lpTGlzdENvbnRyb2xsZXIubWFya0FzU2VsZWN0ZWQodGhpcy5fY2FjaGVkRGF0YSk7XHJcbiAgICAgIH1lbHNle1xyXG4gICAgICAgIHRoaXMuc2lpTGlzdENvbnRyb2xsZXIuc2VsZWN0QWxsSW5Qcm9ncmVzcyA9IHRydWU7XHJcbiAgICAgICAgY29uc3QgbmV3RGF0YSA9IEFycmF5LmZyb208b2JqZWN0Pih7bGVuZ3RoOiB0aGlzLnNpaUxpc3RDb250cm9sbGVyLmFwaS5pdGVtc0NvdW50fSk7XHJcbiAgICAgICAgdGhpcy5fY2FjaGVkRGF0YS5mb3JFYWNoKChjZCwgaW5kZXgpID0+IG5ld0RhdGFbaW5kZXhdID0gY2QpO1xyXG4gICAgICAgIHRoaXMuX2NhY2hlZERhdGEgPSBuZXdEYXRhO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5zaWlMaXN0Q29udHJvbGxlci5sYXN0RmV0Y2hSZXF1ZXN0SW5mby5tYXhQYWdlOyBpKyspe1xyXG4gICAgICAgICAgaWYgKGkgPiB0aGlzLmxhc3RGZXRjaGVkcGFnZSkge1xyXG4gICAgICAgICAgICB0aGlzLl9mZXRjaFBhZ2UoaSk7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnNlbGVjdEFsbEZldGNoZWRQYWdlID09PSB1bmRlZmluZWQpe3RoaXMuc2VsZWN0QWxsRmV0Y2hlZFBhZ2UgPSBbXTsgfVxyXG4gICAgICAgICAgICB0aGlzLnNlbGVjdEFsbEZldGNoZWRQYWdlLnB1c2goaSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gIH1cclxuXHJcbiAgY2hlY2tGb3JTZWxlY3RBbGwocGFnZSl7XHJcbiAgICAvLyBjb25zb2xlLmxvZyhgY2hlY2tGb3JTZWxlY3RBbGwgLT4gJHtwYWdlfWAgLHRoaXMuc2VsZWN0QWxsRmV0Y2hlZFBhZ2UpXHJcbiAgICBpZiAodGhpcy5zZWxlY3RBbGxGZXRjaGVkUGFnZSAhPT0gdW5kZWZpbmVkKXtcclxuICAgICAgdGhpcy5zZWxlY3RBbGxGZXRjaGVkUGFnZS5zcGxpY2UodGhpcy5zZWxlY3RBbGxGZXRjaGVkUGFnZS5pbmRleE9mKHBhZ2UpLCAxKTtcclxuICAgICAgaWYgKHRoaXMuc2VsZWN0QWxsRmV0Y2hlZFBhZ2UubGVuZ3RoID09PSAwKXtcclxuICAgICAgICB0aGlzLnNlbGVjdEFsbEZldGNoZWRQYWdlID0gdW5kZWZpbmVkO1xyXG4gICAgICAgIHRoaXMuc2lpTGlzdENvbnRyb2xsZXIubWFya0FzU2VsZWN0ZWQodGhpcy5fY2FjaGVkRGF0YSk7XHJcbiAgICAgICAgdGhpcy5zaWlMaXN0Q29udHJvbGxlci5zZWxlY3RBbGxJblByb2dyZXNzID0gZmFsc2U7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG59XHJcbiJdfQ==